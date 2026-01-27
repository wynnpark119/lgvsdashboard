'use client';

import { useState } from 'react';
import {
  ImpactSummary,
  CampaignFlowMapping,
  BeforeAfterShift,
  MediaRoleInterpretation,
} from '@/components/campaign-impact';
import { PageHeader } from '@/components/layout';
import {
  DEMO_CAMPAIGNS,
  DEMO_TECHNOLOGY_MOVEMENTS,
  DEMO_MEDIA_ANALYSIS,
  DEMO_FLOW_TIMELINE,
  IMPACT_CONFIG,
} from '@/data/campaign-impact-data';
import { cn } from '@/lib/utils';

export default function CampaignImpactPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(DEMO_CAMPAIGNS[0].id);

  const selectedCampaign = DEMO_CAMPAIGNS.find((c) => c.id === selectedCampaignId) || DEMO_CAMPAIGNS[0];
  const impactConfig = IMPACT_CONFIG[selectedCampaign.impact];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="영향 분석"
        description=""
      />

      {/* Selected Campaign Banner */}
      <div className="bg-gray-50 border-b px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">분석 대상:</span>
            <span className="font-medium text-gray-900">{selectedCampaign.name}</span>
            <span className={cn('text-xs px-2 py-1 rounded font-medium', impactConfig.bgColor, impactConfig.color)}>
              {impactConfig.label}
            </span>
            <span className="text-sm text-gray-500">{selectedCampaign.summary}</span>
          </div>
          <div className="text-sm text-gray-500">
            유지율: <span className={cn('font-medium', selectedCampaign.metrics.retention >= 70 ? 'text-green-600' : 'text-yellow-600')}>
              {selectedCampaign.metrics.retention}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* [A] Impact Summary */}
          <section>
            <ImpactSummary
              campaigns={DEMO_CAMPAIGNS}
              selectedCampaign={selectedCampaignId}
              onSelectCampaign={setSelectedCampaignId}
            />
          </section>

          {/* [B] Campaign-to-Flow Mapping */}
          <section>
            <CampaignFlowMapping
              campaign={selectedCampaign}
              timeline={DEMO_FLOW_TIMELINE}
              movements={DEMO_TECHNOLOGY_MOVEMENTS}
            />
          </section>

          {/* [C] Before/After + [D] Media Role */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BeforeAfterShift
              campaign={selectedCampaign}
              movements={DEMO_TECHNOLOGY_MOVEMENTS}
            />
            <MediaRoleInterpretation mediaAnalysis={DEMO_MEDIA_ANALYSIS} />
          </section>
        </div>
      </div>
    </div>
  );
}
