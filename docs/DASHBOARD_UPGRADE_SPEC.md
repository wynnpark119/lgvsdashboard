# LG VS MTK Dashboard 업그레이드 스펙

## 1. 업그레이드 개요

### 1.1 목적
- B2B 마케팅 퍼널(TOFU/MOFU/BOFU) 개념 통합
- MQL(Marketing Qualified Lead) 지표 추가
- 심심한 페이지들 시각화 강화

### 1.2 핵심 원칙
- 기존 구조 최대한 유지
- 용어 병기 방식 (기존 + 퍼널)
- 점진적 개선

### 1.3 쉬운 설명 가이드 (Insight Hint)

#### 목적
복잡한 분석 카드/차트에 **한 줄 해석**을 추가하여 비전문가도 이해할 수 있게 함.
지저분하지 않게 깔끔한 방식으로 제공.

#### 적용 방식

**방식 1: 카드 하단 한 줄 해석 (기본)**
```
┌────────────────────────────────┐
│ 전체 검토 현황                  │
│ ┌──────┐ ┌──────┐ ┌──────┐    │
│ │12,847│→│2,156 │→│ 479  │    │
│ │TOFU  │ │MOFU  │ │BOFU  │    │
│ └──────┘ └──────┘ └──────┘    │
├────────────────────────────────┤
│ 💡 쉽게 말하면:                 │
│ "처음 본 사람 중 16%가 관심을   │
│  보이고, 그 중 22%가 연락 가능" │
└────────────────────────────────┘
```

**방식 2: 인라인 힌트 (간결)**
```
전환율: 16.8% → 22.2%
      ↳ 평균보다 높음 ✓
```

**방식 3: 호버 툴팁 (공간 절약)**
```
[?] 아이콘에 마우스 올리면 설명 표시
"MOFU 전환율 16.8%란?
 100명 중 약 17명이 제품을 진지하게 검토한다는 뜻"
```

**방식 4: 접이식 설명 (상세 필요 시)**
```
[▼ 이 차트 이해하기]
 └ 펼치면 2-3줄 설명 표시
```

#### 설명 작성 원칙

1. **비유 사용**: 숫자보다 비유로 설명
   - ❌ "전환율 16.8%"
   - ✅ "100명 중 17명이 관심"

2. **결론 먼저**: "좋다/나쁘다/주의" 판단 제공
   - ❌ "전환율이 16.8%입니다"
   - ✅ "✅ 양호 - 업계 평균(12%)보다 높음"

3. **액션 힌트**: 다음에 뭘 해야 하는지
   - ❌ "MQL 스코어가 72입니다"
   - ✅ "영업팀 전달 가능 수준"

4. **짧게**: 1-2문장 이내
   - 최대 50자 권장

#### 컴포넌트: InsightHint.tsx

```typescript
interface InsightHintProps {
  type: 'inline' | 'footer' | 'tooltip' | 'collapsible';
  status?: 'good' | 'warning' | 'bad' | 'neutral';
  message: string;
  detail?: string;  // 추가 설명 (접이식/툴팁용)
}

// 사용 예시
<InsightHint 
  type="footer"
  status="good"
  message="쉽게 말하면: 관심 있는 고객이 꾸준히 늘고 있음"
/>
```

#### 페이지별 적용 예시

| 영역 | 현재 | 쉬운 설명 추가 |
|-----|-----|--------------|
| 전체 검토 현황 | 숫자만 표시 | "100명 중 17명이 진지하게 검토 중" |
| 검토 단계별 분포 | 차트만 표시 | "✅ 심화 단계가 늘고 있어 좋은 신호" |
| 핵심 기술 신호 | 테이블 | "🔥 Digital Cockpit: 지금 영업 접촉해도 됨" |
| 캠페인 영향 | 복잡한 분석 | "💡 CES 덕분에 관심 고객이 2배 늘었음" |
| 퍼널 전환율 | 16.8% / 22.2% | "평균보다 높음 ✓ 마케팅 잘 되고 있음" |
| MQL 스코어 | 72점 | "영업팀에 넘겨도 되는 수준" |
| Paid 의존도 | High | "⚠️ 광고 끄면 관심 급락 예상" |

#### 스타일 가이드

```css
/* 쉬운 설명 영역 */
.insight-hint {
  background: #f8fafc;      /* 연한 회색 배경 */
  border-top: 1px dashed #e2e8f0;
  padding: 12px 16px;
  font-size: 13px;
  color: #64748b;
}

.insight-hint.good { border-left: 3px solid #22c55e; }
.insight-hint.warning { border-left: 3px solid #f59e0b; }
.insight-hint.bad { border-left: 3px solid #ef4444; }
```

