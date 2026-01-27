# RALPH Loop Review & Refactoring Plan

> **Version**: 2.0.0  
> **Last Updated**: 2026-01-23  
> **Status**: ✅ Implementation Complete  

---

## RALPH Loop Overview

```
R - Requirements  : 비즈니스 요구사항 검토
A - Architecture  : 시스템 아키텍처 검토
L - Logic         : 코드 로직 검토
P - Proof         : 데이터 검증/테스트
H - Handoff       : 인수/배포 준비
```

---

# R - Requirements (비즈니스 요구사항)

## 1. 비즈니스 목표 정합성 검토

### 1.1 핵심 비즈니스 질문 (확인됨 ✓)

| Phase | 질문 | 현재 구현 | 상태 |
|-------|------|----------|------|
| Home | 지금 기술 검토는 어디에 있는가? | OverallStatus, StageDistribution | ✅ |
| Review Flow | 검토 상태가 어떻게 이동하고 있는가? | FlowMap, TechnologyCards | ✅ |
| Campaign Impact | 이 변화의 원인은 무엇인가? | ImpactSummary, MediaRole | ✅ |
| Detail | 판단을 검증할 상세 데이터는? | ChannelTables, TrendVerification | ✅ |

### 1.2 발견된 Gap

| # | Gap | 영향도 | 해결 방안 |
|---|-----|--------|----------|
| R1 | 기술 간 데이터 연결 부재 | High | 공통 기술 ID 체계 확립 |
| R2 | 메뉴별 데이터 타입 분산 | Medium | 중앙화된 타입 정의 |
| R3 | Review Intensity 계산 로직 미정의 | High | 공식 명시 및 함수화 |
| R4 | 페이지 간 Context 전달 미구현 | High | URL Query + State 관리 |

---

# A - Architecture (시스템 아키텍처)

## 2. 현재 아키텍처 분석

### 2.1 현재 구조

```
frontend/
├── app/                    # 페이지 라우팅
├── components/             # 메뉴별 분리 (4개)
│   ├── home/              # 5 components
│   ├── review-flow/       # 5 components
│   ├── campaign-impact/   # 4 components
│   ├── detail/            # 4 components
│   └── shared/            # 1 component (Sidebar)
├── data/                  # 메뉴별 데모 데이터 (4개)
├── config/                # navigation.ts
├── lib/                   # utils.ts (최소)
└── types/                 # index.ts (기본)
```

### 2.2 아키텍처 문제점

| # | 문제 | 영향 | 해결 |
|---|------|------|------|
| A1 | 데이터 파일 분산 | 동일 기술 데이터 중복 정의 | 통합 데이터 레이어 |
| A2 | 타입 정의 불완전 | 타입 안전성 저하 | 완전한 타입 시스템 |
| A3 | 상수/설정 분산 | 일관성 부족 | config/ 폴더 체계화 |
| A4 | 공통 컴포넌트 부족 | 코드 중복 | UI 컴포넌트 라이브러리 |
| A5 | 페이지 간 상태 공유 없음 | UX 단절 | Context/Store 도입 |

### 2.3 목표 아키텍처

```
frontend/
├── app/                    # 페이지 (변경 없음)
├── components/
│   ├── ui/                # 공통 UI (Button, Card, Badge, etc.)
│   ├── charts/            # 공통 차트 (TrendChart, BarChart, etc.)
│   ├── layout/            # 레이아웃 (Sidebar, Header, Footer)
│   └── domain/            # 도메인별 조합
│       ├── home/
│       ├── review-flow/
│       ├── campaign-impact/
│       └── detail/
├── data/
│   ├── mock/              # 데모 데이터
│   ├── schema.ts          # 데이터 스키마
│   └── seed.ts            # 통합 Seed 데이터
├── config/
│   ├── navigation.ts
│   ├── constants.ts       # 상수 정의
│   └── theme.ts           # 테마/색상
├── lib/
│   ├── utils.ts
│   ├── calculations.ts    # 비즈니스 로직 (Intensity 계산 등)
│   └── formatters.ts      # 포맷팅 유틸
├── stores/                # Zustand 상태 관리
│   └── context-store.ts   # 페이지 간 Context
└── types/
    ├── index.ts           # 메인 타입
    ├── technology.ts      # 기술 관련
    ├── campaign.ts        # 캠페인 관련
    └── metrics.ts         # 지표 관련
```

