#!/bin/bash
# =============================================================================
# LG VS GEO - DB 백업 스크립트
# =============================================================================
# 사용법: ./scripts/backup.sh
# Cron:   0 0 * * * /path/to/scripts/backup.sh
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

DATA_DIR="$PROJECT_ROOT/data"
BACKUP_DIR="$PROJECT_ROOT/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

if [ -f "$DATA_DIR/geo.db" ]; then
    BACKUP_FILE="$BACKUP_DIR/geo_$DATE.db"
    cp "$DATA_DIR/geo.db" "$BACKUP_FILE"
    echo "✅ 백업 완료: $BACKUP_FILE"
    
    # 파일 크기 표시
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "   크기: $SIZE"
    
    # 30일 이상 된 백업 삭제
    DELETED=$(find "$BACKUP_DIR" -name "*.db" -mtime +30 -delete -print | wc -l)
    if [ "$DELETED" -gt 0 ]; then
        echo "   🗑️ $DELETED개의 오래된 백업 삭제"
    fi
    
    # 현재 백업 개수
    COUNT=$(find "$BACKUP_DIR" -name "*.db" | wc -l)
    echo "   📁 총 백업 개수: $COUNT"
else
    echo "❌ DB 파일 없음: $DATA_DIR/geo.db"
    exit 1
fi
