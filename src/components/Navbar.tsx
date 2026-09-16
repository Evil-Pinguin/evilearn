import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { 
  Terminal, 
  Map, 
  Timer, 
  Layers, 
  Calculator, 
  Wrench, 
  Flame, 
  Sparkles, 
  Menu, 
  X, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'lesson' | 'exam' | 'flashcards' | 'math' | 'tools';
  setCurrentView: (view: 'home' | 'lesson' | 'exam' | 'flashcards' | 'math' | 'tools') => void;
  selectedLessonId: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
}) => {
  const { progress, getTotalProgress, resetProgress } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalStats = getTotalProgress();

  const navItems = [
    { id: 'home', label: 'Карта прогресса', icon: Map },
    { id: 'exam', label: 'Симулятор экзамена', icon: Timer, badge: '10 задач' },
    { id: 'flashcards', label: 'Словарь карточек', icon: Layers, count: 24 },
    { id: 'math', label: 'Дрилл «Кирпичики»', icon: Calculator, badge: 'D03' },
    { id: 'tools', label: 'Инструменты & Песочница', icon: Wrench }
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-lg">🐧</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  ПУТЬ В C
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Школа 21
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono -mt-0.5">
                campus: er-d9 | breashee
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner border border-slate-700/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Stats & Badges */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Streak */}
            <div 
              title="Серия активности: 3 дня подряд!"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-bold"
            >
              <Flame size={14} className="text-amber-400 fill-amber-400 animate-pulse" />
              <span>{progress.streakDays} дн.</span>
            </div>

            {/* XP Points */}
            <div 
              title="Очки опыта (XP) за решенные задачи и тесты"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold"
            >
              <Sparkles size={14} className="text-emerald-400" />
              <span>{progress.xp} XP</span>
            </div>

            {/* Overall Progress Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Пройдено:</span>
              <span className="font-bold text-slate-100">{totalStats.completedLessons}/{totalStats.totalLessons}</span>
              <span className="text-emerald-400 font-bold">({totalStats.percentage}%)</span>
            </div>

            {/* Reset */}
            <button
              onClick={resetProgress}
              title="Сбросить прогресс"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
              <Sparkles size={12} /> {progress.xp} XP
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Прогресс: {totalStats.completedLessons}/12 уроков ({totalStats.percentage}%)</span>
            <button
              onClick={resetProgress}
              className="flex items-center gap-1 text-rose-400 hover:text-rose-300"
            >
              <RotateCcw size={12} /> Сброс
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
