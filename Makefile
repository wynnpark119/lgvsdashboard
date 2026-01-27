# =============================================================================
# LG VS GEO - LinkedIn Intelligence Makefile
# =============================================================================
# 사용법:
#   make install      - 의존성 설치
#   make init-db      - DB 초기화 + 시드
#   make collect-all  - 전체 수집 (CSE + RSS + Email)
#   make collect-cse  - Google CSE 수집
#   make collect-rss  - RSS 수집
#   make backup       - DB 백업
#   make dashboard    - 대시보드 실행
# =============================================================================

SHELL := /bin/bash
VENV := .venv
PYTHON := $(VENV)/bin/python
GEO := $(VENV)/bin/geo
LOG_DIR := ./logs
BACKUP_DIR := ./backups
DATA_DIR := ./data
DATE := $(shell date +%Y%m%d_%H%M%S)

.PHONY: all install init-db collect-all collect-cse collect-rss collect-email backup dashboard clean help

# 기본 타겟
all: help

# =============================================================================
# 설치
# =============================================================================
install:
	@echo "🔧 가상환경 생성 및 의존성 설치..."
	python3.11 -m venv $(VENV)
	$(VENV)/bin/pip install --upgrade pip
	$(VENV)/bin/pip install -e ".[dev]"
	@echo "✅ 설치 완료"

# =============================================================================
# 데이터베이스
# =============================================================================
init-db:
	@echo "🗄️ 데이터베이스 초기화..."
	@mkdir -p $(DATA_DIR) $(LOG_DIR) $(BACKUP_DIR)
	$(GEO) init-db --seed 2>&1 | tee -a $(LOG_DIR)/init-db.log
	@echo "✅ DB 초기화 완료"

# =============================================================================
# 수집 - 전체
# =============================================================================
collect-all: collect-cse collect-rss collect-email
	@echo "✅ 전체 수집 완료: $(DATE)"

# =============================================================================
# 수집 - Google CSE (5개 쿼리, 각 3페이지)
# =============================================================================
collect-cse:
	@echo "🔍 Google CSE 수집 시작: $(DATE)"
	@mkdir -p $(LOG_DIR)
	@for qid in 1 2 3 4 5; do \
		echo "  쿼리 ID $$qid 수집 중..."; \
		$(GEO) ingest google-cse --query-id $$qid --pages 3 2>&1 | tee -a $(LOG_DIR)/cse_$(DATE).log || true; \
		sleep 2; \
	done
	@echo "✅ CSE 수집 완료"

# =============================================================================
# 수집 - RSS
# =============================================================================
collect-rss:
	@echo "📡 RSS 수집 시작: $(DATE)"
	@mkdir -p $(LOG_DIR)
	@for sid in 1 2 3; do \
		$(GEO) ingest rss --source-id $$sid 2>&1 | tee -a $(LOG_DIR)/rss_$(DATE).log || true; \
	done
	@echo "✅ RSS 수집 완료"

# =============================================================================
# 수집 - Email (.eml)
# =============================================================================
collect-email:
	@echo "📧 Email 수집 시작: $(DATE)"
	@mkdir -p $(LOG_DIR)
	@if [ -d "$(DATA_DIR)/eml" ] && [ "$$(ls -A $(DATA_DIR)/eml 2>/dev/null)" ]; then \
		$(GEO) ingest email --path $(DATA_DIR)/eml --query-id 1 2>&1 | tee -a $(LOG_DIR)/email_$(DATE).log || true; \
	else \
		echo "  ⚠️ $(DATA_DIR)/eml 폴더가 비어있음"; \
	fi
	@echo "✅ Email 수집 완료"

# =============================================================================
# 백업
# =============================================================================
backup:
	@echo "💾 DB 백업 시작: $(DATE)"
	@mkdir -p $(BACKUP_DIR)
	@if [ -f "$(DATA_DIR)/geo.db" ]; then \
		cp $(DATA_DIR)/geo.db $(BACKUP_DIR)/geo_$(DATE).db; \
		echo "✅ 백업 완료: $(BACKUP_DIR)/geo_$(DATE).db"; \
		find $(BACKUP_DIR) -name "*.db" -mtime +30 -delete 2>/dev/null || true; \
		echo "  🗑️ 30일 이상 된 백업 정리 완료"; \
	else \
		echo "  ⚠️ DB 파일 없음: $(DATA_DIR)/geo.db"; \
		exit 1; \
	fi

# =============================================================================
# 대시보드
# =============================================================================
dashboard:
	@echo "🚀 대시보드 시작..."
	$(GEO) dashboard

# =============================================================================
# 정리
# =============================================================================
clean:
	@echo "🧹 캐시 정리..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	@echo "✅ 정리 완료"

clean-logs:
	@echo "🧹 로그 정리..."
	find $(LOG_DIR) -name "*.log" -mtime +7 -delete 2>/dev/null || true
	@echo "✅ 7일 이상 된 로그 삭제 완료"

# =============================================================================
# 도움말
# =============================================================================
help:
	@echo "LG VS GEO - LinkedIn Intelligence"
	@echo ""
	@echo "사용 가능한 명령어:"
	@echo "  make install       - 의존성 설치"
	@echo "  make init-db       - DB 초기화 + 시드 데이터"
	@echo "  make collect-all   - 전체 수집 (CSE + RSS + Email)"
	@echo "  make collect-cse   - Google CSE 수집 (5개 쿼리, 각 3페이지)"
	@echo "  make collect-rss   - RSS 피드 수집"
	@echo "  make collect-email - Email (.eml) 수집"
	@echo "  make backup        - DB 백업"
	@echo "  make dashboard     - Streamlit 대시보드 실행"
	@echo "  make clean         - 캐시 정리"
	@echo "  make clean-logs    - 7일 이상 로그 삭제"
	@echo ""
	@echo "Cron 설정:"
	@echo "  crontab -e 후 아래 추가:"
	@echo "  0 9 * * * cd /path/to/LG_VS && make collect-all >> logs/cron.log 2>&1"
