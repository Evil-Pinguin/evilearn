import React, { useState } from 'react';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { LessonView } from './views/LessonView';
import { ExamView } from './views/ExamView';
import { FlashcardsView } from './views/FlashcardsView';
import { MathDrillView } from './views/MathDrillView';
import { ToolsView } from './views/ToolsView';
import { Day2QuestsView } from './views/Day2QuestsView';
import { CommandsView } from './views/CommandsView';
import { ViewId } from './types';

export const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewId>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: ViewId) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar currentView={currentView} setCurrentView={handleNavigate} selectedLessonId={selectedLessonId} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {currentView === 'home' && <HomeView onSelectLesson={handleSelectLesson} onNavigate={handleNavigate} />}

        {currentView === 'lesson' && selectedLessonId && (
          <LessonView lessonId={selectedLessonId} onSelectLesson={handleSelectLesson} onBackToMap={() => setCurrentView('home')} />
        )}

        {currentView === 'day2' && <Day2QuestsView />}

        {currentView === 'commands' && <CommandsView onOpenLesson={handleSelectLesson} />}

        {currentView === 'exam' && <ExamView />}

        {currentView === 'flashcards' && <FlashcardsView />}

        {currentView === 'math' && <MathDrillView />}

        {currentView === 'tools' && <ToolsView />}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-[11px] text-slate-400 text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span>Путь в C · Школа 21 (er-d9)</span>
          <span className="font-mono">gcc -Wall -Wextra -Werror -std=c11</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <AppContent />
      </ProgressProvider>
    </ThemeProvider>
  );
}
