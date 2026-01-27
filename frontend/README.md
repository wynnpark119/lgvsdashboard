# LG VS MTK Dashboard

LG Electronics Vehicle Solution - 기술 검토 상태 중심 대시보드

## 핵심 컨셉

```
Home은
  - Organic / Paid / Channel을 비교하는 곳 ❌
  - 기술 검토 상태를 하나의 흐름으로 읽는 곳 ⭕
```

## 설치 및 실행

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# http://localhost:3000 접속
```

## 프로젝트 구조

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout + Sidebar
│   ├── page.tsx             # Home Dashboard
│   ├── initial-review/      # 초기 기술 검토
│   ├── deep-review/         # 심화 기술 검토
│   ├── campaign/            # 캠페인 분석
│   └── auxiliary/           # 보조 분석
├── components/
│   ├── shared/              # 공용 컴포넌트 (Sidebar)
│   └── home/                # Home 전용 컴포넌트
│       ├── OverallStatusCard.tsx
│       ├── StageDistributionChart.tsx
│       ├── TechnologySignalTable.tsx
│       ├── MomentumTrendChart.tsx
│       └── CampaignInfluenceCard.tsx
├── config/
│   └── navigation.ts        # 메뉴 설정 (SSOT)
├── data/
│   └── home-data.ts         # 데모 데이터
├── lib/
│   └── utils.ts             # 유틸리티
└── types/
    └── index.ts             # 타입 정의
```

## Home Dashboard 구조

| 영역 | 컴포넌트 | 목적 |
|------|----------|------|
| A | OverallStatusCard | 검토 상태 요약 |
| B | StageDistributionChart | 단계별 Organic/Paid 분포 |
| C | TechnologySignalTable | 기술별 검토 신호 |
| D | MomentumTrendChart | 검토 강도 추이 + 캠페인 구간 |
| E | CampaignInfluenceCard | 캠페인 영향 분류 |

## 광고의 위치

**광고는 Home의 "판단 보정값"이다.**

- 독립 KPI나 영역으로 분리 ❌
- 모든 판단 요소에 같은 비중으로 스며듦 ⭕
- Organic/Paid 구분은 데이터 출처일 뿐, 해석 축이 아님

## 기술 스택

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- lucide-react

## 스펙 문서

- [HOME_DASHBOARD_SPEC.md](../docs/HOME_DASHBOARD_SPEC.md) - Home 상세 스펙
- [DASHBOARD_SPEC.md](../docs/DASHBOARD_SPEC.md) - 전체 대시보드 스펙
- [TECH_SPEC.md](../docs/TECH_SPEC.md) - 기술 스펙
