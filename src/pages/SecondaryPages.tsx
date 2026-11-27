import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Tag,
  Copy,
  Check,
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  HelpCircle,
  Heart,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  PackageCheck,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Navigation,
  ExternalLink,
} from 'lucide-react';
import { apiFetch } from '../utils/apiClient';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  GOOGLE_MAPS_DIRECTIONS_URL,
  OFFICIAL_ADDRESS_LINES,
  OFFICIAL_BUSINESS_NAME,
  OFFICIAL_MAPS_DESTINATION,
  OFFICIAL_PHONE_NUMBERS,
} from '../data/businessContact';
import {
  filterAndSortProducts,
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
  searchRiceCollections,
} from '../utils/catalogSearch';
import { isFashionClothingProduct } from '../utils/fashionUtils';

const SEARCH_ITEMS_PER_PAGE = 24;

function parseSearchRouteParams(routeStr: string) {
  const queryPart = routeStr.includes('?')
    ? routeStr.split('?')[1]
    : typeof window !== 'undefined'
      ? window.location.search.replace(/^\?/, '')
      : '';
  const params = new URLSearchParams(queryPart);
  return {
    q: params.get('q') || '',
  };
}

export function SearchPage() {
  const {
    route,
    products,
    categories,
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
    loadingProducts,
    navigate,
  } = useStore();
  const initialParsed = parseSearchRouteParams(route);

  const [query, setQuery] = useState(initialParsed.q);
  const [debouncedQuery, setDebouncedQuery] = useState(initialParsed.q);
  const [page, setPage] = useState(1);

  // Sync query param whenever URL route changes (fixes repeated searches while already on /search & direct page refresh)
  useEffect(() => {
    const parsed = parseSearchRouteParams(route);
    setQuery(parsed.q);
    setDebouncedQuery(parsed.q);
    setPage(1);
  }, [route]);

  // Debounce typing in the page search box and keep URL query string synchronized
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
      if (typeof window !== 'undefined' && window.location.pathname === '/search') {
        const params = new URLSearchParams(window.location.search);
        const trimmed = query.trim();
        if (trimmed) {
          params.set('q', trimmed);
        } else {
          params.delete('q');
        }
        const nextSearch = params.toString();
        const nextUrl = nextSearch ? `/search?${nextSearch}` : '/search';
        const currentUrl = window.location.pathname + window.location.search;
        if (currentUrl !== nextUrl) {
          window.history.replaceState({}, '', nextUrl);
        }
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    document.title = trimmed
      ? `Search: ${trimmed} | KubreeBazzar`
      : 'Search Catalog | KubreeBazzar';
  }, [debouncedQuery]);

  const results = useMemo(() => {
    return filterAndSortProducts(products, categories, {
      query: debouncedQuery,
      sortBy: debouncedQuery.trim() ? 'relevance' : 'featured',
    });
  }, [products, categories, debouncedQuery]);

  const matchingCollections = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return [
      ...searchRiceCollections(debouncedQuery),
      ...searchKidsCollections(debouncedQuery, kidsCollections),
      ...searchTeenagersCollections(debouncedQuery, teenagersCollections),
      ...searchFootwearCollections(debouncedQuery, footwearCollections),
      ...searchSportsCollections(debouncedQuery, sportsCollections),
      ...searchAccessoriesCollections(debouncedQuery, accessoriesCollections),
      ...searchFitnessGymCollections(debouncedQuery, fitnessGymCollections),
      ...searchPranksNoveltiesCollections(debouncedQuery, pranksNoveltiesCollections),
      ...searchDriedPeasCollections(debouncedQuery, driedPeasCollections),
      ...searchFurnitureCollections(debouncedQuery, furnitureCollections),
      ...searchHairCareCollections(debouncedQuery, hairCareCollections),
      ...searchSkinCareCollections(debouncedQuery, skinCareCollections),
      ...searchNutsCollections(debouncedQuery, nutsCollections),
      ...searchDriedFruitsCollections(debouncedQuery, driedFruitsCollections),
      ...searchElectronicsCollections(debouncedQuery, electronicsCollections),
      ...searchWomensFashionCollections(debouncedQuery, womensFashionCollections),
      ...searchMensFashionCollections(debouncedQuery, mensFashionCollections),
    ].sort((a, b) => b.score - a.score);
  }, [
    debouncedQuery,
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

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(results.length / SEARCH_ITEMS_PER_PAGE)
  );
  const paginatedResults = results.slice(
    (page - 1) * SEARCH_ITEMS_PER_PAGE,
    page * SEARCH_ITEMS_PER_PAGE
  );

  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
    setPage(1);
    navigate('/search');
  };

  const isTypingDebounce = query.trim() !== debouncedQuery.trim();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Search Header Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-[#F0F6FF] to-[#EAF2FC] border border-[#DCE6F2] p-4 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-[#FF6B1A] uppercase tracking-wider mb-1">
              Instant Catalog Search
            </p>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0B3B78]">
              {debouncedQuery.trim()
                ? `Results for “${debouncedQuery.trim()}”`
                : 'Search KubreeBazzar'}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0B3B78] bg-white border border-[#DCE6F2] px-3.5 py-2 rounded-xl self-start sm:self-auto">
            {loadingProducts || isTypingDebounce ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1D6FD8]" />
                <span>Searching...</span>
              </>
            ) : (
              <span className="font-mono-tabular">
                {matchingCollections.length > 0
                  ? `${matchingCollections.length} ${matchingCollections.length === 1 ? 'collection' : 'collections'} · `
                  : ''}
                {results.length} matching{' '}
                {results.length === 1 ? 'product' : 'products'}
              </span>
            )}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDebouncedQuery(query);
            const trimmed = query.trim();
            navigate(
              trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search'
            );
          }}
          className="relative max-w-3xl"
        >
          <Search className="w-5 h-5 text-[#1D6FD8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Rice, Honey, Cardamom (Elakkai), Cloves, Baby Kit, School Kit, Temple Kit, Fashion..."
            aria-label="Search products and categories"
            className="w-full pl-12 pr-11 py-3.5 rounded-xl bg-white border border-[#DCE6F2] text-base sm:text-sm text-[#132238] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D6FD8] shadow-xs"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setDebouncedQuery('');
                navigate('/search');
              }}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0B3B78] hover:bg-[#F0F6FF] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Matching Curated Collections */}
      {matchingCollections.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#0B3B78]">
              Matching Collections ({matchingCollections.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {matchingCollections.map((col) => (
              <article
                key={col.id}
                className="rounded-2xl bg-white border border-[#DCE6F2] overflow-hidden flex flex-col hover:shadow-md transition-all"
              >
                <button
                  type="button"
                  onClick={() => navigate(col.path)}
                  className={`relative w-full ${
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
                    col.sectionLabel === 'Kids'
                      ? 'aspect-square'
                      : 'aspect-[3/4]'
                  } ${col.image?.includes('/school-kit/') ? 'bg-[#090C12]' : 'bg-[#F8FAFC]'} overflow-hidden block cursor-pointer`}
                >
                  {col.image ? (
                    <img
                      src={encodeURI(col.image)}
                      alt={`${col.name} - ${col.parentCategory}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center bg-gradient-to-br from-[#FDF2F8] via-[#F8FAFC] to-[#EFF6FF]">
                      <Tag className="w-8 h-8 text-[#BE185D] mb-2" />
                      <p className="font-display text-sm font-bold text-[#0B3B78]">
                        {col.name}
                      </p>
                      <p className="text-[11px] text-[#64748B] mt-1">
                        Photo pending upload
                      </p>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 border border-[#DCE6F2] text-[10px] font-bold uppercase tracking-wider text-[#0B3B78]">
                    {col.parentCategory}
                  </span>
                </button>
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-extrabold text-[#0B3B78]">
                      {col.name}
                    </h3>
                    <p className="text-xs text-[#475569] mt-1 line-clamp-2">
                      {col.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(col.path)}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-[#FFF4EC] hover:bg-[#FF6B1A] text-[#FF6B1A] hover:text-white border border-[#FFD6BA] hover:border-[#FF6B1A] text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Product Grid / Loading / Empty State */}
      {loadingProducts && products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="h-96 rounded-2xl bg-white border border-[#DCE6F2] animate-pulse"
            />
          ))}
        </div>
      ) : paginatedResults.length === 0 && matchingCollections.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#DCE6F2] p-8 sm:p-12 text-center space-y-4">
          <Search className="w-11 h-11 text-[#94A3B8] mx-auto opacity-60" />
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-[#0B3B78]">
              No matching products found
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
              {debouncedQuery.trim()
                ? `We couldn't find items matching “${debouncedQuery.trim()}”.`
                : 'No products available for this search.'}{' '}
              Try searching another keyword like Rice, Honey, Elakkai, Baby Kit,
              or Fashion.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-2.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] hover:border-[#0B3B78] text-[#0B3B78] text-xs font-bold cursor-pointer"
            >
              Reset Search
            </button>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="px-4 py-2.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-xs font-bold cursor-pointer"
            >
              Browse All Categories
            </button>
          </div>
        </div>
      ) : paginatedResults.length === 0 ? null : (
        <>
          <div
            className={
              paginatedResults.length > 0 &&
              paginatedResults.every((p) => isFashionClothingProduct(p))
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            }
          >
            {paginatedResults.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs font-semibold text-[#0B3B78] disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <span className="font-mono-tabular text-xs text-[#64748B] px-3">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs font-semibold text-[#0B3B78] disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function NewArrivalsPage() {
  const { products } = useStore();
  const list = products.filter(
    (p) => p.enabled !== false && p.newArrival !== false
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Latest Additions
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          New Arrivals
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export function BestSellersPage() {
  const { products } = useStore();
  const list = products.filter(
    (p) => p.enabled !== false && p.bestSeller !== false
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Customer Favourites
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          Best Sellers
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export function WishlistPage() {
  const { products, wishlist, user, authLoading, openAuthModal, navigate } =
    useStore();
  const saved = products.filter(
    (p) => p.enabled !== false && wishlist.includes(p.id)
  );

  if (!authLoading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-6 sm:p-8 space-y-4 shadow-xs">
          <Heart className="w-10 h-10 text-[#FF6B1A] mx-auto" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3B78]">
            Sign in to View Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Log in or create an account to save your favourite items and access
            your wishlist across sessions.
          </p>
          <button
            type="button"
            onClick={() =>
              openAuthModal({
                tab: 'login',
                message: 'Please log in to view and manage your wishlist.',
                pendingAction: { type: 'navigate', path: '/wishlist' },
              })
            }
            className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white cursor-pointer transition-colors"
          >
            Login / Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
      <div className="pb-6 border-b border-[#DCE6F2]">
        <p className="text-xs font-bold text-[#FF6B1A] uppercase tracking-[0.2em] mb-1">
          Saved Selection
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3B78]">
          Your Wishlist ({saved.length})
        </h1>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-14 text-center">
          <Heart className="w-10 h-10 text-[#FF6B1A] mx-auto mb-3" />
          <h2 className="font-display text-xl font-bold text-[#0B3B78]">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Save any product from the catalog to compare pack sizes and prices
            later.
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white cursor-pointer"
          >
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OffersPage() {
  const { coupons, banners, products, showToast } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const discountedProducts = products.filter(
    (p) => p.enabled !== false && p.discountPercent > 0
  );

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Copied code ${code}`);
    window.setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Seasonal Savings &amp; Coupons
        </p>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E1614]">
          Active Offers &amp; Coupons
        </h1>
      </div>

      {banners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl bg-gradient-to-br from-[#6B1D2F] to-[#4A121F] text-white p-5 sm:p-6 space-y-2"
            >
              <p className="text-xs font-semibold text-[#E6C36A] uppercase">
                Featured Campaign
              </p>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">{b.title}</h2>
              <p className="text-sm text-white/85">{b.subtitle}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl bg-white border border-[#E6DCD0] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-[#B88628] font-semibold">
                <Tag className="w-3.5 h-3.5" />
                <span>
                  {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                </span>
              </div>
              <p className="font-mono text-xl font-bold text-[#1E1614] mt-1">
                {c.code}
              </p>
              <p className="text-xs text-[#6E6059] mt-1">{c.description}</p>
            </div>

            <button
              type="button"
              onClick={() => copyCode(c.code)}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-xs font-semibold text-white flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copiedCode === c.code ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {discountedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1E1614]">
            Special Value Editions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {discountedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ContactPage() {
  const { settings, navigate, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = 'Contact Us | KubreeBazzar';
  }, []);

  const configuredEmail = settings?.contactEmail?.trim();
  const configuredHours = settings?.supportHours?.trim();
  const whatsappEnv = (
    (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ||
    settings?.whatsappNumber
  )?.trim();
  const whatsappDigits = (whatsappEnv || '').replace(/\D/g, '');
  const hasWhatsapp = whatsappDigits.length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMsg('Please fill in your full name, email address, and message.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: phone.trim(),
          subject: subject.trim(),
          message: trimmedMessage,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.received) {
        setErrorMsg(
          data?.error || 'Unable to submit your message right now. Please try again.'
        );
        return;
      }
      setSent(true);
      showToast('Inquiry received by KubreeBazzar');
    } catch {
      setErrorMsg('Network error while sending your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactFaqs = [
    {
      q: 'How can I track or modify an existing order?',
      a: 'Visit the Track Order page from the header or enter your order number below in the message form so our support team can assist you.',
    },
    {
      q: 'Which payment methods are accepted on KubreeBazzar?',
      a: 'We support Razorpay online payments (UPI, Cards, NetBanking, Wallets) as well as Cash on Delivery (COD) on eligible orders.',
    },
    {
      q: 'What should I include for vehicle or bulk grocery inquiries?',
      a: 'Share your preferred category, pack size or vehicle model, and your phone number so our team can respond quickly.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <div className="pb-6 border-b border-[#DCE6F2]">
        <p className="text-xs font-bold text-[#FF6B1A] uppercase tracking-[0.2em] mb-1">
          Customer Care &amp; Support
        </p>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3B78]">
          Contact Us
        </h1>
        <p className="text-sm text-[#475569] mt-2 max-w-2xl">
          Have a question about your order, delivery status, product sizes, or
          used vehicle enquiries? Reach out to {settings?.brandName || 'KubreeBazzar'} customer support and we will be happy to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left: Official Contact Details, Support Channels & Order Support */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white border border-[#DCE6F2] p-4 sm:p-6 space-y-5 shadow-xs">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B1A] mb-1">
                Official Contact Details
              </p>
              <h2 className="font-display text-xl font-bold text-[#0B3B78]">
                Reach {OFFICIAL_BUSINESS_NAME}
              </h2>
            </div>

            <div className="space-y-4 text-xs text-[#475569]">
              {/* Official Business Address */}
              <div className="flex items-start gap-3 pb-4 border-b border-[#EEF4FB]">
                <span className="w-8 h-8 rounded-lg bg-[#F0F6FF] border border-[#DCE6F2] text-[#1D6FD8] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1 space-y-2.5">
                  <div>
                    <p className="text-xs font-bold text-[#0B3B78]">
                      Business Address
                    </p>
                    <address className="not-italic text-xs sm:text-sm text-[#334155] leading-relaxed mt-1 break-words">
                      <span className="font-semibold text-[#0B3B78] block">
                        {OFFICIAL_BUSINESS_NAME}
                      </span>
                      {OFFICIAL_ADDRESS_LINES.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                  </div>

                  <a
                    href={GOOGLE_MAPS_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#F0F6FF] hover:bg-[#1D6FD8] text-xs font-bold text-[#0B3B78] hover:text-white border border-[#DCE6F2] hover:border-[#1D6FD8] transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 shrink-0" />
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Primary & Secondary Contact Numbers */}
              <div className="space-y-3 pb-4 border-b border-[#EEF4FB]">
                {OFFICIAL_PHONE_NUMBERS.map((phoneItem) => (
                  <div
                    key={phoneItem.telHref}
                    className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-2.5"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <Phone className="w-4 h-4 text-[#FF6B1A] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-[#64748B]">
                          {phoneItem.label}
                        </p>
                        <a
                          href={phoneItem.telHref}
                          className="text-sm font-bold text-[#0B3B78] hover:text-[#1D6FD8] tabular-nums whitespace-nowrap transition-colors"
                        >
                          {phoneItem.display}
                        </a>
                      </div>
                    </div>

                    <a
                      href={phoneItem.telHref}
                      className="w-full min-[380px]:w-auto inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white whitespace-nowrap shrink-0 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>Call Now</span>
                    </a>
                  </div>
                ))}
              </div>

              {configuredEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#1D6FD8] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0B3B78]">Business Email</p>
                    <a
                      href={`mailto:${configuredEmail}`}
                      className="text-[#1D6FD8] hover:underline break-all"
                    >
                      {configuredEmail}
                    </a>
                  </div>
                </div>
              )}

              {hasWhatsapp && (
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-[#4CAF50] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0B3B78]">WhatsApp Support</p>
                    <a
                      href={`https://wa.me/${whatsappDigits}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2E7D32] font-semibold hover:underline break-words"
                    >
                      Chat on WhatsApp ({whatsappEnv})
                    </a>
                  </div>
                </div>
              )}

              {configuredHours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#FF6B1A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0B3B78]">Customer Support Hours</p>
                    <p className="text-[#475569]">{configuredHours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-[#F0F6FF] border border-[#DCE6F2] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#0B3B78]">
              <PackageCheck className="w-4 h-4 text-[#FF6B1A]" />
              <h2 className="font-display text-lg font-bold">
                Order Support Information
              </h2>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              For faster assistance with an existing purchase, please keep your
              order number (e.g. KAV-2026-...) ready or check live 5-stage
              delivery updates anytime.
            </p>
            <div className="flex flex-col gap-2 text-xs pt-1">
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="text-left text-[#0B3B78] hover:text-[#FF6B1A] font-semibold flex items-center justify-between py-1 cursor-pointer"
              >
                <span>Track an existing shipment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/faq')}
                className="text-left text-[#0B3B78] hover:text-[#FF6B1A] font-semibold flex items-center justify-between py-1 cursor-pointer"
              >
                <span>Browse Full FAQ Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/return-policy')}
                className="text-left text-[#0B3B78] hover:text-[#FF6B1A] font-semibold flex items-center justify-between py-1 cursor-pointer"
              >
                <span>Read Return &amp; Refund Policy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Validated Contact Form */}
        <div className="lg:col-span-7">
          {sent ? (
            <div className="rounded-2xl bg-white border border-[#DCE6F2] p-8 text-center space-y-3 shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-[#4CAF50] mx-auto" />
              <h2 className="font-display text-2xl font-bold text-[#0B3B78]">
                Message Received
              </h2>
              <p className="text-sm text-[#475569]">
                Thank you for contacting KubreeBazzar. Our customer care team has
                logged your inquiry for <span className="font-semibold">{email}</span>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setMessage('');
                  setSubject('');
                  setErrorMsg(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl bg-white border border-[#DCE6F2] p-4 sm:p-8 space-y-4 shadow-xs"
            >
              <h2 className="font-display text-xl font-bold text-[#0B3B78]">
                Send a Direct Message
              </h2>

              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-medium text-rose-700 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-full-name"
                    className="block text-xs font-semibold text-[#334155] mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    id="contact-full-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:bg-white focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-[#334155] mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:bg-white focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs font-semibold text-[#334155] mb-1.5"
                  >
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:bg-white focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-[#334155] mb-1.5"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Order inquiry, groceries, fashion, or vehicles"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:bg-white focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-[#334155] mb-1.5"
                >
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our support team help you?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:bg-white focus:outline-none focus:border-[#1D6FD8]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] disabled:opacity-60 text-sm font-bold text-white inline-flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Submit Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Google Maps Directions Section */}
      <section
        aria-label="Google Maps Directions"
        className="rounded-2xl bg-white border border-[#DCE6F2] p-5 sm:p-8 shadow-xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-bold text-[#1D6FD8] uppercase tracking-wider">
              Google Maps Directions
            </p>
            <h2 className="font-display text-2xl font-bold text-[#0B3B78]">
              Find {OFFICIAL_BUSINESS_NAME} in Vallam / Sengottai Area
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Use Google Maps directions below to navigate directly to our business
              address in Tamil Nadu.
            </p>
            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 text-xs text-[#334155] space-y-1">
              <p className="font-semibold text-[#0B3B78]">
                Directions Search Destination
              </p>
              <p className="leading-relaxed break-words">
                {OFFICIAL_MAPS_DESTINATION}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs sm:text-sm font-bold text-white shadow-xs transition-colors"
              >
                <Navigation className="w-4 h-4 shrink-0" />
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
              <a
                href={OFFICIAL_PHONE_NUMBERS[0].telHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#F0F6FF] hover:bg-[#1D6FD8] text-xs sm:text-sm font-bold text-[#0B3B78] hover:text-white border border-[#DCE6F2] hover:border-[#1D6FD8] transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>Call {OFFICIAL_PHONE_NUMBERS[0].display}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-white border border-[#DCE6F2] text-[#FF6B1A] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0B3B78]">
                    {OFFICIAL_BUSINESS_NAME}
                  </p>
                  <p className="text-xs text-[#475569] mt-0.5">
                    Opposite RK Mahal · Vallam Main Road
                  </p>
                  <p className="text-xs text-[#475569]">
                    Vallam / Sengottai Area, Tamil Nadu – 627809
                  </p>
                </div>
              </div>

              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-between gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-[#0B3B78] text-xs font-bold text-[#0B3B78] hover:text-white border border-[#DCE6F2] hover:border-[#0B3B78] transition-colors"
              >
                <span>Open Route in Google Maps</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inline FAQ Section */}
      <section className="pt-4 border-t border-[#DCE6F2] space-y-5">
        <div>
          <p className="text-xs font-bold text-[#1D6FD8] uppercase tracking-wider mb-1">
            Quick Answers
          </p>
          <h2 className="font-display text-2xl font-bold text-[#0B3B78]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {contactFaqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl bg-white border border-[#DCE6F2] p-5 space-y-2 shadow-xs"
            >
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-[#FF6B1A] shrink-0 mt-0.5" />
                <h3 className="font-display text-sm font-bold text-[#0B3B78]">
                  {faq.q}
                </h3>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function FaqPage() {
  const faqs = [
    {
      q: 'How does the 360° 3D Product Viewer work?',
      a: 'Every product page includes an interactive WebGL stage where you can drag to orbit 360°, zoom in on details, switch finishes, and use the Exploded View slider to inspect packaging and watch components.',
    },
    {
      q: 'Which payment methods are supported?',
      a: 'We support Razorpay online payments (UPI, Cards, NetBanking, Wallets with server-side HMAC-SHA256 signature verification) as well as Cash on Delivery (COD).',
    },
    {
      q: 'How long does delivery take?',
      a: 'Orders of ₹1,500 or more qualify for complimentary delivery (2–4 business days). Standard delivery is ₹99.',
    },
    {
      q: 'Can I return or exchange an item?',
      a: 'Yes. Unopened pantry items and unworn watches may be returned or exchanged within 14 days of delivery in their original sealed packaging.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Knowledge Base
        </p>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E1614]">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((item) => (
          <div
            key={item.q}
            className="rounded-2xl bg-white border border-[#E6DCD0] p-4 sm:p-6 space-y-2"
          >
            <h2 className="font-serif text-base sm:text-lg font-bold text-[#1E1614] flex items-start sm:items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#6B1D2F] shrink-0 mt-1 sm:mt-0" />
              <span>{item.q}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4F49] leading-relaxed pl-6">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HelpCenterPage() {
  const { navigate } = useStore();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Customer Care
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          Help Center
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Order & Shipment Tracking',
            desc: 'Check real-time 5-stage fulfillment milestones using your account or checkout email.',
            path: '/orders',
          },
          {
            title: 'Shipping & Delivery',
            desc: 'Learn about dispatch timelines, protective glass-jar packaging, and free delivery thresholds.',
            path: '/shipping-policy',
          },
          {
            title: 'Returns & Refunds',
            desc: 'Review our return window, inspection process, and refund timelines.',
            path: '/return-policy',
          },
        ].map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(card.path);
              }
            }}
            className="cursor-pointer rounded-2xl bg-white border border-[#E6DCD0] hover:border-[#6B1D2F] p-6 flex flex-col justify-between transition-colors"
          >
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1E1614]">
                {card.title}
              </h2>
              <p className="text-xs text-[#6E6059] mt-2 leading-relaxed">
                {card.desc}
              </p>
            </div>
            <span className="mt-5 text-xs font-semibold text-[#6B1D2F] inline-flex items-center gap-1">
              <span>Open Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PolicyPage({
  type,
}: {
  type: 'privacy' | 'terms' | 'shipping' | 'return';
}) {
  const { settings } = useStore();
  const brand = settings?.brandName || 'KubreeBazzar';

  const content = {
    privacy: {
      title: 'Privacy Policy',
      updated: 'Effective 2026',
      sections: [
        {
          h: '1. Information We Collect',
          p: `${brand} collects only the account, shipping, and order details necessary to fulfill your purchases, maintain your saved wishlist, and provide shipment tracking.`,
        },
        {
          h: '2. Payment Security',
          p: 'Online payments are processed via Razorpay with server-side HMAC-SHA256 signature verification. We never store raw payment card numbers on our servers.',
        },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      updated: 'Effective 2026',
      sections: [
        {
          h: '1. Storefront Usage',
          p: `By accessing ${brand}, you agree to provide accurate shipping and contact information when placing orders.`,
        },
        {
          h: '2. Pricing & Availability',
          p: 'All product prices in INR (₹), discounts, and variant inventory levels are loaded dynamically and confirmed at checkout.',
        },
      ],
    },
    shipping: {
      title: 'Shipping Policy',
      updated: 'Effective 2026',
      sections: [
        {
          h: '1. Dispatch & Transit',
          p: 'Orders are inspected and packed within 24 hours. Delivery is complimentary on orders of ₹1,500 or more (₹99 flat rate otherwise).',
        },
        {
          h: '2. Milestone Tracking',
          p: 'Every order includes 5-stage tracking from Processing and Packed through Shipped, Out for Delivery, and Delivered.',
        },
      ],
    },
    return: {
      title: 'Return & Refund Policy',
      updated: 'Effective 2026',
      sections: [
        {
          h: '1. Return Window',
          p: 'Unopened food/grocery packs and unworn watches may be returned within 14 days of delivery in their original, undamaged packaging.',
        },
        {
          h: '2. Refund Processing',
          p: 'Once inspected at our fulfillment hub, refunds are issued to your original payment method within 5–7 business days.',
        },
      ],
    },
  }[type];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          {content.updated}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          {content.title}
        </h1>
      </div>

      <div className="space-y-6">
        {content.sections.map((sec) => (
          <div
            key={sec.h}
            className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-2"
          >
            <h2 className="font-serif text-xl font-bold text-[#1E1614]">
              {sec.h}
            </h2>
            <p className="text-sm text-[#5C4F49] leading-relaxed">{sec.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
