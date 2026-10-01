import React, { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { useGenomeStore } from '../../store/genomeStore';
import { useUIStore } from '../../store/uiStore';
import { aiRouter } from '../../services/ai/aiRouter';
import {
  FolderGit2,
  CheckCircle2,
  Circle,
  Plus,
  Bot,
  Layers,
  Sparkles,
  Send,
  Calendar,
  Shield,
  FileText,
  AlertCircle,
  ArrowRight,
  Target,
  Upload,
  Clock,
  Milestone
} from 'lucide-react';

export default function ProjectsPage() {
  const {
    projects,
    decisions,
    selectedProjectId,
    setSelectedProjectId,
    toggleTask,
    addProject,
    addDecision
  } = useProjectStore();

  const { openModal, addToast } = useUIStore();
  const genomes = useGenomeStore((s) => s.genomes);
  const setSelectedGenome = useGenomeStore((s) => s.setSelectedGenome);

  const [activeProjectTab, setActiveProjectTab] = useState('overview'); // 'overview' | 'tasks' | 'adr' | 'memoryChat'
  const [newDecisionTitle, setNewDecisionTitle] = useState('');
  const [newDecisionApproach, setNewDecisionApproach] = useState('');
  const [showNewDecisionModal, setShowNewDecisionModal] = useState(false);

  // Project Memory AI Chat state
  const [projectAiQuestion, setProjectAiQuestion] = useState('');
  const [projectAiChat, setProjectAiChat] = useState([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const projectDecisions = decisions.filter((d) => d.projectId === project?.id);

  // Handle Project Memory AI Query
  const handleAskProjectAI = async (e) => {
    e.preventDefault();
    if (!projectAiQuestion.trim() || !project) return;

    const question = projectAiQuestion;
    setProjectAiQuestion('');
    setProjectAiChat((prev) => [...prev, { role: 'user', content: question }]);
    setIsAiThinking(true);

    try {
      const response = await aiRouter.askProjectAssistant({
        projectContext: {
          name: project.name,
          stack: project.stack,
          architecture: project.architectureNotes,
          decisions: projectDecisions.map((d) => d.decision),
          aiContext: project.aiContext
        },
        userQuestion: question,
        chatHistory: projectAiChat
      });

      const reply = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      setProjectAiChat((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Project AI error:', err);
      setProjectAiChat((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'تعذر الاتصال بذاكرة المشروع حالياً، يمكنك مراجعة سجل القرارات المعمارية محلياً.'
        }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleCreateDecision = async (e) => {
    e.preventDefault();
    if (!newDecisionTitle.trim()) return;

    await addDecision({
      projectId: project.id,
      title: newDecisionTitle,
      decision: newDecisionTitle,
      context: `تم توثيق هذا القرار في مساحة عمل ${project.name}.`,
      chosenApproach: newDecisionApproach || 'النهج المعتمد بناءً على توصيات الفريق.',
      reason: 'تحسين الأداء وضمان استقرار النظام تحت الضغط.',
      aiReview: 'قرار مطابق لمعايير الأمان المعتمدة.'
    });

    setNewDecisionTitle('');
    setNewDecisionApproach('');
    setShowNewDecisionModal(false);
    addToast({ title: 'تم توثيق القرار الهندسي!', message: 'أضيف القرار إلى سجل الـ ADR.', type: 'success' });
  };

  if (!project) return null;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Project Selector & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">
              مساحات عمل المشاريع وذاكرة النظام (Project Memory)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              لكل مشروع سياق ذكاء اصطناعي مستقل، سجل قرارات معمارية (ADR)، ومكتبة حلول متصلة
            </p>
          </div>
        </div>

        {/* Project Actions & Selector */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('projectImport')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] text-xs font-medium transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>استيراد مشروع (package.json)</span>
            </button>
            <button
              onClick={() => openModal('newProject')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-purple transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>مشروع جديد</span>
            </button>
          </div>

          {/* Project Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedProjectId === p.id
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.06]'
                }`}
              >
                {p.name.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Project Main Card */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/[0.08] shadow-tactile space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                مشروع معتمد
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{project.timeline}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{project.name}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Progress Widget */}
          <div className="flex items-center gap-4 bg-slate-100 dark:bg-black/40 p-3.5 rounded-2xl border border-slate-200 dark:border-white/[0.06] shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">نسبة الإنجاز</span>
              <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {project.progress}%
              </span>
            </div>
            <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Project Stack Tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px] ml-2 font-semibold">حزمة التقنيات:</span>
          {project.stack?.map((tech, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] font-mono text-[11px]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Project Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pt-2 text-xs font-medium">
          <button
            onClick={() => setActiveProjectTab('overview')}
            className={`py-2.5 px-3 border-b-2 transition-all ${
              activeProjectTab === 'overview'
                ? 'border-purple-500 text-purple-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            نظرة عامة والمعمارية
          </button>
          <button
            onClick={() => setActiveProjectTab('tasks')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeProjectTab === 'tasks'
                ? 'border-purple-500 text-purple-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>المهام والأهداف</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.08]">
              {project.tasks?.length}
            </span>
          </button>
          <button
            onClick={() => setActiveProjectTab('adr')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeProjectTab === 'adr'
                ? 'border-purple-500 text-purple-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>سجل القرارات (ADR)</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300">
              {projectDecisions.length}
            </span>
          </button>
          <button
            onClick={() => setActiveProjectTab('timeline')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeProjectTab === 'timeline'
                ? 'border-purple-500 text-purple-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>الجدول الزمني والمراحل</span>
          </button>
          <button
            onClick={() => setActiveProjectTab('memoryChat')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeProjectTab === 'memoryChat'
                ? 'border-purple-500 text-purple-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>مستشار ذاكرة المشروع (AI Memory)</span>
          </button>
        </div>

        {/* Tab 1: Overview & Architecture */}
        {activeProjectTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  المعمارية المعتمدة (Architecture Notes)
                </h4>
                <p className="text-slate-300 leading-relaxed">{project.architectureNotes}</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                <h4 className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  سياق الذكاء الاصطناعي الخاص بالمشروع (AI Context)
                </h4>
                <p className="text-slate-300 leading-relaxed">{project.aiContext}</p>
              </div>
            </div>

            {/* Related Snippets from user library */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <h4 className="font-semibold text-slate-200">الجينومات والحلول المرتبطة بهذا المشروع:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {genomes.slice(0, 2).map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      setSelectedGenome(g);
                      openModal('genomeDetail', g);
                    }}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div>
                      <p className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        {g.title}
                      </p>
                      <span className="text-[10px] font-mono text-slate-500">{g.type}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tasks & Goals */}
        {activeProjectTab === 'tasks' && (
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-400" />
                أهداف المشروع (Project Goals)
              </h4>
              <div className="space-y-1.5">
                {project.goals?.map((g, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-slate-300">
                    • {g}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="font-semibold text-slate-200">المهام البرمجية والتنفيذية:</h4>
              <div className="space-y-2">
                {project.tasks?.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(project.id, task.id)}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {task.completed ? 'مكتملة' : 'قيد العمل'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Architecture Decision Records (ADR) */}
        {activeProjectTab === 'adr' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">سجل القرارات المعمارية (Decision Log / ADR)</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">توثيق القرارات الهندسية وأسباب اتخاذها وعواقبها كمرجع دائم</p>
              </div>
              <button
                onClick={() => setShowNewDecisionModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-all shadow-glow-purple cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>توثيق قرار جديد</span>
              </button>
            </div>

            {/* Decision Cards */}
            <div className="space-y-3">
              {projectDecisions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/[0.06]">
                  <p className="text-slate-500 dark:text-slate-400">لا توجد قرارات موثقة لهذا المشروع حتى الآن.</p>
                </div>
              ) : (
                projectDecisions.map((dec) => (
                  <div key={dec.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-purple-600 dark:text-purple-400 font-bold text-[11px]">
                        ADR-{dec.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{dec.date}</span>
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">{dec.title}</h5>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{dec.decision}</p>
                    {dec.chosenApproach && (
                      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-slate-400 text-[11px]">
                        <strong className="text-emerald-600 dark:text-emerald-400 font-mono">النهج المختار:</strong> {dec.chosenApproach}
                      </div>
                    )}
                    {dec.aiReview && (
                      <p className="text-[11px] text-purple-600 dark:text-purple-300 font-mono flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3" /> مراجعة الذكاء الاصطناعي: {dec.aiReview}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Quick Add Decision Inline Form */}
            {showNewDecisionModal && (
              <form onSubmit={handleCreateDecision} className="p-4 rounded-2xl bg-slate-50 dark:bg-black/60 border border-purple-500/30 space-y-3">
                <h5 className="font-bold text-slate-900 dark:text-white">إضافة قرار هندسي جديد (Record New ADR)</h5>
                <input
                  type="text"
                  value={newDecisionTitle}
                  onChange={(e) => setNewDecisionTitle(e.target.value)}
                  placeholder="عنوان القرار (مثال: استخدام Redis Lock لمنع الحجز المزدوج)"
                  className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  required
                />
                <textarea
                  rows={2}
                  value={newDecisionApproach}
                  onChange={(e) => setNewDecisionApproach(e.target.value)}
                  placeholder="النهج المختار وسبب التفضيل..."
                  className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewDecisionModal(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-white/[0.05] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs"
                  >
                    حفظ القرار
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 4: Project Timeline & Milestones */}
        {activeProjectTab === 'timeline' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h4 className="font-semibold text-white">الجدول الزمني ومراحل الإطلاق (Roadmap & Timeline)</h4>
                <p className="text-[11px] text-slate-400">تتبع محطات المشروع والتقدم الهندسي عبر دورة حياة البرمجية</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {project.timeline}
              </span>
            </div>

            <div className="relative pr-6 space-y-6 before:content-[''] before:absolute before:right-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-purple-500 before:to-slate-700">
              {/* Phase 1 */}
              <div className="relative group">
                <span className="absolute -right-6 top-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-slate-900 flex items-center justify-center text-[9px] text-black font-bold">
                  ✓
                </span>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-xs">المرحلة الأولى: التصميم المعماري وقواعد البيانات</h5>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">مكتملة 100%</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    بناء مخططات الجداول، إعداد فهارس Composite Indexes، وتوثيق سجل الـ ADR الأول.
                  </p>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative group">
                <span className="absolute -right-6 top-1 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-slate-900 animate-pulse" />
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-purple-200 text-xs">المرحلة الثانية: بناء منطق العمليات والقفل الموزع</h5>
                    <span className="text-[10px] font-mono text-purple-300 font-semibold">قيد التنفيذ ({project.progress}%)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    ربط خدمات Redis لمنع التكرار ومعالجة الطلبات المتزامنة، وتطبيق حراس المسارات.
                  </p>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative group">
                <span className="absolute -right-6 top-1 w-4 h-4 rounded-full bg-slate-700 ring-4 ring-slate-900" />
                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-1 opacity-70">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-300 text-xs">المرحلة الثالثة: اختبارات الأمان والإنتاج الموسع</h5>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">مجدولة</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    إجراء اختبارات الحمل (Stress Testing)، فحص ثغرات التوقيت، وإطلاق النسخة التجريبية للمستخدمين.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Project Memory AI Chat */}
        {activeProjectTab === 'memoryChat' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 leading-relaxed">
              💡 <strong>ذاكرة المشروع النشطة:</strong> يمكنك طرح أي سؤال عن كيفية تنفيذ ميزة، أو حل خطأ، أو مراجعة معمارية، وسيقوم الذكاء الاصطناعي بالرجوع إلى قرارات هذا المشروع وتاريخه قبل صياغة الإجابة.
            </div>

            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] space-y-3">
              {projectAiChat.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <Bot className="w-8 h-8 mb-2 opacity-50" />
                  <p>اسأل عن هذا المشروع: "كيف يجب أن ننفذ مسار الإلغاء؟" أو "ما المعمارية المعتمدة لعمليات الدفع؟"</p>
                </div>
              ) : (
                projectAiChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl max-w-xl ${
                      msg.role === 'user'
                        ? 'mr-auto bg-purple-600/20 dark:bg-purple-600/30 text-purple-900 dark:text-purple-100 border border-purple-500/30 text-right'
                        : 'ml-auto bg-white dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] text-right shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                  </div>
                ))
              )}
              {isAiThinking && (
                <div className="p-3 rounded-xl bg-white dark:bg-white/[0.04] text-purple-600 dark:text-purple-400 font-mono text-[11px] animate-pulse">
                  جاري استرجاع ذاكرة المشروع والقرارات المعمارية...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleAskProjectAI} className="flex gap-2">
              <input
                type="text"
                value={projectAiQuestion}
                onChange={(e) => setProjectAiQuestion(e.target.value)}
                placeholder={`اسأل Genome AI عن ${project.name}...`}
                className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={isAiThinking || !projectAiQuestion.trim()}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-glow-purple disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
