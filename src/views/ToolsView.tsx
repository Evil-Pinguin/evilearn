import React, { useState } from 'react';
import { VirtualTerminal } from '../components/VirtualTerminal';
import { 
  PrimeFactorWidget, 
  HexAsciiWidget, 
  RecursionTreeWidget, 
  GridCalculatorWidget 
} from '../components/InteractiveWidgets';
import { 
  Wrench, 
  Terminal, 
  Calculator, 
  Binary, 
  GitFork, 
  Grid, 
  BookOpen, 
  ShieldCheck,
  FileCode
} from 'lucide-react';

export const ToolsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'math' | 'hex' | 'recursion' | 'grid' | 'cheatsheet'>('terminal');

  const tabs = [
    { id: 'terminal', label: 'Терминал er-d9', icon: Terminal },
    { id: 'math', label: 'Кирпичики', icon: Calculator },
    { id: 'hex', label: 'Hex ↔ ASCII', icon: Binary },
    { id: 'recursion', label: 'Стек Fibonacci', icon: GitFork },
    { id: 'grid', label: 'Сетка 2π/41', icon: Grid },
    { id: 'cheatsheet', label: 'Шпаргалка', icon: BookOpen }
  ] as const;

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-16">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench size={18} className="text-teal-500" />
          Песочница и интерактивные инструменты
        </h1>
        <p className="text-xs text-slate-500">
          Эмулятор консоли er-d9, конвертеры и шпаргалки
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'terminal' && <VirtualTerminal />}
        {activeTab === 'math' && <PrimeFactorWidget />}
        {activeTab === 'hex' && <HexAsciiWidget />}
        {activeTab === 'recursion' && <RecursionTreeWidget />}
        {activeTab === 'grid' && <GridCalculatorWidget />}

        {activeTab === 'cheatsheet' && (
          <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-500" />
              Шпаргалка стандартов Школы 21
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Сборка GCC:</span>
                <code className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono block">
                  gcc -Wall -Werror -Wextra -std=c11 file.c -lm -o bin
                </code>
                <p className="text-[11px] text-slate-500">-lm ставится в самый конец!</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Clang-format:</span>
                <code className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono block">
                  clang-format -n src/*.c (проверка)<br />
                  clang-format -i src/*.c (исправление)
                </code>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Single Exit Point:</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Один return в конце функции. Никаких досрочных выходов!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-rose-600 dark:text-rose-400 block">Запрещено:</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Глобальные переменные, goto, бинарники в Git.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
