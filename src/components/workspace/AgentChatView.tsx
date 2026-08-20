import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  GitCompare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  Terminal,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { AgentStepEntity, ConversationMessageEntity } from '../../types';
import { Badge } from '../common/Badge';

interface AgentChatViewProps {
  messages: ConversationMessageEntity[];
  steps: AgentStepEntity[];
  isAgentRunning: boolean;
  currentRunningStep: string;
  onSendMessage: (prompt: string) => void;
  onOpenDiff: (targetPath?: string) => void;
  activeRouteName: string;
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({
  messages,
  steps,
  isAgentRunning,
  currentRunningStep,
  onSendMessage,
  onOpenDiff,
  activeRouteName
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [showStepsList, setShowStepsList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionPrompts = [
    'Enhance the hero section with a gradient glow and dynamic metrics',
    'Add an interactive project showcase grid to the portfolio',
    'Refactor ContactForm with phone validation and error feedback',
    'Run full build verification and Jest unit tests'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, steps, currentRunningStep]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPrompt.trim() && !isAgentRunning) {
      onSendMessage(inputPrompt.trim());
      setInputPrompt('');
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    if (!isAgentRunning) {
      onSendMessage(prompt);
    }
  };

  const getStepBadge = (type: string) => {
    switch (type) {
      case 'PLAN':
        return <Badge text="PLAN" variant="purple" />;
      case 'INSPECT':
        return <Badge text="INSPECT" variant="cyan" />;
      case 'READ_FILE':
        return <Badge text="READ" variant="default" />;
      case 'CREATE_FILE':
      case 'EDIT_FILE':
        return <Badge text="WRITE" variant="warning" />;
      case 'RUN_BUILD':
        return <Badge text="BUILD" variant="cyan" />;
      case 'RUN_TEST':
        return <Badge text="TEST" variant="success" />;
      case 'VERIFIED':
        return <Badge text="VERIFIED" variant="success" />;
      default:
        return <Badge text={type} variant="default" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border-l border-slate-800/80 select-none text-xs">
      {/* Agent Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="font-bold font-mono text-slate-100 flex items-center gap-1.5">
              Coding Agent
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[170px]">
              Route: {activeRouteName || 'NVIDIA NIM DeepSeek'}
            </div>
          </div>
        </div>

        {isAgentRunning && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono animate-pulse">
            <Cpu className="w-3 h-3" /> Working
          </span>
        )}
      </div>

      {/* Active Autonomous Step Progression Card */}
      {isAgentRunning && (
        <div className="p-3 bg-blue-950/40 border-b border-blue-900/50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-blue-300 font-semibold uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              Autonomous Pipeline Execution
            </span>
            <span className="text-[10px] font-mono text-blue-400">Step {steps.length + 1}/7</span>
          </div>
          <div className="p-2 rounded bg-slate-950/80 border border-blue-800/40 font-mono text-slate-200 text-[11px] leading-tight">
            {currentRunningStep || 'Initializing agent tools & inspecting files...'}
          </div>
        </div>
      )}

      {/* Live Steps Breakdown Accordion */}
      {steps.length > 0 && (
        <div className="border-b border-slate-800/80 bg-slate-900/40">
          <button
            onClick={() => setShowStepsList(!showStepsList)}
            className="w-full px-3 py-1.5 flex items-center justify-between text-slate-400 hover:text-slate-200 text-[11px] font-mono"
          >
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-400" />
              Execution Steps ({steps.length})
            </span>
            {showStepsList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showStepsList && (
            <div className="max-h-48 overflow-y-auto p-2 space-y-1.5 border-t border-slate-900">
              {steps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="p-2 rounded bg-slate-950 border border-slate-800/80 flex items-start gap-2 font-mono text-[11px]"
                >
                  <div className="mt-0.5">{getStepBadge(step.stepType)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 leading-snug">{step.description}</p>
                    {step.toolResult && (
                      <p className="text-[10px] text-slate-500 mt-1 truncate">
                        ✓ {step.toolResult}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'AGENT';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[92%] rounded-xl p-3 shadow-md ${
                  isAgent
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    : 'bg-blue-600 text-white rounded-tr-none'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs">
                  {msg.content}
                </div>

                {/* Diff inspection CTA */}
                {isAgent && msg.diffSummary && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400">
                      {msg.diffSummary}
                    </span>
                    <button
                      onClick={() => onOpenDiff()}
                      className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-mono text-[10px] flex items-center gap-1 transition-colors"
                    >
                      <GitCompare className="w-3 h-3" /> Inspect Diff →
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[9px] font-mono text-slate-600 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompts Chips */}
      {messages.length <= 2 && (
        <div className="p-2 border-t border-slate-900 bg-slate-950 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase px-1">Suggested prompts:</div>
          <div className="space-y-1">
            {suggestionPrompts.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(sug)}
                disabled={isAgentRunning}
                className="w-full text-left p-1.5 rounded bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 text-slate-300 hover:text-white text-[11px] font-sans truncate transition-colors disabled:opacity-50"
              >
                ⚡ {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prompt Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-800/80">
        <div className="relative">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask agent to modify code, fix build errors, or build features..."
            rows={2}
            disabled={isAgentRunning}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 pr-9 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none font-sans"
            id="agent-chat-prompt-input"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isAgentRunning}
            className="absolute right-2 bottom-2.5 p-1.5 rounded-md bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white disabled:text-slate-600 transition-colors shadow-md"
            title="Dispatch prompt to agent"
            id="btn-send-agent-prompt"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
