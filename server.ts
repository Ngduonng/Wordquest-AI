import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURRICULUM = JSON.parse(
  readFileSync(path.join(__dirname, 'src', 'data', 'curriculum.json'), 'utf8')
) as Array<{
  topic: string;
  book: number;
  unit: number;
  title: string;
  focus: string;
  patterns: Array<{ form: string; use: string; example: string; translation: string }>;
  vocabulary: string[];
}>;
const CURRICULUM_REFERENCE = CURRICULUM.map((lesson) =>
  `Unit ${lesson.unit} ${lesson.title}: ${lesson.focus}\n${lesson.patterns.map((pattern) => `- ${pattern.form} (${pattern.use}) Example: ${pattern.example} — ${pattern.translation}`).join('\n')}\nKey words: ${lesson.vocabulary.join('; ')}`
).join('\n\n');

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

/**
 * Health check endpoint
 */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: Date.now()
  });
});

/**
 * Gemini Chatbot endpoint for elementary students (Class 5B4, Song Da Primary School - Huu Nghi Campus)
 * Model: gemini-3.8-flash
 */
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Tin nhắn không hợp lệ' });
  }

  // Pedagogical Rule-based Fallback when Gemini API is offline or key missing
  const getFallbackReply = (userMsg: string): string => {
    const text = userMsg.toLowerCase();
    if (text.includes('chào') || text.includes('hello') || text.includes('hi')) {
      return '🦉 Hello em! Thầy Cú rất vui được gặp em! Hôm nay em muốn cùng thầy chinh phục Unit nào trong SGK Tiếng Anh 5 Global Success (Tập 1 & Tập 2) nè?';
    }
    if (text.includes('classmate') || text.includes('5b4') || text.includes('lớp')) {
      return '🏫 "Classmate" /ˈklɑːsmeɪt/ nghĩa là "bạn cùng lớp".\n\nVí dụ câu rất hay cho lớp 5B4 của chúng mình nè:\n👉 "My classmates in 5B4 are friendly and kind." (Các bạn cùng lớp 5B4 của em rất thân thiện và tốt bụng).\n\nEm hãy thử đọc to câu này nhé!';
    }
    if (text.includes('sửa') || text.includes('i likes') || text.includes('ngữ pháp')) {
      return '🌟 Khen ngợi em đã rất chăm chỉ đặt câu! Thầy Cú phát hiện một điểm nhỏ cần chỉnh nè:\n\n❌ Câu cũ: "I likes playing table tennis."\n✅ Câu chuẩn: "I like playing table tennis." (Unit 1)\n\n💡 Mẹo nhớ: Với chủ ngữ "I" (tôi), động từ "like" giữ nguyên thể, không thêm "s" em nhé!';
    }
    if (text.includes('future') || text.includes('nghề') || text.includes('firefighter')) {
      return '👨‍🚒 Trong Unit 5 (My future job), khi hỏi về nghề nghiệp mơ ước, em dùng:\n👉 "What would you like to be in the future?" (Bạn muốn làm gì trong tương lai?)\n👉 "I would like to be a firefighter because I want to put out fires and help people." (Em muốn làm lính cứu hỏa vì em muốn chữa cháy và giúp đỡ mọi người).';
    }
    if (text.includes('tet') || text.includes('tết') || text.includes('banh chung')) {
      return '🌸 Trong Unit 12 (Our Tet holiday), các mẫu câu rất quen thuộc nè:\n👉 "Will you make banh chung for Tet?" (Nhà bạn có gói bánh chưng đón Tết không?)\n👉 "Yes, I will." (Có, nhà mình có gói).\n👉 "I will go to my grandparents’ house in the countryside." (Em sẽ về thăm quê ông bà).';
    }
    const requestedUnit = text.match(/\bunit\s*(\d{1,2})\b/i);
    const requestedLesson = requestedUnit
      ? CURRICULUM.find((lesson) => lesson.unit === Number(requestedUnit[1]))
      : undefined;
    if (requestedLesson) {
      const patterns = requestedLesson.patterns.map((pattern) =>
        `👉 ${pattern.form}\n${pattern.example} (${pattern.translation})`
      ).join('\n\n');
      return `⭐ Unit ${requestedLesson.unit}: ${requestedLesson.title}\n${requestedLesson.focus}\n\n${patterns}\n\nTừ trọng tâm: ${requestedLesson.vocabulary.slice(0, 6).join(', ')}.`;
    }
    return `🦉 Thầy Cú đã nhận được câu hỏi của em: "${message}".\n\nTiếng Anh 5 Global Success có rất nhiều từ vựng và câu chuyện hay! Em có thể hỏi thầy cách phát âm từ mới trong 20 Units, đặt câu ví dụ, hoặc cùng thầy luyện nói nhé! Em muốn luyện tiếp Unit nào?`;
  };

  const systemInstruction = `
Bạn là 'Thầy Cú Thông Thái' (Wise Owl Tutor) - trợ lý gia sư AI tiếng Anh thân thiện, nhiệt tình của ứng dụng WordQuest AI.
Đối tượng người học: Học sinh Lớp 5 (đặc biệt là các em học sinh Lớp 5B4, Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị).
Khung chương trình: Toàn bộ 20 Units trong SGK Tiếng Anh 5 Global Success (Tập 1 & Tập 2) của Bộ Giáo dục và Đào tạo.

Quy tắc ứng xử và sư phạm:
1. Luôn dùng giọng điệu ấm áp, khen ngợi, động viên các em ("Tuyệt vời!", "Em làm tốt lắm!", "Cố gắng lên em nhé!").
2. Giải thích từ vựng đơn giản, luôn cung cấp:
   - Nghĩa tiếng Việt rõ ràng
   - Phiên âm chuẩn IPA (ví dụ: /ˈdɒlfɪn/, /ˈfaɪəfaɪtə/)
   - Câu ví dụ tiếng Anh ngắn gọn, đúng ngữ cảnh bài học lớp 5 và dịch nghĩa tiếng Việt
   - Mẹo nhớ hoặc cách phát âm dễ nhớ cho học sinh lớp 5
3. Khi học sinh đặt câu sai hoặc chưa chuẩn:
   - Áp dụng nguyên tắc sư phạm tích cực: Khen ngợi nỗ lực giao tiếp trước ("Em đặt câu rất hay và thầy hiểu ý em rồi!").
   - Nhẹ nhàng chỉ ra cách viết chuẩn xác và giải thích lý do ngắn gọn bằng tiếng Việt.
4. Luyện giao tiếp: Đặt các câu hỏi tiếng Anh ngắn (dưới 10 từ) bám sát các chủ đề Unit 1 - 20 (All about me, Our homes, My future job, Our Tet holiday, Staying healthy, Our health, Places of interest...) kèm dịch nghĩa để khuyến khích học sinh đối đáp.
5. Ngôn ngữ: Dùng song ngữ Anh - Việt linh hoạt, câu tiếng Anh ngắn và ngữ pháp chuẩn xác. Sử dụng emoji phong phú, dễ thương (🦉, ⭐, 🌟, 👏, 🌈, 💡, 🎒).
6. Tuyệt đối KHÔNG hỏi hay lưu trữ thông tin cá nhân của học sinh (như số điện thoại, địa chỉ nhà, tên đầy đủ). Giữ môi trường trò chuyện 100% an toàn cho trẻ em.

Tài liệu kiến thức tham chiếu theo bản đồ bài học của hai tập sách (ưu tiên đúng trọng tâm, tự diễn đạt, không bịa thêm mẫu câu):
${CURRICULUM_REFERENCE}
`;

  if (!ai || !apiKey) {
    const fallbackText = getFallbackReply(message);
    return res.json({
      success: true,
      reply: fallbackText,
      isFallback: true
    });
  }

  try {
    // Format conversation history for Gemini SDK
    const formattedContents = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        if (item && item.role && item.text) {
          formattedContents.push({
            role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
            parts: [{ text: String(item.text) }]
          });
        }
      }
    }

    // Add current user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 800
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI chat request timed out')), 5000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const replyText = response.text ? response.text.trim() : getFallbackReply(message);

    return res.json({
      success: true,
      reply: replyText,
      isFallback: false
    });
  } catch (err: unknown) {
    console.warn('Gemini chat error, using fallback:', err);
    return res.json({
      success: true,
      reply: getFallbackReply(message),
      isFallback: true
    });
  }
});

