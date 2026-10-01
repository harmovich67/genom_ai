import React, { useState } from 'react';
import { useAIStore, AI_MODES } from '../../store/aiStore';
import { useGenomeStore } from '../../store/genomeStore';
import { useUIStore } from '../../store/uiStore';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Bug,
  CheckCheck,
  Lightbulb,
  Cpu,
  GraduationCap,
  Trophy,
  Search,
  Trash2,
  Copy,
  Terminal,
  ArrowRight,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIMentorPage() {
  const {
    messages,
    activeMode,
    setActiveMode,
    inputPrompt,
    setInputPrompt,
    sendMessage,
    isGenerating,
    clearChat
  } = useAIStore();

  const { addToast, setPage } = useUIStore();
  const genomes = useGenomeStore((s) => s.genomes);

  // Icon mapper for modes
  const getModeIcon = (id) => {
    switch (id) {
      case 'explain': return BookOpen;
      case 'debug': return Bug;
      case 'review': return CheckCheck;
      case 'brainstorm': return Lightbulb;
      case 'architect': return Cpu;
      case 'teach': return GraduationCap;
      case 'challenge': return Trophy;
      case 'refactor': return Sparkles;
      case 'searchKnowledge': return Search;
      default: return Bot;
    }
  };

  const handleQuickPrompt = (promptText) => {
    sendMessage(promptText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isGenerating) return;
    sendMessage();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] space-y-3 pb-8">
      {/* Header & Modes Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 text-white flex items-center justify-center shadow-glow-cyan">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Genome AI — المرشد المعرفي الذكي
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
                  متصل بمكتبتك الخاصة ({genomes.length} جينوم)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ليس مجرد شات عادي، بل ذاكرة برمجية حية تمتلك وعياً بكافة حلولك ومشاريعك السابقة
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="بدء محادثة جديدة"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* 9 Modes Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {AI_MODES.map((mode) => {
            const Icon = getModeIcon(mode.id);
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold shadow-glow-purple'
                    : 'bg-slate-100 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.06]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{mode.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-white/70 dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white shadow-glow-emerald'
                  : 'bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40'
              }`}
            >
              {msg.role === 'user' ? 'ح' : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-4 rounded-2xl max-w-2xl text-xs space-y-2 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-50 text-emerald-950 border border-emerald-200 shadow-sm dark:bg-emerald-600/20 dark:border-emerald-500/30 dark:text-emerald-100 text-right'
                  : 'bg-white dark:bg-black/50 border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 shadow-sm text-right'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono mb-1">
                <span>{msg.role === 'user' ? 'أنت' : 'Genome AI'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed markdown-content">
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-black/40 border border-purple-200 dark:border-white/[0.08] text-xs text-purple-700 dark:text-purple-400 font-mono animate-pulse shadow-sm">
              جاري فحص الذاكرة البرمجية وتوليد الإجابة...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0 text-[11px]">
        <span className="text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">اقتراحات:</span>
        <button
          onClick={() => handleQuickPrompt('هل قمت بحل مشكلة مشابهة لـ Stale Closure سابقاً؟')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:border-white/[0.06] dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
        >
          "هل قمت بحل مشكلة مشابهة لـ Stale Closure سابقاً؟"
        </button>
        <button
          onClick={() => handleQuickPrompt('كيف أتحقق من توقيع Webhook متجر سلة بدون أخطاء؟')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:border-white/[0.06] dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
        >
          "كيف أتحقق من توقيع Webhook متجر سلة؟"
        </button>
        <button
          onClick={() => handleQuickPrompt('اشرح لي مفهوم Index SARGability في MySQL')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:border-white/[0.06] dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
        >
          "اشرح لي مفهوم Index SARGability في MySQL"
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={
            activeMode === 'searchKnowledge'
              ? 'ابحث في مكتبتك الخاصة... مثال: "حلول سلة" أو "أخطاء الـ WebSocket"'
              : 'اكتب سؤالك، أو الصق الكود، أو اطلب مراجعة معمارية...'
          }
          className="flex-1 p-3 rounded-2xl bg-white dark:bg-black/60 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-cyan-500 transition-colors shadow-sm"
        />

        <button
          type="submit"
          disabled={isGenerating || !inputPrompt.trim()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-purple-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-xs shadow-glow-cyan disabled:opacity-40 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">إرسال</span>
        </button>
      </form>
    </div>
  );
}
