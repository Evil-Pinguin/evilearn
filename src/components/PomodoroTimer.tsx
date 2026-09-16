import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'work') {
        try { confetti({ particleCount: 40, spread: 50 }); } catch {}
        setSessionsCompleted(prev => prev + 1);
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">🍅</span>
          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
            Помодоро ({mode === 'work' ? '25м фокус' : '5м отдых'})
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Сеты: <strong className="text-emerald-600 dark:text-emerald-400">{sessionsCompleted}</strong>
        </span>
      </div>

      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <span className="font-mono text-xl font-bold text-slate-900 dark:text-white pl-1">
          {timeFormatted}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
          >
            {isRunning ? 'Пауза' : 'Старт'}
          </button>
          <button
            onClick={resetTimer}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Сброс"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
