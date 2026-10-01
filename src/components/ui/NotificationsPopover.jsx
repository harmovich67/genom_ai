import React, { useState, useRef, useEffect } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { useUIStore } from '../../store/uiStore';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Clock,
  Sparkles,
  Brain,
  FolderGit2,
  ShieldCheck,
  ArrowRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotificationStore();

  const { setPage } = useUIStore();
  const unread = unreadCount();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    if (notif.targetPage) {
      setPage(notif.targetPage);
    }
    setIsOpen(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'review':
        return <Brain className="w-4 h-4 text-amber-400" />;
      case 'match':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'project':
        return <FolderGit2 className="w-4 h-4 text-purple-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="الإشعارات والتنبيهات المعرفية"
        className="relative w-8 h-8 sm:w-auto p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-emerald-500 text-black font-bold text-[9px] flex items-center justify-center shadow-glow-emerald animate-pulse">
            {unread}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop overlay */}
            <div
              onClick={() => setIsOpen(false)}
              className="sm:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-x-3 top-20 sm:top-auto sm:inset-auto sm:absolute ltr:sm:right-0 rtl:sm:left-0 sm:mt-2 w-auto sm:w-96 max-w-full sm:max-w-[24rem] rounded-2xl glass-dropdown border border-slate-200 dark:border-white/[0.12] shadow-2xl overflow-hidden z-50 flex flex-col max-h-[75vh] sm:max-h-[85vh]"
            >
            {/* Popover Header */}
            <div className="p-3.5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-black/40">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                  التنبيهات البرمجية ({notifications.length})
                </h4>
              </div>

              <div className="flex items-center gap-1.5">
                {unread > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] flex items-center gap-1 transition-colors"
                    title="تحديد الكل كمقروء"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>تحديد الكل</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 text-[11px] transition-colors"
                    title="مسح الكل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Notification Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.06] p-1">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-xs">
                  <Bell className="w-7 h-7 mx-auto mb-2 opacity-30" />
                  <p>لا توجد إشعارات جديدة حالياً.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all cursor-pointer flex items-start gap-3 group ${
                      !notif.read ? 'bg-emerald-500/[0.08] dark:bg-emerald-500/[0.04]' : ''
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] shrink-0 mt-0.5">
                      {getTypeIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h5
                          className={`text-xs font-bold truncate ${
                            !notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {notif.title}
                        </h5>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                    </div>

                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0 mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-black/40 text-center">
              <span className="text-[10px] text-slate-500 font-mono">
                تنبيهات فورية لنظام المراجعة المتباعدة والجينوم
              </span>
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>
    </div>
  );
}
