# Detail / Reference Specification

> **Version**: 1.0.0  
> **Last Updated**: 2026-01-23  
> **Status**: Implementation Ready  
> **Position**: 근거 검증 (Fact Check)

---

## 1. Detail / Reference의 정체성

### 1.1 정의

Detail / Reference는 **Home · Review Flow · Campaign Impact에서 내려진 판단을  
숫자로 확인하고 설명하기 위한 '근거 저장소'**다.

```
이 메뉴는
  - 전략을 만드는 곳 ❌
  - 방향을 결정하는 곳 ❌
  - "왜 그렇게 판단했는지 보여주는 곳" ⭕
```

### 1.2 답해야 할 3가지 질문

| # | 질문 | 목적 |
|---|------|------|
| 1 | Review Flow에서 본 상태 판단의 숫자적 근거는 무엇인가 | 상태 검증 |
| 2 | Campaign Impact에서 해석한 영향의 데이터 증거는 무엇인가 | 원인 검증 |
| 3 | 채널/광고 관점에서 이상치(outlier)는 없었는가 | 예외 확인 |

👉 **"그래서 몇이야?"**에 답하는 메뉴

### 1.3 의도적으로 배제하는 것

❌ 자동 인사이트 문장  
❌ 종합 평가 점수  
❌ AI 추천 액션  
❌ KPI 요약 카드

---

## 2. 페이지 레이아웃

```
┌─────────────────────────────────────────────────────────────────────┐
│                       Detail / Reference                            │
│                    보조 데이터 & 근거 확인 (Fact Check)              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ [A] Context Filter (필수)                                    │    │
│  │     "이 데이터는 어떤 판단을 검증하기 위한 것인가"            │    │
│  │     기술 선택 | 기간 선택 | 연결 메뉴 표시                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ [B] Channel Detail Tables                                    │    │
│  │     "채널별 숫자를 있는 그대로 확인"                          │    │
│  │     LG.com | LinkedIn | YouTube | Google Ads                 │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌───────────────────────────────┐  ┌───────────────────────────┐   │
│  │ [C] Metric Trend Verification │  │ [D] Data Notes &          │   │
│  │     "흐름이 착시가 아닌지"     │  │     Limitations           │   │
│  │     트래픽/체류/시청 추이      │  │     데이터 한계 명시      │   │
│  └───────────────────────────────┘  └───────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

모든 정보는 상위 메뉴에서 내려온 '컨텍스트' 안에서만 표시
독립적 탐색 ❌
```

---

## 3. [A] Context Filter

### 3.1 목적
"이 데이터는 어떤 판단을 검증하기 위한 것인가"

### 3.2 필수 컨텍스트 요소

| 요소 | 설명 | 예시 |
|------|------|------|
| 선택된 기술/솔루션 | 검토 대상 | ADAS Sensor Fusion |
| 선택된 기간 | 분석 기간 | 2025-12-01 ~ 2026-01-23 |
| 연결된 상위 메뉴 | 진입 경로 | Review Flow / Campaign Impact |
| 검증 목적 | 판단 내용 | "Deep Review 유지 상태 확인" |

### 3.3 Context 표시 형태

```
┌──────────────────────────────────────────────────────────────┐
│  📍 Viewing data for:                                        │
│                                                               │
│  Technology: ADAS Sensor Fusion                              │
│  Period: 2025-12-01 ~ 2026-01-23                             │
│  Context: Deep Review 유지 상태 검증                          │
│  Related Campaign: CES 2026                                   │
│                                                               │
│  From: Review Flow → Technology Card 클릭                     │
└──────────────────────────────────────────────────────────────┘
```

### 3.4 중요 원칙

```
❌ Context 없이 데이터 표시 금지
❌ Home에서 직접 접근 금지
⭕ 반드시 Review Flow 또는 Campaign Impact에서 진입
```

---

## 4. [B] Channel Detail Tables

### 4.1 목적
"채널별 숫자를 있는 그대로 확인"

### 4.2 포함 채널

| 채널 | 데이터 소스 |
|------|------------|
| LG.com | GA4 |
| LinkedIn | Organic + Paid |
| YouTube | Video Analytics |
| Google Ads | Display + Search |

### 4.3 표시 지표

**LG.com**
| 지표 | 설명 |
|------|------|
| Sessions | 세션 수 |
| Pageviews | 페이지뷰 |
| Avg. Time on Page | 평균 체류 시간 |
| Bounce Rate | 이탈률 |

**LinkedIn**
| 지표 | 설명 |
|------|------|
| Impressions | 노출 수 |
| Clicks | 클릭 수 |
| CTR | 클릭률 |
| Engagement Rate | 참여율 |

**YouTube**
| 지표 | 설명 |
|------|------|
| Views | 조회수 |
| Watch Time | 시청 시간 |
| Avg. View Duration | 평균 시청 시간 |
| View Depth (50%+) | 시청 완료율 |

**Google Ads**
| 지표 | 설명 |
|------|------|
| Impressions | 노출 수 |
| Clicks | 클릭 수 |
| CTR | 클릭률 |
| Cost | 비용 |
| CPC | 클릭당 비용 |

### 4.4 중요한 원칙

