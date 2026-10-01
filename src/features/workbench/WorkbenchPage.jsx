import React, { useState, useEffect, useRef } from 'react';
import { useWorkbenchStore } from '../../store/workbenchStore';
import { useGenomeStore } from '../../store/genomeStore';
import { useUIStore } from '../../store/uiStore';
import Editor from '@monaco-editor/react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Save,
  Terminal,
  Code,
  Eye,
  Trash2,
  Sparkles,
  Maximize2,
  FileCode,
  Layers,
  FileText,
  Braces,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkbenchPage() {
  const {
    html,
    css,
    js,
    json,
    markdown,
    setHtml,
    setCss,
    setJs,
    setJson,
    setMarkdown,
    consoleLogs,
    addConsoleLog,
    clearConsole,
    resetDefaults,
    runKey,
    triggerRun
  } = useWorkbenchStore();

  const { addGenome } = useGenomeStore();
  const { addToast, theme } = useUIStore();

  const [activeTab, setActiveTab] = useState('js'); // 'js' | 'html' | 'css' | 'json' | 'markdown'
  const [copied, setCopied] = useState(false);
  const [mobilePane, setMobilePane] = useState('editor'); // 'editor' | 'preview' | 'console'

  // Save As New Genome Version modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newVersionTitle, setNewVersionTitle] = useState('تطبيق التهدئة (إصدار المختبر v2)');
  const [newVersionTech, setNewVersionTech] = useState('React');
  const [newVersionNotes, setNewVersionNotes] = useState('نسخة محسنة تم اختبارها وتعديلها في المختبر الحي.');

  // JSON validation status
  const jsonStatus = React.useMemo(() => {
    try {
      JSON.parse(json);
      return { valid: true, error: null };
    } catch (e) {
      return { valid: false, error: e.message };
    }
  }, [json]);

  // Build the sandboxed iframe document
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          const _log = console.log;
          const _error = console.error;
          const _warn = console.warn;

          console.log = function(...args) {
            window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'info', args: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            _log.apply(console, args);
          };

          console.error = function(...args) {
            window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', args: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            _error.apply(console, args);
          };

          console.warn = function(...args) {
            window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'warn', args: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            _warn.apply(console, args);
          };

          window.onerror = function(msg, url, line) {
            window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', args: 'Error: ' + msg + ' (Line ' + line + ')' }, '*');
          };

          try {
            ${js}
          } catch(err) {
            console.error(err.message);
          }
        </script>
      </body>
    </html>
  `;

  // Listen to iframe console messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'CONSOLE_LOG') {
        addConsoleLog(event.data.level, event.data.args);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addConsoleLog]);

  const handleCopyCurrent = () => {
    let codeToCopy = js;
    if (activeTab === 'html') codeToCopy = html;
    if (activeTab === 'css') codeToCopy = css;
    if (activeTab === 'json') codeToCopy = json;
    if (activeTab === 'markdown') codeToCopy = markdown;

    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    addToast({ title: 'تم نسخ الكود!', message: 'الكود الحالي منسوخ في الحافظة.', type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmSaveNewGenome = async (e) => {
    e.preventDefault();
    let currentCode = js;
    let langType = 'javascript';
    if (activeTab === 'html') { currentCode = html; langType = 'html'; }
    if (activeTab === 'css') { currentCode = css; langType = 'css'; }
    if (activeTab === 'json') { currentCode = json; langType = 'json'; }
    if (activeTab === 'markdown') { currentCode = markdown; langType = 'markdown'; }

    const newGenomeItem = {
      title: newVersionTitle,
      code: currentCode,
      technology: newVersionTech,
      language: langType,
      type: 'Playground Solution',
      status: 'Production Ready',
      difficulty: 'Intermediate',
      description: newVersionNotes,
      problem: 'تم بناء وتعديل هذا الحل في مختبر الأكواد الحي (Workbench).',
      solution: newVersionNotes,
      whenToUse: 'حل مجرب ومختبر في بيئة الـ Sandbox التفاعلية.',
      confidence: '98%',
      tags: [newVersionTech, 'Workbench', 'Custom Version']
    };

    await addGenome(newGenomeItem);
    setShowSaveModal(false);
    addToast({
      title: 'تم حفظ نسخة جديدة في مكتبة الجينوم!',
      message: `تم توثيق "${newVersionTitle}" كحل جديد ومستقل.`,
      type: 'success'
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] space-y-3 pb-8">
      {/* Workbench Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-heading">
              مختبر الأكواد الحي (Code Workbench)
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              يدعم JavaScript, HTML, CSS, JSON, Markdown مع معاينة معزولة وكونسول تفاعلي
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerRun}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>تشغيل (Run)</span>
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-glow-purple transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ كنسخة جينوم جديدة</span>
          </button>

          <button
            onClick={handleCopyCurrent}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-600 dark:text-slate-300 transition-colors"
            title="نسخ الكود النشط"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={resetDefaults}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            title="إعادة تعيين القالب"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Pane Switcher */}
      <div className="md:hidden flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] shrink-0">
        <button
          onClick={() => setMobilePane('editor')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
            mobilePane === 'editor' ? 'bg-emerald-600 text-white' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          المحرر (Editor)
        </button>
        <button
          onClick={() => setMobilePane('preview')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
            mobilePane === 'preview' ? 'bg-emerald-500 text-white' : 'text-slate-400'
          }`}
        >
          المعاينة (Preview)
        </button>
        <button
          onClick={() => setMobilePane('console')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
            mobilePane === 'console' ? 'bg-emerald-500 text-white' : 'text-slate-400'
          }`}
        >
          الكونسول ({consoleLogs.length})
        </button>
      </div>

      {/* Main Split View Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
        {/* LEFT / CODE EDITOR PANE */}
        <div
          className={`flex-col rounded-2xl glass-panel border border-slate-200 dark:border-white/[0.08] overflow-hidden min-h-0 ${
            mobilePane === 'editor' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Editor Language Tabs (JS, HTML, CSS, JSON, Markdown) */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#050811] text-xs font-mono overflow-x-auto">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('js')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'js'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                JavaScript
              </button>
              <button
                onClick={() => setActiveTab('html')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'html'
                    ? 'bg-orange-500/20 text-orange-600 dark:text-orange-300 font-bold border border-orange-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setActiveTab('css')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'css'
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                CSS
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'json'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Braces className="w-3 h-3" />
                <span>JSON</span>
              </button>
              <button
                onClick={() => setActiveTab('markdown')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'markdown'
                    ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold border border-purple-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Markdown</span>
              </button>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">Monaco Engine</span>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[300px] dir-ltr text-left">
            {activeTab === 'js' && (
              <Editor
                height="100%"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                language="javascript"
                value={js}
                onChange={(val) => setJs(val || '')}
                options={{
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true
                }}
              />
            )}
            {activeTab === 'html' && (
              <Editor
                height="100%"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                language="html"
                value={html}
                onChange={(val) => setHtml(val || '')}
                options={{
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true
                }}
              />
            )}
            {activeTab === 'css' && (
              <Editor
                height="100%"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                language="css"
                value={css}
                onChange={(val) => setCss(val || '')}
                options={{
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true
                }}
              />
            )}
            {activeTab === 'json' && (
              <Editor
                height="100%"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                language="json"
                value={json}
                onChange={(val) => setJson(val || '')}
                options={{
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true
                }}
              />
            )}
            {activeTab === 'markdown' && (
              <Editor
                height="100%"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                language="markdown"
                value={markdown}
                onChange={(val) => setMarkdown(val || '')}
                options={{
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true
                }}
              />
            )}
          </div>
        </div>

        {/* RIGHT / PREVIEW & CONSOLE PANE */}
        <div
          className={`flex-col gap-3 min-h-0 ${
            mobilePane !== 'editor' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Live Preview / Render Window */}
          <div
            className={`flex-1 rounded-2xl glass-panel border border-slate-200 dark:border-white/[0.08] overflow-hidden flex-col min-h-[220px] ${
              mobilePane === 'console' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#050811] text-xs font-mono text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {activeTab === 'json'
                    ? 'فاحص JSON التفاعلي'
                    : activeTab === 'markdown'
                    ? 'معاينة Markdown المباشرة'
                    : 'المعاينة الحية (Live Sandbox)'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {activeTab === 'json' ? 'Live Validation' : activeTab === 'markdown' ? 'Rendered Markdown' : 'Sandboxed iframe'}
              </span>
            </div>

            {/* If JSON tab: show validation & parsed view */}
            {activeTab === 'json' ? (
              <div className="p-4 flex-1 overflow-y-auto bg-slate-50 dark:bg-[#07090e] font-mono text-xs space-y-3 dir-ltr text-left">
                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    jsonStatus.valid
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300 font-medium'
                  }`}
                >
                  {jsonStatus.valid ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{jsonStatus.valid ? 'JSON Valid ✓ لا توجد أخطاء في التنسيق' : `Syntax Error: ${jsonStatus.error}`}</span>
                </div>
                <pre className="text-slate-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  <code>{json}</code>
                </pre>
              </div>
            ) : activeTab === 'markdown' ? (
              /* If Markdown tab: show rendered markdown */
              <div className="p-5 flex-1 overflow-y-auto bg-white dark:bg-[#07090e] text-slate-800 dark:text-slate-200 text-xs leading-relaxed space-y-3 dir-rtl text-right">
                <div className="prose dark:prose-invert max-w-none space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/[0.1] pb-1">
                    {markdown.split('\n')[0]?.replace('#', '') || 'معاينة المستند'}
                  </h3>
                  <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {markdown}
                  </div>
                </div>
              </div>
            ) : (
              /* HTML / CSS / JS Sandbox */
              <iframe
                key={runKey}
                title="Workbench Sandbox Preview"
                srcDoc={srcDoc}
                sandbox="allow-scripts allow-modals"
                className="w-full flex-1 bg-white dark:bg-[#07090e] border-none"
              />
            )}
          </div>

          {/* Console Output Log */}
          <div
            className={`h-44 rounded-2xl glass-panel border border-slate-200 dark:border-white/[0.08] overflow-hidden flex-col ${
              mobilePane === 'preview' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#050811] text-xs font-mono">
              <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-semibold">
                <Terminal className="w-3.5 h-3.5" />
                <span>مخرجات الكونسول ({consoleLogs.length})</span>
              </div>
              <button
                onClick={clearConsole}
                className="text-[10px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>مسح</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1.5 dir-ltr text-left bg-slate-900 dark:bg-black/60">
              {consoleLogs.length === 0 ? (
                <p className="text-slate-400 italic">لا توجد مخرجات كونسول بعد...</p>
              ) : (
                consoleLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-2 ${
                      log.type === 'error'
                        ? 'text-rose-400'
                        : log.type === 'warn'
                        ? 'text-amber-400'
                        : 'text-slate-300'
                    }`}
                  >
                    <span className="text-slate-400 text-[10px]">{log.time}</span>
                    <span className="font-semibold">[{log.type.toUpperCase()}]</span>
                    <span className="whitespace-pre-wrap">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save as New Genome Version Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-dropdown rounded-2xl border border-white/[0.12] p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2 text-purple-400">
                  <Save className="w-4 h-4" />
                  <h4 className="font-bold text-white text-sm">حفظ كنسخة جينوم جديدة (Save as New Version)</h4>
                </div>
                <button onClick={() => setShowSaveModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmSaveNewGenome} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">عنوان النسخة الجديدة *</label>
                  <input
                    type="text"
                    value={newVersionTitle}
                    onChange={(e) => setNewVersionTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/[0.1] text-white outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">التقنية الأساسية</label>
                  <select
                    value={newVersionTech}
                    onChange={(e) => setNewVersionTech(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/[0.1] text-white outline-none focus:border-purple-500"
                  >
                    <option value="React">React</option>
                    <option value="Next.js">Next.js</option>
                    <option value="Node.js">Node.js</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="CSS">CSS</option>
                    <option value="HTML">HTML</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">ملاحظات التعديل والتطوير</label>
                  <textarea
                    rows={2}
                    value={newVersionNotes}
                    onChange={(e) => setNewVersionNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/[0.1] text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(false)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-slate-300 text-xs"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-glow-purple"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>حفظ في المكتبة كنسخة جديدة</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
