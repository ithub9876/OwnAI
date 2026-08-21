import React from 'react';
import {
  Menu,
  Sparkles,
  Download,
  Plus,
  ArrowUpRight,
  Shield,
  Layers,
  ChevronRight,
  Activity,
  FolderGit2
} from 'lucide-react';
import { AppScreen, ProjectEntity, AiRouteEntity } from '../../types';

interface AppHeaderProps {
  currentScreen: AppScreen;
  activeProject: ProjectEntity | null;
  projects: ProjectEntity[];
  onSelectProject: (projectId: string) => void;
  onOpenNewProjectModal: () => void;
  onOpenMobileMenu: () => void;
  onDownloadZip?: () => void;
  activeRouteName: string;
  onNavigateToRouting: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentScreen,
  activeProject,
  projects,
  onSelectProject,
  onOpenNewProjectModal,
  onOpenMobileMenu,
  onDownloadZip,
  activeRouteName,
  onNavigateToRouting
}) => {
  return (
    <header className="h-12 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: Mobile menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors sm:hidden"
          id="btn-mobile-drawer"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono truncate">
          <span className="text-zinc-400 font-semibold">OwnAI</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />

          {currentScreen === 'WORKSPACE' && activeProject ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-white font-medium truncate">{activeProject.name}</span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-zinc-400 px-2 py-0.2 rounded border border-zinc-800 bg-zinc-900 font-mono">
                {activeProject.framework}
              </span>
            </div>
          ) : currentScreen === 'DASHBOARD' ? (
            <span className="text-white font-medium">Dashboard</span>
          ) : currentScreen === 'SETTINGS' ? (
            <span className="text-white font-medium">Settings</span>
          ) : currentScreen === 'AUTH' ? (
            <span className="text-white font-medium">Authentication</span>
          ) : (
            <span className="text-white font-medium">Overview</span>
          )}
        </div>
      </div>

      {/* Right: Active Model Route Pill & Quick Actions */}
      <div className="flex items-center gap-2">
        {/* Route status badge */}
        <button
          onClick={onNavigateToRouting}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800/80 text-zinc-300 transition-colors"
          title="Configure AI model routing"
          id="header-route-badge"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate max-w-[160px] md:max-w-[240px]">{activeRouteName}</span>
        </button>

        {/* In Workspace: Download ZIP */}
        {currentScreen === 'WORKSPACE' && onDownloadZip && (
          <button
            onClick={onDownloadZip}
            className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono transition-colors inline-flex items-center gap-1.5 shadow-sm"
            title="Download full project as ZIP archive"
            id="header-btn-download-zip"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export ZIP</span>
          </button>
        )}

        {/* Global + New Project action */}
        {currentScreen !== 'WORKSPACE' && (
          <button
            onClick={onOpenNewProjectModal}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-mono font-semibold transition-colors inline-flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
            id="header-btn-new-project"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        )}
      </div>
    </header>
  );
};
