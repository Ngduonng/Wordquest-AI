import {
  WordProgress,
  GameQuestion,
  SessionResult,
  GradeLevel,
  ConfidenceRecord,
  TeacherActivityPlan
} from '../types/index.ts';
import { recordWordAttempt, calculateWordStatus } from '../logic/reviewLogic.ts';

const PROGRESS_KEY = 'wordquest_progress_v1';
const APPROVED_QUESTIONS_KEY = 'wordquest_approved_questions_v1';
const SESSION_HISTORY_KEY = 'wordquest_session_history_v1';
const CONFIDENCE_RECORDS_KEY = 'wordquest_confidence_records_v1';
const TEACHER_PLANS_KEY = 'wordquest_teacher_activity_plans_v1';

export function loadAllWordProgress(): Record<string, WordProgress> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load progress from localStorage:', err);
    return {};
  }
}

export function saveAllWordProgress(progressMap: Record<string, WordProgress>): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressMap));
  } catch (err) {
    console.error('Failed to save progress to localStorage:', err);
  }
}

export function recordQuestionAnswer(
  wordMeta: { id: string; word: string; topic: string; grade: GradeLevel },
  isCorrect: boolean
): WordProgress {
  const all = loadAllWordProgress();
  const updated = recordWordAttempt(all[wordMeta.id], wordMeta, isCorrect);
  all[wordMeta.id] = updated;
  saveAllWordProgress(all);
  return updated;
}

export function toggleWordFlag(
  wordMeta: { id: string; word: string; topic: string; grade: GradeLevel },
  explicitFlag?: boolean
): WordProgress {
  const all = loadAllWordProgress();
  const current = all[wordMeta.id] || {
    wordId: wordMeta.id,
    word: wordMeta.word,
    topic: wordMeta.topic,
    grade: wordMeta.grade,
    attempts: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: Date.now(),
    manualFlagged: false,
    status: 'new'
  };

  const newFlag = explicitFlag !== undefined ? explicitFlag : !current.manualFlagged;
  const status = calculateWordStatus({
    attempts: current.attempts,
    correctCount: current.correctCount,
    wrongCount: current.wrongCount,
    manualFlagged: newFlag
  });

  const updated: WordProgress = {
    ...current,
    manualFlagged: newFlag,
    status
  };

  all[wordMeta.id] = updated;
  saveAllWordProgress(all);
  return updated;
}

export function saveSessionHistory(result: SessionResult): void {
  try {
    const raw = localStorage.getItem(SESSION_HISTORY_KEY);
    const history: SessionResult[] = raw ? JSON.parse(raw) : [];
    history.unshift(result);
    // Keep last 30 sessions
    localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
  } catch (err) {
    console.error('Failed to save session history:', err);
  }
}

