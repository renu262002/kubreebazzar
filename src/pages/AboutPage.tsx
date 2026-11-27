import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Box, ShieldCheck, Compass, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category3DShowcase } from '../components/Category3DShowcase';
import { KubreeBazzarLogo } from '../components/KubreeBazzarLogo';
import { getCategoryDisplayName } from '../data/categoryHierarchy';

gsap.registerPlugin(ScrollTrigger);

export function AboutPage() {
  const { settings, categories, navigate } = useStore();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = 'About Us | KubreeBazzar';
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.about-reveal', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const milestones = settings?.milestones || [];
  const activeCategories = categories.filter(
    (c) => c.status !== 'inactive' && !c.parentCategoryId && !c.parentId
  );

  return (
    <div ref={rootRef} className="space-y-0 bg-[#F8FAFC]">
      {/* 1. Premium About Us Hero Section */}
      <section className="relative min-h-0 lg:min-h-[480px] flex items-center bg-gradient-to-br from-[#FFFFFF] via-[#F0F6FF] to-[#EAF7EC] border-b border-[#DCE6F2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center w-full">
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="about-reveal inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white border border-[#DCE6F2] shadow-xs">
              <KubreeBazzarLogo size="sm" />
              <span className="text-xs font-bold text-[#FF6B1A] uppercase tracking-[0.16em]">
                About {settings?.brandName || 'KubreeBazzar'}
              </span>
            </div>
            <h1 className="about-reveal font-display text-2xl min-[380px]:text-3xl sm:text-5xl font-bold text-[#0B3B78] leading-tight">
              Your Friendly Neighbourhood &amp; Online Shopping Universe.
            </h1>
            <p className="about-reveal text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl">
              {settings?.brandTagline ||
                'Your Friendly Online Shopping Bazzar — connecting households with quality everyday essentials across 20 curated categories.'}
            </p>
            <div className="about-reveal pt-1 flex flex-col min-[380px]:flex-row flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="w-full min-[380px]:w-auto px-6 py-3 min-h-[44px] rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="w-full min-[380px]:w-auto px-6 py-3 min-h-[44px] rounded-xl bg-white hover:bg-[#F0F6FF] text-[#0B3B78] border border-[#DCE6F2] text-sm font-bold transition-colors cursor-pointer text-center"
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 h-[240px] sm:h-[300px] lg:h-[340px] rounded-2xl bg-white border border-[#DCE6F2] shadow-sm overflow-hidden">
            <Category3DShowcase activePreset="watch" />
          </div>
        </div>
      </section>

      {/* 2. Introduction to KubreeBazzar & 3. Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-b border-[#DCE6F2] grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs font-bold text-[#FF6B1A] uppercase tracking-wider">
            01. Introduction to KubreeBazzar
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3B78]">
            Curated Household &amp; Lifestyle Departments
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            {settings?.aboutOverview ||
              'KubreeBazzar brings together trusted household staples—quality rice, everyday groceries, and pure honey—alongside fashion, kids essentials, electronics, and certified vehicles in one friendly online shopping destination.'}
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs font-bold text-[#1D6FD8] uppercase tracking-wider">
            02. Our Story
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3B78]">
            Why We Built KubreeBazzar
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            {settings?.aboutStory ||
              'Inspired by the warmth and joy of neighbourhood shopping, KubreeBazzar pairs curated pantry essentials, apparel, and lifestyle finds with interactive 3D previews, fast delivery, and secure checkout.'}
          </p>
        </div>
      </section>

      {/* 4. Our Mission & 5. Our Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-b border-[#DCE6F2] grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-5 sm:p-8 space-y-3 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-[#EBF4FF] text-[#0B3B78] flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#0B3B78]">
            Our Mission
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            {settings?.aboutMission ||
              'To deliver reliable everyday essentials and lifestyle products with transparent pricing, weight and size flexibility, and friendly customer care.'}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-5 sm:p-8 space-y-3 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-[#FFF3E8] text-[#FF6B1A] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#0B3B78]">
            Our Vision
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            {settings?.aboutVision ||
              'A cheerful multi-category shopping destination where families shop with confidence and a smile.'}
          </p>
        </div>
      </section>

      {/* 6. Our Product Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-b border-[#DCE6F2]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-xs font-bold text-[#4CAF50] uppercase tracking-wider mb-1">
              Explore Departments
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3B78]">
              Our Product Categories
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/collections')}
            className="text-xs font-bold text-[#FF6B1A] hover:underline inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View 3D Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {activeCategories.map((cat) => {
            const label = getCategoryDisplayName(cat.id, categories);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate(`/${cat.slug}`)}
                className="p-3.5 rounded-xl bg-white border border-[#DCE6F2] hover:border-[#FF6B1A] hover:bg-[#FFF4EC]/50 text-left transition-colors cursor-pointer group"
              >
                <p className="text-xs font-bold text-[#0B3B78] group-hover:text-[#FF6B1A] truncate">
                  {label}
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                  {cat.subtitle || 'Shop collection'}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 7. Why Choose KubreeBazzar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-b border-[#DCE6F2]">
        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-5 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center shadow-xs">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-bold text-[#FF6B1A] uppercase tracking-wider">
              Why Choose KubreeBazzar
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3B78]">
              Built for Families, Not Cluttered Marketplaces
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Instead of overwhelming shoppers with unverified listings,
              KubreeBazzar organizes curated essentials across 20 dedicated
              departments—pairing interactive 3D inspection with clear variant
              options and transparent INR pricing.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] p-4 sm:p-5">
              <Box className="w-5 h-5 text-[#1D6FD8] mb-2" />
              <p className="font-display text-base font-bold text-[#0B3B78]">
                360° 3D Previews
              </p>
              <p className="text-xs text-[#475569] mt-1">
                Interactive product views paired with studio photography
              </p>
            </div>
            <div className="rounded-xl bg-[#FFF3E8] border border-[#FF6B1A]/20 p-4 sm:p-5">
              <ShieldCheck className="w-5 h-5 text-[#FF6B1A] mb-2" />
              <p className="font-display text-base font-bold text-[#0B3B78]">
                Verified Checkout
              </p>
              <p className="text-xs text-[#475569] mt-1">
                HMAC-signed Razorpay &amp; Cash on Delivery support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Customer Shopping Experience */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-b border-[#DCE6F2]">
        <div className="mb-6 sm:mb-10">
          <p className="text-xs font-bold text-[#1D6FD8] uppercase tracking-wider mb-2">
            Workflow
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3B78]">
            Customer Shopping Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01. Browse & Inspect',
              desc: 'Explore 20 organized departments, filter by subcategory, and inspect products in 360° 3D or studio photos.',
            },
            {
              step: '02. Configure & Checkout',
              desc: 'Choose your pack weight, size, or finish, apply available coupon codes, and complete payment via Razorpay or COD.',
            },
            {
              step: '03. Track Every Milestone',
              desc: 'Follow your order status from confirmation and packing through dispatch to doorstep delivery.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl bg-white border border-[#DCE6F2] p-6 space-y-2 shadow-xs"
            >
              <h3 className="font-display text-lg font-bold text-[#FF6B1A]">
                {item.step}
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Our Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-b border-[#DCE6F2]">
        <div className="mb-6 sm:mb-10">
          <p className="text-xs font-bold text-[#4CAF50] uppercase tracking-wider mb-2">
            Principles
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3B78]">
            Our Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Honest Presentation',
              desc: 'Every product is presented with clear pack weights, capacities, and specifications.',
            },
            {
              title: 'Spatial Clarity',
              desc: 'Interactive 360° 3D inspection lets you evaluate packaging and details before ordering.',
            },
            {
              title: 'Accessible Performance',
              desc: 'Hardware-accelerated WebGL paired with studio photography and reduced-motion support.',
            },
            {
              title: 'Transparent Fulfillment',
              desc: 'Clear INR pricing, verified payment signatures, and multi-stage delivery tracking.',
            },
          ].map((val) => (
            <div
              key={val.title}
              className="rounded-2xl bg-white border border-[#DCE6F2] p-6 space-y-2 shadow-xs"
            >
              <h3 className="font-display text-lg font-bold text-[#0B3B78]">
                {val.title}
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Editable Store Chapters from Admin Settings */}
      {milestones.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#DCE6F2]">
          <div className="mb-10">
            <p className="text-xs font-bold text-[#FF6B1A] uppercase tracking-wider mb-2">
              Highlights
            </p>
            <h2 className="font-display text-3xl font-bold text-[#0B3B78]">
              Store Overview Chapters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestones.map((ms) => (
              <div
                key={ms.id}
                className="rounded-2xl bg-white border border-[#DCE6F2] p-6 space-y-2 shadow-xs"
              >
                <span className="font-mono text-xs font-semibold text-[#1D6FD8]">
                  {ms.year}
                </span>
                <h3 className="font-display text-lg font-bold text-[#0B3B78]">
                  {ms.title}
                </h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {ms.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. Shop Now Call-to-Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center space-y-5 sm:space-y-6">
        <p className="text-xs font-bold text-[#4CAF50] uppercase tracking-wider">
          Our Commitment
        </p>
        <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3B78]">
          Every order is backed by transparent specifications, protective
          packaging, and responsive support.
        </h2>
        <div className="pt-2 flex flex-col min-[380px]:flex-row flex-wrap items-stretch min-[380px]:items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="w-full min-[380px]:w-auto px-7 py-3.5 min-h-[44px] rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-sm font-bold text-white inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="w-full min-[380px]:w-auto px-7 py-3.5 min-h-[44px] rounded-xl bg-white hover:bg-[#F0F6FF] border-2 border-[#0B3B78] text-sm font-bold text-[#0B3B78] cursor-pointer transition-colors text-center"
          >
            Contact Support
          </button>
        </div>
      </section>
    </div>
  );
}

