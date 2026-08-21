import { AiAgentRole, AiRoleDefinition, AiTeamConfig, AiTeamMemberConfig } from '../types/agent';
import { ApiKeyEntity, AiRouteEntity } from '../types';

export const AI_ROLE_DEFINITIONS: Record<AiAgentRole, AiRoleDefinition> = {
  PLANNER: {
    id: 'PLANNER',
    name: 'Architect & Planner',
    category: 'architecture',
    description: 'Analyzes project requirements, models dependency graphs, and generates step-by-step implementation milestones.',
    recommendedCapabilities: {
      minContextWindow: 64000,
      requiresVision: false,
      requiresTools: true,
      requiresReasoning: true
    },
    allowedToolIds: ['list_files', 'search_files', 'read_file'],
    systemInstructions: 'You are the Lead Systems Architect. Break complex requests into concise, minimal-risk implementation steps. Favor surgical edits over large rewrites.'
  },
  UI_UX_DESIGNER: {
    id: 'UI_UX_DESIGNER',
    name: 'UI/UX Designer',
    category: 'design',
    description: 'Designs sophisticated, developer-focused interfaces with high contrast, crisp borders, and balanced whitespace.',
    recommendedCapabilities: {
      minContextWindow: 32000,
      requiresVision: true,
      requiresTools: true,
      requiresReasoning: false
    },
    allowedToolIds: ['read_file', 'edit_file'],
    systemInstructions: 'You are the Principal Product Designer. Enforce the OwnAI developer design system: dark zinc surfaces, subtle borders, linear spacing, and zero generic AI fluff.'
  },
  DESIGN_SYSTEM_SPECIALIST: {
    id: 'DESIGN_SYSTEM_SPECIALIST',
    name: 'Design System Specialist',
    category: 'design',
    description: 'Maintains cohesive Tailwind utility classes, CSS variables, typography ratios, and token hierarchies.',
    recommendedCapabilities: {
      minContextWindow: 32000,
      requiresVision: false,
      requiresTools: true,
      requiresReasoning: false
    },
    allowedToolIds: ['read_file', 'edit_file'],
    systemInstructions: 'You are the Design System Guardian. Ensure every color, radius, and font step follows mathematical rules (R_in = R_out - Padding).'
  },
  FRONTEND_ENGINEER: {
    id: 'FRONTEND_ENGINEER',
    name: 'Frontend Engineer',
    category: 'engineering',
    description: 'Implements modular React 18+ components with TypeScript type safety, reactive state hooks, and Lucide icons.',
    recommendedCapabilities: {
      minContextWindow: 64000,
      requiresVision: false,
      requiresTools: true,
      requiresReasoning: true
    },
    allowedToolIds: ['read_file', 'write_file', 'edit_file', 'create_file', 'delete_file'],
    systemInstructions: 'You are the Senior Frontend Engineer. Write modular, clean TypeScript React code with zero compiler warnings and proper sub-component extraction.'
  },
  BACKEND_ENGINEER: {
    id: 'BACKEND_ENGINEER',
    name: 'Backend Engineer',
    category: 'engineering',
    description: 'Develops secure Express API routes, auth middleware, data persistence layers, and external service proxies.',
    recommendedCapabilities: {
      minContextWindow: 64000,
      requiresVision: false,
      requiresTools: true,
      requiresReasoning: true
    },
    allowedToolIds: ['read_file', 'write_file', 'edit_file', 'start_server', 'run_command'],
    systemInstructions: 'You are the Backend & API Engineer. Keep all API keys server-side in server.ts. Never expose secrets via VITE_ client variables.'
  },
  DEBUGGER: {
    id: 'DEBUGGER',
    name: 'Debugger & Diagnostics Specialist',
    category: 'engineering',
    description: 'Isolates runtime exceptions, TypeScript syntax errors, broken dependencies, and applies surgical line-level fixes.',
    recommendedCapabilities: {
      minContextWindow: 64000,
      requiresVision: false,
      requiresTools: true,
      requiresReasoning: true
    },
    allowedToolIds: ['read_file', 'edit_file', 'search_files', 'run_command'],
    systemInstructions: 'You are the Diagnostics Expert. Analyze error stacks, locate the exact source lines, and repair root causes without masking exceptions.'
  },
  RESEARCHER: {
    id: 'RESEARCHER',
    name: 'Technical Researcher',
    category: 'architecture',
    description: 'Researches latest package APIs, architectural patterns, third-party documentation, and performance benchmarks.',
    recommendedCapabilities: {
      minContextWindow: 32000,
      requiresVision: false,
      requiresTools: true,
      requiresReasoning: true
    },
    allowedToolIds: ['read_file', 'search_files'],
    systemInstructions: 'You are the Technical Researcher. Gather context from dependencies and package manifests to guide implementation choices.'
  },
  VISUAL_QA: {
    id: 'VISUAL_QA',
    name: 'Visual QA Inspector',
    category: 'qa_security',
    description: 'Inspects sandbox viewport rendering across desktop, tablet, and mobile to detect layout collisions and visual defects.',
    recommendedCapabilities: {
      minContextWindow: 32000,
      requiresVision: true,
      requiresTools: true,
      requiresReasoning: false
    },
    allowedToolIds: ['browser_screenshot', 'inspect_dom', 'read_console'],
    systemInstructions: 'You are the Visual QA Specialist. Verify layout boundaries, text wrapping, touch target sizing, and responsive drawer behavior.'
  },
  TESTER: {
    id: 'TESTER',
    name: 'Test Automation Engineer',
    category: 'qa_security',
    description: 'Creates and runs unit tests, integration assertions, component behavior specs, and API health checks.',
    recommendedCapabilities: {
      minContextWindow: 32000,
      requiresVision: false,
      requiresTools: true,
      requiresReasoning: true
    },
    allowedToolIds: ['run_tests', 'read_file', 'write_file'],
    systemInstructions: 'You are the Test Engineer. Formulate edge-case tests to verify logic correctness and prevent regressions.'
  },
  CODE_REVIEWER: {
    id: 'CODE_REVIEWER',
    name: 'Code Reviewer',
    category: 'qa_security',
    description: 'Reviews code diffs for TypeScript standards, dead code, maintainability, and clean separation of concerns.',
    recommendedCapabilities: {
      minContextWindow: 64000,
      requiresVision: false,
      requiresTools: true,
      requiresReasoning: true
    },
    allowedToolIds: ['read_file', 'git_diff'],
    systemInstructions: 'You are the Lead Code Reviewer. Audit diffs to ensure adherence to engineering standards before completing turns.'
  },
  SECURITY_REVIEWER: {
    id: 'SECURITY_REVIEWER',
    name: 'Security & Cryptography Auditor',
    category: 'qa_security',
    description: 'Audits key storage, encryption mechanisms, input sanitization, token security, and cross-user isolation.',
    recommendedCapabilities: {
      minContextWindow: 32000,
      requiresVision: false,
      requiresTools: true,
      requiresReasoning: true
    },
    allowedToolIds: ['read_file'],
    systemInstructions: 'You are the Security Auditor. Ensure zero secret leakage, safe WebCrypto AES-256-GCM encryption, and multi-tenant isolation.'
  },
  DEPLOYMENT_SPECIALIST: {
    id: 'DEPLOYMENT_SPECIALIST',
    name: 'Deployment & Build Engineer',
    category: 'engineering',
    description: 'Optimizes production builds, validates container start configurations, and exports clean ZIP packages.',
    recommendedCapabilities: {
      minContextWindow: 32000,
      requiresVision: false,
      requiresTools: true,
      requiresReasoning: false
    },
    allowedToolIds: ['zip_project', 'run_command'],
    systemInstructions: 'You are the Deployment Specialist. Verify clean production builds with Vite and ESBuild.'
  }
};

