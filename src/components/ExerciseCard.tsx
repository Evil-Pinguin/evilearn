import React, { useState, useEffect, useMemo } from 'react';
import { Exercise } from '../types';
import { useProgress } from '../context/ProgressContext';
import { CodeBlock } from './CodeBlock';
import { CodeEditor } from './CodeEditor';
import { CheckFeedback, StatusLed } from './CheckFeedback';
import { checkExercise, CheckStatus } from '../utils/liveCheck';
import {
  Lightbulb,
  Eye,
  EyeOff,
  CheckCircle2,
  Play,
  Lock,
  Sparkles,
  ArrowDownCircle
} from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

/** Переход к следующему полю ввода на уроке (Alt+Enter / кнопка «Дальше»). */
export function focusNextExerciseInput(currentId: string) {
  const nodes = Array.from(
    document.querySelectorAll<HTMLTextAreaElement>('textarea[data-exercise-input]')
  );
  const idx = nodes.findIndex(n => n.dataset.exerciseInput === currentId);
  if (idx >= 0 && idx + 1 < nodes.length) {
    const next = nodes[idx + 1];
    next.focus();
    next.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return true;
  }
  const quiz = document.querySelector('[data-quiz-block]');
  if (quiz) {
    quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  return false;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => {
  const { progress, markExerciseAttempted } = useProgress();
  const savedState = progress.completedExercises[exercise.id];

  const [userCode, setUserCode] = useState<string>(savedState?.userCode || exercise.initialCode || '');
  const [attemptedMyself, setAttemptedMyself] = useState<boolean>(savedState?.attemptedMyself || false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [justChecked, setJustChecked] = useState<CheckStatus>('empty');

  const live = useMemo(() => checkExercise(exercise, userCode), [exercise, userCode]);
  const status: CheckStatus = justChecked === 'correct' && live.status !== 'correct' ? 'partial' : live.status;

  useEffect(() => {
    if (savedState) {
      setAttemptedMyself(savedState.attemptedMyself);
    }
  }, [savedState]);

  const handleChange = (val: string) => {
    setUserCode(val);
    setJustChecked('empty');
    markExerciseAttempted(exercise.id, attemptedMyself, val);
  };

  const runCheck = () => {
    setJustChecked(live.status === 'correct' ? 'correct' : live.status === 'empty' ? 'wrong' : live.status);
    if (live.status === 'correct') {
      if (!attemptedMyself) {
        setAttemptedMyself(true);
        markExerciseAttempted(exercise.id, true, userCode);
      }
      return;
    }
    if (live.status === 'empty') {
      setUserCode(exercise.initialCode || '');
    }
  };

  const isSolved = live.status === 'correct' || attemptedMyself;

  return (
    <div
      className={`my-3 rounded-lg border bg-white dark:bg-slate-900 transition-colors ${
        isSolved ? 'border-emerald-300 dark:border-emerald-800/70' : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* Header */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">#{index + 1}</span>
          <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">{exercise.title}</h4>
          {isSolved && (
            <span className="text-[10px] px-1.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              решено
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <StatusLed status={status} />
          <button
            onClick={() => setShowHint(v => !v)}
            className={`px-2 py-1 rounded-md text-xs transition-colors flex items-center gap-1 ${
              showHint
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lightbulb size={12} className={showHint ? 'text-amber-500 fill-amber-500' : ''} />
            <span>{showHint ? 'Скрыть' : 'Подсказка'}</span>
          </button>
        </div>
      </div>

      <div className="p-3 space-y-2.5">
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{exercise.condition}</p>

        {showHint && (
          <div className="rounded-md border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/30 p-2.5 text-xs text-amber-900 dark:text-amber-200">
            <span className="font-semibold block mb-0.5">Подсказка</span>
            {exercise.hint}
          </div>
        )}

        {exercise.expectedOutput && (
          <div className="text-[11px] text-slate-500 font-mono">
            вывод должен быть: <span className="text-slate-800 dark:text-slate-200">{exercise.expectedOutput}</span>
          </div>
        )}

        <CodeEditor
          id={`input-${exercise.id}`}
          inputNavId={exercise.id}
          value={userCode}
          onChange={handleChange}
          language={exercise.taskType === 'c_code' ? 'c' : 'bash'}
          minRows={exercise.taskType === 'c_code' ? 8 : 3}
          prompt={exercise.taskType === 'c_code' ? undefined : '$'}
          placeholder={
            exercise.placeholder ||
            (exercise.taskType === 'c_code' ? '// пиши код, Enter — новая строка' : 'команда, Enter — новая строка для следующей команды')
          }
          status={status}
          onCheck={runCheck}
          onNext={() => focusNextExerciseInput(exercise.id)}
        />

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={runCheck}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold"
          >
            <Play size={11} />
            <span>Проверить</span>
          </button>
          <button
            onClick={() => focusNextExerciseInput(exercise.id)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
            title="Перейти к следующему упражнению (Alt+Enter)"
          >
            <ArrowDownCircle size={12} />
            <span>Следующее</span>
          </button>

          {status !== 'empty' && justChecked === 'empty' && (
            <span className="text-[10px] font-mono text-slate-400">живая проверка</span>
          )}
        </div>

        <CheckFeedback result={live} showMissing />

        {/* Чекбокс + решение */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
            <input
              type="checkbox"
              checked={attemptedMyself}
              onChange={e => {
                setAttemptedMyself(e.target.checked);
                markExerciseAttempted(exercise.id, e.target.checked, userCode);
                if (!e.target.checked) setShowSolution(false);
              }}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className={attemptedMyself ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-slate-500 dark:text-slate-400'}>
              Я попробовала сама
            </span>
          </label>

          <button
            onClick={() => attemptedMyself && setShowSolution(v => !v)}
            disabled={!attemptedMyself}
            title={!attemptedMyself ? "Сначала отметь «Я попробовала сама»" : ''}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
              !attemptedMyself
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {!attemptedMyself ? <Lock size={12} /> : showSolution ? <EyeOff size={12} /> : <Eye size={12} />}
            <span>{!attemptedMyself ? 'Решение скрыто' : showSolution ? 'Скрыть решение' : 'Показать решение'}</span>
          </button>
        </div>

        {showSolution && attemptedMyself && (
          <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles size={13} className="text-emerald-500" />
              Эталонное решение
            </span>

            <CodeBlock code={exercise.solution} language={exercise.taskType === 'c_code' ? 'c' : 'bash'} />

            {exercise.solutionExplanation?.length > 0 && (
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[10px] uppercase tracking-wider">
                  Построчный разбор
                </span>
                {exercise.solutionExplanation.map((explanation, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 shrink-0">{i + 1}.</span>
                    <p>{explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
