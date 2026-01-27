/**
 * Seed Data
 * 통합 시드 데이터 - 모든 페이지에서 일관된 데이터 사용
 */

import {
  TECHNOLOGIES,
  type TechnologyReviewState,
  type Campaign,
  type CampaignImpact,
  type MediaAnalysis,
  type OverallStatus,
  type StageDistribution,
  type MomentumData,
  type TrendDataPoint,
} from '@/types';
import {
  determinePaidDependency,
  determineFlowDirection,
  determineSignalType,
  determineCampaignInfluence,
  generateActionHint,
} from '@/lib/calculations';

// ─────────────────────────────────────────────────────────────
// Base Metrics (기본 지표 - 계산의 원천)
// ─────────────────────────────────────────────────────────────

interface TechnologyBaseMetrics {
  id: string;
  sessions: number;
  avgTimeOnPage: number;
  viewDepth: number;
  returnVisitRate: number;
  multiContentRate: number;
  inquiryCount: number;
  paidRatio: number;
  changeVsPrevious: number;
}

const BASE_METRICS: TechnologyBaseMetrics[] = [
  {
    id: 'digital-cockpit',
    sessions: 4500,
    avgTimeOnPage: 3.8,
    viewDepth: 72,
    returnVisitRate: 45,
    multiContentRate: 38,
    inquiryCount: 85,
    paidRatio: 18,
    changeVsPrevious: 23,
  },
  {
    id: 'vehicle-vision',
    sessions: 4200,
    avgTimeOnPage: 3.5,
    viewDepth: 68,
    returnVisitRate: 42,
    multiContentRate: 35,
    inquiryCount: 72,
    paidRatio: 22,
    changeVsPrevious: 18,
  },
  {
    id: 'adas',
    sessions: 3800,
    avgTimeOnPage: 2.8,
    viewDepth: 58,
    returnVisitRate: 32,
    multiContentRate: 28,
    inquiryCount: 45,
    paidRatio: 38,
    changeVsPrevious: 2,
  },
  {
    id: 'ivi',
    sessions: 2800,
    avgTimeOnPage: 2.2,
    viewDepth: 52,
    returnVisitRate: 28,
    multiContentRate: 22,
    inquiryCount: 35,
    paidRatio: 62,
    changeVsPrevious: 15,
  },
  {
    id: 'automotive-display',
    sessions: 1800,
    avgTimeOnPage: 1.8,
    viewDepth: 42,
    returnVisitRate: 18,
    multiContentRate: 15,
    inquiryCount: 12,
    paidRatio: 58,
    changeVsPrevious: -8,
  },
  {
    id: 'telematics',
    sessions: 1200,
    avgTimeOnPage: 1.5,
    viewDepth: 38,
    returnVisitRate: 15,
    multiContentRate: 12,
    inquiryCount: 8,
    paidRatio: 15,
    changeVsPrevious: -12,
  },
];

// ─────────────────────────────────────────────────────────────
// Calculated Technology States (계산된 기술 상태)
// ─────────────────────────────────────────────────────────────

function calculateIntensity(m: TechnologyBaseMetrics): number {
  const normalized = {
    sessions: Math.min(m.sessions / 5000, 1),
    timeOnPage: Math.min(m.avgTimeOnPage / 5, 1),
    viewDepth: m.viewDepth / 100,
    returnVisit: m.returnVisitRate / 100,
    multiContent: m.multiContentRate / 100,
    inquiry: Math.min(m.inquiryCount / 100, 1),
  };

  const weights = { sessions: 0.15, timeOnPage: 0.20, viewDepth: 0.20, returnVisit: 0.20, multiContent: 0.15, inquiry: 0.10 };
  let score = 0;
  for (const [key, weight] of Object.entries(weights)) {
    score += normalized[key as keyof typeof normalized] * weight;
  }
  return Math.min(10, Math.max(1, Math.round(score * 100) / 10));
}

