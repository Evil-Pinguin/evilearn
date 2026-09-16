import React from 'react';
import { Lesson } from '../types';
import { lessonsData, modulesData } from '../data/lessonsData';
import { useProgress } from '../context/ProgressContext';
import { CodeBlock } from '../components/CodeBlock';
import { ExerciseCard } from '../components/ExerciseCard';
import { QuizCard } from '../components/QuizCard';
import { 
  PrimeFactorWidget, 
  HexAsciiWidget, 
  RecursionTreeWidget, 
  GridCalculatorWidget 
} from '../components/InteractiveWidgets';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  AlertCircle, 
  Lightbulb, 
  ShieldAlert, 
  Users, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface LessonViewProps {
  lessonId: string;
  onSelectLesson: (id: string) => void;
  onBackToMap: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lessonId,
  onSelectLesson,
  onBackToMap
}) => {
  const { isLessonCompleted } = useProgress();
  const lesson = lessonsData.find(l => l.id === lessonId);

  if (!lesson) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-400">Урок не найден.</p>
        <button
          onClick={onBackToMap}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
        >
          Вернуться на карту
        </button>
      </div>
    );
  }

  const currentModule = modulesData.find(m => m.id === lesson.moduleId);
  const currentIndex = lessonsData.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? lessonsData[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessonsData.length - 1 ? lessonsData[currentIndex + 1] : null;
  const isDone = isLessonCompleted(lesson.id);

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Назад к карте прогресса</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            Модуль {lesson.moduleNumber}: {currentModule?.title}
          </span>
          {isDone ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <CheckCircle2 size={13} /> Урок освоен
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 text-slate-400 text-xs border border-slate-800 font-mono">
              В процессе обучения
            </span>
          )}
        </div>
      </div>

      {/* Lesson Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/30 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 font-extrabold flex items-center justify-center font-mono shadow-md shadow-emerald-900/30">
            {lesson.number}
          </span>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Урок #{lesson.number}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lesson.title}
            </h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {lesson.subtitle}
        </p>

        <div className="pt-2 flex items-center gap-4 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Clock size={13} className="text-indigo-400" /> ~{lesson.durationMinutes} минут
          </span>
          <span className="flex items-center gap-1">
            <Sparkles size={13} className="text-amber-400" /> {lesson.exercises.length} упражнения
          </span>
          <span className="flex items-center gap-1">
            <HelpCircle size={13} className="text-emerald-400" /> {lesson.quiz.length} контрольных вопроса
          </span>
        </div>
      </div>

      {/* Theory Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="text-indigo-400" size={20} />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Теоретический материал и разбор концепций
          </h2>
        </div>

        {lesson.theoryContent.map((section, sIdx) => (
          <div key={sIdx} className="space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
              {section.title}
            </h3>

            {section.paragraphs.map((para, pIdx) => (
              <p key={pIdx} className="text-sm text-slate-300 leading-relaxed">
                {para}
              </p>
            ))}

            {/* Code snippets */}
            {section.codeSnippets?.map((snippet, cIdx) => (
              <CodeBlock
                key={cIdx}
                code={snippet.code}
                language={snippet.language}
                title={snippet.title}
              />
            ))}

            {/* Callouts */}
            {section.callouts?.map((callout, coIdx) => {
              let icon = <Lightbulb size={18} className="text-amber-400 shrink-0" />;
              let boxClass = 'bg-amber-950/20 border-amber-800/40 text-amber-200';

              if (callout.type === 'danger') {
                icon = <ShieldAlert size={18} className="text-rose-400 shrink-0" />;
                boxClass = 'bg-rose-950/20 border-rose-800/40 text-rose-200';
              } else if (callout.type === 'warning') {
                icon = <AlertCircle size={18} className="text-amber-400 shrink-0" />;
                boxClass = 'bg-amber-950/20 border-amber-800/40 text-amber-200';
              } else if (callout.type === 'peer_review') {
                icon = <Users size={18} className="text-indigo-400 shrink-0" />;
                boxClass = 'bg-indigo-950/30 border-indigo-800/40 text-indigo-200';
              } else if (callout.type === 'analogy') {
                icon = <Sparkles size={18} className="text-emerald-400 shrink-0" />;
                boxClass = 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200';
              }

              return (
                <div key={coIdx} className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${boxClass}`}>
                  <div className="mt-0.5">{icon}</div>
                  <div className="space-y-1">
                    <h5 className="font-bold">{callout.title}</h5>
                    <p className="opacity-90">{callout.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Interactive Widget if attached to lesson */}
      {lesson.interactiveWidget === 'prime_factor' && <PrimeFactorWidget />}
      {lesson.interactiveWidget === 'hex_ascii' && <HexAsciiWidget />}
      {lesson.interactiveWidget === 'recursion_tree' && <RecursionTreeWidget />}
      {lesson.interactiveWidget === 'grid_calc' && <GridCalculatorWidget />}

      {/* Exercises Section */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-400" size={20} />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Практические упражнения
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {lesson.exercises.length} задачи
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Напиши код или команду самостоятельно. После попытки отметь галочку для разбора эталонного решения.
        </p>

        {lesson.exercises.map((exercise, eIdx) => (
          <ExerciseCard key={exercise.id} exercise={exercise} index={eIdx} />
        ))}
      </div>

      {/* Quiz Section */}
      {lesson.quiz.length > 0 && (
        <div className="pt-6">
          <QuizCard lessonId={lesson.id} questions={lesson.quiz} />
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="pt-8 border-t border-slate-800 flex items-center justify-between gap-4">
        {prevLesson ? (
          <button
            onClick={() => onSelectLesson(prevLesson.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Урок {prevLesson.number}: {prevLesson.title}</span>
          </button>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <button
            onClick={() => onSelectLesson(nextLesson.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-950 active:scale-95"
          >
            <span>Следующий: Урок {nextLesson.number}</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={onBackToMap}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg"
          >
            <span>К карте прогресса</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
