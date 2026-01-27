# LG VS 사업부 대시보드 - 기술 스펙

> Version: 1.0.0  
> Last Updated: 2026-01-23  
> Status: Draft

---

## 1. 개요

### 1.1 목적
LG VS(전장) 사업부의 GEO/AIO 모니터링을 위한 Executive-grade 대시보드 구축

### 1.2 핵심 기능
- LinkedIn 키워드 모니터링 현황 시각화
- 경쟁사/기술 트렌드 분석
- AI 기반 인사이트 생성
- 실시간 알림 및 리포트

### 1.3 사용자
| 역할 | 주요 기능 | 접근 레벨 |
|------|----------|----------|
| 임원 | KPI 대시보드, 주간 리포트 | Read-only |
| 분석가 | 상세 분석, 필터링, 태깅 | Read + Tag |
| 관리자 | 쿼리 관리, 소스 설정, 시스템 설정 | Full Access |

---

## 2. 기술 스택

### 2.1 Frontend

| 구분 | 기술 | 버전 | 용도 |
|------|------|------|------|
| Framework | Next.js | 14+ | App Router, SSR/SSG |
| Language | TypeScript | 5.3+ | Strict mode |
| React | React | 19+ | UI Library |
| Styling | Tailwind CSS | 4+ | Utility-first CSS |
| UI Components | shadcn/ui | latest | Accessible components |
| Charts | Recharts | 3+ | 데이터 시각화 |
| State (Client) | Zustand | 5+ | 전역 상태 관리 |
| State (Server) | TanStack Query | 5+ | 서버 상태, 캐싱 |
| Icons | lucide-react | latest | 아이콘 라이브러리 |
| Form | React Hook Form + Zod | latest | 폼 검증 |

### 2.2 Backend

| 구분 | 기술 | 버전 | 용도 |
|------|------|------|------|
| Framework | FastAPI | 0.109+ | REST API |
| Language | Python | 3.11+ | Backend 로직 |
| ORM | SQLAlchemy | 2.0+ | 데이터베이스 연동 |
| Validation | Pydantic | 2.0+ | 스키마 검증 |
| Auth | JWT (python-jose) | latest | 인증/인가 |
| Task Queue | Celery + Redis | latest | 비동기 작업 (선택) |

### 2.3 Database

| 환경 | 기술 | 용도 |
|------|------|------|
| Development | SQLite | 로컬 개발, 데모 |
| Production | PostgreSQL 15+ | 운영 DB |
| Cache | Redis | 세션, 캐시, 작업 큐 |

### 2.4 Data Pipeline

| 구분 | 기술 | 용도 |
|------|------|------|
| Transform | dbt | 데이터 변환 파이프라인 |
| Orchestration | 기존 Makefile/Cron | 스케줄링 |
| Quality | dbt tests | 데이터 품질 검증 |

### 2.5 ML/AI (Phase 2)

| 구분 | 기술 | 용도 |
|------|------|------|
| Embedding | sentence-transformers (BAAI/bge-m3) | 텍스트 임베딩 |
| Vector DB | ChromaDB / pgvector | 유사도 검색 |
| LLM | OpenAI GPT-4o + Anthropic Claude | 인사이트 생성 |
| Pattern | 2-Step Orchestration | Plan → Execute |

---

## 3. 프로젝트 구조

### 3.1 모노레포 구조

