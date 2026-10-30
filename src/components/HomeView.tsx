import React from 'react';
import { GradeLevel, TopicId, WordProgress } from '../types/index.ts';
import { TOPICS, INITIAL_VOCABULARY } from '../data/vocabulary.ts';
import { SPEAKING_SCENARIOS } from '../data/speakingScenarios.ts';
import {
  BookOpen,
  Gamepad2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Mic,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Award,
  Layers,
  Bot
} from 'lucide-react';

interface HomeViewProps {
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onSelectTopic: (topicId: TopicId) => void;
  onNavigate: (tab: string) => void;
  progressMap: Record<string, WordProgress>;
  sessionQuestions: number;
  sessionCorrect: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentGrade,
  onSelectGrade,
  onSelectTopic,
  onNavigate,
  progressMap,
  sessionQuestions,
  sessionCorrect
}) => {
  // Compute weak words needing review
  const weakWords = Object.values(progressMap).filter(
    (p) => p.status === 'needs_review' || p.manualFlagged
  );

  const [bookFilter, setBookFilter] = React.useState<'all' | 1 | 2>('all');

  // Filter vocabulary by current grade (Grade 5)
  const gradeWords = INITIAL_VOCABULARY.filter((w) => w.grade === currentGrade);

  // Filter topics by Book 1 or Book 2
  const displayTopics = TOPICS.filter((t) => bookFilter === 'all' || t.book === bookFilter);

  return (
    <div className="space-y-8 pb-12">
      {/* Contest Identification & Class 5B4 Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-sm border border-indigo-700/40 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ĐỀ TÀI DỰ THI GIÁO DỤC 2026</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-slate-200 font-medium">
              Lớp 5B4 · Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị
            </span>
          </div>
        </div>

        <div>
          <h1 className="font-heading text-lg sm:text-2xl font-bold tracking-tight text-white leading-snug">
            Ứng dụng AI trong thiết kế hoạt động học tiếng Anh cá nhân hóa nhằm tăng hứng thú học tập và sự tự tin trong giao tiếp cho học sinh lớp 5B4, Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1 leading-relaxed">
            Không gian luyện tiếng Anh qua hình ảnh, hội thoại và trò chơi dành cho học sinh lớp 5B4.
          </p>
        </div>
      </div>

      {/* Main Student Hub Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 p-6 sm:p-10 text-white shadow-md shadow-orange-500/10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide">
            <img
              src="/assets/images/mascot.svg"
              alt="Mascot"
              referrerPolicy="no-referrer"
              className="w-5 h-5 object-contain"
            />
            <span>WordQuest AI – Hành trình chinh phục tiếng Anh</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Tự tin giao tiếp · Vững vàng từ vựng
          </h2>
          <p className="text-base sm:text-lg text-amber-50 font-medium">
            Học từ qua hình ảnh – Luyện nói với AI – Chơi trò chơi tương tác – Ôn lại từ còn yếu
          </p>

          {/* Grade 5 Global Success Curriculum Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-bold text-white/95">Chương trình chuẩn Lớp 5:</span>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white border border-white/30">
              <span>📘 SGK Tiếng Anh 5 - Tập Một (Units 1 – 10)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white border border-white/30">
              <span>📙 SGK Tiếng Anh 5 - Tập Hai (Units 11 – 20)</span>
            </div>
          </div>

          {/* The 5 Key Action Buttons Required */}
          <div className="pt-4 flex flex-wrap gap-2.5 sm:gap-3">
            {/* 1. Bắt đầu học */}
            <button
              onClick={() => onNavigate('learn')}
              className="flex items-center gap-2 bg-white text-orange-600 hover:bg-amber-50 px-5 py-3 rounded-2xl font-bold shadow-md hover:scale-102 transition-transform text-sm sm:text-base"
            >
              <BookOpen className="w-5 h-5 text-orange-500" />
              <span>Bắt đầu học</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Gia sư AI Chatbot */}
            <button
              onClick={() => onNavigate('chat')}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-5 py-3 rounded-2xl font-bold shadow-md hover:scale-102 transition-transform text-sm sm:text-base border border-amber-300"
            >
              <Bot className="w-5 h-5 text-amber-100" />
              <span>Gia sư AI 🦉 (Hỏi đáp & Luyện từ)</span>
            </button>

            {/* 2. Luyện giao tiếp */}
            <button
              onClick={() => onNavigate('speaking')}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold shadow-md hover:scale-102 transition-transform text-sm sm:text-base border border-emerald-400"
            >
              <Mic className="w-5 h-5" />
              <span>Luyện giao tiếp (Speaking Quest)</span>
            </button>

            {/* 3. Hoạt động của tôi (Trò chơi) */}
            <button
              onClick={() => onNavigate('play')}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-bold shadow-md hover:scale-102 transition-transform text-sm sm:text-base border border-orange-400"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Hoạt động của tôi</span>
            </button>

            {/* 4. Ôn tập nội dung cần cải thiện */}
            <button
              onClick={() => onNavigate('review')}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-2xl font-bold shadow-md hover:scale-102 transition-transform text-sm sm:text-base border border-rose-400"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Ôn tập nội dung cần cải thiện {weakWords.length > 0 && `(${weakWords.length})`}</span>
            </button>

            {/* 5. Khu vực giáo viên */}
            <button
              onClick={() => onNavigate('teacher')}
              className="flex items-center gap-2 bg-indigo-900 hover:bg-indigo-950 text-white px-5 py-3 rounded-2xl font-bold shadow-md hover:scale-102 transition-transform text-sm sm:text-base border border-indigo-700"
            >
              <GraduationCap className="w-5 h-5 text-amber-300" />
              <span>Khu vực giáo viên</span>
            </button>
          </div>
        </div>

        {/* Mascot decoration */}
        <div className="absolute right-3 bottom-1 sm:right-6 sm:bottom-4 w-32 h-32 sm:w-48 sm:h-48 select-none pointer-events-none drop-shadow-2xl transform hover:scale-105 transition-transform flex items-center justify-center">
          <img
            src="/assets/images/mascot.svg"
            alt="Mascot Thầy Cú AI"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-md"
          />
        </div>
      </section>

      {/* 3 Tiers of Personalized Learning */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
              3 Cấp độ cá nhân hóa phù hợp mọi học sinh Lớp 5B4
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">Phân hóa theo năng lực</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-emerald-200 text-emerald-900">
                1. Cơ bản (Basic)
              </span>
              <span className="text-xl">🌱</span>
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-sm">Học từ &amp; nhận diện</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nhìn tranh, nghe phát âm chuẩn, cấu trúc câu mẫu đầy đủ và gợi ý trực tiếp bằng tiếng Việt.
            </p>
          </div>

          <div className="p-4 rounded-2xl border-2 border-blue-200 bg-blue-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-blue-200 text-blue-900">
                2. Luyện tập (Practice)
              </span>
              <span className="text-xl">🌿</span>
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-sm">Trò chơi ghép thẻ &amp; đối thoại</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thực hành hỏi đáp tình huống thực tế, ẩn bớt gợi ý và ghép nối câu hoàn chỉnh trong ngữ cảnh.
            </p>
          </div>

          <div className="p-4 rounded-2xl border-2 border-purple-200 bg-purple-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-purple-200 text-purple-900">
                3. Thử thách (Challenge)
              </span>
              <span className="text-xl">🌳</span>
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-sm">Giao tiếp tự nhiên &amp; miêu tả</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thực hành nói tự do bằng Micro, miêu tả tranh sinh động và trả lời không cần gợi ý sẵn.
            </p>
          </div>
        </div>
      </section>

      {/* Speaking Quest Spotlight Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="space-y-3 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
            <Mic className="w-3.5 h-3.5" />
            <span>KHÔNG GIAN LUYỆN NÓI GIAO TIẾP DÀNH RIÊNG CHO LỚP 5B4</span>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-bold leading-snug">
            Speaking Quest – Tự tin đối thoại tiếng Anh không sợ sai
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Học sinh được trải nghiệm 4 tình huống gần gũi: Giới thiệu bản thân tại Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị, kể về gia đình,
            mua đồ ăn tại căng tin và miêu tả tranh lớp học. Hỗ trợ tự đánh giá sự tự tin trước và sau khi nói!
          </p>

          <div className="flex flex-wrap gap-2 text-xs font-semibold text-emerald-950">
            {SPEAKING_SCENARIOS.map((sc) => (
              <span key={sc.id} className="bg-white/90 px-2.5 py-1 rounded-xl shadow-xs">
                {sc.emoji} {sc.titleVi}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 z-10 shrink-0">
          <img
            src="/assets/images/activity-speaking.svg"
            alt="Speaking Illustration"
            referrerPolicy="no-referrer"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-md hidden sm:block"
          />
          <button
            onClick={() => onNavigate('speaking')}
            className="flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-lg shrink-0 hover:scale-105 transition-transform"
          >
            <span>Khám phá bài nói</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* AI Tutor Chatbot Spotlight Section */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="space-y-3 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
            <Bot className="w-3.5 h-3.5" />
            <span>GIA SƯ AI THẦY CÚ THÔNG THÁI (GEMINI 3.8 FLASH)</span>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-bold leading-snug">
            Bạn đồng hành giải đáp từ vựng &amp; sửa câu 24/7
          </h3>

          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Học sinh có thể thoải mái hỏi nghĩa từ mới, nghe phát âm chuẩn bằng giọng đọc tự nhiên,
            nhờ thầy gợi ý câu mẫu, hoặc sửa các câu tiếng Anh còn bỡ ngỡ với phản hồi tích cực và thân thiện.
          </p>

          <div className="flex flex-wrap gap-2 text-xs font-semibold text-amber-950">
            <span className="bg-white/90 px-2.5 py-1 rounded-xl shadow-xs">
              💬 Trò chuyện đa lượt
            </span>
            <span className="bg-white/90 px-2.5 py-1 rounded-xl shadow-xs">
              🔊 Nghe phát âm chuẩn
            </span>
            <span className="bg-white/90 px-2.5 py-1 rounded-xl shadow-xs">
              🎙️ Hỗ trợ giọng nói
            </span>
            <span className="bg-white/90 px-2.5 py-1 rounded-xl shadow-xs">
              🌟 Phản hồi động viên
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 z-10 shrink-0">
          <img
            src="/assets/images/mascot.svg"
            alt="Mascot Owl"
            referrerPolicy="no-referrer"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-md hidden sm:block"
          />
          <button
            onClick={() => onNavigate('chat')}
            className="flex items-center gap-2 bg-white text-orange-600 hover:bg-amber-50 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-lg shrink-0 hover:scale-105 transition-transform"
          >
            <span>Trò chuyện ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Current Session Summary Bar */}
      <section className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center p-2">
            <img
              src="/assets/images/award-trophy.svg"
              alt="Trophy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-800 text-lg">
              Phiên học hiện tại (Lớp {currentGrade})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Tiến độ được lưu an toàn trên trình duyệt, không chia sẻ thông tin cá nhân
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          <div className="text-center px-3 py-1 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Số câu đã làm</span>
            <span className="font-heading text-lg font-bold text-slate-900">{sessionQuestions}</span>
          </div>

          <div className="text-center px-3 py-1 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="text-xs text-emerald-700 font-medium block">Trả lời đúng</span>
            <span className="font-heading text-lg font-bold text-emerald-700">{sessionCorrect}</span>
          </div>

          <div className="text-center px-3 py-1 bg-amber-50 rounded-xl border border-amber-100">
            <span className="text-xs text-amber-700 font-medium block">Tỷ lệ đúng</span>
            <span className="font-heading text-lg font-bold text-amber-700">
              {sessionQuestions > 0 ? `${Math.round((sessionCorrect / sessionQuestions) * 100)}%` : '0%'}
            </span>
          </div>

          <div className="text-center px-3 py-1 bg-rose-50 rounded-xl border border-rose-100">
            <span className="text-xs text-rose-700 font-medium block">Từ cần ôn</span>
            <span className="font-heading text-lg font-bold text-rose-700">{weakWords.length}</span>
          </div>
        </div>
      </section>

      {/* Topic Selection Grid */}
      {/* Topic Selection Grid with Book 1 & Book 2 Filter */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Chủ đề Tiếng Anh 5 Global Success
            </h3>
            <p className="text-sm text-slate-600">
              Toàn bộ 20 Units chuẩn theo 2 tập sách SGK Tiếng Anh 5 của Bộ GD&amp;ĐT
            </p>
          </div>

          {/* Book 1 & Book 2 Toggle Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto">
            <button
              onClick={() => setBookFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                bookFilter === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả (20 Units)
            </button>
            <button
              onClick={() => setBookFilter(1)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                bookFilter === 1
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📘 Tập 1 (Units 1–10)
            </button>
            <button
              onClick={() => setBookFilter(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                bookFilter === 2
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📙 Tập 2 (Units 11–20)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {displayTopics.map((topic) => {
            const countInTopic = gradeWords.filter((w) => w.topic === topic.id).length;
            const masteredInTopic = gradeWords.filter(
              (w) => w.topic === topic.id && progressMap[w.id]?.status === 'practised_successfully'
            ).length;

            return (
              <div
                key={topic.id}
                className="group relative bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-amber-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {topic.imageUrl ? (
                      <div className="w-12 h-12 p-1.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <img
                          src={topic.imageUrl}
                          alt={topic.nameEn}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.topic-emoji-fallback');
                            if (fallback) (fallback as HTMLElement).style.display = 'block';
                          }}
                        />
                        <span className="topic-emoji-fallback hidden text-3xl">{topic.emoji}</span>
                      </div>
                    ) : (
                      <span className="text-4xl transform group-hover:scale-110 transition-transform">
                        {topic.emoji}
                      </span>
                    )}
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      {countInTopic} từ
                    </span>
                  </div>

                  <h4 className="font-heading text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {topic.nameEn}
                  </h4>
                  <p className="text-xs font-semibold text-amber-700 mt-0.5">
                    {topic.nameVi}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {topic.descriptionVi}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Thuộc: <strong className="text-emerald-600 font-bold">{masteredInTopic}/{countInTopic}</strong>
                  </span>
                  <button
                    onClick={() => {
                      onSelectTopic(topic.id);
                      onNavigate('learn');
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:text-amber-700 hover:underline"
                  >
                    <span>Học ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pedagogical Safety & Research Ethics Note */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900 block mb-0.5">
            Nguyên tắc đạo đức nghiên cứu &amp; an toàn sư phạm:
          </span>
          <p className="text-amber-800 leading-relaxed">
            Ứng dụng tôn trọng quyền riêng tư tuyệt đối của học sinh lớp 5B4: Không thu thập họ tên đầy đủ,
            ngày sinh, hay số điện thoại; dữ liệu phát âm chỉ xử lý trực tiếp trên trình duyệt (không lưu bản ghi âm).
            AI đóng vai trò trợ lý hỗ trợ giáo viên thiết kế hoạt động, không thay thế vai trò chủ đạo của thầy cô.
          </p>
        </div>
      </section>
    </div>
  );
};
