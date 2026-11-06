import { Component, ReactNode, Suspense, lazy, useEffect, useState } from 'react';
import { HeroPhotorealShowcase } from './HeroPhotorealShowcase';

const LazyHeroOrbital3DScene = lazy(() =>
  import('./HeroOrbital3DScene').then((m) => ({
    default: m.HeroOrbital3DScene,
  }))
);

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

interface HeroOrbitalWrapperProps {
  onNavigate: (path: string) => void;
}

export function HeroOrbitalWrapper({ onNavigate }: HeroOrbitalWrapperProps) {
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onMqChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onMqChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mq.removeEventListener('change', onMqChange);
    };
  }, []);

  const fallbackShowcase = (
    <HeroPhotorealShowcase
      onSelectProduct={(slug) => onNavigate(`/product/${slug}`)}
    />
  );

  if (!webglSupported) {
    return fallbackShowcase;
  }

  return (
    <div className="relative w-full h-[430px] sm:h-[490px] lg:h-[550px]">
      <WebGLErrorBoundary fallback={fallbackShowcase}>
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="px-4 py-2 rounded-xl bg-[#FFFDF8]/90 border border-[#E6DDD0] text-xs font-medium text-[#6E6059]">
                Loading KubreeBazzar 3D Universe...
              </div>
            </div>
          }
        >
          <LazyHeroOrbital3DScene
            onNavigate={onNavigate}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </WebGLErrorBoundary>

      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#FFFDF8]/90 backdrop-blur-xs border border-[#E6DDD0] text-[11px] text-[#4A3F3B] absolute bottom-2 right-2 pointer-events-none">
        <span>
          Drag to orbit · Hover to inspect · Click any product to shop
        </span>
      </div>
    </div>
  );
}
