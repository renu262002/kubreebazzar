import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Heart,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { KubreeBazzarLogo } from './KubreeBazzarLogo';
import type { ProductCategory } from '../types';

const FALLBACK_CATEGORY_META: Record<
  ProductCategory,
  { subtitle: string; description: string; subcategories: string[] }
> = {
  Rice: {
    subtitle: 'Aromatic & Aged Harvests',
    description:
      'Aged Basmati, silky Boiled Ponni, lightweight Sona Masoori, and heirloom rice varieties.',
    subcategories: [
      'Aged Basmati Rice',
      'Boiled & Raw Ponni',
      'Sona Masoori & Daily Rice',
      'Heirloom & Red Rice',
    ],
  },
  Grocery: {
    subtitle: 'Everyday Kitchen Essentials',
    description:
      'Cold-pressed cooking oils, unpolished dals, whole spices, stone-milled flours, and pantry staples.',
    subcategories: [
      'Cold-Pressed Cooking Oils',
      'Unpolished Dals & Pulses',
      'Whole & Ground Spices',
      'Stone-Milled Flours & Staples',
    ],
  },
  Honey: {
    subtitle: 'Pure Golden Goodness',
    description:
      'Single-origin forest, coffee-blossom, and multiflora honeys packed in thick glass jars.',
    subcategories: [
      'Wild Forest Honey',
      'Coffee & Blossom Honey',
      'Multiflora Raw Honey',
      'Infused & Comb Honey',
    ],
  },
  Watches: {
    subtitle: 'Timeless Style for Every Moment',
    description:
      'Heritage automatic movements, sapphire-crystal chronographs, dress watches, and smart timepieces.',
    subcategories: [
      'Automatic & Mechanical',
      'Chronograph Watches',
      'Classic Dress Watches',
      'Everyday & Smart Watches',
    ],
  },
};

