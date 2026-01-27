'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChangeIndicator } from './DirectionIndicator';
import { formatNumber, formatCompactNumber } from '@/lib/formatters';

interface MetricCardProps {
  label: string;
  value: number | string;
  change?: number;
  suffix?: string;
  icon?: ReactNode;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  compact?: boolean;
  className?: string;
}

const COLORS = {
  default: 'text-gray-900',
  primary: 'text-brand-primary',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
};

export function MetricCard({
  label,
  value,
  change,
  suffix,
  icon,
  color = 'default',
  compact = false,
  className,
}: MetricCardProps) {
  const displayValue = typeof value === 'number'
    ? compact
      ? formatCompactNumber(value)
      : formatNumber(value)
    : value;

  return (
    <div className={cn('bg-gray-50 rounded-lg p-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="flex items-end justify-between">
        <div className={cn('text-2xl font-bold', COLORS[color])}>
          {displayValue}
          {suffix && <span className="text-sm font-normal text-gray-500 ml-1">{suffix}</span>}
        </div>
        {change !== undefined && <ChangeIndicator value={change} />}
      </div>
    </div>
  );
}

// Compact version for grids
interface MiniMetricProps {
  label: string;
  value: number | string;
  change?: number;
  className?: string;
}

export function MiniMetric({ label, value, change, className }: MiniMetricProps) {
  const displayValue = typeof value === 'number' ? formatCompactNumber(value) : value;

  return (
    <div className={cn('text-center', className)}>
      <div className="text-lg font-semibold text-gray-900">{displayValue}</div>
      <div className="text-xs text-gray-500">{label}</div>
      {change !== undefined && (
        <div className="mt-1">
          <ChangeIndicator value={change} size="sm" />
        </div>
      )}
    </div>
  );
}
