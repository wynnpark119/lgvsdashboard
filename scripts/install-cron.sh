#!/bin/bash
# =============================================================================
# LG VS GEO - Cron 설치 헬퍼 스크립트
# =============================================================================
# 사용법: ./scripts/install-cron.sh
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🕐 LG VS GEO Cron 설정 도우미"
echo ""
echo "현재 프로젝트 경로: $PROJECT_ROOT"
echo ""
echo "아래 내용을 crontab에 추가하세요:"
echo "  crontab -e"
echo ""
echo "=========================================="
echo "# LG VS GEO - LinkedIn Intelligence"
echo "# 매일 오전 9시 수집 실행"
echo "0 9 * * * cd $PROJECT_ROOT && $PROJECT_ROOT/scripts/daily-collect.sh >> $PROJECT_ROOT/logs/cron.log 2>&1"
echo ""
echo "# 매일 자정 백업"
echo "0 0 * * * cd $PROJECT_ROOT && $PROJECT_ROOT/scripts/backup.sh >> $PROJECT_ROOT/logs/backup.log 2>&1"
echo "=========================================="
echo ""
echo "또는 launchd (macOS)를 사용하려면:"
echo "  scripts/com.lgvs.geo.daily.plist 파일을 참고하세요."
echo ""

# 현재 crontab 표시
echo "현재 crontab 내용:"
crontab -l 2>/dev/null || echo "  (비어있음)"
