import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import type { ProductCategory } from '../types';

const ITEMS_PER_PAGE = 9;

export function ShopPage() {
  const { products, categories, banners, loadingProducts, navigate } =
    useStore();

  const initialParams = new URLSearchParams(window.location.search);
  const initialCat =
    (initialParams.get('category') as 'All' | ProductCategory) || 'All';
  const initialSub = initialParams.get('subcategory') || 'All';

  const [selectedCategory, setSelectedCategory] = useState<
    'All' | ProductCategory
  >(initialCat);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<string>(initialSub);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
  >('featured');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categoryList: ('All' | ProductCategory)[] = [
    'All',
    ...categories.map((c) => c.id),
  ];

  useEffect(() => {
    setPage(1);
  }, [
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    maxPrice,
    minRating,
    inStockOnly,
    sortBy,
  ]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (selectedSubcategory !== 'All') {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }
    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }
    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }
    list = list.filter((p) => getEffectivePrice(p) <= maxPrice);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case 'price-desc':
        list.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return list;
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    inStockOnly,
    minRating,
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSearchQuery('');
    setMaxPrice(20000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeBanner = banners.find((b) => b.active);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Shop Hero & Promotional Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-white via-[#FAF6F0] to-[#F3ECE1] border border-[#E6DDD0] p-6 sm:p-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-bold text-[#B88628] uppercase tracking-wider mb-2">
            KubreeBazzar · Complete Catalog
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#6B1D2F]">
            Rice, Grocery, Honey & Watches
          </h1>
          {activeBanner && (
            <p className="text-xs sm:text-sm text-[#4A3F3B] mt-2">
              {activeBanner.title} — {activeBanner.subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/offers')}
            className="px-4 py-2.5 rounded-lg bg-[#6B1D2F] hover:bg-[#541524] text-xs font-semibold text-white whitespace-nowrap shrink-0"
          >
            View Active Offers
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-[#E6DDD0]">
        {categoryList.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubcategory('All');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-[#6B1D2F] text-white'
                  : 'bg-white text-[#4A3F3B] border border-[#E6DDD0] hover:border-[#6B1D2F]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Mobile Filter Drawer Trigger & Sort */}
      <div className="flex md:hidden items-center justify-between gap-3 py-4">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-white border border-[#E6DDD0] text-xs font-semibold text-[#1E1614] flex items-center gap-2"
        >
          <Filter className="w-4 h-4 text-[#6B1D2F]" />
          <span>Filters</span>
        </button>

        <select
          aria-label="Sort products mobile"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2.5 rounded-lg bg-white border border-[#E6DDD0] text-xs text-[#1E1614]"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>

      {/* Desktop Filter & Sort Toolbar */}
      <div className="hidden md:grid py-6 grid-cols-12 gap-4 items-center">
        <div className="col-span-4 relative">
          <Search className="w-4 h-4 text-[#786B65] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, brand, or variety..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#E6DDD0] text-xs text-[#1E1614] placeholder:text-[#786B65] focus:outline-none focus:border-[#6B1D2F]"
          />
        </div>

        <div className="col-span-3 flex items-center gap-2.5 bg-white border border-[#E6DDD0] rounded-lg px-3.5 py-2">
          <SlidersHorizontal className="w-4 h-4 text-[#6B1D2F] shrink-0" />
          <span className="text-xs text-[#4A3F3B]">Max:</span>
          <input
            type="range"
            min={200}
            max={20000}
            step={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="flex-1 accent-[#6B1D2F] cursor-pointer"
          />
          <span className="font-mono-tabular text-xs font-bold text-[#6B1D2F] w-16 text-right">
            ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="col-span-2">
          <select
            aria-label="Minimum rating"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#E6DDD0] text-xs text-[#1E1614]"
          >
            <option value={0}>All Ratings</option>
            <option value={4.5}>4.5★ & Above</option>
            <option value={4.8}>4.8★ & Above</option>
          </select>
        </div>

        <div className="col-span-1 flex items-center gap-1.5">
          <input
            id="in-stock-check"
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-[#6B1D2F] rounded cursor-pointer"
          />
          <label
            htmlFor="in-stock-check"
            className="text-xs text-[#4A3F3B] cursor-pointer whitespace-nowrap"
          >
            In Stock
          </label>
        </div>

        <div className="col-span-2">
          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#E6DDD0] text-xs text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex justify-end bg-black/50"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xs bg-white border-l border-[#E6DDD0] h-full p-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#EFE6D8] pb-3">
                <h2 className="font-display text-lg font-bold text-[#1E1614]">
                  Filter Products
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-[#786B65]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs text-[#786B65] mb-1.5">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Keywords..."
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF6F0] border border-[#E6DDD0] text-xs text-[#1E1614]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#786B65] mb-1.5">
                  Max Price: ₹{maxPrice.toLocaleString('en-IN')}
                </label>
                <input
                  type="range"
                  min={200}
                  max={20000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#6B1D2F]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#786B65] mb-1.5">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF6F0] border border-[#E6DDD0] text-xs text-[#1E1614]"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4.5}>4.5★ & Above</option>
                  <option value={4.8}>4.8★ & Above</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs text-[#4A3F3B]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#6B1D2F]"
                />
                <span>In stock only</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#EFE6D8]">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-lg border border-[#E6DDD0] text-xs text-[#4A3F3B]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {loadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 rounded-xl bg-white border border-[#E6DDD0]"
            />
          ))}
        </div>
      ) : paginatedProducts.length === 0 ? (
        <div className="rounded-xl bg-white border border-[#E6DDD0] p-12 text-center my-8">
          <p className="font-display text-xl font-bold text-[#1E1614]">
            No matching products found
          </p>
          <p className="text-xs text-[#786B65] mt-1">
            Try adjusting your category filter, search query, or maximum price.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 px-4 py-2 rounded-lg bg-[#6B1D2F] hover:bg-[#541524] text-xs font-semibold text-white inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3.5 py-2 rounded-lg bg-white border border-[#E6DDD0] text-xs text-[#4A3F3B] disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <span className="font-mono-tabular text-xs text-[#786B65] px-3">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3.5 py-2 rounded-lg bg-white border border-[#E6DDD0] text-xs text-[#4A3F3B] disabled:opacity-40 flex items-center gap-1"
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
