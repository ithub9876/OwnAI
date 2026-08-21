import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  FileCode,
  FileArchive,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Square,
  Bot,
  User as UserIcon,
  Route,
  Zap,
  ArrowUp
} from 'lucide-react';
import {
  ChatMessageEntity,
  AgentExecutionStep,
  AttachmentPayload
} from '../../types';

interface AgentChatViewProps {
  messages: ChatMessageEntity[];
  currentSteps: AgentExecutionStep[];
  isAgentRunning: boolean;
  onSendMessage: (content: string, attachments: AttachmentPayload[]) => void;
  onStopAgent: () => void;
  activeModelName: string;
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({
  messages,
  currentSteps,
  isAgentRunning,
  onSendMessage,
  onStopAgent,
  activeModelName
}) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<AttachmentPayload[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [expandedStepIds, setExpandedStepIds] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages or steps
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentSteps]);

  const handleSend = () => {
    if (!inputText.trim() && attachments.length === 0) return;
    if (isAgentRunning) return;

    onSendMessage(inputText.trim(), attachments);
    setInputText('');
    setAttachments([]);
    setShowAttachMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file' | 'zip') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setAttachments((prev) => [
        ...prev,
        {
          name: file.name,
          type,
          size: file.size,
          content
        }
      ]);
    };

    if (type === 'image') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }

    setShowAttachMenu(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleStepDetails = (stepId: string) => {
    setExpandedStepIds((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950/90 font-mono text-xs select-none">
      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && currentSteps.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
              <Sparkles className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Autonomous Coding Agent</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans leading-relaxed">
                Describe a feature, refactor code, or attach screenshots. The agent plans, modifies files, and verifies builds automatically.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-left ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3 space-y-2 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-zinc-800 border border-zinc-700 text-zinc-100 font-sans'
                      : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 font-sans'
                  }`}
                >
                  {/* Attachments pills in message */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pb-1">
                      {msg.attachments.map((att, i) => (
                        <div
                          key={i}
                          className="px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-700 text-[10px] text-zinc-300 flex items-center gap-1 font-mono"
                        >
                          {att.type === 'image' ? (
                            <ImageIcon className="w-3 h-3 text-zinc-400" />
                          ) : (
                            <FileCode className="w-3 h-3 text-zinc-400" />
                          )}
                          <span>{att.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap text-xs">{msg.content}</div>

                  {/* If message has embedded execution steps */}
                  {msg.steps && msg.steps.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-zinc-800/80 space-y-1 font-mono text-[11px]">
                      {msg.steps.map((st) => (
                        <div key={st.id} className="flex items-center gap-2 text-zinc-400">
                          {st.status === 'SUCCESS' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : st.status === 'ERROR' ? (
                            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          )}
                          <span className="text-zinc-300">{st.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-white text-black font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono">
                    U
                  </div>
                )}
              </div>
            ))}

            {/* Active Live Agent Execution Card */}
            {isAgentRunning && currentSteps.length > 0 && (
              <div className="p-3.5 rounded-xl border border-zinc-700/80 bg-zinc-900/90 shadow-xl space-y-2.5 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-white font-bold">AGENT EXECUTION</span>
                    <span className="text-zinc-400">• {activeModelName}</span>
                  </div>
                  <button
                    onClick={onStopAgent}
                    className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-[10px] flex items-center gap-1 transition-colors"
                  >
                    <Square className="w-2.5 h-2.5 fill-current" />
                    <span>Stop</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  {currentSteps.map((step) => {
                    const isExpanded = expandedStepIds[step.id];
                    return (
                      <div key={step.id} className="space-y-1">
                        <div
                          onClick={() => step.details && toggleStepDetails(step.id)}
                          className={`flex items-center justify-between p-1.5 rounded-lg transition-colors ${
                            step.details ? 'cursor-pointer hover:bg-zinc-800/80' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {step.status === 'IN_PROGRESS' ? (
                              <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />
                            ) : step.status === 'SUCCESS' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : step.status === 'ERROR' ? (
                              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            )}
                            <span
                              className={`truncate ${
                                step.status === 'IN_PROGRESS'
                                  ? 'text-emerald-300 font-bold'
                                  : 'text-zinc-300'
                              }`}
                            >
                              {step.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-zinc-400">
                            {step.elapsedMs && <span>{(step.elapsedMs / 1000).toFixed(1)}s</span>}
                            {step.details && (
                              isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                            )}
                          </div>
                        </div>

                        {/* Collapsible Step Logs */}
                        {isExpanded && step.details && (
                          <pre className="p-2 ml-5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400 whitespace-pre-wrap overflow-x-auto">
                            {step.details}
                          </pre>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Composer Box */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950 space-y-2">
        {/* Attachment Pills Preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pb-1">
            {attachments.map((att, index) => (
              <div
                key={index}
                className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 flex items-center gap-1.5"
              >
                {att.type === 'image' ? (
                  <ImageIcon className="w-3 h-3 text-zinc-400" />
                ) : (
                  <FileCode className="w-3 h-3 text-zinc-400" />
                )}
                <span className="truncate max-w-[140px]">{att.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/60 focus-within:border-zinc-600 transition-colors">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI coding agent (e.g. 'Add dark mode toggle to Navbar')..."
            rows={2}
            className="w-full bg-transparent px-3 py-2.5 text-xs text-white placeholder:text-zinc-400 focus:outline-none resize-none font-sans leading-relaxed"
            id="agent-chat-textarea"
          />

          {/* Bottom Toolbar inside input */}
          <div className="px-2.5 pb-2 flex items-center justify-between text-zinc-400 text-xs">
            <div className="flex items-center gap-1.5 relative">
              {/* Attachment button */}
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-1 rounded hover:text-white hover:bg-zinc-800 transition-colors"
                title="Add attachment"
                id="btn-chat-attach"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>

              {/* Attach Dropdown Menu */}
              {showAttachMenu && (
                <div className="absolute bottom-8 left-0 z-30 w-44 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-1 font-mono text-[11px] space-y-0.5">
                  <label className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-800 hover:text-white cursor-pointer text-zinc-300">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'image')}
                    />
                  </label>
                  <label className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-800 hover:text-white cursor-pointer text-zinc-300">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'file')}
                    />
                  </label>
                </div>
              )}

              {/* Active Route Pill */}
              <span className="text-[10px] text-zinc-400 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 truncate max-w-[160px]">
                {activeModelName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSend}
                disabled={(!inputText.trim() && attachments.length === 0) || isAgentRunning}
                className="p-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold transition-colors disabled:opacity-30 active:scale-95"
                title="Send instruction (Enter)"
                id="btn-chat-send"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
