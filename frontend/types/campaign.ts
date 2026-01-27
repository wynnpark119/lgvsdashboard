/**
 * Campaign Types
 * 캠페인/광고/이벤트 관련 타입 정의
 */

// Campaign Types (캠페인 유형)
export type CampaignType = 'event' | 'advertising' | 'content';

// Campaign Influence (캠페인 영향 분류)
export type CampaignInfluence = 'amplifier' | 'distorter' | 'neutral';

// Media Channel (미디어 채널)
export type MediaChannel = 
  | 'google_ads' 
  | 'linkedin_ads' 
  | 'youtube_ads' 
  | 'social' 
  | 'video'
  | 'lg_com';

// Media Role (미디어 역할)
export type MediaRole = 'igniter' | 'accelerator' | 'supporter' | 'noise';

/**
 * Campaign (캠페인 정의)
 */
export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  period: {
    start: string;  // YYYY-MM-DD
    end: string;
  };
}

/**
 * Campaign Impact (캠페인 영향 분석)
 */
export interface CampaignImpact {
  campaignId: string;
  
  // 영향 분류
  influence: CampaignInfluence;
  summary: string;  // 한 줄 해석
  
  // Before/After 비교
  metrics: {
    initialBefore: number;  // Initial Review % before
    initialAfter: number;
    deepBefore: number;     // Deep Review % before
    deepAfter: number;
    retention: number;      // 종료 후 유지율
  };
  
  // 기술별 이동
  technologyMovements: {
    technologyId: string;
    stageBefore: 'initial' | 'deep';
    stageAfter: 'initial' | 'deep';
    movement: 'advanced' | 'maintained' | 'declined';
  }[];
}

/**
 * Media Analysis (미디어 역할 분석)
 */
export interface MediaAnalysis {
  campaignId: string;
  channel: MediaChannel;
  role: MediaRole;
  technologies: string[];  // 영향받은 기술 ID
  evidence: string;        // 판단 근거
}

/**
 * Campaign Period (캠페인 기간 표시용)
 */
export interface CampaignPeriod {
  campaignId: string;
  name: string;
  start: string;
  end: string;
}

/**
 * 캠페인 유형 레이블
 */
export const CAMPAIGN_TYPE_LABELS: Record<CampaignType, { label: string; color: string }> = {
  event: { label: '이벤트', color: 'bg-purple-100 text-purple-700' },
  advertising: { label: '광고', color: 'bg-blue-100 text-blue-700' },
  content: { label: '콘텐츠', color: 'bg-green-100 text-green-700' },
};

/**
 * 캠페인 영향 설정
 */
export const CAMPAIGN_INFLUENCE_CONFIG: Record<CampaignInfluence, {
  label: string;
  color: string;
  bgColor: string;
  description: string;
}> = {
  amplifier: {
    label: 'Amplifier',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: '기존 검토 강화',
  },
  distorter: {
    label: 'Distorter',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    description: '단기 반응만 유발',
  },
  neutral: {
    label: 'Neutral',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    description: '영향 미미',
  },
};

/**
 * 미디어 역할 설정
 */
export const MEDIA_ROLE_CONFIG: Record<MediaRole, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}> = {
  igniter: {
    label: 'Igniter',
    icon: '🔥',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: '검토 시작 유발',
  },
  accelerator: {
    label: 'Accelerator',
    icon: '⚡',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: '초기→심화 가속',
  },
  supporter: {
    label: 'Supporter',
    icon: '🛡️',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: '검토 유지 기여',
  },
  noise: {
    label: 'Noise',
    icon: '📢',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    description: '일시적 반응만',
  },
};

/**
 * 미디어 채널 레이블
 */
export const MEDIA_CHANNEL_LABELS: Record<MediaChannel, string> = {
  google_ads: 'Google Ads',
  linkedin_ads: 'LinkedIn Ads',
  youtube_ads: 'YouTube Ads',
  social: 'Social Media',
  video: 'Video Content',
  lg_com: 'LG.com',
};
