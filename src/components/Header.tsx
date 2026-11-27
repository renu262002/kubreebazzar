import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Heart,
  ChevronDown,
  ChevronRight,
  Tag,
  ArrowRight,
  Loader2,
  LogOut,
  Package,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { KubreeBazzarLogo } from './KubreeBazzarLogo';
import { ResilientImage } from './ResilientImage';
import { resolveCategoryFallbackImage } from '../three/resolveProductGlb';
import {
  buildCategoryTree,
  getCategoryDisplayName,
  getSubcategoryDisplayName,
  type MainCategoryNode,
} from '../data/categoryHierarchy';
import {
  searchProducts,
  searchMatchingCategories,
  searchMensFashionCollections,
  searchWomensFashionCollections,
  searchElectronicsCollections,
  searchDriedFruitsCollections,
  searchNutsCollections,
  searchSkinCareCollections,
  searchHairCareCollections,
  searchFurnitureCollections,
  searchDriedPeasCollections,
  searchPranksNoveltiesCollections,
  searchFitnessGymCollections,
  searchAccessoriesCollections,
  searchSportsCollections,
  searchFootwearCollections,
  searchTeenagersCollections,
  searchKidsCollections,
  type CategorySearchHit,
  type MensFashionCollectionSearchHit,
} from '../utils/catalogSearch';
import type { Product } from '../types';
import { isAdminRole } from '../utils/adminAuth';
import { apiFetch } from '../utils/apiClient';

const MORE_CATEGORY_ORDER = [
  'Temple',
  'Dry Nuts',
  'Dry Fruits',
  'Hair Care',
  'Skin Care',
  'Furniture',
  'Prank Items',
  'Dry Peas',
  'Gym',
  'Sports',
  'Accessories',
  'Footwear',
];

const TOP_BAR_DIRECT_CATEGORIES = new Set([
  'Groceries',
  'Fashion',
  'Kids',
  'Teenager',
  'Baby Kit',
  'School Kit',
  'Used Bikes and Cars',
  'Electronics',
]);

type OpenDesktopMenu = 'groceries' | 'fashion' | 'more' | null;

