import React, { useState } from 'react';
import { GradeLevel, TopicId, VocabularyWord, WordProgress, WordStatus } from '../types/index.ts';
import { INITIAL_VOCABULARY } from '../data/vocabulary.ts';
import { getAdaptiveReviewList } from '../logic/reviewLogic.ts';
import { MultipleChoiceGame } from './play/MultipleChoiceGame.tsx';
import { GameResultsModal } from './play/GameResultsModal.tsx';
import { buildMultipleChoiceQuestions } from '../logic/reviewLogic.ts';
import { saveSessionHistory } from '../services/storage.ts';
import {
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flag,
  ArrowRight,
  Info,
  Filter,
  Play
} from 'lucide-react';

interface ReviewViewProps {
  currentGrade: GradeLevel;
  progressMap: Record<string, WordProgress>;
  onToggleFlag: (word: VocabularyWord) => void;
  onRecordAnswer: (wordMeta: { id: string; word: string; topic: string; grade: GradeLevel }, isCorrect: boolean) => void;
  onAddSessionStars: (stars: number) => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  currentGrade,
  progressMap,
  onToggleFlag,
  onRecordAnswer,
  onAddSessionStars
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | WordStatus>('all');
  const [isPracticingWeakWords, setIsPracticingWeakWords] = useState(false);
  const [activeSessionResult, setActiveSessionResult] = useState<any | null>(null);

  // Vocabulary map lookup
  const vocabMap = React.useMemo(() => {
    const map: Record<string, VocabularyWord> = {};
    INITIAL_VOCABULARY.forEach((w) => {
      map[w.id] = w;
    });
    return map;
  }, []);

  // Filter vocabulary by current grade
  const gradeWords = INITIAL_VOCABULARY.filter((w) => w.grade === currentGrade);

  // Categorize words
  const wordsWithProgress = gradeWords.map((word) => {
    const prog = progressMap[word.id] || {
      wordId: word.id,
      word: word.word,
      topic: word.topic,
      grade: word.grade,
      attempts: 0,
      correctCount: 0,
      wrongCount: 0,
      lastPracticed: 0,
      manualFlagged: false,
      status: 'new' as WordStatus
    };
    return { word, prog };
  });

  const needsReviewWords = wordsWithProgress.filter(
    (item) => item.prog.status === 'needs_review' || item.prog.manualFlagged
  );
  const practisingWords = wordsWithProgress.filter((item) => item.prog.status === 'practising');
  const masteredWords = wordsWithProgress.filter((item) => item.prog.status === 'practised_successfully');
  const newWords = wordsWithProgress.filter((item) => item.prog.status === 'new' && !item.prog.manualFlagged);

