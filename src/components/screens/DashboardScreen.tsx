import React from 'react';
import {
  FolderGit2,
  Plus,
  ArrowRight,
  KeyRound,
  Cpu,
  Route,
  Sparkles,
  Download,
  Trash2,
  ExternalLink,
  Clock,
  Code2,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Shield
} from 'lucide-react';
import { ProjectEntity, ApiKeyEntity, AiRouteEntity, User, SettingsTab } from '../../types';

interface DashboardScreenProps {
  user: User | null;
  projects: ProjectEntity[];
  apiKeys: ApiKeyEntity[];
  aiRoutes: AiRouteEntity[];
  onOpenNewProjectModal: () => void;
  onSelectProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDownloadProjectZip: (projectId: string) => void;
  onNavigateToSettings: (tab: SettingsTab) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  projects,
  apiKeys,
  aiRoutes,
  onOpenNewProjectModal,
  onSelectProject,
  onDeleteProject,
  onDownloadProjectZip,
  onNavigateToSettings
}) => {
  // Get dynamic time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const greeting = getGreeting();
  const userName = user?.displayName || 'Developer';

  // Onboarding statuses
  const connectedKeysCount = apiKeys.filter((k) => k.status === 'ACTIVE').length;
  const activeRoutesCount = aiRoutes.filter((r) => r.isEnabled).length;

  const isStep1Done = connectedKeysCount > 0;
  const isStep2Done = activeRoutesCount > 0;
  const isStep3Done = projects.length > 0;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 select-none">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Developer Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
            {greeting}, {userName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewProjectModal}
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-mono font-semibold transition-colors flex items-center gap-2 shadow-sm"
            id="dashboard-btn-new-project"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Onboarding Stepper Bar (if new or incomplete setup) */}
      <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Workspace Setup Progress
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {[isStep1Done, isStep2Done, isStep3Done].filter(Boolean).length} / 3 Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {/* Step 1: Connect AI */}
          <button
            onClick={() => onNavigateToSettings('keys')}
            className={`p-3.5 rounded-xl border text-left transition-colors flex items-start justify-between group ${
              isStep1Done
                ? 'bg-zinc-950/80 border-emerald-500/30 text-zinc-200'
                : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 text-zinc-400'
            }`}
            id="onboarding-step-1"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold ${isStep1Done ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  01
                </span>
                <span className="text-white font-semibold">Connect AI</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {isStep1Done
                  ? `${connectedKeysCount} provider key${connectedKeysCount > 1 ? 's' : ''} connected`
                  : 'Add your NVIDIA, OpenAI, Claude or Groq API keys'}
              </p>
            </div>
            {isStep1Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>

          {/* Step 2: Choose models */}
          <button
            onClick={() => onNavigateToSettings('models')}
            className={`p-3.5 rounded-xl border text-left transition-colors flex items-start justify-between group ${
              isStep2Done
                ? 'bg-zinc-950/80 border-emerald-500/30 text-zinc-200'
                : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 text-zinc-400'
            }`}
            id="onboarding-step-2"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold ${isStep2Done ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  02
                </span>
                <span className="text-white font-semibold">Choose Models</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {isStep2Done
                  ? `${activeRoutesCount} active model route${activeRoutesCount > 1 ? 's' : ''}`
                  : 'Discover and enable models for autonomous coding'}
              </p>
            </div>
            {isStep2Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>

          {/* Step 3: Create project */}
          <button
            onClick={onOpenNewProjectModal}
            className={`p-3.5 rounded-xl border text-left transition-colors flex items-start justify-between group ${
              isStep3Done
                ? 'bg-zinc-950/80 border-emerald-500/30 text-zinc-200'
                : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 text-zinc-400'
            }`}
            id="onboarding-step-3"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold ${isStep3Done ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  03
                </span>
                <span className="text-white font-semibold">Create Project</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {isStep3Done
                  ? `${projects.length} project workspace${projects.length > 1 ? 's' : ''} active`
                  : 'Scaffold your first Next.js, React or Python app'}
              </p>
            </div>
            {isStep3Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-white" />
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Project Workspaces ({projects.length})
            </h2>
          </div>
        </div>

        {projects.length === 0 ? (
          /* Empty Projects State */
          <div className="p-8 sm:p-12 rounded-2xl border border-zinc-800 bg-zinc-900/20 text-center space-y-4 font-mono">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <FolderGit2 className="w-6 h-6 text-zinc-400" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-1">Your workspace is empty.</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Create your first project and start building with your AI agent. Choose a template or start with a blank canvas.
              </p>
            </div>

            <button
              onClick={onOpenNewProjectModal}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold font-mono inline-flex items-center gap-2 transition-colors shadow-sm"
              id="empty-state-btn-new-project"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Project</span>
            </button>
          </div>
        ) : (
          /* Actual Compact Project Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-400 font-mono">
                      {project.framework}
                    </span>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-zinc-200 transition-colors">
                    {project.name}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed font-sans">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{project.filesCount || 4} files</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDownloadProjectZip(project.id)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                      title="Download ZIP"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectProject(project.id)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-white hover:text-black text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Security & BYOK Architecture Card */}
      <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-white font-semibold">Zero Telemetry BYOK Routing Active</div>
            <div className="text-[11px] text-zinc-400">
              API keys are encrypted locally with AES-256-GCM.
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateToSettings('keys')}
          className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-300 text-xs transition-colors shrink-0 self-start sm:self-center"
        >
          Manage Keys &amp; Routes
        </button>
      </div>
    </div>
  );
};
