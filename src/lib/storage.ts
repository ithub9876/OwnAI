import {
  ProjectEntity,
  ProjectFileEntity,
  ApiKeyEntity,
  AiRouteEntity,
  ConversationMessageEntity,
  AgentTaskEntity,
  AgentStepEntity,
  AttachmentEntity,
  ExecutionLogEntity,
  User
} from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'ownai_projects_v2',
  FILES: 'ownai_files_v2',
  API_KEYS: 'ownai_api_keys_v2',
  AI_ROUTES: 'ownai_ai_routes_v2',
  MESSAGES: 'ownai_messages_v2',
  TASKS: 'ownai_tasks_v2',
  STEPS: 'ownai_steps_v2',
  ATTACHMENTS: 'ownai_attachments_v2',
  LOGS: 'ownai_logs_v2',
  USER: 'ownai_user_v2'
};

const DEFAULT_USER: User = {
  id: 'usr_lead_architect',
  email: 'developer@ownai.dev',
  displayName: 'Alex Vance',
  role: 'Lead AI & Systems Architect'
};

const DEFAULT_PROJECTS: ProjectEntity[] = [
  {
    id: 'project_jarvis_demo',
    name: 'Jarvis Portfolio & Agent OS',
    description: 'High-performance developer portfolio with autonomous agents, reactive dark theme, and container builds.',
    framework: 'Next.js 14 (App Router)',
    templateType: 'web',
    filesCount: 6,
    totalLines: 420,
    isStarred: true,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'project_fastapi_backend',
    name: 'Neural Microservice API',
    description: 'FastAPI distributed model inference orchestration backend with strict Pydantic validation.',
    framework: 'Python (FastAPI + Pydantic)',
    templateType: 'backend',
    filesCount: 4,
    totalLines: 280,
    isStarred: false,
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000
  },
  {
    id: 'project_react_dashboard',
    name: 'Telemetry Analytics Deck',
    description: 'Real-time WebSockets GPU telemetry monitor & token consumption waterfall visualizer.',
    framework: 'React 18 + Vite',
    templateType: 'web',
    filesCount: 5,
    totalLines: 350,
    isStarred: false,
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 2
  }
];