```
LG_VS/
├── frontend/                    # Next.js 대시보드
│   ├── app/                     # App Router
│   │   ├── layout.tsx          # Root layout (Sidebar)
│   │   ├── page.tsx            # Home (/)
│   │   ├── globals.css
│   │   ├── monitoring/         # 모니터링 섹션
│   │   │   ├── page.tsx        # 개요
│   │   │   ├── keywords/       # 키워드별
│   │   │   └── sources/        # 소스별
│   │   ├── analysis/           # 분석 섹션
│   │   │   ├── page.tsx
│   │   │   ├── trends/
│   │   │   └── competitors/
│   │   ├── reports/            # 리포트 섹션
│   │   └── settings/           # 설정
│   ├── components/
│   │   ├── shared/             # 공용 컴포넌트
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── index.ts
│   │   ├── ui/                 # shadcn/ui
│   │   └── charts/             # 차트 컴포넌트
│   │       ├── TrendChart.tsx
│   │       ├── PieChart.tsx
│   │       ├── BarChart.tsx
│   │       └── index.ts
│   ├── config/
│   │   └── navigation.ts       # 메뉴 설정 (SSOT)
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   ├── utils.ts            # 유틸리티
│   │   └── chart-theme.ts      # 차트 테마
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useDashboard.ts
│   ├── stores/
│   │   └── filterStore.ts      # Zustand store
│   ├── types/
│   │   └── index.ts
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                     # FastAPI 백엔드
│   ├── app/
│   │   ├── main.py             # Entry point
│   │   ├── config.py           # 설정
│   │   ├── api/
│   │   │   ├── v1/             # API v1 (기존 호환)
│   │   │   │   ├── __init__.py
│   │   │   │   └── routes.py
│   │   │   └── v2/             # API v2 (신규)
│   │   │       ├── __init__.py
│   │   │       ├── dashboard.py
│   │   │       ├── monitoring.py
│   │   │       ├── analysis.py
│   │   │       └── reports.py
│   │   ├── services/           # Business logic
│   │   │   ├── dashboard.py
│   │   │   ├── monitoring.py
│   │   │   └── analytics.py
│   │   ├── models/             # SQLAlchemy models
│   │   │   └── __init__.py     # 기존 linkedin_intel 재사용
│   │   ├── schemas/            # Pydantic schemas
│   │   │   ├── common.py
│   │   │   ├── dashboard.py
│   │   │   └── monitoring.py
│   │   ├── llm/                # LLM 통합 (Phase 2)
│   │   │   ├── orchestrator.py
│   │   │   ├── prompts.py
│   │   │   └── providers.py
│   │   └── ml/                 # ML 서비스 (Phase 2)
│   │       ├── embeddings.py
│   │       └── similarity.py
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── dbt_project/                 # dbt 파이프라인
│   ├── dbt_project.yml
│   ├── profiles.yml
│   ├── models/
│   │   ├── staging/            # stg_*.sql
│   │   │   ├── stg_items.sql
│   │   │   ├── stg_queries.sql
│   │   │   └── stg_runs.sql
│   │   ├── intermediate/       # int_*.sql
│   │   │   ├── int_daily_counts.sql
│   │   │   └── int_keyword_metrics.sql
│   │   └── marts/              # mart_*.sql
│   │       ├── mart_dashboard_kpi.sql
│   │       ├── mart_trend_analysis.sql
│   │       └── mart_source_breakdown.sql
│   ├── tests/
│   ├── macros/
│   └── seeds/
│
├── src/linkedin_intel/          # 기존 ETL (유지)
│   ├── cli.py
│   ├── connectors/
│   ├── models/
│   └── ...
│
├── scripts/                     # 운영 스크립트
├── data/                        # SQLite DB, CSV
├── logs/                        # 로그
├── backups/                     # 백업
├── docs/                        # 문서
│   ├── TECH_SPEC.md            # 본 문서
│   ├── API_SPEC.md             # API 명세
│   └── DEPLOYMENT.md           # 배포 가이드
│
├── docker-compose.yml           # 로컬 개발 환경
├── Makefile                     # 기존 + 신규 명령
├── Taskfile.yml
├── pyproject.toml
└── README.md
```

### 3.2 Navigation Config (SSOT)

