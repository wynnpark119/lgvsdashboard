/**
 * Seed Data
 * 통합 시드 데이터 - 모든 페이지에서 일관된 데이터 사용
 * 
 * ⚠️ 마스터 데이터는 settings.ts에서 관리
 * - 기술 키워드: TECHNOLOGY_SETTINGS
 * - 캠페인: CAMPAIGN_SETTINGS  
 * - 채널 가중치: CHANNEL_SETTINGS
 * - URL 패턴: URL_PATTERN_MAPPINGS
 * - 소셜 게시물: SOCIAL_POSTS
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
  type NarrativeFlowMetrics,
  type LayerHandoffMetrics,
} from '@/types';
import {
  determinePaidDependency,
  determineFlowDirection,
  determineSignalType,
  determineCampaignInfluence,
  generateActionHint,
} from '@/lib/calculations';
import {
  TECHNOLOGY_SETTINGS,
  CAMPAIGN_SETTINGS,
  CHANNEL_SETTINGS,
  getChannelWeight,
} from './settings';

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
  // 전략과제 (2026 수주 목표)
  {
    id: 'hpc',
    sessions: 5200,
    avgTimeOnPage: 4.2,
    viewDepth: 78,
    returnVisitRate: 52,
    multiContentRate: 45,
    inquiryCount: 95,
    paidRatio: 25,
    changeVsPrevious: 35,
  },
  {
    id: 'transformable-display',
    sessions: 4800,
    avgTimeOnPage: 4.0,
    viewDepth: 75,
    returnVisitRate: 48,
    multiContentRate: 42,
    inquiryCount: 88,
    paidRatio: 28,
    changeVsPrevious: 28,
  },
  // Core
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
    id: 'lg-p-pod',
    sessions: 4300,
    avgTimeOnPage: 3.6,
    viewDepth: 70,
    returnVisitRate: 44,
    multiContentRate: 36,
    inquiryCount: 78,
    paidRatio: 20,
    changeVsPrevious: 32,
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
  // Emerging
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
  // Monitoring
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
// Campaigns (캠페인) - settings.ts의 CAMPAIGN_SETTINGS에서 파생
// ─────────────────────────────────────────────────────────────

// 캠페인 타입 매핑
const mapCampaignType = (type: string): 'event' | 'advertising' | 'content' => {
  if (type === 'event') return 'event';
  if (type === 'advertising') return 'advertising';
  return 'content'; // webinar도 content로 매핑
};

// Tech On Board 캠페인 계층 구조 (2026 활성 캠페인)
const TECH_ON_BOARD_CAMPAIGNS: Campaign[] = [
  {
    id: 'tech-on-board-2026',
    name: 'Tech On Board',
    type: 'content',
    period: { start: '2026-01-01', end: '2026-06-30' },
    status: 'active',
    isActiveCampaign: true,
    hierarchy: {
      layer: 'theme',
      narrativeRole: 'narrative-immersion',
      sequenceOrder: 0,
    }
  },
  {
    id: 'tech-on-board-teasing',
    name: 'Reddit AI-Defined Vehicle Discussion',
    type: 'advertising',
    period: { start: '2025-12-15', end: '2026-01-05' },
    status: 'active',
    isActiveCampaign: false,
    hierarchy: {
      layer: 'teasing',
      parentCampaignId: 'tech-on-board-2026',
      narrativeRole: 'issue-seeding',
      sequenceOrder: 1,
    }
  },
  {
    id: 'tech-on-board-film',
    name: 'Tech On Board Campaign Film',
    type: 'content',
    period: { start: '2026-01-06', end: '2026-06-30' },
    status: 'active',
    isActiveCampaign: false,
    hierarchy: {
      layer: 'narrative-film',
      parentCampaignId: 'tech-on-board-2026',
      narrativeRole: 'narrative-immersion',
      sequenceOrder: 2,
    }
  },
  {
    id: 'tech-on-board-hpc',
    name: 'HPC (High-Performance Computing) Film',
    type: 'content',
    period: { start: '2026-01-20', end: '2026-06-30' },
    status: 'active',
    isActiveCampaign: false,
    hierarchy: {
      layer: 'core-pillar',
      parentCampaignId: 'tech-on-board-2026',
      narrativeRole: 'narrative-immersion',
      sequenceOrder: 3,
      coreTechPillar: 'hpc',
    }
  },
  {
    id: 'tech-on-board-transformable',
    name: 'Transformable Display Film',
    type: 'content',
    period: { start: '2026-01-20', end: '2026-06-30' },
    status: 'active',
    isActiveCampaign: false,
    hierarchy: {
      layer: 'core-pillar',
      parentCampaignId: 'tech-on-board-2026',
      narrativeRole: 'narrative-immersion',
      sequenceOrder: 3,
      coreTechPillar: 'transformable-display',
    }
  },
  {
    id: 'tech-on-board-landing',
    name: 'LG.com Tech On Board Hub',
    type: 'content',
    period: { start: '2026-01-06', end: '2026-06-30' },
    status: 'active',
    isActiveCampaign: false,
    hierarchy: {
      layer: 'landing',
      parentCampaignId: 'tech-on-board-2026',
      narrativeRole: 'judgment-formation',
      sequenceOrder: 4,
    }
  },
  {
    id: 'tech-on-board-linkedin-newsletter',
    name: 'LinkedIn Newsletter (GEO/AIO)',
    type: 'content',
    period: { start: '2026-01-15', end: '2026-06-30' },
    status: 'active',
    isActiveCampaign: false,
    hierarchy: {
      layer: 'distribution',
      parentCampaignId: 'tech-on-board-2026',
      narrativeRole: 'authority-validation',
      sequenceOrder: 5,
    }
  },
  {
    id: 'tech-on-board-linkedin-expert',
    name: 'LinkedIn Expert Answers & TLA',
    type: 'content',
    period: { start: '2026-02-01', end: '2026-06-30' },
    status: 'active',
    isActiveCampaign: false,
    hierarchy: {
      layer: 'authority',
      parentCampaignId: 'tech-on-board-2026',
      narrativeRole: 'authority-validation',
      sequenceOrder: 6,
    }
  },
];

// 기존 캠페인들 (히스토리)
const LEGACY_CAMPAIGNS: Campaign[] = CAMPAIGN_SETTINGS.filter(c => c.active).map(c => ({
  id: c.id,
  name: c.name,
  type: mapCampaignType(c.type),
  period: c.period,
  status: 'completed' as const,
  isActiveCampaign: false,
}));

// 전체 캠페인 목록 (Tech On Board + 히스토리)
export const CAMPAIGNS: Campaign[] = [
  ...TECH_ON_BOARD_CAMPAIGNS,
  ...LEGACY_CAMPAIGNS,
];

export const CAMPAIGN_IMPACTS: CampaignImpact[] = [
  {
    campaignId: 'lg-on-board-2026',
    influence: determineCampaignInfluence(85, 52),
    summary: 'HPC (High-Performance Computing)·Transformable Display 전략과제 MOFU 증가',
    metrics: {
      initialBefore: 58,
      initialAfter: 42,
      deepBefore: 42,
      deepAfter: 58,
      retention: 85,
    },
    technologyMovements: [
      { technologyId: 'hpc', stageBefore: 'initial', stageAfter: 'deep', movement: 'advanced' },
      { technologyId: 'transformable-display', stageBefore: 'initial', stageAfter: 'deep', movement: 'advanced' },
      { technologyId: 'digital-cockpit', stageBefore: 'deep', stageAfter: 'deep', movement: 'maintained' },
      { technologyId: 'lg-p-pod', stageBefore: 'initial', stageAfter: 'deep', movement: 'advanced' },
    ],
  },
  {
    campaignId: 'ces-2026',
    influence: determineCampaignInfluence(78, 45),
    summary: 'CES 전시 후 OEM 접촉 증가',
    metrics: {
      initialBefore: 65,
      initialAfter: 52,
      deepBefore: 35,
      deepAfter: 48,
      retention: 78,
    },
    technologyMovements: [
      { technologyId: 'hpc', stageBefore: 'deep', stageAfter: 'deep', movement: 'maintained' },
      { technologyId: 'transformable-display', stageBefore: 'deep', stageAfter: 'deep', movement: 'maintained' },
      { technologyId: 'digital-cockpit', stageBefore: 'initial', stageAfter: 'deep', movement: 'advanced' },
      { technologyId: 'vehicle-vision', stageBefore: 'initial', stageAfter: 'deep', movement: 'advanced' },
    ],
  },
  {
    campaignId: 'ai-on-board',
    influence: determineCampaignInfluence(72, 38),
    summary: 'AI 솔루션 인지도 상승',
    metrics: {
      initialBefore: 62,
      initialAfter: 55,
      deepBefore: 38,
      deepAfter: 45,
      retention: 72,
    },
    technologyMovements: [
      { technologyId: 'hpc', stageBefore: 'deep', stageAfter: 'deep', movement: 'maintained' },
      { technologyId: 'adas', stageBefore: 'initial', stageAfter: 'deep', movement: 'advanced' },
    ],
  },
  {
    campaignId: 'public-webinar-2026',
    influence: determineCampaignInfluence(88, 32),
    summary: 'Expert 대상 Thought Leadership, 재방문율 72%',
    metrics: {
      initialBefore: 55,
      initialAfter: 48,
      deepBefore: 45,
      deepAfter: 52,
      retention: 88,
    },
    technologyMovements: [
      { technologyId: 'hpc', stageBefore: 'deep', stageAfter: 'deep', movement: 'maintained' },
      { technologyId: 'transformable-display', stageBefore: 'deep', stageAfter: 'deep', movement: 'maintained' },
    ],
  },
];

export const MEDIA_ANALYSES: MediaAnalysis[] = [
  // LG on board 2026
  {
    campaignId: 'lg-on-board-2026',
    channel: 'linkedin_ads',
    role: 'accelerator',
    technologies: ['hpc', 'transformable-display', 'digital-cockpit'],
    evidence: 'OEM 의사결정권자 대상 ETR 5.2%, Thought Leadership 강화',
  },
  {
    campaignId: 'lg-on-board-2026',
    channel: 'google_ads',
    role: 'igniter',
    technologies: ['hpc', 'transformable-display'],
    evidence: 'Always-On 브랜드 인지도 유지, CTR 2.8%',
  },
  {
    campaignId: 'lg-on-board-2026',
    channel: 'youtube_ads',
    role: 'supporter',
    technologies: ['lg-p-pod', 'digital-cockpit'],
    evidence: 'Experience on Board 영상 VVC 평균 시청률 72%',
  },
  // CES 2026
  {
    campaignId: 'ces-2026',
    channel: 'linkedin_ads',
    role: 'accelerator',
    technologies: ['hpc', 'transformable-display', 'lg-p-pod'],
    evidence: '전략과제 집중 노출, ABM 타겟 도달률 85%',
  },
  {
    campaignId: 'ces-2026',
    channel: 'social',
    role: 'supporter',
    technologies: ['digital-cockpit', 'vehicle-vision'],
    evidence: 'Reddit 신규 채널 테스트, 기술 커뮤니티 반응 긍정적',
  },
  {
    campaignId: 'ces-2026',
    channel: 'google_ads',
    role: 'igniter',
    technologies: ['adas', 'ivi'],
    evidence: '이벤트 기간 집중 노출, 첫 접촉 유입 52% 차지',
  },
  // AI on Board
  {
    campaignId: 'ai-on-board',
    channel: 'linkedin_ads',
    role: 'accelerator',
    technologies: ['hpc', 'adas'],
    evidence: 'AI 솔루션 Thought Leader Ads CTR 3.5%, FTR +28%',
  },
];

// ─────────────────────────────────────────────────────────────
// Narrative Flow Data (Tech On Board 캠페인 여정 추적)
// ─────────────────────────────────────────────────────────────

export const NARRATIVE_FLOW_DATA: NarrativeFlowMetrics[] = [
  {
    sequence: [
      { layer: 'teasing', channel: 'reddit', timestamp: '2026-01-02', engagementDepth: 65 },
      { layer: 'narrative-film', channel: 'youtube_ads', timestamp: '2026-01-08', engagementDepth: 78 },
      { layer: 'core-pillar', channel: 'youtube_ads', timestamp: '2026-01-22', engagementDepth: 82 },
      { layer: 'landing', channel: 'lg_com', timestamp: '2026-01-25', engagementDepth: 70 },
    ],
    completionRate: 80,
  },
  {
    sequence: [
      { layer: 'teasing', channel: 'reddit', timestamp: '2026-01-03', engagementDepth: 58 },
      { layer: 'narrative-film', channel: 'youtube_ads', timestamp: '2026-01-10', engagementDepth: 72 },
    ],
    completionRate: 40,
    dropoffLayer: 'narrative-film',
  },
  {
    sequence: [
      { layer: 'narrative-film', channel: 'youtube_ads', timestamp: '2026-01-12', engagementDepth: 85 },
      { layer: 'core-pillar', channel: 'youtube_ads', timestamp: '2026-01-18', engagementDepth: 88 },
      { layer: 'landing', channel: 'lg_com', timestamp: '2026-01-20', engagementDepth: 75 },
      { layer: 'distribution', channel: 'linkedin_ads', timestamp: '2026-02-05', engagementDepth: 68 },
    ],
    completionRate: 100,
  },
];

export const LAYER_HANDOFF_DATA: LayerHandoffMetrics[] = [
  {
    fromLayer: 'teasing',
    toLayer: 'narrative-film',
    handoffRate: 42,
    avgTimeToNext: 3.5,
    engagementQuality: 'high',
  },
  {
    fromLayer: 'narrative-film',
    toLayer: 'core-pillar',
    handoffRate: 58,
    avgTimeToNext: 7.2,
    engagementQuality: 'high',
  },
  {
    fromLayer: 'core-pillar',
    toLayer: 'landing',
    handoffRate: 35,
    avgTimeToNext: 2.8,
    engagementQuality: 'medium',
  },
  {
    fromLayer: 'landing',
    toLayer: 'distribution',
    handoffRate: 28,
    avgTimeToNext: 12.5,
    engagementQuality: 'medium',
  },
  {
    fromLayer: 'distribution',
    toLayer: 'authority',
    handoffRate: 18,
    avgTimeToNext: 8.3,
    engagementQuality: 'low',
  },
];

// ─────────────────────────────────────────────────────────────
// Core Tech Pillar Performance (HPC vs Transformable Display)
// ─────────────────────────────────────────────────────────────

export const CORE_TECH_PILLAR_PERFORMANCE = {
  hpc: {
    pillarName: 'HPC (High-Performance Computing)',
    campaignAssets: [
      { id: 'tech-on-board-hpc', type: 'film' as const, views: 125000, watchTime: 78, depthSignal: 'high' as const },
      { id: 'hpc-landing-page', type: 'page' as const, sessions: 8500, avgTime: 4.2, revisitRate: 52 },
      { id: 'hpc-linkedin-posts', type: 'posts' as const, impressions: 450000, engagement: 3.8 },
    ],
    depthSignals: {
      watchTime: 78,
      revisitRate: 52,
      longReads: 65,
    },
    authoritySignals: {
      expertContentEngagement: 4.2,
      oemInquiries: 12,
    },
  },
  'transformable-display': {
    pillarName: 'Transformable Display',
    campaignAssets: [
      { id: 'tech-on-board-transformable', type: 'film' as const, views: 98000, watchTime: 72, depthSignal: 'high' as const },
      { id: 'transformable-landing-page', type: 'page' as const, sessions: 7200, avgTime: 3.8, revisitRate: 48 },
      { id: 'transformable-linkedin-posts', type: 'posts' as const, impressions: 380000, engagement: 3.5 },
    ],
    depthSignals: {
      watchTime: 72,
      revisitRate: 48,
      longReads: 58,
    },
    authoritySignals: {
      expertContentEngagement: 3.8,
      oemInquiries: 9,
    },
  },
};

// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// Channel Raw Data (채널별 원시 데이터)
// ─────────────────────────────────────────────────────────────

export const CHANNEL_RAW_DATA = {
  lgcom: {
    tofu: 12847,      // LG.com 첫 방문
    mofu: 2156,       // 재방문 + 체류 2분+ + 영상 50%+
    bofu: 71,         // 문의 건수
  },
  linkedin: {
    impressions: 285000,  // 조회수
    engagement: 8420,     // 좋아요 + 댓글 + 공유
    clicks: 4230,         // LG.com 유입 클릭
  },
  youtube: {
    views: 42000,         // 조회수
    watchTime50: 18500,   // 50% 이상 시청
  },
};

// 채널별 가중치 (settings.ts에서 가져옴)
const CHANNEL_WEIGHTS = {
  lgcom: getChannelWeight('lgcom'),       // Owned - 기준
  linkedin: getChannelWeight('linkedin'), // 주력 채널, 예산 비중 높음
  youtube: getChannelWeight('youtube'),   // 콘텐츠 소비
};

// 통합 퍼널 계산
// TOFU = LG.com × 1.0 + LinkedIn 조회 × 0.6 + YouTube 조회 × 0.4
const INTEGRATED_TOFU = Math.round(
  CHANNEL_RAW_DATA.lgcom.tofu * CHANNEL_WEIGHTS.lgcom +
  (CHANNEL_RAW_DATA.linkedin.impressions / 10) * CHANNEL_WEIGHTS.linkedin +  // 10으로 나눠 스케일 조정
  (CHANNEL_RAW_DATA.youtube.views / 10) * CHANNEL_WEIGHTS.youtube
);

// MOFU = LG.com MOFU + LinkedIn Engagement × 0.6 + YouTube 50%시청 × 0.4
const INTEGRATED_MOFU = Math.round(
  CHANNEL_RAW_DATA.lgcom.mofu * CHANNEL_WEIGHTS.lgcom +
  CHANNEL_RAW_DATA.linkedin.engagement * CHANNEL_WEIGHTS.linkedin +
  (CHANNEL_RAW_DATA.youtube.watchTime50 / 10) * CHANNEL_WEIGHTS.youtube
);

// BOFU = 문의 건수 (LG.com에서만 발생)
const INTEGRATED_BOFU = CHANNEL_RAW_DATA.lgcom.bofu;

// ─────────────────────────────────────────────────────────────
// Overall Status (전체 상태 - 통합 퍼널)
// ─────────────────────────────────────────────────────────────

export const OVERALL_STATUS: OverallStatus = {
  initial: { count: INTEGRATED_TOFU, changeVsLastMonth: 18.7 },
  deep: { count: INTEGRATED_MOFU, changeVsLastMonth: 22.4 },
  reachable: { count: INTEGRATED_BOFU, changeVsLastMonth: 15.3 },
  currentState: {
    direction: 'up',
    fromStage: 'initial',
    toStage: 'deep',
    paidInfluence: 'with_paid',
  },
  period: '2026-02',
};

export const STAGE_DISTRIBUTION: StageDistribution = {
  initial: { total: INTEGRATED_TOFU, organicRatio: 58, paidRatio: 42 },
  deep: { total: INTEGRATED_MOFU, organicRatio: 75, paidRatio: 25 },
  reachable: { total: INTEGRATED_BOFU, organicRatio: 89, paidRatio: 11 },
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
