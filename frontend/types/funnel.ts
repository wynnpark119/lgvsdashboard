/**
 * Funnel Types
 * B2B 마케팅 퍼널 관련 타입 정의
 */

// 퍼널 단계
export type FunnelStage = 'tofu' | 'mofu' | 'bofu';

// 퍼널 단계 설정
export const FUNNEL_STAGE_CONFIG = {
  tofu: {
    label: 'TOFU',
    labelKr: '인지',
    fullLabel: 'Top of Funnel',
    originalLabel: 'Initial Review',
    color: '#FDA4AF', // rose-300
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-700',
    description: '고객이 처음 접하게 되는 채널/콘텐츠',
  },
  mofu: {
    label: 'MOFU',
    labelKr: '탐색',
    fullLabel: 'Middle of Funnel',
    originalLabel: 'Deep Review',
    color: '#FCA5A5', // red-300
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    description: '제품/기술/안정성 등을 탐색·비교 기반 평가',
  },
  bofu: {
    label: 'BOFU',
    labelKr: 'MQL',
    fullLabel: 'Bottom of Funnel',
    originalLabel: 'Reachable',
    color: '#EF4444', // red-500
    bgColor: 'bg-red-200',
    textColor: 'text-red-800',
    description: 'CRM 연동이 강화된 Conversion 역할',
  },
} as const;

// 퍼널 메트릭
export interface FunnelMetrics {
  tofu: { count: number; change: number };
  mofu: { count: number; change: number };
  bofu: { count: number; change: number };
  conversionRates: {
    tofuToMofu: number;
    mofuToBofu: number;
  };
}

// MQL 스코어
export interface MQLScore {
  score: number; // 0-100
  factors: {
    revisits: number;
    contentConsumed: number;
    inquirySubmitted: boolean;
    webinarAttended: boolean;
  };
  qualified: boolean;
}

// 기술별 퍼널 상태
export interface TechnologyFunnelState {
  technologyId: string;
  funnel: FunnelMetrics;
  mqlScore: MQLScore;
  mqlPotential: 'high' | 'medium' | 'low';
}

// MQL 잠재력 설정
export const MQL_POTENTIAL_CONFIG = {
  high: {
    label: 'MQL 가능',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hint: '영업팀 전달 가능',
  },
  medium: {
    label: 'MQL 근접',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    hint: '추가 nurturing 필요',
  },
  low: {
    label: 'MQL 멀음',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    hint: '콘텐츠 노출 필요',
  },
} as const;

// 퍼널 단계 매핑 (기존 → 퍼널)
export function mapStageToFunnel(stage: 'initial' | 'deep' | 'reachable'): FunnelStage {
  const mapping: Record<string, FunnelStage> = {
    initial: 'tofu',
    deep: 'mofu',
    reachable: 'bofu',
  };
  return mapping[stage] || 'tofu';
}

// 퍼널 단계 매핑 (퍼널 → 기존)
export function mapFunnelToStage(funnel: FunnelStage): 'initial' | 'deep' | 'reachable' {
  const mapping: Record<FunnelStage, 'initial' | 'deep' | 'reachable'> = {
    tofu: 'initial',
    mofu: 'deep',
    bofu: 'reachable',
  };
  return mapping[funnel];
}

// MQL 스코어 계산
export function calculateMQLScore(factors: MQLScore['factors']): number {
  let score = 0;
  
  // 재방문 (최대 30점)
  score += Math.min(factors.revisits * 10, 30);
  
  // 콘텐츠 소비 (최대 30점)
  score += Math.min(factors.contentConsumed * 10, 30);
  
  // Inquiry 제출 (20점)
  if (factors.inquirySubmitted) score += 20;
  
  // 웨비나 참석 (20점)
  if (factors.webinarAttended) score += 20;
  
  return Math.min(score, 100);
}

// MQL 자격 판정
export function isMQLQualified(score: number): boolean {
  return score >= 60;
}

// MQL 잠재력 판정
export function getMQLPotential(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}
