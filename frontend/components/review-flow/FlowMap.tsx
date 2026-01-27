'use client';

import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import type { FlowNode, Stage, FlowDirection, PaidDependency } from '@/data/review-flow-data';
import { cn } from '@/lib/utils';

interface FlowMapProps {
  nodes: FlowNode[];
}

const STAGE_POSITIONS: Record<Stage, number> = {
  initial: 0,
  deep: 1,
  reachable: 2,
};

const STAGE_LABELS: Record<Stage, string> = {
  initial: 'Initial Review',
  deep: 'Deep Review',
  reachable: 'Reachable',
};

const DIRECTION_CONFIG: Record<FlowDirection, { icon: typeof ArrowUp; color: string; label: string }> = {
  advancing: { icon: ArrowUp, color: 'text-green-500', label: '진전' },
  stable: { icon: ArrowRight, color: 'text-gray-400', label: '정체' },
  declining: { icon: ArrowDown, color: 'text-red-500', label: '약화' },
};

const PAID_DEP_CONFIG: Record<PaidDependency, { color: string; bgColor: string }> = {
  low: { color: 'text-green-600', bgColor: 'bg-green-100' },
  medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  high: { color: 'text-red-600', bgColor: 'bg-red-100' },
};

export default function FlowMap({ nodes }: FlowMapProps) {
  // Group nodes by stage
  const nodesByStage: Record<Stage, FlowNode[]> = {
    initial: nodes.filter((n) => n.stage === 'initial').sort((a, b) => b.intensity - a.intensity),
    deep: nodes.filter((n) => n.stage === 'deep').sort((a, b) => b.intensity - a.intensity),
    reachable: nodes.filter((n) => n.stage === 'reachable').sort((a, b) => b.intensity - a.intensity),
  };

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">기술 검토 흐름도</h2>
          <p className="text-sm text-gray-500">지금 검토가 어디쯤 와 있는가</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <ArrowUp size={12} className="text-green-500" /> 진전
          </div>
          <div className="flex items-center gap-1">
            <ArrowRight size={12} className="text-gray-400" /> 정체
          </div>
          <div className="flex items-center gap-1">
            <ArrowDown size={12} className="text-red-500" /> 약화
          </div>
        </div>
      </div>

      {/* Flow Map Grid */}
      <div className="relative">
        {/* Y-axis label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 -rotate-90 text-xs text-gray-400 whitespace-nowrap">
          검토 강도 (Intensity) →
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-4 ml-4">
          {(['initial', 'deep', 'reachable'] as Stage[]).map((stage) => (
            <div key={stage} className="space-y-2">
              {/* Stage Header */}
              <div
                className={cn(
                  'text-center py-2 rounded-lg text-sm font-medium',
                  stage === 'initial' && 'bg-state-initial/10 text-state-initial',
                  stage === 'deep' && 'bg-state-deep/10 text-state-deep',
                  stage === 'reachable' && 'bg-state-reachable/10 text-state-reachable'
                )}
              >
                {STAGE_LABELS[stage]}
              </div>

              {/* Nodes Container */}
              <div className="min-h-[320px] bg-gray-50 rounded-lg p-3 space-y-3">
                {nodesByStage[stage].length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No technologies
                  </div>
                ) : (
                  nodesByStage[stage].map((node) => {
                    const dirConfig = DIRECTION_CONFIG[node.direction];
                    const paidConfig = PAID_DEP_CONFIG[node.paidDependency];
                    const DirectionIcon = dirConfig.icon;

                    return (
                      <div
                        key={node.id}
                        className="bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-gray-900 text-sm">
                            {node.name}
                          </div>
                          <DirectionIcon size={16} className={dirConfig.color} />
                        </div>

                        {/* Intensity Bar */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Intensity</span>
                            <span className="font-medium">{node.intensity.toFixed(1)}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                stage === 'initial' && 'bg-state-initial',
                                stage === 'deep' && 'bg-state-deep',
                                stage === 'reachable' && 'bg-state-reachable'
                              )}
                              style={{ width: `${(node.intensity / 10) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Paid Dependency Tag */}
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              'text-[10px] px-1.5 py-0.5 rounded',
                              paidConfig.bgColor,
                              paidConfig.color
                            )}
                          >
                            Paid: {node.paidDependency.charAt(0).toUpperCase() + node.paidDependency.slice(1)}
                          </span>
                          <span className="text-[10px] text-gray-400">{node.actionHint}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {/* X-axis label */}
        <div className="text-center mt-4 text-xs text-gray-400">
          검토 단계 (Stage) →
        </div>
      </div>
    </div>
  );
}
