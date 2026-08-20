import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  Trash2,
  Cpu,
  HardDrive,
  ShieldCheck,
  CornerDownLeft
} from 'lucide-react';

interface TerminalViewProps {
  terminalOutput: string;
  onExecuteCommand: (command: string) => void;
  isExecuting: boolean;
  cpuUsage: number;
  ramUsage: number;
  onClearTerminal: () => void;
}

export const TerminalView: React.FC<TerminalViewProps> = ({
  terminalOutput,
  onExecuteCommand,
  isExecuting,
  cpuUsage,
  ramUsage,
  onClearTerminal
}) => {
  const [commandInput, setCommandInput] = useState('');
  const outputEndRef = useRef<HTMLDivElement>(null);

  const quickCommands = [
    'npm run build',
    'npm test',
    'git status',
    'git diff',
    'ls -la',
    'node -v'
  ];

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commandInput.trim() && !isExecuting) {
      onExecuteCommand(commandInput.trim());
      setCommandInput('');
    }
  };

  const handleQuickCommand = (cmd: string) => {
    if (!isExecuting) {
      onExecuteCommand(cmd);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 font-mono text-xs select-none">
      {/* Terminal Top Bar */}
      <div className="h-10 bg-slate-900 border-b border-slate-800/80 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-200">Sandbox Isolated Shell (v2.4.1)</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Zero Host Access
          </span>
        </div>

        {/* Real-time Hardware Telemetry Gauges */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>CPU:</span>
            <span className="text-slate-200 font-bold">{cpuUsage.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            <span>RAM:</span>
            <span className="text-slate-200 font-bold">{ramUsage.toFixed(1)} MB</span>
          </div>
          <button
            onClick={onClearTerminal}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Clear Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Command Pills */}
      <div className="bg-slate-950 border-b border-slate-900 px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] text-slate-500 uppercase mr-1">Shortcuts:</span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleQuickCommand(cmd)}
            disabled={isExecuting}
            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-blue-600/60 selection:text-white">
        {terminalOutput}
        {isExecuting && (
          <div className="flex items-center gap-2 text-amber-400 mt-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Executing command in container sandbox...</span>
          </div>
        )}
        <div ref={outputEndRef} />
      </div>

      {/* Command Input Prompt Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-2"
      >
        <span className="text-emerald-400 font-bold select-none">$</span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Type sandbox command (e.g. npm run build, pytest, git status)..."
          disabled={isExecuting}
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
        />
        <button
          type="submit"
          disabled={!commandInput.trim() || isExecuting}
          className="p-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white disabled:text-slate-600 transition-colors"
          title="Run command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