/**
 * Teacher Studio: AI Practice Generator
 */
app.post('/api/gemini/generate-practice', async (req, res) => {
  const {
    grade = 5,
    topic = 'unit1_all_about_me',
    learningObjective = 'Ghi nhớ từ vựng và vận dụng vào câu đơn giản trong SGK Tiếng Anh 5 Global Success',
    difficulty = 'Easy',
    wordList = [],
    questionCount = 5,
    questionType = 'multiple_choice'
  } = req.body;

  // Curated Fallback Generator in case AI is offline or key missing
  const generateFallbackQuestions = () => {
    const rawWords = Array.isArray(wordList) && wordList.length > 0
      ? wordList
      : ['dolphin', 'flat', 'firefighter', 'set square', 'make banh chung', 'toothache', 'Dragon Bridge', 'Phu Quoc Island'];

    const questions = [];
    const count = Math.min(questionCount, Math.max(rawWords.length, 5));

    for (let i = 0; i < count; i++) {
      const targetWord = rawWords[i % rawWords.length];
      const otherWords = rawWords.filter((w: string) => w.toLowerCase() !== targetWord.toLowerCase());
      const dist1 = otherWords[0] || 'countryside';
      const dist2 = otherWords[1] || 'building';
      const dist3 = otherWords[2] || 'reporter';

      if (questionType === 'sentence_completion' || (questionType === 'mixed' && i % 2 === 1)) {
        questions.push({
          id: `ai_gen_${Date.now()}_${i}`,
          word: targetWord,
          question: `Điền từ thích hợp vào câu: "My favourite thing is ______."`,
          questionType: 'sentence_completion',
          options: [targetWord, dist1, dist2, dist3].sort(() => 0.5 - Math.random()),
          correctAnswer: targetWord,
          vietnameseMeaning: `Từ vựng: ${targetWord}`,
          explanationVi: `Đáp án đúng là "${targetWord}". Câu hoàn chỉnh phù hợp ngữ cảnh bài học Tiếng Anh 5 Global Success.`,
          grade: 5,
          topic: String(topic),
          isAiGenerated: true,
          isApproved: false
        });
      } else {
        questions.push({
          id: `ai_gen_${Date.now()}_${i}`,
          word: targetWord,
          question: `Từ "${targetWord}" tương ứng với nghĩa hoặc tranh nào trong SGK Tiếng Anh 5?`,
          questionType: 'multiple_choice',
          options: [targetWord, dist1, dist2, dist3].sort(() => 0.5 - Math.random()),
          correctAnswer: targetWord,
          vietnameseMeaning: `Từ vựng: ${targetWord}`,
          explanationVi: `"${targetWord}" là từ vựng chính xác trong chương trình Tiếng Anh 5 Global Success.`,
          grade: 5,
          topic: String(topic),
          isAiGenerated: true,
          isApproved: false
        });
      }
    }
    return questions;
  };

  // If no Gemini client or API key, return fallback response safely
  if (!ai || !apiKey) {
    const fallbackQuestions = generateFallbackQuestions();
    return res.json({
      success: true,
      questions: fallbackQuestions,
      isFallback: true,
      notice: 'Chế độ tạo câu hỏi chuẩn đã sẵn sàng (Bộ từ mẫu Tiếng Anh 5 Global Success đã qua kiểm định).'
    });
  }

  try {
    const prompt = `
Bạn là chuyên gia sư phạm tiếng Anh tiểu học dành cho học sinh Lớp 5 tại Việt Nam.
Chương trình: SGK Tiếng Anh 5 Global Success (Tập 1 & Tập 2) của Bộ Giáo dục và Đào tạo.
Hãy tạo ${questionCount} câu hỏi luyện tập từ vựng tiếng Anh.

Thông tin bài tập:
- Khối lớp: Lớp 5
- Chủ đề / Unit: ${topic}
- Mục tiêu bài học: ${learningObjective}
- Độ khó: ${difficulty}
- Danh sách từ vựng bắt buộc sử dụng: ${wordList.join(', ')}
- Dạng câu hỏi: ${questionType} (multiple_choice: trắc nghiệm chọn nghĩa hoặc từ; sentence_completion: điền từ vào chỗ trống trong câu ngắn đơn giản).
- Kiến thức tham chiếu của Unit: ${CURRICULUM.find((lesson) => lesson.topic === topic)
      ? JSON.stringify(CURRICULUM.find((lesson) => lesson.topic === topic))
      : 'Dựa vào mục tiêu và danh sách từ do giáo viên cung cấp.'}

Yêu cầu nghiêm ngặt:
1. Câu tiếng Anh ngắn gọn, chuẩn xác theo bài học SGK Tiếng Anh 5 Global Success.
2. Mỗi câu hỏi chỉ có DUY NHẤT 1 đáp án đúng, và đáp án đúng PHẢI nằm trong mảng options (4 lựa chọn).
3. 3 phương án nhiễu phải hợp lý nhưng phân biệt rõ ràng, không gây tranh cãi.
4. Lời giải thích (explanationVi) viết bằng tiếng Việt nhẹ nhàng, khen ngợi và động viên học sinh lớp 5.
5. Không gán nhãn học sinh yếu kém.
`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'Danh sách các câu hỏi từ vựng tiếng Anh tiểu học',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              word: { type: Type.STRING },
              question: { type: Type.STRING },
              questionType: { type: Type.STRING, enum: ['multiple_choice', 'sentence_completion'] },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.STRING },
              vietnameseMeaning: { type: Type.STRING },
              explanationVi: { type: Type.STRING }
            },
            required: ['word', 'question', 'questionType', 'options', 'correctAnswer', 'vietnameseMeaning', 'explanationVi']
          }
        }
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timed out')), 7000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const responseText = response.text ? response.text.trim() : '';
    let parsedData = [];
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      console.warn('Failed to parse Gemini JSON output:', parseErr, responseText);
    }

    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      const fallbackQuestions = generateFallbackQuestions();
      return res.json({
        success: true,
        questions: fallbackQuestions,
        isFallback: true,
        notice: 'Đã tạo câu hỏi từ ngân hàng mẫu chuẩn sư phạm.'
      });
    }

    // Validate and sanitize the generated questions
    const sanitizedQuestions = parsedData.map((q, idx) => {
      // Ensure correctAnswer is included in options
      let options = Array.isArray(q.options) && q.options.length > 0 ? q.options : [q.correctAnswer, 'cat', 'dog', 'book'];
      if (!options.includes(q.correctAnswer)) {
        options = [q.correctAnswer, ...options.slice(0, 3)];
      }

      return {
        id: `ai_${Date.now()}_${idx}`,
        word: q.word || 'Word',
        question: q.question,
        questionType: q.questionType === 'sentence_completion' ? 'sentence_completion' : 'multiple_choice',
        options: options.slice(0, 4),
        correctAnswer: q.correctAnswer,
        vietnameseMeaning: q.vietnameseMeaning || '',
        explanationVi: q.explanationVi || `Đáp án đúng là "${q.correctAnswer}".`,
        grade: Number(grade),
        topic: String(topic),
        isAiGenerated: true,
        isApproved: false
      };
    });

    return res.json({
      success: true,
      questions: sanitizedQuestions,
      isFallback: false
    });
  } catch (err: unknown) {
    console.error('Gemini API execution error:', err);
    const fallbackQuestions = generateFallbackQuestions();
    return res.json({
      success: true,
      questions: fallbackQuestions,
      isFallback: true,
      notice: 'Đã tự động chuyển sang bộ câu hỏi mẫu kiểm duyệt do kết nối AI tạm gián đoạn.'
    });
  }
});

