import React, { useState, useEffect } from 'react';
import {
  Save,
  Copy,
  Check,
  X,
  FileCode,
  Sparkles,
  GitCompare,
  Eye,
  Terminal as TerminalIcon
} from 'lucide-react';
import { ProjectFileEntity, WorkspaceTab } from '../../types';

interface CodeEditorViewProps {
  files: ProjectFileEntity[];
  activeFilePath: string | null;
  openFiles: string[];
  onSelectFile: (path: string) => void;
  onCloseFileTab: (path: string) => void;
  onSaveFileContent: (path: string, newContent: string) => void;
  onOpenDiffModal: (path: string) => void;
  onSwitchTab: (tab: WorkspaceTab) => void;
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({
  files,
  activeFilePath,
  openFiles,
  onSelectFile,
  onCloseFileTab,
  onSaveFileContent,
  onOpenDiffModal,
  onSwitchTab
}) => {
  const activeFile = files.find((f) => f.path === activeFilePath);
  const [editorContent, setEditorContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content);
    } else {
      setEditorContent('');
    }
  }, [activeFile?.path, activeFile?.content]);

  const isDirty = activeFile ? editorContent !== activeFile.content : false;

  const handleSave = () => {
    if (activeFile) {
      onSaveFileContent(activeFile.path, editorContent);
      setIsSavedRecently(true);
      setTimeout(() => setIsSavedRecently(false), 2000);
    }
  };

  const handleCopy = () => {
    if (editorContent) {
      navigator.clipboard.writeText(editorContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const lines = editorContent.split('\n');

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-200 select-none">
      {/* File Tabs Bar */}
      <div className="h-10 bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-between px-2 overflow-x-auto">
        <div className="flex items-center gap-1 overflow-x-auto">
          {openFiles.map((path) => {
            const file = files.find((f) => f.path === path);
            const isActive = activeFilePath === path;
            const fileName = path.split('/').pop() || path;

            return (
              <div
                key={path}
                onClick={() => onSelectFile(path)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-t text-xs font-mono cursor-pointer transition-all border-t-2 ${
                  isActive
                    ? 'bg-zinc-900 text-white border-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border-transparent'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                <span className="truncate max-w-[140px]">{fileName}</span>
                {file?.gitStatus === 'MODIFIED' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" title="Modified" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseFileTab(path);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:bg-zinc-800 p-0.5 rounded text-zinc-400 hover:text-white transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick Tool Switches */}
        <div className="flex items-center gap-1">
          {activeFile && (
            <button
              onClick={() => onOpenDiffModal(activeFile.path)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
              title="Inspect Visual Diff"
            >
              <GitCompare className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Diff</span>
            </button>
          )}
          <button
            onClick={() => onSwitchTab('LIVE_PREVIEW')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
            title="Live Web Preview"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={() => onSwitchTab('TERMINAL')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
            title="Sandbox Terminal"
          >
            <TerminalIcon className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden sm:inline">CLI</span>
          </button>
        </div>
      </div>

      {/* Editor Sub-Header / Breadcrumbs */}
      {activeFile ? (
        <div className="px-3 sm:px-4 py-1.5 bg-zinc-900/70 border-b border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2 truncate">
            <span className="text-zinc-500">workspace /</span>
            <span className="text-zinc-100 font-semibold">{activeFile.path}</span>
            {isDirty && <span className="text-white bg-zinc-800 px-1.5 py-0.2 rounded text-[10px] border border-zinc-700">Modified</span>}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-zinc-800"
              title="Copy code"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden xs:inline">{isCopied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={!isDirty}
              className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium text-xs transition-all ${
                isDirty
                  ? 'bg-white hover:bg-zinc-200 text-black shadow-sm font-semibold'
                  : isSavedRecently
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'bg-zinc-900 text-zinc-600 border border-zinc-850 cursor-not-allowed'
              }`}
              id="btn-save-code"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavedRecently ? 'Saved!' : 'Save'}</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Code Editor Body */}
      {activeFile ? (
        <div className="flex-1 flex overflow-hidden font-mono text-xs md:text-sm bg-zinc-950">
          {/* Gutter Line Numbers */}
          <div className="w-10 sm:w-12 bg-zinc-950 border-r border-zinc-900 py-3 text-right pr-2 sm:pr-3 select-none text-zinc-600 font-mono">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Text Area Code Editor */}
          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            spellCheck={false}
            className="flex-1 p-3 bg-transparent text-zinc-100 resize-none focus:outline-none font-mono leading-6 whitespace-pre overflow-auto selection:bg-zinc-700 selection:text-white"
            style={{ tabSize: 2 }}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-500">
          <FileCode className="w-12 h-12 text-zinc-700 mb-3" />
          <p className="text-sm font-mono text-zinc-300">No file open in workspace.</p>
          <p className="text-xs text-zinc-500 mt-1">Select a file from the explorer on the left to start editing.</p>
        </div>
      )}

      {/* Editor Status Bar */}
      {activeFile && (
        <div className="h-6 bg-zinc-900 border-t border-zinc-800/80 px-3 sm:px-4 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3 sm:gap-4">
            <span>Lines: {lines.length}</span>
            <span>Size: {activeFile.sizeBytes} B</span>
            <span>Lang: {activeFile.language}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>Sandbox Synced</span>
          </div>
        </div>
      )}
    </div>
  );
};
