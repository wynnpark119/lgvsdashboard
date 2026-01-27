'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
  minimal?: boolean; // 홈용 간소화 모드
}

export function PageHeader({
  title,
  description,
  actions,
  minimal = false,
}: PageHeaderProps) {
  return (
    <header className="bg-white border-b px-6 py-5">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </div>
    </header>
  );
}

interface NextStepGuideProps {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  variant?: 'blue' | 'purple' | 'yellow' | 'green';
}

const VARIANT_STYLES = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'text-blue-900',
    desc: 'text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'text-purple-900',
    desc: 'text-purple-700',
    button: 'bg-purple-600 hover:bg-purple-700',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    title: 'text-yellow-900',
    desc: 'text-yellow-700',
    button: 'bg-yellow-600 hover:bg-yellow-700',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'text-green-900',
    desc: 'text-green-700',
    button: 'bg-green-600 hover:bg-green-700',
  },
};

export function NextStepGuide({ title, description, href, buttonLabel, variant = 'blue' }: NextStepGuideProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className={cn('border rounded-xl p-6', styles.bg, styles.border)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', styles.iconBg)}>
            <span className={cn('font-bold', styles.iconColor)}>→</span>
          </div>
          <div>
            <div className={cn('font-medium', styles.title)}>{title}</div>
            <div className={cn('text-sm', styles.desc)}>{description}</div>
          </div>
        </div>
        <Link
          href={href}
          className={cn(
            'px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
            styles.button
          )}
        >
          {buttonLabel}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

interface PageFooterProps {
  message?: string;
}

export function PageFooter({ message }: PageFooterProps) {
  return (
    <footer className="border-t bg-white px-6 py-4 mt-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>LG Electronics Vehicle Solution Company</div>
          {message && <div>{message}</div>}
        </div>
      </div>
    </footer>
  );
}
