import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Menu,
  X,
  LogOut,
  ExternalLink,
  AlertTriangle,
  ShieldCheck,
  LayoutDashboard,
  Package,
  PackagePlus,
  FolderTree,
  Image as ImageIcon,
  Boxes,
  ClipboardList,
  Users,
  Tag,
  BarChart3,
  UserCog,
  Settings,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type {
  AdminAnalytics,
  Order,
  SystemInfrastructureStatus,
  User,
} from '../../types';
import {
  ADMIN_ROLE_LABELS,
  hasAdminPermission,
  isAdminRole,
  normalizeAdminRole,
} from '../../utils/adminAuth';
import { apiFetch, buildApiHeaders } from '../../utils/apiClient';
import { ADMIN_NAV_ITEMS, type AdminSectionRoute } from './adminTypes';
import { AdminLoginView } from './AdminLoginView';
import { AdminOverviewView } from './AdminOverviewView';
import { AdminProductsView } from './AdminProductsView';
import { AdminCategoriesView } from './AdminCategoriesView';
import { AdminImagesView } from './AdminImagesView';
import { AdminInventoryView } from './AdminInventoryView';
import { AdminOrdersView } from './AdminOrdersView';
import { AdminCustomersView } from './AdminCustomersView';
import { AdminCouponsView } from './AdminCouponsView';
import { AdminReportsView } from './AdminReportsView';
import { AdminUsersView } from './AdminUsersView';
import { AdminSettingsView } from './AdminSettingsView';

function resolveNavIcon(path: AdminSectionRoute) {
  switch (path) {
    case '/admin/dashboard':
      return LayoutDashboard;
    case '/admin/products':
      return Package;
    case '/admin/products/new':
      return PackagePlus;
    case '/admin/categories':
      return FolderTree;
    case '/admin/images':
      return ImageIcon;
    case '/admin/inventory':
      return Boxes;
    case '/admin/orders':
      return ClipboardList;
    case '/admin/customers':
      return Users;
    case '/admin/coupons':
      return Tag;
    case '/admin/reports':
      return BarChart3;
    case '/admin/users':
      return UserCog;
    case '/admin/settings':
      return Settings;
  }
}

