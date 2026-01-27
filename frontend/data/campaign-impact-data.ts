/**
 * Campaign Impact Data
 * seed.ts에서 데이터를 가져와 Campaign Impact 페이지 형식으로 변환
 */

import {
  CAMPAIGNS as SEED_CAMPAIGNS,
  CAMPAIGN_IMPACTS,
  MEDIA_ANALYSES as SEED_MEDIA_ANALYSES,
  TECHNOLOGY_STATES,
  MOMENTUM_DATA,
} from './seed';
import { getTechnologyById } from '@/types';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type ImpactType = 'amplifier' | 'distorter' | 'neutral';
export type CampaignType = 'event' | 'advertising' | 'content';
export type MediaRole = 'igniter' | 'accelerator' | 'supporter' | 'noise';
export type MediaChannel = 'google_ads' | 'linkedin_ads' | 'youtube_ads' | 'social' | 'video' | 'lg_com';
export type Movement = 'advanced' | 'maintained' | 'declined';
export type Stage = 'initial' | 'deep';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  period: { start: string; end: string };
  impact: ImpactType;
  summary: string;
  metrics: {
    initialBefore: number;
    initialAfter: number;
    deepBefore: number;
    deepAfter: number;
    retention: number;
  };
}

export interface TechnologyMovement {
  id: string;
  name: string;
  movement: Movement;
  stageBefore: Stage;
  stageAfter: Stage;
  intensityChange: number;
}

export interface MediaAnalysis {
  channel: MediaChannel;
  role: MediaRole;
  technologies: string[];
  evidence: string;
}

export interface FlowTimelinePoint {
  phase: 'before' | 'during' | 'after';
  date: string;
  technologies: {
    id: string;
    name: string;
    stage: Stage;
    intensity: number;
  }[];
}

// ─────────────────────────────────────────────────────────────
// Exported Data (seed.ts 기반)
// ─────────────────────────────────────────────────────────────

export const DEMO_CAMPAIGNS: Campaign[] = SEED_CAMPAIGNS.map((campaign) => {
  const impact = CAMPAIGN_IMPACTS.find((i) => i.campaignId === campaign.id);
  return {
    id: campaign.id,
    name: campaign.name,
    type: campaign.type,
    period: campaign.period,
    impact: impact?.influence || 'neutral',
    summary: impact?.summary || '',
    metrics: {
      initialBefore: impact?.metrics.initialBefore || 65,
      initialAfter: impact?.metrics.initialAfter || 52,
      deepBefore: impact?.metrics.deepBefore || 35,
      deepAfter: impact?.metrics.deepAfter || 48,
      retention: impact?.metrics.retention || 50,
    },
  };
});

export const DEMO_TECHNOLOGY_MOVEMENTS: TechnologyMovement[] = CAMPAIGN_IMPACTS[0]?.technologyMovements.map((m) => {
  const tech = getTechnologyById(m.technologyId);
  const state = TECHNOLOGY_STATES.find((s) => s.technologyId === m.technologyId);
  return {
    id: m.technologyId,
    name: tech?.name || m.technologyId,
    movement: m.movement,
    stageBefore: m.stageBefore,
    stageAfter: m.stageAfter,
    intensityChange: state?.intensityChange || 0,
  };
}) || [];

export const DEMO_MEDIA_ANALYSIS: MediaAnalysis[] = SEED_MEDIA_ANALYSES.map((m) => ({
  channel: m.channel,
  role: m.role,
  technologies: m.technologies.map((tid) => getTechnologyById(tid)?.name || tid),
  evidence: m.evidence,
}));

export const DEMO_FLOW_TIMELINE: FlowTimelinePoint[] = [
  {
    phase: 'before',
    date: '2025-12',
    technologies: TECHNOLOGY_STATES.slice(0, 4).map((s) => ({
      id: s.technologyId,
      name: getTechnologyById(s.technologyId)?.name || s.technologyId,
      stage: s.stage === 'deep' ? 'initial' as const : s.stage as Stage,
      intensity: s.intensity - 2,
    })),
  },
  {
    phase: 'during',
    date: 'CES',
    technologies: TECHNOLOGY_STATES.slice(0, 4).map((s) => ({
      id: s.technologyId,
      name: getTechnologyById(s.technologyId)?.name || s.technologyId,
      stage: 'deep' as const,
      intensity: s.intensity + 1,
    })),
  },
  {
    phase: 'after',
    date: '2026-01',
    technologies: TECHNOLOGY_STATES.slice(0, 4).map((s) => ({
      id: s.technologyId,
      name: getTechnologyById(s.technologyId)?.name || s.technologyId,
      stage: s.stage as Stage,
      intensity: s.intensity,
    })),
  },
];

// ─────────────────────────────────────────────────────────────
// Config Exports
// ─────────────────────────────────────────────────────────────

export const IMPACT_CONFIG = {
  amplifier: { label: 'Amplifier', color: 'text-green-600', bgColor: 'bg-green-50', description: '기존 검토 강화' },
  distorter: { label: 'Distorter', color: 'text-yellow-600', bgColor: 'bg-yellow-50', description: '단기 반응만 유발' },
  neutral: { label: 'Neutral', color: 'text-gray-600', bgColor: 'bg-gray-50', description: '영향 미미' },
};

export const MEDIA_ROLE_CONFIG = {
  igniter: { label: 'Igniter', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: '🔥' },
  accelerator: { label: 'Accelerator', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '⚡' },
  supporter: { label: 'Supporter', color: 'text-green-600', bgColor: 'bg-green-50', icon: '🛡️' },
  noise: { label: 'Noise', color: 'text-gray-500', bgColor: 'bg-gray-100', icon: '📢' },
};

export const CHANNEL_LABELS: Record<MediaChannel, string> = {
  google_ads: 'Google Ads',
  linkedin_ads: 'LinkedIn Ads',
  youtube_ads: 'YouTube Ads',
  social: 'Social Media',
  video: 'Video Content',
  lg_com: 'LG.com',
};
