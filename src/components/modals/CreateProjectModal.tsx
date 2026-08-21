import React, { useState } from 'react';
import {
  X,
  Plus,
  Code2,
  Sparkles,
  Layers,
  Terminal,
  FileCode,
  ArrowRight,
  Shield
} from 'lucide-react';
import { AiRouteEntity } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string, description: string, template: string) => void;
  aiRoutes: AiRouteEntity[];
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  aiRoutes
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState('Next.js 14 (App Router)');
  const [aiRoutingMode, setAiRoutingMode] = useState('AUTOMATIC');

  if (!isOpen) return null;

  const templates = [
    {
      id: 'React 18 + Vite',
      label: 'React 18 + Vite',
      desc: 'Single-page client application with Tailwind CSS and Lucide icons.',
      badge: 'Client SPA'
    },
    {
      id: 'Next.js 14 (App Router)',
      label: 'Next.js 14 (App Router)',
      desc: 'Full-stack React server components with file-based routing.',
      badge: 'Full-Stack'
    },
    {
      id: 'HTML / CSS / JS',
      label: 'HTML / CSS / JS',
      desc: 'Vanilla web stack for rapid landing pages and clean prototypes.',
      badge: 'Vanilla'
    },
    {
      id: 'Python (FastAPI)',
      label: 'Python (FastAPI + Pydantic)',
      desc: 'High-performance backend API with automatic OpenAPI specs.',
      badge: 'Backend API'
    },
    {
      id: 'Blank Canvas',
      label: 'Blank Workspace',
      desc: 'Empty canvas ready for complete custom architecture.',
      badge: 'Minimal'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProject(name.trim(), description.trim(), template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden font-mono text-xs animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="h-12 px-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white text-black flex items-center justify-center font-bold text-xs">
              +
            </div>
            <span className="font-bold text-white text-sm">Create New Project</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Project Name */}
          <div>
            <label className="text-zinc-400 block mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ecommerce-store, portfolio, neural-api"
              required
              autoFocus
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500 text-xs"
              id="input-project-name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-zinc-400 block mb-1">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of application goals..."
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500 text-xs font-sans"
              id="input-project-desc"
            />
          </div>

          {/* Template Selection */}
          <div>
            <label className="text-zinc-400 block mb-1.5">Architecture Template</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between ${
                    template === t.id
                      ? 'border-white bg-zinc-800/80 text-white font-medium'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-400'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-white mb-0.5">{t.label}</div>
                    <div className="text-[11px] text-zinc-400 truncate font-sans">{t.desc}</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded border border-zinc-800 bg-zinc-900 shrink-0">
                    {t.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Routing Selection */}
          <div>
            <label className="text-zinc-400 block mb-1">Autonomous AI Routing</label>
            <select
              value={aiRoutingMode}
              onChange={(e) => setAiRoutingMode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
            >
              <option value="AUTOMATIC">Automatic Failover Chain (Recommended)</option>
              {aiRoutes.map((r) => (
                <option key={r.id} value={r.id}>
                  Manual: {r.name} ({r.provider.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              id="btn-create-project-submit"
            >
              <span>Create Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
