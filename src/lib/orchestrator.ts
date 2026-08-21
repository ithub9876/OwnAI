import {
  AiAgentRole,
  TaskComplexity,
  TaskAnalysisResult,
  OrchestratorPlanItem,
  AiTeamConfig
} from '../types/agent';
import { ProjectEntity, ProjectFileEntity, ApiKeyEntity, AiRouteEntity } from '../types';
import { skillRouter } from './skillLibrary';
import { AI_ROLE_DEFINITIONS, resolveModelForRole } from './aiTeam';
import { toolRegistry } from './toolRegistry';

export class AgentOrchestrator {
  /**
   * Analyzes prompt intent, determines complexity tier, and selects collaborating roles & skills.
   */
  public analyzeTask(prompt: string, workspaceFiles: ProjectFileEntity[]): TaskAnalysisResult {
    const lower = prompt.toLowerCase();

    // 1. Determine Complexity
    let complexity: TaskComplexity = 'NORMAL';
    const isTrivial =
      (lower.startsWith('fix typo') ||
        lower.startsWith('change color') ||
        lower.startsWith('rename') ||
        lower.includes('change text')) &&
      !lower.includes('and') &&
      !lower.includes('full');

    const isComplex =
      lower.includes('build') ||
      lower.includes('architect') ||
      lower.includes('auth') ||
      lower.includes('backend') ||
      lower.includes('database') ||
      lower.includes('redesign') ||
      lower.includes('refactor') ||
      lower.includes('system') ||
      lower.includes('portfolio') ||
      lower.includes('dashboard');

    if (isTrivial) complexity = 'TRIVIAL';
    else if (isComplex) complexity = 'COMPLEX';

    // 2. Select Relevant Skills
    const activatedSkills = skillRouter.selectSkillsForPrompt(prompt).map((s) => s.id);

    // 3. Select Primary & Collaborating Roles
    let primaryRole: AiAgentRole = 'FRONTEND_ENGINEER';
    const collaboratingRoles: AiAgentRole[] = [];

    if (lower.includes('plan') || lower.includes('architect') || complexity === 'COMPLEX') {
      primaryRole = 'PLANNER';
      collaboratingRoles.push('FRONTEND_ENGINEER');
    }

    if (lower.includes('ui') || lower.includes('redesign') || lower.includes('style') || lower.includes('theme')) {
      collaboratingRoles.push('UI_UX_DESIGNER');
      collaboratingRoles.push('DESIGN_SYSTEM_SPECIALIST');
    }

    if (lower.includes('backend') || lower.includes('server') || lower.includes('api') || lower.includes('database')) {
      collaboratingRoles.push('BACKEND_ENGINEER');
    }

    if (lower.includes('debug') || lower.includes('fix') || lower.includes('error') || lower.includes('broken')) {
      collaboratingRoles.push('DEBUGGER');
    }

    // QA & Review for complex tasks
    const requiresVisualQA = complexity === 'COMPLEX' || lower.includes('visual') || lower.includes('ui');
    const requiresTesting = complexity === 'COMPLEX' || lower.includes('test');
    const requiresCodeReview = complexity === 'COMPLEX';

    if (requiresVisualQA) collaboratingRoles.push('VISUAL_QA');
    if (requiresTesting) collaboratingRoles.push('TESTER');
    if (requiresCodeReview) collaboratingRoles.push('CODE_REVIEWER');

    // 4. Identify Target Files
    const targetFiles = workspaceFiles
      .filter((f) => {
        if (lower.includes(f.name.toLowerCase())) return true;
        if (f.path.includes('App.tsx') || f.path.includes('page.tsx') || f.path.includes('index.html')) return true;
        return false;
      })
      .map((f) => f.path);

    return {
      complexity,
      summary: `Analyzed task (${complexity} tier): ${prompt.slice(0, 80)}...`,
      primaryRole,
      collaboratingRoles: Array.from(new Set(collaboratingRoles)),
      activatedSkills,
      requiresVisualQA,
      requiresTesting,
      requiresCodeReview,
      targetFiles: targetFiles.length > 0 ? targetFiles : ['src/App.tsx']
    };
  }

