import React, { useMemo, useState } from 'react';
import { GradeLevel, TopicId, VocabularyWord, SessionResult, GameQuestion, WordProgress } from '../types/index.ts';
import { INITIAL_VOCABULARY } from '../data/vocabulary.ts';
import { buildMultipleChoiceQuestions, buildSentenceCompletionQuestions } from '../logic/reviewLogic.ts';
import { loadApprovedQuestions, saveSessionHistory } from '../services/storage.ts';
import { GameSelector } from './play/GameSelector.tsx';
import { MatchGame } from './play/MatchGame.tsx';
import { MultipleChoiceGame } from './play/MultipleChoiceGame.tsx';
import { SentenceGame } from './play/SentenceGame.tsx';
import { GameResultsModal } from './play/GameResultsModal.tsx';

interface PlayViewProps {
  currentGrade: GradeLevel;
  selectedTopic: TopicId;
  onSelectTopic: (topicId: TopicId) => void;
  progressMap: Record<string, WordProgress>;
  onRecordAnswer: (wordMeta: { id: string; word: string; topic: string; grade: GradeLevel }, isCorrect: boolean) => void;
  onNavigateToReview: () => void;
  onAddSessionStars: (stars: number) => void;
}

export const PlayView: React.FC<PlayViewProps> = ({
  currentGrade,
  selectedTopic,
  onSelectTopic,
  progressMap,
  onRecordAnswer,
  onNavigateToReview,
  onAddSessionStars
}) => {
  const [activeGameType, setActiveGameType] = useState<'match' | 'multiple_choice' | 'sentence_completion' | null>(null);
  const [activeSessionResult, setActiveSessionResult] = useState<SessionResult | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<GameQuestion[]>([]);
  const [sessionKey, setSessionKey] = useState(0);

  // Vocabulary Map lookup
  const vocabularyMap = React.useMemo(() => {
    const map: Record<string, VocabularyWord> = {};
    INITIAL_VOCABULARY.forEach((w) => {
      map[w.id] = w;
    });
    return map;
  }, []);

  // Filter pool for current grade and topic
  const eligibleWords = useMemo(() => INITIAL_VOCABULARY.filter((w) => {
    const matchGrade = w.grade === currentGrade;
    const matchTopic = selectedTopic === 'all' || w.topic === selectedTopic;
    return matchGrade && matchTopic;
  }), [currentGrade, selectedTopic]);

  const prepareQuestions = (gameType: 'multiple_choice' | 'sentence_completion'): GameQuestion[] => {
    const pool = eligibleWords.length > 0 ? eligibleWords : INITIAL_VOCABULARY.filter((word) => word.grade === currentGrade);
    const sortedWords = [...pool].sort((a, b) => {
      const aWeak = progressMap[a.id]?.status === 'needs_review' || progressMap[a.id]?.manualFlagged ? 1 : 0;
      const bWeak = progressMap[b.id]?.status === 'needs_review' || progressMap[b.id]?.manualFlagged ? 1 : 0;
      return bWeak - aWeak;
    });

    const questionWords = gameType === 'sentence_completion'
      ? sortedWords.filter((word) => word.exampleEn.trim() && word.exampleEn.toLocaleLowerCase().includes(word.word.toLocaleLowerCase()))
      : sortedWords;
    const targetSubset = questionWords.slice(0, 8);

    // Merge with any approved teacher questions for this grade/topic
    const approved = loadApprovedQuestions().filter((q) => {
      const matchG = q.grade === currentGrade;
      const matchT = selectedTopic === 'all' || q.topic === selectedTopic;
      const matchType = q.questionType === gameType;
      return matchG && matchT && matchType;
    }).flatMap((question) => {
      const answer = question.correctAnswer?.trim();
      if (!answer) return [];

      const optionMap = new Map<string, string>();
      for (const option of question.options ?? []) {
        const trimmed = option.trim();
        const key = trimmed.normalize('NFKC').toLocaleLowerCase();
        if (trimmed && key !== answer.normalize('NFKC').toLocaleLowerCase() && !optionMap.has(key)) {
          optionMap.set(key, trimmed);
        }
      }
      const answerKey = answer.normalize('NFKC').toLocaleLowerCase();

      const poolOptions = pool.map((word) => gameType === 'multiple_choice' ? word.vietnamese : word.word);
      for (const candidate of poolOptions) {
        if (optionMap.size >= 3) break;
        const trimmed = candidate.trim();
        const key = trimmed.normalize('NFKC').toLocaleLowerCase();
        if (trimmed && key !== answerKey && !optionMap.has(key)) optionMap.set(key, trimmed);
      }

      if (optionMap.size < 1) return [];
      const options = [...Array.from(optionMap.values()).slice(0, 3), answer];
      for (let index = options.length - 1; index > 0; index -= 1) {
        const target = Math.floor(Math.random() * (index + 1));
        [options[index], options[target]] = [options[target], options[index]];
      }
      return [{ ...question, correctAnswer: answer, options }];
    });

    const generated = gameType === 'multiple_choice'
      ? buildMultipleChoiceQuestions(targetSubset, pool)
      : buildSentenceCompletionQuestions(targetSubset, pool);

    // Combine and shuffle
    const combined = [...approved, ...generated];
    for (let index = combined.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [combined[index], combined[target]] = [combined[target], combined[index]];
    }
    return combined.slice(0, 8);
  };

  const handleStartGame = (gameType: 'match' | 'multiple_choice' | 'sentence_completion') => {
    setSessionQuestions(gameType === 'match' ? [] : prepareQuestions(gameType));
    setSessionKey((key) => key + 1);
    setActiveGameType(gameType);
    setActiveSessionResult(null);
  };

  const handleFinishGame = (result: SessionResult) => {
    setActiveSessionResult(result);
    saveSessionHistory(result);
    const accuracy = Math.round((result.correctAnswers / result.totalQuestions) * 100);
    const stars = Math.max(1, Math.round((accuracy / 100) * 3));
    onAddSessionStars(stars);
  };

  const handlePlayAgain = () => {
    if (activeGameType) handleStartGame(activeGameType);
  };

  const handleExitGame = () => {
    setActiveGameType(null);
    setActiveSessionResult(null);
    setSessionQuestions([]);
  };

  return (
    <div className="pb-12">
      {!activeGameType ? (
        <GameSelector
          currentGrade={currentGrade}
          selectedTopic={selectedTopic}
          onSelectTopic={onSelectTopic}
          onStartGame={handleStartGame}
        />
      ) : activeGameType === 'match' ? (
        <MatchGame
          key={sessionKey}
          words={eligibleWords}
          currentGrade={currentGrade}
          topic={selectedTopic}
          onFinishGame={handleFinishGame}
          onExit={handleExitGame}
          onRecordAnswer={(word, isCorrect) => {
            onRecordAnswer(
              { id: word.id, word: word.word, topic: word.topic, grade: word.grade },
              isCorrect
            );
          }}
        />
      ) : activeGameType === 'multiple_choice' ? (
        <MultipleChoiceGame
          key={sessionKey}
          questions={sessionQuestions}
          vocabularyMap={vocabularyMap}
          currentGrade={currentGrade}
          topic={selectedTopic}
          onFinishGame={handleFinishGame}
          onExit={handleExitGame}
          onRecordAnswer={onRecordAnswer}
        />
      ) : (
        <SentenceGame
          key={sessionKey}
          questions={sessionQuestions}
          vocabularyMap={vocabularyMap}
          currentGrade={currentGrade}
          topic={selectedTopic}
          onFinishGame={handleFinishGame}
          onExit={handleExitGame}
          onRecordAnswer={onRecordAnswer}
        />
      )}

      {/* Results celebration modal */}
      {activeSessionResult && (
        <GameResultsModal
          result={activeSessionResult}
          vocabularyMap={vocabularyMap}
          onPlayAgain={handlePlayAgain}
          onGoToReview={() => {
            setActiveSessionResult(null);
            setActiveGameType(null);
            onNavigateToReview();
          }}
          onBackToMenu={handleExitGame}
        />
      )}
    </div>
  );
};
