'use client';

import { NarrativeFlowTracking } from '@/components/home';
import { PageHeader } from '@/components/layout';
import { DEMO_NARRATIVE_FLOW } from '@/data/home-data';

export default function NarrativeFlowPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Narrative Flow"
        description="Tech On Board 캠페인 레이어 간 전환 추적"
        minimal
        actions={
          <div className="text-sm text-gray-500">2026-02 기준</div>
        }
      />

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Narrative Flow Tracking */}
          <section>
            <NarrativeFlowTracking handoffData={DEMO_NARRATIVE_FLOW} />
          </section>

          {/* Additional Info */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-medium text-blue-900 mb-2">Narrative Flow 해석</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Handoff Rate: 각 레이어에서 다음 레이어로 이동한 비율</li>
              <li>• Avg Time: 레이어 간 평균 이동 소요 시간</li>
              <li>• Quality: Engagement 품질 (High/Medium/Low)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
