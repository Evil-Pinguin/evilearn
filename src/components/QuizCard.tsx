import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { useProgress } from '../context/ProgressContext';
import { CodeBlock } from './CodeBlock';
import { CheckCircle2, XCircle, HelpCircle, Trophy, RotateCcw } from 'lucide-react';

interface QuizCardProps {
  lessonId: string;
  questions: QuizQuestion[];
}

export const QuizCard: React.FC<QuizCardProps> = ({ lessonId, questions }) => {
  const { progress, saveQuizResult } = useProgress();
  const savedQuiz = progress.quizScores[lessonId];

  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>(
    savedQuiz?.userAnswers || {}
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(Boolean(savedQuiz));

  const handleSelect = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleCheckAnswers = () => {
    let correctCount = 0;
    questions.forEach(q => {
      const selected = selectedAnswers[q.id];
      const correctOpt = q.options.find(o => o.isCorrect);
      if (correctOpt && selected === correctOpt.id) {
        correctCount++;
      }
    });

    setIsSubmitted(true);
    saveQuizResult(lessonId, correctCount, questions.length, selectedAnswers);
  };

  const handleRetry = () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
  };

  let currentScore = 0;
  if (isSubmitted) {
    questions.forEach(q => {
      const selected = selectedAnswers[q.id];
      const correctOpt = q.options.find(o => o.isCorrect);
      if (correctOpt && selected === correctOpt.id) {
        currentScore++;
      }
    });
  }

  const percentage = questions.length > 0 ? Math.round((currentScore / questions.length) * 100) : 0;
  const isPassed = percentage >= 80;
  const allAnswered = questions.every(q => selectedAnswers[q.id]);

  return (
    <div className="my-6 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Quiz Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <HelpCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Проверочный тест (порог 80%+)
          </h3>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
              isPassed 
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
            }`}>
              {currentScore}/{questions.length} ({percentage}%) — {isPassed ? 'Сдано ✅' : 'Не сдано'}
            </span>
            <button
              onClick={handleRetry}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              title="Пройти заново"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="p-5 space-y-6">
        {questions.map((question, qIdx) => {
          const selectedOption = selectedAnswers[question.id];
          const correctOption = question.options.find(o => o.isCorrect);
          const isCorrect = isSubmitted && selectedOption === correctOption?.id;

          return (
            <div key={question.id} className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 mt-0.5">
                  {qIdx + 1}.
                </span>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                  {question.question}
                </h4>
              </div>

              {question.codeSnippet && (
                <CodeBlock code={question.codeSnippet} language="c" showLineNumbers={false} />
              )}

              {/* Options */}
              <div className="space-y-1.5 pl-4">
                {question.options.map(option => {
                  const isOptionSelected = selectedOption === option.id;
                  let optionStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';

                  if (isSubmitted) {
                    if (option.isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-medium';
                    } else if (isOptionSelected && !option.isCorrect) {
                      optionStyle = 'border-rose-400 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200';
                    } else {
                      optionStyle = 'border-slate-200 dark:border-slate-800 opacity-50';
                    }
                  } else if (isOptionSelected) {
                    optionStyle = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 font-medium';
                  }

                  return (
                    <label
                      key={option.id}
                      onClick={() => handleSelect(question.id, option.id)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${optionStyle}`}
                    >
                      <input
                        type="radio"
                        name={`q-${question.id}`}
                        checked={isOptionSelected}
                        onChange={() => handleSelect(question.id, option.id)}
                        disabled={isSubmitted}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="flex-1">{option.text}</span>
                      {isSubmitted && option.isCorrect && (
                        <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isSubmitted && isOptionSelected && !option.isCorrect && (
                        <XCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Explanation */}
              {isSubmitted && (
                <div className="pl-4">
                  <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    isCorrect 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200' 
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    <span className="font-semibold block mb-0.5">
                      {isCorrect ? '✅ Верно!' : '💡 Разбор ответа:'}
                    </span>
                    <p>{question.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Submit */}
        {!isSubmitted && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleCheckAnswers}
              disabled={!allAnswered}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                allAnswered
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <span>{allAnswered ? 'Проверить ответы' : 'Ответьте на все вопросы'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
