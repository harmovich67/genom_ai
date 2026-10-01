import { create } from 'zustand';

const DEFAULT_HTML = `<div class="card-container">
  <div class="glass-card">
    <div class="badge">CODE GENOME</div>
    <h2>تطبيق التهدئة التفاعلي</h2>
    <p>اكتب في الحقل أدناه لتشاهد استدعاء الدالة المهدأة:</p>
    <input type="text" id="searchInput" placeholder="ابحث في جينوم الكود..." />
    <div id="resultStatus" class="status-box">في انتظار إدخال المستخدم...</div>
  </div>
</div>`;

const DEFAULT_CSS = `body {
  margin: 0;
  padding: 24px;
  font-family: 'Alexandria', system-ui, sans-serif;
  background: #07090e;
  color: #f1f5f9;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.card-container {
  width: 100%;
  max-width: 480px;
}
.glass-card {
  background: rgba(18, 25, 43, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  backdrop-filter: blur(12px);
}
.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  padding: 4px 10px;
  border-radius: 9999px;
  margin-bottom: 12px;
}
h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
}
p {
  color: #94a3b8;
  font-size: 13px;
  margin-bottom: 20px;
}
input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(7, 9, 14, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}
input:focus {
  border-color: #10b981;
}
.status-box {
  margin-top: 18px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  font-family: monospace;
  font-size: 12px;
  color: #38bdf8;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}`;

const DEFAULT_JS = `// دالة التهدئة المخصصة (useDebounce Pattern)
function debounce(func, delay = 400) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

const input = document.getElementById('searchInput');
const statusBox = document.getElementById('resultStatus');

const handleSearch = debounce((query) => {
  console.log('⚡ [Debounced Event Fired]:', query);
  statusBox.textContent = '🚀 تم استدعاء الـ API للبحث عن: "' + query + '" بنجاح!';
  statusBox.style.color = '#10b981';
  statusBox.style.borderColor = '#10b981';
}, 500);

input.addEventListener('input', (e) => {
  statusBox.textContent = '⏳ جاري الكتابة... المؤقت قيد الانتظار.';
  statusBox.style.color = '#f59e0b';
  handleSearch(e.target.value);
});

console.log('مختبر جينوم الكود جاهز للعمل!');`;

const DEFAULT_JSON = `{\n  "app": "CODE GENOME",\n  "tagline": "اعرف الكود الذي تعرفه. واكتشف ما لا تعرفه.",\n  "version": "2.0.0",\n  "status": "Production Ready",\n  "features": [\n    "Knowledge Graph",\n    "Code Workbench",\n    "Project Memory",\n    "Debug Lab",\n    "Idea Forge"\n  ]\n}`;

const DEFAULT_MARKDOWN = `# جينوم الكود (CODE GENOME)

> اعرف الكود الذي تعرفه. واكتشف ما لا تعرفه.

نظام معرفي برمجيات متكامل يربط بين:
- **المعرفة الهندسية الدائمة**
- **مختبر التجارب الحي (Workbench)**
- **سجل القرارات المعمارية (ADR)**

\`\`\`javascript
const developer = {
  stack: ["React", "Next.js", "Node.js", "MySQL", "Salla"],
  secondBrain: "Active"
};
\`\`\`
`;

export const useWorkbenchStore = create((set, get) => ({
  html: DEFAULT_HTML,
  css: DEFAULT_CSS,
  js: DEFAULT_JS,
  json: DEFAULT_JSON,
  markdown: DEFAULT_MARKDOWN,
  activeLanguage: 'javascript', // 'html' | 'css' | 'javascript' | 'json' | 'markdown'
  activeMobileView: 'editor', // 'editor' | 'preview' | 'console'
  consoleLogs: [],
  autoRun: true,
  runKey: 1,

  setHtml: (val) => set({ html: val, runKey: get().autoRun ? get().runKey + 1 : get().runKey }),
  setCss: (val) => set({ css: val, runKey: get().autoRun ? get().runKey + 1 : get().runKey }),
  setJs: (val) => set({ js: val, runKey: get().autoRun ? get().runKey + 1 : get().runKey }),
  setJson: (val) => set({ json: val }),
  setMarkdown: (val) => set({ markdown: val }),
  setActiveLanguage: (lang) => set({ activeLanguage: lang }),
  setActiveMobileView: (view) => set({ activeMobileView: view }),
  setAutoRun: (auto) => set({ autoRun: auto }),

  triggerRun: () => set((state) => ({ runKey: state.runKey + 1 })),

  addConsoleLog: (type, message) => {
    set((state) => ({
      consoleLogs: [
        ...state.consoleLogs.slice(-50),
        { id: Date.now() + Math.random(), type, message: String(message), time: new Date().toLocaleTimeString('ar-SA') }
      ]
    }));
  },

  clearConsole: () => set({ consoleLogs: [] }),

  loadSnippetIntoWorkbench: (genome) => {
    if (!genome) return;
    const code = genome.code || '';
    if (genome.language === 'html' || code.includes('<div') || code.includes('<html')) {
      set({ html: code, activeLanguage: 'html' });
    } else if (genome.language === 'css' || code.includes('{') && code.includes(':')) {
      set({ css: code, activeLanguage: 'css' });
    } else if (genome.language === 'json' || code.startsWith('{') && code.endsWith('}')) {
      set({ json: code, activeLanguage: 'json' });
    } else if (genome.language === 'markdown' || code.startsWith('#')) {
      set({ markdown: code, activeLanguage: 'markdown' });
    } else {
      set({ js: code, activeLanguage: 'javascript' });
    }
    set((state) => ({ runKey: state.runKey + 1 }));
  },

  resetDefaults: () => set({
    html: DEFAULT_HTML,
    css: DEFAULT_CSS,
    js: DEFAULT_JS,
    json: DEFAULT_JSON,
    markdown: DEFAULT_MARKDOWN,
    consoleLogs: [],
    runKey: get().runKey + 1
  })
}));
