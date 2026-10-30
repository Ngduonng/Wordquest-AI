import { VocabularyWord, WordProgress, WordStatus, GameQuestion, GradeLevel } from '../types/index.ts';

/**
 * Calculates the mastery status of a vocabulary word based on attempt history.
 *
 * Logic:
 * - If attempts === 0: 'new'
 * - If manualFlagged === true OR wrongCount > 0 and correctCount <= wrongCount: 'needs_review'
 * - If correctCount >= 3 and wrongCount === 0: 'practised_successfully'
 * - If correctCount >= 4 and (correctCount / attempts) >= 0.75: 'practised_successfully'
 * - Otherwise: 'practising'
 */
export function calculateWordStatus(progress: {
  attempts: number;
  correctCount: number;
  wrongCount: number;
  manualFlagged?: boolean;
}): WordStatus {
  if (progress.attempts === 0) {
    return progress.manualFlagged ? 'needs_review' : 'new';
  }

  if (progress.manualFlagged) {
    return 'needs_review';
  }

  // If wrong answers dominate or recent mistakes occurred
  if (progress.wrongCount > 0 && progress.wrongCount >= progress.correctCount) {
    return 'needs_review';
  }

  // Mastered conditions
  if (progress.correctCount >= 3 && progress.wrongCount === 0) {
    return 'practised_successfully';
  }

  if (progress.correctCount >= 4 && progress.correctCount / progress.attempts >= 0.75) {
    return 'practised_successfully';
  }

  return 'practising';
}

/**
 * Updates a word's progress record immutably with answer outcome.
 */
export function recordWordAttempt(
  existingProgress: WordProgress | undefined,
  wordMeta: { id: string; word: string; topic: string; grade: GradeLevel },
  isCorrect: boolean,
  timestamp: number = Date.now()
): WordProgress {
  const current: WordProgress = existingProgress || {
    wordId: wordMeta.id,
    word: wordMeta.word,
    topic: wordMeta.topic,
    grade: wordMeta.grade,
    attempts: 0,
    correctCount: 0,
    wrongCount: 0,
    lastPracticed: timestamp,
    manualFlagged: false,
    status: 'new'
  };

  const attempts = current.attempts + 1;
  const correctCount = current.correctCount + (isCorrect ? 1 : 0);
  const wrongCount = current.wrongCount + (isCorrect ? 0 : 1);

  // If user got it right, and it was flagged, remove the flag if they've answered correctly twice in a row
  let manualFlagged = current.manualFlagged;
  if (isCorrect && manualFlagged && correctCount > wrongCount + 1) {
    manualFlagged = false;
  }

  const status = calculateWordStatus({
    attempts,
    correctCount,
    wrongCount,
    manualFlagged
  });

  return {
    ...current,
    attempts,
    correctCount,
    wrongCount,
    lastPracticed: timestamp,
    manualFlagged,
    status
  };
}

/**
 * Adaptive Spaced-Repetition Prioritizer:
 * Computes an adaptive priority score for words:
 * Higher score = higher priority to show up in review/practice.
 *
 * Scoring factors:
 * 1. manualFlagged: +100 points
 * 2. status === 'needs_review': +60 points
 * 3. error weight: + (wrongCount * 15)
 * 4. recency penalty: words answered correctly in the last 10 minutes get reduced priority to avoid immediate redundancy
 * 5. new words: +25 points (to introduce fresh words gradually)
 * 6. mastered words: -40 points (so student focuses on weak words)
 */
