import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BatteryCharging,
  Camera,
  Cpu,
  Gamepad2,
  HardDrive,
  Headphones,
  Keyboard,
  Layers,
  Lightbulb,
  Link2,
  Smartphone,
  Watch,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  ELECTRONICS_PARENT_GROUPS,
  electronicsCollectionBelongsToGroup,
  getElectronicsCollectionPath,
} from '../data/electronicsCollections';
import type {
  ElectronicsCollection,
  ElectronicsGroupCategory,
} from '../types';

function getElectronicsGroupIcon(group: ElectronicsGroupCategory) {
  switch (group) {
    case 'Smartphones & Tablets':
      return Smartphone;
    case 'Audio Devices':
      return Headphones;
    case 'Smartwatches & Wearables':
      return Watch;
    case 'Charging & Power':
      return BatteryCharging;
    case 'Computer Accessories':
      return Keyboard;
    case 'Storage Devices':
      return HardDrive;
    case 'Mobile Accessories':
      return Smartphone;
    case 'Gaming Accessories':
      return Gamepad2;
    case 'Cameras & Accessories':
      return Camera;
    case 'Home Electronics':
      return Lightbulb;
    default:
      return Cpu;
  }
}

interface ElectronicsCollectionsSectionProps {
  selectedGroup?: string; // 'All' | 'Smartphones & Tablets' | ... | 'Home Electronics'
  activeCollectionSlug?: string;
  onSelectCollection?: (collection: ElectronicsCollection) => void;
  onSelectGroup?: (group: 'All' | ElectronicsGroupCategory) => void;
}

export function ElectronicsCollectionsSection({
  selectedGroup = 'All',
  activeCollectionSlug,
  onSelectCollection,
  onSelectGroup,
}: ElectronicsCollectionsSectionProps) {
  const { electronicsCollections, navigate } = useStore();
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});

  const approvedCollections = useMemo(
    () =>
      [...electronicsCollections]
        .filter((c) => c.status === 'approved')
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [electronicsCollections]
  );

  const activeGroupMeta = useMemo(() => {
    const clean = (selectedGroup || 'All').toLowerCase().trim();
    return ELECTRONICS_PARENT_GROUPS.find(
      (g) =>
        g.name.toLowerCase() === clean ||
        g.slug === clean ||
        g.folder === clean
    );
  }, [selectedGroup]);

  const normalizedGroup: 'All' | ElectronicsGroupCategory = activeGroupMeta
    ? activeGroupMeta.name
    : 'All';

  const visibleCollections = useMemo(() => {
    if (normalizedGroup === 'All') {
      return approvedCollections;
    }
    return approvedCollections.filter((c) =>
      electronicsCollectionBelongsToGroup(c, normalizedGroup)
    );
  }, [approvedCollections, normalizedGroup]);

  const countByGroup = useMemo(() => {
    const map: Record<string, number> = {
      All: approvedCollections.length,
    };
    for (const group of ELECTRONICS_PARENT_GROUPS) {
      map[group.name] = approvedCollections.filter((c) =>
        electronicsCollectionBelongsToGroup(c, group.name)
      ).length;
    }
    return map;
  }, [approvedCollections]);

  const handleOpenCollection = (collection: ElectronicsCollection) => {
    if (onSelectCollection) {
      onSelectCollection(collection);
      return;
    }
    navigate(
      getElectronicsCollectionPath(collection, activeGroupMeta?.slug)
    );
  };

  const handleGroupFilter = (group: 'All' | ElectronicsGroupCategory) => {
    if (onSelectGroup) {
      onSelectGroup(group);
      return;
    }
    if (group === 'All') {
      navigate('/electronics');
      return;
    }
    const found = ELECTRONICS_PARENT_GROUPS.find((g) => g.name === group);
    if (found) {
      navigate(`/electronics/${found.slug}`);
    }
  };

  if (approvedCollections.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="electronics-collections-heading"
      className="space-y-4 sm:space-y-6"
    >
      <div className="rounded-2xl bg-white border border-[#DCE6F2] p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1D6FD8] mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Electronics Department Directory · 10 Organized Groups</span>
            </div>
            <h2
              id="electronics-collections-heading"
              className="font-display text-xl sm:text-2xl font-extrabold text-[#0B3B78]"
            >
              {normalizedGroup === 'All'
                ? `Explore All ${approvedCollections.length} Electronics Collections`
                : normalizedGroup}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              {activeGroupMeta
                ? activeGroupMeta.description
                : 'Browse 47 distinct device and accessory collections across 10 Electronics groups (48 navigation placements with shared Gaming Headsets).'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#0B3B78] whitespace-nowrap">
              {visibleCollections.length}{' '}
              {visibleCollections.length === 1 ? 'Collection' : 'Collections'}
            </span>
          </div>
        </div>

        {/* 10 Electronics Group Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter Electronics collections by group"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={normalizedGroup === 'All'}
            onClick={() => handleGroupFilter('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
              normalizedGroup === 'All'
                ? 'bg-[#0B3B78] text-white shadow-xs'
                : 'bg-[#F8FAFC] border border-[#DCE6F2] text-[#334155] hover:border-[#0B3B78] hover:text-[#0B3B78]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All ({countByGroup.All})</span>
          </button>
          {ELECTRONICS_PARENT_GROUPS.map((group) => {
            const isSelected = normalizedGroup === group.name;
            return (
              <button
                key={group.name}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleGroupFilter(group.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#1D6FD8] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#DCE6F2] text-[#334155] hover:border-[#1D6FD8] hover:text-[#0B3B78]'
                }`}
              >
                {group.name} ({countByGroup[group.name] || 0})
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
          const isSharedCanonical =
            Boolean(collection.additionalGroups?.length) &&
            normalizedGroup !== 'All' &&
            collection.parentGroup !== normalizedGroup;
          const badgeGroup = isSharedCanonical
            ? normalizedGroup
            : collection.parentGroup;
          const GroupIcon = getElectronicsGroupIcon(badgeGroup);

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
                    alt={`${collection.name} - ${badgeGroup}`}
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
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#E2E8F0]/50">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-[#BFDBFE] flex items-center justify-center shadow-xs mb-3">
                      <GroupIcon className="w-7 h-7 text-[#1D6FD8]" />
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
                  {badgeGroup}
                </span>
                {collection.additionalGroups &&
                  collection.additionalGroups.length > 0 && (
                    <span
                      title={`Canonical collection also featured in ${collection.additionalGroups.join(', ')}`}
                      className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-white/95 border border-[#BFDBFE] text-[10px] font-semibold text-[#1D6FD8] inline-flex items-center gap-1 shadow-xs"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>Also in Gaming</span>
                    </span>
                  )}
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
                      : 'bg-[#EFF6FF] hover:bg-[#1D6FD8] text-[#0B3B78] hover:text-white border border-[#BFDBFE] hover:border-[#1D6FD8]'
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