export function Header() {
  const {
    route,
    navigate,
    cartCount,
    setCartDrawerOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    user,
    wishlist,
    openAuthModal,
    logout,
    categories,
    products,
    mensFashionCollections,
    womensFashionCollections,
    electronicsCollections,
    driedFruitsCollections,
    nutsCollections,
    skinCareCollections,
    hairCareCollections,
    furnitureCollections,
    driedPeasCollections,
    pranksNoveltiesCollections,
    fitnessGymCollections,
    accessoriesCollections,
    sportsCollections,
    footwearCollections,
    teenagersCollections,
    kidsCollections,
  } = useStore();

  const headerRef = useRef<HTMLElement | null>(null);
  const desktopSearchRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const searchSeqRef = useRef(0);

  const [openDesktopMenu, setOpenDesktopMenu] = useState<OpenDesktopMenu>(null);
  const [hoveredSubId, setHoveredSubId] = useState<string | null>(null);

  // Mobile tap-to-expand states
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [expandedMobileSub, setExpandedMobileSub] = useState<string | null>(null);

  const [searchText, setSearchText] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/search') {
      return new URLSearchParams(window.location.search).get('q') || '';
    }
    return '';
  });
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [apiSearchPayload, setApiSearchPayload] = useState<{
    query: string;
    products: Product[];
    categories: CategorySearchHit[];
    collections: MensFashionCollectionSearchHit[];
  } | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchFocused, setMobileSearchFocused] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1);

  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories]
  );

  const groceriesNode: MainCategoryNode | undefined = useMemo(
    () => categoryTree.find((c) => c.id.toLowerCase() === 'groceries'),
    [categoryTree]
  );

  const fashionNode: MainCategoryNode | undefined = useMemo(
    () => categoryTree.find((c) => c.id.toLowerCase() === 'fashion'),
    [categoryTree]
  );

  const moreCategories: MainCategoryNode[] = useMemo(() => {
    const remaining = categoryTree.filter(
      (c) => !TOP_BAR_DIRECT_CATEGORIES.has(c.id)
    );
    return [...remaining].sort((a, b) => {
      const idxA = MORE_CATEGORY_ORDER.indexOf(a.id);
      const idxB = MORE_CATEGORY_ORDER.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.displayOrder - b.displayOrder;
    });
  }, [categoryTree]);

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = (menu: Exclude<OpenDesktopMenu, null>) => {
    clearCloseTimer();
    setOpenDesktopMenu((prev) => {
      if (prev !== menu) {
        setHoveredSubId(null);
      }
      return menu;
    });
  };

  const scheduleCloseMenu = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setOpenDesktopMenu(null);
      setHoveredSubId(null);
      closeTimerRef.current = null;
    }, 150);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  // Sync Header search bar when landing on or navigating to /search?q=...
  useEffect(() => {
    const clean = route.split('?')[0];
    if (clean === '/search') {
      const qs = route.includes('?') ? route.split('?')[1] : window.location.search.replace(/^\?/, '');
      const urlQ = new URLSearchParams(qs).get('q') || '';
      setSearchText(urlQ);
      setDebouncedSearch(urlQ);
    }
  }, [route]);

  // Close menus & search dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setOpenDesktopMenu(null);
        setHoveredSubId(null);
      }
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(target)) {
        setSearchFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(target)) {
        setMobileSearchFocused(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDesktopMenu(null);
        setHoveredSubId(null);
        setMobileMenuOpen(false);
        setSearchFocused(false);
        setMobileSearchFocused(false);
        setActiveSuggestionIdx(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [setMobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  // Debounce search input (~250ms) and query /api/search with stale-response cancellation
  useEffect(() => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      setDebouncedSearch('');
      setApiSearchPayload(null);
      setIsSearchingApi(false);
      setActiveSuggestionIdx(-1);
      return;
    }

    const seq = ++searchSeqRef.current;
    const controller = new AbortController();
    setIsSearchingApi(true);

    const timer = window.setTimeout(async () => {
      setDebouncedSearch(trimmed);
      setActiveSuggestionIdx(-1);
      try {
        const res = await apiFetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&limit=6`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('Search request failed');
        const data = await res.json();
        if (searchSeqRef.current === seq) {
          setApiSearchPayload({
            query: trimmed,
            products: Array.isArray(data.products) ? data.products : [],
            categories: Array.isArray(data.categories) ? data.categories : [],
            collections: Array.isArray(data.collections)
              ? data.collections
              : [],
          });
        }
      } catch {
        // Silent fallback to instant local catalog search when offline or aborted
      } finally {
        if (searchSeqRef.current === seq) {
          setIsSearchingApi(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchText]);

  const localSuggestionData = useMemo(() => {
    const q = debouncedSearch.trim();
    if (!q) {
      return {
        products: [] as Product[],
        categories: [] as CategorySearchHit[],
        collections: [] as MensFashionCollectionSearchHit[],
      };
    }
    const matchedProducts = searchProducts(products, categories, q)
      .slice(0, 6)
      .map((r) => r.product);
    const matchedCategories = searchMatchingCategories(
      categories,
      products,
      q
    ).slice(0, 3);
    const matchedCollections = [
      ...searchKidsCollections(q, kidsCollections),
      ...searchTeenagersCollections(q, teenagersCollections),
      ...searchFootwearCollections(q, footwearCollections),
      ...searchSportsCollections(q, sportsCollections),
      ...searchAccessoriesCollections(q, accessoriesCollections),
      ...searchFitnessGymCollections(q, fitnessGymCollections),
      ...searchPranksNoveltiesCollections(q, pranksNoveltiesCollections),
      ...searchDriedPeasCollections(q, driedPeasCollections),
      ...searchFurnitureCollections(q, furnitureCollections),
      ...searchHairCareCollections(q, hairCareCollections),
      ...searchSkinCareCollections(q, skinCareCollections),
      ...searchNutsCollections(q, nutsCollections),
      ...searchDriedFruitsCollections(q, driedFruitsCollections),
      ...searchElectronicsCollections(q, electronicsCollections),
      ...searchWomensFashionCollections(q, womensFashionCollections),
      ...searchMensFashionCollections(q, mensFashionCollections),
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    return {
      products: matchedProducts,
      categories: matchedCategories,
      collections: matchedCollections,
    };
  }, [
    debouncedSearch,
    products,
    categories,
    kidsCollections,
    teenagersCollections,
    footwearCollections,
    sportsCollections,
    accessoriesCollections,
    fitnessGymCollections,
    pranksNoveltiesCollections,
    driedPeasCollections,
    furnitureCollections,
    hairCareCollections,
    skinCareCollections,
    nutsCollections,
    driedFruitsCollections,
    electronicsCollections,
    mensFashionCollections,
    womensFashionCollections,
  ]);

  const suggestionCategories = useMemo(() => {
    const trimmed = searchText.trim();
    if (!trimmed) return [];
    if (
      apiSearchPayload &&
      apiSearchPayload.query.toLowerCase() === trimmed.toLowerCase() &&
      apiSearchPayload.categories.length >= localSuggestionData.categories.length
    ) {
      return apiSearchPayload.categories.slice(0, 3);
    }
    return localSuggestionData.categories;
  }, [searchText, apiSearchPayload, localSuggestionData.categories]);

  const suggestionCollections = useMemo(() => {
    const trimmed = searchText.trim();
    if (!trimmed) return [];
    if (
      apiSearchPayload &&
      apiSearchPayload.query.toLowerCase() === trimmed.toLowerCase() &&
      apiSearchPayload.collections.length >=
        localSuggestionData.collections.length
    ) {
      return apiSearchPayload.collections.slice(0, 5);
    }
    return localSuggestionData.collections;
  }, [searchText, apiSearchPayload, localSuggestionData.collections]);

  const liveSuggestions = useMemo(() => {
    const trimmed = searchText.trim();
    if (!trimmed) return [];
    if (
      apiSearchPayload &&
      apiSearchPayload.query.toLowerCase() === trimmed.toLowerCase() &&
      apiSearchPayload.products.length > 0
    ) {
      return apiSearchPayload.products.slice(0, 6);
    }
    return localSuggestionData.products;
  }, [searchText, apiSearchPayload, localSuggestionData.products]);

  const navigableSuggestions = useMemo(() => {
    const items: Array<{ key: string; path: string }> = [];
    suggestionCategories.forEach((cat) => {
      items.push({ key: `cat-${cat.id}`, path: cat.path });
    });
    suggestionCollections.forEach((col) => {
      items.push({ key: `col-${col.id}`, path: col.path });
    });
    liveSuggestions.forEach((prod) => {
      items.push({ key: `prod-${prod.id}`, path: `/product/${prod.slug}` });
    });
    if (searchText.trim()) {
      items.push({
        key: 'all-results',
        path: `/search?q=${encodeURIComponent(searchText.trim())}`,
      });
    }
    return items;
  }, [
    suggestionCategories,
    suggestionCollections,
    liveSuggestions,
    searchText,
  ]);

  const handleNav = (path: string) => {
    clearCloseTimer();
    setMobileMenuOpen(false);
    setOpenDesktopMenu(null);
    setHoveredSubId(null);
    setSearchFocused(false);
    setMobileSearchFocused(false);
    setActiveSuggestionIdx(-1);
    navigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      activeSuggestionIdx >= 0 &&
      navigableSuggestions[activeSuggestionIdx]
    ) {
      handleNav(navigableSuggestions[activeSuggestionIdx].path);
      return;
    }
    const q = searchText.trim();
    if (!q) {
      handleNav('/search');
      return;
    }
    handleNav(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchFocused(false);
      setMobileSearchFocused(false);
      setActiveSuggestionIdx(-1);
      return;
    }
    if (navigableSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIdx((prev) =>
        prev < navigableSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIdx((prev) =>
        prev > 0 ? prev - 1 : navigableSuggestions.length - 1
      );
    }
  };

  const directCategoryLinks = [
    { label: 'Kids', path: '/kids', aliases: ['/kids'] },
    { label: 'Teenagers', path: '/teenagers', aliases: ['/teenagers', '/teenager'] },
    {
      label: 'Baby Kit',
      path: '/baby-kit',
      aliases: ['/baby-kit', '/baby-care', '/baby', '/category/baby-kit'],
    },
    {
      label: 'School Kit',
      path: '/school-kit',
      aliases: ['/school-kit', '/school', '/school-supplies', '/category/school-kit'],
    },
    {
      label: 'Used Bikes & Cars',
      path: '/used-bikes-and-cars',
      aliases: [
        '/used-bikes-and-cars',
        '/used-bikes',
        '/used-cars',
        '/category/used-bikes-and-cars',
      ],
    },
    { label: 'Electronics', path: '/electronics', aliases: ['/electronics'] },
  ];

  const mobileDirectCategoryLinks = [
    { label: 'Kids', path: '/kids' },
    { label: 'Teenagers', path: '/teenagers' },
    { label: 'Baby Kit', path: '/baby-kit' },
    { label: 'Temple & Pooja Essentials', path: '/temple-pooja-essentials' },
    { label: 'School Kit', path: '/school-kit' },
    { label: 'Used Bikes & Cars', path: '/used-bikes-and-cars' },
    { label: 'Electronics', path: '/electronics' },
  ];

  const mobileMoreCategories = useMemo(
    () =>
      moreCategories.filter(
        (c) =>
          c.id !== 'Temple' &&
          c.id !== 'School Kit' &&
          c.id !== 'Used Bikes and Cars'
      ),
    [moreCategories]
  );

  const isMoreActive = moreCategories.some(
    (c) => route === c.path || route.startsWith(c.path + '/')
  );

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DCE6F2] shadow-xs"
    >
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#0B3B78] via-[#1D6FD8] to-[#0B3B78] text-white text-[10px] sm:text-xs py-1 sm:py-1.5 px-2.5 sm:px-4 text-center font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2">
          <span className="hidden sm:inline font-bold text-[#FFB800] bg-white/15 px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px] shrink-0">
            Super Saver
          </span>
          <span className="truncate sm:whitespace-normal">
            <span className="hidden sm:inline">Explore 20 Main Categories · </span>
            Use code <strong className="text-[#FFB800]">KAVERI10</strong> for 10% off ₹1,000+ · Free delivery ₹1,500+
          </span>
        </div>
      </div>

      {/* Top Bar Row 1: KubreeBazzar Logo, Desktop Search Bar, Account, Wishlist, Cart, Mobile Hamburger */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-13 sm:h-18 flex items-center justify-between gap-1.5 sm:gap-4">
        <div className="sm:hidden shrink-0">
          <KubreeBazzarLogo size="sm" onClick={() => handleNav('/')} />
        </div>
        <div className="hidden sm:block shrink-0">
          <KubreeBazzarLogo size="md" onClick={() => handleNav('/')} />
        </div>

        {/* Desktop Search Bar with Live Suggestions */}
        <div
          ref={desktopSearchRef}
          className="hidden md:block relative flex-1 max-w-md mx-4"
        >
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-[#1D6FD8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchText}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setSearchText(e.target.value);
                setSearchFocused(true);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search across all 20 categories (Groceries, Fashion, Used Bikes & Cars, Kids...)"
              aria-label="Search products"
              aria-autocomplete="list"
              aria-expanded={searchFocused && searchText.trim().length > 0}
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-xs text-[#132238] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D6FD8] focus:bg-white transition-colors"
            />
            {searchText.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearchText('');
                  setDebouncedSearch('');
                  setApiSearchPayload(null);
                  setActiveSuggestionIdx(-1);
                }}
                aria-label="Clear search query"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-[#64748B] hover:text-[#0B3B78] hover:bg-[#DCE6F2]/50 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {searchFocused && searchText.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 rounded-xl bg-white border border-[#DCE6F2] shadow-xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
              {isSearchingApi &&
                debouncedSearch.trim() !== searchText.trim() && (
                  <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#EEF4FB] flex items-center gap-2 text-[11px] text-[#64748B]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1D6FD8]" />
                    <span>Searching KubreeBazzar catalog...</span>
                  </div>
                )}

              {suggestionCategories.length > 0 && (
                <div className="border-b border-[#EEF4FB]">
                  <p className="px-4 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Categories
                  </p>
                  {suggestionCategories.map((cat, idx) => {
                    const isActive = activeSuggestionIdx === idx;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleNav(cat.path)}
                        className={`w-full px-4 py-2 text-left flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-[#FFF4EC] text-[#FF6B1A]'
                            : 'hover:bg-[#F0F6FF] text-[#0B3B78]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Tag className="w-3.5 h-3.5 text-[#FF6B1A] shrink-0" />
                          <span className="text-xs font-semibold truncate">
                            {cat.parentName
                              ? `${cat.parentName} › ${cat.name}`
                              : cat.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#64748B] shrink-0">
                          {cat.itemCount} items
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {suggestionCollections.length > 0 && (
                <div className="border-b border-[#EEF4FB]">
                  <p className="px-4 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    {suggestionCollections.every(
                      (c) =>
                        c.sectionLabel === "Men's Fashion" ||
                        c.sectionLabel === "Women's Fashion"
                    )
                      ? 'Fashion Collections'
                      : 'Collections & Varieties'}
                  </p>
                  {suggestionCollections.map((col, idx) => {
                    const navIdx = suggestionCategories.length + idx;
                    const isActive = activeSuggestionIdx === navIdx;
                    const deptLabel =
                      col.sectionLabel === "Women's Fashion"
                        ? col.parentCategory && col.parentCategory !== "Women's Fashion"
                          ? `Women's Fashion · ${col.parentCategory}`
                          : "Women's Fashion"
                        : col.sectionLabel || `Men's Fashion · ${col.parentCategory}`;
                    const isSquareThumb =
                      col.sectionLabel === 'Electronics' ||
                      col.sectionLabel === 'Dried Fruits' ||
                      col.sectionLabel === 'Nuts' ||
                      col.sectionLabel === 'Skin Care' ||
                      col.sectionLabel === 'Hair Care' ||
                      col.sectionLabel === 'Furniture' ||
                      col.sectionLabel === 'Dried Peas' ||
                      col.sectionLabel === 'Pranks & Novelties' ||
                      col.sectionLabel === 'Fitness & Gym' ||
                      col.sectionLabel === 'Accessories' ||
                      col.sectionLabel === 'Sports' ||
                      col.sectionLabel === 'Footwear' ||
                      col.sectionLabel === 'Teenagers' ||
                      col.sectionLabel === 'Kids';
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => handleNav(col.path)}
                        className={`w-full px-4 py-2 text-left flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-[#FFF4EC] text-[#FF6B1A]'
                            : 'hover:bg-[#F0F6FF] text-[#0B3B78]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {col.image ? (
                            <img
                              src={encodeURI(col.image)}
                              alt={col.name}
                              className={`${isSquareThumb ? 'w-9 h-9' : 'w-8 h-10'} rounded-md object-contain bg-[#F8FAFC] border border-[#DCE6F2] shrink-0`}
                            />
                          ) : (
                            <div className={`${isSquareThumb ? 'w-9 h-9' : 'w-8 h-10'} rounded-md bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center shrink-0`}>
                              <Tag className="w-3.5 h-3.5 text-[#B45309]" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">
                              {col.name}
                            </p>
                            <p className="text-[11px] text-[#64748B] truncate">
                              {deptLabel}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-[#FF6B1A] shrink-0">
                          Collection
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {liveSuggestions.length > 0 && (
                <div>
                  <p className="px-4 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Products
                  </p>
                  {liveSuggestions.map((item, idx) => {
                    const navIdx =
                      suggestionCategories.length +
                      suggestionCollections.length +
                      idx;
                    const isActive = activeSuggestionIdx === navIdx;
                    const displayCat = getCategoryDisplayName(
                      item.category,
                      categories
                    );
                    const displaySub = getSubcategoryDisplayName(
                      item.subcategory
                    );
                    const price = getEffectivePrice(item);
                    const isUsedVehicle =
                      item.category.toLowerCase().includes('used') ||
                      item.category.toLowerCase().includes('bike');
                    const fallbackImg = isUsedVehicle
                      ? undefined
                      : resolveCategoryFallbackImage(item.category);
                    const imgSrc = item.images?.[0] || fallbackImg;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNav(`/product/${item.slug}`)}
                        className={`w-full px-4 py-2 text-left flex items-center justify-between gap-3 border-b border-[#EEF4FB] last:border-none cursor-pointer transition-colors ${
                          isActive ? 'bg-[#FFF4EC]' : 'hover:bg-[#FFF4EC]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-[#F0F6FF] border border-[#DCE6F2] overflow-hidden shrink-0">
                            <ResilientImage
                              src={imgSrc}
                              fallbackSrc={fallbackImg}
                              emptyLabel={
                                isUsedVehicle ? 'Photo Pending' : undefined
                              }
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#132238] truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-[#64748B] truncate">
                              {displayCat}
                              {displaySub ? ` · ${displaySub}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono-tabular text-xs font-bold text-[#0B3B78] shrink-0">
                          {price > 0
                            ? `₹${price.toLocaleString('en-IN')}`
                            : item.stock > 0
                              ? 'Configure'
                              : 'View'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {suggestionCategories.length === 0 &&
                suggestionCollections.length === 0 &&
                liveSuggestions.length === 0 &&
                !isSearchingApi && (
                  <div className="px-4 py-4 text-center space-y-1">
                    <p className="text-xs font-semibold text-[#0B3B78]">
                      No matching products found for “{searchText.trim()}”
                    </p>
                    <p className="text-[11px] text-[#64748B]">
                      Try searching by category (Rice, Baby Kit, Electronics, Formal Shirts).
                    </p>
                  </div>
                )}

              <button
                type="button"
                onClick={() =>
                  handleNav(
                    `/search?q=${encodeURIComponent(searchText.trim())}`
                  )
                }
                className={`w-full px-4 py-2.5 text-center text-xs font-bold text-[#1D6FD8] border-t border-[#DCE6F2] flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  activeSuggestionIdx ===
                  suggestionCategories.length +
                    suggestionCollections.length +
                    liveSuggestions.length
                    ? 'bg-[#EAF2FC]'
                    : 'bg-[#F8FAFC] hover:bg-[#EAF2FC]'
                }`}
              >
                <span>See all results for “{searchText.trim()}”</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Account, My Orders, Wishlist, Logout, Shopping Cart & Hamburger */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 xl:gap-2 shrink-0">
          {!user ? (
            <button
              type="button"
              onClick={() => {
                setOpenDesktopMenu(null);
                setMobileMenuOpen(false);
                openAuthModal({ tab: 'login' });
              }}
              aria-label="Login or Sign Up"
              className="min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 px-2 sm:px-3 py-2 rounded-xl text-xs font-semibold text-[#0B3B78] hover:text-[#FF6B1A] hover:bg-[#F0F6FF] flex items-center justify-center sm:justify-start gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserIcon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Login</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleNav('/profile')}
                aria-label="Account profile"
                title={`Account (${user.name})`}
                className="min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 px-2 sm:px-2.5 py-2 rounded-xl text-xs font-semibold text-[#0B3B78] hover:text-[#FF6B1A] hover:bg-[#F0F6FF] flex items-center justify-center sm:justify-start gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <UserIcon className="w-4 h-4 shrink-0 text-[#1D6FD8]" />
                <span className="hidden sm:inline">Account</span>
              </button>

              <button
                type="button"
                onClick={() => handleNav('/orders')}
                aria-label="My Orders"
                className="hidden lg:flex px-2.5 py-2 rounded-xl text-xs font-semibold text-[#0B3B78] hover:text-[#FF6B1A] hover:bg-[#F0F6FF] items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Package className="w-4 h-4 shrink-0 text-[#1D6FD8]" />
                <span>My Orders</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => handleNav('/wishlist')}
            aria-label="Wishlist"
            className="min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 px-2 sm:px-2.5 py-2 rounded-xl text-xs font-semibold text-[#0B3B78] hover:text-[#FF6B1A] hover:bg-[#F0F6FF] flex items-center justify-center sm:justify-start gap-1.5 transition-colors relative whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#FF6B1A] shrink-0" />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlist.length > 0 && (
              <>
                <span className="sm:hidden absolute top-1 right-1 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#4CAF50] text-white font-mono-tabular text-[9px] font-bold flex items-center justify-center leading-none">
                  {wishlist.length}
                </span>
                <span className="hidden sm:inline font-mono-tabular text-[11px] font-bold text-[#4CAF50]">
                  ({wishlist.length})
                </span>
              </>
            )}
          </button>

          {user && (
            <button
              type="button"
              onClick={() => void logout()}
              aria-label="Logout"
              className="hidden sm:flex px-2.5 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-rose-700 hover:bg-rose-50 items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Logout</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            aria-label={`Shopping cart with ${cartCount} items`}
            className="min-h-[40px] sm:min-h-0 px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-xs font-bold flex items-center gap-1 sm:gap-2 transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-white shrink-0" />
            <span className="hidden min-[380px]:inline">Cart</span>
            <span className="font-mono-tabular">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden min-w-[42px] min-h-[42px] w-10.5 h-10.5 rounded-xl flex items-center justify-center text-[#0B3B78] hover:bg-[#F0F6FF] cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Top Bar Row 2 (Mobile & Compact Tablet): Full-width Product Search */}
      <div
        ref={mobileSearchRef}
        className="md:hidden border-t border-[#EEF4FB] bg-white/95 px-2.5 sm:px-4 py-1.5 relative"
      >
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#1D6FD8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="mobile-header-search"
            type="search"
            value={searchText}
            onFocus={() => setMobileSearchFocused(true)}
            onChange={(e) => {
              setSearchText(e.target.value);
              setMobileSearchFocused(true);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search Rice, Baby Kit, Temple, School, Fashion..."
            aria-label="Search products on mobile"
            aria-autocomplete="list"
            aria-expanded={mobileSearchFocused && searchText.trim().length > 0}
            className="w-full pl-9 pr-9 py-1.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-xs text-[#132238] placeholder:text-xs placeholder:text-[#64748B] focus:outline-none focus:border-[#1D6FD8] focus:bg-white transition-colors"
          />
          {searchText.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearchText('');
                setDebouncedSearch('');
                setApiSearchPayload(null);
                setActiveSuggestionIdx(-1);
              }}
              aria-label="Clear search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#0B3B78] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {mobileSearchFocused && searchText.trim().length > 0 && (
          <div className="absolute left-2.5 right-2.5 top-full mt-1 rounded-xl bg-white border border-[#DCE6F2] shadow-xl overflow-hidden z-50 max-h-[65dvh] overflow-y-auto">
            {isSearchingApi && debouncedSearch.trim() !== searchText.trim() && (
              <div className="px-3.5 py-2 bg-[#F8FAFC] border-b border-[#EEF4FB] flex items-center gap-2 text-[11px] text-[#64748B]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1D6FD8]" />
                <span>Searching...</span>
              </div>
            )}

            {suggestionCategories.length > 0 && (
              <div className="border-b border-[#EEF4FB]">
                <p className="px-3.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Categories
                </p>
                {suggestionCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleNav(cat.path)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] text-left hover:bg-[#F0F6FF] active:bg-[#F0F6FF] flex items-center justify-between gap-2.5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Tag className="w-3.5 h-3.5 text-[#FF6B1A] shrink-0" />
                      <span className="text-xs font-semibold text-[#0B3B78] truncate">
                        {cat.parentName
                          ? `${cat.parentName} › ${cat.name}`
                          : cat.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] shrink-0">
                      {cat.itemCount} items
                    </span>
                  </button>
                ))}
              </div>
            )}

            {suggestionCollections.length > 0 && (
              <div className="border-b border-[#EEF4FB]">
                <p className="px-3.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  {suggestionCollections.every(
                    (c) =>
                      c.sectionLabel === "Men's Fashion" ||
                      c.sectionLabel === "Women's Fashion"
                  )
                    ? 'Fashion Collections'
                    : 'Collections & Varieties'}
                </p>
                {suggestionCollections.map((col) => {
                  const deptLabel =
                    col.sectionLabel === "Women's Fashion"
                      ? col.parentCategory && col.parentCategory !== "Women's Fashion"
                        ? `Women's Fashion · ${col.parentCategory}`
                        : "Women's Fashion"
                      : col.sectionLabel || `Men's Fashion · ${col.parentCategory}`;
                  const isSquareThumb =
                    col.sectionLabel === 'Electronics' ||
                    col.sectionLabel === 'Dried Fruits' ||
                    col.sectionLabel === 'Nuts' ||
                    col.sectionLabel === 'Skin Care' ||
                    col.sectionLabel === 'Hair Care' ||
                    col.sectionLabel === 'Furniture' ||
                    col.sectionLabel === 'Dried Peas' ||
                    col.sectionLabel === 'Pranks & Novelties' ||
                    col.sectionLabel === 'Fitness & Gym' ||
                    col.sectionLabel === 'Accessories' ||
                    col.sectionLabel === 'Sports' ||
                    col.sectionLabel === 'Footwear' ||
                    col.sectionLabel === 'Teenagers' ||
                    col.sectionLabel === 'Kids';
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => handleNav(col.path)}
                      className="w-full px-3.5 py-2.5 min-h-[48px] text-left hover:bg-[#F0F6FF] flex items-center justify-between gap-2.5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {col.image ? (
                          <img
                            src={encodeURI(col.image)}
                            alt={col.name}
                            className={`${isSquareThumb ? 'w-9 h-9' : 'w-8 h-10'} rounded-md object-contain bg-[#F8FAFC] border border-[#DCE6F2] shrink-0`}
                          />
                        ) : (
                          <div className={`${isSquareThumb ? 'w-9 h-9' : 'w-8 h-10'} rounded-md bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center shrink-0`}>
                            <Tag className="w-3.5 h-3.5 text-[#B45309]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#0B3B78] truncate">
                            {col.name}
                          </p>
                          <p className="text-[11px] text-[#64748B] truncate">
                            {deptLabel}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#FF6B1A] shrink-0">
                        View
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {liveSuggestions.length > 0 && (
              <div>
                <p className="px-3.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Products
                </p>
                {liveSuggestions.map((item) => {
                  const displayCat = getCategoryDisplayName(
                    item.category,
                    categories
                  );
                  const displaySub = getSubcategoryDisplayName(item.subcategory);
                  const price = getEffectivePrice(item);
                  const isUsedVehicle =
                    item.category.toLowerCase().includes('used') ||
                    item.category.toLowerCase().includes('bike');
                  const fallbackImg = isUsedVehicle
                    ? undefined
                    : resolveCategoryFallbackImage(item.category);
                  const imgSrc = item.images?.[0] || fallbackImg;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNav(`/product/${item.slug}`)}
                      className="w-full px-3.5 py-2.5 min-h-[48px] text-left hover:bg-[#FFF4EC] active:bg-[#FFF4EC] flex items-center justify-between gap-2.5 border-b border-[#EEF4FB] last:border-none cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#F0F6FF] border border-[#DCE6F2] overflow-hidden shrink-0">
                          <ResilientImage
                            src={imgSrc}
                            fallbackSrc={fallbackImg}
                            emptyLabel={
                              isUsedVehicle ? 'Photo Pending' : undefined
                            }
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#132238] truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#64748B] truncate">
                            {displayCat}
                            {displaySub ? ` · ${displaySub}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono-tabular text-xs font-bold text-[#0B3B78] shrink-0">
                        {price > 0
                          ? `₹${price.toLocaleString('en-IN')}`
                          : 'View'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {suggestionCategories.length === 0 &&
              suggestionCollections.length === 0 &&
              liveSuggestions.length === 0 &&
              !isSearchingApi && (
                <div className="px-3.5 py-4 text-center space-y-1">
                  <p className="text-xs font-semibold text-[#0B3B78]">
                    No matching products for “{searchText.trim()}”
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Try another keyword or browse all 20 categories.
                  </p>
                </div>
              )}

            <button
              type="button"
              onClick={() =>
                handleNav(`/search?q=${encodeURIComponent(searchText.trim())}`)
              }
              className="w-full px-3.5 py-3 min-h-[44px] bg-[#F8FAFC] hover:bg-[#EAF2FC] text-center text-xs font-bold text-[#1D6FD8] border-t border-[#DCE6F2] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>See all results for “{searchText.trim()}”</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Desktop Main Header Navigation Bar:
          Home | Groceries ▼ | Fashion ▼ | Kids | Teenagers | Baby Kit | School Kit | Used Bikes & Cars | Electronics | More ▼ | About Us | Contact Us */}
      <nav
        aria-label="Primary navigation"
        className="hidden lg:block bg-[#F0F6FF] border-t border-[#DCE6F2] relative z-50"
      >
        <div className="max-w-7xl mx-auto px-3 xl:px-5 h-11 flex items-center justify-between text-[11px] xl:text-xs font-semibold gap-2">
          <div className="flex items-center gap-2.5 xl:gap-4 min-w-0">
            {/* Home */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/');
              }}
              className={`whitespace-nowrap shrink-0 py-2.5 border-b-2 transition-colors ${
                route === '/'
                  ? 'text-[#0B3B78] border-[#FF6B1A]'
                  : 'text-[#334155] border-transparent hover:text-[#FF6B1A]'
              }`}
            >
              Home
            </a>

            {/* Groceries ▼ with Hover Dropdown & 2nd-Level Flyout */}
            <div
              className="relative flex items-center h-11"
              onMouseEnter={() => openMenu('groceries')}
              onMouseLeave={scheduleCloseMenu}
            >
              <a
                href="/groceries"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('/groceries');
                }}
                aria-expanded={openDesktopMenu === 'groceries'}
                aria-haspopup="menu"
                className={`whitespace-nowrap shrink-0 py-2.5 border-b-2 flex items-center gap-1 transition-colors ${
                  openDesktopMenu === 'groceries'
                    ? 'text-[#FF6B1A] border-[#FF6B1A]'
                    : route === '/groceries' || route.startsWith('/groceries/')
                      ? 'text-[#0B3B78] border-[#FF6B1A]'
                      : 'text-[#334155] border-transparent hover:text-[#FF6B1A]'
                }`}
              >
                <span>Groceries</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDesktopMenu === 'groceries'
                      ? 'rotate-180 text-[#FF6B1A]'
                      : 'opacity-75'
                  }`}
                />
              </a>

              {openDesktopMenu === 'groceries' && groceriesNode && (
                <div
                  role="menu"
                  aria-label="Groceries Menu"
                  onMouseEnter={() => openMenu('groceries')}
                  onMouseLeave={scheduleCloseMenu}
                  className="absolute top-full left-0 z-50 w-60 bg-white rounded-b-xl rounded-tr-xl border border-[#DCE6F2] shadow-xl py-2 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  {groceriesNode.subcategories.map((sub, subIdx) => {
                    const hasChildren = sub.children.length > 0;
                    const isSubHovered = hoveredSubId === sub.id;
                    const isWideFlyout = sub.children.length > 6;
                    const alignBottom = isWideFlyout && subIdx >= 4;

                    return (
                      <div
                        key={sub.id}
                        className="relative"
                        onMouseEnter={() => setHoveredSubId(sub.id)}
                      >
                        <button
                          type="button"
                          role="menuitem"
                          aria-haspopup={hasChildren ? 'menu' : undefined}
                          aria-expanded={hasChildren ? isSubHovered : undefined}
                          onClick={() => handleNav(sub.path)}
                          className={`w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            isSubHovered
                              ? 'bg-[#FFF4EC] text-[#FF6B1A]'
                              : 'text-[#1E293B] hover:bg-[#FFF4EC] hover:text-[#FF6B1A]'
                          }`}
                        >
                          <span>{sub.name}</span>
                          {hasChildren && (
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform ${
                                isSubHovered
                                  ? 'text-[#FF6B1A] translate-x-0.5'
                                  : 'text-[#94A3B8]'
                              }`}
                            />
                          )}
                        </button>

                        {/* Second-Level Flyout Dropdown (Rice, Health Foods, Whole Spices, Masala Powders) */}
                        {hasChildren && isSubHovered && (
                          <div
                            role="menu"
                            aria-label={`${sub.name} Subcategories`}
                            className={`absolute ${
                              alignBottom ? '-bottom-2' : 'top-0'
                            } left-full pl-1.5 z-50`}
                          >
                            <div
                              className={`bg-white rounded-xl border border-[#DCE6F2] shadow-xl py-2.5 animate-in fade-in slide-in-from-left-1 duration-150 max-h-[72vh] overflow-y-auto ${
                                isWideFlyout ? 'w-[440px] px-2.5' : 'w-52'
                              }`}
                            >
                              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0B3B78] border-b border-[#EEF4FB] mb-1.5 flex items-center justify-between">
                                <span>{sub.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleNav(sub.path)}
                                  className="text-[10px] font-bold text-[#FF6B1A] hover:underline normal-case cursor-pointer"
                                >
                                  View All
                                </button>
                              </div>
                              <div
                                className={
                                  isWideFlyout
                                    ? 'grid grid-cols-2 gap-1'
                                    : 'space-y-0.5'
                                }
                              >
                                {sub.children.map((third) => (
                                  <div key={third.id} className="space-y-0.5">
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={() => handleNav(third.path)}
                                      className="w-full px-3 py-1.5 rounded-lg text-left text-xs font-medium text-[#334155] hover:bg-[#FFF4EC] hover:text-[#FF6B1A] transition-colors cursor-pointer block leading-snug"
                                    >
                                      {third.name}
                                    </button>
                                    {third.children &&
                                      third.children.length > 0 && (
                                        <div className="ml-3 pl-2.5 border-l border-[#DCE6F2] space-y-0.5 pb-1">
                                          {third.children.map((fourth) => (
                                            <button
                                              key={fourth.id}
                                              type="button"
                                              role="menuitem"
                                              onClick={() =>
                                                handleNav(fourth.path)
                                              }
                                              className="w-full px-2.5 py-1 rounded-md text-left text-xs font-semibold text-[#0B3B78] hover:bg-[#FFF4EC] hover:text-[#FF6B1A] transition-colors cursor-pointer flex items-center gap-1.5 leading-snug"
                                            >
                                              <span
                                                aria-hidden="true"
                                                className="text-[#FF6B1A]"
                                              >
                                                ↳
                                              </span>
                                              <span>{fourth.name}</span>
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Fashion ▼ with Hover Dropdown & 2nd-Level Flyout */}
            <div
              className="relative flex items-center h-11"
              onMouseEnter={() => openMenu('fashion')}
              onMouseLeave={scheduleCloseMenu}
            >
              <a
                href="/fashion"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('/fashion');
                }}
                aria-expanded={openDesktopMenu === 'fashion'}
                aria-haspopup="menu"
                className={`whitespace-nowrap shrink-0 py-2.5 border-b-2 flex items-center gap-1 transition-colors ${
                  openDesktopMenu === 'fashion'
                    ? 'text-[#FF6B1A] border-[#FF6B1A]'
                    : route === '/fashion' || route.startsWith('/fashion/')
                      ? 'text-[#0B3B78] border-[#FF6B1A]'
                      : 'text-[#334155] border-transparent hover:text-[#FF6B1A]'
                }`}
              >
                <span>Fashion</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDesktopMenu === 'fashion'
                      ? 'rotate-180 text-[#FF6B1A]'
                      : 'opacity-75'
                  }`}
                />
              </a>

              {openDesktopMenu === 'fashion' && fashionNode && (
                <div
                  role="menu"
                  aria-label="Fashion Menu"
                  onMouseEnter={() => openMenu('fashion')}
                  onMouseLeave={scheduleCloseMenu}
                  className="absolute top-full left-0 z-50 w-56 bg-white rounded-b-xl rounded-tr-xl border border-[#DCE6F2] shadow-xl py-2 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  {fashionNode.subcategories.map((sub) => {
                    const hasChildren = sub.children.length > 0;
                    const isSubHovered = hoveredSubId === sub.id;

                    return (
                      <div
                        key={sub.id}
                        className="relative"
                        onMouseEnter={() => setHoveredSubId(sub.id)}
                      >
                        <button
                          type="button"
                          role="menuitem"
                          aria-haspopup={hasChildren ? 'menu' : undefined}
                          aria-expanded={hasChildren ? isSubHovered : undefined}
                          onClick={() => handleNav(sub.path)}
                          className={`w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            isSubHovered
                              ? 'bg-[#FFF4EC] text-[#FF6B1A]'
                              : 'text-[#1E293B] hover:bg-[#FFF4EC] hover:text-[#FF6B1A]'
                          }`}
                        >
                          <span>{sub.name}</span>
                          {hasChildren && (
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform ${
                                isSubHovered
                                  ? 'text-[#FF6B1A] translate-x-0.5'
                                  : 'text-[#94A3B8]'
                              }`}
                            />
                          )}
                        </button>

                        {/* Second-Level Flyout Dropdown (Men / Women) */}
                        {hasChildren && isSubHovered && (
                          <div
                            role="menu"
                            aria-label={`${sub.name} Fashion Categories`}
                            className="absolute top-0 left-full pl-1 z-50"
                          >
                            <div
                              className={`bg-white rounded-xl border border-[#DCE6F2] shadow-xl py-2.5 animate-in fade-in slide-in-from-left-1 duration-150 ${
                                sub.children.length > 6 ? 'w-80 px-2' : 'w-52'
                              }`}
                            >
                              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0B3B78] border-b border-[#EEF4FB] mb-1.5">
                                {sub.name}
                              </div>
                              <div
                                className={
                                  sub.children.length > 6
                                    ? 'grid grid-cols-2 gap-0.5'
                                    : 'space-y-0.5'
                                }
                              >
                                {sub.children.map((third) => (
                                  <button
                                    key={third.id}
                                    type="button"
                                    role="menuitem"
                                    onClick={() => handleNav(third.path)}
                                    className="w-full px-3 py-1.5 rounded-lg text-left text-xs font-medium text-[#334155] hover:bg-[#FFF4EC] hover:text-[#FF6B1A] transition-colors cursor-pointer truncate block"
                                  >
                                    {third.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Kids | Teenagers | Baby Kit | Electronics */}
            {directCategoryLinks.map((item) => {
              const active = item.aliases.some(
                (a) => route === a || route.startsWith(a + '/')
              );
              return (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.path);
                  }}
                  className={`whitespace-nowrap shrink-0 py-2.5 border-b-2 transition-colors ${
                    active
                      ? 'text-[#0B3B78] border-[#FF6B1A]'
                      : 'text-[#334155] border-transparent hover:text-[#FF6B1A]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}

            {/* More ▼ Dropdown (remaining 14 categories) */}
            <div
              className="relative flex items-center h-11"
              onMouseEnter={() => openMenu('more')}
              onMouseLeave={scheduleCloseMenu}
            >
              <button
                type="button"
                onClick={() =>
                  openDesktopMenu === 'more'
                    ? setOpenDesktopMenu(null)
                    : openMenu('more')
                }
                aria-expanded={openDesktopMenu === 'more'}
                aria-haspopup="menu"
                className={`whitespace-nowrap shrink-0 py-2.5 border-b-2 flex items-center gap-1 transition-colors cursor-pointer ${
                  openDesktopMenu === 'more'
                    ? 'text-[#FF6B1A] border-[#FF6B1A]'
                    : isMoreActive
                      ? 'text-[#0B3B78] border-[#FF6B1A]'
                      : 'text-[#334155] border-transparent hover:text-[#FF6B1A]'
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDesktopMenu === 'more'
                      ? 'rotate-180 text-[#FF6B1A]'
                      : 'opacity-75'
                  }`}
                />
              </button>

              {openDesktopMenu === 'more' && (
                <div
                  role="menu"
                  aria-label="More Categories Menu"
                  onMouseEnter={() => openMenu('more')}
                  onMouseLeave={scheduleCloseMenu}
                  className="absolute top-full left-0 z-50 w-96 bg-white rounded-b-xl rounded-tr-xl border border-[#DCE6F2] shadow-xl p-2.5 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="px-3 pb-2 mb-1.5 border-b border-[#EEF4FB] text-[10px] font-bold uppercase tracking-wider text-[#0B3B78]">
                    More Departments
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {moreCategories.map((cat) => {
                      const hasSubs = cat.subcategories.length > 0;
                      const flyoutKey = `more::${cat.id}`;
                      const isHovered = hoveredSubId === flyoutKey;
                      return (
                        <div
                          key={cat.id}
                          className="relative"
                          onMouseEnter={() =>
                            setHoveredSubId(hasSubs ? flyoutKey : null)
                          }
                        >
                          <button
                            type="button"
                            role="menuitem"
                            aria-haspopup={hasSubs ? 'menu' : undefined}
                            aria-expanded={hasSubs ? isHovered : undefined}
                            onClick={() => handleNav(cat.path)}
                            className={`w-full px-3 py-2 rounded-lg text-left text-xs font-semibold flex items-center justify-between gap-1 transition-colors cursor-pointer ${
                              isHovered
                                ? 'bg-[#FFF4EC] text-[#FF6B1A]'
                                : 'text-[#1E293B] hover:bg-[#FFF4EC] hover:text-[#FF6B1A]'
                            }`}
                          >
                            <span className="truncate">{cat.name}</span>
                            {hasSubs && (
                              <ChevronRight
                                className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                                  isHovered
                                    ? 'text-[#FF6B1A] translate-x-0.5'
                                    : 'text-[#94A3B8]'
                                }`}
                              />
                            )}
                          </button>

                          {hasSubs && isHovered && (
                            <div
                              role="menu"
                              aria-label={`${cat.name} Subcategories`}
                              className="absolute top-full left-0 pt-1 z-50 w-56"
                            >
                              <div className="bg-white rounded-xl border border-[#DCE6F2] shadow-xl py-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0B3B78] border-b border-[#EEF4FB] mb-1 truncate">
                                  {cat.name}
                                </div>
                                {cat.subcategories.map((sub) => (
                                  <button
                                    key={sub.id}
                                    type="button"
                                    role="menuitem"
                                    onClick={() => handleNav(sub.path)}
                                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#1E293B] hover:bg-[#FFF4EC] hover:text-[#FF6B1A] transition-colors cursor-pointer block truncate"
                                  >
                                    {sub.name}
                                  </button>
                                ))}
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => handleNav(cat.path)}
                                    className="w-full px-3 py-1.5 text-left text-[11px] font-bold text-[#0B3B78] hover:bg-[#F0F6FF] border-t border-[#EEF4FB] mt-1 transition-colors cursor-pointer block truncate"
                                  >
                                    View All {cat.name}
                                  </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* About Us */}
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/about');
              }}
              className={`whitespace-nowrap shrink-0 py-2.5 border-b-2 transition-colors ${
                route === '/about'
                  ? 'text-[#0B3B78] border-[#FF6B1A]'
                  : 'text-[#334155] border-transparent hover:text-[#FF6B1A]'
              }`}
            >
              About Us
            </a>

            {/* Contact Us */}
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/contact');
              }}
              className={`whitespace-nowrap shrink-0 py-2.5 border-b-2 transition-colors ${
                route === '/contact'
                  ? 'text-[#0B3B78] border-[#FF6B1A]'
                  : 'text-[#334155] border-transparent hover:text-[#FF6B1A]'
              }`}
            >
              Contact Us
            </a>
          </div>

          <div className="flex items-center gap-1.5 xl:gap-3 text-[11px] text-[#475569] shrink-0">
            <button
              type="button"
              onClick={() => handleNav('/offers')}
              className="hover:text-[#FF6B1A] font-medium whitespace-nowrap cursor-pointer transition-colors"
            >
              Offers
            </button>
            <span aria-hidden="true" className="hidden xl:inline">·</span>
            <button
              type="button"
              onClick={() => handleNav('/orders')}
              className="hover:text-[#FF6B1A] font-medium whitespace-nowrap cursor-pointer transition-colors"
            >
              Track Order
            </button>
            <span aria-hidden="true" className="hidden xl:inline">·</span>
            <button
              type="button"
              onClick={() => handleNav('/shop')}
              className="text-[#FF6B1A] font-semibold hover:underline whitespace-nowrap cursor-pointer"
            >
              Full Catalog
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Mobile Slide-Out Navigation Drawer (Tap-to-Expand Accordions) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#0B3B78]/45 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <aside
            aria-label="Mobile category menu"
            className="relative z-10 w-[min(88vw,340px)] h-[100dvh] bg-white shadow-2xl border-r border-[#DCE6F2] flex flex-col overflow-hidden animate-in slide-in-from-left duration-200"
          >
            <div className="px-4 py-3 border-b border-[#DCE6F2] flex items-center justify-between shrink-0 bg-white">
              <KubreeBazzarLogo size="sm" onClick={() => handleNav('/')} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center hover:bg-[#F0F6FF] text-[#0B3B78] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 pb-[calc(1.75rem+env(safe-area-inset-bottom))]">
              <form onSubmit={handleSearchSubmit} className="relative mb-2">
                <Search className="w-4 h-4 text-[#1D6FD8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search across all categories..."
                  aria-label="Search in menu"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-xs text-[#132238] placeholder:text-xs placeholder:text-[#64748B] focus:outline-none focus:border-[#1D6FD8]"
                />
              </form>

              {/* Home */}
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('/');
                }}
                className={`flex items-center min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                  route === '/'
                    ? 'bg-[#FFF4EC] border-[#FF6B1A]/30 text-[#FF6B1A]'
                    : 'bg-white border-[#EEF4FB] text-[#132238] hover:bg-[#F8FAFC]'
                }`}
              >
                Home
              </a>

              {/* Groceries (Tap label to open /groceries, tap arrow for 2-level accordion) */}
              {groceriesNode && (
                <div className="rounded-xl border border-[#EEF4FB] overflow-hidden bg-white">
                  <div className="flex items-center justify-between pl-3.5 pr-1.5 min-h-[46px] hover:bg-[#F8FAFC]">
                    <button
                      type="button"
                      onClick={() => handleNav('/groceries')}
                      className="text-left text-sm font-bold text-[#132238] hover:text-[#FF6B1A] flex-1 py-2.5 cursor-pointer"
                    >
                      Groceries
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedMobileMenu((prev) =>
                          prev === 'groceries' ? null : 'groceries'
                        );
                        setExpandedMobileSub(null);
                      }}
                      aria-label="Expand Groceries"
                      aria-expanded={expandedMobileMenu === 'groceries'}
                      className="w-11 h-11 flex items-center justify-center rounded-lg text-[#1D6FD8] hover:bg-[#FFF4EC] hover:text-[#FF6B1A] cursor-pointer"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedMobileMenu === 'groceries' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {expandedMobileMenu === 'groceries' && (
                    <div className="bg-[#F8FAFC] px-3 py-2 space-y-1.5 border-t border-[#EEF4FB]">
                      {groceriesNode.subcategories.map((sub) => {
                        const subKey = `groceries::${sub.name}`;
                        const hasChildren = sub.children.length > 0;
                        const isSubOpen = expandedMobileSub === subKey;

                        return (
                          <div
                            key={sub.id}
                            className="rounded-lg bg-white border border-[#EEF4FB] overflow-hidden"
                          >
                            <div className="flex items-center justify-between pl-3 pr-1 min-h-[44px]">
                              <button
                                type="button"
                                onClick={() => handleNav(sub.path)}
                                className="text-left text-xs font-semibold text-[#0B3B78] hover:text-[#FF6B1A] flex-1 py-2 cursor-pointer"
                              >
                                {sub.name}
                              </button>
                              {hasChildren && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedMobileSub((prev) =>
                                      prev === subKey ? null : subKey
                                    )
                                  }
                                  aria-label={`Expand ${sub.name}`}
                                  aria-expanded={isSubOpen}
                                  className="w-10 h-10 flex items-center justify-center rounded-md text-[#1D6FD8] hover:bg-[#FFF4EC] hover:text-[#FF6B1A] cursor-pointer"
                                >
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform ${
                                      isSubOpen ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {hasChildren && isSubOpen && (
                              <div className="bg-[#F0F6FF]/60 px-3 py-2 border-t border-[#EEF4FB] space-y-1">
                                {sub.children.map((third) => (
                                  <div key={third.id} className="space-y-0.5">
                                    <button
                                      type="button"
                                      onClick={() => handleNav(third.path)}
                                      className="flex items-center min-h-[38px] w-full text-left text-xs font-medium text-[#334155] hover:text-[#FF6B1A] py-1.5 cursor-pointer"
                                    >
                                      • {third.name}
                                    </button>
                                    {third.children &&
                                      third.children.length > 0 && (
                                        <div className="pl-4 space-y-0.5 border-l border-[#DCE6F2] ml-1.5">
                                          {third.children.map((fourth) => (
                                            <button
                                              key={fourth.id}
                                              type="button"
                                              onClick={() =>
                                                handleNav(fourth.path)
                                              }
                                              className="flex items-center min-h-[36px] w-full text-left text-xs font-semibold text-[#0B3B78] hover:text-[#FF6B1A] py-1 cursor-pointer"
                                            >
                                              ↳ {fourth.name}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Fashion (Tap label to open /fashion, tap arrow for Men's/Women's accordions) */}
              {fashionNode && (
                <div className="rounded-xl border border-[#EEF4FB] overflow-hidden bg-white">
                  <div className="flex items-center justify-between pl-3.5 pr-1.5 min-h-[46px] hover:bg-[#F8FAFC]">
                    <button
                      type="button"
                      onClick={() => handleNav('/fashion')}
                      className="text-left text-sm font-bold text-[#132238] hover:text-[#FF6B1A] flex-1 py-2.5 cursor-pointer"
                    >
                      Fashion
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedMobileMenu((prev) =>
                          prev === 'fashion' ? null : 'fashion'
                        );
                        setExpandedMobileSub(null);
                      }}
                      aria-label="Expand Fashion"
                      aria-expanded={expandedMobileMenu === 'fashion'}
                      className="w-11 h-11 flex items-center justify-center rounded-lg text-[#1D6FD8] hover:bg-[#FFF4EC] hover:text-[#FF6B1A] cursor-pointer"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedMobileMenu === 'fashion' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {expandedMobileMenu === 'fashion' && (
                    <div className="bg-[#F8FAFC] px-3 py-2 space-y-1.5 border-t border-[#EEF4FB]">
                      {fashionNode.subcategories.map((sub) => {
                        const subKey = `fashion::${sub.name}`;
                        const hasChildren = sub.children.length > 0;
                        const isSubOpen = expandedMobileSub === subKey;

                        return (
                          <div
                            key={sub.id}
                            className="rounded-lg bg-white border border-[#EEF4FB] overflow-hidden"
                          >
                            <div className="flex items-center justify-between pl-3 pr-1 min-h-[44px]">
                              <button
                                type="button"
                                onClick={() => handleNav(sub.path)}
                                className="text-left text-xs font-semibold text-[#0B3B78] hover:text-[#FF6B1A] flex-1 py-2 cursor-pointer"
                              >
                                {sub.name}
                              </button>
                              {hasChildren && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedMobileSub((prev) =>
                                      prev === subKey ? null : subKey
                                    )
                                  }
                                  aria-label={`Expand ${sub.name}`}
                                  aria-expanded={isSubOpen}
                                  className="w-10 h-10 flex items-center justify-center rounded-md text-[#1D6FD8] hover:bg-[#FFF4EC] hover:text-[#FF6B1A] cursor-pointer"
                                >
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform ${
                                      isSubOpen ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {hasChildren && isSubOpen && (
                              <div className="bg-[#F0F6FF]/60 px-3 py-2 border-t border-[#EEF4FB] grid grid-cols-2 gap-1">
                                {sub.children.map((third) => (
                                  <button
                                    key={third.id}
                                    type="button"
                                    onClick={() => handleNav(third.path)}
                                    className="text-left text-xs font-medium text-[#334155] hover:text-[#FF6B1A] py-2 cursor-pointer truncate"
                                  >
                                    • {third.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Direct Links: Kids | Teenagers | Baby Kit | Temple & Pooja Essentials | School Kit | Used Bikes & Cars | Electronics */}
              {mobileDirectCategoryLinks.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNav(item.path)}
                  className={`w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    route === item.path
                      ? 'bg-[#FFF4EC] border-[#FF6B1A]/30 text-[#FF6B1A]'
                      : 'bg-white border-[#EEF4FB] text-[#132238] hover:bg-[#FFF4EC] hover:text-[#FF6B1A]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                </button>
              ))}

              {/* More Categories Accordion */}
              <div className="rounded-xl border border-[#EEF4FB] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedMobileMenu((prev) =>
                      prev === 'more' ? null : 'more'
                    )
                  }
                  aria-expanded={expandedMobileMenu === 'more'}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 min-h-[46px] text-left text-sm font-bold text-[#0B3B78] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  <span>More Categories</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#1D6FD8] transition-transform ${
                      expandedMobileMenu === 'more' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedMobileMenu === 'more' && (
                  <div className="bg-[#F8FAFC] px-3 py-2 grid grid-cols-2 gap-1.5 border-t border-[#EEF4FB]">
                    {mobileMoreCategories.map((cat) => {
                      const hasSubs = cat.subcategories.length > 0;
                      const subKey = `more::${cat.id}`;
                      const isOpen = expandedMobileSub === subKey;

                      if (!hasSubs) {
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleNav(cat.path)}
                            className="px-2.5 py-2.5 min-h-[44px] rounded-lg bg-white border border-[#EEF4FB] text-left text-xs font-semibold text-[#132238] hover:bg-[#FFF4EC] hover:text-[#FF6B1A] truncate cursor-pointer"
                          >
                            {cat.name}
                          </button>
                        );
                      }

                      return (
                        <div
                          key={cat.id}
                          className="col-span-2 rounded-lg bg-white border border-[#EEF4FB] overflow-hidden"
                        >
                          <div className="flex items-center justify-between pl-3 pr-1 min-h-[44px]">
                            <button
                              type="button"
                              onClick={() => handleNav(cat.path)}
                              className="text-left text-xs font-semibold text-[#132238] hover:text-[#FF6B1A] flex-1 py-2 truncate cursor-pointer"
                            >
                              {cat.name}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedMobileSub((prev) =>
                                  prev === subKey ? null : subKey
                                )
                              }
                              aria-label={`Expand ${cat.name}`}
                              aria-expanded={isOpen}
                              className="w-10 h-10 flex items-center justify-center rounded-md text-[#1D6FD8] hover:bg-[#FFF4EC] hover:text-[#FF6B1A] cursor-pointer"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                          </div>
                          {isOpen && (
                            <div className="bg-[#F0F6FF]/60 px-3 py-2 border-t border-[#EEF4FB] space-y-1">
                              {cat.subcategories.map((sub) => (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => handleNav(sub.path)}
                                  className="flex items-center min-h-[38px] w-full text-left text-xs font-semibold text-[#0B3B78] hover:text-[#FF6B1A] py-1 cursor-pointer"
                                >
                                  • {sub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-3 mt-2 border-t border-[#DCE6F2] space-y-1.5">
                {!user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal({ tab: 'login' });
                    }}
                    className="w-full flex items-center justify-between min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0B3B78] text-white text-xs font-bold cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>Login / Create Account</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] p-3 space-y-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0B3B78] truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-[#64748B] truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleNav('/profile')}
                        className="px-2.5 py-2 rounded-lg bg-white border border-[#DCE6F2] text-xs font-semibold text-[#0B3B78] text-center cursor-pointer"
                      >
                        Account
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNav('/orders')}
                        className="px-2.5 py-2 rounded-lg bg-white border border-[#DCE6F2] text-xs font-semibold text-[#0B3B78] text-center cursor-pointer"
                      >
                        My Orders
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => void logout()}
                      className="w-full px-2.5 py-2 rounded-lg border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}

                {[
                  { label: 'About Us', path: '/about' },
                  { label: 'Contact Us', path: '/contact' },
                  { label: 'Full Catalog', path: '/shop' },
                  { label: 'Offers & Discounts', path: '/offers' },
                  { label: 'My Orders', path: '/orders' },
                  { label: 'My Wishlist', path: '/wishlist' },
                  ...(isAdminRole(user)
                    ? [{ label: 'Admin Portal', path: '/admin/dashboard' }]
                    : []),
                ].map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(item.path);
                    }}
                    className={`flex items-center min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#F0F6FF] hover:text-[#FF6B1A] ${
                      route === item.path
                        ? 'bg-[#F0F6FF] text-[#0B3B78] font-bold'
                        : 'text-[#132238]'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
