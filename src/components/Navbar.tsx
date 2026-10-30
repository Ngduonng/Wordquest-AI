import React from 'react';
import { GradeLevel } from '../types/index.ts';
import { BookOpen, Gamepad2, RotateCcw, BarChart3, GraduationCap, Sparkles, Mic, Bot } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  sessionStars: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentGrade,
  onSelectGrade,
  sessionStars
}) => {
  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Sparkles },
    { id: 'chat', label: 'Gia sư AI 🦉', icon: Bot },
    { id: 'learn', label: 'Học từ', icon: BookOpen },
    { id: 'play', label: 'Trò chơi', icon: Gamepad2 },
    { id: 'speaking', label: 'Luyện giao tiếp', icon: Mic },
    { id: 'review', label: 'Ôn tập', icon: RotateCcw },
    { id: 'progress', label: 'Tiến độ', icon: BarChart3 },
    { id: 'teacher', label: 'Teacher Studio', icon: GraduationCap }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/assets/images/mascot.svg"
                alt="WordQuest Mascot"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  WordQuest<span className="text-amber-500"> AI</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Lớp 5B4 · Trường Tiểu học Sông Đà- Phân hiệu Hữu Nghị · Học qua hình ảnh &amp; giao tiếp
              </p>
            </div>
          </button>

          {/* Grade 5 Global Success Badge & Session Stars */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1 rounded-xl text-xs font-bold shadow-xs">
              <span className="text-amber-600">📘</span>
              <span>Lớp 5 · Global Success (Tập 1 &amp; 2)</span>
            </div>

            {/* Session Stars counter */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-xl font-bold text-xs sm:text-sm">
              <span className="text-amber-500 animate-pulse">⭐</span>
              <span>{sessionStars}</span>
              <span className="text-[11px] text-amber-700 font-medium hidden sm:inline">sao</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-100 text-amber-900 border border-amber-300/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
