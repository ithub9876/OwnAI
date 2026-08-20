import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Download,
  Trash2,
  Star,
  ExternalLink,
  Code2,
  Terminal,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ProjectEntity } from '../../types';

interface ProjectsDashboardScreenProps {
  projects: ProjectEntity[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, description: string, template: string) => void;
  onDeleteProject: (id: string) => void;
  onExportProjectZip: (project: ProjectEntity) => void;
}

export const ProjectsDashboardScreen: React.FC<ProjectsDashboardScreenProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onExportProjectZip
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTemplate, setProjTemplate] = useState('Next.js 14 (App Router)');

  const templates = [
    { name: 'Next.js 14 (App Router)', desc: 'React 18 + Tailwind CSS + Lucide icons full-stack template', type: 'web' },
    { name: 'Python FastAPI', desc: 'Modern async Python backend with Pydantic validation & pytest', type: 'backend' },
    { name: 'React 18 + Vite', desc: 'Ultra-fast Single Page Application with Tailwind styling', type: 'web' },
    { name: 'Express.js + TypeScript', desc: 'Robust Node.js REST API with routing & middleware', type: 'backend' }
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projName.trim()) {
      onCreateProject(projName.trim(), projDesc.trim(), projTemplate);
      setProjName('');
      setProjDesc('');
      setIsCreateModalOpen(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 text-slate-100 p-6 max-w-6xl mx-auto w-full select-none">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <FolderGit2 className="w-5 h-5 text-blue-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
              Project Workspaces
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Isolated project sandboxes with live file trees, terminal execution, and autonomous agent loops.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20 self-start sm:self-auto"
          id="btn-create-new-project"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => {
          const isActive = project.id === activeProjectId;

          return (
            <div
              key={project.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group ${
                isActive
                  ? 'bg-slate-900/90 border-blue-500/80 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                {/* Card Top Pill */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-slate-800 text-slate-300">
                    {project.framework}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 font-semibold">
                      ACTIVE IDE
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-base text-white mb-2 leading-tight">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                  {project.description || 'Autonomous software repository.'}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4 py-2 border-y border-slate-800/80 text-xs font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500 block text-[10px]">FILES</span>
                    <span className="text-slate-200 font-bold">{project.filesCount} modules</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">TOTAL CODE</span>
                    <span className="text-slate-200 font-bold">{project.totalLines} lines</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => onSelectProject(project.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5" /> Launch IDE →
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onExportProjectZip(project)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Export as ZIP Archive"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete project "${project.name}"?`)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold font-mono text-white mb-4">Initialize Project Workspace</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Project Name</label>
                <input
                  type="text"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="e.g. Jarvis Portfolio & Agent OS"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Brief description of application goals..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 resize-none font-sans"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Starter Template</label>
                <div className="space-y-2">
                  {templates.map((tpl) => (
                    <label
                      key={tpl.name}
                      onClick={() => setProjTemplate(tpl.name)}
                      className={`block p-2.5 rounded-lg border cursor-pointer transition-all ${
                        projTemplate === tpl.name
                          ? 'bg-blue-600/10 border-blue-500 text-white'
                          : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{tpl.name}</span>
                        <span className="text-[10px] uppercase text-blue-400">{tpl.type}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">{tpl.desc}</p>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
                >
                  Create &amp; Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
