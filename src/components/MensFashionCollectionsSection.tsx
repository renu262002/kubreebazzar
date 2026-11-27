import { useMemo } from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  MENS_FASHION_PARENT_CATEGORIES,
  getMensFashionCollectionPath,
} from '../data/mensFashionCollections';
import type {
  MensFashionCollection,
  MensFashionParentCategory,
} from '../types';

interface MensFashionCollectionsSectionProps {
  selectedParent?: string; // 'All' | 'Shirts' | 'Trousers' | 'Pants' | 'T-Shirts'
  activeCollectionSlug?: string;
  onSelectCollection?: (collection: MensFashionCollection) => void;
  onSelectParent?: (parent: 'All' | MensFashionParentCategory) => void;
}

export function MensFashionCollectionsSection({
  selectedParent = 'All',
  activeCollectionSlug,
  onSelectCollection,
  onSelectParent,
}: MensFashionCollectionsSectionProps) {
  const { mensFashionCollections, navigate } = useStore();

  const normalizedParent = useMemo(() => {
    const clean = (selectedParent || 'All').toLowerCase().trim();
    const matched = MENS_FASHION_PARENT_CATEGORIES.find(
      (p) => p.name.toLowerCase() === clean || p.slug === clean
    );
    return matched ? matched.name : 'All';
  }, [selectedParent]);

  const visibleCollections = useMemo(() => {
    const base =
      normalizedParent === 'All'
        ? mensFashionCollections
        : mensFashionCollections.filter(
            (c) => c.parentCategory === normalizedParent
          );
    return [...base].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [mensFashionCollections, normalizedParent]);

  const countByParent = useMemo(() => {
    const map: Record<string, number> = {
      All: mensFashionCollections.length,
    };
    for (const parent of MENS_FASHION_PARENT_CATEGORIES) {
      map[parent.name] = mensFashionCollections.filter(
        (c) => c.parentCategory === parent.name
      ).length;
    }
    return map;
  }, [mensFashionCollections]);

  const handleOpenCollection = (collection: MensFashionCollection) => {
    if (onSelectCollection) {
      onSelectCollection(collection);
      return;
    }
    navigate(getMensFashionCollectionPath(collection));
  };

  const handleParentFilter = (parent: 'All' | MensFashionParentCategory) => {
    if (onSelectParent) {
      onSelectParent(parent);
      return;
    }
    if (parent === 'All') {
      navigate('/fashion/mens-fashion');
      return;
    }
    const found = MENS_FASHION_PARENT_CATEGORIES.find(
      (p) => p.name === parent
    );
    if (found) {
      navigate(`/fashion/mens-fashion/${found.slug}`);
    }
  };

  if (mensFashionCollections.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="mens-fashion-collections-heading"
      className="space-y-4 sm:space-y-6"
    >
      <div className="rounded-2xl bg-white border border-[#DCE6F2] p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FF6B1A] mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Men&apos;s Fashion Clothing Collections</span>
            </div>
            <h2
              id="mens-fashion-collections-heading"
              className="font-display text-xl sm:text-2xl font-extrabold text-[#0B3B78]"
            >
              {normalizedParent === 'All'
                ? `Explore All ${mensFashionCollections.length} Men's Style Collections`
                : `Men's ${normalizedParent} Collections`}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              Browse curated clothing types across Shirts, Trousers, Pants, and
              T-Shirts.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-xs font-bold text-[#0B3B78] self-start sm:self-center whitespace-nowrap">
            {visibleCollections.length} Collections
          </span>
        </div>

        {/* Parent Category Visual Cards (Shirts, Trousers, Pants, T-Shirts) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MENS_FASHION_PARENT_CATEGORIES.map((parent) => {
            const isSelected = normalizedParent === parent.name;
            const itemCount = countByParent[parent.name] || 0;
            return (
              <button
                key={`cat-card-${parent.name}`}
                type="button"
                onClick={() => handleParentFilter(parent.name)}
                className={`group rounded-xl border p-2.5 flex items-center gap-3 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF4EC] border-[#FF6B1A] ring-2 ring-[#FF6B1A]/20 shadow-xs'
                    : 'bg-[#F8FAFC] border-[#DCE6F2] hover:border-[#0B3B78] hover:bg-white'
                }`}
              >
                <div className="w-12 h-14 rounded-lg bg-white border border-[#DCE6F2] overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                  <img
                    src={encodeURI(parent.image)}
                    alt={`Men's ${parent.name}`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xs sm:text-sm font-extrabold text-[#0B3B78] truncate">
                    {parent.name}
                  </p>
                  <p className="text-[11px] font-semibold text-[#64748B]">
                    {itemCount} Styles
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Parent Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter Men's Fashion collections by parent category"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={normalizedParent === 'All'}
            onClick={() => handleParentFilter('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              normalizedParent === 'All'
                ? 'bg-[#0B3B78] text-white shadow-xs'
                : 'bg-[#F8FAFC] border border-[#DCE6F2] text-[#334155] hover:border-[#0B3B78] hover:text-[#0B3B78]'
            }`}
          >
            All ({countByParent.All})
          </button>
          {MENS_FASHION_PARENT_CATEGORIES.map((parent) => {
            const isSelected = normalizedParent === parent.name;
            return (
              <button
                key={parent.name}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleParentFilter(parent.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#FF6B1A] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#DCE6F2] text-[#334155] hover:border-[#FF6B1A] hover:text-[#FF6B1A]'
                }`}
              >
                {parent.name} ({countByParent[parent.name] || 0})
              </button>
            );
          })}
        </div>
      </div>

      {/* Collection Cards Grid: 1 full card per row on narrow mobile, multi-column on tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {visibleCollections.map((collection) => {
          const isActive =
            activeCollectionSlug &&
            activeCollectionSlug.toLowerCase() === collection.slug.toLowerCase();

          return (
            <article
              key={collection.id}
              className={`group rounded-2xl bg-white border overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isActive
                  ? 'border-[#FF6B1A] ring-2 ring-[#FF6B1A]/20 shadow-sm'
                  : 'border-[#DCE6F2]'
              }`}
            >
              <button
                type="button"
                onClick={() => handleOpenCollection(collection)}
                className="relative w-full aspect-[3/4] bg-[#F8FAFC] overflow-hidden block text-left cursor-pointer"
                aria-label={`Explore ${collection.name}`}
              >
                <img
                  src={encodeURI(collection.image)}
                  alt={`${collection.name} - Men's ${collection.parentCategory}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs border border-[#DCE6F2] text-[10px] font-bold uppercase tracking-wider text-[#0B3B78] shadow-xs">
                  {collection.parentCategory}
                </span>
              </button>

              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div className="space-y-1.5">
                  <h3 className="font-display text-base font-extrabold text-[#0B3B78] leading-snug">
                    {collection.name}
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                    {collection.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenCollection(collection)}
                  className={`w-full min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0B3B78] text-white'
                      : 'bg-[#FFF4EC] hover:bg-[#FF6B1A] text-[#FF6B1A] hover:text-white border border-[#FFD6BA] hover:border-[#FF6B1A]'
                  }`}
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
