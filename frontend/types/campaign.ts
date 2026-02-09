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
  | 'reddit'
  | 'social' 
  | 'video'
  | 'lg_com';

// Media Role (미디어 역할)
export type MediaRole = 'igniter' | 'accelerator' | 'supporter' | 'noise';

// Campaign Layer (Tech On Board 캠페인 계층)
export type CampaignLayer = 
  | 'theme'           // Tech On Board (Parent)
  | 'teasing'         // Reddit Ads/AMA
  | 'narrative-film'  // Campaign Film
  | 'core-pillar'     // HPC/Transformable Display Films
  | 'landing'         // LG.com Tech On Board Page
  | 'distribution'    // LinkedIn Newsletter/Posts
  | 'authority';      // LinkedIn Expert/TLA

// Narrative Role (채널의 Narrative 역할)
export type NarrativeRole = 
  | 'issue-seeding'        // Reddit - 이슈 발굴
  | 'narrative-immersion'  // YouTube - Narrative 전달
  | 'judgment-formation'   // LG.com - 판단 형성
  | 'authority-validation'; // LinkedIn - 권위 검증

/**
 * Campaign Hierarchy (캠페인 계층 구조)
 * Tech On Board 같은 계층형 캠페인에만 사용
 */
export interface CampaignHierarchy {
  layer: CampaignLayer;
  parentCampaignId?: string;  // 부모 캠페인 ID (Tech On Board)
  narrativeRole: NarrativeRole;
  sequenceOrder: number;      // Flow 순서
  coreTechPillar?: 'hpc' | 'transformable-display';  // Core Tech Pillar 구분
}

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
  hierarchy?: CampaignHierarchy;  // Tech On Board 같은 계층형 캠페인용
  status?: 'active' | 'completed' | 'planned';  // 캠페인 상태
  isActiveCampaign?: boolean;  // 현재 활성 캠페인 여부 (Home에 표시)
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
  reddit: 'Reddit',
  social: 'Social Media',
  video: 'Video Content',
  lg_com: 'LG.com',
};

/**
 * 채널의 Narrative Role 매핑
 * 채널을 성과 엔드포인트가 아닌 Narrative Carrier로 재해석
 */
export const CHANNEL_NARRATIVE_ROLES: Record<MediaChannel, {
  role: NarrativeRole;
  label: string;
  description: string;
}> = {
  reddit: {
    role: 'issue-seeding',
    label: 'Issue Seeding',
    description: 'AI-Defined Vehicle 이슈 발굴 및 증폭'
  },
  youtube_ads: {
    role: 'narrative-immersion',
    label: 'Narrative Immersion',
    description: 'Tech On Board 철학 전달'
  },
  video: {
    role: 'narrative-immersion',
    label: 'Narrative Immersion',
    description: '기술 스토리 전달'
  },
  lg_com: {
    role: 'judgment-formation',
    label: 'Judgment Formation',
    description: '기술 이해 및 판단 형성'
  },
  linkedin_ads: {
    role: 'authority-validation',
    label: 'Authority & Validation',
    description: '전문성 검증 및 신뢰 구축'
  },
  social: {
    role: 'authority-validation',
    label: 'Authority & Validation',
    description: '소셜 신뢰 구축'
  },
  google_ads: {
    role: 'issue-seeding',
    label: 'Issue Seeding',
    description: '검색 의도 발굴'
  },
};

/**
 * Campaign Layer 레이블
 */
export const CAMPAIGN_LAYER_LABELS: Record<CampaignLayer, string> = {
  theme: 'Campaign Theme',
  teasing: 'Teasing',
  'narrative-film': 'Narrative Film',
  'core-pillar': 'Core Tech Pillar',
  landing: 'Landing Hub',
  distribution: 'Distribution',
  authority: 'Authority Content',
};
