'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { InsightHint, MiniFunnel } from '@/components/ui';
import { FUNNEL_STAGE_CONFIG } from '@/types/funnel';
import { cn, formatNumber, formatChange } from '@/lib/utils';

// 2026 사업계획 반영 - 전략과제 + Core 기술 중심
const TECH_DATA = [
  // 전략과제 (2026 수주 목표)
  { 
    id: 'hpc',
    name: 'HPC', 
    tofu: 4580, mofu: 685, bofu: 42, 
    trend: 35, direction: 'up' as const,
    engagementScore: 96, paidDep: 'low' as const,
  },
  { 
    id: 'transformable-display',
    name: 'Transformable Display', 
    tofu: 3820, mofu: 620, bofu: 38, 
    trend: 28, direction: 'up' as const,
    engagementScore: 94, paidDep: 'low' as const,
  },
  // Core
  { 
    id: 'digital-cockpit',
    name: 'Digital Cockpit', 
    tofu: 2341, mofu: 412, bofu: 28, 
    trend: 23, direction: 'up' as const,
    engagementScore: 92, paidDep: 'low' as const,
  },
  { 
    id: 'lg-p-pod',
    name: 'LG P-pod', 
    tofu: 2450, mofu: 385, bofu: 25, 
    trend: 32, direction: 'up' as const,
    engagementScore: 88, paidDep: 'low' as const,
  },
  { 
    id: 'vehicle-vision',
    name: 'Vehicle Vision', 
    tofu: 1102, mofu: 203, bofu: 18, 
    trend: 18, direction: 'up' as const,
    engagementScore: 85, paidDep: 'low' as const,
  },
  { 
    id: 'adas',
    name: 'ADAS', 
    tofu: 1856, mofu: 287, bofu: 12, 
    trend: 2, direction: 'stable' as const,
    engagementScore: 68, paidDep: 'medium' as const,
  },
  // Emerging
  { 
    id: 'ivi',
    name: 'IVI', 
    tofu: 1250, mofu: 98, bofu: 5, 
    trend: -15, direction: 'down' as const,
    engagementScore: 42, paidDep: 'high' as const,
  },
  { 
    id: 'telematics',
    name: 'Telematics', 
    tofu: 1220, mofu: 56, bofu: 3, 
    trend: -22, direction: 'down' as const,
    engagementScore: 35, paidDep: 'medium' as const,
  },
];

const ENGAGEMENT_CONFIG = {
  high: { label: 'Engagement 높음', color: 'text-green-600', bgColor: 'bg-green-100' },
  medium: { label: 'Engagement 중간', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  low: { label: 'Engagement 낮음', color: 'text-gray-500', bgColor: 'bg-gray-100' },
};

function getEngagementLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high';
  if (score >= 45) return 'medium';
  return 'low';
}

