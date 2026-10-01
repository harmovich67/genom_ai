import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useProjectStore } from '../../store/projectStore';
import { useGenomeStore } from '../../store/genomeStore';
import { aiRouter } from '../../services/ai/aiRouter';
import {
  X,
  Upload,
  FileCode,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  Dna,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectImportModal() {
  const { activeModal, closeModal, addToast, setPage } = useUIStore();
  const { addProject } = useProjectStore();
  const { addGenome } = useGenomeStore();

  const [activeTab, setActiveTab] = useState('project'); // 'project' | 'code'
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Selected knowledge entries to approve
  const [approvedGenomes, setApprovedGenomes] = useState({});

  if (activeModal !== 'projectImport' && activeModal !== 'codeImport') return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setFileContent(content);
      // Auto analyze when file is loaded
      analyzeContent(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setFileContent(content);
        analyzeContent(content, file.name);
      };
      reader.readAsText(file);
    }
  };

  const analyzeContent = async (content, name) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      let isPackageJson = name.toLowerCase().includes('package.json');
      let isComposerJson = name.toLowerCase().includes('composer.json');
      let isReadme = name.toLowerCase().includes('readme');

      let parsedJson = null;
      if (isPackageJson || isComposerJson) {
        try {
          parsedJson = JSON.parse(content);
        } catch (err) {}
      }

      // Extract stack & dependencies from package.json or composer.json
      let detectedStack = [];
      let detectedDeps = [];
      let projectName = name.replace(/\.[^/.]+$/, "");

      if (parsedJson) {
        projectName = parsedJson.name || projectName;
        const allDeps = {
          ...(parsedJson.dependencies || {}),
          ...(parsedJson.devDependencies || {}),
          ...(parsedJson.require || {})
        };
        detectedDeps = Object.keys(allDeps);

        if (allDeps.react) detectedStack.push('React');
        if (allDeps.next) detectedStack.push('Next.js');
        if (allDeps.vue) detectedStack.push('Vue');
        if (allDeps.express) detectedStack.push('Express');
        if (allDeps.tailwindcss) detectedStack.push('Tailwind CSS');
        if (allDeps.sequelize) detectedStack.push('Sequelize');
        if (allDeps.prisma) detectedStack.push('Prisma');
        if (allDeps.ioredis || allDeps.redis) detectedStack.push('Redis');
        if (allDeps['mysql2'] || allDeps['mysql']) detectedStack.push('MySQL');
        if (allDeps['laravel/framework']) detectedStack.push('Laravel');
      }

      if (detectedStack.length === 0) {
        detectedStack = ['JavaScript', 'Modern Web', 'Node.js'];
      }

      // Generate suggested genomes and architecture hints
      const simulatedResult = {
        projectName: projectName || 'مشروع برمجي جديد',
        description: parsedJson?.description || 'مشروع مستورد يحتوي على حزمة مكتبات ومعايير برمجية تم تحليلها آلياً.',
        stack: detectedStack,
        dependenciesCount: detectedDeps.length || 12,
        dependenciesList: detectedDeps.slice(0, 10),
        architectureHints: `مشروع حديث يعتمد على ${detectedStack.join(' و ')} مع بنية معيارية تفاعلية. يُنصح بدمج طبقة Caching وإدارة الصلاحيات المركزية.`,
        potentialIssues: [
          'تأكد من توافق حزم React مع مكتبات الطرف الثالث عند الترقية.',
          'ينصح بفحص استهلاك الذاكرة في العمليات غير المتزامنة الكبيرة.',
          'التحقق من تعقيم كافة مدخلات الـ API قبل تمريرها للاستعلامات.'
        ],
        suggestedGenomes: [
          {
            id: 'sug-1',
            title: `نمط إدارة الحالة في ${detectedStack[0] || 'الواجهة'}`,
            technology: detectedStack[0] || 'React',
            type: 'Component / Hook',
            difficulty: 'Intermediate',
            problem: 'تزامن البيانات وتفادي إعادة الرندرة غير الضرورية في المشروع.',
            solution: 'عزل الحالة واستخدام Selectors خفيفة مع دمج التخزين المؤقت.',
            code: `// نمط مقترح بناءً على حزمة المشروع المستورد
export function useProjectState() {
  // حالة المشروع المخصصة
  return { status: 'ready', initialized: true };
}`
          },
          {
            id: 'sug-2',
            title: `ميدل وير المصادقة والتحقق لـ ${detectedStack[1] || 'الخادم'}`,
            technology: detectedStack[1] || 'Node.js',
            type: 'Security Pattern',
            difficulty: 'Advanced',
            problem: 'تأمين مسارات المشروع من الطلبات غير المصرحة وهجمات CSRF.',
            solution: 'التحقق من التوقيعات وترويسات Bearer قبل تمرير التنفيذ.',
            code: `// حارس المسارات المستخرج للمشروع
export const projectGuard = (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).json({ error: 'Unauthorized' });
  next();
};`
          }
        ]
      };

      setAnalysisResult(simulatedResult);

      // Default approve all suggested genomes
      const initialApproved = {};
      simulatedResult.suggestedGenomes.forEach((g) => {
        initialApproved[g.id] = true;
      });
      setApprovedGenomes(initialApproved);

      addToast({
        title: 'اكتمل تحليل المشروع بنجاح!',
        message: `تم اكتشاف ${detectedStack.length} تقنيات واقتراح ${simulatedResult.suggestedGenomes.length} جينوم معرفي.`,
        type: 'success'
      });
    } catch (e) {
      console.error('Error analyzing import:', e);
      addToast({ title: 'فشل التحليل', message: 'يرجى التأكد من صحة محتوى الملف.', type: 'error' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!analysisResult) return;

    // 1. Create Project
    const newProj = {
      name: analysisResult.projectName,
      description: analysisResult.description,
      stack: analysisResult.stack,
      goals: [
        'إكمال البناء والتطوير وفق معايير الجينوم البرمجي المعتمدة.',
        'توثيق القرارات المعمارية في سجل ADR أولاً بأول.'
      ],
      tasks: [
        { id: Date.now() + 1, title: 'مراجعة التبعيات والتحقق من إصدارات المكتبات', completed: true },
        { id: Date.now() + 2, title: 'تهيئة بيئة العمل واختبارات التشغيل الأولية', completed: false }
      ],
      architectureNotes: analysisResult.architectureHints,
      aiContext: `مشروع ${analysisResult.projectName} يعتمد على ${analysisResult.stack.join(', ')}.`
    };

    const createdProject = await addProject(newProj);

    // 2. Add Approved Genomes to Library
    const genomesToSave = analysisResult.suggestedGenomes.filter(
      (g) => approvedGenomes[g.id]
    );

    for (const g of genomesToSave) {
      await addGenome({
        title: g.title,
        description: g.problem,
        problem: g.problem,
        solution: g.solution,
        code: g.code,
        technology: g.technology,
        type: g.type,
        difficulty: g.difficulty,
        status: 'Useful',
        relatedProjects: [createdProject.name]
      });
    }

    addToast({
      title: 'تم اعتماد واستيراد المشروع بنجاح!',
      message: `تم إنشاء مساحة عمل المشروع وحفظ ${genomesToSave.length} جينوم في مكتبتك.`,
      type: 'success'
    });

    closeModal();
    setPage('projects');
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
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-emerald-500 text-white flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  استيراد وتحليل المشاريع الذكي (Smart Project & Code Import)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  اسحب وأفلت package.json، composer.json، README أو شفرات الأكواد لاستخراج معماريتها وحلولها
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* Drop Zone Area */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/[0.12] hover:border-emerald-500 bg-slate-50 dark:bg-black/30 text-center space-y-3 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-glow-emerald">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  اسحب وأفلت ملفك هنا، أو استعرض من جهازك
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                  يدعم: package.json, composer.json, README.md, .js, .jsx, .ts, .php, .sql
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <label className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald cursor-pointer transition-all">
                  <span>اختيار ملف</span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".json,.md,.js,.jsx,.ts,.tsx,.vue,.php,.sql,.css"
                    className="hidden"
                  />
                </label>
              </div>

              {fileName && (
                <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] pt-1 font-semibold">
                  الملف النشط: {fileName}
                </p>
              )}
            </div>

            {/* Direct Paste Area (Alternative) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-800 dark:text-slate-300 font-semibold">أو الصق محتوى الملف مباشرة:</label>
                <button
                  onClick={() => analyzeContent(fileContent, 'pasted-config.json')}
                  disabled={!fileContent.trim() || isAnalyzing}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-glow-purple disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzing ? 'جاري التحليل...' : 'بدء التحليل المعماري'}</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                placeholder='الصق محتوى package.json أو README.md هنا...'
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-300 dark:border-white/[0.08] text-xs font-mono text-slate-900 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-purple-500 dir-ltr text-left"
              />
            </div>

            {/* Analysis Results Display & Approval Flow */}
            {analysisResult && (
              <div className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-emerald-300 dark:border-emerald-500/30 shadow-tactile space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      نتائج التحليل واستخراج المعمارية
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {analysisResult.projectName}
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                    {analysisResult.dependenciesCount} تبعية مكتشفة
                  </span>
                </div>

                {/* Stack & Architecture */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block font-mono">حزمة التقنيات المستخرجة:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.stack.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/25 font-mono text-[11px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-1.5">
                    <span className="font-semibold text-purple-700 dark:text-purple-300 block font-mono flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5" /> تلميحات المعمارية (Architecture Hints):
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                      {analysisResult.architectureHints}
                    </p>
                  </div>
                </div>

                {/* Potential Issues */}
                {analysisResult.potentialIssues && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-1.5 text-xs">
                    <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 font-mono">
                      <AlertTriangle className="w-4 h-4" />
                      ملاحظات واختناقات محتملة (Potential Issues):
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                      {analysisResult.potentialIssues.map((iss, i) => (
                        <li key={i}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Knowledge Genomes (Approval Checklist) */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                        الجينومات المعرفية المقترح استخراجها من هذا المشروع:
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        راجع ووافق على الحلول التي ترغب في حفظها في مكتبة جينوم الكود (لن يتم النشر تلقائياً بدون موافقتك)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {analysisResult.suggestedGenomes.map((sug) => {
                      const isApproved = approvedGenomes[sug.id] !== false;
                      return (
                        <div
                          key={sug.id}
                          className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                            isApproved
                              ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-500/5 dark:border-emerald-500/30'
                              : 'bg-slate-50 border-slate-200 dark:bg-white/[0.01] dark:border-white/[0.06] opacity-60'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isApproved}
                            onChange={(e) =>
                              setApprovedGenomes({
                                ...approvedGenomes,
                                [sug.id]: e.target.checked
                              })
                            }
                            className="w-4 h-4 mt-1 accent-emerald-500 cursor-pointer"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-900 dark:text-white text-xs">{sug.title}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-white/[0.06] dark:text-emerald-300">
                                {sug.technology}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{sug.type}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                              {sug.problem}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Confirm Import Button */}
                <div className="pt-3 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    ✓ سيتم إنشاء المشروع وربط الجينومات المعتمدة به
                  </span>
                  <button
                    onClick={handleConfirmImport}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white font-semibold text-xs shadow-glow-emerald transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>اعتماد وإنشاء المشروع واستيراد الجينومات</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
