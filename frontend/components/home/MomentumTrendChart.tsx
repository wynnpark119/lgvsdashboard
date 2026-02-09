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
  ReferenceLine,
} from 'recharts';
import type { MomentumData } from '@/types';
import { cn, formatDate } from '@/lib/utils';

interface MomentumTrendChartProps {
  data: MomentumData;
}

export default function MomentumTrendChart({ data }: MomentumTrendChartProps) {
  const { dataPoints, campaigns, interpretation } = data;

  const chartData = dataPoints.map((point) => ({
    ...point,
    dateLabel: formatDate(point.date),
  }));

  const campaign = campaigns[0];
  const campaignStart = dataPoints.findIndex((d) => d.stage === 'campaign');
  const campaignEnd = dataPoints.filter((d) => d.stage === 'campaign').length + campaignStart - 1;

  // Baseline 평균
  const baselinePoints = dataPoints.filter(d => d.stage === 'baseline');
  const baselineAvg = baselinePoints.reduce((sum, p) => sum + p.value, 0) / baselinePoints.length;

  // 비즈니스 인사이트
  const getBusinessInsight = () => {
    const { preIntensity, peakIntensity, postIntensity, changeVsBaseline } = interpretation;
    const retained = postIntensity > preIntensity * 1.1;
    const peakMultiple = (peakIntensity / preIntensity).toFixed(1);

    if (retained && changeVsBaseline >= 30) {
      return {
        status: 'positive' as const,
        headline: `Tech On Board 캠페인 효과 지속 — 기술 인지도 Baseline 대비 +${changeVsBaseline}% 유지`,
        details: [
          `캠페인 기간 중 관심도 ${peakMultiple}배 상승 (${preIntensity.toFixed(1)} → ${peakIntensity.toFixed(1)})`,
          `캠페인 종료 후에도 ${postIntensity.toFixed(1)} 수준 유지 — Narrative Flow를 통한 실제 기술 관심 형성`,
          `Issue Seeding → Narrative Film → Core Tech Pillars 구조가 효과적으로 작동`,
        ],
        action: 'Narrative-driven 캠페인 포맷 문서화, 다음 분기 반복 집행 검토',
      };
    } else if (changeVsBaseline > 0) {
      return {
        status: 'moderate' as const,
        headline: `캠페인 효과 일부 유지 — +${changeVsBaseline}%`,
        details: [
          `피크 대비 하락했으나 Baseline보다는 높은 수준`,
          `추가 콘텐츠 노출 없이 시간 경과 시 Baseline 복귀 가능성`,
        ],
        action: 'Core Tech Pillar 후속 콘텐츠로 인지도 유지, Authority Content 강화',
      };
    } else {
      return {
        status: 'warning' as const,
        headline: '캠페인 효과 미지속 — Baseline 복귀',
        details: [
          `캠페인 종료 후 급락하여 기존 수준으로 회귀`,
          `일시적 트래픽만 발생, 실제 기술 검토 전환 실패`,
        ],
        action: '캠페인 타겟팅/메시지 재검토, 콘텐츠 품질 점검',
      };
    }
  };

  const insight = getBusinessInsight();

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">기술 인지도 추이</h2>
          <p className="text-sm text-gray-500">시간에 따른 VS 기술 관심 강도 변화 · {data.period}</p>
        </div>
        {campaign && (
          <div className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 font-medium">
            {campaign.name} ({campaign.startDate} ~ {campaign.endDate})
          </div>
        )}
      </div>

      {/* 핵심 수치 */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">Before</div>
          <div className="text-xl font-bold text-gray-700">{interpretation.preIntensity.toFixed(1)}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-xs text-purple-600 mb-1">Peak</div>
          <div className="text-xl font-bold text-purple-700">{interpretation.peakIntensity.toFixed(1)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">After</div>
          <div className="text-xl font-bold text-gray-700">{interpretation.postIntensity.toFixed(1)}</div>
        </div>
        <div className={cn(
          'rounded-lg p-3 text-center',
          interpretation.changeVsBaseline > 20 ? 'bg-green-50' : 'bg-yellow-50'
        )}>
          <div className="text-xs text-gray-500 mb-1">vs Baseline</div>
          <div className={cn(
            'text-xl font-bold',
            interpretation.changeVsBaseline > 20 ? 'text-green-600' : 'text-yellow-600'
          )}>
            +{interpretation.changeVsBaseline}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
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
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis
              domain={[0, 10]}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)} / 10`, '관심 강도']}
            />
            <ReferenceLine y={baselineAvg} stroke="#9ca3af" strokeDasharray="5 5" />
            {campaignStart >= 0 && (
              <ReferenceArea
                x1={chartData[campaignStart]?.dateLabel}
                x2={chartData[campaignEnd]?.dateLabel}
                fill="#8b5cf6"
                fillOpacity={0.15}
              />
            )}
            <Area
              type="monotone"
              dataKey="intensity"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorIntensity)"
              dot={false}
              activeDot={{ r: 4, fill: '#8b5cf6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 비즈니스 인사이트 */}
      <div className={cn(
        'rounded-xl p-4 border',
        insight.status === 'positive' && 'bg-green-50 border-green-200',
        insight.status === 'moderate' && 'bg-yellow-50 border-yellow-200',
        insight.status === 'warning' && 'bg-orange-50 border-orange-200',
      )}>
        <div className={cn(
          'font-semibold mb-2',
          insight.status === 'positive' && 'text-green-800',
          insight.status === 'moderate' && 'text-yellow-800',
          insight.status === 'warning' && 'text-orange-800',
        )}>
          {insight.status === 'positive' && '✅ '}
          {insight.status === 'moderate' && '🔶 '}
          {insight.status === 'warning' && '⚠️ '}
          {insight.headline}
        </div>
        <ul className="space-y-1 mb-3">
          {insight.details.map((detail, idx) => (
            <li key={idx} className={cn(
              'text-sm flex items-start gap-2',
              insight.status === 'positive' && 'text-green-700',
              insight.status === 'moderate' && 'text-yellow-700',
              insight.status === 'warning' && 'text-orange-700',
            )}>
              <span>•</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
        <div className={cn(
          'text-sm font-medium pt-2 border-t',
          insight.status === 'positive' && 'text-green-800 border-green-200',
          insight.status === 'moderate' && 'text-yellow-800 border-yellow-200',
          insight.status === 'warning' && 'text-orange-800 border-orange-200',
        )}>
          → {insight.action}
        </div>
      </div>
    </div>
  );
}
