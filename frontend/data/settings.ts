/**
 * Settings Data
 * 세팅 관리용 데이터 구조 및 예시 데이터
 * 
 * 관계: 모두 N:M
 * - 기술 ↔ 캠페인
 * - 기술 ↔ 콘텐츠
 * - 캠페인 ↔ 콘텐츠
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
  active: boolean;
}

export const TECHNOLOGY_SETTINGS: Technology[] = [
  // 전략과제 (2026 수주 목표)
  {
    id: 'hpc',
    name: 'HPC (High-Performance Computing)',
    nameKo: 'High-Performance Computing',
    category: 'strategic',
    priority: 5,
    description: '2026 수주 목표 전략과제 - 차량용 고성능 컴퓨팅 플랫폼',
    active: true,
  },
  {
    id: 'transformable-display',
    name: 'Transformable Display',
    nameKo: '트랜스포머블 디스플레이',
    category: 'strategic',
    priority: 5,
    description: '2026 수주 목표 전략과제 - 형태 변환 가능 차량 디스플레이',
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
    active: true,
  },
  {
    id: 'lg-p-pod',
    name: 'LG P-pod',
    nameKo: 'LG P-pod',
    category: 'core',
    priority: 4,
    description: 'Tech On Board 캠페인 신규 공개 - Total In-vehicle Experience 솔루션',
    active: true,
  },
  {
    id: 'vehicle-vision',
    name: 'Vehicle Vision',
    nameKo: '비히클 비전',
    category: 'core',
    priority: 3,
    description: '차량용 카메라 및 비전 솔루션',
    active: true,
  },
  {
    id: 'adas',
    name: 'ADAS',
    nameKo: '첨단 운전자 지원 시스템',
    category: 'core',
    priority: 3,
    description: 'AI on Board 캠페인 연계 - 센서 퓨전 기반 ADAS',
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
    active: true,
  },
  {
    id: 'telematics',
    name: 'Telematics',
    nameKo: '텔레매틱스',
    category: 'emerging',
    priority: 2,
    description: '커넥티드 카 텔레매틱스 솔루션',
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
    active: true,
  },
];

// ─────────────────────────────────────────────────────────────
// 캠페인 관리
// ─────────────────────────────────────────────────────────────

export interface Campaign {
  id: string;
  name: string;
  type: 'advertising' | 'content' | 'event' | 'webinar';
  period: {
    start: string;
    end: string;
  };
  utmCampaign: string; // Paid 매칭용 UTM 값
  technologies: string[]; // 연관 기술 ID (다중)
  description?: string;
  active: boolean;
}

export const CAMPAIGN_SETTINGS: Campaign[] = [
  {
    id: 'ces-2026',
    name: 'CES 2026',
    type: 'event',
    period: { start: '2026-01-07', end: '2026-01-10' },
    utmCampaign: 'ces2026',
    technologies: ['hpc', 'transformable-display', 'lg-p-pod', 'digital-cockpit'],
    description: 'CES 2026 전시회 - 전략과제 중심 기술 공개 (Historical)',
    active: true,
  },
  {
    id: 'tech-on-board-2026',
    name: 'Tech On Board 2026',
    type: 'content',
    period: { start: '2026-01-01', end: '2026-06-30' },
    utmCampaign: 'techonboard2026',
    technologies: ['hpc', 'transformable-display', 'digital-cockpit', 'lg-p-pod'],
    description: '연간 브랜드 캠페인 - 전략과제 소재화',
    active: true,
  },
  {
    id: 'ai-on-board',
    name: 'AI on Board',
    type: 'content',
    period: { start: '2026-01-01', end: '2026-06-30' },
    utmCampaign: 'aionboard',
    technologies: ['hpc', 'adas', 'vehicle-vision'],
    description: 'AI 기반 차량 솔루션 캠페인',
    active: true,
  },
  {
    id: 'experience-on-board',
    name: 'Experience on Board',
    type: 'content',
    period: { start: '2026-01-01', end: '2026-12-31' },
    utmCampaign: 'experienceonboard',
    technologies: ['digital-cockpit', 'lg-p-pod', 'ivi'],
    description: 'Digital Cockpit + LG P-pod 통합 경험 캠페인',
    active: true,
  },
  {
    id: 'public-webinar-2026',
    name: 'Public 웨비나 시리즈 (연 6회)',
    type: 'webinar',
    period: { start: '2026-01-01', end: '2026-12-31' },
    utmCampaign: 'webinar2026',
    technologies: ['hpc', 'transformable-display', 'digital-cockpit'],
    description: 'Industry Expert 대상 Thought Leadership 웨비나',
    active: true,
  },
];

// ─────────────────────────────────────────────────────────────
// 콘텐츠 URL 관리 (기술/캠페인 다중 연결)
// ─────────────────────────────────────────────────────────────

export interface ContentUrl {
  id: string;
  url: string;
  title: string;
  channel: 'lgcom' | 'linkedin' | 'youtube' | 'reddit';
  contentType: 'landing' | 'article' | 'video' | 'whitepaper' | 'social-post' | 'webinar' | 'newsletter';
  technologies: string[]; // 연관 기술 (다중)
  campaigns: string[]; // 연관 캠페인 (다중, 없으면 독립 콘텐츠)
  funnelStage: 'tofu' | 'mofu' | 'bofu'; // 타겟 퍼널 단계
  publishDate?: string;
  active: boolean;
}

export const CONTENT_URLS: ContentUrl[] = [
  // ─────────────────────────────────────────────────────────────
  // Tech On Board 캠페인 관련 콘텐츠 (7개 레이어 구조)
  // ─────────────────────────────────────────────────────────────
  
  // Layer 1: Reddit AI-Defined Vehicle Discussion (Issue Seeding)
  {
    id: 'tech-on-board-reddit-ads',
    url: 'https://www.reddit.com/r/SelfDrivingCars/comments/tech-on-board',
    title: 'Reddit AI-Defined Vehicle Discussion',
    channel: 'reddit',
    contentType: 'social-post',
    technologies: ['hpc', 'transformable-display', 'digital-cockpit'],
    campaigns: ['tech-on-board-2026'],
    funnelStage: 'tofu',
    publishDate: '2025-12-15',
    active: true,
  },
  
  // Layer 2: Tech On Board Campaign Film (Narrative Immersion)
  {
    id: 'tech-on-board-campaign-film',
    url: 'https://www.youtube.com/watch?v=tech-on-board-main',
    title: 'Tech On Board Campaign Film',
    channel: 'youtube',
    contentType: 'video',
    technologies: ['hpc', 'transformable-display', 'digital-cockpit', 'lg-p-pod'],
    campaigns: ['tech-on-board-2026'],
    funnelStage: 'tofu',
    publishDate: '2026-01-06',
    active: true,
  },
  
  // Layer 3: HPC Film (Core Tech Pillar)
  {
    id: 'tech-on-board-hpc-film',
    url: 'https://www.youtube.com/watch?v=hpc-core-tech',
    title: 'HPC (High-Performance Computing) Film',
    channel: 'youtube',
    contentType: 'video',
    technologies: ['hpc'],
    campaigns: ['tech-on-board-2026'],
    funnelStage: 'tofu',
    publishDate: '2026-01-20',
    active: true,
  },
  
  // Layer 4: Transformable Display Film (Core Tech Pillar)
  {
    id: 'tech-on-board-display-film',
    url: 'https://www.youtube.com/watch?v=display-core-tech',
    title: 'Transformable Display Film',
    channel: 'youtube',
    contentType: 'video',
    technologies: ['transformable-display'],
    campaigns: ['tech-on-board-2026'],
    funnelStage: 'tofu',
    publishDate: '2026-01-20',
    active: true,
  },
  
  // Layer 5: LG.com Tech On Board Hub (Judgment Formation)
  {
    id: 'tech-on-board-hub',
    url: '/vs/tech-on-board',
    title: 'LG.com Tech On Board Hub',
    channel: 'lgcom',
    contentType: 'landing',
    technologies: ['hpc', 'transformable-display', 'digital-cockpit', 'lg-p-pod'],
    campaigns: ['tech-on-board-2026'],
    funnelStage: 'mofu',
    publishDate: '2026-01-06',
    active: true,
  },
  
  // Layer 6: LinkedIn Newsletter (Distribution)
  {
    id: 'tech-on-board-linkedin-newsletter',
    url: 'https://www.linkedin.com/newsletters/lg-vs-tech-insights',
    title: 'LinkedIn Newsletter (GEO/AIO 최적화)',
    channel: 'linkedin',
    contentType: 'newsletter',
    technologies: ['hpc', 'transformable-display'],
    campaigns: ['tech-on-board-2026'],
    funnelStage: 'mofu',
    publishDate: '2026-01-15',
    active: true,
  },
  
  // Layer 7: LinkedIn Expert Answers & TLA (Authority Content)
  {
    id: 'tech-on-board-linkedin-expert',
    url: 'https://www.linkedin.com/posts/lg-vs_expert-answers',
    title: 'LinkedIn Expert Answers & TLA',
    channel: 'linkedin',
    contentType: 'social-post',
    technologies: ['hpc', 'transformable-display', 'digital-cockpit'],
    campaigns: ['tech-on-board-2026'],
    funnelStage: 'bofu',
    publishDate: '2026-02-01',
    active: true,
  },
  
  // ─────────────────────────────────────────────────────────────
  // Tech On Board 전용 콘텐츠 (MOFU - 백서, 심층 콘텐츠)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'lgob-hpc-whitepaper',
    url: '/vs/resources/hpc-whitepaper',
    title: 'HPC Technical Whitepaper',
    channel: 'lgcom',
    contentType: 'whitepaper',
    technologies: ['hpc'],
    campaigns: ['tech-on-board-2026'],
    funnelStage: 'mofu',
    publishDate: '2025-12-01',
    active: true,
  },
  {
    id: 'lgob-display-whitepaper',
    url: '/vs/resources/transformable-display-whitepaper',
    title: 'Transformable Display Technology Overview',
    channel: 'lgcom',
    contentType: 'whitepaper',
    technologies: ['transformable-display'],
    campaigns: ['tech-on-board-2026'],
    funnelStage: 'mofu',
    publishDate: '2025-12-15',
    active: true,
  },
  
  // ─────────────────────────────────────────────────────────────
  // Experience on Board 콘텐츠
  // ─────────────────────────────────────────────────────────────
  {
    id: 'eob-cockpit-whitepaper',
    url: '/vs/resources/cockpit-whitepaper',
    title: 'Digital Cockpit Platform Overview',
    channel: 'lgcom',
    contentType: 'whitepaper',
    technologies: ['digital-cockpit', 'lg-p-pod'],
    campaigns: ['experience-on-board'],
    funnelStage: 'mofu',
    publishDate: '2025-11-15',
    active: true,
  },
  {
    id: 'eob-ppod-video',
    url: 'https://www.youtube.com/watch?v=yza567bcd890',
    title: 'LG P-pod: Total In-vehicle Experience',
    channel: 'youtube',
    contentType: 'video',
    technologies: ['lg-p-pod', 'digital-cockpit'],
    campaigns: ['experience-on-board'],
    funnelStage: 'tofu',
    publishDate: '2026-01-10',
    active: true,
  },
  
  // ─────────────────────────────────────────────────────────────
  // 웨비나 (MOFU)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'webinar-hpc-expert',
    url: '/vs/events/webinar/hpc-expert-discussion',
    title: 'HPC Expert Discussion 웨비나',
    channel: 'lgcom',
    contentType: 'webinar',
    technologies: ['hpc'],
    campaigns: ['public-webinar-2026'],
    funnelStage: 'mofu',
    publishDate: '2026-02-15',
    active: true,
  },
  {
    id: 'webinar-display-innovation',
    url: '/vs/events/webinar/display-innovation',
    title: 'Display Innovation 웨비나',
    channel: 'lgcom',
    contentType: 'webinar',
    technologies: ['transformable-display', 'digital-cockpit'],
    campaigns: ['public-webinar-2026'],
    funnelStage: 'mofu',
    publishDate: '2026-03-20',
    active: true,
  },
  
  // ─────────────────────────────────────────────────────────────
  // BOFU 콘텐츠 (문의, 데모 요청)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'contact-inquiry',
    url: '/vs/contact',
    title: '문의하기',
    channel: 'lgcom',
    contentType: 'landing',
    technologies: [], // 전체 기술 공통
    campaigns: [],
    funnelStage: 'bofu',
    publishDate: '2025-01-01',
    active: true,
  },
  {
    id: 'demo-request',
    url: '/vs/demo-request',
    title: '데모 요청',
    channel: 'lgcom',
    contentType: 'landing',
    technologies: [], // 전체 기술 공통
    campaigns: [],
    funnelStage: 'bofu',
    publishDate: '2025-01-01',
    active: true,
  },
  
  // ─────────────────────────────────────────────────────────────
  // 독립 콘텐츠 (캠페인 없음)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'adas-landing',
    url: '/vs/solutions/adas',
    title: 'ADAS 솔루션 소개',
    channel: 'lgcom',
    contentType: 'landing',
    technologies: ['adas'],
    campaigns: [],
    funnelStage: 'tofu',
    publishDate: '2025-06-01',
    active: true,
  },
  {
    id: 'vision-tech-video',
    url: 'https://www.youtube.com/watch?v=mno345pqr678',
    title: 'Camera Module Technology Explained',
    channel: 'youtube',
    contentType: 'video',
    technologies: ['vehicle-vision'],
    campaigns: [],
    funnelStage: 'tofu',
    publishDate: '2025-10-15',
    active: true,
  },
  {
    id: 'ivi-platform',
    url: '/vs/solutions/ivi',
    title: 'IVI Platform Architecture Guide',
    channel: 'lgcom',
    contentType: 'article',
    technologies: ['ivi'],
    campaigns: [],
    funnelStage: 'mofu',
    publishDate: '2025-08-01',
    active: true,
  },
  {
    id: 'cockpit-standalone',
    url: '/vs/solutions/cockpit',
    title: 'Digital Cockpit 제품 소개',
    channel: 'lgcom',
    contentType: 'landing',
    technologies: ['digital-cockpit'],
    campaigns: [],
    funnelStage: 'tofu',
    publishDate: '2025-03-01',
    active: true,
  },
  {
    id: 'ppod-standalone',
    url: '/vs/solutions/p-pod',
    title: 'LG P-pod 제품 소개',
    channel: 'lgcom',
    contentType: 'landing',
    technologies: ['lg-p-pod'],
    campaigns: [],
    funnelStage: 'tofu',
    publishDate: '2025-11-01',
    active: true,
  },
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
    id: 'reddit',
    name: 'Reddit',
    nameKo: '레딧',
    type: 'social',
    weight: 0.3,
    metrics: ['impressions', 'clicks', 'comments', 'upvotes', 'engagement'],
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
// Utility Functions
// ─────────────────────────────────────────────────────────────

export function getTechnologyById(id: string): Technology | undefined {
  return TECHNOLOGY_SETTINGS.find(t => t.id === id);
}

export function getCampaignById(id: string): Campaign | undefined {
  return CAMPAIGN_SETTINGS.find(c => c.id === id);
}

export function getContentById(id: string): ContentUrl | undefined {
  return CONTENT_URLS.find(c => c.id === id);
}

// 기술에 연결된 캠페인 목록
export function getCampaignsByTechnology(technologyId: string): Campaign[] {
  return CAMPAIGN_SETTINGS.filter(c => c.technologies.includes(technologyId) && c.active);
}

// 기술에 연결된 콘텐츠 목록
export function getContentsByTechnology(technologyId: string): ContentUrl[] {
  return CONTENT_URLS.filter(c => c.technologies.includes(technologyId) && c.active);
}

// 캠페인에 연결된 콘텐츠 목록
export function getContentsByCampaign(campaignId: string): ContentUrl[] {
  return CONTENT_URLS.filter(c => c.campaigns.includes(campaignId) && c.active);
}

// 독립 콘텐츠 목록 (캠페인에 속하지 않음)
export function getIndependentContents(): ContentUrl[] {
  return CONTENT_URLS.filter(c => c.campaigns.length === 0 && c.active);
}

// 채널별 가중치 가져오기
export function getChannelWeight(channelId: string): number {
  const channel = CHANNEL_SETTINGS.find(c => c.id === channelId);
  return channel?.weight || 0.5;
}

// 카테고리별 기술 목록
export function getTechnologiesByCategory(category: Technology['category']): Technology[] {
  return TECHNOLOGY_SETTINGS.filter(t => t.category === category && t.active);
}

// 활성 캠페인 목록
export function getActiveCampaigns(): Campaign[] {
  return CAMPAIGN_SETTINGS.filter(c => c.active);
}