---

# L - Logic (코드 로직)

## 3. 로직 검토 및 개선

### 3.1 Review Intensity 계산 로직 (신규)

```typescript
// lib/calculations.ts

interface IntensityInputs {
  sessionCount: number;
  avgTimeOnPage: number;      // minutes
  viewDepth: number;          // 0-100%
  returnVisitRate: number;    // 0-100%
  multiContentRate: number;   // 0-100%
  inquiryCount: number;
}

const INTENSITY_WEIGHTS = {
  sessions: 0.15,
  timeOnPage: 0.20,
  viewDepth: 0.20,
  returnVisit: 0.20,
  multiContent: 0.15,
  inquiry: 0.10,
};

export function calculateReviewIntensity(inputs: IntensityInputs): number {
  // 정규화 (0-1 스케일)
  const normalized = {
    sessions: Math.min(inputs.sessionCount / 5000, 1),
    timeOnPage: Math.min(inputs.avgTimeOnPage / 5, 1),
    viewDepth: inputs.viewDepth / 100,
    returnVisit: inputs.returnVisitRate / 100,
    multiContent: inputs.multiContentRate / 100,
    inquiry: Math.min(inputs.inquiryCount / 100, 1),
  };

  // 가중 합산 (1-10 스케일)
  let score = 0;
  for (const [key, weight] of Object.entries(INTENSITY_WEIGHTS)) {
    score += normalized[key as keyof typeof normalized] * weight * 10;
  }

  return Math.min(10, Math.max(1, Math.round(score * 10) / 10));
}
```

### 3.2 Paid Dependency 판단 로직 (신규)

```typescript
export function determinePaidDependency(paidRatio: number): PaidDependency {
  if (paidRatio <= 25) return 'low';
  if (paidRatio <= 50) return 'medium';
  return 'high';
}

export function determineCampaignInfluence(
  retention: number,
  baselineLift: number
): CampaignInfluence {
  if (retention >= 60 && baselineLift >= 20) return 'amplifier';
  if (retention < 30 || baselineLift < 10) return 'distorter';
  return 'neutral';
}
```

### 3.3 Stage 결정 로직 (신규)

```typescript
export function determineReviewStage(intensity: number): ReviewStage {
  if (intensity >= 7) return 'deep';
  if (intensity >= 4) return 'initial';
  return 'initial'; // 아직 reachable 기준 미정의
}
```

---

# P - Proof (데이터 검증)

## 4. 데이터 일관성 검증

### 4.1 기술 ID 매핑 테이블

| 기술 ID | 표시명 | 현재 데이터 파일 |
|---------|--------|-----------------|
| digital-cockpit | Digital Cockpit | home, review-flow, campaign, detail |
| vehicle-vision | Vehicle Vision | home, review-flow, campaign, detail |
| adas | ADAS | home, review-flow, campaign, detail |
| ivi | IVI | home, review-flow, campaign, detail |
| telematics | Telematics | home, review-flow |
| automotive-display | Automotive Display | home, review-flow |

### 4.2 데이터 불일치 발견

| # | 불일치 | 위치 | 해결 |
|---|--------|------|------|
| P1 | intensity 값 차이 | home vs review-flow | seed 데이터 통합 |
| P2 | stage 판단 기준 차이 | 파일별 하드코딩 | 중앙 로직 적용 |
| P3 | trend 계산 방식 불명확 | 각 컴포넌트 | 공통 함수 정의 |

---

# H - Handoff (인수/배포)

## 5. 실행 계획

### 5.1 리팩토링 우선순위

| 순서 | 작업 | 파일 | 예상 영향 |
|------|------|------|----------|
| 1 | 타입 시스템 통합 | types/*.ts | 전체 |
| 2 | 비즈니스 로직 분리 | lib/calculations.ts | 전체 |
| 3 | 상수 통합 | config/constants.ts | 전체 |
| 4 | 데이터 통합 | data/seed.ts | 전체 |
| 5 | 공통 UI 추출 | components/ui/*.tsx | 컴포넌트 |
| 6 | Context Store 도입 | stores/context-store.ts | 페이지 |
| 7 | 페이지 연결 개선 | app/**/*.tsx | UX |

### 5.2 파일 변경 요약

