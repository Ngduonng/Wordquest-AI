import React, { useState, useRef, useEffect } from 'react';
import { GradeLevel } from '../types/index.ts';
import { speakEnglish } from '../services/audio.ts';
import {
  Send,
  Sparkles,
  Volume2,
  RotateCcw,
  Bot,
  User,
  Mic,
  MicOff,
  Copy,
  Check,
  ShieldCheck,
  Lightbulb,
  BookOpen,
  MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

interface ChatbotViewProps {
  currentGrade: GradeLevel;
  onNavigateHome?: () => void;
  onNavigateToTopic?: (topicId: string) => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  currentGrade,
  onNavigateHome,
  onNavigateToTopic
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      text: `🦉 **Chào em! Thầy Cú Thông Thái đây!**\n\nThầy rất vui được đồng hành cùng các em học sinh Lớp 5 (đặc biệt là các bạn nhỏ Lớp 5A4, Trường TH Hữu Nghị – Hòa Bình – Phú Thọ) chinh phục toàn bộ 20 Units trong **SGK Tiếng Anh 5 Global Success (Tập 1 & Tập 2)**!\n\nEm có thể hỏi thầy:\n✨ **Giải thích từ vựng & phát âm chuẩn IPA** trong 20 Units sách giáo khoa.\n🗣️ **Luyện tập đối thoại** theo các tình huống giao tiếp lớp 5.\n📝 **Nhờ thầy sửa câu & hướng dẫn ngữ pháp** ngắn gọn, dễ nhớ.\n🌸 **Ôn tập các chủ đề**: Bản thân (Unit 1), Nghề nghiệp (Unit 5), Ngày Tết (Unit 12), Sức khỏe (Unit 15)...\n\nHôm nay em muốn luyện tập Unit nào cùng Thầy Cú?`,
      timestamp: Date.now()
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const suggestedPrompts = [
    '🦉 Chào Thầy Cú, hướng dẫn em học từ vựng Unit 1 All about me!',
    '🏡 Dạy em cách hỏi địa chỉ "What\'s your address?" (Unit 2 Our homes)',
    '👩‍🚒 Từ vựng về nghề nghiệp ước mơ "firefighter", "reporter" (Unit 5)',
    '🌸 Hỏi về dự định đón Tết "Will you make banh chung for Tet?" (Unit 12)',
    '🩺 Cho lời khuyên sức khỏe "You should go to the dentist" (Unit 15)',
    '📝 Sửa câu giúp em: "I likes playing table tennis with my classmate"'
  ];

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Speech-to-Text Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt của em chưa hỗ trợ nhận diện giọng nói. Em có thể gõ phím vào ô nhập bên dưới nhé!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: messageContent,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const historyPayload = messages.slice(-10).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          history: historyPayload
        })
      });

      const data = await res.json();
      const reply = data.reply || '🦉 Thầy Cú đã nhận được tin nhắn! Em hãy tiếp tục đặt câu hỏi nhé!';

      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        text: reply,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMessage: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        role: 'assistant',
        text: `🦉 Thầy Cú đây! Em đã hỏi: "${messageContent}". Hãy nhớ ôn luyện từ vựng mỗi ngày và không ngần ngại đặt câu hỏi nhé!`,
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        text: `🦉 **Đoạn chat mới đã sẵn sàng!**\n\nThầy Cú đang lắng nghe đây. Em muốn hỏi từ vựng gì hoặc luyện giao tiếp về chủ đề nào hôm nay?`,
        timestamp: Date.now()
      }
    ]);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakText = async (id: string, text: string) => {
    setSpeakingId(id);
    // Extract English text or speak the first clean English segment
    const cleanText = text
      .replace(/[#*`_]/g, '')
      .replace(/🦉|⭐|🌟|👏|🌈|💡|🎒|🦁|🐘|🐒|🏫|👉|❌|✅/g, '')
      .trim();

    await speakEnglish(cleanText, 0.9);
    setSpeakingId(null);
  };

  // Helper to format bot markdown text with nice styling
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Check for bullet line
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('👉');
      
      // Basic bold formatting parsing: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);

      return (
        <div key={idx} className={`${line.trim() === '' ? 'h-2' : ''} ${isBullet ? 'pl-2 my-0.5' : 'my-0.5'}`}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-amber-950">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center p-1.5 shadow-inner border border-white/30 shrink-0">
              <img
                src="/assets/images/mascot.svg"
                alt="Thầy Cú AI"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight">
                  Gia sư AI · Thầy Cú Thông Thái
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white">
                  <Sparkles className="w-3 h-3 text-yellow-200" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 font-medium">
                Trợ lý luyện từ vựng &amp; giao tiếp thân thiện · Lớp {currentGrade} (Đề tài Lớp 5A4 – TH Hữu Nghị)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-all backdrop-blur-xs"
              title="Làm mới đoạn hội thoại"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions Chips */}
      <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 border border-amber-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2 px-1">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Gợi ý câu hỏi nhanh cho học sinh:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/70 text-xs text-amber-900 font-medium transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Messages Box */}
      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-sm p-4 sm:p-6 min-h-[460px] max-h-[560px] flex flex-col justify-between overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
          {messages.map((message) => {
            const isBot = message.role === 'assistant';
            return (
              <div
                key={message.id}
                className={`flex items-start gap-2.5 sm:gap-3 ${
                  isBot ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Bot Avatar */}
                {isBot && (
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center p-1 shrink-0 shadow-xs">
                    <img
                      src="/assets/images/mascot.svg"
                      alt="Thầy Cú"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative group max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed ${
                    isBot
                      ? 'bg-amber-50/70 text-slate-800 border border-amber-200/80 rounded-tl-xs'
                      : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xs rounded-tr-xs'
                  }`}
                >
                  {/* Sender Name */}
                  <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-black/5 text-[11px] font-semibold opacity-75">
                    <span>{isBot ? 'Thầy Cú Thông Thái' : `Học sinh Lớp ${currentGrade}`}</span>
                    <span className="text-[10px] font-normal">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="whitespace-pre-wrap">
                    {isBot ? renderFormattedText(message.text) : message.text}
                  </div>

                  {/* Action Buttons for Bot Messages */}
                  {isBot && (
                    <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakText(message.id, message.text)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          speakingId === message.id
                            ? 'bg-amber-200 text-amber-900 animate-pulse'
                            : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                        title="Nghe Thầy Cú đọc phát âm"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>{speakingId === message.id ? 'Đang đọc...' : 'Nghe đọc 🔊'}</span>
                      </button>

                      <button
                        onClick={() => handleCopyMessage(message.id, message.text)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-white/80 transition-all"
                        title="Sao chép nội dung"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-medium">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {!isBot && (
                  <div className="w-9 h-9 rounded-2xl bg-amber-500 border border-amber-600 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-xs">
                    🎒
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2.5 sm:gap-3 justify-start">
              <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shrink-0">
                🦉
              </div>
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl rounded-tl-xs p-3.5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-amber-800 font-medium ml-1">
                  Thầy Cú đang chuẩn bị câu trả lời...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Box */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 sm:p-3 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md'
                  : 'bg-slate-100 hover:bg-amber-100 text-slate-700 border-slate-200'
              }`}
              title={isListening ? 'Đang lắng nghe... Bấm để dừng' : 'Bấm để nói bằng giọng nói'}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-amber-600" />
              )}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhắn tin cho Thầy Cú (Hỏi từ vựng, đặt câu, hoặc dịch câu)..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 outline-hidden text-sm text-slate-800 transition-all disabled:opacity-60"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-sm shadow-sm shadow-orange-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>

          {/* Privacy & Safety Note */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Không thu thập thông tin cá nhân · An toàn tuyệt đối cho học sinh tiểu học
            </span>
            <span className="hidden sm:inline font-medium text-slate-500">
              Mô hình: Gemini 3.8 Flash
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
