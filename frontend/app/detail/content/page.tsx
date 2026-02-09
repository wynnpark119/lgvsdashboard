'use client';

import { FileText, Video, Download, Clock, Mic, BookOpen, Play, TrendingUp, Eye } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { PageHeader } from '@/components/layout';
import { TECHNOLOGIES, getTechnologyById } from '@/types';
import { cn, formatNumber } from '@/lib/utils';

// 홈의 기술 목록과 연결된 콘텐츠 데이터
// 순서: 전략과제 → Core → Emerging
const CONTENT_DATA = [
  // HPC 관련 콘텐츠 (전략과제)
  {
    id: 'hpc-whitepaper',
    title: 'High-Performance Computing Platform Technical Whitepaper',
    type: 'document' as const,
    format: 'PDF Whitepaper',
    technology: 'hpc',
    metrics: { views: 5840, avgDwell: 12.5, completionRate: 78, downloads: 1856 },
    trend: 85,
    topOEMs: ['BMW', 'Mercedes', 'Volkswagen'],
  },
  {
    id: 'hpc-expert-discussion',
    title: 'HPC Expert Discussion: AI Computing in Vehicles',
    type: 'webinar' as const,
    format: 'Expert Discussion (35min)',
    technology: 'hpc',
    metrics: { views: 3420, avgDwell: 28.5, completionRate: 82, downloads: 0 },
    trend: 72,
    topOEMs: ['GM', 'Ford', 'Toyota'],
  },
  {
    id: 'hpc-ces-demo',
    title: 'HPC (High-Performance Computing) Tech On Board Film',
    type: 'video' as const,
    format: 'Demo Video (4min)',
    technology: 'hpc',
    metrics: { views: 12500, avgDwell: 3.5, completionRate: 85, downloads: 0 },
    trend: 142,
    topOEMs: ['CES 전시 방문자'],
  },

  // Transformable Display 관련 콘텐츠 (전략과제)
  {
    id: 'transformable-whitepaper',
    title: 'Transformable Display Technology Overview',
    type: 'document' as const,
    format: 'PDF Whitepaper',
    technology: 'transformable-display',
    metrics: { views: 4920, avgDwell: 10.8, completionRate: 72, downloads: 1542 },
    trend: 78,
    topOEMs: ['Mercedes', 'Audi', 'Porsche'],
  },
  {
    id: 'transformable-video',
    title: 'Transformable Display: Form Factor Innovation',
    type: 'video' as const,
    format: 'Tech Explainer (5min)',
    technology: 'transformable-display',
    metrics: { views: 8650, avgDwell: 4.2, completionRate: 78, downloads: 0 },
    trend: 95,
    topOEMs: ['BMW', 'Lucid', 'Rivian'],
  },

  // Digital Cockpit 관련 콘텐츠
  {
    id: 'cockpit-whitepaper',
    title: 'Digital Cockpit Platform Overview',
    type: 'document' as const,
    format: 'PDF Whitepaper',
    technology: 'digital-cockpit',
    metrics: { views: 3421, avgDwell: 8.5, completionRate: 68, downloads: 892 },
    trend: 31,
    topOEMs: ['BMW', 'Mercedes', 'Hyundai'],
  },
  {
    id: 'cockpit-webinar',
    title: 'Next-Gen Cockpit Experience 웨비나',
    type: 'webinar' as const,
    format: 'Live Webinar (45min)',
    technology: 'digital-cockpit',
    metrics: { views: 1856, avgDwell: 38.2, completionRate: 82, downloads: 0 },
    trend: 45,
    topOEMs: ['Toyota', 'VW', 'Ford'],
  },
  {
    id: 'cockpit-demo',
    title: 'Digital Cockpit Tech On Board Film',
    type: 'video' as const,
    format: 'Demo Video (3min)',
    technology: 'digital-cockpit',
    metrics: { views: 8920, avgDwell: 2.8, completionRate: 75, downloads: 0 },
    trend: 128,
    topOEMs: ['전시 방문자'],
  },

  // LG P-pod 관련 콘텐츠
  {
    id: 'p-pod-landing',
    title: 'LG P-pod: Total In-vehicle Experience',
    type: 'document' as const,
    format: 'Product Overview',
    technology: 'lg-p-pod',
    metrics: { views: 4580, avgDwell: 6.8, completionRate: 72, downloads: 1245 },
    trend: 92,
    topOEMs: ['Mercedes', 'BMW', 'Hyundai'],
  },
  {
    id: 'p-pod-video',
    title: 'LG P-pod Tech On Board Reveal',
    type: 'video' as const,
    format: 'Product Reveal (6min)',
    technology: 'lg-p-pod',
    metrics: { views: 9850, avgDwell: 5.2, completionRate: 82, downloads: 0 },
    trend: 158,
    topOEMs: ['CES 전시 방문자'],
  },

  // Vehicle Vision 관련 콘텐츠
  {
    id: 'vision-casestudy',
    title: 'Vehicle Vision 적용 사례: European OEM',
    type: 'document' as const,
    format: 'Case Study',
    technology: 'vehicle-vision',
    metrics: { views: 1245, avgDwell: 6.2, completionRate: 58, downloads: 456 },
    trend: 22,
    topOEMs: ['BMW', 'Audi'],
  },
  {
    id: 'vision-tech-video',
    title: 'Camera Module Technology Explained',
    type: 'video' as const,
    format: 'Tech Explainer (5min)',
    technology: 'vehicle-vision',
    metrics: { views: 3890, avgDwell: 4.1, completionRate: 62, downloads: 0 },
    trend: 18,
    topOEMs: ['Honda', 'Nissan', 'Stellantis'],
  },

  // ADAS 관련 콘텐츠
  {
    id: 'adas-webinar',
    title: 'ADAS Integration Best Practices 웨비나',
    type: 'webinar' as const,
    format: 'On-demand Webinar (60min)',
    technology: 'adas',
    metrics: { views: 2156, avgDwell: 42.5, completionRate: 72, downloads: 0 },
    trend: 15,
    topOEMs: ['GM', 'Ford', 'Rivian'],
  },
  {
    id: 'adas-spec',
    title: 'ADAS Sensor Fusion 기술 스펙',
    type: 'document' as const,
    format: 'Technical Specification',
    technology: 'adas',
    metrics: { views: 987, avgDwell: 12.3, completionRate: 45, downloads: 678 },
    trend: 8,
    topOEMs: ['Tesla', 'Lucid'],
  },

  // IVI 관련 콘텐츠
  {
    id: 'ivi-platform',
    title: 'IVI Platform Architecture Guide',
    type: 'document' as const,
    format: 'Technical Guide',
    technology: 'ivi',
    metrics: { views: 1523, avgDwell: 7.8, completionRate: 52, downloads: 389 },
    trend: -5,
    topOEMs: ['Hyundai', 'Kia'],
  },
  {
    id: 'ivi-demo',
    title: 'webOS Auto Demo',
    type: 'video' as const,
    format: 'Product Demo (4min)',
    technology: 'ivi',
    metrics: { views: 2890, avgDwell: 3.2, completionRate: 68, downloads: 0 },
    trend: 12,
    topOEMs: ['Honda', 'Toyota'],
  },

  // Automotive Display 관련 콘텐츠
  {
    id: 'display-brochure',
    title: 'P-OLED for Automotive Brochure',
    type: 'document' as const,
    format: 'Product Brochure',
    technology: 'automotive-display',
    metrics: { views: 892, avgDwell: 3.5, completionRate: 78, downloads: 234 },
    trend: -8,
    topOEMs: ['Mercedes', 'BMW'],
  },

  // Telematics 관련 콘텐츠
  {
    id: 'telematics-overview',
    title: 'Connected Car Telematics Overview',
    type: 'document' as const,
    format: 'Solution Overview',
    technology: 'telematics',
    metrics: { views: 456, avgDwell: 4.2, completionRate: 42, downloads: 123 },
    trend: -12,
    topOEMs: ['현대모비스'],
  },
];

