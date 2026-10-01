import React, { useState } from 'react';
import { useDebugStore } from '../../store/debugStore';
import { useGenomeStore } from '../../store/genomeStore';
import { useUIStore } from '../../store/uiStore';
import {
  Bug,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Search,
  Plus,
  Copy,
  Terminal,
  ArrowRight,
  Code2,
  ChevronDown,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DebugLabPage() {
  const {
    bugs,
    activeBug,
    setActiveBug,
    activeAnalysis,
    isAnalyzing,
    errorInput,
    setErrorInput,
    codeInput,
    setCodeInput,
    envInput,
    setEnvInput,
    stackTraceInput,
    setStackTraceInput,
    runDebugAnalysis,
    saveBugCase
  } = useDebugStore();

  const { openModal, addToast } = useUIStore();
  const { genomes, setSelectedGenome, checkGenomeMatch } = useGenomeStore();

  const [activeTab, setActiveTab] = useState('cases'); // 'cases' | 'analyze'
  const [selectedCase, setSelectedCase] = useState(bugs[0] || null);

  const handleStartAnalysis = async (e) => {
    e.preventDefault();
    if (!errorInput.trim() && !codeInput.trim()) {
      addToast({ title: 'أدخل الخطأ أو الكود', message: 'يرجى تقديم تفاصيل الخطأ ليتمكن الذكاء الاصطناعي من تحليله.', type: 'error' });
      return;
    }

    // Check Signature Genome Match before/during analysis!
    checkGenomeMatch(errorInput + ' ' + codeInput);

    const result = await runDebugAnalysis();
    if (result) {
      addToast({
        title: 'اكتمل التحليل الذكي للخطأ!',
        message: `مستوى الثقة: ${result.confidence}`,
        type: 'success'
      });
    }
  };

  const handleSaveAnalysisAsCase = async () => {
    if (!activeAnalysis) return;

    const newBug = {
      title: activeAnalysis.likelyCause?.slice(0, 60) || 'خطأ برمجي تم تحليله',
      problem: errorInput || 'تم رصد هذا الخطأ في النظام',
      error: errorInput,
      environment: envInput,
      whatHappened: errorInput,
      whatTried: 'تحليل الخطأ بواسطة محرك جينوم الذكي',
      rootCause: activeAnalysis.whyItHappened || activeAnalysis.likelyCause,
      solution: activeAnalysis.fix,
      finalCode: activeAnalysis.correctedCode,
      prevention: activeAnalysis.howToPrevent,
      confidence: activeAnalysis.confidence || 'Likely',
      relatedGenomes: []
    };

    await saveBugCase(newBug);
    setSelectedCase(newBug);
    setActiveTab('cases');
    addToast({ title: 'تم حفظ الخطأ في سجل المشاكل المحلولة!', message: 'أصبح مرجعاً وقائياً لك ولمشاريعك.', type: 'success' });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">
              مختبر التصحيح الهندسي (Debug Lab)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تحليل استثناءات الأكواد، تحديد الجذر الفعلي للخلل، وتوثيق الحلول الوقائية الدائمة
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08]">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'cases' ? 'bg-rose-600 text-white shadow-glow-rose' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            سجل المشاكل الموثقة ({bugs.length})
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'analyze' ? 'bg-purple-600 text-white shadow-glow-purple' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>محلل الأخطاء بالـ AI</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SAVED BUG CASES */}
      {activeTab === 'cases' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bug Cases List */}
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold px-1 mb-2">
              الحالات المحلولة والوقائية:
            </p>
            {bugs.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedCase(b)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedCase?.id === b.id
                    ? 'bg-rose-500/10 border-rose-500/40 shadow-tactile'
                    : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/20">
                    {b.confidence || 'Known'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{b.environment}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{b.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">{b.problem}</p>
              </div>
            ))}
          </div>

          {/* Selected Bug Deep Dive */}
          {selectedCase ? (
            <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/[0.08] space-y-5">
              <div className="border-b border-slate-200 dark:border-white/[0.08] pb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 font-bold border border-rose-500/30">
                    حالة موثقة: {selectedCase.confidence}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{selectedCase.environment}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{selectedCase.title}</h2>
              </div>

              {/* Error Snippet Box */}
              {selectedCase.error && (
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-semibold block">رسالة الخطأ الأصلية (Raw Error):</span>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-rose-500/20 text-rose-300 font-mono text-xs overflow-x-auto dir-ltr text-left">
                    <code>{selectedCase.error}</code>
                  </pre>
                </div>
              )}

              {/* Root Cause & What Happened */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-1.5">
                  <span className="font-semibold text-amber-600 dark:text-amber-400 block font-mono">ما حدث ولماذا فشل (What Happened):</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedCase.whatHappened || selectedCase.problem}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-1.5">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 block font-mono">السبب الجذري الحقيقي (Root Cause):</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedCase.rootCause}</p>
                </div>
              </div>

              {/* Solution & Final Tested Code */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 block font-mono">طريقة الحل البرمجي (The Solution):</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedCase.solution}</p>

                {selectedCase.finalCode && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.1] bg-[#050811] mt-2">
                    <div className="px-4 py-2 bg-slate-800 dark:bg-white/[0.04] border-b border-slate-700 dark:border-white/[0.08] text-[11px] font-mono text-emerald-400 font-semibold">
                      الكود النهائي المختبر (Final Corrected Code)
                    </div>
                    <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto dir-ltr text-left">
                      <code>{selectedCase.finalCode}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Prevention Rule */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-transparent border border-emerald-500/30 text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1 font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  قاعدة الوقاية الدائمة لمنع التكرار (Prevention Principle):
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedCase.prevention}</p>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 p-12 text-center glass-panel rounded-3xl">
              <p className="text-slate-400">اختر حالة من القائمة لاستعراض تفاصيلها.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI DEBUG ANALYZER */}
      {activeTab === 'analyze' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <form onSubmit={handleStartAnalysis} className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/[0.08] space-y-4 text-xs">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>محلل الأخطاء التنبؤي بواسطة Gemini 3.5 Flash-Lite</span>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">رسالة الخطأ أو الاستثناء (Error Message / Exception) *</label>
              <textarea
                rows={3}
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
                placeholder="TypeError: Cannot read properties of undefined (reading '...')"
                className="w-full p-3 rounded-xl bg-rose-50/50 dark:bg-black/50 border border-rose-200 dark:border-white/[0.1] text-xs font-mono text-rose-700 dark:text-rose-300 placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-rose-500 dir-ltr text-left"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">الكود المسبب للخطأ (Faulty Code Snippet)</label>
              <textarea
                rows={5}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="// الصق جزء الكود المسبب للخلل..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/[0.1] text-xs font-mono text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-purple-500 dir-ltr text-left"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-medium">البيئة (Environment)</label>
                <input
                  type="text"
                  value={envInput}
                  onChange={(e) => setEnvInput(e.target.value)}
                  placeholder="React 18 / Node.js 20 / MySQL 8"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-medium">تتبع الخطأ (Stack Trace - اختياري)</label>
                <input
                  type="text"
                  value={stackTraceInput}
                  onChange={(e) => setStackTraceInput(e.target.value)}
                  placeholder="at Object.handler (/src/server.js:42)"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white font-mono dir-ltr text-left"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:to-rose-500 text-white font-semibold text-xs shadow-glow-purple disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'جاري تحليل الأسباب ودرجة الثقة...' : 'بدء التحليل الهندسي الفوري'}</span>
            </button>
          </form>

          {/* Analysis Results Display */}
          <div className="space-y-4">
            {activeAnalysis ? (
              <div className="p-6 rounded-3xl glass-panel border border-purple-500/30 space-y-4 text-xs">
                {/* Confidence Badge Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block font-semibold">مستوى ثقة الذكاء الاصطناعي:</span>
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                        activeAnalysis.confidence === 'Known'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : activeAnalysis.confidence === 'Likely'
                          ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {activeAnalysis.confidence} (محدد هندسياً)
                    </span>
                  </div>

                  <button
                    onClick={handleSaveAnalysisAsCase}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>حفظ في سجل الحالات</span>
                  </button>
                </div>

                {/* Likely Cause */}
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <h4 className="font-bold text-rose-700 dark:text-rose-300 text-xs mb-1">السبب المرجح (Likely Cause):</h4>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{activeAnalysis.likelyCause}</p>
                </div>

                {/* Suggested Checks */}
                {activeAnalysis.suggestedChecks && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-1.5">
                    <h4 className="font-bold text-slate-900 dark:text-slate-200 text-xs">فحوصات مقترحة قبل التعديل:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {activeAnalysis.suggestedChecks.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* The Fix */}
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">الحل المقترح وتصحيح الكود:</h4>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{activeAnalysis.fix}</p>
                  {activeAnalysis.correctedCode && (
                    <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto dir-ltr text-left">
                      <code>{activeAnalysis.correctedCode}</code>
                    </pre>
                  )}
                </div>

                {/* How to Prevent */}
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <h4 className="font-bold text-purple-700 dark:text-purple-300 text-xs mb-1">كيف تمنع تكرار هذا الخلل مستقبلاً:</h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{activeAnalysis.howToPrevent}</p>
                </div>
              </div>
            ) : (
              <div className="h-full p-12 text-center glass-panel border border-slate-200 dark:border-white/[0.08] rounded-3xl flex flex-col items-center justify-center text-slate-400 space-y-3">
                <Bug className="w-12 h-12 text-slate-400 dark:text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">بانتظار تفاصيل الخطأ للتحليل</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                  الصق رسالة الخطأ وشفرة الكود على اليمين، وسيقوم الذكاء الاصطناعي بتشريح المشكلة واستخراج شفرة الحل والوقاية.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
