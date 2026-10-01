import React, { useState } from 'react';
import { useIdeaStore } from '../../store/ideaStore';
import { useProjectStore } from '../../store/projectStore';
import { useUIStore } from '../../store/uiStore';
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  FolderPlus,
  Layers,
  ShieldAlert,
  Coins,
  CheckCircle2,
  Workflow,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IdeasPage() {
  const {
    ideas,
    selectedIdea,
    setSelectedIdea,
    rawInput,
    setRawInput,
    isForging,
    forgeIdea,
    turnIdeaIntoProject
  } = useIdeaStore();

  const { setPage, addToast } = useUIStore();
  const [turningId, setTurningId] = useState(null);

  const handleForge = async (e) => {
    e.preventDefault();
    if (!rawInput.trim()) return;

    const result = await forgeIdea(rawInput);
    if (result) {
      addToast({
        title: 'تم تشكيل الفكرة وتحويلها لمخطط هندسي!',
        message: result.title,
        type: 'success'
      });
    }
  };

  const handleTurnToProject = async (ideaId) => {
    setTurningId(ideaId);
    try {
      const created = await turnIdeaIntoProject(ideaId);
      addToast({
        title: 'تم تحويل الفكرة إلى مشروع بنجاح!',
        message: `تم إنشاء مشروع "${created?.name}" مع خطة المهام والمعمارية.`,
        type: 'success'
      });
      setPage('projects');
    } catch (e) {
      console.error('Turn to project error:', e);
    } finally {
      setTurningId(null);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">
              معمل الأفكار والمخططات (Idea Forge)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              حوّل أي فكرة مجردة إلى مخطط معماري وتقني متكامل وانقلها إلى مشروع بنقرة واحدة
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
          {ideas.length} فكرة ومخطط
        </span>
      </div>

      {/* Idea Forge Input Form */}
      <form
        onSubmit={handleForge}
        className="p-5 rounded-3xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile space-y-3"
      >
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>صاغ الأفكار الذكي (Idea Forge Engine)</span>
        </div>

        <textarea
          rows={3}
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="اكتب فكرتك بعفوية... مثال: أريد بناء إضافة ووردبريس ومحرر غوتنبرغ تكتشف عندما يكتب الكاتب بالعربي والكيبورد إنجليزي وتصححها فورياً بضغطة زر."
          className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/[0.1] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-amber-500/50 transition-colors leading-relaxed"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
            يستخرج الميزات، الـ MVP، معمارية النظام، وخطة التنفيذ
          </span>

          <button
            type="submit"
            disabled={isForging || !rawInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-semibold text-xs shadow-glow-amber disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isForging ? 'جاري الصياغة المعمارية...' : 'تشكيل الفكرة ومخططها الهندسي'}</span>
          </button>
        </div>
      </form>

      {/* Ideas Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saved Ideas List */}
        <div className="space-y-2 lg:col-span-1">
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold px-1 mb-2">
            الأفكار والمخططات المتاحة:
          </p>
          {ideas.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedIdea(item)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedIdea?.id === item.id
                  ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-400 dark:border-amber-500/40 shadow-tactile'
                  : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300">
                  {item.isTurnedToProject ? 'تم تحويلها لمشروع' : 'مخطط مكتمل'}
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {item.createdAt?.split('T')[0]}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">{item.problem || item.rawPrompt}</p>
            </div>
          ))}
        </div>

        {/* Selected Idea Deep Blueprint */}
        {selectedIdea ? (
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                  مخطط هندسي ذكي
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-1">{selectedIdea.title}</h2>
              </div>

              {/* Turn into Project Button */}
              <button
                onClick={() => handleTurnToProject(selectedIdea.id)}
                disabled={turningId === selectedIdea.id}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white font-semibold text-xs shadow-glow-emerald transition-all shrink-0 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>
                  {selectedIdea.isTurnedToProject
                    ? 'فتح في المشاريع'
                    : turningId === selectedIdea.id
                    ? 'جاري التحويل...'
                    : 'تحويل إلى مشروع (Turn into Project)'}
                </span>
              </button>
            </div>

            {/* Problem & Target Users */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-1">
                <span className="font-semibold text-rose-600 dark:text-rose-400 block font-mono">المشكلة التي يحلها (Problem):</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedIdea.problem}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-1">
                <span className="font-semibold text-cyan-600 dark:text-cyan-400 block font-mono">الجمهور المستهدف (Target Users):</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedIdea.targetUsers}</p>
              </div>
            </div>

            {/* MVP & Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 space-y-1">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 block font-mono">نطاق النسخة الأولى (MVP):</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedIdea.mvp}</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/20 space-y-1">
                <span className="font-semibold text-purple-700 dark:text-purple-400 block font-mono flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> المعمارية التقنية (Architecture):
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedIdea.architecture}</p>
              </div>
            </div>

            {/* Core Features */}
            {selectedIdea.coreFeatures && (
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white block">الميزات الجوهرية (Core Features):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedIdea.coreFeatures.map((f, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.04] text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack & Implementation Phases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block font-mono">حزمة التقنيات المقترحة:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIdea.techStack?.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {selectedIdea.phases && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block font-mono">مراحل التنفيذ (Roadmap):</span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    {selectedIdea.phases.map((ph, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">#{idx + 1}</span> {ph}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-12 text-center bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] rounded-3xl shadow-tactile">
            <p className="text-slate-500 dark:text-slate-400">اختر فكرة من القائمة أو قم بصياغة فكرة جديدة أعلاه.</p>
          </div>
        )}
      </div>
    </div>
  );
}
