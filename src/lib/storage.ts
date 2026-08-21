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
  PROJECTS: 'ownai_projects_v3',
  FILES: 'ownai_files_v3',
  API_KEYS: 'ownai_api_keys_v3',
  AI_ROUTES: 'ownai_ai_routes_v3',
  MESSAGES: 'ownai_messages_v3',
  TASKS: 'ownai_tasks_v3',
  STEPS: 'ownai_steps_v3',
  ATTACHMENTS: 'ownai_attachments_v3',
  LOGS: 'ownai_logs_v3',
  USER: 'ownai_user_v3'
};

/**
 * Generates realistic starter files for newly created projects based on template
 */
export function generateStarterFilesForTemplate(
  projectId: string,
  projectName: string,
  templateType: string
): ProjectFileEntity[] {
  const safeName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const now = Date.now();

  if (templateType.toLowerCase().includes('next')) {
    return [
      {
        id: `file_${projectId}_page`,
        projectId,
        path: 'app/page.tsx',
        name: 'page.tsx',
        language: 'typescript',
        sizeBytes: 1040,
        linesCount: 38,
        gitStatus: 'UNMODIFIED',
        updatedAt: now,
        originalContent: `import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800">
      <nav className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-mono font-bold tracking-tight text-white text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          ${projectName}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
            Next.js 14 App Router
          </span>
        </div>
      </nav>
      
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        <Hero />
        <Features />
      </div>
    </main>
  );
}`,
        content: `import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800">
      <nav className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-mono font-bold tracking-tight text-white text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          ${projectName}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
            Next.js 14 App Router
          </span>
        </div>
      </nav>
      
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        <Hero />
        <Features />
      </div>
    </main>
  );
}`
      },
      {
        id: `file_${projectId}_hero`,
        projectId,
        path: 'components/Hero.tsx',
        name: 'Hero.tsx',
        language: 'typescript',
        sizeBytes: 1100,
        linesCount: 36,
        gitStatus: 'UNMODIFIED',
        updatedAt: now,
        originalContent: `import React from 'react';
import { ArrowRight, Sparkles, Code2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 sm:p-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-mono mb-6">
        <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
        OwnAI Autonomous Workspace
      </div>
      
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
        Build with intelligence.
      </h1>
      
      <p className="text-zinc-400 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
        This project was created with OwnAI. Ask your AI coding agent to edit styles, generate backend routes, or add components.
      </p>
      
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold font-mono transition-colors flex items-center gap-2">
          Get Started <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5" /> View Source
        </button>
      </div>
    </section>
  );
}`,
        content: `import React from 'react';
import { ArrowRight, Sparkles, Code2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 sm:p-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-mono mb-6">
        <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
        OwnAI Autonomous Workspace
      </div>
      
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
        Build with intelligence.
      </h1>
      
      <p className="text-zinc-400 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
        This project was created with OwnAI. Ask your AI coding agent to edit styles, generate backend routes, or add components.
      </p>
      
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold font-mono transition-colors flex items-center gap-2">
          Get Started <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5" /> View Source
        </button>
      </div>
    </section>
  );
}`
      },
      {
        id: `file_${projectId}_features`,
        projectId,
        path: 'components/Features.tsx',
        name: 'Features.tsx',
        language: 'typescript',
        sizeBytes: 850,
        linesCount: 28,
        gitStatus: 'UNMODIFIED',
        updatedAt: now,
        originalContent: `import React from 'react';
import { Shield, Zap, Terminal } from 'lucide-react';

export default function Features() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <Shield className="w-5 h-5 text-white mb-3" />
        <h3 className="text-sm font-bold text-white font-mono mb-1">Encrypted Keys</h3>
        <p className="text-xs text-zinc-400">Zero telemetry leakage with client AES-256 derivation.</p>
      </div>
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <Zap className="w-5 h-5 text-white mb-3" />
        <h3 className="text-sm font-bold text-white font-mono mb-1">Fast Execution</h3>
        <p className="text-xs text-zinc-400">Autonomous code modification verified in container sandbox.</p>
      </div>
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <Terminal className="w-5 h-5 text-white mb-3" />
        <h3 className="text-sm font-bold text-white font-mono mb-1">BYOK Routing</h3>
        <p className="text-xs text-zinc-400">Automatic multi-provider model failover on rate limits.</p>
      </div>
    </div>
  );
}`,
        content: `import React from 'react';
import { Shield, Zap, Terminal } from 'lucide-react';

export default function Features() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <Shield className="w-5 h-5 text-white mb-3" />
        <h3 className="text-sm font-bold text-white font-mono mb-1">Encrypted Keys</h3>
        <p className="text-xs text-zinc-400">Zero telemetry leakage with client AES-256 derivation.</p>
      </div>
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <Zap className="w-5 h-5 text-white mb-3" />
        <h3 className="text-sm font-bold text-white font-mono mb-1">Fast Execution</h3>
        <p className="text-xs text-zinc-400">Autonomous code modification verified in container sandbox.</p>
      </div>
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <Terminal className="w-5 h-5 text-white mb-3" />
        <h3 className="text-sm font-bold text-white font-mono mb-1">BYOK Routing</h3>
        <p className="text-xs text-zinc-400">Automatic multi-provider model failover on rate limits.</p>
      </div>
    </div>
  );
}`
      },
      {
        id: `file_${projectId}_pkg`,
        projectId,
        path: 'package.json',
        name: 'package.json',
        language: 'json',
        sizeBytes: 380,
        linesCount: 15,
        gitStatus: 'UNMODIFIED',
        updatedAt: now,
        originalContent: `{
  "name": "${safeName}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.428.0"
  }
}`,
        content: `{
  "name": "${safeName}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
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
        id: `file_${projectId}_readme`,
        projectId,
        path: 'README.md',
        name: 'README.md',
        language: 'markdown',
        sizeBytes: 420,
        linesCount: 14,
        gitStatus: 'UNMODIFIED',
        updatedAt: now,
        originalContent: `# ${projectName}

Autonomously scaffolded with **OwnAI BYOK Autonomous Agent**.

## Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`

Created on ${new Date(now).toLocaleDateString()}.
`,
        content: `# ${projectName}

Autonomously scaffolded with **OwnAI BYOK Autonomous Agent**.

## Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`

Created on ${new Date(now).toLocaleDateString()}.
`
      }
    ];
  }

  if (templateType.toLowerCase().includes('python')) {
    return [
      {
        id: `file_${projectId}_main`,
        projectId,
        path: 'main.py',
        name: 'main.py',
        language: 'python',
        sizeBytes: 680,
        linesCount: 24,
        gitStatus: 'UNMODIFIED',
        updatedAt: now,
        originalContent: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="${projectName}", version="1.0.0")

class HealthResponse(BaseModel):
    status: str
    service: str

@app.get("/")
def read_root():
    return {"message": "Welcome to ${projectName}", "runtime": "FastAPI + Python 3.12"}

@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="healthy", service="${safeName}")
`,
        content: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="${projectName}", version="1.0.0")

class HealthResponse(BaseModel):
    status: str
    service: str

@app.get("/")
def read_root():
    return {"message": "Welcome to ${projectName}", "runtime": "FastAPI + Python 3.12"}

@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="healthy", service="${safeName}")
`
      },
      {
        id: `file_${projectId}_reqs`,
        projectId,
        path: 'requirements.txt',
        name: 'requirements.txt',
        language: 'text',
        sizeBytes: 85,
        linesCount: 4,
        gitStatus: 'UNMODIFIED',
        updatedAt: now,
        originalContent: `fastapi==0.111.0\nuvicorn==0.30.1\npydantic==2.7.4\npytest==8.2.2\n`,
        content: `fastapi==0.111.0\nuvicorn==0.30.1\npydantic==2.7.4\npytest==8.2.2\n`
      },
      {
        id: `file_${projectId}_readme`,
        projectId,
        path: 'README.md',
        name: 'README.md',
        language: 'markdown',
        sizeBytes: 380,
        linesCount: 12,
        gitStatus: 'UNMODIFIED',
        updatedAt: now,
        originalContent: `# ${projectName} (Python API)

Built with **FastAPI & Python 3.12** on OwnAI.

\`\`\`bash
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`
`,
        content: `# ${projectName} (Python API)

Built with **FastAPI & Python 3.12** on OwnAI.

\`\`\`bash
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`
`
      }
    ];
  }

  // Default: React 18 + Vite template
  return [
    {
      id: `file_${projectId}_app_tsx`,
      projectId,
      path: 'src/App.tsx',
      name: 'App.tsx',
      language: 'typescript',
      sizeBytes: 980,
      linesCount: 32,
      gitStatus: 'UNMODIFIED',
      updatedAt: now,
      originalContent: `import React, { useState } from 'react';
import { Sparkles, ArrowRight, Code } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 text-center">
        <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center mx-auto mb-4 font-bold font-mono">
          <Code className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-mono text-white mb-2">${projectName}</h1>
        <p className="text-xs text-zinc-400 mb-6 font-mono">
          Scaffolded with React 18 + Vite. Ready for AI autonomous builds.
        </p>

        <button
          onClick={() => setCount((c) => c + 1)}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono transition-colors"
        >
          Clicked {count} times
        </button>
      </div>
    </div>
  );
}`,
      content: `import React, { useState } from 'react';
