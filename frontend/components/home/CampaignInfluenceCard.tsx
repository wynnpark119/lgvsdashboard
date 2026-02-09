'use client';

import { CheckCircle, XCircle, MinusCircle, Megaphone, Video, FileText, Users, TrendingUp } from 'lucide-react';
import type { CampaignContext } from '@/data/home-data';
import { cn, formatNumber, formatPercent } from '@/lib/utils';

interface CampaignInfluenceCardProps {
  data: CampaignContext[];
}

// 캠페인별 YoY 데이터 (2026 사업계획 기준)
const CAMPAIGN_YOY = {
  'lg-on-board-2026': {
    lastYear: { visitors: 12500, engagement: 45, deepReview: 22 },
    thisYear: { visitors: 21300, engagement: 68, deepReview: 38 },
    yoyChange: { visitors: 70, engagement: 51, deepReview: 73 },
  },
  'ces-2026': {
    lastYear: { visitors: 5200, engagement: 42, deepReview: 18 },
    thisYear: { visitors: 9850, engagement: 72, deepReview: 35 },
    yoyChange: { visitors: 89, engagement: 71, deepReview: 94 },
  },
  'ai-on-board': {
    lastYear: { visitors: 3200, engagement: 38, deepReview: 15 },
    thisYear: { visitors: 5800, engagement: 58, deepReview: 28 },
    yoyChange: { visitors: 81, engagement: 53, deepReview: 87 },
  },
  'public-webinar-2026': {
    lastYear: { visitors: 1200, engagement: 55, deepReview: 22 },
    thisYear: { visitors: 2150, engagement: 78, deepReview: 42 },
    yoyChange: { visitors: 79, engagement: 42, deepReview: 91 },
  },
};

// 캠페인별 주요 드라이버 (2026 사업계획 기준)
const CAMPAIGN_DRIVERS = {
  'lg-on-board-2026': [
    { type: 'ads', name: 'LinkedIn Thought Leader Ads (ETR 5.2%)', contribution: 35 },
    { type: 'content', name: 'HPC (High-Performance Computing)/Transformable Display 랜딩페이지', contribution: 28 },
    { type: 'ads', name: 'Google SA/DA Always-On', contribution: 22 },
    { type: 'content', name: 'Technical Whitepaper 다운로드', contribution: 15 },
  ],
  'ces-2026': [
    { type: 'content', name: 'CES 2026 데모 영상 (LG.com)', contribution: 32 },
    { type: 'content', name: 'LG P-pod 랜딩페이지', contribution: 28 },
    { type: 'ads', name: 'LinkedIn ABM - OEM 타겟', contribution: 25 },
    { type: 'ads', name: 'Reddit 신규 채널 테스트', contribution: 15 },
  ],
  'ai-on-board': [
    { type: 'content', name: 'AI 솔루션 소개 영상', contribution: 38 },
    { type: 'ads', name: 'LinkedIn Thought Leader Ads', contribution: 32 },
    { type: 'content', name: 'Expert Discussion 시리즈', contribution: 30 },
  ],
  'public-webinar-2026': [
    { type: 'content', name: 'Public 웨비나 등록/시청', contribution: 45 },
    { type: 'content', name: 'Case Study 다운로드', contribution: 30 },
    { type: 'ads', name: 'LinkedIn 웨비나 프로모션', contribution: 25 },
  ],
};

const STAGE_LABELS = {
  initial: 'TOFU',
  deep: 'MOFU',
  reachable: 'BOFU',
};

