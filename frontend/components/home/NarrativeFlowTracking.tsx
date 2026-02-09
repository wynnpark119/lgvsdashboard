'use client';

import { LayerHandoffMetrics } from '@/types';
import { getLayerLabel } from '@/lib/campaign-helpers';
import { ArrowRight, TrendingUp, TrendingDown, AlertCircle, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NarrativeFlowTrackingProps {
  handoffData: LayerHandoffMetrics[];
}

const QUALITY_CONFIG = {
  high: { label: 'High', color: 'bg-green-100 text-green-700', icon: TrendingUp },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: TrendingDown },
  low: { label: 'Low', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

export default function NarrativeFlowTracking({ handoffData }: NarrativeFlowTrackingProps) {
  // 가장 낮은 handoff rate 찾기
  const lowestHandoff = handoffData.reduce((min, curr) => 
    curr.handoffRate < min.handoffRate ? curr : min
  );

  // 퍼널 데이터 계산 (100%에서 시작해서 각 handoff rate만큼 감소)
  const funnelStages = handoffData.reduce((acc, handoff, idx) => {
    if (idx === 0) {
      acc.push({ 
        layer: handoff.fromLayer, 
        percentage: 100,
        label: getLayerLabel(handoff.fromLayer as any)
      });
    }
    const prevPercentage = acc[acc.length - 1].percentage;
    const nextPercentage = (prevPercentage * handoff.handoffRate) / 100;
    acc.push({ 
      layer: handoff.toLayer, 
      percentage: nextPercentage,
      label: getLayerLabel(handoff.toLayer as any)
    });
    return acc;
  }, [] as Array<{ layer: string; percentage: number; label: string }>);

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Narrative Flow Progression</h2>
        <p className="text-sm text-gray-500">
          Tech On Board 캠페인 레이어를 따라 이동하는 사용자 여정
        </p>
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-4">
        {/* Left: Funnel Visualization */}
        <div className="space-y-0">
          {handoffData.map((handoff, idx) => {
            const fromStage = funnelStages.find(s => s.layer === handoff.fromLayer);
            const toStage = funnelStages.find(s => s.layer === handoff.toLayer);
            const width = fromStage?.percentage || 100;
            const isDropoff = handoff.handoffRate < 30;
            
            return (
              <div key={idx} className="h-[72px] flex flex-col justify-center">
                <div 
                  className={cn(
                    'relative h-14 rounded flex items-center justify-between px-4 transition-all',
                    isDropoff ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-blue-50 border border-blue-200'
                  )}
                  style={{ width: `${Math.max(width, 25)}%` }}
                >
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {getLayerLabel(handoff.fromLayer as any)}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {fromStage?.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
          {/* Last stage */}
          {funnelStages.length > 0 && (
            <div className="h-[72px] flex flex-col justify-center">
              <div 
                className="relative h-14 rounded flex items-center justify-between px-4 bg-blue-50 border border-blue-200"
                style={{ width: `${Math.max(funnelStages[funnelStages.length - 1].percentage, 25)}%` }}
              >
                <span className="text-sm font-medium text-gray-700 truncate">
                  {funnelStages[funnelStages.length - 1].label}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {funnelStages[funnelStages.length - 1].percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Handoff Metrics */}
        <div className="space-y-0">
          {handoffData.map((handoff, idx) => {
            const qualityConfig = QUALITY_CONFIG[handoff.engagementQuality];
            const QualityIcon = qualityConfig.icon;

            return (
              <div 
                key={idx} 
                className={cn(
                  'h-[72px] flex items-center justify-between px-4 rounded border',
                  handoff === lowestHandoff ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                )}
              >
                {/* From → To */}
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium text-gray-700">
                    {getLayerLabel(handoff.fromLayer as any)}
                  </span>
                  <ArrowRight size={14} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {getLayerLabel(handoff.toLayer as any)}
                  </span>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Handoff:</span>{' '}
                    <span className={cn(
                      'font-medium',
                      handoff.handoffRate >= 50 ? 'text-green-600' : 
                      handoff.handoffRate >= 30 ? 'text-yellow-600' : 'text-red-600'
                    )}>
                      {handoff.handoffRate}%
                    </span>
                  </div>
                  <div className="h-4 border-l" />
                  <div>
                    <span className="text-gray-500">Avg Time:</span>{' '}
                    <span className="font-medium text-gray-700">
                      {handoff.avgTimeToNext.toFixed(1)}d
                    </span>
                  </div>
                  <div className="h-4 border-l" />
                  <div className={cn('flex items-center gap-1 text-xs px-2 py-1 rounded', qualityConfig.color)}>
                    <QualityIcon size={12} />
                    <span>{qualityConfig.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Empty space for last stage alignment */}
          <div className="h-[72px]" />
        </div>
      </div>

      {/* Insight */}
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <div className="text-sm font-medium text-yellow-900">주목: 전환율 낮음</div>
        <div className="text-sm text-yellow-700 mt-1">
          {getLayerLabel(lowestHandoff.fromLayer as any)} → {getLayerLabel(lowestHandoff.toLayer as any)} 단계 
          {' '}{100 - lowestHandoff.handoffRate}% 이탈
        </div>
      </div>
    </div>
  );
}
