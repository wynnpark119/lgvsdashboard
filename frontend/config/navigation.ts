import {
  LayoutDashboard,
  TrendingUp,
  Zap,
  FileSearch,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  labelKo: string;
  href: string;
  description?: string;
}

export interface NavSection {
  id: string;
  label: string;
  labelKo: string;
  icon: LucideIcon;
  phase: string;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavSection[] = [
  // ─────────────────────────────────────────────────────────────
  // Phase 1: Overview
  // ─────────────────────────────────────────────────────────────
  {
    id: 'overview',
    label: 'Overview',
    labelKo: '전체 요약',
    icon: LayoutDashboard,
    phase: '상태',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        labelKo: '대시보드',
        href: '/',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Phase 2: Progress (기술별 관심 현황)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'progress',
    label: 'Progress',
    labelKo: '기술별 관심 현황',
    icon: TrendingUp,
    phase: '현황',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        labelKo: '전체 현황',
        href: '/review-flow',
      },
      {
        id: 'tofu',
        label: 'First Touch',
        labelKo: '처음 접촉',
        href: '/review-flow/tofu',
      },
      {
        id: 'mofu-bofu',
        label: 'Deep Interest',
        labelKo: '깊은 관심',
        href: '/review-flow/mofu-bofu',
      },
      {
        id: 'by-technology',
        label: 'By Technology',
        labelKo: '기술별 비교',
        href: '/review-flow/technology',
      },
      {
        id: 'trend',
        label: 'Trend',
        labelKo: '추세',
        href: '/review-flow/momentum',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Phase 3: Campaign Impact
  // ─────────────────────────────────────────────────────────────
  {
    id: 'campaign-impact',
    label: 'Campaign',
    labelKo: '캠페인/광고 영향',
    icon: Zap,
    phase: '원인',
    items: [
      {
        id: 'event-impact',
        label: 'Impact Analysis',
        labelKo: '영향 분석',
        href: '/campaign-impact',
      },
      {
        id: 'paid-influence',
        label: 'Paid Media',
        labelKo: '광고 영향',
        href: '/campaign-impact/paid',
      },
      {
        id: 'content-contribution',
        label: 'Content',
        labelKo: '콘텐츠 영향',
        href: '/campaign-impact/content',
      },
      {
        id: 'campaign-list',
        label: 'Campaign List',
        labelKo: '캠페인 목록',
        href: '/campaign',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Phase 4: Detail / Evidence
  // ─────────────────────────────────────────────────────────────
  {
    id: 'evidence',
    label: 'Detail',
    labelKo: '상세 데이터',
    icon: FileSearch,
    phase: '상세',
    items: [
      {
        id: 'technology-detail',
        label: 'Technology',
        labelKo: '기술별',
        href: '/detail/technology',
      },
      {
        id: 'channel-detail',
        label: 'Channel',
        labelKo: '채널별',
        href: '/detail/channel',
      },
      {
        id: 'inquiry-detail',
        label: 'Inquiry & Newsletter',
        labelKo: '문의 & 뉴스레터',
        href: '/detail/inquiry',
      },
      {
        id: 'content-detail',
        label: 'Content',
        labelKo: '콘텐츠',
        href: '/detail/content',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Settings
  // ─────────────────────────────────────────────────────────────
  {
    id: 'settings',
    label: 'Settings',
    labelKo: '세팅',
    icon: Settings,
    phase: '설정',
    items: [
      {
        id: 'settings-main',
        label: 'Data Tagging',
        labelKo: '데이터 태깅',
        href: '/settings',
      },
    ],
  },
];

export const DECISION_FLOW = {
  phases: [
    { id: 'overview', label: '요약', href: '/' },
    { id: 'progress', label: '현황', href: '/review-flow' },
    { id: 'cause', label: '원인', href: '/campaign-impact' },
    { id: 'evidence', label: '상세', href: '/detail/technology' },
  ],
  flow: 'Overview → Progress → Campaign → Detail',
};

export function isPathActive(itemHref: string, currentPath: string): boolean {
  if (itemHref === '/') return currentPath === '/';
  return currentPath === itemHref || currentPath.startsWith(itemHref + '/');
}

export function getCurrentPhase(pathname: string): string | null {
  for (const section of NAVIGATION_CONFIG) {
    if (section.items.some(item => isPathActive(item.href, pathname))) {
      return section.phase;
    }
  }
  return null;
}

export function getNextSection(currentPath: string): NavSection | null {
  const currentIndex = NAVIGATION_CONFIG.findIndex(section =>
    section.items.some(item => isPathActive(item.href, currentPath))
  );
  if (currentIndex >= 0 && currentIndex < NAVIGATION_CONFIG.length - 1) {
    return NAVIGATION_CONFIG[currentIndex + 1];
  }
  return null;
}
