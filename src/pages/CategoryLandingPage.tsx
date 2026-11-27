import { useState, useMemo, useEffect } from 'react';
import { Sparkles, ShoppingBag, ImageOff } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category3DShowcase } from '../components/Category3DShowcase';
import { ProductCard } from '../components/ProductCard';
import { MensFashionCollectionsSection } from '../components/MensFashionCollectionsSection';
import { WomensFashionCollectionsSection } from '../components/WomensFashionCollectionsSection';
import { ElectronicsCollectionsSection } from '../components/ElectronicsCollectionsSection';
import { DriedFruitsCollectionsSection } from '../components/DriedFruitsCollectionsSection';
import { NutsCollectionsSection } from '../components/NutsCollectionsSection';
import { SkinCareCollectionsSection } from '../components/SkinCareCollectionsSection';
import { HairCareCollectionsSection } from '../components/HairCareCollectionsSection';
import { FurnitureCollectionsSection } from '../components/FurnitureCollectionsSection';
import { DriedPeasCollectionsSection } from '../components/DriedPeasCollectionsSection';
import { PranksNoveltiesCollectionsSection } from '../components/PranksNoveltiesCollectionsSection';
import { FitnessGymCollectionsSection } from '../components/FitnessGymCollectionsSection';
import { AccessoriesCollectionsSection } from '../components/AccessoriesCollectionsSection';
import { SportsCollectionsSection } from '../components/SportsCollectionsSection';
import { FootwearCollectionsSection } from '../components/FootwearCollectionsSection';
import { TeenagersCollectionsSection } from '../components/TeenagersCollectionsSection';
import { KidsCollectionsSection } from '../components/KidsCollectionsSection';
import { RiceCollectionsSection } from '../components/RiceCollectionsSection';
import {
  MAIN_CATEGORY_DEFINITIONS,
  getCategoryBySlug,
  getCategoryDisplayName,
  getSubcategoryDisplayName,
  productMatchesFilter,
} from '../data/categoryHierarchy';
import {
  findMensFashionCollection,
  findMensFashionParentBySlug,
  productMatchesMensFashionCollection,
} from '../data/mensFashionCollections';
import {
  findWomensFashionCollection,
  findWomensFashionParentBySlug,
  productMatchesWomensFashionCollection,
} from '../data/womensFashionCollections';
import {
  findElectronicsCollection,
  findElectronicsGroupBySlug,
  productMatchesElectronicsCollection,
} from '../data/electronicsCollections';
import {
  findDriedFruitCollection,
  productMatchesDriedFruitCollection,
} from '../data/driedFruitsCollections';
import {
  findNutCollection,
  productMatchesNutCollection,
} from '../data/nutsCollections';
import {
  findSkinCareCollection,
  findSkinCareGroupBySlug,
  productMatchesSkinCareCollection,
} from '../data/skinCareCollections';
import {
  findHairCareCollection,
  findHairCareGroupBySlug,
  productMatchesHairCareCollection,
} from '../data/hairCareCollections';
import {
  findFurnitureCollection,
  findFurnitureGroupBySlug,
  productMatchesFurnitureCollection,
} from '../data/furnitureCollections';
import {
  findDriedPeasCollection,
  findDriedPeasGroupBySlug,
  productMatchesDriedPeasCollection,
} from '../data/driedPeasCollections';
import {
  findPranksNoveltiesCollection,
  findPranksNoveltiesGroupBySlug,
  productMatchesPranksNoveltiesCollection,
} from '../data/pranksNoveltiesCollections';
import {
  findFitnessGymCollection,
  findFitnessGymGroupBySlug,
  productMatchesFitnessGymCollection,
} from '../data/fitnessGymCollections';
import {
  findAccessoriesCollection,
  findAccessoriesGroupBySlug,
  productMatchesAccessoriesCollection,
} from '../data/accessoriesCollections';
import {
  findSportsCollection,
  findSportsGroupBySlug,
  productMatchesSportsCollection,
} from '../data/sportsCollections';
import {
  findFootwearCollection,
  findFootwearGroupBySlug,
  productMatchesFootwearCollection,
} from '../data/footwearCollections';
import {
  findTeenagersCollection,
  findTeenagersGroupBySlug,
  productMatchesTeenagersCollection,
} from '../data/teenagersCollections';
import {
  findKidsCollection,
  findKidsGroupBySlug,
  productMatchesKidsCollection,
} from '../data/kidsCollections';
import {
  findRiceCollection,
  findRiceMealGroupBySlug,
  productMatchesRiceCollection,
} from '../data/riceCollections';
import { filterAndSortProducts } from '../utils/catalogSearch';
import { isFashionClothingProduct } from '../utils/fashionUtils';
import { resolveCategoryFallbackImage } from '../three/resolveProductGlb';
import type { ProductCategory } from '../types';

interface CategoryLandingPageProps {
  category: ProductCategory | string;
  subCategoryInit?: string;
  thirdCategoryInit?: string;
  fourthCategoryInit?: string;
  collectionSlugInit?: string;
}

