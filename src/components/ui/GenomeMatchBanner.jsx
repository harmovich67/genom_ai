import React from 'react';
import { useGenomeStore } from '../../store/genomeStore';
import { useUIStore } from '../../store/uiStore';
import { Dna, ArrowRight, X, Sparkles, FolderGit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GenomeMatchBanner() {
  const { activeMatch, clearActiveMatch, setSelectedGenome } = useGenomeStore();
  const { openModal } = useUIStore();

  if (!activeMatch || !activeMatch.genome) return null;
  const { genome, matchPercentage, whyItMatches } = activeMatch;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        className="w-full mb-6 p-4 rounded-2xl bg-emerald-50/80 dark:bg-gradient-to-r dark:from-emerald-500/15 dark:via-purple-500/10 dark:to-cyan-500/15 border border-emerald-200 dark:border-emerald-500/30 shadow-tactile relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/25 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center shrink-0 shadow-sm dark:shadow-glow-emerald">
              <Dna className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  GENOME MATCH
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                  {matchPercentage}% تطابق مع معرفتك السابقة
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                "{genome.title}"
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-xl">
                {whyItMatches}
              </p>

              {genome.relatedProjects && genome.relatedProjects.length > 0 && (
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <FolderGit2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    استخدمته سابقاً في:
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {genome.relatedProjects.join('، ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => {
                setSelectedGenome(genome);
                openModal('genomeDetail', genome);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald transition-all"
            >
              <span>معاينة واستخدام الحل</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={clearActiveMatch}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
