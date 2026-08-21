import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  Terminal,
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Maximize2
} from 'lucide-react';
import { ProjectFileEntity } from '../../types';

interface LivePreviewViewProps {
  files: ProjectFileEntity[];
  projectName: string;
  framework: string;
}

export const LivePreviewView: React.FC<LivePreviewViewProps> = ({
  files,
  projectName,
  framework
}) => {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<Array<{ type: 'log' | 'warn' | 'error'; text: string; time: string }>>([
    { type: 'log', text: `[Vite] dev server running at http://localhost:3000/`, time: '12:00:01' },
    { type: 'log', text: `[HMR] connected & listening for autonomous agent edits`, time: '12:00:02' }
  ]);
  const [previewKey, setPreviewKey] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate rendered HTML from project files
  const generatePreviewSrcDoc = () => {
    // Find index.html or construct from files
    const htmlFile = files.find((f) => f.path.endsWith('.html') || f.path === 'index.html');
    const mainTsx = files.find((f) => f.path.includes('page.tsx') || f.path.includes('App.tsx') || f.path.includes('main.tsx'));
    const cssFile = files.find((f) => f.path.endsWith('.css'));

    if (htmlFile) {
      return htmlFile.content;
    }

    // Default template representation
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            ${cssFile ? cssFile.content : ''}
          </style>
        </head>
        <body class="bg-zinc-950 text-zinc-100 font-sans p-6 min-h-screen">
          <div class="max-w-xl mx-auto py-12 text-center space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-mono">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Port 3000 • Live Sandbox</span>
            </div>
            
            <h1 class="text-3xl font-bold font-mono text-white tracking-tight">
              ${projectName}
            </h1>
            
            <p class="text-zinc-400 text-sm leading-relaxed">
              Autonomous application sandbox initialized. Use the Agent Chat to generate components, pages, and interactive features.
            </p>

            <div class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 text-left font-mono text-xs space-y-2 text-zinc-300">
              <div class="text-zinc-400 text-[10px] uppercase font-bold">Workspace Structure:</div>
              <div class="space-y-1">
                <div>📁 src/</div>
                <div class="pl-4">📄 App.tsx (${mainTsx ? 'Modified' : 'Initial'})</div>
                <div class="pl-4">📄 index.css</div>
                <div>📁 components/</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPreviewKey((prev) => prev + 1);
    setConsoleLogs((prev) => [
      ...prev,
      { type: 'log', text: `[Sandbox] Manual preview reload triggered`, time: new Date().toLocaleTimeString() }
    ]);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const getViewportWidth = () => {
    switch (viewportMode) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 border-l border-zinc-800/80 font-mono text-xs select-none">
      {/* Top Browser Bar */}
      <div className="h-11 px-3 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between gap-2">
        {/* Left: Refresh & URL Address Bar */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={handleRefresh}
            className={`p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ${
              isRefreshing ? 'animate-spin text-emerald-400' : ''
            }`}
            title="Reload preview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 flex-1 max-w-sm truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="truncate">localhost:3000/</span>
          </div>
        </div>

        {/* Right: Viewport Mode Toggles & Console Toggle */}
        <div className="flex items-center gap-1">
          <div className="hidden sm:flex items-center gap-0.5 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1 rounded ${
                viewportMode === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Desktop (100%)"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1 rounded ${
                viewportMode === 'tablet' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1 rounded ${
                viewportMode === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`px-2 py-1 rounded-lg border text-[10px] flex items-center gap-1 transition-colors ${
              showConsole
                ? 'border-zinc-700 bg-zinc-800 text-white'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
            title="Toggle Console Logs"
          >
            <Terminal className="w-3 h-3" />
            <span>Logs</span>
          </button>
        </div>
      </div>

      {/* Rendered Sandbox Viewport */}
      <div className="flex-1 bg-zinc-900/40 p-2 sm:p-4 flex items-center justify-center overflow-auto">
        <div
          className={`${getViewportWidth()} h-full transition-all duration-200 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col`}
        >
          <iframe
            key={previewKey}
            ref={iframeRef}
            srcDoc={generatePreviewSrcDoc()}
            title="Autonomous Project Preview"
            className="w-full h-full border-0 bg-zinc-950"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          />
        </div>
      </div>

      {/* Console Logs Drawer */}
      {showConsole && (
        <div className="h-40 border-t border-zinc-800 bg-zinc-950 p-3 flex flex-col font-mono text-[11px]">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-zinc-400 text-[10px]">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3" />
              <span>CONTAINER CONSOLE OUTPUT</span>
            </div>
            <button
              onClick={() => setConsoleLogs([])}
              className="hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-2 space-y-1 text-zinc-300">
            {consoleLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-zinc-400 text-[10px]">{log.time}</span>
                <span
                  className={
                    log.type === 'error'
                      ? 'text-red-400'
                      : log.type === 'warn'
                      ? 'text-amber-400'
                      : 'text-zinc-300'
                  }
                >
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
