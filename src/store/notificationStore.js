import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [
    {
      id: 1,
      title: 'موعد المراجعة المتباعدة (Spaced Review)',
      message: 'لديك مفهوم "React Effects & WebSocket Subscriptions" مجدول للمراجعة اليوم لتثبيت الذاكرة.',
      type: 'review',
      time: 'منذ ساعتين',
      read: false,
      targetPage: 'challenges',
      targetTab: 'memory'
    },
    {
      id: 2,
      title: 'تطابق جينومي مكتشف (Genome Match)',
      message: 'تم رصد تطابق بنسبة 98% بين خطاف التهدئة والمشروع النشط "منصة عمرة الذكية".',
      type: 'match',
      time: 'منذ 5 ساعات',
      read: false,
      targetPage: 'library'
    },
    {
      id: 3,
      title: 'تحديث ذاكرة المشروع المعمارية',
      message: 'تم اعتماد قرار ADR جديد: استخدام Redis Distributed Lock لمسارات الدفع المتزامنة.',
      type: 'project',
      time: 'أمس',
      read: true,
      targetPage: 'projects'
    },
    {
      id: 4,
      title: 'مزامنة التخزين المحلي الآمن',
      message: 'تم حفظ ومزامنة كافة السجلات في قاعدة بيانات IndexedDB المحلية بنجاح 100%.',
      type: 'system',
      time: 'أمس',
      read: true,
      targetPage: 'home'
    }
  ],

  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    }));
  },

  addNotification: (notif) => {
    const newNotif = {
      id: Date.now(),
      time: 'الآن',
      read: false,
      ...notif
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications]
    }));
  },

  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }));
  },

  clearAll: () => set({ notifications: [] })
}));
