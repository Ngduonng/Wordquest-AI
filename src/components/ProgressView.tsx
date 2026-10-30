import React, { useState, useEffect } from 'react';
import { GradeLevel, TopicId, WordProgress, VocabularyWord, SessionResult, ConfidenceRecord, ConfidenceScale } from '../types/index.ts';
import { INITIAL_VOCABULARY, TOPICS } from '../data/vocabulary.ts';
import { loadSessionHistory, loadConfidenceRecords, clearAllLocalProgress } from '../services/storage.ts';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Trash2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Mic,
  Smile,
  ShieldCheck
} from 'lucide-react';

interface ProgressViewProps {
  currentGrade: GradeLevel;
  progressMap: Record<string, WordProgress>;
  sessionQuestions: number;
  sessionCorrect: number;
  sessionStars: number;
  onClearProgress: () => void;
  onLoadSampleDemo: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  currentGrade,
  progressMap,
  sessionQuestions,
  sessionCorrect,
  sessionStars,
  onClearProgress,
  onLoadSampleDemo,
  onNavigateToTab
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [confidenceRecords, setConfidenceRecords] = useState<ConfidenceRecord[]>([]);

  // Load confidence records
  useEffect(() => {
    setConfidenceRecords(loadConfidenceRecords());
  }, [progressMap]);

  // Compute aggregate stats across all words for current grade
  const gradeWords = INITIAL_VOCABULARY.filter((w) => w.grade === currentGrade);
  const progressList = gradeWords
    .map((w) => progressMap[w.id])
    .filter(Boolean);

  const totalAttempts = progressList.reduce((acc, p) => acc + p.attempts, 0);
  const totalCorrect = progressList.reduce((acc, p) => acc + p.correctCount, 0);
  const totalWrong = progressList.reduce((acc, p) => acc + p.wrongCount, 0);
  const accuracyRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const masteredWords = progressList.filter((p) => p.status === 'practised_successfully');
  const weakWords = progressList.filter((p) => p.status === 'needs_review' || p.manualFlagged);
  const practicingWords = progressList.filter((p) => p.status === 'practising');

  // Confidence calculations
  const totalConfidenceSessions = confidenceRecords.length;
  const avgBefore = totalConfidenceSessions > 0
    ? (confidenceRecords.reduce((acc, r) => acc + r.beforeRating, 0) / totalConfidenceSessions).toFixed(1)
    : '0';
  const avgAfter = totalConfidenceSessions > 0
    ? (confidenceRecords.reduce((acc, r) => acc + r.afterRating, 0) / totalConfidenceSessions).toFixed(1)
    : '0';
  const improvedSessions = confidenceRecords.filter((r) => r.afterRating > r.beforeRating).length;
  const improvementRate = totalConfidenceSessions > 0
    ? Math.round((improvedSessions / totalConfidenceSessions) * 100)
    : 0;

  const confidenceLabels: Record<ConfidenceScale, { label: string; emoji: string }> = {
    1: { label: 'Chưa tự tin', emoji: '🔴' },
    2: { label: 'Cần nhiều gợi ý', emoji: '🟡' },
    3: { label: 'Ít gợi ý', emoji: '🟢' },
    4: { label: 'Rất tự tin', emoji: '🌟' }
  };