export default function CampaignInfluenceCard({ data }: CampaignInfluenceCardProps) {
  const amplifiers = data.filter(c => c.analysis.influence === 'amplifier');
  const distorters = data.filter(c => c.analysis.influence === 'distorter');

  // 비즈니스 인사이트
  const getBusinessInsight = () => {
    if (amplifiers.length > 0) {
      const best = amplifiers[0];
      const yoy = CAMPAIGN_YOY[best.id as keyof typeof CAMPAIGN_YOY];
      return {
        status: 'positive' as const,
        headline: `${best.name} — 기술 인지도 YoY +${yoy?.yoyChange.visitors || 0}% 성장`,
        details: [
          `전년 대비 방문자 +${yoy?.yoyChange.visitors || 0}%, 심화 검토 비중 +${yoy?.yoyChange.deepReview || 0}% 증가`,
          `종료 후 ${best.analysis.postRetention}% 유지 → 일시적 트래픽이 아닌 실제 기술 관심 형성`,
          `유사 포맷(이벤트/웨비나) 반복 집행 권장`,
        ],
        action: '성공 캠페인 포맷 표준화, 기술 조직에 검토 현황 공유',
      };
    } else if (distorters.length > 0) {
      const worst = distorters[0];
      return {
        status: 'warning' as const,
        headline: `${worst.name} — 효과 미지속`,
        details: [
          `캠페인 중 상승했으나 종료 후 급락`,
          `YoY 성장률 미달 — 콘텐츠/타겟팅 재점검 필요`,
        ],
        action: '캠페인 구조 재설계, 후속 콘텐츠 노출 강화',
      };
    }
    return {
      status: 'neutral' as const,
      headline: '캠페인 영향 분석 중',
      details: ['명확한 패턴 미확인, 추가 데이터 필요'],
      action: '모니터링 지속',
    };
  };

  const insight = getBusinessInsight();

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">캠페인/이벤트 영향</h2>
          <p className="text-sm text-gray-500">어떤 캠페인이 기술 인지도를 높였고, 전년 대비 성장했는가</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {amplifiers.length > 0 && (
            <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-medium">
              효과적 {amplifiers.length}
            </span>
          )}
        </div>
      </div>

      {/* 캠페인 리스트 */}
      <div className="space-y-4 mb-4">
        {data.map((campaign) => {
          const isAmplifier = campaign.analysis.influence === 'amplifier';
          const isDistorter = campaign.analysis.influence === 'distorter';
          const drivers = CAMPAIGN_DRIVERS[campaign.id as keyof typeof CAMPAIGN_DRIVERS] || [];
          const yoy = CAMPAIGN_YOY[campaign.id as keyof typeof CAMPAIGN_YOY];
          
          return (
            <div
              key={campaign.id}
              className={cn(
                'rounded-xl border p-4',
                isAmplifier ? 'border-green-200 bg-green-50/30' : 
                isDistorter ? 'border-yellow-200 bg-yellow-50/30' : 'border-gray-200'
              )}
            >
              {/* 캠페인 헤더 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isAmplifier ? (
                    <CheckCircle size={18} className="text-green-600" />
                  ) : isDistorter ? (
                    <XCircle size={18} className="text-yellow-600" />
                  ) : (
                    <MinusCircle size={18} className="text-gray-400" />
                  )}
                  <span className="font-semibold text-gray-900">{campaign.name}</span>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded font-medium',
                    isAmplifier ? 'bg-green-100 text-green-700' :
                    isDistorter ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                  )}>
                    {isAmplifier ? 'AMPLIFIER' : isDistorter ? 'DISTORTER' : 'NEUTRAL'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {campaign.period.start} ~ {campaign.period.end}
                </span>
              </div>

              {/* YoY 비교 */}
              {yoy && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 border text-center">
                    <div className="text-xs text-gray-500 mb-1">방문자</div>
                    <div className="text-lg font-bold text-gray-900">{formatNumber(yoy.thisYear.visitors)}</div>
                    <div className={cn(
                      'text-xs font-medium flex items-center justify-center gap-1',
                      yoy.yoyChange.visitors > 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      <TrendingUp size={10} />
                      YoY {yoy.yoyChange.visitors > 0 ? '+' : ''}{yoy.yoyChange.visitors}%
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border text-center">
                    <div className="text-xs text-gray-500 mb-1">Engagement</div>
                    <div className="text-lg font-bold text-gray-900">{yoy.thisYear.engagement}%</div>
                    <div className={cn(
                      'text-xs font-medium flex items-center justify-center gap-1',
                      yoy.yoyChange.engagement > 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      <TrendingUp size={10} />
                      YoY {yoy.yoyChange.engagement > 0 ? '+' : ''}{yoy.yoyChange.engagement}%
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border text-center">
                    <div className="text-xs text-gray-500 mb-1">심화 검토</div>
                    <div className="text-lg font-bold text-gray-900">{yoy.thisYear.deepReview}%</div>
                    <div className={cn(
                      'text-xs font-medium flex items-center justify-center gap-1',
                      yoy.yoyChange.deepReview > 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      <TrendingUp size={10} />
                      YoY {yoy.yoyChange.deepReview > 0 ? '+' : ''}{yoy.yoyChange.deepReview}%
                    </div>
                  </div>
                </div>
              )}

              {/* 전/중/후 효과 */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-50 rounded-lg p-2 text-center border">
                  <div className="text-[10px] text-gray-500">Before</div>
                  <div className="font-bold text-gray-700">{formatNumber(campaign.metrics.before.count)}</div>
                </div>
                <div className={cn(
                  'rounded-lg p-2 text-center border',
                  campaign.metrics.during.change === 'up' ? 'bg-green-100 border-green-200' : 'bg-gray-50'
                )}>
                  <div className="text-[10px] text-gray-500">During {campaign.metrics.during.change === 'up' && '↑'}</div>
                  <div className="font-bold text-gray-700">{formatNumber(campaign.metrics.during.count)}</div>
                </div>
                <div className={cn(
                  'rounded-lg p-2 text-center border',
                  campaign.analysis.postRetention >= 60 ? 'bg-green-100 border-green-200' : 'bg-gray-50'
                )}>
                  <div className="text-[10px] text-gray-500">After ({campaign.analysis.postRetention}% 유지)</div>
                  <div className="font-bold text-gray-700">{formatNumber(campaign.metrics.after.count)}</div>
                </div>
              </div>

              {/* 주요 드라이버 */}
              {drivers.length > 0 && (
                <div className="bg-white/80 rounded-lg p-3 border mb-3">
                  <div className="text-xs text-gray-500 mb-2">주요 드라이버</div>
                  <div className="space-y-1">
                    {drivers.map((driver, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded flex items-center justify-center bg-gray-100">
                          {driver.type === 'content' && <Video size={10} className="text-blue-600" />}
                          {driver.type === 'ads' && <Megaphone size={10} className="text-orange-600" />}
                        </div>
                        <span className="flex-1 text-gray-700">{driver.name}</span>
                        <span className="font-semibold text-gray-900">{driver.contribution}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 한 줄 판단 */}
              <div className={cn(
                'text-sm rounded-lg p-2',
                isAmplifier ? 'bg-green-100 text-green-800' :
                isDistorter ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'
              )}>
                {campaign.analysis.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* 비즈니스 인사이트 */}
      <div className={cn(
        'rounded-xl p-4 border',
        insight.status === 'positive' && 'bg-green-50 border-green-200',
        insight.status === 'warning' && 'bg-yellow-50 border-yellow-200',
        insight.status === 'neutral' && 'bg-gray-50 border-gray-200',
      )}>
        <div className="text-xs text-gray-500 mb-2">캠페인 종합 판단</div>
        <div className={cn(
          'font-semibold mb-2',
          insight.status === 'positive' && 'text-green-800',
          insight.status === 'warning' && 'text-yellow-800',
          insight.status === 'neutral' && 'text-gray-700',
        )}>
          {insight.status === 'positive' && '✅ '}
          {insight.status === 'warning' && '⚠️ '}
          {insight.headline}
        </div>
        <ul className="space-y-1 mb-3">
          {insight.details.map((detail, idx) => (
            <li key={idx} className={cn(
              'text-sm flex items-start gap-2',
              insight.status === 'positive' && 'text-green-700',
              insight.status === 'warning' && 'text-yellow-700',
              insight.status === 'neutral' && 'text-gray-600',
            )}>
              <span>•</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
        <div className={cn(
          'text-sm font-medium pt-2 border-t',
          insight.status === 'positive' && 'text-green-800 border-green-200',
          insight.status === 'warning' && 'text-yellow-800 border-yellow-200',
          insight.status === 'neutral' && 'text-gray-700 border-gray-200',
        )}>
          → {insight.action}
        </div>
      </div>
    </div>
  );
}
