import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ResilientImage } from './ResilientImage';
import type { ModelPreset, ProductCategory } from '../types';

interface CategoryPhotoStageProps {
  activePreset: ModelPreset;
}

const PRESET_TO_CATEGORY: Record<ModelPreset, ProductCategory> = {
  rice: 'Rice',
  grocery: 'Grocery',
  honey: 'Honey',
  watch: 'Watches',
};

const STUDIO_CATEGORY_IMAGES: Record<ModelPreset, string> = {
  rice: '/src/assets/images/hero_rice_bowl_bag_1793936931121.jpg',
  grocery: '/src/assets/images/hero_grocery_basket_1793936930249.jpg',
  honey: '/src/assets/images/hero_honey_drip_jar_1793936931141.jpg',
  watch: '/src/assets/images/hero_luxury_watch_studio_1793936930915.jpg',
};

export function CategoryPhotoStage({ activePreset }: CategoryPhotoStageProps) {
  const { products, navigate } = useStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const category = PRESET_TO_CATEGORY[activePreset];
  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === category).slice(0, 3),
    [products, category]
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ rx: -ny * 7, ry: nx * 8 });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full flex flex-col justify-between p-3 sm:p-4 select-none"
      style={{ perspective: '1000px' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activePreset}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 10 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: tilt.rx,
            rotateY: tilt.ry,
          }}
          exit={reducedMotion ? undefined : { opacity: 0, scale: 0.97, y: -8 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            transformStyle: 'preserve-3d',
            boxShadow:
              '0 22px 40px -16px rgba(116, 29, 53, 0.2), 0 8px 16px -8px rgba(34, 34, 34, 0.1)',
          }}
          className="relative flex-1 rounded-xl overflow-hidden border border-[#E6DDD0] bg-[#FFFDF8] group"
        >
          <ResilientImage
            src={STUDIO_CATEGORY_IMAGES[activePreset]}
            alt={`KubreeBazzar ${category} Studio Collection`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#222222]/75 via-[#222222]/15 to-transparent pointer-events-none"
          />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4A64A]">
                KubreeBazzar {category}
              </span>
              <div className="font-display text-lg sm:text-xl font-bold leading-snug">
                {categoryProducts[0]?.name || `${category} Collection`}
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/${activePreset === 'watch' ? 'watches' : activePreset}`)}
              className="px-3.5 py-2 rounded-lg bg-[#741D35] hover:bg-[#5A1528] text-white text-xs font-semibold inline-flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Real Database Product Thumbnails Strip */}
      {categoryProducts.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 pt-3">
          {categoryProducts.map((prod) => (
            <button
              key={prod.id}
              type="button"
              onClick={() => navigate(`/product/${prod.slug}`)}
              className="group/thumb flex items-center gap-2 p-2 rounded-xl bg-[#FFFDF8] border border-[#E6DDD0] hover:border-[#741D35] text-left transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#F7F0E5] shrink-0">
                <ResilientImage
                  src={prod.images[0] || STUDIO_CATEGORY_IMAGES[activePreset]}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-[#222222] truncate">
                  {prod.name}
                </div>
                <div className="font-mono text-[10px] font-bold text-[#741D35]">
                  ₹{getEffectivePrice(prod).toLocaleString('en-IN')}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