---

## 2. B2B 퍼널 매핑

### 2.1 용어 매핑

| 현재 | 퍼널 | 설명 |
|-----|------|-----|
| Initial Review | TOFU (Top of Funnel) | 인지/초기 접촉 |
| Deep Review | MOFU (Middle of Funnel) | 탐색/비교/평가 |
| Reachable | BOFU (Bottom of Funnel) | MQL Ready, 전환 가능 |

### 2.2 MQL 정의
Deep Review에서 다음 조건 충족 시 MQL로 분류:
- 재방문 2회 이상 OR
- 웨비나/Inquiry 신청 OR
- 콘텐츠 3개 이상 소비

### 2.3 핵심 전환율
- **TOFU → MOFU**: Initial → Deep 전환율
- **MOFU → BOFU (MQL)**: Deep → Reachable 전환율

---

## 3. 페이지별 업그레이드 상세

### 3.1 Home (/) - 상태
**현재 상태**: 기본 구조 완료

**업그레이드 항목**:

| 영역 | 현재 | 변경 |
|-----|-----|-----|
| 검토 단계별 분포 | 가로 막대 차트 | **퍼널 시각화** (삼각형 형태) |
| 전체 검토 현황 | 3단계 카드 | 용어 병기 + **전환율 표시** |
| 핵심 기술 신호 | 테이블 | **MQL 스코어 컬럼** 추가 |
| 추가 | - | **MQL 요약 카드** (BOFU 강조) |

**새 컴포넌트**:
```
FunnelVisualization.tsx
├── TOFU 영역 (Initial Review)
├── MOFU 영역 (Deep Review)  
├── BOFU 영역 (MQL Ready)
└── 각 단계별 전환율 표시
```

---

### 3.2 Review Flow (/review-flow) - 변화
**현재 상태**: 기본 구조 완료

**업그레이드 항목**:

| 영역 | 현재 | 변경 |
|-----|-----|-----|
| 기술 검토 흐름도 | X-Y 맵 | 용어 병기 (TOFU/MOFU/BOFU) |
| 단계별 신호 요약 | 2단계 | **3단계** (TOFU/MOFU/BOFU) |
| 기술별 검토 카드 | 기본 | **MQL 전환 가능성** 표시 추가 |
| 흐름 추세 | 라인 차트 | **퍼널 전환율 트렌드** 추가 |

---

### 3.3 Review Flow - 기술별 (/review-flow/technology) ⚠️ 개선 필요
**현재 상태**: 단순 테이블

**업그레이드 항목**:
- [ ] PageHeader 적용 (일관된 헤더)
- [ ] 미니 퍼널 차트 (기술별)
- [ ] 전환율 시각화 (TOFU→MOFU→BOFU)
- [ ] MQL 전환 예측 점수
- [ ] 액션 힌트 추가

**새 레이아웃**:
```
┌─────────────────────────────────────────────┐
│ [Header] 기술별 퍼널 분석                    │
├─────────────────────────────────────────────┤
│ [Summary] 전체 기술 퍼널 요약 (4개 카드)      │
├────────────────────┬────────────────────────┤
│ [기술 리스트]       │ [선택 기술 상세]        │
│ - 미니 퍼널        │ - 퍼널 차트            │
│ - 전환율           │ - 트렌드 차트          │
│ - MQL 점수         │ - 캠페인 영향          │
└────────────────────┴────────────────────────┘
```

---

### 3.4 Review Flow - 모멘텀 (/review-flow/momentum)
**현재 상태**: 기본 구조 완료

**업그레이드 항목**:
- [ ] 퍼널 단계별 모멘텀 분리 표시
- [ ] MQL 생성 속도 지표 추가

---

### 3.5 Campaign Impact (/campaign-impact) - 원인
**현재 상태**: 기본 구조 완료

**업그레이드 항목**:

| 영역 | 현재 | 변경 |
|-----|-----|-----|
| 영향 요약 | 캠페인 리스트 | **퍼널 영향 표시** (어느 단계에 기여) |
| 캠페인-흐름 연결 | 타임라인 | **퍼널 전환 가속 효과** 표시 |
| 미디어 역할 해석 | 역할 분류 | **퍼널 단계별 역할** 명시 |

**새 라벨**:
- "TOFU 유입 증가" / "MOFU 전환 가속" / "MQL 생성 기여"

---

### 3.6 Campaign Impact - Paid (/campaign-impact/paid) ⚠️ 개선 필요
**현재 상태**: 단순 리스트

