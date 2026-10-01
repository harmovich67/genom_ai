import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import {
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Moon,
  Globe,
  ArrowRight,
  Sparkles,
  Dna
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LockScreen() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    login,
    theme,
    toggleTheme,
    lang,
    setLang,
    addToast
  } = useUIStore();

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!password) {
      setError(true);
      return;
    }

    const success = login(password);
    if (success) {
      setIsSuccess(true);
      setError(false);
      addToast({
        title: lang === 'ar' ? 'تم فتح القفل بنجاح' : 'Dashboard Unlocked',
        message: lang === 'ar' ? 'أهلاً بك مجدداً في جينوم الكود' : 'Welcome back to Code Genome',
        type: 'success'
      });
    } else {
      setError(true);
      setIsSuccess(false);
      setPassword('');
      addToast({
        title: lang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect Password',
        message: lang === 'ar' ? 'يرجى التأكد من إدخال كلمة المرور المعتمدة' : 'Please check your authorized password',
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-slate-50 dark:bg-[#07090E] text-slate-800 dark:text-slate-100 overflow-hidden transition-colors">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Top Header Controls (Theme & Lang) */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shadow-glow-emerald">
            <Dna className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-xs font-bold font-mono tracking-wider text-slate-700 dark:text-slate-300">
            CODE GENOME
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            {lang === 'ar' ? 'English' : 'عربي'}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 shadow-sm transition-all cursor-pointer"
            title="تبديل المظهر"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600" />
            )}
          </button>
        </div>
      </div>

      {/* Main Lock Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md relative z-10 p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#0D121F]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.1] shadow-2xl space-y-6"
      >
        {/* Lock Icon Header */}
        <div className="text-center space-y-3">
          <motion.div
            animate={
              error
                ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                : isSuccess
                ? { scale: [1, 1.15, 1] }
                : {}
            }
            transition={{ duration: 0.4 }}
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border transition-all shadow-tactile ${
              error
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                : isSuccess
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {isSuccess ? (
              <Unlock className="w-8 h-8 animate-bounce" />
            ) : error ? (
              <ShieldAlert className="w-8 h-8" />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </motion.div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-2">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>{lang === 'ar' ? 'بوابة دخول مشفّرة' : 'SECURE VAULT GATEWAY'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
              {lang === 'ar' ? 'قفل الداشبورد المعرفي' : 'Unlock Dashboard'}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              {lang === 'ar'
                ? 'منصة جينوم محمية بكلمة مرور. أدخل رمز الأمان للوصول إلى لوحة التحكم وأدوات التطوير.'
                : 'This platform is protected. Enter the authorized password to access all developer tools.'}
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 pl-3.5 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder={lang === 'ar' ? 'أدخل كلمة المرور...' : 'Enter password...'}
                className={`w-full py-3 ltr:pl-10 ltr:pr-11 rtl:pr-10 rtl:pl-11 rounded-xl bg-slate-50 dark:bg-slate-900/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm font-mono tracking-wider focus:outline-none transition-all ${
                  error
                    ? 'border-rose-500 ring-2 ring-rose-500/20'
                    : 'border-slate-300 dark:border-white/[0.1] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 ltr:right-0 rtl:left-0 pr-3 pl-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-xs text-rose-500 font-medium flex items-center gap-1.5 pt-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'كلمة المرور غير صحيحة، يرجى المحاولة مجدداً.'
                      : 'Incorrect password, please try again.'}
                  </span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-glow-emerald flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            <span>{lang === 'ar' ? 'فك القفل والدخول' : 'Unlock & Access'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Footer Note */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/[0.08] text-center flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {lang === 'ar' ? 'جلسة محلية آمنة (Session Encrypted)' : 'Secure Local Encrypted Session'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
