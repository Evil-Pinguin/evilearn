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
  Sparkles, 
  Flame, 
  BookOpen, 
  ShieldCheck,
  FolderTree,
  FileCode,
  GitPullRequest,
  GitFork,
  Key,
  RotateCw,
  Trophy,
  Zap,
  Star
} from 'lucide-react';

interface HomeViewProps {
  onSelectLesson: (lessonId: string) => void;
  onNavigate: (view: 'exam' | 'flashcards' | 'math' | 'tools' | 'day2') => void;
}

const iconMap: Record<string, any> = {
  Terminal,
  GitBranch,
  Code,
  Cpu,
  FolderTree,
  FileCode,
  GitPullRequest,
  GitFork,
  ShieldCheck,
  Key,
  Calculator,
  Layers,
  RotateCw
};

export const HomeView: React.FC<HomeViewProps> = ({ onSelectLesson, onNavigate }) => {
  const { progress, isLessonCompleted, getModuleProgress, getTotalProgress } = useProgress();
  const totalStats = getTotalProgress();

  return (
    <div className="space-y-10 pb-20">
      {/* 1. БЛОК "МОЙ ПУТЬ" (ДНИ 1-2 ПРОЙДЕНЫ, ДЕНЬ 3 ВПЕРЕДИ, ЭКЗАМЕН ЦЕЛЬ) */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Персональный трек: студентка breashee (er-d9)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Мой путь в Школе 21: От новичка до экзамена
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('day2')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Разбор квестов Дня 2</span>
            </button>
            <button
              onClick={() => onNavigate('exam')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950 transition-all active:scale-95"
            >
              <Timer size={16} />
              <span>Экзамен (10 задач)</span>
            </button>
          </div>
        </div>

        {/* Roadmap Milestones (Дни 1-2 -> День 3 -> Экзамен) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Step 1: Days 1-2 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">Этап 1</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 size={12} /> Пройдено ✅
              </span>
            </div>
            <h4 className="font-bold text-slate-100 text-sm">Дни 1–2: База, I/O и Math</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hello, named_hello, arithmetic, max, float_compare, crack.
            </p>
          </div>

          {/* Step 2: Day 3 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/50 relative overflow-hidden space-y-2 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-amber-300 font-bold uppercase">Этап 2 (Сейчас)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1">
                <Zap size={12} /> Впереди 🎯
              </span>
            </div>
            <h4 className="font-bold text-slate-100 text-sm">День 3: D03T03 Квесты</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              1948.c, char_decode.c, quest3.c, door_functions.c. Решаем сами!
            </p>
          </div>

          {/* Step 3: Exam Goal */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/40 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase">Цель</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 flex items-center gap-1">
                <Trophy size={12} /> Финал 🏆
              </span>
            </div>
            <h4 className="font-bold text-slate-100 text-sm">Симулятор Экзамена</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              10 задач на время (45 мин) без подсказок и интернета.
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Прогресс уроков тренажёра:</span>
            <span className="text-emerald-400 font-bold">
              {totalStats.completedLessons} из {totalStats.totalLessons} уроков ({totalStats.percentage}%)
            </span>
          </div>
          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full transition-all duration-700 shadow-md shadow-emerald-500/50"
              style={{ width: `${Math.max(4, totalStats.percentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Quick Tools & Pomodoro */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            onClick={() => onNavigate('flashcards')}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Layers size={20} />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-100 text-sm">Словарь карточек</h4>
                <span className="text-[11px] font-mono text-indigo-400">60 шт</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                40 команд (ls, cd, chmod, kill, git...) + 20 концепций (%c, эпсилон, рекурсия).
              </p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('math')}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-amber-500/50 hover:bg-slate-900/90 transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Calculator size={20} />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-100 text-sm">Дрилл «Кирпичики»</h4>
                <span className="text-[11px] font-mono text-amber-400">D03</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Разложение на простые множители (91, 100, 32) и ловушки квадратов (9, 25, 49).
              </p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('day2')}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-100 text-sm">Квесты Дня 2</h4>
                <span className="text-[11px] font-mono text-emerald-400">7 квестов</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Построчный разбор боевого кода и тренировка вопросов пира на проверке.
              </p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('tools')}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-teal-500/50 hover:bg-slate-900/90 transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Terminal size={20} />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-100 text-sm">Терминал & Песочница</h4>
                <span className="text-[11px] font-mono text-teal-400">er-d9</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Консоль кампуса, Hex/ASCII конвертер и визуализатор стека рекурсии.
              </p>
            </div>
          </div>
        </div>

        {/* Pomodoro Focus Timer */}
        <div className="lg:col-span-1">
          <PomodoroTimer />
        </div>
      </div>

      {/* 4 Modules Interactive Curriculum */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Учебная программа: 4 Модуля → 12 Уроков
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Каждый урок содержит теорию, ловушки, упражнения с блокировкой и проверочный тест
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {modulesData.map((module) => {
            const modProgress = getModuleProgress(module.id);
            const isModComplete = modProgress.completed === modProgress.total && modProgress.total > 0;
            const ModIcon = iconMap[module.icon] || Terminal;

            return (
              <div 
                key={module.id}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isModComplete
                    ? 'border-emerald-500/40 bg-slate-900/70'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                {/* Module Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${module.color} text-white shadow-lg`}>
                      <ModIcon size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {module.badge}
                        </span>
                        {isModComplete && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Модуль освоен
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-100">
                        {module.title}
                      </h3>
                    </div>
                  </div>

                  {/* Module Progress percentage */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-mono text-slate-400">
                        Уроки: {modProgress.completed}/{modProgress.total}
                      </div>
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        {modProgress.percentage}%
                      </div>
                    </div>
                    <div className="w-20 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${modProgress.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Module Lessons Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {module.lessons.map(lessonId => {
                    const lesson = lessonsData.find(l => l.id === lessonId);
                    if (!lesson) return null;

                    const isDone = isLessonCompleted(lesson.id);
                    const solvedExercises = lesson.exercises.filter(
                      ex => progress.completedExercises[ex.id]?.attemptedMyself
                    ).length;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 ${
                          isDone
                            ? 'border-emerald-500/40 bg-emerald-950/10 hover:border-emerald-500/70 hover:bg-emerald-950/20'
                            : lesson.isDay3Prep
                            ? 'border-amber-500/40 bg-amber-950/10 hover:border-amber-500/70 hover:bg-amber-950/20'
                            : 'border-slate-800 bg-slate-950/50 hover:border-indigo-500/50 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="w-8 h-8 rounded-xl bg-slate-900 text-slate-300 flex items-center justify-center text-xs font-mono font-bold group-hover:scale-110 transition-transform">
                              {lesson.number}
                            </span>
                            {isDone ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <CheckCircle2 size={12} /> Пройден
                              </span>
                            ) : lesson.isDay3Prep ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                <Star size={10} className="fill-amber-400 text-amber-400" /> День 3
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                                <Circle size={10} /> В процессе
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                              {lesson.title}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                              {lesson.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Footer stats */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <span className="font-mono text-[11px]">
                            Упражнения: {solvedExercises}/{lesson.exercises.length}
                          </span>
                          <span className="flex items-center gap-1 text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">
                            Открыть <ArrowRight size={12} />
                          </span>
                        </div>
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
