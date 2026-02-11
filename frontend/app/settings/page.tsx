'use client';

import { useState } from 'react';
import {
  Settings,
  Tag,
  Megaphone,
  Link2,
  Globe,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';
import {
  TECHNOLOGY_SETTINGS,
  CAMPAIGN_SETTINGS,
  CONTENT_URLS,
  CHANNEL_SETTINGS,
  getCampaignsByTechnology,
  getContentsByTechnology,
  getContentsByCampaign,
  getIndependentContents,
  type Technology,
  type Campaign,
  type ContentUrl,
} from '@/data/settings';

type TabType = 'technologies' | 'campaigns' | 'contents' | 'channels';

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'technologies', label: '기술 키워드', icon: Tag },
  { id: 'campaigns', label: '캠페인', icon: Megaphone },
  { id: 'contents', label: '콘텐츠 URL', icon: Link2 },
  { id: 'channels', label: '채널 설정', icon: Globe },
];

const CATEGORY_LABELS: Record<Technology['category'], { label: string; color: string }> = {
  strategic: { label: '전략과제', color: 'bg-red-100 text-red-700' },
  core: { label: 'Core', color: 'bg-blue-100 text-blue-700' },
  emerging: { label: 'Emerging', color: 'bg-yellow-100 text-yellow-700' },
  monitoring: { label: 'Monitoring', color: 'bg-gray-100 text-gray-600' },
};

const CAMPAIGN_TYPE_LABELS: Record<Campaign['type'], { label: string; color: string }> = {
  advertising: { label: '광고', color: 'bg-purple-100 text-purple-700' },
  content: { label: '콘텐츠', color: 'bg-green-100 text-green-700' },
  event: { label: '이벤트', color: 'bg-orange-100 text-orange-700' },
  webinar: { label: '웨비나', color: 'bg-cyan-100 text-cyan-700' },
};

const CONTENT_TYPE_LABELS: Record<ContentUrl['contentType'], string> = {
  landing: '랜딩페이지',
  article: '아티클',
  video: '영상',
  whitepaper: '백서',
  'social-post': '소셜포스트',
  webinar: '웨비나',
  newsletter: '뉴스레터',
};

const FUNNEL_STAGE_LABELS: Record<ContentUrl['funnelStage'], { label: string; color: string }> = {
  tofu: { label: 'TOFU', color: 'bg-blue-100 text-blue-700' },
  mofu: { label: 'MOFU', color: 'bg-yellow-100 text-yellow-700' },
  bofu: { label: 'BOFU', color: 'bg-green-100 text-green-700' },
};

