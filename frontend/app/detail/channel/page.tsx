'use client';

import { ExternalLink, Globe, Linkedin, Facebook, MessageCircle, Users } from 'lucide-react';
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
import { cn, formatNumber } from '@/lib/utils';

// 채널별 상세 데이터
const CHANNELS = [
  {
    id: 'lg-com',
    name: 'LG.com',
    icon: Globe,
    metrics: {
      visits: 45230,
      avgDwell: 3.8,
      pageDepth: 3.2,
      deepInterestRate: 12.4,
      inquiries: 45,
    },
    role: 'Converter',
    trend: 23,
  },
  {
    id: 'linkedin-organic',
    name: 'LinkedIn (Organic)',
    icon: Linkedin,
    metrics: {
      visits: 28420,
      avgDwell: 2.1,
      pageDepth: 1.8,
      deepInterestRate: 8.2,
      inquiries: 28,
    },
    role: 'Attractor',
    trend: 18,
  },
  {
    id: 'linkedin-paid',
    name: 'LinkedIn (Paid)',
    icon: Linkedin,
    metrics: {
      visits: 12350,
      avgDwell: 1.4,
      pageDepth: 1.5,
      deepInterestRate: 5.8,
      inquiries: 12,
    },
    role: 'Igniter',
    trend: 8,
  },
  {
    id: 'meta',
    name: 'Meta (Facebook/Instagram)',
    icon: Facebook,
    metrics: {
      visits: 9870,
      avgDwell: 1.2,
      pageDepth: 1.4,
      deepInterestRate: 4.3,
      inquiries: 6,
    },
    role: 'Igniter',
    trend: 32,
  },
  {
    id: 'google-organic',
    name: 'Google (Organic)',
    icon: Globe,
    metrics: {
      visits: 18920,
      avgDwell: 4.2,
      pageDepth: 3.8,
      deepInterestRate: 15.2,
      inquiries: 32,
    },
    role: 'Converter',
    trend: 12,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: ExternalLink,
    metrics: {
      visits: 8540,
      avgDwell: 5.2,
      pageDepth: 2.1,
      deepInterestRate: 6.5,
      inquiries: 8,
    },
    role: 'Educator',
    trend: 15,
  },
  {
    id: 'reddit',
    name: 'Reddit (신규)',
    icon: MessageCircle,
    metrics: {
      visits: 3250,
      avgDwell: 2.8,
      pageDepth: 2.2,
      deepInterestRate: 7.8,
      inquiries: 4,
    },
    role: 'Attractor',
    trend: 85,
  },
  {
    id: 'remember',
    name: '리멤버 (OEM/Media)',
    icon: Users,
    metrics: {
      visits: 2180,
      avgDwell: 1.8,
      pageDepth: 1.6,
      deepInterestRate: 9.2,
      inquiries: 15,
    },
    role: 'Igniter',
    trend: 45,
  },
];

const ROLE_CONFIG = {
  Converter: { color: 'text-green-600', bgColor: 'bg-green-100', desc: '깊은 관심 전환' },
  Attractor: { color: 'text-blue-600', bgColor: 'bg-blue-100', desc: '첫 유입 기여' },
  Igniter: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', desc: '관심 촉발' },
  Educator: { color: 'text-purple-600', bgColor: 'bg-purple-100', desc: '콘텐츠 소비' },
};

export default function ChannelDetailPage() {
  // 차트 데이터
  const visitChartData = CHANNELS.map((ch) => ({
    name: ch.name.split(' ')[0],
    visits: ch.metrics.visits,
    role: ch.role,
  }));

  const conversionChartData = CHANNELS.map((ch) => ({
    name: ch.name.split(' ')[0],
    conversion: ch.metrics.deepInterestRate,
    role: ch.role,
  })).sort((a, b) => b.conversion - a.conversion);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="채널별 상세"
        description="채널별 역할 및 전환 성과"
      />

      {/* Period Info */}
      <div className="bg-gray-50 border-b px-6 py-2">
        <div className="max-w-[1600px] mx-auto">
          <span className="text-xs text-gray-500">2026-02 기준</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visit Chart */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">채널별 방문</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={visitChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                  <Tooltip formatter={(value: number) => [formatNumber(value), '방문']} />
                  <Bar dataKey="visits" radius={[0, 4, 4, 0]}>
                    {visitChartData.map((entry, index) => {
                      const roleConfig = ROLE_CONFIG[entry.role as keyof typeof ROLE_CONFIG];
                      const color = roleConfig.color.replace('text-', '').replace('-600', '');
                      const colorMap: Record<string, string> = {
                        green: '#22c55e',
                        blue: '#3b82f6',
                        yellow: '#f59e0b',
                        purple: '#8b5cf6',
                      };
                      return <Cell key={`cell-${index}`} fill={colorMap[color] || '#6b7280'} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Conversion Chart */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">채널별 깊은 관심 전환율</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={conversionChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 20]} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                  <Tooltip formatter={(value: number) => [`${value}%`, '전환율']} />
                  <Bar dataKey="conversion" radius={[0, 4, 4, 0]} fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Channel Cards */}
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">채널별 상세</h2>
            <div className="space-y-4">
              {CHANNELS.map((channel) => {
                const ChannelIcon = channel.icon;
                const roleConfig = ROLE_CONFIG[channel.role as keyof typeof ROLE_CONFIG];

                return (
                  <div key={channel.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ChannelIcon size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{channel.name}</h3>
                            <span className={cn(
                              'px-2 py-0.5 rounded text-xs font-medium',
                              roleConfig.bgColor,
                              roleConfig.color
                            )}>
                              {channel.role}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{roleConfig.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{formatNumber(channel.metrics.visits)}</div>
                        <div className="text-xs text-green-600">+{channel.trend}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-500 text-xs">방문</div>
                        <div className="font-medium">{formatNumber(channel.metrics.visits)}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-500 text-xs">체류(분)</div>
                        <div className="font-medium">{channel.metrics.avgDwell}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-500 text-xs">페이지 깊이</div>
                        <div className="font-medium">{channel.metrics.pageDepth}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-500 text-xs">깊은 관심 전환</div>
                        <div className="font-medium text-green-600">{channel.metrics.deepInterestRate}%</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="text-gray-500 text-xs">문의</div>
                        <div className="font-medium text-brand-primary">{channel.metrics.inquiries}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Role Legend */}
          <section className="bg-gray-50 border rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">채널 역할 분류</h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                <div key={role} className="flex items-center gap-2">
                  <span className={cn('px-2 py-1 rounded text-xs font-medium', config.bgColor, config.color)}>
                    {role}
                  </span>
                  <span className="text-gray-500">{config.desc}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