export function CategoryLandingPage({
  category,
  subCategoryInit,
  thirdCategoryInit,
  fourthCategoryInit,
  collectionSlugInit,
}: CategoryLandingPageProps) {
  const {
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
    banners,
    navigate,
  } = useStore();

  // Find category info from definitions or dynamic runtime categories
  const catInfo = useMemo(() => {
    return (
      getCategoryBySlug(String(category), categories) ||
      categories.find(
        (c) =>
          c.id.toLowerCase() === String(category).toLowerCase() ||
          c.slug.toLowerCase() === String(category).toLowerCase()
      ) ||
      MAIN_CATEGORY_DEFINITIONS[0]
    );
  }, [category, categories]);

  const [selectedSub, setSelectedSub] = useState<string>(subCategoryInit || 'All');
  const [selectedThird, setSelectedThird] = useState<string>(
    thirdCategoryInit || 'All'
  );
  const [selectedFourth, setSelectedFourth] = useState<string>(
    fourthCategoryInit || 'All'
  );

  const isFashion = catInfo.id.toLowerCase() === 'fashion';
  const isElectronics = catInfo.id.toLowerCase() === 'electronics';
  const isDriedFruits =
    catInfo.id.toLowerCase() === 'dry fruits' ||
    catInfo.id.toLowerCase() === 'dried fruits';
  const isNuts =
    catInfo.id.toLowerCase() === 'dry nuts' ||
    catInfo.id.toLowerCase() === 'nuts';
  const isSkinCare = catInfo.id.toLowerCase() === 'skin care';
  const isHairCare = catInfo.id.toLowerCase() === 'hair care';
  const isFurniture = catInfo.id.toLowerCase() === 'furniture';
  const isDriedPeas =
    catInfo.id.toLowerCase() === 'dry peas' ||
    catInfo.id.toLowerCase() === 'dried peas';
  const isPranksNovelties =
    catInfo.id.toLowerCase() === 'prank items' ||
    catInfo.id.toLowerCase() === 'pranks & novelties' ||
    catInfo.id.toLowerCase() === 'pranks-novelties';
  const isFitnessGym =
    catInfo.id.toLowerCase() === 'gym' ||
    catInfo.id.toLowerCase() === 'fitness & gym' ||
    catInfo.id.toLowerCase() === 'fitness-gym';
  const isAccessories =
    catInfo.id.toLowerCase() === 'accessories' ||
    catInfo.id.toLowerCase() === 'watches';
  const isSports = catInfo.id.toLowerCase() === 'sports';
  const isFootwear = catInfo.id.toLowerCase() === 'footwear';
  const isTeenagers =
    catInfo.id.toLowerCase() === 'teenager' ||
    catInfo.id.toLowerCase() === 'teenagers';
  const isKids = catInfo.id.toLowerCase() === 'kids';
  const isGroceries =
    catInfo.id.toLowerCase() === 'groceries' ||
    catInfo.id.toLowerCase() === 'grocery';
  const isRiceSub = isGroceries && selectedSub.toLowerCase() === 'rice';

  useEffect(() => {
    setSelectedSub(subCategoryInit || 'All');
    setSelectedThird(thirdCategoryInit || 'All');
    setSelectedFourth(fourthCategoryInit || 'All');
  }, [catInfo.id, subCategoryInit, thirdCategoryInit, fourthCategoryInit]);

  const activeSubCatInfo = useMemo(() => {
    if (selectedSub === 'All') return null;
    const subLower = selectedSub.toLowerCase().trim();
    return (
      categories.find(
        (c) =>
          (c.parentCategoryId?.toLowerCase() === catInfo.id.toLowerCase() ||
            c.parentId?.toLowerCase() === catInfo.id.toLowerCase()) &&
          (c.name?.toLowerCase() === subLower ||
            c.id.toLowerCase() === subLower ||
            c.slug.toLowerCase() === subLower)
      ) || null
    );
  }, [categories, catInfo.id, selectedSub]);

  const activeDisplayCat = activeSubCatInfo || catInfo;

  const displayName =
    catInfo.name || getCategoryDisplayName(catInfo.id, categories);

  const activeLeafFilter =
    selectedFourth !== 'All' ? selectedFourth : selectedThird;

  const isWomensFashionSub =
    isFashion && selectedSub.toLowerCase().includes('women');

  const activeMensCollection = useMemo(() => {
    if (!isFashion || isWomensFashionSub || !collectionSlugInit) {
      return undefined;
    }
    return findMensFashionCollection(mensFashionCollections, collectionSlugInit);
  }, [isFashion, isWomensFashionSub, collectionSlugInit, mensFashionCollections]);

  const activeWomensCollection = useMemo(() => {
    if (!isWomensFashionSub || !collectionSlugInit) {
      return undefined;
    }
    return findWomensFashionCollection(
      womensFashionCollections,
      collectionSlugInit,
      selectedThird !== 'All' ? selectedThird : undefined
    );
  }, [
    isWomensFashionSub,
    collectionSlugInit,
    womensFashionCollections,
    selectedThird,
  ]);

  const activeElectronicsGroup = useMemo(() => {
    if (!isElectronics || selectedSub === 'All') {
      return undefined;
    }
    return findElectronicsGroupBySlug(selectedSub);
  }, [isElectronics, selectedSub]);

  const activeElectronicsCollection = useMemo(() => {
    if (!isElectronics || !collectionSlugInit) {
      return undefined;
    }
    return findElectronicsCollection(
      electronicsCollections,
      collectionSlugInit,
      selectedSub !== 'All' ? selectedSub : undefined
    );
  }, [isElectronics, collectionSlugInit, electronicsCollections, selectedSub]);

  const activeDriedFruitCollection = useMemo(() => {
    if (!isDriedFruits || !collectionSlugInit) {
      return undefined;
    }
    return findDriedFruitCollection(driedFruitsCollections, collectionSlugInit);
  }, [isDriedFruits, collectionSlugInit, driedFruitsCollections]);

  const activeNutCollection = useMemo(() => {
    if (!isNuts || !collectionSlugInit) {
      return undefined;
    }
    return findNutCollection(nutsCollections, collectionSlugInit);
  }, [isNuts, collectionSlugInit, nutsCollections]);

  const activeSkinCareGroup = useMemo(() => {
    if (!isSkinCare || selectedSub === 'All') {
      return undefined;
    }
    return findSkinCareGroupBySlug(selectedSub);
  }, [isSkinCare, selectedSub]);

  const activeSkinCareCollection = useMemo(() => {
    if (!isSkinCare || !collectionSlugInit) {
      return undefined;
    }
    return findSkinCareCollection(
      skinCareCollections,
      collectionSlugInit,
      selectedSub !== 'All' ? selectedSub : undefined
    );
  }, [isSkinCare, collectionSlugInit, skinCareCollections, selectedSub]);

  const activeHairCareGroup = useMemo(() => {
    if (!isHairCare || selectedSub === 'All') {
      return undefined;
    }
    return findHairCareGroupBySlug(selectedSub);
  }, [isHairCare, selectedSub]);

  const activeHairCareCollection = useMemo(() => {
    if (!isHairCare || !collectionSlugInit) {
      return undefined;
    }
    return findHairCareCollection(
      hairCareCollections,
      collectionSlugInit,
      selectedSub !== 'All' ? selectedSub : undefined
    );
  }, [isHairCare, collectionSlugInit, hairCareCollections, selectedSub]);

  const activeFurnitureGroup = useMemo(() => {
    if (!isFurniture || selectedSub === 'All') {
      return undefined;
    }
    return findFurnitureGroupBySlug(selectedSub);
  }, [isFurniture, selectedSub]);

  const activeFurnitureCollection = useMemo(() => {
    if (!isFurniture || !collectionSlugInit) {
      return undefined;
    }
    return findFurnitureCollection(
      furnitureCollections,
      collectionSlugInit,
      selectedSub !== 'All' ? selectedSub : undefined
    );
  }, [isFurniture, collectionSlugInit, furnitureCollections, selectedSub]);

  const activeDriedPeasGroup = useMemo(() => {
    if (!isDriedPeas || selectedSub === 'All') {
      return undefined;
    }
    return findDriedPeasGroupBySlug(selectedSub);
  }, [isDriedPeas, selectedSub]);

  const activeDriedPeasCollection = useMemo(() => {
    if (!isDriedPeas || !collectionSlugInit) {
      return undefined;
    }
    return findDriedPeasCollection(
      driedPeasCollections,
      collectionSlugInit,
      selectedSub !== 'All' ? selectedSub : undefined
    );
  }, [isDriedPeas, collectionSlugInit, driedPeasCollections, selectedSub]);

  const activePranksNoveltiesGroup = useMemo(() => {
    if (!isPranksNovelties || selectedSub === 'All') {
      return undefined;
    }
    return findPranksNoveltiesGroupBySlug(selectedSub);
  }, [isPranksNovelties, selectedSub]);

  const activePranksNoveltiesCollection = useMemo(() => {
    if (!isPranksNovelties || !collectionSlugInit) {
      return undefined;
    }
    return findPranksNoveltiesCollection(
      pranksNoveltiesCollections,
      collectionSlugInit,
      selectedSub !== 'All' ? selectedSub : undefined
    );
  }, [isPranksNovelties, collectionSlugInit, pranksNoveltiesCollections, selectedSub]);

  const activeFitnessGymGroup = useMemo(() => {
    if (!isFitnessGym || selectedSub === 'All') {
      return undefined;
    }
    return findFitnessGymGroupBySlug(selectedSub);
  }, [isFitnessGym, selectedSub]);

  const activeFitnessGymCollection = useMemo(() => {
    if (!isFitnessGym || !collectionSlugInit) {
      return undefined;
    }
    return findFitnessGymCollection(
      fitnessGymCollections,
      collectionSlugInit,
      selectedSub !== 'All' ? selectedSub : undefined
    );
  }, [isFitnessGym, collectionSlugInit, fitnessGymCollections, selectedSub]);

  const activeAccessoriesGroup = useMemo(() => {
    if (!isAccessories || selectedSub === 'All') {
      return undefined;
    }
    return findAccessoriesGroupBySlug(selectedSub);
  }, [isAccessories, selectedSub]);

  const activeAccessoriesCollection = useMemo(() => {
    if (!isAccessories || !collectionSlugInit) {
      return undefined;
    }
    return findAccessoriesCollection(
      accessoriesCollections,
      collectionSlugInit,
      selectedSub !== 'All' ? selectedSub : undefined
    );
  }, [isAccessories, collectionSlugInit, accessoriesCollections, selectedSub]);

  const activeSportsGroup = useMemo(() => {
    if (!isSports || selectedSub === 'All') {
      return undefined;
    }
    return findSportsGroupBySlug(selectedSub);
  }, [isSports, selectedSub]);

  const activeSportsCollection = useMemo(() => {
    if (!isSports || !collectionSlugInit) {
      return undefined;
    }
    return findSportsCollection(
      sportsCollections,
      collectionSlugInit,
      selectedSub !== 'All' ? selectedSub : undefined
    );
  }, [isSports, collectionSlugInit, sportsCollections, selectedSub]);

  const activeFootwearGroup = useMemo(() => {
    if (!isFootwear || selectedSub === 'All') {
      return undefined;
    }
    return findFootwearGroupBySlug(selectedSub);
  }, [isFootwear, selectedSub]);

  const activeFootwearCollection = useMemo(() => {
    if (!isFootwear || !collectionSlugInit) {
      return undefined;
    }
    return findFootwearCollection(
      footwearCollections,
      collectionSlugInit,
      selectedSub !== 'All' ? selectedSub : undefined
    );
  }, [isFootwear, collectionSlugInit, footwearCollections, selectedSub]);

  const activeTeenagersGroup = useMemo(() => {
    if (!isTeenagers || selectedSub === 'All') {
      return undefined;
    }
    return findTeenagersGroupBySlug(selectedSub);
  }, [isTeenagers, selectedSub]);

  const activeTeenagersCollection = useMemo(() => {
    if (!isTeenagers || !collectionSlugInit) {
      return undefined;
    }
    return findTeenagersCollection(
      collectionSlugInit,
      teenagersCollections,
      selectedSub !== 'All' ? selectedSub : undefined
    );
  }, [isTeenagers, collectionSlugInit, teenagersCollections, selectedSub]);

  const activeKidsGroup = useMemo(() => {
    if (!isKids || selectedSub === 'All') {
      return undefined;
    }
    return findKidsGroupBySlug(selectedSub);
  }, [isKids, selectedSub]);

  const activeKidsCollection = useMemo(() => {
    if (!isKids || !collectionSlugInit) {
      return undefined;
    }
    return findKidsCollection(
      collectionSlugInit,
      kidsCollections,
      selectedSub !== 'All' ? selectedSub : undefined
    );
  }, [isKids, collectionSlugInit, kidsCollections, selectedSub]);

  const activeRiceMealGroup = useMemo(() => {
    if (!isRiceSub || selectedThird === 'All') {
      return undefined;
    }
    return findRiceMealGroupBySlug(selectedThird);
  }, [isRiceSub, selectedThird]);

  const activeRiceCollection = useMemo(() => {
    if (!isRiceSub || !collectionSlugInit) {
      return undefined;
    }
    return findRiceCollection(
      collectionSlugInit,
      activeRiceMealGroup?.name ||
        (selectedThird !== 'All' ? selectedThird : undefined)
    );
  }, [isRiceSub, collectionSlugInit, activeRiceMealGroup, selectedThird]);

  const activeStyleCollection = activeMensCollection || activeWomensCollection;
  const activeCollection =
    activeStyleCollection ||
    activeElectronicsCollection ||
    activeDriedFruitCollection ||
    activeNutCollection ||
    activeSkinCareCollection ||
    activeHairCareCollection ||
    activeFurnitureCollection ||
    activeDriedPeasCollection ||
    activePranksNoveltiesCollection ||
    activeFitnessGymCollection ||
    activeAccessoriesCollection ||
    activeSportsCollection ||
    activeFootwearCollection ||
    activeTeenagersCollection ||
    activeKidsCollection ||
    activeRiceCollection;

  useEffect(() => {
    if (activeMensCollection) {
      document.title = `${activeMensCollection.name} · Men's ${activeMensCollection.parentCategory} | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeMensCollection.description) {
        metaDesc.setAttribute('content', activeMensCollection.description);
      }
      return;
    }
    if (activeWomensCollection) {
      document.title = `${activeWomensCollection.name} · Women's ${activeWomensCollection.parentCategory} | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeWomensCollection.description) {
        metaDesc.setAttribute('content', activeWomensCollection.description);
      }
      return;
    }
    if (activeElectronicsCollection) {
      const groupName =
        activeElectronicsGroup?.name || activeElectronicsCollection.parentGroup;
      document.title = `${activeElectronicsCollection.name} · ${groupName} · Electronics | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeElectronicsCollection.description) {
        metaDesc.setAttribute('content', activeElectronicsCollection.description);
      }
      return;
    }
    if (activeDriedFruitCollection) {
      document.title = `${activeDriedFruitCollection.name} · Dried Fruits | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeDriedFruitCollection.description) {
        metaDesc.setAttribute('content', activeDriedFruitCollection.description);
      }
      return;
    }
    if (activeNutCollection) {
      document.title = `${activeNutCollection.name} · Nuts | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeNutCollection.description) {
        metaDesc.setAttribute('content', activeNutCollection.description);
      }
      return;
    }
    if (activeSkinCareCollection) {
      const groupName =
        activeSkinCareGroup?.name || activeSkinCareCollection.parentGroup;
      document.title = `${activeSkinCareCollection.name} · ${groupName} · Skin Care | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeSkinCareCollection.description) {
        metaDesc.setAttribute('content', activeSkinCareCollection.description);
      }
      return;
    }
    if (activeHairCareCollection) {
      const groupName =
        activeHairCareGroup?.name || activeHairCareCollection.parentGroup;
      document.title = `${activeHairCareCollection.name} · ${groupName} · Hair Care | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeHairCareCollection.description) {
        metaDesc.setAttribute('content', activeHairCareCollection.description);
      }
      return;
    }
    if (activeFurnitureCollection) {
      const groupName =
        activeFurnitureGroup?.name || activeFurnitureCollection.parentGroup;
      document.title = `${activeFurnitureCollection.name} · ${groupName} · Furniture | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeFurnitureCollection.description) {
        metaDesc.setAttribute('content', activeFurnitureCollection.description);
      }
      return;
    }
    if (activeDriedPeasCollection) {
      const groupName =
        activeDriedPeasGroup?.name || activeDriedPeasCollection.parentGroup;
      document.title = `${activeDriedPeasCollection.name} · ${groupName} · Dried Peas | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeDriedPeasCollection.description) {
        metaDesc.setAttribute('content', activeDriedPeasCollection.description);
      }
      return;
    }
    if (activePranksNoveltiesCollection) {
      const groupName =
        activePranksNoveltiesGroup?.name ||
        activePranksNoveltiesCollection.parentGroup;
      document.title = `${activePranksNoveltiesCollection.name} · ${groupName} · Pranks & Novelties | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activePranksNoveltiesCollection.description) {
        metaDesc.setAttribute(
          'content',
          activePranksNoveltiesCollection.description
        );
      }
      return;
    }
    if (activeFitnessGymCollection) {
      const groupName =
        activeFitnessGymGroup?.name ||
        activeFitnessGymCollection.parentGroup;
      document.title = `${activeFitnessGymCollection.name} · ${groupName} · Fitness & Gym | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeFitnessGymCollection.description) {
        metaDesc.setAttribute(
          'content',
          activeFitnessGymCollection.description
        );
      }
      return;
    }
    if (activeAccessoriesCollection) {
      const groupName =
        activeAccessoriesGroup?.name ||
        activeAccessoriesCollection.parentGroup;
      document.title = `${activeAccessoriesCollection.name} · ${groupName} · Accessories | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeAccessoriesCollection.description) {
        metaDesc.setAttribute(
          'content',
          activeAccessoriesCollection.description
        );
      }
      return;
    }
    if (activeSportsCollection) {
      const groupName =
        activeSportsGroup?.name ||
        activeSportsCollection.parentGroup;
      document.title = `${activeSportsCollection.name} · ${groupName} · Sports | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeSportsCollection.description) {
        metaDesc.setAttribute(
          'content',
          activeSportsCollection.description
        );
      }
      return;
    }
    if (activeFootwearCollection) {
      const groupName =
        activeFootwearGroup?.name ||
        activeFootwearCollection.parentGroup;
      document.title = `${activeFootwearCollection.name} · ${groupName} · Footwear | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeFootwearCollection.description) {
        metaDesc.setAttribute(
          'content',
          activeFootwearCollection.description
        );
      }
      return;
    }
    if (activeTeenagersCollection) {
      const groupName =
        activeTeenagersGroup?.name ||
        activeTeenagersCollection.parentGroup;
      document.title = `${activeTeenagersCollection.name} · ${groupName} · Teenagers | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeTeenagersCollection.description) {
        metaDesc.setAttribute(
          'content',
          activeTeenagersCollection.description
        );
      }
      return;
    }
    if (activeKidsCollection) {
      const groupName =
        activeKidsGroup?.name ||
        activeKidsCollection.parentGroup;
      document.title = `${activeKidsCollection.name} · ${groupName} · Kids | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeKidsCollection.description) {
        metaDesc.setAttribute(
          'content',
          activeKidsCollection.description
        );
      }
      return;
    }
    if (activeRiceCollection) {
      document.title = `${activeRiceCollection.name} · ${activeRiceCollection.parentGroup} Rice · Groceries | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeRiceCollection.description) {
        metaDesc.setAttribute('content', activeRiceCollection.description);
      }
      return;
    }
    if (isRiceSub && activeRiceMealGroup) {
      document.title = `${activeRiceMealGroup.name} Rice · Groceries | KubreeBazzar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && activeRiceMealGroup.description) {
        metaDesc.setAttribute('content', activeRiceMealGroup.description);
      }
      return;
    }
    const subLabel =
      selectedSub !== 'All' ? ` - ${getSubcategoryDisplayName(selectedSub)}` : '';
    const thirdLabel = selectedThird !== 'All' ? ` · ${selectedThird}` : '';
    const fourthLabel = selectedFourth !== 'All' ? ` · ${selectedFourth}` : '';
    document.title = `${activeDisplayCat.title || displayName}${subLabel}${thirdLabel}${fourthLabel} | KubreeBazzar`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && activeDisplayCat.description) {
      metaDesc.setAttribute('content', activeDisplayCat.description);
    }
  }, [
    activeMensCollection,
    activeWomensCollection,
    activeElectronicsCollection,
    activeElectronicsGroup,
    activeDriedFruitCollection,
    activeNutCollection,
    activeSkinCareCollection,
    activeSkinCareGroup,
    activeHairCareCollection,
    activeHairCareGroup,
    activeFurnitureCollection,
    activeFurnitureGroup,
    activeDriedPeasCollection,
    activeDriedPeasGroup,
    activePranksNoveltiesCollection,
    activePranksNoveltiesGroup,
    activeFitnessGymCollection,
    activeFitnessGymGroup,
    activeAccessoriesCollection,
    activeAccessoriesGroup,
    activeSportsCollection,
    activeSportsGroup,
    activeFootwearCollection,
    activeFootwearGroup,
    activeTeenagersCollection,
    activeTeenagersGroup,
    activeKidsCollection,
    activeKidsGroup,
    activeRiceCollection,
    activeRiceMealGroup,
    isRiceSub,
    activeDisplayCat.title,
    activeDisplayCat.description,
    displayName,
    selectedSub,
    selectedThird,
    selectedFourth,
  ]);

  // Filtered products list (hierarchical category/subcategory matching)
  const categoryProducts = useMemo(() => {
    if (activeMensCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          productMatchesMensFashionCollection(p, activeMensCollection)
      );
    }
    if (activeWomensCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          productMatchesWomensFashionCollection(p, activeWomensCollection)
      );
    }
    if (activeElectronicsCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesElectronicsCollection(p, activeElectronicsCollection)
      );
    }
    if (activeDriedFruitCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesDriedFruitCollection(p, activeDriedFruitCollection)
      );
    }
    if (activeNutCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesNutCollection(p, activeNutCollection)
      );
    }
    if (activeSkinCareCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesSkinCareCollection(p, activeSkinCareCollection)
      );
    }
    if (activeHairCareCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesHairCareCollection(p, activeHairCareCollection)
      );
    }
    if (activeFurnitureCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesFurnitureCollection(p, activeFurnitureCollection)
      );
    }
    if (activeDriedPeasCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesDriedPeasCollection(p, activeDriedPeasCollection)
      );
    }
    if (activePranksNoveltiesCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesPranksNoveltiesCollection(
            p,
            activePranksNoveltiesCollection
          )
      );
    }
    if (activeFitnessGymCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesFitnessGymCollection(p, activeFitnessGymCollection)
      );
    }
    if (activeAccessoriesCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesAccessoriesCollection(p, activeAccessoriesCollection)
      );
    }
    if (activeSportsCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesSportsCollection(p, activeSportsCollection)
      );
    }
    if (activeFootwearCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesFootwearCollection(p, activeFootwearCollection)
      );
    }
    if (activeTeenagersCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesTeenagersCollection(p, activeTeenagersCollection)
      );
    }
    if (activeKidsCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesKidsCollection(p, activeKidsCollection)
      );
    }
    if (activeRiceCollection) {
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          productMatchesRiceCollection(p, activeRiceCollection)
      );
    }
    if (isElectronics && activeElectronicsGroup) {
      const matchingCols = electronicsCollections.filter(
        (col) =>
          col.status === 'approved' &&
          (col.parentGroup === activeElectronicsGroup.name ||
            (col.additionalGroups || []).includes(activeElectronicsGroup.name))
      );
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          (p.category || '').toLowerCase() === 'electronics' &&
          matchingCols.some((col) => productMatchesElectronicsCollection(p, col))
      );
    }
    if (isSkinCare && activeSkinCareGroup) {
      const matchingCols = skinCareCollections.filter(
        (col) =>
          col.status === 'approved' &&
          col.parentGroup === activeSkinCareGroup.name
      );
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          (p.category || '').toLowerCase() === 'skin care' &&
          matchingCols.some((col) => productMatchesSkinCareCollection(p, col))
      );
    }
    if (isHairCare && activeHairCareGroup) {
      const matchingCols = hairCareCollections.filter(
        (col) =>
          col.status === 'approved' &&
          col.parentGroup === activeHairCareGroup.name
      );
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          (p.category || '').toLowerCase() === 'hair care' &&
          matchingCols.some((col) => productMatchesHairCareCollection(p, col))
      );
    }
    if (isFurniture && activeFurnitureGroup) {
      const matchingCols = furnitureCollections.filter(
        (col) =>
          col.status === 'approved' &&
          col.parentGroup === activeFurnitureGroup.name
      );
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          (p.category || '').toLowerCase() === 'furniture' &&
          matchingCols.some((col) => productMatchesFurnitureCollection(p, col))
      );
    }
    if (isDriedPeas && activeDriedPeasGroup) {
      const matchingCols = driedPeasCollections.filter(
        (col) =>
          col.status === 'approved' &&
          col.parentGroup === activeDriedPeasGroup.name
      );
      return products.filter((p) => {
        const catLower = (p.category || '').toLowerCase();
        return (
          p.enabled !== false &&
          !p.isDraft &&
          (catLower === 'dry peas' || catLower === 'dried peas') &&
          matchingCols.some((col) => productMatchesDriedPeasCollection(p, col))
        );
      });
    }
    if (isPranksNovelties && activePranksNoveltiesGroup) {
      const matchingCols = pranksNoveltiesCollections.filter(
        (col) =>
          col.status === 'approved' &&
          col.parentGroup === activePranksNoveltiesGroup.name
      );
      return products.filter((p) => {
        const catLower = (p.category || '').toLowerCase();
        return (
          p.enabled !== false &&
          !p.isDraft &&
          (catLower === 'prank items' ||
            catLower === 'pranks & novelties' ||
            catLower === 'pranks-novelties') &&
          matchingCols.some((col) =>
            productMatchesPranksNoveltiesCollection(p, col)
          )
        );
      });
    }
    if (isFitnessGym && activeFitnessGymGroup) {
      const matchingCols = fitnessGymCollections.filter(
        (col) =>
          col.status === 'approved' &&
          col.parentGroup === activeFitnessGymGroup.name
      );
      return products.filter((p) => {
        const catLower = (p.category || '').toLowerCase();
        return (
          p.enabled !== false &&
          !p.isDraft &&
          (catLower === 'gym' ||
            catLower === 'fitness & gym' ||
            catLower === 'fitness-gym') &&
          matchingCols.some((col) =>
            productMatchesFitnessGymCollection(p, col)
          )
        );
      });
    }
    if (isAccessories && activeAccessoriesGroup) {
      const matchingCols = accessoriesCollections.filter(
        (col) =>
          col.status === 'approved' &&
          col.parentGroup === activeAccessoriesGroup.name
      );
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          matchingCols.some((col) => productMatchesAccessoriesCollection(p, col))
      );
    }
    if (isSports && activeSportsGroup) {
      const matchingCols = sportsCollections.filter(
        (col) =>
          col.status === 'approved' &&
          col.parentGroup === activeSportsGroup.name
      );
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          matchingCols.some((col) => productMatchesSportsCollection(p, col))
      );
    }
    if (isFootwear && activeFootwearGroup) {
      const matchingCols = footwearCollections.filter(
        (col) =>
          col.status === 'approved' &&
          col.parentGroup === activeFootwearGroup.name
      );
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          matchingCols.some((col) => productMatchesFootwearCollection(p, col))
      );
    }
    if (isTeenagers && activeTeenagersGroup) {
      const matchingCols = teenagersCollections.filter(
        (col) =>
          col.status === 'approved' &&
          col.parentGroup === activeTeenagersGroup.name
      );
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          matchingCols.some((col) => productMatchesTeenagersCollection(p, col))
      );
    }
    if (isKids && activeKidsGroup) {
      const matchingCols = kidsCollections.filter(
        (col) =>
          col.status === 'approved' &&
          col.parentGroup === activeKidsGroup.name
      );
      return products.filter(
        (p) =>
          p.enabled !== false &&
          !p.isDraft &&
          matchingCols.some((col) => productMatchesKidsCollection(p, col))
      );
    }
    return filterAndSortProducts(products, categories, {
      category: catInfo.id,
      subcategory: selectedSub,
      subSubcategory: activeLeafFilter,
    });
  }, [
    activeMensCollection,
    activeWomensCollection,
    activeElectronicsCollection,
    activeDriedFruitCollection,
    activeNutCollection,
    activeSkinCareCollection,
    activeHairCareCollection,
    activeFurnitureCollection,
    activeDriedPeasCollection,
    activePranksNoveltiesCollection,
    activeFitnessGymCollection,
    activeAccessoriesCollection,
    activeSportsCollection,
    activeFootwearCollection,
    activeTeenagersCollection,
    activeKidsCollection,
    activeRiceCollection,
    isElectronics,
    activeElectronicsGroup,
    electronicsCollections,
    isSkinCare,
    activeSkinCareGroup,
    skinCareCollections,
    isHairCare,
    activeHairCareGroup,
    hairCareCollections,
    isFurniture,
    activeFurnitureGroup,
    furnitureCollections,
    isDriedPeas,
    activeDriedPeasGroup,
    driedPeasCollections,
    isPranksNovelties,
    activePranksNoveltiesGroup,
    pranksNoveltiesCollections,
    isFitnessGym,
    activeFitnessGymGroup,
    fitnessGymCollections,
    isAccessories,
    activeAccessoriesGroup,
    accessoriesCollections,
    isSports,
    activeSportsGroup,
    sportsCollections,
    isFootwear,
    activeFootwearGroup,
    footwearCollections,
    isTeenagers,
    activeTeenagersGroup,
    teenagersCollections,
    isKids,
    activeKidsGroup,
    kidsCollections,
    products,
    categories,
    catInfo.id,
    selectedSub,
    activeLeafFilter,
  ]);

  const selectedThirdProduct = useMemo(() => {
    if (activeLeafFilter === 'All') return null;
    const thirdLower = activeLeafFilter.toLowerCase();
    return (
      categoryProducts.find(
        (p) => (p.subSubcategory || '').toLowerCase() === thirdLower
      ) ||
      categoryProducts[0] ||
      products.find(
        (p) =>
          p.enabled !== false &&
          productMatchesFilter(
            p,
            catInfo.id,
            selectedSub,
            activeLeafFilter,
            categories
          )
      ) ||
      null
    );
  }, [
    activeLeafFilter,
    categoryProducts,
    products,
    catInfo.id,
    selectedSub,
    categories,
  ]);

  const activeMensParent = useMemo(() => {
    if (
      !isFashion ||
      isWomensFashionSub ||
      selectedThird === 'All' ||
      activeStyleCollection
    ) {
      return undefined;
    }
    return findMensFashionParentBySlug(selectedThird);
  }, [isFashion, isWomensFashionSub, selectedThird, activeStyleCollection]);

  const activeWomensParent = useMemo(() => {
    if (!isWomensFashionSub || selectedThird === 'All' || activeWomensCollection) {
      return undefined;
    }
    return findWomensFashionParentBySlug(selectedThird);
  }, [isWomensFashionSub, selectedThird, activeWomensCollection]);

  const heroBannerImage = activeCollection
    ? activeCollection.image || ''
    : activeMensParent?.image ||
      activeWomensParent?.image ||
      activeRiceMealGroup?.bannerImage ||
      (isRiceSub && !activeRiceMealGroup ? '/images/categories/rice.jpg' : '') ||
      (activeLeafFilter !== 'All' && selectedThirdProduct?.images?.[0]
        ? selectedThirdProduct.images[0]
        : !activeSubCatInfo &&
            selectedSub !== 'All' &&
            categoryProducts[0]?.images?.[0]
          ? categoryProducts[0].images[0]
          : activeDisplayCat.image) ||
      '';

  const heroBannerDescription =
    activeCollection?.description ||
    activeRiceMealGroup?.description ||
    (isRiceSub
      ? 'Explore Rice varieties for Breakfast, Lunch, and Dinner alongside verified KubreeBazzar harvests.'
      : undefined) ||
    activeElectronicsGroup?.description ||
    activeSkinCareGroup?.description ||
    activeHairCareGroup?.description ||
    activeFurnitureGroup?.description ||
    activeDriedPeasGroup?.description ||
    activePranksNoveltiesGroup?.description ||
    activeFitnessGymGroup?.description ||
    activeAccessoriesGroup?.description ||
    activeSportsGroup?.description ||
    activeFootwearGroup?.description ||
    activeTeenagersGroup?.description ||
    activeKidsGroup?.description ||
    activeMensParent?.description ||
    activeWomensParent?.description ||
    (activeLeafFilter !== 'All' && selectedThirdProduct
      ? selectedThirdProduct.shortDescription ||
        selectedThirdProduct.description ||
        activeDisplayCat.description
      : activeDisplayCat.description);

  const heroBannerAlt = activeMensCollection
    ? `${activeMensCollection.name} - Men's ${activeMensCollection.parentCategory}`
    : activeWomensCollection
      ? `${activeWomensCollection.name} - Women's ${activeWomensCollection.parentCategory}`
      : activeElectronicsCollection
        ? `${activeElectronicsCollection.name} - ${activeElectronicsGroup?.name || activeElectronicsCollection.parentGroup}`
        : activeDriedFruitCollection
          ? `${activeDriedFruitCollection.name} - Dried Fruits`
          : activeNutCollection
            ? `${activeNutCollection.name} - Nuts`
            : activeSkinCareCollection
              ? `${activeSkinCareCollection.name} - ${activeSkinCareGroup?.name || activeSkinCareCollection.parentGroup}`
              : activeHairCareCollection
                ? `${activeHairCareCollection.name} - ${activeHairCareGroup?.name || activeHairCareCollection.parentGroup}`
                : activeFurnitureCollection
                  ? `${activeFurnitureCollection.name} - ${activeFurnitureGroup?.name || activeFurnitureCollection.parentGroup}`
                  : activeDriedPeasCollection
                    ? `${activeDriedPeasCollection.name} - ${activeDriedPeasGroup?.name || activeDriedPeasCollection.parentGroup}`
                    : activePranksNoveltiesCollection
                      ? `${activePranksNoveltiesCollection.name} - ${activePranksNoveltiesGroup?.name || activePranksNoveltiesCollection.parentGroup}`
                      : activeFitnessGymCollection
                        ? `${activeFitnessGymCollection.name} - ${activeFitnessGymGroup?.name || activeFitnessGymCollection.parentGroup}`
                        : activeAccessoriesCollection
                          ? `${activeAccessoriesCollection.name} - ${activeAccessoriesGroup?.name || activeAccessoriesCollection.parentGroup}`
                          : activeSportsCollection
                            ? `${activeSportsCollection.name} - ${activeSportsGroup?.name || activeSportsCollection.parentGroup}`
                            : activeFootwearCollection
                              ? `${activeFootwearCollection.name} - ${activeFootwearGroup?.name || activeFootwearCollection.parentGroup}`
                              : activeTeenagersCollection
                                ? `${activeTeenagersCollection.name} - ${activeTeenagersGroup?.name || activeTeenagersCollection.parentGroup}`
                                : activeKidsCollection
                                  ? `${activeKidsCollection.name} - ${activeKidsGroup?.name || activeKidsCollection.parentGroup}`
                                  : activeRiceCollection
                                    ? `${activeRiceCollection.name} - ${activeRiceCollection.parentGroup} Rice`
                                    : activeRiceMealGroup
                                      ? `${activeRiceMealGroup.name} Rice`
                                      : isRiceSub
                                        ? 'Rice - Groceries'
                                        : activeWomensParent
                                          ? `${activeWomensParent.name} - Women's Fashion`
                                          : activeLeafFilter !== 'All'
                                            ? activeLeafFilter
                                            : activeDisplayCat.title;

  const isHeroContain =
    Boolean(heroBannerImage) &&
    (heroBannerImage.includes('/images/millets/') ||
      heroBannerImage.includes('/images/cereals/') ||
      heroBannerImage.includes('/images/honey/') ||
      heroBannerImage.includes('/images/ready-to-cook/') ||
      heroBannerImage.includes('/images/groceries/rice/breakfast/') ||
      heroBannerImage.includes('/images/groceries/rice/lunch/') ||
      heroBannerImage.includes('/images/groceries/rice/dinner/') ||
      heroBannerImage.includes('/images/mens-fashion/') ||
      heroBannerImage.includes('/images/womens-fashion/') ||
      heroBannerImage.includes('/images/electronics/') ||
      heroBannerImage.includes('/images/dried-fruits/') ||
      heroBannerImage.includes('/images/nuts/') ||
      heroBannerImage.includes('/images/skin-care/') ||
      heroBannerImage.includes('/images/hair-care/') ||
      heroBannerImage.includes('/images/furniture/') ||
      heroBannerImage.includes('/images/dried-peas/') ||
      heroBannerImage.includes('/images/pranks-novelties/') ||
      heroBannerImage.includes('/images/fitness-gym/') ||
      heroBannerImage.includes('/images/accessories/') ||
      heroBannerImage.includes('/images/sports/') ||
      heroBannerImage.includes('/images/footwear/') ||
      heroBannerImage.includes('/images/teenagers/') ||
      heroBannerImage.includes('/images/kids/') ||
      heroBannerImage.includes('/images/products/teenagers/') ||
      heroBannerImage.includes('/images/products/footwear/') ||
      heroBannerImage.includes('/images/products/fitness/') ||
      heroBannerImage.includes('/images/products/kids/') ||
      heroBannerImage.startsWith('/uploads/'));
  const isHeroDarkStudio =
    Boolean(heroBannerImage) &&
    !isHeroContain &&
    (heroBannerImage.includes('/baby-kit/') ||
      heroBannerImage.includes('/temple-kit/') ||
      heroBannerImage.includes('/school-kit/') ||
      heroBannerImage.endsWith('sambar-powder.jpg') ||
      heroBannerImage.endsWith('rasam-powder.jpg') ||
      heroBannerImage.endsWith('biryani-masala.jpg') ||
      heroBannerImage.endsWith('chicken-masala.jpg') ||
      heroBannerImage.endsWith('mutton-masala.jpg') ||
      heroBannerImage.endsWith('fish-curry-masala.jpg') ||
      heroBannerImage.endsWith('curry-masala.jpg') ||
      (heroBannerImage.endsWith('.png') &&
        !heroBannerImage.endsWith('lavangam.png') &&
        !heroBannerImage.endsWith('watches.png')));

  const activeBanner = banners.find((b) => b.active);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-[#64748B]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-[#0B3B78] hover:underline cursor-pointer"
            >
              Home
            </button>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <button
              type="button"
              onClick={() => {
                setSelectedSub('All');
                setSelectedThird('All');
                setSelectedFourth('All');
                navigate(`/${catInfo.slug}`);
              }}
              className="hover:text-[#0B3B78] hover:underline cursor-pointer"
            >
              {displayName}
            </button>
          </li>
          {selectedSub !== 'All' && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                {selectedThird !== 'All' ||
                activeElectronicsCollection ||
                activeSkinCareCollection ||
                activeHairCareCollection ||
                activeFurnitureCollection ||
                activeDriedPeasCollection ||
                activePranksNoveltiesCollection ||
                activeFitnessGymCollection ||
                activeAccessoriesCollection ||
                activeSportsCollection ||
                activeFootwearCollection ||
                activeTeenagersCollection ||
                activeKidsCollection ||
                activeRiceCollection ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedThird('All');
                      setSelectedFourth('All');
                      const subSlug =
                        activeElectronicsGroup?.slug ||
                        activeSkinCareGroup?.slug ||
                        activeHairCareGroup?.slug ||
                        activeFurnitureGroup?.slug ||
                        activeDriedPeasGroup?.slug ||
                        activePranksNoveltiesGroup?.slug ||
                        activeFitnessGymGroup?.slug ||
                        activeAccessoriesGroup?.slug ||
                        activeSportsGroup?.slug ||
                        activeFootwearGroup?.slug ||
                        activeTeenagersGroup?.slug ||
                        activeKidsGroup?.slug ||
                        (isRiceSub ? 'rice' : undefined) ||
                        activeSubCatInfo?.slug ||
                        selectedSub.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      navigate(`/${catInfo.slug}/${subSlug}`);
                    }}
                    className="hover:text-[#0B3B78] hover:underline cursor-pointer"
                  >
                    {activeElectronicsGroup?.name ||
                      activeSkinCareGroup?.name ||
                      activeHairCareGroup?.name ||
                      activeFurnitureGroup?.name ||
                      activeDriedPeasGroup?.name ||
                      activePranksNoveltiesGroup?.name ||
                      activeFitnessGymGroup?.name ||
                      activeAccessoriesGroup?.name ||
                      activeSportsGroup?.name ||
                      activeFootwearGroup?.name ||
                      activeTeenagersGroup?.name ||
                      activeKidsGroup?.name ||
                      getSubcategoryDisplayName(selectedSub)}
                  </button>
                ) : (
                  <span className="font-semibold text-[#0B3B78]">
                    {activeElectronicsGroup?.name ||
                      activeSkinCareGroup?.name ||
                      activeHairCareGroup?.name ||
                      activeFurnitureGroup?.name ||
                      activeDriedPeasGroup?.name ||
                      activePranksNoveltiesGroup?.name ||
                      activeFitnessGymGroup?.name ||
                      activeAccessoriesGroup?.name ||
                      activeSportsGroup?.name ||
                      activeFootwearGroup?.name ||
                      activeTeenagersGroup?.name ||
                      activeKidsGroup?.name ||
                      getSubcategoryDisplayName(selectedSub)}
                  </span>
                )}
              </li>
            </>
          )}
          {selectedThird !== 'All' && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                {selectedFourth !== 'All' ||
                activeStyleCollection ||
                activeRiceCollection ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFourth('All');
                      if (activeRiceCollection) {
                        navigate(
                          `/groceries/rice/${activeRiceCollection.parentGroupSlug}`
                        );
                        return;
                      }
                      if (activeWomensCollection) {
                        navigate(
                          `/fashion/womens-fashion/${activeWomensCollection.parentSlug}`
                        );
                        return;
                      }
                      if (activeMensCollection) {
                        navigate(
                          `/fashion/mens-fashion/${activeMensCollection.parentSlug}`
                        );
                        return;
                      }
                      const subSlug =
                        activeSubCatInfo?.slug ||
                        selectedSub.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      const thirdSlug = selectedThird
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-');
                      navigate(`/${catInfo.slug}/${subSlug}/${thirdSlug}`);
                    }}
                    className="hover:text-[#0B3B78] hover:underline cursor-pointer"
                  >
                    {selectedThird}
                  </button>
                ) : (
                  <span className="font-semibold text-[#0B3B78]">
                    {selectedThird}
                  </span>
                )}
              </li>
            </>
          )}
          {selectedFourth !== 'All' && (
            <>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-[#0B3B78]">{selectedFourth}</li>
            </>
          )}
          {activeCollection && (
            <>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-[#0B3B78]">
                {activeCollection.name}
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* Category Hero Banner */}
      <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-[#F0F6FF] to-[#EAF2FC] border border-[#DCE6F2] p-4 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center shadow-xs">
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D6FD8]/10 text-[#0B3B78] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" />
            <span>
              {activeMensCollection
                ? `Men's Fashion · ${activeMensCollection.parentCategory}`
                : activeWomensCollection
                  ? `Women's Fashion · ${activeWomensCollection.parentCategory}`
                  : activeElectronicsCollection
                    ? `Electronics · ${activeElectronicsGroup?.name || activeElectronicsCollection.parentGroup}`
                    : activeDriedFruitCollection
                      ? `Dried Fruits · ${activeDriedFruitCollection.varietyGroup}`
                      : activeNutCollection
                        ? `Nuts · ${activeNutCollection.varietyGroup}`
                        : activeSkinCareCollection
                          ? `Skin Care · ${activeSkinCareGroup?.name || activeSkinCareCollection.parentGroup}`
                          : activeHairCareCollection
                            ? `Hair Care · ${activeHairCareGroup?.name || activeHairCareCollection.parentGroup}`
                            : activeFurnitureCollection
                              ? `Furniture · ${activeFurnitureGroup?.name || activeFurnitureCollection.parentGroup}`
                              : activeDriedPeasCollection
                                ? `Dried Peas · ${activeDriedPeasGroup?.name || activeDriedPeasCollection.parentGroup}`
                                : activePranksNoveltiesCollection
                                  ? `Pranks & Novelties · ${activePranksNoveltiesGroup?.name || activePranksNoveltiesCollection.parentGroup}`
                                  : activeFitnessGymCollection
                                    ? `Fitness & Gym · ${activeFitnessGymGroup?.name || activeFitnessGymCollection.parentGroup}`
                                    : activeAccessoriesCollection
                                      ? `Accessories · ${activeAccessoriesGroup?.name || activeAccessoriesCollection.parentGroup}`
                                      : activeSportsCollection
                                        ? `Sports · ${activeSportsGroup?.name || activeSportsCollection.parentGroup}`
                                        : activeFootwearCollection
                                          ? `Footwear · ${activeFootwearGroup?.name || activeFootwearCollection.parentGroup}`
                                          : activeTeenagersCollection
                                            ? `Teenagers · ${activeTeenagersGroup?.name || activeTeenagersCollection.parentGroup}`
                                            : activeKidsCollection
                                              ? `Kids · ${activeKidsGroup?.name || activeKidsCollection.parentGroup}`
                                              : activeRiceCollection
                                                ? `Groceries · ${activeRiceCollection.parentGroup} Rice`
                                                : activeRiceMealGroup
                                                  ? `Groceries · Rice · ${activeRiceMealGroup.name}`
                                                  : isRiceSub
                                                    ? 'Groceries · Rice — Breakfast, Lunch & Dinner'
                                                    : activeElectronicsGroup
                                                      ? `Electronics · ${activeElectronicsGroup.name}`
                                                      : activeSkinCareGroup
                                                        ? `Skin Care · ${activeSkinCareGroup.name}`
                                                        : activeHairCareGroup
                                                          ? `Hair Care · ${activeHairCareGroup.name}`
                                                          : activeFurnitureGroup
                                                            ? `Furniture · ${activeFurnitureGroup.name}`
                                                            : activeDriedPeasGroup
                                                              ? `Dried Peas · ${activeDriedPeasGroup.name}`
                                                              : activePranksNoveltiesGroup
                                                                ? `Pranks & Novelties · ${activePranksNoveltiesGroup.name}`
                                                                : activeFitnessGymGroup
                                                                  ? `Fitness & Gym · ${activeFitnessGymGroup.name}`
                                                                  : activeAccessoriesGroup
                                                                    ? `Accessories · ${activeAccessoriesGroup.name}`
                                                                    : activeSportsGroup
                                                                      ? `Sports · ${activeSportsGroup.name}`
                                                                      : activeFootwearGroup
                                                                        ? `Footwear · ${activeFootwearGroup.name}`
                                                                        : activeTeenagersGroup
                                                                          ? `Teenagers · ${activeTeenagersGroup.name}`
                                                                          : activeKidsGroup
                                                                            ? `Kids · ${activeKidsGroup.name}`
                                                                            : activeWomensParent
                                                                              ? `Women's Fashion · ${activeWomensParent.name}`
                                                                              : activeDisplayCat.subtitle || `${displayName} Department`}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-5xl font-extrabold text-[#0B3B78] leading-tight">
            {activeCollection
              ? activeCollection.name
              : activeRiceMealGroup
                ? `${activeRiceMealGroup.name} Rice`
                : isRiceSub
                  ? 'Rice'
                  : selectedFourth !== 'All'
                    ? selectedFourth
                    : selectedThird !== 'All'
                      ? selectedThird
                      : activeElectronicsGroup
                        ? activeElectronicsGroup.name
                        : activeSkinCareGroup
                          ? activeSkinCareGroup.name
                          : activeHairCareGroup
                            ? activeHairCareGroup.name
                            : activeFurnitureGroup
                              ? activeFurnitureGroup.name
                              : activeDriedPeasGroup
                                ? activeDriedPeasGroup.name
                                : activePranksNoveltiesGroup
                                  ? activePranksNoveltiesGroup.name
                                  : activeFitnessGymGroup
                                    ? activeFitnessGymGroup.name
                                    : activeAccessoriesGroup
                                      ? activeAccessoriesGroup.name
                                      : activeSportsGroup
                                        ? activeSportsGroup.name
                                        : activeFootwearGroup
                                          ? activeFootwearGroup.name
                                          : activeTeenagersGroup
                                            ? activeTeenagersGroup.name
                                            : activeKidsGroup
                                              ? activeKidsGroup.name
                                              : activeDisplayCat.title || displayName}
          </h1>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl">
            {heroBannerDescription}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs font-semibold text-[#0B3B78] shadow-xs">
              {categoryProducts.length} Verified Products in this view
            </span>
            <button
              type="button"
              onClick={() => navigate('/offers')}
              className="px-4 py-2 min-h-[40px] rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              Department Offers
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 h-[220px] sm:h-[320px] rounded-2xl overflow-hidden bg-white/70 border border-[#DCE6F2] p-2 flex items-center justify-center">
          {heroBannerImage && heroBannerImage.startsWith('/') ? (
            <img
              src={encodeURI(heroBannerImage)}
              alt={heroBannerAlt}
              referrerPolicy="no-referrer"
              className={`w-full h-full rounded-xl ${
                isHeroDarkStudio
                  ? 'object-contain bg-[#090C12] p-3'
                  : isHeroContain
                    ? 'object-contain bg-[#F8FAFC] p-3'
                    : 'object-cover'
              }`}
            />
          ) : activeWomensCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#FDF2F8] via-[#F8FAFC] to-[#EFF6FF] border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCE6F2] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#BE185D]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeWomensCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activeWomensCollection.parentCategory} · Photo pending upload
              </p>
            </div>
          ) : activeElectronicsCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#BFDBFE] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#BFDBFE] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#1D6FD8]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeElectronicsCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activeElectronicsCollection.parentGroup} · Photo pending upload
              </p>
            </div>
          ) : activeDriedFruitCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#FFFBEB] via-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#FDE68A] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#FDE68A] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#B45309]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeDriedFruitCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                Dried Fruits · Photo pending upload
              </p>
            </div>
          ) : activeNutCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#FFFBEB] via-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#FDE68A] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#FDE68A] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#B45309]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeNutCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                Nuts · Photo pending upload
              </p>
            </div>
          ) : activeSkinCareCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#BFDBFE] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#BFDBFE] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#1D6FD8]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeSkinCareCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activeSkinCareCollection.parentGroup} · Photo pending upload
              </p>
            </div>
          ) : activeHairCareCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#ECFDF5] via-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#A7F3D0] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#A7F3D0] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#047857]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeHairCareCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activeHairCareCollection.parentGroup} · Photo pending upload
              </p>
            </div>
          ) : activeFurnitureCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#FFFBEB] via-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#FDE68A] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#FDE68A] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#92400E]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeFurnitureCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activeFurnitureCollection.parentGroup} · Photo pending upload
              </p>
            </div>
          ) : activeDriedPeasCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#F0FDF4] via-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#BBF7D0] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#BBF7D0] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#15803D]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeDriedPeasCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activeDriedPeasCollection.parentGroup} · Photo pending upload
              </p>
            </div>
          ) : activePranksNoveltiesCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#FEF2F2] via-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#FECACA] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#FECACA] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#DC2626]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activePranksNoveltiesCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activePranksNoveltiesCollection.parentGroup} · Photo pending upload
              </p>
            </div>
          ) : activeFitnessGymCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#FEF2F2] via-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#FECACA] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#FECACA] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#DC2626]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeFitnessGymCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activeFitnessGymCollection.parentGroup} · Photo pending upload
              </p>
            </div>
          ) : activeAccessoriesCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#BFDBFE] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#BFDBFE] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#1D6FD8]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeAccessoriesCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activeAccessoriesCollection.parentGroup} · Photo pending upload
              </p>
            </div>
          ) : activeSportsCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#F0F9FF] via-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#BAE6FD] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#BAE6FD] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#0284C7]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeSportsCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activeSportsCollection.parentGroup} · Photo pending upload
              </p>
            </div>
          ) : activeFootwearCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#F1F5F9] border border-dashed border-[#BFDBFE] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#BFDBFE] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#1D6FD8]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeFootwearCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activeFootwearCollection.parentGroup} · Photo pending upload
              </p>
            </div>
          ) : activeTeenagersCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#F5F3FF] via-[#F8FAFC] to-[#F1F5F9] border border-dashed border-[#DDD6FE] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#DDD6FE] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeTeenagersCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activeTeenagersCollection.parentGroup} · Photo pending upload
              </p>
            </div>
          ) : activeKidsCollection ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#FFFBEB] via-[#F8FAFC] to-[#EFF6FF] border border-dashed border-[#FDE68A] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#FDE68A] shadow-xs flex items-center justify-center mb-3">
                <ImageOff className="w-5 h-5 text-[#D97706]" />
              </div>
              <p className="font-display text-base font-extrabold text-[#0B3B78]">
                {activeKidsCollection.name}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {activeKidsCollection.parentGroup} · Photo pending upload
              </p>
            </div>
          ) : activeDisplayCat.modelType ? (
            <Category3DShowcase activePreset={activeDisplayCat.modelType} />
          ) : (
            <img
              src={
                heroBannerImage ||
                resolveCategoryFallbackImage(catInfo.id)
              }
              alt={heroBannerAlt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl"
            />
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      {activeBanner && (
        <div className="rounded-2xl bg-gradient-to-r from-[#0B3B78] to-[#1D6FD8] text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">
              {activeBanner.title}
            </p>
            <p className="text-xs text-white/90 mt-0.5">
              {activeBanner.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/offers')}
            className="px-4 py-2 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-xs font-bold whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            Claim Offer
          </button>
        </div>
      )}

      {/* Men's Fashion Clothing Collections Browser */}
      {isFashion &&
        !isWomensFashionSub &&
        !activeStyleCollection && (
          <MensFashionCollectionsSection
            selectedParent={selectedThird !== 'All' ? selectedThird : 'All'}
          />
        )}

      {/* Women's Fashion 78 Clothing Types across 13 Subcategories Browser */}
      {isFashion &&
        (selectedSub === 'All' || isWomensFashionSub) &&
        !activeStyleCollection && (
          <WomensFashionCollectionsSection
            selectedParent={
              isWomensFashionSub && selectedThird !== 'All'
                ? selectedThird
                : 'All'
            }
          />
        )}

      {/* Electronics 10 Groups & 47 Collections Browser */}
      {isElectronics && !activeElectronicsCollection && (
        <ElectronicsCollectionsSection
          selectedGroup={selectedSub !== 'All' ? selectedSub : 'All'}
        />
      )}

      {/* Dried Fruits 15 Varieties Browser */}
      {isDriedFruits && !activeDriedFruitCollection && (
        <DriedFruitsCollectionsSection />
      )}

      {/* Nuts 15 Varieties Browser */}
      {isNuts && !activeNutCollection && (
        <NutsCollectionsSection />
      )}

      {/* Skin Care 7 Groups & 30 Collections Browser */}
      {isSkinCare && !activeSkinCareCollection && (
        <SkinCareCollectionsSection
          selectedGroup={selectedSub !== 'All' ? selectedSub : 'All'}
        />
      )}

      {/* Hair Care 7 Groups & 30 Collections Browser */}
      {isHairCare && !activeHairCareCollection && (
        <HairCareCollectionsSection
          selectedGroup={selectedSub !== 'All' ? selectedSub : 'All'}
        />
      )}

      {/* Furniture 7 Groups & 30 Collections Browser */}
      {isFurniture && !activeFurnitureCollection && (
        <FurnitureCollectionsSection
          selectedGroup={selectedSub !== 'All' ? selectedSub : 'All'}
        />
      )}

      {/* Dried Peas & Related Pulses 2 Groups & 15 Collections Browser */}
      {isDriedPeas && !activeDriedPeasCollection && (
        <DriedPeasCollectionsSection
          selectedGroup={selectedSub !== 'All' ? selectedSub : 'All'}
        />
      )}

      {/* Pranks & Novelties 7 Groups & 30 Collections Browser */}
      {isPranksNovelties && !activePranksNoveltiesCollection && (
        <PranksNoveltiesCollectionsSection
          selectedGroup={selectedSub !== 'All' ? selectedSub : 'All'}
        />
      )}

      {/* Fitness & Gym 7 Groups & 35 Collections Browser */}
      {isFitnessGym && !activeFitnessGymCollection && (
        <FitnessGymCollectionsSection
          selectedGroup={selectedSub !== 'All' ? selectedSub : 'All'}
        />
      )}

      {/* Accessories 8 Groups & 35 Collections Browser */}
      {isAccessories && !activeAccessoriesCollection && (
        <AccessoriesCollectionsSection
          selectedGroup={selectedSub !== 'All' ? selectedSub : 'All'}
        />
      )}

      {/* Sports 10 Groups & 40 Collections Browser */}
      {isSports && !activeSportsCollection && (
        <SportsCollectionsSection
          selectedGroup={selectedSub !== 'All' ? selectedSub : 'All'}
        />
      )}

      {/* Footwear 7 Groups & 40 Collections Browser */}
      {isFootwear && !activeFootwearCollection && (
        <FootwearCollectionsSection
          selectedGroup={selectedSub !== 'All' ? selectedSub : 'All'}
        />
      )}

      {/* Teenagers 10 Groups & 64 Collections Browser */}
      {isTeenagers && !activeTeenagersCollection && (
        <TeenagersCollectionsSection
          selectedGroup={selectedSub !== 'All' ? selectedSub : 'All'}
        />
      )}

      {/* Kids 11 Groups & 65 Collections Browser */}
      {isKids && !activeKidsCollection && (
        <KidsCollectionsSection
          selectedGroup={selectedSub !== 'All' ? selectedSub : 'All'}
        />
      )}

      {/* Groceries -> Rice: Breakfast, Lunch & Dinner Banners + 16 Varieties */}
      {isRiceSub && !activeRiceCollection && (
        <RiceCollectionsSection
          selectedMeal={activeRiceMealGroup?.name || 'All'}
        />
      )}

      {/* Product Grid */}
      {categoryProducts.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white border border-[#DCE6F2] space-y-3">
          <ShoppingBag className="w-12 h-12 text-[#94A3B8] mx-auto opacity-50" />
          <h3 className="font-display text-lg font-bold text-[#0B3B78]">
            {activeCollection
              ? `No verified products listed in ${activeCollection.name} yet`
              : activeElectronicsGroup
                ? `No verified products listed in ${activeElectronicsGroup.name} yet`
                : activeSkinCareGroup
                  ? `No verified products listed in ${activeSkinCareGroup.name} yet`
                  : activeHairCareGroup
                    ? `No verified products listed in ${activeHairCareGroup.name} yet`
                    : activeFurnitureGroup
                      ? `No verified products listed in ${activeFurnitureGroup.name} yet`
                      : activeDriedPeasGroup
                        ? `No verified products listed in ${activeDriedPeasGroup.name} yet`
                        : activePranksNoveltiesGroup
                          ? `No verified products listed in ${activePranksNoveltiesGroup.name} yet`
                          : activeFitnessGymGroup
                            ? `No verified products listed in ${activeFitnessGymGroup.name} yet`
                            : activeAccessoriesGroup
                              ? `No verified products listed in ${activeAccessoriesGroup.name} yet`
                              : activeSportsGroup
                                ? `No verified products listed in ${activeSportsGroup.name} yet`
                                : activeFootwearGroup
                                  ? `No verified products listed in ${activeFootwearGroup.name} yet`
                                  : activeTeenagersGroup
                                    ? `No verified products listed in ${activeTeenagersGroup.name} yet`
                                    : activeKidsGroup
                                      ? `No verified products listed in ${activeKidsGroup.name} yet`
                                      : 'No products found in this section'}
          </h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            {activeMensCollection
              ? `Explore our ${activeMensCollection.parentCategory} collections below or return to browse all Men's Fashion styles.`
              : activeWomensCollection
                ? `Explore our ${activeWomensCollection.parentCategory} collections below or return to browse all Women's Fashion styles.`
                : activeElectronicsCollection
                  ? `Verified ${activeElectronicsCollection.name} listings with authentic specs and photography will appear here as inventory is published.`
                  : activeDriedFruitCollection
                    ? `Verified ${activeDriedFruitCollection.name} packs with pack sizes and pricing will appear here as inventory is published.`
                    : activeNutCollection
                      ? `Verified ${activeNutCollection.name} packs with pack sizes and pricing will appear here as inventory is published.`
                      : activeSkinCareCollection
                        ? `Verified ${activeSkinCareCollection.name} items with ingredients and pricing will appear here as inventory is published.`
                        : activeHairCareCollection
                          ? `Verified ${activeHairCareCollection.name} items with pack details and pricing will appear here as inventory is published.`
                          : activeFurnitureCollection
                            ? `Verified ${activeFurnitureCollection.name} listings with dimensions, materials, and pricing will appear here as inventory is published.`
                            : activeDriedPeasCollection
                              ? `Verified ${activeDriedPeasCollection.name} packs with pack weights and pricing will appear here as inventory is published.`
                              : activePranksNoveltiesCollection
                                ? `Verified ${activePranksNoveltiesCollection.name} listings with genuine photos, age guidance, and pricing will appear here as inventory is published.`
                                : activeFitnessGymCollection
                                  ? `Verified ${activeFitnessGymCollection.name} listings with authentic specifications, genuine supplier photos, and pricing will appear here as inventory is published.`
                                  : activeAccessoriesCollection
                                    ? `Verified ${activeAccessoriesCollection.name} listings with genuine supplier photography and pricing will appear here as inventory is published.`
                                    : activeSportsCollection
                                      ? `Verified ${activeSportsCollection.name} listings with genuine supplier photography and pricing will appear here as inventory is published.`
                                      : activeFootwearCollection
                                        ? `Verified ${activeFootwearCollection.name} listings with genuine supplier photography and pricing will appear here as inventory is published.`
                                        : activeTeenagersCollection
                                          ? `Verified ${activeTeenagersCollection.name} listings with genuine supplier photography and pricing will appear here as inventory is published.`
                                          : activeKidsCollection
                                            ? `Verified ${activeKidsCollection.name} listings with genuine supplier photography and pricing will appear here as inventory is published.`
                                            : activeRiceCollection
                                              ? `Verified ${activeRiceCollection.name} packs will appear here as supplier inventory is published. You can also explore other ${activeRiceCollection.parentGroup} rice varieties below.`
                                              : activeElectronicsGroup
                                              ? `Browse our ${activeElectronicsGroup.name} collections above or view all Electronics products.`
                                              : activeSkinCareGroup
                                                ? `Browse our ${activeSkinCareGroup.name} collections above or view all Skin Care products.`
                                                : activeHairCareGroup
                                                  ? `Browse our ${activeHairCareGroup.name} collections above or view all Hair Care products.`
                                                  : activeFurnitureGroup
                                                    ? `Browse our ${activeFurnitureGroup.name} collections above or view all Furniture products.`
                                                    : activeDriedPeasGroup
                                                      ? `Browse our ${activeDriedPeasGroup.name} collections above or view all Dried Peas & Pulses products.`
                                                      : activePranksNoveltiesGroup
                                                        ? `Browse our ${activePranksNoveltiesGroup.name} collections above or view all Pranks & Novelties products.`
                                                        : activeFitnessGymGroup
                                                          ? `Browse our ${activeFitnessGymGroup.name} collections above or view all Fitness & Gym products.`
                                                          : activeAccessoriesGroup
                                                            ? `Browse our ${activeAccessoriesGroup.name} collections above or view all Accessories products.`
                                                            : activeSportsGroup
                                                              ? `Browse our ${activeSportsGroup.name} collections above or view all Sports products.`
                                                              : activeFootwearGroup
                                                                ? `Browse our ${activeFootwearGroup.name} collections above or view all Footwear products.`
                                                                : activeTeenagersGroup
                                                                  ? `Browse our ${activeTeenagersGroup.name} collections above or view all Teenagers products.`
                                                                  : activeKidsGroup
                                                                    ? `Browse our ${activeKidsGroup.name} collections above or view all Kids products.`
                                                                    : `Explore all available products across ${displayName}.`}
          </p>
          <button
            type="button"
            onClick={() => {
              if (activeMensCollection) {
                navigate(`/fashion/mens-fashion/${activeMensCollection.parentSlug}`);
                return;
              }
              if (activeWomensCollection) {
                navigate(
                  `/fashion/womens-fashion/${activeWomensCollection.parentSlug}`
                );
                return;
              }
              if (activeElectronicsCollection) {
                navigate(
                  `/electronics/${activeElectronicsGroup?.slug || activeElectronicsCollection.parentSlug}`
                );
                return;
              }
              if (activeDriedFruitCollection) {
                navigate('/dried-fruits');
                return;
              }
              if (activeNutCollection) {
                navigate('/nuts');
                return;
              }
              if (activeSkinCareCollection) {
                navigate(
                  `/skin-care/${activeSkinCareGroup?.slug || activeSkinCareCollection.parentGroupSlug}`
                );
                return;
              }
              if (activeHairCareCollection) {
                navigate(
                  `/hair-care/${activeHairCareGroup?.slug || activeHairCareCollection.parentGroupSlug}`
                );
                return;
              }
              if (activeFurnitureCollection) {
                navigate(
                  `/furniture/${activeFurnitureGroup?.slug || activeFurnitureCollection.parentGroupSlug}`
                );
                return;
              }
              if (activeDriedPeasCollection) {
                navigate(
                  `/dried-peas/${activeDriedPeasGroup?.slug || activeDriedPeasCollection.parentGroupSlug}`
                );
                return;
              }
              if (activePranksNoveltiesCollection) {
                navigate(
                  `/pranks-novelties/${activePranksNoveltiesGroup?.slug || activePranksNoveltiesCollection.parentGroupSlug}`
                );
                return;
              }
              if (activeFitnessGymCollection) {
                navigate(
                  `/fitness-gym/${activeFitnessGymGroup?.slug || activeFitnessGymCollection.parentGroupSlug}`
                );
                return;
              }
              if (activeAccessoriesCollection) {
                navigate(
                  `/accessories/${activeAccessoriesGroup?.slug || activeAccessoriesCollection.parentGroupSlug}`
                );
                return;
              }
              if (activeSportsCollection) {
                navigate(
                  `/sports/${activeSportsGroup?.slug || activeSportsCollection.parentGroupSlug}`
                );
                return;
              }
              if (activeFootwearCollection) {
                navigate(
                  `/footwear/${activeFootwearGroup?.slug || activeFootwearCollection.parentGroupSlug}`
                );
                return;
              }
              if (activeTeenagersCollection) {
                navigate(
                  `/teenagers/${activeTeenagersGroup?.slug || activeTeenagersCollection.parentGroupSlug}`
                );
                return;
              }
              if (activeKidsCollection) {
                navigate(
                  `/kids/${activeKidsGroup?.slug || activeKidsCollection.parentGroupSlug}`
                );
                return;
              }
              if (activeRiceCollection) {
                navigate(`/groceries/rice/${activeRiceCollection.parentGroupSlug}`);
                return;
              }
              if (isRiceSub) {
                navigate('/groceries/rice');
                return;
              }
              setSelectedSub('All');
              setSelectedThird('All');
              navigate(`/${catInfo.slug}`);
            }}
            className="px-4 py-2 rounded-xl bg-[#0B3B78] text-white text-xs font-bold cursor-pointer"
          >
            {activeMensCollection
              ? `Back to Men's ${activeMensCollection.parentCategory}`
              : activeWomensCollection
                ? `Back to Women's ${activeWomensCollection.parentCategory}`
                : activeElectronicsCollection
                  ? `Back to ${activeElectronicsGroup?.name || activeElectronicsCollection.parentGroup}`
                  : activeDriedFruitCollection
                    ? 'Back to All Dried Fruits'
                    : activeNutCollection
                      ? 'Back to All Nuts'
                      : activeSkinCareCollection
                        ? `Back to ${activeSkinCareGroup?.name || activeSkinCareCollection.parentGroup}`
                        : activeHairCareCollection
                          ? `Back to ${activeHairCareGroup?.name || activeHairCareCollection.parentGroup}`
                          : activeFurnitureCollection
                            ? `Back to ${activeFurnitureGroup?.name || activeFurnitureCollection.parentGroup}`
                            : activeDriedPeasCollection
                              ? `Back to ${activeDriedPeasGroup?.name || activeDriedPeasCollection.parentGroup}`
                              : activePranksNoveltiesCollection
                                ? `Back to ${activePranksNoveltiesGroup?.name || activePranksNoveltiesCollection.parentGroup}`
                                : activeFitnessGymCollection
                                  ? `Back to ${activeFitnessGymGroup?.name || activeFitnessGymCollection.parentGroup}`
                                  : activeAccessoriesCollection
                                    ? `Back to ${activeAccessoriesGroup?.name || activeAccessoriesCollection.parentGroup}`
                                    : activeSportsCollection
                                      ? `Back to ${activeSportsGroup?.name || activeSportsCollection.parentGroup}`
                                      : activeFootwearCollection
                                        ? `Back to ${activeFootwearGroup?.name || activeFootwearCollection.parentGroup}`
                                        : activeTeenagersCollection
                                          ? `Back to ${activeTeenagersGroup?.name || activeTeenagersCollection.parentGroup}`
                                          : activeKidsCollection
                                            ? `Back to ${activeKidsGroup?.name || activeKidsCollection.parentGroup}`
                                            : activeRiceCollection
                                              ? `Back to ${activeRiceCollection.parentGroup} Rice`
                                              : isRiceSub
                                                ? 'Back to All Rice'
                                                : `Show All ${displayName}`}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {(isFashion ||
            isElectronics ||
            isDriedFruits ||
            isNuts ||
            isSkinCare ||
            isHairCare ||
            isFurniture ||
            isDriedPeas ||
            isPranksNovelties ||
            isFitnessGym ||
            isAccessories ||
            isSports ||
            isFootwear ||
            isTeenagers ||
            isKids ||
            isRiceSub) && (
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#0B3B78]">
                {activeCollection
                  ? `Products in ${activeCollection.name}`
                  : isRiceSub
                    ? `Verified ${activeRiceMealGroup ? `${activeRiceMealGroup.name} ` : ''}Rice Products`
                    : isElectronics
                    ? 'Featured Verified Electronics Products'
                    : isDriedFruits
                      ? 'Featured Verified Dried Fruits Packs'
                      : isNuts
                        ? 'Featured Verified Nuts Packs'
                        : isSkinCare
                          ? 'Featured Verified Skin Care Products'
                          : isHairCare
                            ? 'Featured Verified Hair Care Products'
                            : isFurniture
                              ? 'Featured Verified Furniture Products'
                              : isDriedPeas
                                ? 'Featured Verified Dried Peas & Pulses'
                                : isPranksNovelties
                                  ? 'Featured Verified Pranks & Novelties Products'
                                  : isFitnessGym
                                    ? 'Featured Verified Fitness & Gym Products'
                                    : isAccessories
                                      ? 'Featured Verified Accessories Products'
                                      : isSports
                                        ? 'Featured Verified Sports Products'
                                        : isFootwear
                                          ? 'Featured Verified Footwear Products'
                                          : isTeenagers
                                            ? 'Featured Verified Teenagers Products'
                                            : isKids
                                              ? 'Featured Verified Kids Products'
                                              : 'Featured Fashion Products'}
              </h2>
              <span className="text-xs font-semibold text-[#64748B]">
                {categoryProducts.length}{' '}
                {categoryProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          )}
          <div
            className={
              isFashion ||
              categoryProducts.every((p) => isFashionClothingProduct(p))
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            }
          >
            {categoryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Related Men's Fashion Collections when inspecting a single collection */}
      {isFashion && activeMensCollection && (
        <MensFashionCollectionsSection
          selectedParent={activeMensCollection.parentCategory}
          activeCollectionSlug={activeMensCollection.slug}
        />
      )}

      {/* Related Women's Fashion Collections when inspecting a single collection */}
      {isFashion && activeWomensCollection && (
        <WomensFashionCollectionsSection
          selectedParent={activeWomensCollection.parentCategory}
          activeCollectionSlug={activeWomensCollection.slug}
        />
      )}

      {/* Related Electronics Collections when inspecting a single collection */}
      {isElectronics && activeElectronicsCollection && (
        <ElectronicsCollectionsSection
          selectedGroup={
            activeElectronicsGroup?.name || activeElectronicsCollection.parentGroup
          }
          activeCollectionSlug={activeElectronicsCollection.slug}
        />
      )}

      {/* Related Dried Fruits Varieties when inspecting a single variety */}
      {isDriedFruits && activeDriedFruitCollection && (
        <DriedFruitsCollectionsSection
          activeCollectionSlug={activeDriedFruitCollection.slug}
        />
      )}

      {/* Related Nuts Varieties when inspecting a single variety */}
      {isNuts && activeNutCollection && (
        <NutsCollectionsSection
          activeCollectionSlug={activeNutCollection.slug}
        />
      )}

      {/* Related Skin Care Collections when inspecting a single collection */}
      {isSkinCare && activeSkinCareCollection && (
        <SkinCareCollectionsSection
          selectedGroup={
            activeSkinCareGroup?.name || activeSkinCareCollection.parentGroup
          }
          activeCollectionSlug={activeSkinCareCollection.slug}
        />
      )}

      {/* Related Hair Care Collections when inspecting a single collection */}
      {isHairCare && activeHairCareCollection && (
        <HairCareCollectionsSection
          selectedGroup={
            activeHairCareGroup?.name || activeHairCareCollection.parentGroup
          }
          activeCollectionSlug={activeHairCareCollection.slug}
        />
      )}

      {/* Related Furniture Collections when inspecting a single collection */}
      {isFurniture && activeFurnitureCollection && (
        <FurnitureCollectionsSection
          selectedGroup={
            activeFurnitureGroup?.name || activeFurnitureCollection.parentGroup
          }
          activeCollectionSlug={activeFurnitureCollection.slug}
        />
      )}

      {/* Related Dried Peas & Pulses Collections when inspecting a single collection */}
      {isDriedPeas && activeDriedPeasCollection && (
        <DriedPeasCollectionsSection
          selectedGroup={
            activeDriedPeasGroup?.name || activeDriedPeasCollection.parentGroup
          }
          activeCollectionSlug={activeDriedPeasCollection.slug}
        />
      )}

      {/* Related Pranks & Novelties Collections when inspecting a single collection */}
      {isPranksNovelties && activePranksNoveltiesCollection && (
        <PranksNoveltiesCollectionsSection
          selectedGroup={
            activePranksNoveltiesGroup?.name ||
            activePranksNoveltiesCollection.parentGroup
          }
          activeCollectionSlug={activePranksNoveltiesCollection.slug}
        />
      )}

      {/* Related Fitness & Gym Collections when inspecting a single collection */}
      {isFitnessGym && activeFitnessGymCollection && (
        <FitnessGymCollectionsSection
          selectedGroup={
            activeFitnessGymGroup?.name ||
            activeFitnessGymCollection.parentGroup
          }
          activeCollectionSlug={activeFitnessGymCollection.slug}
        />
      )}

      {/* Related Accessories Collections when inspecting a single collection */}
      {isAccessories && activeAccessoriesCollection && (
        <AccessoriesCollectionsSection
          selectedGroup={
            activeAccessoriesGroup?.name ||
            activeAccessoriesCollection.parentGroup
          }
          activeCollectionSlug={activeAccessoriesCollection.slug}
        />
      )}

      {/* Related Sports Collections when inspecting a single collection */}
      {isSports && activeSportsCollection && (
        <SportsCollectionsSection
          selectedGroup={
            activeSportsGroup?.name || activeSportsCollection.parentGroup
          }
          activeCollectionSlug={activeSportsCollection.slug}
        />
      )}

      {/* Related Footwear Collections when inspecting a single collection */}
      {isFootwear && activeFootwearCollection && (
        <FootwearCollectionsSection
          selectedGroup={
            activeFootwearGroup?.name || activeFootwearCollection.parentGroup
          }
          activeCollectionSlug={activeFootwearCollection.slug}
        />
      )}

      {/* Related Teenagers Collections when inspecting a single collection */}
      {isTeenagers && activeTeenagersCollection && (
        <TeenagersCollectionsSection
          selectedGroup={
            activeTeenagersGroup?.name || activeTeenagersCollection.parentGroup
          }
          activeCollectionSlug={activeTeenagersCollection.slug}
        />
      )}

      {/* Related Kids Collections when inspecting a single collection */}
      {isKids && activeKidsCollection && (
        <KidsCollectionsSection
          selectedGroup={
            activeKidsGroup?.name || activeKidsCollection.parentGroup
          }
          activeCollectionSlug={activeKidsCollection.slug}
        />
      )}

      {/* Related Rice Varieties when inspecting a single Rice variety */}
      {isRiceSub && activeRiceCollection && (
        <RiceCollectionsSection
          selectedMeal={activeRiceCollection.parentGroup}
          activeCollectionSlug={activeRiceCollection.slug}
        />
      )}
    </div>
  );
}
