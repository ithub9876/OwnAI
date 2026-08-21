import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Code2,
  Shield,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Info
} from 'lucide-react';
import { SkillDefinition, SkillCategory } from '../../types/agent';
import { INITIAL_SKILLS, skillRouter } from '../../lib/skillLibrary';

export const SkillsSettingsView: React.FC = () => {
  const [skills, setSkills] = useState<SkillDefinition[]>(() => skillRouter.getAllSkills());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.id || 'planning');

  const handleToggle = (skillId: string) => {
    const updated = skills.map((s) => (s.id === skillId ? { ...s, isEnabled: !s.isEnabled } : s));
    setSkills(updated);
    skillRouter.toggleSkill(skillId, !skills.find((s) => s.id === skillId)?.isEnabled);
  };

  const filteredSkills = skills.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedSkill = skills.find((s) => s.id === selectedSkillId) || skills[0];

  const categories: { key: string; label: string }[] = [
    { key: 'ALL', label: 'All Skills' },
    { key: 'core', label: 'Core' },
    { key: 'design', label: 'UI/UX & Design' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'quality', label: 'QA & Testing' },
    { key: 'security', label: 'Security' },
    { key: 'devops', label: 'DevOps' }
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Autonomous Skill Library &amp; Auto-Router
          </h3>
        </div>
        <p className="text-zinc-400 text-[11px] leading-relaxed">
          OwnAI loads modular skills dynamically based on user intent, resolving dependencies and tool permissions automatically.
        </p>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 19 modular skills..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="flex flex-wrap gap-1 w-full sm:w-auto">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                  selectedCategory === c.key
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content (List + Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skills List */}
        <div className="lg:col-span-7 space-y-2">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1">
            Installed Skills ({filteredSkills.length})
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredSkills.map((s) => {
              const isSelected = selectedSkillId === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSkillId(s.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-zinc-700 bg-zinc-900 shadow-md'
                      : 'border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex items-center gap-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(s.id);
                        }}
                        className="text-zinc-400 hover:text-white shrink-0"
                      >
                        {s.isEnabled ? (
                          <ToggleRight className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-zinc-600" />
                        )}
                      </button>
                      <div className="truncate">
                        <div className="font-semibold text-white truncate flex items-center gap-2">
                          <span>{s.name}</span>
                          <span className="text-[9px] px-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                            v{s.version}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate mt-0.5">{s.description}</div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[9px] bg-zinc-800/60 border border-zinc-700/60 text-zinc-300 shrink-0 uppercase tracking-wider">
                      {s.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Skill Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1">
            Skill Specification &amp; Quality Gates
          </div>

          {selectedSkill && (
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{selectedSkill.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
                    {selectedSkill.isEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                  {selectedSkill.purpose}
                </p>
              </div>

              {/* Dependencies & Tools */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                <div className="text-[10px] text-zinc-400 font-semibold uppercase">Required Tools</div>
                <div className="flex flex-wrap gap-1">
                  {selectedSkill.requiredTools.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {selectedSkill.dependencies.length > 0 && (
                  <div className="pt-2 border-t border-zinc-800/60">
                    <div className="text-[10px] text-zinc-400 font-semibold uppercase mb-1">
                      Skill Dependencies (Auto-Loaded)
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedSkill.dependencies.map((d) => (
                        <span
                          key={d}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-emerald-400 font-mono"
                        >
                          +{d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quality Checklist */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-zinc-400 font-semibold uppercase">Quality Checklist</div>
                <div className="space-y-1">
                  {selectedSkill.qualityChecklist.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[10px] text-zinc-300 leading-relaxed">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Failure Conditions */}
              {selectedSkill.failureConditions.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                  <div className="text-[10px] text-red-400 font-semibold uppercase">Strict Anti-Patterns</div>
                  <div className="space-y-1">
                    {selectedSkill.failureConditions.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[10px] text-zinc-400">
                        <AlertCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
