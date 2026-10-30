import React, { useState } from 'react';
import { GameQuestion, VocabularyWord, SessionResult, GradeLevel } from '../../types/index.ts';
import { playSuccessChime, playGentleTryAgainSound, speakEnglish } from '../../services/audio.ts';
import { ArrowLeft, Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface SentenceGameProps {
  questions: GameQuestion[];
  vocabularyMap: Record<string, VocabularyWord>;
  currentGrade: GradeLevel;
  topic: string;
  onFinishGame: (result: SessionResult) => void;
  onExit: () => void;
  onRecordAnswer: (wordMeta: { id: string; word: string; topic: string; grade: GradeLevel }, isCorrect: boolean) => void;
}

export const SentenceGame: React.FC<SentenceGameProps> = ({
  questions,
  vocabularyMap,
  currentGrade,
  topic,
  onFinishGame,
  onExit,
  onRecordAnswer
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState<boolean>(true);
  const [score, setScore] = useState(0);
  const [weakWordIds, setWeakWordIds] = useState<string[]>([]);

  const currentQ = questions[currentIndex];
  const vocabMeta = currentQ ? vocabularyMap[currentQ.wordId] : undefined;

  const handleSelectWord = (wordChoice: string) => {
    if (isAnswered) return;

    setSelectedWord(wordChoice);
    setIsAnswered(true);

    const correct = wordChoice.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      playSuccessChime();
      if (firstAttemptCorrect) {
        setScore((prev) => prev + 1);
      }
      onRecordAnswer(
        {
          id: currentQ.wordId || `custom_${currentQ.word}`,
          word: currentQ.word,
          topic: currentQ.topic,
          grade: currentQ.grade
        },
        firstAttemptCorrect
      );
    } else {
      playGentleTryAgainSound();
      setFirstAttemptCorrect(false);
      setWeakWordIds((prev) => (prev.includes(currentQ.wordId) ? prev : [...prev, currentQ.wordId]));
      onRecordAnswer(
        {
          id: currentQ.wordId || `custom_${currentQ.word}`,
          word: currentQ.word,
          topic: currentQ.topic,
          grade: currentQ.grade
        },
        false
      );
    }
  };

  const handleRetryCurrent = () => {
    setSelectedWord(null);
    setIsAnswered(false);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedWord(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setFirstAttemptCorrect(true);
    } else {
      const total = questions.length;
      onFinishGame({
        sessionId: `sentence_${Date.now()}`,
        timestamp: Date.now(),
        gameType: 'Điền từ vào câu',
        topic,
        grade: currentGrade,
        totalQuestions: total,
        correctAnswers: score,
        wrongAnswers: total - score,
        weakWordIds
      });
    }
  };

  if (!currentQ) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center max-w-lg mx-auto">
        <p className="text-slate-600">Đang chuẩn bị bài tập điền từ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-xs flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">
            Câu <strong className="text-amber-600">{currentIndex + 1}</strong> / {questions.length}
          </span>
          <div className="w-24 sm:w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Sentence Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800">
              Điền từ thích hợp · Lớp {currentQ.grade}
            </span>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Chọn từ thích hợp nhất để hoàn thành câu hoàn chỉnh bên dưới:
            </p>
          </div>

          {vocabMeta?.emoji && (
            <span className="text-5xl shrink-0 p-2 bg-emerald-50 rounded-2xl border border-emerald-100">
              {vocabMeta.emoji}
            </span>
          )}
        </div>

        {/* The Sentence with Blank Highlight */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center space-y-2">
          <p className="font-heading text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed">
            {currentQ.question.replace('Chọn từ thích hợp điền vào chỗ trống:\n', '')}
          </p>
          {currentQ.hint && (
            <p className="text-xs text-amber-700 font-semibold">{currentQ.hint}</p>
          )}
        </div>

        {/* Word Options Tiles */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Chọn từ điền vào câu:
          </div>
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((option, idx) => {
              const isChosen = selectedWord === option;
              const isTargetCorrect = option.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

              let style = 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 text-slate-800';

              if (isAnswered) {
                if (isTargetCorrect) {
                  style = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                } else if (isChosen && !isCorrect) {
                  style = 'bg-rose-100 border-rose-300 text-rose-900 font-semibold';
                } else {
                  style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectWord(option)}
                  className={`p-4 rounded-2xl border-2 text-center text-base sm:text-lg font-bold transition-all flex items-center justify-center gap-2 ${style}`}
                >
                  <span>{option}</span>
                  {isAnswered && isTargetCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isChosen && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Section */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border ${
              isCorrect
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/80 border-rose-200 text-rose-900'
            } space-y-2 animate-fadeIn`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Chính xác rồi! Em làm tốt lắm! ⭐</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>Em chưa chọn đúng, cùng xem lại nhé!</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentQ.explanationVi}
            </p>

            {/* Read sentence sound button */}
            {vocabMeta?.exampleEn && (
              <button
                onClick={() => speakEnglish(vocabMeta.exampleEn)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nghe cả câu hoàn chỉnh</span>
              </button>
            )}

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              {!isCorrect && (
                <button
                  onClick={handleRetryCurrent}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Thử lại câu này</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
              >
                <span>{currentIndex + 1 < questions.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
