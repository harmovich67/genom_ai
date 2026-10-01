import { create } from 'zustand';
import db from '../services/storage/db';
import { initialIdeas } from '../data/initialData';
import { aiRouter } from '../services/ai/aiRouter';
import { useProjectStore } from './projectStore';

export const useIdeaStore = create((set, get) => ({
  ideas: [],
  selectedIdea: null,
  isForging: false,
  rawInput: '',

  initializeIdeas: async () => {
    try {
      const count = await db.ideas.count();
      if (count === 0) {
        await db.ideas.bulkAdd(initialIdeas);
      }
      const ideas = await db.ideas.toArray();
      set({ ideas, selectedIdea: ideas[0] || null });
    } catch (e) {
      console.warn('DB ideas init fallback:', e);
      set({ ideas: initialIdeas, selectedIdea: initialIdeas[0] || null });
    }
  },

  setSelectedIdea: (idea) => set({ selectedIdea: idea }),
  setRawInput: (val) => set({ rawInput: val }),

  forgeIdea: async (rawText) => {
    const text = rawText || get().rawInput;
    if (!text.trim()) return null;

    set({ isForging: true });
    try {
      const result = await aiRouter.forgeIdea(text);
      const forged = result.data;
      const fullIdea = {
        ...forged,
        rawPrompt: text,
        isTurnedToProject: false,
        createdAt: new Date().toISOString()
      };

      try {
        const id = await db.ideas.add(fullIdea);
        fullIdea.id = id;
      } catch (e) {
        fullIdea.id = Date.now();
      }

      set((state) => ({
        ideas: [fullIdea, ...state.ideas],
        selectedIdea: fullIdea,
        isForging: false,
        rawInput: ''
      }));
      return fullIdea;
    } catch (e) {
      console.error('Error forging idea:', e);
      set({ isForging: false });
      return null;
    }
  },

  turnIdeaIntoProject: async (ideaId) => {
    const idea = get().ideas.find(i => i.id === ideaId);
    if (!idea) return;

    // Convert core features and phases into initial tasks
    const tasks = (idea.coreFeatures || []).map((feat, idx) => ({
      id: Date.now() + idx,
      title: feat,
      completed: false
    }));

    const newProject = {
      name: idea.title,
      description: idea.problem || idea.rawPrompt,
      stack: idea.techStack || ['React', 'JavaScript', 'Node.js'],
      goals: [
        `تحقيق إصدار MVP: ${idea.mvp || 'البناء الأولي للمنتج'}`,
        `استهداف المستخدمين: ${idea.targetUsers || 'المجتمع التقني'}`
      ],
      tasks,
      architectureNotes: idea.architecture || 'تم استخراج المعمارية عبر معمل أفكار جينوم الكود (Idea Forge).',
      progress: 0,
      timeline: 'مرحلة التأسيس الأولية'
    };

    const created = await useProjectStore.getState().addProject(newProject);

    // Mark idea as turned to project
    try {
      await db.ideas.update(ideaId, { isTurnedToProject: true });
    } catch (e) {}

    set((state) => ({
      ideas: state.ideas.map(i => i.id === ideaId ? { ...i, isTurnedToProject: true } : i),
      selectedIdea: state.selectedIdea?.id === ideaId ? { ...state.selectedIdea, isTurnedToProject: true } : state.selectedIdea
    }));

    return created;
  }
}));
