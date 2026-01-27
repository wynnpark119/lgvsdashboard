'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceDot,
} from 'recharts';
import type { TrendData } from '@/data/detail-reference-data';
import { cn, formatDate } from '@/lib/utils';

interface MetricTrendVerificationProps {
  trendData: TrendData[];
}

export default function MetricTrendVerification({ trendData }: MetricTrendVerificationProps) {
  const [selectedMetric, setSelectedMetric] = useState(trendData[0]?.metric || 'sessions');

  const currentTrend = trendData.find((t) => t.metric === selectedMetric) || trendData[0];

  // Prepare chart data
  const chartData = currentTrend?.data.map((point) => ({
    ...point,
    dateLabel: formatDate(point.date),
  })) || [];

  // Find campaign period boundaries
  const campaignPoints = chartData.filter((d) => d.isCampaignPeriod);
  const campaignStart = campaignPoints[0]?.dateLabel;
  const campaignEnd = campaignPoints[campaignPoints.length - 1]?.dateLabel;

  // Find review flow movement points
  const reviewFlowPoints = chartData.filter((d) => d.isReviewFlowPoint);

  return (
    <div className="bg-white rounded-xl border p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">지표 추세 검증</h2>
          <p className="text-sm text-gray-500">우리가 본 흐름이 착시가 아닌지 확인</p>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex gap-2 mb-4">
        {trendData.map((trend) => (
          <button
            key={trend.metric}
            onClick={() => setSelectedMetric(trend.metric)}
            className={cn(
              'px-3 py-1.5 rounded text-sm transition-colors',
              selectedMetric === trend.metric
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {trend.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
              formatter={(value: number) => [value.toFixed(2), currentTrend.label]}
            />
            {/* Campaign period highlight */}
            {campaignStart && campaignEnd && (
              <ReferenceArea
                x1={campaignStart}
                x2={campaignEnd}
                fill="#8b5cf6"
                fillOpacity={0.1}
                label={{ value: 'Campaign', position: 'top', fontSize: 10, fill: '#8b5cf6' }}
              />
            )}
            {/* Review Flow movement points */}
            {reviewFlowPoints.map((point, idx) => (
              <ReferenceDot
                key={idx}
                x={point.dateLabel}
                y={point.value}
                r={6}
                fill="#ef4444"
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>{currentTrend.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-3 bg-purple-500/20 rounded" />
          <span>Campaign Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Review Flow Movement</span>
        </div>
      </div>

      {/* Interpretation */}
      <div className="mt-4 pt-4 border-t">
        <h3 className="text-sm font-medium text-gray-700 mb-2">해석 포인트</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Review Flow 변화 시점(빨간 점)과 데이터 변화가 정합됨</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-500">⚠</span>
            <span>캠페인 종료 후 일부 하락 → 단기 스파이크 요소 존재</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">ℹ</span>
            <span>전체적으로 baseline 대비 상승 유지 → 지속 패턴 확인</span>
          </div>
        </div>
      </div>
    </div>
  );
}
