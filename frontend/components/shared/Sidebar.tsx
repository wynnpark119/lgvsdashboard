'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { NAVIGATION_CONFIG, DECISION_FLOW, isPathActive } from '@/config/navigation';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const currentSection = NAVIGATION_CONFIG.find((section) =>
      section.items.some((item) => isPathActive(item.href, pathname))
    );
    if (currentSection) {
      setExpandedSections((prev) => new Set([...Array.from(prev), currentSection.id]));
    }
  }, [pathname]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-72 bg-white border-r z-50 flex flex-col',
          'transform transition-transform duration-200',
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b bg-brand-primary flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-brand-primary font-bold text-sm">VS</span>
            </div>
            <div>
              <span className="text-white font-semibold text-sm">LG VS MTK</span>
              <span className="text-white/70 text-xs block">Dashboard</span>
            </div>
          </div>
        </div>


        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {NAVIGATION_CONFIG.map((section) => (
            <div key={section.id} className="mb-3">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg transition-colors hover:bg-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center bg-brand-primary/10 text-brand-primary">
                  
                    <section.icon size={14} />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-sm text-gray-800 block">
                      {section.label}
                    </span>
                    <span className="text-[10px] text-gray-500 leading-tight line-clamp-2">
                      {section.labelKo}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    'text-gray-400 transition-transform flex-shrink-0',
                    expandedSections.has(section.id) && 'rotate-180'
                  )}
                />
              </button>

              {/* Section items */}
              {expandedSections.has(section.id) && (
                <div className="mt-1.5 ml-2 space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = isPathActive(item.href, pathname);
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          'flex flex-col py-2 px-3 rounded-lg transition-colors',
                          isActive
                            ? 'bg-brand-primary/10'
                            : 'hover:bg-gray-50'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full flex-shrink-0',
                              isActive ? 'bg-brand-primary' : 'bg-gray-300'
                            )}
                          />
                          <span className={cn(
                            'text-sm',
                            isActive ? 'text-brand-primary font-medium' : 'text-gray-600'
                          )}>
                            {item.label}
                          </span>
                        </div>
                        <span className={cn(
                          'text-[10px] ml-3.5 mt-0.5',
                          isActive ? 'text-brand-primary/70' : 'text-gray-400'
                        )}>
                          {item.labelKo}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 flex-shrink-0">
          <div className="text-[10px] text-gray-500 text-center">
            {DECISION_FLOW.flow}
          </div>
        </div>
      </aside>
    </>
  );
}