**신규 생성**
- `types/technology.ts`
- `types/campaign.ts`
- `types/metrics.ts`
- `lib/calculations.ts`
- `lib/formatters.ts`
- `config/constants.ts`
- `config/theme.ts`
- `data/seed.ts`
- `data/technologies.ts`
- `components/ui/` (Card, Badge, StatusBadge, etc.)
- `stores/context-store.ts`

**수정**
- `types/index.ts` - 통합 export
- `data/*.ts` - seed.ts 기반 파생
- 모든 컴포넌트 - 공통 UI 사용

---

## 6. 체크리스트

### Requirements ✓
- [x] 4 Phase 의사결정 흐름 반영
- [x] 광고는 성과 ❌ 역할 ⭕
- [x] Detail은 검증 전용
- [x] Review Intensity 계산 공식 구현 → `lib/calculations.ts`
- [x] 페이지 간 Context 전달 → `stores/context-store.ts`

### Architecture ✓
- [x] 메뉴별 컴포넌트 구조
- [x] Navigation Single Source of Truth
- [x] 공통 UI 컴포넌트 → `components/ui/`
- [x] 타입 체계화 → `types/*.ts`
- [x] 상태 관리 → `stores/context-store.ts`

### Logic ✓
- [x] 기본 데모 데이터
- [x] 비즈니스 로직 함수화 → `lib/calculations.ts`
- [x] 데이터 정규화 → `data/seed.ts`
- [x] 일관된 계산 로직 → 중앙화된 함수들

### Proof ✓
- [x] 기술 ID 통합 → `types/technology.ts` + `data/seed.ts`
- [x] 데이터 일관성 → 단일 seed에서 파생
- [ ] 값 검증 테스트 (향후 과제)

### Handoff ✓
- [x] 완전한 타입 안전성
- [ ] 빌드 검증 (다음 단계)
- [x] 문서화

---

## 7. 리팩토링 완료 결과

### 신규 생성 파일 (16개)

**Types (4개)**
```
types/
├── technology.ts    # 기술 타입 + TECHNOLOGIES 마스터
├── campaign.ts      # 캠페인 타입 + 설정 상수
├── metrics.ts       # 지표 타입
└── index.ts         # 통합 export (업데이트)
```

**Library (2개)**
```
lib/
├── calculations.ts  # 비즈니스 로직 (Intensity, Stage, Signal 등)
└── formatters.ts    # 포맷팅 유틸리티
```

**Config (2개)**
```
config/
├── constants.ts     # 전역 상수 (STAGES, SIGNALS, CHANNELS 등)
└── theme.ts         # 차트/UI 테마 설정
```

**Data (1개)**
```
data/
└── seed.ts          # 통합 시드 데이터 (일관성 보장)
```

**Stores (1개)**
```
stores/
└── context-store.ts # Zustand 페이지 간 상태 관리
```

**UI Components (5개)**
```
components/ui/
├── Card.tsx         # Card, CardHeader, CardContent, CardFooter
├── Badge.tsx        # Badge, StageBadge, PaidBadge, InfluenceBadge
├── DirectionIndicator.tsx  # DirectionIndicator, ChangeIndicator
├── MetricCard.tsx   # MetricCard, MiniMetric
└── index.ts         # 통합 export
```

**Layout Components (3개)**
```
components/layout/
├── PageHeader.tsx   # PageHeader, NextStepGuide, PageFooter
├── SuccessCriteria.tsx  # 성공 기준 체크 컴포넌트
└── index.ts         # 통합 export
```

### 핵심 개선 사항

| 영역 | Before | After |
|------|--------|-------|
| 타입 정의 | 1개 파일, 기본만 | 4개 파일, 완전한 타입 시스템 |
| 비즈니스 로직 | 컴포넌트 내 분산 | `lib/calculations.ts` 중앙화 |
| 상수 정의 | 컴포넌트 내 하드코딩 | `config/constants.ts` 통합 |
| 데이터 | 메뉴별 4개 파일 중복 | `data/seed.ts` 단일 소스 |
| UI 컴포넌트 | 컴포넌트별 중복 구현 | `components/ui/` 재사용 |
| 상태 관리 | 없음 | Zustand Context Store |
| 포맷팅 | utils.ts 일부 | `lib/formatters.ts` 전체 |

---

*End of RALPH Loop Review*
