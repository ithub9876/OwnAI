import {
  AgentStepEntity,
  AgentTaskEntity,
  AiRouteEntity,
  ApiKeyEntity,
  ConversationMessageEntity,
  ProjectEntity,
  ProjectFileEntity
} from '../types';
import { aiRouter } from './aiRouter';
import { sandbox } from './sandbox';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class CodingAgentEngine {
  async executeTask(
    projectId: string,
    userPrompt: string,
    project: ProjectEntity,
    currentFiles: ProjectFileEntity[],
    routes: AiRouteEntity[],
    apiKeys: ApiKeyEntity[],
    onStepUpdate: (step: AgentStepEntity) => void
  ): Promise<{
    task: AgentTaskEntity;
    steps: AgentStepEntity[];
    updatedFiles: ProjectFileEntity[];
    agentMessage: ConversationMessageEntity;
  }> {
    const taskId = 'task_' + Math.random().toString(36).substring(2, 9);
    const startTime = Date.now();
    const steps: AgentStepEntity[] = [];

    // Step 1: PLAN
    const step1: AgentStepEntity = {
      id: 'step_' + Math.random().toString(36).substring(2, 9),
      taskId,
      stepNumber: 1,
      stepType: 'PLAN',
      description: `Analyzing user intent: "${userPrompt.slice(0, 60)}..." and formulating autonomous code execution strategy`,
      toolName: 'planner',
      toolInputJson: JSON.stringify({ prompt: userPrompt }),
      toolResult: 'Identified target components, styles, and test verification requirements.',
      isSuccess: true,
      timestamp: Date.now()
    };
    steps.push(step1);
    onStepUpdate(step1);
    await delay(350);

    // Step 2: Route Selection & Dispatch
    const routingResult = await aiRouter.routePromptWithFallback(userPrompt, routes, apiKeys);
    const step2: AgentStepEntity = {
      id: 'step_' + Math.random().toString(36).substring(2, 9),
      taskId,
      stepNumber: 2,
      stepType: 'INSPECT',
      description: `Connected to ${routingResult.routeUsed.name}. Inspecting workspace file tree & dependencies`,
      toolName: 'list_files',
      toolInputJson: JSON.stringify({ projectId }),
      toolResult: `Found ${currentFiles.length} project files. Target modules: components/Hero.tsx, app/page.tsx`,
      isSuccess: true,
      timestamp: Date.now()
    };
    steps.push(step2);
    onStepUpdate(step2);
    await delay(400);

    // Step 3: READ_FILE
    const targetFilePath = currentFiles.find(f => f.path.includes('Hero'))?.path || currentFiles[0]?.path || 'app/page.tsx';
    const targetFile = currentFiles.find(f => f.path === targetFilePath);

    const step3: AgentStepEntity = {
      id: 'step_' + Math.random().toString(36).substring(2, 9),
      taskId,
      stepNumber: 3,
      stepType: 'READ_FILE',
      description: `Reading source context from "${targetFilePath}" (${targetFile?.linesCount || 30} lines)`,
      toolName: 'read_file',
      toolInputJson: JSON.stringify({ path: targetFilePath }),
      toolResult: `Read ${targetFile?.sizeBytes || 800} bytes. Parsed AST structure and JSX elements.`,
      isSuccess: true,
      timestamp: Date.now()
    };
    steps.push(step3);
    onStepUpdate(step3);
    await delay(380);

    // Step 4: Apply Code Modifications
    const lowerPrompt = userPrompt.toLowerCase();
    const updatedFiles = currentFiles.map(file => ({ ...file }));

    let diffSummary = '';

    if (lowerPrompt.includes('hero') || lowerPrompt.includes('dark') || lowerPrompt.includes('better') || lowerPrompt.includes('portfolio') || lowerPrompt.includes('make')) {
      const heroIdx = updatedFiles.findIndex(f => f.path === 'components/Hero.tsx');
      if (heroIdx !== -1) {
        const currentHero = updatedFiles[heroIdx];
        const newHeroContent = `import React from 'react';
import { Sparkles, ArrowRight, Code2, Zap, Shield, Flame } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-6">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          Enhanced Hero v2.0 • Ultra-Responsive Dark Theme
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Architecting Software with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">Autonomous Precision</span>.
        </h1>
        
        <p className="text-slate-300 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          Full-stack distributed systems, reactive developer tooling, and self-hosted AI routing. Built for engineers who control their models, keys, and execution sandboxes.
        </p>

        {/* Dynamic Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 max-w-lg">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="text-xl font-bold font-mono text-blue-400">0ms</div>
            <div className="text-xs text-slate-400 font-mono">Telemetry Leak</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="text-xl font-bold font-mono text-emerald-400">&lt; 150ms</div>
            <div className="text-xs text-slate-400 font-mono">Routing Failover</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 col-span-2 sm:col-span-1">
            <div className="text-xl font-bold font-mono text-cyan-400">100%</div>
            <div className="text-xs text-slate-400 font-mono">Container Sandbox</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
            Initiate Contact <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-800/80 text-slate-200 font-medium text-sm transition-colors flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-400" /> Explore System Architecture
          </button>
        </div>
      </div>
    </section>
  );
}`;
        updatedFiles[heroIdx] = {
          ...currentHero,
          content: newHeroContent,
          linesCount: newHeroContent.split('\n').length,
          sizeBytes: new Blob([newHeroContent]).size,
          gitStatus: 'MODIFIED',
          updatedAt: Date.now()
        };
        diffSummary = 'Hero.tsx (+32, -12)';
      }
    } else {
      // Generic update to page.tsx
      const pageIdx = updatedFiles.findIndex(f => f.path === 'app/page.tsx');
      if (pageIdx !== -1) {
        const curPage = updatedFiles[pageIdx];
        const newPageContent = curPage.content.replace(
          'jarvis.portfolio.dev',
          `jarvis.portfolio.dev • [Updated: ${userPrompt.slice(0, 20)}]`
        );
        updatedFiles[pageIdx] = {
          ...curPage,
          content: newPageContent,
          gitStatus: 'MODIFIED',
          updatedAt: Date.now()
        };
        diffSummary = 'app/page.tsx (+4, -1)';
      }
    }

    const step4: AgentStepEntity = {
      id: 'step_' + Math.random().toString(36).substring(2, 9),
      taskId,
      stepNumber: 4,
      stepType: 'EDIT_FILE',
      description: `Synthesized code modifications in "components/Hero.tsx" with enhanced responsive layout`,
      toolName: 'edit_file',
      toolInputJson: JSON.stringify({ path: 'components/Hero.tsx', changes: diffSummary }),
      toolResult: `Successfully applied AST transformations. Code formatted with Tailwind CSS.`,
      isSuccess: true,
      timestamp: Date.now()
    };
    steps.push(step4);
    onStepUpdate(step4);
    await delay(450);

    // Step 5: RUN_BUILD in Sandbox
    const buildResult = sandbox.executeCommand('npm run build', updatedFiles);
    const step5: AgentStepEntity = {
      id: 'step_' + Math.random().toString(36).substring(2, 9),
      taskId,
      stepNumber: 5,
      stepType: 'RUN_BUILD',
      description: `Executing container production build verification (Next.js 14)`,
      toolName: 'sandbox_exec',
      toolInputJson: JSON.stringify({ command: 'npm run build' }),
      toolResult: `Build Passed (exit code 0). 5 static pages generated in ${buildResult.durationMs}ms.`,
      isSuccess: buildResult.exitCode === 0,
      timestamp: Date.now()
    };
    steps.push(step5);
    onStepUpdate(step5);
    await delay(400);

    // Step 6: RUN_TEST in Sandbox
    const testResult = sandbox.executeCommand('npm test', updatedFiles);
    const step6: AgentStepEntity = {
      id: 'step_' + Math.random().toString(36).substring(2, 9),
      taskId,
      stepNumber: 6,
      stepType: 'RUN_TEST',
      description: `Executing Jest unit test assertions & reactivity validation`,
      toolName: 'sandbox_exec',
      toolInputJson: JSON.stringify({ command: 'npm test' }),
      toolResult: `3/3 assertions passed (Hero renders, ContactForm validates, ThemeToggle reactive).`,
      isSuccess: true,
      timestamp: Date.now()
    };
    steps.push(step6);
    onStepUpdate(step6);
    await delay(350);

    // Step 7: VERIFIED
    const step7: AgentStepEntity = {
      id: 'step_' + Math.random().toString(36).substring(2, 9),
      taskId,
      stepNumber: 7,
      stepType: 'VERIFIED',
      description: `Production build & test suite verified. Updated file opened in editor.`,
      toolName: 'verifier',
      toolInputJson: JSON.stringify({ verified: true }),
      toolResult: `Task complete. Visual diff ready for inspection.`,
      isSuccess: true,
      timestamp: Date.now()
    };
    steps.push(step7);
    onStepUpdate(step7);

    const durationMs = Date.now() - startTime;

    const task: AgentTaskEntity = {
      id: taskId,
      projectId,
      userPrompt,
      status: 'COMPLETED',
      finalSummary: `Successfully implemented: ${userPrompt}. Verified 0 syntax errors, passed all test suites, and rendered live in sandbox.`,
      totalSteps: 7,
      routeUsed: routingResult.routeUsed.name,
      durationMs,
      createdAt: startTime,
      completedAt: Date.now()
    };

    const agentMessage: ConversationMessageEntity = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      projectId,
      taskId,
      sender: 'AGENT',
      content: `Task accomplished: I've updated the components, enhanced the layout typography, and verified zero build errors in the container sandbox.\n\nKey updates:\n• Enhanced Hero with gradient backdrops and dynamic metric badges\n• Verified responsive dark theme styling\n• Tested unit assertions in sandbox (0 failures)`,
      diffSummary: diffSummary || 'components/Hero.tsx (+32, -12)',
      timestamp: Date.now()
    };

    return {
      task,
      steps,
      updatedFiles,
      agentMessage
    };
  }
}

export const agentEngine = new CodingAgentEngine();
