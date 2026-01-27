'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { PageHeader } from '@/components/layout';
import { InsightHint } from '@/components/ui';
import { FUNNEL_STAGE_CONFIG } from '@/types/funnel';
import { cn } from '@/lib/utils';

const PAID_ANALYSIS = [
  {
    technology: 'Digital Cockpit',
    organicRatio: 82,
    paidRatio: 18,
    dependency: 'low' as const,
    effect: 'amplifier' as const,
    tofuPaid: 25,
    mofuPaid: 12,
    bofuPaid: 5,
    note: '광고 없이도 자생적 성장',
  },
  {
    technology: 'Vehicle Vision',
    organicRatio: 75,
    paidRatio: 25,
    dependency: 'low' as const,
    effect: 'amplifier' as const,
    tofuPaid: 30,
    mofuPaid: 18,
    bofuPaid: 8,
    note: '광고가 인지도 확대에 기여',
  },
  {
    technology: 'ADAS',
    organicRatio: 62,
    paidRatio: 38,
    dependency: 'medium' as const,
    effect: 'neutral' as const,
    tofuPaid: 45,
    mofuPaid: 32,
    bofuPaid: 15,
    note: '광고 기여 있으나 과의존 아님',
  },
  {
    technology: 'IVI',
    organicRatio: 38,
    paidRatio: 62,
    dependency: 'high' as const,
    effect: 'distorter' as const,
    tofuPaid: 70,
    mofuPaid: 55,
    bofuPaid: 40,
    note: '광고 종료 시 급락 예상',
  },
];

