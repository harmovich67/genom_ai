import React from 'react';
import { useUIStore } from '../../store/uiStore';
import {
  LayoutDashboard,
  Dna,
  Terminal,
  Bot,
  Menu,
  FolderGit2,
  Bug,
  Lightbulb,
  Trophy,
  User,
  Settings,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileNavigation() {
  const { activePage, setPage, lang, isMobileNavOpen, setMobileNavOpen } = useUIStore();
  const ar = lang === 'ar';

  // Always-visible tabs
  const mainTabs = [
    { id: 'home', label: ar ? 'الرئيسية' : 'Home', icon: LayoutDashboard },
    { id: 'library', label: ar ? 'المكتبة' : 'Library', icon: Dna },
    { id: 'workbench', label: ar ? 'المختبر' : 'Workbench', icon: Terminal },
    { id: 'ai', label: ar ? 'المرشد' : 'AI Mentor', icon: Bot }
  ];

  // Pages that don't fit in the bottom bar live in the "More" sheet
  const moreItems = [
    { id: 'projects', label: ar ? 'المشاريع' : 'Projects', icon: FolderGit2, tone: 'text-purple-600 dark:text-purple-400 bg-purple-500/15' },
    { id: 'debug', label: ar ? 'مختبر التصحيح' : 'Debug Lab', icon: Bug, tone: 'text-rose-600 dark:text-rose-400 bg-rose-500/15' },
    { id: 'ideas', label: ar ? 'معمل الأفكار' : 'Idea Forge', icon: Lightbulb, tone: 'text-amber-600 dark:text-amber-400 bg-amber-500/15' },
    { id: 'challenges', label: ar ? 'التحديات' : 'Challenges', icon: Trophy, tone: 'text-purple-600 dark:text-purple-400 bg-purple-500/15' },
    { id: 'profile', label: ar ? 'ملفي' : 'Profile', icon: User, tone: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/15' },
    { id: 'settings', label: ar ? 'الإعدادات' : 'Settings', icon: Settings, tone: 'text-slate-600 dark:text-slate-300 bg-slate-500/15' }
  ];

  const isMoreActive = moreItems.some((item) => item.id === activePage);

  const go = (id) => {
    setPage(id);
    setMobileNavOpen(false);
  };

  const tabClass = (isActive) =>
    `flex flex-col items-center justify-center py-1 px-2 min-w-[3.5rem] rounded-xl transition-all cursor-pointer ${
      isActive
        ? 'text-emerald-600 dark:text-emerald-400 font-bold'
        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
    }`;

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#090D17] border-t border-slate-200 dark:border-white/[0.08] px-2 pt-2 flex items-center justify-around safe-area-bottom shadow-2xl">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;
          return (
            <button key={tab.id} onClick={() => go(tab.id)} className={tabClass(isActive)}>
              <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-emerald-500/15' : 'bg-transparent'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setMobileNavOpen(!isMobileNavOpen)}
          aria-expanded={isMobileNavOpen}
          className={tabClass(isMoreActive || isMobileNavOpen)}
        >
          <div className={`p-1.5 rounded-lg transition-colors ${isMoreActive || isMobileNavOpen ? 'bg-emerald-500/15' : 'bg-transparent'}`}>
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium mt-0.5">{ar ? 'المزيد' : 'More'}</span>
        </button>
      </nav>

      {/* "More" bottom sheet */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex items-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="relative w-full rounded-t-3xl bg-white dark:bg-[#0D121F] border-t border-slate-200 dark:border-white/[0.12] shadow-2xl p-4 safe-area-bottom"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                  {ar ? 'كل الأقسام' : 'All sections'}
                </p>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  aria-label={ar ? 'إغلاق' : 'Close'}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => go(item.id)}
                      className={`flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl border text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span className={`p-2 rounded-xl ${item.tone}`}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-center leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
