'use client';

import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Campaign } from '@/data/campaign-impact-data';
import { IMPACT_CONFIG } from '@/data/campaign-impact-data';
import { cn, formatDate } from '@/lib/utils';

interface ImpactSummaryProps {
  campaigns: Campaign[];
  selectedCampaign?: string;
  onSelectCampaign: (id: string) => void;
}

const TYPE_LABELS = {
  event: { label: '이벤트', color: 'bg-purple-100 text-purple-700' },
  advertising: { label: '광고', color: 'bg-blue-100 text-blue-700' },
  content: { label: '콘텐츠', color: 'bg-green-100 text-green-700' },
};

export default function ImpactSummary({ campaigns, selectedCampaign, onSelectCampaign }: ImpactSummaryProps) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">영향 요약</h2>
        <p className="text-sm text-gray-500">최근 캠페인들이 의미 있었는가</p>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => {
          const impactConfig = IMPACT_CONFIG[campaign.impact];
          const typeConfig = TYPE_LABELS[campaign.type];
          const isSelected = selectedCampaign === campaign.id;
          const deepChange = campaign.metrics.deepAfter - campaign.metrics.deepBefore;

          return (
            <div
              key={campaign.id}
              onClick={() => onSelectCampaign(campaign.id)}
              className={cn(
                'p-4 rounded-lg border cursor-pointer transition-all',
                isSelected
                  ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{campaign.name}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded', typeConfig.color)}>
                    {typeConfig.label}
                  </span>
                </div>
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded font-medium',
                    impactConfig.bgColor,
                    impactConfig.color
                  )}
                >
                  {impactConfig.label}
                </span>
              </div>

              {/* Period */}
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                <Calendar size={12} />
                <span>
                  {formatDate(campaign.period.start)} ~ {formatDate(campaign.period.end)}
                </span>
              </div>

              {/* Summary */}
              <div className="flex items-center gap-2 text-sm">
                {deepChange > 0 ? (
                  <TrendingUp size={14} className="text-green-500" />
                ) : deepChange < 0 ? (
                  <TrendingDown size={14} className="text-red-500" />
                ) : (
                  <Minus size={14} className="text-gray-400" />
                )}
                <span className="text-gray-600">{campaign.summary}</span>
              </div>

              {/* Quick Metrics */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs">
                <div>
                  <span className="text-gray-500">Deep Review:</span>{' '}
                  <span className={cn('font-medium', deepChange > 0 ? 'text-green-600' : deepChange < 0 ? 'text-red-600' : 'text-gray-600')}>
                    {campaign.metrics.deepBefore}% → {campaign.metrics.deepAfter}%
                  </span>
                </div>
                <div className="h-3 border-l" />
                <div>
                  <span className="text-gray-500">유지율:</span>{' '}
                  <span className={cn('font-medium', campaign.metrics.retention >= 70 ? 'text-green-600' : campaign.metrics.retention >= 50 ? 'text-yellow-600' : 'text-red-600')}>
                    {campaign.metrics.retention}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t flex items-center gap-4 text-xs text-gray-500">
        {Object.entries(IMPACT_CONFIG).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1">
            <span className={cn('w-2 h-2 rounded-full', config.bgColor.replace('bg-', 'bg-').replace('50', '500'))} />
            <span>{config.label}: {config.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
