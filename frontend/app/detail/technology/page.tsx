'use client';

import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { MiniFunnel } from '@/components/ui';
import { FUNNEL_STAGE_CONFIG } from '@/types/funnel';
import { cn, formatNumber } from '@/lib/utils';

// 기술별 상세 데이터 (통합 퍼널: LinkedIn + LG.com + YouTube 가중 합산)
// 순서: 전략과제 → Core → Emerging
const TECHNOLOGIES = [
  // 전략과제 (2026 수주 목표)
  {
    id: 'hpc',
    name: 'HPC',
    stage: 'bofu' as const,
    metrics: {
      tofu: 12850,
      mofu: 6455,
      bofu: 42,
      avgDwell: 4.8,
      videoDepth: 82,
      inquiries: 42,
    },
    channels: { linkedin: 58, lgcom: 30, youtube: 12 },
    trend: { direction: 'up' as const, value: 35 },
    paidDependency: 25,
  },
  {
    id: 'transformable-display',
    name: 'Transformable Display',
    stage: 'bofu' as const,
    metrics: {
      tofu: 11420,
      mofu: 5750,
      bofu: 38,
      avgDwell: 4.5,
      videoDepth: 78,
      inquiries: 38,
    },
    channels: { linkedin: 56, lgcom: 32, youtube: 12 },
    trend: { direction: 'up' as const, value: 28 },
    paidDependency: 28,
  },
  // Core
  {
    id: 'digital-cockpit',
    name: 'Digital Cockpit',
    stage: 'bofu' as const,
    metrics: {
      tofu: 8420,
      mofu: 3942,
      bofu: 28,
      avgDwell: 4.2,
      videoDepth: 72,
      inquiries: 28,
    },
    channels: { linkedin: 54, lgcom: 41, youtube: 5 },
    trend: { direction: 'up' as const, value: 23 },
    paidDependency: 18,
  },
  {
    id: 'lg-p-pod',
    name: 'LG P-pod',
    stage: 'bofu' as const,
    metrics: {
      tofu: 7850,
      mofu: 3655,
      bofu: 25,
      avgDwell: 4.0,
      videoDepth: 71,
      inquiries: 25,
    },
    channels: { linkedin: 55, lgcom: 38, youtube: 7 },
    trend: { direction: 'up' as const, value: 32 },
    paidDependency: 20,
  },
  {
    id: 'vehicle-vision',
    name: 'Vehicle Vision',
    stage: 'bofu' as const,
    metrics: {
      tofu: 5280,
      mofu: 2543,
      bofu: 18,
      avgDwell: 3.8,
      videoDepth: 68,
      inquiries: 18,
    },
    channels: { linkedin: 59, lgcom: 21, youtube: 20 },
    trend: { direction: 'up' as const, value: 18 },
    paidDependency: 25,
  },
  {
    id: 'adas',
    name: 'ADAS',
    stage: 'mofu' as const,
    metrics: {
      tofu: 6850,
      mofu: 2017,
      bofu: 12,
      avgDwell: 2.5,
      videoDepth: 55,
      inquiries: 12,
    },
    channels: { linkedin: 61, lgcom: 27, youtube: 12 },
    trend: { direction: 'stable' as const, value: 2 },
    paidDependency: 38,
  },
  // Emerging
  {
    id: 'ivi',
    name: 'IVI',
    stage: 'mofu' as const,
    metrics: {
      tofu: 4120,
      mofu: 603,
      bofu: 5,
      avgDwell: 1.8,
      videoDepth: 42,
      inquiries: 5,
    },
    channels: { linkedin: 59, lgcom: 37, youtube: 4 },
    trend: { direction: 'down' as const, value: -12 },
    paidDependency: 62,
  },
  {
    id: 'telematics',
    name: 'Telematics',
    stage: 'tofu' as const,
    metrics: {
      tofu: 3280,
      mofu: 378,
      bofu: 3,
      avgDwell: 1.4,
      videoDepth: 35,
      inquiries: 3,
    },
    channels: { linkedin: 60, lgcom: 38, youtube: 2 },
    trend: { direction: 'down' as const, value: -8 },
    paidDependency: 45,
  },
];

// 히트맵 데이터 (주차별 x 기술별) - 모든 기술 포함
const HEATMAP_DATA = [
  { week: 'W1', 'HPC': 2800, 'Display': 2450, 'Cockpit': 1800, 'P-pod': 1650, 'Vision': 850, 'ADAS': 720, 'IVI': 580, 'Display2': 420, 'Telematics': 280 },
  { week: 'W2', 'HPC': 3200, 'Display': 2780, 'Cockpit': 1920, 'P-pod': 1820, 'Vision': 920, 'ADAS': 780, 'IVI': 620, 'Display2': 390, 'Telematics': 250 },
  { week: 'W3', 'HPC': 3650, 'Display': 3100, 'Cockpit': 2100, 'P-pod': 2050, 'Vision': 980, 'ADAS': 850, 'IVI': 680, 'Display2': 360, 'Telematics': 220 },
  { week: 'W4', 'HPC': 4100, 'Display': 3450, 'Cockpit': 2250, 'P-pod': 2280, 'Vision': 1050, 'ADAS': 920, 'IVI': 720, 'Display2': 340, 'Telematics': 200 },
  { week: 'W5', 'HPC': 4580, 'Display': 3820, 'Cockpit': 2341, 'P-pod': 2450, 'Vision': 1102, 'ADAS': 980, 'IVI': 750, 'Display2': 310, 'Telematics': 180 },
];

