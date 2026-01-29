/**
 * Settings Data
 * 세팅 관리용 데이터 구조 및 예시 데이터
 */

// ─────────────────────────────────────────────────────────────
// 기술 키워드 관리
// ─────────────────────────────────────────────────────────────

export interface Technology {
  id: string;
  name: string;
  nameKo: string;
  category: 'strategic' | 'core' | 'emerging' | 'monitoring';
  priority: number; // 1-5, 높을수록 중요
  description?: string;
  relatedCampaigns?: string[];
  urlPatterns?: string[]; // LG.com URL 패턴
  active: boolean;
}

export const TECHNOLOGY_SETTINGS: Technology[] = [
  // 전략과제 (2026 수주 목표)
  {
    id: 'hpc',
    name: 'HPC',
    nameKo: 'High-Performance Computing',
    category: 'strategic',
    priority: 5,
    description: '2026 수주 목표 전략과제 - 차량용 고성능 컴퓨팅 플랫폼',
    urlPatterns: ['/vs/connectivity/hpc*', '/vs/solutions/hpc*'],
    relatedCampaigns: ['lg-on-board-2026', 'ces-2026', 'ai-on-board'],
    active: true,
  },
  {
    id: 'transformable-display',
    name: 'Transformable Display',
    nameKo: '트랜스포머블 디스플레이',
    category: 'strategic',
    priority: 5,
    description: '2026 수주 목표 전략과제 - 형태 변환 가능 차량 디스플레이',
    urlPatterns: ['/vs/display/transformable*', '/vs/solutions/display*'],
    relatedCampaigns: ['lg-on-board-2026', 'ces-2026'],
    active: true,
  },
  // Core
  {
    id: 'digital-cockpit',
    name: 'Digital Cockpit',
    nameKo: '디지털 콕핏',
    category: 'core',
    priority: 4,
    description: 'Experience on Board 핵심 - 통합 차량 디지털 경험',
    urlPatterns: ['/vs/solutions/cockpit*', '/vs/solutions/digital-cockpit*'],
    relatedCampaigns: ['experience-on-board', 'ces-2026'],
    active: true,
  },
  {
    id: 'lg-p-pod',
    name: 'LG P-pod',
    nameKo: 'LG P-pod',
    category: 'core',
    priority: 4,
    description: 'CES 2026 신규 공개 - Total In-vehicle Experience 솔루션',
    urlPatterns: ['/vs/solutions/p-pod*', '/vs/labworks/p-pod*'],
    relatedCampaigns: ['experience-on-board', 'ces-2026'],
    active: true,
  },
  {
    id: 'vehicle-vision',
    name: 'Vehicle Vision',
    nameKo: '비히클 비전',
    category: 'core',
    priority: 3,
    description: '차량용 카메라 및 비전 솔루션',
    urlPatterns: ['/vs/solutions/vision*', '/vs/connectivity/vision*'],
    relatedCampaigns: ['ces-2026'],
    active: true,
  },
  {
    id: 'adas',
    name: 'ADAS',
    nameKo: '첨단 운전자 지원 시스템',
    category: 'core',
    priority: 3,
    description: 'AI on Board 캠페인 연계 - 센서 퓨전 기반 ADAS',
    urlPatterns: ['/vs/solutions/adas*', '/vs/connectivity/adas*'],
    relatedCampaigns: ['ai-on-board'],
    active: true,
  },
  // Emerging
  {
    id: 'ivi',
    name: 'IVI',
    nameKo: '인포테인먼트',
    category: 'emerging',
    priority: 2,
    description: 'webOS Auto 기반 인포테인먼트 시스템',
    urlPatterns: ['/vs/solutions/ivi*', '/vs/infotainment*'],
    relatedCampaigns: [],
    active: true,
  },
  {
    id: 'telematics',
    name: 'Telematics',
    nameKo: '텔레매틱스',
    category: 'emerging',
    priority: 2,
    description: '커넥티드 카 텔레매틱스 솔루션',
    urlPatterns: ['/vs/connectivity/telematics*'],
    relatedCampaigns: [],
    active: true,
  },
  // Monitoring
  {
    id: 'automotive-display',
    name: 'Automotive Display',
    nameKo: '오토모티브 디스플레이',
    category: 'monitoring',
    priority: 1,
    description: 'P-OLED 기반 차량용 디스플레이',
    urlPatterns: ['/vs/display/automotive*'],
    relatedCampaigns: [],
    active: true,
  },
];

