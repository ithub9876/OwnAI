import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Send,
  CheckCircle2,
  Moon,
  Sun,
  Sparkles,
  ArrowRight,
  Code2,
  Zap
} from 'lucide-react';
import { ProjectFileEntity } from '../../types';

interface LivePreviewViewProps {
  files: ProjectFileEntity[];
  projectName: string;
}

export const LivePreviewView: React.FC<LivePreviewViewProps> = ({
  files,
  projectName
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isDark, setIsDark] = useState(true);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Check if files contain customized content
  const heroFile = files.find((f) => f.path === 'components/Hero.tsx');
  const isEnhancedHero = heroFile?.content.includes('Enhanced Hero v2.0') || heroFile?.content.includes('Architecting Software');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail) {
      setContactSent(true);
      setTimeout(() => setContactSent(false), 4000);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }
  };

  const getContainerWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Browser Frame Toolbar */}
      <div className="h-11 bg-slate-900 border-b border-slate-800/80 px-4 flex items-center justify-between">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1 rounded ${
              deviceMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1 rounded ${
              deviceMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1 rounded ${
              deviceMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1 text-xs font-mono text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-200">https://sandbox.ownai.dev/live/{projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}</span>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reload Preview Container"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulated Browser Content Canvas */}
      <div className="flex-1 bg-slate-900/40 p-4 md:p-6 overflow-y-auto flex items-start justify-center">
        <div
          key={refreshKey}
          className={`${getContainerWidth()} w-full transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border ${
            isDark ? 'border-slate-800 bg-slate-950 text-slate-100' : 'border-slate-300 bg-slate-50 text-slate-900'
          }`}
        >
          {/* Internal Navbar */}
          <header className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800/80 bg-slate-900/60' : 'border-slate-200 bg-white'
          }`}>
            <div className="flex items-center gap-2 font-mono font-bold tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span>{projectName || 'Jarvis Portfolio'}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDark
                    ? 'border-slate-800 bg-slate-900 text-amber-400 hover:text-amber-300'
                    : 'border-slate-200 bg-slate-100 text-amber-600 hover:text-amber-700'
                }`}
                title="Toggle visual mode in preview"
              >
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                SANDBOX ACTIVE
              </span>
            </div>
          </header>

          {/* App Preview Body */}
          <div className="p-6 md:p-10 space-y-10">
            {/* Dynamic Hero Section */}
            {isEnhancedHero ? (
              <section className={`relative overflow-hidden rounded-2xl border p-8 md:p-10 shadow-xl ${
                isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'
              }`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-mono mb-4">
                  <Zap className="w-3.5 h-3.5 animate-pulse" />
                  Enhanced Hero v2.0 • Ultra-Responsive Dark Theme
                </div>
                
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                  Architecting Software with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400">Autonomous Precision</span>.
                </h1>
                
                <p className={`text-sm md:text-base max-w-xl mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Full-stack distributed systems, reactive developer tooling, and self-hosted AI routing. Built for engineers who control their models, keys, and execution sandboxes.
                </p>

                {/* Metric Badges */}
                <div className="grid grid-cols-3 gap-3 mb-6 max-w-md">
                  <div className={`p-3 rounded-lg border text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="text-base font-bold font-mono text-blue-500">0ms</div>
                    <div className="text-[10px] opacity-70 font-mono">Telemetry Leak</div>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="text-base font-bold font-mono text-emerald-500">&lt; 150ms</div>
                    <div className="text-[10px] opacity-70 font-mono">Failover</div>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="text-base font-bold font-mono text-cyan-500">100%</div>
                    <div className="text-[10px] opacity-70 font-mono">Container venv</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5">
                    Initiate Contact <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button className={`px-5 py-2.5 rounded-lg border font-medium text-xs transition-colors flex items-center gap-1.5 ${
                    isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}>
                    <Code2 className="w-3.5 h-3.5" /> System Architecture
                  </button>
                </div>
              </section>
            ) : (
              <section className={`rounded-2xl border p-8 ${
                isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'
              }`}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  OwnAI BYOK Autonomous Agent
                </div>
                
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                  Building software with autonomous intelligence.
                </h1>
                
                <p className={`text-sm md:text-base max-w-lg mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Senior Engineer crafting resilient distributed architectures & reactive developer tooling.
                </p>
                
                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium">
                    Get in Touch
                  </button>
                </div>
              </section>
            )}

            {/* Interactive Contact Form */}
            <section className={`rounded-2xl border p-6 md:p-8 ${
              isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white'
            }`}>
              <h2 className="text-lg font-bold mb-1">Initiate Direct Transmission</h2>
              <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Leave your coordinates for collaboration inquiries.
              </p>

              {contactSent ? (
                <div className="flex items-center gap-2 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Message verified and transmitted to sandbox queue!</span>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Developer Name"
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                      }`}
                    />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="developer@domain.com"
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-blue-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <textarea
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Project requirements..."
                    rows={2}
                    className={`w-full px-3 py-2 rounded-lg border text-xs resize-none focus:outline-none ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-blue-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Transmit Message
                  </button>
                </form>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
