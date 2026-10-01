import { create } from 'zustand';
import db from '../services/storage/db';
import { initialProjects, initialDecisions } from '../data/initialData';

export const useProjectStore = create((set, get) => ({
  projects: [],
  decisions: [],
  selectedProjectId: 1,
  isLoading: false,

  initializeProjects: async () => {
    try {
      set({ isLoading: true });
      const pCount = await db.projects.count();
      if (pCount === 0) {
        await db.projects.bulkAdd(initialProjects);
        await db.decisions.bulkAdd(initialDecisions);
      }
      const projects = await db.projects.toArray();
      const decisions = await db.decisions.toArray();
      set({
        projects,
        decisions,
        selectedProjectId: projects[0]?.id || 1,
        isLoading: false
      });
    } catch (e) {
      console.warn('DB project init fallback:', e);
      set({
        projects: initialProjects,
        decisions: initialDecisions,
        selectedProjectId: 1,
        isLoading: false
      });
    }
  },

  setSelectedProjectId: (id) => set({ selectedProjectId: id }),

  toggleTask: async (projectId, taskId) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedTasks = project.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    const completedCount = updatedTasks.filter(t => t.completed).length;
    const progress = Math.round((completedCount / updatedTasks.length) * 100);

    const updatedProject = { ...project, tasks: updatedTasks, progress };

    try {
      await db.projects.update(projectId, { tasks: updatedTasks, progress });
    } catch (e) {
      console.warn('DB project task update fallback:', e);
    }

    set((state) => ({
      projects: state.projects.map(p => (p.id === projectId ? updatedProject : p))
    }));
  },

  addProject: async (newProject) => {
    const project = {
      ...newProject,
      progress: 0,
      tasks: newProject.tasks || [],
      goals: newProject.goals || [],
      stack: newProject.stack || [],
      relatedSnippets: [],
      bugs: [],
      decisions: [],
      createdAt: new Date().toISOString()
    };
    try {
      const id = await db.projects.add(project);
      project.id = id;
    } catch (e) {
      project.id = Date.now();
    }
    set((state) => ({
      projects: [project, ...state.projects],
      selectedProjectId: project.id
    }));
    return project;
  },

  addDecision: async (decisionData) => {
    const decision = {
      ...decisionData,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    try {
      const id = await db.decisions.add(decision);
      decision.id = id;
    } catch (e) {
      decision.id = Date.now();
    }
    set((state) => ({
      decisions: [decision, ...state.decisions]
    }));
    return decision;
  }
}));
