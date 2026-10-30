import React from 'react';
import { GradeLevel, TopicId } from '../../types/index.ts';
import { TOPICS } from '../../data/vocabulary.ts';
import { Layers, CheckCircle2, FileEdit, Sparkles, Trophy } from 'lucide-react';

interface GameSelectorProps {
  currentGrade: GradeLevel;
  selectedTopic: TopicId;
  onSelectTopic: (topicId: TopicId) => void;
  onStartGame: (gameType: 'match' | 'multiple_choice' | 'sentence_completion') => void;
}

export const GameSelector: React.FC<GameSelectorProps> = ({
  currentGrade,
  selectedTopic,
  onSelectTopic,
  onStartGame
}) => {
  const [bookFilter, setBookFilter] = React.useState<'all' | 1 | 2>('all');
  const displayTopics = TOPICS.filter((t) => bookFilter === 'all' || t.book === bookFilter);

  const games = [
    {
      id: 'match' as const,
      title: 'Game A: Match the Word',
      titleVi: 'Ghép từ & Hình ảnh',
      descriptionVi: 'Nối từ tiếng Anh với hình minh họa hoặc nghĩa tiếng Việt tương ứng.',
      emoji: '🧩',
      imageUrl: '/assets/images/activity-matching.svg',
      gradient: 'from-amber-400 to-orange-500',
      badge: 'Phản xạ nhanh',
      accentColor: 'text-orange-600'
    },
    {
      id: 'multiple_choice' as const,
      title: 'Game B: Choose the Correct Answer',
      titleVi: 'Trắc nghiệm thông thái',
      descriptionVi: 'Đọc câu hỏi và chọn 1 đáp án chính xác nhất trong 4 lựa chọn.',
      emoji: '🎯',
      imageUrl: '/assets/images/activity-quiz.svg',
      gradient: 'from-sky-400 to-blue-600',
      badge: 'Nhớ nghĩa từ',
      accentColor: 'text-blue-600'
    },
    {
      id: 'sentence_completion' as const,
      title: 'Game C: Complete the Sentence',
      titleVi: 'Điền từ vào câu',
      descriptionVi: 'Chọn từ vựng chuẩn xác để điền vào chỗ trống trong câu ngắn hoàn chỉnh.',
      emoji: '✍️',
      imageUrl: '/assets/images/activity-listening.svg',
      gradient: 'from-emerald-400 to-teal-600',
      badge: 'Vận dụng ngữ cảnh',
      accentColor: 'text-emerald-600'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title & Topic Selection */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-xs space-y-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <span>Đấu trường trò chơi từ vựng</span>
            <span>🎮</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Chơi trò chơi tương tác vui nhộn để ghi nhớ từ vựng tự nhiên và hiệu quả!
          </p>
        </div>

        {/* Topic filter with Book 1 & 2 selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">Chọn sách:</span>
            <button
              onClick={() => {
                setBookFilter('all');
                onSelectTopic('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                bookFilter === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất cả (20 Units)
            </button>
            <button
              onClick={() => {
                setBookFilter(1);
                onSelectTopic('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                bookFilter === 1
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📘 Tập 1 (Units 1–10)
            </button>
            <button
              onClick={() => {
                setBookFilter(2);
                onSelectTopic('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                bookFilter === 2
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📙 Tập 2 (Units 11–20)
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => onSelectTopic('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedTopic === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất cả Unit
            </button>
            {displayTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedTopic === topic.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{topic.emoji}</span>
                <span>{topic.nameVi}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {games.map((g) => (
          <div
            key={g.id}
            className="group relative bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                {g.imageUrl ? (
                  <div className="w-16 h-16 p-2 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                    <img
                      src={g.imageUrl}
                      alt={g.titleVi}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.game-emoji-fallback');
                        if (fallback) (fallback as HTMLElement).style.display = 'block';
                      }}
                    />
                    <span className="game-emoji-fallback hidden text-4xl">{g.emoji}</span>
                  </div>
                ) : (
                  <span className="text-5xl transform group-hover:scale-110 transition-transform">
                    {g.emoji}
                  </span>
                )}
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
                  {g.badge}
                </span>
              </div>

              <h2 className="font-heading text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                {g.titleVi}
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {g.title}
              </p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {g.descriptionVi}
              </p>
            </div>

            <button
              onClick={() => onStartGame(g.id)}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-2xl font-bold text-sm shadow-md shadow-amber-500/20 active:scale-98 transition-transform"
            >
              <Sparkles className="w-4 h-4" />
              <span>Chơi ngay (5–10 câu)</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
