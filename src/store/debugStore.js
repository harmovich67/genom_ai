import { create } from 'zustand';
import db from '../services/storage/db';
import { initialBugs } from '../data/initialData';
import { aiRouter } from '../services/ai/aiRouter';

export const useDebugStore = create((set, get) => ({
  bugs: [],
  activeBug: null,
  activeAnalysis: null,
  isAnalyzing: false,
  errorInput: '',
  codeInput: '',
  envInput: 'Node.js / React 18',
  stackTraceInput: '',

  initializeBugs: async () => {
    try {
      const count = await db.bugs.count();
      if (count === 0) {
        await db.bugs.bulkAdd(initialBugs);
      }
      const bugs = await db.bugs.toArray();
      set({ bugs, activeBug: bugs[0] || null });
    } catch (e) {
      console.warn('DB bugs init fallback:', e);
      set({ bugs: initialBugs, activeBug: initialBugs[0] || null });
    }
  },

  setActiveBug: (bug) => set({ activeBug: bug }),
  setErrorInput: (val) => set({ errorInput: val }),
  setCodeInput: (val) => set({ codeInput: val }),
  setEnvInput: (val) => set({ envInput: val }),
  setStackTraceInput: (val) => set({ stackTraceInput: val }),

  runDebugAnalysis: async () => {
    const { errorInput, codeInput, envInput, stackTraceInput } = get();
    if (!errorInput.trim() && !codeInput.trim()) return null;

    set({ isAnalyzing: true });
    try {
      const result = await aiRouter.analyzeBug({
        error: errorInput,
        code: codeInput,
        environment: envInput,
        stackTrace: stackTraceInput
      });

      const analysis = result.data;
      set({ activeAnalysis: analysis, isAnalyzing: false });
      return analysis;
    } catch (err) {
      console.error('Debug analysis error:', err);
      set({ isAnalyzing: false });
      return null;
    }
  },

  saveBugCase: async (bugData) => {
    const item = {
      ...bugData,
      createdAt: new Date().toISOString(),
      confidence: bugData.confidence || 'Known'
    };
    try {
      const id = await db.bugs.add(item);
      item.id = id;
    } catch (e) {
      item.id = Date.now();
    }
    set((state) => ({
      bugs: [item, ...state.bugs],
      activeBug: item
    }));
    return item;
  }
}));