```typescript
// frontend/config/navigation.ts
import { 
  Home, BarChart3, TrendingUp, FileText, 
  Settings, Search, Rss, Mail, Users 
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  badge?: string;
  hidden?: boolean;
}

export interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavSection[] = [
  {
    id: 'home',
    label: '홈',
    icon: Home,
    items: [
      { id: 'dashboard', label: '대시보드', href: '/', description: 'KPI 개요' },
    ],
  },
  {
    id: 'monitoring',
    label: '모니터링',
    icon: Search,
    items: [
      { id: 'overview', label: '수집 현황', href: '/monitoring', description: '전체 현황' },
      { id: 'keywords', label: '키워드별', href: '/monitoring/keywords', description: '쿼리별 현황' },
      { id: 'sources', label: '소스별', href: '/monitoring/sources', description: 'CSE/RSS/Email' },
      { id: 'items', label: '수집 항목', href: '/monitoring/items', description: '전체 목록' },
    ],
  },
  {
    id: 'analysis',
    label: '분석',
    icon: TrendingUp,
    items: [
      { id: 'trends', label: '트렌드', href: '/analysis/trends', description: '키워드 추이' },
      { id: 'competitors', label: '경쟁사', href: '/analysis/competitors', description: '경쟁사 언급' },
      { id: 'topics', label: '토픽', href: '/analysis/topics', description: '주제 분류' },
    ],
  },
  {
    id: 'reports',
    label: '리포트',
    icon: FileText,
    items: [
      { id: 'weekly', label: '주간 리포트', href: '/reports/weekly', description: '자동 생성' },
      { id: 'custom', label: '맞춤 리포트', href: '/reports/custom', description: '직접 생성' },
      { id: 'export', label: '내보내기', href: '/reports/export', description: 'CSV/PDF' },
    ],
  },
  {
    id: 'settings',
    label: '설정',
    icon: Settings,
    items: [
      { id: 'queries', label: '쿼리 관리', href: '/settings/queries', description: '검색 쿼리' },
      { id: 'sources', label: '소스 관리', href: '/settings/sources', description: 'RSS/Email 설정' },
      { id: 'schedule', label: '스케줄', href: '/settings/schedule', description: '수집 일정' },
      { id: 'system', label: '시스템', href: '/settings/system', description: 'API 키, DB' },
    ],
  },
];
```

---

## 4. API 설계

### 4.1 API 버전 관리

| 버전 | 경로 | 용도 |
|------|------|------|
| v1 | `/api/v1/*` | 기존 ETL CLI 호환 |
| v2 | `/api/v2/*` | 신규 대시보드용 |

### 4.2 주요 엔드포인트

```
# Dashboard
GET  /api/v2/dashboard/kpi              # KPI 카드 데이터
GET  /api/v2/dashboard/summary          # 요약 정보

# Monitoring
GET  /api/v2/monitoring/overview        # 수집 현황 개요
GET  /api/v2/monitoring/items           # 수집 항목 목록 (페이지네이션)
GET  /api/v2/monitoring/items/{id}      # 항목 상세
GET  /api/v2/monitoring/runs            # 수집 실행 이력

# Analysis
GET  /api/v2/analysis/trends            # 일별/주별 추이
GET  /api/v2/analysis/breakdown         # 소스/채널 비중
GET  /api/v2/analysis/top-domains       # 상위 도메인

# Reports
GET  /api/v2/reports/weekly             # 주간 리포트 데이터
POST /api/v2/reports/generate           # 리포트 생성
GET  /api/v2/reports/export             # CSV/PDF 내보내기

# Settings
GET  /api/v2/settings/queries           # 쿼리 목록
POST /api/v2/settings/queries           # 쿼리 추가
PUT  /api/v2/settings/queries/{id}      # 쿼리 수정
DELETE /api/v2/settings/queries/{id}    # 쿼리 삭제
```

### 4.3 Response 표준 형식

```json
{
  "status": "success" | "error",
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "timestamp": "2026-01-23T09:00:00Z"
  },
  "error": null | {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query_id"
  }
}
```

### 4.4 필터 파라미터

```
?query_id=1,2,3        # 쿼리 필터 (복수)
?channel=google_cse    # 채널 필터
?from=2026-01-01       # 시작일
?to=2026-01-23         # 종료일
?page=1                # 페이지
&limit=20              # 페이지 크기
&sort=collected_at     # 정렬 필드
&order=desc            # 정렬 방향
```

---

## 5. 데이터 파이프라인 (dbt)

### 5.1 레이어 구조

```
Raw (SQLite)
    ↓
Staging (stg_*)      : 1:1 정제, 타입 변환
    ↓
Intermediate (int_*) : 집계, 조인, 계산
    ↓
Marts (mart_*)       : 대시보드용 최종 테이블
```

### 5.2 주요 Mart 모델

