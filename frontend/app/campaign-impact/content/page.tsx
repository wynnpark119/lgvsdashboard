'use client';

import { FileText, Video, Mic } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { cn } from '@/lib/utils';

const CONTENT_CAMPAIGNS = [
  {
    id: 'tech-webinar-series',
    name: 'Tech Webinar Series',
    type: 'webinar',
    period: { start: '2025-11-01', end: '2025-12-15' },
    description: 'VS 기술 심화 웨비나 시리즈',
    metrics: {
      sessions: 12,
      registrations: 2840,
      attendance: 1856,
      attendanceRate: 65.4,
    },
    impact: 'amplifier' as const,
    summary: 'MOFU 심화 검토 가속화',
  },
  {
    id: 'whitepaper-campaign',
    name: 'Whitepaper Download Campaign',
    type: 'document',
    period: { start: '2025-10-15', end: '2025-11-30' },
    description: 'ADAS/Digital Cockpit 기술 백서',
    metrics: {
      downloads: 1247,
      uniqueVisitors: 3421,
      conversionRate: 36.4,
      avgReadTime: 4.2,
    },
    impact: 'amplifier' as const,
    summary: 'TOFU → MOFU 전환 기여',
  },
  {
    id: 'video-series',
    name: 'Technology Explainer Videos',
    type: 'video',
    period: { start: '2025-09-01', end: '2025-12-31' },
    description: '기술 설명 영상 시리즈',
    metrics: {
      totalViews: 45230,
      avgViewDuration: 2.8,
      completionRate: 52.3,
      shares: 342,
    },
    impact: 'supporter' as const,
    summary: '검토 유지에 기여, 전환 효과는 제한적',
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
            <h3 className="font-medium text-blue-900 mb-2">콘텐츠 캠페인 해석</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 웨비나와 백서 캠페인이 MOFU 심화 검토 전환에 직접 기여</li>
              <li>• 영상 콘텐츠는 검토 유지(Retention)에 효과적이나 전환 효과는 제한적</li>
              <li>• 콘텐츠 유형별로 퍼널 기여 역할이 다름 → 용도에 맞게 활용 필요</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
