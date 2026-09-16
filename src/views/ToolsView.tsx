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
  FileCode,
  Sparkles
} from 'lucide-react';

export const ToolsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'math' | 'hex' | 'recursion' | 'grid' | 'cheatsheet'>('terminal');

  const tabs = [
    { id: 'terminal', label: 'Терминал er-d9', icon: Terminal },
    { id: 'math', label: 'Кирпичики & Простые', icon: Calculator },
    { id: 'hex', label: 'Hex ↔ ASCII', icon: Binary },
    { id: 'recursion', label: 'Стек Fibonacci', icon: GitFork },
    { id: 'grid', label: 'Сетка графиков', icon: Grid },
    { id: 'cheatsheet', label: 'Шпаргалка Школы 21', icon: BookOpen }
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/30 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Wrench size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Песочница и интерактивные инструменты
            </h1>
            <p className="text-xs text-slate-400">
              Визуализаторы, эмулятор терминала кампуса и калькуляторы для проверки кода
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Body */}
      <div className="animate-fadeIn">
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Интерактивная консоль машины <code className="text-emerald-400">er-d9</code>. Поддерживает команды Linux, GCC, Git и утилиты фильтрации.
            </div>
            <VirtualTerminal />
          </div>
        )}

        {activeTab === 'math' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Разложение чисел на простые множители-кирпичики с обнаружением составных ловушек.
            </div>
            <PrimeFactorWidget />
          </div>
        )}

        {activeTab === 'hex' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Конвертер шестнадцатеричных последовательностей в ASCII и обратно.
            </div>
            <HexAsciiWidget />
          </div>
        )}

        {activeTab === 'recursion' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Визуализация рекурсивных вызовов функции Fibonacci и предотвращение переполнения стека.
            </div>
            <RecursionTreeWidget />
          </div>
        )}

        {activeTab === 'grid' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Правило дискретизации: почему для 42 точек требуется делить длину на 41 промежуток.
            </div>
            <GridCalculatorWidget />
          </div>
        )}

        {activeTab === 'cheatsheet' && (
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="text-emerald-400" size={20} />
              <h2 className="text-lg font-bold text-white">
                Шпаргалка стандартов разработки Школы 21
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <FileCode size={14} /> Компиляция GCC
                </h4>
                <div className="font-mono bg-slate-900 p-2.5 rounded-xl text-slate-300 text-[11px]">
                  gcc -Wall -Werror -Wextra -std=c11 src.c -lm -o binary
                </div>
                <p className="text-slate-400 text-[11px]">
                  Флаг <code>-lm</code> для math.h ставится строго после файлов!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles size={14} /> Форматирование Clang-Format
                </h4>
                <div className="font-mono bg-slate-900 p-2.5 rounded-xl text-slate-300 text-[11px]">
                  clang-format -n src/*.c  # проверка<br />
                  clang-format -i src/*.c  # исправление
                </div>
                <p className="text-slate-400 text-[11px]">
                  Файл .clang-format должен лежать в папке src/.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-300">
                  Принцип Дейкстры: Single Exit Point
                </h4>
                <p className="text-slate-400">
                  Каждая функция должна иметь ровно один <code>return</code> в самом конце. Никаких досрочных выходов по середине функции!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-rose-300">
                  Строгие запреты проектов
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Запрещены глобальные переменные</li>
                  <li>Запрещен оператор <code>goto</code></li>
                  <li>Запрещены динамическая память и массивы (в D03)</li>
                  <li>Запрещены сторонние библиотеки кроме stdio.h и math.h</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
