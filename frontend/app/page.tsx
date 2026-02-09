'use client';

import {
  NarrativeFlowTracking,
  CoreTechPillarPerformance,
  FunnelOverviewCard,
  TechnologySignalTable,
} from '@/components/home';
import { PageHeader } from '@/components/layout';
import {
  DEMO_NARRATIVE_FLOW,
  DEMO_CORE_TECH_PILLARS,
  DEMO_OVERALL_STATUS,
  DEMO_STAGE_DISTRIBUTION,
  DEMO_TECHNOLOGY_SIGNALS,
} from '@/data/home-data';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="Campaign Overview"
        description="Narrative-driven 캠페인 성과 및 Core Tech Pillar 검토 현황"
        minimal
        actions={
          <div className="text-sm text-gray-500">2026-02 기준</div>
        }
      />

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* [EXECUTIVE SUMMARY] 주목 현황 - 최상단 */}
          <section>
            <FunnelOverviewCard 
              statusData={DEMO_OVERALL_STATUS} 
              distributionData={DEMO_STAGE_DISTRIBUTION} 
            />
          </section>

          {/* [PERFORMANCE] Narrative Flow - 레이어 간 전환 추적 */}
          <section>
            <NarrativeFlowTracking handoffData={DEMO_NARRATIVE_FLOW} />
          </section>

          {/* [PERFORMANCE] Core Tech Pillar Performance - HPC (High-Performance Computing) vs Transformable Display */}
          <section>
            <CoreTechPillarPerformance 
              hpcData={DEMO_CORE_TECH_PILLARS.hpc}
              transformableData={DEMO_CORE_TECH_PILLARS['transformable-display']}
            />
          </section>

          {/* [DETAIL] Technology Signal */}
          <section>
            <TechnologySignalTable data={DEMO_TECHNOLOGY_SIGNALS} />
          </section>
        </div>
      </div>
    </div>
  );
}
