
import { useState, useMemo, useEffect } from 'react';
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMegaCat, setActiveMegaCat] =
    useState<ProductCategory | null>(null);
  const [mobileCategory, setMobileCategory] =
    useState<ProductCategory | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const primaryCategories: {
    label: ProductCategory;
    path: string;
  }[] = [
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

  const fallbackSubcategories: Partial<
    Record<ProductCategory, string[]>
  > = {
    Rice: [
      'Basmati Rice',
      'Ponni Rice',
      'Idli Rice',
      'Brown Rice',
    ],
    Grocery: [
      'Pulses & Dal',
      'Cooking Oil',
      'Spices',
      'Flour & Grains',
    ],
    Honey: [
      'Natural Honey',
      'Honey Combos',
    ],
    Watches: [
      "Men's Watches",
      "Women's Watches",
      'Analog Watches',
      'Digital Watches',
    ],
  };

  const getCategory = (id: ProductCategory | null) => {
    if (!id) return null;

    const category = categories.find(
      (c) => c.id.toLowerCase() === id.toLowerCase()
    );

    return {
      id,
      subtitle: category?.subtitle || 'Explore the collection',
      description:
        category?.description ||
        `Browse our ${id.toLowerCase()} collection.`,
      subcategories:
        category?.subcategories?.length
          ? category.subcategories
          : fallbackSubcategories[id] || [],
    };
  };

  const megaCategoryObj = getCategory(activeMegaCat);

  const megaProducts = products
    .filter(
      (p) =>
        p.category.toLowerCase() ===
        activeMegaCat?.toLowerCase()
    )
    .slice(0, 3);

  const liveSuggestions = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    if (!q) return [];

    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchText, products]);

  const handleNav = (path: string) => {
    setMobileOpen(false);
    setMobileCategory(null);
    setActiveMegaCat(null);
    setSearchFocused(false);
    navigate(path);
  };

  const handleSearchSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!searchText.trim()) return;

    handleNav(
      `/search?q=${encodeURIComponent(searchText.trim())}`
    );
  };

  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMegaCat(null);
        setMobileOpen(false);
        setMobileCategory(null);
        setSearchFocused(false);
      }
    };

    document.addEventListener('keydown', closeOnEscape);

    return () =>
      document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const navButton = (label: string, path: string) => (
    <a
      key={path}
      href={path}
      onClick={(e) => {
        e.preventDefault();
        handleNav(path);
      }}
      className={`whitespace-nowrap py-2.5 border-b-2 transition-colors ${
        route === path
          ? 'text-[#0B3B78] border-[#FF6B1A]'
          : 'text-[#334155] border-transparent hover:text-[#0B3B78]'
      }`}
    >
      {label}
    </a>
  );

  return (
    <header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DCE6F2] shadow-sm"
      onMouseLeave={() => setActiveMegaCat(null)}
    >
      {/* TOP HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-16 flex items-center justify-between gap-4">
        <KubreeBazzarLogo onClick={() => handleNav('/')} />

        {/* DESKTOP SEARCH */}
        <div className="hidden md:block relative flex-1 max-w-md mx-4">
          <form
            onSubmit={handleSearchSubmit}
            className="relative"
          >
            <Search className="w-4 h-4 text-[#1D6FD8] absolute left-3.5 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() =>
                window.setTimeout(
                  () => setSearchFocused(false),
                  180
                )
              }
              placeholder="Search Rice, Grocery, Honey, Watches..."
              aria-label="Search products"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-xs text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
            />
          </form>

          {searchFocused && liveSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-[#DCE6F2] rounded-xl shadow-xl z-50 overflow-hidden">
              {liveSuggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    handleNav(`/product/${item.slug}`)
                  }
                  className="w-full px-4 py-3 text-left hover:bg-[#F0F6FF] flex justify-between items-center gap-3 border-b last:border-0"
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold truncate">
                      {item.name}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {item.category}
                    </span>
                  </span>

                  <span className="text-xs font-bold text-[#0B3B78] whitespace-nowrap">
                    ₹{getEffectivePrice(item).toLocaleString('en-IN')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ACCOUNT AND CART */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() =>
              handleNav(user ? '/profile' : '/auth')
            }
            className="p-2 text-[#0B3B78] hover:text-[#FF6B1A] flex items-center gap-1"
            aria-label="Account"
          >
            <UserIcon className="w-5 h-5" />
            <span className="hidden sm:inline text-xs">
              {user ? user.name.split(' ')[0] : 'Login'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('/wishlist')}
            className="p-2 text-[#0B3B78] hover:text-[#FF6B1A] flex items-center gap-1"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            <span className="hidden sm:inline text-xs">
              Wishlist
            </span>
            {wishlist.length > 0 && (
              <span className="text-xs">
                ({wishlist.length})
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className="bg-[#FF6B1A] hover:bg-[#E5580D] text-white px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold"
          >
            <ShoppingBag className="w-4 h-4" />
            Cart ({cartCount})
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileOpen((prev) => !prev);
              setActiveMegaCat(null);
            }}
            className="lg:hidden p-2 text-[#0B3B78]"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <nav className="hidden lg:block bg-[#F0F6FF] border-t border-[#DCE6F2]">
        <div className="max-w-7xl mx-auto px-6 min-h-11 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-7">
            {navButton('Home', '/')}

            {primaryCategories.map((cat) => {
              const expanded =
                activeMegaCat === cat.label;

              return (
                <button
                  key={cat.label}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={expanded}
                  onMouseEnter={() =>
                    setActiveMegaCat(cat.label)
                  }
                  onClick={() =>
                    setActiveMegaCat((current) =>
                      current === cat.label
                        ? null
                        : cat.label
                    )
                  }
                  className={`py-2.5 border-b-2 flex items-center gap-1 transition-colors ${
                    expanded || route === cat.path
                      ? 'text-[#0B3B78] border-[#FF6B1A]'
                      : 'text-[#334155] border-transparent hover:text-[#0B3B78]'
                  }`}
                >
                  {cat.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      expanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              );
            })}

            {secondaryLinks.map((item) =>
              navButton(item.label, item.path)
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleNav('/orders')}
              className="text-[#475569] hover:text-[#0B3B78]"
            >
              Track Order
            </button>

            <button
              type="button"
              onClick={() => handleNav('/shop')}
              className="text-[#FF6B1A] font-bold"
            >
              All Products
            </button>
          </div>
        </div>
      </nav>

      {/* DESKTOP MEGA DROPDOWN */}
      {activeMegaCat && megaCategoryObj && (
        <div
          className="hidden lg:block absolute left-0 right-0 top-full bg-white border-t border-[#DCE6F2] shadow-2xl z-50"
          onMouseEnter={() =>
            setActiveMegaCat(activeMegaCat)
          }
        >
          <div className="max-w-7xl mx-auto px-6 py-7 grid grid-cols-12 gap-8">
            {/* CATEGORY INFO */}
            <div className="col-span-4 border-r border-[#EEF4FB] pr-6 space-y-3">
              <p className="text-xs uppercase font-bold text-[#4CAF50]">
                {megaCategoryObj.subtitle}
              </p>

              <h3 className="text-2xl font-bold text-[#0B3B78]">
                {megaCategoryObj.id} Collection
              </h3>

              <p className="text-sm text-[#475569]">
                {megaCategoryObj.description}
              </p>

              <button
                type="button"
                onClick={() =>
                  handleNav(
                    `/${megaCategoryObj.id.toLowerCase()}`
                  )
                }
                className="bg-[#FF6B1A] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold hover:bg-[#E5580D]"
              >
                Explore All {megaCategoryObj.id}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* SUBCATEGORIES */}
            <div className="col-span-4">
              <h4 className="text-sm font-bold text-[#0B3B78] mb-4">
                Shop by Subcategory
              </h4>

              <div className="space-y-1">
                {megaCategoryObj.subcategories.map(
                  (sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() =>
                        handleNav(
                          `/shop?category=${encodeURIComponent(
                            megaCategoryObj.id
                          )}&subcategory=${encodeURIComponent(
                            sub
                          )}`
                        )
                      }
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-[#132238] hover:bg-[#F0F6FF] flex items-center justify-between"
                    >
                      {sub}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )
                )}
              </div>
            </div>

            {/* FEATURED PRODUCTS */}
            <div className="col-span-4">
              <h4 className="text-sm font-bold text-[#0B3B78] mb-4">
                Featured in {megaCategoryObj.id}
              </h4>

              <div className="space-y-3">
                {megaProducts.length > 0 ? (
                  megaProducts.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() =>
                        handleNav(`/product/${prod.slug}`)
                      }
                      className="w-full text-left bg-[#F8FAFC] border border-[#DCE6F2] hover:border-[#1D6FD8] rounded-xl p-3 flex items-center justify-between gap-2"
                    >
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold truncate">
                          {prod.name}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {prod.subcategory}
                        </span>
                      </span>

                      <span className="text-xs font-bold text-[#0B3B78] whitespace-nowrap">
                        ₹{getEffectivePrice(prod).toLocaleString(
                          'en-IN'
                        )}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">
                    Explore our latest collection.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#DCE6F2] bg-white px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="mb-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-[#1D6FD8]" />
              <input
                type="text"
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-sm"
              />
            </div>
          </form>

          {navButton('Home', '/')}

          {/* MOBILE CATEGORY ACCORDION */}
          {primaryCategories.map((cat) => {
            const expanded =
              mobileCategory === cat.label;
            const details = getCategory(cat.label);

            return (
              <div
                key={cat.label}
                className="border-b border-[#EEF4FB]"
              >
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleNav(cat.path)}
                    className="flex-1 text-left px-3 py-3 text-sm font-semibold text-[#0B3B78]"
                  >
                    {cat.label}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setMobileCategory(
                        expanded ? null : cat.label
                      )
                    }
                    aria-expanded={expanded}
                    aria-label={`Toggle ${cat.label} submenu`}
                    className="p-3 text-[#0B3B78]"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>

                {expanded && (
                  <div className="pl-5 pb-3 bg-[#F8FAFC]">
                    <button
                      type="button"
                      onClick={() => handleNav(cat.path)}
                      className="block w-full text-left px-3 py-2 text-sm font-bold text-[#FF6B1A]"
                    >
                      View All {cat.label}
                    </button>

                    {details?.subcategories.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() =>
                          handleNav(
                            `/shop?category=${encodeURIComponent(
                              cat.label
                            )}&subcategory=${encodeURIComponent(
                              sub
                            )}`
                          )
                        }
                        className="block w-full text-left px-3 py-2 text-sm text-[#475569] hover:bg-[#F0F6FF]"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {navButton('All Products', '/shop')}

          {secondaryLinks.map((item) =>
            navButton(item.label, item.path)
          )}

          {navButton('Track Order', '/orders')}
          {navButton('Wishlist', '/wishlist')}
          {navButton('Admin Dashboard', '/admin')}
        </div>
      )}
    </header>
  );
}
