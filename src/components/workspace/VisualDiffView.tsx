import React, { useState } from 'react';
import {
  GitCompare,
  Check,
  X,
  FileCode,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';
import { ProjectFileEntity } from '../../types';

interface VisualDiffViewProps {
  files: ProjectFileEntity[];
  targetFilePath: string | null;
  onSelectTargetFile: (path: string) => void;
  onClose: () => void;
  onRevertFile?: (path: string) => void;
}

interface DiffLine {
  type: 'same' | 'added' | 'removed';
  originalLineNumber?: number;
  modifiedLineNumber?: number;
  text: string;
}

export const VisualDiffView: React.FC<VisualDiffViewProps> = ({
  files,
  targetFilePath,
  onSelectTargetFile,
  onClose,
  onRevertFile
}) => {
  const modifiedFiles = files.filter((f) => f.gitStatus === 'MODIFIED' || f.content !== f.originalContent);
  const activeFile = files.find((f) => f.path === targetFilePath) || modifiedFiles[0] || files[0];

  // Compute unified diff lines
  const computeDiff = (orig: string, mod: string): { diffLines: DiffLine[]; addedCount: number; removedCount: number } => {
    const origLines = orig ? orig.split('\n') : [];
    const modLines = mod ? mod.split('\n') : [];

    const diffLines: DiffLine[] = [];
    let addedCount = 0;
    let removedCount = 0;

    // Simple LCS or line comparison
    let origIdx = 0;
    let modIdx = 0;

    while (origIdx < origLines.length || modIdx < modLines.length) {
      if (origIdx < origLines.length && modIdx < modLines.length) {
        if (origLines[origIdx] === modLines[modIdx]) {
          diffLines.push({
            type: 'same',
            originalLineNumber: origIdx + 1,
            modifiedLineNumber: modIdx + 1,
            text: origLines[origIdx]
          });
          origIdx++;
          modIdx++;
        } else {
          // Check if modified line matches later
          const foundMatchInMod = modLines.slice(modIdx, modIdx + 5).indexOf(origLines[origIdx]);
          if (foundMatchInMod !== -1) {
            // Lines were added in mod
            for (let k = 0; k < foundMatchInMod; k++) {
              diffLines.push({
                type: 'added',
                modifiedLineNumber: modIdx + 1,
                text: modLines[modIdx]
              });
              addedCount++;
              modIdx++;
            }
          } else {
            // Line removed in orig
            diffLines.push({
              type: 'removed',
              originalLineNumber: origIdx + 1,
              text: origLines[origIdx]
            });
            removedCount++;
            origIdx++;

            // And also add new line
            if (modIdx < modLines.length) {
              diffLines.push({
                type: 'added',
                modifiedLineNumber: modIdx + 1,
                text: modLines[modIdx]
              });
              addedCount++;
              modIdx++;
            }
          }
        }
      } else if (origIdx < origLines.length) {
        diffLines.push({
          type: 'removed',
          originalLineNumber: origIdx + 1,
          text: origLines[origIdx]
        });
        removedCount++;
        origIdx++;
      } else {
        diffLines.push({
          type: 'added',
          modifiedLineNumber: modIdx + 1,
          text: modLines[modIdx]
        });
        addedCount++;
        modIdx++;
      }
    }

    return { diffLines, addedCount, removedCount };
  };

  const { diffLines, addedCount, removedCount } = activeFile
    ? computeDiff(activeFile.originalContent, activeFile.content)
    : { diffLines: [], addedCount: 0, removedCount: 0 };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Header Bar */}
      <div className="h-12 bg-slate-900 border-b border-slate-800/80 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Back to Editor"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-blue-400" />
            <span className="font-mono font-bold text-sm text-white">Visual Diff Inspector</span>
          </div>
        </div>

        {/* Change Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Plus className="w-3 h-3" /> {addedCount} lines
            </span>
            <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              <Minus className="w-3 h-3" /> {removedCount} lines
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> Keep Changes
          </button>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-3 py-1 flex items-center gap-1 overflow-x-auto">
        <span className="text-[11px] font-mono text-slate-500 uppercase mr-2">Files:</span>
        {files.map((file) => {
          const isSelected = activeFile?.path === file.path;
          const isMod = file.gitStatus === 'MODIFIED' || file.content !== file.originalContent;
          return (
            <button
              key={file.path}
              onClick={() => onSelectTargetFile(file.path)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                isSelected
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>{file.name}</span>
              {isMod && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </button>
          );
        })}
      </div>

      {/* Unified Diff View Table */}
      <div className="flex-1 overflow-auto font-mono text-xs bg-slate-950">
        {activeFile ? (
          <div className="min-w-full">
            {diffLines.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No differences detected between original and working tree for {activeFile.path}.
              </div>
            ) : (
              diffLines.map((line, idx) => {
                const isAdded = line.type === 'added';
                const isRemoved = line.type === 'removed';

                return (
                  <div
                    key={idx}
                    className={`flex items-start leading-5 transition-colors ${
                      isAdded
                        ? 'bg-emerald-950/40 text-emerald-300 border-l-4 border-emerald-500'
                        : isRemoved
                        ? 'bg-rose-950/40 text-rose-400 border-l-4 border-rose-500 line-through opacity-80'
                        : 'text-slate-300 hover:bg-slate-900/40'
                    }`}
                  >
                    {/* Line numbers */}
                    <div className="w-10 py-0.5 text-right pr-2 text-slate-600 select-none bg-slate-950/50">
                      {line.originalLineNumber || ''}
                    </div>
                    <div className="w-10 py-0.5 text-right pr-2 text-slate-600 select-none bg-slate-950/50 border-r border-slate-900">
                      {line.modifiedLineNumber || ''}
                    </div>

                    {/* Diff Marker (+, -, space) */}
                    <div className="w-6 py-0.5 text-center font-bold select-none">
                      {isAdded ? '+' : isRemoved ? '-' : ' '}
                    </div>

                    {/* Code line */}
                    <div className="flex-1 py-0.5 px-2 whitespace-pre overflow-x-auto">
                      {line.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">Select a file to inspect diff.</div>
        )}
      </div>

      {/* Footer Info */}
      <div className="h-7 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>Unified Git Diff Model (Agent Autonomous Touch)</span>
        <span>Verified Against Container Sandbox</span>
      </div>
    </div>
  );
};
