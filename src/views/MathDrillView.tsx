import React, { useState } from 'react';
import { mathDrillNumbers } from '../data/mathDrillData';
import { useProgress } from '../context/ProgressContext';
import { 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export const MathDrillView: React.FC = () => {
  const { progress, recordMathDrillSuccess } = useProgress();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'wrong';
    message?: string;
    explanation?: string;
  }>({ status: 'idle' });
  const [showHint, setShowHint] = useState<boolean>(false);

  const currentItem = mathDrillNumbers[currentIdx];
  const isSolved = progress.mathDrillProgress.solvedNumbers.includes(currentItem.number);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(userAnswer);
    if (isNaN(parsed)) return;

    if (parsed === currentItem.largestPrime) {
      setFeedback({
        status: 'correct',
        message: 'Верно! Это наибольший простой делитель.',
        explanation: currentItem.explanation
      });
      recordMathDrillSuccess(currentItem.number);
    } else {
      let extra = '';
      if (parsed === 25 || parsed === 9 || parsed === 49) {
        extra = 'Ловушка! Это квадрат простого числа (составное число).';
      } else if (currentItem.factors.includes(parsed)) {
        extra = 'Это простой делитель, но не наибольший (взят наименьший множитель).';
      }

      setFeedback({
        status: 'wrong',
        message: `Неверно (${parsed}). ${extra}`,
        explanation: currentItem.explanation
      });
    }
  };

  const handleNext = () => {
    setFeedback({ status: 'idle' });
    setUserAnswer('');
    setShowHint(false);
    setCurrentIdx((currentIdx + 1) % mathDrillNumbers.length);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-16">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="text-amber-500" size={20} />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Тренажёр «Кирпичики»
            </h1>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Решено: {progress.mathDrillProgress.solvedNumbers.length} / {mathDrillNumbers.length}
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Отработка наибольших простых множителей и ловушек (9, 25, 49, 91, 100, 32)
        </p>
      </div>

      {/* Number Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {mathDrillNumbers.map((item, idx) => {
          const solved = progress.mathDrillProgress.solvedNumbers.includes(item.number);
          const isCurr = currentIdx === idx;

          return (
            <button
              key={item.number}
              onClick={() => {
                setCurrentIdx(idx);
                setFeedback({ status: 'idle' });
                setUserAnswer('');
                setShowHint(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap flex items-center gap-1 ${
                isCurr
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : solved
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{item.number}</span>
              {solved && <CheckCircle2 size={11} className="text-emerald-500" />}
            </button>
          );
        })}
      </div>

      {/* Main Card */}
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-5 shadow-sm text-center">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Число:
          </span>
          <div className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
            {currentItem.number}
          </div>
        </div>

        {showHint && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 text-left">
            <span className="font-semibold block mb-0.5">💡 Подсказка:</span>
            <p>{currentItem.hint}</p>
          </div>
        )}

        <form onSubmit={handleCheck} className="flex items-center justify-center gap-2 max-w-xs mx-auto">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Наибольший делитель..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 font-mono text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={!userAnswer.trim()}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
          >
            Проверить
          </button>
        </form>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <Lightbulb size={12} />
            <span>{showHint ? 'Скрыть подсказку' : 'Показать подсказку'}</span>
          </button>
        </div>

        {/* Feedback */}
        {feedback.status !== 'idle' && (
          <div className={`p-4 rounded-xl border text-left text-xs space-y-2 ${
            feedback.status === 'correct' 
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}>
            <div className="flex items-center gap-1.5 font-bold">
              {feedback.status === 'correct' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              <span>{feedback.message}</span>
            </div>
            <p className="font-mono text-slate-700 dark:text-slate-300">{feedback.explanation}</p>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold"
              >
                <span>Следующее</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