**업그레이드 항목**:
- [ ] PageHeader 적용
- [ ] 차트 추가 (Organic vs Paid 비율)
- [ ] 퍼널 단계별 Paid 의존도 시각화
- [ ] 캠페인별 ROI 대신 **퍼널 기여도** 표시
- [ ] 광고 종료 시 예상 영향 시뮬레이션

**새 레이아웃**:
```
┌─────────────────────────────────────────────┐
│ [Header] Paid Media 퍼널 영향 분석           │
├─────────────────────────────────────────────┤
│ [Summary] Paid 의존도 요약 (3개 카드)         │
├────────────────────┬────────────────────────┤
│ [퍼널 단계별       │ [기술별 Paid 의존도]    │
│  Paid 비율 차트]   │ - 바 차트              │
└────────────────────┴────────────────────────┘
│ [기술별 상세 카드 - 확장된 버전]              │
└─────────────────────────────────────────────┘
```

---

### 3.7 Campaign Impact - Content (/campaign-impact/content)
**현재 상태**: 기본 구조 완료

**업그레이드 항목**:
- [ ] 콘텐츠 유형별 **퍼널 기여도** 분석 추가
- [ ] 웨비나/백서 → MQL 전환율 강조

---

### 3.8 Detail - Technology (/detail/technology) - 검증
**현재 상태**: 기본 구조 완료

**업그레이드 항목**:
- [ ] 퍼널 단계 컨텍스트 표시
- [ ] MQL 판정 근거 데이터 섹션 추가

---

### 3.9 Detail - Channel (/detail/channel) ⚠️ 개선 필요
**현재 상태**: 단순 카드 3개

**업그레이드 항목**:
- [ ] PageHeader 적용
- [ ] 채널별 퍼널 기여도 시각화
- [ ] 채널 간 비교 차트 추가
- [ ] 트렌드 차트 추가 (시계열)
- [ ] 채널 → 퍼널 단계 매핑

**새 레이아웃**:
```
┌─────────────────────────────────────────────┐
│ [Header] 채널별 상세 분석                    │
├─────────────────────────────────────────────┤
│ [Summary] 채널 성과 요약 (4개 카드)           │
├─────────────────────────────────────────────┤
│ [채널별 퍼널 기여도 차트]                    │
│ - LG.com: TOFU 42% / MOFU 35% / BOFU 23%   │
│ - LinkedIn: TOFU 28% / MOFU 52% / BOFU 20% │
│ - YouTube: TOFU 65% / MOFU 30% / BOFU 5%   │
├─────────────────────────────────────────────┤
│ [채널 탭] LG.com | LinkedIn | YouTube       │
├─────────────────────────────────────────────┤
│ [선택 채널 상세]                            │
│ - 지표 테이블                               │
│ - 트렌드 차트                               │
│ - 퍼널 단계별 기여 분석                      │
└─────────────────────────────────────────────┘
```

---

### 3.10 Detail - Inquiry (/detail/inquiry) ⚠️ 개선 필요
**현재 상태**: 단순 테이블

**업그레이드 항목**:
- [ ] PageHeader 적용
- [ ] **MQL 전환 분석** 섹션 추가
- [ ] Inquiry → MQL 전환율 표시
- [ ] 산업별 파이 차트
- [ ] OEM vs Non-OEM 비교 차트
- [ ] Inquiry 유형별 MQL 전환율

**새 레이아웃**:
```
┌─────────────────────────────────────────────┐
│ [Header] Inquiry 상세 (BOFU/MQL 분석)        │
├─────────────────────────────────────────────┤
│ [MQL Summary] MQL 전환 요약 (4개 카드)       │
│ - Total Inquiry: 446                        │
│ - MQL Qualified: 89 (20%)                   │
│ - OEM MQL: 28 (31%)                         │
│ - Avg. Score: 72                            │
├────────────────────┬────────────────────────┤
│ [산업별 분포]       │ [유형별 MQL 전환율]     │
│ - 도넛 차트        │ - 막대 차트            │
└────────────────────┴────────────────────────┘
│ [Inquiry 리스트 테이블]                      │
│ - MQL 점수 컬럼 추가                        │
│ - 전환 상태 표시                            │
└─────────────────────────────────────────────┘
```

---

### 3.11 Campaign (/campaign) ⚠️ Coming Soon 상태
**현재 상태**: Coming Soon 플레이스홀더

**업그레이드 항목**:
- [ ] 캠페인 리스트 페이지로 구현
- [ ] 캠페인별 퍼널 영향 요약
- [ ] 활성/종료 캠페인 분류
- [ ] 캠페인 상세 링크

