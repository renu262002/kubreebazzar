import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { KubreeBazzarLogo } from './KubreeBazzarLogo';
import { ResilientImage } from './ResilientImage';
import type { ProductCategory } from '../types';

interface HeroPhotorealShowcaseProps {
  onSelectProduct: (slug: string) => void;
}

const HERO_CATEGORY_CONFIG: {
  category: ProductCategory;
  label: string;
  subtitle: string;
  studioImage: string;
  fallbackSlug: string;
  floatDelay: number;
  depthFactor: number;
}[] = [
  {
    category: 'Rice',
    label: 'Aged Basmati & Ponni',
    subtitle: 'Rice Harvests',
    studioImage: '/images/hero_rice_bowl_bag_1793936931121.jpg',
    fallbackSlug: 'royal-aged-basmati-rice',
    floatDelay: 0,
    depthFactor: 14,
  },
  {
    category: 'Watches',
    label: 'Sovereign Automatic',
    subtitle: 'Luxury Timepieces',
    studioImage: '/images/hero_luxury_watch_studio_1793936930915.jpg',
    fallbackSlug: 'kaveri-sovereign-maroon-automatic',
    floatDelay: 0.45,
    depthFactor: 20,
  },
  {
    category: 'Grocery',
    label: 'Cold-Pressed Oils & Spices',
    subtitle: 'Pantry Staples',
    studioImage: '/images/hero_grocery_basket_1793936930249.jpg',
    fallbackSlug: 'cold-pressed-gingelly-oil',
    floatDelay: 0.9,
    depthFactor: 16,
  },
  {
    category: 'Honey',
    label: 'Wild Forest Glass Jar',
    subtitle: 'Golden Honey',
    studioImage: '/images/hero_honey_drip_jar_1793936931141.jpg',
    fallbackSlug: 'nilgiri-wild-forest-honey',
    floatDelay: 1.35,
    depthFactor: 18,
  },
];

export function HeroPhotorealShowcase({
  onSelectProduct,
}: HeroPhotorealShowcaseProps) {
  const { products } = useStore();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    checkViewport();
    window.addEventListener('resize', checkViewport);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onMqChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onMqChange);

    return () => {
      window.removeEventListener('resize', checkViewport);
      mq.removeEventListener('change', onMqChange);
    };
  }, []);

  const cards = useMemo(() => {
    return HERO_CATEGORY_CONFIG.map((cfg) => {
      const match =
        products.find((p) => p.category === cfg.category && p.featured) ||
        products.find((p) => p.category === cfg.category);
      return {
        ...cfg,
        slug: match?.slug || cfg.fallbackSlug,
        productName: match?.name || cfg.label,
        price: match ? getEffectivePrice(match) : null,
      };
    });
  }, [products]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMobile || reducedMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setPointer({ x: nx, y: ny });
  };

  const handlePointerLeave = () => {
    setPointer({ x: 0, y: 0 });
  };

  const tiltX = reducedMotion || isMobile ? 0 : -pointer.y * 6;
  const tiltY = reducedMotion || isMobile ? 0 : pointer.x * 7;

  return (
    <div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Subtle warm radial glow behind the 4 studio cards */}
      <div
        aria-hidden="true"
        className="absolute inset-6 rounded-full bg-gradient-to-tr from-[#D4A64A]/20 via-[#FFFDF8]/60 to-[#741D35]/15 blur-2xl pointer-events-none"
      />

      {/* 3D Perspective Tilt Grid of 4 Realistic Studio Product Photographs */}
      <motion.div
        animate={{
          rotateX: tiltX,
          rotateY: tiltY,
        }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full max-w-[540px] grid grid-cols-2 gap-3.5 sm:gap-4 p-2"
      >
        {cards.map((card, idx) => {
          const parallaxX =
            reducedMotion || isMobile ? 0 : pointer.x * card.depthFactor * 0.45;
          const parallaxY =
            reducedMotion || isMobile ? 0 : pointer.y * card.depthFactor * 0.45;

          return (
            <motion.button
              key={card.category}
              type="button"
              onClick={() => onSelectProduct(card.slug)}
              initial={reducedMotion ? false : { opacity: 0, y: 22, scale: 0.96 }}
              animate={
                reducedMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      y: [0, idx % 2 === 0 ? -6 : 6, 0],
                      scale: 1,
                    }
              }
              transition={
                reducedMotion
                  ? { duration: 0.2 }
                  : {
                      opacity: { duration: 0.55, delay: idx * 0.08 },
                      scale: { duration: 0.55, delay: idx * 0.08 },
                      y: {
                        duration: 4.2 + idx * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: card.floatDelay,
                      },
                    }
              }
              whileHover={reducedMotion ? undefined : { scale: 1.03, y: -4 }}
              style={{
                transform: `translate3d(${parallaxX}px, ${parallaxY}px, ${
                  20 + idx * 6
                }px)`,
                boxShadow:
                  '0 20px 38px -14px rgba(116, 29, 53, 0.18), 0 8px 18px -8px rgba(34, 34, 34, 0.12)',
              }}
              className="group relative rounded-2xl overflow-hidden bg-[#FFFDF8] border border-[#E6DDD0] hover:border-[#741D35] text-left transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#741D35]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#F7F0E5] relative">
                <ResilientImage
                  src={card.studioImage}
                  alt={`${card.category} — ${card.productName}`}
                  eager
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Subtle studio specular sheen on hover */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/20 opacity-70 group-hover:opacity-90 transition-opacity pointer-events-none"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#FFFDF8]/92 backdrop-blur-xs border border-[#E6DDD0] text-[10px] font-bold uppercase tracking-wider text-[#741D35]">
                  {card.category}
                </span>
                <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#FFFDF8]/90 border border-[#E6DDD0] flex items-center justify-center text-[#741D35] opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="p-3 bg-[#FFFDF8]">
                <div className="text-[11px] font-medium text-[#6E6059]">
                  {card.subtitle}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#222222] truncate mt-0.5">
                  {card.productName}
                </div>
                {card.price !== null && (
                  <div className="font-mono text-xs font-bold text-[#741D35] mt-1">
                    ₹{card.price.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}

        {/* Central Rotating 3D KubreeBazzar Emblem Medallion */}
        <div
          style={{ transform: 'translateZ(52px)' }}
          className="hidden sm:flex items-center justify-center pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="px-4 py-2.5 rounded-2xl bg-[#FFFDF8]/95 backdrop-blur-md border border-[#D4A64A] shadow-xl">
            <KubreeBazzarLogo size="sm" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
