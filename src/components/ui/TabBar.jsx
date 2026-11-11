import React, { useEffect, useRef } from 'react';

// Static class maps so Tailwind's JIT can see every class name.
const ACCENTS = {
  emerald: {
    active:
      'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  },
  purple: {
    active:
      'border-purple-600 text-purple-700 dark:border-purple-400 dark:text-purple-300',
    badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
  },
};

/**
 * Horizontally scrollable underline tab bar.
 * - never wraps labels onto several lines (scrolls instead, so it works on phones)
 * - keeps the active tab in view
 * - one consistent colour per bar in both light and dark mode (icons inherit it)
 *
 * tabs: [{ id, label, icon?: LucideIcon, badge?: number | string }]
 */
export default function TabBar({ tabs, active, onChange, accent = 'emerald', className = '' }) {
  const listRef = useRef(null);
  const colors = ACCENTS[accent] || ACCENTS.emerald;

  useEffect(() => {
    const el = listRef.current?.querySelector('[aria-selected="true"]');
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [active]);

  return (
    <div
      ref={listRef}
      role="tablist"
      className={`flex items-stretch gap-1 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-white/[0.08] text-xs font-medium ${className}`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 min-h-[44px] sm:min-h-0 py-2.5 sm:py-3 px-3.5 border-b-2 transition-colors cursor-pointer ${
              isActive
                ? `${colors.active} font-semibold`
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span>{tab.label}</span>
            {tab.badge != null && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
                  isActive
                    ? colors.badge
                    : 'bg-slate-200 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