const DEPENDENCY_CONFIG = {
  low: { label: 'Low', color: 'text-green-600', bgColor: 'bg-green-100', barColor: '#22c55e' },
  medium: { label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100', barColor: '#f59e0b' },
  high: { label: 'High', color: 'text-red-600', bgColor: 'bg-red-100', barColor: '#ef4444' },
};

const EFFECT_CONFIG = {
  amplifier: { label: 'Amplifier', color: 'text-green-700', bgColor: 'bg-green-50' },
  neutral: { label: 'Neutral', color: 'text-gray-700', bgColor: 'bg-gray-50' },
  distorter: { label: 'Distorter', color: 'text-yellow-700', bgColor: 'bg-yellow-50' },
};

export default function PaidInfluencePage() {
  // 전체 요약
  const avgPaidRatio = Math.round(PAID_ANALYSIS.reduce((sum, p) => sum + p.paidRatio, 0) / PAID_ANALYSIS.length);
  const highDependencyCount = PAID_ANALYSIS.filter(p => p.dependency === 'high').length;
  const amplifierCount = PAID_ANALYSIS.filter(p => p.effect === 'amplifier').length;

  // 퍼널별 Paid 비율 차트 데이터
  const funnelPaidData = [
    { 
      stage: 'TOFU', 
      avgPaid: Math.round(PAID_ANALYSIS.reduce((sum, p) => sum + p.tofuPaid, 0) / PAID_ANALYSIS.length),
      color: FUNNEL_STAGE_CONFIG.tofu.color,
    },
    { 
      stage: 'MOFU', 
      avgPaid: Math.round(PAID_ANALYSIS.reduce((sum, p) => sum + p.mofuPaid, 0) / PAID_ANALYSIS.length),
      color: FUNNEL_STAGE_CONFIG.mofu.color,
    },
    { 
      stage: 'BOFU', 
      avgPaid: Math.round(PAID_ANALYSIS.reduce((sum, p) => sum + p.bofuPaid, 0) / PAID_ANALYSIS.length),
      color: FUNNEL_STAGE_CONFIG.bofu.color,
    },
  ];

  // 쉬운 설명 생성
  const generateHint = () => {
    if (highDependencyCount > 0) {
      return `⚠️ ${highDependencyCount}개 기술이 광고에 과의존. 광고 종료 시 관심 급락 예상`;
    }
    return `✅ 대부분 기술이 자생적 성장 중. 광고는 가속 역할`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="광고 영향"
        description=""
      />

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Summary Cards */}
          <section className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">평균 Paid 비율</div>
              <div className="text-2xl font-bold text-gray-900">{avgPaidRatio}%</div>
              <div className="text-xs text-gray-400">전체 기술 평균</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">Amplifier</div>
              <div className="text-2xl font-bold text-green-600">{amplifierCount}개</div>
              <div className="text-xs text-gray-400">광고가 긍정적 역할</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">과의존 기술</div>
              <div className={cn(
                'text-2xl font-bold',
                highDependencyCount > 0 ? 'text-red-600' : 'text-green-600'
              )}>
                {highDependencyCount}개
              </div>
              <div className="text-xs text-gray-400">주의 필요</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">건강도</div>
              <div className={cn(
                'text-2xl font-bold',
                highDependencyCount === 0 ? 'text-green-600' : 
                highDependencyCount === 1 ? 'text-yellow-600' : 'text-red-600'
              )}>
                {highDependencyCount === 0 ? '좋음' : highDependencyCount === 1 ? '주의' : '경고'}
              </div>
              <div className="text-xs text-gray-400">광고 의존도 기준</div>
            </div>
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funnel Stage Paid Ratio */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">퍼널 단계별 Paid 비율</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={funnelPaidData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="stage" type="category" width={60} />
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Paid 비율']} />
                  <Bar dataKey="avgPaid" radius={[0, 4, 4, 0]}>
                    {funnelPaidData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <InsightHint
                type="footer"
                status={funnelPaidData[2].avgPaid < 20 ? 'good' : 'warning'}
                message={
                  funnelPaidData[2].avgPaid < 20
                    ? `BOFU(심화 검토)의 Paid 비율이 ${funnelPaidData[2].avgPaid}%로 낮음. 자생적 검토 중`
                    : `BOFU(심화 검토)도 광고 의존도가 높음. 콘텐츠 전략 점검 필요`
                }
              />
            </div>

            {/* Technology Paid Dependency */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">기술별 Paid 의존도</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={PAID_ANALYSIS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="technology" fontSize={12} />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Paid 비율']} />
                  <Bar dataKey="paidRatio" radius={[4, 4, 0, 0]}>
                    {PAID_ANALYSIS.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={DEPENDENCY_CONFIG[entry.dependency].barColor} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span className="text-gray-500">Low (좋음)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-yellow-500" />
                  <span className="text-gray-500">Medium (관찰)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-gray-500">High (주의)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Detailed Cards */}
          <section className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">기술별 상세 분석</h3>
            <div className="space-y-4">
              {PAID_ANALYSIS.map((item) => {
                const depConfig = DEPENDENCY_CONFIG[item.dependency];
                const effectConfig = EFFECT_CONFIG[item.effect];

                return (
                  <div key={item.technology} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold text-gray-900">{item.technology}</h4>
                        <span className={cn('px-2 py-1 rounded text-xs font-medium', depConfig.bgColor, depConfig.color)}>
                          Paid Dep: {depConfig.label}
                        </span>
                        <span className={cn('px-2 py-1 rounded text-xs font-medium', effectConfig.bgColor, effectConfig.color)}>
                          {effectConfig.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Paid 비율</div>
                        <div className={cn('text-xl font-bold', depConfig.color)}>{item.paidRatio}%</div>
                      </div>
                    </div>

                    {/* Organic vs Paid Bar */}
                    <div className="mb-4">
                      <div className="flex h-6 rounded-lg overflow-hidden bg-gray-100">
                        <div
                          className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${item.organicRatio}%` }}
                        >
                          Organic {item.organicRatio}%
                        </div>
                        <div
                          className="bg-gray-400 flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${item.paidRatio}%` }}
                        >
                          Paid {item.paidRatio}%
                        </div>
                      </div>
                    </div>

                    {/* Funnel Stage Paid */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-500">TOFU Paid</div>
                        <div className="font-medium">{item.tofuPaid}%</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-500">MOFU Paid</div>
                        <div className="font-medium">{item.mofuPaid}%</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-500">BOFU Paid</div>
                        <div className="font-medium">{item.bofuPaid}%</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-3">{item.note}</p>
                  </div>
                );
              })}
            </div>

            {/* Overall Insight */}
            <InsightHint
              type="footer"
              status={highDependencyCount > 0 ? 'warning' : 'good'}
              message={generateHint()}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
