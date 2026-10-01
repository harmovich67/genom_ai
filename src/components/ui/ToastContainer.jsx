import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-20 md:bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`pointer-events-auto p-4 rounded-xl border glass-dropdown shadow-tactile flex items-start gap-3 text-sm ${
              toast.type === 'error'
                ? 'border-rose-300 dark:border-rose-500/40 bg-rose-50/90 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200'
                : toast.type === 'info'
                ? 'border-cyan-300 dark:border-cyan-500/40 bg-cyan-50/90 dark:bg-cyan-950/20 text-cyan-900 dark:text-cyan-200'
                : 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/90 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">{toast.title}</h4>
              {toast.message && <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
