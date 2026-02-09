'use client';

import { Campaign, CAMPAIGN_LAYER_LABELS, CHANNEL_NARRATIVE_ROLES } from '@/types';
import { getLayerLabel } from '@/lib/campaign-helpers';
import { Calendar } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

interface CampaignOverviewProps {
  activeCampaign: Campaign;
  subCampaigns: Campaign[];
}

export default function CampaignOverview({ activeCampaign, subCampaigns }: CampaignOverviewProps) {
  const layers = subCampaigns.sort((a, b) => 
    (a.hierarchy?.sequenceOrder || 0) - (b.hierarchy?.sequenceOrder || 0)
  );

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Active Campaign Architecture</h2>
          <p className="text-sm text-gray-500">현재 진행 중인 캠페인 구조</p>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium">
          ACTIVE
        </span>
      </div>

      {/* Parent Theme */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
        <div className="text-xs text-gray-500 mb-1">Campaign Theme</div>
        <div className="text-xl font-bold text-gray-900">{activeCampaign.name}</div>
        <div className="text-sm text-gray-600 mt-2">
          Narrative: Human Questions → LG VS Technology → Automotive Experience
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
          <Calendar size={12} />
          <span>
            {formatDate(activeCampaign.period.start)} ~ {formatDate(activeCampaign.period.end)}
          </span>
        </div>
      </div>

      {/* Layer Flow */}
      <div className="space-y-3">
        {layers.map((campaign, idx) => {
          const layerLabel = getLayerLabel(campaign.hierarchy?.layer);
          const roleConfig = campaign.hierarchy?.narrativeRole 
            ? Object.values(CHANNEL_NARRATIVE_ROLES).find(r => r.role === campaign.hierarchy?.narrativeRole)
            : null;

          return (
            <div key={campaign.id} className="flex items-center gap-3">
              {/* Sequence Number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                {idx + 1}
              </div>

              {/* Campaign Info */}
              <div className="flex-1 p-3 border rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {roleConfig?.label || layerLabel}
                      {campaign.hierarchy?.coreTechPillar && (
                        <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                          Core Tech
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                    {layerLabel}
                  </div>
                </div>

                {/* Period */}
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                  <Calendar size={10} />
                  <span>
                    {formatDate(campaign.period.start)} ~ {formatDate(campaign.period.end)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <div className="text-sm font-medium text-blue-900">
          {layers.length}개 레이어로 구성된 Narrative 캠페인
        </div>
        <div className="text-sm text-blue-700 mt-1">
          Issue Seeding부터 Authority Content까지 연결된 통합 캠페인 구조
        </div>
      </div>
    </div>
  );
}
