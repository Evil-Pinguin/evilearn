import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flashcard } from '../types';
import { useProgress } from '../context/ProgressContext';
import { Check, X, RotateCcw, Heart, Sparkles } from 'lucide-react';

interface SwipeDeckProps {
  cards: Flashcard[];
}

interface Round {
  term: Flashcard;
  definition: string;
  isMatch: boolean;
}

interface Result {
  correct: boolean;
  round: Round;
}

const SWIPE_THRESHOLD = 90;

const shuffleInPlace = <T,>(arr: T[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Режим «знакомств»: слева — термин/команда, справа — определение.
 * Свайп вправо = «это верная пара», влево = «неверная».
 * Зелёный индикатор за верное решение, красный за ошибку.
 */
export const SwipeDeck: React.FC<SwipeDeckProps> = ({ cards }) => {
  const { progress, recordSwipeResult } = useProgress();
  const [queue, setQueue] = useState<Round[]>([]);
  const [idx, setIdx] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [flyingOut, setFlyingOut] = useState<null | 'left' | 'right'>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const startX = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const buildDeck = useCallback((): Round[] => {
    const pool = cards.length >= 2 ? cards : [];
    if (!pool.length) return [];
    const order = shuffleInPlace([...pool]);
    const defs = shuffleInPlace([...pool]);
    return order.slice(0, Math.max(10, Math.min(pool.length, 24))).map((term, i) => {
      const matchIsRight = Math.random() < 0.5;
      if (matchIsRight) {
        return { term, definition: term.answer, isMatch: true };
      }
      // берём определение другой карточки (желательно похожей по категории)
      const candidates = defs.filter(d => d.id !== term.id && d.category === term.category);
      const pick = (candidates.length ? candidates : defs.filter(d => d.id !== term.id))[i % Math.max(1, defs.length - 1)] || defs[0];
      return { term, definition: pick.answer, isMatch: false };
    });
  }, [cards]);

  const restart = useCallback(() => {
    setQueue(buildDeck());
    setIdx(0);
    setResult(null);
    setHistory([]);
    setStreak(0);
    setScore({ correct: 0, total: 0 });
    setDragX(0);
  }, [buildDeck]);

  useEffect(() => {
    restart();
  }, [restart]);

  const round = queue[idx];

  const decide = useCallback(
    (dir: 'left' | 'right') => {
      if (!round || flyingOut) return;
      setFlyingOut(dir);
      const correct = (dir === 'right') === round.isMatch;
      window.setTimeout(() => {
        setResult({ correct, round });
        setHistory(prev => [...prev, correct].slice(-14));
        setStreak(prev => (correct ? prev + 1 : 0));
        setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
        recordSwipeResult(correct, round.term.id, streak + (correct ? 1 : 0));
        setFlyingOut(null);
        setDragX(0);
        setIdx(i => (i + 1 >= queue.length ? 0 : i + 1));
      }, 240);
    },
    [round, flyingOut, queue.length, recordSwipeResult, streak]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') decide('right');
      if (e.key === 'ArrowLeft') decide('left');
      if (e.key === 'Enter' && result) {
        setResult(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [decide, result]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (flyingOut) return;
    setDragging(true);
    setResult(null);
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || startX.current === null) return;
    setDragX(e.clientX - startX.current);
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      decide(dragX > 0 ? 'right' : 'left');
    } else {
      setDragX(0);
    }
  };

  const translate = useMemo(() => {
    if (flyingOut === 'right') return 'translate(140%, -20px) rotate(18deg)';
    if (flyingOut === 'left') return 'translate(-140%, -20px) rotate(-18deg)';
    return `translate(${dragX}px, 0) rotate(${dragX / 26}deg)`;
  }, [dragX, flyingOut]);

  const likeOpacity = Math.max(0, Math.min(1, dragX / SWIPE_THRESHOLD));
  const nopeOpacity = Math.max(0, Math.min(1, -dragX / SWIPE_THRESHOLD));
  const lastCorrect = history[history.length - 1];
  const indicator = result ? result.correct : lastCorrect;

  if (!round) {
    return (
      <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center text-xs text-slate-500">
        Недостаточно карточек для игры. Выбери категорию с 2+ карточками.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Индикаторы */}
      <div className="p-3 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Светодиод результата */}
          <span
            key={String(indicator)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              indicator === undefined
                ? 'bg-slate-300 dark:bg-slate-600'
                : indicator
                  ? 'bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.22)] led-pulse'
                  : 'bg-rose-500 shadow-[0_0_0_5px_rgba(244,63,94,0.22)] led-pulse'
            }`}
          />
          <div className="text-xs">
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {score.correct}/{score.total} верно · серия {streak}
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              всего в профиле: {progress.swipeStats?.correct ?? 0} верно, {progress.swipeStats?.wrong ?? 0} мимо · рекорд {progress.swipeStats?.bestStreak ?? 0}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {history.length === 0 && <span className="text-[10px] font-mono text-slate-400">свайпни или жми ←/→</span>}
          {history.map((ok, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${ok ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          ))}
        </div>

        <button
          onClick={restart}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300"
        >
          <RotateCcw size={11} /> новая колода
        </button>
      </div>

      {/* Карточка */}
      <div className="relative select-none" style={{ touchAction: 'pan-y' }}>
        <div
          ref={cardRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ transform: translate, transition: dragging ? 'none' : 'transform 240ms ease-out' }}
          className="swipe-card relative cursor-grab active:cursor-grabbing rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 p-5 min-h-56 space-y-3"
        >
          {/* Оверлеи */}
          <div
            className="pointer-events-none absolute inset-0 rounded-lg border-2 border-emerald-500 bg-emerald-500/10 flex items-start justify-end p-4"
            style={{ opacity: likeOpacity }}
          >
            <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm uppercase tracking-wider">
              <Heart size={16} className="fill-emerald-500 text-emerald-500" /> верно
            </span>
          </div>
          <div
            className="pointer-events-none absolute inset-0 rounded-lg border-2 border-rose-500 bg-rose-500/10 flex items-start justify-start p-4"
            style={{ opacity: nopeOpacity }}
          >
            <span className="flex items-center gap-1 text-rose-600 font-bold text-sm uppercase tracking-wider">
              <X size={16} /> не пара
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <span>{round.term.category}</span>
            <span>
              {idx + 1} / {queue.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400">термин</span>
              <div className="font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white break-words">{round.term.question}</div>
            </div>
            <div className="space-y-1 border-l border-dashed border-slate-200 dark:border-slate-700 pl-3">
              <span className="text-[10px] uppercase font-mono text-slate-400">это значит</span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{round.definition}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>вправо — пара правильная</span>
            <span>влево — перепутано</span>
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => decide('left')}
          className="w-11 h-11 rounded-full border-2 border-rose-400 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition-colors"
          title="Неверная пара (влево / ←)"
        >
          <X size={20} />
        </button>
        <button
          onClick={() => decide('right')}
          className="w-11 h-11 rounded-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center transition-colors"
          title="Верная пара (вправо / →)"
        >
          <Check size={20} />
        </button>
      </div>

      {/* Разбор после свайпа */}
      {result && (
        <div
          className={`p-3 rounded-lg border text-xs ${
            result.correct
              ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200'
              : 'border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/25 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold mb-1">
            {result.correct ? <Check size={13} /> : <X size={13} />}
            {result.correct ? 'Верно решила' : 'Мимо'}
            {result.correct && streak > 1 && (
              <span className="flex items-center gap-1 text-[10px] font-mono opacity-80">
                <Sparkles size={11} /> серия {streak}
              </span>
            )}
          </div>
          {!result.correct && (
            <p className="leading-relaxed">
              <code className="font-mono">«{result.round.term.question}»</code> на самом деле означает: {result.round.term.answer}
            </p>
          )}
          <button onClick={() => setResult(null)} className="mt-1.5 font-mono text-[10px] opacity-70 hover:opacity-100">
            Enter — продолжить
          </button>
        </div>
      )}
    </div>
  );
};

export default SwipeDeck;
