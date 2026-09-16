import React, { useMemo, useState } from 'react';
import { commandsData } from '../data/commandsData';
import { CommandStep } from '../types';
import { Copy, Check, Search, TerminalSquare, AlertTriangle, BookOpen, ArrowUpRight } from 'lucide-react';

interface CommandsViewProps {
  onOpenLesson?: (lessonId: string) => void;
}

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Фолбэк для браузера без clipboard API
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
};

const StepRow: React.FC<{ step: CommandStep; idx: number }> = ({ step, idx }) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <span className="mt-0.5 w-5 shrink-0 text-right font-mono text-[11px] text-slate-400">{idx + 1}</span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="text-[11px] text-slate-600 dark:text-slate-400">{step.what}</div>
        <button
          onClick={async () => {
            if (await copyText(step.command)) {
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }
          }}
          title="Клик — скопировать команду"
          className="group w-full text-left flex items-start gap-2 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-emerald-400 dark:hover:border-emerald-600 px-2.5 py-1.5 transition-colors"
        >
          <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs select-none">$</span>
          <code className="flex-1 min-w-0 font-mono text-xs text-slate-900 dark:text-slate-100 whitespace-pre-wrap break-all">{step.command}</code>
          <span className={`shrink-0 transition-opacity ${copied ? 'text-emerald-600 opacity-100' : 'opacity-0 group-hover:opacity-60'}`}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </span>
        </button>
        {step.note && <div className="text-[11px] text-amber-700 dark:text-amber-300">⚠ {step.note}</div>}
      </div>
    </div>
  );
};

export const CommandsView: React.FC<CommandsViewProps> = ({ onOpenLesson }) => {
  // По умолчанию открываем самый частый запрос студента: «как сделать квест 1»
  const [activeId, setActiveId] = useState<string>('quest1');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return commandsData
      .map(cheat => ({
        ...cheat,
        steps: q ? cheat.steps.filter(s => (s.command + ' ' + s.what).toLowerCase().includes(q)) : cheat.steps
      }))
      .filter(cheat => cheat.steps.length > 0 || (cheat.title + cheat.goal).toLowerCase().includes(q));
  }, [query]);

  const active = filtered.find(c => c.id === activeId) || filtered[0] || commandsData[0];
  const activeIndex = filtered.findIndex(c => c.id === active.id);

  const copyAll = async () => {
    await copyText(active.steps.map(s => s.command).join('\n'));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-3 pb-16">
      {/* Заголовок */}
      <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen size={18} className="text-emerald-600" />
            Полные команды по квестам
          </h1>
          <span className="text-[11px] font-mono text-slate-400">клик по команде = копируется</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Готовые последовательности: что печатать по шагам, чтобы сделать квест от пустой папки до пуша в develop.
        </p>
        <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 mt-1">
          <Search size={13} className="text-slate-400 mr-2" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск команды: gcc, clang-format, git restore, valgrind…"
            className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              сброс
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Список шпаргалок */}
        <div className="md:col-span-4 space-y-1.5">
          {filtered.map(cheat => {
            const isActive = cheat.id === active.id;
            return (
              <button
                key={cheat.id}
                onClick={() => setActiveId(cheat.id)}
                className={`w-full text-left p-2.5 rounded-md border transition-colors ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/25'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{cheat.emoji}</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{cheat.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{cheat.goal}</p>
                <span className="text-[10px] font-mono text-slate-400">{cheat.steps.length} шагов</span>
              </button>
            );
          })}
          {filtered.length === 0 && <p className="text-xs text-slate-400 p-2">Ничего не нашлось по «{query}».</p>}
        </div>

        {/* Шаги */}
        <div className="md:col-span-8 space-y-3">
          <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <TerminalSquare size={16} className="text-emerald-600" />
                {active.title}
              </h2>
              <div className="flex items-center gap-1.5">
                {active.lessonId && onOpenLesson && (
                  <button
                    onClick={() => onOpenLesson(active.lessonId as string)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 hover:text-emerald-600"
                  >
                    к уроку <ArrowUpRight size={11} />
                  </button>
                )}
                <button
                  onClick={copyAll}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-semibold"
                >
                  <Copy size={11} /> скопировать всё
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {active.steps.map((step, idx) => (
                <StepRow key={idx} step={step} idx={idx} />
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-400">
              <button
                onClick={() => activeIndex > 0 && setActiveId(filtered[activeIndex - 1].id)}
                disabled={activeIndex <= 0}
                className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
              >
                ← предыдущая
              </button>
              <span>{activeIndex + 1} / {filtered.length}</span>
              <button
                onClick={() => activeIndex < filtered.length - 1 && setActiveId(filtered[activeIndex + 1].id)}
                disabled={activeIndex >= filtered.length - 1}
                className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
              >
                следующая →
              </button>
            </div>

            {active.pitfalls?.length ? (
              <div className="mt-2 p-2.5 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/25 space-y-1">
                <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle size={12} /> грабли
                </span>
                <ul className="text-[11px] text-rose-900 dark:text-rose-200 space-y-0.5">
                  {active.pitfalls.map((p, i) => (
                    <li key={i}>— {p}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandsView;
