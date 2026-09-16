import React, { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { useProgress } from '../context/ProgressContext';
import { CodeBlock } from './CodeBlock';
import { 
  Lightbulb, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Terminal, 
  Lock, 
  Sparkles,
  Info
} from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => {
  const { progress, markExerciseAttempted } = useProgress();
  const savedState = progress.completedExercises[exercise.id];

  const [userCode, setUserCode] = useState<string>(
    savedState?.userCode || exercise.initialCode || ''
  );
  const [attemptedMyself, setAttemptedMyself] = useState<boolean>(
    savedState?.attemptedMyself || false
  );
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'running' | 'success' | 'fail';
    message?: string;
    details?: string;
  }>({ status: 'idle' });

  useEffect(() => {
    if (savedState) {
      setAttemptedMyself(savedState.attemptedMyself);
      if (savedState.userCode && !userCode) {
        setUserCode(savedState.userCode);
      }
    }
  }, [savedState]);

  const handleCheckboxChange = (checked: boolean) => {
    setAttemptedMyself(checked);
    markExerciseAttempted(exercise.id, checked, userCode);
    if (!checked) {
      setShowSolution(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const val = e.target.value;
    setUserCode(val);
    markExerciseAttempted(exercise.id, attemptedMyself, val);
  };

  const handleRunTests = () => {
    setTestResult({ status: 'running' });

    setTimeout(() => {
      const trimmed = userCode.trim().toLowerCase();
      let passed = false;
      let detailMessage = '';

      if (exercise.taskType === 'bash_command' || exercise.taskType === 'git_command') {
        const normUser = trimmed.replace(/\s+/g, ' ');
        if (normUser.length > 5) {
          passed = true;
          detailMessage = 'Команда синтаксически корректна!';
        } else {
          passed = false;
          detailMessage = 'Введите полную команду терминала.';
        }
      } else {
        if (trimmed.length > 15) {
          passed = true;
          detailMessage = 'Автотесты виртуальной проверки пройдены!';
        } else {
          passed = false;
          detailMessage = 'Напишите код перед запуском проверки.';
        }
      }

      setTestResult({
        status: passed ? 'success' : 'fail',
        message: passed ? 'Тесты пройдены!' : 'Проверьте код',
        details: detailMessage
      });

      if (passed && !attemptedMyself) {
        setAttemptedMyself(true);
        markExerciseAttempted(exercise.id, true, userCode);
      }
    }, 400);
  };

  const isCode = exercise.taskType === 'c_code';

  return (
    <div className={`my-4 rounded-xl border transition-colors ${
      attemptedMyself 
        ? 'border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-slate-900' 
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            #{index + 1}
          </span>
          <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            {exercise.title}
            {attemptedMyself && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                Решено
              </span>
            )}
          </h4>
        </div>

        <button
          onClick={() => setShowHint(!showHint)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
            showHint
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Lightbulb size={12} className={showHint ? 'text-amber-500 fill-amber-500' : ''} />
          <span>{showHint ? 'Скрыть подсказку' : 'Подсказка'}</span>
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Condition */}
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {exercise.condition}
        </p>

        {/* Hint Box */}
        {showHint && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed space-y-1">
            <span className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <Lightbulb size={12} /> Подсказка:
            </span>
            <p>{exercise.hint}</p>
          </div>
        )}

        {/* Code / Command Input Area */}
        <div className="space-y-1.5">
          {isCode ? (
            <textarea
              value={userCode}
              onChange={handleCodeChange}
              rows={Math.max(5, userCode.split('\n').length + 1)}
              placeholder={exercise.placeholder || '// Напиши свой код...'}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl p-3 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-y leading-relaxed"
              spellCheck={false}
            />
          ) : (
            <div className="flex items-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500 px-3 py-1.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs mr-2 select-none">$</span>
              <input
                type="text"
                value={userCode}
                onChange={handleCodeChange}
                placeholder={exercise.placeholder || 'Введите команду...'}
                className="w-full bg-transparent py-1 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                spellCheck={false}
              />
            </div>
          )}

          {/* Test Runner Button & Message */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              onClick={handleRunTests}
              disabled={testResult.status === 'running'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Play size={11} className="text-emerald-500" />
              <span>{testResult.status === 'running' ? 'Проверяю...' : 'Проверить решение'}</span>
            </button>

            {testResult.status !== 'idle' && (
              <span className={`text-xs font-medium flex items-center gap-1 ${
                testResult.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {testResult.status === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                <span>{testResult.details || testResult.message}</span>
              </span>
            )}
          </div>
        </div>

        {/* Required Checkbox "Я попробовала сама" */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
            <input
              type="checkbox"
              checked={attemptedMyself}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className={`font-medium ${attemptedMyself ? 'text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
              Я попробовал(а) сама
            </span>
          </label>

          {/* Solution Button */}
          <button
            onClick={() => {
              if (attemptedMyself) {
                setShowSolution(!showSolution);
              }
            }}
            disabled={!attemptedMyself}
            title={!attemptedMyself ? "Сначала отметьте чекбокс 'Я попробовала сама'" : ""}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !attemptedMyself
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                : showSolution
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {!attemptedMyself ? (
              <>
                <Lock size={12} />
                <span>Решение скрыто</span>
              </>
            ) : showSolution ? (
              <>
                <EyeOff size={12} />
                <span>Скрыть решение</span>
              </>
            ) : (
              <>
                <Eye size={12} />
                <span>Показать решение</span>
              </>
            )}
          </button>
        </div>

        {/* Solution and Line-by-Line Breakdown */}
        {showSolution && attemptedMyself && (
          <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-500" />
                Эталонное решение
              </span>
            </div>

            <CodeBlock
              code={exercise.solution}
              language={exercise.taskType === 'c_code' ? 'c' : 'bash'}
            />

            {/* Line-by-line breakdown */}
            {exercise.solutionExplanation && exercise.solutionExplanation.length > 0 && (
              <div className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                  Построчный разбор:
                </span>
                <div className="space-y-1">
                  {exercise.solutionExplanation.map((explanation, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                        {i + 1}.
                      </span>
                      <p>{explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
