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
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-100 select-none">
      {/* Header Bar */}
      <div className="h-12 bg-zinc-900 border-b border-zinc-800/80 px-3 md:px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Back to Editor"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-white" />
            <span className="font-mono font-bold text-sm text-white">Visual Diff Inspector</span>
          </div>
        </div>

        {/* Change Stats */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="flex items-center gap-1 text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
              <Plus className="w-3 h-3" /> {addedCount}
            </span>
            <span className="flex items-center gap-1 text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              <Minus className="w-3 h-3" /> {removedCount}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white hover:bg-zinc-200 text-black font-semibold rounded text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" /> Accept
          </button>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="bg-zinc-950 border-b border-zinc-800/80 px-3 py-1 flex items-center gap-1 overflow-x-auto">
        <span className="text-[11px] font-mono text-zinc-500 uppercase mr-2 flex-shrink-0">Files:</span>
        {files.map((file) => {
          const isSelected = activeFile?.path === file.path;
          const isMod = file.gitStatus === 'MODIFIED' || file.content !== file.originalContent;
          return (
            <button
              key={file.path}
              onClick={() => onSelectTargetFile(file.path)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all flex-shrink-0 ${
                isSelected
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>{file.name}</span>
              {isMod && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          );
        })}
      </div>

      {/* Unified Diff View Table */}
      <div className="flex-1 overflow-auto font-mono text-xs bg-zinc-950">
        {activeFile ? (
          <div className="min-w-full">
            {diffLines.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
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
                        ? 'bg-zinc-850 text-white border-l-4 border-white'
                        : isRemoved
                        ? 'bg-zinc-900/80 text-zinc-500 border-l-4 border-zinc-700 line-through opacity-75'
                        : 'text-zinc-300 hover:bg-zinc-900/40'
                    }`}
                  >
                    {/* Line numbers */}
                    <div className="w-10 py-0.5 text-right pr-2 text-zinc-600 select-none bg-zinc-950/50">
                      {line.originalLineNumber || ''}
                    </div>
                    <div className="w-10 py-0.5 text-right pr-2 text-zinc-600 select-none bg-zinc-950/50 border-r border-zinc-900">
                      {line.modifiedLineNumber || ''}
                    </div>

                    {/* Diff Marker (+, -, space) */}
                    <div className="w-6 py-0.5 text-center font-bold select-none text-zinc-400">
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
          <div className="p-8 text-center text-zinc-500">Select a file to inspect diff.</div>
        )}
      </div>

      {/* Footer Info */}
      <div className="h-7 bg-zinc-900 border-t border-zinc-800 px-4 flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <span>Unified Git Diff Model</span>
        <span>Verified Sandbox Working Tree</span>
      </div>
    </div>
  );
};
