import React, { useState } from 'react';
import { flashcardsData } from '../data/flashcardsData';
import { useProgress } from '../context/ProgressContext';
import { 
  Layers, 
  RotateCw, 
  CheckCircle2, 
  Search, 
  Shuffle, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const { progress, toggleFlashcardKnown } = useProgress();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'Все (60)' },
    { id: 'bash', label: '💻 Bash' },
    { id: 'git', label: '🐙 Git' },
    { id: 'tools', label: '🛠 GCC / Clang' },
    { id: 'concepts', label: '🧠 Концепции' }
  ];

  const filteredCards = flashcardsData.filter(card => {
    const matchesCat = activeCategory === 'all' || card.category === activeCategory;
    const matchesSearch = 
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const currentCard = filteredCards[currentIdx] || filteredCards[0];
  const knownCount = flashcardsData.filter(c => progress.flashcardStatus[c.id] === 'known').length;
  const masteryPercentage = Math.round((knownCount / flashcardsData.length) * 100);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIdx((currentIdx + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIdx((currentIdx - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCurrentIdx(Math.floor(Math.random() * filteredCards.length));
  };

  const isCurrentKnown = currentCard ? progress.flashcardStatus[currentCard.id] === 'known' : false;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-16">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Словарь команд и правил
            </h1>
            <p className="text-xs text-slate-500">
              Флеш-карточки для быстрого повторения
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Освоено: {knownCount}/{flashcardsData.length} ({masteryPercentage}%)
          </span>
        </div>

        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${masteryPercentage}%` }}
          />
        </div>
      </div>

      {/* Filter and Search */}
      <div className="space-y-2">
        <div className="flex items-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5">
          <Search size={14} className="text-slate-400 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIdx(0);
            }}
            placeholder="Поиск по карточкам (например nano, gcc, extra, git)..."
            className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setCurrentIdx(0);
                setIsFlipped(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Карточка {currentIdx + 1} из {filteredCards.length}</span>
            <span className="flex items-center gap-1">
              Нажми для переворота <RotateCw size={11} />
            </span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-64 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 uppercase text-[10px]">
                  {currentCard.category}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                  isCurrentKnown 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {isCurrentKnown ? 'Освоено ✅' : 'В процессе'}
                </span>
              </div>

              {!isFlipped ? (
                <div className="py-6 space-y-2">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Вопрос:</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {currentCard.question}
                  </h3>
                </div>
              ) : (
                <div className="py-2 space-y-3">
                  <span className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 font-bold">Ответ:</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {currentCard.answer}
                  </p>
                  {currentCard.codeExample && (
                    <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono whitespace-pre-wrap">
                      {currentCard.codeExample}
                    </pre>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => toggleFlashcardKnown(currentCard.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isCurrentKnown
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 size={13} />
                <span>{isCurrentKnown ? 'Знаю отлично' : 'Отметить как освоенное'}</span>
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                <RotateCw size={12} />
                <span>Перевернуть</span>
              </button>
            </div>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
            >
              <ArrowLeft size={13} className="inline mr-1" /> Назад
            </button>
            <button
              onClick={handleShuffle}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs"
              title="Случайная"
            >
              <Shuffle size={13} />
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Вперёд <ArrowRight size={13} className="inline ml-1" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-xs">
          Ничего не найдено.
        </div>
      )}
    </div>
  );
};
