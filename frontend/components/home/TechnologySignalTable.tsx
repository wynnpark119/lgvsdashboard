'use client';

import { ArrowUp, ArrowDown, Minus, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { TechnologySignal } from '@/data/home-data';
import type { SignalType } from '@/types';
import { cn, formatChange } from '@/lib/utils';

interface TechnologySignalTableProps {
  data: TechnologySignal[];
}

const STAGE_CONFIG = {
  initial: { 
    label: 'TOFU', 
    fullLabel: '첫 접촉',
    bgColor: 'bg-rose-100', 
    textColor: 'text-rose-700',
  },
  deep: { 
    label: 'MOFU', 
    fullLabel: 'Engagement',
    bgColor: 'bg-red-100', 
    textColor: 'text-red-700',
  },
  reachable: { 
    label: 'BOFU', 
    fullLabel: '문의 전환',
    bgColor: 'bg-red-200', 
    textColor: 'text-red-800',
  },
};

const SIGNAL_CONFIG: Record<SignalType, { icon: typeof CheckCircle; color: string; label: string }> = {
  green: { icon: CheckCircle, color: 'text-green-600', label: '문의 전환 · Engagement 高' },
  yellow: { icon: Clock, color: 'text-yellow-600', label: '추가 콘텐츠 노출' },
  orange: { icon: AlertCircle, color: 'text-orange-600', label: '광고 의존 주의' },
  red: { icon: AlertCircle, color: 'text-red-600', label: 'Engagement 하락' },
  gray: { icon: Minus, color: 'text-gray-500', label: '모니터링' },
};

export default function TechnologySignalTable({ data }: TechnologySignalTableProps) {
  // 정렬: 검토 깊이 순
  const sortedData = [...data].sort((a, b) => {
    const stageOrder = { reachable: 3, deep: 2, initial: 1 };
    return stageOrder[b.stage] - stageOrder[a.stage] || b.reviewIntensity - a.reviewIntensity;
  });
  
  const hotTechs = data.filter(t => t.trendDirection === 'up');
  const deepReviewTechs = data.filter(t => t.stage === 'reachable' || t.stage === 'deep');

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">기술별 검토 현황</h2>
          <p className="text-sm text-gray-500">OEM이 어떤 기술을 얼마나 깊이 검토하고 있는가</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {deepReviewTechs.length > 0 && (
            <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-medium">
              심화 검토 {deepReviewTechs.length}
            </span>
          )}
          {hotTechs.length > 0 && (
            <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 font-medium">
              상승 중 {hotTechs.length}
            </span>
          )}
        </div>
      </div>

      {/* 기술 테이블 */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="text-left py-3 px-2 font-medium">기술</th>
              <th className="text-center py-3 px-2 font-medium">검토 단계</th>
              <th className="text-center py-3 px-2 font-medium">추세</th>
              <th className="text-center py-3 px-2 font-medium">광고 의존</th>
              <th className="text-left py-3 px-2 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((tech) => {
              const stageConfig = STAGE_CONFIG[tech.stage];
              const signalConfig = SIGNAL_CONFIG[tech.signal.type];
              const SignalIcon = signalConfig.icon;
              
              const TrendIcon = tech.trendDirection === 'up' ? ArrowUp 
                : tech.trendDirection === 'down' ? ArrowDown 
                : Minus;
              const trendColor = tech.trendDirection === 'up' ? 'text-green-600'
                : tech.trendDirection === 'down' ? 'text-red-600'
                : 'text-gray-400';

              return (
                <tr key={tech.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  {/* 기술명 */}
                  <td className="py-3 px-2">
                    <div className="font-medium text-gray-900">{tech.name}</div>
                    <div className="text-xs text-gray-400">검토 강도 {tech.reviewIntensity.toFixed(1)}/10</div>
                  </td>
                  
                  {/* 검토 단계 */}
                  <td className="text-center py-3 px-2">
                    <span className={cn(
                      'inline-block px-2 py-1 rounded text-xs font-bold',
                      stageConfig.bgColor, stageConfig.textColor
                    )}>
                      {stageConfig.label}
                    </span>
                  </td>
                  
                  {/* 추세 */}
                  <td className="text-center py-3 px-2">
                    <div className={cn('flex items-center justify-center gap-1 font-medium', trendColor)}>
                      <TrendIcon size={14} />
                      <span>{formatChange(tech.trend)}</span>
                    </div>
                  </td>
                  
                  {/* 광고 의존도 */}
                  <td className="text-center py-3 px-2">
                    <span className={cn(
                      'text-xs font-medium',
                      tech.paidDependency === 'low' ? 'text-green-600' :
                      tech.paidDependency === 'high' ? 'text-red-600' : 'text-yellow-600'
                    )}>
                      {tech.paidDependency === 'low' ? 'Low' : tech.paidDependency === 'high' ? 'High' : 'Mid'}
                      <span className="text-gray-400 ml-1">({tech.paidRatio}%)</span>
                    </span>
                  </td>
                  
                  {/* 상태 */}
                  <td className="py-3 px-2">
                    <div className={cn('flex items-center gap-1', signalConfig.color)}>
                      <SignalIcon size={14} />
                      <span className="text-xs font-medium">{signalConfig.label}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
