import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export interface HomepageProductCarouselProps {
  id: string;
  eyebrow: string;
  eyebrowColorClass?: string;
  title: string;
  description?: string;
  products: Product[];
  viewAllLabel: string;
  viewAllPath: string;
  secondaryLink?: { label: string; path: string };
  surfaceClassName?: string;
}

export function HomepageProductCarousel({
  id,
  eyebrow,
  eyebrowColorClass = 'text-[#FF6B1A]',
  title,
  description,
  products,
  viewAllLabel,
  viewAllPath,
  secondaryLink,
  surfaceClassName = 'bg-white border-b border-[#DCE6F2]',
}: HomepageProductCarouselProps) {
  const { navigate } = useStore();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(maxScroll - el.scrollLeft > 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateScrollState();
    const rafId = window.requestAnimationFrame(updateScrollState);

    const onScroll = () => updateScrollState();
    el.addEventListener('scroll', onScroll, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateScrollState());
      resizeObserver.observe(el);
    } else {
      window.addEventListener('resize', updateScrollState);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      el.removeEventListener('scroll', onScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', updateScrollState);
      }
    };
  }, [products.length, updateScrollState]);

  const scrollByViewport = useCallback((direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const firstCard = el.children[0] as HTMLElement | undefined;
    const secondCard = el.children[1] as HTMLElement | undefined;
    const stride =
      firstCard && secondCard
        ? Math.max(200, secondCard.offsetLeft - firstCard.offsetLeft)
        : Math.max(240, el.clientWidth);

    const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const cardsPerStep =
      width >= 1280 ? 4 : width >= 1024 ? 3 : width >= 640 ? 2 : 1;

    el.scrollBy({
      left: direction * stride * cardsPerStep,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, []);

  const handleTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByViewport(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByViewport(1);
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  const hasOverflow = canScrollPrev || canScrollNext;

  return (
    <section
      id={id}
      aria-roledescription="carousel"
      aria-label={title}
      className={`w-full max-w-full overflow-x-clip py-9 sm:py-12 ${surfaceClassName}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading + Navigation Arrows + View All */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-7">
          <div className="min-w-0 max-w-2xl">
            <p
              className={`text-xs font-bold uppercase tracking-[0.18em] ${eyebrowColorClass}`}
            >
              {eyebrow}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3B78] mt-1">
              {title}
            </h2>
            {description && (
              <p className="text-xs sm:text-sm text-[#475569] mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="flex items-center gap-3">
              {secondaryLink && (
                <button
                  type="button"
                  onClick={() => navigate(secondaryLink.path)}
                  className="text-xs sm:text-sm font-bold text-[#0B3B78] hover:text-[#FF6B1A] whitespace-nowrap cursor-pointer transition-colors"
                >
                  {secondaryLink.label}
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate(viewAllPath)}
                className="text-xs sm:text-sm font-bold text-[#1D6FD8] hover:text-[#FF6B1A] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer transition-colors"
              >
                <span>{viewAllLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>

            {hasOverflow && (
              <div
                className="flex items-center gap-1.5"
                role="group"
                aria-label={`${title} slide controls`}
              >
                <button
                  type="button"
                  onClick={() => scrollByViewport(-1)}
                  disabled={!canScrollPrev}
                  aria-label={`Previous ${title}`}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] ${
                    canScrollPrev
                      ? 'bg-white border-[#DCE6F2] text-[#0B3B78] hover:border-[#1D6FD8] hover:bg-[#F0F6FF] cursor-pointer shadow-xs'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByViewport(1)}
                  disabled={!canScrollNext}
                  aria-label={`Next ${title}`}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] ${
                    canScrollNext
                      ? 'bg-white border-[#DCE6F2] text-[#0B3B78] hover:border-[#1D6FD8] hover:bg-[#F0F6FF] cursor-pointer shadow-xs'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Carousel Track (Desktop edge arrows + touch scroll-snap track) */}
        <div className="relative group/carousel">
          {canScrollPrev && (
            <button
              type="button"
              onClick={() => scrollByViewport(-1)}
              aria-label={`Scroll ${title} left`}
              className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 border border-[#DCE6F2] text-[#0B3B78] hover:text-[#FF6B1A] hover:border-[#1D6FD8] shadow-lg items-center justify-center transition-all opacity-90 hover:opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {canScrollNext && (
            <button
              type="button"
              onClick={() => scrollByViewport(1)}
              aria-label={`Scroll ${title} right`}
              className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 border border-[#DCE6F2] text-[#0B3B78] hover:text-[#FF6B1A] hover:border-[#1D6FD8] shadow-lg items-center justify-center transition-all opacity-90 hover:opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={trackRef}
            tabIndex={0}
            onKeyDown={handleTrackKeyDown}
            aria-label={`${title} product list — swipe or use Left and Right arrow keys to browse`}
            className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none touch-pan-x py-2.5 -my-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D6FD8] rounded-2xl"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none snap-start w-full sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-32px)/3)] xl:w-[calc((100%-48px)/4)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
