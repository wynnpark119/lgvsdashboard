"""Streamlit 대시보드."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

import pandas as pd
import plotly.express as px
import streamlit as st
from linkedin_intel.models import get_session, get_db_path, init_db, Query, Item, Run

st.set_page_config(page_title="LG VS GEO Monitor", page_icon="🔍", layout="wide")

db_path = get_db_path()
if not db_path.exists():
    st.error("DB 없음. 'geo init-db --seed' 실행 필요")
    st.stop()
init_db()

st.sidebar.title("🔍 LG VS GEO")
st.sidebar.markdown("---")

with get_session() as session:
    queries = session.query(Query).all()
    query_options = {q.name: q.id for q in queries}

selected_query = st.sidebar.selectbox("쿼리", ["전체"] + list(query_options.keys()))
query_id = query_options.get(selected_query) if selected_query != "전체" else None

channels = ["전체", "google_cse", "rss", "email", "manual"]
selected_channel = st.sidebar.selectbox("채널", channels)
channel = selected_channel if selected_channel != "전체" else None

st.title("📊 LinkedIn 키워드 모니터링")

with get_session() as session:
    q = session.query(Item)
    if query_id:
        q = q.filter(Item.query_id == query_id)
    if channel:
        q = q.filter(Item.channel == channel)
    total = q.count()

col1, col2, col3, col4 = st.columns(4)
col1.metric("총 수집 건수", f"{total:,}")

with get_session() as session:
    from datetime import datetime, timedelta
    week_ago = datetime.utcnow() - timedelta(days=7)
    q = session.query(Item).filter(Item.collected_at >= week_ago)
    if query_id:
        q = q.filter(Item.query_id == query_id)
    col2.metric("7일 신규", f"{q.count():,}")

with get_session() as session:
    runs = session.query(Run).order_by(Run.started_at.desc()).limit(1).first()
    col3.metric("마지막 수집", runs.started_at.strftime("%m-%d %H:%M") if runs else "-")

col4.metric("쿼리 수", str(len(query_options)))

st.markdown("---")

with get_session() as session:
    items = session.query(Item)
    if query_id:
        items = items.filter(Item.query_id == query_id)
    if channel:
        items = items.filter(Item.channel == channel)
    items = items.order_by(Item.collected_at.desc()).limit(100).all()

if items:
    data = [{"제목": i.title or "-", "채널": i.channel, "수집일": i.collected_at.strftime("%Y-%m-%d %H:%M"), "URL": i.url} for i in items]
    df = pd.DataFrame(data)
    st.dataframe(df, use_container_width=True, height=400, column_config={"URL": st.column_config.LinkColumn("URL")})
else:
    st.info("데이터 없음")

if st.sidebar.button("🔄 새로고침"):
    st.rerun()
