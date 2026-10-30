import React, { useState, useEffect } from 'react';
import { GradeLevel, TopicId, VocabularyWord, WordProgress } from '../types/index.ts';
import { TOPICS, INITIAL_VOCABULARY } from '../data/vocabulary.ts';
import CURRICULUM from '../data/curriculum.json';
import { speakEnglish, isSpeechSupported } from '../services/audio.ts';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCw,
  Sparkles,
  Layers,
  LayoutGrid,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface LearnViewProps {
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  selectedTopic: TopicId;
  onSelectTopic: (topicId: TopicId) => void;
  progressMap: Record<string, WordProgress>;
  onToggleFlag: (word: VocabularyWord) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  currentGrade,
  onSelectGrade,
  selectedTopic,
  onSelectTopic,
  progressMap,
  onToggleFlag
}) => {
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');
  const [bookFilter, setBookFilter] = useState<'all' | 1 | 2>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechAlert, setSpeechAlert] = useState<string | null>(null);

  // Topics filtered by selected book
  const displayTopics = TOPICS.filter((t) => bookFilter === 'all' || t.book === bookFilter);

  // Filter words by grade (5), selected book, and topic
  const filteredWords = INITIAL_VOCABULARY.filter((w) => {
    const matchGrade = w.grade === currentGrade;
    const topicMeta = TOPICS.find((t) => t.id === w.topic);
    const matchBook = bookFilter === 'all' || topicMeta?.book === bookFilter;
    const matchTopic = selectedTopic === 'all' || w.topic === selectedTopic;
    return matchGrade && matchBook && matchTopic;
  });

  // Ensure currentIndex stays within bounds when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [currentGrade, selectedTopic, bookFilter]);

  const currentWord: VocabularyWord | undefined = filteredWords[currentIndex];
  const selectedLesson = CURRICULUM.find((lesson) => lesson.topic === selectedTopic);
  const currentProgress = currentWord ? progressMap[currentWord.id] : undefined;
  const isFlagged = currentProgress?.manualFlagged || currentProgress?.status === 'needs_review';

  const handleSpeak = async (text: string) => {
    if (!isSpeechSupported()) {
      setSpeechAlert('Trình duyệt của bạn chưa hỗ trợ Web Speech API. Bạn vẫn có thể xem phiên âm và câu ví dụ.');
      setTimeout(() => setSpeechAlert(null), 4000);
      return;
    }
    setIsSpeaking(true);
    await speakEnglish(text);
    setIsSpeaking(false);
  };

  const handleNext = () => {
    if (filteredWords.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrev = () => {
    if (filteredWords.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'flashcard') return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, filteredWords.length]);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Filter & Topic Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-amber-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <span>Học từ vựng qua hình ảnh</span>
              <span className="text-xl">🌟</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Chạm vào thẻ để lật xem nghĩa, nhấn loa để nghe phát âm chuẩn
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
            <button
              onClick={() => setViewMode('flashcard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'flashcard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Thẻ học (Flashcard)</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-500" />
              <span>Xem danh sách</span>
            </button>
          </div>
        </div>

        {/* Book 1 & Book 2 Filter Tabs */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
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

        {/* Topics selection pills */}
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

      {selectedLesson && (
        <section className="bg-gradient-to-br from-amber-50 to-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs space-y-5" aria-labelledby="lesson-guide-title">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
              {selectedLesson.book === 1 ? '📘 Tập một' : '📙 Tập hai'} · Unit {selectedLesson.unit}
            </p>
            <h2 id="lesson-guide-title" className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {selectedLesson.title}: Hôm nay em sẽ học gì?
            </h2>
            <p className="text-sm text-slate-600 mt-1">{selectedLesson.focus}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {selectedLesson.patterns.map((pattern, index) => (
              <article key={`${selectedLesson.topic}-pattern-${index}`} className="rounded-2xl bg-white border border-amber-100 p-4">
                <p className="text-xs font-bold text-amber-700">MẪU CÂU · {index + 1}</p>
                <p className="font-semibold text-slate-900 mt-2">{pattern.form}</p>
                <p className="text-xs text-slate-500 mt-2">{pattern.use}</p>
                <p className="text-sm text-sky-800 mt-3">{pattern.example}</p>
                <p className="text-xs text-slate-600 mt-1">{pattern.translation}</p>
              </article>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Từ và cụm từ trọng tâm</h3>
            <div className="flex flex-wrap gap-2">
              {selectedLesson.vocabulary.map((item) => (
                <span key={item} className="rounded-full bg-white border border-amber-100 px-3 py-1.5 text-xs font-medium text-slate-700">{item}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {speechAlert && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
          {speechAlert}
        </div>
      )}

      {/* FLASHCARD MODE */}
      {viewMode === 'flashcard' && (
        <div className="space-y-4">
          {filteredWords.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <span className="text-5xl block mb-3">🔍</span>
              <h3 className="font-heading text-lg font-bold text-slate-800">
                Chưa có từ vựng cho lựa chọn này
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Hãy chọn chủ đề khác hoặc chuyển đổi khối lớp ở góc trên.
              </p>
            </div>
          ) : (
            <>
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-2">
                <span>
                  Từ {currentIndex + 1} / {filteredWords.length}
                </span>
                <span className="text-amber-700">
                  {currentWord?.categoryNameVi} · Lớp {currentGrade}
                </span>
              </div>

              {/* The Interactive Flippable Card */}
              <div className="relative perspective-1000 min-h-[380px] sm:min-h-[420px]">
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`w-full h-full min-h-[380px] sm:min-h-[420px] rounded-3xl p-6 sm:p-10 cursor-pointer transition-all duration-300 transform border-2 flex flex-col justify-between select-none ${
                    isFlipped
                      ? 'bg-amber-50/70 border-amber-400 shadow-md'
                      : 'bg-white border-amber-200 hover:border-amber-300 shadow-lg'
                  }`}
                >
                  {/* Top card bar: status tag & flip hint */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                      {isFlipped ? 'Nghĩa & Ví dụ' : 'Mặt trước (Từ & Phát âm)'}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentWord) onToggleFlag(currentWord);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        isFlagged
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title="Đánh dấu từ cần ôn tập thêm"
                    >
                      <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{isFlagged ? 'Đang cần ôn lại' : 'Đánh dấu ôn lại'}</span>
                    </button>
                  </div>

                  {/* Card Content (Front vs Back) */}
                  {!isFlipped ? (
                    // FRONT: Big illustration, English Word, Phonetic, Audio button
                    <div className="text-center my-6 space-y-4">
                      <div className="flex justify-center items-center h-28 sm:h-36">
                        {currentWord?.imageUrl ? (
                          <>
                            <img
                              src={currentWord.imageUrl}
                              alt={currentWord.word}
                              referrerPolicy="no-referrer"
                              className="w-28 h-28 sm:w-36 sm:h-36 object-contain transform hover:scale-105 transition-transform drop-shadow-md"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                                const fallback = e.currentTarget.parentElement?.querySelector('.emoji-fallback');
                                if (fallback) (fallback as HTMLElement).style.display = 'block';
                              }}
                            />
                            <span className="emoji-fallback hidden text-7xl sm:text-8xl">
                              {currentWord.emoji}
                            </span>
                          </>
                        ) : (
                          <div className="text-7xl sm:text-8xl transform hover:scale-110 transition-transform inline-block">
                            {currentWord?.emoji}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                          {currentWord?.word}
                        </h2>
                        <p className="text-base sm:text-lg font-mono text-slate-500 font-semibold">
                          {currentWord?.phonetic || 'Từ trọng tâm SGK · nhấn loa để nghe'}
                        </p>
                      </div>

                      {/* Listen button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentWord) handleSpeak(currentWord.word);
                        }}
                        disabled={isSpeaking}
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white px-5 py-2.5 rounded-2xl font-bold shadow-md shadow-amber-500/20 text-sm transition-all"
                      >
                        <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                        <span>Nghe phát âm</span>
                      </button>
                    </div>
                  ) : (
                    // BACK: Vietnamese meaning, example sentence, friendly hint
                    <div className="my-4 space-y-5 text-left">
                      <div className="border-b border-amber-200/60 pb-3">
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                          Nghĩa tiếng Việt:
                        </span>
                        <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                          {currentWord?.vietnamese}
                        </h3>
                      </div>

                      {/* Example sentence */}
                      {currentWord?.exampleEn ? (
                        <div className="bg-white rounded-2xl p-4 border border-amber-200/80 space-y-1.5 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500">Câu ví dụ:</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (currentWord) handleSpeak(currentWord.exampleEn);
                              }}
                              className="p-1 text-amber-600 hover:text-amber-700 rounded-lg hover:bg-amber-50"
                              title="Nghe câu ví dụ"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-base sm:text-lg font-semibold text-slate-900">
                            {currentWord?.exampleEn}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600 italic">
                            {currentWord?.exampleVi}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600 bg-white rounded-2xl p-4 border border-amber-200/80">
                          Em hãy nghe từ này rồi thử đặt một câu của riêng mình nhé.
                        </p>
                      )}

                      {/* Memory Hint */}
                      <div className="text-xs text-amber-900 bg-amber-100/60 p-3 rounded-xl border border-amber-200/60">
                        <strong className="text-amber-800">💡 Gợi ý nhớ nhanh: </strong>
                        {currentWord?.hint}
                      </div>
                    </div>
                  )}

                  {/* Card bottom hint */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <RotateCw className="w-3.5 h-3.5 text-amber-500" />
                      <span>Nhấp thẻ để lật</span>
                    </span>
                    <span className="hidden sm:inline text-[11px]">
                      Phím mũi tên ⬅️ ➡️ để chuyển từ
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrev}
                  className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3 rounded-2xl font-bold text-sm shadow-xs transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-500" />
                  <span>Từ trước</span>
                </button>

                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-2xl font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-101"
                >
                  <span>Từ tiếp theo</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* GRID MODE */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredWords.map((word) => {
            const prog = progressMap[word.id];
            const flagged = prog?.manualFlagged || prog?.status === 'needs_review';

            return (
              <div
                key={word.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    {word.imageUrl ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={word.imageUrl}
                          alt={word.word}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-contain rounded-xl p-1 bg-amber-50/70 border border-amber-200"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.grid-emoji-fallback');
                            if (fallback) (fallback as HTMLElement).style.display = 'block';
                          }}
                        />
                        <span className="grid-emoji-fallback hidden text-3xl">{word.emoji}</span>
                      </div>
                    ) : (
                      <span className="text-4xl">{word.emoji}</span>
                    )}
                    <button
                      onClick={() => onToggleFlag(word)}
                      className={`p-1.5 rounded-lg text-xs ${
                        flagged ? 'text-rose-600 bg-rose-50' : 'text-slate-400 hover:bg-slate-100'
                      }`}
                      title={flagged ? 'Cần ôn lại' : 'Đánh dấu cần ôn'}
                    >
                      <Flag className={`w-4 h-4 ${flagged ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-heading text-xl font-bold text-slate-900">{word.word}</h3>
                    {word.phonetic ? (
                      <p className="text-xs font-mono text-slate-500">{word.phonetic}</p>
                    ) : (
                      <p className="text-[11px] font-semibold text-sky-700">Từ trọng tâm SGK</p>
                    )}
                    <p className="text-sm font-semibold text-amber-700 mt-1">{word.vietnamese}</p>
                    {word.exampleEn && (
                      <p className="text-xs text-slate-500 mt-2 italic line-clamp-2">"{word.exampleEn}"</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleSpeak(word.word)}
                    className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe</span>
                  </button>
                  <span className="text-[11px] text-slate-500 font-medium">Lớp {word.grade}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
