import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Sliders,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
  Info
} from 'lucide-react';
import { AiAgentRole, AiTeamConfig } from '../../types/agent';
import { ApiKeyEntity, AiRouteEntity } from '../../types';
import { AI_ROLE_DEFINITIONS, DEFAULT_AI_TEAM_CONFIG, resolveModelForRole } from '../../lib/aiTeam';
import { MODELS_CATALOG } from '../../lib/modelsCatalog';

interface AiTeamSettingsViewProps {
  teamConfig?: AiTeamConfig;
  apiKeys: ApiKeyEntity[];
  aiRoutes: AiRouteEntity[];
  onUpdateTeamConfig?: (newConfig: AiTeamConfig) => void;
}

export const AiTeamSettingsView: React.FC<AiTeamSettingsViewProps> = ({
  teamConfig = DEFAULT_AI_TEAM_CONFIG,
  apiKeys,
  aiRoutes,
  onUpdateTeamConfig
}) => {
  const [config, setConfig] = useState<AiTeamConfig>(teamConfig);
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState<AiAgentRole>('FRONTEND_ENGINEER');

  const handleToggleMode = (mode: 'AUTOMATIC' | 'CUSTOM') => {
    const updated: AiTeamConfig = {
      ...config,
      mode,
      updatedAt: Date.now()
    };
    setConfig(updated);
    if (onUpdateTeamConfig) onUpdateTeamConfig(updated);
  };

  const handleRoleModelChange = (role: AiAgentRole, modelId: string) => {
    const targetModel = MODELS_CATALOG.find((m) => m.id === modelId);
    const updated: AiTeamConfig = {
      ...config,
      members: {
        ...config.members,
        [role]: {
          ...config.members[role],
          mode: 'CUSTOM',
          selectedModelId: modelId,
          selectedProvider: targetModel?.provider || 'nvidia'
        }
      },
      updatedAt: Date.now()
    };
    setConfig(updated);
    if (onUpdateTeamConfig) onUpdateTeamConfig(updated);
  };

  const handleToggleRoleEnabled = (role: AiAgentRole) => {
    const current = config.members[role]?.isEnabled ?? true;
    const updated: AiTeamConfig = {
      ...config,
      members: {
        ...config.members,
        [role]: {
          ...config.members[role],
          isEnabled: !current
        }
      },
      updatedAt: Date.now()
    };
    setConfig(updated);
    if (onUpdateTeamConfig) onUpdateTeamConfig(updated);
  };

  const activeRoleList = Object.keys(AI_ROLE_DEFINITIONS) as AiAgentRole[];
  const selectedRoleDef = AI_ROLE_DEFINITIONS[selectedRoleForDetail];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header & Mode Switcher */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Specialized AI Team Architecture
              </h3>
            </div>
            <p className="text-zinc-400 text-[11px] mt-1">
              Configure specialized autonomous sub-agents. Roles collaborate through the Central Orchestrator.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
            <button
              onClick={() => handleToggleMode('AUTOMATIC')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                config.mode === 'AUTOMATIC'
                  ? 'bg-zinc-800 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto Selection</span>
            </button>
            <button
              onClick={() => handleToggleMode('CUSTOM')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                config.mode === 'CUSTOM'
                  ? 'bg-zinc-800 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span>Custom Mapping</span>
            </button>
          </div>
        </div>

        {config.mode === 'AUTOMATIC' ? (
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="font-semibold text-emerald-200">Autonomous Capability Optimization Active:</strong> OwnAI dynamically resolves the best eligible model for each sub-task based on your configured API keys, context size, and tool permissions.
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-zinc-400" />
            <div className="text-[11px] leading-relaxed">
              <strong className="font-semibold text-zinc-200">Custom Mode Active:</strong> You can explicitly assign specific LLM models to each individual engineering, design, and testing role below.
            </div>
          </div>
        )}
      </div>

      {/* Grid of 12 Specialized Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Role List (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1">
            Available AI Roles ({activeRoleList.length})
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {activeRoleList.map((roleKey) => {
              const roleDef = AI_ROLE_DEFINITIONS[roleKey];
              const resolution = resolveModelForRole(roleKey, config, aiRoutes, apiKeys);
              const isSelected = selectedRoleForDetail === roleKey;
              const isEnabled = config.members[roleKey]?.isEnabled ?? true;

              return (
                <div
                  key={roleKey}
                  onClick={() => setSelectedRoleForDetail(roleKey)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-zinc-700 bg-zinc-900 shadow-md'
                      : 'border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isEnabled ? 'bg-emerald-400' : 'bg-zinc-600'
                        }`}
                      />
                      <div className="truncate">
                        <div className="font-semibold text-white truncate">{roleDef.name}</div>
                        <div className="text-[10px] text-zinc-400 truncate">{roleDef.description}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-mono text-zinc-300">
                        {resolution.route ? resolution.route.name : 'No model configured'}
                      </div>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
                        {roleDef.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Role Detail & Custom Assignment (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1">
            Role Inspector
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{selectedRoleDef.name}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] border border-zinc-700 bg-zinc-800 text-zinc-300">
                  {selectedRoleDef.category}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                {selectedRoleDef.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="text-[10px] text-zinc-400 font-semibold uppercase">Capabilities Required</div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center gap-1 text-zinc-300">
                  <Cpu className="w-3 h-3 text-zinc-500" />
                  <span>Min {Math.round(selectedRoleDef.recommendedCapabilities.minContextWindow / 1000)}k Context</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-300">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>{selectedRoleDef.recommendedCapabilities.requiresTools ? 'Tool Calls ✓' : 'No Tools'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] text-zinc-400 font-semibold uppercase">Allowed Tools</div>
              <div className="flex flex-wrap gap-1">
                {selectedRoleDef.allowedToolIds.map((tid) => (
                  <span
                    key={tid}
                    className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-[10px] text-zinc-300"
                  >
                    {tid}
                  </span>
                ))}
              </div>
            </div>

            {config.mode === 'CUSTOM' && (
              <div className="space-y-2 pt-3 border-t border-zinc-800">
                <label className="text-[11px] text-white font-semibold block">
                  Assign Custom LLM Model
                </label>
                <select
                  value={config.members[selectedRoleForDetail]?.selectedModelId || ''}
                  onChange={(e) => handleRoleModelChange(selectedRoleForDetail, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-zinc-600"
                >
                  <option value="">-- Automatic Selection --</option>
                  {MODELS_CATALOG.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
