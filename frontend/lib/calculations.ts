/**
 * Business Logic Calculations
 * 비즈니스 로직 계산 함수
 */

import type {
  ReviewStage,
  PaidDependency,
  FlowDirection,
  SignalType,
  CampaignInfluence,
} from '@/types';

// ─────────────────────────────────────────────────────────────
// Review Intensity Calculation (검토 강도 계산)
// ─────────────────────────────────────────────────────────────

export interface IntensityInputs {
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
} as const;

const INTENSITY_THRESHOLDS = {
  sessions: 5000,
  timeOnPage: 5,      // 5분
  inquiry: 100,
} as const;

/**
 * Review Intensity 계산 (1-10 스케일)
 * 
 * 계산 공식:
 * 1. 각 입력값을 0-1 범위로 정규화
 * 2. 가중치 적용 후 합산
 * 3. 1-10 스케일로 변환
 */
export function calculateReviewIntensity(inputs: IntensityInputs): number {
  // 정규화 (0-1 스케일)
  const normalized = {
    sessions: Math.min(inputs.sessionCount / INTENSITY_THRESHOLDS.sessions, 1),
    timeOnPage: Math.min(inputs.avgTimeOnPage / INTENSITY_THRESHOLDS.timeOnPage, 1),
    viewDepth: inputs.viewDepth / 100,
    returnVisit: inputs.returnVisitRate / 100,
    multiContent: inputs.multiContentRate / 100,
    inquiry: Math.min(inputs.inquiryCount / INTENSITY_THRESHOLDS.inquiry, 1),
  };

  // 가중 합산
  let score = 0;
  for (const [key, weight] of Object.entries(INTENSITY_WEIGHTS)) {
    score += normalized[key as keyof typeof normalized] * weight;
  }

  // 1-10 스케일 변환
  const intensity = score * 10;
  return Math.min(10, Math.max(1, Math.round(intensity * 10) / 10));
}

// ─────────────────────────────────────────────────────────────
// Stage Determination (단계 결정)
// ─────────────────────────────────────────────────────────────

const STAGE_THRESHOLDS = {
  deep: 7.0,
  initial: 4.0,
} as const;

/**
 * Review Intensity 기반 Stage 결정
 */
export function determineReviewStage(intensity: number): ReviewStage {
  if (intensity >= STAGE_THRESHOLDS.deep) return 'deep';
  if (intensity >= STAGE_THRESHOLDS.initial) return 'initial';
  return 'initial';
}

// ─────────────────────────────────────────────────────────────
// Paid Dependency (광고 의존도)
// ─────────────────────────────────────────────────────────────

const PAID_DEPENDENCY_THRESHOLDS = {
  low: 25,
  medium: 50,
} as const;

/**
 * Paid Ratio 기반 의존도 결정
 */
export function determinePaidDependency(paidRatio: number): PaidDependency {
  if (paidRatio <= PAID_DEPENDENCY_THRESHOLDS.low) return 'low';
  if (paidRatio <= PAID_DEPENDENCY_THRESHOLDS.medium) return 'medium';
  return 'high';
}

// ─────────────────────────────────────────────────────────────
// Flow Direction (흐름 방향)
// ─────────────────────────────────────────────────────────────

const DIRECTION_THRESHOLDS = {
  advancing: 5,
  declining: -5,
} as const;

/**
 * Intensity 변화율 기반 방향 결정
 */
export function determineFlowDirection(changePercent: number): FlowDirection {
  if (changePercent >= DIRECTION_THRESHOLDS.advancing) return 'advancing';
  if (changePercent <= DIRECTION_THRESHOLDS.declining) return 'declining';
  return 'stable';
}

// ─────────────────────────────────────────────────────────────
// Signal Type (신호 유형)
// ─────────────────────────────────────────────────────────────

interface SignalInputs {
  stage: ReviewStage;
  direction: FlowDirection;
  paidDependency: PaidDependency;
}

