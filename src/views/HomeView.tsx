import React from 'react';
import { modulesData, lessonsData } from '../data/lessonsData';
import { useProgress } from '../context/ProgressContext';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Terminal, 
  GitBranch, 
  Code, 
  Cpu, 
  Timer, 
  Layers, 
  Calculator, 
  ShieldCheck,
  Star
} from 'lucide-react';

interface HomeViewProps {
  onSelectLesson: (lessonId: string) => void;
  onNavigate: (view: 'exam' | 'flashcards' | 'math' | 'tools' | 'day2') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectLesson, onNavigate }) => {
  const { progress, isLessonCompleted, getModuleProgress, getTotalProgress } = useProgress();
  const totalStats = getTotalProgress();

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Clean Path Summary Header */}
      <div className="p-5 sm:p-7 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Школа 21 • er-d9 • breashee
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Путь в C: Программа закрепления
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('exam')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Timer size={14} />
              <span>Экзамен (10 задач)</span>
            </button>
            <button
              onClick={() => onNavigate('day2')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors"
            >
              Квесты Дня 2
            </button>
          </div>
        </div>

        {/* 3 Steps Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">1. Дни 1–2</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Сдано ✅</span>
            </div>
            <p className="text-[11px] text-slate-500">
              База C, printf/scanf, math.h, эпсилон.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-800 dark:text-amber-300">2. День 3 (D03)</span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">Решаю сама 💪</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Уроки 7, 9, 10, 11, 12 как подготовка.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">3. Экзамен</span>
              <span className="text-[10px] text-slate-500 font-mono">10 задач 🎯</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Проверка готовности без стресса.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Прогресс курса:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {totalStats.completedLessons} из {totalStats.totalLessons} уроков ({totalStats.percentage}%)
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.max(3, totalStats.percentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Access Tools Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('flashcards')}
          className="p-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-left transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <Layers size={14} className="text-indigo-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Словарь</span>
          </div>
          <p className="text-[11px] text-slate-500">60 карточек команд и правил</p>
        </button>

        <button
          onClick={() => onNavigate('math')}
          className="p-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-left transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <Calculator size={14} className="text-amber-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Кирпичики</span>
          </div>
          <p className="text-[11px] text-slate-500">Простые множители и 91, 100, 32</p>
        </button>

        <button
          onClick={() => onNavigate('day2')}
          className="p-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-left transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Квесты Дня 2</span>
          </div>
          <p className="text-[11px] text-slate-500">Построчный разбор решений</p>
        </button>

        <button
          onClick={() => onNavigate('tools')}
          className="p-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-left transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <Terminal size={14} className="text-teal-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Песочница</span>
          </div>
          <p className="text-[11px] text-slate-500">Консоль er-d9 и утилиты</p>
        </button>
      </div>

      {/* 4 Modules & 12 Lessons */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Уроки (4 модуля)
          </h2>
        </div>

        <div className="space-y-4">
          {modulesData.map(module => {
            const modProgress = getModuleProgress(module.id);
            const isModComplete = modProgress.completed === modProgress.total && modProgress.total > 0;

            return (
              <div 
                key={module.id}
                className="rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                {/* Module Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {module.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">{module.description}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {modProgress.completed}/{modProgress.total}
                  </span>
                </div>

                {/* Lessons in Module */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {module.lessons.map(lessonId => {
                    const lesson = lessonsData.find(l => l.id === lessonId);
                    if (!lesson) return null;

                    const isDone = isLessonCompleted(lesson.id);

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {lesson.number}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {lesson.title}
                              </h4>
                              {isDone && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                                  Пройден
                                </span>
                              )}
                              {lesson.isDay3Prep && !isDone && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium">
                                  День 3 ⭐
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {lesson.subtitle}
                            </p>
                          </div>
                        </div>

                        <span className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
