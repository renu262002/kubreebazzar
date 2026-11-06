import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ResilientImage } from './ResilientImage';
import { Product3DViewer } from './Product3DViewer';
import { Lazy3DViewport } from './Lazy3DViewport';
import type { ModelPreset } from '../types';

interface ProductSpotlightStageProps {
  preset: ModelPreset;
  glbUrl?: string;
  productName: string;
  images?: string[];
}

const FALLBACK_STUDIO_BY_PRESET: Record<ModelPreset, string> = {
  rice: '/src/assets/images/hero_rice_bowl_bag_1793936931121.jpg',
  grocery: '/src/assets/images/hero_grocery_basket_1793936930249.jpg',
  honey: '/src/assets/images/hero_honey_drip_jar_1793936931141.jpg',
  watch: '/src/assets/images/hero_luxury_watch_studio_1793936930915.jpg',
};

export function ProductSpotlightStage({
  preset,
  glbUrl,
  productName,
  images = [],
}: ProductSpotlightStageProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [zoom, setZoom] = useState(1);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (glbUrl) {
    return (
      <Lazy3DViewport label={`Loading 3D ${productName}...`}>
        <Product3DViewer
          preset={preset}
          glbUrl={glbUrl}
          productName={productName}
        />
      </Lazy3DViewport>
    );
  }

  const gallery =
    images.length > 0 ? images : [FALLBACK_STUDIO_BY_PRESET[preset]];
  const currentSrc = gallery[activeImgIdx] || FALLBACK_STUDIO_BY_PRESET[preset];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ rx: -ny * 6, ry: nx * 7 });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#FFFDF8] via-[#F7F0E5] to-[#EFE1CC] select-none overflow-hidden"
      style={{ perspective: '1100px' }}
    >
      {/* Realistic Contact Shadow */}
      <div
        aria-hidden="true"
        className="w-3/4 h-8 rounded-full bg-[#222222]/20 blur-xl absolute bottom-6 pointer-events-none"
      />

      <motion.div
        animate={{
          rotateX: tilt.rx,
          rotateY: tilt.ry,
          scale: zoom,
        }}
        transition={{ type: 'spring', stiffness: 170, damping: 22 }}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow:
            '0 24px 48px -16px rgba(116, 29, 53, 0.22), 0 10px 20px -10px rgba(34, 34, 34, 0.14)',
        }}
        className="relative w-full h-full max-h-[360px] rounded-2xl overflow-hidden border border-[#E6DDD0] bg-[#FFFDF8]"
      >
        <ResilientImage
          src={currentSrc}
          alt={productName}
          className="w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/15 pointer-events-none"
        />
      </motion.div>

      {/* Studio Zoom & Gallery Controls */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
        {gallery.length > 1 ? (
          <div className="flex items-center gap-1.5 pointer-events-auto bg-[#FFFDF8]/90 backdrop-blur-xs px-2 py-1 rounded-lg border border-[#E6DDD0]">
            {gallery.slice(0, 4).map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setActiveImgIdx(i)}
                aria-label={`View angle ${i + 1} of ${productName}`}
                className={`w-7 h-7 rounded overflow-hidden border cursor-pointer ${
                  activeImgIdx === i
                    ? 'border-[#741D35] ring-1 ring-[#741D35]'
                    : 'border-[#E6DDD0] opacity-75 hover:opacity-100'
                }`}
              >
                <ResilientImage
                  src={img}
                  alt={`${productName} view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : (
          <span className="px-2.5 py-1 rounded-md bg-[#FFFDF8]/90 border border-[#E6DDD0] text-[11px] font-medium text-[#4A3F3B]">
            Move cursor for 3D tilt · Use controls to zoom
          </span>
        )}

        <div className="flex items-center gap-1 pointer-events-auto bg-[#FFFDF8]/92 backdrop-blur-xs p-1 rounded-lg border border-[#E6DDD0]">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))))}
            aria-label="Zoom out"
            className="w-7 h-7 rounded flex items-center justify-center text-[#222222] hover:bg-[#F7F0E5] cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] font-semibold text-[#741D35] px-1">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.25).toFixed(2))))}
            aria-label="Zoom in"
            className="w-7 h-7 rounded flex items-center justify-center text-[#222222] hover:bg-[#F7F0E5] cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          {zoom !== 1 && (
            <button
              type="button"
              onClick={() => setZoom(1)}
              aria-label="Reset zoom"
              className="w-7 h-7 rounded flex items-center justify-center text-[#6E6059] hover:bg-[#F7F0E5] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
