import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { useProgress } from '../context/ProgressContext';
import { CodeBlock } from './CodeBlock';
import { CheckCircle2, XCircle, Lightbulb, RotateCcw, Zap } from 'lucide-react';

interface QuizCardProps {
  lessonId: string;
  questions: QuizQuestion[];
}

/**
 * Проверочный тест: у каждого вопроса есть подсказка (не спойлер),
 * мгновенная подсветка неверного ответа и Enter -> следующий вопрос.
 */
export const QuizCard: React.FC<QuizCardProps> = ({ lessonId, questions }) => {
  const { progress, saveQuizResult } = useProgress();
  const savedQuiz = progress.quizScores[lessonId];

  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>(savedQuiz?.userAnswers || {});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(Boolean(savedQuiz));
  const [openHints, setOpenHints] = useState<{ [qId: string]: boolean }>({});
  const [instant, setInstant] = useState<boolean>(true);

  const isLocked = (qId: string) => isSubmitted || (instant && Boolean(selectedAnswers[qId]));

  const handleSelect = (question: QuizQuestion, optionId: string) => {
    if (isLocked(question.id)) return;
    setSelectedAnswers(prev => ({ ...prev, [question.id]: optionId }));
  };

  const handleCheckAnswers = () => {
    let correctCount = 0;
    questions.forEach(q => {
      const correctOpt = q.options.find(o => o.isCorrect);
      if (correctOpt && selectedAnswers[q.id] === correctOpt.id) correctCount++;
    });
    setIsSubmitted(true);
    saveQuizResult(lessonId, correctCount, questions.length, selectedAnswers);
  };

  const handleRetry = () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
    setOpenHints({});
  };

  const goNextQuestion = (currentIdx: number) => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-quiz-question]'));
    const next = nodes[currentIdx + 1];
    if (next) {
      next.scrollIntoView({ behavior: 'smooth', block: 'center' });
      next.focus();
    } else {
      document.querySelector<HTMLElement>('[data-quiz-submit]')?.focus();
    }
  };

  const answeredCount = questions.filter(q => selectedAnswers[q.id]).length;
  const correctCount = questions.filter(q => {
    const correctOpt = q.options.find(o => o.isCorrect);
    return correctOpt && selectedAnswers[q.id] === correctOpt.id;
  }).length;
  const percentage = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const isPassed = percentage >= 80;
  const allAnswered = questions.every(q => selectedAnswers[q.id]);

  return (
    <div data-quiz-block className="my-5 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Проверочный тест</h3>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
            порог 80%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setInstant(v => !v)}
            title="Подсвечивать неверный ответ сразу после выбора"
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors ${
              instant
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Zap size={12} className={instant ? 'fill-emerald-500 text-emerald-500' : ''} />
            <span>{instant ? 'Мгновенная подсветка вкл' : 'Мгновенная подсветка выкл'}</span>
          </button>

          {isSubmitted && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-md ${
                isPassed
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
              }`}
            >
              {correctCount}/{questions.length} ({percentage}%) — {isPassed ? 'сдано' : 'не сдано'}
            </span>
          )}
          {isSubmitted && (
            <button onClick={handleRetry} title="Пройти заново" className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <RotateCcw size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="p-4 space-y-5">
        {questions.map((question, qIdx) => {
          const selectedOption = selectedAnswers[question.id];
          const showFeedback = isSubmitted || (instant && Boolean(selectedOption));
          const correctId = question.options.find(o => o.isCorrect)?.id;
          const isCorrectPick = showFeedback && selectedOption === correctId;
          const hintOpen = Boolean(openHints[question.id]);

          return (
            <div
              key={question.id}
              data-quiz-question
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  goNextQuestion(qIdx);
                }
              }}
              className="space-y-2 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500/40 p-1 -m-1"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-mono text-slate-400 mt-0.5">{qIdx + 1}.</span>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{question.question}</h4>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {showFeedback && (
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${isCorrectPick ? 'bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]' : 'bg-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.18)]'}`} />
                  )}
                  {question.hint && (
                    <button
                      onClick={() => setOpenHints(prev => ({ ...prev, [question.id]: !prev[question.id] }))}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] ${
                        hintOpen
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : 'text-slate-400 hover:text-amber-600'
                      }`}
                    >
                      <Lightbulb size={11} className={hintOpen ? 'fill-amber-500 text-amber-500' : ''} />
                      подсказка
                    </button>
                  )}
                </div>
              </div>

              {question.codeSnippet && <CodeBlock code={question.codeSnippet} language="c" showLineNumbers={false} />}

              {hintOpen && question.hint && (
                <div className="ml-4 rounded-md border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/30 p-2 text-[11px] text-amber-900 dark:text-amber-200">
                  {question.hint}
                </div>
              )}

              <div className="space-y-1.5 ml-4">
                {question.options.map(option => {
                  const isSelected = selectedOption === option.id;
                  let cls =
                    'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600';
                  if (isSelected && !showFeedback) {
                    cls = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 font-medium';
                  } else if (showFeedback && option.id === correctId) {
                    cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium';
                  } else if (showFeedback && isSelected && option.id !== correctId) {
                    cls = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                  } else if (showFeedback) {
                    cls = 'border-slate-200 dark:border-slate-800 opacity-50';
                  }

                  return (
                    <label
                      key={option.id}
                      onClick={() => handleSelect(question, option.id)}
                      className={`flex items-start gap-2 p-2 rounded-md border text-xs cursor-pointer transition-colors ${cls}`}
                    >
                      <input
                        type="radio"
                        name={`q-${question.id}`}
                        checked={isSelected}
                        onChange={() => handleSelect(question, option.id)}
                        disabled={isLocked(question.id)}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="flex-1">{option.text}</span>
                      {showFeedback && option.id === correctId && <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />}
                      {showFeedback && isSelected && option.id !== correctId && <XCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />}
                    </label>
                  );
                })}
              </div>

              {showFeedback && (
                <div className="ml-4">
                  <div
                    className={`p-2.5 rounded-md border text-xs leading-relaxed ${
                      isCorrectPick
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-semibold block mb-0.5">{isCorrectPick ? 'Верно!' : 'Разбор ответа:'}</span>
                    <p>{question.explanation}</p>
                  </div>
                  {qIdx < questions.length - 1 && (
                    <button
                      onClick={() => goNextQuestion(qIdx)}
                      className="mt-1.5 text-[11px] text-slate-400 hover:text-emerald-600 font-mono"
                    >
                      Enter / клик — следующий вопрос →
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {!isSubmitted && (
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-[11px] font-mono text-slate-400">
              отвечено {answeredCount}/{questions.length}
              {instant && correctCount > 0 && ` · верно ${correctCount}`}
            </span>
            <button
              data-quiz-submit
              onClick={handleCheckAnswers}
              disabled={!allAnswered}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                allAnswered
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
              style={{ outline: 'none' }}
              tabIndex={0}
            >
              {allAnswered ? 'Проверить ответы' : `Осталось вопросов: ${questions.length - answeredCount}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
