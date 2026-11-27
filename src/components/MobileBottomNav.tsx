import { Home, LayoutGrid, Search, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function shouldShowMobileBottomNav(
  route: string,
  hasOverlayOpen: boolean
): boolean {
  if (hasOverlayOpen) return false;
  const cleanPath = route.split('?')[0] || '/';
  if (
    cleanPath.startsWith('/product/') ||
    cleanPath === '/checkout' ||
    cleanPath === '/admin' ||
    cleanPath.startsWith('/admin/')
  ) {
    return false;
  }
  return true;
}

export function MobileBottomNav() {
  const {
    route,
    navigate,
    cartCount,
    setCartDrawerOpen,
    cartDrawerOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    quickViewProduct,
    wishlist,
  } = useStore();

  const visible = shouldShowMobileBottomNav(
    route,
    mobileMenuOpen || cartDrawerOpen || Boolean(quickViewProduct)
  );

  if (!visible) return null;

  const cleanPath = route.split('?')[0] || '/';

  const handleSearchFocus = () => {
    const mobileInput = document.getElementById(
      'mobile-header-search'
    ) as HTMLInputElement | null;
    if (mobileInput) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.setTimeout(() => {
        mobileInput.focus();
      }, 150);
      return;
    }
    navigate('/search');
  };

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      active: cleanPath === '/',
      onClick: () => navigate('/'),
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: LayoutGrid,
      active: mobileMenuOpen || cleanPath === '/collections',
      onClick: () => setMobileMenuOpen(true),
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      active: cleanPath === '/search',
      onClick: handleSearchFocus,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      active: cleanPath === '/wishlist',
      badge: wishlist.length > 0 ? wishlist.length : undefined,
      onClick: () => navigate('/wishlist'),
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingBag,
      active: cleanPath === '/cart' || cartDrawerOpen,
      badge: cartCount > 0 ? cartCount : undefined,
      onClick: () => setCartDrawerOpen(true),
    },
  ];

  return (
    <nav
      aria-label="Mobile quick navigation"
      className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#DCE6F2] shadow-[0_-4px_20px_rgba(11,59,120,0.08)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={tab.onClick}
              aria-current={tab.active ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-1 transition-colors cursor-pointer ${
                tab.active
                  ? 'text-[#FF6B1A]'
                  : 'text-[#475569] hover:text-[#0B3B78]'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FF6B1A] text-white font-mono-tabular text-[10px] font-bold flex items-center justify-center leading-none">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold tracking-tight leading-none whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
