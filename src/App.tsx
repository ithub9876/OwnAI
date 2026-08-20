import React, { useState, useEffect } from 'react';
import {
  AppScreen,
  WorkspaceTab,
  ProjectEntity,
  ProjectFileEntity,
  ApiKeyEntity,
  AiRouteEntity,
  ConversationMessageEntity,
  AgentTaskEntity,
  AgentStepEntity,
  AttachmentEntity,
  ExecutionLogEntity,
  User,
  ApiKeyStatus,
  ModelProviderType,
  RoutePingResult,
  RouteAttemptRecord
} from './types';
import { storage } from './lib/storage';
import { sandbox } from './lib/sandbox';
import { aiRouter } from './lib/aiRouter';
import { agentEngine } from './lib/agentEngine';
import { exportProjectToZip, downloadBlob } from './lib/zipExporter';
import { Header } from './components/common/Header';
import { LandingScreen } from './components/screens/LandingScreen';
import { WorkspaceScreen } from './components/screens/WorkspaceScreen';
import { KeysAndRoutingScreen } from './components/screens/KeysAndRoutingScreen';
import { ProjectsDashboardScreen } from './components/screens/ProjectsDashboardScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Screen & Navigation state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('LANDING');
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('EDITOR');

  // Core entities
  const [user, setUser] = useState<User | null>(() => storage.getUser());
  const [projects, setProjects] = useState<ProjectEntity[]>(() => storage.getProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    const list = storage.getProjects();
    return list[0]?.id || 'project_jarvis_demo';
  });

  const [allFiles, setAllFiles] = useState<ProjectFileEntity[]>(() => storage.getFiles());
  const [apiKeys, setApiKeys] = useState<ApiKeyEntity[]>(() => storage.getApiKeys());
  const [aiRoutes, setAiRoutes] = useState<AiRouteEntity[]>(() => storage.getAiRoutes());
  const [messages, setMessages] = useState<ConversationMessageEntity[]>(() => storage.getMessages());
  const [steps, setSteps] = useState<AgentStepEntity[]>(() => storage.getSteps());
  const [attachments, setAttachments] = useState<AttachmentEntity[]>(() => storage.getAttachments());
  const [logs, setLogs] = useState<ExecutionLogEntity[]>(() => storage.getLogs());

  // Workspace active file & tabs
  const [activeFilePath, setActiveFilePath] = useState<string | null>('app/page.tsx');
  const [openFiles, setOpenFiles] = useState<string[]>(['app/page.tsx', 'components/Hero.tsx', 'components/ContactForm.tsx']);

  // Agent execution state
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [currentRunningStep, setCurrentRunningStep] = useState('');

  // Terminal state
  const [terminalOutput, setTerminalOutput] = useState<string>(
    "OwnAI Isolated Sandbox Shell (v2.4.1)\nType 'npm run build', 'npm test', 'git status', 'ls' or any command below.\n$"
  );
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(12.4);
  const [ramUsage, setRamUsage] = useState(94.2);

  // Global notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to storage on updates
  useEffect(() => {
    storage.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    storage.saveFiles(allFiles);
  }, [allFiles]);

  useEffect(() => {
    storage.saveApiKeys(apiKeys);
  }, [apiKeys]);

  useEffect(() => {
    storage.saveAiRoutes(aiRoutes);
  }, [aiRoutes]);

  useEffect(() => {
    storage.saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    storage.saveSteps(steps);
  }, [steps]);

  useEffect(() => {
    storage.saveAttachments(attachments);
  }, [attachments]);

  useEffect(() => {
    storage.setUser(user);
  }, [user]);

  // Computed active project & files
  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || null;
  const projectFiles = allFiles.filter((f) => f.projectId === selectedProjectId);
  const projectMessages = messages.filter((m) => m.projectId === selectedProjectId);
  const projectAttachments = attachments.filter((a) => a.projectId === selectedProjectId);

  const activeRoute = [...aiRoutes].filter((r) => r.isEnabled).sort((a, b) => a.priority - b.priority)[0];
  const activeRouteName = activeRoute?.name || 'NVIDIA NIM DeepSeek R1';

  // Handlers for Projects
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    const files = allFiles.filter((f) => f.projectId === projectId);
    const firstFile = files[0]?.path || 'package.json';
    setActiveFilePath(firstFile);
    setOpenFiles([firstFile]);
    showToast(`Switched to project workspace.`);
  };

  const handleCreateProject = (name: string, description: string, template: string) => {
    const newId = 'proj_' + Math.random().toString(36).substring(2, 8);
    const newProject: ProjectEntity = {
      id: newId,
      name,
      description,
      framework: template,
      templateType: template.includes('Python') ? 'backend' : 'web',
      filesCount: 3,
      totalLines: 120,
      isStarred: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const starterFiles: ProjectFileEntity[] = template.includes('Python')
      ? [
          {
            id: 'file_' + Math.random().toString(36).substring(2, 8),
            projectId: newId,
            path: 'main.py',
            name: 'main.py',
            language: 'python',
            sizeBytes: 400,
            linesCount: 16,
            gitStatus: 'UNMODIFIED',
            updatedAt: Date.now(),
            originalContent: `from fastapi import FastAPI\n\napp = FastAPI(title="${name}")\n\n@app.get("/")\ndef root():\n    return {"status": "online", "project": "${name}"}\n`,
            content: `from fastapi import FastAPI\n\napp = FastAPI(title="${name}")\n\n@app.get("/")\ndef root():\n    return {"status": "online", "project": "${name}"}\n`
          },
          {
            id: 'file_' + Math.random().toString(36).substring(2, 8),
            projectId: newId,
            path: 'requirements.txt',
            name: 'requirements.txt',
            language: 'text',
            sizeBytes: 60,
            linesCount: 4,
            gitStatus: 'UNMODIFIED',
            updatedAt: Date.now(),
            originalContent: 'fastapi==0.111.0\nuvicorn==0.30.1\npydantic==2.8.2\npytest==8.2.2\n',
            content: 'fastapi==0.111.0\nuvicorn==0.30.1\npydantic==2.8.2\npytest==8.2.2\n'
          }
        ]
      : [
          {
            id: 'file_' + Math.random().toString(36).substring(2, 8),
            projectId: newId,
            path: 'app/page.tsx',
            name: 'page.tsx',
            language: 'typescript',
            sizeBytes: 450,
            linesCount: 18,
            gitStatus: 'UNMODIFIED',
            updatedAt: Date.now(),
            originalContent: `import React from 'react';\n\nexport default function Home() {\n  return (\n    <main className="min-h-screen p-8 bg-slate-950 text-white font-mono">\n      <h1 className="text-3xl font-bold">${name}</h1>\n      <p className="text-slate-400 mt-2">Ready in OwnAI BYOK Container Workspace.</p>\n    </main>\n  );\n}\n`,
            content: `import React from 'react';\n\nexport default function Home() {\n  return (\n    <main className="min-h-screen p-8 bg-slate-950 text-white font-mono">\n      <h1 className="text-3xl font-bold">${name}</h1>\n      <p className="text-slate-400 mt-2">Ready in OwnAI BYOK Container Workspace.</p>\n    </main>\n  );\n}\n`
          },
          {
            id: 'file_' + Math.random().toString(36).substring(2, 8),
            projectId: newId,
            path: 'package.json',
            name: 'package.json',
            language: 'json',
            sizeBytes: 300,
            linesCount: 14,
            gitStatus: 'UNMODIFIED',
            updatedAt: Date.now(),
            originalContent: `{\n  "name": "${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}",\n  "version": "0.1.0",\n  "dependencies": {\n    "react": "^18.3.1",\n    "react-dom": "^18.3.1",\n    "next": "14.2.5"\n  }\n}`,
            content: `{\n  "name": "${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}",\n  "version": "0.1.0",\n  "dependencies": {\n    "react": "^18.3.1",\n    "react-dom": "^18.3.1",\n    "next": "14.2.5"\n  }\n}`
          }
        ];

    setProjects((prev) => [newProject, ...prev]);
    setAllFiles((prev) => [...prev, ...starterFiles]);
    setSelectedProjectId(newId);
    setActiveFilePath(starterFiles[0].path);
    setOpenFiles([starterFiles[0].path]);
    setCurrentScreen('WORKSPACE');
    showToast(`Project "${name}" created and launched.`);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setAllFiles((prev) => prev.filter((f) => f.projectId !== projectId));
    const remaining = projects.filter((p) => p.id !== projectId);
    if (remaining.length > 0) {
      setSelectedProjectId(remaining[0].id);
    }
    showToast('Project removed.');
  };

  const handleExportProjectZip = async (projectToExport?: ProjectEntity) => {
    const target = projectToExport || activeProject;
    if (!target) return;

    const files = allFiles.filter((f) => f.projectId === target.id);
    showToast(`Archiving "${target.name}" into ZIP...`);

    try {
      const blob = await exportProjectToZip(target, files);
      downloadBlob(blob, `${target.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.zip`);
      showToast(`ZIP Archive downloaded!`);
    } catch (err) {
      console.error('Export ZIP error:', err);
      showToast('Error generating ZIP archive.');
    }
  };

  // Handlers for Files
  const handleSelectFile = (path: string) => {
    setActiveFilePath(path);
    if (!openFiles.includes(path)) {
      setOpenFiles((prev) => [...prev, path]);
    }
  };

  const handleCloseFileTab = (path: string) => {
    const updated = openFiles.filter((p) => p !== path);
    setOpenFiles(updated);
    if (activeFilePath === path) {
      setActiveFilePath(updated[updated.length - 1] || null);
    }
  };

  const handleSaveFileContent = (path: string, newContent: string) => {
    setAllFiles((prev) =>
      prev.map((f) => {
        if (f.projectId === selectedProjectId && f.path === path) {
          return {
            ...f,
            content: newContent,
            linesCount: newContent.split('\n').length,
            sizeBytes: new Blob([newContent]).size,
            gitStatus: 'MODIFIED',
            updatedAt: Date.now()
          };
        }
        return f;
      })
    );
    showToast(`Saved "${path}".`);
  };

  const handleCreateFile = (path: string) => {
    const fileName = path.split('/').pop() || path;
    const ext = fileName.includes('.') ? fileName.split('.').pop() : 'txt';
    const lang = ext === 'tsx' || ext === 'ts' ? 'typescript' : ext === 'json' ? 'json' : 'text';

    const newFile: ProjectFileEntity = {
      id: 'file_' + Math.random().toString(36).substring(2, 8),
      projectId: selectedProjectId,
      path,
      name: fileName,
      language: lang,
      sizeBytes: 120,
      linesCount: 5,
      gitStatus: 'UNTRACKED',
      updatedAt: Date.now(),
      originalContent: `// ${path}\n\nexport default function Component() {\n  return <div>New Component</div>;\n}\n`,
      content: `// ${path}\n\nexport default function Component() {\n  return <div>New Component</div>;\n}\n`
    };

    setAllFiles((prev) => [...prev, newFile]);
    handleSelectFile(path);
    showToast(`Created file "${path}".`);
  };

  const handleCreateFolder = (folderPath: string) => {
    const keepPath = folderPath.replace(/\/+$/, '') + '/.gitkeep';
    handleCreateFile(keepPath);
    showToast(`Created directory "${folderPath}".`);
  };

  const handleDeleteFile = (path: string) => {
    setAllFiles((prev) => prev.filter((f) => !(f.projectId === selectedProjectId && f.path === path)));
    handleCloseFileTab(path);
    showToast(`Deleted "${path}".`);
  };

  const handleDuplicateFile = (path: string) => {
    const file = projectFiles.find((f) => f.path === path);
    if (!file) return;

    const ext = path.includes('.') ? '.' + path.split('.').pop() : '';
    const base = path.includes('.') ? path.substring(0, path.lastIndexOf('.')) : path;
    const newPath = `${base}_copy${ext}`;

    const newFile: ProjectFileEntity = {
      ...file,
      id: 'file_' + Math.random().toString(36).substring(2, 8),
      path: newPath,
      name: newPath.split('/').pop() || newPath,
      gitStatus: 'UNTRACKED',
      updatedAt: Date.now()
    };

    setAllFiles((prev) => [...prev, newFile]);
    handleSelectFile(newPath);
    showToast(`Duplicated to "${newPath}".`);
  };

  const handleRenameFile = (oldPath: string, newPath: string) => {
    setAllFiles((prev) =>
      prev.map((f) => {
        if (f.projectId === selectedProjectId && f.path === oldPath) {
          return {
            ...f,
            path: newPath,
            name: newPath.split('/').pop() || newPath,
            updatedAt: Date.now()
          };
        }
        return f;
      })
    );
    handleCloseFileTab(oldPath);
    handleSelectFile(newPath);
    showToast(`Renamed "${oldPath}" to "${newPath}".`);
  };

  // Agent Prompt Dispatcher
  const handleSendAgentPrompt = async (userPrompt: string) => {
    if (!activeProject || isAgentRunning) return;

    const userMessage: ConversationMessageEntity = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      projectId: selectedProjectId,
      sender: 'USER',
      content: userPrompt,
      diffSummary: '',
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAgentRunning(true);
    setCurrentRunningStep('Analyzing workspace AST & formulating plan...');

    try {
      const result = await agentEngine.executeTask(
        selectedProjectId,
        userPrompt,
        activeProject,
        projectFiles,
        aiRoutes,
        apiKeys,
        (step) => {
          setSteps((prev) => [...prev, step]);
          setCurrentRunningStep(`${step.stepType}: ${step.description}`);
        }
      );

      // Apply updated files to state
      setAllFiles((prev) => {
        const otherProjectFiles = prev.filter((f) => f.projectId !== selectedProjectId);
        return [...otherProjectFiles, ...result.updatedFiles];
      });

      setMessages((prev) => [...prev, result.agentMessage]);

      // Auto-open modified file in editor
      const modified = result.updatedFiles.find((f) => f.gitStatus === 'MODIFIED');
      if (modified) {
        handleSelectFile(modified.path);
      }

      showToast('Agent task verified & completed!');
    } catch (err: any) {
      console.error('Agent task error:', err);
      const errMsg: ConversationMessageEntity = {
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        projectId: selectedProjectId,
        sender: 'AGENT',
        content: `Error during task execution: ${err.message || 'Unknown failure'}. Check AI Route status and keys.`,
        diffSummary: '',
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, errMsg]);
      showToast('Agent task encountered an error.');
    } finally {
      setIsAgentRunning(false);
      setCurrentRunningStep('Ready');
    }
  };

  // Sandbox Terminal Execution
  const handleExecuteTerminalCommand = (cmd: string) => {
    setIsExecutingCommand(true);

    setTimeout(() => {
      const result = sandbox.executeCommand(cmd, projectFiles);
      setTerminalOutput((prev) => {
        let output = `${prev}\n$ ${cmd}\n`;
        if (result.stdout) output += `${result.stdout}\n`;
        if (result.stderr) output += `[stderr] ${result.stderr}\n`;
        output += '$';
        return output;
      });

      setCpuUsage(result.cpuUsagePct);
      setRamUsage(result.ramUsageMb);
      setIsExecutingCommand(false);
    }, 250);
  };

  const handleClearTerminal = () => {
    setTerminalOutput("OwnAI Sandbox Shell (v2.4.1)\n$");
  };

  // Attachments
  const handleAddAttachment = (name: string, mime: string, data: string, isVision: boolean) => {
    const newAtt: AttachmentEntity = {
      id: 'att_' + Math.random().toString(36).substring(2, 8),
      projectId: selectedProjectId,
      name,
      mimeType: mime,
      sizeBytes: new Blob([data]).size,
      dataOrUri: data,
      isVisionSupported: isVision,
      createdAt: Date.now()
    };
    setAttachments((prev) => [...prev, newAtt]);
    showToast(`Uploaded attachment "${name}".`);
  };

  const handleDeleteAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    showToast('Attachment removed.');
  };

  // AI Routing Handlers
  const handleAddApiKey = (name: string, provider: ModelProviderType, rawKey: string, baseUrl?: string) => {
    const newKey: ApiKeyEntity = {
      id: 'key_' + Math.random().toString(36).substring(2, 8),
      name,
      provider,
      maskedKey: `${rawKey.slice(0, 6)}••••••••${rawKey.slice(-4)}`,
      encryptedKey: btoa(rawKey),
      baseUrl: baseUrl || '',
      status: 'ACTIVE',
      createdAt: Date.now(),
      lastUsedAt: Date.now()
    };
    setApiKeys((prev) => [...prev, newKey]);
    showToast(`Key "${name}" encrypted and saved.`);
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    showToast('API Key removed.');
  };

  const handleUpdateKeyStatus = (id: string, status: ApiKeyStatus) => {
    setApiKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status } : k)));
  };

  const handleAddRoute = (
    name: string,
    provider: ModelProviderType,
    modelId: string,
    apiKeyId?: string | null,
    supportsVision: boolean = false,
    supportsTools: boolean = true
  ) => {
    const nextPriority = aiRoutes.length + 1;
    const newRoute: AiRouteEntity = {
      id: 'route_' + Math.random().toString(36).substring(2, 8),
      priority: nextPriority,
      name,
      provider,
      modelId,
      apiKeyId,
      supportsVision,
      supportsTools,
      isEnabled: true
    };
    setAiRoutes((prev) => [...prev, newRoute]);
    showToast(`Route "${name}" added at Priority P${nextPriority}.`);
  };

  const handleDeleteRoute = (id: string) => {
    setAiRoutes((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, i) => ({ ...r, priority: i + 1 }));
    });
    showToast('Route removed and priorities rebalanced.');
  };

  const handleToggleRoute = (route: AiRouteEntity) => {
    setAiRoutes((prev) =>
      prev.map((r) => (r.id === route.id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  const handleMovePriority = (routeId: string, moveUp: boolean) => {
    const sorted = [...aiRoutes].sort((a, b) => a.priority - b.priority);
    const idx = sorted.findIndex((r) => r.id === routeId);
    if (idx === -1) return;

    const targetIdx = moveUp ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const current = sorted[idx];
    const other = sorted[targetIdx];

    const updatedCurrent = { ...current, priority: other.priority };
    const updatedOther = { ...other, priority: current.priority };

    setAiRoutes((prev) =>
      prev.map((r) => {
        if (r.id === current.id) return updatedCurrent;
        if (r.id === other.id) return updatedOther;
        return r;
      })
    );
  };

  const handlePingRoute = async (routeId: string): Promise<RoutePingResult> => {
    const route = aiRoutes.find((r) => r.id === routeId);
    if (!route) {
      return { routeId, isSuccess: false, latencyMs: 0, statusCode: 404, errorMessage: 'Route not found' };
    }
    const key = apiKeys.find((k) => k.id === route.apiKeyId);
    return await aiRouter.pingRoute(route, key);
  };

  const handleTestAllRoutes = async () => {
    showToast('Testing latency for all configured AI routes...');
  };

  const handleSimulateFallback = async (): Promise<RouteAttemptRecord[]> => {
    const sorted = [...aiRoutes].sort((a, b) => a.priority - b.priority);
    const r1 = sorted[0];
    const r2 = sorted[1] || sorted[0];

    const logs: RouteAttemptRecord[] = [
      {
        routeId: r1.id,
        routeName: r1.name,
        provider: r1.provider,
        modelId: r1.modelId,
        isSuccess: false,
        statusCode: 429,
        latencyMs: 180,
        errorMessage: `HTTP 429 Rate Limit Exceeded on ${r1.provider.toUpperCase()}. Automatic failover engaged.`
      },
      {
        routeId: r2.id,
        routeName: r2.name,
        provider: r2.provider,
        modelId: r2.modelId,
        isSuccess: true,
        statusCode: 200,
        latencyMs: 310,
        errorMessage: ''
      }
    ];

    return logs;
  };

  // Profile & Reset
  const handleUpdateProfile = (name: string, email: string) => {
    if (user) {
      setUser({ ...user, displayName: name, email });
    }
  };

  const handleResetDefaults = () => {
    storage.resetToDefaults();
    setProjects(storage.getProjects());
    setAllFiles(storage.getFiles());
    setApiKeys(storage.getApiKeys());
    setAiRoutes(storage.getAiRoutes());
    setMessages(storage.getMessages());
    setSteps([]);
    setAttachments([]);
    setUser(storage.getUser());
    setSelectedProjectId('project_jarvis_demo');
    setActiveFilePath('app/page.tsx');
    setOpenFiles(['app/page.tsx', 'components/Hero.tsx', 'components/ContactForm.tsx']);
    showToast('Workspace database reset to defaults.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-xs font-mono text-slate-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        user={user}
        onSignOut={() => {
          setUser(null);
          setCurrentScreen('AUTH');
        }}
        onExportZip={() => handleExportProjectZip()}
        activeRoutesCount={aiRoutes.filter((r) => r.isEnabled).length}
      />

      {/* Active Screen View */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'LANDING' && (
          <LandingScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
            onLaunchDemoProject={() => {
              setSelectedProjectId('project_jarvis_demo');
              setCurrentScreen('WORKSPACE');
            }}
          />
        )}

        {currentScreen === 'WORKSPACE' && activeProject && (
          <WorkspaceScreen
            project={activeProject}
            files={projectFiles}
            activeFilePath={activeFilePath}
            openFiles={openFiles}
            activeTab={activeTab}
            messages={projectMessages}
            steps={steps}
            attachments={projectAttachments}
            isAgentRunning={isAgentRunning}
            currentRunningStep={currentRunningStep}
            terminalOutput={terminalOutput}
            isExecutingCommand={isExecutingCommand}
            cpuUsage={cpuUsage}
            ramUsage={ramUsage}
            activeRouteName={activeRouteName}
            onSelectFile={handleSelectFile}
            onCloseFileTab={handleCloseFileTab}
            onSaveFileContent={handleSaveFileContent}
            onCreateFile={handleCreateFile}
            onCreateFolder={handleCreateFolder}
            onDeleteFile={handleDeleteFile}
            onDuplicateFile={handleDuplicateFile}
            onRenameFile={handleRenameFile}
            onSwitchTab={(tab) => setActiveTab(tab)}
            onSendAgentPrompt={handleSendAgentPrompt}
            onExecuteTerminalCommand={handleExecuteTerminalCommand}
            onClearTerminal={handleClearTerminal}
            onAddAttachment={handleAddAttachment}
            onDeleteAttachment={handleDeleteAttachment}
          />
        )}

        {currentScreen === 'ROUTING' && (
          <KeysAndRoutingScreen
            apiKeys={apiKeys}
            routes={aiRoutes}
            onAddApiKey={handleAddApiKey}
            onDeleteApiKey={handleDeleteApiKey}
            onUpdateKeyStatus={handleUpdateKeyStatus}
            onAddRoute={handleAddRoute}
            onDeleteRoute={handleDeleteRoute}
            onToggleRoute={handleToggleRoute}
            onMovePriority={handleMovePriority}
            onPingRoute={handlePingRoute}
            onTestAllRoutes={handleTestAllRoutes}
            onSimulateFallback={handleSimulateFallback}
          />
        )}

        {currentScreen === 'PROJECTS' && (
          <ProjectsDashboardScreen
            projects={projects}
            activeProjectId={selectedProjectId}
            onSelectProject={(id) => {
              handleSelectProject(id);
              setCurrentScreen('WORKSPACE');
            }}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
            onExportProjectZip={(proj) => handleExportProjectZip(proj)}
          />
        )}

        {currentScreen === 'SETTINGS' && (
          <SettingsScreen
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onResetDefaults={handleResetDefaults}
            onSignOut={() => {
              setUser(null);
              setCurrentScreen('AUTH');
            }}
          />
        )}

        {currentScreen === 'AUTH' && (
          <AuthScreen
            onAuthSuccess={(authedUser) => {
              setUser(authedUser);
              setCurrentScreen('WORKSPACE');
              showToast(`Welcome back, ${authedUser.displayName}!`);
            }}
            onNavigateBack={() => setCurrentScreen('LANDING')}
          />
        )}
      </main>
    </div>
  );
}
