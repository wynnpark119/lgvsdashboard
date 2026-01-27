'use client';

import { ArrowUp, ArrowDown, ArrowRight, RefreshCw, Target, Users } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { PageHeader } from '@/components/layout';
import { InsightHint } from '@/components/ui';
import { FUNNEL_STAGE_CONFIG } from '@/types/funnel';
import { cn, formatNumber } from '@/lib/utils';

// MOFU/BOFU 단계 기술 데이터
const MOFU_BOFU_TECHNOLOGIES = [
  {
    id: 'digital-cockpit',
    name: 'Digital Cockpit',
    mofu: { revisits: 412, repeatContent: 8.2, webinarReg: 45 },
    bofu: { inquiries: 28, specRequest: 12, understandingScore: 92 },
    status: 'deep_review' as const,
    trend: 'up' as const,
    trendValue: 18,
    insight: '지속 검토 중, 기술 이해도 높음',
  },
  {
    id: 'vehicle-vision',
    name: 'Vehicle Vision',
    mofu: { revisits: 203, repeatContent: 6.5, webinarReg: 32 },
    bofu: { inquiries: 18, specRequest: 8, understandingScore: 85 },
    status: 'deep_review' as const,
    trend: 'up' as const,
    trendValue: 15,
    insight: '심화 검토 진행 중, 이해도 양호',
  },
  {
    id: 'adas',
    name: 'ADAS',
    mofu: { revisits: 287, repeatContent: 4.2, webinarReg: 28 },
    bofu: { inquiries: 12, specRequest: 4, understandingScore: 68 },
    status: 'nurturing' as const,
    trend: 'stable' as const,
    trendValue: 2,
    insight: '검토 유지 중, 추가 콘텐츠 필요',
  },
  {
    id: 'ivi',
    name: 'IVI',
    mofu: { revisits: 98, repeatContent: 2.1, webinarReg: 8 },
    bofu: { inquiries: 5, specRequest: 1, understandingScore: 42 },
    status: 'declining' as const,
    trend: 'down' as const,
    trendValue: -15,
    insight: '관심 하락 중, 원인 분석 필요',
  },
  {
    id: 'telematics',
    name: 'Telematics',
    mofu: { revisits: 56, repeatContent: 1.5, webinarReg: 5 },
    bofu: { inquiries: 3, specRequest: 0, understandingScore: 35 },
    status: 'declining' as const,
    trend: 'down' as const,
    trendValue: -22,
    insight: '검토 대상에서 이탈 중',
  },
];

const STATUS_CONFIG = {
  deep_review: { 
    label: '검토 완료', 
    color: 'text-green-600', 
    bgColor: 'bg-green-100', 
    description: '기술 이해 완료',
    icon: '🎯'
  },
  nurturing: { 
    label: '검토 중', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-100', 
    description: '추가 콘텐츠 필요',
    icon: '🌱'
  },
  declining: { 
    label: '하락', 
    color: 'text-red-600', 
    bgColor: 'bg-red-100', 
    description: '관심 하락',
    icon: '📉'
  },
};

const UNDERSTANDING_CONFIG = {
  high: { label: '이해도 높음', color: 'text-green-600', bgColor: 'bg-green-100' },
  medium: { label: '이해도 중간', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  low: { label: '이해도 낮음', color: 'text-gray-500', bgColor: 'bg-gray-100' },
};

function getUnderstandingLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high';
  if (score >= 45) return 'medium';
  return 'low';
}