  // Words to display based on tab filter
  const displayedWords = wordsWithProgress.filter((item) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'needs_review') return item.prog.status === 'needs_review' || item.prog.manualFlagged;
    return item.prog.status === statusFilter;
  });

  // Adaptive questions for weak words
  const adaptiveTargetWords = React.useMemo(() => {
    return getAdaptiveReviewList(gradeWords, progressMap, 6);
  }, [gradeWords, progressMap]);

  const adaptiveQuestions = React.useMemo(() => {
    return buildMultipleChoiceQuestions(adaptiveTargetWords, INITIAL_VOCABULARY);
  }, [adaptiveTargetWords]);

  const formatLastPracticed = (timestamp: number) => {
    if (!timestamp) return 'Chưa luyện';
    const diffMins = Math.round((Date.now() - timestamp) / (1000 * 60));
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: WordStatus, flagged: boolean) => {
    if (flagged || status === 'needs_review') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          <span>Cần ôn lại</span>
        </span>
      );
    }
    if (status === 'practising') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
          <Clock className="w-3 h-3 text-blue-600" />
          <span>Đang luyện</span>
        </span>
      );
    }
    if (status === 'practised_successfully') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Đã thuộc</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
        <span>Mới</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* If playing adaptive review session */}
      {isPracticingWeakWords ? (
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Đang trong phiên ôn tập thích ứng: {adaptiveTargetWords.length} từ ưu tiên</span>
            </div>
            <button
              onClick={() => setIsPracticingWeakWords(false)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1 bg-white rounded-xl border border-slate-200"
            >
              Dừng ôn tập
            </button>
          </div>

          <MultipleChoiceGame
            questions={adaptiveQuestions}
            vocabularyMap={vocabMap}
            currentGrade={currentGrade}
            topic="Ôn tập thích ứng"
            onFinishGame={(result) => {
              setActiveSessionResult(result);
              saveSessionHistory(result);
              onAddSessionStars(2);
            }}
            onExit={() => setIsPracticingWeakWords(false)}
            onRecordAnswer={onRecordAnswer}
          />

          {activeSessionResult && (
            <GameResultsModal
              result={activeSessionResult}
              vocabularyMap={vocabMap}
              onPlayAgain={() => {
                setActiveSessionResult(null);
                setIsPracticingWeakWords(true);
              }}
              onGoToReview={() => {
                setActiveSessionResult(null);
                setIsPracticingWeakWords(false);
              }}
              onBackToMenu={() => {
                setActiveSessionResult(null);
                setIsPracticingWeakWords(false);
              }}
            />
          )}
        </div>
      ) : (
        <>
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Trung tâm ôn tập thích ứng</span>
                  <span className="text-xl">🎯</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Hệ thống tự động phát hiện các từ em thường nhầm lẫn để ưu tiên ôn luyện
                </p>
              </div>

              {/* Start Adaptive Practice Button */}
              <button
                onClick={() => setIsPracticingWeakWords(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md shadow-rose-500/20 active:scale-98 transition-transform"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt đầu ôn tập {needsReviewWords.length > 0 ? needsReviewWords.length : adaptiveTargetWords.length} từ ưu tiên</span>
              </button>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-rose-50/80 border border-rose-200 p-3.5 rounded-2xl">
                <span className="text-[11px] font-bold text-rose-700 uppercase">Cần ôn lại</span>
                <span className="font-heading text-2xl font-bold text-rose-800 block mt-0.5">
                  {needsReviewWords.length}
                </span>
                <span className="text-[10px] text-rose-600 font-medium">Ưu tiên cao nhất</span>
              </div>

              <div className="bg-blue-50/80 border border-blue-200 p-3.5 rounded-2xl">
                <span className="text-[11px] font-bold text-blue-700 uppercase">Đang luyện</span>
                <span className="font-heading text-2xl font-bold text-blue-800 block mt-0.5">
                  {practisingWords.length}
                </span>
                <span className="text-[10px] text-blue-600 font-medium">Đang tiến bộ</span>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl">
                <span className="text-[11px] font-bold text-emerald-700 uppercase">Đã thuộc</span>
                <span className="font-heading text-2xl font-bold text-emerald-800 block mt-0.5">
                  {masteredWords.length}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Ghi nhớ vững chắc</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-600 uppercase">Từ mới</span>
                <span className="font-heading text-2xl font-bold text-slate-800 block mt-0.5">
                  {newWords.length}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Chưa làm bài</span>
              </div>
            </div>
          </div>

          {/* Educational Logic Transparency Box */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Logic xếp lịch ôn tập thích ứng (Spaced-Repetition Principle):</span>
            </div>
            <p className="text-amber-800/90 leading-relaxed pl-5">
              Từ chưa học xuất hiện dần trong bài học mới. Từ học sinh chọn sai hoặc tự tay đánh dấu được đẩy lên đầu lượt ôn.
              Từ trả lời đúng nhiều lần liên tiếp sẽ giảm tần suất lặp lại để học sinh tập trung thời gian vào những từ chưa vững.
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Tất cả ({gradeWords.length})
            </button>
            <button
              onClick={() => setStatusFilter('needs_review')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'needs_review'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-rose-700 hover:bg-rose-50'
              }`}
            >
              Cần ôn lại ({needsReviewWords.length})
            </button>
            <button
              onClick={() => setStatusFilter('practising')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'practising'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-blue-700 hover:bg-blue-50'
              }`}
            >
              Đang luyện ({practisingWords.length})
            </button>
            <button
              onClick={() => setStatusFilter('practised_successfully')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'practised_successfully'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Đã thuộc ({masteredWords.length})
            </button>
          </div>

          {/* Vocabulary Review Cards List */}
          <div className="space-y-3">
            {displayedWords.map(({ word, prog }) => {
              const accuracy =
                prog.attempts > 0 ? Math.round((prog.correctCount / prog.attempts) * 100) : 0;

              return (
                <div
                  key={word.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-amber-300 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: word info & emoji */}
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl sm:text-4xl p-2 bg-amber-50/60 rounded-2xl border border-amber-100 shrink-0">
                      {word.emoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading text-lg font-bold text-slate-900">{word.word}</h3>
                        <span className="text-xs font-mono text-slate-500">{word.phonetic}</span>
                        {getStatusBadge(prog.status, prog.manualFlagged)}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-amber-700 mt-0.5">
                        {word.vietnamese}
                      </p>
                      <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-1">
                        "{word.exampleEn}"
                      </p>
                    </div>
                  </div>

                  {/* Right: stats & flag toggle */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="flex items-center gap-3 text-center text-xs">
                      <div className="px-2 py-1 bg-slate-50 rounded-lg">
                        <span className="text-[10px] text-slate-500 block">Số lần</span>
                        <span className="font-bold text-slate-800">{prog.attempts}</span>
                      </div>
                      <div className="px-2 py-1 bg-emerald-50 rounded-lg">
                        <span className="text-[10px] text-emerald-700 block">Đúng</span>
                        <span className="font-bold text-emerald-700">{prog.correctCount}</span>
                      </div>
                      <div className="px-2 py-1 bg-rose-50 rounded-lg">
                        <span className="text-[10px] text-rose-700 block">Sai</span>
                        <span className="font-bold text-rose-700">{prog.wrongCount}</span>
                      </div>
                      <div className="hidden md:block text-left pl-2">
                        <span className="text-[10px] text-slate-400 block">Lần cuối:</span>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {formatLastPracticed(prog.lastPracticed)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleFlag(word)}
                      className={`p-2 rounded-xl transition-colors ${
                        prog.manualFlagged
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-400 hover:text-slate-700'
                      }`}
                      title={prog.manualFlagged ? 'Hủy đánh dấu ôn lại' : 'Đánh dấu cần ôn lại'}
                    >
                      <Flag className={`w-4 h-4 ${prog.manualFlagged ? 'fill-rose-600' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
