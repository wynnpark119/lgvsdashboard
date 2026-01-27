'use client';

import type { StageDistribution } from '@/types';
import { FUNNEL_STAGE_CONFIG } from '@/types/funnel';
import { cn, formatNumber, formatPercent } from '@/lib/utils';
import { InsightHint } from '@/components/ui';

interface StageDistributionChartProps {
  data: StageDistribution;
}

const INTERPRETATION_MESSAGES = {
  healthy: { text: '심화 단계로 갈수록 광고 의존도 감소', emoji: '✅', status: 'good' as const },
  dependent: { text: '광고 의존 지속, 검증 필요', emoji: '⚠️', status: 'warning' as const },
  warning: { text: '광고 종료 시 이탈 위험', emoji: '❌', status: 'bad' as const },
};

export default function StageDistributionChart({ data }: StageDistributionChartProps) {
  // 전환율 계산
  const tofuToMofu = data.initial.total > 0 
    ? (data.deep.total / data.initial.total) * 100 
    : 0;
  const mofuToBofu = data.deep.total > 0 
    ? (data.reachable.total / data.deep.total) * 100 
    : 0;

  const interpretation = INTERPRETATION_MESSAGES[data.interpretation];

  // 쉬운 설명 생성
  const generateHint = () => {
    const tofuToMofuPct = Math.round(tofuToMofu);
    const mofuToBofuPct = Math.round(mofuToBofu);
    return `${formatNumber(data.initial.total)}명 방문 중 ${tofuToMofuPct}%가 관심, 그 중 ${mofuToBofuPct}%가 연락 가능`;
  };

  return (
    <div className="bg-white rounded-xl border p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">B2B 퍼널 현황</h2>
        <span className={cn(
          'text-xs px-2 py-1 rounded',
          interpretation.status === 'good' && 'bg-green-50 text-green-700',
          interpretation.status === 'warning' && 'bg-yellow-50 text-yellow-700',
          interpretation.status === 'bad' && 'bg-red-50 text-red-700',
        )}>
          {interpretation.emoji} {interpretation.text}
        </span>
      </div>

      {/* 퍼널 시각화 */}
      <div className="relative flex flex-col items-center py-4">
        {/* TOFU */}
        <div
          className="relative flex items-center justify-center text-white font-medium w-full"
          style={{
            height: '60px',
            background: `linear-gradient(135deg, ${FUNNEL_STAGE_CONFIG.tofu.color} 0%, #fda4af 100%)`,
            clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)',
          }}
        >
          <div className="text-center z-10">
            <div className="text-xl font-bold">{formatNumber(data.initial.total)}</div>
            <div className="text-xs opacity-90">TOFU · 인지</div>
          </div>
          {/* Organic/Paid 표시 */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right text-xs opacity-80">
            <div>Organic {data.initial.organicRatio}%</div>
            <div>Paid {data.initial.paidRatio}%</div>
          </div>
        </div>

        {/* 전환율 표시 TOFU → MOFU */}
        <div className="flex items-center gap-2 py-2 text-sm">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-gray-300" />
          <span className="text-gray-600 font-medium">{formatPercent(tofuToMofu, 1)} 전환</span>
        </div>

        {/* MOFU */}
        <div
          className="relative flex items-center justify-center text-white font-medium"
          style={{
            width: '75%',
            height: '60px',
            background: FUNNEL_STAGE_CONFIG.mofu.color,
            clipPath: 'polygon(5% 0%, 95% 0%, 85% 100%, 15% 100%)',
          }}
        >
          <div className="text-center z-10">
            <div className="text-xl font-bold">{formatNumber(data.deep.total)}</div>
            <div className="text-xs opacity-90">MOFU · 탐색</div>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-right text-xs opacity-80">
            <div>O {data.deep.organicRatio}%</div>
            <div>P {data.deep.paidRatio}%</div>
          </div>
        </div>

        {/* 전환율 표시 MOFU → BOFU */}
        <div className="flex items-center gap-2 py-2 text-sm">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-gray-300" />
          <span className="text-gray-600 font-medium">{formatPercent(mofuToBofu, 1)} MQL</span>
        </div>

        {/* BOFU */}
        <div
          className="relative flex items-center justify-center text-white font-medium"
          style={{
            width: '45%',
            height: '60px',
            background: FUNNEL_STAGE_CONFIG.bofu.color,
            clipPath: 'polygon(10% 0%, 90% 0%, 70% 100%, 30% 100%)',
          }}
        >
          <div className="text-center z-10">
            <div className="text-xl font-bold">{formatNumber(data.reachable.total)}</div>
            <div className="text-xs opacity-90">BOFU · MQL</div>
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ background: FUNNEL_STAGE_CONFIG.tofu.color }} />
          <span>인지 (Initial)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ background: FUNNEL_STAGE_CONFIG.mofu.color }} />
          <span>탐색 (Deep)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ background: FUNNEL_STAGE_CONFIG.bofu.color }} />
          <span>MQL (Reachable)</span>
        </div>
      </div>

      {/* 쉬운 설명 */}
      <InsightHint type="footer" message={generateHint()} />
    </div>
  );
}
