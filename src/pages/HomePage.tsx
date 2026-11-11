import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  Sparkles,
  Star,
  Award,
  CheckCircle2,
  Mail,
  Tag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ResilientImage } from '../components/ResilientImage';
import { HeroOrbitalUniverse } from '../components/HeroOrbitalUniverse';
import { RiceShowcaseSection } from '../components/RiceShowcaseSection';
import { SpicesShowcaseSection } from '../components/SpicesShowcaseSection';
import { HoneySpotlightSection } from '../components/HoneySpotlightSection';
import { WatchesSpotlightSection } from '../components/WatchesSpotlightSection';
import type { ProductCategory } from '../types';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_CARDS: {
  id: ProductCategory;
  title: string;
  tagline: string;
  description: string;
  path: string;
  image: string;
  accentBg: string;
  accentText: string;
}[] = [
  {
    id: 'Rice',
    title: 'Rice',
    tagline: 'Aromatic Grains for Every Meal',
    description:
      'Aged Basmati, silky Boiled Ponni, lightweight Sona Masoori, and heirloom rice varieties.',
    path: '/rice',
    image: '/images/products/Rice.jpg',
    accentBg: 'bg-[#EBF4FF]',
    accentText: 'text-[#0B3B78]',
  },
  {
    id: 'Grocery',
    title: 'Grocery',
    tagline: 'Everyday Kitchen Essentials',
    description:
      'Cold-pressed cooking oils, unpolished dals, aromatic cardamom, cloves, cinnamon, and cumin.',
    path: '/grocery',
    image: '/images/products/patai.jpg',
    accentBg: 'bg-[#EAF7EC]',
    accentText: 'text-[#2E7D32]',
  },
  {
    id: 'Honey',
    title: 'Honey',
    tagline: 'Pure Golden Goodness',
    description:
      'Single-origin forest, coffee-blossom, and multiflora honeys packed in thick glass jars.',
    path: '/honey',
    image: '/images/products/honey.jpg',
    accentBg: 'bg-[#FFF3E8]',
    accentText: 'text-[#D9530F]',
  },
  {
    id: 'Watches',
    title: 'Watches',
    tagline: 'Timeless Style for Every Moment',
    description:
      'Heritage automatic movements, sapphire-crystal chronographs, dress watches, and smart timepieces.',
    path: '/watches',
    image: '/images/products/watches.png',
    accentBg: 'bg-[#EBF4FF]',
    accentText: 'text-[#1D6FD8]',
  },
];

const CUSTOMER_REVIEWS = [
  {
    name: 'Meenakshi Sundaram',
    city: 'Chennai',
    category: 'Rice',
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
      'The Nilgiri Wild Forest and Coorg Blossom honey jars are packed in thick glass with zero leakage and rich floral aroma.',
  },
  {
    name: 'Karthikeya Nair',
    city: 'Kochi',
    category: 'Grocery',
    rating: 5,
    quote:
      'From cold-pressed gingelly oil to whole Tellicherry pepper, KubreeBazzar has become our favourite family grocery store.',
  },
];