export function Header() {
  const {
    route,
    navigate,
    cartCount,
    setCartDrawerOpen,
    user,
    wishlist,
    categories,
    products,
  } = useStore();
  const headerRef = useRef<HTMLElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMegaCat, setActiveMegaCat] = useState<
    ProductCategory | 'ALL' | null
  >(null);
  const [expandedMobileCat, setExpandedMobileCat] =
    useState<ProductCategory | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const primaryCategories: { label: ProductCategory; path: string }[] = [
    { label: 'Rice', path: '/rice' },
    { label: 'Grocery', path: '/grocery' },
    { label: 'Honey', path: '/honey' },
    { label: 'Watches', path: '/watches' },
  ];

  const secondaryLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Offers', path: '/offers' },
    { label: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMegaCat(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const liveSuggestions = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [searchText, products]);

  const handleNav = (path: string) => {
    setMobileOpen(false);
    setActiveMegaCat(null);
    setSearchFocused(false);
    navigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    handleNav(`/search?q=${encodeURIComponent(searchText.trim())}`);
  };

  const getCategoryData = (catId: ProductCategory) => {
    const found = categories.find((c) => c.id === catId);
    const fb = FALLBACK_CATEGORY_META[catId];
    return {
      id: catId,
      subtitle: found?.subtitle || fb.subtitle,
      description: found?.description || fb.description,
      subcategories:
        found?.subcategories && found.subcategories.length > 0
          ? found.subcategories
          : fb.subcategories,
    };
  };

  const megaCategoryObj =
    activeMegaCat && activeMegaCat !== 'ALL'
      ? getCategoryData(activeMegaCat)
      : null;

  const megaProducts =
    activeMegaCat && activeMegaCat !== 'ALL'
      ? products.filter((p) => p.category === activeMegaCat).slice(0, 3)
      : [];

  return (
    <header
      ref={headerRef}
      onMouseLeave={() => setActiveMegaCat(null)}
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DCE6F2] shadow-xs"
    >
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#0B3B78] via-[#1D6FD8] to-[#0B3B78] text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="font-bold text-[#FFB800] bg-white/15 px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
            Super Saver
          </span>
          <span>
            Use code <strong className="text-[#FFB800]">KAVERI10</strong> for 10% off orders over ₹1,000 · Free delivery above ₹1,500!
          </span>
        </div>
      </div>

      {/* Top Bar: KubreeBazzar Logo, Live Search Bar, Account, Wishlist, Cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        <KubreeBazzarLogo onClick={() => handleNav('/')} />

        {/* Search Bar with Live Suggestions */}
        <div className="hidden md:block relative flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-[#1D6FD8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchText}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => window.setTimeout(() => setSearchFocused(false), 180)}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search Basmati rice, cold-pressed oil, honey, watches..."
              aria-label="Search products"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-xs text-[#132238] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D6FD8] focus:bg-white transition-colors"
            />
          </form>

          {searchFocused && liveSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 rounded-xl bg-white border border-[#DCE6F2] shadow-xl overflow-hidden z-50">
              {liveSuggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={() => handleNav(`/product/${item.slug}`)}
                  className="w-full px-4 py-2.5 text-left hover:bg-[#F0F6FF] flex items-center justify-between gap-3 border-b border-[#EEF4FB] last:border-none cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#132238] truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#64748B]">
                      {item.category} · {item.subcategory}
                    </p>
                  </div>
                  <span className="font-mono-tabular text-xs font-bold text-[#0B3B78] shrink-0">
                    ₹{getEffectivePrice(item).toLocaleString('en-IN')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Account, Wishlist, Shopping Cart */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav(user ? '/profile' : '/auth')}
            aria-label={user ? 'Account profile' : 'Sign in'}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-[#0B3B78] hover:text-[#FF6B1A] hover:bg-[#F0F6FF] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <UserIcon className="w-4 h-4" />
            <span className="hidden sm:inline">
              {user ? user.name.split(' ')[0] : 'Login'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('/wishlist')}
            aria-label="Wishlist"
            className="px-3 py-2 rounded-xl text-xs font-semibold text-[#0B3B78] hover:text-[#FF6B1A] hover:bg-[#F0F6FF] flex items-center gap-1.5 transition-colors relative whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#FF6B1A]" />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="font-mono-tabular text-[11px] font-bold text-[#4CAF50]">
                ({wishlist.length})
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Cart</span>
            <span className="font-mono-tabular">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[#0B3B78] hover:bg-[#F0F6FF] cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav
        aria-label="Primary navigation"
        className="hidden lg:block bg-[#F0F6FF] border-t border-[#DCE6F2]"
      >
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-6">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/');
              }}
              className={`whitespace-nowrap shrink-0 py-2.5 border-b-2 transition-colors ${
                route === '/'
                  ? 'text-[#0B3B78] border-[#FF6B1A]'
                  : 'text-[#334155] border-transparent hover:text-[#0B3B78]'
              }`}
            >
              Home
            </a>

            <a
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/shop');
              }}
              className={`whitespace-nowrap shrink-0 py-2.5 border-b-2 transition-colors ${
                route === '/shop'
                  ? 'text-[#0B3B78] border-[#FF6B1A]'
                  : 'text-[#334155] border-transparent hover:text-[#0B3B78]'
              }`}
            >
              Shop
            </a>

            <button
              type="button"
              onMouseEnter={() => setActiveMegaCat('ALL')}
              onClick={() =>
                setActiveMegaCat((prev) => (prev === 'ALL' ? null : 'ALL'))
              }
              aria-expanded={activeMegaCat === 'ALL'}
              className={`whitespace-nowrap shrink-0 py-2.5 border-b-2 flex items-center gap-1 transition-colors cursor-pointer ${
                activeMegaCat === 'ALL' || route === '/categories'
                  ? 'text-[#0B3B78] border-[#FF6B1A]'
                  : 'text-[#334155] border-transparent hover:text-[#0B3B78]'
              }`}
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-3.5 h-3.5 opacity-70 transition-transform ${
                  activeMegaCat === 'ALL' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {primaryCategories.map((cat) => {
              const active =
                route === cat.path || activeMegaCat === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onMouseEnter={() => setActiveMegaCat(cat.label)}
                  onClick={() => {
                    if (activeMegaCat === cat.label) {
                      handleNav(cat.path);
                    } else {
                      setActiveMegaCat(cat.label);
                    }
                  }}
                  aria-expanded={activeMegaCat === cat.label}
                  className={`whitespace-nowrap shrink-0 py-2.5 border-b-2 flex items-center gap-1 transition-colors cursor-pointer ${
                    active
                      ? 'text-[#0B3B78] border-[#FF6B1A]'
                      : 'text-[#334155] border-transparent hover:text-[#0B3B78]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 opacity-70 transition-transform ${
                      activeMegaCat === cat.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              );
            })}

            {secondaryLinks.map((item) => {
              const active = route === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.path);
                  }}
                  className={`whitespace-nowrap shrink-0 py-2.5 border-b-2 transition-colors ${
                    active
                      ? 'text-[#0B3B78] border-[#FF6B1A]'
                      : 'text-[#334155] border-transparent hover:text-[#0B3B78]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#475569]">
            <button
              type="button"
              onClick={() => handleNav('/orders')}
              className="hover:text-[#0B3B78] font-medium whitespace-nowrap cursor-pointer"
            >
              Track Order
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => handleNav('/shop')}
              className="text-[#FF6B1A] font-semibold hover:underline whitespace-nowrap cursor-pointer"
            >
              All 48 Products
            </button>
          </div>
        </div>
      </nav>

      {/* All Categories Mega-Dropdown */}
      {activeMegaCat === 'ALL' && (
        <div className="hidden lg:block border-t border-[#DCE6F2] bg-white shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-4 gap-6">
            {primaryCategories.map((cat) => {
              const data = getCategoryData(cat.label);
              return (
                <div
                  key={cat.label}
                  className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#DCE6F2] flex flex-col justify-between"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#4CAF50]">
                      {data.subtitle}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleNav(cat.path)}
                      className="font-display text-lg font-bold text-[#0B3B78] hover:text-[#FF6B1A] mt-0.5 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{cat.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="mt-2.5 space-y-1">
                      {data.subcategories.map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() =>
                            handleNav(
                              `/shop?category=${encodeURIComponent(
                                cat.label
                              )}&subcategory=${encodeURIComponent(sub)}`
                            )
                          }
                          className="block w-full text-left text-xs text-[#475569] hover:text-[#0B3B78] py-1 cursor-pointer"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNav(cat.path)}
                    className="mt-3 pt-2.5 border-t border-[#DCE6F2] text-xs font-bold text-[#FF6B1A] hover:underline text-left cursor-pointer"
                  >
                    Shop All {cat.label} →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Single Category Mega-Menu */}
      {megaCategoryObj && (
        <div className="hidden lg:block border-t border-[#DCE6F2] bg-white shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-8">
            <div className="col-span-4 space-y-3 border-r border-[#EEF4FB] pr-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#4CAF50]">
                {megaCategoryObj.subtitle}
              </p>
              <h3 className="font-display text-2xl font-bold text-[#0B3B78]">
                {megaCategoryObj.id} Collection
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                {megaCategoryObj.description}
              </p>
              <button
                type="button"
                onClick={() =>
                  handleNav(`/${megaCategoryObj.id.toLowerCase()}`)
                }
                className="mt-2 px-4 py-2 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore All {megaCategoryObj.id}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="col-span-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                Shop by Subcategory
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {megaCategoryObj.subcategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() =>
                      handleNav(
                        `/shop?category=${encodeURIComponent(
                          megaCategoryObj.id
                        )}&subcategory=${encodeURIComponent(sub)}`
                      )
                    }
                    className="text-left px-3 py-2 rounded-xl text-xs font-medium text-[#132238] hover:bg-[#F0F6FF] hover:text-[#0B3B78] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{sub}</span>
                    <ArrowRight className="w-3 h-3 opacity-50" />
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Featured in {megaCategoryObj.id}
              </p>
              <div className="space-y-2.5">
                {megaProducts.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleNav(`/product/${prod.slug}`)}
                    className="w-full p-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] hover:border-[#1D6FD8] text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#132238] truncate">
                        {prod.name}
                      </p>
                      <p className="text-[11px] text-[#64748B]">
                        {prod.subcategory}
                      </p>
                    </div>
                    <span className="font-mono-tabular text-xs font-bold text-[#0B3B78] shrink-0">
                      ₹{getEffectivePrice(prod).toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer with Expandable Category Dropdowns */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#DCE6F2] bg-white px-4 py-4 space-y-1.5 max-h-[82vh] overflow-y-auto">
          <div className="pb-2 mb-2 border-b border-[#DCE6F2]">
            <KubreeBazzarLogo size="sm" onClick={() => handleNav('/')} />
          </div>
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="w-4 h-4 text-[#1D6FD8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search Rice, Grocery, Honey, Watches..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-xs text-[#132238]"
            />
          </form>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/');
            }}
            className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-[#132238] hover:bg-[#F0F6FF] hover:text-[#0B3B78]"
          >
            Home
          </a>

          {primaryCategories.map((cat) => {
            const isExpanded = expandedMobileCat === cat.label;
            const data = getCategoryData(cat.label);
            return (
              <div
                key={cat.label}
                className="rounded-xl border border-transparent overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedMobileCat((prev) =>
                      prev === cat.label ? null : cat.label
                    )
                  }
                  className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-[#132238] hover:bg-[#F0F6FF] hover:text-[#0B3B78] flex items-center justify-between cursor-pointer"
                >
                  <span>{cat.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#1D6FD8] transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isExpanded && (
                  <div className="bg-[#F0F6FF] px-3 py-2 space-y-1 rounded-b-xl">
                    <button
                      type="button"
                      onClick={() => handleNav(cat.path)}
                      className="block w-full text-left px-2 py-1.5 text-xs font-bold text-[#FF6B1A] cursor-pointer"
                    >
                      View All {cat.label} →
                    </button>
                    {data.subcategories.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() =>
                          handleNav(
                            `/shop?category=${encodeURIComponent(
                              cat.label
                            )}&subcategory=${encodeURIComponent(sub)}`
                          )
                        }
                        className="block w-full text-left px-2 py-1.5 text-xs text-[#334155] hover:text-[#0B3B78] cursor-pointer"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {[
            { label: 'All Products', path: '/shop' },
            { label: 'About Us', path: '/about' },
            { label: 'Offers', path: '/offers' },
            { label: 'Contact', path: '/contact' },
            { label: 'Order Tracking', path: '/orders' },
            { label: 'Wishlist', path: '/wishlist' },
            { label: 'Admin Dashboard', path: '/admin' },
          ].map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                handleNav(item.path);
              }}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#132238] hover:bg-[#F0F6FF] hover:text-[#0B3B78]"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
