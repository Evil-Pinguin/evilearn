import React from 'react';
import { modulesData, lessonsData } from '../data/lessonsData';
import { useProgress } from '../context/ProgressContext';
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
  AlertTriangle,
  FolderTree,
  FileCode,
  GitPullRequest,
  GitFork,
  Key
} from 'lucide-react';

interface HomeViewProps {
  onSelectLesson: (lessonId: string) => void;
  onNavigate: (view: 'exam' | 'flashcards' | 'math' | 'tools') => void;
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
  Layers
};

export const HomeView: React.FC<HomeViewProps> = ({ onSelectLesson, onNavigate }) => {
  const { progress, isLessonCompleted, getModuleProgress, getTotalProgress } = useProgress();
  const totalStats = getTotalProgress();

  return (
    <div className="space-y-10 pb-16">
      {/* Hero / Motivation Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Индивидуальная программа закрепления после D03T03
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Тренажёр «Путь в C» — Освой C без слепого копирования
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Пошаговая подготовка к peer-review и экзаменам Школы 21. Решения упражнений открываются <span className="text-emerald-400 font-semibold">только после самостоятельной попытки</span>. Разбираем подводные камни терминала, Git, математики простых делителей и указателей.
          </p>

          {/* Progress Bar in Hero */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Общий прогресс курса:</span>
              <span className="text-emerald-400 font-bold">{totalStats.completedLessons} из {totalStats.totalLessons} уроков ({totalStats.percentage}%)</span>
            </div>
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-700 shadow-md shadow-emerald-500/50"
                style={{ width: `${Math.max(4, totalStats.percentage)}%` }}
              />
            </div>
          </div>

          {/* Quick diagnostic highlight */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('math')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-all active:scale-95"
            >
              <Calculator size={16} />
              <span>Дрилл: простые числа 91, 100, 32 & ловушки</span>
            </button>
            <button
              onClick={() => onNavigate('exam')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-950 transition-all active:scale-95"
            >
              <Timer size={16} />
              <span>Сдать симулятор экзамена (10 задач)</span>
            </button>
            <button
              onClick={() => onNavigate('flashcards')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
            >
              <Layers size={16} />
              <span>Флеш-карточки команд (24 шт)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
            💡
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-slate-200 text-sm">Правило тренажёра: «Сначала попробуй сама»</h4>
            <p className="text-slate-400 leading-relaxed">
              Кнопка решения заблокирована, пока ты не отметишь галочку «Я попробовала сама». Раздел отмечается пройденным, когда решены все упражнения или тест сдан на 80%+.
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono shrink-0">
          Квесты D03: <span className="text-emerald-400 font-bold">5/5 PASS ✅</span>
        </div>
      </div>

      {/* 4 Modules Interactive Roadmap */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Карта обучения: 4 Модуля → 12 Уроков
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Последовательный путь от команд терминала до алгоритмов Школы 21
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
                    const quizResult = progress.quizScores[lesson.id];
                    const exercisesCount = lesson.exercises.length;
                    const solvedExercises = lesson.exercises.filter(
                      ex => progress.completedExercises[ex.id]?.attemptedMyself
                    ).length;

                    const LessonIcon = iconMap[lesson.icon] || Code;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 ${
                          isDone
                            ? 'border-emerald-500/40 bg-emerald-950/10 hover:border-emerald-500/70 hover:bg-emerald-950/20'
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
                            Упражнения: {solvedExercises}/{exercisesCount}
                          </span>
                          <span className="flex items-center gap-1 text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">
                            Начать <ArrowRight size={12} />
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
