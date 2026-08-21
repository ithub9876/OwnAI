import { SkillDefinition } from '../types/agent';

export const INITIAL_SKILLS: SkillDefinition[] = [
  {
    id: 'planning',
    name: 'Autonomous Architecture & Planning',
    category: 'core',
    version: '1.0.0',
    description: 'Deconstructs complex user prompts into structured execution plans, dependency graphs, and module targets.',
    purpose: 'Formulate minimal risk steps, identify missing files, and sequence agent operations.',
    activationKeywords: ['build', 'create', 'architect', 'plan', 'design', 'refactor', 'fullstack', 'system'],
    dependencies: [],
    requiredTools: ['list_files', 'search_files', 'read_file'],
    qualityChecklist: [
      'Identified all necessary entry points and shared components',
      'Assessed backward compatibility with existing architecture',
      'Specified validation checkpoints before code writing'
    ],
    failureConditions: [
      'Creating redundant modules when existing ones work',
      'Planning without inspecting current file tree'
    ],
    instructions: '1. Inspect current workspace files.\n2. Determine task complexity (TRIVIAL vs NORMAL vs COMPLEX).\n3. Outline minimal required changes.',
    isEnabled: true
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Craft & Modern Layouts',
    category: 'design',
    version: '1.2.0',
    description: 'Ensures dense, sophisticated visual layouts, dark developer aesthetics, and responsive typography.',
    purpose: 'Deliver clean interfaces with zero generic AI clutter.',
    activationKeywords: ['ui', 'ux', 'redesign', 'style', 'layout', 'theme', 'color', 'dark mode', 'aesthetic', 'dashboard'],
    dependencies: ['design-system'],
    requiredTools: ['read_file', 'edit_file'],
    qualityChecklist: [
      'Uses restrained dark palettes (#09090b, zinc-900/950) with crisp borders',
      'Passes optical padding rules (outer >= inner)',
      'Ensures single-line button labels and no wrapping glitches'
    ],
    failureConditions: [
      'Using generic AI purple gradients or glowing drop shadows',
      'Adding unsolicited promotional landing sections'
    ],
    instructions: 'Follow developer tool aesthetic (Linear/VSCode/Replit inspired). Use monospace details and clean borders.',
    isEnabled: true
  },
  {
    id: 'design-system',
    name: 'Design System & Token Architecture',
    category: 'design',
    version: '1.0.0',
    description: 'Maintains cohesive color tokens, font hierarchies, component variants, and spacing ratios.',
    purpose: 'Standardize Tailwind classes and design tokens across all views.',
    activationKeywords: ['design system', 'tokens', 'typography', 'theme', 'palette', 'components', 'button', 'card'],
    dependencies: [],
    requiredTools: ['read_file', 'edit_file'],
    qualityChecklist: [
      'Variables aligned with Tailwind config or CSS custom properties',
      'Mathematical nested corner radius rules respected (R_in = R_out - P)'
    ],
    failureConditions: ['Hardcoding arbitrary hex codes outside theme system'],
    instructions: 'Reference existing tailwind classes and maintain unified token usage.',
    isEnabled: true
  },
  {
    id: 'frontend',
    name: 'Modern React & TypeScript Frontend',
    category: 'frontend',
    version: '2.0.0',
    description: 'Builds modular React 18+ components with strict TypeScript types, Lucide icons, and zero console warnings.',
    purpose: 'Implement clean functional components and reactive state.',
    activationKeywords: ['react', 'component', 'frontend', 'page', 'modal', 'view', 'hook', 'state', 'tsx'],
    dependencies: ['design-system', 'ui-ux'],
    requiredTools: ['read_file', 'edit_file', 'create_file'],
    qualityChecklist: [
      'Strict TypeScript typing without any unsafe casts',
      'No infinite useEffect re-renders',
      'Extracted sub-components to prevent oversized files'
    ],
    failureConditions: ['Consolidating all logic into single mega-file', 'Using missing icon packages'],
    instructions: 'Create well-structured modular components in src/components. Keep handlers complete and non-mocked.',
    isEnabled: true
  },
  {
    id: 'backend',
    name: 'Node.js & Express Full-Stack Server',
    category: 'backend',
    version: '1.5.0',
    description: 'Builds secure RESTful API endpoints, middleware, authentication guards, and data proxies.',
    purpose: 'Create robust backend endpoints with zero exposed API keys.',
    activationKeywords: ['backend', 'server', 'api', 'express', 'endpoint', 'database', 'rest', 'proxy', 'auth'],
    dependencies: ['security'],
    requiredTools: ['read_file', 'edit_file', 'start_server'],
    qualityChecklist: [
      'Binds to port 3000 and 0.0.0.0 for container ingress',
      'Vite middleware mounted for development SPA routing',
      'All third-party API keys kept strictly server-side'
    ],
    failureConditions: ['Exposing secrets to browser via VITE_ prefixes'],
    instructions: 'Implement Express handlers in server.ts with clean async try-catch error wrapping.',
    isEnabled: true
  },
  {
    id: 'responsive-design',
    name: 'Adaptive & Mobile Precision',
    category: 'frontend',
    version: '1.1.0',
    description: 'Ensures flawless layout scaling from 320px smartphones to 4K ultra-wide monitors.',
    purpose: 'Provide dedicated mobile bottom navigation, drawers, and touch targets.',
    activationKeywords: ['mobile', 'responsive', 'tablet', 'screen', 'adaptive', 'resize', 'viewport', 'drawer'],
    dependencies: ['frontend'],
    requiredTools: ['read_file', 'edit_file'],
    qualityChecklist: [
      'Touch targets at least 44px on mobile',
      'Zero horizontal viewport overflow on 360px screens',
      'Proper mobile drawer overlays and bottom navigation switches'
    ],
    failureConditions: ['Simply shrinking desktop grids without mobile refactor'],
    instructions: 'Apply Tailwind sm:, md:, lg:, xl: breakpoints purposefully with mobile drawer support.',
    isEnabled: true
  },
  {
    id: 'accessibility',
    name: 'WCAG 2.1 AA Accessibility',
    category: 'frontend',
    version: '1.0.0',
    description: 'Guarantees semantic HTML, high color contrast, keyboard navigation, and screen reader labels.',
    purpose: 'Ensure accessible software for all developers and users.',
    activationKeywords: ['accessibility', 'a11y', 'contrast', 'aria', 'keyboard', 'screen reader', 'focus'],
    dependencies: ['frontend'],
    requiredTools: ['read_file', 'edit_file'],
    qualityChecklist: [
      'Color contrast >= 4.5:1 for standard text',
      'Interactive elements have unique id and aria attributes',
      'Visible focus rings on keyboard tab navigation'
    ],
    failureConditions: ['Using non-interactive div tags for critical buttons'],
    instructions: 'Include unique IDs and semantic HTML5 buttons/inputs on all controls.',
    isEnabled: true
  },
  {
    id: 'debugging',
    name: 'Root-Cause Error Diagnostics & Repair',
    category: 'quality',
    version: '2.1.0',
    description: 'Pinpoints runtime exceptions, TypeScript compiler errors, and broken network requests.',
    purpose: 'Trace errors to source lines and apply targeted atomic fixes.',
    activationKeywords: ['debug', 'fix', 'error', 'broken', 'issue', 'crash', 'fail', 'warning', 'typescript error'],
    dependencies: [],
    requiredTools: ['read_file', 'edit_file', 'search_files', 'run_command'],
    qualityChecklist: [
      'Located exact line number of fault',
      'Repaired underlying cause without masking with silent try-catch',
      'Re-verified compiler output after patch'
    ],
    failureConditions: ['Silently swallowing exceptions or looping without fix'],
    instructions: 'Analyze stack trace, inspect offending file, replace target block surgically, and verify.',
    isEnabled: true
  },
  {
    id: 'visual-qa',
    name: 'Visual QA & Viewport Inspection',
    category: 'quality',
    version: '1.0.0',
    description: 'Validates rendered DOM layouts, font hierarchy, contrast balance, and layout collisions.',
    purpose: 'Verify visual quality in live sandbox preview before completion.',
    activationKeywords: ['visual', 'qa', 'inspect', 'screenshot', 'alignment', 'spacing', 'check visual', 'polish'],
    dependencies: ['ui-ux', 'responsive-design'],
    requiredTools: ['browser_screenshot', 'inspect_dom', 'read_console'],
    qualityChecklist: [
      'Checked desktop and mobile viewport states',
      'Verified zero overflowing modals or cropped text pills',
      'Confirmed live sandbox preview renders cleanly'
    ],
    failureConditions: ['Claiming visual inspection when preview was unverified'],
    instructions: 'Inspect rendered iframe preview DOM, check console logs for asset errors, and verify styling.',
    isEnabled: true
  },
  {
    id: 'testing',
    name: 'Unit & Integration Test Suites',
    category: 'quality',
    version: '1.0.0',
    description: 'Writes and executes automated assertions, component test specs, and API health checks.',
    purpose: 'Ensure regressions are prevented across major modifications.',
    activationKeywords: ['test', 'unit test', 'integration test', 'spec', 'assert', 'coverage', 'verify test'],
    dependencies: ['frontend', 'backend'],
    requiredTools: ['run_tests', 'read_file', 'write_file'],
    qualityChecklist: [
      'Tests test realistic user interactions',
      'Edge cases (empty arrays, missing keys, timeouts) covered',
      'All assertions green before deployment'
    ],
    failureConditions: ['Writing tautological tests that pass blindly'],
    instructions: 'Formulate clean assertions for critical state transitions and edge cases.',
    isEnabled: true
  },
  {
    id: 'security',
    name: 'Application Security & Cryptography',
    category: 'security',
    version: '2.0.0',
    description: 'Enforces AES-256-GCM encryption, XSS sanitization, rate-limit defense, and zero key leakage.',
    purpose: 'Keep user secrets, tokens, and multi-tenant data strictly isolated.',
    activationKeywords: ['security', 'encrypt', 'auth', 'keys', 'protection', 'leak', 'xss', 'sanitize', 'crypto'],
    dependencies: [],
    requiredTools: ['read_file', 'edit_file'],
    qualityChecklist: [
      'Raw API keys encrypted with WebCrypto before localStorage persistence',
      'Zero sensitive secrets in frontend bundles or LLM logs',
      'Isolated multi-tenant user storage'
    ],
    failureConditions: ['Logging raw API keys to browser console or network'],
    instructions: 'Use src/lib/security.ts for client-side key encryption and masked display.',
    isEnabled: true
  },
  {
    id: 'authentication',
    name: 'Firebase & OAuth Identity Management',
    category: 'security',
    version: '1.4.0',
    description: 'Integrates Firebase Auth (Google Sign-In, Email/Password) and JWT session lifecycle.',
    purpose: 'Manage user login, registration, password recovery, and secure sessions.',
    activationKeywords: ['auth', 'login', 'signup', 'register', 'google signin', 'password', 'user', 'session'],
    dependencies: ['security'],
    requiredTools: ['read_file', 'edit_file'],
    qualityChecklist: [
      'Graceful offline/fallback handling when Firebase config is default',
      'Clean reactive onAuthStateChanged hooks with unmount cleanup',
      'User workspace data strictly partitioned by user ID'
    ],
    failureConditions: ['Mixing user workspace state across accounts'],
    instructions: 'Connect auth state to App user context and isolate project stores by user.id.',
    isEnabled: true
  },
  {
    id: 'api-integration',
    name: 'Third-Party & Multi-LLM API Connectors',
    category: 'backend',
    version: '1.8.0',
    description: 'Connects NVIDIA NIM, OpenAI, Anthropic, Gemini, Groq, OpenRouter, and custom endpoints.',
    purpose: 'Route AI requests through user-provided API keys with streaming support.',
    activationKeywords: ['api', 'llm', 'provider', 'nvidia', 'openai', 'claude', 'gemini', 'groq', 'openrouter', 'endpoint'],
    dependencies: ['security', 'backend'],
    requiredTools: ['read_file', 'edit_file', 'run_command'],
    qualityChecklist: [
      'Standardized normalized schema across all providers',
      'Proper Authorization: Bearer headers and error classification',
      'Automatic ping latency measurement'
    ],
    failureConditions: ['Hardcoding vendor-specific parameters on general routes'],
    instructions: 'Use modelsCatalog and aiRouter to normalize requests and responses across all 7 providers.',
    isEnabled: true
  },
  {
    id: 'database',
    name: 'State Persistence & Database Architecture',
    category: 'backend',
    version: '1.0.0',
    description: 'Manages Firestore collections, document indexes, schema migrations, and local storage layers.',
    purpose: 'Store persistent user workspaces, files, settings, and logs reliably.',
    activationKeywords: ['database', 'firestore', 'storage', 'persist', 'schema', 'sql', 'records', 'save'],
    dependencies: ['security'],
    requiredTools: ['read_file', 'edit_file'],
    qualityChecklist: [
      'Handles schema versioning gracefully without corrupting existing records',
      'Debounces continuous writes to prevent localStorage thrashing'
    ],
    failureConditions: ['Wiping existing user data on schema change'],
    instructions: 'Persist state via src/lib/storage.ts with automated fallback to memory.',
    isEnabled: true
  },
  {
    id: 'performance',
    name: 'Speed & Bundle Optimization',
    category: 'quality',
    version: '1.0.0',
    description: 'Optimizes React render cycles, code splitting, asset sizes, and debounced operations.',
    purpose: 'Ensure snappy 60fps UI performance and minimal RAM consumption.',
    activationKeywords: ['performance', 'speed', 'optimize', 'fast', 'bundle', 'lazy', 'debounce', 'memo'],
    dependencies: ['frontend'],
    requiredTools: ['read_file', 'edit_file'],
    qualityChecklist: [
      'No unnecessary state thrashing or unmemoized heavy loops',
      'Search filters and file tree traversals are sub-millisecond'
    ],
    failureConditions: ['Running expensive recalculations on every keystroke'],
    instructions: 'Use useMemo, useCallback, and debounced storage syncing where appropriate.',
    isEnabled: true
  },
  {
    id: 'seo',
    name: 'SEO & Metadata Optimization',
    category: 'core',
    version: '1.0.0',
    description: 'Configures OpenGraph tags, semantic title hierarchy, favicons, and manifest metadata.',
    purpose: 'Provide professional web indexing and clean preview cards.',
    activationKeywords: ['seo', 'meta', 'title', 'description', 'opengraph', 'favicon', 'metadata.json'],
    dependencies: [],
    requiredTools: ['read_file', 'edit_file'],
    qualityChecklist: [
      'metadata.json is kept updated with app name and description',
      'index.html contains responsive viewport and title tags'
    ],
    failureConditions: ['Leaving generic placeholder titles'],
    instructions: 'Maintain metadata.json and index.html accurate to project domain.',
    isEnabled: true
  },
  {
    id: 'git',
    name: 'Git Versioning & Diff Tracking',
    category: 'devops',
    version: '1.0.0',
    description: 'Tracks working tree modifications, staged changes, file history, and diff generation.',
    purpose: 'Provide visual side-by-side git diff comparisons for agent code edits.',
    activationKeywords: ['git', 'diff', 'commit', 'version', 'branch', 'changes', 'revert', 'modified'],
    dependencies: [],
    requiredTools: ['git_status', 'git_diff', 'read_file'],
    qualityChecklist: [
      'Preserves originalContent on file entities for diff calculation',
      'Updates gitStatus flags (MODIFIED, UNTRACKED, UNMODIFIED) accurately'
    ],
    failureConditions: ['Overwriting original content without tracking diff baseline'],
    instructions: 'Update ProjectFileEntity gitStatus and originalContent during agent edits.',
    isEnabled: true
  },
  {
    id: 'deployment',
    name: 'Production Packaging & Cloud Deployment',
    category: 'devops',
    version: '1.0.0',
    description: 'Prepares production builds, ZIP bundles, container configurations, and static outputs.',
    purpose: 'Allow developers to export complete deployable zip packages or run in production.',
    activationKeywords: ['deploy', 'export', 'zip', 'production', 'build', 'bundle', 'cloud run', 'docker'],
    dependencies: ['frontend', 'backend'],
    requiredTools: ['zip_project', 'run_command'],
    qualityChecklist: [
      'npm run build produces clean dist bundle',
      'ZIP exporter packages valid package.json, src, and config files'
    ],
    failureConditions: ['Exporting corrupted ZIP files or missing dependencies'],
    instructions: 'Use zipExporter to bundle valid project structures with package.json and tsconfig.',
    isEnabled: true
  },
  {
    id: 'code-review',
    name: 'Static Analysis & Code Quality Review',
    category: 'quality',
    version: '1.0.0',
    description: 'Performs automated code reviews checking maintainability, dead code, typing, and security.',
    purpose: 'Review proposed code changes before final verification.',
    activationKeywords: ['review', 'audit', 'code review', 'refactor', 'clean code', 'lint', 'standards'],
    dependencies: ['frontend', 'security'],
    requiredTools: ['read_file', 'edit_file'],
    qualityChecklist: [
      'Zero console.log statements left in production paths',
      'All error conditions gracefully handled with UI feedback',
      'No duplicate logic between helper utilities'
    ],
    failureConditions: ['Approving code with type errors or broken imports'],
    instructions: 'Scan edited files for TypeScript compliance, security safety, and cleanliness.',
    isEnabled: true
  }
];

