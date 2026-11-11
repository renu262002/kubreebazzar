import { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { Category3DShowcase } from '../components/Category3DShowcase';
import { ProductCard } from '../components/ProductCard';
import type { ProductCategory } from '../types';

interface CategoryLandingPageProps {
  category: ProductCategory;
}

const BUYING_GUIDES: Record<
  string,
  { title: string; points: string[]; relatedCat: ProductCategory }
> = {
  Rice: {
    title: 'How to Choose the Right Rice Variety',
    points: [
      'Aged Basmati (24 months): Slender, non-sticky grains suited for biryanis and pulao.',
      'Boiled Ponni & Sona Masoori: Soft, lightweight everyday grains for sambar, rasam, and curd rice.',
      'Traditional Red & Black Varieties (Mapillai Samba, Karuppu Kavuni): Heirloom grains with rich earthy flavor.',
    ],
    relatedCat: 'Grocery',
  },
  Grocery: {
    title: 'Pantry Staples & Cold-Pressed Oil Guide',
    points: [
      'Wood-Pressed Oils (Gingelly & Groundnut): Extracted at low temperatures to preserve natural aroma.',
      'Unpolished Dals & Pulses: Stone-sorted without artificial oil or talcum glazing.',
      'Single-Origin Spices: Erode turmeric and Idukki green cardamom packed in sealed canisters.',
    ],
    relatedCat: 'Rice',
  },
  Honey: {
    title: 'Understanding Regional Honey Varieties',
    points: [
      'Forest & Mangrove Honey: Dark amber, robust flavor profile from wild biosphere flora.',
      'Wildflower & Multiflora Honey: Light-to-medium golden sweetness suited for daily tea and breakfast.',
      'Acacia & Neem Honey: Distinct monofloral harvests bottled in clear glass jars.',
    ],
    relatedCat: 'Grocery',
  },
  Watches: {
    title: 'Heritage & Everyday Watch Buying Guide',
    points: [
      'Automatic & Mechanical: Sweeping seconds hand with exhibition casebacks and sapphire crystal.',
      'Analog Dress & Chronographs: Slim gold-tone and steel cases for festive and formal occasions.',
      'AMOLED Smart & Digital: Dual-band GPS, multi-day battery, and 100m water resistance.',
    ],
    relatedCat: 'Honey',
  },
};

export function CategoryLandingPage({ category }: CategoryLandingPageProps) {
  const { products, categories, banners, navigate } = useStore();

  const catInfo =
    categories.find((c) => c.id === category) || categories[0];

  const [selectedSub, setSelectedSub] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-asc' | 'price-desc' | 'rating'
  >('featured');

  const categoryProducts = useMemo(() => {
    let list = products.filter((p) => p.category === category);
    if (selectedSub !== 'All') {
      list = list.filter((p) => p.subcategory === selectedSub);
    }
    list = list.filter((p) => getEffectivePrice(p) <= maxPrice);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
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
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, category, selectedSub, maxPrice, searchQuery, sortBy]);

  const activeBanner = banners.find((b) => b.active);
  const guide = BUYING_GUIDES[category] || BUYING_GUIDES.Rice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Category-Specific 3D Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-white via-[#FAF6F0] to-[#EFE6D8] border border-[#E6DDD0] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#B88628]">
            {catInfo?.subtitle || category}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#6B1D2F] leading-tight">
            {catInfo?.title || `${category} Collection`}
          </h1>
          <p className="text-sm sm:text-base text-[#4A3F3B] leading-relaxed max-w-xl">
            {catInfo?.description}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E6DDD0] text-xs font-semibold text-[#1E1614]">
              {categoryProducts.length} Editions Available
            </span>
            <button
              type="button"
              onClick={() => navigate('/offers')}
              className="px-4 py-2 rounded-lg bg-[#6B1D2F] hover:bg-[#541524] text-xs font-semibold text-white"
            >
              View Festive Offers
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 h-[300px] sm:h-[340px] rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#E6DDD0]">
          <Category3DShowcase
            activePreset={catInfo?.modelType || 'rice'}
          />
        </div>
      </section>

      {/* Promotional Banner */}
      {activeBanner && (
        <div className="rounded-xl bg-[#6B1D2F] text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-[#F3D88B]">
              {activeBanner.title}
            </p>
            <p className="text-xs text-white/90 mt-0.5">
              {activeBanner.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/offers')}
            className="px-4 py-2 rounded-lg bg-[#F3D88B] text-[#1E1614] text-xs font-bold whitespace-nowrap shrink-0"
          >
            Claim Offer
          </button>
        </div>
      )}

      {/* Subcategory Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E6DDD0]">
        {['All', ...(catInfo?.subcategories || [])].map((sub) => {
          const active = selectedSub === sub;
          return (
            <button
              key={sub}
              type="button"
              onClick={() => setSelectedSub(sub)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-[#6B1D2F] text-white'
                  : 'bg-white text-[#4A3F3B] border border-[#E6DDD0] hover:border-[#6B1D2F]'
              }`}
            >
              {sub}
            </button>
          );
        })}
      </div>

      {/* Filters & Price Sorting */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-[#786B65] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${category}...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#E6DDD0] text-xs text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
          />
        </div>

        <div className="md:col-span-4 flex items-center gap-2.5 bg-white border border-[#E6DDD0] rounded-lg px-3.5 py-2">
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

        <div className="md:col-span-3">
          <select
            aria-label={`Sort ${category} products`}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#E6DDD0] text-xs font-medium text-[#1E1614]"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {categoryProducts.length === 0 ? (
        <div className="rounded-xl bg-white border border-[#E6DDD0] p-12 text-center">
          <p className="font-display text-xl font-bold text-[#1E1614]">
            No matching {category.toLowerCase()} products found
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSub('All');
              setSearchQuery('');
              setMaxPrice(20000);
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Related Collections & Buying Guide */}
      <section className="rounded-2xl bg-white border border-[#E6DDD0] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B88628]">
            <BookOpen className="w-4 h-4" />
            <span>{category} Buying Guide</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#1E1614]">
            {guide.title}
          </h2>
          <ul className="space-y-2 text-xs text-[#4A3F3B] leading-relaxed">
            {guide.points.map((pt) => (
              <li key={pt}>• {pt}</li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4 rounded-xl bg-[#FAF6F0] border border-[#E6DDD0] p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B1D2F]">
            Related Collection
          </p>
          <h3 className="font-display text-xl font-bold text-[#1E1614]">
            Explore {guide.relatedCat}
          </h3>
          <p className="text-xs text-[#4A3F3B]">
            Pair your {category.toLowerCase()} selection with our curated{' '}
            {guide.relatedCat.toLowerCase()} range.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/${guide.relatedCat.toLowerCase()}`)}
            className="px-4 py-2.5 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white inline-flex items-center gap-1.5"
          >
            <span>Visit {guide.relatedCat}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