const DEFAULT_FILES: ProjectFileEntity[] = [
  {
    id: 'file_page_tsx',
    projectId: 'project_jarvis_demo',
    path: 'app/page.tsx',
    name: 'page.tsx',
    language: 'typescript',
    sizeBytes: 980,
    linesCount: 34,
    gitStatus: 'UNMODIFIED',
    updatedAt: Date.now(),
    originalContent: `import React from 'react';
import Hero from '../components/Hero';
import ContactForm from '../components/ContactForm';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600">
      <nav className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-mono font-bold tracking-tight text-slate-100">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          jarvis.portfolio.dev
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            SANDBOX ACTIVE
          </span>
        </div>
      </nav>
      
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        <Hero />
        <ContactForm />
      </div>
    </main>
  );
}`,
    content: `import React from 'react';
import Hero from '../components/Hero';
import ContactForm from '../components/ContactForm';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600">
      <nav className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-mono font-bold tracking-tight text-slate-100">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          jarvis.portfolio.dev
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            SANDBOX ACTIVE
          </span>
        </div>
      </nav>
      
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        <Hero />
        <ContactForm />
      </div>
    </main>
  );
}`
  },
  {
    id: 'file_hero_tsx',
    projectId: 'project_jarvis_demo',
    path: 'components/Hero.tsx',
    name: 'Hero.tsx',
    language: 'typescript',
    sizeBytes: 1120,
    linesCount: 38,
    gitStatus: 'UNMODIFIED',
    updatedAt: Date.now(),
    originalContent: `import React from 'react';
import { Sparkles, ArrowRight, Code2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-8 md:p-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        OwnAI BYOK Autonomous Agent
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
        Building software with autonomous intelligence.
      </h1>
      
      <p className="text-slate-400 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
        Senior Engineer crafting resilient distributed architectures & reactive developer tooling. Powered by self-hosted LLM routing.
      </p>
      
      <div className="flex flex-wrap gap-4">
        <button className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors flex items-center gap-2">
          Get in Touch <ArrowRight className="w-4 h-4" />
        </button>
        <button className="px-5 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors flex items-center gap-2">
          <Code2 className="w-4 h-4" /> View GitHub
        </button>
      </div>
    </section>
  );
}`,
    content: `import React from 'react';
import { Sparkles, ArrowRight, Code2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-8 md:p-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        OwnAI BYOK Autonomous Agent
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
        Building software with autonomous intelligence.
      </h1>
      
      <p className="text-slate-400 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
        Senior Engineer crafting resilient distributed architectures & reactive developer tooling. Powered by self-hosted LLM routing.
      </p>
      
      <div className="flex flex-wrap gap-4">
        <button className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors flex items-center gap-2">
          Get in Touch <ArrowRight className="w-4 h-4" />
        </button>
        <button className="px-5 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors flex items-center gap-2">
          <Code2 className="w-4 h-4" /> View GitHub
        </button>
      </div>
    </section>
  );
}`
  },
  {
    id: 'file_contact_tsx',
    projectId: 'project_jarvis_demo',
    path: 'components/ContactForm.tsx',
    name: 'ContactForm.tsx',
    language: 'typescript',
    sizeBytes: 1250,
    linesCount: 46,
    gitStatus: 'UNMODIFIED',
    updatedAt: Date.now(),
    originalContent: `import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setSent(true);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8">
      <h2 className="text-xl font-bold text-white mb-1">Initiate Direct Transmission</h2>
      <p className="text-sm text-slate-400 mb-6">Leave your coordinates for collaboration inquiries.</p>

      {sent ? (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Message verified and transmitted to sandbox queue.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Developer or Entity Name"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="verified.email@domain.com"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Project requirements, latency budgets, or architecture notes..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Transmit Message
          </button>
        </form>
      )}
    </div>
  );
}`,
    content: `import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setSent(true);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8">
      <h2 className="text-xl font-bold text-white mb-1">Initiate Direct Transmission</h2>
      <p className="text-sm text-slate-400 mb-6">Leave your coordinates for collaboration inquiries.</p>

      {sent ? (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Message verified and transmitted to sandbox queue.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Developer or Entity Name"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="verified.email@domain.com"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Project requirements, latency budgets, or architecture notes..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Transmit Message
          </button>
        </form>
      )}
    </div>
  );
}`
  },
  {
    id: 'file_theme_toggle_tsx',
    projectId: 'project_jarvis_demo',
    path: 'components/ThemeToggle.tsx',
    name: 'ThemeToggle.tsx',
    language: 'typescript',
    sizeBytes: 640,
    linesCount: 22,
    gitStatus: 'UNMODIFIED',
    updatedAt: Date.now(),
    originalContent: `import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors"
      title="Toggle Visual Mode"
    >
      {isDark ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
    </button>
  );
}`,
    content: `import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors"
      title="Toggle Visual Mode"
    >
      {isDark ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
    </button>
  );
}`
  },
  {
    id: 'file_package_json',
    projectId: 'project_jarvis_demo',
    path: 'package.json',
    name: 'package.json',
    language: 'json',
    sizeBytes: 390,
    linesCount: 16,
    gitStatus: 'UNMODIFIED',
    updatedAt: Date.now(),
    originalContent: `{
  "name": "jarvis-portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.428.0"
  }
}`,
    content: `{
  "name": "jarvis-portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.428.0"
  }
}`
  },
  {
    id: 'file_readme_md',
    projectId: 'project_jarvis_demo',
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    sizeBytes: 520,
    linesCount: 18,
    gitStatus: 'UNMODIFIED',
    updatedAt: Date.now(),
    originalContent: `# Jarvis Portfolio & Agent OS

Autonomously generated and verified with **OwnAI BYOK Coding Agent**.

### Architecture
- Framework: Next.js 14 App Router
- Styling: Tailwind CSS Dark Slate
- Build verification: 0 syntax errors, 100% test assertions pass in container sandbox
- Model chain: DeepSeek R1 -> Claude 3.5 Sonnet -> GPT-4o
`,
    content: `# Jarvis Portfolio & Agent OS

Autonomously generated and verified with **OwnAI BYOK Coding Agent**.

### Architecture
- Framework: Next.js 14 App Router
- Styling: Tailwind CSS Dark Slate
- Build verification: 0 syntax errors, 100% test assertions pass in container sandbox
- Model chain: DeepSeek R1 -> Claude 3.5 Sonnet -> GPT-4o
`
  }
];

