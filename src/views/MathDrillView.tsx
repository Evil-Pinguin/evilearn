import React, { useState } from 'react';
import { mathDrillNumbers, MathDrillItem } from '../data/mathDrillData';
import { useProgress } from '../context/ProgressContext';
import { 
  Calculator, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  HelpCircle,
  RotateCcw,
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
        message: '🎉 Точно в цель! Это наибольший простой делитель.',
        explanation: currentItem.explanation
      });
      recordMathDrillSuccess(currentItem.number);
    } else {
      let extra = '';
      if (parsed === currentItem.number) {
        extra = 'Число составное, оно не может быть ответом.';
      } else if (currentItem.factors.includes(parsed) && parsed !== currentItem.largestPrime) {
        extra = 'Это простой делитель, но НЕ наибольший! (Взята наименьшая кирпичина)';
      } else if (parsed === 25 || parsed === 9 || parsed === 49) {
        extra = 'Ловушка! Это квадрат простого числа, то есть СОСТАВНОЕ число!';
      }

      setFeedback({
        status: 'wrong',
        message: `❌ Неверно (${parsed}). ${extra}`,
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
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Hero */}
      <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Calculator size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">
                  Тренажёр «Кирпичики»
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  Квест 1 D03
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Дрилл наибольших простых делителей & ловушек (9, 25, 49, 91, 100, 32)
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 block text-[10px]">Решено:</span>
              <span className="text-emerald-400 font-bold text-sm">
                {progress.mathDrillProgress.solvedNumbers.length} / {mathDrillNumbers.length}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 block text-[10px]">Серия:</span>
              <span className="text-amber-400 font-bold text-sm flex items-center justify-center gap-1">
                <Flame size={12} className="fill-amber-400" /> {progress.mathDrillProgress.streak}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Rules Reminder */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-[11px] font-medium text-slate-300">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <span>🧱</span>
            <span>Ломай до атомов (не останавливайся на 25 или 9)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <span>⭐</span>
            <span>Ответ — ПОСЛЕДНИЙ вынутый множитель (наибольший)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <span>🔍</span>
            <span>Сверяй по списку простых: 2, 3, 5, 7, 11, 13, 17...</span>
          </div>
        </div>
      </div>

      {/* Number Selection Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isCurr
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-400'
                  : solved
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{item.number}</span>
              {solved && <CheckCircle2 size={11} className="text-emerald-400" />}
              {item.isTrap && !solved && <span className="text-[10px] text-amber-400">⚠️</span>}
            </button>
          );
        })}
      </div>

      {/* Active Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Число для разложения:
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
              {currentItem.number}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentItem.isTrap && (
              <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold flex items-center gap-1">
                <AlertTriangle size={12} /> Число-Ловушка
              </span>
            )}
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
            >
              <Lightbulb size={13} className="text-amber-400" />
              <span>{showHint ? 'Скрыть подсказку' : 'Подсказка'}</span>
            </button>
          </div>
        </div>

        {showHint && (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 leading-relaxed animate-fadeIn">
            <div className="font-semibold text-amber-300 mb-1">💡 Направление мысли:</div>
            <p>{currentItem.hint}</p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleCheck} className="space-y-4">
          <label className="block text-xs text-slate-300 font-medium">
            Назови НАИБОЛЬШИЙ простой делитель для числа {currentItem.number}:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Например: 13..."
              className="w-full max-w-xs bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-2xl px-4 py-3 font-mono text-base font-bold text-emerald-400 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={!userAnswer.trim()}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow-lg shadow-amber-950 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              Проверить ответ
            </button>
          </div>
        </form>

        {/* Feedback area */}
        {feedback.status !== 'idle' && (
          <div className={`p-5 rounded-2xl border space-y-3 animate-fadeIn ${
            feedback.status === 'correct' 
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {feedback.status === 'correct' ? (
                <CheckCircle2 size={18} className="text-emerald-400" />
              ) : (
                <XCircle size={18} className="text-rose-400" />
              )}
              <span>{feedback.message}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
              <span className="text-amber-300 font-semibold block mb-1">Разложение на кирпичики:</span>
              <p>{feedback.explanation}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
              >
                <span>Следующее число</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
