'use client';

import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { MiniFunnel } from '@/components/ui';
import { FUNNEL_STAGE_CONFIG } from '@/types/funnel';
import { cn, formatNumber } from '@/lib/utils';

// 기술별 상세 데이터
const TECHNOLOGIES = [
  {
    id: 'digital-cockpit',
    name: 'Digital Cockpit',
    stage: 'bofu' as const,
    metrics: {
      tofu: 2341,
      mofu: 412,
      bofu: 98,
      avgDwell: 4.2,
      videoDepth: 72,
      inquiries: 28,
      newsletter: 156,
    },
    trend: { direction: 'up' as const, value: 23 },
    paidDependency: 18,
  },
  {
    id: 'vehicle-vision',
    name: 'Vehicle Vision',
    stage: 'bofu' as const,
    metrics: {
      tofu: 1102,
      mofu: 203,
      bofu: 52,
      avgDwell: 3.8,
      videoDepth: 68,
      inquiries: 18,
      newsletter: 98,
    },
    trend: { direction: 'up' as const, value: 18 },
    paidDependency: 25,
  },
  {
    id: 'adas',
    name: 'ADAS',
    stage: 'mofu' as const,
    metrics: {
      tofu: 1856,
      mofu: 287,
      bofu: 67,
      avgDwell: 2.5,
      videoDepth: 55,
      inquiries: 12,
      newsletter: 72,
    },
    trend: { direction: 'stable' as const, value: 2 },
    paidDependency: 38,
  },
  {
    id: 'ivi',
    name: 'IVI',
    stage: 'mofu' as const,
    metrics: {
      tofu: 1523,
      mofu: 198,
      bofu: 41,
      avgDwell: 1.8,
      videoDepth: 42,
      inquiries: 8,
      newsletter: 45,
    },
    trend: { direction: 'down' as const, value: -12 },
    paidDependency: 62,
  },
  {
    id: 'telematics',
    name: 'Telematics',
    stage: 'tofu' as const,
    metrics: {
      tofu: 1247,
      mofu: 156,
      bofu: 28,
      avgDwell: 1.4,
      videoDepth: 35,
      inquiries: 5,
      newsletter: 23,
    },
    trend: { direction: 'down' as const, value: -8 },
    paidDependency: 45,
  },
];

// 히트맵 데이터 (주차별 x 기술별)
const HEATMAP_DATA = [
  { week: '11-W1', 'Digital Cockpit': 1800, 'Vehicle Vision': 850, 'ADAS': 1600, 'IVI': 1400, 'Telematics': 1100 },
  { week: '11-W2', 'Digital Cockpit': 1920, 'Vehicle Vision': 920, 'ADAS': 1680, 'IVI': 1380, 'Telematics': 1150 },
  { week: '11-W3', 'Digital Cockpit': 2100, 'Vehicle Vision': 980, 'ADAS': 1750, 'IVI': 1320, 'Telematics': 1180 },
  { week: '11-W4', 'Digital Cockpit': 2250, 'Vehicle Vision': 1050, 'ADAS': 1820, 'IVI': 1280, 'Telematics': 1200 },
  { week: '12-W1', 'Digital Cockpit': 2341, 'Vehicle Vision': 1102, 'ADAS': 1856, 'IVI': 1250, 'Telematics': 1220 },
];

const STAGE_LABEL = {
  tofu: { label: '처음 접촉', color: FUNNEL_STAGE_CONFIG.tofu.color },
  mofu: { label: '반복 접촉', color: FUNNEL_STAGE_CONFIG.mofu.color },
  bofu: { label: '깊은 관심', color: FUNNEL_STAGE_CONFIG.bofu.color },
};

const TECH_NAMES = ['Digital Cockpit', 'Vehicle Vision', 'ADAS', 'IVI', 'Telematics'];

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
        description=""
      />

      {/* Period Info */}
      <div className="bg-gray-50 border-b px-6 py-2">
        <div className="max-w-[1600px] mx-auto">
          <span className="text-xs text-gray-500">2024.10 - 2025.01 (90일) 데이터</span>
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
                    <th className="text-left py-2 px-3 font-medium text-gray-500 w-24">주차</th>
                    {TECH_NAMES.map(tech => (
                      <th key={tech} className="text-center py-2 px-3 font-medium text-gray-500">{tech}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HEATMAP_DATA.map((row) => (
                    <tr key={row.week}>
                      <td className="py-2 px-3 font-medium text-gray-700">{row.week}</td>
                      {TECH_NAMES.map(tech => {
                        const value = row[tech as keyof typeof row] as number;
                        return (
                          <td key={tech} className="py-2 px-3">
                            <div className={cn(
                              'text-center py-3 px-2 rounded font-medium',
                              getHeatmapColor(value, maxValue)
                            )}>
                              {formatNumber(value)}
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
                    <th className="text-right py-3 px-4 font-medium text-gray-500">뉴스레터</th>
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
                        <td className="py-3 px-4 text-right text-blue-600 font-medium">{tech.metrics.newsletter}</td>
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
              <li>• Paid% 50% 이상 시 광고 의존도 높음 (주의 필요)</li>
              <li>• 뉴스레터 = 해당 기술 관련 뉴스레터 구독자 수</li>
              <li>• 데이터는 익일 갱신</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
