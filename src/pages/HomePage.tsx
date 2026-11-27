import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  Star,
  Award,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { apiFetch } from '../utils/apiClient';
import { ProductOrbitHero } from '../components/ProductOrbitHero';
import { CategoryShowcaseGrid } from '../components/CategoryShowcaseGrid';
import { HomeCarouselsSection } from '../components/HomeCarouselsSection';
import { PromotionalBannerSection } from '../components/PromotionalBannerSection';
import { RiceShowcaseSection } from '../components/RiceShowcaseSection';
import { SpicesShowcaseSection } from '../components/SpicesShowcaseSection';
import { HoneySpotlightSection } from '../components/HoneySpotlightSection';
import { WatchesSpotlightSection } from '../components/WatchesSpotlightSection';

gsap.registerPlugin(ScrollTrigger);

const CUSTOMER_REVIEWS = [
  {
    name: 'Meenakshi Sundaram',
    city: 'Chennai',
    category: 'Rice & Groceries',
    rating: 5,
    quote:
      'The 5 kg Royal Aged Basmati and Boiled Ponni arrive in sturdy sacks with consistent grain length every single month.',
  },
  {
    name: 'Raghavan Iyer',
    city: 'Bengaluru',
    category: 'Watches',
    rating: 5,
    quote:
      'Ordered a chronograph watch from KubreeBazzar — fast delivery, great packaging, and super smooth Razorpay checkout!',
  },
  {
    name: 'Ananya Deshmukh',
    city: 'Pune',
    category: 'Honey',
    rating: 5,
    quote:
      'The Nilgiri Wild Forest honey jar is packed in thick glass with zero leakage and rich floral aroma.',
  },
  {
    name: 'Karthikeya Nair',
    city: 'Kochi',
    category: 'Spices & Pantry',
    rating: 5,
    quote:
      'From cold-pressed oils to whole green cardamom and cloves, KubreeBazzar has become our favourite family store.',
  },
];

