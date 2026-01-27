'use client';

import type { StageSignal, SignalLevel } from '@/data/review-flow-data';
import { cn } from '@/lib/utils';

interface StageSignalSummaryProps {
  initialSignals: StageSignal[];
  deepSignals: StageSignal[];
}

const LEVEL_CONFIG: Record<SignalLevel, { color: string; bgColor: string; width: string }> = {
  low: { color: 'text-gray-600', bgColor: 'bg-gray-200', width: 'w-1/3' },
  medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-400', width: 'w-2/3' },
  high: { color: 'text-green-600', bgColor: 'bg-green-500', width: 'w-full' },
};

function SignalBar({ signal }: { signal: StageSignal }) {
  const config = LEVEL_CONFIG[signal.level];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{signal.name}</span>
        <span className={cn('text-xs font-medium capitalize', config.color)}>
          {signal.level}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', config.bgColor, config.width)} />
      </div>
      <div className="text-xs text-gray-500">{signal.description}</div>
    </div>
  );
}

export default function StageSignalSummary({ initialSignals, deepSignals }: StageSignalSummaryProps) {
  return (
    <div className="bg-white rounded-xl border p-6 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">단계별 신호 요약</h2>
      <p className="text-sm text-gray-500 mb-6">왜 이 기술이 이 위치에 있는가</p>

      <div className="space-y-6">
        {/* Initial Review Signals */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-state-initial" />
            <span className="text-sm font-medium text-gray-700">Initial Review Signal</span>
          </div>
          <div className="space-y-4 pl-5">
            {initialSignals.map((signal) => (
              <SignalBar key={signal.name} signal={signal} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Deep Review Signals */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-state-deep" />
            <span className="text-sm font-medium text-gray-700">Deep Review Signal</span>
          </div>
          <div className="space-y-4 pl-5">
            {deepSignals.map((signal) => (
              <SignalBar key={signal.name} signal={signal} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
