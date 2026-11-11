import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box } from 'lucide-react';

interface Lazy3DViewportProps {
  children: ReactNode;
  className?: string;
  label?: string;
}

export function Lazy3DViewport({
  children,
  className = 'w-full h-full',
  label = 'Initializing 3D Viewport...',
}: Lazy3DViewportProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldMount(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {shouldMount ? (
        children
      ) : (
        <div className="w-full h-full rounded-xl bg-[#F3ECE1] border border-[#E6DCD0] flex flex-col items-center justify-center gap-2 text-[#786B65]">
          <Box className="w-6 h-6 text-[#6B1D2F]" />
          <span className="text-xs font-medium">{label}</span>
        </div>
      )}
    </div>
  );
}
