import React, { useState } from 'react';
import {
  Key,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Shield,
  Activity,
  Play,
  RotateCcw,
  Sparkles,
  Server,
  Lock
} from 'lucide-react';
import {
  AiRouteEntity,
  ApiKeyEntity,
  ApiKeyStatus,
  ModelProviderType,
  RouteAttemptRecord,
  RoutePingResult
} from '../../types';
import { maskKey } from '../../lib/security';

interface KeysAndRoutingScreenProps {
  apiKeys: ApiKeyEntity[];
  routes: AiRouteEntity[];
  onAddApiKey: (name: string, provider: ModelProviderType, key: string, baseUrl?: string) => void;
  onDeleteApiKey: (id: string) => void;
  onUpdateKeyStatus: (id: string, status: ApiKeyStatus) => void;
  onAddRoute: (
    name: string,
    provider: ModelProviderType,
    modelId: string,
    apiKeyId?: string | null,
    supportsVision?: boolean,
    supportsTools?: boolean
  ) => void;
  onDeleteRoute: (id: string) => void;
  onToggleRoute: (route: AiRouteEntity) => void;
  onMovePriority: (routeId: string, moveUp: boolean) => void;
  onPingRoute: (routeId: string) => Promise<RoutePingResult>;
  onTestAllRoutes: () => void;
  onSimulateFallback: () => Promise<RouteAttemptRecord[]>;
}

