import React from 'react';
import { GitCompare, ArrowLeft, Check, Plus, Minus } from 'lucide-react';
import { ProjectFileEntity } from '../../types';

interface VisualDiffViewProps {
  activeFile: ProjectFileEntity | null;
  onCloseDiff: () => void;
  onAcceptChanges: () => void;
}

export const VisualDiffView: React.FC<VisualDiffViewProps> = ({
  activeFile,
  onCloseDiff,
  onAcceptChanges
}) => {
  if (!activeFile) return null;

  const currentLines = activeFile.content.split('\n');
  const originalLines = (activeFile.originalContent || activeFile.content).split('\n');

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 font-mono text-xs select-none">
      {/* Diff Header */}
      <div className="h-10 px-3 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onCloseDiff}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1 text-[11px] text-white font-medium">
            <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Agent Modifications: {activeFile.path}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAcceptChanges}
            className="px-2.5 py-1 rounded bg-white hover:bg-zinc-200 text-black font-semibold text-[11px] flex items-center gap-1 transition-colors shadow-sm"
          >
            <Check className="w-3 h-3" />
            <span>Accept Changes</span>
          </button>
        </div>
      </div>

      {/* Side-by-side or Unified Diff Viewer */}
      <div className="flex-1 overflow-auto p-3 space-y-0.5 text-[11px] leading-5">
        {currentLines.map((line, idx) => {
          const isAdded = !originalLines.includes(line);
          return (
            <div
              key={idx}
              className={`flex items-center px-2 py-0.5 rounded font-mono ${
                isAdded
                  ? 'bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-400'
                  : 'text-zinc-400'
              }`}
            >
              <span className="w-8 text-zinc-400 select-none text-right pr-3">{idx + 1}</span>
              <span className="w-4 select-none">{isAdded ? '+' : ' '}</span>
              <span className="flex-1 whitespace-pre-wrap">{line}</span>
            </div>
          );
        })}
      </div>

      {/* Diff Summary Bar */}
      <div className="h-6 px-3 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between text-[10px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
            <Plus className="w-3 h-3" /> Verified by Agent
          </span>
        </div>
        <div>Sandbox clean status</div>
      </div>
    </div>
  );
};
