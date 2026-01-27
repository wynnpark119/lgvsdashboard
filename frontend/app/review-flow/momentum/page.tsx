'use client';

import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { PageHeader } from '@/components/layout';
import { DEMO_FLOW_TREND, FLOW_SUMMARY } from '@/data/review-flow-data';
import { cn } from '@/lib/utils';

const PERIOD_OPTIONS = [
  { id: '30d', label: '30일' },
  { id: '60d', label: '60일' },
  { id: '90d', label: '90일' },
];

const MOMENTUM_METRICS = [
  {
    id: 'overall',
    label: 'Overall Intensity',
    current: 5.8,
    previous: 4.0,
    change: 45,
    direction: 'up' as const,
  },
  {
    id: 'initial-to-deep',
    label: 'TOFU → MOFU 전환율',
    current: 22.1,
    previous: 18.5,
    change: 19.5,
    direction: 'up' as const,
  },
  {
    id: 'retention',
    label: '심화 검토 유지율',
    current: 78,
    previous: 72,
    change: 8.3,
    direction: 'up' as const,
  },
  {
    id: 'paid-dependency',
    label: 'Paid Dependency',
    current: 35,
    previous: 42,
    change: -16.7,
    direction: 'down' as const,
  },
];

export default function MomentumPage() {
  const chartData = DEMO_FLOW_TREND.map((dp) => ({
    date: dp.date.slice(5), // MM-DD format
    intensity: dp.intensity,
    stage: dp.stage,
  }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="추세"
        description=""
      />

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Period Selector */}
          <section className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {PERIOD_OPTIONS.map((period) => (
                <button
                  key={period.id}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    period.id === '90d'
                      ? 'bg-brand-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {period.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>전체 방향:</span>
              <span className={cn(
                'flex items-center gap-1 font-medium',
                FLOW_SUMMARY.overallDirection === 'advancing' ? 'text-green-600' : 'text-gray-600'
              )}>
                {FLOW_SUMMARY.overallDirection === 'advancing' && <TrendingUp size={16} />}
                {FLOW_SUMMARY.overallDirection === 'advancing' ? '진전 중' : '유지'}
              </span>
            </div>
          </section>

          {/* Momentum Metrics */}
          <section className="grid grid-cols-4 gap-4">
            {MOMENTUM_METRICS.map((metric) => {
              const DirectionIcon = metric.direction === 'up' ? ArrowUp : ArrowDown;
              const isPositive = metric.id === 'paid-dependency' 
                ? metric.direction === 'down' 
                : metric.direction === 'up';

              return (
                <div key={metric.id} className="bg-white rounded-xl border p-4">
                  <div className="text-sm text-gray-500 mb-2">{metric.label}</div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      {metric.current}
                      {metric.id !== 'overall' && '%'}
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 text-sm font-medium',
                      isPositive ? 'text-green-600' : 'text-red-600'
                    )}>
                      <DirectionIcon size={14} />
                      {Math.abs(metric.change)}%
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    vs 이전 기간: {metric.previous}{metric.id !== 'overall' && '%'}
                  </div>
                </div>
              );
            })}
          </section>

          {/* Main Trend Chart */}
          <section className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">검토 강도 추이</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-primary" />
                  <span className="text-gray-600">Intensity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-3 bg-green-100 rounded" />
                  <span className="text-gray-600">Campaign Period</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[0, 10]}
                  ticks={[0, 2.5, 5, 7.5, 10]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                
                {/* Campaign period highlight */}
                <ReferenceArea 
                  x1="01-01" 
                  x2="01-10" 
                  fill="#dcfce7" 
                  fillOpacity={0.6}
                />
                
                {/* Baseline */}
                <ReferenceLine 
                  y={4.0} 
                  stroke="#9ca3af" 
                  strokeDasharray="5 5" 
                  label={{ value: 'Baseline', position: 'left', fontSize: 10 }}
                />
                
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="#A50034"
                  strokeWidth={2}
                  dot={{ fill: '#A50034', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Chart Interpretation */}
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 mb-1">Pre-Campaign</div>
                  <div className="font-medium text-gray-900">Intensity: 4.0</div>
                  <div className="text-xs text-gray-500">Baseline 수준</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-green-700 mb-1">Campaign Peak</div>
                  <div className="font-medium text-green-900">Intensity: 9.5</div>
                  <div className="text-xs text-green-700">+137.5% vs Baseline</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-blue-700 mb-1">Post-Campaign</div>
                  <div className="font-medium text-blue-900">Intensity: 5.8</div>
                  <div className="text-xs text-blue-700">+45% 유지 (vs Baseline)</div>
                </div>
              </div>
            </div>
          </section>

          {/* Stability Analysis */}
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">안정성 분석</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">흐름 안정성</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Volatility (변동성)</span>
                    <span className="text-sm font-medium text-green-600">Low</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trend Consistency</span>
                    <span className="text-sm font-medium text-green-600">High</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Post-Campaign Retention</span>
                    <span className="text-sm font-medium text-green-600">Strong</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">해석</h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                    <TrendingUp size={16} />
                    안정적 상승 추세
                  </div>
                  <p className="text-sm text-green-700">
                    캠페인 종료 후에도 +45% 수준 유지. 일시적 스파이크가 아닌 
                    구조적 검토 강화로 해석됨. 기술 조직에 현황 공유 적합.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
