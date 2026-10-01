import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useGenomeStore } from '../../store/genomeStore';
import { useProjectStore } from '../../store/projectStore';
import { useDebugStore } from '../../store/debugStore';
import { useIdeaStore } from '../../store/ideaStore';
import db from '../../services/storage/db';
import {
  Settings,
  Key,
  Database,
  Download,
  Upload,
  Trash2,
  Shield,
  Keyboard,
  Sparkles,
  Save,
  Moon,
  Sun,
  Globe,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function SettingsPage() {
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    aiAccessEnabled,
    setAIAccessEnabled,
    addToast
  } = useUIStore();

  const [geminiKey, setGeminiKey] = useState(
    localStorage.getItem('genome_gemini_api_key') || ''
  );
  const [geminiModel, setGeminiModel] = useState(
    localStorage.getItem('genome_gemini_model') || 'gemini-3.5-flash-lite'
  );
  const [reduceMotion, setReduceMotion] = useState(
    localStorage.getItem('genome_reduce_motion') === 'true'
  );
  const [activeTab, setActiveTab] = useState('general');

  const handleSaveAISettings = (e) => {
    e.preventDefault();
    localStorage.setItem('genome_gemini_api_key', geminiKey.trim());
    localStorage.setItem('genome_gemini_model', geminiModel);
    addToast({
      title: 'تم تحديث إعدادات الذكاء الاصطناعي',
      message: 'تم حفظ المفتاح والنموذج محلياً بأمان.',
      type: 'success'
    });
  };

  const handleExportData = async () => {
    try {
      const genomes = await db.genomes.toArray();
      const projects = await db.projects.toArray();
      const bugs = await db.bugs.toArray();
      const ideas = await db.ideas.toArray();
      const decisions = await db.decisions.toArray();
      const learningMemory = await db.learningMemory.toArray();

      const exportObject = {
        exportDate: new Date().toISOString(),
        version: '2.0.0',
        app: 'CODE GENOME',
        data: { genomes, projects, bugs, ideas, decisions, learningMemory }
      };

      const jsonBlob = new Blob([JSON.stringify(exportObject, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(jsonBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `code_genome_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      addToast({
        title: 'تم تصدير الذاكرة البرمجية بنجاح!',
        message: 'تم تنزيل ملف JSON يحتوي على كافة جينوماتك ومشاريعك.',
        type: 'success'
      });
    } catch (e) {
      console.error('Export error:', e);
      addToast({ title: 'فشل التصدير', message: 'حدث خطأ أثناء قراءة البيانات.', type: 'error' });
    }
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.data) throw new Error('Invalid format');

        if (parsed.data.genomes) await db.genomes.bulkPut(parsed.data.genomes);
        if (parsed.data.projects) await db.projects.bulkPut(parsed.data.projects);
        if (parsed.data.bugs) await db.bugs.bulkPut(parsed.data.bugs);
        if (parsed.data.ideas) await db.ideas.bulkPut(parsed.data.ideas);
        if (parsed.data.decisions) await db.decisions.bulkPut(parsed.data.decisions);

        await useGenomeStore.getState().initializeGenomes();
        await useProjectStore.getState().initializeProjects();
        await useDebugStore.getState().initializeBugs();
        await useIdeaStore.getState().initializeIdeas();

        addToast({
          title: 'تم استيراد البيانات بنجاح!',
          message: 'تم تحديث كافة السجلات والمكتبة.',
          type: 'success'
        });
      } catch (err) {
        console.error('Import error:', err);
        addToast({ title: 'فشل الاستيراد', message: 'الملف غير صالح أو تالف.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف البيانات المحلية؟ سيتم استعادة البيانات الافتراضية.')) {
      await db.delete();
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-white border border-slate-200 dark:border-white/[0.08]">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">
            إعدادات النظام والبيانات (Settings & Privacy)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تحكم بنماذج الذكاء الاصطناعي، الخصوصية المحلية، المظهر، والنسخ الاحتياطي
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.08] text-xs font-medium">
        <button
          onClick={() => setActiveTab('general')}
          className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === 'general'
              ? 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          عام والمظهر
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'ai'
              ? 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>الذكاء الاصطناعي (Gemini)</span>
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === 'data'
              ? 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          البيانات والنسخ الاحتياطي
        </button>
        <button
          onClick={() => setActiveTab('shortcuts')}
          className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === 'shortcuts'
              ? 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          اختصارات لوحة المفاتيح
        </button>
      </div>

      {/* Tab 1: General */}
      {activeTab === 'general' && (
        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">اللغة الأساسية للواجهة</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">يدعم النظام التحويل الفوري بين العربية (RTL) والإنجليزية (LTR)</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang('ar')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  lang === 'ar' ? 'bg-emerald-600 text-white shadow-glow-emerald' : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300'
                }`}
              >
                العربية (RTL)
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-emerald-600 text-white shadow-glow-emerald' : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300'
                }`}
              >
                English (LTR)
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">المظهر البصري (Theme)</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">مظهر الحبر العميق المظلم أو المظهر الفاتح عالي التباين</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 font-mono text-xs border border-slate-200 dark:border-white/[0.08] transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{theme === 'dark' ? 'الداكن (Deep Ink)' : 'الفاتح (Light Clean)'}</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">تقليل التأثيرات الحركية (Reduced Motion)</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">إيقاف الرسوم المتحركة المعقدة لتجربة أسرع وأخف على الجهاز</p>
            </div>
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(e) => {
                setReduceMotion(e.target.checked);
                localStorage.setItem('genome_reduce_motion', String(e.target.checked));
              }}
              className="w-5 h-5 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Tab 2: AI Settings */}
      {activeTab === 'ai' && (
        <form onSubmit={handleSaveAISettings} className="space-y-4 text-xs">
          <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 space-y-2">
            <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>تكامل نموذج Google Gemini للذكاء الاصطناعي</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
              يعمل التطبيق بنظام Offline-First مع محرك محاكاة داخلي عالي الذكاء. عند إدخال مفتاح Gemini API، يتم الاتصال المباشر بنماذج Google Gemini الرسمية.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile space-y-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">Gemini API Key</label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400 outline-none focus:border-purple-500"
              />
              <p className="text-[10px] text-slate-500 font-mono">
                المفتاح مشفر ومخزن في متصفحك محلياً ولا يرسل لأي خادم وسيط.
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">النموذج المعتمد (Model Selection)</label>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500 font-mono cursor-pointer"
              >
                <option value="gemini-3.5-flash-lite" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">gemini-3.5-flash-lite (flash-3.5lite - النموذج فائق السرعة والخفة الموصى به)</option>
                <option value="gemini-2.5-flash" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">gemini-2.5-flash (أداء متقدم وسريع)</option>
                <option value="gemini-1.5-flash-latest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">gemini-1.5-flash-latest (مستقر وعام)</option>
                <option value="gemini-1.5-pro-latest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">gemini-1.5-pro-latest (تحليلات برمجية معقدة)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-glow-purple transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ إعدادات الـ AI</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: Data & Export */}
      {activeTab === 'data' && (
        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">تصدير الذاكرة المعرفية (Export Data)</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">تنزيل نسخة احتياطية كاملة JSON تتضمن كافة الجينومات، المشاريع، والقرارات</p>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 dark:text-emerald-300 dark:border-emerald-500/30 transition-all font-semibold cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تصدير JSON</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">استيراد نسخة سابقة (Import Data)</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">استرجاع بياناتك ومكتبتك من ملف JSON سابق</p>
            </div>
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-600/20 dark:hover:bg-cyan-600/30 dark:text-cyan-300 dark:border-cyan-500/30 transition-all font-semibold cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>اختيار ملف</span>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-rose-800 dark:text-rose-300 text-sm">إفراغ قاعدة البيانات المحلية</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">مسح IndexedDB وإعادة تعيين البيانات الأولية للمنصة</p>
            </div>
            <button
              onClick={handleClearData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>إعادة تعيين</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Shortcuts */}
      {activeTab === 'shortcuts' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] shadow-tactile space-y-3 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/[0.06]">
            <span className="text-slate-800 dark:text-slate-200">فتح لوحة الأوامر والبحث العام (Command Palette)</span>
            <kbd className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/[0.1] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">Ctrl / Cmd + K</kbd>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/[0.06]">
            <span className="text-slate-800 dark:text-slate-200">إغلاق النوافذ المنبثقة النشطة (Close Modals)</span>
            <kbd className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/[0.1] font-mono text-slate-700 dark:text-slate-400 font-semibold">Escape</kbd>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-800 dark:text-slate-200">تشغيل الكود في المختبر (Run Code)</span>
            <kbd className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/[0.1] font-mono text-cyan-700 dark:text-cyan-400 font-semibold">Ctrl + Enter</kbd>
          </div>
        </div>
      )}
    </div>
  );
}
