'use client';

import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import type { DataLimitation } from '@/data/detail-reference-data';
import { cn } from '@/lib/utils';

interface DataNotesLimitationsProps {
  limitations: DataLimitation[];
}

const SEVERITY_CONFIG = {
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  critical: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

export default function DataNotesLimitations({ limitations }: DataNotesLimitationsProps) {
  // Group by severity
  const criticalItems = limitations.filter((l) => l.severity === 'critical');
  const warningItems = limitations.filter((l) => l.severity === 'warning');
  const infoItems = limitations.filter((l) => l.severity === 'info');

  const sortedLimitations = [...criticalItems, ...warningItems, ...infoItems];

  return (
    <div className="bg-white rounded-xl border p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={18} className="text-yellow-500" />
        <h2 className="text-lg font-semibold text-gray-900">데이터 한계 및 주의사항</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        이 데이터로 할 수 없는 판단을 명확히 합니다
      </p>

      <div className="space-y-3">
        {sortedLimitations.map((limitation, idx) => {
          const config = SEVERITY_CONFIG[limitation.severity];
          const Icon = config.icon;

          return (
            <div
              key={idx}
              className={cn('p-3 rounded-lg border', config.bgColor, config.borderColor)}
            >
              <div className="flex items-start gap-2">
                <Icon size={16} className={cn('mt-0.5 flex-shrink-0', config.color)} />
                <div>
                  <div className={cn('text-sm font-medium', config.color)}>
                    {limitation.title}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{limitation.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t">
        <div className="text-xs text-gray-500">
          <strong>요약:</strong> 이 대시보드의 데이터는 디지털 접점 활동을 반영하며,
          실제 구매/계약 전환과 직접적으로 연결되지 않습니다.
          전략 수립 시 추가 데이터 소스와 함께 검토해 주세요.
        </div>
      </div>

      {/* Severity Legend */}
      <div className="mt-3 flex items-center gap-4 text-xs">
        {Object.entries(SEVERITY_CONFIG).map(([severity, config]) => {
          const Icon = config.icon;
          return (
            <div key={severity} className="flex items-center gap-1">
              <Icon size={12} className={config.color} />
              <span className="text-gray-500 capitalize">{severity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
