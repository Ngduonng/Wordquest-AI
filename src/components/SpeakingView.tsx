import React, { useState, useEffect } from 'react';
import { GradeLevel, SpeakingScenario, DialogueTurn, ConfidenceScale, ConfidenceRecord } from '../types/index.ts';
import { SPEAKING_SCENARIOS } from '../data/speakingScenarios.ts';
import { speakEnglish, playSuccessChime, playGentleTryAgainSound } from '../services/audio.ts';
import { saveConfidenceRecord } from '../services/storage.ts';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  Star,
  Award,
  AlertCircle
} from 'lucide-react';

interface SpeakingViewProps {
  currentGrade: GradeLevel;
  onNavigateHome: () => void;
  onAddSessionStars: (stars: number) => void;
}

export const SpeakingView: React.FC<SpeakingViewProps> = ({
  currentGrade,
  onNavigateHome,
  onAddSessionStars
}) => {
  const [selectedScenario, setSelectedScenario] = useState<SpeakingScenario | null>(null);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);

  // Confidence assessment states
  const [preConfidence, setPreConfidence] = useState<ConfidenceScale | null>(null);
  const [postConfidence, setPostConfidence] = useState<ConfidenceScale | null>(null);
  const [stage, setStage] = useState<'pre_assessment' | 'practicing' | 'post_assessment' | 'completed'>('practicing');

  // Turn practice states
  const [showHints, setShowHints] = useState(true);
  const [studentInput, setStudentInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [turnEvaluated, setTurnEvaluated] = useState(false);
  const [turnPassed, setTurnPassed] = useState(false);
  const [feedbackVi, setFeedbackVi] = useState('');

  // Speech Recognition instance
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setStudentInput(transcript);
          setIsListening(false);
        };

        recog.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e.error);
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      } else {
        setSpeechSupported(false);
      }
    }
  }, []);

  const handleStartScenario = (scenario: SpeakingScenario) => {
    setSelectedScenario(scenario);
    setCurrentTurnIndex(0);
    setPreConfidence(null);
    setPostConfidence(null);
    setStage('pre_assessment');
    setShowHints(true);
    setStudentInput('');
    setTurnEvaluated(false);
  };

  const handleStartPracticing = (rating: ConfidenceScale) => {
    setPreConfidence(rating);
    setStage('practicing');
    // Speak first prompt automatically
    if (selectedScenario) {
      speakEnglish(selectedScenario.turns[0].partnerPrompt);
    }
  };

  const handleToggleMic = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setStudentInput('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Mic start err:', err);
      }
    }
  };

  const currentTurn: DialogueTurn | undefined = selectedScenario?.turns[currentTurnIndex];

  const handleCheckResponse = () => {
    if (!currentTurn || !studentInput.trim()) return;

    const lowerInput = studentInput.toLowerCase();
    // Check if input contains at least 1-2 target keywords or matches suggested response closely
    const matchedKeywords = currentTurn.targetKeywords.filter((kw) =>
      lowerInput.includes(kw.toLowerCase())
    );

    const isGood = matchedKeywords.length >= 1 || lowerInput.length > 8;

    setTurnEvaluated(true);
    setTurnPassed(isGood);

    if (isGood) {
      playSuccessChime();
      setFeedbackVi(
        'Rất tốt! Em đã phát âm rõ ràng và diễn đạt đúng ý trong tình huống. Tiếp tục phát huy nhé!'
      );
    } else {
      playGentleTryAgainSound();
      setFeedbackVi(
        `Em làm tốt lắm! Hãy thử sử dụng các từ gợi ý: "${currentTurn.targetKeywords.join(', ')}" để câu nói tự nhiên hơn nhé.`
      );
    }
  };

  const handleNextTurn = () => {
    if (!selectedScenario) return;
    if (currentTurnIndex + 1 < selectedScenario.turns.length) {
      const nextIdx = currentTurnIndex + 1;
      setCurrentTurnIndex(nextIdx);
      setStudentInput('');
      setTurnEvaluated(false);
      setTurnPassed(false);
      setFeedbackVi('');
      speakEnglish(selectedScenario.turns[nextIdx].partnerPrompt);
    } else {
      // Completed all turns!
      setStage('post_assessment');
    }
  };

  const handleFinishScenario = (afterRating: ConfidenceScale) => {
    setPostConfidence(afterRating);
    setStage('completed');
    onAddSessionStars(3);

    // Save confidence assessment record to storage
    if (selectedScenario && preConfidence) {
      const record: ConfidenceRecord = {
        id: `conf_${Date.now()}`,
        activityId: selectedScenario.id,
        activityTitle: selectedScenario.titleVi,
        activityType: 'speaking',
        beforeRating: preConfidence,
        afterRating,
        timestamp: Date.now(),
        studentCode: 'HS-5B4'
      };
      saveConfidenceRecord(record);
    }
  };

  // Confidence label mapping
  const confidenceLabels: Record<ConfidenceScale, { label: string; emoji: string; color: string }> = {
    1: { label: 'Em chưa tự tin', emoji: '🔴', color: 'bg-rose-50 border-rose-200 text-rose-800' },
    2: { label: 'Em cần nhiều gợi ý', emoji: '🟡', color: 'bg-amber-50 border-amber-200 text-amber-800' },
    3: { label: 'Em có thể nói với ít gợi ý', emoji: '🟢', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    4: { label: 'Em rất tự tin giao tiếp!', emoji: '🌟', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Speaking Quest Hub Selector */}
      {!selectedScenario ? (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🗣️</span>
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                  Speaking Quest – Luyện giao tiếp tiếng Anh Lớp 5B4
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị – Thực hành đối đáp hội thoại, tăng phản xạ và bồi dưỡng sự tự tin
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Môi trường luyện nói an toàn:</strong> Không chấm điểm phạt lỗi; hỗ trợ cả
                giọng nói (Microphone) và chọn câu mẫu linh hoạt; học sinh tự đánh giá sự tự tin trước và sau mỗi hoạt động.
              </span>
            </div>
          </div>

          {/* Scenarios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {SPEAKING_SCENARIOS.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-4xl">{scenario.emoji}</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                        scenario.level === 'basic'
                          ? 'bg-emerald-100 text-emerald-800'
                          : scenario.level === 'practice'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {scenario.level === 'basic' ? 'Cơ bản' : scenario.level === 'practice' ? 'Luyện tập' : 'Thử thách'}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-slate-900 mt-3">
                    {scenario.titleVi}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{scenario.title}</p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {scenario.situationVi}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-amber-800 font-medium">
                    🎯 {scenario.learningObjective}
                  </div>
                </div>

                <button
                  onClick={() => handleStartScenario(scenario)}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-2xl font-bold text-sm shadow-md shadow-amber-500/20 active:scale-98 transition-transform"
                >
                  <span>Bắt đầu đối thoại ({scenario.turns.length} lượt)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : stage === 'pre_assessment' ? (
        // PRE-ACTIVITY CONFIDENCE SELF-ASSESSMENT
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl space-y-6 text-center animate-scaleUp">
          <span className="text-5xl block">{selectedScenario.emoji}</span>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Bước 1: Tự đánh giá trước khi luyện nói
            </span>
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              {selectedScenario.titleVi}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Em cảm thấy mức độ tự tin của mình khi nói về chủ đề này như thế nào?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
            {([1, 2, 3, 4] as ConfidenceScale[]).map((rating) => {
              const conf = confidenceLabels[rating];
              return (
                <button
                  key={rating}
                  onClick={() => handleStartPracticing(rating)}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all flex items-center gap-3 font-semibold text-xs sm:text-sm text-slate-800"
                >
                  <span className="text-2xl">{conf.emoji}</span>
                  <span>{conf.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setSelectedScenario(null)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
          >
            Quay lại danh sách chủ đề
          </button>
        </div>
      ) : stage === 'practicing' && currentTurn ? (
        // ACTIVE DIALOGUE PRACTICE
        <div className="space-y-5">
          {/* Top Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-xs flex items-center justify-between">
            <button
              onClick={() => setSelectedScenario(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dừng luyện nói</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">
                Lượt đối đáp:{' '}
                <strong className="text-amber-600">
                  {currentTurnIndex + 1} / {selectedScenario.turns.length}
                </strong>
              </span>
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                {showHints ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showHints ? 'Ẩn gợi ý' : 'Hiện gợi ý'}</span>
              </button>
            </div>
          </div>

          {/* Partner Speech Balloon */}
          <div className="bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👩‍🏫</span>
                <span className="font-heading font-bold text-sm text-blue-900">
                  {currentTurn.promptSpeaker}
                </span>
              </div>
              <button
                onClick={() => speakEnglish(currentTurn.partnerPrompt)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                title="Nghe giọng đọc"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe cô nói</span>
              </button>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              "{currentTurn.partnerPrompt}"
            </p>
            <p className="text-xs sm:text-sm text-slate-500 italic">{currentTurn.partnerPromptVi}</p>
          </div>

          {/* Hints Section (Toggleable for student confidence) */}
          {showHints && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Cấu trúc câu & Gợi ý nói:</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 font-mono text-slate-800 text-[11px] sm:text-xs">
                {currentTurn.grammarFrame}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentTurn.hintsVi.map((hint, hIdx) => (
                  <span
                    key={hIdx}
                    className="px-2 py-0.5 rounded-lg bg-white border border-amber-200 text-slate-700 text-[11px]"
                  >
                    💡 {hint}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Student Response Area */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-slate-800 text-sm">
                Lượt của em (Học sinh 5B4):
              </span>
              <span className="text-[11px] text-slate-400">
                {speechSupported ? 'Nói vào Micro hoặc chọn câu bên dưới' : 'Chọn câu trả lời mẫu'}
              </span>
            </div>

            {/* Input field with voice recognition trigger */}
            <div className="relative">
              <textarea
                rows={2}
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                placeholder="Nhấn micro để nói tiếng Anh hoặc nhập câu trả lời của em..."
                className="w-full p-3.5 pr-14 rounded-2xl border border-slate-300 bg-slate-50/50 text-sm sm:text-base text-slate-900 focus:outline-amber-500"
              />

              {speechSupported && (
                <button
                  onClick={handleToggleMic}
                  className={`absolute right-3 top-3 p-2.5 rounded-xl transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse shadow-md'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                  title={isListening ? 'Đang lắng nghe... bấm để dừng' : 'Bấm để nói'}
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Quick Option Buttons for easy tap-to-answer */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Hoặc chọn câu trả lời phù hợp để luyện đọc to:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {currentTurn.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => {
                      setStudentInput(opt);
                      speakEnglish(opt);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                      studentInput === opt
                        ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                        : 'bg-slate-50 border-slate-200 hover:bg-amber-50 text-slate-700'
                    }`}
                  >
                    💬 {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Evaluation and Next buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              {studentInput && (
                <button
                  onClick={() => speakEnglish(studentInput)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>Nghe lại phát âm của câu này</span>
                </button>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {!turnEvaluated ? (
                  <button
                    onClick={handleCheckResponse}
                    disabled={!studentInput.trim()}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-2xl font-bold text-sm bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white shadow-sm"
                  >
                    Kiểm tra câu trả lời
                  </button>
                ) : (
                  <button
                    onClick={handleNextTurn}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  >
                    <span>Lượt tiếp theo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Feedback box */}
            {turnEvaluated && (
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed animate-fadeIn ${
                  turnPassed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{turnPassed ? 'Phản hồi khích lệ: Tuyệt vời!' : 'Gợi ý cải thiện nhẹ nhàng:'}</span>
                </div>
                <p>{feedbackVi}</p>
              </div>
            )}
          </div>
        </div>
      ) : stage === 'post_assessment' ? (
        // POST-ACTIVITY CONFIDENCE SELF-ASSESSMENT
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl space-y-6 text-center animate-scaleUp">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 flex items-center justify-center text-4xl">
            🌟
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Bước cuối: Tự đánh giá sau khi hoàn thành
            </span>
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              Em cảm thấy sự tự tin của mình bây giờ thế nào?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Hãy chọn mức độ phản ánh đúng cảm nhận của em sau khi hoàn thành bài nói:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
            {([1, 2, 3, 4] as ConfidenceScale[]).map((rating) => {
              const conf = confidenceLabels[rating];
              return (
                <button
                  key={rating}
                  onClick={() => handleFinishScenario(rating)}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all flex items-center gap-3 font-semibold text-xs sm:text-sm text-slate-800"
                >
                  <span className="text-2xl">{conf.emoji}</span>
                  <span>{conf.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // COMPLETED SUMMARY & GROWTH CELEBRATION
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-2xl space-y-6 text-center animate-scaleUp">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-5xl">
            🏆
          </div>

          <div className="space-y-1">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Chúc mừng em đã hoàn thành Speaking Quest!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Chủ đề: {selectedScenario?.titleVi} · Lớp 5B4, Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị
            </p>
          </div>

          {/* Confidence Growth Card */}
          {preConfidence && postConfidence && (
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 max-w-md mx-auto space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Sự tiến bộ về độ tự tin của em:
              </span>
              <div className="flex items-center justify-center gap-4 text-xs sm:text-sm font-bold">
                <div className="p-2.5 rounded-xl bg-white border border-amber-200">
                  <span className="text-slate-400 block text-[10px]">Trước khi nói:</span>
                  <span>{confidenceLabels[preConfidence].emoji} {confidenceLabels[preConfidence].label}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-500" />
                <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900">
                  <span className="text-emerald-700 block text-[10px]">Sau khi luyện tập:</span>
                  <span>{confidenceLabels[postConfidence].emoji} {confidenceLabels[postConfidence].label}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => setSelectedScenario(null)}
              className="px-6 py-3 rounded-2xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20"
            >
              Chọn chủ đề giao tiếp khác
            </button>
            <button
              onClick={onNavigateHome}
              className="px-6 py-3 rounded-2xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
