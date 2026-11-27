import { useMemo, useState } from 'react';
import { ArrowRight, Layers, Nut, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  NUT_VARIETY_GROUPS,
  getNutCollectionPath,
  type NutVarietyGroup,
} from '../data/nutsCollections';
import type { NutCollection } from '../types';

interface NutsCollectionsSectionProps {
  activeCollectionSlug?: string;
  onSelectCollection?: (collection: NutCollection) => void;
}

export function NutsCollectionsSection({
  activeCollectionSlug,
  onSelectCollection,
}: NutsCollectionsSectionProps) {
  const { nutsCollections, navigate } = useStore();
  const [selectedGroup, setSelectedGroup] = useState<'All' | NutVarietyGroup>('All');
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});

  const approvedCollections = useMemo(
    () =>
      [...nutsCollections]
        .filter((c) => c.status === 'approved')
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [nutsCollections]
  );

  const visibleCollections = useMemo(() => {
    if (selectedGroup === 'All') {
      return approvedCollections;
    }
    return approvedCollections.filter((c) => c.varietyGroup === selectedGroup);
  }, [approvedCollections, selectedGroup]);

  const countByGroup = useMemo(() => {
    const map: Record<string, number> = {
      All: approvedCollections.length,
    };
    for (const group of NUT_VARIETY_GROUPS) {
      map[group] = approvedCollections.filter(
        (c) => c.varietyGroup === group
      ).length;
    }
    return map;
  }, [approvedCollections]);

  const handleOpenCollection = (collection: NutCollection) => {
    if (onSelectCollection) {
      onSelectCollection(collection);
      return;
    }
    navigate(getNutCollectionPath(collection));
  };

  if (approvedCollections.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="nuts-collections-heading"
      className="space-y-4 sm:space-y-6"
    >
      <div className="rounded-2xl bg-white border border-[#DCE6F2] p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#B45309] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" />
              <span>Nuts Department · {approvedCollections.length} Varieties</span>
            </div>
            <h2
              id="nuts-collections-heading"
              className="font-display text-xl sm:text-2xl font-extrabold text-[#0B3B78]"
            >
              {selectedGroup === 'All'
                ? `Explore All ${approvedCollections.length} Nut Varieties`
                : selectedGroup}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              Standalone Nuts department spanning classic tree nuts, groundnuts, and gourmet specialty kernels — separate from Dried Fruits, Dried Peas, Groceries, and Millets.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs font-bold text-[#92400E] whitespace-nowrap">
              {visibleCollections.length}{' '}
              {visibleCollections.length === 1 ? 'Variety' : 'Varieties'}
            </span>
          </div>
        </div>

        {/* Variety Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter Nuts varieties"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedGroup === 'All'}
            onClick={() => setSelectedGroup('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
              selectedGroup === 'All'
                ? 'bg-[#0B3B78] text-white shadow-xs'
                : 'bg-[#F8FAFC] border border-[#DCE6F2] text-[#334155] hover:border-[#0B3B78] hover:text-[#0B3B78]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All ({countByGroup.All})</span>
          </button>
          {NUT_VARIETY_GROUPS.map((group) => {
            const isSelected = selectedGroup === group;
            return (
              <button
                key={group}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedGroup(group)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#D97706] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#DCE6F2] text-[#334155] hover:border-[#D97706] hover:text-[#92400E]'
                }`}
              >
                {group} ({countByGroup[group] || 0})
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Grid: 1 full collection card per row on mobile */}
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
                  ? 'border-[#D97706] ring-2 ring-[#D97706]/20 shadow-sm'
                  : 'border-[#DCE6F2]'
              }`}
            >
              <button
                type="button"
                onClick={() => handleOpenCollection(collection)}
                className="relative w-full aspect-square bg-[#F8FAFC] overflow-hidden block text-left cursor-pointer"
                aria-label={`Explore ${collection.name}`}
              >
                {collection.image && !failedImageIds[collection.id] ? (
                  <img
                    src={encodeURI(collection.image)}
                    alt={`${collection.name} - Nuts`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImageIds((prev) => ({
                        ...prev,
                        [collection.id]: true,
                      }))
                    }
                    className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FFFBEB] via-[#F8FAFC] to-[#F1F5F9]">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-[#FDE68A] flex items-center justify-center shadow-xs mb-3">
                      <Nut className="w-7 h-7 text-[#B45309]" />
                    </div>
                    <p className="font-display text-sm font-bold text-[#0B3B78]">
                      {collection.name}
                    </p>
                    <p className="text-[11px] font-medium text-[#64748B] mt-1">
                      Photo pending upload
                    </p>
                  </div>
                )}
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
                      : 'bg-[#FFFBEB] hover:bg-[#D97706] text-[#92400E] hover:text-white border border-[#FDE68A] hover:border-[#D97706]'
                  }`}
                >
                  <span>Explore Variety</span>
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
