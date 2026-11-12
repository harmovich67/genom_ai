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

// Minimal inline markdown (**bold** and `code`) so replies don't show raw asterisks.
function renderInline(text) {
  const parts = String(text ?? '').split(/(\*\*[^*\n]+\*\*|`[^`\n]+`)/g);
  return parts.map((part, i) => {
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} dir="ltr" className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-100 dark:bg-white/10 font-mono text-[11px] text-slate-800 dark:text-slate-100">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

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
    <div className="flex flex-col h-[calc(100dvh-9.75rem)] -mb-14 md:mb-0 md:h-[calc(100dvh-8.5rem)] gap-3 pb-1 md:pb-8">
      {/* Header & Modes Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile space-y-3.5 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-2xl sm:rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 text-white flex items-center justify-center shadow-glow-cyan">
              <Bot className="w-5 h-5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h1 className="text-sm font-bold text-slate-900 dark:text-white font-heading leading-tight">
                  <span className="sm:hidden">المرشد الذكي</span>
                  <span className="hidden sm:inline">Genome AI — المرشد المعرفي الذكي</span>
                </h1>
                <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
                  متصل بمكتبتك الخاصة ({genomes.length} جينوم)
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-600 dark:text-slate-400">
                ليس مجرد شات عادي، بل ذاكرة برمجية حية تمتلك وعياً بكافة حلولك ومشاريعك السابقة
              </p>
              <p className="sm:hidden mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                متصل بمكتبتك · {genomes.length} جينوم
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="shrink-0 p-2.5 sm:p-1.5 rounded-xl sm:rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="بدء محادثة جديدة"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* 9 Modes Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-1 text-xs">
          {AI_MODES.map((mode) => {
            const Icon = getModeIcon(mode.id);
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 sm:px-3 sm:py-1.5 rounded-xl font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
      <div className="flex-1 min-h-0 overflow-y-auto p-4 rounded-3xl bg-white/70 dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 sm:gap-3 ${
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
              className={`min-w-0 p-3.5 sm:p-4 rounded-2xl max-w-[calc(100%-2.5rem)] sm:max-w-2xl text-[13px] sm:text-xs space-y-2 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-50 text-emerald-950 border border-emerald-200 shadow-sm dark:bg-emerald-600/20 dark:border-emerald-500/30 dark:text-emerald-100 text-right'
                  : 'bg-white dark:bg-black/50 border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 shadow-sm text-right'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono mb-1">
                <span>{msg.role === 'user' ? 'أنت' : 'Genome AI'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed markdown-content">
                {renderInline(msg.content)}
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
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-0.5 shrink-0 text-[11px]">
        <span className="hidden sm:inline text-slate-600 dark:text-slate-400 font-mono whitespace-nowrap">اقتراحات:</span>
        <button
          onClick={() => handleQuickPrompt('هل قمت بحل مشكلة مشابهة لـ Stale Closure سابقاً؟')}
          className="shrink-0 px-3 py-2 sm:px-2.5 sm:py-1 rounded-xl sm:rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:border-white/[0.06] dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
        >
          "هل قمت بحل مشكلة مشابهة لـ Stale Closure سابقاً؟"
        </button>
        <button
          onClick={() => handleQuickPrompt('كيف أتحقق من توقيع Webhook متجر سلة بدون أخطاء؟')}
          className="shrink-0 px-3 py-2 sm:px-2.5 sm:py-1 rounded-xl sm:rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:border-white/[0.06] dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
        >
          "كيف أتحقق من توقيع Webhook متجر سلة؟"
        </button>
        <button
          onClick={() => handleQuickPrompt('اشرح لي مفهوم Index SARGability في MySQL')}
          className="shrink-0 px-3 py-2 sm:px-2.5 sm:py-1 rounded-xl sm:rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:border-white/[0.06] dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
        >
          "اشرح لي مفهوم Index SARGability في MySQL"
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5 shrink-0">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={
            activeMode === 'searchKnowledge'
              ? 'ابحث في مكتبتك الخاصة... مثال: "حلول سلة" أو "أخطاء الـ WebSocket"'
              : 'اكتب سؤالك، أو الصق الكود، أو اطلب مراجعة معمارية...'
          }
          className="flex-1 min-w-0 px-4 py-3.5 sm:p-3 rounded-2xl bg-white dark:bg-black/60 border border-slate-300 dark:border-white/[0.1] text-[13px] sm:text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-cyan-500 transition-colors shadow-sm"
        />

        <button
          type="submit"
          disabled={isGenerating || !inputPrompt.trim()}
          className="w-12 h-12 sm:w-auto sm:h-auto sm:px-5 sm:py-3 shrink-0 justify-center rounded-2xl bg-gradient-to-r from-cyan-600 via-purple-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-xs shadow-glow-cyan disabled:shadow-none disabled:from-slate-500 disabled:via-slate-500 disabled:to-slate-500 dark:disabled:from-slate-700 dark:disabled:via-slate-700 dark:disabled:to-slate-700 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">إرسال</span>
        </button>
      </form>
    </div>
  );
}
