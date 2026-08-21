import React, { useState } from 'react';
import {
  Layers,
  FolderGit2,
  Cpu,
  KeyRound,
  Route,
  Settings,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Code2,
  Terminal,
  LogOut,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';
import { AppScreen, SettingsTab, ProjectEntity, User as UserType } from '../../types';

interface AppSidebarProps {
  currentScreen: AppScreen;
  activeProjectId: string | null;
  projects: ProjectEntity[];
  onNavigate: (screen: AppScreen, subTab?: SettingsTab) => void;
  onSelectProject: (projectId: string) => void;
  onOpenNewProjectModal: () => void;
  user: UserType | null;
  onSignOut: () => void;
  isMobileDrawerOpen: boolean;
  onCloseMobileDrawer: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentScreen,
  activeProjectId,
  projects,
  onNavigate,
  onSelectProject,
  onOpenNewProjectModal,
  user,
  onSignOut,
  isMobileDrawerOpen,
  onCloseMobileDrawer
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none bg-zinc-950 font-mono">
      {/* Top Header & Brand */}
      <div>
        <div className="h-12 border-b border-zinc-800/80 flex items-center justify-between px-3">
          {!isCollapsed ? (
            <button
              onClick={() => onNavigate('DASHBOARD')}
              className="flex items-center gap-2 text-left group"
              id="sidebar-brand-btn"
            >
              <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-mono font-bold text-xs">
                O
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-semibold text-sm text-white tracking-tight">OwnAI</span>
                <span className="text-[10px] font-mono text-zinc-400 px-1 py-0.2 rounded border border-zinc-800 bg-zinc-900">
                  v2.5
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('DASHBOARD')}
              className="w-8 h-8 mx-auto rounded-md bg-white text-black flex items-center justify-center font-mono font-bold text-xs"
              title="OwnAI Dashboard"
            >
              O
            </button>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors hidden sm:flex items-center justify-center"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            id="btn-toggle-sidebar"
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobileDrawer}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors sm:hidden"
            title="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {/* Main Section */}
          <div className="space-y-0.5">
            <button
              onClick={() => onNavigate('DASHBOARD')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                currentScreen === 'DASHBOARD'
                  ? 'bg-zinc-800/90 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
              title="Dashboard Overview"
              id="nav-dashboard"
            >
              <Layers className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </button>
          </div>

          {/* AI Settings Section */}
          <div className="space-y-0.5 pt-2 border-t border-zinc-800/60">
            {!isCollapsed && (
              <div className="px-2.5 pb-1 text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                AI &amp; Models
              </div>
            )}

            <button
              onClick={() => onNavigate('SETTINGS', 'keys')}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900/60"
              title="API Keys (BYOK)"
              id="nav-keys"
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>API Keys</span>}
              </div>
            </button>

            <button
              onClick={() => onNavigate('SETTINGS', 'models')}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900/60"
              title="Models Discovery"
              id="nav-models"
            >
              <Cpu className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Models</span>}
            </button>

            <button
              onClick={() => onNavigate('SETTINGS', 'routing')}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900/60"
              title="Multi-Provider Routing"
              id="nav-routing"
            >
              <Route className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Routing</span>}
            </button>
          </div>

          {/* Projects Tree Section */}
          <div className="space-y-1 pt-2 border-t border-zinc-800/60">
            <div className="flex items-center justify-between px-2.5 pb-1">
              {!isCollapsed && (
                <span className="text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Workspaces ({projects.length})
                </span>
              )}
              <button
                onClick={onOpenNewProjectModal}
                className="p-0.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Create project"
                id="sidebar-btn-new-project"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {projects.length === 0 ? (
              !isCollapsed && (
                <div className="px-2.5 py-2 text-[11px] font-mono text-zinc-400 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
                  No projects yet. Click + to scaffold one.
                </div>
              )
            ) : (
              <div className="space-y-0.5 max-h-40 overflow-y-auto">
                {projects.map((proj) => {
                  const isSelected = proj.id === activeProjectId && currentScreen === 'WORKSPACE';
                  return (
                    <button
                      key={proj.id}
                      onClick={() => onSelectProject(proj.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs font-mono text-left transition-colors ${
                        isSelected
                          ? 'bg-zinc-800 text-white font-medium shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
                        {!isCollapsed && <span className="truncate">{proj.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <span className="text-[9px] text-zinc-400 font-mono">
                          {proj.framework.split(' ')[0]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Profile & Settings */}
      <div className="p-2 border-t border-zinc-800/80 space-y-1">
        <button
          onClick={() => onNavigate('SETTINGS', 'general')}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            currentScreen === 'SETTINGS'
              ? 'bg-zinc-800/90 text-white font-medium'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
          }`}
          title="Settings"
          id="nav-settings"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {user ? (
          <div className="pt-1 flex items-center justify-between px-1">
            {!isCollapsed ? (
              <div className="flex items-center gap-2 min-w-0 pr-1">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-5 h-5 rounded-full object-cover border border-zinc-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white text-black font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="truncate text-left">
                  <div className="text-xs font-medium text-white truncate font-mono">{user.displayName}</div>
                </div>
              </div>
            ) : null}

            <button
              onClick={onSignOut}
              className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors"
              title="Sign out"
              id="sidebar-btn-signout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('AUTH')}
            className="w-full py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-mono flex items-center justify-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            {!isCollapsed && <span>Sign In</span>}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden sm:flex flex-col h-screen border-r border-zinc-800/80 transition-all duration-200 shrink-0 ${
          isCollapsed ? 'w-14' : 'w-56'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCloseMobileDrawer}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-zinc-950 shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
