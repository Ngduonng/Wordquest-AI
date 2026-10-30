/**
 * WordQuest AI – Hành trình chinh phục từ vựng tiếng Anh tiểu học
 *
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GradeLevel, TopicId, VocabularyWord, WordProgress } from './types/index.ts';
import { Navbar } from './components/Navbar.tsx';
import { HomeView } from './components/HomeView.tsx';
import { ChatbotView } from './components/ChatbotView.tsx';
import { LearnView } from './components/LearnView.tsx';
import { PlayView } from './components/PlayView.tsx';
import { SpeakingView } from './components/SpeakingView.tsx';
import { ReviewView } from './components/ReviewView.tsx';
import { ProgressView } from './components/ProgressView.tsx';
import { TeacherStudioView } from './components/TeacherStudioView.tsx';
import {
  loadAllWordProgress,
  recordQuestionAnswer,
  toggleWordFlag,
  clearAllLocalProgress
} from './services/storage.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>(5);
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('unit1_all_about_me');

  // Anonymous local progress map
  const [progressMap, setProgressMap] = useState<Record<string, WordProgress>>({});

  // Session-specific ephemeral counters
  const [sessionQuestions, setSessionQuestions] = useState<number>(0);
  const [sessionCorrect, setSessionCorrect] = useState<number>(0);
  const [sessionStars, setSessionStars] = useState<number>(0);

  // Load progress from localStorage on mount
  useEffect(() => {
    const loaded = loadAllWordProgress();
    setProgressMap(loaded);
  }, []);

  const handleRecordAnswer = (
    wordMeta: { id: string; word: string; topic: string; grade: GradeLevel },
    isCorrect: boolean
  ) => {
    const updated = recordQuestionAnswer(wordMeta, isCorrect);
    setProgressMap((prev) => ({
      ...prev,
      [wordMeta.id]: updated
    }));
    setSessionQuestions((prev) => prev + 1);
    if (isCorrect) {
      setSessionCorrect((prev) => prev + 1);
    }
  };

  const handleToggleFlag = (word: VocabularyWord) => {
    const updated = toggleWordFlag({
      id: word.id,
      word: word.word,
      topic: word.topic,
      grade: word.grade
    });
    setProgressMap((prev) => ({
      ...prev,
      [word.id]: updated
    }));
  };

  const handleClearProgress = () => {
    clearAllLocalProgress();
    setProgressMap({});
    setSessionQuestions(0);
    setSessionCorrect(0);
    setSessionStars(0);
  };

  const handleLoadSampleDemo = () => {
    import('./services/storage.ts').then(({ generateSampleDemoProgress }) => {
      const sample = generateSampleDemoProgress();
      setProgressMap(sample);
      setSessionQuestions(12);
      setSessionCorrect(9);
      setSessionStars(5);
    });
  };

  const handleAddSessionStars = (stars: number) => {
    setSessionStars((prev) => prev + stars);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-amber-50/30 text-slate-800 bg-repeat bg-[length:800px_450px]"
      style={{ backgroundImage: `url('/assets/images/bg-decor-pattern.svg')` }}
    >
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentGrade={currentGrade}
        onSelectGrade={setCurrentGrade}
        sessionStars={sessionStars}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentTab === 'home' && (
          <HomeView
            currentGrade={currentGrade}
            onSelectGrade={setCurrentGrade}
            onSelectTopic={(topicId) => {
              setSelectedTopic(topicId);
              setCurrentTab('learn');
            }}
            onNavigate={setCurrentTab}
            progressMap={progressMap}
            sessionQuestions={sessionQuestions}
            sessionCorrect={sessionCorrect}
          />
        )}

        {currentTab === 'chat' && (
          <ChatbotView
            currentGrade={currentGrade}
            onNavigateHome={() => setCurrentTab('home')}
            onNavigateToTopic={(topicId) => {
              setSelectedTopic(topicId);
              setCurrentTab('learn');
            }}
          />
        )}

        {currentTab === 'learn' && (
          <LearnView
            currentGrade={currentGrade}
            onSelectGrade={setCurrentGrade}
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
            progressMap={progressMap}
            onToggleFlag={handleToggleFlag}
          />
        )}

        {currentTab === 'play' && (
          <PlayView
            currentGrade={currentGrade}
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
            progressMap={progressMap}
            onRecordAnswer={handleRecordAnswer}
            onNavigateToReview={() => setCurrentTab('review')}
            onAddSessionStars={handleAddSessionStars}
          />
        )}

        {currentTab === 'speaking' && (
          <SpeakingView
            currentGrade={currentGrade}
            onNavigateHome={() => setCurrentTab('home')}
            onAddSessionStars={handleAddSessionStars}
          />
        )}

        {currentTab === 'review' && (
          <ReviewView
            currentGrade={currentGrade}
            progressMap={progressMap}
            onToggleFlag={handleToggleFlag}
            onRecordAnswer={handleRecordAnswer}
            onAddSessionStars={handleAddSessionStars}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            currentGrade={currentGrade}
            progressMap={progressMap}
            sessionQuestions={sessionQuestions}
            sessionCorrect={sessionCorrect}
            sessionStars={sessionStars}
            onClearProgress={handleClearProgress}
            onLoadSampleDemo={handleLoadSampleDemo}
            onNavigateToTab={setCurrentTab}
          />
        )}

        {currentTab === 'teacher' && (
          <TeacherStudioView
            currentGrade={currentGrade}
            onSelectGrade={setCurrentGrade}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-200/60 bg-white/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">
            WordQuest AI · Nền tảng luyện tập tiếng Anh chuẩn SGK Tiếng Anh 5 Global Success (Tập 1 &amp; Tập 2)
          </p>
          <p className="text-[11px] text-slate-400">
            Phục vụ đề tài: Lớp 5A4, Trường TH Hữu Nghị – Hòa Bình – Phú Thọ. Công cụ hỗ trợ giáo dục, không thay thế giáo viên.
          </p>
        </div>
      </footer>
    </div>
  );
}
