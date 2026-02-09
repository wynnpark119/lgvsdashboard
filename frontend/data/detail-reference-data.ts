/**
 * Detail Reference Data
 * seed.ts에서 데이터를 가져와 Detail 페이지 형식으로 변환
 */

import { TECHNOLOGY_STATES, CAMPAIGNS, MOMENTUM_DATA } from './seed';
import { getTechnologyById } from '@/types';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type SourceMenu = 'campaign-impact';
export type Channel = 'lg_com' | 'linkedin' | 'youtube' | 'google_ads';
export type ChangeDirection = 'up' | 'down' | 'stable';

export interface DetailContext {
  technology: { id: string; name: string };
  period: { start: string; end: string };
  source: SourceMenu;
  purpose: string;
  relatedCampaign?: string;
}

export interface MetricItem {
  name: string;
  value: number;
  unit: string;
  change?: number;
  changeDirection?: ChangeDirection;
}

export interface ChannelMetrics {
  channel: Channel;
  label: string;
  metrics: MetricItem[];
}

export interface TrendDataPoint {
  date: string;
  value: number;
  isReviewFlowPoint?: boolean;
  isCampaignPeriod?: boolean;
}

export interface TrendData {
  metric: string;
  label: string;
  data: TrendDataPoint[];
}

export interface DataLimitation {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

// ─────────────────────────────────────────────────────────────
// Exported Data (seed.ts 기반)
// ─────────────────────────────────────────────────────────────

const firstTech = TECHNOLOGY_STATES[0];
const techInfo = getTechnologyById(firstTech?.technologyId || 'digital-cockpit');

export const DEMO_CONTEXT: DetailContext = {
  technology: {
    id: firstTech?.technologyId || 'digital-cockpit',
    name: techInfo?.name || 'Digital Cockpit',
  },
  period: { start: '2025-12-01', end: '2026-01-23' },
  source: 'campaign-impact',
  purpose: 'Tech On Board 캠페인 효과 검증',
  relatedCampaign: CAMPAIGNS[0]?.name || 'Tech On Board',
};

export const DEMO_CHANNEL_METRICS: ChannelMetrics[] = [
  {
    channel: 'lg_com',
    label: 'LG.com',
    metrics: [
      { name: 'Sessions', value: 12847, unit: '', change: 23.5, changeDirection: 'up' },
      { name: 'Pageviews', value: 34521, unit: '', change: 18.2, changeDirection: 'up' },
      { name: 'Avg. Time on Page', value: 2.34, unit: 'min', change: 12.1, changeDirection: 'up' },
      { name: 'Bounce Rate', value: 42.3, unit: '%', change: -5.2, changeDirection: 'down' },
    ],
  },
  {
    channel: 'linkedin',
    label: 'LinkedIn',
    metrics: [
      { name: 'Impressions', value: 245800, unit: '', change: 45.2, changeDirection: 'up' },
      { name: 'Clicks', value: 4823, unit: '', change: 38.7, changeDirection: 'up' },
      { name: 'CTR', value: 1.96, unit: '%', change: -4.5, changeDirection: 'down' },
      { name: 'Engagement Rate', value: 4.2, unit: '%', change: 8.3, changeDirection: 'up' },
    ],
  },
  {
    channel: 'youtube',
    label: 'YouTube',
    metrics: [
      { name: 'Views', value: 89234, unit: '', change: 52.1, changeDirection: 'up' },
      { name: 'Watch Time', value: 4521, unit: 'hrs', change: 48.3, changeDirection: 'up' },
      { name: 'Avg. View Duration', value: 3.04, unit: 'min', change: -2.1, changeDirection: 'down' },
      { name: 'View Depth (50%+)', value: 68.2, unit: '%', change: 5.4, changeDirection: 'up' },
    ],
  },
  {
    channel: 'google_ads',
    label: 'Google Ads',
    metrics: [
      { name: 'Impressions', value: 523400, unit: '', change: 32.1, changeDirection: 'up' },
      { name: 'Clicks', value: 8742, unit: '', change: 28.5, changeDirection: 'up' },
      { name: 'CTR', value: 1.67, unit: '%', change: -2.7, changeDirection: 'down' },
      { name: 'Cost', value: 12450, unit: 'USD', change: 15.2, changeDirection: 'up' },
      { name: 'CPC', value: 1.42, unit: 'USD', change: -10.3, changeDirection: 'down' },
    ],
  },
];

export const DEMO_TREND_DATA: TrendData[] = [
  {
    metric: 'sessions',
    label: 'Sessions',
    data: MOMENTUM_DATA.dataPoints.map((dp) => ({
      date: dp.date,
      value: Math.round(dp.value * 100),
      isCampaignPeriod: dp.stage === 'campaign',
      isReviewFlowPoint: dp.stage === 'campaign' && dp.value > 8,
    })),
  },
  {
    metric: 'time_on_page',
    label: 'Avg. Time on Page (min)',
    data: MOMENTUM_DATA.dataPoints.map((dp) => ({
      date: dp.date,
      value: dp.value / 3,
      isCampaignPeriod: dp.stage === 'campaign',
      isReviewFlowPoint: dp.stage === 'campaign' && dp.value > 8,
    })),
  },
  {
    metric: 'view_depth',
    label: 'View Depth 50%+ (%)',
    data: MOMENTUM_DATA.dataPoints.map((dp) => ({
      date: dp.date,
      value: dp.value * 7 + 10,
      isCampaignPeriod: dp.stage === 'campaign',
      isReviewFlowPoint: dp.stage === 'campaign' && dp.value > 8,
    })),
  },
];

export const DEMO_LIMITATIONS: DataLimitation[] = [
  {
    title: 'CRM/매출 데이터 미포함',
    description: '실제 구매/계약 전환은 별도 확인 필요. 이 대시보드는 디지털 접점 데이터만 포함합니다.',
    severity: 'warning',
  },
  {
    title: 'OEM 식별 한계',
    description: 'IP 기반 추정이므로 정확도 약 70% 수준. 개인 VPN 사용 시 식별 불가.',
    severity: 'warning',
  },
  {
    title: 'Paid/Organic 혼합',
    description: '동일 사용자가 두 채널 모두에서 집계될 수 있음. 중복 제거 미적용.',
    severity: 'info',
  },
  {
    title: '데이터 지연 (Latency)',
    description: 'GA4 기준 최대 24시간 지연 가능. LinkedIn/YouTube는 48시간까지 지연 가능.',
    severity: 'info',
  },
  {
    title: '크로스 디바이스 한계',
    description: '동일 사용자의 멀티 디바이스 접속은 별도 세션으로 집계됨.',
    severity: 'info',
  },
];

export const CHANNEL_ICONS: Record<Channel, string> = {
  lg_com: '🌐',
  linkedin: '💼',
  youtube: '📺',
  google_ads: '📢',
};
