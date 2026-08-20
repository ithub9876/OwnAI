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
  FolderGit2,
  Sliders,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  MessageSquare
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

type MobileWorkspaceView = 'EDITOR' | 'AGENT' | 'FILES' | 'PREVIEW' | 'TERMINAL' | 'DIFF' | 'ATTACHMENTS';

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

  // Mobile dedicated active view state
  const [mobileView, setMobileView] = useState<MobileWorkspaceView>('EDITOR');

  const handleOpenDiff = (targetPath?: string) => {
    setDiffTargetFile(targetPath || activeFilePath);
    onSwitchTab('DIFF_INSPECTOR');
    setMobileView('DIFF');
  };

  const handleMobileFileSelect = (path: string) => {
    onSelectFile(path);
    onSwitchTab('EDITOR');
    setMobileView('EDITOR');
  };

  const mobileTabs = [
    { id: 'EDITOR' as MobileWorkspaceView, label: 'Editor', icon: FileCode },
    { id: 'AGENT' as MobileWorkspaceView, label: 'Agent', icon: Sparkles, badge: isAgentRunning ? 'RUN' : undefined },
    { id: 'FILES' as MobileWorkspaceView, label: 'Files', icon: FolderGit2, count: files.length },
    { id: 'PREVIEW' as MobileWorkspaceView, label: 'Preview', icon: Eye },
    { id: 'TERMINAL' as MobileWorkspaceView, label: 'CLI', icon: Terminal },
    { id: 'DIFF' as MobileWorkspaceView, label: 'Diff', icon: GitCompare }
  ];

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden select-none">
      {/* Mobile Top View Switcher Bar (< lg) */}
      <div className="lg:hidden h-12 bg-zinc-950 border-b border-zinc-800/90 px-2 flex items-center justify-between overflow-x-auto gap-1">
        <div className="flex items-center gap-1 w-full overflow-x-auto py-1">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = mobileView === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setMobileView(tab.id);
                  if (tab.id === 'EDITOR') onSwitchTab('EDITOR');
                  if (tab.id === 'PREVIEW') onSwitchTab('LIVE_PREVIEW');
                  if (tab.id === 'TERMINAL') onSwitchTab('TERMINAL');
                  if (tab.id === 'DIFF') onSwitchTab('DIFF_INSPECTOR');
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all flex-shrink-0 min-h-[38px] ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 rounded-full ${
                    isActive ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Workspace Sub-Toolbar (>= lg) */}
      <div className="hidden lg:flex h-10 bg-zinc-900 border-b border-zinc-800/80 px-4 items-center justify-between">
        {/* Left Side: Explorer / Attachment Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title={isLeftPanelOpen ? 'Collapse Left Panel' : 'Expand Left Panel'}
          >
            {isLeftPanelOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-md border border-zinc-800">
            <button
              onClick={() => {
                setLeftNavTab('FILES');
                setIsLeftPanelOpen(true);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                leftNavTab === 'FILES' && isLeftPanelOpen
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
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
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Attachments ({attachments.length})
            </button>
          </div>
        </div>

        {/* Center: Main View Switcher */}
        <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-md border border-zinc-800">
          <button
            onClick={() => onSwitchTab('EDITOR')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeTab === 'EDITOR'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
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
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
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
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            id="tab-preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={() => onSwitchTab('TERMINAL')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeTab === 'TERMINAL'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            id="tab-terminal"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CLI Terminal</span>
          </button>
        </div>

        {/* Right Side: Toggle Agent Panel */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              isRightPanelOpen
                ? 'bg-white text-black font-bold border border-white'
                : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Agent Panel</span>
            {isAgentRunning && <span className="w-2 h-2 rounded-full bg-black animate-ping ml-1" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      {/* 1. Mobile Fullscreen Mode View (< lg) */}
      <div className="lg:hidden flex-1 flex flex-col min-h-0 bg-zinc-950">
        {mobileView === 'EDITOR' && (
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

        {mobileView === 'AGENT' && (
          <AgentChatView
            messages={messages}
            steps={steps}
            isAgentRunning={isAgentRunning}
            currentRunningStep={currentRunningStep}
            onSendMessage={onSendAgentPrompt}
            onOpenDiff={handleOpenDiff}
            activeRouteName={activeRouteName}
          />
        )}

        {mobileView === 'FILES' && (
          <FileExplorerView
            files={files}
            activeFilePath={activeFilePath}
            onSelectFile={handleMobileFileSelect}
            onCreateFile={onCreateFile}
            onCreateFolder={onCreateFolder}
            onDeleteFile={onDeleteFile}
            onDuplicateFile={onDuplicateFile}
            onRenameFile={onRenameFile}
          />
        )}

        {mobileView === 'PREVIEW' && (
          <LivePreviewView files={files} projectName={project.name} />
        )}

        {mobileView === 'TERMINAL' && (
          <TerminalView
            terminalOutput={terminalOutput}
            onExecuteCommand={onExecuteTerminalCommand}
            isExecuting={isExecutingCommand}
            cpuUsage={cpuUsage}
            ramUsage={ramUsage}
            onClearTerminal={onClearTerminal}
          />
        )}

        {mobileView === 'DIFF' && (
          <VisualDiffView
            files={files}
            targetFilePath={diffTargetFile || activeFilePath}
            onSelectTargetFile={(path) => setDiffTargetFile(path)}
            onClose={() => {
              onSwitchTab('EDITOR');
              setMobileView('EDITOR');
            }}
          />
        )}

        {mobileView === 'ATTACHMENTS' && (
          <AttachmentsView
            attachments={attachments}
            onAddAttachment={onAddAttachment}
            onDeleteAttachment={onDeleteAttachment}
          />
        )}
      </div>

      {/* 2. Desktop 3-Column IDE Workspace Grid (>= lg) */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Left Column: Explorer or Attachments */}
        {isLeftPanelOpen && (
          <div className="w-64 flex-shrink-0 h-full border-r border-zinc-800/80 bg-zinc-950">
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
        <div className="flex-1 h-full flex flex-col bg-zinc-950 min-w-0">
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
          <div className="w-80 md:w-96 flex-shrink-0 h-full bg-zinc-950 border-l border-zinc-800/80">
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

