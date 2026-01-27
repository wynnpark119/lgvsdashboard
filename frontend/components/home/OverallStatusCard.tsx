'use client';

import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import type { OverallStatus } from '@/types';
import { cn, formatNumber, formatPercent } from '@/lib/utils';

interface OverallStatusCardProps {
  data: OverallStatus;
}

const STAGE_CONFIG = {
  initial: { 
    label: 'TOFU', 
    subLabel: '인지',
    color: 'bg-rose-400',
  },
  deep: { 
    label: 'MOFU', 
    subLabel: '탐색',
    color: 'bg-red-400',
  },
  reachable: { 
    label: 'BOFU', 
    subLabel: 'MQL',
    color: 'bg-red-600',
  },
};

// 강해진 신호 유형
const SIGNAL_TYPES = {
  dwell: '체류 시간',
  revisit: '재방문',
  videoDepth: '영상 시청 깊이',
  webinar: '웨비나 등록',
  inquiry: '문의/Inquiry',
};

export default function OverallStatusCard({ data }: OverallStatusCardProps) {
  const { initial, deep, reachable, currentState, period } = data;

  // 3요소 인사이트 생성
  // [강해진 신호] → [검토 상태 해석] → [의사결정 시사점]
  const generateInsight = () => {
    const toConfig = STAGE_CONFIG[currentState.toStage];
    
    if (currentState.direction === 'up') {
      if (currentState.toStage === 'deep') {
        return {
          signal: '재방문 +23%, 영상 시청 깊이 +18%',
          interpretation: `${toConfig.label}(${toConfig.subLabel}) 단계 신호가 강화됨`,
          action: '→ 심화 콘텐츠 유지, 세일즈 준비 시작',
          status: 'good' as const,
        };
      } else if (currentState.toStage === 'reachable') {
        return {
          signal: 'Inquiry +35%, 미팅 요청 +28%',
          interpretation: `${toConfig.label}(${toConfig.subLabel}) 단계 신호가 급증`,
          action: '→ 세일즈 즉시 관여, 영업팀 전달',
          status: 'good' as const,
        };
      }
      return {
        signal: '체류 시간 +15%, 페이지뷰 +12%',
        interpretation: `${toConfig.label}(${toConfig.subLabel}) 단계 신호가 상승 중`,
        action: '→ 인지 콘텐츠 확대, 채널 노출 유지',
        status: 'good' as const,
      };
    } else if (currentState.direction === 'down') {
      return {
        signal: '재방문 -12%, 체류 시간 -8%',
        interpretation: '전반적 관심 신호가 약화됨',
        action: '→ 원인 분석 필요, 콘텐츠/캠페인 점검',
        status: 'warning' as const,
      };
    }
    return {
      signal: '주요 지표 변동 없음',
      interpretation: '현재 검토 상태 유지 중',
      action: '→ 현 상태 모니터링 지속',
      status: 'neutral' as const,
    };
  };

  const insight = generateInsight();

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">전체 검토 현황</h2>
        <span className="text-sm text-gray-500">{period} 기준</span>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { key: 'initial' as const, data: initial },
          { key: 'deep' as const, data: deep },
          { key: 'reachable' as const, data: reachable },
        ].map(({ key, data: stageData }, idx) => {
          const config = STAGE_CONFIG[key];
          const isTarget = key === currentState.toStage;
          return (
            <div key={key} className="relative">
              <div
                className={cn(
                  'rounded-lg p-4 text-center',
                  'bg-gray-50 border-2 border-transparent',
                  isTarget && 'border-red-400 bg-red-50'
                )}
              >
                <div className={cn('w-3 h-3 rounded-full mx-auto mb-2', config.color)} />
                <div className="text-xs text-gray-500 mb-1">
                  <span className="font-medium">{config.label}</span>
                  <span className="text-gray-400 ml-1">· {config.subLabel}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(stageData.count)}
                </div>
                <div
                  className={cn(
                    'text-xs mt-1 font-medium',
                    stageData.changeVsLastMonth > 0
                      ? 'text-green-600'
                      : stageData.changeVsLastMonth < 0
                      ? 'text-red-600'
                      : 'text-gray-500'
                  )}
                >
                  {stageData.changeVsLastMonth > 0 ? '+' : ''}{formatPercent(stageData.changeVsLastMonth, 1)} vs 전월
                </div>
              </div>
              {idx < 2 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                  <ArrowRight className="text-gray-300" size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3요소 인사이트 박스 */}
      <div className={cn(
        'rounded-lg p-4 space-y-3',
        insight.status === 'good' && 'bg-green-50 border border-green-200',
        insight.status === 'warning' && 'bg-yellow-50 border border-yellow-200',
        insight.status === 'neutral' && 'bg-gray-50 border border-gray-200',
      )}>
        {/* 1. 강해진 신호 */}
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
            insight.status === 'good' && 'bg-green-200 text-green-700',
            insight.status === 'warning' && 'bg-yellow-200 text-yellow-700',
            insight.status === 'neutral' && 'bg-gray-200 text-gray-700',
          )}>
            1
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-0.5">강해진 신호</div>
            <div className={cn(
              'font-semibold',
              insight.status === 'good' && 'text-green-800',
              insight.status === 'warning' && 'text-yellow-800',
              insight.status === 'neutral' && 'text-gray-700',
            )}>
              {insight.signal}
            </div>
          </div>
        </div>

        {/* 2. 검토 상태 해석 */}
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
            insight.status === 'good' && 'bg-green-200 text-green-700',
            insight.status === 'warning' && 'bg-yellow-200 text-yellow-700',
            insight.status === 'neutral' && 'bg-gray-200 text-gray-700',
          )}>
            2
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-0.5">검토 상태 해석</div>
            <div className={cn(
              'font-semibold',
              insight.status === 'good' && 'text-green-800',
              insight.status === 'warning' && 'text-yellow-800',
              insight.status === 'neutral' && 'text-gray-700',
            )}>
              {insight.interpretation}
            </div>
          </div>
        </div>

        {/* 3. 의사결정 시사점 */}
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
            insight.status === 'good' && 'bg-green-200 text-green-700',
            insight.status === 'warning' && 'bg-yellow-200 text-yellow-700',
            insight.status === 'neutral' && 'bg-gray-200 text-gray-700',
          )}>
            3
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-0.5">의사결정 시사점</div>
            <div className={cn(
              'font-semibold',
              insight.status === 'good' && 'text-green-800',
              insight.status === 'warning' && 'text-yellow-800',
              insight.status === 'neutral' && 'text-gray-700',
            )}>
              {insight.action}
            </div>
          </div>
        </div>
      </div>

      {/* 광고 영향 주석 */}
      {currentState.paidInfluence === 'with_paid' && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          ※ 위 신호에는 Paid Media 유입이 포함되어 있음 (광고 종료 시 변동 가능)
        </div>
      )}
    </div>
  );
}
