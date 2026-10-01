import { create } from 'zustand';
import db from '../services/storage/db';
import { initialGenomes } from '../data/initialData';
import { findBestGenomeMatch } from '../services/search/fuzzySearch';

export const useGenomeStore = create((set, get) => ({
  genomes: [],
  selectedGenome: null,
  searchQuery: '',
  selectedTech: 'all',
  selectedStatus: 'all',
  selectedDifficulty: 'all',
  selectedType: 'all',
  viewMode: 'grid', // 'grid' | 'list' | 'graph'
  onlyFavorites: false,
  onlyAIAnalyzed: false,
  isLoading: false,
  activeMatch: null,

  initializeGenomes: async () => {
    try {
      set({ isLoading: true });
      const count = await db.genomes.count();
      if (count === 0) {
        await db.genomes.bulkAdd(initialGenomes);
      }
      const allGenomes = await db.genomes.toArray();
      set({ genomes: allGenomes, isLoading: false });
    } catch (err) {
      console.warn('Error accessing Dexie DB, falling back to initial data:', err);
      set({ genomes: initialGenomes, isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTech: (tech) => set({ selectedTech: tech }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSelectedDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
  setSelectedType: (type) => set({ selectedType: type }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleOnlyFavorites: () => set((state) => ({ onlyFavorites: !state.onlyFavorites })),
  toggleOnlyAIAnalyzed: () => set((state) => ({ onlyAIAnalyzed: !state.onlyAIAnalyzed })),
  setSelectedGenome: (genome) => set({ selectedGenome: genome }),

  addGenome: async (newGenome) => {
    const item = {
      ...newGenome,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: newGenome.isFavorite || false,
      status: newGenome.status || 'Useful',
      confidence: newGenome.confidence || '96%',
      tags: Array.isArray(newGenome.tags) ? newGenome.tags : (newGenome.tags ? String(newGenome.tags).split(',').map(s => s.trim()) : [])
    };
    try {
      const id = await db.genomes.add(item);
      item.id = id;
    } catch (e) {
      item.id = Date.now();
    }
    set((state) => ({ genomes: [item, ...state.genomes] }));
    return item;
  },

  updateGenome: async (id, updates) => {
    const updatedFields = { ...updates, updatedAt: new Date().toISOString() };
    try {
      await db.genomes.update(id, updatedFields);
    } catch (e) {
      console.warn('DB update failed, updating in memory', e);
    }
    set((state) => ({
      genomes: state.genomes.map((g) => (g.id === id ? { ...g, ...updatedFields } : g)),
      selectedGenome: state.selectedGenome?.id === id ? { ...state.selectedGenome, ...updatedFields } : state.selectedGenome
    }));
  },

  deleteGenome: async (id) => {
    try {
      await db.genomes.delete(id);
    } catch (e) {
      console.warn('DB delete failed, deleting in memory', e);
    }
    set((state) => ({
      genomes: state.genomes.filter((g) => g.id !== id),
      selectedGenome: state.selectedGenome?.id === id ? null : state.selectedGenome
    }));
  },

  toggleFavorite: async (id) => {
    const current = get().genomes.find((g) => g.id === id);
    if (!current) return;
    const isFavorite = !current.isFavorite;
    await get().updateGenome(id, { isFavorite });
  },

  checkGenomeMatch: (inputContent) => {
    const genomes = get().genomes;
    const match = findBestGenomeMatch(inputContent, genomes);
    set({ activeMatch: match });
    return match;
  },

  clearActiveMatch: () => set({ activeMatch: null })
}));
