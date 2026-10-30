import React, { useState } from 'react';
import { GameQuestion, VocabularyWord, SessionResult, GradeLevel } from '../../types/index.ts';
import { playSuccessChime, playGentleTryAgainSound, speakEnglish } from '../../services/audio.ts';
import { TOPICS } from '../../data/vocabulary.ts';
import { ArrowLeft, Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface MultipleChoiceGameProps {
  questions: GameQuestion[];
  vocabularyMap: Record<string, VocabularyWord>;
  currentGrade: GradeLevel;
  topic: string;
  onFinishGame: (result: SessionResult) => void;
  onExit: () => void;
  onRecordAnswer: (wordMeta: { id: string; word: string; topic: string; grade: GradeLevel }, isCorrect: boolean) => void;
}

export const MultipleChoiceGame: React.FC<MultipleChoiceGameProps> = ({
  questions,
  vocabularyMap,
  currentGrade,
  topic,
  onFinishGame,
  onExit,
  onRecordAnswer
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState<boolean>(true);
  const [score, setScore] = useState(0);
  const [weakWordIds, setWeakWordIds] = useState<string[]>([]);

  const currentQ = questions[currentIndex];
  const vocabMeta = currentQ ? vocabularyMap[currentQ.wordId] : undefined;

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const correct = option.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
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
        correct
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
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setFirstAttemptCorrect(true);
    } else {
      // Completed all questions!
      const total = questions.length;
      onFinishGame({
        sessionId: `mc_${Date.now()}`,
        timestamp: Date.now(),
        gameType: 'Trắc nghiệm thông thái',
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
        <p className="text-slate-700 font-semibold">Chưa có câu hỏi phù hợp cho chủ đề này.</p>
        <button onClick={onExit} className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-sm">Quay lại chọn trò chơi</button>
      </div>
    );
  }

  const topicLabel = vocabMeta?.categoryNameVi
    || TOPICS.find((item) => item.id === currentQ.topic)?.nameVi
    || currentQ.topic;

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

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-100 text-amber-800">
              {topicLabel} · Lớp {currentQ.grade}
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {vocabMeta?.emoji && (
            <span className="text-5xl shrink-0 p-2 bg-amber-50 rounded-2xl border border-amber-100">
              {vocabMeta.emoji}
            </span>
          )}
        </div>

        {/* Word sound button */}
        {currentQ.word && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => speakEnglish(currentQ.word)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>Phát âm: "{currentQ.word}"</span>
            </button>
          </div>
        )}

        {/* 4 Clickable Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQ.options.map((option, idx) => {
            const isChosen = selectedOption === option;
            const isTargetCorrect = option.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

            let btnStyle = 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-800';

            if (isAnswered) {
              if (isTargetCorrect) {
                btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-xs';
              } else if (isChosen && !isCorrect) {
                btnStyle = 'bg-rose-100 border-rose-300 text-rose-900 font-semibold';
              } else {
                btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-semibold transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{option}</span>
                {isAnswered && isTargetCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                )}
                {isAnswered && isChosen && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation Box */}
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
                  <span>Tuyệt vời! Em trả lời hoàn toàn chính xác! ⭐</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>Chưa chính xác nhưng không sao cả, cùng học nhé!</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
              {currentQ.explanationVi}
            </p>

            {/* Action buttons after answer */}
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
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-sm transition-all"
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