export const DEFAULT_AI_TEAM_CONFIG: AiTeamConfig = {
  mode: 'AUTOMATIC',
  members: {
    PLANNER: { role: 'PLANNER', mode: 'AUTOMATIC', priority: 1, isEnabled: true },
    UI_UX_DESIGNER: { role: 'UI_UX_DESIGNER', mode: 'AUTOMATIC', priority: 1, isEnabled: true },
    DESIGN_SYSTEM_SPECIALIST: { role: 'DESIGN_SYSTEM_SPECIALIST', mode: 'AUTOMATIC', priority: 1, isEnabled: true },
    FRONTEND_ENGINEER: { role: 'FRONTEND_ENGINEER', mode: 'AUTOMATIC', priority: 1, isEnabled: true },
    BACKEND_ENGINEER: { role: 'BACKEND_ENGINEER', mode: 'AUTOMATIC', priority: 1, isEnabled: true },
    DEBUGGER: { role: 'DEBUGGER', mode: 'AUTOMATIC', priority: 1, isEnabled: true },
    RESEARCHER: { role: 'RESEARCHER', mode: 'AUTOMATIC', priority: 1, isEnabled: true },
    VISUAL_QA: { role: 'VISUAL_QA', mode: 'AUTOMATIC', priority: 1, isEnabled: true },
    TESTER: { role: 'TESTER', mode: 'AUTOMATIC', priority: 1, isEnabled: true },
    CODE_REVIEWER: { role: 'CODE_REVIEWER', mode: 'AUTOMATIC', priority: 1, isEnabled: true },
    SECURITY_REVIEWER: { role: 'SECURITY_REVIEWER', mode: 'AUTOMATIC', priority: 1, isEnabled: true },
    DEPLOYMENT_SPECIALIST: { role: 'DEPLOYMENT_SPECIALIST', mode: 'AUTOMATIC', priority: 1, isEnabled: true }
  },
  updatedAt: Date.now()
};

