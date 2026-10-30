import React, { useState, useEffect, useMemo } from 'react';
import { VocabularyWord, SessionResult, GradeLevel } from '../../types/index.ts';
import { playSuccessChime, playGentleTryAgainSound, speakEnglish } from '../../services/audio.ts';
import { Volume2, ArrowLeft, RefreshCw, CheckCircle2, Star } from 'lucide-react';

interface MatchGameProps {
  words: VocabularyWord[];
  currentGrade: GradeLevel;
  topic: string;
  onFinishGame: (result: SessionResult) => void;
  onExit: () => void;
  onRecordAnswer: (word: VocabularyWord, isCorrect: boolean) => void;
}

interface MatchItem {
  id: string;
  wordId: string;
  text: string;
  emoji?: string;
  type: 'en' | 'vi';
}

export const MatchGame: React.FC<MatchGameProps> = ({
  words,
  currentGrade,
  topic,
  onFinishGame,
  onExit,
  onRecordAnswer
}) => {
  // Avoid duplicate meanings so every visible pair has one unambiguous match.
  const targetWords = useMemo(() => {
    const seenMeanings = new Set<string>();
    return words.filter((word) => {
      const meaning = word.vietnamese.trim().normalize('NFKC').toLocaleLowerCase();
      if (!meaning || seenMeanings.has(meaning)) return false;
      seenMeanings.add(meaning);
      return true;
    }).slice(0, 6);
  }, [words]);

  const [leftItems, setLeftItems] = useState<MatchItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<MatchItem | null>(null);
  const [selectedRight, setSelectedRight] = useState<MatchItem | null>(null);
  const [matchedWordIds, setMatchedWordIds] = useState<Set<string>>(new Set());
  const [mismatched, setMismatched] = useState<boolean>(false);
  const [attemptHistory, setAttemptHistory] = useState<Record<string, { correct: boolean; tries: number }>>({});

  useEffect(() => {
    // Generate left items (English words)
    const en = targetWords.map((w) => ({
      id: `en_${w.id}`,
      wordId: w.id,
      text: w.word,
      type: 'en' as const
    }));

    // Generate right items (Vietnamese meaning + emoji)
    const vi = targetWords.map((w) => ({
      id: `vi_${w.id}`,
      wordId: w.id,
      text: w.vietnamese,
      emoji: w.emoji,
      type: 'vi' as const
    }));

    // Shuffle both independently
    setLeftItems([...en].sort(() => 0.5 - Math.random()));
    setRightItems([...vi].sort(() => 0.5 - Math.random()));
    setMatchedWordIds(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
  }, [words]);

  // Handle pair matching check
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const isMatch = selectedLeft.wordId === selectedRight.wordId;
      const targetWordObj = targetWords.find((w) => w.id === selectedLeft.wordId);

      if (isMatch) {
        // Matched correctly!
        playSuccessChime();
        setMatchedWordIds((prev) => new Set([...prev, selectedLeft.wordId]));

        // Check if first try
        const currentTries = attemptHistory[selectedLeft.wordId]?.tries || 0;
        const isFirstTry = currentTries === 0;

        setAttemptHistory((prev) => ({
          ...prev,
          [selectedLeft.wordId]: { correct: isFirstTry, tries: currentTries + 1 }
        }));

        if (targetWordObj) {
          onRecordAnswer(targetWordObj, true);
        }

        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // Mismatch - gentle tone and shake
        playGentleTryAgainSound();
        setMismatched(true);

        const currentTries = attemptHistory[selectedLeft.wordId]?.tries || 0;
        setAttemptHistory((prev) => ({
          ...prev,
          [selectedLeft.wordId]: { correct: false, tries: currentTries + 1 }
        }));

        if (targetWordObj) {
          onRecordAnswer(targetWordObj, false);
        }

        const timer = setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setMismatched(false);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedLeft, selectedRight]);

  // When all pairs are matched, finish the game
  useEffect(() => {
    if (targetWords.length > 0 && matchedWordIds.size === targetWords.length) {
      // Calculate results
      const total = targetWords.length;
      let correct = 0;
      const weakIds: string[] = [];

      targetWords.forEach((w) => {
        const hist = attemptHistory[w.id];
        if (hist && hist.correct) {
          correct += 1;
        } else {
          weakIds.push(w.id);
        }
      });

      const timer = setTimeout(() => {
        onFinishGame({
          sessionId: `match_${Date.now()}`,
          timestamp: Date.now(),
          gameType: 'Match the Word (Nối từ)',
          topic,
          grade: currentGrade,
          totalQuestions: total,
          correctAnswers: correct,
          wrongAnswers: total - correct,
          weakWordIds: weakIds
        });
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [matchedWordIds.size]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Game Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-xs flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát trò chơi</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">
            Tiến độ: <strong className="text-amber-600">{matchedWordIds.size} / {targetWords.length}</strong> cặp
          </span>
          <div className="w-24 sm:w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300 rounded-full"
              style={{ width: `${(matchedWordIds.size / targetWords.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="text-center py-2">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
          Nối từ tiếng Anh với nghĩa tiếng Việt
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Nhấp chọn một từ ở cột trái, sau đó nhấp chọn nghĩa tương ứng ở cột phải nhé!
        </p>
      </div>

      {/* 2-Column Matching Board */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column: English Words */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 px-2 uppercase tracking-wider">
            Từ tiếng Anh
          </div>
          {leftItems.map((item) => {
            const isMatched = matchedWordIds.has(item.wordId);
            const isSelected = selectedLeft?.id === item.id;

            return (
              <button
                key={item.id}
                disabled={isMatched}
                onClick={() => {
                  setSelectedLeft(item);
                  speakEnglish(item.text);
                }}
                className={`w-full p-4 rounded-2xl font-bold text-sm sm:text-base text-left transition-all duration-200 border-2 flex items-center justify-between ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60 cursor-default'
                    : isSelected
                    ? mismatched
                      ? 'bg-rose-50 border-rose-400 text-rose-800 animate-shake'
                      : 'bg-amber-100 border-amber-500 text-amber-950 scale-102 shadow-md'
                    : 'bg-white border-slate-200 hover:border-amber-300 text-slate-800 hover:shadow-sm'
                }`}
              >
                <span>{item.text}</span>
                {isMatched ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Volume2 className="w-4 h-4 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Vietnamese Meanings & Emojis */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 px-2 uppercase tracking-wider">
            Nghĩa & Hình ảnh
          </div>
          {rightItems.map((item) => {
            const isMatched = matchedWordIds.has(item.wordId);
            const isSelected = selectedRight?.id === item.id;

            return (
              <button
                key={item.id}
                disabled={isMatched}
                onClick={() => setSelectedRight(item)}
                className={`w-full p-4 rounded-2xl font-bold text-sm sm:text-base text-left transition-all duration-200 border-2 flex items-center gap-2.5 ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60 cursor-default'
                    : isSelected
                    ? mismatched
                      ? 'bg-rose-50 border-rose-400 text-rose-800 animate-shake'
                      : 'bg-amber-100 border-amber-500 text-amber-950 scale-102 shadow-md'
                    : 'bg-white border-slate-200 hover:border-amber-300 text-slate-800 hover:shadow-sm'
                }`}
              >
                <span className="text-xl sm:text-2xl">{item.emoji}</span>
                <span className="flex-1 truncate">{item.text}</span>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