function determineStage(m: TechnologyBaseMetrics): 'initial' | 'deep' | 'reachable' {
  // BOFU: 문의 많고, 재방문율 높고, 다중 콘텐츠 소비
  if (m.inquiryCount >= 70 && m.returnVisitRate >= 40 && m.multiContentRate >= 35) {
    return 'reachable';
  }
  // MOFU: 체류시간 높고, 재방문 있고, 깊이 있는 탐색
  if (m.avgTimeOnPage >= 3.0 && m.returnVisitRate >= 30 && m.viewDepth >= 60) {
    return 'deep';
  }
  // TOFU: 나머지
  return 'initial';
}

export const TECHNOLOGY_STATES: TechnologyReviewState[] = BASE_METRICS.map((m) => {
  const intensity = calculateIntensity(m);
  const stage = determineStage(m);
  const direction = determineFlowDirection(m.changeVsPrevious);
  const paidDependency = determinePaidDependency(m.paidRatio);
  const signal = determineSignalType({ stage, direction, paidDependency });
  const actionHint = generateActionHint({ stage, direction, paidDependency, intensityChange: m.changeVsPrevious });

  return {
    technologyId: m.id,
    period: '2025-12',
    stage,
    intensity,
    direction,
    intensityChange: m.changeVsPrevious,
    paidDependency,
    paidRatio: m.paidRatio,
    signal: { ...signal, actionHint },
  };
});

// ─────────────────────────────────────────────────────────────
// Campaigns (캠페인)
// ─────────────────────────────────────────────────────────────

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'ces-2026',
    name: 'CES 2026',
    type: 'event',
    period: { start: '2026-01-07', end: '2026-01-10' },
  },
  {
    id: 'q4-display-campaign',
    name: 'Q4 Display Campaign',
    type: 'advertising',
    period: { start: '2025-10-01', end: '2025-12-31' },
  },
  {
    id: 'tech-webinar-series',
    name: 'Tech Webinar Series',
    type: 'content',
    period: { start: '2025-11-01', end: '2025-12-15' },
  },
];

export const CAMPAIGN_IMPACTS: CampaignImpact[] = [
  {
    campaignId: 'ces-2026',
    influence: determineCampaignInfluence(78, 45),
    summary: 'Initial → Deep 이동 발생, 종료 후에도 +18% 유지',
    metrics: {
      initialBefore: 65,
      initialAfter: 52,
      deepBefore: 35,
      deepAfter: 48,
      retention: 78,
    },
    technologyMovements: [
      { technologyId: 'digital-cockpit', stageBefore: 'initial', stageAfter: 'deep', movement: 'advanced' },
      { technologyId: 'vehicle-vision', stageBefore: 'initial', stageAfter: 'deep', movement: 'advanced' },
      { technologyId: 'adas', stageBefore: 'deep', stageAfter: 'deep', movement: 'maintained' },
      { technologyId: 'ivi', stageBefore: 'deep', stageAfter: 'initial', movement: 'declined' },
    ],
  },
  {
    campaignId: 'q4-display-campaign',
    influence: determineCampaignInfluence(42, 8),
    summary: '광고 기간 중 상승, 종료 후 baseline 복귀',
    metrics: {
      initialBefore: 70,
      initialAfter: 68,
      deepBefore: 30,
      deepAfter: 32,
      retention: 42,
    },
    technologyMovements: [
      { technologyId: 'automotive-display', stageBefore: 'initial', stageAfter: 'initial', movement: 'maintained' },
    ],
  },
  {
    campaignId: 'tech-webinar-series',
    influence: determineCampaignInfluence(82, 25),
    summary: 'Deep Review 비중 +8%, 참석자 재방문율 65%',
    metrics: {
      initialBefore: 60,
      initialAfter: 55,
      deepBefore: 40,
      deepAfter: 45,
      retention: 82,
    },
    technologyMovements: [
      { technologyId: 'digital-cockpit', stageBefore: 'deep', stageAfter: 'deep', movement: 'maintained' },
      { technologyId: 'adas', stageBefore: 'deep', stageAfter: 'deep', movement: 'maintained' },
    ],
  },
];

