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
  Lightbulb,
  Clock,
  Infinity as InfinityIcon
} from 'lucide-react';

export const ExamView: React.FC = () => {
  const { progress, saveExamResult } = useProgress();
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [useTimer, setUseTimer] = useState<boolean>(false); // Default to relaxed practice without stress
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(45 * 60);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showQuestionHint, setShowQuestionHint] = useState<{ [qId: number]: boolean }>({});

  const [answers, setAnswers] = useState<{ [id: number]: string }>({});
  const [examScore, setExamScore] = useState<number>(0);

  // Timer effect only if useTimer is enabled
  useEffect(() => {
    let interval: any = null;
    if (examStarted && !isFinished && !isPaused && useTimer) {
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
  }, [examStarted, isFinished, isPaused, useTimer, answers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (withTimer: boolean) => {
    setUseTimer(withTimer);
    setExamStarted(true);
    setIsFinished(false);
    setCurrentQuestionIdx(0);
    setTimeLeftSeconds(45 * 60);
    setIsPaused(false);
    setShowQuestionHint({});
    
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

  const toggleHint = (qId: number) => {
    setShowQuestionHint(prev => ({ ...prev, [qId]: !prev[qId] }));
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
        if (q.id === 1) { // I am ready
          if (code.includes('printf') && code.includes('i am ready!') && !code.includes('\\n')) {
            calculatedScore += q.points;
          }
        } else if (q.id === 2) { // Square of number
          if (code.includes('scanf') && (code.includes('extra') || code.includes('tail_is_clean') || code.includes('n/a'))) {
            calculatedScore += q.points;
          }
        } else if (q.id === 3) { // min_of_two
          if (code.includes('min') && (code.includes('<') || code.includes('?'))) {
            calculatedScore += q.points;
          }
        } else if (q.id === 4) { // sum_even
          if (code.includes('for') && (code.includes('+= 2') || code.includes('% 2 == 0'))) {
            calculatedScore += q.points;
          }
        } else if (q.id === 5) { // area circle
          if (code.includes('%.3f') || (code.includes('3.14') && code.includes('* r * r'))) {
            calculatedScore += q.points;
          }
        } else if (q.id === 6) { // letter / digit / other
          if (code.includes('letter') && code.includes('digit') && code.includes('other')) {
            calculatedScore += q.points;
          }
        } else if (q.id === 7) { // GCD euclid
          if (code.includes('while') && code.includes('-=') && (code.includes('a != b') || code.includes('a > b'))) {
            calculatedScore += q.points;
          }
        } else if (q.id === 8) { // Table
          if (code.includes('for') && code.includes(' | ')) {
            calculatedScore += q.points;
          }
        } else if (q.id === 9) { // Factorial
          if (code.includes('factorial') && (code.includes('factorial(') || code.includes('* factorial'))) {
            calculatedScore += q.points;
          }
        } else if (q.id === 10) { // Largest proper divisor
          if (code.includes('for') && code.includes('% d == 0')) {
            calculatedScore += q.points;
          }
        }
      }
    });

    setExamScore(calculatedScore);
    setIsFinished(true);
    const timeSpent = useTimer ? (45 * 60 - timeLeftSeconds) : 0;
    saveExamResult(calculatedScore, 100, answers, timeSpent);
  };

  const totalPoints = 100;
  const passed = (examScore / totalPoints) >= 0.75;
  const currentQ = examQuestionsData[currentQuestionIdx];

  // 1. Initial Launch Screen
  if (!examStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        <div className="p-6 sm:p-8 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Timer size={24} />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Симулятор экзамена C (10 задач)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              Практика написания кода по стандарту Школы 21. Доступны подсказки к каждой задаче и режим без таймера для комфортного обучения.
            </p>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
            <button
              onClick={() => handleStartExam(false)}
              className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <InfinityIcon size={14} /> Без таймера
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200/60 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-200 font-medium">
                  Рекомендуется
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Спокойная практика в своём темпе с подсказками к каждому заданию.
              </p>
            </button>

            <button
              onClick={() => handleStartExam(true)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Clock size={14} /> С таймером (45 мин)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Режим симуляции реального экзамена с обратным отсчётом времени.
              </p>
            </button>
          </div>
        </div>

        {/* Previous Attempts history */}
        {progress.examAttempts.length > 0 && (
          <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-slate-200 text-xs">История попыток:</h3>
            <div className="space-y-1.5">
              {progress.examAttempts.slice(0, 3).map((att, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    {att.passed ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <XCircle size={14} className="text-rose-500" />
                    )}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {att.passed ? 'Сдано' : 'Не сдано'} ({att.score}/{att.maxScore} баллов)
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {new Date(att.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Finished Screen
  if (isFinished) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-4">
        <div className={`p-6 sm:p-8 rounded-2xl border text-center space-y-4 ${
          passed 
            ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20' 
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
        }`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
            passed ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            {passed ? <Trophy size={28} /> : <CheckCircle2 size={28} />}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {passed ? '🎉 Экзамен сдан!' : 'Практика завершена'}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {passed 
                ? 'Отличный результат! Код написан уверенно, ты готова к следующим проектам.'
                : 'Разбери решения задач ниже и повтори сложные темы.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-4 text-xs font-mono p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span>Результат: <strong className={passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}>{examScore} / 100</strong></span>
            {useTimer && <span>Время: {formatTime(45 * 60 - timeLeftSeconds)}</span>}
          </div>

          <div>
            <button
              onClick={() => handleStartExam(false)}
              className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Пройти ещё раз
            </button>
          </div>
        </div>

        {/* Detailed Review per Question */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Разбор заданий:</h3>

          {examQuestionsData.map((q, idx) => {
            const userAns = answers[q.id] || '';
            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{q.title}</h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {q.points} баллов
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{q.description}</p>

                {userAns && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono">
                    <span className="text-slate-400 text-[10px] block mb-1">Твой ответ:</span>
                    <pre className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{userAns}</pre>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">💡 Пояснение: </span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Active Exam View
  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-16">
      {/* Top Bar with Question Tabs and optional Timer */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          {useTimer ? (
            <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
              timeLeftSeconds < 300 
                ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
            }`}>
              <Timer size={13} />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <InfinityIcon size={13} className="text-emerald-500" /> Без ограничения времени
            </span>
          )}
        </div>

        {/* Question Selector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {examQuestionsData.map((q, idx) => {
            const hasAns = Boolean((answers[q.id] || '').trim());
            const isCurr = currentQuestionIdx === idx;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIdx(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  isCurr
                    ? 'bg-emerald-600 text-white font-bold'
                    : hasAns
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleFinishExam}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 hover:opacity-90 text-white dark:text-slate-900 text-xs font-semibold transition-opacity cursor-pointer"
        >
          <Send size={12} />
          <span>Завершить</span>
        </button>
      </div>

      {/* Active Question Card */}
      <div className="p-5 sm:p-6 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-mono font-bold text-xs">
              {currentQuestionIdx + 1}
            </span>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                {currentQ.category}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {currentQ.title}
              </h2>
            </div>
          </div>

          {/* Hint Button */}
          <button
            onClick={() => toggleHint(currentQ.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              showQuestionHint[currentQ.id]
                ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lightbulb size={13} className={showQuestionHint[currentQ.id] ? 'text-amber-500 fill-amber-500' : ''} />
            <span>{showQuestionHint[currentQ.id] ? 'Скрыть подсказку' : 'Подсказка'}</span>
          </button>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {currentQ.description}
        </div>

        {/* Hint Box if toggled */}
        {showQuestionHint[currentQ.id] && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <div className="font-semibold text-amber-800 dark:text-amber-300 mb-0.5 flex items-center gap-1">
              <Lightbulb size={13} /> Подсказка:
            </div>
            <p>{currentQ.hint}</p>
          </div>
        )}

        {/* Code/Command Editor */}
        <div className="pt-1">
          {currentQ.type === 'code' && (
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                <Terminal size={12} className="text-emerald-500" />
                <span>Редактор C-кода:</span>
              </div>
              <textarea
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                rows={10}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl p-3.5 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none leading-relaxed"
                placeholder="// Напиши код решения..."
                spellCheck={false}
              />
            </div>
          )}

          {currentQ.type === 'command' && (
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-500 font-mono">Команда:</div>
              <input
                type="text"
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                placeholder="gcc ..., git ..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 font-mono text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                spellCheck={false}
              />
            </div>
          )}

          {currentQ.type === 'number' && (
            <div className="space-y-1.5 max-w-xs">
              <div className="text-[11px] text-slate-500 font-mono">Числовой ответ:</div>
              <input
                type="number"
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                placeholder="Введи число..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 font-mono text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Navigation between Questions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
            disabled={currentQuestionIdx === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium disabled:opacity-40"
          >
            <ArrowLeft size={13} />
            <span>Предыдущая</span>
          </button>

          {currentQuestionIdx < examQuestionsData.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              <span>Следующая</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <button
              onClick={handleFinishExam}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold"
            >
              <span>Завершить и проверить</span>
              <Send size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
