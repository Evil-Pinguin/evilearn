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
      <div className="text-center py-16 space-y-3">
        <p className="text-slate-500">Урок не найден.</p>
        <button
          onClick={onBackToMap}
          className="px-3.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  const currentIndex = lessonsData.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? lessonsData[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessonsData.length - 1 ? lessonsData[currentIndex + 1] : null;
  const isDone = isLessonCompleted(lesson.id);

  return (
    <div className="space-y-4 pb-16 max-w-3xl mx-auto">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Назад ко всем урокам</span>
        </button>

        <div className="flex items-center gap-2">
          {isDone ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
              <CheckCircle2 size={12} /> Освоено
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-mono">
              В процессе
            </span>
          )}
        </div>
      </div>

      {/* Lesson Header */}
      <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Урок {lesson.number}
          </span>
          {lesson.isDay3Prep && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              День 3 ⭐
            </span>
          )}
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          {lesson.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {lesson.subtitle}
        </p>

        <div className="pt-2 flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span>~{lesson.durationMinutes} мин</span>
          <span>•</span>
          <span>{lesson.exercises.length} упражнения</span>
          <span>•</span>
          <span>{lesson.quiz.length} вопроса теста</span>
        </div>
      </div>

      {/* Theory Sections */}
      <div className="space-y-5">
        {lesson.theoryContent.map((section, sIdx) => (
          <div key={sIdx} className="p-5 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {section.title}
            </h3>

            {section.paragraphs.map((para, pIdx) => (
              <p key={pIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {para}
              </p>
            ))}

            {/* Tables if any */}
            {section.tables?.map((table, tIdx) => (
              <div key={tIdx} className="overflow-x-auto my-2 rounded-md border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    <tr>
                      {table.headers.map((h, hIdx) => (
                        <th key={hIdx} className="p-2.5 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 font-mono text-slate-600 dark:text-slate-300">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              let boxClass = 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200';
              if (callout.type === 'danger') {
                boxClass = 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200';
              } else if (callout.type === 'peer_review') {
                boxClass = 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
              } else if (callout.type === 'analogy') {
                boxClass = 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200';
              }

              return (
                <div key={coIdx} className={`p-3.5 rounded-md border text-xs leading-relaxed space-y-1 ${boxClass}`}>
                  <h5 className="font-bold">{callout.title}</h5>
                  <p className="whitespace-pre-wrap">{callout.content}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Interactive Widget if present */}
      {lesson.interactiveWidget === 'prime_factor' && <PrimeFactorWidget />}
      {lesson.interactiveWidget === 'hex_ascii' && <HexAsciiWidget />}
      {lesson.interactiveWidget === 'recursion_tree' && <RecursionTreeWidget />}
      {lesson.interactiveWidget === 'grid_calc' && <GridCalculatorWidget />}

      {/* Exercises */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Практические упражнения
        </h3>
        {lesson.exercises.map((exercise, eIdx) => (
          <ExerciseCard key={exercise.id} exercise={exercise} index={eIdx} />
        ))}
      </div>

      {/* Quiz */}
      {lesson.quiz.length > 0 && (
        <div className="pt-2">
          <QuizCard lessonId={lesson.id} questions={lesson.quiz} />
        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        {prevLesson ? (
          <button
            onClick={() => onSelectLesson(prevLesson.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
          >
            <ArrowLeft size={13} />
            <span>Урок {prevLesson.number}</span>
          </button>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <button
            onClick={() => onSelectLesson(nextLesson.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            <span>Урок {nextLesson.number}: {nextLesson.title}</span>
            <ArrowRight size={13} />
          </button>
        ) : (
          <button
            onClick={onBackToMap}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold"
          >
            <span>К списку уроков</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};