const DEFAULT_API_KEYS: ApiKeyEntity[] = [
  {
    id: 'key_nvidia_nim',
    name: 'NVIDIA NIM Primary API',
    provider: 'nvidia',
    maskedKey: 'nvapi-••••••••82f1',
    encryptedKey: 'bXlfdGVzdF9rZXlfMTIz',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    status: 'ACTIVE',
    createdAt: Date.now() - 86400000 * 5,
    lastUsedAt: Date.now() - 120000
  },
  {
    id: 'key_anthropic_prod',
    name: 'Anthropic Claude Enterprise',
    provider: 'anthropic',
    maskedKey: 'sk-ant••••••••9x4a',
    encryptedKey: 'bXlfdGVzdF9rZXlfNDU2',
    baseUrl: 'https://api.anthropic.com/v1',
    status: 'ACTIVE',
    createdAt: Date.now() - 86400000 * 8,
    lastUsedAt: Date.now() - 360000
  },
  {
    id: 'key_openai_dev',
    name: 'OpenAI GPT-4o Tier 4',
    provider: 'openai',
    maskedKey: 'sk-pro••••••••K7m1',
    encryptedKey: 'bXlfdGVzdF9rZXlfNzg5',
    baseUrl: 'https://api.openai.com/v1',
    status: 'ACTIVE',
    createdAt: Date.now() - 86400000 * 10,
    lastUsedAt: Date.now() - 7200000
  },
  {
    id: 'key_gemini_pro',
    name: 'Google Gemini 1.5 Pro',
    provider: 'gemini',
    maskedKey: 'AIzaSy••••••••P9kL',
    encryptedKey: 'bXlfdGVzdF9rZXlfYWFh',
    baseUrl: 'https://generativelanguage.googleapis.com',
    status: 'ACTIVE',
    createdAt: Date.now() - 86400000 * 4,
    lastUsedAt: Date.now() - 14400000
  },
  {
    id: 'key_groq_lpu',
    name: 'Groq LPU Ultra-Fast',
    provider: 'groq',
    maskedKey: 'gsk_99••••••••33b7',
    encryptedKey: 'bXlfdGVzdF9rZXlfYmJi',
    baseUrl: 'https://api.groq.com/openai/v1',
    status: 'ACTIVE',
    createdAt: Date.now() - 86400000 * 2,
    lastUsedAt: Date.now() - 28800000
  }
];

const DEFAULT_AI_ROUTES: AiRouteEntity[] = [
  {
    id: 'route_p1_deepseek',
    priority: 1,
    name: 'NVIDIA NIM — DeepSeek R1 Reasoning',
    provider: 'nvidia',
    modelId: 'deepseek-ai/deepseek-r1',
    apiKeyId: 'key_nvidia_nim',
    supportsVision: false,
    supportsTools: true,
    isEnabled: true
  },
  {
    id: 'route_p2_claude',
    priority: 2,
    name: 'Anthropic — Claude 3.5 Sonnet',
    provider: 'anthropic',
    modelId: 'claude-3-5-sonnet-20241022',
    apiKeyId: 'key_anthropic_prod',
    supportsVision: true,
    supportsTools: true,
    isEnabled: true
  },
  {
    id: 'route_p3_openai',
    priority: 3,
    name: 'OpenAI — GPT-4o Omni Coding',
    provider: 'openai',
    modelId: 'gpt-4o',
    apiKeyId: 'key_openai_dev',
    supportsVision: true,
    supportsTools: true,
    isEnabled: true
  },
  {
    id: 'route_p4_gemini',
    priority: 4,
    name: 'Google — Gemini 1.5 Pro 2M Context',
    provider: 'gemini',
    modelId: 'gemini-1.5-pro',
    apiKeyId: 'key_gemini_pro',
    supportsVision: true,
    supportsTools: true,
    isEnabled: true
  },
  {
    id: 'route_p5_groq',
    priority: 5,
    name: 'Groq — Llama 3.3 70B (800 T/s)',
    provider: 'groq',
    modelId: 'llama-3.3-70b-versatile',
    apiKeyId: 'key_groq_lpu',
    supportsVision: false,
    supportsTools: true,
    isEnabled: true
  }
];

