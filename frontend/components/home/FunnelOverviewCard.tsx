'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Zap, FileText, Megaphone, ChevronDown, ChevronUp, Globe, Linkedin, Youtube } from 'lucide-react';
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
    meaning: '전체 채널 첫 접촉',
    color: '#3b82f6',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  mofu: {
    key: 'deep' as const,
    label: 'MOFU',
    fullLabel: 'Middle of Funnel',
    meaning: '심화 탐색 · Engagement',
    color: '#10b981',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  bofu: {
    key: 'reachable' as const,
    label: 'BOFU',
    fullLabel: 'Bottom of Funnel',
    meaning: '문의 전환',
    color: '#A50034',
    bgColor: 'bg-red-50',
    borderColor: 'border-brand-primary',
  },
};

// 채널별 기여도 데이터 (2026 통합 퍼널)
const TOP_DRIVERS = {
  tofu: [
    { type: 'channel', name: 'LinkedIn (Thought Leader Ads)', contribution: 48 },
    { type: 'channel', name: 'LG.com 첫 방문 (SEO/DA)', contribution: 35 },
    { type: 'channel', name: 'YouTube VVC', contribution: 10 },
    { type: 'channel', name: 'Reddit (신규)', contribution: 7 },
  ],
  mofu: [
    { type: 'channel', name: 'LinkedIn ETR (Engagement)', contribution: 52 },
    { type: 'channel', name: 'LG.com 재방문·Whitepaper', contribution: 32 },
    { type: 'channel', name: 'Public 웨비나 참석', contribution: 10 },
    { type: 'channel', name: 'YouTube 50%+ 시청', contribution: 6 },
  ],
  bofu: [
    { type: 'content', name: 'LG.com 문의 폼 제출', contribution: 75 },
    { type: 'content', name: 'LG Loop DB 수집', contribution: 25 },
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

  // 전체 비즈니스 인사이트 (2026 사업계획 기준)
  const generateOverallInsight = () => {
    const allGrowing = stages.every(s => s.change > 0);
    const mofuStrong = stages[1].change > 15;
    const bofuGrowing = stages[2].change > 10;
    
    if (allGrowing && mofuStrong) {
      return {
        status: 'positive' as const,
        headline: 'LG on board 캠페인 효과 — 전략과제(HPC, Transformable Display) 관심 급증',
        details: [
          `전체 채널 TOFU +${stages[0].change.toFixed(1)}% — CES 2026 + LG on board 시너지`,
          `MOFU +${stages[1].change.toFixed(1)}% — LinkedIn Thought Leadership & 웨비나 효과`,
          bofuGrowing ? `문의 +${stages[2].change.toFixed(1)}% — OEM 대상 실제 비즈니스 기회 확대` : null,
        ].filter(Boolean) as string[],
        action: 'HPC/Transformable Display 심화 콘텐츠 확대, 기술 조직 협업 강화',
      };
    } else if (stages[0].paid > 50) {
      return {
        status: 'warning' as const,
        headline: '광고 의존도 높음 — Organic 채널 강화 필요',
        details: [
          `전체 유입의 ${stages[0].paid}%가 Paid → LinkedIn/Reddit Organic 확대 필요`,
          `Always-On 광고 효율 점검, Thought Leadership 콘텐츠 강화`,
        ],
        action: 'Expert Discussion 시리즈 확대, Technical Whitepaper 배포',
      };
    } else if (stages[2].change < 5) {
      return {
        status: 'caution' as const,
        headline: '문의 전환 정체 — MOFU→BOFU 전환 강화 필요',
        details: [
          `문의 성장률 +${stages[2].change.toFixed(1)}%로 둔화`,
          `Private 웨비나 & OEM 타겟 콘텐츠로 전환율 개선 필요`,
        ],
        action: 'LG Loop DB 활용, ABM 광고 강화, 문의 CTA 개선',
      };
    }
    return {
      status: 'neutral' as const,
      headline: 'LG on board 캠페인 진행 중 — 전략과제 모니터링',
      details: [`HPC, Transformable Display 중심 콘텐츠 전략 유지`],
      action: 'Public 웨비나 참석률 모니터링, LinkedIn ETR 추적',
    };
  };

  // 각 단계별 인사이트 (2026 사업계획 기준)
  const getStageInsight = (stageId: 'tofu' | 'mofu' | 'bofu') => {
    const stage = stages.find(s => s.id === stageId)!;
    
    if (stageId === 'tofu') {
      if (stage.change > 15) {
        return { status: 'good', text: `CES 2026 + LG on board 효과 — HPC/Transformable Display 인지도 급증 +${stage.change.toFixed(1)}%` };
      }
      if (stage.paid > 50) {
        return { status: 'warning', text: `광고 의존도 ${stage.paid}% — Reddit/LinkedIn Organic 확대 필요` };
      }
      return { status: 'neutral', text: `전략과제 인지도 유지 — Always-On 광고 효과 모니터링` };
    }
    if (stageId === 'mofu') {
      if (stage.change > 10) {
        return { status: 'good', text: `LinkedIn ETR +${stage.change.toFixed(1)}% — Thought Leadership & Public 웨비나 효과` };
      }
      return { status: 'neutral', text: `Engagement 안정 — Expert Discussion 시리즈로 심화 유도` };
    }
    // BOFU
    if (stage.change > 10) {
      return { status: 'good', text: `OEM 문의 +${stage.change.toFixed(1)}% — HPC/Display 관련 실제 비즈니스 기회` };
    }
    return { status: 'neutral', text: `문의 전환 안정 — Private 웨비나 & ABM 강화 권장` };
  };

  const overallInsight = generateOverallInsight();

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">주목 현황</h2>
          <p className="text-sm text-gray-500">LinkedIn + LG.com + YouTube 통합 퍼널 · {statusData.period} 기준</p>
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
                    {TOP_DRIVERS[stage.id].map((driver, idx) => {
                      // 채널별 아이콘 결정
                      const getDriverIcon = () => {
                        if (driver.name.includes('LinkedIn')) return <Linkedin size={12} className="text-blue-600" />;
                        if (driver.name.includes('LG.com')) return <Globe size={12} className="text-green-600" />;
                        if (driver.name.includes('YouTube')) return <Youtube size={12} className="text-red-600" />;
                        if (driver.type === 'content') return <FileText size={12} className="text-blue-600" />;
                        if (driver.type === 'ads') return <Megaphone size={12} className="text-orange-600" />;
                        return <Zap size={12} className="text-purple-600" />;
                      };
                      
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-100">
                            {getDriverIcon()}
                          </div>
                          <div className="flex-1 text-sm text-gray-700">{driver.name}</div>
                          <div className="text-sm font-semibold text-gray-900">{driver.contribution}%</div>
                        </div>
                      );
                    })}
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
