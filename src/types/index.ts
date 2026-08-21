export type ModelProviderType =
  | 'nvidia'
  | 'anthropic'
  | 'openai'
  | 'gemini'
  | 'groq'
  | 'openrouter'
  | 'custom';

export type ApiKeyStatus = 'ACTIVE' | 'REVOKED' | 'RATE_LIMITED' | 'EXPIRED';

export interface ApiKeyEntity {
  id: string;
  name: string;
  provider: ModelProviderType;
  maskedKey: string;
  encryptedKey: string;
  baseUrl: string;
  status: ApiKeyStatus;
  createdAt: number;
  lastUsedAt: number;
  errorDetails?: string;
}

export interface AiRouteEntity {
  id: string;
  priority: number;
  name: string;
  provider: ModelProviderType;
  modelId: string;
  apiKeyId?: string | null;
  supportsVision: boolean;
  supportsTools: boolean;
  isEnabled: boolean;
  isPreferred?: boolean;
}

export interface ProjectEntity {
  id: string;
  name: string;
  description: string;
  framework: string;
  templateType: string;
  filesCount: number;
  totalLines: number;
  isStarred: boolean;
  createdAt: number;
  updatedAt: number;
}

export type GitFileStatus = 'UNMODIFIED' | 'MODIFIED' | 'UNTRACKED' | 'STAGED';

export interface ProjectFileEntity {
  id: string;
  projectId: string;
  path: string;
  name: string;
  content: string;
  originalContent: string;
  language: string;
  sizeBytes: number;
  linesCount: number;
  gitStatus: GitFileStatus;
  updatedAt: number;
}

export interface AttachmentEntity {
  id: string;
  projectId: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  dataOrUri: string;
  isVisionSupported: boolean;
  createdAt: number;
}

export type MessageSender = 'USER' | 'AGENT' | 'SYSTEM';

export interface ConversationMessageEntity {
  id: string;
  projectId: string;
  taskId?: string;
  sender: MessageSender;
  content: string;
  diffSummary?: string;
  timestamp: number;
  attachments?: string[];
  steps?: AgentStepEntity[];
}

export type AgentStepType =
  | 'PLAN'
  | 'INSPECT'
  | 'READ_FILE'
  | 'CREATE_FILE'
  | 'EDIT_FILE'
  | 'RUN_BUILD'
  | 'RUN_TEST'
  | 'AUTO_FIX'
  | 'VERIFIED';

export interface AgentStepEntity {
  id: string;
  taskId: string;
  stepNumber: number;
  stepType: AgentStepType;
  description: string;
  toolName: string;
  toolInputJson: string;
  toolResult: string;
  isSuccess: boolean;
  timestamp: number;
}

export interface AgentTaskEntity {
  id: string;
  projectId: string;
  userPrompt: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  finalSummary: string;
  totalSteps: number;
  routeUsed: string;
  durationMs: number;
  createdAt: number;
  completedAt: number;
}

export interface ExecutionLogEntity {
  id: string;
  projectId: string;
  taskId?: string;
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  timestamp: number;
}

export interface RoutePingResult {
  routeId: string;
  isSuccess: boolean;
  latencyMs: number;
  statusCode: number;
  errorMessage: string;
}

export interface RouteAttemptRecord {
  routeId: string;
  routeName: string;
  provider: string;
  modelId: string;
  isSuccess: boolean;
  statusCode: number;
  latencyMs: number;
  errorMessage: string;
}

export interface SandboxExecutionResult {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  cpuUsagePct: number;
  ramUsageMb: number;
}

export type WorkspaceTab =
  | 'EDITOR'
  | 'EXPLORER'
  | 'DIFF_INSPECTOR'
  | 'LIVE_PREVIEW'
  | 'TERMINAL'
  | 'ATTACHMENTS';

export type AppScreen =
  | 'LANDING'
  | 'DASHBOARD'
  | 'WORKSPACE'
  | 'ROUTING'
  | 'KEYS'
  | 'MODELS'
  | 'SETTINGS'
  | 'AUTH';

export type SettingsTab = 'general' | 'ai-team' | 'skills' | 'keys' | 'models' | 'routing' | 'account';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  photoURL?: string;
  authProvider?: 'google' | 'password';
}

export interface AttachmentPayload {
  name: string;
  type: 'image' | 'file' | 'zip';
  size: number;
  content: string;
}

export interface AgentExecutionStep {
  id: string;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'ERROR';
  elapsedMs?: number;
  details?: string;
}

export interface ChatMessageEntity {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  attachments?: AttachmentPayload[];
  steps?: AgentExecutionStep[];
  diffSummary?: string;
}

export interface TerminalCommandOutput {
  id: string;
  command: string;
  output: string;
  timestamp: number;
}
