import React, { useState, useEffect } from 'react';
import { examQuestionsData } from '../data/examData';
import { useProgress } from '../context/ProgressContext';
import { CodeBlock } from '../components/CodeBlock';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Trophy, 
  ArrowRight, 
  ArrowLeft,
  Terminal,
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';

export const ExamView: React.FC = () => {
  const { progress, saveExamResult } = useProgress();
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(45 * 60); // 45 minutes
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const [answers, setAnswers] = useState<{ [id: number]: string }>({});
  const [examScore, setExamScore] = useState<number>(0);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (examStarted && !isFinished && !isPaused) {
      interval = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examStarted, isFinished, isPaused, answers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setIsFinished(false);
    setCurrentQuestionIdx(0);
    setTimeLeftSeconds(45 * 60);
    setIsPaused(false);
    
    // Prepopulate starter code
    const initialAnswers: { [id: number]: string } = {};
    examQuestionsData.forEach(q => {
      if (q.starterCode) {
        initialAnswers[q.id] = q.starterCode;
      }
    });
    setAnswers(initialAnswers);
  };

  const handleAnswerChange = (qId: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleFinishExam = () => {
    let calculatedScore = 0;

    examQuestionsData.forEach(q => {
      const userAns = (answers[q.id] || '').trim();
      if (!userAns) return;

      if (q.type === 'number') {
        const parsed = parseInt(userAns);
        if (parsed === q.correctAnswer) {
          calculatedScore += q.points;
        }
      } else if (q.type === 'choice') {
        if (userAns === q.correctAnswer) {
          calculatedScore += q.points;
        }
      } else if (q.type === 'command') {
        const normUser = userAns.toLowerCase().replace(/\s+/g, ' ');
        const normCorr = String(q.correctAnswer).toLowerCase().replace(/\s+/g, ' ');
        if (normUser === normCorr || normUser.includes(normCorr) || (normCorr.includes(normUser) && normUser.length > 8)) {
          calculatedScore += q.points;
        }
      } else if (q.type === 'code') {
        const code = userAns.toLowerCase();
        if (q.id === 1) { // double_it
          if (code.includes('tail_is_clean') && code.includes('scanf') && code.includes('n/a') && code.includes('return 0;')) {
            calculatedScore += q.points;
          }
        } else if (q.id === 6) { // divide_by_sub
          if (code.includes('while') && (code.includes('-=') || code.includes('-')) && code.includes('*q') && !code.includes('/') && !code.includes('%')) {
            calculatedScore += q.points;
          }
        }
      }
    });

    setExamScore(calculatedScore);
    setIsFinished(true);
    const timeSpent = 45 * 60 - timeLeftSeconds;
    saveExamResult(calculatedScore, 100, answers, timeSpent);
  };

  const totalPoints = 100;
  const passed = (examScore / totalPoints) >= 0.75;
  const currentQ = examQuestionsData[currentQuestionIdx];

  if (!examStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-8">
        <div className="p-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-lg">
            <Timer size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Симулятор финального экзамена C & Школа 21
            </h1>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              10 практических и теоретических задач на время. Проверяются навыки написания C-кода, валидации с <code className="text-emerald-400">n/a</code>, математики простых делителей, работы с указателями и Git.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400">Время:</div>
              <div className="text-lg font-bold text-slate-100 mt-1">45:00 мин</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400">Количество задач:</div>
              <div className="text-lg font-bold text-slate-100 mt-1">10 задач</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400">Проходной балл:</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">75%+ (75 XP)</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 max-w-xl mx-auto text-left leading-relaxed">
            <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Правила симулятора экзамена:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Запрещено подглядывать в готовые решения и интернет</li>
              <li>Код должен строго следовать принципам Дейкстры (одна точка выхода)</li>
              <li>Любой мусорный ввод должен обрабатываться выводом <code>n/a</code></li>
            </ul>
          </div>

          <div>
            <button
              onClick={handleStartExam}
              className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-emerald-950 active:scale-95 cursor-pointer"
            >
              Начать экзамен (45 минут)
            </button>
          </div>
        </div>

        {/* Previous Attempts history */}
        {progress.examAttempts.length > 0 && (
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="font-bold text-slate-200 text-sm">История предыдущих попыток:</h3>
            <div className="space-y-2">
              {progress.examAttempts.map((att, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    {att.passed ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                      <XCircle size={16} className="text-rose-400" />
                    )}
                    <span className="font-medium text-slate-200">
                      {att.passed ? 'Сдано успешно' : 'Не сдано'} ({att.score}/{att.maxScore} баллов)
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono">
                    {new Date(att.date).toLocaleDateString()} {new Date(att.date).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Finished Screen
  if (isFinished) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-8 animate-fadeIn">
        <div className={`p-8 rounded-3xl border text-center space-y-6 shadow-2xl ${
          passed 
            ? 'border-emerald-500/50 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-950' 
            : 'border-rose-500/50 bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-950'
        }`}>
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl ${
            passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {passed ? <Trophy size={40} /> : <AlertTriangle size={40} />}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Итоговый вердикт
            </span>
            <h1 className="text-3xl font-extrabold text-white">
              {passed ? '🎉 ЭКЗАМЕН УСПЕШНО СДАН!' : '⚠️ ЭКЗАМЕН НЕ СДАН'}
            </h1>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              {passed 
                ? 'Отличный результат! Ты уверенно владеешь валидацией, математикой простых множителей, работой с указателями и Git. Ты готова к проверкам следующего дня!'
                : 'Не расстраивайся! Проанализируй ошибки ниже, повтори темы "Кирпичики" и валидацию scanf, и попробуй ещё раз.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm font-mono">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 block">Набранный балл:</span>
              <span className={`text-2xl font-extrabold ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {examScore} / 100
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 block">Время выполнения:</span>
              <span className="text-2xl font-extrabold text-slate-200">
                {formatTime(45 * 60 - timeLeftSeconds)}
              </span>
            </div>
          </div>

          <div>
            <button
              onClick={handleStartExam}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              Пройти повторно
            </button>
          </div>
        </div>

        {/* Detailed Review per Question */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Подробный разбор каждого задания:</h3>

          {examQuestionsData.map((q, idx) => {
            const userAns = answers[q.id] || '';
            let isQCorrect = false;

            if (q.type === 'number') {
              isQCorrect = parseInt(userAns) === q.correctAnswer;
            } else if (q.type === 'choice') {
              isQCorrect = userAns === q.correctAnswer;
            } else if (q.type === 'command') {
              const nu = userAns.toLowerCase().replace(/\s+/g, ' ');
              const nc = String(q.correctAnswer).toLowerCase().replace(/\s+/g, ' ');
              isQCorrect = nu === nc || nu.includes(nc);
            } else if (q.type === 'code') {
              const code = userAns.toLowerCase();
              if (q.id === 1) isQCorrect = code.includes('tail_is_clean') && code.includes('scanf') && code.includes('n/a');
              if (q.id === 6) isQCorrect = code.includes('while') && code.includes('*q');
            }

            return (
              <div
                key={q.id}
                className={`p-6 rounded-2xl border space-y-4 ${
                  isQCorrect 
                    ? 'border-emerald-500/30 bg-slate-900/50' 
                    : 'border-rose-500/30 bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold">
                      #{idx + 1}
                    </span>
                    <h4 className="font-bold text-slate-100 text-sm">{q.title}</h4>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                    isQCorrect 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {isQCorrect ? `+${q.points} баллов` : '0 баллов'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{q.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Твой ответ:</span>
                    <pre className="text-slate-200 whitespace-pre-wrap">{userAns || '<пусто>'}</pre>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Правильный ответ / эталон:</span>
                    <pre className="text-emerald-400 whitespace-pre-wrap">{String(q.correctAnswer || 'Код по стандартам Школы 21')}</pre>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200">
                  <span className="font-semibold text-indigo-300">💡 Разбор задания: </span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Exam view
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Exam Header & Timer Bar */}
      <div className="sticky top-20 z-30 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold flex items-center gap-2 border ${
            timeLeftSeconds < 300 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
              : 'bg-slate-900 text-emerald-400 border-slate-800'
          }`}>
            <Timer size={16} />
            <span>Осталось: {formatTime(timeLeftSeconds)}</span>
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            title={isPaused ? 'Продолжить' : 'Пауза'}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        </div>

        {/* Question Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {examQuestionsData.map((q, idx) => {
            const hasAns = Boolean((answers[q.id] || '').trim());
            const isCurr = currentQuestionIdx === idx;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIdx(idx)}
                className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all ${
                  isCurr
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                    : hasAns
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleFinishExam}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-950 cursor-pointer"
        >
          <Send size={13} />
          <span>Завершить экзамен</span>
        </button>
      </div>

      {isPaused ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <Pause size={48} className="mx-auto text-amber-400" />
          <h3 className="text-xl font-bold text-white">Экзамен на паузе</h3>
          <p className="text-xs text-slate-400">Таймер остановлен. Нажми кнопку ниже, чтобы продолжить.</p>
          <button
            onClick={() => setIsPaused(false)}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-slate-950 text-xs font-bold"
          >
            Продолжить решение
          </button>
        </div>
      ) : (
        /* Active Question Card */
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-sm">
                #{currentQuestionIdx + 1}
              </span>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                  {currentQ.category}
                </span>
                <h2 className="text-lg font-bold text-white">{currentQ.title}</h2>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-950 text-emerald-400 border border-slate-800 font-bold">
              {currentQ.points} баллов
            </span>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {currentQ.description}
          </div>

          {/* Input Area Based on Question Type */}
          <div className="pt-2">
            {currentQ.type === 'code' && (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <Terminal size={14} className="text-emerald-400" />
                  <span>Редактор C-кода:</span>
                </div>
                <textarea
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  rows={12}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl p-4 font-mono text-xs text-slate-100 placeholder-slate-600 focus:outline-none leading-relaxed"
                  placeholder="// Твой C код..."
                  spellCheck={false}
                />
              </div>
            )}

            {currentQ.type === 'command' && (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-mono">Введи команду консоли:</div>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500 px-3 py-2">
                  <span className="text-emerald-400 font-mono text-xs mr-2 select-none">$</span>
                  <input
                    type="text"
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="gcc ..., git ..."
                    className="w-full bg-transparent font-mono text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {currentQ.type === 'number' && (
              <div className="space-y-2 max-w-xs">
                <div className="text-xs text-slate-400 font-mono">Числовой ответ:</div>
                <input
                  type="number"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  placeholder="Введите число..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 font-mono text-sm text-emerald-400 font-bold focus:outline-none"
                />
              </div>
            )}

            {currentQ.type === 'choice' && currentQ.options && (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-mono mb-2">Выберите один вариант:</div>
                <div className="space-y-2">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <label
                        key={oIdx}
                        onClick={() => handleAnswerChange(currentQ.id, opt)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 text-indigo-100'
                            : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`exam-q-${currentQ.id}`}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(currentQ.id, opt)}
                          className="mt-0.5 text-indigo-500"
                        />
                        <span className="flex-1 whitespace-pre-wrap font-mono">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Navigation between Questions */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
              disabled={currentQuestionIdx === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 disabled:opacity-40"
            >
              <ArrowLeft size={14} />
              <span>Предыдущая</span>
            </button>

            {currentQuestionIdx < examQuestionsData.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
              >
                <span>Следующая</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleFinishExam}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold shadow-lg"
              >
                <span>Завершить и сдать</span>
                <Send size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
