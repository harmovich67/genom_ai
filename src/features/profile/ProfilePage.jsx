import React, { useState } from 'react';
import { useGenomeStore } from '../../store/genomeStore';
import { useProjectStore } from '../../store/projectStore';
import { useDebugStore } from '../../store/debugStore';
import { useUIStore } from '../../store/uiStore';
import { initialPersonalStack } from '../../data/initialData';
import {
  User,
  Flame,
  Award,
  Dna,
  FolderGit2,
  Bug,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  TrendingUp,
  Settings,
  Calendar
} from 'lucide-react';

export default function ProfilePage() {
  const { genomes } = useGenomeStore();
  const { projects } = useProjectStore();
  const { bugs } = useDebugStore();
  const { openModal, setPage } = useUIStore();

  const [techStack, setTechStack] = useState(
    JSON.parse(localStorage.getItem('genome_personal_stack')) || initialPersonalStack
  );

  const handleUpdateLevel = (id, newLevel) => {
    const updated = techStack.map((t) => (t.id === id ? { ...t, level: newLevel } : t));
    setTechStack(updated);
    localStorage.setItem('genome_personal_stack', JSON.stringify(updated));
  };

  const achievements = [
    { title: 'مهندس جينوم الكود', desc: 'وثّق أكثر من 5 حلول برمجية في الإنتاج', icon: '🏆', unlocked: true },
    { title: 'حارس الأمان البنكي', desc: 'تطبيق نمط تدقيق التوقيعات المشفرة لـ Salla', icon: '🛡️', unlocked: true },
    { title: 'كاسر القفل الميت', desc: 'حل مشكلة Deadlock في MySQL بنجاح', icon: '⚡', unlocked: true },
    { title: 'ذاكرة برمجية حية', desc: 'إتمام 14 يوماً من المراجعة المتباعدة', icon: '🔥', unlocked: true }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-purple-500 to-cyan-500 flex items-center justify-center font-bold text-2xl text-white shadow-glow-emerald">
              ح
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
                  حسام المحمود (Hossam Mahmoud)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                  Senior Full-Stack Architect
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                الرياض، المملكة العربية السعودية • متخصص في تطبيقات التجارة الإلكترونية، أنظمة سلة وزد، وحلول الأداء العالي
              </p>
            </div>
          </div>

          <button
            onClick={() => openModal('settings')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-white/[0.08] transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات الحساب والبيانات</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-white/[0.06]">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-transparent">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">الجينومات الموثقة</span>
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{genomes.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-transparent">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">المشاريع المنجزة</span>
            <span className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400">{projects.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-transparent">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">الأخطاء المحلولة</span>
            <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">{bugs.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-transparent">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">سلسلة التعلم النشط</span>
            <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">14 يوماً 🔥</span>
          </div>
        </div>
      </div>

      {/* PERSONAL STACK INTELLIGENCE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              حزمة المهارات البرمجية والذكاء السياقي (Personal Stack Intelligence)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              يستخدم الذكاء الاصطناعي هذه الإعدادات لتخصيص الحلول والتحديات البرمجية بناءً على مستواك
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {techStack.map((tech) => (
            <div
              key={tech.id}
              className="p-4 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.06] shadow-tactile flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block">{tech.category}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tech.name}</h4>
              </div>

              {/* Level Selector */}
              <select
                value={tech.level}
                onChange={(e) => handleUpdateLevel(tech.id, e.target.value)}
                className={`p-1.5 rounded-lg text-xs font-mono font-semibold outline-none border cursor-pointer ${
                  tech.level === 'Expert'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                    : tech.level === 'Comfortable'
                    ? 'bg-cyan-50 text-cyan-900 border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30'
                    : 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                }`}
              >
                <option value="Expert" className="bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400">خبير (Expert)</option>
                <option value="Comfortable" className="bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400">متمكن (Comfortable)</option>
                <option value="Learning" className="bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400">قيد التعلم (Learning)</option>
                <option value="Avoid" className="bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400">تجنب (Avoid)</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS & MILESTONES */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
          الأوسمة والإنجازات الهندسية (Achievements)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] hover:border-emerald-500/30 shadow-tactile transition-all flex items-start gap-3"
            >
              <span className="text-2xl">{ach.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{ach.desc}</p>
                <span className="inline-block mt-2 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ تم الفتح
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
