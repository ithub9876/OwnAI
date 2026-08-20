import React, { useState } from 'react';
import {
  FileCode,
  Layers,
  Terminal,
  Eye,
  GitCompare,
  Upload,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import {
  AgentStepEntity,
  AttachmentEntity,
  ConversationMessageEntity,
  ProjectEntity,
  ProjectFileEntity,
  WorkspaceTab
} from '../../types';
import { FileExplorerView } from '../workspace/FileExplorerView';
import { CodeEditorView } from '../workspace/CodeEditorView';
import { VisualDiffView } from '../workspace/VisualDiffView';
import { LivePreviewView } from '../workspace/LivePreviewView';
import { TerminalView } from '../workspace/TerminalView';
import { AgentChatView } from '../workspace/AgentChatView';
import { AttachmentsView } from '../workspace/AttachmentsView';

interface WorkspaceScreenProps {
  project: ProjectEntity;
  files: ProjectFileEntity[];
  activeFilePath: string | null;
  openFiles: string[];
  activeTab: WorkspaceTab;
  messages: ConversationMessageEntity[];
  steps: AgentStepEntity[];
  attachments: AttachmentEntity[];
  isAgentRunning: boolean;
  currentRunningStep: string;
  terminalOutput: string;
  isExecutingCommand: boolean;
  cpuUsage: number;
  ramUsage: number;
  activeRouteName: string;
  onSelectFile: (path: string) => void;
  onCloseFileTab: (path: string) => void;
  onSaveFileContent: (path: string, content: string) => void;
  onCreateFile: (path: string) => void;
  onCreateFolder: (folderPath: string) => void;
  onDeleteFile: (path: string) => void;
  onDuplicateFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
  onSwitchTab: (tab: WorkspaceTab) => void;
  onSendAgentPrompt: (prompt: string) => void;
  onExecuteTerminalCommand: (cmd: string) => void;
  onClearTerminal: () => void;
  onAddAttachment: (name: string, mime: string, data: string, isVision: boolean) => void;
  onDeleteAttachment: (id: string) => void;
}

export const WorkspaceScreen: React.FC<WorkspaceScreenProps> = ({
  project,
  files,
  activeFilePath,
  openFiles,
  activeTab,
  messages,
  steps,
  attachments,
  isAgentRunning,
  currentRunningStep,
  terminalOutput,
  isExecutingCommand,
  cpuUsage,
  ramUsage,
  activeRouteName,
  onSelectFile,
  onCloseFileTab,
  onSaveFileContent,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onDuplicateFile,
  onRenameFile,
  onSwitchTab,
  onSendAgentPrompt,
  onExecuteTerminalCommand,
  onClearTerminal,
  onAddAttachment,
  onDeleteAttachment
}) => {
  const [leftNavTab, setLeftNavTab] = useState<'FILES' | 'ATTACHMENTS'>('FILES');
  const [diffTargetFile, setDiffTargetFile] = useState<string | null>(activeFilePath);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const handleOpenDiff = (targetPath?: string) => {
    setDiffTargetFile(targetPath || activeFilePath);
    onSwitchTab('DIFF_INSPECTOR');
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Workspace Sub-Toolbar */}
      <div className="h-10 bg-slate-900 border-b border-slate-800/80 px-4 flex items-center justify-between">
        {/* Left Side: Explorer / Attachment Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => {
                setLeftNavTab('FILES');
                setIsLeftPanelOpen(true);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                leftNavTab === 'FILES' && isLeftPanelOpen
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Files ({files.length})
            </button>
            <button
              onClick={() => {
                setLeftNavTab('ATTACHMENTS');
                setIsLeftPanelOpen(true);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                leftNavTab === 'ATTACHMENTS' && isLeftPanelOpen
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Attachments ({attachments.length})
            </button>
          </div>
        </div>

        {/* Center: Main View Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
          <button
            onClick={() => onSwitchTab('EDITOR')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeTab === 'EDITOR'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-editor"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>

          <button
            onClick={() => onSwitchTab('DIFF_INSPECTOR')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeTab === 'DIFF_INSPECTOR'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-diff"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Visual Diff</span>
          </button>

          <button
            onClick={() => onSwitchTab('LIVE_PREVIEW')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeTab === 'LIVE_PREVIEW'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-preview"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={() => onSwitchTab('TERMINAL')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeTab === 'TERMINAL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-terminal"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>CLI Terminal</span>
          </button>
        </div>

        {/* Right Side: Toggle Panel buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              isRightPanelOpen
                ? 'bg-slate-800 text-blue-400 border border-slate-700'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Agent Panel</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column IDE Workspace Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Explorer or Attachments */}
        {isLeftPanelOpen && (
          <div className="w-64 flex-shrink-0 h-full border-r border-slate-800/80 bg-slate-950">
            {leftNavTab === 'FILES' ? (
              <FileExplorerView
                files={files}
                activeFilePath={activeFilePath}
                onSelectFile={(path) => {
                  onSelectFile(path);
                  onSwitchTab('EDITOR');
                }}
                onCreateFile={onCreateFile}
                onCreateFolder={onCreateFolder}
                onDeleteFile={onDeleteFile}
                onDuplicateFile={onDuplicateFile}
                onRenameFile={onRenameFile}
              />
            ) : (
              <AttachmentsView
                attachments={attachments}
                onAddAttachment={onAddAttachment}
                onDeleteAttachment={onDeleteAttachment}
              />
            )}
          </div>
        )}

        {/* Center Column: Active Main Workspace View */}
        <div className="flex-1 h-full flex flex-col bg-slate-950 min-w-0">
          {activeTab === 'EDITOR' && (
            <CodeEditorView
              files={files}
              activeFilePath={activeFilePath}
              openFiles={openFiles}
              onSelectFile={onSelectFile}
              onCloseFileTab={onCloseFileTab}
              onSaveFileContent={onSaveFileContent}
              onOpenDiffModal={handleOpenDiff}
              onSwitchTab={onSwitchTab}
            />
          )}

          {activeTab === 'DIFF_INSPECTOR' && (
            <VisualDiffView
              files={files}
              targetFilePath={diffTargetFile || activeFilePath}
              onSelectTargetFile={(path) => setDiffTargetFile(path)}
              onClose={() => onSwitchTab('EDITOR')}
            />
          )}

          {activeTab === 'LIVE_PREVIEW' && (
            <LivePreviewView files={files} projectName={project.name} />
          )}

          {activeTab === 'TERMINAL' && (
            <TerminalView
              terminalOutput={terminalOutput}
              onExecuteCommand={onExecuteTerminalCommand}
              isExecuting={isExecutingCommand}
              cpuUsage={cpuUsage}
              ramUsage={ramUsage}
              onClearTerminal={onClearTerminal}
            />
          )}
        </div>

        {/* Right Column: Agent Chat & Autonomous Step Tracker */}
        {isRightPanelOpen && (
          <div className="w-80 md:w-96 flex-shrink-0 h-full bg-slate-950 border-l border-slate-800/80">
            <AgentChatView
              messages={messages}
              steps={steps}
              isAgentRunning={isAgentRunning}
              currentRunningStep={currentRunningStep}
              onSendMessage={onSendAgentPrompt}
              onOpenDiff={handleOpenDiff}
              activeRouteName={activeRouteName}
            />
          </div>
        )}
      </div>
    </div>
  );
};
