import React, { useState } from 'react';
import { ProgressProvider } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { LessonView } from './views/LessonView';
import { ExamView } from './views/ExamView';
import { FlashcardsView } from './views/FlashcardsView';
import { MathDrillView } from './views/MathDrillView';
import { ToolsView } from './views/ToolsView';
import { Day2QuestsView } from './views/Day2QuestsView';

export const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'lesson' | 'exam' | 'flashcards' | 'math' | 'tools' | 'day2'>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: 'exam' | 'flashcards' | 'math' | 'tools' | 'day2') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedLessonId={selectedLessonId}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentView === 'home' && (
          <HomeView
            onSelectLesson={handleSelectLesson}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'lesson' && selectedLessonId && (
          <LessonView
            lessonId={selectedLessonId}
            onSelectLesson={handleSelectLesson}
            onBackToMap={() => setCurrentView('home')}
          />
        )}

        {currentView === 'day2' && <Day2QuestsView />}

        {currentView === 'exam' && <ExamView />}

        {currentView === 'flashcards' && <FlashcardsView />}

        {currentView === 'math' && <MathDrillView />}

        {currentView === 'tools' && <ToolsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-mono font-bold">ПУТЬ В C</span>
            <span>•</span>
            <span>Интерактивный тренажёр для студентки breashee (Школа 21, er-d9)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>gcc -Wall -Werror -Wextra -std=c11</span>
            <span>•</span>
            <span>Dijkstra Single Exit</span>
            <span>•</span>
            <span>Решаю сама 💪</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}