const DEFAULT_MESSAGES: ConversationMessageEntity[] = [
  {
    id: 'msg_welcome',
    projectId: 'project_jarvis_demo',
    sender: 'AGENT',
    content: 'OwnAI Autonomous BYOK Agent initialized with 5 prioritized model routes. Ready to inspect files, execute builds, and build full-stack code.',
    diffSummary: '',
    timestamp: Date.now() - 3600000
  }
];

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving to localStorage key "${key}":`, e);
    }
  }

  // User Auth
  getUser(): User | null {
    return this.get<User | null>(STORAGE_KEYS.USER, DEFAULT_USER);
  }

  setUser(user: User | null): void {
    this.set(STORAGE_KEYS.USER, user);
  }

  // Projects
  getProjects(): ProjectEntity[] {
    return this.get<ProjectEntity[]>(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
  }

  saveProjects(projects: ProjectEntity[]): void {
    this.set(STORAGE_KEYS.PROJECTS, projects);
  }

  // Files
  getFiles(): ProjectFileEntity[] {
    return this.get<ProjectFileEntity[]>(STORAGE_KEYS.FILES, DEFAULT_FILES);
  }

  saveFiles(files: ProjectFileEntity[]): void {
    this.set(STORAGE_KEYS.FILES, files);
  }

  // API Keys
  getApiKeys(): ApiKeyEntity[] {
    return this.get<ApiKeyEntity[]>(STORAGE_KEYS.API_KEYS, DEFAULT_API_KEYS);
  }

  saveApiKeys(keys: ApiKeyEntity[]): void {
    this.set(STORAGE_KEYS.API_KEYS, keys);
  }

  // AI Routes
  getAiRoutes(): AiRouteEntity[] {
    return this.get<AiRouteEntity[]>(STORAGE_KEYS.AI_ROUTES, DEFAULT_AI_ROUTES);
  }

  saveAiRoutes(routes: AiRouteEntity[]): void {
    this.set(STORAGE_KEYS.AI_ROUTES, routes);
  }

  // Messages
  getMessages(): ConversationMessageEntity[] {
    return this.get<ConversationMessageEntity[]>(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  }

  saveMessages(messages: ConversationMessageEntity[]): void {
    this.set(STORAGE_KEYS.MESSAGES, messages);
  }

  // Tasks
  getTasks(): AgentTaskEntity[] {
    return this.get<AgentTaskEntity[]>(STORAGE_KEYS.TASKS, []);
  }

  saveTasks(tasks: AgentTaskEntity[]): void {
    this.set(STORAGE_KEYS.TASKS, tasks);
  }

  // Steps
  getSteps(): AgentStepEntity[] {
    return this.get<AgentStepEntity[]>(STORAGE_KEYS.STEPS, []);
  }

  saveSteps(steps: AgentStepEntity[]): void {
    this.set(STORAGE_KEYS.STEPS, steps);
  }

  // Attachments
  getAttachments(): AttachmentEntity[] {
    return this.get<AttachmentEntity[]>(STORAGE_KEYS.ATTACHMENTS, []);
  }

  saveAttachments(attachments: AttachmentEntity[]): void {
    this.set(STORAGE_KEYS.ATTACHMENTS, attachments);
  }

  // Logs
  getLogs(): ExecutionLogEntity[] {
    return this.get<ExecutionLogEntity[]>(STORAGE_KEYS.LOGS, []);
  }

  saveLogs(logs: ExecutionLogEntity[]): void {
    this.set(STORAGE_KEYS.LOGS, logs);
  }

  resetToDefaults(): void {
    this.set(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
    this.set(STORAGE_KEYS.FILES, DEFAULT_FILES);
    this.set(STORAGE_KEYS.API_KEYS, DEFAULT_API_KEYS);
    this.set(STORAGE_KEYS.AI_ROUTES, DEFAULT_AI_ROUTES);
    this.set(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
    this.set(STORAGE_KEYS.TASKS, []);
    this.set(STORAGE_KEYS.STEPS, []);
    this.set(STORAGE_KEYS.ATTACHMENTS, []);
    this.set(STORAGE_KEYS.LOGS, []);
    this.set(STORAGE_KEYS.USER, DEFAULT_USER);
  }
}

export const storage = new StorageService();