| 모델명 | 용도 | 갱신 주기 |
|--------|------|----------|
| `mart_dashboard_kpi` | KPI 카드 (총건수, 7일 신규 등) | 매시간 |
| `mart_daily_trend` | 일별 수집 추이 | 매일 |
| `mart_source_breakdown` | 소스/채널 비중 | 매일 |
| `mart_keyword_performance` | 키워드별 성과 | 매일 |
| `mart_top_domains` | 상위 도메인 | 매일 |

### 5.3 예시 SQL

```sql
-- marts/mart_dashboard_kpi.sql
{{ config(materialized='table') }}

WITH base AS (
    SELECT * FROM {{ ref('int_daily_counts') }}
),
today AS (
    SELECT 
        SUM(item_count) AS total_items,
        SUM(CASE WHEN collected_date >= CURRENT_DATE - INTERVAL '7 days' 
            THEN item_count ELSE 0 END) AS items_7d
    FROM base
),
pulse_ratio AS (
    SELECT 
        SUM(CASE WHEN path_type = 'pulse' THEN 1 ELSE 0 END) * 100.0 
            / NULLIF(COUNT(*), 0) AS pulse_pct
    FROM {{ ref('stg_items') }}
)
SELECT
    t.total_items,
    t.items_7d,
    p.pulse_pct,
    CURRENT_TIMESTAMP AS updated_at
FROM today t
CROSS JOIN pulse_ratio p
```

---

## 6. UI/UX 설계

### 6.1 레이아웃

```
┌─────────────────────────────────────────────────────────────┐
│ Logo        [Sidebar 256px]      [Main Content Area]        │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────────────────────────────────────────┐ │
│ │ 홈      │ │  Header (Breadcrumb, Actions)               │ │
│ │ ├ 대시보드│ ├─────────────────────────────────────────────┤ │
│ │         │ │                                             │ │
│ │ 모니터링 │ │  KPI Cards (4-col grid)                     │ │
│ │ ├ 현황   │ │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │ │
│ │ ├ 키워드 │ │  │ 123 │ │ 45  │ │ 23% │ │ 5   │          │ │
│ │ ├ 소스   │ │  └─────┘ └─────┘ └─────┘ └─────┘          │ │
│ │ └ 항목   │ │                                             │ │
│ │         │ │  Charts (2-col grid)                        │ │
│ │ 분석    │ │  ┌─────────────┐ ┌─────────────┐            │ │
│ │ ├ 트렌드 │ │  │ Line Chart │ │ Pie Chart  │            │ │
│ │ ├ 경쟁사 │ │  │ (일별 추이) │ │ (소스 비중) │            │ │
│ │ └ 토픽   │ │  └─────────────┘ └─────────────┘            │ │
│ │         │ │                                             │ │
│ │ 리포트  │ │  Data Table                                 │ │
│ │ ├ 주간   │ │  ┌───────────────────────────────────────┐ │ │
│ │ └ 내보내기│ │  │ Title | Channel | Date | URL         │ │ │
│ │         │ │  │ ...                                   │ │ │
│ │ 설정    │ │  └───────────────────────────────────────┘ │ │
│ └─────────┘ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 반응형 Breakpoints

| Breakpoint | 너비 | 레이아웃 |
|------------|------|----------|
| Mobile | < 768px | 햄버거 메뉴, 1-col |
| Tablet | 768-1023px | 햄버거 메뉴, 2-col |
| Desktop | ≥ 1024px | 고정 사이드바, 3-4 col |

### 6.3 컬러 시스템

```typescript
// 차트 컬러
export const CHART_COLORS = {
  primary: '#3b82f6',    // blue-500 (메인)
  secondary: '#10b981',  // green-500 (긍정)
  warning: '#f59e0b',    // amber-500 (주의)
  danger: '#ef4444',     // red-500 (부정)
  neutral: '#6b7280',    // gray-500 (중립)
  
  // 채널별 컬러
  google_cse: '#4285f4', // Google Blue
  rss: '#f26522',        // RSS Orange
  email: '#ea4335',      // Gmail Red
  manual: '#9ca3af',     // Gray
};
```

---

## 7. 보안 및 인증

### 7.1 인증 방식 (Phase 1: 단순)

```
- 로컬 전용 (localhost)
- 환경변수 기반 API 키 (DASHBOARD_API_KEY)
- Basic Auth (선택적)
```

### 7.2 인증 방식 (Phase 2: 확장)

```
- JWT 기반 인증
- Role-Based Access Control (RBAC)
- OAuth 2.0 (선택적)
```

### 7.3 보안 체크리스트

- [ ] CORS 설정 (localhost only in dev)
- [ ] Rate limiting
- [ ] Input validation (Pydantic)
- [ ] SQL injection 방지 (SQLAlchemy ORM)
- [ ] XSS 방지 (React 기본)
- [ ] 환경변수 분리 (.env.local)

---

## 8. 성능 요구사항

### 8.1 응답 시간

| 유형 | 목표 | 최대 |
|------|------|------|
| KPI API | < 100ms | 500ms |
| 목록 API | < 300ms | 1s |
| 차트 데이터 | < 500ms | 2s |
| 리포트 생성 | < 5s | 30s |

### 8.2 캐싱 전략

```
- TanStack Query: staleTime 5분, cacheTime 30분
- Redis (선택): KPI 데이터 1분
- dbt: Incremental materialization
```

### 8.3 페이지네이션

```
- 기본 limit: 20
- 최대 limit: 100
- Cursor-based (선택적)
```

---

## 9. 개발 환경

### 9.1 로컬 실행

```bash
# 1. Backend (FastAPI)
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 2. Frontend (Next.js)
cd frontend
npm install
npm run dev  # http://localhost:3000

