/**
 * Utility Functions
 * 공통 유틸리티 함수
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스 병합
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Re-export formatters for backward compatibility
export {
  formatNumber,
  formatCompactNumber,
  formatPercent,
  formatChange,
  formatDate,
  formatDateISO,
  formatPeriod,
  formatDuration,
  formatIntensity,
  formatCurrency,
  formatRelativeTime,
} from './formatters';
