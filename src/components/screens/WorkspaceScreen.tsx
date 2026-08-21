import React, { useState } from 'react';
import {
  MessageSquare,
  Code2,
  Play,
  Terminal,
  FolderGit2,
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  GitCompare,
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import {
  ProjectEntity,
  ProjectFileEntity,
  ChatMessageEntity,
  AgentExecutionStep,
  TerminalCommandOutput,
  AttachmentPayload
} from '../../types';
import { FileExplorerView } from '../workspace/FileExplorerView';
import { AgentChatView } from '../workspace/AgentChatView';
import { CodeEditorView } from '../workspace/CodeEditorView';
import { VisualDiffView } from '../workspace/VisualDiffView';
import { LivePreviewView } from '../workspace/LivePreviewView';
import { TerminalView } from '../workspace/TerminalView';

interface WorkspaceScreenProps {
  project: ProjectEntity;
  files: ProjectFileEntity[];
  messages: ChatMessageEntity[];
  currentSteps: AgentExecutionStep[];
  isAgentRunning: boolean;
  activeModelName: string;
  onSendMessage: (content: string, attachments: AttachmentPayload[]) => void;
  onStopAgent: () => void;
  onSaveFile: (fileId: string, newContent: string) => void;
  onCreateFile: (path: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newPath: string) => void;
  onDownloadZip: () => void;
}

export const WorkspaceScreen: React.FC<WorkspaceScreenProps> = ({
  project,
  files,
  messages,
  currentSteps,
  isAgentRunning,
  activeModelName,
  onSendMessage,
  onStopAgent,
  onSaveFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  onDownloadZip
}) => {
  // Active selected file path
  const [activeFilePath, setActiveFilePath] = useState<string>(
    files[0]?.path || 'src/App.tsx'
  );

  // Center panel view mode on desktop
  const [centerViewMode, setCenterViewMode] = useState<'chat' | 'code' | 'diff' | 'terminal'>('chat');

  // Mobile active tab view mode (Single full-screen view at a time)
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview' | 'files' | 'terminal'>('chat');

  // Desktop side panels collapse state
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Terminal commands state
  const [terminalOutputs, setTerminalOutputs] = useState<TerminalCommandOutput[]>([
    {
      id: 'term_init',
      command: 'npm run dev',
      output: `> ${project.name}@0.1.0 dev\n> vite --host 0.0.0.0 --port 3000\n\n  VITE v5.4.2  ready in 240 ms\n\n  ➜  Local:   http://localhost:3000/\n  ➜  Network: http://0.0.0.0:3000/\n  ➜  press h + enter to show help`,
      timestamp: Date.now()
    }
  ]);

  const activeFile = files.find((f) => f.path === activeFilePath) || files[0] || null;

  const handleSelectFile = (path: string) => {
    setActiveFilePath(path);
    setCenterViewMode('code');
    setMobileTab('files');
  };

  const handleExecuteTerminalCommand = (cmd: string) => {
    let output = '';
    const trimmed = cmd.toLowerCase().trim();

    if (trimmed === 'ls' || trimmed === 'ls -la') {
      output = files.map((f) => `${f.gitStatus === 'MODIFIED' ? 'M' : '-'} rw-r--r-- 1 dev staff 1024 ${f.path}`).join('\n');
    } else if (trimmed.includes('npm run build') || trimmed.includes('npm test')) {
      output = `✓ Compiling application bundle with Vite\n✓ Generated static chunks\n✓ Sandbox verification passed with 0 errors.`;
    } else if (trimmed === 'git status') {
      output = `On branch main\nChanges to be committed:\n${files
        .filter((f) => f.gitStatus === 'MODIFIED')
        .map((f) => `\tmodified:   ${f.path}`)
        .join('\n') || '\tnothing to commit, working tree clean'}`;
    } else {
      output = `[Sandbox Command Executed: ${cmd}] -> Done in 45ms.`;
    }

    setTerminalOutputs((prev) => [
      ...prev,
      {
        id: `term_${Date.now()}`,
        command: cmd,
        output,
        timestamp: Date.now()
      }
    ]);
  };

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 overflow-hidden select-none">
      {/* Workspace Sub-Toolbar */}
      <div className="h-10 border-b border-zinc-800/80 bg-zinc-950 px-3 flex items-center justify-between text-xs font-mono shrink-0">
        {/* Left: Project title & container status */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
              {project.name}
            </span>
          </div>

          <span className="hidden sm:inline-flex text-[10px] text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-800 bg-zinc-900">
            {project.framework}
          </span>
        </div>

        {/* Center: Desktop View Mode Selector */}
        <div className="hidden md:flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
          <button
            onClick={() => setCenterViewMode('chat')}
            className={`px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 transition-colors ${
              centerViewMode === 'chat'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-zinc-400" />
            <span>Agent Chat</span>
          </button>

          <button
            onClick={() => setCenterViewMode('code')}
            className={`px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 transition-colors ${
              centerViewMode === 'code'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3 h-3 text-zinc-400" />
            <span>Code Editor</span>
          </button>

          <button
            onClick={() => setCenterViewMode('terminal')}
            className={`px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 transition-colors ${
              centerViewMode === 'terminal'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3 h-3 text-zinc-400" />
            <span>Terminal</span>
          </button>
        </div>

        {/* Right: Panel Toggles on Desktop */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowFileExplorer(!showFileExplorer)}
            className={`hidden lg:flex items-center gap-1 px-2 py-1 rounded text-[10px] border transition-colors ${
              showFileExplorer
                ? 'border-zinc-700 bg-zinc-800 text-white'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
            title="Toggle File Tree"
          >
            <FolderGit2 className="w-3 h-3" />
            <span>Tree</span>
          </button>

          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`hidden lg:flex items-center gap-1 px-2 py-1 rounded text-[10px] border transition-colors ${
              showLivePreview
                ? 'border-zinc-700 bg-zinc-800 text-white'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
            title="Toggle Preview Panel"
          >
            <Play className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Main Desktop 3-Panel Layout / Mobile Responsive Container */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* DESKTOP LAYOUT (md and up) */}
        <div className="hidden md:flex flex-1 min-h-0">
          {/* Panel 1: File Explorer (240px) */}
          {showFileExplorer && (
            <div className="w-60 h-full shrink-0">
              <FileExplorerView
                files={files}
                activeFilePath={activeFilePath}
                onSelectFile={handleSelectFile}
                onCreateFile={onCreateFile}
                onDeleteFile={onDeleteFile}
                onRenameFile={onRenameFile}
                onDownloadZip={onDownloadZip}
              />
            </div>
          )}

          {/* Panel 2: Center Editor / Chat / Terminal / Diff */}
          <div className="flex-1 h-full min-w-0 bg-zinc-950 flex flex-col justify-between">
            {centerViewMode === 'chat' ? (
              <AgentChatView
                messages={messages}
                currentSteps={currentSteps}
                isAgentRunning={isAgentRunning}
                onSendMessage={onSendMessage}
                onStopAgent={onStopAgent}
                activeModelName={activeModelName}
              />
            ) : centerViewMode === 'code' ? (
              <CodeEditorView
                activeFile={activeFile}
                onSaveFile={onSaveFile}
                onToggleDiffView={() => setCenterViewMode('diff')}
                isDiffAvailable={!!activeFile?.originalContent}
              />
            ) : centerViewMode === 'diff' ? (
              <VisualDiffView
                activeFile={activeFile}
                onCloseDiff={() => setCenterViewMode('code')}
                onAcceptChanges={() => setCenterViewMode('code')}
              />
            ) : (
              <TerminalView
                outputs={terminalOutputs}
                onExecuteCommand={handleExecuteTerminalCommand}
                onClear={() => setTerminalOutputs([])}
              />
            )}
          </div>

          {/* Panel 3: Live Preview (420px+) */}
          {showLivePreview && (
            <div className="w-[420px] lg:w-[480px] xl:w-[560px] h-full shrink-0">
              <LivePreviewView
                files={files}
                projectName={project.name}
                framework={project.framework}
              />
            </div>
          )}
        </div>

        {/* MOBILE FULL-SCREEN SINGLE-VIEW LAYOUT */}
        <div className="flex-1 md:hidden flex flex-col justify-between min-h-0 bg-zinc-950">
          <div className="flex-1 min-h-0 overflow-hidden">
            {mobileTab === 'chat' && (
              <AgentChatView
                messages={messages}
                currentSteps={currentSteps}
                isAgentRunning={isAgentRunning}
                onSendMessage={onSendMessage}
                onStopAgent={onStopAgent}
                activeModelName={activeModelName}
              />
            )}

            {mobileTab === 'preview' && (
              <LivePreviewView
                files={files}
                projectName={project.name}
                framework={project.framework}
              />
            )}

            {mobileTab === 'files' && (
              <div className="h-full flex flex-col">
                <div className="h-1/2 border-b border-zinc-800">
                  <FileExplorerView
                    files={files}
                    activeFilePath={activeFilePath}
                    onSelectFile={handleSelectFile}
                    onCreateFile={onCreateFile}
                    onDeleteFile={onDeleteFile}
                    onRenameFile={onRenameFile}
                    onDownloadZip={onDownloadZip}
                  />
                </div>
                <div className="h-1/2">
                  <CodeEditorView
                    activeFile={activeFile}
                    onSaveFile={onSaveFile}
                    onToggleDiffView={() => {}}
                    isDiffAvailable={false}
                  />
                </div>
              </div>
            )}

            {mobileTab === 'terminal' && (
              <TerminalView
                outputs={terminalOutputs}
                onExecuteCommand={handleExecuteTerminalCommand}
                onClear={() => setTerminalOutputs([])}
              />
            )}
          </div>

          {/* Mobile Bottom Navigation Bar */}
          <div className="h-14 border-t border-zinc-800/80 bg-zinc-950 px-3 flex items-center justify-around font-mono text-xs shrink-0">
            <button
              onClick={() => setMobileTab('chat')}
              className={`flex flex-col items-center gap-1 p-1 transition-colors ${
                mobileTab === 'chat' ? 'text-white font-bold' : 'text-zinc-400'
              }`}
              id="btn-mobile-nav-chat"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-[10px]">Chat</span>
            </button>

            <button
              onClick={() => setMobileTab('preview')}
              className={`flex flex-col items-center gap-1 p-1 transition-colors ${
                mobileTab === 'preview' ? 'text-white font-bold' : 'text-zinc-400'
              }`}
              id="btn-mobile-nav-preview"
            >
              <Play className="w-4 h-4" />
              <span className="text-[10px]">Preview</span>
            </button>

            <button
              onClick={() => setMobileTab('files')}
              className={`flex flex-col items-center gap-1 p-1 transition-colors ${
                mobileTab === 'files' ? 'text-white font-bold' : 'text-zinc-400'
              }`}
              id="btn-mobile-nav-files"
            >
              <Code2 className="w-4 h-4" />
              <span className="text-[10px]">Files</span>
            </button>

            <button
              onClick={() => setMobileTab('terminal')}
              className={`flex flex-col items-center gap-1 p-1 transition-colors ${
                mobileTab === 'terminal' ? 'text-white font-bold' : 'text-zinc-400'
              }`}
              id="btn-mobile-nav-terminal"
            >
              <Terminal className="w-4 h-4" />
              <span className="text-[10px]">Terminal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
