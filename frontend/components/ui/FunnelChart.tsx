'use client';

import { cn } from '@/lib/utils';
import { FUNNEL_STAGE_CONFIG } from '@/types/funnel';
import { formatNumber, formatPercent } from '@/lib/utils';
import { InsightHint } from './InsightHint';

interface FunnelData {
  tofu: { count: number; label?: string };
  mofu: { count: number; label?: string };
  bofu: { count: number; label?: string };
}

interface FunnelChartProps {
  data: FunnelData;
  showConversionRates?: boolean;
  showLabels?: boolean;
  showHint?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FunnelChart({
  data,
  showConversionRates = true,
  showLabels = true,
  showHint = true,
  size = 'md',
  className,
}: FunnelChartProps) {
  // 전환율 계산
  const tofuToMofu = data.tofu.count > 0 ? (data.mofu.count / data.tofu.count) * 100 : 0;
  const mofuToBofu = data.mofu.count > 0 ? (data.bofu.count / data.mofu.count) * 100 : 0;

  // 사이즈별 스타일
  const sizeStyles = {
    sm: { height: 'h-32', text: 'text-xs', gap: 'gap-1' },
    md: { height: 'h-48', text: 'text-sm', gap: 'gap-2' },
    lg: { height: 'h-64', text: 'text-base', gap: 'gap-3' },
  };
  const styles = sizeStyles[size];

  // 쉬운 설명 생성
  const generateHint = () => {
    const tofuToMofuPct = Math.round(tofuToMofu);
    const mofuToBofuPct = Math.round(mofuToBofu);
    return `${formatNumber(data.tofu.count)}명 중 ${tofuToMofuPct}%가 관심을 보이고, 그 중 ${mofuToBofuPct}%가 연락 가능`;
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('relative flex flex-col items-center', styles.height)}>
        {/* TOFU */}
        <div
          className="relative flex items-center justify-center text-white font-medium"
          style={{
            width: '100%',
            height: '33.33%',
            background: `linear-gradient(to bottom, ${FUNNEL_STAGE_CONFIG.tofu.color}, ${FUNNEL_STAGE_CONFIG.mofu.color})`,
            clipPath: 'polygon(5% 0%, 95% 0%, 85% 100%, 15% 100%)',
          }}
        >
          <div className="text-center z-10">
            <div className={cn('font-bold', size === 'sm' ? 'text-lg' : 'text-2xl')}>
              {formatNumber(data.tofu.count)}
            </div>
            {showLabels && (
              <div className={cn('opacity-90', styles.text)}>
                {data.tofu.label || FUNNEL_STAGE_CONFIG.tofu.label}
              </div>
            )}
          </div>
        </div>

        {/* TOFU → MOFU 전환율 */}
        {showConversionRates && (
          <div className="absolute left-full top-[25%] ml-4 flex items-center gap-2">
            <div className="w-8 h-px bg-gray-300" />
            <div className={cn('text-gray-600 whitespace-nowrap', styles.text)}>
              <span className="font-medium">{formatPercent(tofuToMofu, 1)}</span>
              <span className="text-gray-400 ml-1">전환</span>
            </div>
          </div>
        )}

        {/* MOFU */}
        <div
          className="relative flex items-center justify-center text-white font-medium -mt-1"
          style={{
            width: '70%',
            height: '33.33%',
            background: FUNNEL_STAGE_CONFIG.mofu.color,
            clipPath: 'polygon(7% 0%, 93% 0%, 80% 100%, 20% 100%)',
          }}
        >
          <div className="text-center z-10">
            <div className={cn('font-bold', size === 'sm' ? 'text-lg' : 'text-2xl')}>
              {formatNumber(data.mofu.count)}
            </div>
            {showLabels && (
              <div className={cn('opacity-90', styles.text)}>
                {data.mofu.label || FUNNEL_STAGE_CONFIG.mofu.label}
              </div>
            )}
          </div>
        </div>

        {/* MOFU → BOFU 전환율 */}
        {showConversionRates && (
          <div className="absolute left-full top-[58%] ml-4 flex items-center gap-2">
            <div className="w-8 h-px bg-gray-300" />
            <div className={cn('text-gray-600 whitespace-nowrap', styles.text)}>
              <span className="font-medium">{formatPercent(mofuToBofu, 1)}</span>
              <span className="text-gray-400 ml-1">MQL</span>
            </div>
          </div>
        )}

        {/* BOFU */}
        <div
          className="relative flex items-center justify-center text-white font-medium -mt-1"
          style={{
            width: '40%',
            height: '33.33%',
            background: FUNNEL_STAGE_CONFIG.bofu.color,
            clipPath: 'polygon(10% 0%, 90% 0%, 50% 100%, 50% 100%)',
          }}
        >
          <div className="text-center z-10">
            <div className={cn('font-bold', size === 'sm' ? 'text-lg' : 'text-2xl')}>
              {formatNumber(data.bofu.count)}
            </div>
            {showLabels && (
              <div className={cn('opacity-90', styles.text)}>
                {data.bofu.label || FUNNEL_STAGE_CONFIG.bofu.label}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 범례 */}
      {showLabels && (
        <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ background: FUNNEL_STAGE_CONFIG.tofu.color }} />
            <span>인지 (TOFU)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ background: FUNNEL_STAGE_CONFIG.mofu.color }} />
            <span>탐색 (MOFU)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ background: FUNNEL_STAGE_CONFIG.bofu.color }} />
            <span>MQL (BOFU)</span>
          </div>
        </div>
      )}

      {/* 쉬운 설명 */}
      {showHint && <InsightHint type="footer" message={generateHint()} />}
    </div>
  );
}

// 미니 퍼널 (테이블/카드용)
interface MiniFunnelProps {
  tofu: number;
  mofu: number;
  bofu: number;
  className?: string;
}

export function MiniFunnel({ tofu, mofu, bofu, className }: MiniFunnelProps) {
  const total = tofu + mofu + bofu;
  const tofuPct = (tofu / total) * 100;
  const mofuPct = (mofu / total) * 100;
  const bofuPct = (bofu / total) * 100;

  return (
    <div className={cn('flex h-6 rounded-full overflow-hidden', className)}>
      <div
        className="flex items-center justify-center text-white text-[10px] font-medium"
        style={{ width: `${tofuPct}%`, background: FUNNEL_STAGE_CONFIG.tofu.color }}
      >
        {tofuPct > 15 && formatNumber(tofu)}
      </div>
      <div
        className="flex items-center justify-center text-white text-[10px] font-medium"
        style={{ width: `${mofuPct}%`, background: FUNNEL_STAGE_CONFIG.mofu.color }}
      >
        {mofuPct > 15 && formatNumber(mofu)}
      </div>
      <div
        className="flex items-center justify-center text-white text-[10px] font-medium"
        style={{ width: `${bofuPct}%`, background: FUNNEL_STAGE_CONFIG.bofu.color }}
      >
        {bofuPct > 10 && formatNumber(bofu)}
      </div>
    </div>
  );
}