export function AdminPortal() {
  const {
    route,
    navigate,
    user,
    token,
    authLoading,
    setSession,
    logout,
    products,
    categories,
    coupons,
    banners,
    settings,
    refreshCatalog,
    showToast,
  } = useStore();

  const cleanPath = route.split('?')[0] || '/admin/dashboard';

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [infraStatus, setInfraStatus] = useState<SystemInfrastructureStatus | null>(null);
  const [loadingAdminData, setLoadingAdminData] = useState(false);

  const isAuthenticatedAdmin = Boolean(user && isAdminRole(user));
  const roleKey = normalizeAdminRole(user);

  const allowedNavItems = useMemo(
    () =>
      ADMIN_NAV_ITEMS.filter((item) => hasAdminPermission(user, item.permission)),
    [user]
  );

  // Canonicalize /admin -> /admin/dashboard
  useEffect(() => {
    if (cleanPath === '/admin' || cleanPath === '/admin/') {
      window.history.replaceState({}, '', '/admin/dashboard');
    }
  }, [cleanPath]);

  const activeSection: AdminSectionRoute = useMemo(() => {
    if (cleanPath === '/admin' || cleanPath === '/admin/' || cleanPath === '/admin/dashboard') {
      return '/admin/dashboard';
    }
    const found = ADMIN_NAV_ITEMS.find((item) => item.path === cleanPath);
    if (found) return found.path;
    return '/admin/dashboard';
  }, [cleanPath]);

  useEffect(() => {
    const activeLabel =
      ADMIN_NAV_ITEMS.find((i) => i.path === activeSection)?.label || 'Admin Portal';
    document.title = `${activeLabel} · KubreeBazzar Admin`;
  }, [activeSection]);

  const loadAdminOperationsData = useCallback(async () => {
    if (!isAdminRole(user)) return;
    setLoadingAdminData(true);
    try {
      const headers = buildApiHeaders(token);
      const [sysRes, anaRes, ordRes, custRes] = await Promise.all([
        apiFetch('/api/system/status').catch(() => null),
        hasAdminPermission(user, 'view_dashboard')
          ? apiFetch('/api/admin/analytics', { headers }).catch(() => null)
          : Promise.resolve(null),
        hasAdminPermission(user, 'view_orders')
          ? apiFetch('/api/admin/orders', { headers }).catch(() => null)
          : Promise.resolve(null),
        hasAdminPermission(user, 'view_customers')
          ? apiFetch('/api/admin/customers', { headers }).catch(() => null)
          : Promise.resolve(null),
      ]);

      if (sysRes?.ok) setInfraStatus(await sysRes.json());
      if (anaRes?.ok) setAnalytics(await anaRes.json());
      if (ordRes?.ok) setOrders(await ordRes.json());
      if (custRes?.ok) setCustomers(await custRes.json());
    } finally {
      setLoadingAdminData(false);
    }
  }, [token, user]);

  useEffect(() => {
    if (isAuthenticatedAdmin) {
      void loadAdminOperationsData();
    }
  }, [isAuthenticatedAdmin, loadAdminOperationsData]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-2xl bg-white border border-[#DCE6F2] p-6 space-y-3 animate-pulse">
          <div className="h-5 w-40 bg-[#E2E8F0] rounded" />
          <div className="h-4 w-full bg-[#F1F5F9] rounded" />
          <div className="h-10 w-full bg-[#F1F5F9] rounded-xl" />
        </div>
      </div>
    );
  }

  // Unauthenticated or /admin/login or non-admin account trying to open /admin/*
  if (!isAuthenticatedAdmin || cleanPath === '/admin/login') {
    if (user && !isAdminRole(user)) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-white border border-[#DCE6F2] p-6 sm:p-8 text-center space-y-4">
            <ShieldCheck className="w-10 h-10 text-rose-600 mx-auto" />
            <h1 className="font-display text-2xl font-bold text-[#0B3B78]">
              Administrator Access Required
            </h1>
            <p className="text-xs text-[#64748B]">
              Signed in as <strong>{user.email}</strong> (Customer). Customer accounts do not have permission to access the KubreeBazzar Admin Portal.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 min-h-[42px] px-4 py-2 rounded-xl border border-[#DCE6F2] text-xs font-bold text-[#0B3B78] cursor-pointer"
              >
                Return to Storefront
              </button>
              <button
                type="button"
                onClick={() => void logout()}
                className="flex-1 min-h-[42px] px-4 py-2 rounded-xl bg-[#0B3B78] text-xs font-bold text-white cursor-pointer"
              >
                Sign Out &amp; Switch Account
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminLoginView
        onBackToStore={() => navigate('/')}
        onSuccess={(newToken, loggedAdmin) => {
          setSession(newToken, loggedAdmin);
          showToast(`Signed in as ${loggedAdmin.name}`);
          navigate('/admin/dashboard');
        }}
      />
    );
  }

  const handleNavClick = (path: AdminSectionRoute) => {
    setMobileDrawerOpen(false);
    navigate(path);
  };

  const activeNavItem = ADMIN_NAV_ITEMS.find((i) => i.path === activeSection);
  const canAccessActive =
    !activeNavItem || hasAdminPermission(user, activeNavItem.permission);

  const renderSection = () => {
    if (!canAccessActive) {
      return (
        <div className="rounded-xl bg-white border border-[#DCE6F2] p-10 text-center space-y-3">
          <ShieldCheck className="w-9 h-9 text-amber-600 mx-auto" />
          <h2 className="font-display text-xl font-bold text-[#0B3B78]">
            Restricted Permission
          </h2>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            Your current role ({roleKey ? ADMIN_ROLE_LABELS[roleKey] : 'Staff'}) does not include access to{' '}
            <strong>{activeNavItem?.label}</strong>.
          </p>
          {allowedNavItems[0] && (
            <button
              type="button"
              onClick={() => handleNavClick(allowedNavItems[0].path)}
              className="px-4 py-2 rounded-xl bg-[#0B3B78] text-xs font-bold text-white cursor-pointer"
            >
              Go to {allowedNavItems[0].label}
            </button>
          )}
        </div>
      );
    }

    switch (activeSection) {
      case '/admin/dashboard':
        return (
          <AdminOverviewView
            analytics={analytics}
            orders={orders}
            loading={loadingAdminData}
            onNavigateSection={handleNavClick}
            canManageProducts={hasAdminPermission(user, 'manage_products')}
            canManageImages={hasAdminPermission(user, 'manage_images')}
          />
        );
      case '/admin/products':
      case '/admin/products/new':
        return (
          <AdminProductsView
            products={products}
            categories={categories}
            token={token || ''}
            canDelete={hasAdminPermission(user, 'delete_products')}
            startCreating={activeSection === '/admin/products/new'}
            onRefreshCatalog={refreshCatalog}
            onNotify={showToast}
            onExitCreateRoute={() => {
              if (activeSection === '/admin/products/new') {
                navigate('/admin/products');
              }
            }}
          />
        );
      case '/admin/categories':
        return (
          <AdminCategoriesView
            categories={categories}
            token={token || ''}
            onRefreshCatalog={refreshCatalog}
            onNotify={showToast}
          />
        );
      case '/admin/images':
        return (
          <AdminImagesView
            token={token || ''}
            onRefreshCatalog={refreshCatalog}
            onNotify={showToast}
          />
        );
      case '/admin/inventory':
        return (
          <AdminInventoryView
            products={products}
            token={token || ''}
            onRefreshCatalog={refreshCatalog}
            onNotify={showToast}
          />
        );
      case '/admin/orders':
        return (
          <AdminOrdersView
            orders={orders}
            token={token || ''}
            canManageOrders={hasAdminPermission(user, 'manage_orders')}
            onOrderUpdated={(updated) => {
              setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
              void loadAdminOperationsData();
            }}
            onNotify={showToast}
          />
        );
      case '/admin/customers':
        return <AdminCustomersView users={customers} orders={orders} />;
      case '/admin/coupons':
        return (
          <AdminCouponsView
            coupons={coupons}
            banners={banners}
            categories={categories}
            token={token || ''}
            onRefreshCatalog={refreshCatalog}
            onNotify={showToast}
          />
        );
      case '/admin/reports':
        return (
          <AdminReportsView
            analytics={analytics}
            orders={orders}
            products={products}
            token={token || ''}
          />
        );
      case '/admin/users':
        return (
          <AdminUsersView
            token={token || ''}
            currentUserId={user!.id}
            onNotify={showToast}
          />
        );
      case '/admin/settings':
        return (
          <AdminSettingsView
            settings={settings}
            token={token || ''}
            onRefreshCatalog={refreshCatalog}
            onNotify={showToast}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#132238] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-white border-r border-[#DCE6F2] sticky top-0 h-screen">
        <div className="px-5 py-4 border-b border-[#EEF4FB]">
          <button
            type="button"
            onClick={() => handleNavClick('/admin/dashboard')}
            className="text-left cursor-pointer"
          >
            <span className="font-display text-lg font-extrabold text-[#0B3B78] block leading-tight">
              KubreeBazzar
            </span>
            <span className="text-[11px] font-semibold text-[#64748B]">
              Store Operations Portal
            </span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {allowedNavItems.map((item) => {
            const Icon = resolveNavIcon(item.path);
            const active = activeSection === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#0B3B78] text-white'
                    : 'text-[#475569] hover:bg-[#F0F6FF] hover:text-[#0B3B78]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#EEF4FB] space-y-2.5">
          <div className="text-xs">
            <p className="font-bold text-[#0B3B78] truncate">{user!.name}</p>
            <p className="text-[11px] text-[#64748B] truncate">
              {roleKey ? ADMIN_ROLE_LABELS[roleKey] : 'Admin'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-3 py-2 rounded-lg border border-[#DCE6F2] text-[11px] font-semibold text-[#0B3B78] hover:bg-[#F0F6FF] inline-flex items-center justify-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Store</span>
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex-1 px-3 py-2 rounded-lg border border-rose-200 bg-rose-50 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 inline-flex items-center justify-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col border-r border-[#DCE6F2] z-10">
            <div className="px-4 py-4 border-b border-[#EEF4FB] flex items-center justify-between">
              <span className="font-display text-lg font-extrabold text-[#0B3B78]">
                KubreeBazzar Admin
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 rounded-lg text-[#475569] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {allowedNavItems.map((item) => {
                const Icon = resolveNavIcon(item.path);
                const active = activeSection === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      active
                        ? 'bg-[#0B3B78] text-white'
                        : 'text-[#475569] hover:bg-[#F0F6FF]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[#EEF4FB] flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs font-semibold text-[#0B3B78]"
              >
                Storefront
              </button>
              <button
                type="button"
                onClick={() => void logout()}
                className="flex-1 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700"
              >
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar Contract: Breadcrumb Left, Single Primary Action Right */}
        <header className="bg-white border-b border-[#DCE6F2] px-4 sm:px-6 h-14 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open admin navigation"
              className="lg:hidden p-2 rounded-lg border border-[#DCE6F2] text-[#0B3B78] cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs text-[#64748B] truncate">
              <span className="font-semibold text-[#0B3B78] whitespace-nowrap">Admin</span>
              <span aria-hidden="true">/</span>
              <span className="truncate font-medium text-[#132238]">
                {activeNavItem?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-xs text-[#64748B] whitespace-nowrap">
              {user!.email} · {roleKey ? ADMIN_ROLE_LABELS[roleKey] : 'Admin'}
            </span>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-3.5 py-1.5 rounded-lg border border-[#DCE6F2] bg-white hover:bg-[#F0F6FF] text-xs font-semibold text-[#0B3B78] whitespace-nowrap shrink-0 cursor-pointer"
            >
              View Storefront
            </button>
          </div>
        </header>

        {/* Honest Admin-Only Cloud Configuration Notice */}
        {infraStatus && !infraStatus.mongoConfigured && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Environment notice: running in <strong>{infraStatus.activeDatabaseMode}</strong> &amp;{' '}
                <strong>{infraStatus.activeStorageMode}</strong>. Configure MongoDB Atlas (kubreebazzar) &amp; GridFS env vars in Vercel before live launch.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleNavClick('/admin/settings')}
              className="font-bold text-[#0B3B78] hover:underline whitespace-nowrap cursor-pointer"
            >
              Check System Health
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
