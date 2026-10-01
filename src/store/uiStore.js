import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  lang: localStorage.getItem('genome_lang') || 'ar',
  dir: localStorage.getItem('genome_dir') || 'rtl',
  theme: localStorage.getItem('genome_theme') || 'dark',
  isCommandPaletteOpen: false,
  isMobileNavOpen: false,
  activeModal: null, // 'genomeDetail' | 'newGenome' | 'newProject' | 'settings' | 'genomeMatchModal' | 'importExport'
  modalData: null,
  aiAccessEnabled: localStorage.getItem('genome_ai_enabled') !== 'false',
  activePage: 'home', // 'home' | 'library' | 'workbench' | 'projects' | 'debug' | 'ideas' | 'challenges' | 'ai' | 'profile' | 'settings'
  toasts: [],

  setPage: (page) => set({ activePage: page }),

  setLang: (lang) => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('genome_lang', lang);
    localStorage.setItem('genome_dir', dir);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
    set({ lang, dir });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('genome_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: nextTheme });
  },

  setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  setMobileNavOpen: (isOpen) => set({ isMobileNavOpen: isOpen }),

  openModal: (modalName, data = null) => set({ activeModal: modalName, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  setAIAccessEnabled: (enabled) => {
    localStorage.setItem('genome_ai_enabled', enabled ? 'true' : 'false');
    set({ aiAccessEnabled: enabled });
  },

  addToast: (toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, title: toast.title, message: toast.message, type: toast.type || 'success' };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 4000);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }))
}));
