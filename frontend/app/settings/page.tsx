'use client';

import { useState } from 'react';
import {
  Settings,
  Tag,
  Megaphone,
  FileText,
  Globe,
  Link2,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Check,
} from 'lucide-react';
import {
  TECHNOLOGY_SETTINGS,
  CAMPAIGN_SETTINGS,
  URL_PATTERN_MAPPINGS,
  CHANNEL_SETTINGS,
  SOCIAL_POSTS,
  type Technology,
  type CampaignSetting,
  type CampaignContent,
  type SocialPost,
} from '@/data/settings';

type TabType = 'technologies' | 'campaigns' | 'urls' | 'channels' | 'social';

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'technologies', label: '기술 키워드', icon: Tag },
  { id: 'campaigns', label: '캠페인', icon: Megaphone },
  { id: 'urls', label: 'URL 패턴', icon: Link2 },
  { id: 'channels', label: '채널 설정', icon: Globe },
  { id: 'social', label: '소셜 게시물', icon: FileText },
];

const CATEGORY_LABELS: Record<Technology['category'], { label: string; color: string }> = {
  strategic: { label: '전략과제', color: 'bg-red-100 text-red-700' },
  core: { label: 'Core', color: 'bg-blue-100 text-blue-700' },
  emerging: { label: 'Emerging', color: 'bg-yellow-100 text-yellow-700' },
  monitoring: { label: 'Monitoring', color: 'bg-gray-100 text-gray-600' },
};