export function HomePage() {
  const { products, navigate } = useStore();
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // Desktop & Tablet: Coordinated Hero text entrance + layered section scroll choreography
      mm.add('(min-width: 768px)', () => {
        gsap.from('.hero-stage-text', {
          y: 22,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        });

        // Staggered Featured / Trending / Best Sellers product grid entrances
        gsap.utils.toArray<HTMLElement>('.stagger-product-grid').forEach((grid) => {
          const cards = grid.querySelectorAll('.stagger-product-card');
          if (cards.length === 0) return;
          gsap.from(cards, {
            y: 26,
            opacity: 0,
            scale: 0.97,
            duration: 0.55,
            stagger: 0.07,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: grid,
              start: 'top 86%',
              once: true,
            },
          });
        });

        // Clean section heading & block fade/slide reveals
        gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((el) => {
          gsap.from(el, {
            y: 22,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              once: true,
            },
          });
        });
      });

      // Mobile (< 768px): Lightweight single-pass entrance
      mm.add('(max-width: 767px)', () => {
        gsap.from('.hero-stage-text', {
          y: 14,
          opacity: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        });

        gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((el) => {
          gsap.from(el, {
            y: 14,
            opacity: 0,
            duration: 0.45,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              once: true,
            },
          });
        });
      });
    }, root);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [products.length]);

  const featuredProducts = useMemo(() => {
    const active = products.filter((p) => p.enabled !== false);
    const prioritySlugs = [
      'royal-aged-basmati-rice-5kg',
      'nilgiri-raw-wild-forest-honey-jar',
      'kubree-chronos-skeleton-automatic-watch',
      'idukki-whole-green-cardamom-elakkai',
      'kanchipuram-pure-zari-handloom-silk-saree',
      'anc-wireless-earbuds-pro',
      'creative-wooden-animal-stacking-block-set',
      'pure-linen-regular-fit-casual-shirt',
    ];
    const picked: typeof products = [];
    for (const slug of prioritySlugs) {
      const match = active.find((p) => p.slug === slug);
      if (match) picked.push(match);
    }
    for (const p of active) {
      if (picked.length >= 8) break;
      if (p.featured && !picked.some((existing) => existing.id === p.id)) {
        picked.push(p);
      }
    }
    return picked.slice(0, 8);
  }, [products]);

  const bestSellers = useMemo(
    () =>
      products.filter((p) => p.enabled !== false && p.bestSeller).slice(0, 4),
    [products]
  );

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      const res = await apiFetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });
      const data = await res.json();
      setNewsletterStatus(
        data.message || 'Subscribed to KubreeBazzar updates!'
      );
      setNewsletterEmail('');
    } catch {
      setNewsletterStatus('Unable to subscribe right now. Please try again.');
    }
  };

  return (
    <div ref={pageRef} className="bg-[#F8FAFC] text-[#132238] overflow-x-clip">
      {/* 1. KUBREEBAZZAR PRODUCT-ORBIT HERO */}
      <ProductOrbitHero onNavigate={(path) => navigate(path)} />

      {/* 2. SHOPPING BENEFITS STRIP */}
      <section className="bg-white border-b border-[#DCE6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF7EC] text-[#2E7D32] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B3B78]">
                100% Quality Assured
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Farm fresh rice, unadulterated spices &amp; honey
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EBF4FF] text-[#0B3B78] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B3B78]">
                Pan-India Fast Delivery
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Complimentary shipping on orders above ₹1,500
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FFF3E8] text-[#FF6B1A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B3B78]">
                Secure Razorpay Checkout
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Instant UPI, RuPay, cards &amp; netbanking
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EBF4FF] text-[#1D6FD8] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B3B78]">
                Friendly Customer Care
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Prompt assistance for all household orders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ANIMATED SHOP BY CATEGORY SECTION */}
      <CategoryShowcaseGrid />

      {/* 3B. HOMEPAGE HORIZONTAL PRODUCT CAROUSELS */}
      <HomeCarouselsSection />

      {/* 4. CINEMATIC FEATURED PRODUCTS SECTION */}
      <section
        id="featured-products"
        className="bg-white border-y border-[#DCE6F2] py-10 sm:py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal-section flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B1A]">
                Curated Across Departments
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3B78] mt-1">
                Featured Products
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="text-sm font-bold text-[#1D6FD8] hover:text-[#0B3B78] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Shop Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="stagger-product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="stagger-product-card">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SPECIAL BACKEND-EDITABLE PROMOTIONAL BANNER */}
      <PromotionalBannerSection />

      {/* 6. FEATURED RICE PRODUCTS (Rice.jpg showcase) */}
      <div className="pt-10 sm:pt-16">
        <RiceShowcaseSection />
      </div>

      {/* 7. GROCERY AND SPICES COLLECTION (elaka.jpg, lavangam.png, patai.jpg, seeragam.jpg) */}
      <SpicesShowcaseSection />

      {/* 8. HONEY SPOTLIGHT (honey.jpg) */}
      <HoneySpotlightSection />

      {/* 9. WATCHES SPOTLIGHT (watches.png) */}
      <WatchesSpotlightSection />

      {/* 10. BEST SELLERS */}
      <section className="bg-[#F0F6FF] border-y border-[#DCE6F2] mt-10 sm:mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="reveal-section flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4CAF50]">
                Most Loved by Families
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3B78] mt-1">
                Best Sellers
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/best-sellers')}
              className="text-sm font-bold text-[#FF6B1A] hover:text-[#E5580D] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="stagger-product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bestSellers.map((product) => (
              <div key={product.id} className="stagger-product-card">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. WHY CHOOSE US */}
      <section className="reveal-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-6 sm:mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4CAF50]">
            The KubreeBazzar Promise
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3B78] mt-1">
            Why Choose Us?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[
            {
              icon: Award,
              title: 'Fresh & Quality Assured',
              desc: 'Every rice harvest, pantry staple, honey jar, and watch is carefully checked for quality.',
              bg: 'bg-[#EAF7EC] text-[#2E7D32]',
            },
            {
              icon: Truck,
              title: 'Fast Pan-India Delivery',
              desc: 'Reliable doorstep shipping with protective packaging and live order tracking.',
              bg: 'bg-[#EBF4FF] text-[#0B3B78]',
            },
            {
              icon: ShieldCheck,
              title: '100% Secure Razorpay',
              desc: 'Instant UPI, card, and netbanking checkout with transparent INR pricing.',
              bg: 'bg-[#FFF3E8] text-[#FF6B1A]',
            },
            {
              icon: Headphones,
              title: 'Friendly Support',
              desc: 'Dedicated customer care ready to help with every household order.',
              bg: 'bg-[#EBF4FF] text-[#1D6FD8]',
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DCE6F2] shadow-xs"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${pillar.bg}`}
              >
                <pillar.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#0B3B78]">
                {pillar.title}
              </h3>
              <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 14. TESTIMONIALS */}
      <section className="reveal-section bg-[#F0F6FF] border-y border-[#DCE6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="mb-6 sm:mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B1A]">
              Happy Shoppers
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3B78] mt-1">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.name}
                className="p-5 rounded-2xl bg-white border border-[#DCE6F2] flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-[#FF6B1A]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-[#2E7D32]">
                      {rev.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    “{rev.quote}”
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EEF4FB]">
                  <div className="text-xs font-bold text-[#0B3B78]">
                    {rev.name}
                  </div>
                  <div className="text-[11px] text-[#64748B]">{rev.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. NEWSLETTER */}
      <section className="reveal-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        <div className="rounded-3xl bg-white border-2 border-[#DCE6F2] p-6 sm:p-12 text-center shadow-xs">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF7EC] text-[#4CAF50] flex items-center justify-center mx-auto">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3B78]">
              Join the KubreeBazzar Club!
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              Subscribe for fresh harvest alerts, seasonal grocery bundles,
              exclusive discount codes, and new arrivals.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-2.5 pt-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address for newsletter"
                className="flex-1 px-4 py-3 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] placeholder:text-sm placeholder:text-[#64748B] focus:outline-none focus:border-[#1D6FD8]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                Subscribe
              </button>
            </form>
            {newsletterStatus && (
              <p className="text-xs font-semibold text-[#4CAF50] inline-flex items-center gap-1.5 justify-center">
                <CheckCircle2 className="w-4 h-4" />
                <span>{newsletterStatus}</span>
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
