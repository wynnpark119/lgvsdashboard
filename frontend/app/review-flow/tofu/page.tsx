'use client';

import { ArrowUp, ArrowDown, ArrowRight, Clock, Play } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { PageHeader } from '@/components/layout';
import { InsightHint } from '@/components/ui';
import { FUNNEL_STAGE_CONFIG } from '@/types/funnel';
import { cn, formatNumber, formatPercent } from '@/lib/utils';

// TOFU 단계 기술 데이터 (통합 퍼널: LinkedIn + LG.com + YouTube 가중 합산)
// 순서: 전략과제 → Core → Emerging
const TOFU_TECHNOLOGIES = [
  // 전략과제 (2026 수주 목표)
  {
    id: 'hpc',
    name: 'HPC',
    visits: 12850,           // 통합 가중 합산
    channels: { linkedin: 7420, lgcom: 3856, youtube: 1574 },
    avgDwell: 4.5,          // LG.com 기준 (분)
    videoDepth: 82,         // YouTube 기준 (%)
    consecutivePages: 3.8,
    status: 'candidate' as const,
    trend: 'up' as const,
    trendValue: 35,
    insight: '전략과제 — LinkedIn + LG.com 최고 관심, CES 2026 + LG on board 시너지',
  },
  {
    id: 'transformable-display',
    name: 'Transformable Display',
    visits: 11420,
    channels: { linkedin: 6580, lgcom: 3421, youtube: 1419 },
    avgDwell: 4.2,
    videoDepth: 78,
    consecutivePages: 3.5,
    status: 'candidate' as const,
    trend: 'up' as const,
    trendValue: 28,
    insight: '전략과제 — YouTube 시청 깊이 높음, Technical Whitepaper 다운로드 증가',
  },
  // Core
  {
    id: 'digital-cockpit',
    name: 'Digital Cockpit',
    visits: 8420,
    channels: { linkedin: 4850, lgcom: 2341, youtube: 1229 },
    avgDwell: 3.2,
    videoDepth: 68,
    consecutivePages: 2.8,
    status: 'candidate' as const,
    trend: 'up' as const,
    trendValue: 23,
    insight: 'Experience on Board 핵심 — LinkedIn + LG.com 강한 관심',
  },
  {
    id: 'lg-p-pod',
    name: 'LG P-pod',
    visits: 7850,
    channels: { linkedin: 4520, lgcom: 2180, youtube: 1150 },
    avgDwell: 3.4,
    videoDepth: 71,
    consecutivePages: 3.0,
    status: 'candidate' as const,
    trend: 'up' as const,
    trendValue: 32,
    insight: 'CES 2026 신규 공개 — 관심 급증, Experience on Board 연계',
  },
  {
    id: 'vehicle-vision',
    name: 'Vehicle Vision',
    visits: 5280,
    channels: { linkedin: 3120, lgcom: 1102, youtube: 1058 },
    avgDwell: 2.8,
    videoDepth: 72,
    consecutivePages: 2.5,
    status: 'candidate' as const,
    trend: 'up' as const,
    trendValue: 18,
    insight: 'YouTube 시청 깊이 높음, LinkedIn Engagement 양호',
  },
  {
    id: 'adas',
    name: 'ADAS',
    visits: 6850,
    channels: { linkedin: 4200, lgcom: 1856, youtube: 794 },
    avgDwell: 1.9,
    videoDepth: 45,
    consecutivePages: 1.8,
    status: 'watching' as const,
    trend: 'stable' as const,
    trendValue: 2,
    insight: 'AI on Board 캠페인 연계 — LinkedIn 노출 높으나 체류 개선 필요',
  },
  // Emerging
  {
    id: 'ivi',
    name: 'IVI',
    visits: 4120,
    channels: { linkedin: 2450, lgcom: 1523, youtube: 147 },
    avgDwell: 1.5,
    videoDepth: 38,
    consecutivePages: 1.4,
    status: 'noise' as const,
    trend: 'down' as const,
    trendValue: -12,
    insight: 'LinkedIn 노출 대비 LG.com 전환 낮음, 콘텐츠 점검 필요',
  },
  {
    id: 'telematics',
    name: 'Telematics',
    visits: 3280,
    channels: { linkedin: 1980, lgcom: 1247, youtube: 53 },
    avgDwell: 1.2,
    videoDepth: 32,
    consecutivePages: 1.2,
    status: 'noise' as const,
    trend: 'down' as const,
    trendValue: -8,
    insight: '전체 채널 관심 신호 약함',
  },
];

