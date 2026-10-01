import React, { useEffect } from 'react';
import { useUIStore } from './store/uiStore';
import { useGenomeStore } from './store/genomeStore';
import { useProjectStore } from './store/projectStore';
import { useDebugStore } from './store/debugStore';
import { useIdeaStore } from './store/ideaStore';
import { useChallengeStore } from './store/challengeStore';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MobileNavigation from './components/layout/MobileNavigation';
import CommandPalette from './components/ui/CommandPalette';
import ToastContainer from './components/ui/ToastContainer';
import GenomeMatchBanner from './components/ui/GenomeMatchBanner';
import GenomeDetailModal from './components/ui/GenomeDetailModal';
import NewGenomeModal from './components/ui/NewGenomeModal';
import SettingsModal from './components/ui/SettingsModal';
import ProjectImportModal from './components/ui/ProjectImportModal';
import NewProjectModal from './components/ui/NewProjectModal';

import DashboardPage from './features/dashboard/DashboardPage';
import LibraryPage from './features/library/LibraryPage';
import WorkbenchPage from './features/workbench/WorkbenchPage';
import ProjectsPage from './features/projects/ProjectsPage';
import DebugLabPage from './features/debug/DebugLabPage';
import IdeasPage from './features/ideas/IdeasPage';
import ChallengesPage from './features/challenges/ChallengesPage';
import AIMentorPage from './features/ai/AIMentorPage';
import ProfilePage from './features/profile/ProfilePage';
import SettingsPage from './features/settings/SettingsPage';

export default function App() {
  const { activePage, lang, dir, theme } = useUIStore();
  const initializeGenomes = useGenomeStore((s) => s.initializeGenomes);
  const initializeProjects = useProjectStore((s) => s.initializeProjects);
  const initializeBugs = useDebugStore((s) => s.initializeBugs);
  const initializeIdeas = useIdeaStore((s) => s.initializeIdeas);
  const initializeChallenges = useChallengeStore((s) => s.initializeChallenges);

  // Initialize all databases & stores
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    initializeGenomes();
    initializeProjects();
    initializeBugs();
    initializeIdeas();
    initializeChallenges();
  }, [lang, dir, theme, initializeGenomes, initializeProjects, initializeBugs, initializeIdeas, initializeChallenges]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-genome-bg text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500/25 selection:text-emerald-700 dark:selection:text-emerald-300 transition-colors">
      {/* Global Sticky Header */}
      <Header />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Adaptive Desktop & Tablet Sidebar */}
        <Sidebar />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <GenomeMatchBanner />
          {activePage === 'home' && <DashboardPage />}
          {activePage === 'library' && <LibraryPage />}
          {activePage === 'workbench' && <WorkbenchPage />}
          {activePage === 'projects' && <ProjectsPage />}
          {activePage === 'debug' && <DebugLabPage />}
          {activePage === 'ideas' && <IdeasPage />}
          {activePage === 'challenges' && <ChallengesPage />}
          {activePage === 'ai' && <AIMentorPage />}
          {activePage === 'profile' && <ProfilePage />}
          {activePage === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Global Modals */}
      <GenomeDetailModal />
      <NewGenomeModal />
      <SettingsModal />
      <ProjectImportModal />
      <NewProjectModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}
