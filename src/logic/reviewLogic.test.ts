import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWordStatus,
  recordWordAttempt,
  computeReviewPriority,
  getAdaptiveReviewList
} from './reviewLogic.ts';
import { VocabularyWord, WordProgress } from '../types/index.ts';

test('calculateWordStatus: returns new for 0 attempts without flag', () => {
  const status = calculateWordStatus({ attempts: 0, correctCount: 0, wrongCount: 0 });
  assert.equal(status, 'new');
});

test('calculateWordStatus: returns needs_review when manualFlagged is true', () => {
  const status = calculateWordStatus({
    attempts: 2,
    correctCount: 2,
    wrongCount: 0,
    manualFlagged: true
  });
  assert.equal(status, 'needs_review');
});

test('calculateWordStatus: returns needs_review when wrong answers dominate', () => {
  const status = calculateWordStatus({ attempts: 4, correctCount: 1, wrongCount: 3 });
  assert.equal(status, 'needs_review');
});

test('calculateWordStatus: returns practised_successfully on 3 correct with 0 wrong', () => {
  const status = calculateWordStatus({ attempts: 3, correctCount: 3, wrongCount: 0 });
  assert.equal(status, 'practised_successfully');
});

test('calculateWordStatus: returns practising on mixed moderate progress', () => {
  const status = calculateWordStatus({ attempts: 3, correctCount: 2, wrongCount: 1 });
  assert.equal(status, 'practising');
});

test('recordWordAttempt: correctly increments correct counts and updates status', () => {
  const meta = { id: 'w1', word: 'Elephant', topic: 'animals', grade: 5 as const };
  const step1 = recordWordAttempt(undefined, meta, true, 1000);
  assert.equal(step1.attempts, 1);
  assert.equal(step1.correctCount, 1);
  assert.equal(step1.wrongCount, 0);
  assert.equal(step1.status, 'practising');

  // Next attempt is wrong
  const step2 = recordWordAttempt(step1, meta, false, 2000);
  assert.equal(step2.attempts, 2);
  assert.equal(step2.correctCount, 1);
  assert.equal(step2.wrongCount, 1);
  assert.equal(step2.status, 'needs_review');
});

test('computeReviewPriority: assigns highest priority to flagged and error-prone words', () => {
  const dummyWord: VocabularyWord = {
    id: 'w1',
    word: 'Cat',
    vietnamese: 'Con mèo',
    phonetic: '/kæt/',
    topic: 'animals',
    grade: 5,
    exampleEn: 'The cat sleeps.',
    exampleVi: 'Con mèo đang ngủ.',
    hint: 'A cute pet that meows.',
    categoryNameVi: 'Động vật',
    emoji: '🐱',
    colorScheme: { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-800' }
  };

  const weakProgress: WordProgress = {
    wordId: 'w1',
    word: 'Cat',
    topic: 'animals',
    grade: 5,
    attempts: 4,
    correctCount: 1,
    wrongCount: 3,
    lastPracticed: 1000,
    manualFlagged: true,
    status: 'needs_review'
  };

  const strongProgress: WordProgress = {
    wordId: 'w1',
    word: 'Cat',
    topic: 'animals',
    grade: 5,
    attempts: 5,
    correctCount: 5,
    wrongCount: 0,
    lastPracticed: Date.now(), // practiced right now
    manualFlagged: false,
    status: 'practised_successfully'
  };

  const weakScore = computeReviewPriority(dummyWord, weakProgress, Date.now());
  const strongScore = computeReviewPriority(dummyWord, strongProgress, Date.now());

  assert.ok(weakScore > strongScore, 'Weak word must have significantly higher review priority');
  assert.ok(weakScore >= 160, 'Flagged + needs_review word has high score');
});

test('getAdaptiveReviewList: correctly places weak words at the top of practice queue', () => {
  const words: VocabularyWord[] = [
    {
      id: 'w1',
      word: 'Dog',
      vietnamese: 'Con chó',
      phonetic: '/dɒɡ/',
      topic: 'animals',
      grade: 5,
      exampleEn: 'The dog barks.',
      exampleVi: 'Con chó sủa.',
      hint: 'Man best friend.',
      categoryNameVi: 'Động vật',
      emoji: '🐶',
      colorScheme: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' }
    },
    {
      id: 'w2',
      word: 'Elephant',
      vietnamese: 'Con voi',
      phonetic: '/ˈelɪfənt/',
      topic: 'animals',
      grade: 5,
      exampleEn: 'The elephant is big.',
      exampleVi: 'Con voi rất to.',
      hint: 'Huge animal with a trunk.',
      categoryNameVi: 'Động vật',
      emoji: '🐘',
      colorScheme: { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-800' }
    }
  ];

  const progressMap: Record<string, WordProgress> = {
    w1: {
      wordId: 'w1',
      word: 'Dog',
      topic: 'animals',
      grade: 5,
      attempts: 4,
      correctCount: 4,
      wrongCount: 0,
      lastPracticed: Date.now(),
      manualFlagged: false,
      status: 'practised_successfully'
    },
    w2: {
      wordId: 'w2',
      word: 'Elephant',
      topic: 'animals',
      grade: 5,
      attempts: 3,
      correctCount: 1,
      wrongCount: 2,
      lastPracticed: Date.now() - 100000,
      manualFlagged: true,
      status: 'needs_review'
    }
  };

  const prioritized = getAdaptiveReviewList(words, progressMap, 2);
  assert.equal(prioritized[0].id, 'w2', 'Elephant (weak word) must be ranked first');
});
