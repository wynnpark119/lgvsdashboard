'use client';

import { ArrowUp, ArrowDown, Minus, TrendingUp, TrendingDown } from 'lucide-react';
import type { Campaign, TechnologyMovement } from '@/data/campaign-impact-data';
import { cn } from '@/lib/utils';

interface BeforeAfterShiftProps {
  campaign: Campaign;
  movements: TechnologyMovement[];
}

export default function BeforeAfterShift({ campaign, movements }: BeforeAfterShiftProps) {
  const { metrics } = campaign;
  const initialChange = metrics.initialAfter - metrics.initialBefore;
  const deepChange = metrics.deepAfter - metrics.deepBefore;

  // Count movements
  const advancedCount = movements.filter((m) => m.movement === 'advanced').length;
  const maintainedCount = movements.filter((m) => m.movement === 'maintained').length;
  const declinedCount = movements.filter((m) => m.movement === 'declined').length;

  return (
    <div className="bg-white rounded-xl border p-6 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">전/후 검토 변화</h2>
        <p className="text-sm text-gray-500">이동이 실제로 있었는지 증거</p>
      </div>

      {/* Stage Distribution Comparison */}
      <div className="space-y-4 mb-6">
        {/* Initial Review */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Initial Review</span>
            <span
              className={cn(
                'font-medium flex items-center gap-1',
                initialChange < 0 ? 'text-green-600' : initialChange > 0 ? 'text-red-600' : 'text-gray-500'
              )}
            >
              {initialChange < 0 ? <TrendingDown size={12} /> : initialChange > 0 ? <TrendingUp size={12} /> : <Minus size={12} />}
              {initialChange > 0 ? '+' : ''}
              {initialChange}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="text-[10px] text-gray-400 mb-1">Before</div>
              <div className="h-6 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full bg-state-initial/50 transition-all"
                  style={{ width: `${metrics.initialBefore}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{metrics.initialBefore}%</div>
            </div>
            <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[10px] text-gray-400 mb-1">After</div>
              <div className="h-6 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full bg-state-initial transition-all"
                  style={{ width: `${metrics.initialAfter}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{metrics.initialAfter}%</div>
            </div>
          </div>
        </div>

        {/* Deep Review */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Deep Review</span>
            <span
              className={cn(
                'font-medium flex items-center gap-1',
                deepChange > 0 ? 'text-green-600' : deepChange < 0 ? 'text-red-600' : 'text-gray-500'
              )}
            >
              {deepChange > 0 ? <TrendingUp size={12} /> : deepChange < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
              {deepChange > 0 ? '+' : ''}
              {deepChange}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="text-[10px] text-gray-400 mb-1">Before</div>
              <div className="h-6 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full bg-state-deep/50 transition-all"
                  style={{ width: `${metrics.deepBefore}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{metrics.deepBefore}%</div>
            </div>
            <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[10px] text-gray-400 mb-1">After</div>
              <div className="h-6 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full bg-state-deep transition-all"
                  style={{ width: `${metrics.deepAfter}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{metrics.deepAfter}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Retention Rate */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">캠페인 종료 후 유지율</div>
            <div className="text-xs text-gray-400">Deep Review 유지 비율</div>
          </div>
          <div
            className={cn(
              'text-2xl font-bold',
              metrics.retention >= 70
                ? 'text-green-600'
                : metrics.retention >= 50
                ? 'text-yellow-600'
                : 'text-red-600'
            )}
          >
            {metrics.retention}%
          </div>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              metrics.retention >= 70
                ? 'bg-green-500'
                : metrics.retention >= 50
                ? 'bg-yellow-500'
                : 'bg-red-500'
            )}
            style={{ width: `${metrics.retention}%` }}
          />
        </div>
      </div>

      {/* Movement Summary */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-green-50 rounded-lg p-2">
          <div className="flex items-center justify-center gap-1 text-green-600">
            <ArrowUp size={12} />
            <span className="text-lg font-bold">{advancedCount}</span>
          </div>
          <div className="text-xs text-green-600">상승</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="flex items-center justify-center gap-1 text-gray-600">
            <Minus size={12} />
            <span className="text-lg font-bold">{maintainedCount}</span>
          </div>
          <div className="text-xs text-gray-600">유지</div>
        </div>
        <div className="bg-red-50 rounded-lg p-2">
          <div className="flex items-center justify-center gap-1 text-red-600">
            <ArrowDown size={12} />
            <span className="text-lg font-bold">{declinedCount}</span>
          </div>
          <div className="text-xs text-red-600">하락</div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="mt-4 pt-4 border-t">
        <div className="text-xs text-gray-500">
          {metrics.retention >= 70 ? (
            <span className="text-green-600">✓ 캠페인 이후에도 검토 상태가 유지되고 있습니다</span>
          ) : metrics.retention >= 50 ? (
            <span className="text-yellow-600">⚠ 일부 검토 상태가 유지되고 있으나 모니터링 필요</span>
          ) : (
            <span className="text-red-600">✗ 캠페인 종료 후 검토 상태가 급락했습니다</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
