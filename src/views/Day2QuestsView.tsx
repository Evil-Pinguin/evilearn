import React, { useState } from 'react';
import { day2QuestsData } from '../data/day2QuestsData';
import { CodeBlock } from '../components/CodeBlock';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  FileCode, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export const Day2QuestsView: React.FC = () => {
  const [selectedQuestId, setSelectedQuestId] = useState<string>(day2QuestsData[0].id);
  const currentQuest = day2QuestsData.find(q => q.id === selectedQuestId) || day2QuestsData[0];

  const day3QuestsList = [
    { name: '1948.c', title: 'Наибольший простой делитель вычитанием', prep: 'Уроки 7.4 и 12' },
    { name: 'char_decode.c', title: 'Декодер HEX в ASCII и argv', prep: 'Урок 11' },
    { name: 'quest3.c', title: 'Рекурсивный Фибоначчи', prep: 'Урок 10' },
    { name: 'door_functions.c', title: 'Таблица функций и сетка 2π/41', prep: 'Урок 9' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16">
      {/* Header */}
      <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-500" />
            Разбор пройденных квестов (День 2)
          </h1>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            7/7 PASS ✅
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Построчный разбор боевого кода для уверенной защиты на проверках
        </p>
      </div>

      {/* Quest Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {day2QuestsData.map(quest => {
          const isSelected = quest.id === selectedQuestId;
          return (
            <button
              key={quest.id}
              onClick={() => setSelectedQuestId(quest.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <FileCode size={12} />
              <span>{quest.name.split(':')[1] || quest.name}</span>
            </button>
          );
        })}
      </div>

      {/* Code and Line by Line Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Code View */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-5 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                {currentQuest.title}
              </h3>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                {currentQuest.file}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              {currentQuest.description}
            </p>

            <CodeBlock code={currentQuest.code} language="c" title={currentQuest.file} />
          </div>

          {/* Line by line */}
          <div className="p-5 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              Построчный разбор логики:
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {currentQuest.lineByLine.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Строка {item.line}</span>
                    <span className="text-slate-400 text-[10px]">{item.concept}</span>
                  </div>
                  <p>{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peer Review Questions */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Users size={14} className="text-slate-500" />
              Вопросы пира на проверке:
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {currentQuest.peerReviewQuestions.map((q, idx) => (
                <div key={idx} className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">Вопрос {idx + 1}:</span>
                  <p>{q}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Lightbulb size={14} className="text-amber-500" />
              Инсайты:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {currentQuest.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Day 3 Notice: Решаю сама */}
      <div className="p-5 rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-200">
            Квесты Дня 3 (D03T03): Решаю сама 💪
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-bold">
            Без готового кода
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {day3QuestsList.map((q, idx) => (
            <div key={idx} className="p-2.5 rounded-md bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800">
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block">{q.name}</span>
              <span className="text-[11px] text-slate-500">{q.title} ({q.prep})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