export default function TechnologyFlowPage() {
  const [selectedTech, setSelectedTech] = useState(TECH_DATA[0]);

  // 전체 요약
  const totalTofu = TECH_DATA.reduce((sum, t) => sum + t.tofu, 0);
  const totalMofu = TECH_DATA.reduce((sum, t) => sum + t.mofu, 0);
  const totalBofu = TECH_DATA.reduce((sum, t) => sum + t.bofu, 0);
  const deepEngagementCount = TECH_DATA.filter(t => getEngagementLevel(t.engagementScore) === 'high').length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="기술별 비교"
        description=""
      />

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Summary Cards */}
          <section className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">전체 TOFU</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(totalTofu)}</div>
              <div className="text-xs text-gray-400">인지 단계</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">전체 MOFU</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(totalMofu)}</div>
              <div className="text-xs text-gray-400">탐색 단계</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">전체 BOFU (문의)</div>
              <div className="text-2xl font-bold text-green-600">{formatNumber(totalBofu)}</div>
              <div className="text-xs text-gray-400">문의 전환</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">Engagement 높은 기술</div>
              <div className="text-2xl font-bold text-green-600">{deepEngagementCount}개</div>
              <div className="text-xs text-gray-400">기술조직 공유 가능</div>
            </div>
          </section>

          {/* Main Content */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Technology List */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">기술 목록</h3>
              <div className="space-y-3">
                {TECH_DATA.map((tech) => {
                  const engagementLevel = getEngagementLevel(tech.engagementScore);
                  const engagementConfig = ENGAGEMENT_CONFIG[engagementLevel];
                  const isSelected = selectedTech.id === tech.id;

                  return (
                    <button
                      key={tech.id}
                      onClick={() => setSelectedTech(tech)}
                      className={cn(
                        'w-full p-3 rounded-lg border text-left transition-all',
                        isSelected 
                          ? 'border-brand-primary bg-brand-primary/5' 
                          : 'border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{tech.name}</span>
                        <span className={cn('text-sm font-bold', engagementConfig.color)}>
                          {tech.engagementScore}
                        </span>
                      </div>
                      <MiniFunnel tofu={tech.tofu} mofu={tech.mofu} bofu={tech.bofu} />
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className={cn(
                          tech.direction === 'up' ? 'text-green-600' :
                          tech.direction === 'down' ? 'text-red-600' : 'text-gray-500'
                        )}>
                          {tech.direction === 'up' && <ArrowUp size={12} className="inline" />}
                          {tech.direction === 'down' && <ArrowDown size={12} className="inline" />}
                          {formatChange(tech.trend)}
                        </span>
                        <span className={cn('px-1.5 py-0.5 rounded text-[10px]', engagementConfig.bgColor, engagementConfig.color)}>
                          {engagementConfig.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Technology Detail */}
            <div className="lg:col-span-2 bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedTech.name}</h3>
                  <p className="text-sm text-gray-500">퍼널 상세 분석</p>
                </div>
                <div className={cn(
                  'text-3xl font-bold',
                  ENGAGEMENT_CONFIG[getEngagementLevel(selectedTech.engagementScore)].color
                )}>
                  Engagement {selectedTech.engagementScore}
                </div>
              </div>

              {/* Funnel Visualization */}
              <div className="relative flex flex-col items-center py-6">
                {/* TOFU */}
                <div
                  className="relative flex items-center justify-center text-white font-medium w-full"
                  style={{
                    height: '70px',
                    background: FUNNEL_STAGE_CONFIG.tofu.color,
                    clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)',
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(selectedTech.tofu)}</div>
                    <div className="text-xs opacity-80">TOFU · 인지</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2 text-sm text-gray-600">
                  <ArrowDown size={16} />
                  <span className="font-medium">
                    {((selectedTech.mofu / selectedTech.tofu) * 100).toFixed(1)}% 전환
                  </span>
                </div>

                {/* MOFU */}
                <div
                  className="relative flex items-center justify-center text-white font-medium"
                  style={{
                    width: '70%',
                    height: '70px',
                    background: FUNNEL_STAGE_CONFIG.mofu.color,
                    clipPath: 'polygon(7% 0%, 93% 0%, 83% 100%, 17% 100%)',
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(selectedTech.mofu)}</div>
                    <div className="text-xs opacity-80">MOFU · 탐색</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2 text-sm text-gray-600">
                  <ArrowDown size={16} />
                  <span className="font-medium">
                    {((selectedTech.bofu / selectedTech.mofu) * 100).toFixed(1)}% 문의 전환
                  </span>
                </div>

                {/* BOFU */}
                <div
                  className="relative flex items-center justify-center text-white font-medium"
                  style={{
                    width: '40%',
                    height: '70px',
                    background: FUNNEL_STAGE_CONFIG.bofu.color,
                    clipPath: 'polygon(10% 0%, 90% 0%, 60% 100%, 40% 100%)',
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(selectedTech.bofu)}</div>
                    <div className="text-xs opacity-80">BOFU · 문의</div>
                  </div>
                </div>
              </div>

              {/* Analysis */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-500 mb-1">추세</div>
                  <div className={cn(
                    'text-xl font-bold flex items-center justify-center gap-1',
                    selectedTech.direction === 'up' ? 'text-green-600' :
                    selectedTech.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                  )}>
                    {selectedTech.direction === 'up' && <ArrowUp size={20} />}
                    {selectedTech.direction === 'down' && <ArrowDown size={20} />}
                    {formatChange(selectedTech.trend)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-500 mb-1">Paid 의존도</div>
                  <div className={cn(
                    'text-xl font-bold capitalize',
                    selectedTech.paidDep === 'low' ? 'text-green-600' :
                    selectedTech.paidDep === 'high' ? 'text-red-600' : 'text-yellow-600'
                  )}>
                    {selectedTech.paidDep}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-500 mb-1">Engagement 상태</div>
                  <div className={cn(
                    'text-xl font-bold',
                    ENGAGEMENT_CONFIG[getEngagementLevel(selectedTech.engagementScore)].color
                  )}>
                    {ENGAGEMENT_CONFIG[getEngagementLevel(selectedTech.engagementScore)].label}
                  </div>
                </div>
              </div>

              {/* Insight */}
              <InsightHint
                type="footer"
                status={getEngagementLevel(selectedTech.engagementScore) === 'high' ? 'good' : 
                        getEngagementLevel(selectedTech.engagementScore) === 'medium' ? 'warning' : 'neutral'}
                message={
                  getEngagementLevel(selectedTech.engagementScore) === 'high'
                    ? `${selectedTech.name}은 OEM Engagement 높음. 기술조직에 현황 공유 권장`
                    : getEngagementLevel(selectedTech.engagementScore) === 'medium'
                    ? `${selectedTech.name}은 Engagement 향상 중. 심화 콘텐츠 노출 강화`
                    : `${selectedTech.name}은 아직 초기 단계. 인지도 확대 필요`
                }
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
