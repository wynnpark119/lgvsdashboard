'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ChannelMetrics } from '@/data/detail-reference-data';
import { CHANNEL_ICONS } from '@/data/detail-reference-data';
import { cn, formatNumber } from '@/lib/utils';

interface ChannelDetailTablesProps {
  channelMetrics: ChannelMetrics[];
  selectedChannel?: string;
  onSelectChannel?: (channel: string) => void;
}

export default function ChannelDetailTables({
  channelMetrics,
  selectedChannel,
  onSelectChannel,
}: ChannelDetailTablesProps) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">채널별 상세 데이터</h2>
        <p className="text-sm text-gray-500">채널별 숫자를 있는 그대로 확인</p>
      </div>

      {/* Channel Tabs */}
      <div className="flex gap-2 mb-4 border-b pb-4">
        {channelMetrics.map((cm) => (
          <button
            key={cm.channel}
            onClick={() => onSelectChannel?.(cm.channel)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
              selectedChannel === cm.channel
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <span>{CHANNEL_ICONS[cm.channel]}</span>
            {cm.label}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {channelMetrics.map((cm) => (
          <div
            key={cm.channel}
            className={cn(
              'p-4 rounded-lg border transition-all',
              selectedChannel === cm.channel ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200'
            )}
          >
            {/* Channel Header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{CHANNEL_ICONS[cm.channel]}</span>
              <span className="font-medium text-gray-900">{cm.label}</span>
            </div>

            {/* Metrics Table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-500 font-normal">Metric</th>
                  <th className="text-right py-2 text-gray-500 font-normal">Value</th>
                  <th className="text-right py-2 text-gray-500 font-normal">Change</th>
                </tr>
              </thead>
              <tbody>
                {cm.metrics.map((metric) => (
                  <tr key={metric.name} className="border-b last:border-0">
                    <td className="py-2 text-gray-700">{metric.name}</td>
                    <td className="py-2 text-right font-medium text-gray-900">
                      {typeof metric.value === 'number' && metric.value >= 1000
                        ? formatNumber(metric.value)
                        : metric.value}
                      {metric.unit && <span className="text-gray-500 ml-1">{metric.unit}</span>}
                    </td>
                    <td className="py-2 text-right">
                      {metric.change !== undefined && (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1',
                            metric.changeDirection === 'up' && 'text-green-600',
                            metric.changeDirection === 'down' && 'text-red-600',
                            metric.changeDirection === 'stable' && 'text-gray-500'
                          )}
                        >
                          {metric.changeDirection === 'up' && <TrendingUp size={12} />}
                          {metric.changeDirection === 'down' && <TrendingDown size={12} />}
                          {metric.changeDirection === 'stable' && <Minus size={12} />}
                          {metric.change > 0 ? '+' : ''}
                          {metric.change}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Important Notice */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
        <strong>📌 참고:</strong> 지표 비교는 동일 채널 내에서만 유효합니다. 채널 간 효율 비교는 지양해 주세요.
      </div>
    </div>
  );
}
