'use client';

import { MessageSquare, Mail, Users, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import {
  AreaChart,
  Area,
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

// 문의 데이터
const INQUIRIES = [
  { id: 'inq-001', date: '2025-12-18', technology: 'Digital Cockpit', type: '기술문의', source: 'LG.com' },
  { id: 'inq-002', date: '2025-12-17', technology: 'Vehicle Vision', type: '스펙요청', source: 'LinkedIn' },
  { id: 'inq-003', date: '2025-12-16', technology: 'ADAS', type: '기술문의', source: 'LG.com' },
  { id: 'inq-004', date: '2025-12-15', technology: 'Digital Cockpit', type: '데모요청', source: 'CES Event' },
  { id: 'inq-005', date: '2025-12-14', technology: 'IVI', type: '일반문의', source: 'LG.com' },
  { id: 'inq-006', date: '2025-12-13', technology: 'Digital Cockpit', type: '파트너십', source: 'LinkedIn' },
  { id: 'inq-007', date: '2025-12-12', technology: 'Vehicle Vision', type: '기술문의', source: 'Google' },
  { id: 'inq-008', date: '2025-12-11', technology: 'ADAS', type: '스펙요청', source: 'LG.com' },
];

// 뉴스레터 구독 데이터
const NEWSLETTER_DATA = {
  totalSubscribers: 2847,
  newThisMonth: 234,
  unsubscribeThisMonth: 18,
  netGrowth: 216,
  growthRate: 8.2,
  openRate: 42.5,
  clickRate: 12.8,
};

// 뉴스레터 기술별 구독자
const NEWSLETTER_BY_TECH = [
  { technology: 'Digital Cockpit', subscribers: 892, growth: 15 },
  { technology: 'Vehicle Vision', subscribers: 654, growth: 12 },
  { technology: 'ADAS', subscribers: 523, growth: 8 },
  { technology: 'IVI', subscribers: 412, growth: -3 },
  { technology: 'Telematics', subscribers: 366, growth: -5 },
];

// 추이 데이터
const TREND_DATA = [
  { date: '11-W1', inquiry: 8, newsletter: 45 },
  { date: '11-W2', inquiry: 12, newsletter: 52 },
  { date: '11-W3', inquiry: 15, newsletter: 58 },
  { date: '11-W4', inquiry: 18, newsletter: 67 },
  { date: '12-W1', inquiry: 22, newsletter: 78 },
  { date: '12-W2', inquiry: 28, newsletter: 89 },
];

// 기술별 문의 분포
const techDistribution = INQUIRIES.reduce((acc, i) => {
  acc[i.technology] = (acc[i.technology] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const TYPE_CONFIG: Record<string, { color: string; bgColor: string }> = {
  '기술문의': { color: 'text-blue-600', bgColor: 'bg-blue-100' },
  '스펙요청': { color: 'text-green-600', bgColor: 'bg-green-100' },
  '데모요청': { color: 'text-purple-600', bgColor: 'bg-purple-100' },
  '일반문의': { color: 'text-gray-600', bgColor: 'bg-gray-100' },
  '파트너십': { color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
};

export default function InquiryDetailPage() {
  const totalInquiries = INQUIRIES.length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeader
        title="문의 & 뉴스레터"
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
          {/* Summary Cards */}
          <section className="grid grid-cols-6 gap-4">
            {/* 문의 관련 */}
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MessageSquare size={14} />
                전체 문의
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{totalInquiries}</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">이번 달 문의</div>
              <div className="text-2xl font-bold text-brand-primary mt-1">28</div>
              <div className="text-xs text-green-600">+40%</div>
            </div>
            
            {/* 뉴스레터 관련 */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Mail size={14} />
                뉴스레터 구독자
              </div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{formatNumber(NEWSLETTER_DATA.totalSubscribers)}</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">신규 구독</div>
              <div className="text-2xl font-bold text-green-600 mt-1">+{NEWSLETTER_DATA.newThisMonth}</div>
              <div className="text-xs text-gray-400">이번 달</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">오픈율</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{NEWSLETTER_DATA.openRate}%</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm text-gray-500">클릭율</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{NEWSLETTER_DATA.clickRate}%</div>
            </div>
          </section>

          {/* Trend Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 문의 & 뉴스레터 추이 */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">문의 & 뉴스레터 추이</h2>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="inquiry" 
                    stroke="#A50034" 
                    fill="#A50034" 
                    fillOpacity={0.3}
                    name="문의"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="newsletter" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                    name="뉴스레터 신규"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ background: 'rgba(165, 0, 52, 0.5)' }} />
                  <span className="text-gray-500">문의</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-400" />
                  <span className="text-gray-500">뉴스레터 신규</span>
                </div>
              </div>
            </div>

          </section>

          {/* Technology Distribution */}
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">기술별 문의 분포</h2>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(techDistribution).map(([tech, count]) => (
                <div key={tech} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-500">{tech}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Inquiries Table */}
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 문의</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">날짜</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">기술</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">유형</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">소스</th>
                  </tr>
                </thead>
                <tbody>
                  {INQUIRIES.map((inquiry) => {
                    const typeConfig = TYPE_CONFIG[inquiry.type] || TYPE_CONFIG['일반문의'];
                    return (
                      <tr key={inquiry.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{inquiry.date}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{inquiry.technology}</td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            'px-2 py-1 rounded text-xs font-medium',
                            typeConfig.bgColor,
                            typeConfig.color
                          )}>
                            {inquiry.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{inquiry.source}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Newsletter Stats Detail */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-900">뉴스레터 상세</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-500">총 구독자</div>
                <div className="text-2xl font-bold text-blue-600">{formatNumber(NEWSLETTER_DATA.totalSubscribers)}</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-500">순 증가 (이번 달)</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-green-600">+{NEWSLETTER_DATA.netGrowth}</div>
                  <span className="text-xs text-green-600 flex items-center">
                    <ArrowUp size={12} />
                    {NEWSLETTER_DATA.growthRate}%
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-500">해지</div>
                <div className="text-2xl font-bold text-gray-500">{NEWSLETTER_DATA.unsubscribeThisMonth}</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-500">평균 오픈율</div>
                <div className="text-2xl font-bold text-gray-900">{NEWSLETTER_DATA.openRate}%</div>
                <div className="text-xs text-gray-400">업계 평균 25%</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
