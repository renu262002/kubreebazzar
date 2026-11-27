import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
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
  buildCategoryTree,
  getCategoryDisplayName,
  getSubcategoryDisplayName,
  getThirdLevelDisplayName,
} from '../data/categoryHierarchy';
import { filterAndSortProducts } from '../utils/catalogSearch';
import { isFashionClothingProduct } from '../utils/fashionUtils';
import { findMensFashionParentBySlug } from '../data/mensFashionCollections';
import {
  findWomensFashionCollection,
  findWomensFashionParentBySlug,
} from '../data/womensFashionCollections';
import type { ProductCategory } from '../types';

const ITEMS_PER_PAGE = 24;

function parseShopParams(routeStr: string) {
  const queryPart = routeStr.includes('?')
    ? routeStr.split('?')[1]
    : window.location.search.replace(/^\?/, '');
  const params = new URLSearchParams(queryPart);
  return {
    category: (params.get('category') as 'All' | ProductCategory) || 'All',
    subcategory: params.get('subcategory') || 'All',
    subSubcategory:
      params.get('subSubcategory') ||
      params.get('meal') ||
      params.get('type') ||
      'All',
  };
}

export function ShopPage() {
  const {
    route,
    products,
    categories,
    womensFashionCollections,
    banners,
    loadingProducts,
    navigate,
  } = useStore();

  // Sync URL query params whenever route changes
  const parsedParams = useMemo(() => parseShopParams(route), [route]);
  const selectedCategory = parsedParams.category;
  const selectedSubcategory = parsedParams.subcategory;
  const selectedSubSubcategory = parsedParams.subSubcategory;

  const [page, setPage] = useState(1);

  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories]
  );

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedSubcategory, selectedSubSubcategory]);

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, categories, {
      category: String(selectedCategory),
      subcategory: selectedSubcategory,
      subSubcategory: selectedSubSubcategory,
    });
  }, [
    products,
    categories,
    selectedCategory,
    selectedSubcategory,
    selectedSubSubcategory,
  ]);

  const effectiveItemsPerPage =
    selectedSubcategory !== 'All' || selectedSubSubcategory !== 'All'
      ? Math.max(ITEMS_PER_PAGE, filteredProducts.length)
      : ITEMS_PER_PAGE;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / effectiveItemsPerPage)
  );
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * effectiveItemsPerPage,
    page * effectiveItemsPerPage
  );

  const isFashionView =
    String(selectedCategory).toLowerCase() === 'fashion' ||
    (paginatedProducts.length > 0 &&
      paginatedProducts.every((p) => isFashionClothingProduct(p)));

  const resetFilters = () => {
    navigate('/shop');
  };

  const activeBanner = banners.find((b) => b.active);

  const headingTitle = useMemo(() => {
    const parts: string[] = [];
    if (selectedCategory !== 'All') {
      parts.push(getCategoryDisplayName(String(selectedCategory), categories));
    }
    if (selectedSubcategory !== 'All') {
      parts.push(getSubcategoryDisplayName(selectedSubcategory));
    }
    if (selectedSubSubcategory !== 'All') {
      parts.push(getThirdLevelDisplayName(selectedSubSubcategory));
    }
    return parts.length > 0
      ? parts.join(' › ')
      : `All ${categoryTree.length} Departments`;
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedSubSubcategory,
    categories,
    categoryTree.length,
  ]);

  useEffect(() => {
    document.title = `${headingTitle} | KubreeBazzar`;
  }, [headingTitle]);

  const isFashionCategory = String(selectedCategory).toLowerCase() === 'fashion';
  const isWomenSubcategory = selectedSubcategory.toLowerCase().includes('women');

  const activeMensParent = useMemo(() => {
    if (
      !isFashionCategory ||
      isWomenSubcategory ||
      selectedSubSubcategory === 'All'
    ) {
      return undefined;
    }
    return findMensFashionParentBySlug(selectedSubSubcategory);
  }, [isFashionCategory, isWomenSubcategory, selectedSubSubcategory]);

  const activeWomensParent = useMemo(() => {
    if (
      !isFashionCategory ||
      !isWomenSubcategory ||
      selectedSubSubcategory === 'All'
    ) {
      return undefined;
    }
    return findWomensFashionParentBySlug(selectedSubSubcategory);
  }, [isFashionCategory, isWomenSubcategory, selectedSubSubcategory]);

  const activeWomensCollection = useMemo(() => {
    if (
      !isFashionCategory ||
      !isWomenSubcategory ||
      selectedSubSubcategory === 'All' ||
      activeWomensParent
    ) {
      return undefined;
    }
    return findWomensFashionCollection(
      womensFashionCollections,
      selectedSubSubcategory
    );
  }, [
    isFashionCategory,
    isWomenSubcategory,
    selectedSubSubcategory,
    activeWomensParent,
    womensFashionCollections,
  ]);

  const heroThumbnail =
    activeMensParent?.image ||
    activeWomensParent?.image ||
    activeWomensCollection?.image ||
    '';
  const heroThumbnailAlt = activeMensParent
    ? `Men's ${activeMensParent.name}`
    : activeWomensParent
      ? `Women's ${activeWomensParent.name}`
      : activeWomensCollection
        ? `Women's ${activeWomensCollection.name}`
        : '';
  const heroExtraDesc =
    activeMensParent?.description ||
    activeWomensParent?.description ||
    activeWomensCollection?.description ||
    '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Shop Hero & Breadcrumb */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-white via-[#F0F6FF] to-[#EAF2FC] border border-[#DCE6F2] p-4 sm:p-10 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          {heroThumbnail && (
            <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-white border border-[#DCE6F2] p-1.5 shrink-0 overflow-hidden shadow-xs flex items-center justify-center">
              <img
                src={encodeURI(heroThumbnail)}
                alt={heroThumbnailAlt}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div>
            <p className="text-xs font-bold text-[#FF6B1A] uppercase tracking-wider mb-1.5 sm:mb-2">
              KubreeBazzar · Complete Catalog
            </p>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0B3B78]">
              {headingTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1.5 sm:mt-2">
              {heroExtraDesc
                ? `${heroExtraDesc} · Showing ${filteredProducts.length} products`
                : `Showing ${filteredProducts.length} products`}
              {activeBanner ? ` · ${activeBanner.title}` : ''}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {(selectedCategory !== 'All' ||
            selectedSubcategory !== 'All' ||
            selectedSubSubcategory !== 'All') && (
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-white border border-[#DCE6F2] hover:border-[#0B3B78] text-xs font-semibold text-[#0B3B78] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Show All Categories
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/offers')}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            View Active Offers
          </button>
        </div>
      </div>

      {/* Men's Fashion Clothing Collections when browsing Fashion or Men's Fashion */}
      {isFashionCategory && !isWomenSubcategory && (
        <div className="mb-8">
          <MensFashionCollectionsSection
            selectedParent={
              selectedSubSubcategory !== 'All' ? selectedSubSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Women's Fashion 78 Clothing Types when browsing Fashion or Women's Fashion */}
      {isFashionCategory &&
        (selectedSubcategory === 'All' || isWomenSubcategory) && (
          <div className="mb-8">
            <WomensFashionCollectionsSection
              selectedParent={
                isWomenSubcategory ? selectedSubSubcategory : 'All'
              }
            />
          </div>
        )}

      {/* Electronics 47 Collections across 10 Groups when browsing Electronics */}
      {String(selectedCategory).toLowerCase() === 'electronics' && (
        <div className="mb-8">
          <ElectronicsCollectionsSection
            selectedGroup={
              selectedSubcategory !== 'All' ? selectedSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Dried Fruits 15 Varieties when browsing Dried Fruits */}
      {(String(selectedCategory).toLowerCase() === 'dry fruits' ||
        String(selectedCategory).toLowerCase() === 'dried fruits') && (
        <div className="mb-8">
          <DriedFruitsCollectionsSection />
        </div>
      )}

      {/* Nuts 15 Varieties when browsing Nuts */}
      {(String(selectedCategory).toLowerCase() === 'dry nuts' ||
        String(selectedCategory).toLowerCase() === 'nuts') && (
        <div className="mb-8">
          <NutsCollectionsSection />
        </div>
      )}

      {/* Skin Care 30 Collections across 7 Groups when browsing Skin Care */}
      {(String(selectedCategory).toLowerCase() === 'skin care' ||
        String(selectedCategory).toLowerCase() === 'skin-care') && (
        <div className="mb-8">
          <SkinCareCollectionsSection
            selectedGroup={
              selectedSubcategory !== 'All' ? selectedSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Hair Care 30 Collections across 7 Groups when browsing Hair Care */}
      {(String(selectedCategory).toLowerCase() === 'hair care' ||
        String(selectedCategory).toLowerCase() === 'hair-care') && (
        <div className="mb-8">
          <HairCareCollectionsSection
            selectedGroup={
              selectedSubcategory !== 'All' ? selectedSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Furniture 30 Collections across 7 Groups when browsing Furniture */}
      {String(selectedCategory).toLowerCase() === 'furniture' && (
        <div className="mb-8">
          <FurnitureCollectionsSection
            selectedGroup={
              selectedSubcategory !== 'All' ? selectedSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Dried Peas & Related Dried Pulses Collections when browsing Dried Peas */}
      {(String(selectedCategory).toLowerCase() === 'dry peas' ||
        String(selectedCategory).toLowerCase() === 'dried peas') && (
        <div className="mb-8">
          <DriedPeasCollectionsSection
            selectedGroup={
              selectedSubcategory !== 'All' ? selectedSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Pranks & Novelties 30 Collections across 7 Groups when browsing Prank Items */}
      {(String(selectedCategory).toLowerCase() === 'prank items' ||
        String(selectedCategory).toLowerCase() === 'pranks & novelties' ||
        String(selectedCategory).toLowerCase() === 'pranks-novelties') && (
        <div className="mb-8">
          <PranksNoveltiesCollectionsSection
            selectedGroup={
              selectedSubcategory !== 'All' ? selectedSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Fitness & Gym 35 Collections across 7 Groups when browsing Gym / Fitness & Gym */}
      {(String(selectedCategory).toLowerCase() === 'gym' ||
        String(selectedCategory).toLowerCase() === 'fitness & gym' ||
        String(selectedCategory).toLowerCase() === 'fitness-gym') && (
        <div className="mb-8">
          <FitnessGymCollectionsSection
            selectedGroup={
              selectedSubcategory !== 'All' ? selectedSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Accessories 35 Collections across 8 Groups when browsing Accessories */}
      {(String(selectedCategory).toLowerCase() === 'accessories' ||
        String(selectedCategory).toLowerCase() === 'watches') && (
        <div className="mb-8">
          <AccessoriesCollectionsSection
            selectedGroup={
              selectedSubcategory !== 'All' ? selectedSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Sports 40 Collections across 10 Groups when browsing Sports */}
      {String(selectedCategory).toLowerCase() === 'sports' && (
        <div className="mb-8">
          <SportsCollectionsSection
            selectedGroup={
              selectedSubcategory !== 'All' ? selectedSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Footwear 40 Collections across 7 Groups when browsing Footwear */}
      {String(selectedCategory).toLowerCase() === 'footwear' && (
        <div className="mb-8">
          <FootwearCollectionsSection
            selectedGroup={
              selectedSubcategory !== 'All' ? selectedSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Teenagers 64 Collections across 10 Groups when browsing Teenagers */}
      {(String(selectedCategory).toLowerCase() === 'teenager' ||
        String(selectedCategory).toLowerCase() === 'teenagers') && (
        <div className="mb-8">
          <TeenagersCollectionsSection
            selectedGroup={
              selectedSubcategory !== 'All' ? selectedSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Kids 65 Collections across 11 Groups when browsing Kids */}
      {String(selectedCategory).toLowerCase() === 'kids' && (
        <div className="mb-8">
          <KidsCollectionsSection
            selectedGroup={
              selectedSubcategory !== 'All' ? selectedSubcategory : 'All'
            }
          />
        </div>
      )}

      {/* Groceries -> Rice (Breakfast, Lunch, Dinner & 16 Rice Varieties) */}
      {(String(selectedCategory).toLowerCase() === 'groceries' ||
        String(selectedCategory).toLowerCase() === 'grocery') &&
        String(selectedSubcategory).toLowerCase() === 'rice' && (
          <div className="mb-8">
            <RiceCollectionsSection
              selectedMeal={
                selectedSubSubcategory !== 'All'
                  ? selectedSubSubcategory
                  : 'All'
              }
            />
          </div>
        )}

      {/* Product Grid */}
      {loadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 rounded-2xl bg-white border border-[#DCE6F2] animate-pulse"
            />
          ))}
        </div>
      ) : paginatedProducts.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-12 text-center my-6">
          <p className="font-display text-xl font-bold text-[#0B3B78]">
            {String(selectedCategory).toLowerCase() === 'fashion'
              ? 'Products in this style are coming soon'
              : 'No products found in this category'}
          </p>
          <p className="text-xs text-[#64748B] mt-1">
            Explore the full catalog to view all available products.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 px-4 py-2 rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Full Catalog</span>
          </button>
        </div>
      ) : (
        <>
          <div
            className={
              isFashionView
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            }
          >
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
                className="px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs text-[#0B3B78] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
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
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs text-[#0B3B78] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
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
