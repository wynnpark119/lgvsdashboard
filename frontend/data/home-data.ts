/**
 * Home Data
 * seed.ts에서 데이터를 가져와 Home 페이지 형식으로 변환
 */

import {
  TECHNOLOGY_STATES,
  CAMPAIGNS,
  CAMPAIGN_IMPACTS,
  OVERALL_STATUS,
  STAGE_DISTRIBUTION,
  MOMENTUM_DATA,
} from './seed';
import { TECHNOLOGIES, getTechnologyById } from '@/types';
import type {
  OverallStatus,
  StageDistribution,
  MomentumData,
  CampaignInfluence,
  SignalType,
} from '@/types';

// ─────────────────────────────────────────────────────────────
// Types for Home page
// ─────────────────────────────────────────────────────────────

export interface TechnologySignal {
  id: string;
  name: string;
  stage: 'initial' | 'deep' | 'reachable';
  trend: number;
  trendDirection: 'up' | 'stable' | 'down';
  paidDependency: 'low' | 'medium' | 'high';
  paidRatio: number;
  signal: { type: SignalType; label: string };
  reviewIntensity: number;
}

export interface CampaignContext {
  id: string;
  name: string;
  period: { start: string; end: string };
  metrics: {
    before: { stage: 'initial' | 'deep' | 'reachable'; count: number };
    during: { stage: 'initial' | 'deep' | 'reachable'; count: number; change: 'up' | 'stable' | 'down' };
    after: { stage: 'initial' | 'deep' | 'reachable'; count: number };
  };
  analysis: {
    postRetention: number;
    baselineLift: number;
    influence: CampaignInfluence;
    description: string;
  };
}

// ─────────────────────────────────────────────────────────────
// Exported Data (seed.ts 기반)
// ─────────────────────────────────────────────────────────────

export const DEMO_OVERALL_STATUS: OverallStatus = OVERALL_STATUS;

export const DEMO_STAGE_DISTRIBUTION: StageDistribution = STAGE_DISTRIBUTION;

export const DEMO_TECHNOLOGY_SIGNALS: TechnologySignal[] = TECHNOLOGY_STATES.map((state) => {
  const tech = getTechnologyById(state.technologyId);
  return {
    id: state.technologyId,
    name: tech?.name || state.technologyId,
    stage: state.stage,
    trend: state.intensityChange,
    trendDirection: state.direction === 'advancing' ? 'up' as const : state.direction === 'declining' ? 'down' as const : 'stable' as const,
    paidDependency: state.paidDependency,
    paidRatio: state.paidRatio,
    signal: { type: state.signal.type as SignalType, label: state.signal.label },
    reviewIntensity: state.intensity,
  };
});

export const DEMO_MOMENTUM: MomentumData = {
  period: MOMENTUM_DATA.period,
  dataPoints: MOMENTUM_DATA.dataPoints.map((dp) => ({
    date: dp.date,
    value: dp.value,
    stage: dp.stage,
  })),
  campaigns: CAMPAIGNS.filter((c) => c.id === 'lg-on-board-2026' || c.id === 'ces-2026').map((c) => ({
    id: c.id,
    name: c.name,
    startDate: c.period.start,
    endDate: c.period.end,
  })),
  interpretation: MOMENTUM_DATA.interpretation,
};

export const DEMO_CAMPAIGNS: CampaignContext[] = CAMPAIGNS.map((campaign) => {
  const impact = CAMPAIGN_IMPACTS.find((i) => i.campaignId === campaign.id);
  return {
    id: campaign.id,
    name: campaign.name,
    period: campaign.period,
    metrics: {
      before: { stage: 'initial' as const, count: 1234 },
      during: { stage: 'deep' as const, count: 8542, change: 'up' as const },
      after: { stage: 'deep' as const, count: 3071 },
    },
    analysis: {
      postRetention: impact?.metrics.retention || 50,
      baselineLift: MOMENTUM_DATA.interpretation.changeVsBaseline,
      influence: impact?.influence || 'neutral',
      description: impact?.summary || '',
    },
  };
});
