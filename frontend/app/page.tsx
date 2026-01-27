'use client';

import {
  FunnelOverviewCard,
  TechnologySignalTable,
  MomentumTrendChart,
  CampaignInfluenceCard,
} from '@/components/home';
import { PageHeader } from '@/components/layout';
import {
  DEMO_OVERALL_STATUS,
  DEMO_STAGE_DISTRIBUTION,
  DEMO_TECHNOLOGY_SIGNALS,
  DEMO_MOMENTUM,
  DEMO_CAMPAIGNS,
} from '@/data/home-data';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header - 홈은 간소화 */}
      <PageHeader
        title="Overview"
        description="지금 어떤 기술과 주제가 주목받고 있는가"
        minimal
        actions={
          <div className="text-sm text-gray-500">Updated: 2026-01-23</div>
        }
      />

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* [A] 통합 카드: 전체 검토 현황 & 유입 질 평가 */}
          <section>
            <FunnelOverviewCard 
              statusData={DEMO_OVERALL_STATUS} 
              distributionData={DEMO_STAGE_DISTRIBUTION} 
            />
          </section>

          {/* [B] Technology Signal */}
          <section>
            <TechnologySignalTable data={DEMO_TECHNOLOGY_SIGNALS} />
          </section>

          {/* [C] Recent Momentum & Direction */}
          <section>
            <MomentumTrendChart data={DEMO_MOMENTUM} />
          </section>

          {/* [D] Campaign / Paid Influence Context */}
          <section>
            <CampaignInfluenceCard data={DEMO_CAMPAIGNS} />
          </section>
        </div>
      </div>
    </div>
  );
}
