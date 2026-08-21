import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, ArrowRight } from 'lucide-react';
import { TerminalCommandOutput } from '../../types';

interface TerminalViewProps {
  outputs: TerminalCommandOutput[];
  onExecuteCommand: (cmd: string) => void;
  onClear: () => void;
}

export const TerminalView: React.FC<TerminalViewProps> = ({
  outputs,
  onExecuteCommand,
  onClear
}) => {
  const [commandInput, setCommandInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    onExecuteCommand(commandInput.trim());
    setCommandInput('');
  };

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 font-mono text-xs select-none">
      {/* Top Terminal Bar */}
      <div className="h-10 px-3 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] text-zinc-300 font-medium">Container Sandbox Shell</span>
        </div>
        <button
          onClick={onClear}
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Clear Terminal"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Terminal Output Log */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-[11px] text-zinc-300">
        {outputs.map((out) => (
          <div key={out.id} className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-emerald-400 font-bold">$</span>
              <span className="text-white font-semibold">{out.command}</span>
            </div>
            <pre className="text-zinc-400 whitespace-pre-wrap pl-3.5 leading-relaxed font-mono">
              {out.output}
            </pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Prompt Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-2 border-t border-zinc-800/80 bg-zinc-950 flex items-center gap-2"
      >
        <span className="text-emerald-400 font-bold pl-2">$</span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Type command (e.g. 'npm run build', 'git status', 'ls -la')..."
          className="flex-1 bg-transparent text-white placeholder:text-zinc-400 text-[11px] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!commandInput.trim()}
          className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
