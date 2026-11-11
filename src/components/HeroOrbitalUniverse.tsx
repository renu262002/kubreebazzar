import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ArrowRight, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { ORBITAL_HERO_ITEMS, UploadedProductImage } from '../data/uploadedProducts';

interface HeroOrbitalUniverseProps {
  onSelectProduct: (targetPath: string) => void;
  onAddToCart?: (item: UploadedProductImage) => void;
}

export const HeroOrbitalUniverse: React.FC<HeroOrbitalUniverseProps> = ({
  onSelectProduct,
  onAddToCart,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const orbitalGroupRef = useRef<HTMLDivElement | null>(null);
  const [activeItem, setActiveItem] = useState<UploadedProductImage | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const angleRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const total = ORBITAL_HERO_ITEMS.length;

  useEffect(() => {
    if (reducedMotion) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isPaused) {
        // Smooth rotation around elliptical orbit
        const speed = isMobile ? 0.35 : 0.42;
        angleRef.current = (angleRef.current + speed * delta) % (Math.PI * 2);
      }

      if (orbitalGroupRef.current) {
        const nodes = orbitalGroupRef.current.querySelectorAll<HTMLDivElement>('.orbital-node');
        const radiusX = isMobile ? 130 : 210;
        const radiusY = isMobile ? 65 : 95;

        nodes.forEach((node, index) => {
          const itemAngle = angleRef.current + (index * (Math.PI * 2)) / total;
          const x = Math.cos(itemAngle) * radiusX;
          const y = Math.sin(itemAngle) * radiusY;

          // Depth estimation based on vertical sin position
          // Normalized depth: 0 (furthest back) to 1 (closest front)
          const normY = (Math.sin(itemAngle) + 1) / 2;
          const scale = isMobile
            ? 0.75 + normY * 0.35
            : 0.8 + normY * 0.38;
          const zIndex = Math.round(normY * 50);
          const opacity = 0.72 + normY * 0.28;

          node.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0) scale(${scale.toFixed(3)})`;
          node.style.zIndex = zIndex.toString();
          node.style.opacity = opacity.toFixed(2);
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, isMobile, reducedMotion, total]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] flex items-center justify-center select-none overflow-hidden"
    >
      {/* Decorative ambient glow behind universe */}
      <div
        aria-hidden="true"
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#FF6B1A]/20 via-[#4CAF50]/15 to-[#0B3B78]/25 blur-3xl pointer-events-none"
      />

      {/* Orbit track ring (Elliptical Path visualization) */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full border border-dashed border-[#1D6FD8]/35"
        style={{
          width: isMobile ? '280px' : '440px',
          height: isMobile ? '140px' : '200px',
          transform: 'rotate(-4deg)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full border border-[#FF6B1A]/25"
        style={{
          width: isMobile ? '290px' : '450px',
          height: isMobile ? '145px' : '205px',
          transform: 'rotate(-4deg)',
        }}
      />

      {/* Central 3D Animated Sphere */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-auto">
        <div className="relative group">
          {/* Outer glowing pulsing orb */}
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#FF6B1A] via-[#4CAF50] to-[#0B3B78] opacity-35 blur-md animate-pulse"
          />

          {/* Core Sphere */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-[3px] bg-gradient-to-tr from-[#0B3B78] via-[#1D6FD8] to-[#FF6B1A] shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-white via-[#F0F6FF] to-[#DCE6F2] flex flex-col items-center justify-center p-3 text-center shadow-inner relative overflow-hidden">
              {/* Turtle Mascot / Emblem inside Sphere */}
              <img
                src="/assets/aistudio/Cheerful_Turtle_Shopping_Logo_75435e9c.png"
                alt="KubreeBazzar Universe Emblem"
                className="w-14 sm:w-20 h-auto object-contain drop-shadow-md transform hover:scale-110 transition-transform"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = '/images/kubreebazzar-logo.png';
                }}
              />
              <span className="text-[10px] sm:text-[11px] font-bold font-display text-[#0B3B78] tracking-tight mt-0.5">
                Kubree<span className="text-[#FF6B1A]">Bazzar</span>
              </span>
            </div>
          </div>
        </div>

        {/* Orbit indicator hint badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#DCE6F2] shadow-sm text-[11px] font-semibold text-[#0B3B78]">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" />
          <span>7 Daily Essentials Revolving</span>
        </div>
      </div>

      {/* Orbiting Product Items Group */}
      <div
        ref={orbitalGroupRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        {ORBITAL_HERO_ITEMS.map((item, index) => {
          const isActive = activeItem?.id === item.id;

          return (
            <div
              key={item.id}
              className="orbital-node absolute top-1/2 left-1/2 pointer-events-auto cursor-pointer"
              onMouseEnter={() => {
                setIsPaused(true);
                setActiveItem(item);
              }}
              onMouseLeave={() => {
                setIsPaused(false);
                setActiveItem(null);
              }}
              onClick={() => onSelectProduct(item.targetPath)}
            >
              <div
                className={`group relative rounded-2xl p-2 transition-all duration-300 ${
                  isActive
                    ? 'scale-110 ring-4 ring-[#FF6B1A] bg-white shadow-2xl'
                    : 'bg-white/95 border border-[#DCE6F2] shadow-lg hover:border-[#1D6FD8] hover:shadow-xl'
                }`}
              >
                {/* Product Image Tile */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-[#F0F6FF] flex items-center justify-center p-1.5 relative">
                  <img
                    src={item.src}
                    alt={item.name}
                    loading="eager"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Category Pill Tag on Node */}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#0B3B78]/90 text-white text-[9px] font-bold tracking-tight whitespace-nowrap">
                    {item.category}
                  </span>
                </div>

                {/* Hover Quick Card Popup */}
                {isActive && (
                  <div className="absolute left-1/2 -bottom-2 translate-y-full -translate-x-1/2 w-48 sm:w-56 p-2.5 rounded-xl bg-white border border-[#DCE6F2] shadow-2xl z-50 text-left pointer-events-auto">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B1A]">
                      {item.label}
                    </p>
                    <h4 className="text-xs font-bold text-[#0B3B78] line-clamp-1 mt-0.5">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#EEF4FB]">
                      <span className="font-mono-tabular text-xs font-bold text-[#0B3B78]">
                        ₹{item.price}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(item.targetPath);
                        }}
                        className="px-2 py-1 rounded bg-[#FF6B1A] text-white text-[10px] font-bold hover:bg-[#E5580D] transition-colors"
                      >
                        Explore →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
