'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import type { TrendDataPoint } from '@/data/review-flow-data';
import { cn, formatDate } from '@/lib/utils';

interface FlowTrendChartProps {
  data: TrendDataPoint[];
  transitionRate: {
    initialToDeep: number;
    deepToReachable: number;
  };
  stability: 'stable' | 'unstable' | 'very_stable';
}

const STABILITY_CONFIG = {
  stable: { label: 'Stable', color: 'text-green-600', bgColor: 'bg-green-50', description: 'Organic 전환 진행 중' },
  unstable: { label: 'Unstable', color: 'text-yellow-600', bgColor: 'bg-yellow-50', description: '광고 의존 주의' },
  very_stable: { label: 'Very Stable', color: 'text-green-700', bgColor: 'bg-green-100', description: '자생적 성장' },
};

export default function FlowTrendChart({ data, transitionRate, stability }: FlowTrendChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    dateLabel: formatDate(point.date),
  }));

  const stabilityConfig = STABILITY_CONFIG[stability];

  // Find campaign period indices
  const campaignStart = chartData.findIndex((d) => d.stage === 'campaign');
  const campaignEnd = chartData.filter((d) => d.stage === 'campaign').length + campaignStart - 1;

  // Calculate metrics
  const baselineAvg = data.filter(d => d.stage === 'baseline').reduce((sum, d) => sum + d.intensity, 0) / 
                      data.filter(d => d.stage === 'baseline').length;
  const postAvg = data.filter(d => d.stage === 'post_campaign').reduce((sum, d) => sum + d.intensity, 0) / 
                  data.filter(d => d.stage === 'post_campaign').length;
  const retention = ((postAvg - baselineAvg) / baselineAvg * 100).toFixed(0);

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">흐름 추세 및 안정성</h2>
          <p className="text-sm text-gray-500">이 흐름이 일시적인가, 방향성인가</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="text-sm border rounded-lg px-3 py-1.5 bg-white">
            <option>90 days</option>
            <option>60 days</option>
            <option>30 days</option>
          </select>
          <span className={cn('px-3 py-1 rounded-lg text-sm font-medium', stabilityConfig.bgColor, stabilityConfig.color)}>
            {stabilityConfig.label}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Initial → Deep</div>
          <div className="text-xl font-bold text-gray-900">{transitionRate.initialToDeep}%</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Deep → Reachable</div>
          <div className="text-xl font-bold text-gray-900">{transitionRate.deepToReachable}%</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Baseline Avg</div>
          <div className="text-xl font-bold text-gray-900">{baselineAvg.toFixed(1)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Post-Campaign Lift</div>
          <div className={cn('text-xl font-bold', Number(retention) > 0 ? 'text-green-600' : 'text-red-600')}>
            {Number(retention) > 0 ? '+' : ''}{retention}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFlowIntensity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="dateLabel"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis
              domain={[0, 10]}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [value.toFixed(1), 'Intensity']}
            />
            {/* Campaign period highlight */}
            {campaignStart >= 0 && (
              <ReferenceArea
                x1={chartData[campaignStart]?.dateLabel}
                x2={chartData[campaignEnd]?.dateLabel}
                fill="#8b5cf6"
                fillOpacity={0.15}
                label={{ value: 'CES 2026', position: 'top', fontSize: 10, fill: '#8b5cf6' }}
              />
            )}
            <Area
              type="monotone"
              dataKey="intensity"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorFlowIntensity)"
              dot={false}
              activeDot={{ r: 4, fill: '#8b5cf6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-2 bg-gray-200 rounded" />
          <span>Baseline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-2 bg-state-deep/30 rounded" />
          <span>Campaign Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-2 bg-gray-100 rounded" />
          <span>Post-Campaign</span>
        </div>
      </div>

      {/* Interpretation */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm">
          <span className={cn('px-2 py-1 rounded', stabilityConfig.bgColor, stabilityConfig.color)}>
            {stabilityConfig.label}
          </span>
          <span className="text-gray-600">{stabilityConfig.description}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">
            캠페인 종료 후에도 Baseline 대비 +{retention}% 유지
          </span>
        </div>
      </div>
    </div>
  );
}
