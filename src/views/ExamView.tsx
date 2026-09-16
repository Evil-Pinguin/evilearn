import React, { useState, useEffect, useMemo, useRef } from 'react';
import { examQuestionsData } from '../data/examData';
import { useProgress } from '../context/ProgressContext';
import { CodeBlock } from '../components/CodeBlock';
import { CodeEditor } from '../components/CodeEditor';
import { CheckFeedback, StatusLed } from '../components/CheckFeedback';
import { checkExamAnswer, statusStyles } from '../utils/liveCheck';
import {
  Timer,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Send,
  Lightbulb,
  Clock,
  Infinity as InfinityIcon
} from 'lucide-react';

const EXAM_MINUTES = 45;
const TOTAL_POINTS = 100;

export const ExamView: React.FC = () => {
  const { progress, saveExamResult } = useProgress();
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [useTimer, setUseTimer] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(EXAM_MINUTES * 60);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [checkedQuestions, setCheckedQuestions] = useState<{ [qId: number]: boolean }>({});
  const [showHintMap, setShowHintMap] = useState<{ [qId: number]: boolean }>({});
  const [answers, setAnswers] = useState<{ [id: number]: string }>({});
  const [examScore, setExamScore] = useState<number>(0);

  // Актуальные ответы для колбэка таймера (иначе экзамен «истекает» со старыми данными)
  const answersRef = useRef<{ [id: number]: string }>({});
  answersRef.current = answers;

  const currentQ = examQuestionsData[currentQuestionIdx];
  const currentAnswer = answers[currentQ?.id] ?? '';

  const live = useMemo(() => (currentQ ? checkExamAnswer(currentQ, currentAnswer) : null), [currentQ, currentAnswer]);

  const allResults = useMemo(
    () => examQuestionsData.map(q => ({ q, res: checkExamAnswer(q, answers[q.id] || '') })),
    [answers]
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (examStarted && !isFinished && !isPaused && useTimer) {
      interval = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examStarted, isFinished, isPaused, useTimer]);

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
    setTimeLeftSeconds(EXAM_MINUTES * 60);
    setIsPaused(false);
    setCheckedQuestions({});
    setShowHintMap({});
    const initial: { [id: number]: string } = {};
    examQuestionsData.forEach(q => {
      if (q.starterCode) initial[q.id] = q.starterCode;
    });
    setAnswers(initial);
  };

  const setAnswer = (qId: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const goTo = (idx: number) => {
    const next = Math.max(0, Math.min(examQuestionsData.length - 1, idx));
    setCurrentQuestionIdx(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishExam = () => {
    const latest = answersRef.current;
    let score = 0;
    examQuestionsData.forEach(q => {
      if (checkExamAnswer(q, latest[q.id] || '').status === 'correct') score += q.points;
    });
    setExamScore(score);
    setIsFinished(true);
    saveExamResult(score, TOTAL_POINTS, latest, useTimer ? EXAM_MINUTES * 60 - timeLeftSeconds : 0);
  };

  const passed = examScore / TOTAL_POINTS >= 0.75;

  /* ---------------- Стартовый экран ---------------- */
  if (!examStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 py-2">
        <div className="p-5 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 space-y-4">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Симулятор экзамена C · 10 задач</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Подсказка есть у каждой задачи. Ответ подсвечивается сразу по мере ввода: зелёный — всё на месте,
              янтарный — не дописано, красный — ошибка.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => handleStartExam(false)}
              className="p-3.5 rounded-md border border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40 text-left transition-colors"
            >
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <InfinityIcon size={14} /> Без таймера
                <span className="text-[10px] ml-auto px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-200 font-medium">
                  рекомендую
                </span>
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Спокойная практика: можно проверять каждую задачу по отдельности и сразу видеть недочёты.
              </p>
            </button>

            <button
              onClick={() => handleStartExam(true)}
              className="p-3.5 rounded-md border border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-950 text-left transition-colors"
            >
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock size={14} /> С таймером ({EXAM_MINUTES} мин)
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Симуляция реального экзамена с обратным отсчётом.</p>
            </button>
          </div>
        </div>

        {progress.examAttempts.length > 0 && (
          <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-200 text-xs">История попыток</h3>
            <div className="space-y-1.5">
              {progress.examAttempts.slice(0, 3).map((att, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                    {att.passed ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-rose-500" />}
                    {att.passed ? 'Сдано' : 'Не сдано'} ({att.score}/{att.maxScore})
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{new Date(att.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---------------- Экран результатов ---------------- */
  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 py-2">
        <div
          className={`p-5 rounded-lg border space-y-3 ${
            passed
              ? 'border-emerald-400 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/20'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy size={20} className={passed ? 'text-emerald-600' : 'text-slate-400'} />
              {passed ? 'Экзамен сдан' : 'Практика завершена'}
            </h1>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              {examScore} / {TOTAL_POINTS}
              {useTimer && ` · ${formatTime(EXAM_MINUTES * 60 - timeLeftSeconds)}`}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {passed ? 'Код написан уверенно, можно брать следующий квест.' : 'Разбери задачи ниже и повтори сложные темы.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleStartExam(useTimer)}
              className="px-3 py-1.5 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw size={12} /> Пройти ещё раз
            </button>
            <button
              onClick={() => setIsFinished(false)}
              className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300"
            >
              Вернуться к ответам
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {examQuestionsData.map((q, idx) => {
            const res = checkExamAnswer(q, answers[q.id] || '');
            const earned = res.status === 'correct';
            return (
              <div key={q.id} className="p-4 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${statusStyles[earned ? 'correct' : 'wrong'].dot}`} />
                    {idx + 1}. {q.title.replace(/^Задача \d+:\s*/, '')}
                  </h4>
                  <span className={`text-[11px] font-mono ${earned ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {earned ? `+${q.points}` : `0/${q.points}`}
                  </span>
                </div>

                {(answers[q.id] || '').trim() ? (
                  <CodeBlock code={answers[q.id]} language={q.type === 'code' ? 'c' : 'bash'} showLineNumbers={false} />
                ) : (
                  <p className="text-[11px] text-slate-400 italic">Ты оставила задачу пустой.</p>
                )}

                {!earned && res.missing.length > 0 && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-300">не хватало: {res.missing.join(', ')}</p>
                )}

                {q.referenceSolution && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Эталон</span>
                    <CodeBlock code={q.referenceSolution} language="c" showLineNumbers={false} />
                  </div>
                )}

                <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Пояснение: </span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------- Активный экзамен ---------------- */
  const hintOpen = Boolean(showHintMap[currentQ.id]);
  const isChecked = Boolean(checkedQuestions[currentQ.id]);
  const shownStatus = live?.status ?? 'empty';

  return (
    <div className="max-w-3xl mx-auto space-y-3 pb-16">
      {/* Верхняя панель */}
      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {useTimer ? (
            <span
              className={`px-2 py-1 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 ${
                timeLeftSeconds < 300 ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Timer size={13} /> {formatTime(timeLeftSeconds)}
            </span>
          ) : (
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <InfinityIcon size={13} className="text-emerald-500" /> без лимита
            </span>
          )}
          <button
            onClick={() => setIsPaused(v => !v)}
            className="px-2 py-1 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
          >
            {isPaused ? 'продолжить' : 'пауза'}
          </button>
        </div>

        {/* Номера задач со «светодиодами» */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {allResults.map(({ q, res }, idx) => (
            <button
              key={q.id}
              onClick={() => goTo(idx)}
              title={`${q.title}: ${statusStyles[res.status].label}`}
              className={`w-7 h-7 rounded-md text-xs font-mono font-semibold flex items-center justify-center relative transition-colors ${
                currentQuestionIdx === idx
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {idx + 1}
              <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900 ${statusStyles[res.status].dot}`} />
            </button>
          ))}
        </div>

        <button
          onClick={finishExam}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold"
        >
          <Send size={12} /> Завершить
        </button>
      </div>

      {/* Карточка задачи */}
      <div className="p-4 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Задача {currentQuestionIdx + 1} · {currentQ.category} · {currentQ.points} баллов
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{currentQ.title}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusLed status={shownStatus ?? 'empty'} />
            <button
              onClick={() => setShowHintMap(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                hintOpen
                  ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Lightbulb size={13} className={hintOpen ? 'text-amber-500 fill-amber-500' : ''} />
              <span>{hintOpen ? 'Скрыть' : 'Подсказка'}</span>
            </button>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{currentQ.description}</div>

        {hintOpen && (
          <div className="p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200">
            <span className="font-semibold block mb-0.5">Подсказка</span>
            {currentQ.hint}
          </div>
        )}

        {(currentQ.sampleInput || currentQ.expectedOutputSample) && (
          <div className="flex flex-wrap gap-3 text-[11px] font-mono text-slate-500">
            {currentQ.sampleInput && <span>ввод: <span className="text-slate-800 dark:text-slate-200">{currentQ.sampleInput}</span></span>}
            {currentQ.expectedOutputSample && <span>ожидается: <span className="text-emerald-700 dark:text-emerald-400">{currentQ.expectedOutputSample}</span></span>}
          </div>
        )}

        {/* Поле ответа */}
        <div className="space-y-1.5">
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
            <Terminal size={12} className="text-emerald-500" />
            {currentQ.type === 'code' ? 'Редактор C-кода' : currentQ.type === 'command' ? 'Команда' : 'Ответ'}
          </div>

          {currentQ.type === 'choice' && currentQ.options ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {currentQ.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => setAnswer(currentQ.id, opt)}
                  className={`p-2 rounded-md border text-left text-xs ${
                    answers[currentQ.id] === opt
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <CodeEditor
              key={currentQ.id}
              value={currentQ.type === 'number' ? String(answers[currentQ.id] ?? '') : currentAnswer}
              onChange={val => setAnswer(currentQ.id, val)}
              language={currentQ.type === 'code' ? 'c' : currentQ.type === 'command' ? 'bash' : 'text'}
              minRows={currentQ.type === 'code' ? 14 : 3}
              prompt={currentQ.type === 'code' ? undefined : '$'}
              placeholder={currentQ.type === 'number' ? 'число…' : currentQ.type === 'code' ? '// Enter — новая строка' : 'gcc …, git …'}
              status={shownStatus ?? 'empty'}
              enterGoesNext={currentQ.type === 'number'}
              onCheck={() => {
                setCheckedQuestions(prev => ({ ...prev, [currentQ.id]: true }));
                if (live && live.status === 'correct') goTo(currentQuestionIdx + 1);
              }}
              onNext={() => goTo(currentQuestionIdx + 1)}
            />
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCheckedQuestions(prev => ({ ...prev, [currentQ.id]: true }))}
              className="px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium"
            >
              Проверить эту задачу
            </button>
            <span className="text-[10px] font-mono text-slate-400">Ctrl+Enter — то же самое</span>
          </div>

          {live && <CheckFeedback result={live} />}

          {isChecked && live && (
            <div
              className={`p-2.5 rounded-md border text-xs ${
                live.status === 'correct'
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200'
                  : 'border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/25 text-amber-900 dark:text-amber-200'
              }`}
            >
              <span className="font-semibold">{live.status === 'correct' ? 'Зачтено. ' : 'Пока не зачтено. '}</span>
              {live.status === 'correct'
                ? currentQ.explanation
                : live.missing.length
                  ? `Дописать: ${live.missing.join(', ')}.`
                  : 'Открой подсказку и сверь формат вывода.'}
            </div>
          )}
        </div>

        {/* Навигация */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() => goTo(currentQuestionIdx - 1)}
            disabled={currentQuestionIdx === 0}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs disabled:opacity-40"
          >
            <ArrowLeft size={13} /> Назад
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            {allResults.filter(r => r.res.status === 'correct').length}/{examQuestionsData.length} готово
          </span>

          {currentQuestionIdx < examQuestionsData.length - 1 ? (
            <button
              onClick={() => goTo(currentQuestionIdx + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Следующая <ArrowRight size={13} />
            </button>
          ) : (
            <button
              onClick={finishExam}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold"
            >
              Завершить и проверить <Send size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
