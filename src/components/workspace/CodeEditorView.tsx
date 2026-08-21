import React, { useState, useEffect } from 'react';
import {
  Save,
  Copy,
  Check,
  Code2,
  GitCompare,
  FileCode
} from 'lucide-react';
import { ProjectFileEntity } from '../../types';

interface CodeEditorViewProps {
  activeFile: ProjectFileEntity | null;
  onSaveFile: (fileId: string, newContent: string) => void;
  onToggleDiffView: () => void;
  isDiffAvailable: boolean;
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({
  activeFile,
  onSaveFile,
  onToggleDiffView,
  isDiffAvailable
}) => {
  const [content, setContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    if (activeFile) {
      setContent(activeFile.content);
      setIsSaved(true);
    }
  }, [activeFile]);

  if (!activeFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400 font-mono text-xs select-none">
        <FileCode className="w-8 h-8 text-zinc-400 mb-2" />
        <p>No file selected.</p>
        <p className="text-[11px] text-zinc-400">Select a file from the explorer to view or edit code.</p>
      </div>
    );
  }

  const handleContentChange = (newVal: string) => {
    setContent(newVal);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveFile(activeFile.id, content);
    setIsSaved(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  // Split lines for line numbers
  const lines = content.split('\n');

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 font-mono text-xs select-none">
      {/* Top File Tab Bar */}
      <div className="h-10 px-3 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-white font-medium text-[11px]">
            <Code2 className="w-3.5 h-3.5 text-zinc-400" />
            <span className="truncate">{activeFile.path}</span>
            {!isSaved && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isDiffAvailable && (
            <button
              onClick={onToggleDiffView}
              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-[11px] flex items-center gap-1 transition-colors"
              title="Compare agent modifications"
            >
              <GitCompare className="w-3 h-3" />
              <span>Diff</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Copy file content"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`px-2.5 py-1 rounded text-[11px] flex items-center gap-1 font-semibold transition-colors ${
              isSaved
                ? 'bg-zinc-900 text-zinc-400 border border-zinc-800 opacity-50'
                : 'bg-white hover:bg-zinc-200 text-black shadow-sm'
            }`}
          >
            <Save className="w-3 h-3" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div className="w-10 py-3 bg-zinc-950/80 text-right pr-3 select-none text-zinc-400 text-[11px] font-mono border-r border-zinc-850 overflow-hidden">
          {lines.map((_, i) => (
            <div key={i} className="leading-5">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
              handleSave();
            }
          }}
          className="flex-1 p-3 bg-transparent text-zinc-200 font-mono text-[12px] leading-5 focus:outline-none resize-none overflow-auto selection:bg-zinc-800"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="h-6 px-3 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between text-[10px] text-zinc-400">
        <div>{lines.length} lines • UTF-8</div>
        <div>TypeScript / React</div>
      </div>
    </div>
  );
};
