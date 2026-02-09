'use client';

import { Film, FileText, Share2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoreTechPillarData {
  pillarName: string;
  campaignAssets: {
    id: string;
    type: 'film' | 'page' | 'posts';
    views?: number;
    sessions?: number;
    impressions?: number;
    watchTime?: number;
    avgTime?: number;
    engagement?: number;
    revisitRate?: number;
    depthSignal?: 'high' | 'medium' | 'low';
  }[];
  depthSignals: {
    watchTime: number;
    revisitRate: number;
    longReads: number;
  };
  authoritySignals: {
    expertContentEngagement: number;
    oemInquiries: number;
  };
}

interface CoreTechPillarPerformanceProps {
  hpcData: CoreTechPillarData;
  transformableData: CoreTechPillarData;
}

const ASSET_TYPE_CONFIG = {
  film: { label: 'Film', icon: Film, color: 'text-purple-600' },
  page: { label: 'Landing Page', icon: FileText, color: 'text-blue-600' },
  posts: { label: 'Social Posts', icon: Share2, color: 'text-green-600' },
};

function MetricBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const percentage = (value / max) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-700">{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full rounded-full transition-all',
            percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function PillarCard({ data }: { data: CoreTechPillarData }) {
  const AssetIcon = Film;
  
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-3">{data.pillarName}</h3>
      
      {/* Campaign Assets */}
      <div className="space-y-2 mb-4">
        <div className="text-xs text-gray-500 mb-2">Campaign Assets</div>
        {data.campaignAssets.map((asset) => {
          const typeConfig = ASSET_TYPE_CONFIG[asset.type];
          const Icon = typeConfig.icon;
          
          return (
            <div key={asset.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Icon size={14} className={typeConfig.color} />
                <span className="text-gray-600">{typeConfig.label}</span>
              </div>
              <span className="font-medium text-gray-700">
                {asset.views && `${(asset.views / 1000).toFixed(0)}K views`}
                {asset.sessions && `${(asset.sessions / 1000).toFixed(1)}K sessions`}
                {asset.impressions && `${(asset.impressions / 1000).toFixed(0)}K impr`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Depth Signals */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2">Depth Signals</div>
        <div className="space-y-2">
          <MetricBar label="Watch Time" value={data.depthSignals.watchTime} />
          <MetricBar label="Revisit Rate" value={data.depthSignals.revisitRate} />
          <MetricBar label="Long Reads (3min+)" value={data.depthSignals.longReads} />
        </div>
      </div>

      {/* Authority Signals */}
      <div>
        <div className="text-xs text-gray-500 mb-2">Authority Signals</div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Expert Engagement</span>
            <span className="font-medium text-gray-700">{data.authoritySignals.expertContentEngagement}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">OEM Inquiries</span>
            <span className="font-medium text-gray-700">{data.authoritySignals.oemInquiries}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoreTechPillarPerformance({ hpcData, transformableData }: CoreTechPillarPerformanceProps) {
  // HPC vs Transformable Display 비교
  const hpcScore = (hpcData.depthSignals.watchTime + hpcData.depthSignals.revisitRate + hpcData.depthSignals.longReads) / 3;
  const transformableScore = (transformableData.depthSignals.watchTime + transformableData.depthSignals.revisitRate + transformableData.depthSignals.longReads) / 3;
  const leader = hpcScore > transformableScore ? 'hpc' : 'transformable-display';
  const leaderName = leader === 'hpc' ? 'HPC (High-Performance Computing)' : 'Transformable Display';
  const scoreDiff = Math.abs(hpcScore - transformableScore).toFixed(1);

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Core Tech Pillar Performance</h2>
        <p className="text-sm text-gray-500">
          HPC (High-Performance Computing) vs Transformable Display 심화 검토 비교
        </p>
      </div>

      {/* Pillars Comparison */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        <PillarCard data={hpcData} />
        <PillarCard data={transformableData} />
      </div>

      {/* Comparison Insight */}
      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <div className="flex items-center gap-2 text-sm font-medium text-green-900">
          <TrendingUp size={16} />
          <span>{leaderName} 심화 검토 우위</span>
        </div>
        <div className="text-sm text-green-700 mt-1">
          Depth Signals 평균 {scoreDiff}% 앞섬, 
          OEM Inquiry {leader === 'hpc' 
            ? ((hpcData.authoritySignals.oemInquiries - transformableData.authoritySignals.oemInquiries) / transformableData.authoritySignals.oemInquiries * 100).toFixed(0)
            : ((transformableData.authoritySignals.oemInquiries - hpcData.authoritySignals.oemInquiries) / hpcData.authoritySignals.oemInquiries * 100).toFixed(0)
          }% 더 많음
        </div>
      </div>
    </div>
  );
}
