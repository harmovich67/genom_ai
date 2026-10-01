import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { useGenomeStore } from '../../store/genomeStore';
import { useProjectStore } from '../../store/projectStore';
import { useDebugStore } from '../../store/debugStore';
import { useIdeaStore } from '../../store/ideaStore';
import { useChallengeStore } from '../../store/challengeStore';
import {
  LayoutDashboard,
  Dna,
  Terminal,
  FolderGit2,
  Bug,
  Lightbulb,
  Trophy,
  Bot,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { activePage, setPage, lang, dir } = useUIStore();
  const genomesCount = useGenomeStore((s) => s.genomes.length);
  const projectsCount = useProjectStore((s) => s.projects.length);
  const bugsCount = useDebugStore((s) => s.bugs.length);
  const ideasCount = useIdeaStore((s) => s.ideas.length);
  const challengesCount = useChallengeStore((s) => s.challenges.length);

  const navItems = [
    {
      id: 'home',
      label: lang === 'ar' ? 'الرئيسية' : 'Home',
      icon: LayoutDashboard,
      badge: null,
      glow: 'emerald'
    },
    {
      id: 'library',
      label: lang === 'ar' ? 'مكتبة الجينوم' : 'Genome Library',
      icon: Dna,
      badge: genomesCount,
      glow: 'emerald'
    },
    {
      id: 'workbench',
      label: lang === 'ar' ? 'مختبر الأكواد' : 'Workbench',
      icon: Terminal,
      badge: 'Live',
      glow: 'cyan'
    },
    {
      id: 'projects',
      label: lang === 'ar' ? 'المشاريع' : 'Projects',
      icon: FolderGit2,
      badge: projectsCount,
      glow: 'purple'
    },
    {
      id: 'debug',
      label: lang === 'ar' ? 'مختبر التصحيح' : 'Debug Lab',
      icon: Bug,
      badge: bugsCount,
      glow: 'rose'
    },
    {
      id: 'ideas',
      label: lang === 'ar' ? 'معمل الأفكار' : 'Idea Forge',
      icon: Lightbulb,
      badge: ideasCount,
      glow: 'amber'
    },
    {
      id: 'challenges',
      label: lang === 'ar' ? 'التحديات والذاكرة' : 'Challenges',
      icon: Trophy,
      badge: challengesCount,
      glow: 'purple'
    },
    {
      id: 'ai',
      label: lang === 'ar' ? 'المرشد الذكي' : 'Genome AI',
      icon: Bot,
      badge: '9 Modes',
      glow: 'cyan'
    }
  ];

  const secondaryItems = [
    {
      id: 'profile',
      label: lang === 'ar' ? 'الملف والمهارات' : 'Profile & Stack',
      icon: User
    },
    {
      id: 'settings',
      label: lang === 'ar' ? 'الإعدادات والبيانات' : 'Settings',
      icon: Settings
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 bg-white/90 dark:bg-[#090D17]/80 backdrop-blur-xl border-l border-slate-200 dark:border-white/[0.08] p-3 justify-between z-20 shrink-0 select-none transition-colors">
      {/* Primary Navigation */}
      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 mb-2 font-semibold">
            {lang === 'ar' ? 'نظام التشغيل المعرفي' : 'Knowledge System'}
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-tactile font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 mb-2 font-semibold">
            {lang === 'ar' ? 'التفضيلات' : 'Preferences'}
          </p>
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Status Card */}
      <div className="pt-3 border-t border-slate-200 dark:border-white/[0.08]">
        <button
          onClick={() => setPage('profile')}
          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.06] transition-all flex items-center justify-between text-right group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-glow-emerald">
              ح
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                حسام المحمود
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Senior Architect</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
        </button>
      </div>
    </aside>
  );
}
