import React, { useState, useEffect, useRef } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useGenomeStore } from '../../store/genomeStore';
import { useProjectStore } from '../../store/projectStore';
import { useDebugStore } from '../../store/debugStore';
import { useIdeaStore } from '../../store/ideaStore';
import { useChallengeStore } from '../../store/challengeStore';
import { searchKnowledgeBase } from '../../services/search/fuzzySearch';
import {
  Search,
  Dna,
  Terminal,
  FolderGit2,
  Bug,
  Lightbulb,
  Trophy,
  Bot,
  Plus,
  Moon,
  Sun,
  X,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setPage,
    openModal,
    toggleTheme,
    theme,
    lang
  } = useUIStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const genomes = useGenomeStore((s) => s.genomes);
  const setSelectedGenome = useGenomeStore((s) => s.setSelectedGenome);
  const projects = useProjectStore((s) => s.projects);
  const bugs = useDebugStore((s) => s.bugs);
  const ideas = useIdeaStore((s) => s.ideas);
  const challenges = useChallengeStore((s) => s.challenges);

  // Global key listener for Ctrl/Cmd + K and Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  // Search results
  const searchResults = query.trim()
    ? searchKnowledgeBase({ query, genomes, projects, bugs, ideas, challenges })
    : null;

  // Static commands list
  const systemCommands = [
    {
      id: 'cmd-new-genome',
      title: lang === 'ar' ? 'إضافة جينوم برمجي جديد' : 'New Code Genome',
      category: 'إنشاء',
      icon: Plus,
      action: () => openModal('newGenome')
    },
    {
      id: 'cmd-open-workbench',
      title: lang === 'ar' ? 'فتح مختبر الأكواد (Workbench)' : 'Open Workbench',
      category: 'تنقل',
      icon: Terminal,
      action: () => setPage('workbench')
    },
    {
      id: 'cmd-open-ai',
      title: lang === 'ar' ? 'استشارة المرشد الذكي (Genome AI)' : 'Open AI Mentor',
      category: 'ذكاء اصطناعي',
      icon: Bot,
      action: () => setPage('ai')
    },
    {
      id: 'cmd-open-debug',
      title: lang === 'ar' ? 'مختبر التصحيح وتحليل الأخطاء' : 'Debug Lab & Analysis',
      category: 'تصحيح',
      icon: Bug,
      action: () => setPage('debug')
    },
    {
      id: 'cmd-open-ideas',
      title: lang === 'ar' ? 'معمل الأفكار (Idea Forge)' : 'Idea Forge',
      category: 'أفكار',
      icon: Lightbulb,
      action: () => setPage('ideas')
    },
    {
      id: 'cmd-open-challenges',
      title: lang === 'ar' ? 'بدء تحدي واختبار فهم الكود' : 'Start Code Challenge',
      category: 'تعلم',
      icon: Trophy,
      action: () => setPage('challenges')
    },
    {
      id: 'cmd-toggle-theme',
      title: lang === 'ar' ? `تبديل المظهر إلى ${theme === 'dark' ? 'الفاتح' : 'الداكن'}` : 'Toggle Theme',
      category: 'إعدادات',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => toggleTheme()
    }
  ];

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-200 dark:border-white/[0.12] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-white/[0.08]">
            <Search className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'اكتب أمراً أو ابحث في الجينوم، المشاريع، الأخطاء...'
                  : 'Type a command or search knowledge base...'
              }
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block text-[10px] font-mono bg-slate-100 dark:bg-white/[0.08] px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08]">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {/* If searching, show categorized matches */}
            {searchResults ? (
              searchResults.totalCount === 0 ? (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <Dna className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm">لم يتم العثور على نتائج تطابق "{query}"</p>
                  <p className="text-xs text-slate-400 mt-1">جرّب البحث بكلمة مختلفة مثل: React, Salla, JWT, Hook</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Matched Genomes */}
                  {searchResults.genomes.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold px-2 mb-1">
                        مكتبة الجينوم ({searchResults.genomes.length})
                      </p>
                      {searchResults.genomes.map((g) => (
                        <button
                          key={`g-${g.id}`}
                          onClick={() => {
                            setSelectedGenome(g);
                            openModal('genomeDetail', g);
                            setCommandPaletteOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-500/10 dark:hover:border-emerald-500/20 border border-transparent text-right transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                              <Dna className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
                                {g.title}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md">
                                {g.technology} • {g.type} • {g.difficulty}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Matched Projects */}
                  {searchResults.projects.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-semibold px-2 mb-1">
                        المشاريع ({searchResults.projects.length})
                      </p>
                      {searchResults.projects.map((p) => (
                        <button
                          key={`p-${p.id}`}
                          onClick={() => {
                            setPage('projects');
                            setCommandPaletteOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-500/10 border border-transparent text-right transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400">
                              <FolderGit2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-300">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md">
                                {p.stack?.join(', ')} • إنجاز {p.progress}%
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Matched Bugs */}
                  {searchResults.bugs.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-semibold px-2 mb-1">
                        مختبر التصحيح ({searchResults.bugs.length})
                      </p>
                      {searchResults.bugs.map((b) => (
                        <button
                          key={`b-${b.id}`}
                          onClick={() => {
                            setPage('debug');
                            setCommandPaletteOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50 hover:border-rose-200 dark:hover:bg-rose-500/10 border border-transparent text-right transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400">
                              <Bug className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-300">
                                {b.title}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md">
                                {b.environment} • {b.confidence}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            ) : (
              // Default Commands list
              <div>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold px-2 mb-1 uppercase tracking-wider">
                  {lang === 'ar' ? 'إجراءات سريعة وتوجيه' : 'Quick Actions'}
                </p>
                <div className="space-y-0.5">
                  {systemCommands.map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          setCommandPaletteOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] text-right transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/20 transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
                            {cmd.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400">
                          {cmd.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation Hints */}
          <div className="p-3 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-black/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span>↑↓ للتنقل</span>
              <span>↵ للاختيار</span>
            </div>
            <span>CODE GENOME v2.0</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
