import { useState, useEffect, type FormEvent } from 'react';
import { ShieldCheck, Lock, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { SystemInfrastructureStatus, User } from '../../types';
import { isAdminRole } from '../../utils/adminAuth';
import { apiFetch } from '../../utils/apiClient';

interface AdminLoginViewProps {
  onSuccess: (token: string, user: User) => void;
  onBackToStore: () => void;
}

export function AdminLoginView({ onSuccess, onBackToStore }: AdminLoginViewProps) {
  const [statusLoading, setStatusLoading] = useState(true);
  const [bootstrapStatus, setBootstrapStatus] = useState<
    (SystemInfrastructureStatus & { requiresBootstrapToken?: boolean }) | null
  >(null);

  const [authView, setAuthView] = useState<'login' | 'forgot' | 'reset'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bootstrapToken, setBootstrapToken] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const loadBootstrapStatus = async () => {
    setStatusLoading(true);
    try {
      const res = await apiFetch('/api/admin/bootstrap-status');
      if (res.ok) {
        const data = await res.json();
        setBootstrapStatus(data);
      }
    } catch {
      setBootstrapStatus(null);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    void loadBootstrapStatus();
  }, []);

  const isFirstRunSetup = bootstrapStatus ? !bootstrapStatus.hasSuperAdmin : false;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMsg(null);

    if (authView === 'forgot') {
      if (!email.trim()) {
        setError('Enter your administrator email address.');
        return;
      }
      setSubmitting(true);
      try {
        const res = await apiFetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || 'Could not process password reset request.');
          return;
        }
        setInfoMsg(
          data.message ||
            'If an administrator account matches that email, password reset instructions have been sent.'
        );
      } catch {
        setError('Network error while requesting password reset.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (authView === 'reset') {
      if (!resetToken.trim() || password.length < 8) {
        setError('Enter your reset token and a new password of at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setSubmitting(true);
      try {
        const res = await apiFetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: resetToken.trim(), password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || 'Invalid or expired reset token.');
          return;
        }
        setPassword('');
        setConfirmPassword('');
        setResetToken('');
        setAuthView('login');
        setInfoMsg(data.message || 'Password updated! Sign in with your new credentials.');
      } catch {
        setError('Network error while resetting password.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (isFirstRunSetup) {
      if (!name.trim() || !email.trim() || password.length < 8) {
        setError('Enter your full name, valid email, and a password of at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setSubmitting(true);
      try {
        const res = await apiFetch('/api/admin/bootstrap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            ...(bootstrapToken.trim() ? { bootstrapToken: bootstrapToken.trim() } : {}),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || 'Could not provision Super Admin account.');
          if (res.status === 403) void loadBootstrapStatus();
          return;
        }
        onSuccess(data.token || 'cookie-session', data.user);
      } catch {
        setError('Network error while provisioning Super Admin.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!email.trim() || !password) {
      setError('Administrator email and password are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Invalid administrator credentials.');
        return;
      }
      if (!isAdminRole(data.user)) {
        setError('This account does not have Administrator privileges.');
        return;
      }
      onSuccess(data.token || 'cookie-session', data.user);
    } catch {
      setError('Network error while signing in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0B3B78] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>
          <span className="text-xs font-semibold text-[#64748B]">
            KubreeBazzar Operations
          </span>
        </div>

        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1D6FD8]">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isFirstRunSetup
                  ? 'First-Run Super Admin Setup'
                  : authView === 'forgot'
                    ? 'Administrator Recovery'
                    : authView === 'reset'
                      ? 'Set New Admin Password'
                      : 'Restricted Admin Access'}
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-[#0B3B78]">
              {isFirstRunSetup
                ? 'Create Super Admin Account'
                : authView === 'forgot'
                  ? 'Forgot Admin Password'
                  : authView === 'reset'
                    ? 'Reset Admin Password'
                    : 'Admin Portal Sign In'}
            </h1>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {isFirstRunSetup
                ? 'No administrator account exists yet. Create your initial Super Admin credentials to unlock catalog, order, GridFS storage, and staff management.'
                : authView === 'forgot'
                  ? 'Request a password reset link sent via the configured server email service.'
                  : authView === 'reset'
                    ? 'Enter your reset token and choose a new password (min. 8 characters).'
                    : 'Sign in with a verified Super Admin, Product Manager, Order Manager, or Viewer account.'}
            </p>
          </div>

          {bootstrapStatus && !bootstrapStatus.mongoConfigured && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Running in {bootstrapStatus.activeDatabaseMode} · {bootstrapStatus.activeStorageMode}
                </span>
              </div>
              <p className="text-[11px] text-amber-800">
                Configure MONGODB_URI and SESSION_SECRET environment variables on Vercel before public launch.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          {infoMsg && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs font-medium text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}

          {statusLoading ? (
            <div className="space-y-3 py-4">
              <div className="h-10 rounded-xl bg-[#F1F5F9] animate-pulse" />
              <div className="h-10 rounded-xl bg-[#F1F5F9] animate-pulse" />
              <div className="h-11 rounded-xl bg-[#F1F5F9] animate-pulse" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {authView === 'login' && isFirstRunSetup && (
                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Store Owner"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
              )}

              {authView !== 'reset' && (
                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1.5">
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@kubreebazzar.com"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
              )}

              {authView === 'reset' && (
                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1.5">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Paste reset token"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
              )}

              {authView !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#132238]">
                      {authView === 'reset'
                        ? 'New Password (min 8 characters)'
                        : `Password ${isFirstRunSetup ? '(min 8 characters)' : ''}`}
                    </label>
                    {authView === 'login' && !isFirstRunSetup && (
                      <button
                        type="button"
                        onClick={() => {
                          setError(null);
                          setInfoMsg(null);
                          setAuthView('forgot');
                        }}
                        className="text-xs font-semibold text-[#1D6FD8] hover:text-[#FF6B1A] cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    minLength={isFirstRunSetup || authView === 'reset' ? 8 : 1}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
              )}

              {(isFirstRunSetup || authView === 'reset') && (
                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
              )}

              {authView === 'login' && isFirstRunSetup && bootstrapStatus?.requiresBootstrapToken && (
                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1.5">
                    Initial Bootstrap Token
                  </label>
                  <input
                    type="password"
                    required
                    value={bootstrapToken}
                    onChange={(e) => setBootstrapToken(e.target.value)}
                    placeholder="INITIAL_ADMIN_BOOTSTRAP_TOKEN"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-sm font-mono text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] disabled:opacity-60 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {submitting
                    ? 'Verifying...'
                    : authView === 'forgot'
                      ? 'Send Password Reset Link'
                      : authView === 'reset'
                        ? 'Save New Admin Password'
                        : isFirstRunSetup
                          ? 'Create Super Admin & Enter Portal'
                          : 'Sign In to Admin Portal'}
                </span>
              </button>

              {authView !== 'login' && (
                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setInfoMsg(null);
                      setAuthView('login');
                    }}
                    className="font-semibold text-[#1D6FD8] hover:underline cursor-pointer"
                  >
                    Back to Admin Sign In
                  </button>
                  {authView === 'forgot' && (
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setInfoMsg(null);
                        setAuthView('reset');
                      }}
                      className="font-semibold text-[#475569] hover:text-[#0B3B78] cursor-pointer"
                    >
                      Have a reset token?
                    </button>
                  )}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