export function loadSessionHistory(): SessionResult[] {
  try {
    const raw = localStorage.getItem(SESSION_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function loadApprovedQuestions(): GameQuestion[] {
  try {
    const raw = localStorage.getItem(APPROVED_QUESTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function saveApprovedQuestions(questions: GameQuestion[]): void {
  try {
    const existing = loadApprovedQuestions();
    // Merge by id
    const map = new Map<string, GameQuestion>();
    existing.forEach((q) => map.set(q.id, q));
    questions.forEach((q) => map.set(q.id, { ...q, isApproved: true }));
    localStorage.setItem(APPROVED_QUESTIONS_KEY, JSON.stringify(Array.from(map.values())));
  } catch (err) {
    console.error('Failed to save approved questions:', err);
  }
}

// ---------------- CONFIDENCE ASSESSMENTS ----------------
export function loadConfidenceRecords(): ConfidenceRecord[] {
  try {
    const raw = localStorage.getItem(CONFIDENCE_RECORDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function saveConfidenceRecord(record: ConfidenceRecord): void {
  try {
    const records = loadConfidenceRecords();
    records.unshift(record);
    localStorage.setItem(CONFIDENCE_RECORDS_KEY, JSON.stringify(records.slice(0, 50)));
  } catch (err) {
    console.error('Failed to save confidence record:', err);
  }
}

// ---------------- TEACHER ACTIVITY PLANS ----------------
export function loadTeacherActivityPlans(): TeacherActivityPlan[] {
  try {
    const raw = localStorage.getItem(TEACHER_PLANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function saveTeacherActivityPlan(plan: TeacherActivityPlan): void {
  try {
    const plans = loadTeacherActivityPlans();
    const existingIndex = plans.findIndex((p) => p.id === plan.id);
    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.unshift(plan);
    }
    localStorage.setItem(TEACHER_PLANS_KEY, JSON.stringify(plans));
  } catch (err) {
    console.error('Failed to save teacher plan:', err);
  }
}

export function deleteTeacherActivityPlan(planId: string): void {
  try {
    const plans = loadTeacherActivityPlans().filter((p) => p.id !== planId);
    localStorage.setItem(TEACHER_PLANS_KEY, JSON.stringify(plans));
  } catch (err) {
    console.error('Failed to delete teacher plan:', err);
  }
}

export function clearAllLocalProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(SESSION_HISTORY_KEY);
    localStorage.removeItem(CONFIDENCE_RECORDS_KEY);
  } catch (err) {
    console.error('Failed to clear progress:', err);
  }
}

export function generateSampleDemoProgress(): Record<string, WordProgress> {
  const sample: Record<string, WordProgress> = {
    u1_dolphin: {
      wordId: 'u1_dolphin',
      word: 'dolphin',
      topic: 'unit1_all_about_me',
      grade: 5,
      attempts: 4,
      correctCount: 4,
      wrongCount: 0,
      lastPracticed: Date.now() - 15 * 60 * 1000,
      manualFlagged: false,
      status: 'practised_successfully'
    },
    u2_flat: {
      wordId: 'u2_flat',
      word: 'flat',
      topic: 'unit2_our_homes',
      grade: 5,
      attempts: 3,
      correctCount: 1,
      wrongCount: 2,
      lastPracticed: Date.now() - 30 * 60 * 1000,
      manualFlagged: false,
      status: 'needs_review'
    },
    u5_firefighter: {
      wordId: 'u5_firefighter',
      word: 'firefighter',
      topic: 'unit5_future_jobs',
      grade: 5,
      attempts: 5,
      correctCount: 4,
      wrongCount: 1,
      lastPracticed: Date.now() - 40 * 60 * 1000,
      manualFlagged: false,
      status: 'practising'
    },
    u8_set_square: {
      wordId: 'u8_set_square',
      word: 'set square',
      topic: 'unit8_in_classroom',
      grade: 5,
      attempts: 4,
      correctCount: 1,
      wrongCount: 3,
      lastPracticed: Date.now() - 20 * 60 * 1000,
      manualFlagged: true,
      status: 'needs_review'
    },
    u12_banh_chung: {
      wordId: 'u12_banh_chung',
      word: 'make banh chung',
      topic: 'unit12_tet_holiday',
      grade: 5,
      attempts: 5,
      correctCount: 5,
      wrongCount: 0,
      lastPracticed: Date.now() - 60 * 60 * 1000,
      manualFlagged: false,
      status: 'practised_successfully'
    },
    u15_toothache: {
      wordId: 'u15_toothache',
      word: 'toothache',
      topic: 'unit15_our_health',
      grade: 5,
      attempts: 4,
      correctCount: 2,
      wrongCount: 2,
      lastPracticed: Date.now() - 50 * 60 * 1000,
      manualFlagged: true,
      status: 'needs_review'
    },
    u18_dragon_bridge: {
      wordId: 'u18_dragon_bridge',
      word: 'Dragon Bridge',
      topic: 'unit18_transport',
      grade: 5,
      attempts: 4,
      correctCount: 4,
      wrongCount: 0,
      lastPracticed: Date.now() - 90 * 60 * 1000,
      manualFlagged: false,
      status: 'practised_successfully'
    },
    u20_phu_quoc: {
      wordId: 'u20_phu_quoc',
      word: 'Phu Quoc Island',
      topic: 'unit20_summer_holidays',
      grade: 5,
      attempts: 3,
      correctCount: 3,
      wrongCount: 0,
      lastPracticed: Date.now() - 110 * 60 * 1000,
      manualFlagged: false,
      status: 'practised_successfully'
    }
  };

  saveAllWordProgress(sample);

  // Also seed sample confidence records
  const sampleConfidence: ConfidenceRecord[] = [
    {
      id: 'conf_1',
      activityId: 'spk_intro_5b4',
      activityTitle: 'Giới thiệu bản thân tại lớp 5B4',
      activityType: 'speaking',
      beforeRating: 2, // Em cần nhiều gợi ý
      afterRating: 4, // Em tự tin trả lời
      timestamp: Date.now() - 45 * 60 * 1000,
      studentCode: 'HS-5B4-01'
    },
    {
      id: 'conf_2',
      activityId: 'spk_family_5b4',
      activityTitle: 'Kể về gia đình thân yêu',
      activityType: 'speaking',
      beforeRating: 1, // Chưa tự tin
      afterRating: 3, // Ít gợi ý
      timestamp: Date.now() - 90 * 60 * 1000,
      studentCode: 'HS-5B4-01'
    },
    {
      id: 'conf_3',
      activityId: 'game_animals_g5',
      activityTitle: 'Trắc nghiệm thế giới động vật Lớp 5',
      activityType: 'practice',
      beforeRating: 2,
      afterRating: 3,
      timestamp: Date.now() - 120 * 60 * 1000,
      studentCode: 'HS-5B4-01'
    }
  ];

  try {
    localStorage.setItem(CONFIDENCE_RECORDS_KEY, JSON.stringify(sampleConfidence));
  } catch (e) {}

  return sample;
}