  // Topic mastery rates
  const topicMastery = TOPICS.map((topic) => {
    const wordsInTopic = gradeWords.filter((w) => w.topic === topic.id);
    const masteredInTopic = wordsInTopic.filter(
      (w) => progressMap[w.id]?.status === 'practised_successfully'
    ).length;
    const attemptedInTopic = wordsInTopic.filter((w) => (progressMap[w.id]?.attempts || 0) > 0).length;
    const percent = wordsInTopic.length > 0 ? Math.round((masteredInTopic / wordsInTopic.length) * 100) : 0;

    return {
      topic,
      total: wordsInTopic.length,
      mastered: masteredInTopic,
      attempted: attemptedInTopic,
      percent
    };
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src="/assets/images/award-star-badge.svg"
              alt="Star Badge"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Báo cáo tiến độ &amp; Sự tự tin học tập
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Dữ liệu học tập thực tế của học sinh Lớp 5A4 · SGK Tiếng Anh 5 Global Success (Tập 1 &amp; Tập 2)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              onLoadSampleDemo();
              setConfidenceRecords(loadConfidenceRecords());
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
            title="Nạp dữ liệu mẫu thử nghiệm giao diện"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Nạp dữ liệu mẫu (Sample Demo)</span>
          </button>

          {(totalAttempts > 0 || totalConfidenceSessions > 0) && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 border border-slate-200 transition-colors"
              title="Xóa toàn bộ tiến độ về 0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa tiến độ (Reset)</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clearing Progress */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 text-2xl">
              ⚠️
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Xác nhận xóa tiến độ?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thao tác này sẽ xóa toàn bộ số câu đã làm, điểm tự đánh giá và danh sách từ cần ôn trên trình duyệt này.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onClearProgress();
                  setConfidenceRecords([]);
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-rose-600 text-white hover:bg-rose-700"
              >
                Xóa ngay
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Tổng số câu đã làm
          </span>
          <span className="font-heading text-3xl font-extrabold text-slate-900 block mt-1">
            {totalAttempts}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Phiên này: +{sessionQuestions} câu
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Tỷ lệ trả lời đúng
          </span>
          <span className="font-heading text-3xl font-extrabold text-emerald-600 block mt-1">
            {accuracyRate}%
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Đúng {totalCorrect} / Sai {totalWrong}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Từ vựng đã thuộc
          </span>
          <span className="font-heading text-3xl font-extrabold text-amber-600 block mt-1">
            {masteredWords.length} <span className="text-lg font-normal text-slate-400">/ {gradeWords.length}</span>
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Đang luyện: {practicingWords.length} từ
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
            Từ cần ôn lại
          </span>
          <span className="font-heading text-3xl font-extrabold text-rose-600 block mt-1">
            {weakWords.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Ưu tiên trong phiên ôn tập
          </span>
        </div>
      </div>

      {/* Student Self-Assessed Confidence Section (Đề tài 2026 Core Component) */}
      <section className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
              🌟
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-900">
                Chỉ số sự tự tin do học sinh tự đánh giá (Lớp 5A4)
              </h2>
              <p className="text-xs text-slate-500">
                Thang đo 4 mức độ (1-Chưa tự tin ➔ 4-Rất tự tin), đánh giá trước và sau mỗi lượt Speaking Quest
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('speaking')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Vào Speaking Quest</span>
          </button>
        </div>

        {totalConfidenceSessions > 0 ? (
          <div className="space-y-4">
            {/* Summary Confidence Comparison Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-xs text-slate-500 font-medium">Điểm tự tin trung bình TRƯỚC</span>
                <div className="font-heading text-3xl font-extrabold text-slate-800">
                  {avgBefore} <span className="text-xs font-normal text-slate-400">/ 4.0</span>
                </div>
                <span className="text-[11px] text-slate-400">Cảm nhận ban đầu khi nhận đề bài</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <span className="text-xs text-emerald-800 font-medium">Điểm tự tin trung bình SAU</span>
                <div className="font-heading text-3xl font-extrabold text-emerald-700">
                  {avgAfter} <span className="text-xs font-normal text-emerald-500">/ 4.0</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">
                  Tăng trưởng trung bình: +{(Number(avgAfter) - Number(avgBefore)).toFixed(1)} điểm
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                <span className="text-xs text-amber-800 font-medium">Tỷ lệ tiến bộ cảm nhận</span>
                <div className="font-heading text-3xl font-extrabold text-amber-700">
                  {improvementRate}%
                </div>
                <span className="text-[11px] text-amber-700">
                  {improvedSessions} / {totalConfidenceSessions} lượt cảm thấy tự tin hơn
                </span>
              </div>
            </div>

            {/* List of recent confidence records */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Nhật ký tự đánh giá gần đây:
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {confidenceRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{rec.activityTitle}</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(rec.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · {rec.studentCode || 'HS Lớp 5A4'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-semibold">
                      <div className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700">
                        {confidenceLabels[rec.beforeRating]?.emoji} {confidenceLabels[rec.beforeRating]?.label}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <div className="px-2.5 py-1 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold">
                        {confidenceLabels[rec.afterRating]?.emoji} {confidenceLabels[rec.afterRating]?.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 space-y-2">
            <p className="text-sm">Chưa có lượt tự đánh giá sự tự tin nào trên thiết bị này.</p>
            <p className="text-xs text-slate-400">
              Hãy bấm vào "Nạp dữ liệu mẫu" ở trên hoặc tham gia một bài luyện tại mục "Luyện giao tiếp" để ghi nhận!
            </p>
          </div>
        )}
      </section>

      {/* Next Recommended Activity Card */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            Gợi ý hoạt động tiếp theo
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold">
            {weakWords.length > 0
              ? `Em có ${weakWords.length} từ cần củng cố thêm!`
              : totalAttempts === 0
              ? 'Hãy bắt đầu khám phá các thẻ từ vựng đầu tiên nhé!'
              : 'Tiến độ rất tuyệt vời! Thử thách một màn trò chơi mới nào!'}
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 font-medium">
            {weakWords.length > 0
              ? 'Học lại những từ sai sẽ giúp bộ não ghi nhớ sâu gấp 3 lần.'
              : 'Mỗi ngày luyện tập 10 phút sẽ giúp vốn từ của em phong phú hơn.'}
          </p>
        </div>

        <button
          onClick={() => onNavigateToTab(weakWords.length > 0 ? 'review' : 'play')}
          className="flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-amber-50 px-5 py-3 rounded-2xl font-bold text-sm shadow-md shrink-0 transition-transform hover:scale-102"
        >
          <span>{weakWords.length > 0 ? 'Ôn từ yếu ngay' : 'Vào luyện trò chơi'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Topic Mastery Progress Bars */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
        <h2 className="font-heading text-xl font-bold text-slate-900">
          Tiến độ theo từng chủ đề Lớp {currentGrade}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicMastery.map(({ topic, total, mastered, attempted, percent }) => (
            <div key={topic.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <span>{topic.emoji}</span>
                  <span>{topic.nameVi}</span>
                </span>
                <span className="text-xs font-bold text-amber-600">{percent}%</span>
              </div>

              {/* Progress track */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Đã thuộc: {mastered}/{total} từ</span>
                <span>Đã từng làm: {attempted}/{total} từ</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Words List Details */}
      {weakWords.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>Danh sách từ cần ôn lại ({weakWords.length})</span>
            </h2>
            <button
              onClick={() => onNavigateToTab('review')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
            >
              Mở trong trung tâm ôn tập →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {weakWords.map((p) => {
              const wordObj = INITIAL_VOCABULARY.find((w) => w.id === p.wordId);
              return (
                <div
                  key={p.wordId}
                  className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{wordObj?.emoji || '📝'}</span>
                    <div>
                      <span className="font-heading font-bold text-slate-900 block text-sm">{p.word}</span>
                      <span className="text-xs text-rose-700 font-medium">{wordObj?.vietnamese}</span>
                    </div>
                  </div>
                  <div className="text-right text-[11px]">
                    <span className="text-rose-600 font-bold block">Sai {p.wrongCount} lần</span>
                    <span className="text-slate-400">Làm {p.attempts} lần</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ethical note */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          Báo cáo phục vụ mục đích tự theo dõi tiến bộ cá nhân của học sinh và điều chỉnh kế hoạch giảng dạy của giáo viên tiếng Anh lớp 5A4. Không dùng để xếp hạng hay áp lực điểm số.
        </span>
      </div>
    </div>
  );
};
