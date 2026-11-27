import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth, useStore, type AuthModalTab } from '../context/StoreContext';
import { KubreeBazzarLogo } from './KubreeBazzarLogo';


interface AuthFormPanelProps {
  activeTab: AuthModalTab;
  onTabChange: (tab: AuthModalTab) => void;
  contextMessage?: string | null;
  initialResetToken?: string;
  onSuccess?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export function AuthFormPanel({
  activeTab,
  onTabChange,
  contextMessage,
  initialResetToken = '',
  onSuccess,
  isModal = false,
  onClose,
}: AuthFormPanelProps) {
  const {
    authMode,
    loginWithEmail,
    registerWithEmail,
    requestPasswordReset,
    confirmPasswordReset,
  } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState(initialResetToken);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [readyResetToken, setReadyResetToken] = useState<string | null>(null);

  useEffect(() => {
    if (initialResetToken) {
      setResetToken(initialResetToken);
    }
  }, [initialResetToken]);

  const switchTab = (nextTab: AuthModalTab) => {
    setError(null);
    setInfoMessage(null);
    setReadyResetToken(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    onTabChange(nextTab);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    const result = await loginWithEmail(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error || 'Unable to sign in. Please check your details.');
      return;
    }
    onSuccess?.();
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await registerWithEmail({
      name,
      email,
      password,
      phone,
    });
    setLoading(false);

    if (!result.ok) {
      setError(result.error || 'Could not create your account.');
      return;
    }

    if (result.verificationRequired) {
      setInfoMessage(
        result.message ||
          'Account created! Please verify your email address before logging in.'
      );
      return;
    }

    onSuccess?.();
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setReadyResetToken(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter the email address registered with your account.');
      return;
    }

    setLoading(true);
    const result = await requestPasswordReset(email);
    setLoading(false);

    if (!result.ok) {
      setError(result.error || 'Unable to request password reset.');
      return;
    }

    setInfoMessage(
      result.message ||
        'Password reset instructions have been sent if your account exists.'
    );
    if (result.devResetToken) {
      setReadyResetToken(result.devResetToken);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (authMode === 'server' && !resetToken.trim()) {
      setError('Please enter or use a valid reset token.');
      return;
    }
    if (password.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await confirmPasswordReset({
      token: resetToken,
      newPassword: password,
    });
    setLoading(false);

    if (!result.ok) {
      setError(result.error || 'Could not update your password.');
      return;
    }

    setPassword('');
    setConfirmPassword('');
    setResetToken('');
    setInfoMessage(
      result.message || 'Password updated! Please sign in with your new password.'
    );
    onTabChange('login');
  };

  const isAuthTab = activeTab === 'login' || activeTab === 'signup';

  return (
    <div className="space-y-5">
      {/* Header Brand Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <KubreeBazzarLogo size="sm" />
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B3B78] pt-1">
            {activeTab === 'login'
              ? 'Sign In to KubreeBazzar'
              : activeTab === 'signup'
                ? 'Create Your Account'
                : activeTab === 'forgot'
                  ? 'Reset Your Password'
                  : 'Choose a New Password'}
          </h2>
          <p className="text-xs text-[#64748B]">
            {activeTab === 'login'
              ? 'Save items to your cart & wishlist, track orders, and check out securely.'
              : activeTab === 'signup'
                ? 'Join KubreeBazzar for faster checkout, saved addresses, and order tracking.'
                : activeTab === 'forgot'
                  ? 'Enter your account email and we will help you reset your password.'
                  : 'Enter a strong new password for your KubreeBazzar account.'}
          </p>
        </div>

        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            className="w-10 h-10 rounded-xl bg-[#F0F6FF] hover:bg-[#DCE6F2] text-[#0B3B78] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Contextual Explanation Banner (e.g. from Add to Cart or Wishlist click) */}
      {contextMessage && (
        <div className="rounded-xl bg-[#F0F6FF] border border-[#1D6FD8]/30 px-3.5 py-2.5 flex items-start gap-2.5 text-xs font-semibold text-[#0B3B78]">
          <ShieldCheck className="w-4 h-4 text-[#FF6B1A] shrink-0 mt-0.5" />
          <span>{contextMessage}</span>
        </div>
      )}

      {/* Login / Create Account Segmented Tabs */}
      {isAuthTab && (
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2]">
          <button
            type="button"
            onClick={() => switchTab('login')}
            className={`py-2 min-h-[42px] rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#0B3B78] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0B3B78]'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchTab('signup')}
            className={`py-2 min-h-[42px] rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-[#0B3B78] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0B3B78]'
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      {/* Error & Success Feedback Banners */}
      {error && (
        <div
          role="alert"
          className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 flex items-start gap-2 text-xs font-medium text-rose-800"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {infoMessage && (
        <div
          role="status"
          className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 space-y-2 text-xs font-medium text-emerald-900"
        >
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
          {readyResetToken && (
            <button
              type="button"
              onClick={() => {
                setResetToken(readyResetToken);
                setInfoMessage(null);
                setError(null);
                onTabChange('reset');
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#0B3B78] hover:bg-[#1D6FD8] text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Continue to Set New Password
            </button>
          )}
        </div>
      )}

      {/* LOGIN FORM */}
      {activeTab === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="auth-login-email"
              className="block text-xs font-semibold text-[#334155] mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="auth-login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D6FD8] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="auth-login-password"
                className="block text-xs font-semibold text-[#334155]"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => switchTab('forgot')}
                className="text-xs font-semibold text-[#1D6FD8] hover:text-[#FF6B1A] transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="auth-login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D6FD8] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0B3B78] cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 min-h-[46px] rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] disabled:opacity-60 text-sm font-bold text-white flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* SIGN UP FORM */}
      {activeTab === 'signup' && (
        <form onSubmit={handleSignupSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor="auth-signup-name"
              className="block text-xs font-semibold text-[#334155] mb-1"
            >
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="auth-signup-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D6FD8] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="auth-signup-email"
                className="block text-xs font-semibold text-[#334155] mb-1"
              >
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="auth-signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D6FD8] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-signup-phone"
                className="block text-xs font-semibold text-[#334155] mb-1"
              >
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="auth-signup-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D6FD8] focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-signup-password"
              className="block text-xs font-semibold text-[#334155] mb-1"
            >
              Password * (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="auth-signup-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D6FD8] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0B3B78] cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-signup-confirm"
              className="block text-xs font-semibold text-[#334155] mb-1"
            >
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="auth-signup-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D6FD8] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label={
                  showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0B3B78] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 min-h-[46px] rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] disabled:opacity-60 text-sm font-bold text-white flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* FORGOT PASSWORD FORM */}
      {activeTab === 'forgot' && (
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="auth-forgot-email"
              className="block text-xs font-semibold text-[#334155] mb-1.5"
            >
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="auth-forgot-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D6FD8] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 min-h-[46px] rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] disabled:opacity-60 text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing Reset Link...</span>
              </>
            ) : (
              <span>Send Password Reset Link</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => switchTab('login')}
            className="w-full py-2 min-h-[40px] text-xs font-semibold text-[#1D6FD8] hover:text-[#FF6B1A] inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
        </form>
      )}

      {/* RESET PASSWORD FORM */}
      {activeTab === 'reset' && (
        <form onSubmit={handleResetSubmit} className="space-y-4">
          {authMode === 'server' && !initialResetToken && (
            <div>
              <label
                htmlFor="auth-reset-token"
                className="block text-xs font-semibold text-[#334155] mb-1.5"
              >
                Reset Token
              </label>
              <input
                id="auth-reset-token"
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Paste reset token"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-reset-password"
              className="block text-xs font-semibold text-[#334155] mb-1.5"
            >
              New Password * (min. 8 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="auth-reset-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0B3B78] cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-reset-confirm"
              className="block text-xs font-semibold text-[#334155] mb-1.5"
            >
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="auth-reset-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label={
                  showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0B3B78] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 min-h-[46px] rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] disabled:opacity-60 text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Save New Password</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => switchTab('login')}
            className="w-full py-2 min-h-[40px] text-xs font-semibold text-[#1D6FD8] hover:text-[#FF6B1A] inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
        </form>
      )}



      {/* Secondary Switcher Footer */}
      {isAuthTab && (
        <p className="text-center text-xs text-[#64748B] pt-1">
          {activeTab === 'login' ? (
            <>
              New to KubreeBazzar?{' '}
              <button
                type="button"
                onClick={() => switchTab('signup')}
                className="font-bold text-[#1D6FD8] hover:text-[#FF6B1A] underline underline-offset-2 cursor-pointer"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('login')}
                className="font-bold text-[#1D6FD8] hover:text-[#FF6B1A] underline underline-offset-2 cursor-pointer"
              >
                Sign in here
              </button>
            </>
          )}
        </p>
      )}
    </div>
  );
}

export function AuthModal() {
  const {
    authModalOpen,
    authModalTab,
    authModalMessage,
    setAuthModalTab,
    closeAuthModal,
  } = useStore();

  useEffect(() => {
    if (!authModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0B3B78]/60 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Customer Authentication"
    >
      {/* Backdrop click discards pending action safely */}
      <div className="fixed inset-0" onClick={closeAuthModal} />

      <div className="relative z-10 w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-2xl bg-white border border-[#DCE6F2] p-5 sm:p-7 shadow-2xl">
        <AuthFormPanel
          activeTab={authModalTab}
          onTabChange={setAuthModalTab}
          contextMessage={authModalMessage}
          isModal
          onClose={closeAuthModal}
        />
      </div>
    </div>
  );
}