  /**
   * Generates step plan according to complexity tier.
   */
  public generateExecutionPlan(
    analysis: TaskAnalysisResult,
    prompt: string
  ): OrchestratorPlanItem[] {
    const plan: OrchestratorPlanItem[] = [];

    // TIER 1: TRIVIAL (Direct atomic edit)
    if (analysis.complexity === 'TRIVIAL') {
      plan.push({
        id: 'step_trivial_1',
        stepNumber: 1,
        assignedRole: 'FRONTEND_ENGINEER',
        skillIds: ['frontend'],
        title: 'Applying atomic code modification',
        status: 'PENDING',
        details: `Surgically applying requested change: "${prompt}"`
      });
      plan.push({
        id: 'step_trivial_2',
        stepNumber: 2,
        assignedRole: 'FRONTEND_ENGINEER',
        skillIds: ['frontend'],
        title: 'Sandbox verification',
        status: 'PENDING',
        details: 'Verifying container bundle passes with zero errors.'
      });
      return plan;
    }

    // TIER 2: NORMAL (Standard 4-step pipeline)
    if (analysis.complexity === 'NORMAL') {
      plan.push({
        id: 'step_norm_1',
        stepNumber: 1,
        assignedRole: 'PLANNER',
        skillIds: ['planning'],
        title: 'Formulating execution plan',
        status: 'PENDING',
        details: `Activated skills: ${analysis.activatedSkills.join(', ')}`
      });
      plan.push({
        id: 'step_norm_2',
        stepNumber: 2,
        assignedRole: 'FRONTEND_ENGINEER',
        skillIds: analysis.activatedSkills.slice(0, 3),
        title: `Implementing modifications across ${analysis.targetFiles.join(', ')}`,
        status: 'PENDING',
        details: 'Refactoring components and updating state handlers.'
      });
      plan.push({
        id: 'step_norm_3',
        stepNumber: 3,
        assignedRole: 'DEBUGGER',
        skillIds: ['debugging'],
        title: 'Lint & build verification',
        status: 'PENDING',
        details: 'Testing compilation in isolated sandbox container.'
      });
      plan.push({
        id: 'step_norm_4',
        stepNumber: 4,
        assignedRole: 'VISUAL_QA',
        skillIds: ['visual-qa'],
        title: 'Visual layout inspection',
        status: 'PENDING',
        details: 'Checking responsive viewport rendering and visual balance.'
      });
      return plan;
    }

    // TIER 3: COMPLEX (Full Autonomous Pipeline)
    plan.push({
      id: 'step_comp_1',
      stepNumber: 1,
      assignedRole: 'PLANNER',
      skillIds: ['planning'],
      title: 'Architectural breakdown & dependency modeling',
      status: 'PENDING',
      details: `Synthesizing requirements for "${prompt}". Sequencing ${analysis.collaboratingRoles.length} specialized roles.`
    });

    if (analysis.collaboratingRoles.includes('UI_UX_DESIGNER')) {
      plan.push({
        id: 'step_comp_2',
        stepNumber: 2,
        assignedRole: 'UI_UX_DESIGNER',
        skillIds: ['ui-ux', 'design-system'],
        title: 'Establishing UI/UX layout & design tokens',
        status: 'PENDING',
        details: 'Configuring typography scale, dark zinc palette, and spacing ratios.'
      });
    }

    plan.push({
      id: 'step_comp_3',
      stepNumber: plan.length + 1,
      assignedRole: 'FRONTEND_ENGINEER',
      skillIds: ['frontend', 'responsive-design'],
      title: 'Engineering modular frontend components',
      status: 'PENDING',
      details: 'Building interactive UI views with strict TypeScript types and reactive state.'
    });

    if (analysis.collaboratingRoles.includes('BACKEND_ENGINEER')) {
      plan.push({
        id: 'step_comp_4',
        stepNumber: plan.length + 1,
        assignedRole: 'BACKEND_ENGINEER',
        skillIds: ['backend', 'security', 'api-integration'],
        title: 'Configuring secure server endpoints & data persistence',
        status: 'PENDING',
        details: 'Setting up Express routes with safe server-side API proxying.'
      });
    }

    if (analysis.requiresTesting) {
      plan.push({
        id: 'step_comp_5',
        stepNumber: plan.length + 1,
        assignedRole: 'TESTER',
        skillIds: ['testing'],
        title: 'Running unit & integration test suites',
        status: 'PENDING',
        details: 'Validating assertion specs and edge case conditions.'
      });
    }

    if (analysis.requiresVisualQA) {
      plan.push({
        id: 'step_comp_6',
        stepNumber: plan.length + 1,
        assignedRole: 'VISUAL_QA',
        skillIds: ['visual-qa', 'responsive-design'],
        title: 'Visual QA & multi-viewport layout validation',
        status: 'PENDING',
        details: 'Validating zero visual collisions across Desktop, Tablet, and Mobile.'
      });
    }

    if (analysis.requiresCodeReview) {
      plan.push({
        id: 'step_comp_7',
        stepNumber: plan.length + 1,
        assignedRole: 'CODE_REVIEWER',
        skillIds: ['code-review', 'security'],
        title: 'Automated code review & security audit',
        status: 'PENDING',
        details: 'Verifying clean code standards, zero secret leaks, and high performance.'
      });
    }

    return plan;
  }
}

export const agentOrchestrator = new AgentOrchestrator();
