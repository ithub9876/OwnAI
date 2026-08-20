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
    <div className="h-full flex flex-col bg-zinc-950 font-mono text-xs select-none">
      {/* Terminal Top Bar */}
      <div className="h-10 bg-zinc-900 border-b border-zinc-800/80 px-3 md:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-zinc-300" />
          <span className="font-bold text-zinc-200">Sandbox Shell (v2.4.1)</span>
          <span className="hidden sm:flex items-center gap-1 text-[10px] text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 font-medium">
            <ShieldCheck className="w-3 h-3 text-white" /> Isolated
          </span>
        </div>

        {/* Real-time Hardware Telemetry Gauges */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-zinc-300" />
            <span>CPU:</span>
            <span className="text-white font-bold">{cpuUsage.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <HardDrive className="w-3.5 h-3.5 text-zinc-300" />
            <span>RAM:</span>
            <span className="text-white font-bold">{ramUsage.toFixed(1)} MB</span>
          </div>
          <button
            onClick={onClearTerminal}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Clear Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Command Pills */}
      <div className="bg-zinc-950 border-b border-zinc-900 px-3 md:px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] text-zinc-500 uppercase mr-1 flex-shrink-0">Shortcuts:</span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleQuickCommand(cmd)}
            disabled={isExecuting}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[11px] transition-colors whitespace-nowrap disabled:opacity-50 flex-shrink-0"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap selection:bg-zinc-700 selection:text-white">
        {terminalOutput}
        {isExecuting && (
          <div className="flex items-center gap-2 text-zinc-300 mt-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Executing command in container sandbox...</span>
          </div>
        )}
        <div ref={outputEndRef} />
      </div>

      {/* Command Input Prompt Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-zinc-900/90 border-t border-zinc-800/80 flex items-center gap-2"
      >
        <span className="text-white font-bold select-none">$</span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Type sandbox command (e.g. npm run build, pytest, git status)..."
          disabled={isExecuting}
          className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono text-xs"
        />
        <button
          type="submit"
          disabled={!commandInput.trim() || isExecuting}
          className="p-2 rounded bg-white hover:bg-zinc-200 disabled:bg-zinc-900 text-black disabled:text-zinc-600 transition-colors shadow-sm"
          title="Run command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
