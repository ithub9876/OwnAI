// ==========================================
// Specialized AI Team Roles & Definitions
// ==========================================

export type AiAgentRole =
  | 'PLANNER'
  | 'UI_UX_DESIGNER'
  | 'DESIGN_SYSTEM_SPECIALIST'
  | 'FRONTEND_ENGINEER'
  | 'BACKEND_ENGINEER'
  | 'DEBUGGER'
  | 'RESEARCHER'
  | 'VISUAL_QA'
  | 'TESTER'
  | 'CODE_REVIEWER'
  | 'SECURITY_REVIEWER'
  | 'DEPLOYMENT_SPECIALIST';

export interface AiRoleDefinition {
  id: AiAgentRole;
  name: string;
  category: 'architecture' | 'design' | 'engineering' | 'qa_security';
  description: string;
  recommendedCapabilities: {
    minContextWindow: number;
    requiresVision: boolean;
    requiresTools: boolean;
    requiresReasoning: boolean;
  };
  allowedToolIds: string[];
  systemInstructions: string;
}

export interface AiTeamMemberConfig {
  role: AiAgentRole;
  mode: 'AUTOMATIC' | 'CUSTOM';
  selectedModelId?: string;
  selectedProvider?: string;
  selectedApiKeyId?: string;
  priority: number;
  isEnabled: boolean;
}

export interface AiTeamConfig {
  mode: 'AUTOMATIC' | 'CUSTOM';
  members: Record<AiAgentRole, AiTeamMemberConfig>;
  updatedAt: number;
}

// ==========================================
// Modular Skill Library Definitions
// ==========================================

export type SkillCategory =
  | 'core'
  | 'design'
  | 'frontend'
  | 'backend'
  | 'quality'
  | 'security'
  | 'devops';

export interface SkillDefinition {
  id: string;
  name: string;
  category: SkillCategory;
  version: string;
  description: string;
  purpose: string;
  activationKeywords: string[];
  dependencies: string[];
  requiredTools: string[];
  qualityChecklist: string[];
  failureConditions: string[];
  instructions: string;
  isEnabled: boolean;
}

// ==========================================
// Tool Registry Definitions
// ==========================================

export interface ToolDefinition {
  id: string;
  name: string;
  category: 'file' | 'code' | 'terminal' | 'browser' | 'git' | 'analysis';
  description: string;
  isReadOnly: boolean;
  parametersSchema: Record<string, any>;
}

export interface ToolExecutionPayload {
  toolId: string;
  parameters: Record<string, any>;
  projectId: string;
  callerRole: AiAgentRole;
}

export interface ToolExecutionResponse {
  toolId: string;
  isSuccess: boolean;
  result: any;
  error?: string;
  elapsedMs: number;
}

// ==========================================
// Intelligent Orchestrator Pipeline
// ==========================================

export type TaskComplexity = 'TRIVIAL' | 'NORMAL' | 'COMPLEX';

export interface TaskAnalysisResult {
  complexity: TaskComplexity;
  summary: string;
  primaryRole: AiAgentRole;
  collaboratingRoles: AiAgentRole[];
  activatedSkills: string[];
  requiresVisualQA: boolean;
  requiresTesting: boolean;
  requiresCodeReview: boolean;
  targetFiles: string[];
}

export interface OrchestratorPlanItem {
  id: string;
  stepNumber: number;
  assignedRole: AiAgentRole;
  skillIds: string[];
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'ERROR' | 'SKIPPED';
  details?: string;
  elapsedMs?: number;
  toolCall?: {
    toolName: string;
    input: any;
    output?: any;
  };
}

export interface ModelBenchmarkScore {
  modelId: string;
  provider: string;
  category: 'coding' | 'planning' | 'reasoning' | 'ui_ux' | 'vision' | 'debugging' | 'tool_use';
  score: number; // 0-100
  latencyScore: number; // 0-100
  timestamp: number;
}