export const KeysAndRoutingScreen: React.FC<KeysAndRoutingScreenProps> = ({
  apiKeys,
  routes,
  onAddApiKey,
  onDeleteApiKey,
  onUpdateKeyStatus,
  onAddRoute,
  onDeleteRoute,
  onToggleRoute,
  onMovePriority,
  onPingRoute,
  onTestAllRoutes,
  onSimulateFallback
}) => {
  const [activeTab, setActiveTab] = useState<'ROUTES' | 'KEYS' | 'SIMULATOR'>('ROUTES');

  // Key form state
  const [isAddKeyModalOpen, setIsAddKeyModalOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [keyProvider, setKeyProvider] = useState<ModelProviderType>('nvidia');
  const [rawKeyInput, setRawKeyInput] = useState('');
  const [keyBaseUrl, setKeyBaseUrl] = useState('');

  // Route form state
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [routeProvider, setRouteProvider] = useState<ModelProviderType>('nvidia');
  const [routeModelId, setRouteModelId] = useState('');
  const [routeApiKeyId, setRouteApiKeyId] = useState<string>('');
  const [routeVision, setRouteVision] = useState(false);
  const [routeTools, setRouteTools] = useState(true);

  // Ping test state
  const [pingResults, setPingResults] = useState<Record<string, RoutePingResult>>({});
  const [testingRouteId, setTestingRouteId] = useState<string | null>(null);

  // Fallback simulator state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<RouteAttemptRecord[]>([]);

  const handleAddKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawKeyInput.trim()) {
      onAddApiKey(
        keyName.trim() || `${keyProvider.toUpperCase()} Key`,
        keyProvider,
        rawKeyInput.trim(),
        keyBaseUrl.trim()
      );
      setKeyName('');
      setRawKeyInput('');
      setKeyBaseUrl('');
      setIsAddKeyModalOpen(false);
    }
  };

  const handleAddRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (routeModelId.trim()) {
      onAddRoute(
        routeName.trim() || `${routeProvider.toUpperCase()} - ${routeModelId.trim()}`,
        routeProvider,
        routeModelId.trim(),
        routeApiKeyId || null,
        routeVision,
        routeTools
      );
      setRouteName('');
      setRouteModelId('');
      setIsAddRouteModalOpen(false);
    }
  };

  const handlePing = async (routeId: string) => {
    setTestingRouteId(routeId);
    try {
      const res = await onPingRoute(routeId);
      setPingResults((prev) => ({ ...prev, [routeId]: res }));
    } finally {
      setTestingRouteId(null);
    }
  };

  const handleRunSimulator = async () => {
    setIsSimulating(true);
    setSimulationLogs([]);
    try {
      const logs = await onSimulateFallback();
      setSimulationLogs(logs);
    } finally {
      setIsSimulating(false);
    }
  };

  const sortedRoutes = [...routes].sort((a, b) => a.priority - b.priority);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 text-slate-100 p-6 max-w-6xl mx-auto w-full select-none">
      {/* Header & Sub-Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Key className="w-5 h-5 text-blue-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
              AI Routing Matrix &amp; Key Vault
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Configure BYOK API providers, prioritize fallback execution chains, and inspect failover logs.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('ROUTES')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
              activeTab === 'ROUTES' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            id="tab-routes"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Priority Matrix ({routes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('KEYS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
              activeTab === 'KEYS' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            id="tab-keys"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Key Vault ({apiKeys.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SIMULATOR')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
              activeTab === 'SIMULATOR' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            id="tab-simulator"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Failover Simulator</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRIORITY ROUTING MATRIX */}
      {activeTab === 'ROUTES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white font-mono">Priority Execution Cascade</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The agent attempts routes in descending order. If a model encounters a 429 rate limit or 500 error, it automatically falls back to Priority N+1.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddRouteModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
                id="btn-add-route"
              >
                <Plus className="w-3.5 h-3.5" /> Add Route
              </button>
            </div>
          </div>

          {/* Routes Table / List */}
          <div className="space-y-3">
            {sortedRoutes.map((route, index) => {
              const ping = pingResults[route.id];
              const isTesting = testingRouteId === route.id;

              return (
                <div
                  key={route.id}
                  className={`p-4 rounded-xl border transition-all ${
                    route.isEnabled
                      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Priority & Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 font-mono font-bold text-xs text-blue-400 flex items-center justify-center">
                        P{route.priority}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-mono font-bold text-sm text-slate-100">{route.name}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-slate-800 text-slate-300">
                            {route.provider}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs font-mono text-slate-400">
                          <span>Model: <code className="text-slate-200">{route.modelId}</code></span>
                          {route.supportsVision && (
                            <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 text-[10px]">
                              VISION
                            </span>
                          )}
                          {route.supportsTools && (
                            <span className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20 text-[10px]">
                              TOOLS
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions & Priority Shift */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Live Ping Status */}
                      {ping && (
                        <div className="text-xs font-mono mr-2">
                          {ping.isSuccess ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {ping.latencyMs}ms
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1" title={ping.errorMessage}>
                              <AlertTriangle className="w-3.5 h-3.5" /> Fail
                            </span>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => handlePing(route.id)}
                        disabled={isTesting}
                        className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors disabled:opacity-50"
                        title="Test route latency"
                      >
                        {isTesting ? 'Pinging...' : 'Ping'}
                      </button>

                      {/* Move Priority Up/Down */}
                      <button
                        onClick={() => onMovePriority(route.id, true)}
                        disabled={index === 0}
                        className="p-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                        title="Increase Priority"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onMovePriority(route.id, false)}
                        disabled={index === sortedRoutes.length - 1}
                        className="p-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                        title="Decrease Priority"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Enable/Disable */}
                      <button
                        onClick={() => onToggleRoute(route)}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                          route.isEnabled
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {route.isEnabled ? 'Enabled' : 'Disabled'}
                      </button>

                      <button
                        onClick={() => onDeleteRoute(route.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        title="Delete Route"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: KEY VAULT */}
      {activeTab === 'KEYS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white font-mono">Encrypted BYOK Key Vault</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                All credentials encrypted in browser via AES-256-GCM. Never sent to central servers.
              </p>
            </div>
            <button
              onClick={() => setIsAddKeyModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
              id="btn-add-key"
            >
              <Plus className="w-3.5 h-3.5" /> Add API Key
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-mono font-bold text-sm text-slate-100">{key.name}</h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-slate-800 text-slate-300">
                      {key.provider}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono text-slate-400 my-3">
                    <div className="flex items-center justify-between">
                      <span>Masked Key:</span>
                      <code className="text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {key.maskedKey}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Encryption:</span>
                      <span className="text-emerald-400">AES-256-GCM (Local)</span>
                    </div>
                    {key.baseUrl && (
                      <div className="flex items-center justify-between">
                        <span>Base URL:</span>
                        <span className="text-slate-300 truncate max-w-[180px]">{key.baseUrl}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Status: {key.status}
                  </span>
                  <button
                    onClick={() => onDeleteApiKey(key.id)}
                    className="text-slate-500 hover:text-rose-400 text-xs font-mono flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-ROUTE FAILOVER SIMULATOR */}
      {activeTab === 'SIMULATOR' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  Dynamic 429 Failover Simulator
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Inject simulated Rate Limit (HTTP 429) errors into Primary Route (P1) to verify automatic agent failover to Secondary Route (P2).
                </p>
              </div>

              <button
                onClick={handleRunSimulator}
                disabled={isSimulating}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-medium transition-colors flex items-center gap-2 shadow-lg shadow-amber-600/20 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {isSimulating ? 'Simulating Failover...' : 'Trigger Fallback Test'}
              </button>
            </div>

            {/* Simulation Log Feed */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3 min-h-[160px]">
              {simulationLogs.length === 0 && !isSimulating && (
                <div className="text-center py-8 text-slate-500">
                  Click "Trigger Fallback Test" to run real-time multi-route failover diagnostics.
                </div>
              )}

              {isSimulating && simulationLogs.length === 0 && (
                <div className="flex items-center gap-2 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Dispatching prompt to Route 1 (Priority 1)... Injecting HTTP 429...</span>
                </div>
              )}

              {simulationLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border leading-relaxed ${
                    log.isSuccess
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>
                      {log.isSuccess ? '✓ SUCCESS: ' : '✗ FAILED (Failover Triggered): '}
                      {log.routeName}
                    </span>
                    <span className="text-[10px]">
                      HTTP {log.statusCode} • {log.latencyMs}ms
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90">{log.errorMessage || 'Response received successfully. Coding pipeline resumed without interruption.'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Route Modal */}
      {isAddRouteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold font-mono text-white mb-4">Configure New AI Route</h3>

            <form onSubmit={handleAddRouteSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Route Name (optional)</label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="e.g. NVIDIA NIM DeepSeek"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Provider</label>
                <select
                  value={routeProvider}
                  onChange={(e) => setRouteProvider(e.target.value as ModelProviderType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="nvidia">NVIDIA NIM</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="openai">OpenAI GPT</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="groq">Groq LPU</option>
                  <option value="openrouter">OpenRouter</option>
                  <option value="custom">Local / Ollama</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Model Identifier</label>
                <input
                  type="text"
                  value={routeModelId}
                  onChange={(e) => setRouteModelId(e.target.value)}
                  placeholder="e.g. deepseek-ai/deepseek-r1 or claude-3-5-sonnet-20241022"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={routeVision}
                    onChange={(e) => setRouteVision(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                  />
                  <span className="text-slate-300">Vision Support</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={routeTools}
                    onChange={(e) => setRouteTools(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                  />
                  <span className="text-slate-300">Tool Calling</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRouteModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
                >
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add API Key Modal */}
      {isAddKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold font-mono text-white mb-4">Add BYOK API Key</h3>

            <form onSubmit={handleAddKeySubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Key Label (optional)</label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. Anthropic Production Key"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Provider</label>
                <select
                  value={keyProvider}
                  onChange={(e) => setKeyProvider(e.target.value as ModelProviderType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="nvidia">NVIDIA NIM</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="groq">Groq</option>
                  <option value="openrouter">OpenRouter</option>
                  <option value="custom">Custom Endpoint</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">API Key (Raw Value)</label>
                <input
                  type="password"
                  value={rawKeyInput}
                  onChange={(e) => setRawKeyInput(e.target.value)}
                  placeholder="sk-... or nvapi-..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  🔒 Key will be immediately encrypted with AES-256-GCM before storage.
                </p>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Custom Base URL (optional)</label>
                <input
                  type="text"
                  value={keyBaseUrl}
                  onChange={(e) => setKeyBaseUrl(e.target.value)}
                  placeholder="e.g. http://localhost:11434/v1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddKeyModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
                >
                  Encrypt &amp; Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
