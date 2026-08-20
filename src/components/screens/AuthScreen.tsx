import React, { useState } from 'react';
import {
  Terminal,
  Lock,
  Mail,
  Key,
  User as UserIcon,
  Bolt,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { User } from '../../types';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
  onNavigateBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthSuccess,
  onNavigateBack
}) => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [email, setEmail] = useState('developer@ownai.dev');
  const [password, setPassword] = useState('developer123');
  const [displayName, setDisplayName] = useState('Alex Vance');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (isForgotMode) {
        setFeedback(`Password reset instructions transmitted to ${email}`);
        setIsForgotMode(false);
      } else {
        const user: User = {
          id: 'usr_' + Math.random().toString(36).substring(2, 8),
          email,
          displayName: isSignUpMode ? displayName : 'Alex Vance',
          role: 'Lead AI & Systems Architect'
        };
        onAuthSuccess(user);
      }
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    const user: User = {
      id: 'usr_lead_architect',
      email: 'developer@ownai.dev',
      displayName: 'Alex Vance',
      role: 'Lead AI & Systems Architect'
    };
    onAuthSuccess(user);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Top Icon */}
        <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center mx-auto mb-4 shadow-lg shadow-white/10">
          <Lock className="w-6 h-6 text-black" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold font-mono text-white mb-1">
            {isForgotMode ? 'Reset Developer Password' : isSignUpMode ? 'Create OwnAI Account' : 'Developer Sign In'}
          </h1>
          <p className="text-xs text-zinc-400">
            Encrypted local BYOK session &amp; credential vault management
          </p>
        </div>

        {feedback && (
          <div className="p-3 mb-4 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-white" />
            <span>{feedback}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {isSignUpMode && (
            <div>
              <label className="text-zinc-400 block mb-1">Display Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex Vance"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-zinc-400 block mb-1">Developer Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@ownai.dev"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          {!isForgotMode && (
            <div>
              <label className="text-zinc-400 block mb-1">Master Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
            ) : (
              <span>{isForgotMode ? 'Send Reset Instructions' : isSignUpMode ? 'Register Account' : 'Sign In'}</span>
            )}
          </button>

          {/* Quick Demo One-Tap Login */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-lg border border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 hover:text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Bolt className="w-4 h-4 text-white" />
            <span>One-Tap Demo Login (Lead Architect)</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
          <button
            onClick={() => setIsForgotMode(!isForgotMode)}
            className="hover:text-zinc-200 transition-colors"
          >
            {isForgotMode ? 'Back to sign in' : 'Forgot password?'}
          </button>

          <button
            onClick={() => {
              setIsSignUpMode(!isSignUpMode);
              setIsForgotMode(false);
            }}
            className="text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
          >
            {isSignUpMode ? 'Existing account? Sign in' : 'Create new account'}
          </button>
        </div>
      </div>
    </div>
  );
};