const TYPE_CONFIG = {
  webinar: { icon: Mic, label: '웨비나', color: 'text-purple-600', bgColor: 'bg-purple-100', chartColor: '#8b5cf6' },
  document: { icon: FileText, label: '문서', color: 'text-blue-600', bgColor: 'bg-blue-100', chartColor: '#3b82f6' },
  video: { icon: Play, label: '영상', color: 'text-red-600', bgColor: 'bg-red-100', chartColor: '#ef4444' },
};

export default function ContentDetailPage() {
  // 기술별로 그룹핑
  const contentByTech = TECHNOLOGIES.map((tech) => {
    const contents = CONTENT_DATA.filter((c) => c.technology === tech.id);
    const totalViews = contents.reduce((sum, c) => sum + c.metrics.views, 0);
    const totalDownloads = contents.reduce((sum, c) => sum + c.metrics.downloads, 0);
    const avgCompletion = contents.length > 0 
      ? Math.round(contents.reduce((sum, c) => sum + c.metrics.completionRate, 0) / contents.length)
      : 0;
    return {
      ...tech,
      contents,
      totalViews,
      totalDownloads,
      avgCompletion,
      contentCount: contents.length,
    };
  }).filter((t) => t.contentCount > 0);

  // 전체 통계
  const totalViews = CONTENT_DATA.reduce((sum, c) => sum + c.metrics.views, 0);
  const totalDownloads = CONTENT_DATA.reduce((sum, c) => sum + c.metrics.downloads, 0);
  const avgCompletion = Math.round(CONTENT_DATA.reduce((sum, c) => sum + c.metrics.completionRate, 0) / CONTENT_DATA.length);

  // 콘텐츠 유형별 통계
  const typeStats = Object.entries(TYPE_CONFIG).map(([type, config]) => {
    const contents = CONTENT_DATA.filter((c) => c.type === type);
    return {
      type,
      label: config.label,
      count: contents.length,
      views: contents.reduce((sum, c) => sum + c.metrics.views, 0),
      color: config.chartColor,
    };
  });

  // 인기 콘텐츠 Top 5
  const topContents = [...CONTENT_DATA]
    .sort((a, b) => b.metrics.views - a.metrics.views)
    .slice(0, 5);

  // 높은 완료율 콘텐츠
  const highEngagementContents = [...CONTENT_DATA]
    .filter((c) => c.metrics.completionRate >= 70)
    .sort((a, b) => b.metrics.completionRate - a.metrics.completionRate);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="콘텐츠 상세"
        description="콘텐츠 소비 현황 및 Engagement 분석"
      />

      {/* Period Info */}
      <div className="bg-gray-50 border-b px-6 py-2">
        <div className="max-w-[1600px] mx-auto">
          <span className="text-xs text-gray-500">2026-02 기준</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Summary Cards */}
          <section className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BookOpen size={14} />
                전체 콘텐츠
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{CONTENT_DATA.length}개</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Eye size={14} />
                총 조회
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(totalViews)}</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Download size={14} />
                총 다운로드
              </div>
              <div className="text-2xl font-bold text-brand-primary mt-1">{formatNumber(totalDownloads)}</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">평균 완료율</div>
              <div className={cn(
                'text-2xl font-bold mt-1',
                avgCompletion >= 60 ? 'text-green-600' : 'text-yellow-600'
              )}>
                {avgCompletion}%
              </div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp size={14} />
                고관심 콘텐츠
              </div>
              <div className="text-2xl font-bold text-green-600 mt-1">{highEngagementContents.length}개</div>
              <div className="text-xs text-gray-400">완료율 70%+</div>
            </div>
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Contents */}
            <div className="lg:col-span-2 bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 콘텐츠 Top 5</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topContents} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} />
                  <YAxis 
                    dataKey="title" 
                    type="category" 
                    width={180} 
                    fontSize={11}
                    tickFormatter={(v) => v.length > 25 ? v.slice(0, 25) + '...' : v}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatNumber(value), '조회']}
                    labelFormatter={(label) => label}
                  />
                  <Bar dataKey="metrics.views" radius={[0, 4, 4, 0]}>
                    {topContents.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={TYPE_CONFIG[entry.type].chartColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2 text-xs">
                {Object.entries(TYPE_CONFIG).map(([type, config]) => (
                  <div key={type} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ background: config.chartColor }} />
                    <span className="text-gray-500">{config.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Type Distribution */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">콘텐츠 유형별 조회</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={typeStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="views"
                    label={false}
                  >
                    {typeStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatNumber(value), '조회']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {typeStats.map((stat) => {
                  const percent = Math.round((stat.views / totalViews) * 100);
                  return (
                    <div key={stat.type} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ background: stat.color }} />
                        <span className="text-gray-600">{stat.label}</span>
                        <span className="text-gray-400 text-xs">({percent}%)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{stat.count}개</span>
                        <span className="text-gray-400 ml-2">{formatNumber(stat.views)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* By Technology Section */}
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">기술별 콘텐츠 현황</h2>
            <p className="text-sm text-gray-500 mb-4">각 기술별 콘텐츠 소비 현황</p>
            
            <div className="space-y-6">
              {contentByTech.map((tech) => (
                <div key={tech.id} className="border rounded-lg p-4">
                  {/* Technology Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                        <span className="text-brand-primary font-bold text-sm">
                          {tech.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{tech.contentCount}개 콘텐츠</span>
                          <span>•</span>
                          <span>총 {formatNumber(tech.totalViews)} 조회</span>
                          <span>•</span>
                          <span>평균 완료율 {tech.avgCompletion}%</span>
                        </div>
                      </div>
                    </div>
                    {tech.totalDownloads > 0 && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-brand-primary">{formatNumber(tech.totalDownloads)}</div>
                        <div className="text-xs text-gray-400">다운로드</div>
                      </div>
                    )}
                  </div>

                  {/* Content List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tech.contents.map((content) => {
                      const typeConfig = TYPE_CONFIG[content.type];
                      const TypeIcon = typeConfig.icon;
                      return (
                        <div key={content.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <div className={cn('w-8 h-8 rounded flex items-center justify-center flex-shrink-0', typeConfig.bgColor)}>
                              <TypeIcon size={14} className={typeConfig.color} />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-sm text-gray-900 truncate" title={content.title}>
                                {content.title}
                              </div>
                              <div className="text-xs text-gray-500">{content.format}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="text-gray-400">조회</div>
                              <div className="font-medium">{formatNumber(content.metrics.views)}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-400">완료율</div>
                              <div className={cn(
                                'font-medium',
                                content.metrics.completionRate >= 70 ? 'text-green-600' :
                                content.metrics.completionRate >= 50 ? 'text-yellow-600' : 'text-gray-500'
                              )}>
                                {content.metrics.completionRate}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-400">추세</div>
                              <div className={cn(
                                'font-medium',
                                content.trend > 0 ? 'text-green-600' : 'text-red-600'
                              )}>
                                {content.trend > 0 ? '+' : ''}{content.trend}%
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* High Engagement Contents */}
          {highEngagementContents.length > 0 && (
            <section className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">높은 관심 콘텐츠 (완료율 70%+)</h3>
              <p className="text-sm text-green-700 mb-4">끝까지 보는 콘텐츠 = 관심이 높다는 신호</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {highEngagementContents.map((content) => {
                  const tech = getTechnologyById(content.technology);
                  const typeConfig = TYPE_CONFIG[content.type];
                  return (
                    <div key={content.id} className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn('px-1.5 py-0.5 rounded text-xs', typeConfig.bgColor, typeConfig.color)}>
                          {typeConfig.label}
                        </span>
                        <span className="text-xs text-gray-500">{tech?.name}</span>
                      </div>
                      <div className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
                        {content.title}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 font-bold">{content.metrics.completionRate}% 완료</span>
                        <span className="text-gray-500">{formatNumber(content.metrics.views)} 조회</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Interpretation */}
          <section className="bg-gray-50 border rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">콘텐츠 소비 해석 기준</h3>
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
              <div>
                <div className="font-medium text-gray-900 mb-1">완료율 70%+</div>
                <div>콘텐츠에 대한 높은 관심. 해당 기술에 대해 깊이 알고 싶어함</div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">다운로드 발생</div>
                <div>오프라인에서도 검토하겠다는 의향. 내부 공유 가능성 높음</div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">웨비나 참석</div>
                <div>시간을 투자해서 참석 = 적극적인 관심 표현</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