```
⭕ 이 메뉴에서만 KPI 나열 허용
⭕ 지표 비교는 동일 채널 내에서만
❌ 채널 간 효율 비교
❌ "잘했다/못했다" 해석 문구
```

---

## 5. [C] Metric Trend Verification

### 5.1 목적
"우리가 본 흐름이 착시가 아닌지 확인"

### 5.2 구성 요소

| 요소 | 내용 |
|------|------|
| 트래픽 추이 | Sessions / Pageviews over time |
| 체류 시간 추이 | Avg. Time on Page over time |
| 시청 깊이 추이 | Watch completion rate over time |
| Review Flow 오버레이 | 단계 이동 시점 표시 |

### 5.3 시각화

```
       Metric
          ↑
          │      ┌─Campaign─┐
          │  ────│──────────│─────────
          │      │    ▲     │    ▲
          │  ────│────│─────│────│────
          │      │    │     │    │
          └──────┴────┼─────┴────┼────→ Time
                      │          │
                Review Flow   Maintained
                Movement      State
```

### 5.4 해석 포인트

| 패턴 | 의미 |
|------|------|
| Review Flow 변화 시점과 데이터 변화 정합 | 판단 근거 확인됨 |
| 단기 스파이크 | 일시적 현상, 주의 필요 |
| 지속 패턴 | 안정적 상태 |

---

## 6. [D] Data Notes & Limitations

### 6.1 목적
"이 데이터로 할 수 없는 판단을 명확히 한다"

### 6.2 포함 내용

| 항목 | 설명 |
|------|------|
| CRM/매출 데이터 미포함 | 실제 거래 데이터 없음 |
| OEM 식별 한계 | IP 기반 추정, 정확도 제한 |
| Paid/Organic 혼합 구조 | 중복 집계 가능성 |
| 데이터 지연(latency) | 실시간 아닌 배치 처리 |
| 크로스 디바이스 한계 | 동일 사용자 추적 불완전 |

### 6.3 표시 형태

```
┌──────────────────────────────────────────────────────────────┐
│  ⚠️ Data Notes & Limitations                                 │
│                                                               │
│  • CRM/매출 데이터 미포함                                     │
│    → 실제 구매/계약 전환은 별도 확인 필요                      │
│                                                               │
│  • OEM 식별 한계                                              │
│    → IP 기반 추정이므로 정확도 약 70% 수준                    │
│                                                               │
│  • Paid/Organic 혼합                                          │
│    → 동일 사용자가 두 채널 모두에서 집계될 수 있음            │
│                                                               │
│  • 데이터 지연                                                │
│    → GA4 기준 최대 24시간 지연 가능                           │
└──────────────────────────────────────────────────────────────┘
```

👉 이 영역은 **리스크 관리용**

---

## 7. 메뉴 간 이동 규칙

### 7.1 진입 경로 (필수)

```
Review Flow → Technology Card 클릭 → Detail
Campaign Impact → Media Role 클릭 → Detail

❌ Home에서 직접 접근 금지
❌ 독립적 탐색 금지
```

### 7.2 복귀 경로

```
Detail → Review Flow (컨텍스트 유지)
Detail → Campaign Impact (컨텍스트 유지)
Detail → Home (컨텍스트 초기화)
```

---

## 8. 데이터 구조

### 8.1 Context Data

```typescript
interface DetailContext {
  technology: {
    id: string;
    name: string;
  };
  period: {
    start: string;
    end: string;
  };
  source: 'review-flow' | 'campaign-impact';
  purpose: string;  // 검증 목적
  relatedCampaign?: string;
}
```

### 8.2 Channel Metrics

```typescript
interface ChannelMetrics {
  channel: 'lg_com' | 'linkedin' | 'youtube' | 'google_ads';
  period: string;
  metrics: {
    name: string;
    value: number;
    unit: string;
    change?: number;
    changeDirection?: 'up' | 'down' | 'stable';
  }[];
}
```

### 8.3 Trend Data

```typescript
interface TrendData {
  metric: string;
  data: {
    date: string;
    value: number;
    isReviewFlowPoint?: boolean;  // 단계 이동 시점
    isCampaignPeriod?: boolean;   // 캠페인 기간
  }[];
}
```

---

## 9. 성공 기준

이 메뉴를 본 사용자가 이렇게 말해야 한다:

```
✅ "아, 그래서 이런 판단이 나왔구나"
✅ "이건 데이터상으로도 맞네"
✅ "이 부분은 조심해서 해석해야겠네"
```

👉 **"이걸로 전략 짜자"라는 말이 나오면 실패**

---

## 10. 전체 메뉴 구조 정합

```
Home
  ↓
Review Flow  ← 핵심 판단
  ↓
Campaign & Media Impact  ← 원인 해석
  ↓
Detail / Reference  ← 근거 검증
```

| 메뉴 | 역할 | 질문 |
|------|------|------|
| Home | 현재 상태 | 지금 어디에 있는가 |
| Review Flow | 핵심 판단 | 어떻게 이동하고 있는가 |
| Campaign Impact | 원인 해석 | 왜 이렇게 되었는가 |
| Detail / Reference | 근거 검증 | 그래서 숫자로 확인하면? |

---

*End of Detail / Reference Specification*
