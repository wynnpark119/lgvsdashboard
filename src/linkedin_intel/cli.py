"""GEO CLI - LinkedIn Intelligence."""
import logging
import subprocess
import sys
from pathlib import Path
import typer
from rich.console import Console
from rich.table import Table

app = typer.Typer(name="geo", help="LG VS GEO - LinkedIn Intelligence CLI", add_completion=False)
ingest_app = typer.Typer(help="데이터 수집")
app.add_typer(ingest_app, name="ingest")
console = Console()


def setup_logging(verbose: bool = False):
    from linkedin_intel.config import settings
    level = logging.DEBUG if verbose else getattr(logging, settings.log_level)
    logging.basicConfig(level=level, format="%(asctime)s - %(levelname)s - %(message)s", handlers=[logging.StreamHandler(sys.stdout)])


@app.command("init-db")
def init_db(seed: bool = typer.Option(False, "--seed", "-s"), force: bool = typer.Option(False, "--force", "-f")):
    """DB 초기화."""
    from linkedin_intel.models import init_db as do_init, seed_data, get_db_path
    if force:
        db = get_db_path()
        if db.exists():
            db.unlink()
            console.print(f"[yellow]기존 DB 삭제: {db}[/]")
    do_init(force=force)
    console.print(f"[green]✓ DB 초기화 완료: {get_db_path()}[/]")
    if seed:
        seed_data()
        console.print("[green]✓ 시드 데이터 추가 (5개 쿼리, 5개 태그)[/]")


@app.command("status")
def status():
    """DB 상태 확인."""
    from linkedin_intel.models import get_db_path, get_session, Query, Source, Item, Run, Tag
    db = get_db_path()
    if not db.exists():
        console.print("[red]✗ DB 없음. 'geo init-db' 실행 필요[/]")
        raise typer.Exit(1)
    with get_session() as s:
        table = Table(title=f"DB 상태: {db}")
        table.add_column("항목", style="cyan")
        table.add_column("개수", style="green", justify="right")
        table.add_row("Queries", str(s.query(Query).count()))
        table.add_row("Sources", str(s.query(Source).count()))
        table.add_row("Items", str(s.query(Item).count()))
        table.add_row("Runs", str(s.query(Run).count()))
        table.add_row("Tags", str(s.query(Tag).count()))
        console.print(table)


@app.command("queries")
def list_queries():
    """쿼리 목록."""
    from linkedin_intel.models import init_db, get_session, Query
    init_db()
    with get_session() as s:
        queries = s.query(Query).order_by(Query.id).all()
        if not queries:
            console.print("[yellow]쿼리 없음. 'geo init-db --seed' 실행[/]")
            return
        table = Table(title="쿼리 목록")
        table.add_column("ID", style="cyan", justify="right")
        table.add_column("이름", style="green")
        table.add_column("쿼리", style="blue")
        for q in queries:
            table.add_row(str(q.id), q.name, q.query_string[:50] + "..." if len(q.query_string) > 50 else q.query_string)
        console.print(table)


@ingest_app.command("google-cse")
def ingest_cse(query_id: int = typer.Option(..., "--query-id", "-q"), pages: int = typer.Option(1, "--pages", "-p"), verbose: bool = typer.Option(False, "--verbose", "-v")):
    """Google CSE 수집."""
    setup_logging(verbose)
    from linkedin_intel.config import settings
    from linkedin_intel.connectors.google_cse import GoogleCSEConnector
    from linkedin_intel.models import init_db, get_session, Query
    init_db()
    if not settings.has_cse_credentials():
        console.print("[red]✗ CSE 자격증명 미설정[/]")
        raise typer.Exit(1)
    with get_session() as s:
        q = s.query(Query).filter(Query.id == query_id).first()
        if not q:
            console.print(f"[red]✗ 쿼리 ID {query_id} 없음[/]")
            raise typer.Exit(1)
        query_string = q.query_string
        console.print(f"[blue]🔍 CSE 수집: '{q.name}' ({pages}페이지)[/]")
    connector = GoogleCSEConnector(query_id=query_id)
    result = connector.ingest(query_string=query_string, pages=pages)
    console.print(f"[green]✓ 완료: 총 {result.total_fetched}, 신규 {result.new_items}, 중복 {result.duplicates}[/]")
    if result.errors:
        console.print(f"[yellow]  에러: {result.errors}[/]")


