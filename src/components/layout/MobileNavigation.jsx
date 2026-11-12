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
  Moon,
  Sun,
  Lock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileNavigation() {
  const { activePage, setPage, lang, isMobileNavOpen, setMobileNavOpen, theme, toggleTheme, logout } = useUIStore();
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
    { id: 'ideas', label: ar ? 'معمل الأفكار' : 'Idea Forge', icon: Lightbulb, tone: 'text-amber-700 dark:text-amber-400 bg-amber-500/15' },
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
    `relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-2xl transition-all cursor-pointer active:scale-95 ${
      isActive
        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold'
        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
    }`;

  return (
    <>
      <nav className="md:hidden fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 rounded-[1.75rem] bg-white/90 dark:bg-[#0D121F]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/[0.1] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.35)] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.9)] p-1.5 flex items-stretch gap-1">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;
          return (
            <button key={tab.id} onClick={() => go(tab.id)} className={tabClass(isActive)}>
              <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.4 : 2} />
              <span className="text-[10.5px] font-medium leading-none">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setMobileNavOpen(!isMobileNavOpen)}
          aria-expanded={isMobileNavOpen}
          className={tabClass(isMoreActive || isMobileNavOpen)}
        >
          <Menu className="w-[22px] h-[22px]" strokeWidth={isMoreActive || isMobileNavOpen ? 2.4 : 2} />
          <span className="text-[10.5px] font-medium leading-none">{ar ? 'المزيد' : 'More'}</span>
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
              className="relative w-full rounded-t-[2rem] bg-white dark:bg-[#0D121F] border-t border-slate-200 dark:border-white/[0.12] shadow-2xl px-5 pt-3 pb-6 safe-area-bottom"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300 dark:bg-white/20" />
              <div className="flex items-center justify-between mb-4 px-1">
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

              <div className="grid grid-cols-3 gap-3">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => go(item.id)}
                      className={`flex flex-col items-center gap-2.5 py-4 px-2 rounded-2xl border text-xs font-medium transition-colors cursor-pointer active:scale-95 ${
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

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.08] grid grid-cols-2 gap-3">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-cyan-700" />}
                  <span>{theme === 'dark' ? (ar ? 'المظهر الفاتح' : 'Light mode') : (ar ? 'المظهر الداكن' : 'Dark mode')}</span>
                </button>
                <button
                  onClick={() => {
                    setMobileNavOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
                >
                  <Lock className="w-4 h-4" />
                  <span>{ar ? 'قفل الداشبورد' : 'Lock'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