/**
 * Resolves the best eligible model and API key for a specific role
 * considering available user keys, model capabilities, and preferences.
 */
export function resolveModelForRole(
  role: AiAgentRole,
  teamConfig: AiTeamConfig,
  availableRoutes: AiRouteEntity[],
  availableKeys: ApiKeyEntity[]
): { route: AiRouteEntity | null; key: ApiKeyEntity | null; reason: string } {
  const memberConfig = teamConfig.members[role];
  const roleDef = AI_ROLE_DEFINITIONS[role];

  // 1. Custom Override Mode
  if (teamConfig.mode === 'CUSTOM' || memberConfig?.mode === 'CUSTOM') {
    if (memberConfig?.selectedModelId) {
      const customRoute = availableRoutes.find(
        (r) => r.modelId === memberConfig.selectedModelId && r.isEnabled
      );
      if (customRoute) {
        const customKey = availableKeys.find(
          (k) => k.id === customRoute.apiKeyId && k.status === 'ACTIVE'
        ) || availableKeys.find((k) => k.provider === customRoute.provider && k.status === 'ACTIVE') || null;

        return {
          route: customRoute,
          key: customKey,
          reason: `Custom user assignment for ${roleDef.name}`
        };
      }
    }
  }

  // 2. Automatic Selection based on role capability requirements
  const enabledRoutes = availableRoutes.filter((r) => r.isEnabled);
  if (enabledRoutes.length === 0) {
    return { route: null, key: null, reason: 'No active AI routes configured.' };
  }

  // Filter routes that satisfy role requirements (e.g., Vision for Visual QA)
  let eligibleRoutes = enabledRoutes;
  if (roleDef.recommendedCapabilities.requiresVision) {
    const visionRoutes = enabledRoutes.filter((r) => r.supportsVision);
    if (visionRoutes.length > 0) {
      eligibleRoutes = visionRoutes;
    }
  }

  // Pick preferred route or highest priority route
  const preferred = eligibleRoutes.find((r) => r.isPreferred) || eligibleRoutes[0];
  const matchingKey = availableKeys.find(
    (k) => k.id === preferred.apiKeyId && k.status === 'ACTIVE'
  ) || availableKeys.find((k) => k.provider === preferred.provider && k.status === 'ACTIVE') || null;

  return {
    route: preferred,
    key: matchingKey,
    reason: `Automatic selection optimized for ${roleDef.name}`
  };
}
