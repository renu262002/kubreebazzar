import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ResilientImage } from './ResilientImage';
import { getCategoryDisplayName } from '../data/categoryHierarchy';
import { resolveCategoryFallbackImage } from '../three/resolveProductGlb';

gsap.registerPlugin(ScrollTrigger);

export const CategoryShowcaseGrid: React.FC = () => {
  const { categories, navigate } = useStore();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Mouse drag state (kept in refs for jitter-free dragging + click suppression)
  const isPointerDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const activeCategories = useMemo(() => {
    return [...categories]
      .filter(
        (c) =>
          c.status !== 'inactive' && !c.parentCategoryId && !c.parentId
      )
      .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
  }, [categories]);

  const updateScrollMetrics = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const currentLeft = track.scrollLeft;

    setCanScrollPrev(currentLeft > 4);
    setCanScrollNext(maxScroll - currentLeft > 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollMetrics();
    const rafId = window.requestAnimationFrame(updateScrollMetrics);

    const onScroll = () => updateScrollMetrics();
    track.addEventListener('scroll', onScroll, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateScrollMetrics());
      resizeObserver.observe(track);
    } else {
      window.addEventListener('resize', updateScrollMetrics);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      track.removeEventListener('scroll', onScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', updateScrollMetrics);
      }
    };
  }, [activeCategories.length, updateScrollMetrics]);

  // Smooth horizontal navigation stepping by visible cards per breakpoint (4 desktop, 2 tablet, 1 mobile)
  const slideCarousel = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const firstCard = track.children[0] as HTMLElement | undefined;
    const secondCard = track.children[1] as HTMLElement | undefined;
    const stride =
      firstCard && secondCard
        ? Math.max(200, secondCard.offsetLeft - firstCard.offsetLeft)
        : Math.max(260, Math.round(track.clientWidth * 0.85));

    const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const cardsPerStep =
      width >= 1280 ? 4 : width >= 1024 ? 3 : width >= 640 ? 2 : 1;

    track.scrollBy({
      left: direction * stride * cardsPerStep,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, []);

  const jumpToCardIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const targetCard = track.children[index] as HTMLElement | undefined;
    if (!targetCard) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    track.scrollTo({
      left: targetCard.offsetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, []);

  // Desktop mouse-drag support without accidental navigation on release
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerDownRef.current || !trackRef.current) return;
      const deltaX = e.clientX - dragStartXRef.current;
      if (!isDraggingRef.current && Math.abs(deltaX) > 6) {
        isDraggingRef.current = true;
        suppressClickRef.current = true;
        setIsDragging(true);
      }
      if (isDraggingRef.current) {
        e.preventDefault();
        trackRef.current.scrollLeft = dragStartScrollLeftRef.current - deltaX;
      }
    };

    const handleMouseUp = () => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 60);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('blur', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('blur', handleMouseUp);
    };
  }, []);

  const handleTrackMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !trackRef.current) return;
    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    suppressClickRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartScrollLeftRef.current = trackRef.current.scrollLeft;
  };

  const handleTrackClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  const handleTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      slideCarousel(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      slideCarousel(1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      jumpToCardIndex(0);
    } else if (e.key === 'End' && activeCategories.length > 0) {
      e.preventDefault();
      jumpToCardIndex(activeCategories.length - 1);
    }
  };

  // GSAP heading reveal (cards stay immediately visible at opacity: 1 for horizontal carousel browsing)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(min-width: 768px)', () => {
        gsap.from('.category-heading-anim', {
          y: 20,
          opacity: 0,
          duration: 0.55,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true,
          },
        });
      });
    }, el);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [activeCategories.length]);

  return (
    <section
      id="shop-by-category"
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Shop by Category"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-14 sm:pb-12 overflow-x-clip"
    >
      <div className="category-heading-anim flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4CAF50]">
            Explore Our {activeCategories.length} Storefront Departments
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3B78] mt-1">
            Shop by Category
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-[#475569] max-w-lg">
            From Groceries, Fashion, Kids, Teenagers, Baby Kit, Electronics,
            Furniture, Sports, and Footwear to Used Bikes &amp; Cars.
          </p>

          {/* Carousel Arrow Controls */}
          {activeCategories.length > 1 && (
            <div
              className="flex items-center gap-2 shrink-0 self-end sm:self-auto"
              role="group"
              aria-label="Category carousel navigation"
            >
              <button
                type="button"
                onClick={() => slideCarousel(-1)}
                disabled={!canScrollPrev}
                aria-label="Previous categories"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] ${
                  canScrollPrev
                    ? 'bg-white border-[#DCE6F2] text-[#0B3B78] hover:border-[#1D6FD8] hover:bg-[#F0F6FF] cursor-pointer shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => slideCarousel(1)}
                disabled={!canScrollNext}
                aria-label="Next categories"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] ${
                  canScrollNext
                    ? 'bg-white border-[#DCE6F2] text-[#0B3B78] hover:border-[#1D6FD8] hover:bg-[#F0F6FF] cursor-pointer shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Jump Bar */}
      <div className="mb-6 sm:mb-8 p-2 sm:p-2.5 rounded-2xl bg-white border border-[#DCE6F2] flex items-center gap-2 overflow-x-auto scrollbar-none">
        {activeCategories.map((cat) => {
          const label = getCategoryDisplayName(cat.id, categories);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(`/${cat.slug}`)}
              className="px-3.5 py-2 rounded-xl bg-[#F0F6FF] hover:bg-[#0B3B78] hover:text-white text-xs font-semibold text-[#0B3B78] whitespace-nowrap transition-colors shrink-0 cursor-pointer min-h-[40px]"
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Category Collection Horizontal Carousel */}
      <div className="relative">
        {/* Desktop flanking arrow buttons */}
        {activeCategories.length > 4 && (
          <>
            <button
              type="button"
              onClick={() => slideCarousel(-1)}
              disabled={!canScrollPrev}
              aria-label="Scroll categories left"
              className={`hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 border border-[#DCE6F2] shadow-lg items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] ${
                canScrollPrev
                  ? 'text-[#0B3B78] hover:text-[#FF6B1A] hover:border-[#1D6FD8] opacity-95 hover:opacity-100 cursor-pointer'
                  : 'text-[#CBD5E1] border-[#E2E8F0] opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => slideCarousel(1)}
              disabled={!canScrollNext}
              aria-label="Scroll categories right"
              className={`hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 border border-[#DCE6F2] shadow-lg items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] ${
                canScrollNext
                  ? 'text-[#0B3B78] hover:text-[#FF6B1A] hover:border-[#1D6FD8] opacity-95 hover:opacity-100 cursor-pointer'
                  : 'text-[#CBD5E1] border-[#E2E8F0] opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Responsive Horizontal Scroll-Snap Track:
            Mobile: 1 full card at a time (w-full)
            Tablet: 2 equal cards
            Desktop (1024px): 3 equal cards
            Large Desktop (1280px+): 4 equal cards */}
        <div
          ref={trackRef}
          tabIndex={0}
          onMouseDown={handleTrackMouseDown}
          onClickCapture={handleTrackClickCapture}
          onKeyDown={handleTrackKeyDown}
          aria-label="Category collection cards — swipe, drag, or use Left and Right arrow keys"
          className={`category-grid-container flex items-stretch gap-4 sm:gap-5 lg:gap-6 overflow-x-auto scrollbar-none touch-pan-x py-2.5 -my-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D6FD8] rounded-2xl ${
            isDragging
              ? 'cursor-grabbing snap-none scroll-auto'
              : 'cursor-grab sm:cursor-default snap-x snap-mandatory scroll-smooth'
          }`}
        >
          {activeCategories.map((cat) => {
            const label = getCategoryDisplayName(cat.id, categories);
            const localFallback = resolveCategoryFallbackImage(cat.id);
            const primaryImg = cat.image || localFallback;

            return (
              <article
                key={cat.id}
                onClick={() => {
                  if (suppressClickRef.current) return;
                  navigate(`/${cat.slug}`);
                }}
                className="category-card-anim flex-none snap-start w-full sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-48px)/3)] xl:w-[calc((100%-72px)/4)] group text-left rounded-2xl bg-white border border-[#DCE6F2] hover:border-[#1D6FD8] shadow-[0_4px_16px_-6px_rgba(11,59,120,0.08)] hover:shadow-[0_20px_38px_-14px_rgba(11,59,120,0.18)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div
                    className={`aspect-[4/3] w-full overflow-hidden relative border-b border-[#EEF4FB] ${
                      primaryImg.includes('/baby-kit/') ||
                      primaryImg.includes('/temple-kit/') ||
                      primaryImg.includes('/school-kit/')
                        ? 'bg-[#090C12] p-3 flex items-center justify-center'
                        : 'bg-[#F0F6FF]'
                    }`}
                  >
                    <ResilientImage
                      src={primaryImg}
                      fallbackSrc={localFallback}
                      alt={label}
                      className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none ${
                        primaryImg.includes('/baby-kit/') ||
                        primaryImg.includes('/temple-kit/') ||
                        primaryImg.includes('/school-kit/')
                          ? 'object-contain'
                          : 'object-cover'
                      }`}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0B3B78]/70 via-[#0B3B78]/20 to-transparent pointer-events-none"
                    />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2">
                      <h3 className="font-display text-sm sm:text-base lg:text-lg font-bold text-white drop-shadow-xs line-clamp-1">
                        {label}
                      </h3>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-5 space-y-1.5">
                    <p className="text-[11px] sm:text-xs font-bold text-[#1D6FD8] line-clamp-1">
                      {cat.subtitle || cat.title}
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#475569] leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (suppressClickRef.current) return;
                      navigate(`/${cat.slug}`);
                    }}
                    className="w-full min-h-[44px] sm:min-h-[40px] py-2 px-3 rounded-xl bg-[#F0F6FF] group-hover:bg-[#FF6B1A] text-[#0B3B78] group-hover:text-white text-[11px] sm:text-xs font-bold flex items-center justify-between transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
                  >
                    <span className="truncate">Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