const STATUS_CONFIG = {
  candidate: { label: '검토 후보군', color: 'text-green-600', bgColor: 'bg-green-100', barColor: '#22c55e' },
  watching: { label: '관찰 필요', color: 'text-yellow-600', bgColor: 'bg-yellow-100', barColor: '#f59e0b' },
  noise: { label: '단순 노출', color: 'text-gray-500', bgColor: 'bg-gray-100', barColor: '#9ca3af' },
};

// 이해 동반 접촉 기준
const ENGAGEMENT_THRESHOLD = {
  dwell: 2.0,       // 분 이상
  videoDepth: 50,   // % 이상
  pages: 2.0,       // 페이지 이상
};

export default function TOFUPage() {
  // 통계
  const candidateCount = TOFU_TECHNOLOGIES.filter(t => t.status === 'candidate').length;
  const watchingCount = TOFU_TECHNOLOGIES.filter(t => t.status === 'watching').length;
  const noiseCount = TOFU_TECHNOLOGIES.filter(t => t.status === 'noise').length;
  const totalVisits = TOFU_TECHNOLOGIES.reduce((sum, t) => sum + t.visits, 0);
  const candidateVisits = TOFU_TECHNOLOGIES.filter(t => t.status === 'candidate').reduce((sum, t) => sum + t.visits, 0);

  // 차트 데이터
  const dwellChartData = TOFU_TECHNOLOGIES.map(t => ({
    name: t.name.split(' ')[0],
    value: t.avgDwell,
    status: t.status,
  }));

  const videoChartData = TOFU_TECHNOLOGIES.map(t => ({
    name: t.name.split(' ')[0],
    value: t.videoDepth,
    status: t.status,
  }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="처음 접촉"
        description=""
      />

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Key Message */}
          <section className="bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                   style={{ background: FUNNEL_STAGE_CONFIG.tofu.color }}>
                👁️
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">TOFU = 전체 채널 첫 접촉 (통합 퍼널)</h3>
                <p className="text-gray-600">
                  <strong>LinkedIn 조회 × 0.6 + LG.com 방문 × 1.0 + YouTube 조회 × 0.4</strong> 가중 합산
                  <br/>
                  LinkedIn이 주력 채널(54%), LG.com(41%), YouTube(5%)
                </p>
              </div>
            </div>
          </section>

          {/* Summary Cards */}
          <section className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">통합 TOFU</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(totalVisits)}</div>
              <div className="text-xs text-gray-400">LinkedIn+LG.com+YouTube 가중합</div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-200 p-4">
              <div className="text-sm text-green-700">검토 후보군</div>
              <div className="text-2xl font-bold text-green-600">{candidateCount}개 기술</div>
              <div className="text-xs text-green-600">{formatNumber(candidateVisits)} 가중합</div>
            </div>
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
              <div className="text-sm text-yellow-700">관찰 필요</div>
              <div className="text-2xl font-bold text-yellow-600">{watchingCount}개 기술</div>
              <div className="text-xs text-yellow-600">채널 간 전환 확인 필요</div>
            </div>
            <div className="bg-gray-50 rounded-xl border p-4">
              <div className="text-sm text-gray-500">단순 노출</div>
              <div className="text-2xl font-bold text-gray-500">{noiseCount}개 기술</div>
              <div className="text-xs text-gray-400">Engagement 부족</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">후보군 비율</div>
              <div className="text-2xl font-bold text-brand-primary">
                {formatPercent((candidateCount / TOFU_TECHNOLOGIES.length) * 100, 0)}
              </div>
              <div className="text-xs text-gray-400">전체 기술 대비</div>
            </div>
          </section>

          {/* Engagement Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dwell Time Chart */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">평균 체류 시간</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dwellChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 4]} tickFormatter={(v) => `${v}분`} />
                  <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(1)}분`, '체류 시간']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {dwellChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_CONFIG[entry.status].barColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <div className="w-full h-px bg-gray-200" />
                <span className="whitespace-nowrap">기준: {ENGAGEMENT_THRESHOLD.dwell}분</span>
                <div className="w-full h-px bg-gray-200" />
              </div>
              <InsightHint type="footer" message="체류 2분 이상 = 설명을 따라오는 '이해 동반 접촉'" />
            </div>

            {/* Video Depth Chart */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Play size={18} className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">영상 시청 깊이</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={videoChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                  <Tooltip formatter={(value: number) => [`${value}%`, '시청 깊이']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {videoChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_CONFIG[entry.status].barColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <div className="w-full h-px bg-gray-200" />
                <span className="whitespace-nowrap">기준: {ENGAGEMENT_THRESHOLD.videoDepth}%</span>
                <div className="w-full h-px bg-gray-200" />
              </div>
              <InsightHint type="footer" message="영상 50% 이상 시청 = 기술 내용에 관심 있음" />
            </div>
          </section>

          {/* Technology Detail Table */}
          <section className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">기술별 TOFU 상태</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">기술</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">방문</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">체류(분)</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">영상(%)</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">연속 페이지</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">추세</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">상태</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">해석</th>
                  </tr>
                </thead>
                <tbody>
                  {TOFU_TECHNOLOGIES.map((tech) => {
                    const statusConfig = STATUS_CONFIG[tech.status];
                    return (
                      <tr key={tech.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{tech.name}</td>
                        <td className="py-3 px-4 text-right text-gray-900">{formatNumber(tech.visits)}</td>
                        <td className={cn(
                          'py-3 px-4 text-right font-medium',
                          tech.avgDwell >= ENGAGEMENT_THRESHOLD.dwell ? 'text-green-600' : 'text-gray-500'
                        )}>
                          {tech.avgDwell.toFixed(1)}
                        </td>
                        <td className={cn(
                          'py-3 px-4 text-right font-medium',
                          tech.videoDepth >= ENGAGEMENT_THRESHOLD.videoDepth ? 'text-green-600' : 'text-gray-500'
                        )}>
                          {tech.videoDepth}%
                        </td>
                        <td className={cn(
                          'py-3 px-4 text-right font-medium',
                          tech.consecutivePages >= ENGAGEMENT_THRESHOLD.pages ? 'text-green-600' : 'text-gray-500'
                        )}>
                          {tech.consecutivePages.toFixed(1)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn(
                            'inline-flex items-center gap-1 text-sm font-medium',
                            tech.trend === 'up' ? 'text-green-600' :
                            tech.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                          )}>
                            {tech.trend === 'up' && <ArrowUp size={14} />}
                            {tech.trend === 'down' && <ArrowDown size={14} />}
                            {tech.trend === 'stable' && <ArrowRight size={14} />}
                            {tech.trendValue > 0 ? '+' : ''}{tech.trendValue}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn(
                            'px-2 py-1 rounded text-xs font-medium',
                            statusConfig.bgColor,
                            statusConfig.color
                          )}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-xs">{tech.insight}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <InsightHint
              type="footer"
              status="good"
              message={`${candidateCount}개 기술이 검토 후보군 진입 → MOFU로 이동 가능`}
            />
          </section>

          {/* Legend & Criteria */}
          <section className="bg-gray-50 rounded-xl border p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">TOFU 판단 기준</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">검토 후보군</div>
                  <div className="text-gray-500 text-xs">
                    체류 {ENGAGEMENT_THRESHOLD.dwell}분+, 영상 {ENGAGEMENT_THRESHOLD.videoDepth}%+, 
                    연속 {ENGAGEMENT_THRESHOLD.pages}페이지+
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">?</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">관찰 필요</div>
                  <div className="text-gray-500 text-xs">일부 기준 충족, 추가 콘텐츠 노출 필요</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500 font-bold">-</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">단순 노출</div>
                  <div className="text-gray-500 text-xs">기준 미충족, 아직 검토 후보군 아님</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
