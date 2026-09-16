/** Все вкладки приложения. */
export type ViewId =
  | 'home'
  | 'lesson'
  | 'exam'
  | 'flashcards'
  | 'math'
  | 'tools'
  | 'day2'
  | 'commands';

export interface Exercise {
  id: string;
  title: string;
  condition: string;
  taskType: 'c_code' | 'bash_command' | 'math_drill' | 'git_command';
  initialCode?: string;
  placeholder?: string;
  expectedOutput?: string;
  /** Что обязательно должно появиться в коде (для живой подсветки). */
  requiredParts?: { label: string; anyOf: string[] }[];
  testCases?: {
    input: string;
    expectedOutput: string;
    description: string;
  }[];
  hint: string;
  solution: string;
  solutionExplanation: string[];
  school21RulesNotice?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  /** Направление мысли без самого ответа — показывается по кнопке «Подсказка». */
  hint?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface Lesson {
  id: string;
  slug: string;
  number: number;
  moduleId: string;
  moduleNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  durationMinutes: number;
  isDay3Prep?: boolean;
  theoryContent: {
    title: string;
    paragraphs: string[];
    codeSnippets?: {
      code: string;
      language: string;
      title?: string;
      notes?: string;
    }[];
    tables?: {
      headers: string[];
      rows: string[][];
    }[];
    callouts?: {
      type: 'tip' | 'warning' | 'danger' | 'analogy' | 'peer_review';
      title: string;
      content: string;
    }[];
  }[];
  interactiveWidget?: 'prime_factor' | 'hex_ascii' | 'recursion_tree' | 'grid_calc' | 'terminal_sim';
  exercises: Exercise[];
  quiz: QuizQuestion[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  badge: string;
  lessons: string[];
}

export interface Flashcard {
  id: string;
  category: 'bash' | 'git' | 'c_basics' | 'c_advanced' | 'tools' | 'school21' | 'concepts';
  type: 'command' | 'concept';
  question: string;
  answer: string;
  codeExample?: string;
  tip?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ExamQuestion {
  id: number;
  title: string;
  category: string;
  type: 'code' | 'command' | 'choice' | 'number' | 'text';
  description: string;
  hint: string;
  starterCode?: string;
  options?: string[];
  correctAnswer?: string | number;
  /** Обязательные элементы ответа (для мгновенной подсветки и единого градинга). */
  requiredParts?: { label: string; anyOf: string[] }[];
  /** Приёмы, которые условие запрещает (например \n в конце вывода). */
  forbiddenParts?: { label: string; anyOf: string[] }[];
  referenceSolution?: string;
  sampleInput?: string;
  expectedOutputSample?: string;
  testCases?: {
    input: string;
    expected: string;
    description: string;
  }[];
  explanation: string;
  points: number;
}

export interface Day2Quest {
  id: string;
  name: string;
  file: string;
  title: string;
  description: string;
  code: string;
  lineByLine: {
    line: number;
    explanation: string;
    concept: string;
  }[];
  keyTakeaways: string[];
  peerReviewQuestions: string[];
}

export interface UserProgress {
  completedLessons: string[];
  completedExercises: {
    [exerciseId: string]: {
      attemptedMyself: boolean;
      userCode: string;
      isCorrect?: boolean;
      completedAt: string;
    };
  };
  quizScores: {
    [lessonId: string]: {
      score: number;
      total: number;
      passed: boolean;
      completedAt: string;
      userAnswers: { [questionId: string]: string };
    };
  };
  flashcardStatus: {
    [cardId: string]: 'known' | 'learning';
  };
  mathDrillProgress: {
    solvedNumbers: number[];
    streak: number;
    score: number;
  };
  examAttempts: {
    id: string;
    date: string;
    score: number;
    maxScore: number;
    passed: boolean;
    timeSpentSeconds: number;
    answers: { [questionId: number]: string };
  }[];
  swipeStats: SwipeStats;
  xp: number;
  streakDays: number;
}

export interface CommandStep {
  command: string;
  what: string;
  note?: string;
}

export interface CommandCheat {
  id: string;
  title: string;
  goal: string;
  emoji: string;
  /** Урок, к которому относится шпаргалка (для перехода в тренажёр) */
  lessonId?: string;
  steps: CommandStep[];
  pitfalls?: string[];
}

export interface SwipeStats {
  correct: number;
  wrong: number;
  bestStreak: number;
}
