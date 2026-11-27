import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Baby,
  Briefcase,
  Crown,
  Footprints,
  Heart,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  FOOTWEAR_GROUPS,
  findFootwearGroupBySlug,
  getFootwearCollectionPath,
} from '../data/footwearCollections';
import type { FootwearCollection, FootwearGroupName } from '../types';

function getFootwearGroupIcon(group: FootwearGroupName) {
  switch (group) {
    case "Men's Footwear":
      return Briefcase;
    case "Women's Footwear":
      return Heart;
    case "Boys' Footwear":
      return Zap;
    case "Girls' Footwear":
      return Sparkles;
    case 'Baby Footwear':
      return Baby;
    case 'Sports & Athletic Footwear':
      return Activity;
    case 'Traditional Footwear':
      return Crown;
    default:
      return Footprints;
  }
}

interface FootwearCollectionsSectionProps {
  selectedGroup?: string; // 'All' | group name | group slug
  activeCollectionSlug?: string;
  onSelectCollection?: (collection: FootwearCollection) => void;
  onSelectGroup?: (group: 'All' | FootwearGroupName) => void;
}

export function FootwearCollectionsSection({
  selectedGroup = 'All',
  activeCollectionSlug,
  onSelectCollection,
  onSelectGroup,
}: FootwearCollectionsSectionProps) {
  const { footwearCollections, navigate } = useStore();
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});

  const approvedCollections = useMemo(
    () =>
      [...footwearCollections]
        .filter((c) => c.status === 'approved')
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [footwearCollections]
  );

  const activeGroupMeta = useMemo(
    () =>
      selectedGroup && selectedGroup !== 'All'
        ? findFootwearGroupBySlug(selectedGroup)
        : undefined,
    [selectedGroup]
  );

  const normalizedGroup: 'All' | FootwearGroupName = activeGroupMeta
    ? activeGroupMeta.name
    : 'All';

  const visibleGroups = useMemo(() => {
    if (normalizedGroup === 'All') {
      return FOOTWEAR_GROUPS;
    }
    return FOOTWEAR_GROUPS.filter((g) => g.name === normalizedGroup);
  }, [normalizedGroup]);

  const countByGroup = useMemo(() => {
    const map: Record<string, number> = {
      All: approvedCollections.length,
    };
    for (const group of FOOTWEAR_GROUPS) {
      map[group.name] = approvedCollections.filter(
        (c) => c.parentGroup === group.name
      ).length;
    }
    return map;
  }, [approvedCollections]);

  const totalVisibleCount =
    normalizedGroup === 'All'
      ? approvedCollections.length
      : countByGroup[normalizedGroup] || 0;

  const handleOpenCollection = (collection: FootwearCollection) => {
    if (onSelectCollection) {
      onSelectCollection(collection);
      return;
    }
    navigate(getFootwearCollectionPath(collection));
  };

  const handleGroupSelect = (group: 'All' | FootwearGroupName) => {
    if (onSelectGroup) {
      onSelectGroup(group);
      return;
    }
    if (group === 'All') {
      navigate('/footwear');
      return;
    }
    const found = FOOTWEAR_GROUPS.find((g) => g.name === group);
    if (found) {
      navigate(`/footwear/${found.slug}`);
    }
  };

  if (approvedCollections.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="footwear-collections-heading"
      className="space-y-6 sm:space-y-8"
    >
      <div className="rounded-2xl bg-white border border-[#DCE6F2] p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
              <Footprints className="w-3.5 h-3.5 text-[#1D6FD8]" />
              <span>Footwear · {FOOTWEAR_GROUPS.length} Organized Groups</span>
            </div>
            <h2
              id="footwear-collections-heading"
              className="font-display text-xl sm:text-2xl font-extrabold text-[#0B3B78]"
            >
              {normalizedGroup === 'All'
                ? `Explore All ${approvedCollections.length} Footwear Collections`
                : normalizedGroup}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              {activeGroupMeta
                ? activeGroupMeta.description
                : "Browse 40 curated footwear collections across Men's, Women's, Boys', Girls', Baby, Sports & Athletic, and Traditional footwear."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1.5 rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] text-xs font-bold text-[#0B3B78] whitespace-nowrap">
              {totalVisibleCount}{' '}
              {totalVisibleCount === 1 ? 'Collection' : 'Collections'}
            </span>
          </div>
        </div>

        {/* 7 Group Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter Footwear collections by group"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={normalizedGroup === 'All'}
            onClick={() => handleGroupSelect('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
              normalizedGroup === 'All'
                ? 'bg-[#0B3B78] text-white shadow-xs'
                : 'bg-[#F8FAFC] border border-[#DCE6F2] text-[#334155] hover:border-[#0B3B78] hover:text-[#0B3B78]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Groups ({countByGroup.All})</span>
          </button>
          {FOOTWEAR_GROUPS.map((group) => {
            const isSelected = normalizedGroup === group.name;
            return (
              <button
                key={group.name}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleGroupSelect(group.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#334155] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#DCE6F2] text-[#334155] hover:border-[#334155] hover:text-[#0B3B78]'
                }`}
              >
                {group.name} ({countByGroup[group.name] || 0})
              </button>
            );
          })}
        </div>
      </div>

      {/* Seven Subcategory Group Sections */}
      <div className="space-y-8">
        {visibleGroups.map((groupMeta, groupIdx) => {
          const groupCollections = approvedCollections.filter(
            (c) => c.parentGroup === groupMeta.name
          );
          if (groupCollections.length === 0) return null;
          const GroupIcon = getFootwearGroupIcon(groupMeta.name);

          return (
            <div key={groupMeta.slug} className="space-y-4">
              {normalizedGroup === 'All' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#DCE6F2]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center shrink-0">
                      <GroupIcon className="w-4 h-4 text-[#334155]" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-[#0B3B78]">
                        Group {groupIdx + 1} — {groupMeta.name}
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        {groupMeta.description}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGroupSelect(groupMeta.name)}
                    className="self-start sm:self-center text-xs font-bold text-[#1D6FD8] hover:underline whitespace-nowrap cursor-pointer"
                  >
                    View {groupCollections.length} Collections →
                  </button>
                </div>
              )}

              {/* Responsive Grid: 1 complete card per row on mobile, 4 cols on desktop */}
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
                        aria-label={`Explore ${collection.name}`}
                      >
                        {collection.image && !failedImageIds[collection.id] ? (
                          <img
                            src={encodeURI(collection.image)}
                            alt={`${collection.name} - ${collection.parentGroup}`}
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
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F1F5F9] via-[#F8FAFC] to-[#EFF6FF]">
                            <div className="w-16 h-16 rounded-2xl bg-white border border-[#CBD5E1] flex items-center justify-center shadow-xs mb-3">
                              <GroupIcon className="w-7 h-7 text-[#334155]" />
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
                              : 'bg-[#F1F5F9] hover:bg-[#0B3B78] text-[#0B3B78] hover:text-white border border-[#CBD5E1] hover:border-[#0B3B78]'
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
