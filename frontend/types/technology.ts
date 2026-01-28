/**
 * Technology Types
 * 기술/솔루션 관련 타입 정의
 */

// Review Stages (검토 단계)
export type ReviewStage = 'initial' | 'deep' | 'reachable';

// Flow Direction (이동 방향)
export type FlowDirection = 'advancing' | 'stable' | 'declining';

// Paid Dependency (광고 의존도)
export type PaidDependency = 'low' | 'medium' | 'high';

// Signal Types (신호 유형)
export type SignalType = 'green' | 'yellow' | 'orange' | 'red' | 'gray';

/**
 * Technology (기술 정의)
 * - 모든 페이지에서 공통으로 사용하는 기술 정보
 */
export interface Technology {
  id: string;
  name: string;
  nameKo: string;
  category: 'core' | 'emerging' | 'monitoring';
  description?: string;
}

/**
 * Technology Review State (기술별 검토 상태)
 * - Review Flow, Home에서 사용
 */
export interface TechnologyReviewState {
  technologyId: string;
  period: string;
  
  // 검토 상태
  stage: ReviewStage;
  intensity: number;  // 1-10 (Review Intensity)
  
  // 변화 정보
  direction: FlowDirection;
  intensityChange: number;  // vs previous period
  
  // 광고 의존도
  paidDependency: PaidDependency;
  paidRatio: number;  // 0-100%
  
  // 해석
  signal: {
    type: SignalType;
    label: string;
    actionHint?: string;
  };
}

/**
 * Technology Metrics (기술별 Raw 지표)
 * - Detail에서 사용
 */
export interface TechnologyMetrics {
  technologyId: string;
  period: string;
  
  // LG.com
  lgcom: {
    sessions: number;
    pageviews: number;
    avgTimeOnPage: number;  // minutes
    bounceRate: number;     // 0-100%
  };
  
  // YouTube
  youtube: {
    views: number;
    watchTime: number;      // hours
    avgViewDuration: number; // minutes
    viewDepth50: number;    // 50%+ 시청률
  };
  
  // LinkedIn
  linkedin: {
    impressions: number;
    clicks: number;
    ctr: number;
    engagementRate: number;
  };
  
  // Inquiry
  inquiry: {
    total: number;
    oem: number;
    nonOem: number;
  };
}

/**
 * Seed Technologies (기술 마스터 데이터)
 * 순서: 전략과제 → Core → Emerging → Monitoring
 */
export const TECHNOLOGIES: Technology[] = [
  // 전략과제 (수주 목표)
  {
    id: 'hpc',
    name: 'HPC',
    nameKo: 'High-Performance Computing',
    category: 'core',
    description: '고성능 컴퓨팅 플랫폼 - 2026 전략과제',
  },
  {
    id: 'transformable-display',
    name: 'Transformable Display',
    nameKo: '트랜스포머블 디스플레이',
    category: 'core',
    description: '형태 변환 가능 디스플레이 - 2026 전략과제',
  },
  // Core
  {
    id: 'digital-cockpit',
    name: 'Digital Cockpit',
    nameKo: '디지털 콕핏',
    category: 'core',
    description: '차량용 통합 디스플레이 솔루션 (Experience on Board)',
  },
  {
    id: 'lg-p-pod',
    name: 'LG P-pod',
    nameKo: 'LG P-pod',
    category: 'core',
    description: 'Labworks Series - Total In-vehicle Experience 솔루션',
  },
  {
    id: 'vehicle-vision',
    name: 'Vehicle Vision',
    nameKo: '비히클 비전',
    category: 'core',
    description: '차량용 카메라 및 비전 시스템',
  },
  {
    id: 'adas',
    name: 'ADAS',
    nameKo: '첨단 운전자 지원 시스템',
    category: 'core',
    description: 'Advanced Driver Assistance Systems',
  },
  // Emerging
  {
    id: 'ivi',
    name: 'IVI',
    nameKo: '인포테인먼트',
    category: 'emerging',
    description: 'In-Vehicle Infotainment',
  },
  {
    id: 'telematics',
    name: 'Telematics',
    nameKo: '텔레매틱스',
    category: 'emerging',
    description: '차량 통신 및 원격 진단',
  },
  // Monitoring
  {
    id: 'automotive-display',
    name: 'Automotive Display',
    nameKo: '차량용 디스플레이',
    category: 'monitoring',
    description: '차량용 디스플레이 패널',
  },
];

/**
 * 기술 ID로 기술 정보 조회
 */
export function getTechnologyById(id: string): Technology | undefined {
  return TECHNOLOGIES.find(t => t.id === id);
}

/**
 * 기술 이름으로 기술 정보 조회
 */
export function getTechnologyByName(name: string): Technology | undefined {
  return TECHNOLOGIES.find(t => t.name === name || t.nameKo === name);
}