export const MEDIA_ANALYSES: MediaAnalysis[] = [
  {
    campaignId: 'ces-2026',
    channel: 'google_ads',
    role: 'igniter',
    technologies: ['ivi', 'adas', 'telematics'],
    evidence: '첫 접촉 유입의 45%를 차지, 검토 시작 트리거 역할',
  },
  {
    campaignId: 'ces-2026',
    channel: 'linkedin_ads',
    role: 'accelerator',
    technologies: ['digital-cockpit', 'vehicle-vision'],
    evidence: '재방문율 62%, 다중 콘텐츠 소비 비율 최고',
  },
  {
    campaignId: 'ces-2026',
    channel: 'youtube_ads',
    role: 'supporter',
    technologies: ['vehicle-vision', 'adas'],
    evidence: '평균 시청 완료율 68%, 검토 유지 기여',
  },
  {
    campaignId: 'ces-2026',
    channel: 'social',
    role: 'noise',
    technologies: ['ivi'],
    evidence: '높은 이탈률(78%), 단기 반응만 유발',
  },
];

// ─────────────────────────────────────────────────────────────
// Overall Status (전체 상태)
// ─────────────────────────────────────────────────────────────

export const OVERALL_STATUS: OverallStatus = {
  initial: { count: 12847, changeVsLastMonth: 23.4 },
  deep: { count: 2156, changeVsLastMonth: 15.2 },
  reachable: { count: 479, changeVsLastMonth: 8.1 },
  currentState: {
    direction: 'up',
    fromStage: 'initial',
    toStage: 'deep',
    paidInfluence: 'with_paid',
  },
  period: '2025-12',
};

export const STAGE_DISTRIBUTION: StageDistribution = {
  initial: { total: 12847, organicRatio: 65, paidRatio: 35 },
  deep: { total: 2156, organicRatio: 82, paidRatio: 18 },
  reachable: { total: 479, organicRatio: 94, paidRatio: 6 },
  interpretation: 'healthy',
};

// ─────────────────────────────────────────────────────────────
// Momentum Data (모멘텀)
// ─────────────────────────────────────────────────────────────

export const MOMENTUM_DATA: MomentumData = {
  period: '90d',
  dataPoints: [
    { date: '2025-11-01', value: 3.2, stage: 'baseline' },
    { date: '2025-11-08', value: 3.5, stage: 'baseline' },
    { date: '2025-11-15', value: 3.8, stage: 'baseline' },
    { date: '2025-11-22', value: 4.0, stage: 'baseline' },
    { date: '2025-12-01', value: 4.2, stage: 'baseline' },
    { date: '2025-12-08', value: 4.5, stage: 'baseline' },
    { date: '2025-12-15', value: 4.8, stage: 'baseline' },
    { date: '2025-12-22', value: 5.2, stage: 'baseline' },
    { date: '2025-12-29', value: 5.8, stage: 'baseline' },
    { date: '2026-01-01', value: 7.2, stage: 'campaign' },
    { date: '2026-01-03', value: 8.1, stage: 'campaign' },
    { date: '2026-01-05', value: 8.8, stage: 'campaign' },
    { date: '2026-01-07', value: 9.2, stage: 'campaign' },
    { date: '2026-01-10', value: 9.5, stage: 'campaign' },
    { date: '2026-01-12', value: 8.2, stage: 'post_campaign' },
    { date: '2026-01-15', value: 7.1, stage: 'post_campaign' },
    { date: '2026-01-18', value: 6.5, stage: 'post_campaign' },
    { date: '2026-01-20', value: 6.2, stage: 'post_campaign' },
    { date: '2026-01-23', value: 5.8, stage: 'post_campaign' },
  ],
  campaigns: [
    { id: 'ces-2026', name: 'CES 2026', startDate: '2026-01-01', endDate: '2026-01-10' },
  ],
  interpretation: {
    preIntensity: 4.0,
    peakIntensity: 9.5,
    postIntensity: 5.8,
    effect: 'amplifier',
    changeVsBaseline: 45,
  },
};

// ─────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────

export function getTechnologyState(id: string): TechnologyReviewState | undefined {
  return TECHNOLOGY_STATES.find((t) => t.technologyId === id);
}

export function getCampaign(id: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.id === id);
}

export function getCampaignImpact(campaignId: string): CampaignImpact | undefined {
  return CAMPAIGN_IMPACTS.find((c) => c.campaignId === campaignId);
}

export function getMediaAnalyses(campaignId: string): MediaAnalysis[] {
  return MEDIA_ANALYSES.filter((m) => m.campaignId === campaignId);
}