/**
 * Teacher Studio: AI Activity Designer for Personalized Learning
 * Phục vụ đề tài: Ứng dụng AI trong thiết kế hoạt động học tiếng Anh cá nhân hóa nhằm tăng hứng thú học tập và sự tự tin trong giao tiếp cho học sinh lớp 5B4, Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị
 * Lớp 5B4, Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị
 */
app.post('/api/gemini/design-activity', async (req, res) => {
  const {
    topic = 'School Life & Class 5B4',
    topicVi = 'Đời sống học đường & Lớp 5B4',
    grade = 5,
    className = 'Lớp 5B4 – Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị',
    learningObjective = 'Học sinh tự tin giới thiệu bản thân, lớp học và mô tả hoạt động thường nhật.',
    targetLanguage = 'I am in class 5B4. My favourite subject is...',
    duration = '15 phút',
    groupFormat = 'Cặp đôi',
    level = 'practice',
    supportNeeds = 'Cần hỗ trợ từ vựng phát âm và câu gợi ý mẫu'
  } = req.body;

  // Curated Fallback Activity Plan
  const generateFallbackPlan = () => {
    return {
      id: `plan_${Date.now()}`,
      topic,
      topicVi,
      grade: Number(grade),
      className,
      learningObjective,
      targetLanguage,
      duration,
      groupFormat,
      level,
      supportNeeds,
      activityTitle: `Hoạt động Giao tiếp Cá nhân hóa: ${topicVi} (Lớp ${grade})`,
      activityObjectives: [
        'Học sinh nhận biết và phát âm đúng các từ vựng trọng tâm của bài.',
        'Học sinh thực hành cấu trúc câu giao tiếp theo cặp đôi với sự tự tin.',
        'Học sinh tự đánh giá được mức độ tự tin trước và sau hoạt động.'
      ],
      materials: [
        'Thẻ tranh từ vựng kèm mã QR phát âm (Flashcards)',
        'Bảng câu hỏi phỏng vấn cặp đôi (Pair-work Survey Sheet)',
        'Phiếu tự đánh giá mức độ tự tin (Confidence Scale 1-4 sao)'
      ],
      stepByStep: [
        {
          step: 1,
          title: 'Khởi động & Kích hoạt từ vựng (Warm-up)',
          instructions: 'Giáo viên chiếu hình ảnh lớp học 5B4 hoặc đồ vật thân quen, học sinh gọi tên nhanh từ tiếng Anh (Word Splash).',
          durationMinutes: 3
        },
        {
          step: 2,
          title: 'Mô hình hóa câu mẫu & Phân tầng gợi ý (Modeling & Scaffolding)',
          instructions: 'Giáo viên làm mẫu đoạn hội thoại với 1 học sinh. Chiếu khung câu mẫu lên màn hình thông minh.',
          durationMinutes: 4
        },
        {
          step: 3,
          title: 'Thực hành theo cặp cá nhân hóa (Pair Practice)',
          instructions: 'Học sinh quay sang bạn bên cạnh hỏi và đáp. Bạn cần hỗ trợ được dùng thẻ gợi ý; bạn tự tin nói tự nhiên không nhìn mẫu.',
          durationMinutes: 5
        },
        {
          step: 4,
          title: 'Chia sẻ trước lớp & Tự đánh giá (Sharing & Self-Reflection)',
          instructions: '2-3 cặp học sinh xung phong trình bày. Cả lớp vỗ tay động viên. Học sinh tích chọn mức độ tự tin vào phiếu.',
          durationMinutes: 3
        }
      ],
      studentTasks: [
        'Hỏi bạn cùng bàn ít nhất 2 câu hỏi theo chủ đề bằng tiếng Anh.',
        'Ghi nhận câu trả lời của bạn vào phiếu phỏng vấn.',
        'Đọc to câu trả lời của mình trước nhóm hoặc lớp.'
      ],
      keyVocabulary: [
        { word: 'Class 5B4', meaningVi: 'Lớp 5B4', example: 'I study in Class 5B4 at Song Da Primary School - Huu Nghi Campus.' },
        { word: 'Primary School', meaningVi: 'Trường tiểu học', example: 'Our primary school has a large green yard.' },
        { word: 'Favourite subject', meaningVi: 'Môn học yêu thích', example: 'My favourite subject is English.' },
        { word: 'Classmate', meaningVi: 'Bạn cùng lớp', example: 'My classmates are very friendly and kind.' }
      ],
      scaffoldingLevels: {
        basic: 'Cung cấp câu mẫu đầy đủ có chỗ trống điền từ, kèm phiên âm tiếng Việt và hình minh họa trực quan.',
        practice: 'Cung cấp từ khóa gợi ý và khung cấu trúc; học sinh tự ghép thành câu nói hoàn chỉnh.',
        challenge: 'Học sinh phản xạ không cần nhìn gợi ý, mở rộng thêm 1 câu hỏi hoặc lý do (because...).'
      },
      positiveErrorHandling: 'Không ngắt lời khi học sinh đang nói. Khen ngợi nỗ lực giao tiếp trước ("Great try! I understood your idea."), sau đó nhắc lại câu chuẩn xác nhẹ nhàng ("Listen: I am in class 5B4, repeat with me!").',
      successCriteria: [
        'Học sinh tham gia đối đáp ít nhất 1 lượt hoàn chỉnh.',
        'Sử dụng đúng cấu trúc trọng tâm ít nhất 80%.',
        'Thể hiện thái độ tự tin, thoải mái khi giao tiếp cùng bạn.'
      ],
      differentiationSupport: 'Với học sinh còn rụt rè: Cho phép đóng vai phụ hoặc nghe bạn nói trước 1 lượt; hỗ trợ nút bấm nghe phát âm mẫu trên WordQuest AI trước khi nói.',
      isApproved: true,
      createdAt: Date.now()
    };
  };

  if (!ai || !apiKey) {
    const plan = generateFallbackPlan();
    return res.json({
      success: true,
      plan,
      isFallback: true,
      notice: 'Kế hoạch hoạt động chuẩn sư phạm đã được tạo sẵn sàng (Đề tài lớp 5B4, Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị).'
    });
  }

  try {
    const prompt = `
Bạn là chuyên gia sư phạm tiếng Anh tiểu học và EdTech thiết kế hoạt động học tập cá nhân hóa.
Dự án: "Ứng dụng AI trong thiết kế hoạt động học tiếng Anh cá nhân hóa nhằm tăng hứng thú học tập và sự tự tin trong giao tiếp cho học sinh lớp 5B4, Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị".

Thông tin yêu cầu từ giáo viên:
- Khối lớp: Lớp ${grade} (${className})
- Chủ đề bài học: ${topic} (${topicVi})
- Mục tiêu cần đạt: ${learningObjective}
- Cấu trúc & từ vựng trọng tâm: ${targetLanguage}
- Thời lượng: ${duration}
- Hình thức tổ chức: ${groupFormat}
- Mức độ bài học: ${level}
- Nhu cầu học tập cần hỗ trợ: ${supportNeeds}
- Kiến thức tham chiếu SGK của Unit: ${CURRICULUM.find((lesson) => lesson.topic === topic)
      ? JSON.stringify(CURRICULUM.find((lesson) => lesson.topic === topic))
      : 'Dựa vào cấu trúc và từ vựng giáo viên cung cấp.'}

Hãy thiết kế kế hoạch hoạt động chi tiết, thực tế, dễ áp dụng trên lớp học hoặc giao bài tự luyện trên máy tính bảng/điện thoại.
`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            activityTitle: { type: Type.STRING },
            activityObjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
            materials: { type: Type.ARRAY, items: { type: Type.STRING } },
            stepByStep: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                  durationMinutes: { type: Type.INTEGER }
                },
                required: ['step', 'title', 'instructions', 'durationMinutes']
              }
            },
            studentTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  meaningVi: { type: Type.STRING },
                  example: { type: Type.STRING }
                },
                required: ['word', 'meaningVi', 'example']
              }
            },
            scaffoldingLevels: {
              type: Type.OBJECT,
              properties: {
                basic: { type: Type.STRING },
                practice: { type: Type.STRING },
                challenge: { type: Type.STRING }
              },
              required: ['basic', 'practice', 'challenge']
            },
            positiveErrorHandling: { type: Type.STRING },
            successCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
            differentiationSupport: { type: Type.STRING }
          },
          required: [
            'activityTitle',
            'activityObjectives',
            'materials',
            'stepByStep',
            'studentTasks',
            'keyVocabulary',
            'scaffoldingLevels',
            'positiveErrorHandling',
            'successCriteria',
            'differentiationSupport'
          ]
        }
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timed out')), 7000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const responseText = response.text ? response.text.trim() : '';
    const parsed = JSON.parse(responseText);

    const fullPlan = {
      id: `plan_${Date.now()}`,
      topic,
      topicVi,
      grade: Number(grade),
      className,
      learningObjective,
      targetLanguage,
      duration,
      groupFormat,
      level,
      supportNeeds,
      ...parsed,
      isApproved: false,
      createdAt: Date.now()
    };

    return res.json({
      success: true,
      plan: fullPlan,
      isFallback: false
    });
  } catch (err: unknown) {
    console.warn('AI Designer fallback triggered:', err);
    const plan = generateFallbackPlan();
    return res.json({
      success: true,
      plan,
      isFallback: true,
      notice: 'Đã tạo kế hoạch hoạt động chuẩn sư phạm theo khung nghiên cứu lớp 5B4.'
    });
  }
});

/**
 * Mount Vite in dev mode or serve static dist in production
 */
async function startServer() {
  // Explicitly serve static assets from public with proper mime types
  app.use('/assets/images', express.static(path.join(__dirname, 'public/assets/images')));
  app.use(express.static(path.join(__dirname, 'public')));

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`WordQuest AI server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
