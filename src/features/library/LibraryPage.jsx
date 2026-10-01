import React, { useState, useMemo } from 'react';
import { useGenomeStore } from '../../store/genomeStore';
import { useUIStore } from '../../store/uiStore';
import { useWorkbenchStore } from '../../store/workbenchStore';
import {
  LayoutGrid,
  List,
  GitGraph,
  Search,
  Filter,
  Plus,
  Star,
  Copy,
  Check,
  Terminal,
  Bot,
  Sparkles,
  ArrowRight,
  Code2,
  FolderPlus,
  ShieldCheck,
  AlertTriangle,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import KnowledgeGraph from './KnowledgeGraph';

export default function LibraryPage() {
  const {
    genomes,
    searchQuery,
    setSearchQuery,
    selectedTech,
    setSelectedTech,
    selectedStatus,
    setSelectedStatus,
    selectedDifficulty,
    setSelectedDifficulty,
    viewMode,
    setViewMode,
    onlyFavorites,
    toggleOnlyFavorites,
    setSelectedGenome,
    toggleFavorite
  } = useGenomeStore();

  const { openModal, setPage, addToast, lang } = useUIStore();
  const { loadSnippetIntoWorkbench } = useWorkbenchStore();

  const [copiedId, setCopiedId] = useState(null);

  // Available technologies from genomes
  const technologies = ['all', 'React', 'Next.js', 'Node.js', 'Salla', 'WordPress', 'Redis', 'MySQL'];
  const statuses = ['all', 'Production Ready', 'Useful', 'Experimental'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  // Filtered genomes
  const filteredGenomes = useMemo(() => {
    return genomes.filter((item) => {
      if (onlyFavorites && !item.isFavorite) return false;
      if (selectedTech !== 'all' && item.technology !== selectedTech) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      if (selectedDifficulty !== 'all' && item.difficulty !== selectedDifficulty) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = item.title?.toLowerCase().includes(q);
        const inDesc = item.description?.toLowerCase().includes(q);
        const inTech = item.technology?.toLowerCase().includes(q);
        const inTags = Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inTech && !inTags) return false;
      }

      return true;
    });
  }, [genomes, searchQuery, selectedTech, selectedStatus, selectedDifficulty, onlyFavorites]);

  const handleCopyCode = (e, item) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.code);
    setCopiedId(item.id);
    addToast({ title: 'تم نسخ الكود!', message: item.title, type: 'success' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenWorkbench = (e, item) => {
    e.stopPropagation();
    loadSnippetIntoWorkbench(item);
    setPage('workbench');
    addToast({ title: 'تم فتح الكود في المختبر', message: 'يمكنك تعديله وتشغيله فورياً.', type: 'info' });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Search Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">
              مكتبة جينوم الكود (Knowledge Library)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              {filteredGenomes.length} جينوم
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مستودع المعرفة البرمجية المصنفة هندسياً مع استخلاص معايير الاستخدام والـ DNA
          </p>
        </div>

        {/* View Switchers & New Button */}
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08]">
            <button
              onClick={() => setViewMode('grid')}
              title="عرض الشبكة (Grid)"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="عرض القائمة المدمجة (Compact List)"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('graph')}
              title="خريطة المعرفة الشبكية (Knowledge Graph)"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'graph' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GitGraph className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => openModal('projectImport')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] text-xs font-medium transition-all"
            title="استيراد كود أو مشروع"
          >
            <Upload className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">استيراد كود / مشروع</span>
          </button>

          <button
            onClick={() => openModal('newGenome')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة حل جديد</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl glass-panel space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Field */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، التقنية، المشكلة، أو الوسوم..."
              className="w-full pr-9 pl-4 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] focus:border-emerald-500/50 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={toggleOnlyFavorites}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                onlyFavorites
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40 font-semibold'
                  : 'bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
              <span>المفضلة فقط</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pl-2 shrink-0">التقنيات:</span>
          {technologies.map((tech) => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap transition-all ${
                selectedTech === tech
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08]'
              }`}
            >
              {tech === 'all' ? 'الكل' : tech}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW MODES */}

      {/* 1. GRID VIEW */}
      {viewMode === 'grid' && (
        filteredGenomes.length === 0 ? (
          <EmptyLibraryState onAdd={() => openModal('newGenome')} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGenomes.map((genome) => (
              <div
                key={genome.id}
                onClick={() => {
                  setSelectedGenome(genome);
                  openModal('genomeDetail', genome);
                }}
                className="p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-[#0D121F] dark:to-[#12192B] border border-slate-200 dark:border-white/[0.08] hover:border-emerald-500/40 shadow-tactile hover:shadow-tactile-hover transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Card Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {genome.technology}
                      </span>
                      {genome.framework && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                          {genome.framework}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(genome.id);
                      }}
                      className={`p-1 rounded-lg transition-colors ${
                        genome.isFavorite ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${genome.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {genome.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {genome.description}
                  </p>

                  {/* Tags */}
                  {genome.tags && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {genome.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Quick Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {genome.difficulty}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                      {genome.status === 'Production Ready' ? 'جاهز للإنتاج' : genome.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopyCode(e, genome)}
                      title="نسخ الكود"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.1] text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {copiedId === genome.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleOpenWorkbench(e, genome)}
                      title="فتح في المختبر"
                      className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 transition-colors"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* 2. COMPACT LIST VIEW */}
      {viewMode === 'list' && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden glass-panel divide-y divide-slate-100 dark:divide-white/[0.06]">
          {filteredGenomes.map((genome) => (
            <div
              key={genome.id}
              onClick={() => {
                setSelectedGenome(genome);
                openModal('genomeDetail', genome);
              }}
              className="p-3.5 hover:bg-slate-50/80 dark:hover:bg-white/[0.04] flex items-center justify-between gap-4 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  {genome.technology?.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {genome.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 shrink-0">
                      {genome.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xl">
                    {genome.problem || genome.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 hidden sm:inline font-medium">
                  {genome.status}
                </span>
                <button
                  onClick={(e) => handleCopyCode(e, genome)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.1] text-slate-600 dark:text-slate-300"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. INTERACTIVE REACT FLOW KNOWLEDGE GRAPH VIEW */}
      {viewMode === 'graph' && <KnowledgeGraph />}
    </div>
  );
}

function EmptyLibraryState({ onAdd }) {
  return (
    <div className="py-16 text-center rounded-3xl glass-panel border border-slate-200 dark:border-white/[0.08] p-8 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-glow-emerald">
        <Code2 className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">مكتبتك المعرفية فارغة</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        ابدأ بحفظ أول حل أو مكون برمجي، وسيقوم نظام جينوم الكود بتحليله تلقائياً وبناء شبكة المعرفة الخاصة بك.
      </p>
      <button
        onClick={onAdd}
        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald transition-all inline-flex items-center gap-2 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة أول جينوم برمجي</span>
      </button>
    </div>
  );
}