import { Sparkles, ArrowRight, Code } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 text-center">
        <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center mx-auto mb-4 font-bold font-mono">
          <Code className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-mono text-white mb-2">${projectName}</h1>
        <p className="text-xs text-zinc-400 mb-6 font-mono">
          Scaffolded with React 18 + Vite. Ready for AI autonomous builds.
        </p>

        <button
          onClick={() => setCount((c) => c + 1)}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono transition-colors"
        >
          Clicked {count} times
        </button>
      </div>
    </div>
  );
}`
    },
    {
      id: `file_${projectId}_index_html`,
      projectId,
      path: 'index.html',
      name: 'index.html',
      language: 'html',
      sizeBytes: 380,
      linesCount: 14,
      gitStatus: 'UNMODIFIED',
      updatedAt: now,
      originalContent: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body class="bg-zinc-950">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body class="bg-zinc-950">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
    },
    {
      id: `file_${projectId}_pkg`,
      projectId,
      path: 'package.json',
      name: 'package.json',
      language: 'json',
      sizeBytes: 360,
      linesCount: 15,
      gitStatus: 'UNMODIFIED',
      updatedAt: now,
      originalContent: `{
  "name": "${safeName}",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.475.0"
  }
}`,
      content: `{
  "name": "${safeName}",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.475.0"
  }
}`
    },
    {
      id: `file_${projectId}_readme`,
      projectId,
      path: 'README.md',
      name: 'README.md',
      language: 'markdown',
      sizeBytes: 320,
      linesCount: 10,
      gitStatus: 'UNMODIFIED',
      updatedAt: now,
      originalContent: `# ${projectName}

