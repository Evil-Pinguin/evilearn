import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
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
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'lesson' | 'exam' | 'flashcards' | 'math' | 'tools' | 'day2';
  setCurrentView: (view: 'home' | 'lesson' | 'exam' | 'flashcards' | 'math' | 'tools' | 'day2') => void;
  selectedLessonId: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
}) => {
  const { progress, getTotalProgress, resetProgress } = useProgress();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalStats = getTotalProgress();

  const navItems = [
    { id: 'home', label: 'Уроки', icon: Map },
    { id: 'day2', label: 'Квесты Дня 2', icon: ShieldCheck },
    { id: 'exam', label: 'Экзамен', icon: Timer },
    { id: 'flashcards', label: 'Словарь', icon: Layers },
    { id: 'math', label: 'Кирпичики', icon: Calculator },
    { id: 'tools', label: 'Песочница', icon: Wrench }
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b bg-white/90 dark:bg-slate-950/90 border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div 
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              🐧
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                  Путь в C
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  Школа 21
                </span>
              </div>
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Stats + Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak */}
            <div 
              title="Серия активности: 3 дня"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 text-xs font-mono font-medium"
            >
              <Flame size={13} className="text-amber-500 fill-amber-500" />
              <span>{progress.streakDays} дн.</span>
            </div>

            {/* XP */}
            <div 
              title="Очки опыта"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-medium"
            >
              <Sparkles size={13} className="text-emerald-500" />
              <span>{progress.xp} XP</span>
            </div>

            {/* Progress Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
              <span>{totalStats.completedLessons}/{totalStats.totalLessons}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">({totalStats.percentage}%)</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
              aria-label="Переключить тему"
            >
              {theme === 'dark' ? (
                <Sun size={15} className="text-amber-400" />
              ) : (
                <Moon size={15} className="text-slate-700" />
              )}
            </button>

            {/* Reset */}
            <button
              onClick={resetProgress}
              title="Сбросить прогресс"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={14} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1">
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
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Прогресс: {totalStats.completedLessons}/12 уроков</span>
            <span>{progress.xp} XP</span>
          </div>
        </div>
      )}
    </header>
  );
};