@ingest_app.command("rss")
def ingest_rss(source_id: int = typer.Option(..., "--source-id", "-s"), query_id: int = typer.Option(None, "--query-id", "-q"), verbose: bool = typer.Option(False, "--verbose", "-v")):
    """RSS 수집."""
    setup_logging(verbose)
    from linkedin_intel.connectors.rss import RSSConnector
    from linkedin_intel.models import init_db
    init_db()
    console.print(f"[blue]📡 RSS 수집: source_id={source_id}[/]")
    connector = RSSConnector(query_id=query_id, source_id=source_id)
    result = connector.ingest()
    console.print(f"[green]✓ 완료: 총 {result.total_fetched}, 신규 {result.new_items}, 중복 {result.duplicates}[/]")


@ingest_app.command("email")
def ingest_email(path: str = typer.Option("./data/eml", "--path", "-p"), query_id: int = typer.Option(..., "--query-id", "-q"), verbose: bool = typer.Option(False, "--verbose", "-v")):
    """Email (.eml) 수집."""
    setup_logging(verbose)
    from linkedin_intel.connectors.email_import import EmailConnector
    from linkedin_intel.models import init_db
    init_db()
    eml_path = Path(path)
    if not eml_path.exists():
        console.print(f"[red]✗ 경로 없음: {path}[/]")
        raise typer.Exit(1)
    console.print(f"[blue]📧 Email 수집: {path}[/]")
    connector = EmailConnector(query_id=query_id)
    result = connector.ingest(eml_path=eml_path)
    console.print(f"[green]✓ 완료: 총 {result.total_fetched}, 신규 {result.new_items}, 중복 {result.duplicates}[/]")


@ingest_app.command("csv")
def ingest_csv(file: str = typer.Option(..., "--file", "-f"), query_id: int = typer.Option(..., "--query-id", "-q"), verbose: bool = typer.Option(False, "--verbose", "-v")):
    """CSV 임포트."""
    setup_logging(verbose)
    from linkedin_intel.connectors.csv_import import CSVConnector
    from linkedin_intel.models import init_db
    init_db()
    csv_path = Path(file)
    if not csv_path.exists():
        console.print(f"[red]✗ 파일 없음: {file}[/]")
        raise typer.Exit(1)
    console.print(f"[blue]📄 CSV 임포트: {file}[/]")
    connector = CSVConnector(query_id=query_id)
    result = connector.ingest(csv_path=csv_path)
    console.print(f"[green]✓ 완료: 총 {result.total_fetched}, 신규 {result.new_items}, 중복 {result.duplicates}[/]")


@app.command("dashboard")
def dashboard(port: int = typer.Option(None, "--port", "-p")):
    """Streamlit 대시보드."""
    from linkedin_intel.config import settings
    port = port or settings.streamlit_port
    dashboard_path = Path(__file__).parent / "dashboard" / "app.py"
    if not dashboard_path.exists():
        console.print(f"[red]✗ 대시보드 파일 없음[/]")
        raise typer.Exit(1)
    console.print(f"[blue]🚀 대시보드: http://localhost:{port}[/]")
    # 가상환경에서 geo를 직접 실행할 때 PATH에 .venv/bin 이 없을 수 있어
    # 'streamlit' 실행 파일을 못 찾는 경우가 있다. 동일 파이썬 인터프리터로
    # 모듈 실행하면 환경에 상관없이 안정적으로 동작한다.
    subprocess.run(
        [
            sys.executable,
            "-m",
            "streamlit",
            "run",
            str(dashboard_path),
            "--server.port",
            str(port),
            "--server.headless",
            "true",
        ]
    )


@app.command("version")
def version():
    from linkedin_intel import __version__
    console.print(f"GEO v{__version__}")


if __name__ == "__main__":
    app()
