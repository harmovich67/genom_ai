import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { useGenomeStore } from '../../store/genomeStore';
import { useProjectStore } from '../../store/projectStore';
import { useDebugStore } from '../../store/debugStore';
import { useChallengeStore } from '../../store/challengeStore';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  FolderGit2,
  Bug,
  Trophy,
  Dna,
  Terminal,
  Zap,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Brain,
  RotateCcw,
  Flame,
  Target,
  BarChart3,
  Lightbulb,
  Compass
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';

// Growth Analytics Data
const growthData = [
  { month: 'يونيو', genomes: 12, patterns: 8 },
  { month: 'يوليو', genomes: 28, patterns: 19 },
  { month: 'أغسطس', genomes: 45, patterns: 32 },
  { month: 'سبتمبر', genomes: 68, patterns: 51 },
  { month: 'أكتوبر', genomes: 94, patterns: 74 }
];

// Tech Distribution Data
const techData = [
  { name: 'React', count: 18, fill: '#10B981' },
  { name: 'Node.js', count: 14, fill: '#8B5CF6' },
  { name: 'Salla', count: 9, fill: '#06B6D4' },
  { name: 'MySQL', count: 8, fill: '#F59E0B' },
  { name: 'Redis', count: 6, fill: '#EC4899' },
  { name: 'WordPress', count: 5, fill: '#3B82F6' }
];

