import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  MAIN_CATEGORY_DEFINITIONS,
  getCategoryDisplayName,
} from '../data/categoryHierarchy';
import { ResilientImage } from './ResilientImage';
import { resolveCategoryFallbackImage } from '../three/resolveProductGlb';

interface ProductOrbitHeroProps {
  onNavigate: (path: string) => void;
}

interface OrbitCategoryItem {
  id: string;
  label: string;
  src: string;
  fallbackSrc: string;
  targetUrl: string;
  isStudioDark: boolean;
}

const ORBIT_CATEGORY_IMAGE_MAP: Record<string, string> = {
  temple: '/images/temple-kit/basket.png',
  'temple & pooja essentials': '/images/temple-kit/basket.png',
  'baby kit': '/images/baby-kit/baby shampoo.png',
  baby: '/images/baby-kit/baby shampoo.png',
  kids: '/images/categories/kids.jpg',
  teenager: '/images/categories/teenagers.jpg',
  teenagers: '/images/categories/teenagers.jpg',
  'school kit': '/images/school-kit/school bag.png',
  school: '/images/school-kit/school bag.png',
  groceries: '/images/categories/groceries.jpg',
  'dry nuts': '/images/categories/nuts.jpg',
  nuts: '/images/categories/nuts.jpg',
  'dry fruits': '/images/categories/dried-fruits.jpg',
  'dried fruits': '/images/categories/dried-fruits.jpg',
  'hair care': '/images/categories/hair-care.jpg',
  'skin care': '/images/categories/skin-care.jpg',
  electronics: '/images/categories/electronics.jpg',
  furniture: '/images/categories/furniture.jpg',
  'prank items': '/images/categories/pranks-novelties.jpg',
  'pranks & novelties': '/images/categories/pranks-novelties.jpg',
  'used bikes and cars': '/images/categories/used-bikes-cars.jpg',
  'used bikes & cars': '/images/categories/used-bikes-cars.jpg',
  'dry peas': '/images/categories/dried-peas.jpg',
  'dried peas': '/images/categories/dried-peas.jpg',
  gym: '/images/categories/fitness-gym.jpg',
  'fitness & gym': '/images/categories/fitness-gym.jpg',
  sports: '/images/categories/sports.jpg',
  accessories: '/images/hero_luxury_watch_studio_1793936930915.jpg',
  footwear: '/images/product_footwear_runner_1793868611251.jpg',
  fashion: '/images/categories/fashion.jpg',
};

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export const ProductOrbitHero: React.FC<ProductOrbitHeroProps> = ({
  onNavigate,
}) => {
  const { categories } = useStore();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [stageSize, setStageSize] = useState({ width: 580, height: 480 });
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isStageVisible, setIsStageVisible] = useState(true);
  const hoveredIndexRef = useRef<number | null>(null);

  const visibleSlots = isMobileViewport ? 4 : 8;
  // Start progress so the first 7–8 (or 3–4 on mobile) categories are immediately distributed cleanly around the orbit
  const orbitProgressRef = useRef<number>(visibleSlots - 0.5);
  const orbitSpeedRef = useRef<number>(1);
  const prevSlotsRef = useRef<number>(visibleSlots);

  const orbitItems: OrbitCategoryItem[] = useMemo(() => {
    const runtimeMains = categories
      .filter(
        (c) => c.status !== 'inactive' && !c.parentCategoryId && !c.parentId
      )
      .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

    const mergedById = new Map<string, (typeof MAIN_CATEGORY_DEFINITIONS)[number]>();
    for (const def of MAIN_CATEGORY_DEFINITIONS) {
      mergedById.set(def.id.toLowerCase(), def);
    }
    for (const cat of runtimeMains) {
      const key = cat.id.toLowerCase();
      const existing = mergedById.get(key);
      mergedById.set(key, existing ? { ...existing, ...cat } : cat);
    }

    const activeList = Array.from(mergedById.values())
      .filter((c) => c.status !== 'inactive')
      .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

    return activeList.map((cat) => {
      const label =
        getCategoryDisplayName(cat.id, categories) || cat.name || cat.id;
      const mappedSrc =
        ORBIT_CATEGORY_IMAGE_MAP[cat.id.toLowerCase()] ||
        ORBIT_CATEGORY_IMAGE_MAP[label.toLowerCase()];
      const fallbackSrc = cat.image || resolveCategoryFallbackImage(cat.id);
      const src = mappedSrc || fallbackSrc;
      const isStudioDark =
        src.includes('/baby-kit/') ||
        src.includes('/temple-kit/') ||
        src.includes('/school-kit/');

      return {
        id: cat.id,
        label,
        src,
        fallbackSrc,
        targetUrl: `/${cat.slug}`,
        isStudioDark,
      };
    });
  }, [categories]);

  // Measure orbit stage cleanly across desktop, tablet, and mobile
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setStageSize({ width: rect.width, height: rect.height });
      }
      setIsMobileViewport(window.innerWidth < 640);
    };

    updateSize();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateSize);
      observer.observe(el);
      window.addEventListener('resize', updateSize);
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', updateSize);
      };
    }

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Re-align orbit window seamlessly if crossing between mobile (4 slots) and desktop (8 slots)
  useEffect(() => {
    if (prevSlotsRef.current !== visibleSlots) {
      orbitProgressRef.current = Math.max(
        orbitProgressRef.current,
        visibleSlots - 0.5
      );
      prevSlotsRef.current = visibleSlots;
    }
  }, [visibleSlots]);

  // Pause orbital animations when hero is scrolled out of view
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setIsStageVisible(entries[0].isIntersecting);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Gentle vertical floating effect on the centered logo disc
  useEffect(() => {
    const el = logoWrapRef.current;
    if (!el) return;
    const saveData = Boolean(
      (navigator as { connection?: { saveData?: boolean } }).connection?.saveData
    );
    if (
      !isStageVisible ||
      saveData ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const tween = gsap.to(el, {
      y: -7,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      tween.kill();
    };
  }, [isStageVisible]);

  const isCompactMobile = stageSize.width < 360;
  const isMobile = stageSize.width >= 360 && stageSize.width < 520;
  const isTablet = stageSize.width >= 520 && stageSize.width < 600;

  const cardHalfWidth = isCompactMobile
    ? 37
    : isMobile
      ? 42
      : isTablet
        ? 52
        : 62;
  const cardHalfHeight = isCompactMobile
    ? 44
    : isMobile
      ? 49
      : isTablet
        ? 58
        : 66;

  const radiusX = isCompactMobile
    ? Math.max(
        82,
        Math.min(stageSize.width * 0.36, stageSize.width / 2 - cardHalfWidth - 6)
      )
    : Math.max(
        104,
        Math.min(
          stageSize.width * 0.37,
          stageSize.width / 2 - cardHalfWidth - 10
        )
      );
  const radiusY = isCompactMobile
    ? Math.max(
        76,
        Math.min(
          stageSize.height * 0.34,
          stageSize.height / 2 - cardHalfHeight - 6
        )
      )
    : Math.max(
        92,
        Math.min(
          stageSize.height * 0.35,
          stageSize.height / 2 - cardHalfHeight - 10
        )
      );

  // Continuous clockwise 20-category elliptical orbit using requestAnimationFrame
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const saveData = Boolean(
      (navigator as { connection?: { saveData?: boolean } }).connection?.saveData
    );

    let frameId = 0;
    let lastTime = performance.now();
    const totalCount = orbitItems.length;
    // Speed in category slots per second (~0.36 slots/sec -> ~55s for a full 20-category cycle, ~22s per orbital lap)
    const baseSlotVelocity = isMobileViewport ? 0.32 : 0.38;
    const fadeArc = isMobileViewport ? 0.55 : 0.72;

    const positionCards = (progress: number) => {
      if (totalCount === 0) return;

      for (let i = 0; i < totalCount; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        // Slot position s in [0, totalCount); active window is (0, visibleSlots)
        const s = (((progress - i) % totalCount) + totalCount) % totalCount;

        if (s <= 0.01 || s >= visibleSlots - 0.01) {
          cardEl.style.opacity = '0';
          cardEl.style.visibility = 'hidden';
          cardEl.style.pointerEvents = 'none';
          cardEl.style.zIndex = '1';
          cardEl.setAttribute('aria-hidden', 'true');
          cardEl.tabIndex = -1;
          continue;
        }

        // Map s in [0, visibleSlots] -> angle in [-PI/2, +3PI/2] (clockwise around central logo)
        const angle = -Math.PI / 2 + (s / visibleSlots) * Math.PI * 2;
        const x = radiusX * Math.cos(angle);
        const y = radiusY * Math.sin(angle);

        // sin(angle) ranges -1 (back/top) to +1 (front/bottom)
        const depth = (Math.sin(angle) + 1) * 0.5;
        const entryFade = smoothstep(0, fadeArc, s);
        const exitFade = smoothstep(visibleSlots, visibleSlots - fadeArc, s);
        const edgeFade = Math.min(entryFade, exitFade);

        const baseScale = (0.76 + depth * 0.3) * (0.82 + 0.18 * edgeFade);
        const isHovered = hoveredIndexRef.current === i;
        const finalScale = isHovered
          ? Math.max(baseScale, 0.98) * 1.12
          : baseScale;
        const opacity = isHovered ? 1 : (0.74 + depth * 0.26) * edgeFade;
        const zIndex = isHovered ? 50 : Math.round(10 + depth * 28);

        cardEl.style.visibility = opacity > 0.02 ? 'visible' : 'hidden';
        cardEl.style.pointerEvents = edgeFade > 0.22 ? 'auto' : 'none';
        cardEl.style.transform = `translate3d(calc(-50% + ${x.toFixed(
          2
        )}px), calc(-50% + ${y.toFixed(2)}px), 0) scale(${finalScale.toFixed(
          3
        )})`;
        cardEl.style.opacity = opacity.toFixed(3);
        cardEl.style.zIndex = String(zIndex);
        cardEl.setAttribute('aria-hidden', edgeFade > 0.22 ? 'false' : 'true');
        cardEl.tabIndex = edgeFade > 0.22 ? 0 : -1;
      }
    };

    positionCards(orbitProgressRef.current);

    if (prefersReducedMotion || saveData || !isStageVisible) {
      return;
    }

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const targetSpeed = hoveredIndexRef.current !== null ? 0 : 1;
      orbitSpeedRef.current +=
        (targetSpeed - orbitSpeedRef.current) * Math.min(1, dt * 7);

      orbitProgressRef.current =
        (orbitProgressRef.current + dt * baseSlotVelocity * orbitSpeedRef.current) %
        totalCount;

      positionCards(orbitProgressRef.current);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [orbitItems.length, visibleSlots, radiusX, radiusY, isStageVisible, isMobileViewport]);

  const handleCardEnter = (idx: number, e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    hoveredIndexRef.current = idx;
    setHoveredIndex(idx);
  };

  const handleCardLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    hoveredIndexRef.current = null;
    setHoveredIndex(null);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF3FF] via-[#F5F9FF] to-white border-b border-[#DCE6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-6 items-center">
          {/* LEFT COLUMN (~45% desktop): Hero Text & Actions */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5 text-center lg:text-left">
            <h1 className="hero-stage-text font-display text-3xl min-[380px]:text-4xl sm:text-5xl lg:text-[54px] font-bold leading-[1.08] tracking-tight text-[#0B3B78] text-balance">
              Welcome to <span className="text-[#0B3B78]">Kubree</span>
              <span className="text-[#FF6B1A]">Bazzar</span>
            </h1>

            <p className="hero-stage-text text-sm min-[380px]:text-base sm:text-lg lg:text-xl font-bold text-[#1D6FD8]">
              Everything You Need, All in One Place.
            </p>

            <p className="hero-stage-text text-xs sm:text-base text-[#475569] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore everyday essentials, fashion, electronics, lifestyle
              products and more — all in one convenient shopping destination.
            </p>

            <div className="hero-stage-text flex flex-col min-[380px]:flex-row flex-wrap items-stretch min-[380px]:items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('/shop')}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById('shop-by-category')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-[#F0F6FF] text-[#0B3B78] border-2 border-[#0B3B78] text-sm font-bold inline-flex items-center justify-center transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                Explore Categories
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN (~55% desktop): Central Circular Logo + 20-Category Revolving Orbit */}
          <div className="lg:col-span-7">
            <div
              ref={stageRef}
              className="relative w-full h-[285px] min-[375px]:h-[320px] sm:h-[430px] lg:h-[490px] flex items-center justify-center select-none"
              style={{ perspective: '1000px' }}
            >
              {/* Soft Blue & Green Ambient Glow Behind Central Logo */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full pointer-events-none blur-2xl opacity-75"
                style={{
                  background:
                    'radial-gradient(circle, rgba(29,111,216,0.22) 0%, rgba(76,175,80,0.20) 48%, transparent 74%)',
                }}
              />

              {/* Two Subtle Dotted Elliptical Orbit Rings Behind Cards */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                viewBox={`0 0 ${stageSize.width} ${stageSize.height}`}
                preserveAspectRatio="none"
              >
                <ellipse
                  cx={stageSize.width / 2}
                  cy={stageSize.height / 2}
                  rx={radiusX}
                  ry={radiusY}
                  fill="none"
                  stroke="#1D6FD8"
                  strokeOpacity="0.28"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                />
                <ellipse
                  cx={stageSize.width / 2}
                  cy={stageSize.height / 2}
                  rx={radiusX * 0.72}
                  ry={radiusY * 0.72}
                  fill="none"
                  stroke="#4CAF50"
                  strokeOpacity="0.24"
                  strokeWidth="1.25"
                  strokeDasharray="3 6"
                />
              </svg>

              {/* Central Circular White Disc with Original KubreeBazzar Turtle Logo */}
              <div
                ref={logoWrapRef}
                className="relative z-[24] flex items-center justify-center pointer-events-none"
                style={{ willChange: 'transform' }}
              >
                <div className="w-20 h-20 min-[375px]:w-24 min-[375px]:h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full bg-white border-[3px] sm:border-4 border-[#1D6FD8] shadow-[0_18px_45px_-12px_rgba(29,111,216,0.28),0_0_28px_rgba(76,175,80,0.18)] flex items-center justify-center p-2 sm:p-4">
                  <img
                    src="/assets/aistudio/Cheerful_Turtle_Shopping_Logo_75435e9c.png"
                    alt="KubreeBazzar Logo"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (
                        img.src.includes(
                          'Cheerful_Turtle_Shopping_Logo_75435e9c.png'
                        )
                      ) {
                        img.src = '/images/kubreebazzar-logo.png';
                      } else if (
                        img.src.includes('/images/kubreebazzar-logo.png')
                      ) {
                        img.src = '/kubreebazzar-logo.png';
                      }
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 20 Main Shopping Categories Cycling Smoothly Around the Central Orbit */}
              {orbitItems.map((item, idx) => {
                const isHovered = hoveredIndex === idx;
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    type="button"
                    title={item.label}
                    aria-label={`Explore ${item.label}`}
                    onClick={() => onNavigate(item.targetUrl)}
                    onPointerEnter={(e) => handleCardEnter(idx, e)}
                    onPointerLeave={handleCardLeave}
                    onFocus={() => {
                      hoveredIndexRef.current = idx;
                      setHoveredIndex(idx);
                    }}
                    onBlur={() => {
                      hoveredIndexRef.current = null;
                      setHoveredIndex(null);
                    }}
                    data-orbit-category={item.id}
                    className={`orbit-category-card absolute left-1/2 top-1/2 w-[74px] min-[375px]:w-[82px] sm:w-[104px] lg:w-[124px] rounded-xl sm:rounded-2xl bg-white border p-1 sm:p-2 text-center cursor-pointer transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] ${
                      isHovered
                        ? 'border-[#1D6FD8] shadow-[0_22px_40px_-10px_rgba(11,59,120,0.32)]'
                        : 'border-[#DCE6F2] shadow-[0_10px_24px_-8px_rgba(11,59,120,0.18)]'
                    }`}
                    style={{
                      willChange: 'transform, opacity',
                      transform: 'translate3d(-50%, -50%, 0)',
                      opacity: 0,
                      visibility: 'hidden',
                    }}
                  >
                    <div
                      className={`aspect-[4/3] w-full rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center ${
                        item.isStudioDark
                          ? 'bg-[#090C12] p-1 sm:p-1.5'
                          : 'bg-[#F8FAFC]'
                      }`}
                    >
                      <ResilientImage
                        src={item.src}
                        fallbackSrc={item.fallbackSrc}
                        alt={item.label}
                        eager={idx < 8}
                        className={`w-full h-full ${
                          item.isStudioDark ? 'object-contain' : 'object-cover'
                        }`}
                      />
                    </div>
                    <div className="mt-1 sm:mt-1.5 min-h-[24px] sm:min-h-[28px] flex items-center justify-center px-0.5">
                      <p className="text-[9px] min-[375px]:text-[10px] sm:text-[11px] font-bold text-[#1D6FD8] leading-tight line-clamp-2">
                        {item.label}
                      </p>
                    </div>
                    {isHovered && (
                      <span
                        role="tooltip"
                        className="hidden sm:inline-block absolute left-1/2 -translate-x-1/2 -bottom-7 px-2.5 py-0.5 rounded-lg bg-[#0B3B78] text-white text-[11px] font-bold whitespace-nowrap shadow-md pointer-events-none"
                      >
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

