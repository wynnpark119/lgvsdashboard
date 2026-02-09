'use client';

import { PageHeader } from '@/components/layout';
import { CHANNEL_NARRATIVE_ROLES, type MediaChannel } from '@/types';
import { Globe, MessageSquare, Video, FileText, Share2, Search, Briefcase } from 'lucide-react';

const CHANNEL_ICONS: Record<MediaChannel, any> = {
  reddit: MessageSquare,
  youtube_ads: Video,
  video: Video,
  lg_com: Globe,
  social: Share2,
  google_ads: Search,
  linkedin_ads: Briefcase,
};

const ROLE_COLORS: Record<string, string> = {
  'issue-seeding': 'bg-purple-50 border-purple-200 text-purple-900',
  'narrative-immersion': 'bg-blue-50 border-blue-200 text-blue-900',
  'judgment-formation': 'bg-green-50 border-green-200 text-green-900',
  'authority-validation': 'bg-orange-50 border-orange-200 text-orange-900',
};

export default function ChannelRolesPage() {
  const channels = Object.entries(CHANNEL_NARRATIVE_ROLES) as [MediaChannel, typeof CHANNEL_NARRATIVE_ROLES[MediaChannel]][];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Channel Roles"
        description="채널을 Narrative Carrier로 재해석 — 성과 엔드포인트가 아닌 역할 중심"
        minimal
        actions={
          <div className="text-sm text-gray-500">Tech On Board 캠페인</div>
        }
      />

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Channel Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {channels.map(([channel, config]) => {
              const Icon = CHANNEL_ICONS[channel];
              const colorClass = ROLE_COLORS[config.role] || 'bg-gray-50 border-gray-200 text-gray-900';

              return (
                <div key={channel} className={`border rounded-xl p-6 ${colorClass}`}>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-lg border">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg capitalize">
                          {channel.replace('_', ' ')}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-white rounded border">
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">
                        {config.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Narrative Flow Explanation */}
          <section className="bg-white border rounded-xl p-6">
            <h3 className="font-medium text-gray-900 mb-4">Narrative Flow 구조</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">1</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Issue Seeding</div>
                  <div className="text-sm text-gray-600">Reddit에서 AI-Defined Vehicle 이슈 발굴</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">2</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Narrative Immersion</div>
                  <div className="text-sm text-gray-600">YouTube/LG.com에서 Campaign Film 및 Core Tech Films 제공</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-medium">3</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Judgment Formation</div>
                  <div className="text-sm text-gray-600">LG.com Tech On Board Hub에서 통합 정보 제공</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-medium">4</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Authority & Validation</div>
                  <div className="text-sm text-gray-600">LinkedIn Expert Content 및 Newsletter로 권위 검증</div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Insight */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-medium text-blue-900 mb-2">Channel Role 해석 원칙</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 채널은 성과 엔드포인트가 아닌 Narrative Carrier</li>
              <li>• 각 채널은 캠페인 Flow에서 고유한 역할 수행</li>
              <li>• 단일 채널 성과가 아닌 Layer 간 Handoff Rate가 중요</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