---

## 4. 공통 컴포넌트 추가

### 4.1 FunnelChart.tsx
```typescript
interface FunnelChartProps {
  data: {
    tofu: { count: number; label: string };
    mofu: { count: number; label: string };
    bofu: { count: number; label: string };
  };
  showConversionRates?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

### 4.2 MQLScoreBadge.tsx
```typescript
interface MQLScoreBadgeProps {
  score: number;  // 0-100
  size?: 'sm' | 'md';
}
```

### 4.3 FunnelStageLabel.tsx
```typescript
interface FunnelStageLabelProps {
  stage: 'tofu' | 'mofu' | 'bofu';
  showOriginal?: boolean;  // "Initial Review (TOFU)"
}
```

### 4.4 ConversionRateIndicator.tsx
```typescript
interface ConversionRateIndicatorProps {
  from: 'tofu' | 'mofu';
  to: 'mofu' | 'bofu';
  rate: number;
  change?: number;
}
```

---

## 5. 데이터 모델 확장

### 5.1 types/funnel.ts (신규)
```typescript
export type FunnelStage = 'tofu' | 'mofu' | 'bofu';

export interface FunnelMetrics {
  tofu: { count: number; change: number };
  mofu: { count: number; change: number };
  bofu: { count: number; change: number };
  conversionRates: {
    tofuToMofu: number;
    mofuToBofu: number;
  };
}

export interface MQLScore {
  score: number;  // 0-100
  factors: {
    revisits: number;
    contentConsumed: number;
    inquirySubmitted: boolean;
    webinarAttended: boolean;
  };
  qualified: boolean;
}

export interface TechnologyFunnelState {
  technologyId: string;
  funnel: FunnelMetrics;
  mqlScore: MQLScore;
  mqlPotential: 'high' | 'medium' | 'low';
}
```

### 5.2 기존 타입 확장
```typescript
// types/technology.ts 확장
export interface TechnologyReviewState {
  // 기존 필드...
  funnelStage: FunnelStage;  // 추가
  mqlScore: number;          // 추가
  mqlPotential: 'high' | 'medium' | 'low';  // 추가
}
```

---

## 6. 구현 우선순위

### Phase 1: 핵심 퍼널 통합 (High Priority)
1. [ ] `FunnelChart.tsx` 컴포넌트 생성
2. [ ] Home 페이지 퍼널 시각화 추가
3. [ ] 용어 병기 전체 적용
4. [ ] `types/funnel.ts` 추가

### Phase 2: MQL 지표 추가 (Medium Priority)
1. [ ] MQL 스코어 계산 로직 추가
2. [ ] `MQLScoreBadge.tsx` 컴포넌트 생성
3. [ ] 핵심 기술 신호 테이블에 MQL 컬럼 추가
4. [ ] Detail - Inquiry에 MQL 분석 추가

### Phase 3: 심심한 페이지 개선 (Medium Priority)
1. [ ] `/review-flow/technology` 전면 개선
2. [ ] `/campaign-impact/paid` 전면 개선
3. [ ] `/detail/channel` 전면 개선
4. [ ] `/detail/inquiry` 전면 개선

### Phase 4: 마무리 (Low Priority)
1. [ ] `/campaign` 구현
2. [ ] 전체 일관성 검토
3. [ ] 성능 최적화

---

## 7. 예상 작업량

| Phase | 작업 항목 | 예상 파일 수 |
|-------|---------|------------|
| Phase 1 | 퍼널 통합 | 8-10개 |
| Phase 2 | MQL 지표 | 5-7개 |
| Phase 3 | 페이지 개선 | 4개 (페이지당 1개) |
| Phase 4 | 마무리 | 2-3개 |

---

## 8. 성공 기준

### Home
- [ ] 사용자가 "지금 퍼널 어디까지 왔어?"를 한눈에 파악
- [ ] TOFU→MOFU→BOFU 전환율이 명확히 보임

### Review Flow
- [ ] "이 기술은 MOFU에서 BOFU로 가고 있네" 판단 가능
- [ ] MQL 전환 가능성이 높은 기술 식별 가능

### Campaign Impact
- [ ] "이 캠페인이 어느 퍼널 단계에 기여했는지" 명확
- [ ] MOFU→BOFU 가속 캠페인 식별 가능

### Detail
- [ ] MQL 판정의 숫자적 근거 확인 가능
- [ ] 채널별 퍼널 기여도 비교 가능

---

*마지막 업데이트: 2026-01-27*
