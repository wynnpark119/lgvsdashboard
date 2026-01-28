# LG VS Dashboard 핵심 지표 및 산출식

---

## 1. 통합 퍼널 (Integrated Funnel)

### 채널별 가중치

| 채널 | 가중치 | 적용 근거 |
|------|--------|----------|
| LG.com | 1.0 | Owned 채널, 직접 방문 = 능동적 관심 |
| LinkedIn | 0.6 | 주력 채널, 예산 비중 높음 |
| YouTube | 0.4 | 콘텐츠 소비 채널, 전환 기여도 낮음 |

---

### 퍼널 단계별 산출식

| 퍼널 | 산출식 |
|------|--------|
| **TOFU** | `LG.com 첫방문 × 1.0 + (LinkedIn 조회수 ÷ 10) × 0.6 + (YouTube 조회수 ÷ 10) × 0.4` |
| **MOFU** | `LG.com MOFU × 1.0 + LinkedIn Engagement × 0.6 + (YouTube 50%+ 시청 ÷ 10) × 0.4` |
| **BOFU** | `LG.com 문의 폼 제출 건수` |

> **※ ÷ 10**: LinkedIn/YouTube 조회수는 LG.com 방문보다 10배 이상 많으므로 스케일 조정

---

### 퍼널 전환율

| 지표 | 산출식 |
|------|--------|
| TOFU→MOFU 전환율 | `(MOFU 수 / TOFU 수) × 100` |
| MOFU→BOFU 전환율 | `(BOFU 수 / MOFU 수) × 100` |

---

## 2. 검토 강도 (Review Intensity)

### 산출식

```
Review Intensity (1-10) = Σ(정규화된 입력값 × 가중치) × 10
```

### 입력 지표 및 가중치

| 입력 지표 | 가중치 | 정규화 공식 |
|----------|--------|------------|
| 세션 수 | 15% | `min(sessions / 5000, 1)` |
| 평균 체류 시간 | 20% | `min(avgTime / 5분, 1)` |
| 영상 시청 깊이 | 20% | `viewDepth / 100` |
| 재방문율 | 20% | `returnVisitRate / 100` |
| 복수 콘텐츠율 | 15% | `multiContentRate / 100` |
| Inquiry 수 | 10% | `min(inquiryCount / 100, 1)` |

---

## 3. 단계 분류 (Stage Classification)

| 검토 강도 | 단계 분류 |
|----------|----------|
| 7.0 이상 | BOFU |
| 4.0 ~ 6.9 | MOFU |
| 4.0 미만 | TOFU |

---

## 4. 광고 의존도 (Paid Dependency)

### 산출식

```
Paid Dependency = (Paid 트래픽 / 전체 트래픽) × 100
```

### 분류 기준

| Paid 비율 | 분류 | 해석 |
|----------|------|------|
| ~25% | Low | 자생적 관심 (건강) |
| 25~50% | Medium | 균형 상태 |
| 50%+ | High | 광고 의존 주의 |

---

## 5. 종합 신호 (Signal Type)

| 조건 | 신호 | 의미 |
|------|------|------|
| BOFU + Paid Low + 상승/유지 | 🟢 Green | 문의 전환 · Engagement 高 |
| MOFU + 유지 | 🟡 Yellow | 추가 콘텐츠 노출 권장 |
| Paid High | 🟠 Orange | 광고 의존 주의 |
| 하락 추세 | 🔴 Red | Engagement 하락 |
| 기타 | ⚪ Gray | 모니터링 |

---

## 6. 캠페인 영향 분류 (Campaign Influence)

### 산출식

| 지표 | 산출식 |
|------|--------|
| **Retention** | `(종료 2주 후 Intensity - 시작 전) / (Peak - 시작 전) × 100` |
| **Lift** | `(Peak - 시작 전) / 시작 전 × 100` |

### 분류 기준

| 분류 | 조건 | 해석 |
|------|------|------|
| **Amplifier** | Retention ≥ 60% AND Lift ≥ 20% | 지속 효과 있음 |
| **Neutral** | 중간 | 보통 효과 |
| **Distorter** | Retention < 30% OR Lift < 10% | 단기 반응만 |

---

## 7. 전체 지표 요약표

| 지표명 | 산출식 | 대시보드 위치 |
|--------|--------|--------------|
| TOFU | LG.com×1.0 + LinkedIn÷10×0.6 + YouTube÷10×0.4 | Home → 주목 현황 |
| MOFU | LG.com MOFU×1.0 + LinkedIn Eng.×0.6 + YouTube 50%÷10×0.4 | Home → 주목 현황 |
| BOFU | LG.com 문의 건수 | Home → 주목 현황 |
| 전환율 | 다음단계 / 현단계 × 100 | Home → 퍼널 화살표 |
| 검토 강도 | 6개 지표 가중 합산 (1-10) | 기술별 관심 현황 |
| 광고 의존도 | Paid / 전체 × 100 | 주목 현황 카드 |
| 종합 신호 | 단계+방향+Paid 조건 조합 | 기술 테이블 |
| 캠페인 영향 | Retention + Lift 조건 | 캠페인 분석 |

---

*LG VS MTK Dashboard · 2026*
