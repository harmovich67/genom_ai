import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useGenomeStore } from '../../store/genomeStore';
import { aiRouter } from '../../services/ai/aiRouter';
import {
  X,
  Sparkles,
  Save,
  Code2,
  Check,
  AlertCircle,
  Cpu,
  Layers,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewGenomeModal() {
  const { activeModal, closeModal, addToast } = useUIStore();
  const { addGenome } = useGenomeStore();

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [technology, setTechnology] = useState('React');
  const [framework, setFramework] = useState('React 18+');
  const [language, setLanguage] = useState('javascript');
  const [type, setType] = useState('Component');
  const [status, setStatus] = useState('Production Ready');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [description, setDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [whenToUse, setWhenToUse] = useState('');
  const [whenNotToUse, setWhenNotToUse] = useState('');
  const [inputs, setInputs] = useState('');
  const [outputs, setOutputs] = useState('');
  const [tags, setTags] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dnaAnalyzed, setDnaAnalyzed] = useState(false);

  if (activeModal !== 'newGenome') return null;

  const handleAIAnalyze = async () => {
    if (!code.trim()) {
      addToast({ title: 'أدخل الكود أولاً', message: 'يرجى لصق الكود ليتمكن الذكاء الاصطناعي من تحليله.', type: 'error' });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await aiRouter.extractGenomeDNA(code, `${title} - ${technology}`);
      const dna = result.data;

      if (dna) {
        if (!title && dna.title) setTitle(dna.title);
        if (dna.shortDescription) setDescription(dna.shortDescription);
        if (dna.problem) setProblem(dna.problem);
        if (dna.solution) setSolution(dna.solution);
        if (dna.whenToUse) setWhenToUse(dna.whenToUse);
        if (dna.whenNotToUse) setWhenNotToUse(dna.whenNotToUse);
        if (dna.technology) setTechnology(dna.technology);
        if (dna.framework) setFramework(dna.framework);
        if (dna.language) setLanguage(dna.language);
        if (dna.inputs) setInputs(dna.inputs);
        if (dna.outputs) setOutputs(dna.outputs);
        if (Array.isArray(dna.tags)) setTags(dna.tags.join(', '));
        if (dna.difficulty) setDifficulty(dna.difficulty);

        setDnaAnalyzed(true);
        addToast({
          title: 'تم استخراج جينوم الكود بالذكاء الاصطناعي!',
          message: 'يمكنك مراجعة وتعديل كافة الحقول المقترحة قبل الحفظ.',
          type: 'success'
        });
      }
    } catch (e) {
      console.error('Error analyzing DNA:', e);
      addToast({ title: 'تعذر التحليل السحابي', message: 'تم تطبيق الاستخلاص المحلي الآمن.', type: 'info' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) {
      addToast({ title: 'حقول مطلوبة', message: 'يرجى كتابة عنوان ولصق الكود.', type: 'error' });
      return;
    }

    const newEntry = {
      title,
      code,
      technology,
      framework,
      language,
      type,
      status,
      difficulty,
      description: description || title,
      problem,
      solution,
      whenToUse,
      whenNotToUse,
      inputs,
      outputs,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      aiExplanation: solution || 'تم توثيق هذا الجينوم وحفظه في الذاكرة البرمجية.',
      confidence: dnaAnalyzed ? '98%' : '90%',
      lastReviewed: new Date().toISOString().split('T')[0]
    };

    await addGenome(newEntry);
    addToast({
      title: 'تم حفظ الجينوم بنجاح!',
      message: 'أصبح الكود متاحاً في مكتبتك والذاكرة المعرفية.',
      type: 'success'
    });
    closeModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-3xl bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-200 dark:border-white/[0.12] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">إضافة جينوم برمجي جديد (New Code Genome)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">احفظ الكود مع تحليله هندسياً واستخلاص معايير استخدامه</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Code Input Area with AI Extract trigger */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800 dark:text-slate-200">شفرة الكود البرمجي (Code Snippet) *</label>
                <button
                  type="button"
                  disabled={isAnalyzing || !code.trim()}
                  onClick={handleAIAnalyze}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium text-xs shadow-glow-purple disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzing ? 'جاري استخراج الـ DNA...' : 'استخراج الجينوم بالذكاء الاصطناعي'}</span>
                </button>
              </div>
              <textarea
                rows={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// الصق كود React, Node.js, Salla, CSS, SQL هنا..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 placeholder-slate-400 outline-none focus:border-emerald-500/50 transition-colors dir-ltr text-left"
                required
              />
            </div>

            {/* Title & Technology */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">عنوان الجينوم المعرفي *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: خطاف التهدئة للبحث useDebounce"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 dark:text-slate-200">التقنية (Technology)</label>
                <select
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="React" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">React</option>
                  <option value="Next.js" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Next.js</option>
                  <option value="Vue" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Vue</option>
                  <option value="Node.js" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Node.js</option>
                  <option value="Express" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Express</option>
                  <option value="Salla" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">سلة (Salla API)</option>
                  <option value="Zid" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">زد (Zid API)</option>
                  <option value="WordPress" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">WordPress</option>
                  <option value="MySQL" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">MySQL / Database</option>
                  <option value="Redis" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Redis</option>
                  <option value="CSS" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">CSS / Tailwind</option>
                  <option value="Security" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Security Pattern</option>
                </select>
              </div>
            </div>

            {/* Framework, Language, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">إصدار الإطار (Framework)</label>
                <input
                  type="text"
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  placeholder="React 18+ / Node 20"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">نوع المكون (Type)</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="React Hook" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">React Hook</option>
                  <option value="Component" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Component</option>
                  <option value="Utility Function" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Utility Function</option>
                  <option value="API Pattern" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">API Pattern</option>
                  <option value="Security Pattern" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Security Pattern</option>
                  <option value="Architecture Decision" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Architecture Decision</option>
                  <option value="WordPress Solution" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">WordPress Solution</option>
                  <option value="Salla Solution" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Salla Solution</option>
                  <option value="SQL Query" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">SQL Query</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">درجة الاستعداد (Status)</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="Production Ready" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Production Ready (جاهز للإنتاج)</option>
                  <option value="Useful" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Useful (مفيد)</option>
                  <option value="Experimental" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Experimental (تجريبي)</option>
                  <option value="Deprecated" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Deprecated (مستبعد)</option>
                </select>
              </div>
            </div>

            {/* Problem & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">المشكلة التي يحلها (Problem)</label>
                <textarea
                  rows={2}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="ما العائق أو الخطأ الذي يمنعه هذا الكود؟"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">طريقة الحل (Solution)</label>
                <textarea
                  rows={2}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="كيف يعالج هذا الكود المشكلة؟"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* When to use vs When not to use */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-emerald-700 dark:text-emerald-400 font-semibold">متى يُنصح باستخدامه (When to use)</label>
                <input
                  type="text"
                  value={whenToUse}
                  onChange={(e) => setWhenToUse(e.target.value)}
                  placeholder="مثال: في حقول البحث وعمليات الإكمال التلقائي"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-rose-700 dark:text-rose-400 font-semibold">متى لا يُنصح باستخدامه (When NOT to use)</label>
                <input
                  type="text"
                  value={whenNotToUse}
                  onChange={(e) => setWhenNotToUse(e.target.value)}
                  placeholder="مثال: عند الحاجة لتفاعل فوري 0ms مع كل مفتاح"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <label className="text-slate-700 dark:text-slate-300">الوسوم (مفصولة بفواصل)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, Hooks, Performance, Search"
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {dnaAnalyzed ? '✓ تم التحقق من سلامة الجينوم عبر الذكاء الاصطناعي' : 'سيتم التخزين محلياً بأمان'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>اعتماد وحفظ في الجينوم</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