# 3. dbt
cd dbt_project
dbt run && dbt test
```

### 9.2 Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./data:/app/data
    environment:
      - DATABASE_PATH=/app/data/geo.db

  # dbt는 CI/CD에서 실행 (선택)
```

### 9.3 환경변수

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

# backend/.env
DATABASE_PATH=./data/geo.db
DASHBOARD_API_KEY=your-api-key
OPENAI_API_KEY=sk-...  # Phase 2
```

---

## 10. 개발 로드맵

### Phase 1: MVP (2주)

| 주차 | 작업 |
|------|------|
| Week 1 | 프로젝트 스캐폴딩, 기본 레이아웃, Navigation |
| Week 1 | FastAPI 기본 API (KPI, Items 목록) |
| Week 2 | 대시보드 홈 (KPI 카드, 기본 차트) |
| Week 2 | 모니터링 > 수집 항목 목록/필터 |

### Phase 2: 분석 기능 (2주)

| 주차 | 작업 |
|------|------|
| Week 3 | dbt 파이프라인 구축, Mart 모델 |
| Week 3 | 트렌드 분석 차트 |
| Week 4 | 소스/채널 분석, 상위 도메인 |
| Week 4 | 설정 페이지 (쿼리/소스 관리) |

### Phase 3: AI 기능 (2주)

| 주차 | 작업 |
|------|------|
| Week 5 | LLM 통합 (2-Step Orchestrator) |
| Week 5 | AI 인사이트 생성 |
| Week 6 | 주간 리포트 자동 생성 |
| Week 6 | 내보내기 (CSV/PDF) |

### Phase 4: 고도화 (지속)

- 실시간 알림 (Slack/Email)
- 경쟁사 분석 대시보드
- 토픽 모델링 (Embedding)
- 사용자 관리/권한

---

## 11. 체크리스트

### 개발 완료 검증

**Navigation**
- [ ] 모든 페이지 사이드바 접근 가능
- [ ] 현재 페이지 active 상태 표시
- [ ] 섹션 자동 확장
- [ ] 모바일 Drawer 동작

**Responsive**
- [ ] Desktop (≥1024px): 고정 사이드바
- [ ] Mobile (<1024px): 햄버거 메뉴
- [ ] 콘텐츠 영역 offset 적용

**API**
- [ ] Swagger 문서 자동 생성 (/docs)
- [ ] Error response 일관성
- [ ] Loading/Error 상태 UI

**Data**
- [ ] dbt 테스트 통과
- [ ] NULL 처리 완료
- [ ] 타임존 일관성 (UTC)

**Performance**
- [ ] Lighthouse 점수 90+
- [ ] Core Web Vitals 통과
- [ ] API 응답 시간 목표 달성

---

## 12. 참고 자료

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [dbt 공식 문서](https://docs.getdbt.com/)
- [Recharts Examples](https://recharts.org/en-US/examples)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

*End of Technical Specification*
