'use client';

import { FileText, Video, Mic } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { cn } from '@/lib/utils';

// 2026 사업계획 반영 콘텐츠 캠페인
const CONTENT_CAMPAIGNS = [
  {
    id: 'hpc-whitepaper',
    name: 'HPC Technical Whitepaper',
    type: 'document',
    period: { start: '2025-12-01', end: '2026-01-31' },
    description: 'High-Performance Computing 기술 백서 (전략과제)',
    metrics: {
      downloads: 1856,
      uniqueVisitors: 5840,
      conversionRate: 31.8,
      avgReadTime: 8.5,
    },
    impact: 'amplifier' as const,
    summary: 'TOFU → MOFU 전환 가속, OEM 문의 직접 연결',
  },
  {
    id: 'public-webinar-2026',
    name: 'Public 웨비나 시리즈',
    type: 'webinar',
    period: { start: '2026-01-15', end: '2026-02-28' },
    description: '고객사 임직원 및 Industry Experts 대상 (연 6회 예정)',
    metrics: {
      sessions: 2,
      registrations: 1420,
      attendance: 986,
      attendanceRate: 69.4,
    },
    impact: 'amplifier' as const,
    summary: 'MOFU Engagement 증가',
  },
  {
    id: 'tech-on-board-video',
    name: 'Tech On Board Campaign Videos',
    type: 'video',
    period: { start: '2026-01-07', end: '2026-01-20' },
    description: 'HPC, Transformable Display, LG P-pod 데모 영상',
    metrics: {
      totalViews: 32500,
      avgViewDuration: 4.2,
      completionRate: 78.5,
      shares: 1256,
    },
    impact: 'amplifier' as const,
    summary: '전략과제 인지도 급상승, TOFU 대규모 유입',
  },
  {
    id: 'experience-on-board-content',
    name: 'Experience on Board 콘텐츠',
    type: 'document',
    period: { start: '2025-11-01', end: '2026-01-31' },
    description: 'Digital Cockpit + LG P-pod 통합 콘텐츠',
    metrics: {
      downloads: 1245,
      uniqueVisitors: 4580,
      conversionRate: 27.2,
      avgReadTime: 6.8,
    },
    impact: 'amplifier' as const,
    summary: 'Experience on Board 캠페인 연계, MOFU 전환 양호',
  },
  {
    id: 'tech-explainer-series',
    name: 'Technology Explainer Videos',
    type: 'video',
    period: { start: '2025-10-01', end: '2026-01-31' },
    description: 'Transformable Display, ADAS 기술 설명 영상',
    metrics: {
      totalViews: 18650,
      avgViewDuration: 3.5,
      completionRate: 62.3,
      shares: 542,
    },
    impact: 'supporter' as const,
    summary: 'TOFU 유지',
  },
];

const CONTENT_TYPE_CONFIG = {
  webinar: { icon: Mic, label: '웨비나', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  document: { icon: FileText, label: '문서', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  video: { icon: Video, label: '영상', color: 'text-red-600', bgColor: 'bg-red-50' },
};

const IMPACT_CONFIG = {
  amplifier: { label: 'Amplifier', color: 'text-green-600', bgColor: 'bg-green-50' },
  distorter: { label: 'Distorter', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  supporter: { label: 'Supporter', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  neutral: { label: 'Neutral', color: 'text-gray-600', bgColor: 'bg-gray-50' },
};

export default function ContentCampaignPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="콘텐츠 영향"
        description=""
      />

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Summary Stats */}
          <section className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">전체 콘텐츠 캠페인</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{CONTENT_CAMPAIGNS.length}</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">Amplifier</div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {CONTENT_CAMPAIGNS.filter((c) => c.impact === 'amplifier').length}
              </div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">Supporter</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {CONTENT_CAMPAIGNS.filter((c) => c.impact === 'supporter').length}
              </div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">전체 Engagement</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">49.3K</div>
            </div>
          </section>

          {/* Content Campaign Cards */}
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">콘텐츠 캠페인 상세</h2>
            <div className="space-y-4">
              {CONTENT_CAMPAIGNS.map((campaign) => {
                const typeConfig = CONTENT_TYPE_CONFIG[campaign.type as keyof typeof CONTENT_TYPE_CONFIG];
                const impactConfig = IMPACT_CONFIG[campaign.impact];
                const TypeIcon = typeConfig.icon;

                return (
                  <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', typeConfig.bgColor)}>
                          <TypeIcon size={24} className={typeConfig.color} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                            <span className={cn('text-xs px-2 py-0.5 rounded', typeConfig.bgColor, typeConfig.color)}>
                              {typeConfig.label}
                            </span>
                            <span className={cn('text-xs px-2 py-0.5 rounded', impactConfig.bgColor, impactConfig.color)}>
                              {impactConfig.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{campaign.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {campaign.period.start} ~ {campaign.period.end}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{campaign.summary}</div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="mt-4 pt-4 border-t grid grid-cols-4 gap-4">
                      {Object.entries(campaign.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {typeof value === 'number' && key.includes('Rate') 
                              ? `${value}%` 
                              : typeof value === 'number' && value > 1000 
                                ? `${(value / 1000).toFixed(1)}K`
                                : value}
                          </div>
                          <div className="text-xs text-gray-500">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Interpretation */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-medium text-blue-900 mb-2">콘텐츠 캠페인 요약</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 웨비나/백서: MOFU 전환 기여</li>
              <li>• 영상: Retention 효과</li>
              <li>• 콘텐츠 유형별 퍼널 역할 상이</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