const CAMPAIGN_TYPE_LABELS: Record<CampaignSetting['type'], { label: string; color: string }> = {
  advertising: { label: '광고', color: 'bg-purple-100 text-purple-700' },
  content: { label: '콘텐츠', color: 'bg-green-100 text-green-700' },
  event: { label: '이벤트', color: 'bg-orange-100 text-orange-700' },
  webinar: { label: '웨비나', color: 'bg-cyan-100 text-cyan-700' },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('technologies');
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());

  const toggleCampaignExpand = (campaignId: string) => {
    setExpandedCampaigns((prev) => {
      const next = new Set(prev);
      if (next.has(campaignId)) {
        next.delete(campaignId);
      } else {
        next.add(campaignId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-[1520px] mx-auto px-6 py-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">세팅</h1>
          </div>
          <p className="text-gray-500">
            대시보드 데이터 태깅 및 매핑 관리
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {activeTab === 'technologies' && (
            <TechnologiesTab technologies={TECHNOLOGY_SETTINGS} />
          )}
          {activeTab === 'campaigns' && (
            <CampaignsTab
              campaigns={CAMPAIGN_SETTINGS}
              expandedCampaigns={expandedCampaigns}
              onToggleExpand={toggleCampaignExpand}
            />
          )}
          {activeTab === 'urls' && <UrlPatternsTab mappings={URL_PATTERN_MAPPINGS} />}
          {activeTab === 'channels' && <ChannelsTab channels={CHANNEL_SETTINGS} />}
          {activeTab === 'social' && <SocialPostsTab posts={SOCIAL_POSTS} />}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Technologies Tab
// ─────────────────────────────────────────────────────────────

function TechnologiesTab({ technologies }: { technologies: Technology[] }) {
  const grouped = technologies.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) acc[tech.category] = [];
      acc[tech.category].push(tech);
      return acc;
    },
    {} as Record<string, Technology[]>
  );

  const categoryOrder: Technology['category'][] = ['strategic', 'core', 'emerging', 'monitoring'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">기술 키워드 관리</h2>
          <p className="text-sm text-gray-500 mt-1">
            모니터링 대상 기술 및 URL 패턴 매핑
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          기술 추가
        </button>
      </div>

      <div className="space-y-6">
        {categoryOrder.map((category) => {
          const techs = grouped[category] || [];
          if (techs.length === 0) return null;
          const categoryConfig = CATEGORY_LABELS[category];

          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${categoryConfig.color}`}
                >
                  {categoryConfig.label}
                </span>
                <span className="text-sm text-gray-400">({techs.length})</span>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                        기술명
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                        URL 패턴
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                        연관 캠페인
                      </th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                        우선순위
                      </th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                        상태
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {techs.map((tech) => (
                      <tr key={tech.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{tech.name}</div>
                            <div className="text-xs text-gray-500">{tech.nameKo}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {tech.urlPatterns?.slice(0, 2).map((pattern, i) => (
                              <code
                                key={i}
                                className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600"
                              >
                                {pattern}
                              </code>
                            ))}
                            {(tech.urlPatterns?.length || 0) > 2 && (
                              <span className="text-xs text-gray-400">
                                +{(tech.urlPatterns?.length || 0) - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {tech.relatedCampaigns?.slice(0, 2).map((campaignId) => (
                              <span
                                key={campaignId}
                                className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
                              >
                                {campaignId}
                              </span>
                            ))}
                            {(tech.relatedCampaigns?.length || 0) > 2 && (
                              <span className="text-xs text-gray-400">
                                +{(tech.relatedCampaigns?.length || 0) - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`w-2 h-2 rounded-full ${
                                  star <= tech.priority ? 'bg-yellow-400' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                              tech.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {tech.active ? <Check className="w-3 h-3" /> : null}
                            {tech.active ? '활성' : '비활성'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Campaigns Tab
// ─────────────────────────────────────────────────────────────

function CampaignsTab({
  campaigns,
  expandedCampaigns,
  onToggleExpand,
}: {
  campaigns: CampaignSetting[];
  expandedCampaigns: Set<string>;
  onToggleExpand: (id: string) => void;
}) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">캠페인 관리</h2>
          <p className="text-sm text-gray-500 mt-1">
            캠페인 등록 및 하위 콘텐츠 연결
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          캠페인 추가
        </button>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => {
          const isExpanded = expandedCampaigns.has(campaign.id);
          const typeConfig = CAMPAIGN_TYPE_LABELS[campaign.type];

          return (
            <div
              key={campaign.id}
              className="border rounded-lg overflow-hidden"
            >
              {/* Campaign Header */}
              <div
                className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => onToggleExpand(campaign.id)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {campaign.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${typeConfig.color}`}
                      >
                        {typeConfig.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {campaign.period.start} ~ {campaign.period.end}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-900">
                      콘텐츠 {campaign.contents.length}개
                    </div>
                    <div className="flex gap-1 mt-0.5">
                      {campaign.technologies.slice(0, 3).map((techId) => (
                        <span
                          key={techId}
                          className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded"
                        >
                          {techId}
                        </span>
                      ))}
                      {campaign.technologies.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{campaign.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 text-gray-400 hover:text-gray-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Campaign Contents */}
              {isExpanded && (
                <div className="border-t">
                  <div className="px-4 py-3 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        연결된 콘텐츠
                      </span>
                      <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                        <Plus className="w-3 h-3" />
                        콘텐츠 추가
                      </button>
                    </div>

                    {/* Contents by Channel */}
                    <ContentsByChannel contents={campaign.contents} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContentsByChannel({ contents }: { contents: CampaignContent[] }) {
  const grouped = contents.reduce(
    (acc, content) => {
      if (!acc[content.channel]) acc[content.channel] = [];
      acc[content.channel].push(content);
      return acc;
    },
    {} as Record<string, CampaignContent[]>
  );

  const channelLabels: Record<string, { label: string; icon: string }> = {
    lgcom: { label: 'LG.com', icon: '🌐' },
    linkedin: { label: 'LinkedIn', icon: '💼' },
    youtube: { label: 'YouTube', icon: '📺' },
    newsletter: { label: 'Newsletter', icon: '📧' },
    webinar: { label: 'Webinar', icon: '🎥' },
  };

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([channel, channelContents]) => {
        const channelConfig = channelLabels[channel] || { label: channel, icon: '📄' };

        return (
          <div key={channel}>
            <div className="flex items-center gap-2 mb-2">
              <span>{channelConfig.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {channelConfig.label}
              </span>
              <span className="text-xs text-gray-400">
                ({channelContents.length})
              </span>
            </div>
            <div className="space-y-1 pl-6">
              {channelContents.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-900">{content.title}</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                      {content.technology}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {content.publishDate}
                    </span>
                    {content.url && (
                      <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// URL Patterns Tab
// ─────────────────────────────────────────────────────────────

function UrlPatternsTab({
  mappings,
}: {
  mappings: typeof URL_PATTERN_MAPPINGS;
}) {
  const contentTypeLabels: Record<string, string> = {
    product: '제품',
    campaign: '캠페인',
    event: '이벤트',
    resource: '리소스',
    article: '아티클',
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">URL 패턴 매핑</h2>
          <p className="text-sm text-gray-500 mt-1">
            LG.com URL을 기술/캠페인에 자동 매핑
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          패턴 추가
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                URL 패턴
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                매핑 대상
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                유형
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                설명
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mappings.map((mapping) => (
              <tr key={mapping.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <code className="text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                    {mapping.pattern}
                  </code>
                </td>
                <td className="px-4 py-3">
                  {mapping.technologyId && (
                    <span className="text-sm bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                      기술: {mapping.technologyId}
                    </span>
                  )}
                  {mapping.campaignId && (
                    <span className="text-sm bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                      캠페인: {mapping.campaignId}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">
                    {contentTypeLabels[mapping.contentType]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {mapping.description}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Channels Tab
// ─────────────────────────────────────────────────────────────

function ChannelsTab({ channels }: { channels: typeof CHANNEL_SETTINGS }) {
  const typeLabels: Record<string, { label: string; color: string }> = {
    owned: { label: 'Owned', color: 'bg-green-100 text-green-700' },
    social: { label: 'Social', color: 'bg-blue-100 text-blue-700' },
    paid: { label: 'Paid', color: 'bg-purple-100 text-purple-700' },
    newsletter: { label: 'Newsletter', color: 'bg-orange-100 text-orange-700' },
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">채널 설정</h2>
          <p className="text-sm text-gray-500 mt-1">
            통합 퍼널 가중치 및 수집 지표 설정
          </p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                채널
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                유형
              </th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                가중치
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                수집 지표
              </th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                상태
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {channels.map((channel) => {
              const typeConfig = typeLabels[channel.type];
              return (
                <tr key={channel.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {channel.name}
                      </div>
                      <div className="text-xs text-gray-500">{channel.nameKo}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${typeConfig.color}`}
                    >
                      {typeConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-mono font-medium text-gray-700">
                      x{channel.weight.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {channel.metrics.slice(0, 4).map((metric) => (
                        <code
                          key={metric}
                          className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600"
                        >
                          {metric}
                        </code>
                      ))}
                      {channel.metrics.length > 4 && (
                        <span className="text-xs text-gray-400">
                          +{channel.metrics.length - 4}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        channel.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {channel.active ? <Check className="w-3 h-3" /> : null}
                      {channel.active ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Social Posts Tab
// ─────────────────────────────────────────────────────────────

function SocialPostsTab({ posts }: { posts: SocialPost[] }) {
  const channelIcons: Record<string, string> = {
    linkedin: '💼',
    youtube: '📺',
    reddit: '🔴',
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">소셜 게시물 관리</h2>
          <p className="text-sm text-gray-500 mt-1">
            게시물별 기술/캠페인 태깅
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          게시물 추가
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                채널
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                제목
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                연관 기술
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                연관 캠페인
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                게시일
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                성과
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="text-lg">{channelIcons[post.channel]}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{post.title}</span>
                    {post.url && (
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {post.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {post.campaigns.map((campaign) => (
                      <span
                        key={campaign}
                        className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded"
                      >
                        {campaign}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {post.publishDate}
                </td>
                <td className="px-4 py-3 text-right">
                  {post.metrics && (
                    <div className="text-xs text-gray-500">
                      {post.metrics.impressions && (
                        <span>{post.metrics.impressions.toLocaleString()} 노출</span>
                      )}
                      {post.metrics.views && (
                        <span>{post.metrics.views.toLocaleString()} 조회</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
