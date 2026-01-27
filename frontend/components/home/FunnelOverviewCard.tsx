'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Zap, FileText, Megaphone, ChevronDown, ChevronUp } from 'lucide-react';
import type { OverallStatus, StageDistribution } from '@/types';
import { cn, formatNumber, formatPercent } from '@/lib/utils';

interface FunnelOverviewCardProps {
  statusData: OverallStatus;
  distributionData: StageDistribution;
}

const STAGE_CONFIG = {
  tofu: {
    key: 'initial' as const,
    label: 'TOFU',
    fullLabel: 'Top of Funnel',
    meaning: '첫 접촉 · 기술 인지',
    color: '#f43f5e',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
  mofu: {
    key: 'deep' as const,
    label: 'MOFU',
    fullLabel: 'Middle of Funnel',
    meaning: '심화 탐색 · 콘텐츠 소비',
    color: '#e11d48',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  bofu: {
    key: 'reachable' as const,
    label: 'BOFU',
    fullLabel: 'Bottom of Funnel',
    meaning: '검토 완료 · 기술 이해도 高',
    color: '#be123c',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
  },
};

// 주요 드라이버 데이터
const TOP_DRIVERS = {
  tofu: [
    { type: 'content', name: 'Digital Cockpit Overview Video', contribution: 28 },
    { type: 'ads', name: 'Google Display - ADAS', contribution: 22 },
    { type: 'content', name: 'Vehicle Vision Tech Brief', contribution: 18 },
  ],
  mofu: [
    { type: 'content', name: 'Tech Webinar: Next-Gen Cockpit', contribution: 35 },
    { type: 'ads', name: 'LinkedIn - Decision Makers', contribution: 25 },
    { type: 'content', name: 'Case Study: BMW Integration', contribution: 20 },
  ],
  bofu: [
    { type: 'offering', name: 'Technical Spec Sheet Download', contribution: 45 },
    { type: 'content', name: 'Integration Guide', contribution: 30 },
    { type: 'content', name: 'ROI Calculator', contribution: 15 },
  ],
};

export default function FunnelOverviewCard({ statusData, distributionData }: FunnelOverviewCardProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  const stages = [
    { 
      id: 'tofu' as const, 
      count: statusData.initial.count, 
      change: statusData.initial.changeVsLastMonth,
      organic: distributionData.initial.organicRatio,
      paid: distributionData.initial.paidRatio,
    },
    { 
      id: 'mofu' as const, 
      count: statusData.deep.count, 
      change: statusData.deep.changeVsLastMonth,
      organic: distributionData.deep.organicRatio,
      paid: distributionData.deep.paidRatio,
    },
    { 
      id: 'bofu' as const, 
      count: statusData.reachable.count, 
      change: statusData.reachable.changeVsLastMonth,
      organic: distributionData.reachable.organicRatio,
      paid: distributionData.reachable.paidRatio,
    },
  ];

  // 전환율 계산
  const tofuToMofu = ((stages[1].count / stages[0].count) * 100).toFixed(1);
  const mofuToBofu = ((stages[2].count / stages[1].count) * 100).toFixed(1);

  // 전체 비즈니스 인사이트
  const generateOverallInsight = () => {
    const allGrowing = stages.every(s => s.change > 0);
    const bofuHealthy = stages[2].organic >= 80;
    const mofuStrong = stages[1].change > 15;
    
    if (allGrowing && bofuHealthy) {
      return {
        status: 'positive' as const,
        headline: '기술 검토 심화 중, 인지도 전 구간 상승',
        details: [
          `BOFU ${stages[2].organic}%가 자발적 유입 → OEM이 스스로 찾아 깊이 검토하는 상태`,
          `TOFU→MOFU 전환율 ${tofuToMofu}% — 콘텐츠 engagement 양호`,
          mofuStrong ? `MOFU +${stages[1].change.toFixed(1)}% — 심화 콘텐츠 소비 활발` : null,
        ].filter(Boolean) as string[],
        action: '기술 조직에 검토 현황 공유, 심화 콘텐츠(스펙/케이스스터디) 확대',
      };
    } else if (stages[0].paid > 50) {
      return {
        status: 'warning' as const,
        headline: 'TOFU 광고 의존도 높음 — 자연 인지 확대 필요',
        details: [
          `TOFU의 ${stages[0].paid}%가 Paid 유입 → 광고 중단 시 인지도 급감 우려`,
          `Organic 콘텐츠 SEO/검색 노출 확대 필요`,
        ],
        action: 'Organic 콘텐츠 강화, 기술 블로그/아티클 확대',
      };
    } else if (stages[2].change < 5) {
      return {
        status: 'caution' as const,
        headline: 'BOFU 성장 정체 — 심화 검토 전환 필요',
        details: [
          `BOFU 성장률 +${stages[2].change.toFixed(1)}%로 둔화`,
          `MOFU→BOFU 전환율 ${mofuToBofu}% — 검토 심화 콘텐츠 부족 가능성`,
        ],
        action: '상세 스펙/Integration Guide/기술 비교표 콘텐츠 강화',
      };
    }
    return {
      status: 'neutral' as const,
      headline: '기술 인지도 안정 상태',
      details: [`전 구간 균형 있는 검토 유지 중`],
      action: '현 콘텐츠 전략 유지, 주간 모니터링 지속',
    };
  };

  // 각 단계별 인사이트
  const getStageInsight = (stageId: 'tofu' | 'mofu' | 'bofu') => {
    const stage = stages.find(s => s.id === stageId)!;
    
    if (stageId === 'tofu') {
      if (stage.paid > 50) {
        return { status: 'warning', text: `광고 의존도 ${stage.paid}% — Organic 콘텐츠 노출 확대 필요` };
      }
      return { status: 'good', text: `Organic ${stage.organic}% — 자연 검색/유입 중심의 건강한 인지 확산` };
    }
    if (stageId === 'mofu') {
      if (stage.change > 10) {
        return { status: 'good', text: `+${stage.change.toFixed(1)}% 성장 — 심화 콘텐츠 소비 활발` };
      }
      return { status: 'neutral', text: `안정적 탐색 유지 — 웨비나/케이스스터디로 검토 심화 유도` };
    }
    // BOFU
    if (stage.organic >= 80) {
      return { status: 'good', text: `Organic ${stage.organic}% — OEM이 자발적으로 깊이 검토 중, 기술 이해도 높음` };
    }
    return { status: 'neutral', text: `검토 품질 점검 필요 — 자발적 검토 비중 확대 권장` };
  };

  const overallInsight = generateOverallInsight();

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">주목 현황</h2>
          <p className="text-sm text-gray-500">OEM의 VS 기술 검토 단계별 현황 · {statusData.period} 기준</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">
            인지→탐색 {tofuToMofu}%
          </span>
          <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">
            탐색→심화 {mofuToBofu}%
          </span>
        </div>
      </div>

      {/* 전체 인사이트 (먼저) */}
      <div className={cn(
        'rounded-xl p-4 border mb-6',
        overallInsight.status === 'positive' && 'bg-green-50 border-green-200',
        overallInsight.status === 'warning' && 'bg-yellow-50 border-yellow-200',
        overallInsight.status === 'caution' && 'bg-orange-50 border-orange-200',
        overallInsight.status === 'neutral' && 'bg-gray-50 border-gray-200',
      )}>
        <div className="text-xs text-gray-500 mb-2">전체 기술 검토 현황</div>
        <div className={cn(
          'font-semibold mb-2',
          overallInsight.status === 'positive' && 'text-green-800',
          overallInsight.status === 'warning' && 'text-yellow-800',
          overallInsight.status === 'caution' && 'text-orange-800',
          overallInsight.status === 'neutral' && 'text-gray-700',
        )}>
          {overallInsight.status === 'positive' && '✅ '}
          {overallInsight.status === 'warning' && '⚠️ '}
          {overallInsight.status === 'caution' && '🔶 '}
          {overallInsight.headline}
        </div>
        <ul className="space-y-1 mb-3">
          {overallInsight.details.map((detail, idx) => (
            <li key={idx} className={cn(
              'text-sm flex items-start gap-2',
              overallInsight.status === 'positive' && 'text-green-700',
              overallInsight.status === 'warning' && 'text-yellow-700',
              overallInsight.status === 'caution' && 'text-orange-700',
              overallInsight.status === 'neutral' && 'text-gray-600',
            )}>
              <span>•</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
        <div className={cn(
          'text-sm font-medium pt-2 border-t',
          overallInsight.status === 'positive' && 'text-green-800 border-green-200',
          overallInsight.status === 'warning' && 'text-yellow-800 border-yellow-200',
          overallInsight.status === 'caution' && 'text-orange-800 border-orange-200',
          overallInsight.status === 'neutral' && 'text-gray-700 border-gray-200',
        )}>
          → 권장 액션: {overallInsight.action}
        </div>
      </div>

      {/* 각 퍼널 단계 카드 + 인사이트 */}
      <div className="space-y-3">
        {stages.map((stage) => {
          const config = STAGE_CONFIG[stage.id];
          const stageInsight = getStageInsight(stage.id);
          const isExpanded = expandedStage === stage.id;
          const TrendIcon = stage.change > 0 ? TrendingUp : stage.change < 0 ? TrendingDown : Minus;
          const trendColor = stage.change > 0 ? 'text-green-600' : stage.change < 0 ? 'text-red-600' : 'text-gray-500';
          
          return (
            <div key={stage.id} className={cn('rounded-xl border overflow-hidden', config.borderColor)}>
              {/* 상단: 수치 + 인사이트 */}
              <div className={cn('p-4', config.bgColor)}>
                <div className="flex items-start justify-between">
                  {/* 좌측: 라벨 + 수치 */}
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                        <span className="font-bold text-gray-800">{config.label}</span>
                        <span className="text-xs text-gray-500">{config.meaning}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatNumber(stage.count)}
                      </div>
                    </div>
                    
                    {/* 변화율 + Organic/Paid */}
                    <div className="text-sm">
                      <div className={cn('flex items-center gap-1 font-medium mb-1', trendColor)}>
                        <TrendIcon size={14} />
                        <span>{stage.change > 0 ? '+' : ''}{formatPercent(stage.change, 1)} vs 전월</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-blue-600">Organic {stage.organic}%</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500">Paid {stage.paid}%</span>
                      </div>
                    </div>
                  </div>

                  {/* 우측: 드라이버 토글 */}
                  <button 
                    onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    드라이버
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* 단계별 인사이트 */}
                <div className={cn(
                  'mt-3 text-sm px-3 py-2 rounded-lg',
                  stageInsight.status === 'good' ? 'bg-green-100/50 text-green-800' :
                  stageInsight.status === 'warning' ? 'bg-yellow-100/50 text-yellow-800' :
                  'bg-white/50 text-gray-700'
                )}>
                  {stageInsight.status === 'good' && '✓ '}
                  {stageInsight.status === 'warning' && '⚠ '}
                  {stageInsight.text}
                </div>
              </div>

              {/* 드라이버 상세 (펼침 시) */}
              {isExpanded && (
                <div className="bg-white p-4 border-t">
                  <div className="text-xs text-gray-500 mb-2">주요 드라이버 (유입 기여도)</div>
                  <div className="space-y-2">
                    {TOP_DRIVERS[stage.id].map((driver, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-100">
                          {driver.type === 'content' && <FileText size={12} className="text-blue-600" />}
                          {driver.type === 'ads' && <Megaphone size={12} className="text-orange-600" />}
                          {driver.type === 'offering' && <Zap size={12} className="text-purple-600" />}
                        </div>
                        <div className="flex-1 text-sm text-gray-700">{driver.name}</div>
                        <div className="text-sm font-semibold text-gray-900">{driver.contribution}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
