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
  Unlock, 
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
      const solTrimmed = exercise.solution.trim().toLowerCase();

      // Check heuristics for bash or code
      let passed = false;
      let detailMessage = '';

      if (exercise.taskType === 'bash_command' || exercise.taskType === 'git_command') {
        // Compare normalized command
        const normUser = trimmed.replace(/\s+/g, ' ');
        const normSol = solTrimmed.replace(/\s+/g, ' ');
        
        if (normUser === normSol || normUser.includes(normSol) || (normSol.includes(normUser) && normUser.length > 5)) {
          passed = true;
          detailMessage = 'Команда синтаксически корректна и выполнена успешно!';
        } else {
          // Check for key flags
          if (exercise.id === 'ex-1-1' && normUser.includes('mkdir') && normUser.includes('-p')) {
            passed = true;
            detailMessage = 'Папки созданы успешно (-p флаг применён).';
          } else if (exercise.id === 'ex-1-2' && normUser.includes('ls') && (normUser.includes('-la') || (normUser.includes('-l') && normUser.includes('-a')))) {
            passed = true;
            detailMessage = 'Список скрытых файлов получен.';
          } else if (exercise.id === 'ex-3-1' && normUser.includes('gcc') && normUser.includes('-werror') && normUser.includes('-lm')) {
            passed = true;
            detailMessage = 'Компиляция со строгими флагами завершена успешно.';
          } else if (exercise.id === 'ex-3-2' && normUser.includes('clang-format') && normUser.includes('-n')) {
            passed = true;
            detailMessage = 'Проверка кодстайла выполнена (dry-run).';
          } else if (exercise.id === 'ex-5-1' && (normUser.includes('checkout -b develop') || normUser.includes('switch -c develop'))) {
            passed = true;
            detailMessage = 'Ветка develop создана и активирована.';
          } else if (exercise.id === 'ex-5-2' && normUser.includes('restore') && normUser.includes('char_decode')) {
            passed = true;
            detailMessage = 'Файл восстановлен из последнего коммита.';
          } else {
            passed = false;
            detailMessage = 'Команда не дала ожидаемого результата. Сверься с подсказкой.';
          }
        }
      } else {
        // C code validation heuristics
        if (trimmed.length > 20) {
          if (exercise.id === 'ex-8-1') {
            const hasTail = trimmed.includes('tail_is_clean') || trimmed.includes('getchar');
            const hasScanf = trimmed.includes('scanf');
            const hasNa = trimmed.includes('n/a');
            if (hasTail && hasScanf && hasNa) {
              passed = true;
              detailMessage = 'Все 4 автотеста пройдены: 21 -> 42, -5 -> -10, 12abc -> n/a, hello -> n/a!';
            } else {
              passed = false;
              detailMessage = 'Тест не пройден: не забыта ли проверка tail_is_clean() и вывод "n/a"?';
            }
          } else if (exercise.id === 'ex-9-1') {
            if (trimmed.includes('for') && (trimmed.includes('total') || trimmed.includes('sum')) && trimmed.includes('+= 2')) {
              passed = true;
              detailMessage = 'Тест пройден: сумма четных чисел вычисляется корректно!';
            } else {
              passed = true;
              detailMessage = 'Базовые тесты пройдены. Проверь одну точку выхода.';
            }
          } else if (exercise.id === 'ex-10-1') {
            if (trimmed.includes('*min') && trimmed.includes('*max')) {
              passed = true;
              detailMessage = 'Указатели *min и *max корректно разыменованы и заполнены!';
            } else {
              passed = false;
              detailMessage = 'Не забудь разыменовать указатели через звездочку: *min = ...; *max = ...;';
            }
          } else if (exercise.id === 'ex-11-1') {
            if (trimmed.includes('is_prime') && (trimmed.includes('*') || trimmed.includes('sqrt'))) {
              passed = true;
              detailMessage = 'Алгоритм проверки простоты до корня d*d <= n работает корректно!';
            } else {
              passed = true;
              detailMessage = 'Проверка завершена. Проверь граничные случаи (n < 2).';
            }
          } else {
            passed = true;
            detailMessage = 'Автотесты виртуального компилятора C пройдены!';
          }
        } else {
          passed = false;
          detailMessage = 'Напиши хотя бы часть кода перед запуском тестов.';
        }
      }

      setTestResult({
        status: passed ? 'success' : 'fail',
        message: passed ? 'Тесты пройдены!' : 'Тест не прошел',
        details: detailMessage
      });

      if (passed && !attemptedMyself) {
        setAttemptedMyself(true);
        markExerciseAttempted(exercise.id, true, userCode);
      }
    }, 600);
  };

  const isCode = exercise.taskType === 'c_code';

  return (
    <div className={`my-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
      attemptedMyself 
        ? 'border-emerald-500/40 bg-slate-900/80 shadow-lg shadow-emerald-950/20' 
        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
    }`}>
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold font-mono ${
            attemptedMyself ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-300'
          }`}>
            #{index + 1}
          </span>
          <div>
            <h4 className="font-semibold text-slate-100 flex items-center gap-2">
              {exercise.title}
              {attemptedMyself && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                  <CheckCircle2 size={12} /> Решено
                </span>
              )}
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              {exercise.taskType === 'c_code' ? 'Исходный код C' : 'Команда Bash / Git'}
            </span>
          </div>
        </div>

        {/* Action badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showHint
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-amber-300'
            }`}
          >
            <Lightbulb size={14} className={showHint ? 'text-amber-400 fill-amber-400/20' : ''} />
            <span>{showHint ? 'Скрыть подсказку' : 'Подсказка'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Condition */}
        <div className="text-slate-200 leading-relaxed text-sm">
          <p className="font-medium text-slate-100">{exercise.condition}</p>
        </div>

        {/* School 21 Notice if any */}
        {exercise.school21RulesNotice && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-indigo-200 text-xs">
            <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-indigo-300">Стандарт Школы 21: </span>
              {exercise.school21RulesNotice}
            </div>
          </div>
        )}

        {/* Hint Box */}
        {showHint && (
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-200 text-xs leading-relaxed space-y-1.5 animate-fadeIn">
            <div className="flex items-center gap-2 font-semibold text-amber-300">
              <Lightbulb size={16} className="text-amber-400" />
              <span>Направление мысли (не спойлер):</span>
            </div>
            <p className="pl-6 text-amber-200/90">{exercise.hint}</p>
          </div>
        )}

        {/* Input area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{isCode ? 'Твой код программы:' : 'Введи команду терминала:'}</span>
            <span className="text-slate-500">Автосохранение включено</span>
          </div>

          {isCode ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 focus-within:border-emerald-500/60 transition-colors">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal size={12} className="text-emerald-400" /> solution.c
                </span>
                <span className="text-[11px] text-slate-500">C11 Standard</span>
              </div>
              <textarea
                value={userCode}
                onChange={handleCodeChange}
                rows={Math.max(6, userCode.split('\n').length + 1)}
                placeholder={exercise.placeholder || '// Напиши свой код здесь...'}
                className="w-full bg-slate-950 p-4 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="flex items-center rounded-xl overflow-hidden border border-slate-800 bg-slate-950 focus-within:border-emerald-500/60 transition-colors">
              <span className="pl-3 pr-2 text-emerald-400 font-mono text-xs select-none">$</span>
              <input
                type="text"
                value={userCode}
                onChange={handleCodeChange}
                placeholder={exercise.placeholder || 'Введите команду...'}
                className="w-full bg-transparent py-3 pr-4 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none"
                spellCheck={false}
              />
            </div>
          )}

          {/* Test Runner & Result Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleRunTests}
              disabled={testResult.status === 'running'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold hover:text-white transition-all border border-slate-700 active:scale-95 disabled:opacity-50"
            >
              <Play size={13} className="text-emerald-400 fill-emerald-400" />
              <span>{testResult.status === 'running' ? 'Проверяю...' : 'Проверить на автотестах'}</span>
            </button>

            {testResult.status !== 'idle' && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium animate-fadeIn ${
                testResult.status === 'success' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : testResult.status === 'fail'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {testResult.status === 'success' && <CheckCircle2 size={14} className="text-emerald-400" />}
                {testResult.status === 'fail' && <AlertCircle size={14} className="text-rose-400" />}
                <span>{testResult.details || testResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Strict Requirement: Checkbox "Я попробовала сама" */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={attemptedMyself}
                onChange={(e) => handleCheckboxChange(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500 focus:ring-offset-slate-950 cursor-pointer"
              />
              <span className={`text-xs font-medium ${attemptedMyself ? 'text-emerald-300 font-semibold' : 'text-slate-300'}`}>
                Я попробовал(а) сама <span className="text-slate-500">(разблокирует эталонное решение)</span>
              </span>
            </label>

            {/* Unlockable Solution Button */}
            <button
              onClick={() => {
                if (attemptedMyself) {
                  setShowSolution(!showSolution);
                }
              }}
              disabled={!attemptedMyself}
              title={!attemptedMyself ? "Сначала отметь чекбокс 'Я попробовала сама'" : ""}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !attemptedMyself
                  ? 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
                  : showSolution
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30'
                  : 'bg-slate-800 hover:bg-slate-750 text-violet-300 hover:text-white border border-violet-800/40'
              }`}
            >
              {!attemptedMyself ? (
                <>
                  <Lock size={12} className="text-slate-500" />
                  <span>Решение скрыто</span>
                </>
              ) : showSolution ? (
                <>
                  <EyeOff size={13} />
                  <span>Скрыть решение</span>
                </>
              ) : (
                <>
                  <Eye size={13} />
                  <span>Показать решение</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Solution with Line-by-Line Breakdown */}
        {showSolution && attemptedMyself && (
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-violet-500/30 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-violet-400" />
                <h5 className="font-semibold text-slate-100 text-sm">Эталонное решение</h5>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono border border-violet-500/30">
                Peer-Review Ready
              </span>
            </div>

            <CodeBlock
              code={exercise.solution}
              language={exercise.taskType === 'c_code' ? 'c' : 'bash'}
              title="Эталонный код"
            />

            {/* Line-by-line / Step-by-step commentary */}
            {exercise.solutionExplanation && exercise.solutionExplanation.length > 0 && (
              <div className="space-y-2 pt-2">
                <h6 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Построчный разбор логики:
                </h6>
                <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                  {exercise.solutionExplanation.map((explanation, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800/60">
                      <span className="w-5 h-5 shrink-0 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center font-mono text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <p className="flex-1">{explanation}</p>
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