export function HomePage() {
  const { products, navigate } = useStore();
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 18,
        opacity: 0,
        duration: 0.65,
        stagger: 0.09,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

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
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured).slice(0, 4),
    [products]
  );

  const trendingProducts = useMemo(
    () => products.filter((p) => p.trending).slice(0, 4),
    [products]
  );

  const bestSellers = useMemo(
    () => products.filter((p) => p.bestSeller).slice(0, 4),
    [products]
  );

  const newArrivals = useMemo(
    () => products.filter((p) => p.newArrival).slice(0, 4),
    [products]
  );

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      const res = await fetch('/api/newsletter', {
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
    <div ref={pageRef} className="bg-[#F8FAFC] text-[#132238]">
      {/* 3. ANIMATED ORBITAL HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFFFF] via-[#F0F6FF] to-[#EAF7EC] border-b border-[#DCE6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
          <div className="lg:col-span-5 space-y-5 z-10">
            <div className="hero-stagger inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF7EC] border border-[#4CAF50]/35 text-xs font-bold text-[#2E7D32]">
              <Sparkles className="w-3.5 h-3.5 text-[#4CAF50]" />
              <span>Your Friendly Shopping Universe</span>
            </div>

            <h1 className="hero-stagger font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-balance">
              Welcome to <span className="text-[#0B3B78]">Kubree</span>
              <span className="text-[#FF6B1A]">Bazzar</span>
            </h1>

            <p className="hero-stagger text-base sm:text-lg font-bold text-[#0B3B78]">
              Everything You Need, All in One Place.
            </p>

            <p className="hero-stagger text-sm sm:text-base text-[#475569] max-w-xl leading-relaxed">
              Discover quality rice, everyday groceries, aromatic spices, golden honey and elegant watches — all in one convenient shopping destination.
            </p>

            <div className="hero-stagger flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="px-7 py-3.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-sm font-bold inline-flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-[#F0F6FF] text-[#0B3B78] border-2 border-[#0B3B78] text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Explore Categories
              </button>
            </div>

            <div className="hero-stagger pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#475569]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                Rice · Grocery · Honey · Watches
              </span>
              <span aria-hidden="true">·</span>
              <span>Free Delivery Above ₹1,500</span>
              <span aria-hidden="true">·</span>
              <span>Razorpay Secure Checkout</span>
            </div>
          </div>

          {/* Right Side: Animated Orbital Hero with Central Sphere & 7 Revolving Uploaded Products */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <HeroOrbitalUniverse
              onSelectProduct={(path) => navigate(path)}
            />
          </div>
        </div>
      </section>

      {/* 4. SHOPPING BENEFITS STRIP */}
      <section className="bg-white border-b border-[#DCE6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF7EC] text-[#2E7D32] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B3B78]">100% Quality Assured</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Farm fresh rice, unadulterated spices &amp; honey</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EBF4FF] text-[#0B3B78] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B3B78]">Pan-India Fast Delivery</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Complimentary shipping on orders above ₹1,500</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FFF3E8] text-[#FF6B1A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B3B78]">Secure Razorpay Checkout</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Instant UPI, RuPay, cards &amp; netbanking</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EBF4FF] text-[#1D6FD8] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B3B78]">Friendly Customer Care</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Prompt assistance for all household orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOP BY CATEGORY */}
      <section
        id="shop-by-category"
        className="reveal-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4CAF50]">
              Explore Our Aisles
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3B78] mt-1">
              Shop by Category
            </h2>
          </div>
          <p className="text-sm text-[#475569] max-w-md">
            Handpicked daily essentials and lifestyle favourites across four
            vibrant departments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_CARDS.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(cat.path)}
              className="group cursor-pointer rounded-2xl bg-white border border-[#DCE6F2] hover:border-[#1D6FD8] shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#F0F6FF] relative">
                  <ResilientImage
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold ${cat.accentBg} ${cat.accentText} shadow-xs`}
                  >
                    {cat.title}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-bold text-[#0B3B78] group-hover:text-[#FF6B1A] transition-colors">
                    {cat.tagline}
                  </h3>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-[#FF6B1A] inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Shop {cat.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FEATURED RICE PRODUCTS (Rice.jpg showcase) */}
      <RiceShowcaseSection />

      {/* 7. GROCERY AND SPICES COLLECTION (elaka.jpg, lavangam.png, patai.jpg, seeragam.jpg) */}
      <SpicesShowcaseSection />

      {/* 8. HONEY SPOTLIGHT (honey.jpg) */}
      <HoneySpotlightSection />

      {/* 9. WATCHES SPOTLIGHT (watches.png) */}
      <WatchesSpotlightSection />

      {/* 10. TRENDING PRODUCTS */}
      <section className="reveal-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B1A]">
              Popular Right Now
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3B78] mt-1">
              Trending Products
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="text-sm font-bold text-[#1D6FD8] hover:text-[#0B3B78] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 11. BEST SELLERS */}
      <section className="reveal-section bg-[#F0F6FF] border-y border-[#DCE6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4CAF50]">
                Most Loved by Families
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3B78] mt-1">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 12. NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="reveal-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1D6FD8]">
                Freshly Added
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3B78] mt-1">
                New Arrivals
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/new-arrivals')}
              className="text-sm font-bold text-[#FF6B1A] hover:text-[#E5580D] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All New Arrivals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. OFFERS & DEALS */}
      <section className="reveal-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#0B3B78] via-[#1D6FD8] to-[#0B3B78] text-white p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4CAF50] text-white text-xs font-bold">
              <Tag className="w-3.5 h-3.5" />
              <span>KubreeBazzar Super Saver Offer</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Save 10% Across KubreeBazzar with Code KAVERI10
            </h2>
            <p className="text-xs sm:text-sm text-white/90">
              Valid on orders over ₹1,000 across Rice, Grocery, Honey, and
              Watches — plus complimentary doorstep delivery on orders ₹1,500+.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/offers')}
            className="px-6 py-3.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 shadow-md cursor-pointer"
          >
            View All Offers
          </button>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="reveal-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4CAF50]">
            The KubreeBazzar Promise
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3B78] mt-1">
            Why Choose Us?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
              className="p-6 rounded-2xl bg-white border border-[#DCE6F2] shadow-xs"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${pillar.bg}`}
              >
                <pillar.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#0B3B78]">
                {pillar.title}
              </h3>
              <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="reveal-section bg-[#F0F6FF] border-y border-[#DCE6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B1A]">
              Happy Shoppers
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3B78] mt-1">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
                    <span className="text-[11px] font-bold text-[#4CAF50] bg-[#EAF7EC] px-2.5 py-0.5 rounded-full">
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

      {/* 8. NEWSLETTER */}
      <section className="reveal-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="rounded-3xl bg-white border-2 border-[#DCE6F2] p-8 sm:p-12 text-center shadow-xs">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF7EC] text-[#4CAF50] flex items-center justify-center mx-auto">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="font-display text-3xl font-bold text-[#0B3B78]">
              Join the KubreeBazzar Club!
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              Subscribe for fresh harvest alerts, seasonal grocery bundles,
              exclusive discount codes, and new watch arrivals.
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
                className="flex-1 px-4 py-3 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-sm text-[#132238] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D6FD8]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer"
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
