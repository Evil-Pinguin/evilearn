import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { ViewId } from '../types';
import { Map, ShieldCheck, Timer, Layers, Calculator, Wrench, Flame, BookOpen, Menu, X, RotateCcw, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentView: ViewId;
  setCurrentView: (view: ViewId) => void;
  selectedLessonId: string | null;
}

const NAV_ITEMS: { id: ViewId; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Уроки', icon: Map },
  { id: 'commands', label: 'Команды', icon: BookOpen },
  { id: 'day2', label: 'Квесты Дня 2', icon: ShieldCheck },
  { id: 'flashcards', label: 'Словарь', icon: Layers },
  { id: 'exam', label: 'Экзамен', icon: Timer },
  { id: 'math', label: 'Кирпичики', icon: Calculator },
  { id: 'tools', label: 'Песочница', icon: Wrench }
];

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { progress, getTotalProgress, resetProgress } = useProgress();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalStats = getTotalProgress();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 gap-3">
          {/* Логотип */}
          <button
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 shrink-0"
          >
            <span className="text-base leading-none">🐧</span>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">Путь в C</span>
            <span className="hidden sm:inline text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              21
            </span>
          </button>

          {/* Меню */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={13} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Справа */}
          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1 text-[11px] font-mono text-slate-500" title="Серия дней">
              <Flame size={12} className="text-amber-500" /> {progress.streakDays}
            </span>
            <span className="hidden md:flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400" title="XP">
              {progress.xp} XP
            </span>
            <span className="hidden sm:flex items-center text-[11px] font-mono text-slate-500" title="Пройдено уроков">
              {totalStats.completedLessons}/{totalStats.totalLessons}
            </span>

            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={resetProgress}
              title="Сбросить прогресс"
              className="hidden sm:block p-1.5 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RotateCcw size={13} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="lg:hidden p-1.5 rounded-md text-slate-600 dark:text-slate-300"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono text-slate-500">
            <span>уроки {totalStats.completedLessons}/{totalStats.totalLessons}</span>
            <span>{progress.xp} XP</span>
          </div>
        </div>
      )}
    </header>
  );
};
