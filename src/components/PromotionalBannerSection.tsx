import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ResilientImage } from './ResilientImage';
import { getCategoryBySlug } from '../data/categoryHierarchy';

gsap.registerPlugin(ScrollTrigger);

export const PromotionalBannerSection: React.FC = () => {
  const { banners, settings, categories, navigate } = useStore();
  const bannerRef = useRef<HTMLElement | null>(null);

  const activeBanner = banners.find((b) => b.active) || banners[0];

  const headline =
    activeBanner?.title ||
    settings?.flashSaleTitle ||
    'Save 10% Across KubreeBazzar with Code KAVERI10';
  const subtitle =
    activeBanner?.subtitle ||
    settings?.flashSaleSubtitle ||
    'Valid on orders over ₹1,000 across Groceries, Fashion, Electronics, and Watches — plus free doorstep delivery on orders ₹1,500+.';
  const ctaLabel =
    activeBanner?.ctaLabel || settings?.campaignCta || 'Shop Now';

  const targetPath = (() => {
    if (
      activeBanner?.targetCategory &&
      activeBanner.targetCategory !== 'All'
    ) {
      const cat = getCategoryBySlug(activeBanner.targetCategory, categories);
      if (cat) return `/${cat.slug}`;
    }
    return '/offers';
  })();

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(min-width: 768px)', () => {
        gsap.to('.promo-parallax-bg', {
          yPercent: -16,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        });

        gsap.from('.promo-text-reveal', {
          y: 22,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            once: true,
          },
        });

        gsap.from('.promo-product-card', {
          x: 42,
          opacity: 0,
          scale: 0.94,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            once: true,
          },
        });
      });

      mm.add('(max-width: 767px)', () => {
        gsap.from('.promo-text-reveal', {
          y: 14,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });
    }, el);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [headline, subtitle]);

  const showcaseProducts = [
    {
      name: 'Royal Aged Basmati',
      image: '/images/products/Rice.jpg',
      path: '/product/royal-aged-basmati-rice-5kg',
      price: '₹801',
    },
    {
      name: 'Wild Forest Honey',
      image: '/images/products/honey.jpg',
      path: '/product/nilgiri-raw-wild-forest-honey-jar',
      price: '₹437',
    },
    {
      name: 'Skeleton Automatic Watch',
      image: '/images/products/watches.png',
      path: '/product/kubree-chronos-skeleton-automatic-watch',
      price: '₹3,849',
    },
  ];

  return (
    <section
      ref={bannerRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16"
    >
      <div className="relative overflow-hidden rounded-3xl bg-[#0B3B78] text-white p-5 sm:p-10 lg:p-12 shadow-[0_24px_60px_-16px_rgba(11,59,120,0.38)] border border-[#1D6FD8]/40">
        {/* Subtle Animated Gradient Motion Layer */}
        <motion.div
          aria-hidden="true"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
            backgroundImage:
              'linear-gradient(120deg, #0B3B78 0%, #1D6FD8 45%, #0F4C97 75%, #0B3B78 100%)',
          }}
          className="promo-parallax-bg pointer-events-none absolute -inset-6 opacity-95"
        />

        {/* Warm Orange Brand Ambient Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#FF6B1A]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-[#4CAF50]/20 blur-3xl"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Promotional Copy */}
          <div className="lg:col-span-7 space-y-4">
            <div className="promo-text-reveal inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD6BA]">
              <Tag className="w-3.5 h-3.5 text-[#FF6B1A]" />
              <span>KubreeBazzar Featured Offer</span>
            </div>

            <h2 className="promo-text-reveal font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-balance">
              {headline}
            </h2>

            <p className="promo-text-reveal text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
              {subtitle}
            </p>

            <div className="promo-text-reveal pt-2 flex flex-col min-[380px]:flex-row flex-wrap items-stretch min-[380px]:items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => navigate(targetPath)}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="px-6 py-3 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 text-sm font-semibold inline-flex items-center justify-center transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                Browse Catalog
              </button>
            </div>
          </div>

          {/* Right Animated Product Cut-ins */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3">
            {showcaseProducts.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="promo-product-card group rounded-2xl bg-white p-2.5 text-left shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]"
              >
                <div className="aspect-[4/3] sm:aspect-square w-full rounded-xl overflow-hidden bg-[#F0F6FF] flex items-center justify-center">
                  <ResilientImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-[11px] font-bold text-[#0B3B78] truncate mt-2">
                  {item.name}
                </p>
                <p className="font-mono-tabular text-xs font-bold text-[#FF6B1A]">
                  {item.price}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
