import React, { useState } from 'react';
import {
  Terminal,
  Layers,
  Key,
  FolderGit2,
  Settings,
  Sparkles,
  Download,
  LogOut,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  Shield,
  ExternalLink
} from 'lucide-react';
import { AppScreen, ProjectEntity, User } from '../../types';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'LANDING' as AppScreen, label: 'Overview', icon: Sparkles },
    { id: 'WORKSPACE' as AppScreen, label: 'IDE Workspace', icon: Layers },
    { id: 'ROUTING' as AppScreen, label: 'AI Routes', icon: Key, count: activeRoutesCount },
    { id: 'PROJECTS' as AppScreen, label: 'Projects', icon: FolderGit2 },
    { id: 'SETTINGS' as AppScreen, label: 'Settings', icon: Settings }
  ];

  const handleMobileNav = (screen: AppScreen) => {
    onNavigate(screen);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="h-14 md:h-14 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between sticky top-0 z-50 select-none">
      {/* Brand & Project Switcher */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 -ml-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          aria-label="Toggle navigation menu"
          id="btn-mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <button
          onClick={() => onNavigate('LANDING')}
          className="flex items-center gap-2 sm:gap-2.5 hover:opacity-90 transition-opacity group"
          id="btn-brand-home"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold font-mono text-sm tracking-tight text-white flex items-center gap-1.5">
              OwnAI
              <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                BYOK
              </span>
            </span>
          </div>
        </button>

        {/* Project Selector Dropdown (Desktop) */}
        {activeProject && (
          <div className="relative group hidden sm:flex items-center">
            <div className="h-4 w-px bg-zinc-800 mx-1" />
            <select
              value={activeProject.id}
              onChange={(e) => onSelectProject(e.target.value)}
              className="appearance-none bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-medium text-zinc-200 py-1.5 pl-2.5 pr-7 rounded-md cursor-pointer focus:outline-none focus:border-zinc-500 transition-colors max-w-[140px] md:max-w-[200px] truncate"
              id="select-active-project"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-zinc-900 text-zinc-100">
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Main Navigation Screen Tabs (Desktop) */}
      <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800/90">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              id={`nav-${item.id.toLowerCase()}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className={`w-4 h-4 rounded-full text-[10px] font-mono flex items-center justify-center border ${
                  isActive ? 'bg-zinc-200 text-black border-zinc-300' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Actions & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Export ZIP */}
        {activeProject && (
          <button
            onClick={onExportZip}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
            title="Download full project as ZIP"
            id="btn-quick-export-zip"
          >
            <Download className="w-3.5 h-3.5 text-zinc-300" />
            <span>Export ZIP</span>
          </button>
        )}

        {/* User Pill / Login */}
        {user ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onNavigate('SETTINGS')}
              className="flex items-center gap-2 pl-1.5 pr-2.5 sm:pl-2 sm:pr-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
              id="btn-user-profile"
            >
              <div className="w-5 h-5 rounded-full bg-white text-[10px] font-bold text-black flex items-center justify-center">
                {user.displayName.charAt(0)}
              </div>
              <span className="text-xs font-medium text-zinc-200 hidden sm:inline max-w-[90px] truncate">
                {user.displayName}
              </span>
            </button>
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Sign Out"
              id="btn-sign-out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('AUTH')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-colors"
            id="btn-header-signin"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-14 z-50 bg-black/80 backdrop-blur-md md:hidden flex flex-col justify-between p-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-4">
            {/* Active Project Switcher for Mobile */}
            {activeProject && (
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                  Current Workspace
                </label>
                <select
                  value={activeProject.id}
                  onChange={(e) => {
                    onSelectProject(e.target.value);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 p-2.5 rounded-lg focus:outline-none focus:border-zinc-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.framework})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mobile Navigation List */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMobileNav(item.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                        isActive ? 'bg-black text-white border-black' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}>
                        {item.count} Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Quick Export ZIP */}
            {activeProject && (
              <button
                onClick={() => {
                  onExportZip();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono font-medium hover:bg-zinc-800"
              >
                <Download className="w-4 h-4 text-zinc-400" />
                <span>Export Project as ZIP</span>
              </button>
            )}
          </div>

          {/* User info at bottom of mobile menu */}
          <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center text-xs">
                  {user.displayName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-medium text-white">{user.displayName}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">{user.email}</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleMobileNav('AUTH')}
                className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs"
              >
                Sign In / Register
              </button>
            )}

            {user && (
              <button
                onClick={() => {
                  onSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

