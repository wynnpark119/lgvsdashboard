'use client';

import {
  CampaignOverview,
} from '@/components/home';
import { PageHeader } from '@/components/layout';
import {
  DEMO_TECH_ON_BOARD_CAMPAIGN,
  DEMO_TECH_ON_BOARD_LAYERS,
} from '@/data/home-data';

export default function CampaignImpactPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="Tech On Board Campaign Impact"
        description="현재 활성 캠페인의 레이어별 영향 분석"
        actions={
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">2026-02 기준</div>
            <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium">
              ACTIVE CAMPAIGN
            </div>
          </div>
        }
      />

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Campaign Architecture */}
          <section>
            <CampaignOverview 
              activeCampaign={DEMO_TECH_ON_BOARD_CAMPAIGN}
              subCampaigns={DEMO_TECH_ON_BOARD_LAYERS}
            />
          </section>

          {/* Navigation to Detail Pages */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-medium text-blue-900 mb-3">캠페인 상세 분석</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/campaign-impact/narrative-flow" className="p-4 bg-white rounded-lg border hover:border-blue-300 transition-colors">
                <div className="font-medium text-gray-900 mb-1">Narrative Flow</div>
                <div className="text-sm text-gray-600">레이어 간 전환 추적</div>
              </a>
              <a href="/campaign-impact/core-pillars" className="p-4 bg-white rounded-lg border hover:border-blue-300 transition-colors">
                <div className="font-medium text-gray-900 mb-1">Core Tech Pillars</div>
                <div className="text-sm text-gray-600">HPC vs Display 비교</div>
              </a>
              <a href="/campaign-impact/channel-roles" className="p-4 bg-white rounded-lg border hover:border-blue-300 transition-colors">
                <div className="font-medium text-gray-900 mb-1">Channel Roles</div>
                <div className="text-sm text-gray-600">채널별 역할 분석</div>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
