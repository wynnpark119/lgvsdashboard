/**
 * Metrics Types
 * 지표/측정 관련 타입 정의
 */

// Trend Direction (추세 방향)
export type TrendDirection = 'up' | 'stable' | 'down';

// Time Period (기간)
export type TimePeriod = '30d' | '60d' | '90d';

// Data Stage (데이터 구간)
export type DataStage = 'baseline' | 'campaign' | 'post_campaign';

/**
 * Trend Data Point (추세 데이터 포인트)
 */
export interface TrendDataPoint {
  date: string;
  value: number;
  stage?: DataStage;
  isReviewFlowPoint?: boolean;  // 단계 이동 시점
  isCampaignPeriod?: boolean;   // 캠페인 기간
}

/**
 * Metric Item (지표 항목)
 */
export interface MetricItem {
  name: string;
  value: number;
  unit: string;
  change?: number;
  changeDirection?: TrendDirection;
}

/**
 * Channel Metrics (채널별 지표)
 */
export interface ChannelMetrics {
  channel: string;
  label: string;
  icon?: string;
  metrics: MetricItem[];
}

/**
 * Overall Status (전체 상태)
 */
export interface OverallStatus {
  initial: { count: number; changeVsLastMonth: number };
  deep: { count: number; changeVsLastMonth: number };
  reachable: { count: number; changeVsLastMonth: number };
  currentState: {
    direction: TrendDirection;
    fromStage: 'initial' | 'deep' | 'reachable';
    toStage: 'initial' | 'deep' | 'reachable';
    paidInfluence: 'with_paid' | 'organic_driven' | 'neutral';
  };
  period: string;
}

/**
 * Stage Distribution (단계별 분포)
 */
export interface StageDistribution {
  initial: { total: number; organicRatio: number; paidRatio: number };
  deep: { total: number; organicRatio: number; paidRatio: number };
  reachable: { total: number; organicRatio: number; paidRatio: number };
  interpretation: 'healthy' | 'dependent' | 'warning';
}

/**
 * Momentum Campaign (모멘텀 캠페인)
 */
export interface MomentumCampaign {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

/**
 * Momentum Data (모멘텀 데이터)
 */
export interface MomentumData {
  period: TimePeriod;
  dataPoints: TrendDataPoint[];
  campaigns: MomentumCampaign[];
  interpretation: {
    preIntensity: number;
    peakIntensity: number;
    postIntensity: number;
    effect: 'amplifier' | 'distorter' | 'neutral';
    changeVsBaseline: number;
  };
}

/**
 * Data Limitation (데이터 한계)
 */
export interface DataLimitation {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

/**
 * Detail Context (상세 페이지 컨텍스트)
 */
export interface DetailContext {
  technology: {
    id: string;
    name: string;
  };
  period: {
    start: string;
    end: string;
  };
  source: 'review-flow' | 'campaign-impact';
  purpose: string;
  relatedCampaign?: string;
}
