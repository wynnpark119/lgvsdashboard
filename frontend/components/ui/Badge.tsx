'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  icon?: ReactNode;
}

const VARIANTS = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-brand-primary/10 text-brand-primary',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  error: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  outline: 'border border-gray-300 text-gray-600',
};

const SIZES = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-sm px-2.5 py-1',
};

export function Badge({ children, variant = 'default', size = 'md', className, icon }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded font-medium',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

// Stage Badge
interface StageBadgeProps {
  stage: 'initial' | 'deep' | 'reachable';
  size?: BadgeSize;
  className?: string;
}

const STAGE_CONFIG = {
  initial: { label: 'Initial', color: 'bg-state-initial/10 text-state-initial' },
  deep: { label: 'Deep', color: 'bg-state-deep/10 text-state-deep' },
  reachable: { label: 'Reachable', color: 'bg-state-reachable/10 text-state-reachable' },
};

export function StageBadge({ stage, size = 'md', className }: StageBadgeProps) {
  const config = STAGE_CONFIG[stage];
  return (
    <span className={cn('inline-flex items-center rounded font-medium', config.color, SIZES[size], className)}>
      {config.label}
    </span>
  );
}

// Paid Dependency Badge
interface PaidBadgeProps {
  dependency: 'low' | 'medium' | 'high';
  size?: BadgeSize;
  className?: string;
}

const PAID_CONFIG = {
  low: { label: 'Paid: Low', color: 'bg-green-50 text-green-600' },
  medium: { label: 'Paid: Med', color: 'bg-yellow-50 text-yellow-600' },
  high: { label: 'Paid: High', color: 'bg-red-50 text-red-600' },
};

export function PaidBadge({ dependency, size = 'sm', className }: PaidBadgeProps) {
  const config = PAID_CONFIG[dependency];
  return (
    <span className={cn('inline-flex items-center rounded font-medium', config.color, SIZES[size], className)}>
      {config.label}
    </span>
  );
}

// Influence Badge
interface InfluenceBadgeProps {
  influence: 'amplifier' | 'distorter' | 'neutral';
  size?: BadgeSize;
  className?: string;
}

const INFLUENCE_CONFIG = {
  amplifier: { label: 'Amplifier', color: 'bg-green-50 text-green-600' },
  distorter: { label: 'Distorter', color: 'bg-yellow-50 text-yellow-600' },
  neutral: { label: 'Neutral', color: 'bg-gray-50 text-gray-600' },
};

export function InfluenceBadge({ influence, size = 'md', className }: InfluenceBadgeProps) {
  const config = INFLUENCE_CONFIG[influence];
  return (
    <span className={cn('inline-flex items-center rounded font-medium', config.color, SIZES[size], className)}>
      {config.label}
    </span>
  );
}