Created in OwnAI workspace. Bring your own AI models to build and deploy.
`,
      content: `# ${projectName}

Created in OwnAI workspace. Bring your own AI models to build and deploy.
`
    }
  ];
}

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`Storage reading error for ${key}:`, e);
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage writing error for ${key}:`, e);
    }
  }

  // Projects - Starts EMPTY for a new user
  getProjects(): ProjectEntity[] {
    return this.get<ProjectEntity[]>(STORAGE_KEYS.PROJECTS, []);
  }

  saveProjects(projects: ProjectEntity[]): void {
    this.set(STORAGE_KEYS.PROJECTS, projects);
  }

  // Files - Starts EMPTY
  getFiles(): ProjectFileEntity[] {
    return this.get<ProjectFileEntity[]>(STORAGE_KEYS.FILES, []);
  }

  saveFiles(files: ProjectFileEntity[]): void {
    this.set(STORAGE_KEYS.FILES, files);
  }

  // API Keys - Starts EMPTY
  getApiKeys(): ApiKeyEntity[] {
    return this.get<ApiKeyEntity[]>(STORAGE_KEYS.API_KEYS, []);
  }

  saveApiKeys(keys: ApiKeyEntity[]): void {
    this.set(STORAGE_KEYS.API_KEYS, keys);
  }

  // AI Routes - Starts EMPTY
  getAiRoutes(): AiRouteEntity[] {
    return this.get<AiRouteEntity[]>(STORAGE_KEYS.AI_ROUTES, []);
  }

  saveAiRoutes(routes: AiRouteEntity[]): void {
    this.set(STORAGE_KEYS.AI_ROUTES, routes);
  }

  // Chat Messages - Starts EMPTY
  getMessages(): ConversationMessageEntity[] {
    return this.get<ConversationMessageEntity[]>(STORAGE_KEYS.MESSAGES, []);
  }

  saveMessages(messages: ConversationMessageEntity[]): void {
    this.set(STORAGE_KEYS.MESSAGES, messages);
  }

  // Agent Tasks
  getTasks(): AgentTaskEntity[] {
    return this.get<AgentTaskEntity[]>(STORAGE_KEYS.TASKS, []);
  }

  saveTasks(tasks: AgentTaskEntity[]): void {
    this.set(STORAGE_KEYS.TASKS, tasks);
  }

  // Agent Steps
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

  // Execution Logs
  getLogs(): ExecutionLogEntity[] {
    return this.get<ExecutionLogEntity[]>(STORAGE_KEYS.LOGS, []);
  }

  saveLogs(logs: ExecutionLogEntity[]): void {
    this.set(STORAGE_KEYS.LOGS, logs);
  }

  // User Auth - Starts NULL (unauthenticated)
  getUser(): User | null {
    return this.get<User | null>(STORAGE_KEYS.USER, null);
  }

  setUser(user: User | null): void {
    this.set(STORAGE_KEYS.USER, user);
  }

  // Reset all workspace data to clean empty state
  resetAll(): void {
    this.set(STORAGE_KEYS.PROJECTS, []);
    this.set(STORAGE_KEYS.FILES, []);
    this.set(STORAGE_KEYS.API_KEYS, []);
    this.set(STORAGE_KEYS.AI_ROUTES, []);
    this.set(STORAGE_KEYS.MESSAGES, []);
    this.set(STORAGE_KEYS.TASKS, []);
    this.set(STORAGE_KEYS.STEPS, []);
    this.set(STORAGE_KEYS.ATTACHMENTS, []);
    this.set(STORAGE_KEYS.LOGS, []);
  }

  clearAll(): void {
    this.resetAll();
  }
}

export const storage = new StorageService();
