/**
 * Review Flow Data
 * seed.ts에서 데이터를 가져와 Review Flow 페이지 형식으로 변환
 */

import {
  TECHNOLOGY_STATES,
  MOMENTUM_DATA,
  OVERALL_STATUS,
} from './seed';
import { TECHNOLOGIES, getTechnologyById } from '@/types';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type FlowDirection = 'advancing' | 'stable' | 'declining';
export type PaidDependency = 'low' | 'medium' | 'high';
export type SignalLevel = 'low' | 'medium' | 'high';
export type Stage = 'initial' | 'deep' | 'reachable';

export interface FlowNode {
  id: string;
  name: string;
  stage: Stage;
  intensity: number;
  direction: FlowDirection;
  paidDependency: PaidDependency;
  actionHint: string;
}

export interface StageSignal {
  name: string;
  level: SignalLevel;
  description: string;
}

export interface TrendDataPoint {
  date: string;
  intensity: number;
  stage: 'baseline' | 'campaign' | 'post_campaign';
}

// ─────────────────────────────────────────────────────────────
// Exported Data (seed.ts 기반)
// ─────────────────────────────────────────────────────────────

export const DEMO_FLOW_NODES: FlowNode[] = TECHNOLOGY_STATES.map((state) => {
  const tech = getTechnologyById(state.technologyId);
  return {
    id: state.technologyId,
    name: tech?.name || state.technologyId,
    stage: state.stage,
    intensity: state.intensity,
    direction: state.direction,
    paidDependency: state.paidDependency,
    actionHint: state.signal.actionHint || '관찰 필요',
  };
});

// TOFU 신호 (통합 채널: LinkedIn + LG.com + YouTube)
export const DEMO_INITIAL_SIGNALS: StageSignal[] = [
  { name: 'LinkedIn 조회', level: 'high', description: '285K 조회 (기여 54%)' },
  { name: 'LG.com 첫 방문', level: 'high', description: '12.8K 방문 (기여 41%)' },
  { name: 'YouTube 조회', level: 'medium', description: '42K 조회 (기여 5%)' },
];

// MOFU 신호 (통합 Engagement)
export const DEMO_DEEP_SIGNALS: StageSignal[] = [
  { name: 'LinkedIn Engagement', level: 'high', description: '8.4K 상호작용 (기여 58%)' },
  { name: 'LG.com 재방문·체류', level: 'medium', description: '2.1K 재방문 (기여 34%)' },
  { name: 'YouTube 50%+ 시청', level: 'medium', description: '18.5K 시청 (기여 8%)' },
];

export const DEMO_FLOW_TREND: TrendDataPoint[] = MOMENTUM_DATA.dataPoints.map((dp) => ({
  date: dp.date,
  intensity: dp.value,
  stage: dp.stage || 'baseline',
}));

export const FLOW_SUMMARY = {
  period: '2025-12',
  overallDirection: 'advancing' as FlowDirection,
  stageDistribution: {
    initial: { 
      count: DEMO_FLOW_NODES.filter((n) => n.stage === 'initial').length, 
      avgIntensity: 4.5 
    },
    deep: { 
      count: DEMO_FLOW_NODES.filter((n) => n.stage === 'deep').length, 
      avgIntensity: 7.5 
    },
    reachable: { 
      count: DEMO_FLOW_NODES.filter((n) => n.stage === 'reachable').length, 
      avgIntensity: 0 
    },
  },
  transitionRate: {
    initialToDeep: 22.1,
    deepToReachable: 22.2,
  },
  stability: 'stable' as const,
};
