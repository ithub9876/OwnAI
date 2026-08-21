import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  ArrowRight,
  Shield,
  KeyRound,
  Cpu,
  Route,
  Terminal,
  FolderGit2,
  Play,
  CheckCircle2,
  Layers,
  Zap,
  ExternalLink,
  Laptop,
  Smartphone,
  RotateCcw,
  Check
} from 'lucide-react';
import { User } from '../../types';

interface LandingScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  user: User | null;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onGetStarted,
  onSignIn,
  user
}) => {
  // Interactive workspace mockup state
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'preview'>('chat');
  const [mockSelectedFile, setMockSelectedFile] = useState('app/page.tsx');
  const [mockActiveRoute, setMockActiveRoute] = useState<'nvidia' | 'claude' | 'openai' | 'gemini'>('nvidia');
  const [interactiveStep, setInteractiveStep] = useState(3);

  const mockFiles = [
    { path: 'app/page.tsx', name: 'page.tsx', tag: 'TSX' },
    { path: 'components/Hero.tsx', name: 'Hero.tsx', tag: 'TSX' },
    { path: 'components/Navbar.tsx', name: 'Navbar.tsx', tag: 'TSX' },
    { path: 'app/globals.css', name: 'globals.css', tag: 'CSS' },
    { path: 'package.json', name: 'package.json', tag: 'JSON' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800">
      {/* Top Navbar */}
      <nav className="h-14 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-mono font-bold text-xs">
              O
            </div>
            <span className="font-mono font-semibold text-sm text-white tracking-tight">OwnAI</span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-xs font-mono text-zinc-400">
            <a href="#product" className="hover:text-white transition-colors">Product</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={onGetStarted}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              id="landing-btn-dashboard"
            >
              <span>Go to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={onSignIn}
                className="px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                id="landing-btn-signin"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                id="landing-btn-getstarted"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-20 px-4 sm:px-6 max-w-6xl mx-auto text-center" id="product">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-300 text-xs font-mono mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>BYOK Autonomous Developer Environment</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 font-mono leading-[1.08] max-w-4xl mx-auto uppercase">
          Build software with your own AI models.
        </h1>

        <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
          A personal autonomous coding workspace where you bring your own API keys, choose your models, and let AI build your software.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-16">
          <button
            onClick={onGetStarted}
            className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-sm font-mono font-semibold transition-all flex items-center gap-2 shadow-lg shadow-white/5 active:scale-[0.99]"
            id="hero-btn-primary"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#interactive-demo"
            className="px-5 py-3 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 text-sm font-mono transition-colors flex items-center gap-2"
          >
            <span>Explore Architecture</span>
          </a>
        </div>

        {/* Interactive Workspace Representation */}
        <div
          className="rounded-2xl border border-zinc-800 bg-zinc-900/90 text-left shadow-2xl overflow-hidden backdrop-blur-xl"
          id="interactive-demo"
        >
          {/* Workspace Window Header */}
          <div className="h-10 border-b border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono text-zinc-400 ml-2">ownai / portfolio-app</span>
            </div>

            {/* Live Model Selector in Mock */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">ROUTING:</span>
              <button
                onClick={() => setMockActiveRoute('nvidia')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  mockActiveRoute === 'nvidia'
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                NVIDIA DeepSeek R1
              </button>
              <button
                onClick={() => setMockActiveRoute('claude')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  mockActiveRoute === 'claude'
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Claude 3.7
              </button>
              <button
                onClick={() => setMockActiveRoute('openai')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors hidden md:inline-block ${
                  mockActiveRoute === 'openai'
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                GPT-4o
              </button>
            </div>
          </div>

          {/* 3-Panel Representation */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800 min-h-[380px]">
            {/* Panel 1: File Tree (3 cols) */}
            <div className="md:col-span-3 p-3 bg-zinc-950/60 font-mono text-xs space-y-2">
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-2 pt-1">
                Workspace Files
              </div>
              <div className="space-y-0.5">
                {mockFiles.map((f) => (
                  <button
                    key={f.path}
                    onClick={() => {
                      setMockSelectedFile(f.path);
                      setActiveTab('code');
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors ${
                      mockSelectedFile === f.path
                        ? 'bg-zinc-800 text-white font-medium'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Code2 className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                      <span className="truncate">{f.name}</span>
                    </div>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {f.tag}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-800/80 px-2">
                <div className="text-[10px] text-zinc-400 mb-1">CONTAINER SANDBOX</div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Port 3000 Running</span>
                </div>
              </div>
            </div>

            {/* Panel 2: Agent Chat & Actions (5 cols) */}
            <div className="md:col-span-5 p-4 flex flex-col justify-between bg-zinc-900/40">
              <div className="space-y-3 font-mono text-xs">
                {/* User Message */}
                <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-200">
                  <span className="text-[10px] text-zinc-400 block mb-1">USER</span>
                  <p>Build a high-converting hero component with responsive layout and dark theme.</p>
                </div>

                {/* AI Agent Steps Execution */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pb-1 border-b border-zinc-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      AGENT EXECUTION • {mockActiveRoute.toUpperCase()}
                    </span>
                    <span>1.2s</span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Planning autonomous code modifications</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Created <code className="text-zinc-200 bg-zinc-900 px-1 rounded">components/Hero.tsx</code></span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Applied responsive Tailwind utilities</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sandbox build verified: 0 errors</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Input Composer */}
              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 truncate">
                  Ask your AI coding agent...
                </div>
                <button
                  onClick={onGetStarted}
                  className="p-2 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors"
                  title="Try in workspace"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Panel 3: Live Preview (4 cols) */}
            <div className="md:col-span-4 p-4 bg-zinc-950 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>LIVE PREVIEW</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">3000</span>
                  </div>
                </div>

                {/* Simulated Rendered Preview */}
                <div className="mt-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 text-center">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300 text-[10px] font-mono mb-3">
                    <Sparkles className="w-3 h-3 text-zinc-400" />
                    v2.0 Active
                  </div>
                  <h3 className="text-base font-bold text-white font-mono mb-1">Architect with AI</h3>
                  <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">
                    Zero telemetry leakage. Autonomous code generation.
                  </p>
                  <button className="px-3 py-1.5 rounded-lg bg-white text-black text-[11px] font-mono font-semibold">
                    Live Demo
                  </button>
                </div>
              </div>

              <div className="text-[10px] font-mono text-zinc-400 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span>Viewport: Desktop (100%)</span>
                <span className="text-emerald-400">HMR Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-zinc-800/80" id="features">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white mb-2 uppercase">
            Autonomous Development Architecture
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Everything you need to build software autonomously using your own models and infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
              <KeyRound className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">Bring Your Own Keys (BYOK)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Connect NVIDIA, Anthropic, OpenAI, Google Gemini, Groq, or self-hosted Ollama. Your keys are encrypted locally via AES-256-GCM.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
              <Route className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">Multi-Provider Failover</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Configure automatic fallback chains. If a provider hits a 429 rate limit or outage, OwnAI instantly switches to your secondary model.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">Container Sandbox &amp; Export</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Watch real-time live preview, test builds in an isolated sandbox, and export clean ZIP archives or deploy to GitHub in 1-click.
            </p>
          </div>
        </div>
      </section>

      {/* How it works 4-Step Stepper */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-zinc-800/80" id="how-it-works">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white mb-2 uppercase">
            How OwnAI Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            From empty workspace to running application in four deliberate steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
            <div className="text-zinc-400 font-bold text-sm mb-2">01</div>
            <div className="text-white font-bold mb-1">Connect AI Providers</div>
            <p className="text-zinc-400">Add API keys for NVIDIA, Anthropic, OpenAI, Gemini, or Groq.</p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
            <div className="text-zinc-400 font-bold text-sm mb-2">02</div>
            <div className="text-white font-bold mb-1">Choose Models &amp; Routing</div>
            <p className="text-zinc-400">Set automatic failover order or lock specific models per task.</p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
            <div className="text-zinc-400 font-bold text-sm mb-2">03</div>
            <div className="text-white font-bold mb-1">Create Project Workspace</div>
            <p className="text-zinc-400">Choose Next.js, React, HTML/JS, Python, or start blank.</p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
            <div className="text-zinc-400 font-bold text-sm mb-2">04</div>
            <div className="text-white font-bold mb-1">Agent Codes &amp; Verifies</div>
            <p className="text-zinc-400">Chat with the agent, attach files, preview results, and download ZIP.</p>
          </div>
        </div>
      </section>

      {/* Security & Cryptography Guarantee */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-zinc-800/80 text-center" id="security">
        <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-mono text-white mb-2 uppercase">
          Client-Side Cryptography Specification
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mb-8 max-w-xl mx-auto">
          OwnAI is engineered for developers who refuse telemetry leakage. All credentials remain encrypted under your master password and never leave your client unencrypted.
        </p>

        <button
          onClick={onGetStarted}
          className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-mono font-semibold transition-all inline-flex items-center gap-2 shadow-lg"
          id="btn-footer-cta"
        >
          <span>Start Building with OwnAI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Footer */}
      <footer className="h-14 border-t border-zinc-800/80 px-4 sm:px-8 flex items-center justify-between text-xs font-mono text-zinc-400 select-none">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">OwnAI</span>
          <span>• BYOK Autonomous Agent OS</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onSignIn} className="hover:text-white transition-colors">
            Sign In
          </button>
          <a href="#security" className="hover:text-white transition-colors hidden sm:inline">
            Security Specs
          </a>
        </div>
      </footer>
    </div>
  );
};
