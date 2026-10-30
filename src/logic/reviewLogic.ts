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
    const answerKey = normalizeGameAnswer(word.vietnamese);
    const distractors: string[] = [];
    const seen = new Set([answerKey]);
    const candidates = shuffleGameItems(allWordsPool.filter((item) => item.id !== word.id));

    for (const candidate of candidates) {
      const option = candidate.vietnamese.trim();
      const key = normalizeGameAnswer(option);
      if (!option || seen.has(key)) continue;
      seen.add(key);
      distractors.push(option);
      if (distractors.length === 3) break;
    }

    // Use classroom-friendly fallback answers only when the selected Unit has too few meanings.
    const fallbackDistractors = ['Quả táo', 'Bút chì', 'Con mèo', 'Quyển vở'];
    for (const fallback of fallbackDistractors) {
      const key = normalizeGameAnswer(fallback);
      if (distractors.length === 3) break;
      if (seen.has(key)) continue;
      seen.add(key);
      distractors.push(fallback);
    }

    const options = shuffleGameItems([word.vietnamese, ...distractors]);

    return {
      id: `mc_${word.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      wordId: word.id,
      word: word.word,
      question: `Từ "${word.word}" có nghĩa là gì trong tiếng Việt?`,
      questionType: 'multiple_choice',
      options,
      correctAnswer: word.vietnamese,
      vietnameseMeaning: word.vietnamese,
      explanationVi: word.exampleEn
        ? `"${word.word}" có nghĩa là "${word.vietnamese}". Ví dụ: ${word.exampleEn}`
        : `"${word.word}" có nghĩa là "${word.vietnamese}".`,
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
  return targetWords.flatMap((word) => {
    const sentenceWithBlank = blankVocabularyTerm(word.exampleEn, word.word);
    if (!sentenceWithBlank) return [];

    const answerKey = normalizeGameAnswer(word.word);
    const distractors: string[] = [];
    const seen = new Set([answerKey]);
    const candidates = shuffleGameItems(allWordsPool.filter((item) => item.id !== word.id));

    for (const candidate of candidates) {
      const option = candidate.word.trim();
      const key = normalizeGameAnswer(option);
      if (!option || seen.has(key)) continue;
      seen.add(key);
      distractors.push(option);
      if (distractors.length === 3) break;
    }

    const options = shuffleGameItems([word.word, ...distractors]);

    return {
      id: `sc_${word.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      wordId: word.id,
      word: word.word,
      question: sentenceWithBlank,
      questionType: 'sentence_completion',
      options,
      correctAnswer: word.word,
      vietnameseMeaning: word.vietnamese,
      explanationVi: word.exampleVi
        ? `Câu hoàn chỉnh: "${word.exampleEn}" (Nghĩa: ${word.exampleVi}).`
        : `Câu hoàn chỉnh: "${word.exampleEn}".`,
      grade: word.grade,
      topic: word.topic,
      hint: `Gợi ý: ${word.vietnamese}`
    };
  });
}

function normalizeGameAnswer(value: string): string {
  return value.trim().normalize('NFKC').toLocaleLowerCase();
}

function shuffleGameItems<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

function blankVocabularyTerm(sentence: string, term: string): string | null {
  if (!sentence.trim() || !term.trim()) return null;

  const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedTerm = escapeRegExp(term.trim());
  const startsWithWordCharacter = /^[\p{L}\p{N}]/u.test(term.trim());
  const endsWithWordCharacter = /[\p{L}\p{N}]$/u.test(term.trim());
  const pattern = `${startsWithWordCharacter ? '\\b' : ''}${escapedTerm}${endsWithWordCharacter ? '\\b' : ''}`;

  try {
    const blanked = sentence.replace(new RegExp(pattern, 'giu'), '______');
    return blanked === sentence ? null : blanked;
  } catch {
    return null;
  }
}
