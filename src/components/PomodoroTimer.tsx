import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Coffee, Sparkles, Bell } from 'lucide-react';
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
        try {
          confetti({ particleCount: 50, spread: 60 });
        } catch (e) {}
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
  const totalSeconds = mode === 'work' ? 25 * 60 : 5 * 60;
  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            🍅
          </span>
          <div>
            <h4 className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
              Помодоро-таймер практики
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                25 мин
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              {mode === 'work' ? '🎯 Фокус на коде и упражнениях' : '☕ Время отдыха (5 минут)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
          <span>Сеты:</span>
          <span className="font-bold text-emerald-400">{sessionsCompleted}</span>
        </div>
      </div>

      {/* Mode Switches */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => switchMode('work')}
          className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
            mode === 'work'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Практика (25м)
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
            mode === 'break'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Отдых (5м)
        </button>
      </div>

      {/* Timer Display */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
        <div className="font-mono text-2xl font-extrabold text-white tracking-wider pl-2">
          {timeFormatted}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
            }`}
          >
            {isRunning ? <Pause size={13} /> : <Play size={13} />}
            <span>{isRunning ? 'Пауза' : 'Старт'}</span>
          </button>
          <button
            onClick={resetTimer}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
            title="Сбросить"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div 
          className={`h-full transition-all duration-300 ${
            mode === 'work' ? 'bg-rose-500' : 'bg-emerald-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