const STAGE_LABEL = {
  tofu: { label: '처음 접촉', color: FUNNEL_STAGE_CONFIG.tofu.color },
  mofu: { label: '반복 접촉', color: FUNNEL_STAGE_CONFIG.mofu.color },
  bofu: { label: '깊은 관심', color: FUNNEL_STAGE_CONFIG.bofu.color },
};

const TECH_NAMES = ['HPC', 'Display', 'Cockpit', 'P-pod', 'Vision', 'ADAS', 'IVI', 'Display2', 'Telematics'];

// 히트맵 색상 계산
function getHeatmapColor(value: number, max: number): string {
  const intensity = value / max;
  if (intensity > 0.8) return 'bg-red-500 text-white';
  if (intensity > 0.6) return 'bg-red-400 text-white';
  if (intensity > 0.4) return 'bg-red-300 text-white';
  if (intensity > 0.2) return 'bg-red-200 text-gray-800';
  return 'bg-red-100 text-gray-600';
}

export default function TechnologyDetailPage() {
  // 히트맵 최대값 계산
  const maxValue = Math.max(...HEATMAP_DATA.flatMap(row => 
    TECH_NAMES.map(tech => row[tech as keyof typeof row] as number)
  ));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="기술별 상세"
        description="기술별 퍼널 단계 및 성과 지표"
      />

      {/* Period Info */}
      <div className="bg-gray-50 border-b px-6 py-2">
        <div className="max-w-[1600px] mx-auto">
          <span className="text-xs text-gray-500">2026-02 기준</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Heatmap */}
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">기술별 방문 히트맵</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2 font-medium text-gray-500 w-16"></th>
                    {TECH_NAMES.map(tech => (
                      <th key={tech} className="text-center py-2 px-2 font-medium text-gray-500 text-xs">{tech}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HEATMAP_DATA.map((row) => (
                    <tr key={row.week}>
                      <td className="py-1 px-2 font-medium text-gray-700 text-xs">{row.week}</td>
                      {TECH_NAMES.map(tech => {
                        const value = row[tech as keyof typeof row] as number;
                        return (
                          <td key={tech} className="py-1 px-1">
                            <div className={cn(
                              'text-center py-2 px-1 rounded text-xs font-medium',
                              getHeatmapColor(value, maxValue)
                            )}>
                              {(value / 1000).toFixed(1)}K
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
              <span>낮음</span>
              <div className="flex gap-1">
                <div className="w-6 h-4 bg-red-100 rounded" />
                <div className="w-6 h-4 bg-red-200 rounded" />
                <div className="w-6 h-4 bg-red-300 rounded" />
                <div className="w-6 h-4 bg-red-400 rounded" />
                <div className="w-6 h-4 bg-red-500 rounded" />
              </div>
              <span>높음</span>
            </div>
          </section>

          {/* Technology Detail Table */}
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">기술별 상세 지표</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">기술</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">단계</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">처음 접촉</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">반복 접촉</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">깊은 관심</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">체류(분)</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">영상(%)</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">문의</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">추세</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Paid%</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Funnel</th>
                  </tr>
                </thead>
                <tbody>
                  {TECHNOLOGIES.map((tech) => {
                    const stageInfo = STAGE_LABEL[tech.stage];
                    return (
                      <tr key={tech.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{tech.name}</td>
                        <td className="py-3 px-4 text-center">
                          <span 
                            className="px-2 py-1 rounded text-xs font-medium text-white"
                            style={{ background: stageInfo.color }}
                          >
                            {stageInfo.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900">{formatNumber(tech.metrics.tofu)}</td>
                        <td className="py-3 px-4 text-right text-gray-900">{formatNumber(tech.metrics.mofu)}</td>
                        <td className="py-3 px-4 text-right text-gray-900">{formatNumber(tech.metrics.bofu)}</td>
                        <td className="py-3 px-4 text-right text-gray-900">{tech.metrics.avgDwell}</td>
                        <td className="py-3 px-4 text-right text-gray-900">{tech.metrics.videoDepth}%</td>
                        <td className="py-3 px-4 text-right text-brand-primary font-medium">{tech.metrics.inquiries}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn(
                            'inline-flex items-center gap-1 font-medium',
                            tech.trend.direction === 'up' ? 'text-green-600' :
                            tech.trend.direction === 'down' ? 'text-red-600' : 'text-gray-500'
                          )}>
                            {tech.trend.direction === 'up' && <ArrowUp size={14} />}
                            {tech.trend.direction === 'down' && <ArrowDown size={14} />}
                            {tech.trend.direction === 'stable' && <ArrowRight size={14} />}
                            {tech.trend.value > 0 ? '+' : ''}{tech.trend.value}%
                          </span>
                        </td>
                        <td className={cn(
                          'py-3 px-4 text-right font-medium',
                          tech.paidDependency >= 50 ? 'text-red-600' :
                          tech.paidDependency >= 30 ? 'text-yellow-600' : 'text-green-600'
                        )}>
                          {tech.paidDependency}%
                        </td>
                        <td className="py-3 px-4">
                          <MiniFunnel 
                            tofu={tech.metrics.tofu} 
                            mofu={tech.metrics.mofu} 
                            bofu={tech.metrics.bofu} 
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Data Notes */}
          <section className="bg-gray-50 border rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">데이터 참고사항</h3>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Paid% 50% 이상 시 광고 의존도 높음</li>
              <li>• 데이터는 익일 갱신</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
