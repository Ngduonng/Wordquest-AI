import React from 'react';
import { SessionResult, VocabularyWord } from '../../types/index.ts';
import { Trophy, RotateCcw, ArrowRight, Star, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface GameResultsModalProps {
  result: SessionResult;
  vocabularyMap: Record<string, VocabularyWord>;
  onPlayAgain: () => void;
  onGoToReview: () => void;
  onBackToMenu: () => void;
}

export const GameResultsModal: React.FC<GameResultsModalProps> = ({
  result,
  vocabularyMap,
  onPlayAgain,
  onGoToReview,
  onBackToMenu
}) => {
  const accuracy = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const starsEarned = Math.max(1, Math.round((accuracy / 100) * 3));

  const weakWordsList = result.weakWordIds
    .map((id) => vocabularyMap[id])
    .filter(Boolean) as VocabularyWord[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-amber-300 shadow-2xl space-y-6 text-center animate-scaleUp">
        {/* Celebration Trophy & Stars */}
        <div className="space-y-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-4xl shadow-sm">
            🎉
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Hoàn thành lượt luyện tập!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Em đã rất nỗ lực trong phần thi {result.gameType}
          </p>
        </div>

        {/* Stars earned row */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((starIdx) => (
            <span
              key={starIdx}
              className={`text-4xl transition-transform ${
                starIdx <= starsEarned
                  ? 'text-amber-400 scale-110 drop-shadow-xs'
                  : 'text-slate-200'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Score Stats Ticker */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Tổng số câu</span>
            <span className="font-heading text-xl font-bold text-slate-800">{result.totalQuestions}</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-700 block">Số câu đúng</span>
            <span className="font-heading text-xl font-bold text-emerald-700">{result.correctAnswers}</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-700 block">Tỷ lệ chính xác</span>
            <span className="font-heading text-xl font-bold text-amber-700">{accuracy}%</span>
          </div>
        </div>

        {/* Weak Words Alert (if any) */}
        {weakWordsList.length > 0 ? (
          <div className="text-left bg-rose-50/80 rounded-2xl p-4 border border-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Các từ em cần ôn lại thêm một chút:</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {weakWordsList.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-rose-200 text-xs font-bold text-slate-800 shadow-2xs"
                >
                  <span>{w.emoji}</span>
                  <span>{w.word}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-rose-700 font-medium">{w.vietnamese}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Xuất sắc! Em không có từ nào trả lời sai trong lượt này! 🌟</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {weakWordsList.length > 0 && (
            <button
              onClick={onGoToReview}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-2xl font-bold text-sm shadow-md shadow-rose-600/20 transition-all hover:scale-101"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ôn tập {weakWordsList.length} từ còn yếu ngay</span>
            </button>
          )}

          <div className="flex gap-2.5">
            <button
              onClick={onPlayAgain}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-2xl font-bold text-sm shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Chơi lại</span>
            </button>

            <button
              onClick={onBackToMenu}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold text-sm transition-colors"
            >
              <span>Về menu trò chơi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
