'use client';

import { cn } from '@/lib/utils';

interface Criterion {
  question: string;
  answer: string;
  status: 'success' | 'warning' | 'pending';
}

interface SuccessCriteriaProps {
  title: string;
  criteria: Criterion[];
  className?: string;
}

const STATUS_COLORS = {
  success: 'text-green-600',
  warning: 'text-yellow-600',
  pending: 'text-gray-500',
};

export function SuccessCriteria({ title, criteria, className }: SuccessCriteriaProps) {
  return (
    <section className={cn('bg-gray-50 rounded-xl border p-6', className)}>
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-3 gap-4 text-sm">
        {criteria.map((c, idx) => (
          <div key={idx} className="bg-white rounded-lg border p-3">
            <div className="text-gray-500 mb-1">"{c.question}"</div>
            <div className={cn('font-medium', STATUS_COLORS[c.status])}>→ {c.answer}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
