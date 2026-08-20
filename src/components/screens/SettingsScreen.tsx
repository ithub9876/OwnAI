import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Lock,
  Cpu,
  User,
  RotateCcw,
  LogOut,
  CheckCircle2,
  Key,
  HardDrive,
  Terminal,
  Database
} from 'lucide-react';
import { User as UserType } from '../../types';

interface SettingsScreenProps {
  user: UserType | null;
  onUpdateProfile: (name: string, email: string) => void;
  onResetDefaults: () => void;
  onSignOut: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  onUpdateProfile,
  onResetDefaults,
  onSignOut
}) => {
  const [displayName, setDisplayName] = useState(user?.displayName || 'Alex Vance');
  const [email, setEmail] = useState(user?.email || 'developer@ownai.dev');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(displayName, email);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 text-slate-100 p-6 max-w-4xl mx-auto w-full select-none">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 mb-1">
          <Settings className="w-5 h-5 text-blue-400" />
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            System &amp; Security Settings
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Inspect client-side cryptography specifications, container sandbox configuration, and developer credentials.
        </p>
      </div>

      <div className="space-y-6">
        {/* Developer Profile Card */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2.5 mb-4">
            <User className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold font-mono text-white">Developer Profile</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Developer Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Profile Updated
                </span>
              ) : (
                <span className="text-slate-500">Stored in encrypted client state</span>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Security & Cryptography Spec Card */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2.5 mb-4">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold font-mono text-white">Cryptographic Architecture</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs mb-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">CIPHER ALGORITHM</span>
              <span className="text-emerald-400 font-bold text-sm">AES-256-GCM</span>
              <p className="text-[10px] text-slate-400 mt-1">Authenticated 128-bit tag with 96-bit initialization vectors.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">KEY DERIVATION</span>
              <span className="text-blue-400 font-bold text-sm">PBKDF2 SHA-256</span>
              <p className="text-[10px] text-slate-400 mt-1">100,000 hashing rounds with unique cryptographic salt.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">TELEMETRY LEAKAGE</span>
              <span className="text-cyan-400 font-bold text-sm">0.00% Zero-Leak</span>
              <p className="text-[10px] text-slate-400 mt-1">No API credentials ever traverse analytics or central tracking.</p>
            </div>
          </div>
        </div>

        {/* Sandbox Specifications Card */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2.5 mb-4">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold font-mono text-white">Container Sandbox Environment</h2>
          </div>

          <div className="space-y-2 font-mono text-xs text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-500">Runtime Isolation:</span>
              <span className="text-slate-200">Ephemeral Sandboxed Container</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-500">Compilers &amp; Engines:</span>
              <span className="text-slate-200">Node.js 20.14.0 LTS / Python 3.12.3 / Next.js 14.2</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-500">Security Model:</span>
              <span className="text-emerald-400">Strict Non-Root UID 1000 with Read-Only Root FS</span>
            </div>
          </div>
        </div>

        {/* Danger Zone & Reset */}
        <div className="p-6 rounded-2xl border border-rose-900/40 bg-rose-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white font-mono text-sm">Reset Workspace to Initial Seed</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Restores the default Jarvis Portfolio project, standard AI route templates, and sample keys.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Reset workspace database to starter configuration?')) {
                  onResetDefaults();
                }
              }}
              className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Database
            </button>
            <button
              onClick={onSignOut}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
