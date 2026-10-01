import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { useGenomeStore } from '../../store/genomeStore';
import {
  Search,
  Plus,
  Moon,
  Sun,
  Globe,
  Database,
  Sparkles,
  Command,
  Layers,
  Menu,
  Lock
} from 'lucide-react';
import NotificationsPopover from '../ui/NotificationsPopover';

export default function Header() {
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    setCommandPaletteOpen,
    openModal,
    setPage,
    aiAccessEnabled,
    logout
  } = useUIStore();

  const genomesCount = useGenomeStore((s) => s.genomes.length);

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white/85 dark:bg-[#07090E]/85 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.08] px-3 sm:px-6 flex items-center justify-between transition-all">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => setPage('home')}
          className="flex items-center gap-2 group text-right focus:outline-none"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 via-purple-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center shadow-glow-emerald group-hover:scale-105 transition-transform shrink-0">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 dark:text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
              <path d="M4.5 16.5c1.5-1 4-1 6 0s4 1 6 0" />
              <circle cx="12" cy="8" r="2" fill="#8B5CF6" />
              <circle cx="17" cy="14" r="2" fill="#06B6D4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors whitespace-nowrap">
                {lang === 'ar' ? 'جينوم الكود' : 'CODE GENOME'}
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans hidden sm:block">
              {lang === 'ar' ? 'نظام المعرفة البرمجية الثاني' : 'Developer Second Brain'}
            </p>
          </div>
        </button>
      </div>

      {/* Center Search / Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] hover:border-emerald-500/40 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs transition-all shadow-inner group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors" />
            <span>
              {lang === 'ar'
                ? 'ابحث في الجينوم، المشاريع، الأخطاء...'
                : 'Search genomes, projects, bugs...'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono bg-slate-200 dark:bg-white/[0.06] border border-slate-300 dark:border-white/[0.08] px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Status Indicators */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
            <Database className="w-3.5 h-3.5" />
            <span>محلي (IndexedDB)</span>
          </div>
          {aiAccessEnabled && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI متصل</span>
            </div>
          )}
        </div>

        {/* Add New Genome Button */}
        <button
          onClick={() => openModal('newGenome')}
          title={lang === 'ar' ? 'إضافة جينوم جديد' : 'New Genome'}
          className="w-8 h-8 sm:w-auto sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium text-xs shadow-glow-emerald transition-all hover:scale-105 active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline ms-1.5">
            {lang === 'ar' ? 'إضافة جينوم' : 'New Genome'}
          </span>
        </button>

        {/* Notifications Popover */}
        <NotificationsPopover />

        {/* Language Switch */}
        <button
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          className="!hidden w-8 h-8 sm:w-auto sm:px-2.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all text-[11px] sm:text-xs font-semibold flex items-center justify-center shrink-0 cursor-pointer"
        >
          {lang === 'ar' ? 'EN' : 'عربي'}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="تبديل المظهر"
          className="w-8 h-8 sm:w-auto sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center shrink-0 cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
        </button>

        {/* Lock Dashboard Button */}
        <button
          onClick={logout}
          title={lang === 'ar' ? 'قفل الداشبورد' : 'Lock Dashboard'}
          className="w-8 h-8 sm:w-auto sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] hover:border-rose-400 dark:hover:border-rose-500/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-all flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Lock className="w-4 h-4" />
        </button>

        {/* Mobile Search button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          title={lang === 'ar' ? 'البحث السريع' : 'Search'}
          className="md:hidden w-8 h-8 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
