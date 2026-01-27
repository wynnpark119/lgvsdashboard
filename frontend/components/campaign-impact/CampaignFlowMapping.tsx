'use client';

import { ArrowRight, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import type { FlowTimelinePoint, TechnologyMovement, Campaign } from '@/data/campaign-impact-data';
import { cn } from '@/lib/utils';

interface CampaignFlowMappingProps {
  campaign: Campaign;
  timeline: FlowTimelinePoint[];
  movements: TechnologyMovement[];
}

const MOVEMENT_CONFIG = {
  advanced: { icon: ArrowUp, color: 'text-green-600', bgColor: 'bg-green-50', label: '상승' },
  maintained: { icon: Minus, color: 'text-gray-500', bgColor: 'bg-gray-50', label: '유지' },
  declined: { icon: ArrowDown, color: 'text-red-600', bgColor: 'bg-red-50', label: '하락' },
};

export default function CampaignFlowMapping({ campaign, timeline, movements }: CampaignFlowMappingProps) {
  const phases = ['before', 'during', 'after'] as const;
  const phaseLabels = { before: '캠페인 전', during: '캠페인 중', after: '캠페인 후' };

  // Get unique technologies
  const technologies = movements.map((m) => m.id);

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">캠페인-검토흐름 연결</h2>
          <p className="text-sm text-gray-500">이 캠페인이 Review Flow의 어디를 움직였는가</p>
        </div>
        <div className="text-sm text-gray-500">
          분석 캠페인: <span className="font-medium text-gray-900">{campaign.name}</span>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="relative">
        {/* Phase Headers */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {phases.map((phase, idx) => (
            <div key={phase} className="flex items-center justify-center">
              <div
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  phase === 'during'
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                {phaseLabels[phase]}
              </div>
              {idx < 2 && (
                <ArrowRight size={16} className="absolute text-gray-300" style={{ left: `${(idx + 1) * 33.33 - 2}%` }} />
              )}
            </div>
          ))}
        </div>

        {/* Stage Labels on Y-axis */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 text-xs text-gray-400 space-y-12">
          <div>Deep</div>
          <div>Initial</div>
        </div>

        {/* Flow Grid */}
        <div className="grid grid-cols-3 gap-4 ml-8">
          {phases.map((phase) => {
            const phaseData = timeline.find((t) => t.phase === phase);
            return (
              <div key={phase} className="space-y-2">
                {/* Deep Stage */}
                <div className="h-24 bg-state-deep/5 rounded-lg p-2 border border-dashed border-state-deep/30">
                  <div className="text-[10px] text-state-deep mb-1">Deep Review</div>
                  <div className="flex flex-wrap gap-1">
                    {phaseData?.technologies
                      .filter((t) => t.stage === 'deep')
                      .map((tech) => (
                        <div
                          key={tech.id}
                          className="px-2 py-1 bg-state-deep text-white text-xs rounded"
                          title={`Intensity: ${tech.intensity}`}
                        >
                          {tech.name}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Initial Stage */}
                <div className="h-24 bg-state-initial/5 rounded-lg p-2 border border-dashed border-state-initial/30">
                  <div className="text-[10px] text-state-initial mb-1">Initial Review</div>
                  <div className="flex flex-wrap gap-1">
                    {phaseData?.technologies
                      .filter((t) => t.stage === 'initial')
                      .map((tech) => (
                        <div
                          key={tech.id}
                          className="px-2 py-1 bg-state-initial text-white text-xs rounded"
                          title={`Intensity: ${tech.intensity}`}
                        >
                          {tech.name}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Campaign Period Indicator */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-4 h-1 bg-gray-200 rounded" />
            <span>Baseline</span>
            <div className="w-4 h-1 bg-brand-primary rounded" />
            <span>Campaign Period</span>
            <div className="w-4 h-1 bg-gray-300 rounded" />
            <span>Post-Campaign</span>
          </div>
        </div>
      </div>

      {/* Movement Summary */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-medium text-gray-700 mb-3">기술별 이동 결과</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {movements.map((movement) => {
            const config = MOVEMENT_CONFIG[movement.movement];
            const MovementIcon = config.icon;

            return (
              <div
                key={movement.id}
                className={cn('p-3 rounded-lg border', config.bgColor)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{movement.name}</span>
                  <MovementIcon size={14} className={config.color} />
                </div>
                <div className="text-xs text-gray-500">
                  {movement.stageBefore === movement.stageAfter ? (
                    <span>{movement.stageBefore} 유지</span>
                  ) : (
                    <span>
                      {movement.stageBefore} → {movement.stageAfter}
                    </span>
                  )}
                </div>
                <div className={cn('text-xs font-medium mt-1', config.color)}>
                  {movement.intensityChange > 0 ? '+' : ''}
                  {movement.intensityChange.toFixed(1)} Intensity
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
