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
  Minimize2,
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
    triggerRun,
    autoRun
  } = useWorkbenchStore();

  const { addGenome } = useGenomeStore();
  const { addToast, theme } = useUIStore();
  const editorRef = useRef(null);

  const [activeTab, setActiveTab] = useState('js'); // 'js' | 'html' | 'css' | 'json' | 'markdown'
  const [copied, setCopied] = useState(false);
  const [mobilePane, setMobilePane] = useState('editor'); // 'editor' | 'preview' | 'console'
  const [editorMode, setEditorMode] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'simple' : 'monaco'
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  // Close fullscreen on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Debounced auto-run to update preview without stealing editor focus
  useEffect(() => {
    if (!autoRun) return;
    const timer = setTimeout(() => {
      triggerRun();
    }, 700);
    return () => clearTimeout(timer);
  }, [html, css, js, autoRun, triggerRun]);

  const getCurrentPath = () => {
    switch (activeTab) {
      case 'html': return 'index.html';
      case 'css': return 'style.css';
      case 'json': return 'data.json';
      case 'markdown': return 'document.md';
      default: return 'script.js';
    }
  };

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html': return html;
      case 'css': return css;
      case 'json': return json;
      case 'markdown': return markdown;
      default: return js;
    }
  };

  const getCurrentLanguage = () => {
    switch (activeTab) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'markdown': return 'markdown';
      default: return 'javascript';
    }
  };

  const handleCodeChange = (newVal) => {
    switch (activeTab) {
      case 'html': setHtml(newVal); break;
      case 'css': setCss(newVal); break;
      case 'json': setJson(newVal); break;
      case 'markdown': setMarkdown(newVal); break;
      default: setJs(newVal); break;
    }
  };

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
    <div className="flex flex-col min-h-[calc(100vh-10rem)] md:h-[calc(100vh-8.5rem)] space-y-3 pb-8">
      {/* Workbench Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl glass-panel shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 shrink-0">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight font-heading">
              مختبر الأكواد الحي (Code Workbench)
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              يدعم JavaScript, HTML, CSS, JSON, Markdown مع معاينة معزولة وكونسول تفاعلي
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={triggerRun}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald transition-all cursor-pointer"
            title="تشغيل الكود"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">تشغيل (Run)</span>
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-glow-purple transition-all cursor-pointer"
            title="حفظ كنسخة جينوم جديدة"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">حفظ كنسخة</span>
          </button>

          <button
            onClick={handleCopyCurrent}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="نسخ الكود النشط"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={resetDefaults}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            title="إعادة تعيين القالب"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Tabs Switcher: Editor | Preview | Console */}
      <div className="md:hidden flex items-center p-1 rounded-2xl bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-white/[0.1] shadow-sm shrink-0 gap-1">
        <button
          onClick={() => setMobilePane('editor')}
          className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobilePane === 'editor'
              ? 'bg-emerald-600 text-white shadow-glow-emerald'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>المحرر (Code)</span>
        </button>
        <button
          onClick={() => setMobilePane('preview')}
          className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobilePane === 'preview'
              ? 'bg-emerald-600 text-white shadow-glow-emerald'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>المعاينة (Preview)</span>
        </button>
        <button
          onClick={() => setMobilePane('console')}
          className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobilePane === 'console'
              ? 'bg-emerald-600 text-white shadow-glow-emerald'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>الكونسول</span>
          {consoleLogs.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold leading-none ${
              mobilePane === 'console' ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
            }`}>
              {consoleLogs.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Split View Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
        {/* LEFT / CODE EDITOR PANE */}
        <div
          className={`flex-col rounded-2xl glass-panel border border-slate-200 dark:border-white/[0.08] overflow-hidden min-h-0 ${
            mobilePane === 'editor' ? 'flex h-[calc(100vh-17.5rem)] md:h-auto' : 'hidden md:flex'
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
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setEditorMode(editorMode === 'monaco' ? 'simple' : 'monaco')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                  editorMode === 'monaco'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold'
                    : 'bg-slate-200 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-white/[0.1]'
                }`}
                title="التبديل بين محرر Monaco ومحرر النصوص المباشر"
              >
                {editorMode === 'monaco' ? '⚡ Monaco' : '📝 Native'}
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-300 dark:border-white/[0.1] text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all cursor-pointer"
                title="ملء الشاشة بالكامل (Fullscreen Mode)"
              >
                <Maximize2 className="w-3 h-3" />
                <span className="hidden sm:inline">ملء الشاشة</span>
              </button>
            </div>
          </div>

          {/* Monaco / Code Editor Container */}
          <div dir="ltr" className="flex-1 min-h-[340px] h-full text-left relative overflow-hidden bg-white dark:bg-[#07090e]">
            {editorMode === 'monaco' ? (
              <Editor
                height="100%"
                path={getCurrentPath()}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                language={getCurrentLanguage()}
                value={getCurrentCode()}
                onChange={(val) => handleCodeChange(val || '')}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  editor.updateOptions({ readOnly: false });
                  if (monaco?.languages?.typescript) {
                    monaco.languages.typescript.javascriptDefaults?.setDiagnosticsOptions({
                      noSemanticValidation: true,
                      noSyntaxValidation: false
                    });
                  }
                }}
                loading={
                  <div className="h-full flex items-center justify-center text-slate-400 font-mono text-xs">
                    جاري تحميل المحرر...
                  </div>
                }
                options={{
                  fontSize: fontSize,
                  fontFamily: 'JetBrains Mono, "Fira Code", monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  readOnly: false,
                  domReadOnly: false,
                  cursorBlinking: 'smooth',
                  lineNumbers: 'on',
                  quickSuggestions: true,
                  suggestOnTriggerCharacters: true
                }}
              />
            ) : (
              <textarea
                dir="ltr"
                value={getCurrentCode()}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="// اكتب أو الصق كودك هنا..."
                style={{ fontSize: `${fontSize}px` }}
                className="w-full h-full p-4 font-mono leading-relaxed bg-transparent text-slate-900 dark:text-slate-100 resize-none outline-none focus:ring-0 border-none selection:bg-emerald-500/20"
                spellCheck={false}
              />
            )}
          </div>
        </div>

        {/* RIGHT / PREVIEW & CONSOLE PANE */}
        <div
          className={`flex-col gap-3 min-h-0 ${
            mobilePane !== 'editor' ? 'flex h-[calc(100vh-17.5rem)] md:h-auto' : 'hidden md:flex'
          }`}
        >
          {/* Live Preview / Render Window */}
          <div
            className={`rounded-2xl glass-panel border border-slate-200 dark:border-white/[0.08] overflow-hidden flex-col ${
              mobilePane === 'preview'
                ? 'flex flex-1 h-full min-h-0'
                : 'hidden md:flex md:flex-1 md:min-h-[220px]'
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
            className={`rounded-2xl glass-panel border border-slate-200 dark:border-white/[0.08] overflow-hidden flex-col ${
              mobilePane === 'console'
                ? 'flex flex-1 h-full min-h-0'
                : 'hidden md:flex md:h-44'
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

      {/* Fullscreen Code Editor Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-white dark:bg-[#07090E] flex flex-col w-full h-[100dvh] overflow-hidden"
          >
            {/* Fullscreen Header Control Bar */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-3 px-2 sm:px-4 py-2 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0D121F] shrink-0">
              {/* Left / Right (Brand & Language Tabs) */}
              <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                <div className="hidden md:flex items-center gap-2 shrink-0">
                  <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Code className="w-4 h-4" />
                  </div>
                  <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white whitespace-nowrap">
                    محرر الأكواد
                  </span>
                </div>

                {/* Language Tabs in Fullscreen (Scrollable pills on mobile) */}
                <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-200/70 dark:bg-white/[0.05] p-0.5 sm:p-1 rounded-xl overflow-x-auto no-scrollbar max-w-[130px] sm:max-w-none shrink">
                  {['js', 'html', 'css', 'json', 'markdown'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono transition-all shrink-0 cursor-pointer ${
                        activeTab === tab
                          ? 'bg-emerald-600 text-white font-bold shadow-glow-emerald'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab === 'markdown' ? 'MD' : tab.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions Controls (Always 1 clean row) */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {/* Font Size Adjusters */}
                <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-xl bg-slate-200/70 dark:bg-white/[0.05] text-[10px] sm:text-xs font-mono">
                  <button
                    onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                    className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="تصغير الخط"
                  >
                    -
                  </button>
                  <span className="px-0.5 sm:px-1 text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                    className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="تكبير الخط"
                  >
                    +
                  </button>
                </div>

                {/* Editor Engine Toggle */}
                <button
                  onClick={() => setEditorMode(editorMode === 'monaco' ? 'simple' : 'monaco')}
                  className={`px-2 py-1 rounded-xl text-[10px] sm:text-xs font-mono border transition-all cursor-pointer flex items-center gap-1 ${
                    editorMode === 'monaco'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold'
                      : 'bg-slate-200 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-white/[0.1]'
                  }`}
                  title="التبديل بين Monaco والمحرر البسيط"
                >
                  <span>{editorMode === 'monaco' ? '⚡' : '📝'}</span>
                  <span className="hidden sm:inline">{editorMode === 'monaco' ? 'Monaco' : 'Native'}</span>
                </button>

                {/* Quick Run */}
                <button
                  onClick={triggerRun}
                  className="w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="تشغيل الكود في المعاينة"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">تشغيل</span>
                </button>

                {/* Copy */}
                <button
                  onClick={handleCopyCurrent}
                  className="w-8 h-8 sm:w-auto sm:p-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="نسخ الكود"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {/* Exit Fullscreen Button */}
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="الخروج من ملء الشاشة (Esc)"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </div>
            </div>

            {/* Fullscreen Editor Canvas */}
            <div dir="ltr" className="flex-1 w-full h-full text-left relative overflow-hidden bg-white dark:bg-[#07090e]">
              {editorMode === 'monaco' ? (
                <Editor
                  height="100%"
                  path={getCurrentPath()}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                  language={getCurrentLanguage()}
                  value={getCurrentCode()}
                  onChange={(val) => handleCodeChange(val || '')}
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    editor.updateOptions({ readOnly: false });
                    editor.focus();
                    if (monaco?.languages?.typescript) {
                      monaco.languages.typescript.javascriptDefaults?.setDiagnosticsOptions({
                        noSemanticValidation: true,
                        noSyntaxValidation: false
                      });
                    }
                  }}
                  loading={
                    <div className="h-full flex items-center justify-center text-slate-400 font-mono text-xs">
                      جاري تحميل المحرر...
                    </div>
                  }
                  options={{
                    fontSize: fontSize,
                    fontFamily: 'JetBrains Mono, "Fira Code", monospace',
                    minimap: { enabled: typeof window !== 'undefined' && window.innerWidth >= 768 },
                    lineNumbersMinChars: 3,
                    lineDecorationsWidth: 0,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    tabSize: 2,
                    readOnly: false,
                    domReadOnly: false,
                    lineNumbers: 'on',
                    cursorBlinking: 'smooth',
                    quickSuggestions: true,
                    suggestOnTriggerCharacters: true
                  }}
                />
              ) : (
                <textarea
                  dir="ltr"
                  value={getCurrentCode()}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="// اكتب أو الصق كودك هنا..."
                  style={{ fontSize: `${fontSize}px` }}
                  className="w-full h-full p-3 sm:p-6 font-mono leading-relaxed bg-transparent text-slate-900 dark:text-slate-100 resize-none outline-none focus:ring-0 border-none selection:bg-emerald-500/20"
                  spellCheck={false}
                />
              )}
            </div>

            {/* Fullscreen Footer Status */}
            <div className="px-3 sm:px-4 py-2 sm:py-1.5 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0D121F] flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                  {getCurrentLanguage()}
                </span>
                <span>•</span>
                <span>{getCurrentCode().split('\n').length} أسطر</span>
                <span>•</span>
                <span>{getCurrentCode().length} حرف</span>
              </div>
              <span className="hidden sm:inline text-[10px] text-slate-400">
                اضغط مفتاح ESC أو زر الخروج للعودة
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
