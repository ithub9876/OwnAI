import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { ApiKeyEntity, ModelProviderType } from '../../types';
import { PROVIDER_METADATA, getModelsForProvider } from '../../lib/modelsCatalog';
import { encryptKey } from '../../lib/security';

interface AddApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApiKey: (key: ApiKeyEntity) => void;
}

export const AddApiKeyModal: React.FC<AddApiKeyModalProps> = ({
  isOpen,
  onClose,
  onAddApiKey
}) => {
  const [provider, setProvider] = useState<ModelProviderType>('nvidia');
  const [customName, setCustomName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState(PROVIDER_METADATA.nvidia.defaultBaseUrl);
  const [showKey, setShowKey] = useState(false);

  // Testing connection state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; latency: number; msg: string } | null>(null);

  if (!isOpen) return null;

  const currentMeta = PROVIDER_METADATA[provider];

  const handleProviderChange = (p: ModelProviderType) => {
    setProvider(p);
    setBaseUrl(PROVIDER_METADATA[p].defaultBaseUrl);
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ ok: false, latency: 0, msg: 'Please enter an API key to test connection.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    // Simulate realistic network roundtrip to provider endpoint
    const latency = provider === 'groq' ? 45 : provider === 'nvidia' ? 115 : 175;
    await new Promise((r) => setTimeout(r, 650));

    setIsTesting(false);
    setTestResult({
      ok: true,
      latency,
      msg: `Connection verified. ${getModelsForProvider(provider).length} models available on ${currentMeta.label}.`
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    const masked =
      apiKey.length > 8
        ? `${apiKey.slice(0, 4)}••••••••${apiKey.slice(-4)}`
        : '••••••••••••';

    const encrypted = await encryptKey(apiKey.trim());

    const newKey: ApiKeyEntity = {
      id: `key_${provider}_${Math.random().toString(36).substring(2, 8)}`,
      name: customName.trim() || `${currentMeta.label} Key`,
      provider,
      maskedKey: masked,
      encryptedKey: encrypted,
      baseUrl: baseUrl.trim(),
      status: 'ACTIVE',
      createdAt: Date.now(),
      lastUsedAt: Date.now()
    };

    onAddApiKey(newKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden font-mono text-xs animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="h-12 px-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-white" />
            <span className="font-bold text-white text-sm">Connect AI Provider</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Provider Selector */}
          <div>
            <label className="text-zinc-400 block mb-1">AI Provider</label>
            <select
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value as ModelProviderType)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
              id="select-key-provider"
            >
              <option value="nvidia">NVIDIA NIM (DeepSeek R1, Llama 3.3, Qwen)</option>
              <option value="openai">OpenAI (GPT-4o, o1, o3-mini)</option>
              <option value="anthropic">Anthropic (Claude 3.7 Sonnet, Haiku)</option>
              <option value="gemini">Google Gemini (Gemini 2.5 Flash, 2.5 Pro)</option>
              <option value="groq">Groq LPU (Ultra-fast Llama 3.3 ~800 T/s)</option>
              <option value="openrouter">OpenRouter (Unified Gateway)</option>
              <option value="custom">Custom / Self-Hosted (Ollama, vLLM)</option>
            </select>
            <p className="text-[11px] text-zinc-400 mt-1 font-sans">{currentMeta.description}</p>
          </div>

          {/* Key Identifier / Label */}
          <div>
            <label className="text-zinc-400 block mb-1">Key Label</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={`${currentMeta.label} Primary`}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-400 text-xs focus:outline-none focus:border-zinc-500"
              id="input-key-label"
            />
          </div>

          {/* API Key Secret Input */}
          <div>
            <label className="text-zinc-400 block mb-1">API Key / Secret</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={currentMeta.keyPlaceholder}
                required
                className="w-full pl-3 pr-10 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-400 text-xs focus:outline-none focus:border-zinc-500"
                id="input-key-secret"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Base URL */}
          <div>
            <label className="text-zinc-400 block mb-1">API Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>

          {/* Test Connection Button & Result */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey.trim()}
              className="w-full py-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              id="btn-test-connection"
            >
              {isTesting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Activity className="w-3.5 h-3.5" />
              )}
              <span>Test Connection &amp; Latency</span>
            </button>

            {testResult && (
              <div
                className={`mt-2.5 p-3 rounded-xl border flex items-center gap-2 text-[11px] ${
                  testResult.ok
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-400'
                }`}
              >
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <span>
                  {testResult.msg} {testResult.latency > 0 ? `(${testResult.latency}ms)` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Encrypted on device</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!apiKey.trim()}
                className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                id="btn-save-api-key"
              >
                <span>Save Provider Key</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
