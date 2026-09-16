import React, { useState } from 'react';
import { flashcardsData } from '../data/flashcardsData';
import { useProgress } from '../context/ProgressContext';
import { 
  Layers, 
  RotateCw, 
  CheckCircle2, 
  RotateCcw, 
  Search, 
  Shuffle, 
  Sparkles, 
  Lightbulb, 
  Terminal, 
  Code, 
  GitBranch, 
  Wrench,
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
    { id: 'all', label: 'Все карточки' },
    { id: 'bash', label: '💻 Bash / Linux' },
    { id: 'git', label: '🐙 Git & Flow' },
    { id: 'c_basics', label: '⚙️ C Basics' },
    { id: 'c_advanced', label: '🧠 C Advanced & Pointers' },
    { id: 'tools', label: '🛠 GCC & Clang-Format' },
    { id: 'school21', label: '🏫 Стандарты Школы 21' }
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
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header & Stats */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/30 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Layers size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                Словарь команд и концепций
              </h1>
              <p className="text-xs text-slate-400">
                Интерактивные флеш-карточки для быстрой тренировки памяти
              </p>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-xs text-slate-400 block">Освоено карточек:</span>
            <span className="text-lg font-bold text-emerald-400">
              {knownCount} / {flashcardsData.length} ({masteryPercentage}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${masteryPercentage}%` }}
          />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center rounded-2xl bg-slate-950 border border-slate-800 px-4 py-2.5">
          <Search size={16} className="text-slate-500 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIdx(0);
            }}
            placeholder="Поиск по вопросу или команде (например: nano, pointer, step, gcc)..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setCurrentIdx(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Flashcard Component */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Карточка {currentIdx + 1} из {filteredCards.length}</span>
            <span className="flex items-center gap-1">
              Нажми на карточку, чтобы перевернуть <RotateCw size={12} />
            </span>
          </div>

          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="group relative min-h-80 w-full rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl cursor-pointer hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Front & Back Content */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-800 text-indigo-300 border border-slate-700 uppercase tracking-wider">
                  {currentCard.category}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  isCurrentKnown 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isCurrentKnown ? '✅ Освоено' : 'В процессе'}
                </span>
              </div>

              {!isFlipped ? (
                /* Front: Question */
                <div className="space-y-4 py-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Вопрос:</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {currentCard.question}
                  </h3>
                  <p className="text-xs text-indigo-400 font-mono">
                    💡 Кликни для проверки ответа
                  </p>
                </div>
              ) : (
                /* Back: Answer & Code */
                <div className="space-y-4 py-2 animate-fadeIn">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Ответ:</span>
                  <h3 className="text-lg font-bold text-emerald-300 leading-snug">
                    {currentCard.answer}
                  </h3>

                  {currentCard.codeExample && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {currentCard.codeExample}
                    </div>
                  )}

                  {currentCard.tip && (
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2">
                      <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <p>{currentCard.tip}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card Footer Actions */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFlashcardKnown(currentCard.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrentKnown
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  <CheckCircle2 size={14} className={isCurrentKnown ? 'text-emerald-400' : ''} />
                  <span>{isCurrentKnown ? 'Знаю отлично ✅' : 'Отметить как освоенное'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  <RotateCw size={12} />
                  <span>Перевернуть</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Предыдущая</span>
            </button>

            <button
              onClick={handleShuffle}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 text-xs font-semibold border border-slate-800 transition-colors"
              title="Случайная карточка"
            >
              <Shuffle size={14} />
              <span>Случайная</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition-all"
            >
              <span>Следующая</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-xs">
          По запросу ничего не найдено. Попробуй сбросить фильтры.
        </div>
      )}
    </div>
  );
};
