import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useGenomeStore } from '../../store/genomeStore';
import { useWorkbenchStore } from '../../store/workbenchStore';
import {
  X,
  Copy,
  Check,
  Terminal,
  Bot,
  Star,
  ExternalLink,
  ShieldAlert,
  Zap,
  Clock,
  Layers,
  Sparkles,
  GitBranch,
  Tag,
  AlertTriangle,
  FolderGit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GenomeDetailModal() {
  const { activeModal, modalData, closeModal, setPage, addToast } = useUIStore();
  const { toggleFavorite, updateGenome } = useGenomeStore();
  const { loadSnippetIntoWorkbench } = useWorkbenchStore();

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'dna' | 'context' | 'security'

  if (activeModal !== 'genomeDetail' || !modalData) return null;
  const genome = modalData;

  const handleCopy = () => {
    navigator.clipboard.writeText(genome.code);
    setCopied(true);
    addToast({ title: 'تم نسخ الكود!', message: 'الكود متاح الآن في الحافظة.', type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInWorkbench = () => {
    loadSnippetIntoWorkbench(genome);
    closeModal();
    setPage('workbench');
    addToast({
      title: 'تم فتح الكود في المختبر!',
      message: 'يمكنك تجربة وتعديل الكود وحفظ نسخة جديدة.',
      type: 'info'
    });
  };

  const handleAskAI = () => {
    closeModal();
    setPage('ai');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-4xl bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-200 dark:border-white/[0.12] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  {genome.technology}
                </span>
                {genome.framework && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-100 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                    {genome.framework}
                  </span>
                )}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                    genome.status === 'Production Ready'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20'
                      : genome.status === 'Experimental'
                      ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/20'
                      : 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/20'
                  }`}
                >
                  {genome.status}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400">
                  صعوبة: {genome.difficulty}
                </span>
                {genome.confidence && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-100 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> دقة DNA: {genome.confidence}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{genome.title}</h2>
              {genome.englishTitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{genome.englishTitle}</p>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(genome.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  genome.isFavorite
                    ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/40'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/[0.08]'
                }`}
                title="إضافة للمفضلة"
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="flex items-center gap-2 px-5 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-black/20 text-xs font-medium">
            <button
              onClick={() => setActiveTab('code')}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              الكود والحل العملي
            </button>
            <button
              onClick={() => setActiveTab('dna')}
              className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dna'
                  ? 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              جينوم المعرفة (DNA Analysis)
            </button>
            <button
              onClick={() => setActiveTab('context')}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'context'
                  ? 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              متى يستخدم وتفاصيل السياق
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'security'
                  ? 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              الأداء والأمان
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {activeTab === 'code' && (
              <div className="space-y-4">
                {/* Description & Problem/Solution Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                    <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider block mb-1">
                      المشكلة (The Problem)
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{genome.problem || genome.description}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                      الحل المطبق (The Solution)
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{genome.solution || genome.aiExplanation}</p>
                  </div>
                </div>

                {/* Code Block with Copy and Workbench Actions */}
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#050811]">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                    <span className="text-emerald-400 font-semibold">{genome.language || 'javascript'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 transition-all text-xs cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
                      </button>
                      <button
                        onClick={handleOpenInWorkbench}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all text-xs font-medium cursor-pointer"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>فتح في المختبر</span>
                      </button>
                    </div>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed dir-ltr text-left">
                    <code>{genome.code}</code>
                  </pre>
                </div>

                {/* Example Usage if available */}
                {genome.exampleUsage && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 block">مثال على طريقة الاستخدام:</span>
                    <pre className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto dir-ltr text-left">
                      <code>{genome.exampleUsage}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'dna' && (
              <div className="space-y-4 text-xs">
                {/* AI Explanation Banner */}
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-gradient-to-r dark:from-purple-500/10 dark:via-cyan-500/10 dark:to-transparent border border-purple-200 dark:border-purple-500/30">
                  <div className="flex items-center gap-2 text-purple-800 dark:text-purple-400 font-semibold mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>تحليل جينوم الذكاء الاصطناعي (AI-Generated DNA)</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                    {genome.aiExplanation || 'قام محرك جينوم الكود بتحليل هذا المكون واستخلاص معايير الإدخال والإخراج ومخاطر الـ Closures.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Inputs & Outputs */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      المدخلات والمخرجات (I/O DNA)
                    </h4>
                    <p><strong className="text-slate-600 dark:text-slate-400 font-mono">المدخلات:</strong> <span className="text-slate-800 dark:text-slate-200">{genome.inputs || 'value, delay'}</span></p>
                    <p><strong className="text-slate-600 dark:text-slate-400 font-mono">المخرجات:</strong> <span className="text-slate-800 dark:text-slate-200">{genome.outputs || 'debouncedValue'}</span></p>
                    <p><strong className="text-slate-600 dark:text-slate-400 font-mono">التعقيد:</strong> <span className="text-slate-800 dark:text-slate-200">{genome.complexity || 'O(1) Time'}</span></p>
                  </div>

                  {/* Related Concepts */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      المفاهيم المرتبطة (Knowledge Graph Nodes)
                    </h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {genome.relatedConcepts?.map((c, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/20 text-[11px] font-mono">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Test Cases */}
                {genome.testCases && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">حالات الاختبار المقترحة (Suggested Tests):</h4>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line font-mono text-[11px] leading-relaxed">
                      {genome.testCases}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'context' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20">
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                      ✓ متى تستخدم هذا النمط (When to use)
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {genome.whenToUse || 'استخدمه في كافة حقول البحث التفاعلية، النماذج المباشرة، وتأخير استدعاءات API الثقيلة.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20">
                    <h4 className="font-semibold text-rose-800 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                      ✕ متى لا تستخدم هذا النمط (When NOT to use)
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {genome.whenNotToUse || 'لا تستخدمه إذا كانت الاستجابة الفورية لكل ضغطة مفتاح ضرورية (مثل اختصارات لوحة المفاتيح الأحادية).'}
                    </p>
                  </div>
                </div>

                {/* Compatibility & Notes */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-2">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">التوافق والملاحظات الشخصية:</h4>
                  <p><strong className="text-slate-600 dark:text-slate-400">التوافق:</strong> <span className="text-slate-800 dark:text-slate-200">{genome.compatibility || 'جميع المتصفحات الحديثة'}</span></p>
                  {genome.personalNotes && (
                    <p><strong className="text-slate-600 dark:text-slate-400">ملاحظاتي:</strong> <span className="text-slate-800 dark:text-slate-200">{genome.personalNotes}</span></p>
                  )}
                  {genome.lastReviewed && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">آخر مراجعة هندسية: {genome.lastReviewed}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-2">
                  <h4 className="font-semibold text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> اعتبارات الأداء (Performance Profile)
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {genome.performance || 'استهلاك ذاكرة منخفض جداً، يمنع إرهاق السيرفر بالطلبات المتكررة.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-2">
                  <h4 className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> اعتبارات الأمان والخصوصية (Security & Privacy)
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {genome.security || 'لا توجد مخاطر أمنية مباشرة، ينصح بدمجه مع مدخلات معقمة دائماً.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-black/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenInWorkbench}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-glow-emerald transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                <span>فتح وتعديل في المختبر</span>
              </button>
              <button
                onClick={handleAskAI}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 dark:bg-purple-600/30 dark:hover:bg-purple-600/50 dark:text-purple-200 dark:border-purple-500/40 text-xs transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>اسأل Genome AI عن هذا الكود</span>
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-800 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-slate-300 text-xs transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>نسخ الشفرة</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
