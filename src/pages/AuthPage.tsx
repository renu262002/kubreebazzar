import { useState } from 'react';
import { Lock, Mail, User as UserIcon, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function AuthPage() {
  const { setSession, navigate, showToast } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitAuth = async (
    targetMode: 'login' | 'register',
    payload: { name?: string; email: string; password: string }
  ) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${targetMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }
      setSession(data.token, data.user);
      showToast(`Welcome, ${data.user.name}`);
      navigate(data.user.role === 'admin' ? '/admin' : '/profile');
    } catch {
      setError('Network error while authenticating');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAuth(mode, { name, email, password });
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="rounded-2xl bg-white border border-[#E6DCD0] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88628] mb-1">
            KubreeBazzar
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#1E1614]">
            {mode === 'login' ? 'Sign In to Your Account' : 'Create an Account'}
          </h1>
          <p className="text-xs text-[#6E6059] mt-1.5">
            Access saved addresses, wishlist, and live order tracking.
          </p>
        </div>

        <div className="grid grid-cols-2 p-1 rounded-lg bg-[#FAF6F0] border border-[#E6DCD0]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-[#6B1D2F] text-white'
                : 'text-[#5C4F49] hover:text-[#1E1614]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-[#6B1D2F] text-white'
                : 'text-[#5C4F49] hover:text-[#1E1614]'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-300 px-3.5 py-2.5 text-xs text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs text-[#5C4F49] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8C7E77] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Meenakshi Sundaram"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-[#5C4F49] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C7E77] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#5C4F49] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C7E77] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant Preview Credentials */}
        <div className="pt-4 border-t border-[#E6DCD0] space-y-2.5">
          <p className="text-xs text-[#6E6059] text-center">
            Quick Preview Access
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() =>
                submitAuth('login', {
                  email: 'shopper@kubreebazzar.com',
                  password: 'Customer123!',
                })
              }
              className="py-2 px-3 rounded-lg border border-[#E6DCD0] bg-[#FAF6F0] hover:border-[#6B1D2F] text-xs font-medium text-[#1E1614] transition-colors cursor-pointer"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() =>
                submitAuth('login', {
                  email: 'admin@kubreebazzar.com',
                  password: 'Admin123!',
                })
              }
              className="py-2 px-3 rounded-lg border border-[#E6DCD0] bg-[#FAF6F0] hover:border-[#B88628] text-xs font-medium text-[#1E1614] transition-colors cursor-pointer"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
