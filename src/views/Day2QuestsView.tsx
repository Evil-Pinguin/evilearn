import React, { useState } from 'react';
import { day2QuestsData } from '../data/day2QuestsData';
import { CodeBlock } from '../components/CodeBlock';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  FileCode, 
  Lock, 
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Terminal,
  Zap
} from 'lucide-react';

export const Day2QuestsView: React.FC = () => {
  const [selectedQuestId, setSelectedQuestId] = useState<string>(day2QuestsData[0].id);
  const currentQuest = day2QuestsData.find(q => q.id === selectedQuestId) || day2QuestsData[0];

  const day3QuestsList = [
    { name: '1948.c', title: 'Наибольший простой делитель вычитанием', prepLesson: 'Уроки 7.4 и 12' },
    { name: 'char_decode.c', title: 'Декодер HEX в ASCII и аргументы argv', prepLesson: 'Урок 11' },
    { name: 'quest3.c', title: 'Рекурсивный расчет Фибоначчи', prepLesson: 'Урок 10' },
    { name: 'door_functions.c', title: 'Таблица функций и шаг сетки 2π/41', prepLesson: 'Урок 9' },
    { name: 'door_functions_print.c', title: 'ASCII-графики и указатели на функции', prepLesson: 'Урок 9 & 12' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/30 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">
                Разбор пройденных квестов (День 2)
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                7/7 PASS ✅
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Построчный разбор боевого кода для уверенной защиты на peer-review
            </p>
          </div>
        </div>
      </div>

      {/* Quests Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {day2QuestsData.map(quest => {
          const isSelected = quest.id === selectedQuestId;
          return (
            <button
              key={quest.id}
              onClick={() => setSelectedQuestId(quest.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950 ring-2 ring-emerald-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FileCode size={13} />
              <span>{quest.name.split(':')[1] || quest.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Quest Detailed Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Code and Line by Line */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold block">
                  {currentQuest.file}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {currentQuest.title}
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold border border-emerald-500/30">
                Защищено на ревью
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentQuest.description}
            </p>

            <CodeBlock code={currentQuest.code} language="c" title={currentQuest.file} />
          </div>

          {/* Line-by-Line Breakdown */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <span>Построчный разбор логики для защиты:</span>
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              {currentQuest.lineByLine.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-indigo-400 font-bold">Строка {item.line}</span>
                    <span className="text-slate-500 bg-slate-900 px-2 py-0.5 rounded">{item.concept}</span>
                  </div>
                  <p className="text-slate-200">{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Peer-review drill & Key takeaways */}
        <div className="lg:col-span-5 space-y-6">
          {/* Peer Review Questions */}
          <div className="p-6 rounded-3xl border border-indigo-500/30 bg-slate-900/80 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users className="text-indigo-400" size={18} />
              <h4 className="font-bold text-slate-100 text-sm">
                Вопросы пира на проверке (Peer-Review)
              </h4>
            </div>

            <div className="space-y-2.5 text-xs">
              {currentQuest.peerReviewQuestions.map((q, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-800/40 text-indigo-200">
                  <div className="font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
                    <HelpCircle size={13} /> Вопрос #{idx + 1}:
                  </div>
                  <p>{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key takeaways */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Lightbulb className="text-amber-400" size={18} />
              <h4 className="font-bold text-slate-100 text-sm">
                Главные инсайты квеста
              </h4>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {currentQuest.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Part 3 Notice: Day 3 Quests Placeholder with Anti-Cheat Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              💪
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">
                  Квесты Дня 3 (D03T03): Решаю сама!
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Без готового кода
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Здесь принципиально нет готовых решений. Все навыки готовятся через уроки 9–12!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {day3QuestsList.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-amber-300">{item.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                  {item.prepLesson}
                </span>
              </div>
              <p className="text-xs text-slate-300">{item.title}</p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                <Zap size={12} /> Готовится в Модуле 4
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
