'use client';

import type { MediaAnalysis } from '@/data/campaign-impact-data';
import { MEDIA_ROLE_CONFIG, CHANNEL_LABELS } from '@/data/campaign-impact-data';
import { cn } from '@/lib/utils';

interface MediaRoleInterpretationProps {
  mediaAnalysis: MediaAnalysis[];
}

export default function MediaRoleInterpretation({ mediaAnalysis }: MediaRoleInterpretationProps) {
  // Group by role for summary
  const roleGroups = {
    igniter: mediaAnalysis.filter((m) => m.role === 'igniter'),
    accelerator: mediaAnalysis.filter((m) => m.role === 'accelerator'),
    supporter: mediaAnalysis.filter((m) => m.role === 'supporter'),
    noise: mediaAnalysis.filter((m) => m.role === 'noise'),
  };

  return (
    <div className="bg-white rounded-xl border p-6 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">미디어 역할 해석</h2>
        <p className="text-sm text-gray-500">어떤 미디어가 어떤 역할을 했는가</p>
      </div>

      {/* Role Legend */}
      <div className="grid grid-cols-4 gap-2 mb-4 text-xs">
        {Object.entries(MEDIA_ROLE_CONFIG).map(([role, config]) => (
          <div key={role} className={cn('px-2 py-1 rounded text-center', config.bgColor, config.color)}>
            <span className="mr-1">{config.icon}</span>
            {config.label}
          </div>
        ))}
      </div>

      {/* Media Cards */}
      <div className="space-y-3">
        {mediaAnalysis.map((media) => {
          const roleConfig = MEDIA_ROLE_CONFIG[media.role];

          return (
            <div key={media.channel} className="p-4 rounded-lg border hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900">
                    {CHANNEL_LABELS[media.channel]}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    영향 기술: {media.technologies.join(', ')}
                  </div>
                </div>
                <span
                  className={cn(
                    'px-2 py-1 rounded text-xs font-medium flex items-center gap-1',
                    roleConfig.bgColor,
                    roleConfig.color
                  )}
                >
                  <span>{roleConfig.icon}</span>
                  {roleConfig.label}
                </span>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                {media.evidence}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Summary */}
      <div className="mt-4 pt-4 border-t">
        <h3 className="text-sm font-medium text-gray-700 mb-2">역할별 요약</h3>
        <div className="space-y-2 text-sm">
          {roleGroups.accelerator.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-blue-500">⚡</span>
              <span className="text-gray-600">
                <strong className="text-gray-900">심화 검토 가속</strong>:{' '}
                {roleGroups.accelerator.map((m) => CHANNEL_LABELS[m.channel]).join(', ')}
              </span>
            </div>
          )}
          {roleGroups.igniter.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-orange-500">🔥</span>
              <span className="text-gray-600">
                <strong className="text-gray-900">검토 시작 유발</strong>:{' '}
                {roleGroups.igniter.map((m) => CHANNEL_LABELS[m.channel]).join(', ')}
              </span>
            </div>
          )}
          {roleGroups.supporter.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-green-500">🛡️</span>
              <span className="text-gray-600">
                <strong className="text-gray-900">검토 유지 기여</strong>:{' '}
                {roleGroups.supporter.map((m) => CHANNEL_LABELS[m.channel]).join(', ')}
              </span>
            </div>
          )}
          {roleGroups.noise.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400">📢</span>
              <span className="text-gray-600">
                <strong className="text-gray-900">단기 반응만</strong>:{' '}
                {roleGroups.noise.map((m) => CHANNEL_LABELS[m.channel]).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-4 bg-blue-50 rounded-lg p-3">
        <div className="text-sm text-blue-800">
          <strong>💡 Key Insight:</strong> LinkedIn이 심화 검토 전환의 핵심 가속 역할 수행.
          다음 캠페인에서도 LinkedIn 비중 유지 권장.
        </div>
      </div>
    </div>
  );
}
