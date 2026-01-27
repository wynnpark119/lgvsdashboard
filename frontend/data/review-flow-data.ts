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

export const DEMO_INITIAL_SIGNALS: StageSignal[] = [
  { name: '기술 콘텐츠 유입', level: 'high', description: '첫 접촉 발생' },
  { name: '체류 시간', level: 'medium', description: '평균 1분 47초' },
  { name: '영상 시청 깊이', level: 'medium', description: '50%+ 시청률 42%' },
];

export const DEMO_DEEP_SIGNALS: StageSignal[] = [
  { name: '재방문', level: 'medium', description: '30일 내 2회+ 28%' },
  { name: '반복 콘텐츠 소비', level: 'medium', description: '3개+ 소비 22%' },
  { name: '웨비나 / Inquiry', level: 'high', description: '479건 접촉' },
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