// ─────────────────────────────────────────────────────────────
// 캠페인 관리
// ─────────────────────────────────────────────────────────────

export interface CampaignSetting {
  id: string;
  name: string;
  type: 'advertising' | 'content' | 'event' | 'webinar';
  period: {
    start: string;
    end: string;
  };
  utmCampaign: string; // Paid 매칭용 UTM 값
  technologies: string[]; // 연관 기술 ID
  contents: CampaignContent[]; // 하위 콘텐츠
  channels: string[]; // 집행 채널
  description?: string;
  active: boolean;
}

export interface CampaignContent {
  id: string;
  title: string;
  channel: 'lgcom' | 'linkedin' | 'youtube' | 'newsletter' | 'webinar';
  type: 'landing-page' | 'article' | 'video' | 'social-post' | 'whitepaper' | 'webinar-session';
  url?: string; // LG.com URL
  postId?: string; // 소셜 게시물 ID
  videoId?: string; // YouTube 영상 ID
  technology: string; // 주요 연관 기술
  publishDate: string;
}

export const CAMPAIGN_SETTINGS: CampaignSetting[] = [
  {
    id: 'ces-2026',
    name: 'CES 2026',
    type: 'event',
    period: { start: '2026-01-07', end: '2026-01-10' },
    utmCampaign: 'ces2026',
    technologies: ['hpc', 'transformable-display', 'lg-p-pod', 'digital-cockpit'],
    channels: ['linkedin', 'youtube', 'google-ads', 'lgcom'],
    description: 'CES 2026 전시회 - 전략과제 중심 기술 공개',
    active: true,
    contents: [
      // LG.com
      {
        id: 'ces-main-landing',
        title: 'CES 2026 메인 랜딩페이지',
        channel: 'lgcom',
        type: 'landing-page',
        url: '/vs/events/ces-2026',
        technology: 'hpc',
        publishDate: '2025-12-15',
      },
      {
        id: 'ces-hpc-page',
        title: 'CES 2026 HPC 전시 페이지',
        channel: 'lgcom',
        type: 'landing-page',
        url: '/vs/events/ces-2026/hpc',
        technology: 'hpc',
        publishDate: '2026-01-03',
      },
      {
        id: 'ces-display-page',
        title: 'CES 2026 Transformable Display 페이지',
        channel: 'lgcom',
        type: 'landing-page',
        url: '/vs/events/ces-2026/display',
        technology: 'transformable-display',
        publishDate: '2026-01-03',
      },
      {
        id: 'ces-ppod-page',
        title: 'LG P-pod 제품 소개',
        channel: 'lgcom',
        type: 'landing-page',
        url: '/vs/solutions/p-pod',
        technology: 'lg-p-pod',
        publishDate: '2026-01-05',
      },
      // LinkedIn
      {
        id: 'ces-teaser-linkedin',
        title: 'CES 2026 티저 영상 포스트',
        channel: 'linkedin',
        type: 'social-post',
        postId: 'urn:li:share:7012345678901234567',
        technology: 'hpc',
        publishDate: '2025-12-20',
      },
      {
        id: 'ces-hpc-linkedin',
        title: 'HPC Technology Reveal 포스트',
        channel: 'linkedin',
        type: 'social-post',
        postId: 'urn:li:share:7012345678901234568',
        technology: 'hpc',
        publishDate: '2026-01-07',
      },
      {
        id: 'ces-display-linkedin',
        title: 'Transformable Display 공개 포스트',
        channel: 'linkedin',
        type: 'social-post',
        postId: 'urn:li:share:7012345678901234569',
        technology: 'transformable-display',
        publishDate: '2026-01-08',
      },
      {
        id: 'ces-ppod-linkedin',
        title: 'LG P-pod First Look 포스트',
        channel: 'linkedin',
        type: 'social-post',
        postId: 'urn:li:share:7012345678901234570',
        technology: 'lg-p-pod',
        publishDate: '2026-01-09',
      },
      // YouTube
      {
        id: 'ces-hpc-demo-video',
        title: 'CES 2026 HPC Demo 영상',
        channel: 'youtube',
        type: 'video',
        videoId: 'abc123def456',
        technology: 'hpc',
        publishDate: '2026-01-07',
      },
      {
        id: 'ces-ppod-reveal-video',
        title: 'LG P-pod CES 2026 Reveal',
        channel: 'youtube',
        type: 'video',
        videoId: 'ghi789jkl012',
        technology: 'lg-p-pod',
        publishDate: '2026-01-08',
      },
      {
        id: 'ces-display-video',
        title: 'Transformable Display: Form Factor Innovation',
        channel: 'youtube',
        type: 'video',
        videoId: 'mno345pqr678',
        technology: 'transformable-display',
        publishDate: '2026-01-09',
      },
    ],
  },
  {
    id: 'lg-on-board-2026',
    name: 'LG on board 2026',
    type: 'advertising',
    period: { start: '2026-01-01', end: '2026-12-31' },
    utmCampaign: 'lgonboard2026',
    technologies: ['hpc', 'transformable-display', 'digital-cockpit', 'lg-p-pod'],
    channels: ['linkedin', 'google-ads', 'youtube', 'meta', 'reddit'],
    description: '연간 브랜드 캠페인 - 전략과제 소재화',
    active: true,
    contents: [
      {
        id: 'lgob-main-landing',
        title: 'LG on board 2026 캠페인 페이지',
        channel: 'lgcom',
        type: 'landing-page',
        url: '/vs/campaign/lg-on-board',
        technology: 'hpc',
        publishDate: '2026-01-01',
      },
      {
        id: 'lgob-hpc-whitepaper',
        title: 'HPC Technical Whitepaper',
        channel: 'lgcom',
        type: 'whitepaper',
        url: '/vs/resources/hpc-whitepaper',
        technology: 'hpc',
        publishDate: '2025-12-01',
      },
      {
        id: 'lgob-display-whitepaper',
        title: 'Transformable Display Technology Overview',
        channel: 'lgcom',
        type: 'whitepaper',
        url: '/vs/resources/transformable-display-whitepaper',
        technology: 'transformable-display',
        publishDate: '2025-12-15',
      },
      // LinkedIn Thought Leader Ads
      {
        id: 'lgob-tl-hpc',
        title: 'HPC Thought Leader 포스트',
        channel: 'linkedin',
        type: 'social-post',
        postId: 'urn:li:share:7012345678901234580',
        technology: 'hpc',
        publishDate: '2026-01-15',
      },
      {
        id: 'lgob-tl-display',
        title: 'Display Innovation Thought Leader 포스트',
        channel: 'linkedin',
        type: 'social-post',
        postId: 'urn:li:share:7012345678901234581',
        technology: 'transformable-display',
        publishDate: '2026-01-22',
      },
    ],
  },
  {
    id: 'ai-on-board',
    name: 'AI on Board',
    type: 'content',
    period: { start: '2026-01-01', end: '2026-06-30' },
    utmCampaign: 'aionboard',
    technologies: ['hpc', 'adas', 'vehicle-vision'],
    channels: ['linkedin', 'youtube', 'lgcom'],
    description: 'AI 기반 차량 솔루션 캠페인',
    active: true,
    contents: [
      {
        id: 'aiob-landing',
        title: 'AI on Board 캠페인 페이지',
        channel: 'lgcom',
        type: 'landing-page',
        url: '/vs/campaign/ai-on-board',
        technology: 'hpc',
        publishDate: '2026-01-01',
      },
      {
        id: 'aiob-hpc-video',
        title: 'AI Computing in Vehicles 영상',
        channel: 'youtube',
        type: 'video',
        videoId: 'stu901vwx234',
        technology: 'hpc',
        publishDate: '2026-01-10',
      },
      {
        id: 'aiob-adas-article',
        title: 'AI-powered ADAS Integration',
        channel: 'linkedin',
        type: 'social-post',
        postId: 'urn:li:share:7012345678901234590',
        technology: 'adas',
        publishDate: '2026-02-01',
      },
    ],
  },
  {
    id: 'experience-on-board',
    name: 'Experience on Board',
    type: 'content',
    period: { start: '2026-01-01', end: '2026-12-31' },
    utmCampaign: 'experienceonboard',
    technologies: ['digital-cockpit', 'lg-p-pod', 'ivi'],
    channels: ['linkedin', 'youtube', 'lgcom'],
    description: 'Digital Cockpit + LG P-pod 통합 경험 캠페인',
    active: true,
    contents: [
      {
        id: 'eob-landing',
        title: 'Experience on Board 캠페인 페이지',
        channel: 'lgcom',
        type: 'landing-page',
        url: '/vs/campaign/experience-on-board',
        technology: 'digital-cockpit',
        publishDate: '2026-01-01',
      },
      {
        id: 'eob-cockpit-overview',
        title: 'Digital Cockpit Platform Overview',
        channel: 'lgcom',
        type: 'whitepaper',
        url: '/vs/resources/cockpit-whitepaper',
        technology: 'digital-cockpit',
        publishDate: '2025-11-15',
      },
      {
        id: 'eob-ppod-video',
        title: 'LG P-pod: Total In-vehicle Experience',
        channel: 'youtube',
        type: 'video',
        videoId: 'yza567bcd890',
        technology: 'lg-p-pod',
        publishDate: '2026-01-10',
      },
    ],
  },
  {
    id: 'public-webinar-2026',
    name: 'Public 웨비나 시리즈 (연 6회)',
    type: 'webinar',
    period: { start: '2026-01-01', end: '2026-12-31' },
    utmCampaign: 'webinar2026',
    technologies: ['hpc', 'transformable-display', 'digital-cockpit'],
    channels: ['linkedin', 'lgcom', 'newsletter'],
    description: 'Industry Expert 대상 Thought Leadership 웨비나',
    active: true,
    contents: [
      {
        id: 'webinar-q1-hpc',
        title: 'Q1: HPC Expert Discussion',
        channel: 'webinar',
        type: 'webinar-session',
        url: '/vs/events/webinar/2026-q1-hpc',
        technology: 'hpc',
        publishDate: '2026-02-15',
      },
      {
        id: 'webinar-q1-display',
        title: 'Q1: Display Innovation Webinar',
        channel: 'webinar',
        type: 'webinar-session',
        url: '/vs/events/webinar/2026-q1-display',
        technology: 'transformable-display',
        publishDate: '2026-03-20',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// URL 패턴 매핑 (LG.com GA 데이터용)
// ─────────────────────────────────────────────────────────────

export interface UrlPatternMapping {
  id: string;
  pattern: string; // URL 패턴 (glob-like)
  technologyId?: string;
  campaignId?: string;
  contentType: 'product' | 'campaign' | 'event' | 'resource' | 'article';
  description: string;
}

export const URL_PATTERN_MAPPINGS: UrlPatternMapping[] = [
  // 제품/기술 페이지
  { id: 'url-hpc', pattern: '/vs/connectivity/hpc*', technologyId: 'hpc', contentType: 'product', description: 'HPC 제품 페이지' },
  { id: 'url-display', pattern: '/vs/display/transformable*', technologyId: 'transformable-display', contentType: 'product', description: 'Transformable Display 페이지' },
  { id: 'url-cockpit', pattern: '/vs/solutions/cockpit*', technologyId: 'digital-cockpit', contentType: 'product', description: 'Digital Cockpit 페이지' },
  { id: 'url-ppod', pattern: '/vs/solutions/p-pod*', technologyId: 'lg-p-pod', contentType: 'product', description: 'LG P-pod 페이지' },
  { id: 'url-vision', pattern: '/vs/solutions/vision*', technologyId: 'vehicle-vision', contentType: 'product', description: 'Vehicle Vision 페이지' },
  { id: 'url-adas', pattern: '/vs/solutions/adas*', technologyId: 'adas', contentType: 'product', description: 'ADAS 페이지' },
  { id: 'url-ivi', pattern: '/vs/solutions/ivi*', technologyId: 'ivi', contentType: 'product', description: 'IVI 페이지' },
  
  // 캠페인 페이지
  { id: 'url-ces', pattern: '/vs/events/ces-2026*', campaignId: 'ces-2026', contentType: 'event', description: 'CES 2026 이벤트' },
  { id: 'url-lgob', pattern: '/vs/campaign/lg-on-board*', campaignId: 'lg-on-board-2026', contentType: 'campaign', description: 'LG on board 캠페인' },
  { id: 'url-aiob', pattern: '/vs/campaign/ai-on-board*', campaignId: 'ai-on-board', contentType: 'campaign', description: 'AI on Board 캠페인' },
  { id: 'url-eob', pattern: '/vs/campaign/experience-on-board*', campaignId: 'experience-on-board', contentType: 'campaign', description: 'Experience on Board 캠페인' },
  
  // 리소스
  { id: 'url-whitepaper', pattern: '/vs/resources/*-whitepaper*', contentType: 'resource', description: 'Whitepaper 다운로드' },
  { id: 'url-webinar', pattern: '/vs/events/webinar/*', campaignId: 'public-webinar-2026', contentType: 'event', description: '웨비나' },
];

// ─────────────────────────────────────────────────────────────
// 채널 설정
// ─────────────────────────────────────────────────────────────

export interface ChannelSetting {
  id: string;
  name: string;
  nameKo: string;
  type: 'owned' | 'social' | 'paid' | 'newsletter';
  weight: number; // 통합 퍼널 가중치
  metrics: string[]; // 수집 가능 지표
  active: boolean;
}

export const CHANNEL_SETTINGS: ChannelSetting[] = [
  {
    id: 'lgcom',
    name: 'LG.com',
    nameKo: 'LG.com',
    type: 'owned',
    weight: 1.0,
    metrics: ['pageviews', 'sessions', 'avgTimeOnPage', 'downloads', 'inquiries'],
    active: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    nameKo: '링크드인',
    type: 'social',
    weight: 0.6,
    metrics: ['impressions', 'engagement', 'clicks', 'followers', 'shares'],
    active: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    nameKo: '유튜브',
    type: 'social',
    weight: 0.4,
    metrics: ['views', 'watchTime', 'viewDepth25', 'viewDepth50', 'viewDepth75', 'viewDepth100'],
    active: true,
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    nameKo: '구글 광고',
    type: 'paid',
    weight: 0.5,
    metrics: ['impressions', 'clicks', 'ctr', 'conversions'],
    active: true,
  },
  {
    id: 'linkedin-ads',
    name: 'LinkedIn Ads',
    nameKo: '링크드인 광고',
    type: 'paid',
    weight: 0.6,
    metrics: ['impressions', 'clicks', 'ctr', 'etr', 'leads'],
    active: true,
  },
  {
    id: 'meta',
    name: 'Meta',
    nameKo: '메타',
    type: 'paid',
    weight: 0.4,
    metrics: ['impressions', 'clicks', 'engagement'],
    active: true,
  },
  {
    id: 'reddit',
    name: 'Reddit',
    nameKo: '레딧',
    type: 'social',
    weight: 0.3,
    metrics: ['impressions', 'clicks', 'engagement'],
    active: true,
  },
  {
    id: 'remember',
    name: '리멤버',
    nameKo: '리멤버',
    type: 'paid',
    weight: 0.4,
    metrics: ['impressions', 'clicks'],
    active: true,
  },
  {
    id: 'lg-loop',
    name: 'LG Loop Newsletter',
    nameKo: 'LG Loop 뉴스레터',
    type: 'newsletter',
    weight: 0.5,
    metrics: ['subscribers', 'opens', 'clicks', 'unsubscribes'],
    active: true,
  },
  {
    id: 'linkedin-newsletter',
    name: 'LinkedIn Newsletter',
    nameKo: '링크드인 뉴스레터',
    type: 'newsletter',
    weight: 0.5,
    metrics: ['subscribers', 'opens', 'clicks'],
    active: true,
  },
];

// ─────────────────────────────────────────────────────────────
// 소셜 게시물 관리
// ─────────────────────────────────────────────────────────────

export interface SocialPost {
  id: string;
  postId: string; // 플랫폼 게시물 ID
  channel: 'linkedin' | 'youtube' | 'reddit';
  title: string;
  url?: string;
  technologies: string[]; // 연관 기술
  campaigns: string[]; // 연관 캠페인
  contentType: 'video' | 'article' | 'image' | 'carousel' | 'poll';
  publishDate: string;
  metrics?: {
    impressions?: number;
    engagement?: number;
    clicks?: number;
    views?: number;
    watchTime50?: number;
  };
}

export const SOCIAL_POSTS: SocialPost[] = [
  // LinkedIn Posts
  {
    id: 'post-ces-teaser',
    postId: 'urn:li:share:7012345678901234567',
    channel: 'linkedin',
    title: 'CES 2026 티저 영상',
    url: 'https://www.linkedin.com/posts/lg-vs_ces2026-activity-xxx',
    technologies: ['hpc', 'transformable-display'],
    campaigns: ['ces-2026'],
    contentType: 'video',
    publishDate: '2025-12-20',
    metrics: { impressions: 45000, engagement: 1250, clicks: 890 },
  },
  {
    id: 'post-hpc-reveal',
    postId: 'urn:li:share:7012345678901234568',
    channel: 'linkedin',
    title: 'HPC Technology Reveal',
    url: 'https://www.linkedin.com/posts/lg-vs_hpc-activity-xxx',
    technologies: ['hpc'],
    campaigns: ['ces-2026', 'lg-on-board-2026'],
    contentType: 'video',
    publishDate: '2026-01-07',
    metrics: { impressions: 62000, engagement: 2150, clicks: 1420 },
  },
  {
    id: 'post-ppod-launch',
    postId: 'urn:li:share:7012345678901234570',
    channel: 'linkedin',
    title: 'LG P-pod First Look',
    url: 'https://www.linkedin.com/posts/lg-vs_ppod-activity-xxx',
    technologies: ['lg-p-pod', 'digital-cockpit'],
    campaigns: ['ces-2026', 'experience-on-board'],
    contentType: 'video',
    publishDate: '2026-01-09',
    metrics: { impressions: 58000, engagement: 1980, clicks: 1180 },
  },
  // YouTube Videos
  {
    id: 'video-hpc-demo',
    postId: 'abc123def456',
    channel: 'youtube',
    title: 'CES 2026 HPC Demo 영상',
    url: 'https://www.youtube.com/watch?v=abc123def456',
    technologies: ['hpc'],
    campaigns: ['ces-2026'],
    contentType: 'video',
    publishDate: '2026-01-07',
    metrics: { views: 12500, watchTime50: 8200 },
  },
  {
    id: 'video-ppod-reveal',
    postId: 'ghi789jkl012',
    channel: 'youtube',
    title: 'LG P-pod CES 2026 Reveal',
    url: 'https://www.youtube.com/watch?v=ghi789jkl012',
    technologies: ['lg-p-pod'],
    campaigns: ['ces-2026', 'experience-on-board'],
    contentType: 'video',
    publishDate: '2026-01-08',
    metrics: { views: 9850, watchTime50: 6420 },
  },
  {
    id: 'video-display-innovation',
    postId: 'mno345pqr678',
    channel: 'youtube',
    title: 'Transformable Display: Form Factor Innovation',
    url: 'https://www.youtube.com/watch?v=mno345pqr678',
    technologies: ['transformable-display'],
    campaigns: ['ces-2026', 'lg-on-board-2026'],
    contentType: 'video',
    publishDate: '2026-01-09',
    metrics: { views: 8650, watchTime50: 5480 },
  },
];

// ─────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────

export function getTechnologyById(id: string): Technology | undefined {
  return TECHNOLOGY_SETTINGS.find(t => t.id === id);
}

export function getCampaignById(id: string): CampaignSetting | undefined {
  return CAMPAIGN_SETTINGS.find(c => c.id === id);
}

export function getContentsByCampaign(campaignId: string): CampaignContent[] {
  const campaign = getCampaignById(campaignId);
  return campaign?.contents || [];
}

export function getTechnologiesByCategory(category: Technology['category']): Technology[] {
  return TECHNOLOGY_SETTINGS.filter(t => t.category === category && t.active);
}

export function getActiveCampaigns(): CampaignSetting[] {
  return CAMPAIGN_SETTINGS.filter(c => c.active);
}

export function matchUrlToTechnology(url: string): Technology | undefined {
  for (const mapping of URL_PATTERN_MAPPINGS) {
    if (mapping.technologyId && matchUrlPattern(url, mapping.pattern)) {
      return getTechnologyById(mapping.technologyId);
    }
  }
  return undefined;
}

export function matchUrlToCampaign(url: string): CampaignSetting | undefined {
  for (const mapping of URL_PATTERN_MAPPINGS) {
    if (mapping.campaignId && matchUrlPattern(url, mapping.pattern)) {
      return getCampaignById(mapping.campaignId);
    }
  }
  return undefined;
}

function matchUrlPattern(url: string, pattern: string): boolean {
  const regexPattern = pattern
    .replace(/\*/g, '.*')
    .replace(/\//g, '\\/');
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(url);
}

// 채널별 가중치 가져오기
export function getChannelWeight(channelId: string): number {
  const channel = CHANNEL_SETTINGS.find(c => c.id === channelId);
  return channel?.weight || 0.5;
}

// 캠페인의 총 콘텐츠 수 계산
export function getCampaignContentCount(campaignId: string): number {
  const campaign = getCampaignById(campaignId);
  return campaign?.contents.length || 0;
}

// 기술별 연관 콘텐츠 찾기
export function getContentsByTechnology(technologyId: string): CampaignContent[] {
  const contents: CampaignContent[] = [];
  for (const campaign of CAMPAIGN_SETTINGS) {
    for (const content of campaign.contents) {
      if (content.technology === technologyId) {
        contents.push(content);
      }
    }
  }
  return contents;
}
