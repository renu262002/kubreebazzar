import { useState, useEffect } from 'react';
import { AuthFormPanel } from '../components/AuthModal';
import { useStore, type AuthModalTab } from '../context/StoreContext';
import { isAdminRole } from '../utils/adminAuth';

interface AuthPageProps {
  initialTab?: AuthModalTab;
}

export function AuthPage({ initialTab = 'login' }: AuthPageProps) {
  const { user, route, navigate } = useStore();
  const [tab, setTab] = useState<AuthModalTab>(initialTab);
  const [urlToken, setUrlToken] = useState('');

  useEffect(() => {
    const queryStr = route.includes('?')
      ? route.split('?')[1]
      : typeof window !== 'undefined'
        ? window.location.search.replace(/^\?/, '')
        : '';
    const params = new URLSearchParams(queryStr);
    const tokenParam = params.get('token') || '';
    if (tokenParam) {
      setUrlToken(tokenParam);
      setTab('reset');
    } else {
      setTab(initialTab);
    }
  }, [route, initialTab]);

  useEffect(() => {
    document.title =
      tab === 'signup'
        ? 'Create Account | KubreeBazzar'
        : tab === 'forgot'
          ? 'Forgot Password | KubreeBazzar'
          : tab === 'reset'
            ? 'Reset Password | KubreeBazzar'
            : 'Sign In | KubreeBazzar';
  }, [tab]);

  useEffect(() => {
    if (user && tab !== 'reset') {
      navigate(isAdminRole(user) ? '/admin/dashboard' : '/account');
    }
  }, [user, tab, navigate]);

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-14">
      <div className="rounded-2xl bg-white border border-[#DCE6F2] p-5 sm:p-8 shadow-sm">
        <AuthFormPanel
          activeTab={tab}
          onTabChange={setTab}
          initialResetToken={urlToken}
        />
      </div>
    </div>
  );
}
