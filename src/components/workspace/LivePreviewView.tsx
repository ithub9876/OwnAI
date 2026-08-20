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
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-100 select-none">
      {/* Browser Frame Toolbar */}
      <div className="h-11 bg-zinc-900 border-b border-zinc-800/80 px-3 md:px-4 flex items-center justify-between">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-md border border-zinc-800">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded ${
              deviceMode === 'desktop' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded ${
              deviceMode === 'tablet' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded ${
              deviceMode === 'mobile' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1 text-xs font-mono text-zinc-400 flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-zinc-200">https://sandbox.ownai.dev/live/{projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}</span>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Reload Preview Container"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulated Browser Content Canvas */}
      <div className="flex-1 bg-zinc-950/60 p-2 sm:p-4 md:p-6 overflow-y-auto flex items-start justify-center">
        <div
          key={refreshKey}
          className={`${getContainerWidth()} w-full transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border ${
            isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-100' : 'border-zinc-300 bg-white text-zinc-900'
          }`}
        >
          {/* Internal Navbar */}
          <header className={`px-5 py-3.5 border-b flex items-center justify-between ${
            isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-50'
          }`}>
            <div className="flex items-center gap-2 font-mono font-bold tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span>{projectName || 'Jarvis Portfolio'}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDark
                    ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
                    : 'border-zinc-300 bg-zinc-200 text-zinc-700 hover:text-black'
                }`}
                title="Toggle visual mode in preview"
              >
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold">
                SANDBOX ACTIVE
              </span>
            </div>
          </header>

          {/* App Preview Body */}
          <div className="p-5 md:p-8 space-y-8">
            {/* Dynamic Hero Section */}
            {isEnhancedHero ? (
              <section className={`relative overflow-hidden rounded-xl border p-6 md:p-8 shadow-xl ${
                isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-50'
              }`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-200 text-xs font-mono mb-4">
                  <Zap className="w-3.5 h-3.5" />
                  Enhanced Hero v2.0 • Ultra-Responsive Monochrome
                </div>
                
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                  Architecting Software with <span className="underline decoration-white decoration-2 underline-offset-4">Autonomous Precision</span>.
                </h1>
                
                <p className={`text-xs md:text-sm max-w-xl mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Full-stack distributed systems, reactive developer tooling, and self-hosted AI routing. Built for engineers who control their models, keys, and execution sandboxes.
                </p>

                {/* Metric Badges */}
                <div className="grid grid-cols-3 gap-2.5 mb-6 max-w-md">
                  <div className={`p-2.5 rounded-lg border text-center ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <div className="text-sm md:text-base font-bold font-mono text-white">0ms</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Leak Rate</div>
                  </div>
                  <div className={`p-2.5 rounded-lg border text-center ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <div className="text-sm md:text-base font-bold font-mono text-white">&lt; 150ms</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Failover</div>
                  </div>
                  <div className={`p-2.5 rounded-lg border text-center ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <div className="text-sm md:text-base font-bold font-mono text-white">100%</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Isolated venv</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm">
                    Initiate Contact <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button className={`px-4 py-2 rounded-lg border font-medium text-xs transition-colors flex items-center gap-1.5 ${
                    isDark ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-300' : 'border-zinc-300 hover:bg-zinc-100 text-zinc-700'
                  }`}>
                    <Code2 className="w-3.5 h-3.5" /> System Architecture
                  </button>
                </div>
              </section>
            ) : (
              <section className={`rounded-xl border p-6 md:p-8 ${
                isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-50'
              }`}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-200 text-xs font-mono mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  OwnAI BYOK Autonomous Agent
                </div>
                
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
                  Building software with autonomous intelligence.
                </h1>
                
                <p className={`text-xs md:text-sm max-w-lg mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Senior Engineer crafting resilient distributed architectures & reactive developer tooling.
                </p>
                
                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs shadow-sm">
                    Get in Touch
                  </button>
                </div>
              </section>
            )}

            {/* Interactive Contact Form */}
            <section className={`rounded-xl border p-5 md:p-6 ${
              isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-50'
            }`}>
              <h2 className="text-base font-bold mb-1">Initiate Direct Transmission</h2>
              <p className={`text-xs mb-4 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Leave your coordinates for collaboration inquiries.
              </p>

              {contactSent ? (
                <div className="flex items-center gap-2 p-3.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xs">
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
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:border-white'
                          : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-black'
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
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:border-white'
                          : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-black'
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
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:border-white'
                        : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-black'
                    }`}
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
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
