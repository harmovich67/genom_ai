import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useChallengeStore } from '../../store/challengeStore';
import { useGenomeStore } from '../../store/genomeStore';
import { useUIStore } from '../../store/uiStore';
import {
  Trophy,
  Brain,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Calendar,
  AlertCircle,
  Flame,
  ArrowRight,
  Code2,
  RefreshCw,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChallengesPage() {
  const {
    challenges,
    learningMemory,
    activeChallengeIndex,
    setActiveChallengeIndex,
    userAnswers,
    submitAnswer,
    reviewMemoryItem,
    buildFromMemoryMode,
    buildFromMemoryTarget,
    buildCodeAttempt,
    setBuildCodeAttempt,
    evaluateBuildFromMemory,
    buildComparisonResult,
    closeBuildFromMemory,
    generateAIChallenge,
    startBuildFromMemory
  } = useChallengeStore();

  const genomes = useGenomeStore((s) => s.genomes);
  const { addToast } = useUIStore();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' | 'memory' | 'build'
  const [isGeneratingChallenge, setIsGeneratingChallenge] = useState(false);
  const [aiCategory, setAiCategory] = useState('React');

  const currentChallenge = challenges[activeChallengeIndex] || challenges[0];
  const currentAnswer = currentChallenge ? userAnswers[currentChallenge.id] : null;

  const handleSelectOption = (idx) => {
    if (currentAnswer) return; // already answered
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = async () => {
    if (selectedOption === null || !currentChallenge) return;
    const isCorrect = await submitAnswer(currentChallenge.id, selectedOption);
    setShowExplanation(true);
    if (isCorrect) {
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
      addToast({ title: 'إجابة صحيحة وممتازة! 🎉', message: '+25 نقطة جينوم', type: 'success' });
    } else {
      addToast({
        title: 'تم تسجيل الملاحظة في ذاكرة التعلم',
        message: 'ستتم جدولة هذا المفهوم للمراجعة المتباعدة بعد 3 أيام.',
        type: 'info'
      });
    }
  };

  const handleNextChallenge = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (activeChallengeIndex < challenges.length - 1) {
      setActiveChallengeIndex(activeChallengeIndex + 1);
    } else {
      setActiveChallengeIndex(0);
    }
  };

  const handleGenerateAI = async () => {
    setIsGeneratingChallenge(true);
    try {
      const newChallenge = await generateAIChallenge(aiCategory);
      setActiveTab('quiz');
      setSelectedOption(null);
      setShowExplanation(false);
      addToast({
        title: 'تم توليد تحدي جديد بالذكاء الاصطناعي ✨',
        message: `تحدي: ${newChallenge.title}`,
        type: 'success'
      });
    } catch (e) {
      addToast({ title: 'تعذر التوليد', message: 'يرجى المحاولة لاحقاً', type: 'error' });
    } finally {
      setIsGeneratingChallenge(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">
              التحديات البرمجية وذاكرة التعلم (Learning Memory)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              اختبر فهمك البرمجي، وحوّل كل خطأ إلى مبدأ محفوظ في ذاكرتك الدائمة بنظام التكرار المتباعد
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Generator Button */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30">
            <select
              value={aiCategory}
              onChange={(e) => setAiCategory(e.target.value)}
              className="bg-transparent text-[11px] font-mono text-purple-900 dark:text-purple-200 outline-none px-2 py-1 cursor-pointer"
            >
              <option value="React" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">React</option>
              <option value="JavaScript" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">JavaScript</option>
              <option value="Node.js" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Node.js</option>
              <option value="Vue" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Vue</option>
              <option value="Security" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Security</option>
            </select>
            <button
              onClick={handleGenerateAI}
              disabled={isGeneratingChallenge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-purple disabled:opacity-50 transition-all cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingChallenge ? 'animate-spin' : ''}`} />
              <span>{isGeneratingChallenge ? 'جارِ التوليد...' : 'توليد بالـ AI'}</span>
            </button>
          </div>

          {/* View Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08]">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'quiz' ? 'bg-purple-600 text-white shadow-glow-purple' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              التحديات ({challenges.length})
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'memory' ? 'bg-emerald-600 text-white shadow-glow-emerald' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>ذاكرة الأخطاء ({learningMemory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('build')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'build' ? 'bg-cyan-600 text-white shadow-glow-cyan' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>البناء من الذاكرة</span>
            </button>
          </div>
        </div>
      </div>

      {/* SIGNATURE 3: BUILD FROM MEMORY MODAL / OVERLAY */}
      {buildFromMemoryMode && buildFromMemoryTarget && (
        <div className="p-6 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#0D121F] dark:to-[#12192B] border-2 border-purple-500/50 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-3">
            <div>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 uppercase font-bold tracking-wider">
                SIGNATURE EXPERIENCE: BUILD FROM MEMORY
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                تحدي الاستدعاء النشط: "{buildFromMemoryTarget.title}"
              </h3>
            </div>
            <button
              onClick={closeBuildFromMemory}
              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer"
            >
              إلغاء التحدي
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            اكتب الحل المطلوب بالاعتماد على ذاكرتك الهندسية دون فتح الكود المحفوظ. سيقوم الذكاء الاصطناعي بمقارنة بنيتك البرمجية وتنبيهك لأي خلل في دالة التنظيف أو إدارة الـ State:
          </p>

          <textarea
            rows={8}
            value={buildCodeAttempt}
            onChange={(e) => setBuildCodeAttempt(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-900 dark:bg-black/60 border border-slate-700 dark:border-white/[0.1] text-xs font-mono text-emerald-400 placeholder-slate-500 outline-none focus:border-purple-500 dir-ltr text-left"
          />

          {!buildComparisonResult ? (
            <div className="flex justify-end">
              <button
                onClick={evaluateBuildFromMemory}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-semibold text-xs shadow-glow-purple transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>تقييم الكود ومقارنته بالحل المحفوظ</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/50 border border-purple-200 dark:border-purple-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  النتيجة: {buildComparisonResult.status} ({buildComparisonResult.score}% تطابق نوعي)
                </span>
                <span className="px-2.5 py-0.5 rounded-full font-mono bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  تم التقييم
                </span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{buildComparisonResult.feedback}</p>

              {/* Checklist */}
              <div className="space-y-1.5 pt-1">
                {buildComparisonResult.checks?.map((chk, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    {chk.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    )}
                    <span className={chk.passed ? 'text-slate-800 dark:text-slate-200' : 'text-amber-800 dark:text-amber-300'}>
                      {chk.name} {chk.tip && `(${chk.tip})`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={closeBuildFromMemory}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
                >
                  إنهاء التحدي وحفظ التقدم
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: QUIZ RUNNER */}
      {activeTab === 'quiz' && currentChallenge && !buildFromMemoryMode && (
        <div className="p-6 rounded-3xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile space-y-6">
          {/* Challenge Meta */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                {currentChallenge.category}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400">
                {currentChallenge.type}
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                الصعوبة: {currentChallenge.difficulty}
              </span>
            </div>

            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              تحدي {activeChallengeIndex + 1} من {challenges.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {currentChallenge.question}
            </h3>

            {/* Code Snippet if applicable */}
            {currentChallenge.codeSnippet && (
              <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto dir-ltr text-left">
                <code>{currentChallenge.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {currentChallenge.options?.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const hasAnswered = currentAnswer !== null;
              const isCorrectOpt = currentChallenge.correctIndex === idx;

              let optionStyle = 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05]';
              if (isSelected && !hasAnswered) {
                optionStyle = 'bg-purple-50 dark:bg-purple-500/20 border-purple-400 dark:border-purple-500/50 text-purple-950 dark:text-purple-200 shadow-glow-purple';
              }
              if (hasAnswered) {
                if (isCorrectOpt) {
                  optionStyle = 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-950 dark:text-emerald-200';
                } else if (isSelected && !isCorrectOpt) {
                  optionStyle = 'bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-950 dark:text-rose-200';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium cursor-pointer transition-all ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200/70 dark:bg-black/40 border border-slate-300 dark:border-white/[0.1] text-slate-700 dark:text-slate-200 flex items-center justify-center font-mono text-[11px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {hasAnswered && (
                    <span>
                      {isCorrectOpt ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      ) : null}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation Box */}
          {(showExplanation || currentAnswer) && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs space-y-1.5 animate-fadeIn">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                تفسير المفهوم البرمجي (Explanation):
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentChallenge.explanation}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/[0.08]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              كل خطأ يتم تسجيله تلقائياً في ذاكرة التعلم لمراجعته لاحقاً
            </span>

            <div className="flex items-center gap-2">
              {!currentAnswer ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={selectedOption === null}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-glow-purple disabled:opacity-40 transition-all cursor-pointer"
                >
                  تأكيد الإجابة
                </button>
              ) : (
                <button
                  onClick={handleNextChallenge}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald transition-all cursor-pointer"
                >
                  <span>التحدي التالي</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEARNING MEMORY & SPACED REPETITION */}
      {activeTab === 'memory' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
            🧠 <strong>نظام التكرار المتباعد (Spaced Repetition):</strong> هنا تسجل الأخطاء التي ارتكبتها أثناء حل التحديات أو تصحيح الأكواد. يقوم النظام بمضاعفة فترة المراجعة مع كل استذكار ناجح لتثبيت المفهوم في الذاكرة الدائمة.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningMemory.map((mem) => (
              <div
                key={mem.id}
                className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300">
                      موعد المراجعة: {mem.nextReviewDate}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      مراجعات سابقة: {mem.reviewCount || 0}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{mem.topic}</h4>

                  <div className="mt-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-[11px] text-rose-900 dark:text-rose-200">
                    <strong>الخطأ السابق:</strong> {mem.mistake}
                  </div>

                  <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[11px] text-emerald-900 dark:text-emerald-200">
                    <strong>المبدأ الصحيح:</strong> {mem.correctPrinciple}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    كل {mem.reviewIntervalDays} أيام
                  </span>
                  <button
                    onClick={() => {
                      reviewMemoryItem(mem.id);
                      addToast({
                        title: 'تم تأكيد استذكار المفهوم!',
                        message: `تمت جدولة المراجعة القادمة بعد ${mem.reviewIntervalDays * 2} أيام.`,
                        type: 'success'
                      });
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-glow-emerald cursor-pointer"
                  >
                    تذكرته بنجاح ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SIGNATURE FEATURE: BUILD FROM MEMORY */}
      {activeTab === 'build' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-cyan-50/70 dark:bg-gradient-to-r dark:from-cyan-500/15 dark:via-purple-500/10 dark:to-emerald-500/10 border border-cyan-200 dark:border-cyan-500/30 text-xs text-slate-700 dark:text-slate-200 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400 font-bold uppercase tracking-wider">
                SIGNATURE FEATURE: BUILD FROM MEMORY
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">البناء البرمجي بالاستدعاء النشط (Active Recall)</h3>
              <p className="text-slate-600 dark:text-slate-300">
                يقوم الذكاء الاصطناعي بتحديد حلول ومفاهيم قمت بحفظها سابقاً، ويطلب منك كتابتها دون فتح الحل المحفوظ. ثم يُقارن كودك بالنسخة المحفوظة ويكتشف النواقص (دوال التنظيف، حالات الحافة، الأداء).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {genomes.map((g) => (
              <div
                key={g.id}
                className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/40 shadow-tactile transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-100 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
                      {g.technology}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {g.difficulty || 'Intermediate'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{g.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {g.problem || g.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {g.language}
                  </span>
                  <button
                    onClick={() => {
                      startBuildFromMemory(g);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-glow-cyan transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>ابدأ البناء من الذاكرة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
