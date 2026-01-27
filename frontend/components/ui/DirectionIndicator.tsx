'use client';

import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FlowDirection, TrendDirection } from '@/types';

interface DirectionIndicatorProps {
  direction: FlowDirection | TrendDirection;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const DIRECTION_CONFIG = {
  advancing: { icon: ArrowUp, color: 'text-green-600', label: '진전' },
  up: { icon: ArrowUp, color: 'text-green-600', label: '상승' },
  stable: { icon: ArrowRight, color: 'text-gray-500', label: '유지' },
  declining: { icon: ArrowDown, color: 'text-red-600', label: '약화' },
  down: { icon: ArrowDown, color: 'text-red-600', label: '하락' },
};

const SIZES = {
  sm: 12,
  md: 16,
  lg: 20,
};

export function DirectionIndicator({
  direction,
  size = 'md',
  showLabel = false,
  className,
}: DirectionIndicatorProps) {
  const config = DIRECTION_CONFIG[direction];
  const Icon = config.icon;

  return (
    <span className={cn('inline-flex items-center gap-1', config.color, className)}>
      <Icon size={SIZES[size]} />
      {showLabel && <span className="text-sm">{config.label}</span>}
    </span>
  );
}

// Change Indicator (숫자 + 방향)
interface ChangeIndicatorProps {
  value: number;
  suffix?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ChangeIndicator({ value, suffix = '%', size = 'md', className }: ChangeIndicatorProps) {
  const direction: TrendDirection = value > 0 ? 'up' : value < 0 ? 'down' : 'stable';
  const config = DIRECTION_CONFIG[direction];
  const Icon = config.icon;

  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

  return (
    <span className={cn('inline-flex items-center gap-1', config.color, textSize, className)}>
      <Icon size={SIZES[size]} />
      {value > 0 ? '+' : ''}
      {value}
      {suffix}
    </span>
  );
}
