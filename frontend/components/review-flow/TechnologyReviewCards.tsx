'use client';

import Link from 'next/link';
import { ArrowUp, ArrowRight, ArrowDown, ChevronRight } from 'lucide-react';
import type { FlowNode } from '@/data/review-flow-data';
import { cn } from '@/lib/utils';

interface TechnologyReviewCardsProps {
  nodes: FlowNode[];
}

const STAGE_CONFIG = {
  initial: { label: 'Initial', color: 'bg-state-initial/10 text-state-initial' },
  deep: { label: 'Deep', color: 'bg-state-deep/10 text-state-deep' },
  reachable: { label: 'Reachable', color: 'bg-state-reachable/10 text-state-reachable' },
};

const DIRECTION_CONFIG = {
  advancing: { icon: ArrowUp, color: 'text-green-600', label: '상승' },
  stable: { icon: ArrowRight, color: 'text-gray-500', label: '유지' },
  declining: { icon: ArrowDown, color: 'text-red-600', label: '하락' },
};

const PAID_CONFIG = {
  low: { color: 'text-green-600', bgColor: 'bg-green-50' },
  medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  high: { color: 'text-red-600', bgColor: 'bg-red-50' },
};

const ACTION_HINT_STYLE: Record<string, string> = {
  '영업 접촉 가능': 'bg-green-100 text-green-700',
  '심화 검토 유지': 'bg-blue-100 text-blue-700',
  '관찰 필요': 'bg-yellow-100 text-yellow-700',
  '광고 효과 검증 필요': 'bg-orange-100 text-orange-700',
  '콘텐츠 강화 필요': 'bg-purple-100 text-purple-700',
  '추가 콘텐츠 필요': 'bg-red-100 text-red-700',
  '이탈 방지 필요': 'bg-red-100 text-red-700',
};

export default function TechnologyReviewCards({ nodes }: TechnologyReviewCardsProps) {
  // Sort by stage (deep first) then by intensity change direction
  const sortedNodes = [...nodes].sort((a, b) => {
    const stageScore = { reachable: 3, deep: 2, initial: 1 };
    const stageDiff = stageScore[b.stage] - stageScore[a.stage];
    if (stageDiff !== 0) return stageDiff;
    
    const dirScore = { advancing: 3, stable: 2, declining: 1 };
    return dirScore[b.direction] - dirScore[a.direction];
  });

  return (
    <div className="bg-white rounded-xl border p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">기술별 검토 카드</h2>
          <p className="text-sm text-gray-500">지금 봐야 할 기술</p>
        </div>
        <Link
          href="/detail/technology"
          className="text-sm text-brand-primary hover:underline flex items-center gap-1"
        >
          전체 보기 <ChevronRight size={14} />
        </Link>
      </div>

      <div className="space-y-3">
        {sortedNodes.map((node) => {
          const stageConfig = STAGE_CONFIG[node.stage];
          const dirConfig = DIRECTION_CONFIG[node.direction];
          const paidConfig = PAID_CONFIG[node.paidDependency];
          const DirectionIcon = dirConfig.icon;
          const hintStyle = ACTION_HINT_STYLE[node.actionHint] || 'bg-gray-100 text-gray-700';

          return (
            <Link
              key={node.id}
              href={`/campaign-impact?tech=${node.id}`}
              className="block p-4 rounded-lg border hover:border-brand-primary/30 hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center justify-between">
                {/* Left: Tech Info */}
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium text-gray-900">{node.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('text-xs px-2 py-0.5 rounded', stageConfig.color)}>
                        {stageConfig.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        Intensity {node.intensity.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Direction & Paid */}
                <div className="flex items-center gap-4">
                  <div className={cn('flex items-center gap-1 text-sm', dirConfig.color)}>
                    <DirectionIcon size={14} />
                    <span>{dirConfig.label}</span>
                  </div>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded capitalize',
                      paidConfig.bgColor,
                      paidConfig.color
                    )}
                  >
                    Paid: {node.paidDependency}
                  </span>
                </div>

                {/* Right: Action Hint */}
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs px-2 py-1 rounded', hintStyle)}>
                    {node.actionHint}
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