export default function DashboardPage() {
  const { lang, setPage, openModal } = useUIStore();
  const genomes = useGenomeStore((s) => s.genomes);
  const setSelectedGenome = useGenomeStore((s) => s.setSelectedGenome);
  const projects = useProjectStore((s) => s.projects);
  const bugs = useDebugStore((s) => s.bugs);
  const { startBuildFromMemory } = useChallengeStore();

  const currentProject = projects[0] || null;
  const sampleForgottenGenome = genomes[1] || genomes[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Command Center Header */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-cyan-500/10 border border-slate-200 dark:border-white/[0.08] shadow-tactile overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                سلسلة تعلم متواصلة: 14 يوماً
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
              {lang === 'ar' ? 'مساء الخير، حسام.' : 'Good evening, Hossam.'}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-xl leading-relaxed">
              {lang === 'ar'
                ? 'جاهز تكمل من حيث توقفت؟ لديك 3 أنماط برمجية مقترحة للمراجعة ومشروع نشط بإنجاز 78%.'
                : 'Ready to continue where you left off? You have 3 patterns to review and an active project at 78%.'}
            </p>
          </div>

          {/* Quick Hero CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage('workbench')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>فتح المختبر والتجربة</span>
            </button>
            <button
              onClick={() => openModal('newGenome')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.12] text-slate-800 dark:text-white font-medium text-xs border border-slate-200 dark:border-white/[0.1] shadow-sm transition-all cursor-pointer"
            >
              <Dna className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>إضافة كود جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* TODAY'S FOCUS & CURRENT INTELLIGENCE HIGHLIGHTS (6 CORE SPEC REQUIREMENTS) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Today's Focus */}
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> تركيز اليوم (Today's Focus)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
              إكمال فهارس جداول الحجوزات في منصة العمرة وحماية مسارات الدفع بـ Redis Lock
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              المشروع النشط وصل إلى 78%، إغلاق هذه المهمة يمهد للانتقال إلى مرحلة الـ Stress Testing.
            </p>
          </div>
          <button
            onClick={() => setPage('projects')}
            className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline self-start cursor-pointer"
          >
            <span>فتح مساحة عمل المشروع</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Weak Skill & Practice */}
        <div className="p-5 rounded-2xl glass-panel border border-rose-500/30 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> المهارة الأضعف (Weak Skill)
              </span>
              <span className="text-[10px] font-mono text-slate-500">تحليل الأداء</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
              MySQL Indexing & SARGability في شروط الـ WHERE
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              سجلت خطأ Full Table Scan الأسبوع الماضي عند استخدام دالة DATE() على عمود مفهرس.
            </p>
          </div>
          <button
            onClick={() => setPage('challenges')}
            className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline self-start cursor-pointer"
          >
            <span>مراجعة المبدأ الهندسي وحل التحدي</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. AI Recommendation */}
        <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> توصية الذكاء الاصطناعي (AI Tip)
              </span>
              <span className="text-[10px] font-mono text-purple-500 dark:text-purple-300">محدثة</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
              "تحويل نمط Redis Distributed Lock إلى حزمة مشتركة لجميع المشاريع"
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              تستخدم نفس خوارزمية القفل الذري في منصة العمرة وحزمة سلة، تجميعها يمنع تكرار الكود.
            </p>
          </div>
          <button
            onClick={() => setPage('ai')}
            className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline self-start cursor-pointer"
          >
            <span>استشارة Genome AI في الهيكلة</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* TODAYS DEVELOPER PULSE (نبضتك اليوم) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-heading">
              {lang === 'ar' ? 'نبضتك اليوم (Today\'s Developer Pulse)' : 'Today\'s Developer Pulse'}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">مُولدة آلياً بناءً على مكتبتك ومشاريعك</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Learn */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] hover:border-emerald-500/40 shadow-sm dark:shadow-none transition-all glow-card-emerald flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                  1. شيء لتتعلمه (Learn)
                </span>
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                سلوك رندرة React في Server Components
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                كيف تتفادى تسريب الحالة بين المستخدمين في Next.js 14 App Router.
              </p>
            </div>
            <button
              onClick={() => setPage('ai')}
              className="mt-3 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hover:underline self-start cursor-pointer"
            >
              <span>استكشف المفهوم</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 2. Review */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] hover:border-purple-500/40 shadow-sm dark:shadow-none transition-all glow-card-purple flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
                  2. شيء لتراجعه (Review)
                </span>
                <RotateCcw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                تدوير مفاتيح JWT في Express
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                حفظته قبل 28 يوماً، تأكد من معالجة كود الخطأ TOKEN_EXPIRED.
              </p>
            </div>
            <button
              onClick={() => {
                if (genomes[2]) {
                  setSelectedGenome(genomes[2]);
                  openModal('genomeDetail', genomes[2]);
                }
              }}
              className="mt-3 flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 font-medium hover:underline self-start cursor-pointer"
            >
              <span>فتح الجينوم</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3. Build */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/40 shadow-sm dark:shadow-none transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold">
                  3. شيء لتبنيه (Build)
                </span>
                <Terminal className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                مكون نافذة منبثقة زجاجية Glass Modal
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                مطلوب في شاشات الحجز لمنصة العمرة مع دعم سهولة الوصول (A11y).
              </p>
            </div>
            <button
              onClick={() => setPage('workbench')}
              className="mt-3 flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 font-medium hover:underline self-start cursor-pointer"
            >
              <span>بدء البناء في المختبر</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 4. Fix */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] hover:border-rose-500/40 shadow-sm dark:shadow-none transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                  4. شيء لتصلحه (Fix)
                </span>
                <Bug className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
                قفل MySQL الميت في مسار الحجز
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                راجع معمارية ترتيب المعرفات المسجلة في سجل الـ ADR للمشروع.
              </p>
            </div>
            <button
              onClick={() => setPage('debug')}
              className="mt-3 flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium hover:underline self-start cursor-pointer"
            >
              <span>فحص في مختبر التصحيح</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 5. Remember */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] hover:border-amber-500/40 shadow-sm dark:shadow-none transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                  5. شيء لتتذكره (Remember)
                </span>
                <Brain className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                "لا تقرأ الـ rawBody بعد parse"
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                أي قراءة بعد JSON.parse تفسد توقيعات HMAC في خطافات سلة وزد.
              </p>
            </div>
            <button
              onClick={() => setPage('challenges')}
              className="mt-3 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium hover:underline self-start cursor-pointer"
            >
              <span>سجل الذاكرة المعرفية</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Two Signature Cards: Forgotten Knowledge & Build From Memory */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SIGNATURE 2: FORGOTTEN KNOWLEDGE */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0D121F] dark:to-[#12192B] border border-amber-500/30 dark:border-white/[0.08] shadow-sm dark:shadow-tactile flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                الميزة الموقعة: المعرفة المنسية (Forgotten Knowledge)
              </span>
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              "حفظت حل: {sampleForgottenGenome?.title} قبل شهرين."
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              هل ما زلت تتذكر لماذا استخدمت دالة timingSafeEqual وما الذي يمنعه هذا الكود في بيئة الإنتاج؟
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
            <button
              onClick={() => {
                setSelectedGenome(sampleForgottenGenome);
                openModal('genomeDetail', sampleForgottenGenome);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-all cursor-pointer"
            >
              مراجعة سريعة
            </button>
            <button
              onClick={() => {
                startBuildFromMemory(sampleForgottenGenome);
                setPage('challenges');
              }}
              className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-medium transition-all cursor-pointer"
            >
              اختبرني فيه الآن
            </button>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mr-auto">تكرار متباعد: 3 أسابيع</span>
          </div>
        </div>

        {/* SIGNATURE 3: BUILD FROM MEMORY */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0D121F] dark:to-[#12192B] border border-purple-500/30 dark:border-white/[0.08] shadow-sm dark:shadow-tactile flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                الميزة الموقعة: البناء من الذاكرة (Build From Memory)
              </span>
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              "تحدي الاستدعاء النشط: خطاف useDebounce"
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              ابنِ خطاف التهدئة بنفسك في محرر خفيف بدون الرجوع للحل، وسيقوم الذكاء الاصطناعي بمقارنة كودك وتحديد مواطن التحسن والقصور.
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
            <button
              onClick={() => {
                if (genomes[0]) {
                  startBuildFromMemory(genomes[0]);
                  setPage('challenges');
                }
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-glow-purple transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>خوض التحدي (5 دقائق)</span>
            </button>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">+50 نقطة جينوم</span>
          </div>
        </div>
      </section>

      {/* DASHBOARD ANALYTICS CHARTS (RECHARTS INTEGRATION) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              تحليلات نمو المعرفة البرمجية (Knowledge Growth & Stack Analytics)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">تحديث فوري من IndexedDB</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart 1: Knowledge Growth Over Time */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">منحنى نمو الجينومات البرمجية والأنماط</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">تطور التوثيق المعرفي والحلول خلال الشهور الأخيرة</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">+38% هذا الشهر</span>
            </div>

            <div className="h-48 w-full dir-ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="patternGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff'
                    }}
                  />
                  <Area type="monotone" dataKey="genomes" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#growthGradient)" name="الجينومات" />
                  <Area type="monotone" dataKey="patterns" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#patternGradient)" name="الأنماط" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Most Used Technologies */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">توزيع التقنيات الأكثر استخداماً وتوثيقاً</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">تكرار الاعتماد على الحزم عبر مشاريعك</p>
              </div>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">React في الصدارة</span>
            </div>

            <div className="h-48 w-full dir-ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={techData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} name="عدد الاستخدامات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics & Project Context */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">المؤشرات العامة للنظام</h3>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">Local-First Architecture</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] shadow-sm">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mb-1">عناصر الجينوم</span>
              <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{genomes.length}</p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">موثقة ومفهرسة</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] shadow-sm">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mb-1">المشاريع النشطة</span>
              <p className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">{projects.length}</p>
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-medium">مع سياق AI مخصص</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] shadow-sm">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mb-1">أخطاء موثقة</span>
              <p className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">{bugs.length}</p>
              <span className="text-[10px] text-rose-700 dark:text-rose-300 font-medium">مع حلول وقائية</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] shadow-sm">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mb-1">أيام الالتزام</span>
              <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">14</p>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">سلسلة مستمرة 🔥</span>
            </div>
          </div>

          {/* Recently Used Knowledge List */}
          <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">أحدث جينومات الكود المضافة والمستخدمة</h4>
              <button
                onClick={() => setPage('library')}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>عرض الكل</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {genomes.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedGenome(item);
                    openModal('genomeDetail', item);
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.06] hover:border-emerald-500/30 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
                      {item.technology?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/80 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300">
                      {item.difficulty}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Project Memory Spotlight */}
        {currentProject && (
          <div className="p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-[#0D121F] dark:to-[#12192B] border border-slate-200 dark:border-white/[0.08] shadow-md dark:shadow-tactile flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                  المشروع الحالي (Current Project)
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {currentProject.progress}%
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white">{currentProject.name}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {currentProject.description}
              </p>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden my-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${currentProject.progress}%` }}
                />
              </div>

              {/* Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {currentProject.stack?.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Active Tasks preview */}
              <div className="mt-4 space-y-2">
                <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 block font-semibold">
                  المهام الحالية في هذا المشروع:
                </span>
                {currentProject.tasks?.slice(0, 3).map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        t.completed ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400'
                      }`}
                    />
                    <span className={t.completed ? 'line-through text-slate-400' : ''}>
                      {t.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPage('projects')}
              className="mt-5 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-glow-purple transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>فتح مساحة عمل المشروع</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
