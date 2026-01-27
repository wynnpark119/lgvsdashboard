'use client';

import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type HintType = 'footer' | 'inline' | 'tooltip' | 'collapsible';
type HintStatus = 'good' | 'warning' | 'bad' | 'neutral';

interface InsightHintProps {
  type?: HintType;
  status?: HintStatus;
  message: string;
  detail?: string;
  className?: string;
}

const STATUS_STYLES = {
  good: {
    border: 'border-l-green-500',
    icon: '✅',
    bg: 'bg-green-50',
  },
  warning: {
    border: 'border-l-yellow-500',
    icon: '⚠️',
    bg: 'bg-yellow-50',
  },
  bad: {
    border: 'border-l-red-500',
    icon: '❌',
    bg: 'bg-red-50',
  },
  neutral: {
    border: 'border-l-gray-300',
    icon: '💡',
    bg: 'bg-gray-50',
  },
};

export function InsightHint({
  type = 'footer',
  status = 'neutral',
  message,
  detail,
  className,
}: InsightHintProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const styles = STATUS_STYLES[status];

  // Footer 타입 (카드 하단)
  if (type === 'footer') {
    return (
      <div
        className={cn(
          'mt-4 pt-3 border-t border-dashed border-gray-200',
          'text-sm text-gray-600',
          className
        )}
      >
        <div className="flex items-start gap-2">
          <Lightbulb size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-gray-400 text-xs mr-1">쉽게 말하면:</span>
            <span>{message}</span>
          </div>
        </div>
      </div>
    );
  }

  // Inline 타입 (숫자 옆에 간결하게)
  if (type === 'inline') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 text-xs ml-2',
          status === 'good' && 'text-green-600',
          status === 'warning' && 'text-yellow-600',
          status === 'bad' && 'text-red-600',
          status === 'neutral' && 'text-gray-500',
          className
        )}
      >
        <span>{styles.icon}</span>
        <span>{message}</span>
      </span>
    );
  }

  // Tooltip 타입 (호버 시 표시)
  if (type === 'tooltip') {
    return (
      <span className={cn('relative inline-flex items-center', className)}>
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <HelpCircle size={14} />
        </button>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-[200px] shadow-lg">
              {message}
              {detail && <div className="mt-1 text-gray-300">{detail}</div>}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        )}
      </span>
    );
  }

  // Collapsible 타입 (접이식)
  if (type === 'collapsible') {
    return (
      <div className={cn('mt-3', className)}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span>{isExpanded ? '설명 접기' : '이 차트 이해하기'}</span>
        </button>
        {isExpanded && (
          <div
            className={cn(
              'mt-2 p-3 rounded-lg border-l-3 text-sm text-gray-600',
              styles.bg,
              styles.border
            )}
          >
            <div className="flex items-start gap-2">
              <span>{styles.icon}</span>
              <div>
                <p>{message}</p>
                {detail && <p className="mt-1 text-gray-500 text-xs">{detail}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// 상태 기반 간단 힌트
interface StatusHintProps {
  value: number;
  thresholds: { good: number; warning: number };
  messages: { good: string; warning: string; bad: string };
  higherIsBetter?: boolean;
}

export function StatusHint({
  value,
  thresholds,
  messages,
  higherIsBetter = true,
}: StatusHintProps) {
  let status: HintStatus;
  let message: string;

  if (higherIsBetter) {
    if (value >= thresholds.good) {
      status = 'good';
      message = messages.good;
    } else if (value >= thresholds.warning) {
      status = 'warning';
      message = messages.warning;
    } else {
      status = 'bad';
      message = messages.bad;
    }
  } else {
    if (value <= thresholds.good) {
      status = 'good';
      message = messages.good;
    } else if (value <= thresholds.warning) {
      status = 'warning';
      message = messages.warning;
    } else {
      status = 'bad';
      message = messages.bad;
    }
  }

  return <InsightHint type="inline" status={status} message={message} />;
}