/**
 * 종합 신호 결정
 * 
 * 규칙:
 * - green: Deep + advancing/stable + low paid
 * - yellow: 관찰 필요 (중간 상태)
 * - orange: 광고 의존 높음
 * - red: 하락 중 또는 위험
 * - gray: 데이터 부족
 */
export function determineSignalType(inputs: SignalInputs): { type: SignalType; label: string } {
  const { stage, direction, paidDependency } = inputs;

  // Deep + Low Paid + 상승/유지 = 자생적 검토
  if (stage === 'deep' && paidDependency === 'low' && direction !== 'declining') {
    return { type: 'green', label: '자생적 검토' };
  }

  // Deep + 유지 = 유지 중
  if (stage === 'deep' && direction === 'stable') {
    return { type: 'yellow', label: '관찰 필요' };
  }

  // High Paid Dependency = 광고 의존
  if (paidDependency === 'high') {
    return { type: 'orange', label: '광고 의존, 검증 필요' };
  }

  // Declining = 관심 하락
  if (direction === 'declining') {
    return { type: 'red', label: '관심 하락' };
  }

  // Initial + 상승 = 성장 중
  if (stage === 'initial' && direction === 'advancing') {
    return { type: 'yellow', label: '성장 중' };
  }

  return { type: 'gray', label: '분석 필요' };
}

// ─────────────────────────────────────────────────────────────
// Campaign Influence (캠페인 영향)
// ─────────────────────────────────────────────────────────────

const INFLUENCE_THRESHOLDS = {
  amplifier: { retention: 60, lift: 20 },
  distorter: { retention: 30, lift: 10 },
} as const;

/**
 * 캠페인 영향 분류
 * 
 * 규칙:
 * - Amplifier: 유지율 60%+ & 상승률 20%+
 * - Distorter: 유지율 30% 미만 또는 상승률 10% 미만
 * - Neutral: 그 외
 */
export function determineCampaignInfluence(
  retention: number,
  baselineLift: number
): CampaignInfluence {
  if (
    retention >= INFLUENCE_THRESHOLDS.amplifier.retention &&
    baselineLift >= INFLUENCE_THRESHOLDS.amplifier.lift
  ) {
    return 'amplifier';
  }

  if (
    retention < INFLUENCE_THRESHOLDS.distorter.retention ||
    baselineLift < INFLUENCE_THRESHOLDS.distorter.lift
  ) {
    return 'distorter';
  }

  return 'neutral';
}

// ─────────────────────────────────────────────────────────────
// Interpretation (해석 생성)
// ─────────────────────────────────────────────────────────────

export interface InterpretationInputs {
  stage: ReviewStage;
  direction: FlowDirection;
  paidDependency: PaidDependency;
  intensityChange: number;
}

/**
 * Action Hint 생성
 */
export function generateActionHint(inputs: InterpretationInputs): string {
  const { stage, direction, paidDependency } = inputs;

  if (stage === 'deep' && paidDependency === 'low' && direction === 'advancing') {
    return '영업 접촉 가능';
  }

  if (stage === 'deep' && direction === 'stable') {
    return '심화 검토 유지';
  }

  if (paidDependency === 'high') {
    return '광고 효과 검증 필요';
  }

  if (direction === 'declining') {
    return '추가 콘텐츠 필요';
  }

  if (stage === 'initial' && direction === 'advancing') {
    return '콘텐츠 강화 필요';
  }

  return '관찰 필요';
}

// ─────────────────────────────────────────────────────────────
// Utility Exports
// ─────────────────────────────────────────────────────────────

export const THRESHOLDS = {
  INTENSITY: INTENSITY_THRESHOLDS,
  STAGE: STAGE_THRESHOLDS,
  PAID: PAID_DEPENDENCY_THRESHOLDS,
  DIRECTION: DIRECTION_THRESHOLDS,
  INFLUENCE: INFLUENCE_THRESHOLDS,
} as const;

export const WEIGHTS = {
  INTENSITY: INTENSITY_WEIGHTS,
} as const;
