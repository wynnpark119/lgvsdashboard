# LG VS GEO - LinkedIn Intelligence

LG VS(전장) GEO/AIO LinkedIn 키워드 모니터링 시스템

## 설치

```bash
# 가상환경 생성
python3.11 -m venv .venv
source .venv/bin/activate

# 패키지 설치
pip install -e ".[dev]"

# 또는 make 사용
make install
```

## 환경변수 설정

```bash
cp .env.example .env
# .env 편집하여 API 키 설정
```

## 사용법

### DB 초기화

```bash
geo init-db --seed
geo status
geo queries
```

### 데이터 수집

```bash
# Google CSE (쿼리 ID 1, 3페이지)
geo ingest google-cse --query-id 1 --pages 3

# RSS (소스 ID 기반)
geo ingest rss --source-id 1

# Email (.eml 파일)
geo ingest email --path ./data/eml --query-id 1

# CSV
geo ingest csv --file ./data/csv/links.csv --query-id 1
```

### 대시보드

```bash
geo dashboard
# http://localhost:8501
```

## 자동화

### Makefile

```bash
make help           # 도움말
make install        # 설치
make init-db        # DB 초기화
make collect-all    # 전체 수집
make collect-cse    # CSE 수집
make collect-rss    # RSS 수집
make backup         # DB 백업
make dashboard      # 대시보드
```

### Taskfile (task 설치 필요)

```bash
task install
task init-db
task collect-all
task daily          # 일일 작업 (백업 + 수집)
```

### Cron 설정

```bash
# crontab -e
# 매일 오전 9시 수집
0 9 * * * cd /path/to/LG_VS && ./scripts/daily-collect.sh >> logs/cron.log 2>&1

# 매일 자정 백업
0 0 * * * cd /path/to/LG_VS && ./scripts/backup.sh >> logs/backup.log 2>&1
```

또는 헬퍼 스크립트:

```bash
./scripts/install-cron.sh
```

### macOS launchd

```bash
# plist 파일 편집 후
cp scripts/com.lgvs.geo.daily.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.lgvs.geo.daily.plist
```

## 파일 구조

```
LG_VS/
├── src/linkedin_intel/     # 메인 패키지
│   ├── cli.py              # CLI (geo 명령)
│   ├── config.py           # 설정
│   ├── utils.py            # URL 정규화
│   ├── models/             # SQLAlchemy 모델
│   ├── connectors/         # 수집 커넥터
│   └── dashboard/          # Streamlit
├── scripts/                # 운영 스크립트
├── data/                   # 데이터 파일
├── logs/                   # 로그
├── backups/                # DB 백업
├── Makefile                # Make 명령
├── Taskfile.yml            # Task 명령
└── pyproject.toml          # 프로젝트 설정
```

## 시드 쿼리

| ID | 이름 | 쿼리 |
|----|------|------|
| 1 | ADAS | site:linkedin.com/posts "Advanced Driver Assistance" OR ADAS |
| 2 | SDV | site:linkedin.com/posts "Software Defined Vehicle" OR SDV |
| 3 | IVI | site:linkedin.com/posts "In-Vehicle Infotainment" OR IVI |
| 4 | Digital Cockpit | site:linkedin.com/posts "Digital Cockpit" |
| 5 | Automotive HMI | site:linkedin.com/posts "Automotive HMI" |
