import type { Subject } from './question';
import type { TechniqueScore } from './technique';

export interface QuestionResult {
  questionId: string;
  subject: Subject;
  correct: boolean;
  techniqueScore: TechniqueScore;
  readingTimeMs: number;
  totalTimeMs: number;
  highlightedWordIndices: number[];
  eliminatedOptionIndices: number[];
  selectedOptionIndex: number;
  timestamp: string;
}

export interface DailySession {
  date: string;
  questions: QuestionResult[];
  averageTechniqueScore: number;
  averageCorrectness: number;
  totalTimeMs: number;
  completed: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  freezesAvailable: number;
  freezesUsed: string[];
}

export interface SubjectProgress {
  questionsAttempted: number;
  questionsCorrect: number;
  averageTechniqueScore: number;
  averageTimeMs: number;
}

export interface MistakeQueueItem {
  questionId: string;
  firstWrongDate: string;
  lastSeenDate: string;
  interval: number;
  timesWrong: number;
}

export interface DailyChallengeProgress {
  lastCompletedDate: string | null;
  streak: number;
  totalCompleted: number;
  totalCorrect: number;
}

export interface MockExamProgress {
  totalAttempted: number;
  bestScore: number;
  lastAttemptDate: string | null;
}

export interface UserProgress {
  userId: string;
  currentWeek: number;
  streak: StreakData;
  sessions: DailySession[];
  totalQuestionsAnswered: number;
  totalCorrect: number;
  averageTechniqueScore: number;
  subjectScores: Record<Subject, SubjectProgress>;
  level: number;
  xp: number;
  xpToNextLevel: number;
  mistakeQueue: MistakeQueueItem[];
  dailyChallenge: DailyChallengeProgress;
  mockExams: MockExamProgress;
}
