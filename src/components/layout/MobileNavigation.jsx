import React from 'react';
import { useUIStore } from '../../store/uiStore';
import {
  LayoutDashboard,
  Dna,
  Terminal,
  Bot,
  User
} from 'lucide-react';

export default function MobileNavigation() {
  const { activePage, setPage, lang } = useUIStore();

  const mobileTabs = [
    { id: 'home', label: lang === 'ar' ? 'الرئيسية' : 'Home', icon: LayoutDashboard },
    { id: 'library', label: lang === 'ar' ? 'المكتبة' : 'Library', icon: Dna },
    { id: 'workbench', label: lang === 'ar' ? 'المختبر' : 'Workbench', icon: Terminal },
    { id: 'ai', label: lang === 'ar' ? 'المرشد' : 'AI Mentor', icon: Bot },
    { id: 'profile', label: lang === 'ar' ? 'ملفي' : 'Profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090D17]/95 backdrop-blur-2xl border-t border-slate-200 dark:border-white/[0.08] px-2 py-2 flex items-center justify-around safe-area-bottom shadow-2xl">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setPage(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1.5 rounded-lg transition-colors ${
                isActive ? 'bg-emerald-500/15' : 'bg-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