export default function MOFUBOFUPage() {
  // 통계
  const deepReviewCount = MOFU_BOFU_TECHNOLOGIES.filter(t => t.status === 'deep_review').length;
  const nurturingCount = MOFU_BOFU_TECHNOLOGIES.filter(t => t.status === 'nurturing').length;
  const decliningCount = MOFU_BOFU_TECHNOLOGIES.filter(t => t.status === 'declining').length;
  
  const totalMofuRevisits = MOFU_BOFU_TECHNOLOGIES.reduce((sum, t) => sum + t.mofu.revisits, 0);
  const totalBofuInquiries = MOFU_BOFU_TECHNOLOGIES.reduce((sum, t) => sum + t.bofu.inquiries, 0);
  const totalSpecRequest = MOFU_BOFU_TECHNOLOGIES.reduce((sum, t) => sum + t.bofu.specRequest, 0);

  // 이해도 점수 차트 데이터
  const understandingScoreData = MOFU_BOFU_TECHNOLOGIES.map(t => ({
    name: t.name.split(' ')[0],
    score: t.bofu.understandingScore,
    status: t.status,
  })).sort((a, b) => b.score - a.score);

  // 상태별 파이 차트
  const statusPieData = [
    { name: '검토 완료', value: deepReviewCount, color: '#22c55e' },
    { name: '검토 중', value: nurturingCount, color: '#f59e0b' },
    { name: '하락', value: decliningCount, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="깊은 관심"
        description=""
      />

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Key Message */}
          <section className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                   style={{ background: FUNNEL_STAGE_CONFIG.bofu.color }}>
                🎯
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">MOFU·BOFU = 검토 심화 상태 판단</h3>
                <p className="text-gray-600">
                  "접촉 수"가 아니라 <strong>"OEM이 얼마나 깊이 이해하고 있는가"</strong>를 식별합니다.
                  <br/>
                  기술 조직과 공유해도 되는 검토 상태에 도달했는지 판단합니다.
                </p>
              </div>
            </div>
          </section>

          {/* Summary Cards */}
          <section className="grid grid-cols-6 gap-4">
            <div className="bg-green-50 rounded-xl border border-green-200 p-4">
              <div className="flex items-center gap-2 text-sm text-green-700 mb-1">
                <Target size={14} />
                <span>검토 완료</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{deepReviewCount}개</div>
              <div className="text-xs text-green-600">기술 이해 완료</div>
            </div>
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
              <div className="text-sm text-yellow-700">검토 중</div>
              <div className="text-2xl font-bold text-yellow-600">{nurturingCount}개</div>
              <div className="text-xs text-yellow-600">추가 콘텐츠 필요</div>
            </div>
            <div className="bg-red-50 rounded-xl border border-red-200 p-4">
              <div className="text-sm text-red-700">하락</div>
              <div className="text-2xl font-bold text-red-600">{decliningCount}개</div>
              <div className="text-xs text-red-600">관심 하락</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <RefreshCw size={14} />
                <span>MOFU 재방문</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(totalMofuRevisits)}</div>
              <div className="text-xs text-gray-400">지속 검토 신호</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Users size={14} />
                <span>BOFU Inquiry</span>
              </div>
              <div className="text-2xl font-bold text-brand-primary">{totalBofuInquiries}</div>
              <div className="text-xs text-gray-400">관심 표현</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">스펙 요청</div>
              <div className="text-2xl font-bold text-green-600">{totalSpecRequest}</div>
              <div className="text-xs text-gray-400">심화 검토 신호</div>
            </div>
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Understanding Score Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">기술별 이해도 점수</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={understandingScoreData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                  <Tooltip formatter={(value: number) => [`${value}점`, '이해도']} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {understandingScoreData.map((entry, index) => {
                      const level = getUnderstandingLevel(entry.score);
                      const color = level === 'high' ? '#22c55e' : level === 'medium' ? '#f59e0b' : '#9ca3af';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span className="text-gray-500">70+ (이해 완료)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-yellow-500" />
                  <span className="text-gray-500">45-69 (이해 중)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-gray-400" />
                  <span className="text-gray-500">~44 (이해 부족)</span>
                </div>
              </div>
              <InsightHint
                type="footer"
                status="good"
                message={`${deepReviewCount}개 기술에서 OEM 이해도 높음 - 기술 조직에 검토 현황 공유 권장`}
              />
            </div>

            {/* Status Distribution Pie */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">상태 분포</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                    label={false}
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}개`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {statusPieData.map(item => {
                  const total = statusPieData.reduce((sum, i) => sum + i.value, 0);
                  const percent = Math.round((item.value / total) * 100);
                  return (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ background: item.color }} />
                        <span className="text-gray-600">{item.name}</span>
                        <span className="text-gray-400 text-xs">({percent}%)</span>
                      </div>
                      <span className="font-medium">{item.value}개</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Technology Detail Cards */}
          <section className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">기술별 MOFU·BOFU 상세</h3>
            <div className="space-y-4">
              {MOFU_BOFU_TECHNOLOGIES.map((tech) => {
                const statusConfig = STATUS_CONFIG[tech.status];
                const understandingLevel = getUnderstandingLevel(tech.bofu.understandingScore);
                const understandingConfig = UNDERSTANDING_CONFIG[understandingLevel];

                return (
                  <div key={tech.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{statusConfig.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{tech.name}</span>
                            <span className={cn(
                              'px-2 py-0.5 rounded text-xs font-medium',
                              statusConfig.bgColor,
                              statusConfig.color
                            )}>
                              {statusConfig.label}
                            </span>
                            <span className={cn(
                              'inline-flex items-center gap-1 text-sm',
                              tech.trend === 'up' ? 'text-green-600' :
                              tech.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                            )}>
                              {tech.trend === 'up' && <ArrowUp size={14} />}
                              {tech.trend === 'down' && <ArrowDown size={14} />}
                              {tech.trend === 'stable' && <ArrowRight size={14} />}
                              {tech.trendValue > 0 ? '+' : ''}{tech.trendValue}%
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">{tech.insight}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn('text-3xl font-bold', understandingConfig.color)}>
                          {tech.bofu.understandingScore}
                        </div>
                        <div className={cn('text-xs', understandingConfig.color)}>{understandingConfig.label}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-4 text-sm">
                      {/* MOFU Metrics */}
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-gray-500 text-xs mb-1">재방문</div>
                        <div className="font-medium text-gray-900">{formatNumber(tech.mofu.revisits)}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-gray-500 text-xs mb-1">반복 콘텐츠</div>
                        <div className="font-medium text-gray-900">{tech.mofu.repeatContent}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-gray-500 text-xs mb-1">웨비나 등록</div>
                        <div className="font-medium text-gray-900">{tech.mofu.webinarReg}</div>
                      </div>
                      {/* BOFU Metrics */}
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-gray-500 text-xs mb-1">Inquiry</div>
                        <div className="font-medium text-brand-primary">{tech.bofu.inquiries}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-gray-500 text-xs mb-1">스펙 요청</div>
                        <div className="font-medium text-green-600">{tech.bofu.specRequest}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-gray-500 text-xs mb-1">액션</div>
                        <div className={cn('font-medium text-xs', statusConfig.color)}>
                          {statusConfig.description}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* MOFU vs BOFU Criteria */}
          <section className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                     style={{ background: FUNNEL_STAGE_CONFIG.mofu.color }}>
                  <span className="text-white text-sm">M</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">MOFU 신호</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <RefreshCw size={14} className="text-gray-400" />
                  <span>재방문 발생 (같은 기술 2회 이상)</span>
                </li>
                <li className="flex items-center gap-2">
                  <RefreshCw size={14} className="text-gray-400" />
                  <span>반복 콘텐츠 소비 (다른 콘텐츠 추가 조회)</span>
                </li>
                <li className="flex items-center gap-2">
                  <RefreshCw size={14} className="text-gray-400" />
                  <span>심화 콘텐츠 시청 (웨비나, 기술 영상)</span>
                </li>
              </ul>
              <InsightHint type="footer" message="MOFU = 계속 보고 있음 → 관심 지속" />
            </div>
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                     style={{ background: FUNNEL_STAGE_CONFIG.bofu.color }}>
                  <span className="text-white text-sm">B</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">BOFU (심화 검토) 신호</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Target size={14} className="text-gray-400" />
                  <span>Inquiry 발생 (문의 폼 제출)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Target size={14} className="text-gray-400" />
                  <span>스펙/기술자료 요청</span>
                </li>
                <li className="flex items-center gap-2">
                  <Target size={14} className="text-gray-400" />
                  <span>자료 다운로드 + 후속 행동</span>
                </li>
              </ul>
              <InsightHint type="footer" status="good" message="BOFU = OEM이 깊이 이해함 → 기술조직 공유" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
