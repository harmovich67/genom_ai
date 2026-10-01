import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useProjectStore } from '../../store/projectStore';
import {
  X,
  FolderGit2,
  Plus,
  Save,
  Layers,
  Target,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewProjectModal() {
  const { activeModal, closeModal, addToast, setPage } = useUIStore();
  const { addProject } = useProjectStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stack, setStack] = useState('React, Node.js, Tailwind CSS');
  const [goal1, setGoal1] = useState('');
  const [goal2, setGoal2] = useState('');
  const [task1, setTask1] = useState('');
  const [architecture, setArchitecture] = useState('');

  if (activeModal !== 'newProject') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const goals = [goal1, goal2].filter(Boolean);
    const tasks = [task1].filter(Boolean).map((t, i) => ({
      id: Date.now() + i,
      title: t,
      completed: false
    }));

    const newProj = {
      name,
      description: description || 'مشروع برمجي جديد في مساحة عمل جينوم الكود.',
      stack: stack.split(',').map((s) => s.trim()).filter(Boolean),
      goals: goals.length > 0 ? goals : ['تحقيق إصدار النسخة الأولى (MVP).'],
      tasks: tasks.length > 0 ? tasks : [{ id: Date.now(), title: 'إعداد المعمارية والمكتبات الأساسية', completed: false }],
      architectureNotes: architecture || 'معمارية معيارية مع فصل طبقة البيانات وخدمات الـ API.',
      aiContext: `مشروع ${name} يعتمد على ${stack}.`,
      progress: 0,
      timeline: 'قيد التأسيس'
    };

    const created = await addProject(newProj);
    addToast({
      title: 'تم إنشاء مساحة عمل المشروع بنجاح!',
      message: `مشروع "${created.name}" جاهز الآن للربط مع مكتبة الجينوم.`,
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
          className="w-full max-w-2xl bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-200 dark:border-white/[0.12] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 flex items-center justify-center">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  إنشاء مساحة عمل مشروع جديد (New Project)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  خصص سياق ذكاء اصطناعي مستقل، سجل قرارات معمارية (ADR)، وأهدافاً للمشروع
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

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Project Name */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">اسم المشروع *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: تطبيق حجوزات الفنادق المباشرة"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">وصف المشروع والغرض منه</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="نبذة عن وظيفة المشروع وأهم عملياته..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
              />
            </div>

            {/* Stack */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">حزمة التقنيات (مفصولة بفواصل)</label>
              <input
                type="text"
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                placeholder="React, Next.js, Node.js, Express, MySQL, Redis"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400 outline-none focus:border-purple-500"
              />
            </div>

            {/* Architecture Notes */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">ملاحظات المعمارية (Architecture Notes)</label>
              <textarea
                rows={2}
                value={architecture}
                onChange={(e) => setArchitecture(e.target.value)}
                placeholder="مثال: Modular Monolith مع Redis للـ Caching و Sequelize ORM..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
              />
            </div>

            {/* Goals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">الهدف الأول للمشروع</label>
                <input
                  type="text"
                  value={goal1}
                  onChange={(e) => setGoal1(e.target.value)}
                  placeholder="مثال: تحقيق زمن استجابة أقل من 200ms"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">الهدف الثاني للمشروع</label>
                <input
                  type="text"
                  value={goal2}
                  onChange={(e) => setGoal2(e.target.value)}
                  placeholder="مثال: سد كافة ثغرات الـ Concurrency"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Initial Task */}
            <div className="space-y-1">
              <label className="text-slate-700 dark:text-slate-300">المهمة الأولى للبدء بها</label>
              <input
                type="text"
                value={task1}
                onChange={(e) => setTask1(e.target.value)}
                placeholder="مثال: إعداد بنية جداول قاعدة البيانات والـ Migrations"
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                سيتم تفعيل مستشار ذاكرة المشروع التفاعلي تلقائياً
              </span>
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
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-glow-purple transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>إنشاء المشروع</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
