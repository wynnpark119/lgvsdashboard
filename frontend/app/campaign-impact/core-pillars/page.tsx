'use client';

import { CoreTechPillarPerformance } from '@/components/home';
import { PageHeader } from '@/components/layout';
import { DEMO_CORE_TECH_PILLARS } from '@/data/home-data';

export default function CorePillarsPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Core Tech Pillars"
        description="HPC (High-Performance Computing) vs Transformable Display 심화 검토 비교"
        minimal
        actions={
          <div className="text-sm text-gray-500">2026-02 기준</div>
        }
      />

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Core Tech Pillar Performance */}
          <section>
            <CoreTechPillarPerformance 
              hpcData={DEMO_CORE_TECH_PILLARS.hpc}
              transformableData={DEMO_CORE_TECH_PILLARS['transformable-display']}
            />
          </section>

          {/* Additional Info */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-medium text-blue-900 mb-2">Core Tech Pillar 해석</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Campaign Assets: 각 Pillar별 Film, Landing Page, Social Posts</li>
              <li>• Depth Signals: Watch Time, Revisit Rate, Long Reads 비율</li>
              <li>• Authority Signals: Expert Content Engagement, OEM Inquiries</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
