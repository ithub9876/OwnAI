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
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 max-w-7xl mx-auto w-full">
        {/* Subtle glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            OwnAI Autonomous Coding Agent Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Build software with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
              your own models &amp; keys.
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            The autonomous developer workspace with dynamic multi-model routing, isolated sandbox execution, client-side AES key encryption, and instantaneous ZIP export.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onLaunchDemoProject}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2"
              id="btn-launch-demo-ide"
            >
              <Terminal className="w-4 h-4" /> Launch IDE Workspace <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('ROUTING')}
              className="px-6 py-3 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-300 font-medium text-sm transition-colors flex items-center gap-2"
              id="btn-configure-routes"
            >
              <Key className="w-4 h-4 text-blue-400" /> Configure AI Routes
            </button>
          </div>
        </div>

        {/* Live Interactive IDE Simulation Card */}
        <div className="relative z-10 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {/* Card Window Top */}
          <div className="h-10 bg-slate-950/80 border-b border-slate-800 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2 font-medium">
                workspace: jarvis.portfolio.dev
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                SANDBOX ONLINE
              </span>
            </div>
          </div>

          {/* Card Split View: Code Editor + Active Agent Stream */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
            {/* Left: Code Snippet */}
            <div className="md:col-span-7 p-6 font-mono text-xs bg-slate-950/90 border-r border-slate-800 flex flex-col justify-between">
              <div className="space-y-1.5 text-slate-300">
                <div className="text-slate-500">// components/Hero.tsx • Autonomous touch verified</div>
                <div className="text-blue-400">export default function <span className="text-amber-300">Hero</span>() &#123;</div>
                <div className="pl-4 text-purple-400">const <span className="text-slate-200">route</span> = <span className="text-emerald-400">"nvidia-deepseek-r1"</span>;</div>
                <div className="pl-4 text-slate-300">return (</div>
                <div className="pl-8 text-cyan-300">&lt;<span className="text-blue-400">section</span> className=<span className="text-emerald-300">"rounded-2xl border bg-slate-900"</span>&gt;</div>
                <div className="pl-12 text-slate-100">&lt;<span className="text-blue-400">h1</span>&gt;Architecting Software with Autonomous Precision&lt;/<span className="text-blue-400">h1</span>&gt;</div>
                <div className="pl-8 text-cyan-300">&lt;/<span className="text-blue-400">section</span>&gt;</div>
                <div className="pl-4 text-slate-300">);</div>
                <div className="text-blue-400">&#125;</div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-slate-500 text-[11px]">
                <span>Lines: 38 • TypeScript JSX</span>
                <span className="text-emerald-400">✓ 0 Syntax Errors</span>
              </div>
            </div>

            {/* Right: Agent Pipeline Steps */}
            <div className="md:col-span-5 p-6 bg-slate-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-white mb-4">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  Autonomous Execution Loop
                </div>

                <div className="space-y-3">
                  {simSteps.map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSimStep(idx)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        simStep === idx
                          ? 'bg-blue-600/10 border-blue-500 text-white'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs font-semibold mb-1">
                        <span>{step.title}</span>
                        <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">
                          {step.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onLaunchDemoProject}
                className="mt-6 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" /> Inspect Live Workspace
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Feature Cards */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Engineered for Model Independence
          </h2>
          <p className="text-slate-400 text-sm">
            OwnAI decouples autonomous agent intelligence from closed proprietary vendor silos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-900/30 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">Zero Telemetry BYOK</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              API credentials are encrypted client-side using authenticated AES-256-GCM. Keys never touch telemetry or third-party loggers.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-900/30 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">Priority AI Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamless dynamic failover matrix across NVIDIA NIM, Anthropic Claude, OpenAI, Gemini, and local Ollama models.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-900/30 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">Isolated Sandbox Shell</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Execute compilation diagnostics, Jest test suites, and git version tracking in isolated sandbox container memory.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-900/30 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">Instant ZIP Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              One-click standard zip export preserving full project directory hierarchy, ready for deployment to any production cloud.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <footer className="mt-auto border-t border-slate-900 py-8 px-6 text-center text-xs font-mono text-slate-600 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <span>OwnAI v2.4.1 • Autonomous BYOK Coding Agent</span>
        <span className="mt-2 sm:mt-0 text-slate-500">
          Client-Side AES-256-GCM • Zero Data Retention
        </span>
      </footer>
    </div>
  );
};
