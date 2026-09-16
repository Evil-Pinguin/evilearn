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

  // Calculate score if submitted
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
    <div className="my-8 rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-xl">
      {/* Quiz Header */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <HelpCircle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">Тест на закрепление материала</h3>
            <p className="text-xs text-slate-400">
              Порог успешной сдачи темы: <span className="text-indigo-400 font-semibold">80%+</span> ({Math.ceil(questions.length * 0.8)} из {questions.length} вопросов)
            </p>
          </div>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
              isPassed 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              <Trophy size={14} />
              <span>Результат: {currentScore}/{questions.length} ({percentage}%)</span>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <RotateCcw size={12} />
              <span>Пройти заново</span>
            </button>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="p-6 space-y-8">
        {questions.map((question, qIdx) => {
          const selectedOption = selectedAnswers[question.id];
          const correctOption = question.options.find(o => o.isCorrect);
          const isCorrect = isSubmitted && selectedOption === correctOption?.id;
          const isWrong = isSubmitted && selectedOption && !isCorrect;

          return (
            <div
              key={question.id}
              className={`p-5 rounded-2xl border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-rose-500/40 bg-rose-950/10'
                  : 'border-slate-800/80 bg-slate-950/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <div className="flex-1 space-y-3">
                  <h4 className="font-semibold text-slate-100 text-sm leading-snug">
                    {question.question}
                  </h4>

                  {question.codeSnippet && (
                    <CodeBlock code={question.codeSnippet} language="c" showLineNumbers={false} />
                  )}

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {question.options.map(option => {
                      const isOptionSelected = selectedOption === option.id;
                      let optionClasses = 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300';

                      if (isSubmitted) {
                        if (option.isCorrect) {
                          optionClasses = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-medium';
                        } else if (isOptionSelected && !option.isCorrect) {
                          optionClasses = 'border-rose-500/80 bg-rose-950/40 text-rose-200';
                        } else {
                          optionClasses = 'border-slate-800/40 bg-slate-900/20 text-slate-500 opacity-60';
                        }
                      } else if (isOptionSelected) {
                        optionClasses = 'border-indigo-500 bg-indigo-950/30 text-indigo-100 shadow-sm shadow-indigo-950';
                      }

                      return (
                        <label
                          key={option.id}
                          onClick={() => handleSelect(question.id, option.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-xs leading-relaxed cursor-pointer transition-all ${optionClasses}`}
                        >
                          <input
                            type="radio"
                            name={`q-${question.id}`}
                            checked={isOptionSelected}
                            onChange={() => handleSelect(question.id, option.id)}
                            disabled={isSubmitted}
                            className="mt-0.5 text-indigo-500 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                          />
                          <span className="flex-1">{option.text}</span>
                          {isSubmitted && option.isCorrect && (
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          {isSubmitted && isOptionSelected && !option.isCorrect && (
                            <XCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* Explanation after submit */}
                  {isSubmitted && (
                    <div className={`mt-3 p-3.5 rounded-xl border text-xs leading-relaxed animate-fadeIn ${
                      isCorrect 
                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200' 
                        : 'bg-slate-900/80 border-slate-700 text-slate-300'
                    }`}>
                      <div className="font-semibold mb-1 flex items-center gap-1.5">
                        {isCorrect ? (
                          <span className="text-emerald-300">✅ Верно! Объяснение:</span>
                        ) : (
                          <span className="text-amber-300">💡 Разбор правильного ответа:</span>
                        )}
                      </div>
                      <p className="text-slate-300">{question.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Submit Quiz Button */}
        {!isSubmitted && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleCheckAnswers}
              disabled={!allAnswered}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs transition-all shadow-lg ${
                allAnswered
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950 active:scale-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
              }`}
            >
              <span>{allAnswered ? 'Проверить ответы теста' : `Ответьте на все вопросы (${Object.keys(selectedAnswers).length}/${questions.length})`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
