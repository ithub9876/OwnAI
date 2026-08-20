import React from 'react';
import {
  Terminal,
  Layers,
  Key,
  FolderGit2,
  Settings,
  Sparkles,
  Zap,
  Download,
  LogOut,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { AppScreen, ProjectEntity, User } from '../../types';
import { Badge } from './Badge';

interface HeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  projects: ProjectEntity[];
  activeProject: ProjectEntity | null;
  onSelectProject: (projectId: string) => void;
  user: User | null;
  onSignOut: () => void;
  onExportZip: () => void;
  activeRoutesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  projects,
  activeProject,
  onSelectProject,
  user,
  onSignOut,
  onExportZip,
  activeRoutesCount
}) => {
  return (
    <header className="h-14 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand & Project Switcher */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('LANDING')}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group"
          id="btn-brand-home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold font-mono text-sm tracking-tight text-white flex items-center gap-1.5">
              OwnAI
              <span className="text-[10px] font-sans font-semibold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40">
                BYOK
              </span>
            </span>
          </div>
        </button>

        {/* Project Selector Dropdown */}
        {activeProject && (
          <div className="relative group hidden sm:flex items-center">
            <div className="h-4 w-px bg-slate-800 mx-1" />
            <select
              value={activeProject.id}
              onChange={(e) => onSelectProject(e.target.value)}
              className="appearance-none bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono font-medium text-slate-200 py-1.5 pl-3 pr-8 rounded-md cursor-pointer focus:outline-none focus:border-blue-500 transition-colors"
              id="select-active-project"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Main Navigation Screen Pills */}
      <nav className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800/80">
        <button
          onClick={() => onNavigate('LANDING')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            currentScreen === 'LANDING'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          id="nav-landing"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Overview</span>
        </button>

        <button
          onClick={() => onNavigate('WORKSPACE')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            currentScreen === 'WORKSPACE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          id="nav-workspace"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>IDE Workspace</span>
        </button>

        <button
          onClick={() => onNavigate('ROUTING')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            currentScreen === 'ROUTING'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          id="nav-routing"
        >
          <Key className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Routes</span>
          <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono flex items-center justify-center border border-blue-500/30">
            {activeRoutesCount}
          </span>
        </button>

        <button
          onClick={() => onNavigate('PROJECTS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            currentScreen === 'PROJECTS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          id="nav-projects"
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Projects</span>
        </button>

        <button
          onClick={() => onNavigate('SETTINGS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            currentScreen === 'SETTINGS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          id="nav-settings"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Settings</span>
        </button>
      </nav>

      {/* Right Actions & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Export ZIP */}
        {activeProject && (
          <button
            onClick={onExportZip}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            title="Download full project as ZIP"
            id="btn-quick-export-zip"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export ZIP</span>
          </button>
        )}

        {/* User Pill / Login */}
        {user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('SETTINGS')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              id="btn-user-profile"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                {user.displayName.charAt(0)}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline max-w-[100px] truncate">
                {user.displayName}
              </span>
            </button>
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
              id="btn-sign-out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('AUTH')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
            id="btn-header-signin"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