export class SkillRouter {
  private skills: SkillDefinition[];

  constructor(initialSkills: SkillDefinition[] = INITIAL_SKILLS) {
    this.skills = initialSkills;
  }

  public getAllSkills(): SkillDefinition[] {
    return this.skills;
  }

  public getSkill(id: string): SkillDefinition | undefined {
    return this.skills.find((s) => s.id === id);
  }

  public toggleSkill(id: string, isEnabled: boolean): void {
    this.skills = this.skills.map((s) => (s.id === id ? { ...s, isEnabled } : s));
  }

  /**
   * Intelligently selects required skills based on prompt keywords and resolves dependencies.
   */
  public selectSkillsForPrompt(prompt: string): SkillDefinition[] {
    const lowerPrompt = prompt.toLowerCase();
    const selectedIds = new Set<string>();

    // 1. Direct Keyword Matching
    for (const skill of this.skills) {
      if (!skill.isEnabled) continue;

      const hasKeyword = skill.activationKeywords.some((kw) => lowerPrompt.includes(kw.toLowerCase()));
      if (hasKeyword) {
        selectedIds.add(skill.id);
      }
    }

    // Default baseline skills for code modifications
    if (selectedIds.size === 0) {
      selectedIds.add('planning');
      selectedIds.add('frontend');
      selectedIds.add('ui-ux');
      selectedIds.add('debugging');
    } else {
      // Always include planning if more than 2 skills are triggered
      if (selectedIds.size >= 2) {
        selectedIds.add('planning');
      }
    }

    // 2. Resolve Dependencies recursively
    let addedNew = true;
    while (addedNew) {
      addedNew = false;
      const currentSelected = Array.from(selectedIds);
      for (const id of currentSelected) {
        const skill = this.getSkill(id);
        if (skill) {
          for (const depId of skill.dependencies) {
            if (!selectedIds.has(depId)) {
              selectedIds.add(depId);
              addedNew = true;
            }
          }
        }
      }
    }

    return this.skills.filter((s) => selectedIds.has(s.id));
  }
}

export const skillRouter = new SkillRouter();