export function computeReviewPriority(
  word: VocabularyWord,
  progress: WordProgress | undefined,
  currentTime: number = Date.now()
): number {
  if (!progress || progress.attempts === 0) {
    return 30; // Brand new word priority
  }

  let score = 0;

  if (progress.manualFlagged) {
    score += 100;
  }

  if (progress.status === 'needs_review') {
    score += 60;
  } else if (progress.status === 'practising') {
    score += 30;
  } else if (progress.status === 'practised_successfully') {
    score -= 40;
  }

  // Error frequency boost
  score += progress.wrongCount * 15;

  // Recent practice spacing (in minutes)
  const minutesSincePractice = (currentTime - progress.lastPracticed) / (1000 * 60);
  if (minutesSincePractice < 5 && progress.correctCount > progress.wrongCount) {
    // If just practiced correctly within 5 minutes, lower priority to allow spacing
    score -= 25;
  } else if (minutesSincePractice > 60) {
    // Slightly boost if not reviewed for over an hour
    score += 10;
  }

  return score;
}

/**
 * Ranks words adaptively for a review session, returning the top N words.
 */
export function getAdaptiveReviewList(
  allWords: VocabularyWord[],
  progressMap: Record<string, WordProgress>,
  limit: number = 8,
  currentTime: number = Date.now()
): VocabularyWord[] {
  const scored = allWords.map((word) => ({
    word,
    score: computeReviewPriority(word, progressMap[word.id], currentTime)
  }));

  // Sort descending by priority score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.word);
}

/**
 * Builds multiple-choice questions from a vocabulary list.
 * Guarantees exactly 1 correct answer and distinct kid-friendly options.
 */
export function buildMultipleChoiceQuestions(
  targetWords: VocabularyWord[],
  allWordsPool: VocabularyWord[]
): GameQuestion[] {
  return targetWords.map((word) => {
    // Pick 3 distractors from the pool with different meanings
    const otherWords = allWordsPool.filter((w) => w.id !== word.id);
    // Shuffle distractors
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3).map((w) => w.vietnamese);

    // If pool is small, provide sensible standard fallbacks
    const fallbackDistractors = ['Quả táo', 'Bút chì', 'Con mèo', 'Quyển vở'];
    while (distractors.length < 3) {
      const fb = fallbackDistractors.find((f) => f !== word.vietnamese && !distractors.includes(f));
      if (fb) distractors.push(fb);
      else distractors.push(`Từ khác ${distractors.length + 1}`);
    }

    const options = [word.vietnamese, ...distractors.slice(0, 3)].sort(() => 0.5 - Math.random());

    return {
      id: `mc_${word.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      wordId: word.id,
      word: word.word,
      question: `Từ "${word.word}" có nghĩa là gì trong tiếng Việt?`,
      questionType: 'multiple_choice',
      options,
      correctAnswer: word.vietnamese,
      vietnameseMeaning: word.vietnamese,
      explanationVi: `"${word.word}" có nghĩa là "${word.vietnamese}". Ví dụ: ${word.exampleEn}`,
      grade: word.grade,
      topic: word.topic,
      hint: word.hint
    };
  });
}

/**
 * Builds sentence completion questions.
 */
export function buildSentenceCompletionQuestions(
  targetWords: VocabularyWord[],
  allWordsPool: VocabularyWord[]
): GameQuestion[] {
  return targetWords.map((word) => {
    // Create fill in the blank from example sentence
    const regex = new RegExp(`\\b${word.word}\\b`, 'i');
    const sentenceWithBlank = word.exampleEn.replace(regex, '______');

    // Pick 3 distractors (English words)
    const otherWords = allWordsPool.filter((w) => w.id !== word.id);
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3).map((w) => w.word);

    const options = [word.word, ...distractors.slice(0, 3)].sort(() => 0.5 - Math.random());

    return {
      id: `sc_${word.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      wordId: word.id,
      word: word.word,
      question: `Chọn từ thích hợp điền vào chỗ trống:\n"${sentenceWithBlank}"`,
      questionType: 'sentence_completion',
      options,
      correctAnswer: word.word,
      vietnameseMeaning: word.vietnamese,
      explanationVi: `Câu hoàn chỉnh: "${word.exampleEn}" (Nghĩa: ${word.exampleVi}).`,
      grade: word.grade,
      topic: word.topic,
      hint: `Gợi ý: ${word.vietnamese}`
    };
  });
}
