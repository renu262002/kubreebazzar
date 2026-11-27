import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Coffee,
  ImageOff,
  Layers,
  Moon,
  Sun,
  Wheat,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  INITIAL_RICE_COLLECTIONS,
  RICE_MEAL_GROUPS,
  findRiceMealGroupBySlug,
  getRiceCollectionPath,
} from '../data/riceCollections';
import type { RiceCollection, RiceMealGroupName } from '../types';

function getRiceMealIcon(meal: RiceMealGroupName) {
  switch (meal) {
    case 'Breakfast':
      return Coffee;
    case 'Lunch':
      return Sun;
    case 'Dinner':
      return Moon;
  }
}

interface RiceCollectionsSectionProps {
  selectedMeal?: string; // 'All' | 'Breakfast' | 'Lunch' | 'Dinner'
  activeCollectionSlug?: string;
  onSelectCollection?: (collection: RiceCollection) => void;
  onSelectMeal?: (meal: 'All' | RiceMealGroupName) => void;
}

export function RiceCollectionsSection({
  selectedMeal = 'All',
  activeCollectionSlug,
  onSelectCollection,
  onSelectMeal,
}: RiceCollectionsSectionProps) {
  const { navigate } = useStore();
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});
  const [failedBannerSlugs, setFailedBannerSlugs] = useState<Record<string, boolean>>({});

  const approvedCollections = useMemo(
    () =>
      [...INITIAL_RICE_COLLECTIONS]
        .filter((c) => c.status === 'approved')
        .sort((a, b) => a.displayOrder - b.displayOrder),
    []
  );

  const activeMealMeta = useMemo(
    () =>
      selectedMeal && selectedMeal !== 'All'
        ? findRiceMealGroupBySlug(selectedMeal)
        : undefined,
    [selectedMeal]
  );

  const normalizedMeal: 'All' | RiceMealGroupName = activeMealMeta
    ? activeMealMeta.name
    : 'All';

  const visibleMealGroups = useMemo(() => {
    if (normalizedMeal === 'All') {
      return RICE_MEAL_GROUPS;
    }
    return RICE_MEAL_GROUPS.filter((g) => g.name === normalizedMeal);
  }, [normalizedMeal]);

  const countByMeal = useMemo(() => {
    const map: Record<string, number> = {
      All: approvedCollections.length,
    };
    for (const group of RICE_MEAL_GROUPS) {
      map[group.name] = approvedCollections.filter(
        (c) => c.parentGroup === group.name
      ).length;
    }
    return map;
  }, [approvedCollections]);

  const totalVisibleCount =
    normalizedMeal === 'All'
      ? approvedCollections.length
      : countByMeal[normalizedMeal] || 0;

  const handleOpenCollection = (collection: RiceCollection) => {
    if (onSelectCollection) {
      onSelectCollection(collection);
      return;
    }
    navigate(getRiceCollectionPath(collection));
  };

  const handleMealSelect = (meal: 'All' | RiceMealGroupName) => {
    if (onSelectMeal) {
      onSelectMeal(meal);
      return;
    }
    if (meal === 'All') {
      navigate('/groceries/rice');
      return;
    }
    const found = RICE_MEAL_GROUPS.find((g) => g.name === meal);
    if (found) {
      navigate(`/groceries/rice/${found.slug}`);
    }
  };

  if (approvedCollections.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="rice-collections-heading"
      className="space-y-6 sm:space-y-8"
    >
      {/* Header & Meal Filter Tabs */}
      <div className="rounded-2xl bg-white border border-[#DCE6F2] p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1D6FD8] mb-1">
              <Wheat className="w-3.5 h-3.5 text-[#FF6B1A]" />
              <span>
                Groceries · Rice — Breakfast, Lunch &amp; Dinner
              </span>
            </div>
            <h2
              id="rice-collections-heading"
              className="font-display text-xl sm:text-2xl font-extrabold text-[#0B3B78]"
            >
              {normalizedMeal === 'All'
                ? `Explore All ${approvedCollections.length} Rice Varieties`
                : `${normalizedMeal} Rice Varieties`}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              {activeMealMeta
                ? activeMealMeta.description
                : 'Organized across Breakfast, Lunch, and Dinner collections. Traditional varieties remain versatile across daily home-cooked meals.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-xs font-bold text-[#0B3B78] whitespace-nowrap">
              {totalVisibleCount}{' '}
              {totalVisibleCount === 1 ? 'Variety' : 'Varieties'}
            </span>
          </div>
        </div>

        {/* Meal Switcher Tabs */}
        <div
          role="tablist"
          aria-label="Filter Rice varieties by meal category"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={normalizedMeal === 'All'}
            onClick={() => handleMealSelect('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
              normalizedMeal === 'All'
                ? 'bg-[#0B3B78] text-white shadow-xs'
                : 'bg-[#F8FAFC] border border-[#DCE6F2] text-[#334155] hover:border-[#0B3B78] hover:text-[#0B3B78]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Rice ({countByMeal.All})</span>
          </button>
          {RICE_MEAL_GROUPS.map((group) => {
            const isSelected = normalizedMeal === group.name;
            const MealIcon = getRiceMealIcon(group.name);
            return (
              <button
                key={group.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleMealSelect(group.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1D6FD8] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#DCE6F2] text-[#334155] hover:border-[#1D6FD8] hover:text-[#0B3B78]'
                }`}
              >
                <MealIcon className="w-3.5 h-3.5" />
                <span>
                  {group.name} ({countByMeal[group.name] || 0})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Main Meal Category Banner Cards on /groceries/rice or /rice */}
      {normalizedMeal === 'All' && !activeCollectionSlug && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#DCE6F2]">
            <div>
              <h3 className="font-display text-lg font-extrabold text-[#0B3B78]">
                Rice Categories by Meal Presentation
              </h3>
              <p className="text-xs text-[#64748B]">
                Choose Breakfast, Lunch, or Dinner to view its curated grain varieties
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {RICE_MEAL_GROUPS.map((group) => {
              const MealIcon = getRiceMealIcon(group.name);
              const count = countByMeal[group.name] || group.varietyCount;
              return (
                <article
                  key={group.slug}
                  className="group rounded-2xl bg-white border border-[#DCE6F2] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => handleMealSelect(group.name)}
                    className="relative w-full aspect-square bg-[#F8FAFC] overflow-hidden block text-left cursor-pointer"
                    aria-label={`Browse ${group.name} Rice varieties`}
                  >
                    {!failedBannerSlugs[group.slug] ? (
                      <img
                        src={encodeURI(group.bannerImage)}
                        alt={`${group.name} Rice`}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedBannerSlugs((prev) => ({
                            ...prev,
                            [group.slug]: true,
                          }))
                        }
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F0F6FF] via-[#F8FAFC] to-[#EAF2FC]">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-[#DCE6F2] flex items-center justify-center shadow-xs mb-3">
                          <MealIcon className="w-6 h-6 text-[#1D6FD8]" />
                        </div>
                        <p className="font-display text-base font-bold text-[#0B3B78]">
                          {group.name} Rice
                        </p>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs border border-[#DCE6F2] text-[10px] font-bold uppercase tracking-wider text-[#0B3B78] shadow-xs">
                      {count} Varieties
                    </span>
                  </button>

                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <MealIcon className="w-4 h-4 text-[#FF6B1A] shrink-0" />
                        <h4 className="font-display text-lg font-extrabold text-[#0B3B78]">
                          {group.name}
                        </h4>
                      </div>
                      <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                        {group.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMealSelect(group.name)}
                      className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Browse {group.name} Rice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Rice Variety Collections Grid */}
      <div className="space-y-8">
        {visibleMealGroups.map((groupMeta) => {
          const groupCollections = approvedCollections.filter(
            (c) => c.parentGroup === groupMeta.name
          );
          if (groupCollections.length === 0) return null;
          const MealIcon = getRiceMealIcon(groupMeta.name);

          return (
            <div key={groupMeta.slug} className="space-y-4">
              {normalizedMeal === 'All' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#DCE6F2]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] flex items-center justify-center shrink-0">
                      <MealIcon className="w-4 h-4 text-[#1D6FD8]" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-[#0B3B78]">
                        {groupMeta.name} Rice
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        {groupMeta.description}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMealSelect(groupMeta.name)}
                    className="self-start sm:self-center text-xs font-bold text-[#1D6FD8] hover:underline whitespace-nowrap cursor-pointer"
                  >
                    View {groupCollections.length} Varieties →
                  </button>
                </div>
              )}

              {/* 1 complete card per row on mobile, 4 cols on xl desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {groupCollections.map((collection) => {
                  const isActive =
                    activeCollectionSlug &&
                    activeCollectionSlug.toLowerCase() ===
                      collection.slug.toLowerCase();

                  return (
                    <article
                      key={collection.id}
                      className={`group rounded-2xl bg-white border overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                        isActive
                          ? 'border-[#1D6FD8] ring-2 ring-[#1D6FD8]/20 shadow-sm'
                          : 'border-[#DCE6F2]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenCollection(collection)}
                        className="relative w-full aspect-square bg-[#F8FAFC] overflow-hidden block text-left cursor-pointer"
                        aria-label={`View ${collection.name}`}
                      >
                        {collection.image && !failedImageIds[collection.id] ? (
                          <img
                            src={encodeURI(collection.image)}
                            alt={`${collection.name} - ${collection.parentGroup} Rice`}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedImageIds((prev) => ({
                                ...prev,
                                [collection.id]: true,
                              }))
                            }
                            className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F0F6FF] via-[#F8FAFC] to-[#F1F5F9]">
                            <div className="w-16 h-16 rounded-2xl bg-white border border-[#DCE6F2] flex items-center justify-center shadow-xs mb-3">
                              <ImageOff className="w-7 h-7 text-[#1D6FD8]" />
                            </div>
                            <p className="font-display text-sm font-bold text-[#0B3B78]">
                              {collection.name}
                            </p>
                            <p className="text-[11px] font-medium text-[#64748B] mt-1">
                              Image unavailable
                            </p>
                          </div>
                        )}
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs border border-[#DCE6F2] text-[10px] font-bold uppercase tracking-wider text-[#0B3B78] shadow-xs">
                          {collection.parentGroup}
                        </span>
                      </button>

                      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                        <div className="space-y-1.5">
                          <h4 className="font-display text-base font-extrabold text-[#0B3B78] leading-snug">
                            {collection.name}
                          </h4>
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
                              : 'bg-[#F0F6FF] hover:bg-[#0B3B78] text-[#0B3B78] hover:text-white border border-[#DCE6F2] hover:border-[#0B3B78]'
                          }`}
                        >
                          <span>View Collection</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
