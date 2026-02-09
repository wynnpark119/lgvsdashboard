/**
 * Types Index
 * 모든 타입 정의의 중앙 export
 */

// Technology Types
export type {
  ReviewStage,
  FlowDirection,
  PaidDependency,
  SignalType,
  Technology,
  TechnologyReviewState,
  TechnologyMetrics,
} from './technology';

export {
  TECHNOLOGIES,
  getTechnologyById,
  getTechnologyByName,
} from './technology';

// Campaign Types
export type {
  CampaignType,
  CampaignInfluence,
  MediaChannel,
  MediaRole,
  CampaignLayer,
  NarrativeRole,
  CampaignHierarchy,
  Campaign,
  CampaignImpact,
  MediaAnalysis,
  CampaignPeriod,
} from './campaign';

export {
  CAMPAIGN_TYPE_LABELS,
  CAMPAIGN_INFLUENCE_CONFIG,
  MEDIA_ROLE_CONFIG,
  MEDIA_CHANNEL_LABELS,
  CHANNEL_NARRATIVE_ROLES,
  CAMPAIGN_LAYER_LABELS,
} from './campaign';

// Metrics Types
export type {
  TrendDirection,
  TimePeriod,
  DataStage,
  TrendDataPoint,
  MetricItem,
  ChannelMetrics,
  OverallStatus,
  StageDistribution,
  MomentumCampaign,
  MomentumData,
  DataLimitation,
  DetailContext,
  NarrativeFlowMetrics,
  LayerHandoffMetrics,
} from './metrics';

// Funnel Types
export type {
  FunnelStage,
  FunnelMetrics,
  MQLScore,
  TechnologyFunnelState,
} from './funnel';

export {
  FUNNEL_STAGE_CONFIG,
  MQL_POTENTIAL_CONFIG,
  mapStageToFunnel,
  mapFunnelToStage,
  calculateMQLScore,
  isMQLQualified,
  getMQLPotential,
} from './funnel';
