'use client';

import { ArrowUp } from 'lucide-react';
import {
  StageSignalSummary,
  TechnologyReviewCards,
  FlowTrendChart,
} from '@/components/review-flow';
import { PageHeader } from '@/components/layout';
import {
  DEMO_FLOW_NODES,
  DEMO_INITIAL_SIGNALS,
  DEMO_DEEP_SIGNALS,
  DEMO_FLOW_TREND,
  FLOW_SUMMARY,
} from '@/data/review-flow-data';
import { cn } from '@/lib/utils';

export default function ReviewFlowPage() {
  const { stageDistribution, transitionRate, overallDirection } = FLOW_SUMMARY;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="기술별 관심 현황"
        description=""
        actions={
          <span className="text-sm text-gray-500">2024.10 - 2025.01 (90일)</span>
        }
      />

      {/* Quick Summary Bar */}
      <div className="bg-gray-50 border-b px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">전체 방향:</span>
              <span
                className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  overallDirection === 'advancing' && 'text-green-600',
                  overallDirection === 'stable' && 'text-gray-600',
                  overallDirection === 'declining' && 'text-red-600'
                )}
              >
                {overallDirection === 'advancing' && <ArrowUp size={14} />}
                {overallDirection === 'advancing' ? '진전 중' : overallDirection === 'stable' ? '유지' : '약화'}
              </span>
            </div>
            <div className="h-4 border-l" />
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-500">TOFU (통합 인지):</span>{' '}
                <span className="font-medium text-state-initial">{stageDistribution.initial.count}개 기술</span>
              </div>
              <div>
                <span className="text-gray-500">MOFU (Engagement):</span>{' '}
                <span className="font-medium text-state-deep">{stageDistribution.deep.count}개 기술</span>
              </div>
              <div>
                <span className="text-gray-500">BOFU (문의):</span>{' '}
                <span className="font-medium text-state-reachable">{stageDistribution.reachable.count}개 기술</span>
              </div>
            </div>
            <div className="h-4 border-l" />
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-500">TOFU→MOFU:</span>{' '}
                <span className="font-medium">{transitionRate.initialToDeep}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* [A] Stage Signal Summary + [B] Technology Review Cards */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <StageSignalSummary
                initialSignals={DEMO_INITIAL_SIGNALS}
                deepSignals={DEMO_DEEP_SIGNALS}
              />
            </div>
            <div className="lg:col-span-2">
              <TechnologyReviewCards nodes={DEMO_FLOW_NODES} />
            </div>
          </section>

          {/* [C] Flow Trend & Stability */}
          <section>
            <FlowTrendChart
              data={DEMO_FLOW_TREND}
              transitionRate={transitionRate}
              stability="stable"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
