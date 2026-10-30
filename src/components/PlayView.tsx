import React, { useState } from 'react';
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

  // Vocabulary Map lookup
  const vocabularyMap = React.useMemo(() => {
    const map: Record<string, VocabularyWord> = {};
    INITIAL_VOCABULARY.forEach((w) => {
      map[w.id] = w;
    });
    return map;
  }, []);

  // Filter pool for current grade and topic
  const eligibleWords = INITIAL_VOCABULARY.filter((w) => {
    const matchGrade = w.grade === currentGrade;
    const matchTopic = selectedTopic === 'all' || w.topic === selectedTopic;
    return matchGrade && matchTopic;
  });

  // Prepare questions for multiple choice or sentence completion
  const gameQuestions: GameQuestion[] = React.useMemo(() => {
    if (!activeGameType || activeGameType === 'match') return [];

    // Prioritize weak words first
    const pool = eligibleWords.length > 0 ? eligibleWords : INITIAL_VOCABULARY;
    const sortedWords = [...pool].sort((a, b) => {
      const aWeak = progressMap[a.id]?.status === 'needs_review' || progressMap[a.id]?.manualFlagged ? 1 : 0;
      const bWeak = progressMap[b.id]?.status === 'needs_review' || progressMap[b.id]?.manualFlagged ? 1 : 0;
      return bWeak - aWeak;
    });

    const targetSubset = sortedWords.slice(0, 8);

    // Merge with any approved teacher questions for this grade/topic
    const approved = loadApprovedQuestions().filter((q) => {
      const matchG = q.grade === currentGrade;
      const matchT = selectedTopic === 'all' || q.topic === selectedTopic;
      const matchType = q.questionType === activeGameType;
      return matchG && matchT && matchType;
    });

    let generated: GameQuestion[] = [];
    if (activeGameType === 'multiple_choice') {
      generated = buildMultipleChoiceQuestions(targetSubset, INITIAL_VOCABULARY);
    } else if (activeGameType === 'sentence_completion') {
      generated = buildSentenceCompletionQuestions(targetSubset, INITIAL_VOCABULARY);
    }

    // Combine and shuffle
    const combined = [...approved, ...generated].sort(() => 0.5 - Math.random());
    return combined.slice(0, 8);
  }, [activeGameType, currentGrade, selectedTopic, eligibleWords]);

  const handleStartGame = (gameType: 'match' | 'multiple_choice' | 'sentence_completion') => {
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
    setActiveSessionResult(null);
  };

  const handleExitGame = () => {
    setActiveGameType(null);
    setActiveSessionResult(null);
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
          words={eligibleWords.length >= 4 ? eligibleWords : INITIAL_VOCABULARY}
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
          questions={gameQuestions}
          vocabularyMap={vocabularyMap}
          currentGrade={currentGrade}
          topic={selectedTopic}
          onFinishGame={handleFinishGame}
          onExit={handleExitGame}
          onRecordAnswer={onRecordAnswer}
        />
      ) : (
        <SentenceGame
          questions={gameQuestions}
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