const CHANNEL_LABELS: Record<ContentUrl['channel'], { label: string; icon: string }> = {
  lgcom: { label: 'LG.com', icon: '🌐' },
  linkedin: { label: 'LinkedIn', icon: '💼' },
  youtube: { label: 'YouTube', icon: '📺' },
  reddit: { label: 'Reddit', icon: '💬' },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('technologies');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
            기술 키워드, 캠페인, 콘텐츠 URL 태깅 관리
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
            <TechnologiesTab
              technologies={TECHNOLOGY_SETTINGS}
              expandedItems={expandedItems}
              onToggleExpand={toggleExpand}
            />
          )}
          {activeTab === 'campaigns' && (
            <CampaignsTab
              campaigns={CAMPAIGN_SETTINGS}
              expandedItems={expandedItems}
              onToggleExpand={toggleExpand}
            />
          )}
          {activeTab === 'contents' && (
            <ContentsTab contents={CONTENT_URLS} />
          )}
          {activeTab === 'channels' && (
            <ChannelsTab channels={CHANNEL_SETTINGS} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Technologies Tab
// ─────────────────────────────────────────────────────────────

function TechnologiesTab({
  technologies,
  expandedItems,
  onToggleExpand,
}: {
  technologies: Technology[];
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
}) {
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
            기술 등록 및 연결된 캠페인/콘텐츠 확인
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
                <span className={`px-2 py-1 rounded text-xs font-medium ${categoryConfig.color}`}>
                  {categoryConfig.label}
                </span>
                <span className="text-sm text-gray-400">({techs.length})</span>
              </div>

              <div className="space-y-2">
                {techs.map((tech) => {
                  const isExpanded = expandedItems.has(`tech-${tech.id}`);
                  const campaigns = getCampaignsByTechnology(tech.id);
                  const contents = getContentsByTechnology(tech.id);

                  return (
                    <div key={tech.id} className="border rounded-lg overflow-hidden">
                      {/* Tech Header */}
                      <div
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                        onClick={() => onToggleExpand(`tech-${tech.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{tech.name}</span>
                              <span className="text-sm text-gray-500">({tech.nameKo})</span>
                            </div>
                            {tech.description && (
                              <div className="text-xs text-gray-500 mt-0.5">{tech.description}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm">
                            <span className="text-gray-500">캠페인 {campaigns.length}</span>
                            <span className="text-gray-300 mx-2">|</span>
                            <span className="text-gray-500">콘텐츠 {contents.length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`w-2 h-2 rounded-full ${
                                  star <= tech.priority ? 'bg-yellow-400' : 'bg-gray-200'
                                }`}
                              />
                            ))}
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

                      {/* Tech Details */}
                      {isExpanded && (
                        <div className="border-t px-4 py-4 bg-white">
                          <div className="grid grid-cols-2 gap-6">
                            {/* 연결된 캠페인 */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">연결된 캠페인</h4>
                              {campaigns.length > 0 ? (
                                <div className="space-y-1">
                                  {campaigns.map((campaign) => {
                                    const typeConfig = CAMPAIGN_TYPE_LABELS[campaign.type];
                                    return (
                                      <div
                                        key={campaign.id}
                                        className="flex items-center gap-2 text-sm py-1"
                                      >
                                        <span className={`px-1.5 py-0.5 rounded text-xs ${typeConfig.color}`}>
                                          {typeConfig.label}
                                        </span>
                                        <span className="text-gray-700">{campaign.name}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-400">연결된 캠페인 없음</p>
                              )}
                            </div>

                            {/* 연결된 콘텐츠 */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">연결된 콘텐츠</h4>
                              {contents.length > 0 ? (
                                <div className="space-y-1">
                                  {contents.slice(0, 5).map((content) => {
                                    const channelConfig = CHANNEL_LABELS[content.channel];
                                    return (
                                      <div
                                        key={content.id}
                                        className="flex items-center gap-2 text-sm py-1"
                                      >
                                        <span>{channelConfig.icon}</span>
                                        <span className="text-gray-700 truncate max-w-[200px]">
                                          {content.title}
                                        </span>
                                      </div>
                                    );
                                  })}
                                  {contents.length > 5 && (
                                    <p className="text-xs text-gray-400">+{contents.length - 5}개 더</p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-400">연결된 콘텐츠 없음</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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
  expandedItems,
  onToggleExpand,
}: {
  campaigns: Campaign[];
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
}) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">캠페인 관리</h2>
          <p className="text-sm text-gray-500 mt-1">
            캠페인 등록, 연관 기술 및 콘텐츠 관리
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          캠페인 추가
        </button>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => {
          const isExpanded = expandedItems.has(`campaign-${campaign.id}`);
          const contents = getContentsByCampaign(campaign.id);
          const typeConfig = CAMPAIGN_TYPE_LABELS[campaign.type];

          return (
            <div key={campaign.id} className="border rounded-lg overflow-hidden">
              {/* Campaign Header */}
              <div
                className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => onToggleExpand(`campaign-${campaign.id}`)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{campaign.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {campaign.period.start} ~ {campaign.period.end}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* 연관 기술 */}
                  <div className="flex gap-1">
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
                  <span className="text-sm text-gray-500">콘텐츠 {contents.length}</span>
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Campaign Contents */}
              {isExpanded && (
                <div className="border-t px-4 py-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">연결된 콘텐츠</span>
                    <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                      <Plus className="w-3 h-3" />
                      콘텐츠 연결
                    </button>
                  </div>

                  {contents.length > 0 ? (
                    <div className="space-y-2">
                      {contents.map((content) => {
                        const channelConfig = CHANNEL_LABELS[content.channel];
                        const funnelConfig = FUNNEL_STAGE_LABELS[content.funnelStage];
                        return (
                          <div
                            key={content.id}
                            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <span>{channelConfig.icon}</span>
                              <span className="text-gray-900">{content.title}</span>
                              <span className="text-xs text-gray-400">
                                {CONTENT_TYPE_LABELS[content.contentType]}
                              </span>
                              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${funnelConfig.color}`}>
                                {funnelConfig.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* 연관 기술 표시 */}
                              <div className="flex gap-1">
                                {content.technologies.map((techId) => (
                                  <span
                                    key={techId}
                                    className="text-xs bg-gray-200 text-gray-600 px-1 py-0.5 rounded"
                                  >
                                    {techId}
                                  </span>
                                ))}
                              </div>
                              {content.url && (
                                <a
                                  href={content.url.startsWith('http') ? content.url : `https://lg.com${content.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-blue-500"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <button className="p-1 text-gray-400 hover:text-red-500">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 py-2">연결된 콘텐츠가 없습니다</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Contents Tab
// ─────────────────────────────────────────────────────────────

function ContentsTab({ contents }: { contents: ContentUrl[] }) {
  const independentContents = getIndependentContents();
  const campaignContents = contents.filter((c) => c.campaigns.length > 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">콘텐츠 URL 관리</h2>
          <p className="text-sm text-gray-500 mt-1">
            콘텐츠 URL 등록 및 기술/캠페인 태깅
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          콘텐츠 추가
        </button>
      </div>

      {/* 캠페인 소속 콘텐츠 */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Megaphone className="w-4 h-4" />
          캠페인 소속 콘텐츠
          <span className="text-gray-400">({campaignContents.length})</span>
        </h3>
        <ContentTable contents={campaignContents} showCampaigns />
      </div>

      {/* 독립 콘텐츠 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          독립 콘텐츠 (캠페인 미소속)
          <span className="text-gray-400">({independentContents.length})</span>
        </h3>
        <ContentTable contents={independentContents} showCampaigns={false} />
      </div>
    </div>
  );
}

function ContentTable({
  contents,
  showCampaigns,
}: {
  contents: ContentUrl[];
  showCampaigns: boolean;
}) {
  if (contents.length === 0) {
    return <p className="text-sm text-gray-400 py-4">콘텐츠가 없습니다</p>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">채널</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">제목</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">유형</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">퍼널</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">연관 기술</th>
            {showCampaigns && (
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">캠페인</th>
            )}
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {contents.map((content) => {
            const channelConfig = CHANNEL_LABELS[content.channel];
            const funnelConfig = FUNNEL_STAGE_LABELS[content.funnelStage];
            return (
              <tr key={content.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="text-lg">{channelConfig.icon}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{content.title}</span>
                    {content.url && (
                      <a
                        href={content.url.startsWith('http') ? content.url : `https://lg.com${content.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[250px]">
                    {content.url}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {CONTENT_TYPE_LABELS[content.contentType]}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${funnelConfig.color}`}>
                    {funnelConfig.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {content.technologies.length > 0 ? (
                      content.technologies.map((techId) => (
                        <span
                          key={techId}
                          className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded"
                        >
                          {techId}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">전체</span>
                    )}
                  </div>
                </td>
                {showCampaigns && (
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {content.campaigns.map((campaignId) => (
                        <span
                          key={campaignId}
                          className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded"
                        >
                          {campaignId}
                        </span>
                      ))}
                    </div>
                  </td>
                )}
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
            );
          })}
        </tbody>
      </table>
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
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">채널</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">유형</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">가중치</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">수집 지표</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {channels.map((channel) => {
              const typeConfig = typeLabels[channel.type];
              return (
                <tr key={channel.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{channel.name}</div>
                      <div className="text-xs text-gray-500">{channel.nameKo}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeConfig.color}`}>
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
                        <span className="text-xs text-gray-400">+{channel.metrics.length - 4}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        channel.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
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
