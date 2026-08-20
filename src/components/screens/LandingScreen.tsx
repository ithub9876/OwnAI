import React, { useState } from 'react';
import {
  Sparkles,
  Terminal,
  Shield,
  Layers,
  Key,
  FolderGit2,
  Play,
  ArrowRight,
  Zap,
  Cpu,
  Lock,
  Boxes,
  CheckCircle2,
  Download,
  Code2
} from 'lucide-react';
import { AppScreen } from '../../types';

interface LandingScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onLaunchDemoProject: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onNavigate,
  onLaunchDemoProject
}) => {
  const [simStep, setSimStep] = useState(0);

  const simSteps = [
    { title: '1. Plan & AST Decomposition', desc: 'Formulating code touches across 4 Next.js files', type: 'PLAN' },
    { title: '2. Multi-Model Route Failover', desc: 'NVIDIA DeepSeek -> Claude 3.5 Sonnet backup', type: 'ROUTE' },
    { title: '3. Isolated Container Build', desc: '0 syntax errors, 100% Jest assertions passing', type: 'BUILD' }
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-950 text-zinc-100 flex flex-col selection:bg-white selection:text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Subtle glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-white/[0.04] blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-300 text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            OwnAI Autonomous Coding Agent Platform
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Build software with <br />
            <span className="text-zinc-400">
              your own models &amp; keys.
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            The autonomous developer workspace with dynamic multi-model routing, isolated sandbox execution, client-side AES key encryption, and instantaneous ZIP export.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onLaunchDemoProject}
              className="px-6 py-3 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
              id="btn-launch-demo-ide"
            >
              <Terminal className="w-4 h-4" /> Launch IDE Workspace <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('ROUTING')}
              className="px-6 py-3 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-white font-medium text-sm transition-colors flex items-center gap-2"
              id="btn-configure-routes"
            >
              <Key className="w-4 h-4 text-white" /> Configure AI Routes
            </button>
          </div>
        </div>

        {/* Live Interactive IDE Simulation Card */}
        <div className="relative z-10 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {/* Card Window Top */}
          <div className="h-10 bg-zinc-950 border-b border-zinc-800 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-zinc-700" />
              <span className="w-3 h-3 rounded-full bg-zinc-700" />
              <span className="w-3 h-3 rounded-full bg-zinc-700" />
              <span className="text-xs font-mono text-zinc-400 ml-2 font-medium">
                workspace: jarvis.portfolio.dev
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                SANDBOX ONLINE
              </span>
            </div>
          </div>

          {/* Card Split View: Code Editor + Active Agent Stream */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
            {/* Left: Code Snippet */}
            <div className="md:col-span-7 p-4 sm:p-6 font-mono text-xs bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between overflow-x-auto">
              <div className="space-y-1.5 text-zinc-300">
                <div className="text-zinc-500">// components/Hero.tsx • Autonomous touch verified</div>
                <div className="text-zinc-200 font-semibold">export default function <span className="text-white">Hero</span>() &#123;</div>
                <div className="pl-4 text-zinc-400">const <span className="text-zinc-200">route</span> = <span className="text-zinc-300">"nvidia-deepseek-r1"</span>;</div>
                <div className="pl-4 text-zinc-300">return (</div>
                <div className="pl-8 text-zinc-400">&lt;<span className="text-white">section</span> className=<span className="text-zinc-300">"rounded-2xl border bg-zinc-900"</span>&gt;</div>
                <div className="pl-12 text-zinc-100">&lt;<span className="text-white">h1</span>&gt;Architecting Software with Autonomous Precision&lt;/<span className="text-white">h1</span>&gt;</div>
                <div className="pl-8 text-zinc-400">&lt;/<span className="text-white">section</span>&gt;</div>
                <div className="pl-4 text-zinc-300">);</div>
                <div className="text-zinc-200 font-semibold">&#125;</div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between text-zinc-500 text-[11px]">
                <span>Lines: 38 • TypeScript JSX</span>
                <span className="text-zinc-300">✓ 0 Syntax Errors</span>
              </div>
            </div>

            {/* Right: Agent Pipeline Steps */}
            <div className="md:col-span-5 p-4 sm:p-6 bg-zinc-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-white mb-4">
                  <Cpu className="w-4 h-4 text-white" />
                  Autonomous Execution Loop
                </div>

                <div className="space-y-3">
                  {simSteps.map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSimStep(idx)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        simStep === idx
                          ? 'bg-zinc-800 border-zinc-600 text-white'
                          : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs font-semibold mb-1">
                        <span>{step.title}</span>
                        <span className="text-[10px] text-zinc-300 bg-zinc-800 px-1.5 py-0.2 rounded border border-zinc-700">
                          {step.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onLaunchDemoProject}
                className="mt-6 w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" /> Inspect Live Workspace
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Feature Cards */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 font-mono">
            Engineered for Model Independence
          </h2>
          <p className="text-zinc-400 text-sm">
            OwnAI decouples autonomous agent intelligence from closed proprietary vendor silos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Pillar 1 */}
          <div className="p-5 sm:p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-2 font-mono">Zero Telemetry BYOK</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              API credentials are encrypted client-side using authenticated AES-256-GCM. Keys never touch telemetry or third-party loggers.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 sm:p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-2 font-mono">Priority AI Routing</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Seamless dynamic failover matrix across NVIDIA NIM, Anthropic Claude, OpenAI, Gemini, and local Ollama models.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 sm:p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white mb-4">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-2 font-mono">Isolated Sandbox Shell</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Execute compilation diagnostics, Jest test suites, and git version tracking in isolated sandbox container memory.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 sm:p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-2 font-mono">Instant ZIP Export</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              One-click standard zip export preserving full project directory hierarchy, ready for deployment to any production cloud.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <footer className="mt-auto border-t border-zinc-900 py-6 sm:py-8 px-4 sm:px-6 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-2">
        <span>OwnAI v2.4.1 • Autonomous BYOK Coding Agent</span>
        <span className="text-zinc-500">
          Client-Side AES-256-GCM • Zero Data Retention
        </span>
      </footer>
    </div>
  );
};
