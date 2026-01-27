'use client';

import Link from 'next/link';
import { MapPin, Calendar, ArrowLeft, Target, Megaphone } from 'lucide-react';
import type { DetailContext } from '@/data/detail-reference-data';
import { cn, formatDate } from '@/lib/utils';

interface ContextFilterProps {
  context: DetailContext;
  onTechnologyChange?: (id: string) => void;
  availableTechnologies?: { id: string; name: string }[];
}

const SOURCE_CONFIG = {
  'review-flow': { label: 'Review Flow', color: 'text-purple-600', bgColor: 'bg-purple-50', href: '/review-flow' },
  'campaign-impact': { label: 'Campaign Impact', color: 'text-yellow-600', bgColor: 'bg-yellow-50', href: '/campaign-impact' },
};

export default function ContextFilter({ context, onTechnologyChange, availableTechnologies }: ContextFilterProps) {
  const sourceConfig = SOURCE_CONFIG[context.source];

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-brand-primary" />
          <h2 className="text-lg font-semibold text-gray-900">현재 보고 있는 데이터:</h2>
        </div>
        <Link
          href={sourceConfig.href}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          {sourceConfig.label}로 돌아가기
        </Link>
      </div>

      {/* Context Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Technology */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Target size={12} />
            <span>Technology</span>
          </div>
          {availableTechnologies && availableTechnologies.length > 1 ? (
            <select
              value={context.technology.id}
              onChange={(e) => onTechnologyChange?.(e.target.value)}
              className="w-full text-sm font-medium text-gray-900 bg-white border rounded px-2 py-1"
            >
              {availableTechnologies.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm font-medium text-gray-900">{context.technology.name}</div>
          )}
        </div>

        {/* Period */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Calendar size={12} />
            <span>Period</span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {formatDate(context.period.start)} ~ {formatDate(context.period.end)}
          </div>
        </div>

        {/* Context / Purpose */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span>🎯</span>
            <span>Context</span>
          </div>
          <div className="text-sm font-medium text-gray-900">{context.purpose}</div>
        </div>

        {/* Related Campaign */}
        {context.relatedCampaign && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Megaphone size={12} />
              <span>Related Campaign</span>
            </div>
            <div className="text-sm font-medium text-gray-900">{context.relatedCampaign}</div>
          </div>
        )}
      </div>

      {/* Source Indicator */}
      <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm">
        <span className="text-gray-500">From:</span>
        <span className={cn('px-2 py-1 rounded text-xs font-medium', sourceConfig.bgColor, sourceConfig.color)}>
          {sourceConfig.label}
        </span>
        <span className="text-gray-400">→</span>
        <span className="text-gray-600">Technology Card 클릭</span>
      </div>
    </div>
  );
}
