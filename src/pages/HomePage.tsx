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
    image: '/src/assets/images/hero_rice_bowl_bag_1793936931121.jpg',
    accentBg: 'bg-[#EBF4FF]',
    accentText: 'text-[#0B3B78]',
  },
  {
    id: 'Grocery',
    title: 'Grocery',
    tagline: 'Everyday Kitchen Essentials',
    description:
      'Cold-pressed cooking oils, unpolished dals, whole spices, stone-milled flours, and pantry staples.',
    path: '/grocery',
    image: '/src/assets/images/hero_grocery_basket_1793936930249.jpg',
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
    image: '/src/assets/images/hero_honey_drip_jar_1793936931141.jpg',
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
    image: '/src/assets/images/hero_luxury_watch_studio_1793936930915.jpg',
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

  const bestSellers = useMemo(
    () => products.filter((p) => p.bestSeller).slice(0, 4),
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
      {/* 1. HERO SECTION WITH "WELCOME TO KUBREEBAZZAR" */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFFFF] via-[#F0F6FF] to-[#EAF7EC] border-b border-[#DCE6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 items-center gap-10">
          <div className="lg:col-span-6 space-y-5">
            <div className="hero-stagger inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF7EC] border border-[#4CAF50]/35 text-xs font-bold text-[#2E7D32]">
              <Sparkles className="w-3.5 h-3.5 text-[#4CAF50]" />
              <span>Your Friendly Online Shopping Bazzar</span>
            </div>

            <h1 className="hero-stagger font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-balance">
              Welcome to <span className="text-[#0B3B78]">Kubree</span>
              <span className="text-[#FF6B1A]">Bazzar</span>
            </h1>

            <p className="hero-stagger text-base sm:text-lg text-[#475569] max-w-xl leading-relaxed">
              From aromatic aged rice and everyday kitchen groceries to pure
              golden honey and stylish watches — shop everything your family
              loves in one cheerful, colourful destination.
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

          {/* Right Side: KubreeBazzar Mascot & Quick Category Preview */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55 }}
              className="w-full max-w-lg rounded-3xl bg-white border-2 border-[#DCE6F2] shadow-xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div
                aria-hidden="true"
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#FF6B1A]/10 pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-[#4CAF50]/12 pointer-events-none"
              />

              <motion.img
                src="/assets/aistudio/Cheerful_Turtle_Shopping_Logo_75435e9c.png"
                alt="KubreeBazzar Cheerful Turtle Mascot"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-64 sm:w-72 h-auto object-contain relative z-10"
              />

              <div className="grid grid-cols-4 gap-2.5 w-full mt-5 pt-5 border-t border-[#EEF4FB] relative z-10">
                {CATEGORY_CARDS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => navigate(cat.path)}
                    className="group p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F0F6FF] border border-[#DCE6F2] hover:border-[#1D6FD8] transition-all text-center cursor-pointer"
                  >
                    <div className="aspect-square w-full rounded-lg overflow-hidden mb-1.5 bg-white">
                      <ResilientImage
                        src={cat.image}
                        alt={cat.title}
                        eager
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#0B3B78] group-hover:text-[#FF6B1A] block">
                      {cat.title}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
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

      {/* 3. FEATURED PRODUCTS */}
      <section className="reveal-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B1A]">
              Handpicked for You
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3B78] mt-1">
              Featured Products
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="text-sm font-bold text-[#1D6FD8] hover:text-[#0B3B78] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS */}
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
