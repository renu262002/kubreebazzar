import { useMemo } from 'react';
import { getEffectivePrice, useStore } from '../context/StoreContext';
import { productMatchesCategory } from '../data/categoryHierarchy';
import { isFashionClothingProduct } from '../utils/fashionUtils';
import type { Product } from '../types';
import { HomepageProductCarousel } from './HomepageProductCarousel';

const MAX_CAROUSEL_ITEMS = 16;

function sortCarouselProducts(items: Product[]): Product[] {
  return [...items]
    .sort((a, b) => {
      const aBuyable = getEffectivePrice(a) > 0 && a.stock > 0 ? 1 : 0;
      const bBuyable = getEffectivePrice(b) > 0 && b.stock > 0 ? 1 : 0;
      if (aBuyable !== bBuyable) return bBuyable - aBuyable;

      const aPriority = (a.featured ? 2 : 0) + (a.bestSeller ? 1 : 0);
      const bPriority = (b.featured ? 2 : 0) + (b.bestSeller ? 1 : 0);
      if (aPriority !== bPriority) return bPriority - aPriority;

      return 0;
    })
    .slice(0, MAX_CAROUSEL_ITEMS);
}

export function HomeCarouselsSection() {
  const { products, categories } = useStore();

  const activeProducts = useMemo(
    () => products.filter((p) => p.enabled !== false),
    [products]
  );

  const trendingProducts = useMemo(
    () => sortCarouselProducts(activeProducts.filter((p) => Boolean(p.trending))),
    [activeProducts]
  );

  const newArrivals = useMemo(
    () =>
      sortCarouselProducts(activeProducts.filter((p) => Boolean(p.newArrival))),
    [activeProducts]
  );

  const fashionProducts = useMemo(
    () =>
      sortCarouselProducts(
        activeProducts.filter((p) => isFashionClothingProduct(p))
      ),
    [activeProducts]
  );

  const groceriesAndSpices = useMemo(
    () =>
      sortCarouselProducts(
        activeProducts.filter((p) =>
          productMatchesCategory(
            p.category,
            p.subcategory,
            p.subSubcategory,
            'Groceries',
            categories
          )
        )
      ),
    [activeProducts, categories]
  );

  const babyAndSchoolKits = useMemo(
    () =>
      sortCarouselProducts(
        activeProducts.filter(
          (p) =>
            productMatchesCategory(
              p.category,
              p.subcategory,
              p.subSubcategory,
              'Baby Kit',
              categories
            ) ||
            productMatchesCategory(
              p.category,
              p.subcategory,
              p.subSubcategory,
              'School Kit',
              categories
            )
        )
      ),
    [activeProducts, categories]
  );

  const electronicsAndAccessories = useMemo(
    () =>
      sortCarouselProducts(
        activeProducts.filter(
          (p) =>
            productMatchesCategory(
              p.category,
              p.subcategory,
              p.subSubcategory,
              'Electronics',
              categories
            ) ||
            productMatchesCategory(
              p.category,
              p.subcategory,
              p.subSubcategory,
              'Accessories',
              categories
            )
        )
      ),
    [activeProducts, categories]
  );

  const carousels = [
    {
      id: 'carousel-trending-products',
      eyebrow: 'Popular Right Now',
      eyebrowColorClass: 'text-[#FF6B1A]',
      title: 'Trending Products',
      description: 'Customer favourites picking up momentum across KubreeBazzar.',
      products: trendingProducts,
      viewAllLabel: 'Explore Catalog',
      viewAllPath: '/shop',
      surfaceClassName: 'bg-white border-t border-[#DCE6F2]',
    },
    {
      id: 'carousel-new-arrivals',
      eyebrow: 'Freshly Added',
      eyebrowColorClass: 'text-[#1D6FD8]',
      title: 'New Arrivals',
      description: 'Latest additions published directly from our product catalogue.',
      products: newArrivals,
      viewAllLabel: 'View New Arrivals',
      viewAllPath: '/new-arrivals',
      surfaceClassName: 'bg-[#F0F6FF]/60 border-t border-[#DCE6F2]',
    },
    {
      id: 'carousel-fashion-dresses',
      eyebrow: 'Clothing & Apparel',
      eyebrowColorClass: 'text-[#BE185D]',
      title: 'Fashion & Dresses',
      description: "Men's & Women's shirts, chinos, silk sarees, churidars, and Korean wear.",
      products: fashionProducts,
      viewAllLabel: 'View All Fashion',
      viewAllPath: '/fashion',
      surfaceClassName: 'bg-white border-t border-[#DCE6F2]',
    },
    {
      id: 'carousel-groceries-spices',
      eyebrow: 'Daily Pantry & Aroma',
      eyebrowColorClass: 'text-[#2E7D32]',
      title: 'Groceries & Spices',
      description: 'Aged rice, millets, raw forest honey, whole spices, and freshly ground masalas.',
      products: groceriesAndSpices,
      viewAllLabel: 'View Groceries',
      viewAllPath: '/groceries',
      surfaceClassName: 'bg-[#F0F6FF]/60 border-t border-[#DCE6F2]',
    },
    {
      id: 'carousel-baby-school-kit',
      eyebrow: 'Curated Family Kits',
      eyebrowColorClass: 'text-[#1D6FD8]',
      title: 'Baby Kit & School Kit',
      description: 'Gentle everyday baby essentials alongside complete student stationery kits.',
      products: babyAndSchoolKits,
      viewAllLabel: 'Baby Kit',
      viewAllPath: '/baby-kit',
      secondaryLink: { label: 'School Kit', path: '/school-kit' },
      surfaceClassName: 'bg-white border-t border-[#DCE6F2]',
    },
    {
      id: 'carousel-electronics-accessories',
      eyebrow: 'Smart Tech & Lifestyle',
      eyebrowColorClass: 'text-[#0B3B78]',
      title: 'Electronics & Accessories',
      description: 'ANC wireless earbuds, fast GaN chargers, automatic watches, and leather goods.',
      products: electronicsAndAccessories,
      viewAllLabel: 'Electronics',
      viewAllPath: '/electronics',
      secondaryLink: { label: 'Accessories', path: '/accessories' },
      surfaceClassName: 'bg-[#F0F6FF]/60 border-t border-[#DCE6F2]',
    },
  ].filter((section) => section.products.length > 0);

  if (carousels.length === 0) {
    return null;
  }

  return (
    <div id="homepage-product-carousels" className="w-full max-w-full overflow-x-clip">
      {carousels.map((section) => (
        <HomepageProductCarousel
          key={section.id}
          id={section.id}
          eyebrow={section.eyebrow}
          eyebrowColorClass={section.eyebrowColorClass}
          title={section.title}
          description={section.description}
          products={section.products}
          viewAllLabel={section.viewAllLabel}
          viewAllPath={section.viewAllPath}
          secondaryLink={section.secondaryLink}
          surfaceClassName={section.surfaceClassName}
        />
      ))}
    </div>
  );
}
