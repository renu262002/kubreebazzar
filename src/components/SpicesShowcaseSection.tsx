import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SPICE_COLLECTION_ITEMS, UploadedProductImage } from '../data/uploadedProducts';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

export const SpicesShowcaseSection: React.FC = () => {
  const { navigate, products } = useStore();

  const resolveSpiceProduct = (spice: UploadedProductImage): Product => {
    const slugMap: Record<string, string> = {
      'elaka.jpg': 'idukki-whole-green-cardamom-elaka',
      'lavangam.png': 'hand-sorted-aromatic-whole-cloves-lavangam',
      'patai.jpg': 'ceylon-cinnamon-quills-star-anise-patai',
      'seeragam.jpg': 'sun-dried-aromatic-cumin-seeds-seeragam',
    };
    const targetSlug = slugMap[spice.filename] || spice.slug;
    const live = products.find((p) => p.slug === targetSlug);
    if (live) return live;

    return {
      id: spice.id,
      name: spice.name,
      slug: spice.slug,
      category: 'Groceries',
      subcategory: spice.subcategory,
      brand: 'Spice Route',
      price: spice.price,
      discountPercent: spice.discountPercent,
      images: [spice.src],
      shortDescription: spice.description,
      description: spice.description,
      rating: spice.rating,
      reviewCount: spice.reviewsCount,
      stock: 40,
      tags: ['Spices', 'Pure'],
      modelType: 'grocery',
      createdAt: '2024-01-01T00:00:00.000Z',
      featured: true,
      trending: true,
      bestSeller: true,
      newArrival: true,
      variants: [
        { id: 'var-std', name: spice.unit, label: spice.unit, priceDelta: 0, stock: 40 },
      ],
      specs: [
        { label: 'Origin', value: 'High-Altitude Indian Estates' },
        { label: 'Form', value: 'Whole Unadulterated Pods / Seeds' },
      ],
    };
  };

  return (
    <section className="reveal-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B1A]">
            Pure South Indian &amp; Ceylon Spices
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3B78] mt-1 text-balance">
            Bring Flavour to Every Meal.
          </h2>
        </div>
        <button
          type="button"
          onClick={() => navigate('/groceries')}
          className="text-sm font-bold text-[#1D6FD8] hover:text-[#0B3B78] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Explore All Groceries &amp; Spices</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Responsive 1-card Mobile / 2-card Tablet / 3-card Desktop / 4-card Large Desktop Spice Grid */}
      <div className="stagger-product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SPICE_COLLECTION_ITEMS.map((spice) => {
          const item = resolveSpiceProduct(spice);
          return (
            <div key={item.id} className="stagger-product-card">
              <ProductCard product={item} />
            </div>
          );
        })}
      </div>
    </section>
  );
};
