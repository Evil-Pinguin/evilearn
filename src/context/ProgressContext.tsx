import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProgress } from '../types';
import { lessonsData, modulesData } from '../data/lessonsData';
import confetti from 'canvas-confetti';

interface ProgressContextType {
  progress: UserProgress;
  markExerciseAttempted: (exerciseId: string, attempted: boolean, code?: string) => void;
  saveQuizResult: (lessonId: string, score: number, total: number, userAnswers: { [qId: string]: string }) => void;
  toggleFlashcardKnown: (cardId: string) => void;
  recordMathDrillSuccess: (num: number) => void;
  saveExamResult: (score: number, maxScore: number, answers: { [key: number]: string }, timeSpentSeconds: number) => void;
  resetProgress: () => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getModuleProgress: (moduleId: string) => { completed: number; total: number; percentage: number };
  getTotalProgress: () => { completedLessons: number; totalLessons: number; percentage: number; xp: number };
  triggerCelebration: () => void;
}

const STORAGE_KEY = 'evilearn_c_path_progress_v1';

const defaultProgress: UserProgress = {
  completedLessons: [],
  completedExercises: {},
  quizScores: {},
  flashcardStatus: {},
  mathDrillProgress: {
    solvedNumbers: [],
    streak: 0,
    score: 0
  },
  examAttempts: [],
  xp: 150, // Starting bonus for student breashee
  streakDays: 3
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
    return defaultProgress;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    const lesson = lessonsData.find(l => l.id === lessonId);
    if (!lesson) return false;

    // Condition 1: All exercises are marked "attempted myself"
    const hasExercises = lesson.exercises.length > 0;
    const allExercisesAttempted = hasExercises && lesson.exercises.every(ex => {
      const state = progress.completedExercises[ex.id];
      return state && state.attemptedMyself;
    });

    // Condition 2: Quiz passed >= 80%
    const quizResult = progress.quizScores[lessonId];
    const quizPassed = quizResult && quizResult.total > 0 && (quizResult.score / quizResult.total) >= 0.8;

    return Boolean(allExercisesAttempted || quizPassed);
  };

  const markExerciseAttempted = (exerciseId: string, attempted: boolean, code?: string) => {
    setProgress(prev => {
      const existing = prev.completedExercises[exerciseId] || {
        attemptedMyself: false,
        userCode: '',
        completedAt: ''
      };

      const wasAlreadyAttempted = existing.attemptedMyself;
      const isNewAttempt = attempted && !wasAlreadyAttempted;

      const updated = {
        ...prev,
        completedExercises: {
          ...prev.completedExercises,
          [exerciseId]: {
            attemptedMyself: attempted,
            userCode: code !== undefined ? code : existing.userCode,
            completedAt: attempted ? new Date().toISOString() : existing.completedAt
          }
        },
        xp: isNewAttempt ? prev.xp + 50 : prev.xp
      };

      if (isNewAttempt) {
        triggerCelebration();
      }

      return updated;
    });
  };

  const saveQuizResult = (lessonId: string, score: number, total: number, userAnswers: { [qId: string]: string }) => {
    const percentage = total > 0 ? (score / total) : 0;
    const passed = percentage >= 0.8;

    setProgress(prev => {
      const prevQuiz = prev.quizScores[lessonId];
      const prevPassed = prevQuiz ? prevQuiz.passed : false;
      const gainedXp = (!prevPassed && passed) ? 100 : (score * 15);

      if (passed && !prevPassed) {
        triggerCelebration();
      }

      return {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [lessonId]: {
            score,
            total,
            passed,
            completedAt: new Date().toISOString(),
            userAnswers
          }
        },
        xp: prev.xp + gainedXp
      };
    });
  };

  const toggleFlashcardKnown = (cardId: string) => {
    setProgress(prev => {
      const current = prev.flashcardStatus[cardId];
      const nextStatus = current === 'known' ? 'learning' : 'known';
      const xpDelta = nextStatus === 'known' ? 10 : 0;

      return {
        ...prev,
        flashcardStatus: {
          ...prev.flashcardStatus,
          [cardId]: nextStatus
        },
        xp: prev.xp + xpDelta
      };
    });
  };

  const recordMathDrillSuccess = (num: number) => {
    setProgress(prev => {
      const already = prev.mathDrillProgress.solvedNumbers.includes(num);
      const newSolved = already ? prev.mathDrillProgress.solvedNumbers : [...prev.mathDrillProgress.solvedNumbers, num];
      const newStreak = prev.mathDrillProgress.streak + 1;
      const newScore = prev.mathDrillProgress.score + (already ? 10 : 30);

      triggerCelebration();

      return {
        ...prev,
        mathDrillProgress: {
          solvedNumbers: newSolved,
          streak: newStreak,
          score: newScore
        },
        xp: prev.xp + 25
      };
    });
  };

  const saveExamResult = (score: number, maxScore: number, answers: { [key: number]: string }, timeSpentSeconds: number) => {
    const passed = (score / maxScore) >= 0.75;
    const newAttempt = {
      id: 'exam-' + Date.now(),
      date: new Date().toISOString(),
      score,
      maxScore,
      passed,
      timeSpentSeconds,
      answers
    };

    if (passed) {
      triggerCelebration();
    }

    setProgress(prev => ({
      ...prev,
      examAttempts: [newAttempt, ...prev.examAttempts],
      xp: prev.xp + (passed ? 300 : score * 10)
    }));
  };

  const resetProgress = () => {
    if (window.confirm('Сбросить весь прогресс? Это действие очистит историю упражнений и тестов.')) {
      setProgress(defaultProgress);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getModuleProgress = (moduleId: string) => {
    const module = modulesData.find(m => m.id === moduleId);
    if (!module) return { completed: 0, total: 0, percentage: 0 };

    const total = module.lessons.length;
    let completed = 0;

    module.lessons.forEach(lId => {
      if (isLessonCompleted(lId)) {
        completed++;
      }
    });

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const getTotalProgress = () => {
    const totalLessons = lessonsData.length;
    let completedCount = 0;

    lessonsData.forEach(lesson => {
      if (isLessonCompleted(lesson.id)) {
        completedCount++;
      }
    });

    return {
      completedLessons: completedCount,
      totalLessons,
      percentage: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
      xp: progress.xp
    };
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markExerciseAttempted,
        saveQuizResult,
        toggleFlashcardKnown,
        recordMathDrillSuccess,
        saveExamResult,
        resetProgress,
        isLessonCompleted,
        getModuleProgress,
        getTotalProgress,
        triggerCelebration
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
