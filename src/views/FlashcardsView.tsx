import React, { useEffect, useMemo, useState } from 'react';
import { flashcardsData } from '../data/flashcardsData';
import { useProgress } from '../context/ProgressContext';
import { SwipeDeck } from '../components/SwipeDeck';
import { Layers, RotateCw, CheckCircle2, Search, Shuffle, ArrowRight, ArrowLeft, Heart } from 'lucide-react';

const categories = [
  { id: 'all', label: 'Все' },
  { id: 'bash', label: 'Bash' },
  { id: 'git', label: 'Git' },
  { id: 'tools', label: 'GCC / Clang' },
  { id: 'concepts', label: 'Концепции' }
];

export const FlashcardsView: React.FC = () => {
  const { progress, toggleFlashcardKnown } = useProgress();
  const [mode, setMode] = useState<'cards' | 'swipe'>('cards');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const filteredCards = useMemo(
    () =>
      flashcardsData.filter(card => {
        const matchesCat = activeCategory === 'all' || card.category === activeCategory;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || card.question.toLowerCase().includes(q) || card.answer.toLowerCase().includes(q);
        return matchesCat && matchesSearch;
      }),
    [activeCategory, searchQuery]
  );

  const currentCard = filteredCards[currentIdx] || filteredCards[0];
  const knownCount = flashcardsData.filter(c => progress.flashcardStatus[c.id] === 'known').length;
  const masteryPercentage = Math.round((knownCount / flashcardsData.length) * 100);

  const next = () => {
    setIsFlipped(false);
    setCurrentIdx(i => (i + 1) % Math.max(1, filteredCards.length));
  };
  const prev = () => {
    setIsFlipped(false);
    setCurrentIdx(i => (i - 1 + filteredCards.length) % Math.max(1, filteredCards.length));
  };

  // Пробел/Enter — перевернуть, стрелки — листать (только в режиме карточек)
  useEffect(() => {
    if (mode !== 'cards') return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped(v => !v);
      } else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, filteredCards.length]);

  const isCurrentKnown = currentCard ? progress.flashcardStatus[currentCard.id] === 'known' : false;

  return (
    <div className="max-w-2xl mx-auto space-y-3 pb-16">
      {/* Заголовок */}
      <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Словарь команд и правил</h1>
            <p className="text-[11px] text-slate-500">Освоено {knownCount}/{flashcardsData.length} карточек ({masteryPercentage}%)</p>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 p-0.5">
            <button
              onClick={() => setMode('cards')}
              className={`px-2.5 py-1 rounded text-xs ${mode === 'cards' ? 'bg-white dark:bg-slate-950 font-semibold shadow-none' : 'text-slate-500'}`}
            >
              Карточки
            </button>
            <button
              onClick={() => setMode('swipe')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs ${mode === 'swipe' ? 'bg-white dark:bg-slate-950 font-semibold' : 'text-slate-500'}`}
            >
              <Heart size={11} className={mode === 'swipe' ? 'text-rose-500 fill-rose-500' : ''} /> Свайп
            </button>
          </div>
        </div>

        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${masteryPercentage}%` }} />
        </div>
      </div>

      {/* Фильтры */}
      <div className="space-y-2">
        <div className="flex items-center rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5">
          <Search size={13} className="text-slate-400 mr-2" />
          <input
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentIdx(0);
            }}
            placeholder="Поиск: nano, gcc, extra, git…"
            className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setCurrentIdx(0);
                setIsFlipped(false);
              }}
              className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'swipe' ? (
        <SwipeDeck cards={filteredCards.length >= 2 ? filteredCards : flashcardsData} />
      ) : filteredCards.length > 0 && currentCard ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>
              {currentIdx + 1} / {filteredCards.length}
            </span>
            <span className="flex items-center gap-1">
              пробел / клик — перевернуть <RotateCw size={11} />
            </span>
          </div>

          <div
            onClick={() => setIsFlipped(v => !v)}
            className="w-full rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 p-5 cursor-pointer flex flex-col justify-between min-h-56"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
                <span>{currentCard.category}</span>
                <span>{currentCard.difficulty}</span>
              </div>

              {!isFlipped ? (
                <div className="py-5 space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-slate-400">вопрос</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">{currentCard.question}</h3>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 font-bold">ответ</span>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{currentCard.answer}</p>
                  {currentCard.codeExample && (
                    <pre className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                      {currentCard.codeExample}
                    </pre>
                  )}
                  {currentCard.tip && <p className="text-[11px] text-amber-700 dark:text-amber-300">💡 {currentCard.tip}</p>}
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => toggleFlashcardKnown(currentCard.id)}
                className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 ${
                  isCurrentKnown
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 size={13} />
                <span>{isCurrentKnown ? 'Знаю' : 'Отметить как освоенное'}</span>
              </button>
              <button onClick={() => setIsFlipped(v => !v)} className="text-xs text-slate-500 flex items-center gap-1">
                <RotateCw size={12} /> перевернуть
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={prev} className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs">
              <ArrowLeft size={13} className="inline mr-1" /> Назад
            </button>
            <button
              onClick={() => setCurrentIdx(Math.floor(Math.random() * filteredCards.length))}
              className="px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs"
              title="Случайная карточка"
            >
              <Shuffle size={13} />
            </button>
            <button onClick={next} className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold">
              Вперёд <ArrowRight size={13} className="inline ml-1" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-xs">Ничего не найдено.</div>
      )}
    </div>
  );
};
