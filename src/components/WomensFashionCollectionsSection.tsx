import { useMemo } from 'react';
import { ArrowRight, Layers, Sparkles, ImageOff } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  WOMENS_FASHION_PARENT_CATEGORIES,
  getWomensFashionCollectionPath,
} from '../data/womensFashionCollections';
import type {
  WomensFashionCollection,
  WomensFashionParentCategory,
} from '../types';

interface WomensFashionCollectionsSectionProps {
  selectedParent?: string; // 'All' | 'Churidar Sets' | ... | 'T-Shirts'
  activeCollectionSlug?: string;
  onSelectCollection?: (collection: WomensFashionCollection) => void;
  onSelectParent?: (parent: 'All' | WomensFashionParentCategory) => void;
}

export function WomensFashionCollectionsSection({
  selectedParent = 'All',
  activeCollectionSlug,
  onSelectCollection,
  onSelectParent,
}: WomensFashionCollectionsSectionProps) {
  const { womensFashionCollections, navigate } = useStore();

  const approvedCollections = useMemo(
    () =>
      [...womensFashionCollections]
        .filter((c) => c.status === 'approved')
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [womensFashionCollections]
  );

  const normalizedParent = useMemo(() => {
    const clean = (selectedParent || 'All').toLowerCase().trim();
    const matched = WOMENS_FASHION_PARENT_CATEGORIES.find(
      (p) =>
        p.name.toLowerCase() === clean ||
        p.slug === clean ||
        p.folder === clean
    );
    return matched ? matched.name : 'All';
  }, [selectedParent]);

  const visibleCollections = useMemo(() => {
    return normalizedParent === 'All'
      ? approvedCollections
      : approvedCollections.filter(
          (c) => c.parentCategory === normalizedParent
        );
  }, [approvedCollections, normalizedParent]);

  const countByParent = useMemo(() => {
    const map: Record<string, number> = {
      All: approvedCollections.length,
    };
    for (const parent of WOMENS_FASHION_PARENT_CATEGORIES) {
      map[parent.name] = approvedCollections.filter(
        (c) => c.parentCategory === parent.name
      ).length;
    }
    return map;
  }, [approvedCollections]);

  const handleOpenCollection = (collection: WomensFashionCollection) => {
    if (onSelectCollection) {
      onSelectCollection(collection);
      return;
    }
    navigate(getWomensFashionCollectionPath(collection));
  };

  const handleParentFilter = (
    parent: 'All' | WomensFashionParentCategory
  ) => {
    if (onSelectParent) {
      onSelectParent(parent);
      return;
    }
    if (parent === 'All') {
      navigate('/fashion/womens-fashion');
      return;
    }
    const found = WOMENS_FASHION_PARENT_CATEGORIES.find(
      (p) => p.name === parent
    );
    if (found) {
      navigate(`/fashion/womens-fashion/${found.slug}`);
    }
  };

  if (approvedCollections.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="womens-fashion-collections-heading"
      className="space-y-4 sm:space-y-6"
    >
      <div className="rounded-2xl bg-white border border-[#DCE6F2] p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#BE185D] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Women&apos;s Fashion Clothing Collections</span>
            </div>
            <h2
              id="womens-fashion-collections-heading"
              className="font-display text-xl sm:text-2xl font-extrabold text-[#0B3B78]"
            >
              {normalizedParent === 'All'
                ? `Explore All ${approvedCollections.length} Women's Style Collections`
                : `Women's ${normalizedParent} Collections`}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              Browse individual clothing styles across all 13 Women&apos;s Fashion subcategories.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1.5 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] text-xs font-bold text-[#9D174D] whitespace-nowrap">
              {visibleCollections.length} Clothing Types
            </span>
          </div>
        </div>

        {/* 13 Women's Fashion Subcategory Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter Women's Fashion clothing types by subcategory"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={normalizedParent === 'All'}
            onClick={() => handleParentFilter('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
              normalizedParent === 'All'
                ? 'bg-[#0B3B78] text-white shadow-xs'
                : 'bg-[#F8FAFC] border border-[#DCE6F2] text-[#334155] hover:border-[#0B3B78] hover:text-[#0B3B78]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All ({countByParent.All})</span>
          </button>
          {WOMENS_FASHION_PARENT_CATEGORIES.map((parent) => {
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
                    ? 'bg-[#BE185D] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#DCE6F2] text-[#334155] hover:border-[#BE185D] hover:text-[#9D174D]'
                }`}
              >
                {parent.name} ({countByParent[parent.name] || 0})
              </button>
            );
          })}
        </div>
      </div>

      {/* 1 full collection card per row on mobile, responsive grid on tablet/desktop */}
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
                  ? 'border-[#BE185D] ring-2 ring-[#BE185D]/20 shadow-sm'
                  : 'border-[#DCE6F2]'
              }`}
            >
              <button
                type="button"
                onClick={() => handleOpenCollection(collection)}
                className="relative w-full aspect-[3/4] bg-[#F8FAFC] overflow-hidden block text-left cursor-pointer"
                aria-label={`Explore ${collection.name}`}
              >
                {collection.image ? (
                  <img
                    src={encodeURI(collection.image)}
                    alt={`${collection.name} - Women's ${collection.parentCategory}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FDF2F8] via-[#F8FAFC] to-[#EFF6FF]">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-[#FBCFE8] flex items-center justify-center shadow-xs mb-3">
                      <ImageOff className="w-6 h-6 text-[#BE185D]" />
                    </div>
                    <p className="font-display text-sm font-bold text-[#0B3B78]">
                      {collection.name}
                    </p>
                    <p className="text-[11px] font-medium text-[#64748B] mt-1">
                      Photo pending upload
                    </p>
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs border border-[#DCE6F2] text-[10px] font-bold uppercase tracking-wider text-[#9D174D] shadow-xs">
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
                      ? 'bg-[#9D174D] text-white'
                      : 'bg-[#FDF2F8] hover:bg-[#BE185D] text-[#9D174D] hover:text-white border border-[#FBCFE8] hover:border-[#BE185D]'
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
