import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Box, ShieldCheck, Compass, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category3DShowcase } from '../components/Category3DShowcase';

gsap.registerPlugin(ScrollTrigger);

export function AboutPage() {
  const { settings, navigate } = useStore();
  const rootRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div ref={rootRef} className="space-y-0">
      {/* 1. Animated Introduction */}
      <section className="relative min-h-[500px] flex items-center bg-gradient-to-br from-[#FAF6F0] via-[#F3ECE1] to-[#EADBC6] border-b border-[#E6DCD0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
          <div className="lg:col-span-7 space-y-5">
            <p className="about-reveal text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em]">
              About {settings?.brandName || 'KubreeBazzar'}
            </p>
            <h1 className="about-reveal font-serif text-4xl sm:text-5xl font-bold text-[#1E1614] leading-tight">
              A Heritage Indian Retail Experience Enhanced with 3D Clarity.
            </h1>
            <p className="about-reveal text-base text-[#5C4F49] leading-relaxed max-w-2xl">
              {settings?.brandTagline ||
                'Heritage Indian Retail · Rice, Grocery, Honey & Timeless Watches'}
            </p>
          </div>

          <div className="lg:col-span-5 h-[340px] rounded-2xl bg-white border border-[#E6DCD0] overflow-hidden">
            <Category3DShowcase activePreset="watch" />
          </div>
        </div>
      </section>

      {/* 2. Brand Overview & Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#E6DCD0] grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <p className="text-xs font-semibold text-[#B88628] uppercase tracking-wider">
            01. Brand Overview
          </p>
          <h2 className="font-serif text-3xl font-bold text-[#1E1614]">
            Four Core Departments Under One Roof
          </h2>
          <p className="text-sm sm:text-base text-[#5C4F49] leading-relaxed">
            {settings?.aboutOverview ||
              'KubreeBazzar brings together aged regional rice varieties, everyday kitchen groceries, floral glass-jar honey, and classic wristwatches in a unified 3D shopping destination.'}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold text-[#6B1D2F] uppercase tracking-wider">
            02. Our Story
          </p>
          <h2 className="font-serif text-3xl font-bold text-[#1E1614]">
            Why We Built a 3D Emporium
          </h2>
          <p className="text-sm sm:text-base text-[#5C4F49] leading-relaxed">
            {settings?.aboutStory ||
              'Inspired by trusted South Indian retail traditions, we designed KubreeBazzar so households can inspect grain sacks, glass honey jars, pantry staples, and watch dials in interactive 3D before ordering.'}
          </p>
        </div>
      </section>

      {/* 3. Mission and Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#E6DCD0] grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-white border border-[#E6DCD0] p-8 space-y-3">
          <Compass className="w-6 h-6 text-[#6B1D2F]" />
          <h2 className="font-serif text-2xl font-bold text-[#1E1614]">
            Our Mission
          </h2>
          <p className="text-sm text-[#5C4F49] leading-relaxed">
            {settings?.aboutMission ||
              'To deliver dependable household staples and timeless personal accessories with transparent pack-size pricing and attentive service.'}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#E6DCD0] p-8 space-y-3">
          <Layers className="w-6 h-6 text-[#B88628]" />
          <h2 className="font-serif text-2xl font-bold text-[#1E1614]">
            Our Vision
          </h2>
          <p className="text-sm text-[#5C4F49] leading-relaxed">
            {settings?.aboutVision ||
              'To set a warm, tactile standard for online retail where every product can be explored from every angle.'}
          </p>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#E6DCD0]">
        <div className="mb-10">
          <p className="text-xs font-semibold text-[#B88628] uppercase tracking-wider mb-2">
            Principles
          </p>
          <h2 className="font-serif text-3xl font-bold text-[#1E1614]">
            Core Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Honest Presentation',
              desc: 'Every product is presented with clear pack weights, jar volumes, and watch specifications.',
            },
            {
              title: 'Spatial Clarity',
              desc: 'Interactive 360° 3D inspection lets you evaluate packaging and dial finishes before ordering.',
            },
            {
              title: 'Accessible Performance',
              desc: 'Hardware-accelerated WebGL paired with studio photography and reduced-motion support.',
            },
            {
              title: 'Transparent Fulfillment',
              desc: 'Clear INR pricing, verified payment signatures, and real-time 5-stage delivery tracking.',
            },
          ].map((val) => (
            <div
              key={val.title}
              className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-2"
            >
              <h3 className="font-serif text-lg font-bold text-[#1E1614]">
                {val.title}
              </h3>
              <p className="text-xs text-[#6E6059] leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How Our Shopping Experience Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#E6DCD0]">
        <div className="mb-10">
          <p className="text-xs font-semibold text-[#6B1D2F] uppercase tracking-wider mb-2">
            Workflow
          </p>
          <h2 className="font-serif text-3xl font-bold text-[#1E1614]">
            How Our Shopping Experience Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01. Inspect in 3D',
              desc: 'Orbit 360°, toggle exploded assembly views, and compare finishes directly in your browser.',
            },
            {
              step: '02. Configure & Checkout',
              desc: 'Select your pack weight or strap finish, apply coupon codes, and pay via Razorpay or COD.',
            },
            {
              step: '03. Track Every Milestone',
              desc: 'Follow your shipment from warehouse packing through dispatch to doorstep delivery.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-2"
            >
              <h3 className="font-serif text-lg font-bold text-[#6B1D2F]">
                {item.step}
              </h3>
              <p className="text-xs text-[#5C4F49] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. What Makes Us Different */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#E6DCD0]">
        <div className="rounded-2xl bg-white border border-[#E6DCD0] p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-semibold text-[#B88628] uppercase tracking-wider">
              Retail Philosophy
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#1E1614]">
              Built for Households, Not Cluttered Marketplaces
            </h2>
            <p className="text-sm text-[#5C4F49] leading-relaxed">
              Instead of overwhelming you with thousands of unverified listings,
              KubreeBazzar curates 48 focused essentials across Rice,
              Grocery, Honey, and Watches—each backed by interactive 3D
              inspection.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#FAF6F0] border border-[#E6DCD0] p-5">
              <Box className="w-5 h-5 text-[#6B1D2F] mb-2" />
              <p className="font-serif text-base font-bold text-[#1E1614]">
                360° WebGL Stage
              </p>
              <p className="text-xs text-[#6E6059] mt-1">
                Real-time studio lighting &amp; exploded views
              </p>
            </div>
            <div className="rounded-xl bg-[#FAF6F0] border border-[#E6DCD0] p-5">
              <ShieldCheck className="w-5 h-5 text-[#B88628] mb-2" />
              <p className="font-serif text-base font-bold text-[#1E1614]">
                Verified Checkout
              </p>
              <p className="text-xs text-[#6E6059] mt-1">
                HMAC-signed Razorpay &amp; COD support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Milestones */}
      {milestones.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#E6DCD0]">
          <div className="mb-10">
            <p className="text-xs font-semibold text-[#B88628] uppercase tracking-wider mb-2">
              Evolution
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#1E1614]">
              Store Milestones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestones.map((ms) => (
              <div
                key={ms.id}
                className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-2"
              >
                <span className="font-mono text-xs font-semibold text-[#6B1D2F]">
                  {ms.year}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1E1614]">
                  {ms.title}
                </h3>
                <p className="text-xs text-[#6E6059] leading-relaxed">
                  {ms.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-wider">
          Our Commitment
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          Every order is backed by transparent specifications, protective
          packaging, and responsive support.
        </h2>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="px-7 py-3.5 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-sm font-semibold text-white inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Explore the Shop</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
