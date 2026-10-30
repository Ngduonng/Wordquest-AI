/**
 * Types and interfaces for WordQuest AI
 * Đề tài: Ứng dụng AI trong thiết kế hoạt động học tiếng Anh cá nhân hóa
 * Lớp 5A4, Trường Tiểu học Hữu Nghị – Hòa Bình – Phú Thọ
 */

export type GradeLevel = 5;

export type TopicId = string;

export type WordStatus = 'new' | 'practising' | 'needs_review' | 'practised_successfully';

export type LearningLevel = 'basic' | 'practice' | 'challenge';

export interface VocabularyWord {
  id: string;
  word: string;
  vietnamese: string;
  phonetic: string;
  topic: TopicId;
  grade: GradeLevel;
  exampleEn: string;
  exampleVi: string;
  hint: string;
  categoryNameVi: string;
  emoji: string;
  imageUrl?: string;
  level?: LearningLevel;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
  };
}

export interface WordProgress {
  wordId: string;
  word: string;
  topic: string;
  grade: GradeLevel;
  attempts: number;
  correctCount: number;
  wrongCount: number;
  lastPracticed: number; // timestamp
  manualFlagged: boolean; // teacher or student flagged as needs review
  status: WordStatus;
}

export interface GameQuestion {
  id: string;
  wordId: string;
  word: string;
  question: string;
  questionType: 'multiple_choice' | 'sentence_completion' | 'match' | 'dialogue_match';
  options: string[];
  correctAnswer: string;
  vietnameseMeaning: string;
  explanationVi: string;
  grade: GradeLevel;
  topic: string;
  hint?: string;
  level?: LearningLevel;
  isAiGenerated?: boolean;
  isApproved?: boolean;
}

export interface SessionResult {
  sessionId: string;
  timestamp: number;
  gameType: string;
  topic: string;
  grade: GradeLevel;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  weakWordIds: string[];
  confidenceRating?: number; // 1-4
}

// ---------------- SPEAKING QUEST TYPES ----------------
export interface DialogueTurn {
  turnId: string;
  partnerPrompt: string;
  partnerPromptVi: string;
  promptSpeaker: string;
  suggestedResponse: string;
  responseVi: string;
  targetKeywords: string[];
  grammarFrame: string;
  hintsVi: string[];
  options: string[]; // Options for click/tap answering when microphone is disabled
}

export interface SpeakingScenario {
  id: string;
  title: string;
  titleVi: string;
  emoji: string;
  grade: GradeLevel;
  topic: TopicId;
  level: LearningLevel;
  learningObjective: string;
  situationEn: string;
  situationVi: string;
  partnerName: string;
  turns: DialogueTurn[];
}

export interface SpeakingAttemptResult {
  scenarioId: string;
  turnIndex: number;
  userInput: string;
  recognizedSpeech?: string;
  isPassed: boolean;
  usedHints: boolean;
  confidenceScore: number;
  feedbackVi: string;
}

// ---------------- STUDENT CONFIDENCE SELF-ASSESSMENT ----------------
export type ConfidenceScale = 1 | 2 | 3 | 4;

export interface ConfidenceRecord {
  id: string;
  activityId: string;
  activityTitle: string;
  activityType: 'speaking' | 'practice' | 'learn' | 'review';
  beforeRating: ConfidenceScale; // 1: Chưa tự tin, 2: Cần nhiều gợi ý, 3: Ít gợi ý, 4: Rất tự tin
  afterRating: ConfidenceScale;
  timestamp: number;
  studentCode: string; // e.g. "HS-5A4-01" or "Ẩn danh"
}

// ---------------- TEACHER AI ACTIVITY DESIGNER TYPES ----------------
export interface TeacherActivityPlan {
  id: string;
  topic: string;
  topicVi: string;
  grade: GradeLevel;
  className: string; // Default: "5A4 - Trường TH Hữu Nghị"
  learningObjective: string;
  targetLanguage: string;
  duration: string; // e.g. "15 phút", "1 tiết học (35 phút)"
  groupFormat: 'Cá nhân' | 'Cặp đôi' | 'Nhóm 4' | 'Cả lớp';
  level: LearningLevel;
  supportNeeds: string;
  activityTitle: string;
  activityObjectives: string[];
  materials: string[];
  stepByStep: Array<{
    step: number;
    title: string;
    instructions: string;
    durationMinutes: number;
  }>;
  studentTasks: string[];
  keyVocabulary: Array<{ word: string; meaningVi: string; example: string }>;
  scaffoldingLevels: {
    basic: string;
    practice: string;
    challenge: string;
  };
  positiveErrorHandling: string;
  successCriteria: string[];
  differentiationSupport: string;
  isApproved: boolean;
  createdAt: number;
}
