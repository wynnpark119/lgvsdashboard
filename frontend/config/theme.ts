/**
 * Theme Configuration
 * 차트 및 UI 테마 설정
 */

// ─────────────────────────────────────────────────────────────
// Colors (색상 팔레트)
// ─────────────────────────────────────────────────────────────

export const COLORS = {
  // Brand
  brand: {
    primary: '#A50034',
    secondary: '#1a1a1a',
    accent: '#8b5cf6',
  },

  // Review Stages
  state: {
    initial: '#f59e0b',    // amber-500
    deep: '#8b5cf6',       // violet-500
    reachable: '#10b981',  // emerald-500
  },

  // Status
  status: {
    success: '#22c55e',    // green-500
    warning: '#f59e0b',    // amber-500
    error: '#ef4444',      // red-500
    info: '#3b82f6',       // blue-500
  },

  // Signal
  signal: {
    green: '#22c55e',
    yellow: '#f59e0b',
    orange: '#f97316',
    red: '#ef4444',
    gray: '#6b7280',
  },

  // Chart
  chart: {
    primary: '#3b82f6',
    secondary: '#10b981',
    tertiary: '#8b5cf6',
    quaternary: '#f59e0b',
    gray: '#6b7280',
  },

  // Tech On Board Campaign
  techOnBoard: {
    theme: '#2563eb',        // blue-600 - Campaign Theme
    teasing: '#f97316',      // orange-500 - Issue Seeding
    narrative: '#8b5cf6',    // violet-500 - Narrative Immersion
    coreTech: '#10b981',     // emerald-500 - Core Tech Pillars
    landing: '#3b82f6',      // blue-500 - Judgment Formation
    authority: '#6366f1',    // indigo-500 - Authority Validation
  },

  // Campaign Layers
  layers: {
    theme: '#2563eb',
    teasing: '#f97316',
    'narrative-film': '#8b5cf6',
    'core-pillar': '#10b981',
    landing: '#3b82f6',
    distribution: '#6366f1',
    authority: '#4f46e5',
  },

  // Background
  background: {
    page: '#f8fafc',
    card: '#ffffff',
    muted: '#f1f5f9',
  },

  // Text
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    muted: '#9ca3af',
  },
} as const;

// ─────────────────────────────────────────────────────────────
// Chart Configuration (차트 설정)
// ─────────────────────────────────────────────────────────────

export const CHART_CONFIG = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  fontSize: 12,
  fontFamily: 'Inter, sans-serif',

  // Grid
  grid: {
    stroke: '#e5e7eb',
    strokeDasharray: '3 3',
  },

  // Axis
  axis: {
    stroke: '#e5e7eb',
    tickLine: false,
    tickFill: '#6b7280',
  },

  // Tooltip
  tooltip: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '12px',
  },

  // Line
  line: {
    strokeWidth: 2,
    dot: false,
    activeDot: { r: 4 },
  },

  // Area
  area: {
    fillOpacity: 0.3,
  },
} as const;

// ─────────────────────────────────────────────────────────────
// Spacing (간격)
// ─────────────────────────────────────────────────────────────

export const SPACING = {
  page: {
    paddingX: 'px-6',
    paddingY: 'py-6',
    maxWidth: 'max-w-[1600px]',
  },
  card: {
    padding: 'p-6',
    gap: 'gap-4',
    rounded: 'rounded-xl',
  },
  section: {
    gap: 'gap-6',
    marginBottom: 'mb-6',
  },
} as const;

// ─────────────────────────────────────────────────────────────
// Breakpoints (반응형)
// ─────────────────────────────────────────────────────────────

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ─────────────────────────────────────────────────────────────
// Animation (애니메이션)
// ─────────────────────────────────────────────────────────────

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
  easing: {
    default: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;
