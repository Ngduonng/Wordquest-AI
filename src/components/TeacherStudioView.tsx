import React, { useState, useEffect } from 'react';
import { GradeLevel, GameQuestion, TeacherActivityPlan, LearningLevel } from '../types/index.ts';
import { TOPICS, INITIAL_VOCABULARY } from '../data/vocabulary.ts';
import {
  saveApprovedQuestions,
  loadApprovedQuestions,
  saveTeacherActivityPlan,
  loadTeacherActivityPlans,
  deleteTeacherActivityPlan
} from '../services/storage.ts';
import {
  Sparkles,
  CheckCircle2,
  FileDown,
  Edit3,
  Trash2,
  AlertCircle,
  Plus,
  RefreshCw,
  Copy,
  BookOpen,
  Check,
  GraduationCap,
  Users,
  Layers,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TeacherStudioViewProps {
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
}

export const TeacherStudioView: React.FC<TeacherStudioViewProps> = ({
  currentGrade,
  onSelectGrade
}) => {
  const [activeTab, setActiveTab] = useState<'activity_designer' | 'question_generator'>('activity_designer');

  // ---------- ACTIVITY DESIGNER STATES ----------
  const [planTopic, setPlanTopic] = useState('School Life & Class 5B4');
  const [planTopicVi, setPlanTopicVi] = useState('Đời sống học đường & Lớp 5B4');
  const [className, setClassName] = useState('Lớp 5B4 – Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị');
  const [planObjective, setPlanObjective] = useState('Học sinh tự tin giới thiệu bản thân, lớp học 5B4 và mô tả hoạt động thường nhật.');
  const [planTargetLanguage, setPlanTargetLanguage] = useState('I am in class 5B4 at Song Da Primary School - Huu Nghi Campus. My favourite subject is English.');
  const [planDuration, setPlanDuration] = useState('15 phút');
  const [planGroupFormat, setPlanGroupFormat] = useState<'Cá nhân' | 'Cặp đôi' | 'Nhóm 4' | 'Cả lớp'>('Cặp đôi');
  const [planLevel, setPlanLevel] = useState<LearningLevel>('practice');
  const [planSupportNeeds, setPlanSupportNeeds] = useState('Cần thẻ gợi ý từ vựng cho học sinh rụt rè; học sinh tự tin khuyến khích nói mở rộng.');

  const [isDesigning, setIsDesigning] = useState(false);
  const [activityPlan, setActivityPlan] = useState<TeacherActivityPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<TeacherActivityPlan[]>([]);
  const [isEditingPlan, setIsEditingPlan] = useState(false);

  // ---------- QUESTION GENERATOR STATES ----------
  const [qTopic, setQTopic] = useState('animals');
  const [learningObjective, setLearningObjective] = useState('Ghi nhớ từ vựng và vận dụng vào câu đơn giản');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Challenge'>('Easy');
  const [wordListText, setWordListText] = useState('Dog, Cat, Elephant, Monkey, Rabbit');
  const [questionCount, setQuestionCount] = useState<5 | 10 | 15>(5);
  const [questionType, setQuestionType] = useState<'multiple_choice' | 'sentence_completion' | 'mixed'>('multiple_choice');

  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<GameQuestion[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  useEffect(() => {
    setSavedPlans(loadTeacherActivityPlans());
  }, []);

  // Quick preset helper
  const handleLoadPresetWords = (topicId: string) => {
    setQTopic(topicId);
    const wordsInTopic = INITIAL_VOCABULARY.filter(
      (w) => w.topic === topicId && w.grade === currentGrade
    ).map((w) => w.word);
    if (wordsInTopic.length > 0) {
      setWordListText(wordsInTopic.join(', '));
    }
  };

  // 1. GENERATE ACTIVITY PLAN VIA AI
  const handleGeneratePlan = async () => {
    setIsDesigning(true);
    setNotice(null);

    try {
      const response = await fetch('/api/gemini/design-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: planTopic,
          topicVi: planTopicVi,
          grade: currentGrade,
          className,
          learningObjective: planObjective,
          targetLanguage: planTargetLanguage,
          duration: planDuration,
          groupFormat: planGroupFormat,
          level: planLevel,
          supportNeeds: planSupportNeeds
        })
      });

      const data = await response.json();
      if (data.success && data.plan) {
        setActivityPlan(data.plan);
        if (data.isFallback) {
          setNotice(data.notice || 'Đã áp dụng mẫu kế hoạch hoạt động chuẩn sư phạm cho Lớp 5B4.');
        } else {
          setNotice('Gemini AI đã thiết kế thành công kế hoạch hoạt động cá nhân hóa!');
        }
      }
    } catch (err) {
      console.warn('Design activity err:', err);
      setNotice('Không thể kết nối máy chủ AI. Đã chuyển sang bản kế hoạch chuẩn mẫu.');
    } finally {
      setIsDesigning(false);
    }
  };

  // 2. APPROVE & SAVE ACTIVITY PLAN
  const handleSavePlan = () => {
    if (!activityPlan) return;
    const approvedPlan = { ...activityPlan, isApproved: true };
    saveTeacherActivityPlan(approvedPlan);
    setActivityPlan(approvedPlan);
    setSavedPlans(loadTeacherActivityPlans());
    setNotice('Kế hoạch hoạt động đã được phê duyệt và lưu trữ thành công!');
  };

  // 3. EXPORT PLAN AS MARKDOWN
  const handleExportPlanMarkdown = () => {
    if (!activityPlan) return;
    const content = `
# KẾ HOẠCH HOẠT ĐỘNG TIẾNG ANH CÁ NHÂN HÓA
**Đề tài:** Ứng dụng AI trong thiết kế hoạt động học tiếng Anh cá nhân hóa nhằm tăng hứng thú học tập và sự tự tin trong giao tiếp cho học sinh lớp 5B4, Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị
**Đối tượng:** ${activityPlan.className}
**Chủ đề:** ${activityPlan.topicVi} (${activityPlan.topic})
**Thời lượng:** ${activityPlan.duration} · **Hình thức:** ${activityPlan.groupFormat}
**Mức độ:** ${activityPlan.level}

---

## 1. MỤC TIÊU HOẠT ĐỘNG (OBJECTIVES)
${activityPlan.activityObjectives.map((o) => `- ${o}`).join('\n')}

## 2. CHUẨN BỊ (MATERIALS)
${activityPlan.materials.map((m) => `- ${m}`).join('\n')}

## 3. TIẾN TRÌNH HOẠT ĐỘNG TỪNG BƯỚC (PROCEDURES)
${activityPlan.stepByStep.map((s) => `### Bước ${s.step}: ${s.title} (${s.durationMinutes} phút)\n${s.instructions}`).join('\n\n')}

## 4. NHIỆM VỤ DÀNH CHO HỌC SINH (STUDENT TASKS)
${activityPlan.studentTasks.map((t) => `- ${t}`).join('\n')}

## 5. TỪ VỰNG & CẤU TRÚC TRỌNG TÂM (KEY LANGUAGE)
${activityPlan.keyVocabulary.map((v) => `- **${v.word}**: ${v.meaningVi} (Ví dụ: "${v.example}")`).join('\n')}

## 6. PHÂN TẦNG GỢI Ý CÁ NHÂN HÓA (SCAFFOLDING LEVELS)
- **Cơ bản (Basic):** ${activityPlan.scaffoldingLevels.basic}
- **Luyện tập (Practice):** ${activityPlan.scaffoldingLevels.practice}
- **Thử thách (Challenge):** ${activityPlan.scaffoldingLevels.challenge}

## 7. HƯỚNG DẪN PHẢN HỒI LỖI TÍCH CỰC (POSITIVE ERROR HANDLING)
${activityPlan.positiveErrorHandling}

## 8. TIÊU CHÍ HOÀN THÀNH (SUCCESS CRITERIA)
${activityPlan.successCriteria.map((c) => `- [ ] ${c}`).join('\n')}

## 9. PHƯƠNG ÁN HỖ TRỢ BỔ SUNG (DIFFERENTIATION)
${activityPlan.differentiationSupport}

---
*Kế hoạch được kiểm duyệt và phê duyệt bởi Giáo viên tiếng Anh.*
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ke_hoach_hoat_dong_lop5B4_${activityPlan.topic.toLowerCase().replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 4. GENERATE PRACTICE QUESTIONS
  const handleGenerateQuestions = async () => {
    const rawWords = wordListText
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean);

    if (rawWords.length === 0) {
      setNotice('Vui lòng nhập ít nhất 1 từ vựng để tạo bài tập.');
      return;
    }

    setIsLoading(true);
    setNotice(null);

    try {
      const response = await fetch('/api/gemini/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: currentGrade,
          topic: qTopic,
          learningObjective,
          difficulty,
          wordList: rawWords,
          questionCount,
          questionType
        })
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.questions)) {
        setGeneratedQuestions(data.questions);
        if (data.isFallback) {
          setNotice(data.notice || 'Đã tạo bộ câu hỏi mẫu kiểm định chuẩn sư phạm.');
        } else {
          setNotice('Gemini AI đã tạo thành công bộ câu hỏi! Thầy cô hãy kiểm tra và duyệt nội dung.');
        }
      }
    } catch (err) {
      console.error('Teacher Studio generate error:', err);
      setNotice('Không thể kết nối đến máy chủ. Đang chuyển sang câu hỏi mẫu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuestion = (id: string, updates: Partial<GameQuestion>) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const handleApproveAllQuestions = () => {
    if (generatedQuestions.length === 0) return;
    const approved = generatedQuestions.map((q) => ({ ...q, isApproved: true }));
    saveApprovedQuestions(approved);
    setGeneratedQuestions(approved);
    setNotice(`Đã duyệt thành công ${approved.length} câu hỏi vào kho bài tập của ứng dụng!`);
  };

  const handleApproveSingle = (id: string) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const updated = { ...q, isApproved: true };
          saveApprovedQuestions([updated]);
          return updated;
        }
        return q;
      })
    );
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(generatedQuestions, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `wordquest_questions_grade${currentGrade}.json`;
    a.click();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Từ vựng', 'Câu hỏi', 'Đáp án đúng', 'Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D', 'Giải thích TV'];
    const rows = generatedQuestions.map((q) => [
      q.id,
      q.word,
      `"${q.question.replace(/"/g, '""')}"`,
      `"${q.correctAnswer.replace(/"/g, '""')}"`,
      `"${(q.options[0] || '').replace(/"/g, '""')}"`,
      `"${(q.options[1] || '').replace(/"/g, '""')}"`,
      `"${(q.options[2] || '').replace(/"/g, '""')}"`,
      `"${(q.options[3] || '').replace(/"/g, '""')}"`,
      `"${(q.explanationVi || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const a = document.createElement('a');
    a.href = encodeURI(csvContent);
    a.download = `wordquest_questions_grade${currentGrade}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200/80 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
              <img
                src="/assets/images/teacher-studio.svg"
                alt="Teacher Studio"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                Teacher Studio – Không gian Giáo viên
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Ứng dụng AI trong thiết kế hoạt động học tiếng Anh cá nhân hóa nhằm tăng hứng thú học tập và sự tự tin trong giao tiếp cho học sinh lớp 5B4, Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('activity_designer')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'activity_designer'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Activity Designer</span>
            </button>

            <button
              onClick={() => setActiveTab('question_generator')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'question_generator'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Ngân hàng câu hỏi</span>
            </button>
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs sm:text-sm text-amber-950 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* ---------------- MODE 1: AI ACTIVITY DESIGNER ---------------- */}
      {activeTab === 'activity_designer' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Thiết lập thông số thiết kế hoạt động cá nhân hóa</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tạo kế hoạch hoạt động bài bản gồm 9 tiêu chí sư phạm phục vụ nghiên cứu tại Lớp 5B4
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-100 text-amber-800">
                {className}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Chủ đề bài học (Topic):</label>
                <input
                  type="text"
                  value={planTopicVi}
                  onChange={(e) => {
                    setPlanTopicVi(e.target.value);
                    setPlanTopic(e.target.value);
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Thời lượng hoạt động:</label>
                <select
                  value={planDuration}
                  onChange={(e) => setPlanDuration(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-amber-500"
                >
                  <option value="10 phút">10 phút (Khởi động / củng cố)</option>
                  <option value="15 phút">15 phút (Luyện tập trọng tâm)</option>
                  <option value="20 phút">20 phút (Thực hành giao tiếp sâu)</option>
                  <option value="35 phút">1 tiết học hoàn chỉnh (35 phút)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hình thức tổ chức:</label>
                <div className="flex gap-1.5">
                  {(['Cá nhân', 'Cặp đôi', 'Nhóm 4', 'Cả lớp'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setPlanGroupFormat(fmt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        planGroupFormat === fmt
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Mục tiêu cần đạt (Learning Objective):</label>
                <input
                  type="text"
                  value={planObjective}
                  onChange={(e) => setPlanObjective(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mức độ phân hóa:</label>
                <div className="flex gap-1.5">
                  {(['basic', 'practice', 'challenge'] as LearningLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPlanLevel(lvl)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        planLevel === lvl
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl === 'basic' ? 'Cơ bản' : lvl === 'practice' ? 'Luyện tập' : 'Thử thách'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-3">
                <label className="text-xs font-bold text-slate-700">Cấu trúc & Từ vựng trọng tâm:</label>
                <input
                  type="text"
                  value={planTargetLanguage}
                  onChange={(e) => setPlanTargetLanguage(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-amber-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-3">
                <label className="text-xs font-bold text-slate-700">Nhu cầu học tập cần hỗ trợ (Cá nhân hóa):</label>
                <input
                  type="text"
                  value={planSupportNeeds}
                  onChange={(e) => setPlanSupportNeeds(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGeneratePlan}
                disabled={isDesigning}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md shadow-amber-500/20 active:scale-98 transition-transform"
              >
                {isDesigning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI đang thiết kế hoạt động...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Thiết kế hoạt động bằng AI (AI Activity Designer)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ACTIVE ACTIVITY PLAN DISPLAY */}
          {activityPlan && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      Đã qua kiểm duyệt sư phạm
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{activityPlan.className}</span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {activityPlan.activityTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleExportPlanMarkdown}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Tải Markdown (.md)</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In kế hoạch</span>
                  </button>

                  <button
                    onClick={handleSavePlan}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Duyệt &amp; Lưu kế hoạch</span>
                  </button>
                </div>
              </div>

              {/* 9 SƯ PHẠM COMPONENTS */}
              <div className="space-y-5 text-xs sm:text-sm text-slate-700">
                {/* 1. Mục tiêu */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="font-bold text-slate-900 block text-sm">
                    1. Mục tiêu hoạt động (Activity Objectives):
                  </span>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    {activityPlan.activityObjectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                {/* 2. Chuẩn bị */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="font-bold text-slate-900 block text-sm">
                    2. Chuẩn bị học liệu &amp; thiết bị:
                  </span>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    {activityPlan.materials.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>

                {/* 3. Tiến trình từng bước */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="font-bold text-slate-900 block text-sm">
                    3. Hướng dẫn tổ chức hoạt động từng bước:
                  </span>
                  <div className="space-y-2">
                    {activityPlan.stepByStep.map((s) => (
                      <div key={s.step} className="p-3 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                          <span>Bước {s.step}: {s.title}</span>
                          <span>{s.durationMinutes} phút</span>
                        </div>
                        <p className="mt-1 text-slate-600 leading-relaxed">{s.instructions}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Nhiệm vụ học sinh & Từ vựng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-slate-900 block text-sm">
                      4. Nhiệm vụ của học sinh:
                    </span>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      {activityPlan.studentTasks.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-slate-900 block text-sm">
                      5. Từ vựng &amp; Cấu trúc trọng tâm:
                    </span>
                    <div className="space-y-1 pt-1">
                      {activityPlan.keyVocabulary.map((v, i) => (
                        <div key={i} className="text-[11px] p-2 bg-white rounded-lg border border-slate-200">
                          <strong className="text-slate-900">{v.word}</strong>: {v.meaningVi}
                          <p className="italic text-slate-500 mt-0.5">"{v.example}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. Phân tầng gợi ý Scaffolding */}
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                  <span className="font-bold text-amber-950 block text-sm">
                    6. Các mức gợi ý phân hóa (Scaffolding Levels):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 bg-white rounded-xl border border-amber-200">
                      <strong className="text-emerald-700 block text-xs mb-1">Mức 1: Cơ bản</strong>
                      <p className="text-[11px] text-slate-600">{activityPlan.scaffoldingLevels.basic}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-amber-200">
                      <strong className="text-blue-700 block text-xs mb-1">Mức 2: Luyện tập</strong>
                      <p className="text-[11px] text-slate-600">{activityPlan.scaffoldingLevels.practice}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-amber-200">
                      <strong className="text-purple-700 block text-xs mb-1">Mức 3: Thử thách</strong>
                      <p className="text-[11px] text-slate-600">{activityPlan.scaffoldingLevels.challenge}</p>
                    </div>
                  </div>
                </div>

                {/* 7, 8, 9. Phản hồi lỗi, Tiêu chí, Hỗ trợ bổ sung */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <strong className="text-slate-900 block text-xs uppercase tracking-wide">
                      7. Phản hồi lỗi tích cực:
                    </strong>
                    <p className="text-xs text-slate-600 leading-relaxed">{activityPlan.positiveErrorHandling}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <strong className="text-slate-900 block text-xs uppercase tracking-wide">
                      8. Tiêu chí hoàn thành:
                    </strong>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                      {activityPlan.successCriteria.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <strong className="text-slate-900 block text-xs uppercase tracking-wide">
                      9. Hỗ trợ học sinh cần củng cố:
                    </strong>
                    <p className="text-xs text-slate-600 leading-relaxed">{activityPlan.differentiationSupport}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- MODE 2: QUESTION GENERATOR & EDITOR ---------------- */}
      {activeTab === 'question_generator' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Tạo bộ câu hỏi luyện tập (Human-in-the-loop)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Khối lớp &amp; Đối tượng:</label>
                <div className="py-2 px-3 rounded-xl text-xs font-bold bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between">
                  <span>Lớp 5 (Lớp 5B4 · Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị)</span>
                  <span className="text-[11px] bg-amber-200/80 px-2 py-0.5 rounded-md">Global Success</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Chủ đề bài giảng (20 Units):</label>
                <select
                  value={qTopic}
                  onChange={(e) => {
                    setQTopic(e.target.value);
                    handleLoadPresetWords(e.target.value);
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-amber-500"
                >
                  <optgroup label="📘 Tập 1 (Units 1 – 10)">
                    <option value="unit1_all_about_me">Unit 1: All about me! (Bản thân em)</option>
                    <option value="unit2_our_homes">Unit 2: Our homes (Nơi ở &amp; Địa chỉ)</option>
                    <option value="unit3_my_foreign_friends">Unit 3: My foreign friends (Bạn bè quốc tế)</option>
                    <option value="unit4_free_time">Unit 4: Our free-time activities (Thời gian rảnh)</option>
                    <option value="unit5_future_jobs">Unit 5: My future job (Nghề nghiệp tương lai)</option>
                    <option value="unit6_school_rooms">Unit 6: Our school rooms (Phòng học &amp; Chỉ đường)</option>
                    <option value="unit7_school_activities">Unit 7: Our favourite school activities (Hoạt động trường)</option>
                    <option value="unit8_in_classroom">Unit 8: In our classroom (Đồ dùng trong lớp)</option>
                    <option value="unit9_outdoor_activities">Unit 9: Our outdoor activities (Dã ngoại)</option>
                    <option value="unit10_school_trip">Unit 10: Our school trip (Chuyến tham quan)</option>
                  </optgroup>
                  <optgroup label="📙 Tập 2 (Units 11 – 20)">
                    <option value="unit11_family_time">Unit 11: Family time (Kỳ nghỉ gia đình)</option>
                    <option value="unit12_tet_holiday">Unit 12: Our Tet holiday (Tết cổ truyền)</option>
                    <option value="unit13_special_days">Unit 13: Our special days (Ngày đặc biệt)</option>
                    <option value="unit14_staying_healthy">Unit 14: Staying healthy (Giữ gìn sức khỏe)</option>
                    <option value="unit15_our_health">Unit 15: Our health (Chăm sóc sức khỏe)</option>
                    <option value="unit16_seasons_weather">Unit 16: Seasons and weather (Bốn mùa &amp; Thời tiết)</option>
                    <option value="unit17_stories">Unit 17: Stories for children (Truyện cổ tích)</option>
                    <option value="unit18_transport">Unit 18: Means of transport (Phương tiện đi lại)</option>
                    <option value="unit19_places_interest">Unit 19: Places of interest (Danh lam thắng cảnh)</option>
                    <option value="unit20_summer_holidays">Unit 20: Our summer holidays (Kỳ nghỉ hè)</option>
                  </optgroup>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Số lượng câu hỏi:</label>
                <div className="flex gap-2">
                  {([5, 10, 15] as const).map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        questionCount === cnt
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cnt} câu
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 sm:col-span-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Danh sách từ vựng trọng tâm (cách nhau bằng dấu phẩy):
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span>Nạp nhanh theo Unit:</span>
                    <button
                      type="button"
                      onClick={() => handleLoadPresetWords('unit1_all_about_me')}
                      className="text-amber-700 hover:underline font-bold"
                    >
                      Unit 1
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => handleLoadPresetWords('unit5_future_jobs')}
                      className="text-amber-700 hover:underline font-bold"
                    >
                      Unit 5
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => handleLoadPresetWords('unit12_tet_holiday')}
                      className="text-amber-700 hover:underline font-bold"
                    >
                      Unit 12
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => handleLoadPresetWords('unit15_our_health')}
                      className="text-amber-700 hover:underline font-bold"
                    >
                      Unit 15
                    </button>
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={wordListText}
                  onChange={(e) => setWordListText(e.target.value)}
                  className="w-full p-3 rounded-2xl text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerateQuestions}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md shadow-amber-500/20 active:scale-98 transition-transform"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI đang tạo câu hỏi...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tạo câu hỏi bằng AI (Generate Questions)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Questions List */}
          {generatedQuestions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Kiểm duyệt câu hỏi ({generatedQuestions.length} câu)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chỉ những câu được duyệt mới xuất hiện trong bài làm của học sinh
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Xuất JSON</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Xuất CSV</span>
                  </button>

                  <button
                    onClick={handleApproveAllQuestions}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Duyệt tất cả câu hỏi</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {generatedQuestions.map((q, idx) => {
                  const isEditing = editingQuestionId === q.id;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        q.isApproved ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              Câu {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-amber-700">Từ: "{q.word}"</span>
                            {q.isApproved ? (
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Đã duyệt
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                Chờ duyệt
                              </span>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="space-y-2 pt-2">
                              <input
                                type="text"
                                value={q.question}
                                onChange={(e) => handleUpdateQuestion(q.id, { question: e.target.value })}
                                className="w-full p-2 text-xs rounded-xl border border-slate-300"
                              />
                              <input
                                type="text"
                                value={q.correctAnswer}
                                onChange={(e) => handleUpdateQuestion(q.id, { correctAnswer: e.target.value })}
                                className="w-full p-2 text-xs rounded-xl border border-slate-300"
                              />
                            </div>
                          ) : (
                            <div className="space-y-1.5 pt-1">
                              <p className="font-heading text-base font-bold text-slate-900">{q.question}</p>
                              <div className="flex flex-wrap gap-2">
                                {q.options.map((opt, optIdx) => (
                                  <span
                                    key={optIdx}
                                    className={`text-xs px-2.5 py-1 rounded-xl font-medium border ${
                                      opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
                                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                                        : 'bg-slate-50 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    {opt}
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs text-slate-600 italic">💡 {q.explanationVi}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setEditingQuestionId(isEditing ? null : q.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {!q.isApproved && (
                            <button
                              onClick={() => handleApproveSingle(q.id)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
                            >
                              Duyệt
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
