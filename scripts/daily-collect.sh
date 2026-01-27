#!/bin/bash
# =============================================================================
# LG VS GEO - 일일 수집 스크립트
# =============================================================================
# Cron 설정:
#   crontab -e
#   0 9 * * * /path/to/LG_VS/scripts/daily-collect.sh >> /path/to/LG_VS/logs/cron.log 2>&1
# =============================================================================

set -euo pipefail

# 스크립트 위치 기준으로 프로젝트 루트 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# 환경 설정
VENV="$PROJECT_ROOT/.venv"
GEO="$VENV/bin/geo"
LOG_DIR="$PROJECT_ROOT/logs"
BACKUP_DIR="$PROJECT_ROOT/backups"
DATA_DIR="$PROJECT_ROOT/data"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/daily_$DATE.log"

# 디렉토리 생성
mkdir -p "$LOG_DIR" "$BACKUP_DIR"

# 로깅 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error_exit() {
    log "❌ 에러: $1"
    exit 1
}

# =============================================================================
# 시작
# =============================================================================
log "=========================================="
log "일일 수집 시작: $DATE"
log "=========================================="

# 가상환경 확인
if [ ! -f "$GEO" ]; then
    error_exit "geo 명령어를 찾을 수 없습니다. 'make install' 실행 필요"
fi

# 가상환경 활성화
source "$VENV/bin/activate"

# =============================================================================
# 1. 백업
# =============================================================================
log "💾 Step 1: DB 백업"
if [ -f "$DATA_DIR/geo.db" ]; then
    cp "$DATA_DIR/geo.db" "$BACKUP_DIR/geo_$DATE.db"
    log "  백업 완료: $BACKUP_DIR/geo_$DATE.db"
    
    # 30일 이상 된 백업 삭제
    find "$BACKUP_DIR" -name "*.db" -mtime +30 -delete 2>/dev/null || true
    log "  30일 이상 된 백업 정리 완료"
else
    log "  ⚠️ DB 파일 없음, 백업 스킵"
fi

# =============================================================================
# 2. Google CSE 수집
# =============================================================================
log "🔍 Step 2: Google CSE 수집"
CSE_SUCCESS=0
CSE_FAIL=0

for QUERY_ID in 1 2 3 4 5; do
    log "  쿼리 ID $QUERY_ID 수집 중..."
    if $GEO ingest google-cse --query-id "$QUERY_ID" --pages 3 >> "$LOG_FILE" 2>&1; then
        ((CSE_SUCCESS++))
    else
        ((CSE_FAIL++))
        log "  ⚠️ 쿼리 ID $QUERY_ID 수집 실패"
    fi
    sleep 2  # Rate limit 대응
done

log "  CSE 완료: 성공 $CSE_SUCCESS, 실패 $CSE_FAIL"

# =============================================================================
# 3. RSS 수집
# =============================================================================
log "📡 Step 3: RSS 수집"
RSS_SUCCESS=0
RSS_FAIL=0

for SOURCE_ID in 1 2 3; do
    if $GEO ingest rss --source-id "$SOURCE_ID" >> "$LOG_FILE" 2>&1; then
        ((RSS_SUCCESS++))
    else
        ((RSS_FAIL++))
    fi
done

log "  RSS 완료: 성공 $RSS_SUCCESS, 실패 $RSS_FAIL"

# =============================================================================
# 4. Email 수집
# =============================================================================
log "📧 Step 4: Email 수집"
if [ -d "$DATA_DIR/eml" ] && [ "$(ls -A "$DATA_DIR/eml" 2>/dev/null)" ]; then
    if $GEO ingest email --path "$DATA_DIR/eml" --query-id 1 >> "$LOG_FILE" 2>&1; then
        log "  Email 수집 완료"
    else
        log "  ⚠️ Email 수집 실패"
    fi
else
    log "  ⚠️ $DATA_DIR/eml 폴더가 비어있음, 스킵"
fi

# =============================================================================
# 5. 로그 정리
# =============================================================================
log "🧹 Step 5: 로그 정리"
find "$LOG_DIR" -name "*.log" -mtime +7 -delete 2>/dev/null || true
log "  7일 이상 된 로그 삭제 완료"

# =============================================================================
# 완료
# =============================================================================
log "=========================================="
log "일일 수집 완료: $(date '+%Y-%m-%d %H:%M:%S')"
log "  CSE: 성공 $CSE_SUCCESS, 실패 $CSE_FAIL"
log "  RSS: 성공 $RSS_SUCCESS, 실패 $RSS_FAIL"
log "=========================================="

# 실패가 있으면 종료 코드 1
if [ $CSE_FAIL -gt 0 ] || [ $RSS_FAIL -gt 0 ]; then
    exit 1
fi

exit 0
