import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Key,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { User } from '../../types';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from '../../lib/firebase';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
  onNavigateBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthSuccess,
  onNavigateBack
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const getCleanErrorMessage = (err: any): string => {
    const code = err?.code || '';
    if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password') || code.includes('auth/user-not-found')) {
      return 'Invalid email or password combination.';
    }
    if (code.includes('auth/email-already-in-use')) {
      return 'An account with this email address already exists. Please sign in.';
    }
    if (code.includes('auth/weak-password')) {
      return 'Password must be at least 6 characters.';
    }
    if (code.includes('auth/invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (code.includes('auth/popup-closed-by-user')) {
      return 'Google sign-in popup was cancelled.';
    }
    if (code.includes('auth/popup-blocked')) {
      return 'Popup was blocked by browser. Please allow popups for this site.';
    }
    return err?.message || 'Authentication failed. Please check your credentials.';
  };

  // Google Sign-In with Firebase Popup
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setFeedback(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const appUser: User = {
        id: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Developer',
        role: 'AI Systems Engineer',
        photoURL: fbUser.photoURL || undefined,
        authProvider: 'google'
      };
      setFeedback({ text: `Signed in as ${appUser.displayName}`, type: 'success' });
      setTimeout(() => {
        onAuthSuccess(appUser);
      }, 300);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setFeedback({ text: getCleanErrorMessage(err), type: 'error' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Email / Password submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (mode === 'forgot') {
      if (!email.trim()) {
        setFeedback({ text: 'Please enter your registered email address.', type: 'error' });
        return;
      }
      setIsLoading(true);
      try {
        await sendPasswordResetEmail(auth, email.trim());
        setFeedback({ text: `Password reset email sent to ${email}. Check your inbox.`, type: 'success' });
        setTimeout(() => setMode('signin'), 3000);
      } catch (err: any) {
        setFeedback({ text: getCleanErrorMessage(err), type: 'error' });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!email.trim() || !password.trim()) {
      setFeedback({ text: 'Please provide both email and password.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const nameToUse = displayName.trim() || email.split('@')[0];
        if (cred.user && nameToUse) {
          try {
            await updateProfile(cred.user, { displayName: nameToUse });
          } catch (e) {
            console.warn('Profile displayName sync warning:', e);
          }
        }
        const appUser: User = {
          id: cred.user.uid,
          email: cred.user.email || email,
          displayName: nameToUse,
          role: 'AI Systems Engineer',
          authProvider: 'password'
        };
        setFeedback({ text: 'Account created. Welcome to OwnAI.', type: 'success' });
        setTimeout(() => {
          onAuthSuccess(appUser);
        }, 300);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const appUser: User = {
          id: cred.user.uid,
          email: cred.user.email || email,
          displayName: cred.user.displayName || email.split('@')[0] || 'Developer',
          role: 'AI Systems Engineer',
          photoURL: cred.user.photoURL || undefined,
          authProvider: 'password'
        };
        setFeedback({ text: `Welcome back, ${appUser.displayName}`, type: 'success' });
        setTimeout(() => {
          onAuthSuccess(appUser);
        }, 300);
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      setFeedback({ text: getCleanErrorMessage(err), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-sm">
        {/* Navigation back */}
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white mb-6 transition-colors group"
          id="btn-auth-back"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to OwnAI</span>
        </button>

        {/* Minimal Auth Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
          {/* Logo & Headline */}
          <div className="text-left mb-6">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-mono font-bold text-sm mb-3">
              O
            </div>
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              {mode === 'forgot'
                ? 'Reset password'
                : mode === 'signup'
                ? 'Create account'
                : 'Welcome back'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              {mode === 'forgot'
                ? 'Enter your registered email to receive a recovery link.'
                : mode === 'signup'
                ? 'Bring your own AI keys and start coding autonomously.'
                : 'Sign in to access your workspaces and model routes.'}
            </p>
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <div
              className={`p-3 mb-4 rounded-xl border text-xs font-mono flex items-center gap-2.5 transition-all ${
                feedback.type === 'success'
                  ? 'bg-zinc-950 border-emerald-500/40 text-emerald-300'
                  : 'bg-zinc-950 border-red-500/40 text-red-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              )}
              <span className="flex-1 leading-relaxed">{feedback.text}</span>
            </div>
          )}

          {/* Google One-Click Button */}
          {mode !== 'forgot' && (
            <div className="space-y-4 mb-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-white font-medium text-xs font-mono transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-[0.99]"
                id="btn-google-auth"
              >
                {isGoogleLoading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px bg-zinc-800 flex-1" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">or</span>
                <div className="h-px bg-zinc-800 flex-1" />
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
            {mode === 'signup' && (
              <div>
                <label className="text-zinc-400 block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Satoshi Nakamoto"
                    required={mode === 'signup'}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500 transition-colors"
                    id="input-auth-name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-zinc-400 block mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@domain.com"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500 transition-colors"
                  id="input-auth-email"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-400">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setFeedback(null);
                      }}
                      className="text-[11px] text-zinc-400 hover:text-white transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    minLength={6}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-9 py-2 text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500 transition-colors"
                    id="input-auth-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 active:scale-[0.99] mt-2"
              id="btn-auth-submit"
            >
              {isLoading ? (
                <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
              ) : (
                <span className="flex items-center gap-1.5">
                  {mode === 'forgot'
                    ? 'Send Reset Link'
                    : mode === 'signup'
                    ? 'Create Account'
                    : 'Continue'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-5 pt-4 border-t border-zinc-800 text-center text-xs font-mono text-zinc-400">
            {mode === 'forgot' ? (
              <button
                onClick={() => {
                  setMode('signin');
                  setFeedback(null);
                }}
                className="text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
              >
                Return to sign in
              </button>
            ) : (
              <button
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup');
                  setFeedback(null);
                }}
                className="text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
                id="btn-auth-toggle-mode"
              >
                {mode === 'signup'
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Create one"}
              </button>
            )}
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-mono text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
          <span>Secured with Firebase Auth &amp; Google OAuth</span>
        </div>
      </div>
    </div>
  );
};
