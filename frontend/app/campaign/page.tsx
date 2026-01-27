'use client';

import { Target, TrendingUp, Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { PageHeader } from '@/components/layout';
import { IMPACT_CONFIG } from '@/data/campaign-impact-data';
import { cn, formatNumber } from '@/lib/utils';

// 전체 캠페인 목록
const ALL_CAMPAIGNS = [
  {
    id: 'ces-2026',
    name: 'CES 2026',
    type: 'event',
    period: { start: '2026-01-07', end: '2026-01-10' },
    status: 'completed',
    metrics: {
      reach: 125000,
      engagement: 18500,
      deepReview: 342,
      retention: 78,
    },
    impact: 'amplifier' as const,
  },
  {
    id: 'tech-webinar-series',
    name: 'Tech Webinar Series',
    type: 'content',
    period: { start: '2025-11-01', end: '2025-12-15' },
    status: 'completed',
    metrics: {
      reach: 45000,
      engagement: 8200,
      deepReview: 156,
      retention: 82,
    },
    impact: 'amplifier' as const,
  },
  {
    id: 'linkedin-awareness',
    name: 'LinkedIn Awareness Campaign',
    type: 'paid',
    period: { start: '2025-10-01', end: '2025-12-31' },
    status: 'active',
    metrics: {
      reach: 280000,
      engagement: 12400,
      deepReview: 89,
      retention: 45,
    },
    impact: 'neutral' as const,
  },
  {
    id: 'whitepaper-launch',
    name: 'Whitepaper Launch',
    type: 'content',
    period: { start: '2025-09-15', end: '2025-10-30' },
    status: 'completed',
    metrics: {
      reach: 32000,
      engagement: 5600,
      deepReview: 98,
      retention: 72,
    },
    impact: 'amplifier' as const,
  },
];

const TYPE_CONFIG = {
  event: { label: '이벤트', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  content: { label: '콘텐츠', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  paid: { label: 'Paid', color: 'text-orange-600', bgColor: 'bg-orange-100' },
};

const STATUS_CONFIG = {
  active: { label: '진행중', color: 'text-green-600', bgColor: 'bg-green-100' },
  completed: { label: '완료', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  planned: { label: '예정', color: 'text-blue-600', bgColor: 'bg-blue-100' },
};

export default function CampaignListPage() {
  // 통계
  const totalCampaigns = ALL_CAMPAIGNS.length;
  const amplifierCount = ALL_CAMPAIGNS.filter((c) => c.impact === 'amplifier').length;
  const totalReach = ALL_CAMPAIGNS.reduce((sum, c) => sum + c.metrics.reach, 0);
  const totalDeepReview = ALL_CAMPAIGNS.reduce((sum, c) => sum + c.metrics.deepReview, 0);

  // 차트 데이터
  const chartData = ALL_CAMPAIGNS.map((c) => ({
    name: c.name.length > 15 ? c.name.slice(0, 15) + '...' : c.name,
    deepReview: c.metrics.deepReview,
    impact: c.impact,
  })).sort((a, b) => b.deepReview - a.deepReview);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="캠페인 목록"
        description=""
      />

      {/* Period Info */}
      <div className="bg-gray-50 border-b px-6 py-2">
        <div className="max-w-[1600px] mx-auto">
          <span className="text-xs text-gray-500">2024 - 2025 캠페인 데이터</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Summary Cards */}
          <section className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Target size={14} />
                전체 캠페인
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{totalCampaigns}</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Zap size={14} />
                Amplifier
              </div>
              <div className="text-2xl font-bold text-green-600 mt-1">{amplifierCount}</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">Total Reach</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{(totalReach / 1000).toFixed(0)}K</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp size={14} />
                심화 검토 유도
              </div>
              <div className="text-2xl font-bold text-brand-primary mt-1">{totalDeepReview}</div>
            </div>
          </section>

          {/* Chart */}
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">캠페인별 심화 검토 기여</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={130} fontSize={12} />
                <Tooltip formatter={(value: number) => [value, '심화 검토']} />
                <Bar dataKey="deepReview" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => {
                    const impactConfig = IMPACT_CONFIG[entry.impact];
                    const colorMap: Record<string, string> = {
                      amplifier: '#22c55e',
                      neutral: '#6b7280',
                      distorter: '#f59e0b',
                    };
                    return <Cell key={`cell-${index}`} fill={colorMap[entry.impact] || '#6b7280'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-gray-500">Amplifier</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-gray-500" />
                <span className="text-gray-500">Neutral</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-yellow-500" />
                <span className="text-gray-500">Distorter</span>
              </div>
            </div>
          </section>

          {/* Campaign List */}
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">캠페인 목록</h2>
            <div className="space-y-4">
              {ALL_CAMPAIGNS.map((campaign) => {
                const typeConfig = TYPE_CONFIG[campaign.type as keyof typeof TYPE_CONFIG];
                const statusConfig = STATUS_CONFIG[campaign.status as keyof typeof STATUS_CONFIG];
                const impactConfig = IMPACT_CONFIG[campaign.impact];

                return (
                  <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                          <span className={cn('px-2 py-0.5 rounded text-xs', typeConfig.bgColor, typeConfig.color)}>
                            {typeConfig.label}
                          </span>
                          <span className={cn('px-2 py-0.5 rounded text-xs', statusConfig.bgColor, statusConfig.color)}>
                            {statusConfig.label}
                          </span>
                          <span className={cn('px-2 py-0.5 rounded text-xs font-medium', impactConfig.bgColor, impactConfig.color)}>
                            {impactConfig.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {campaign.period.start} ~ {campaign.period.end}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-brand-primary">{campaign.metrics.deepReview}</div>
                        <div className="text-xs text-gray-500">심화 검토</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-500 text-xs">Reach</div>
                        <div className="font-medium">{formatNumber(campaign.metrics.reach)}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-500 text-xs">Engagement</div>
                        <div className="font-medium">{formatNumber(campaign.metrics.engagement)}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-500 text-xs">심화 검토</div>
                        <div className="font-medium text-brand-primary">{campaign.metrics.deepReview}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-500 text-xs">Retention</div>
                        <div className={cn(
                          'font-medium',
                          campaign.metrics.retention >= 70 ? 'text-green-600' : 'text-yellow-600'
                        )}>
                          {campaign.metrics.retention}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
