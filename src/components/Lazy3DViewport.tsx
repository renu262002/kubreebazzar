import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box } from 'lucide-react';

interface Lazy3DViewportProps {
  children: ReactNode;
  className?: string;
  label?: string;
  tone?: 'light' | 'dark';
}

export function Lazy3DViewport({
  children,
  className = 'w-full h-full',
  label = 'Initializing 3D Viewport...',
  tone = 'light',
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
        <div
          className={`w-full h-full rounded-xl flex flex-col items-center justify-center gap-2 ${
            tone === 'dark'
              ? 'bg-[#071731] border border-[#1D6FD8]/40 text-blue-100'
              : 'bg-[#F0F6FF] border border-[#DCE6F2] text-[#0B3B78]'
          }`}
        >
          <Box
            className={`w-6 h-6 ${
              tone === 'dark' ? 'text-[#FF6B1A]' : 'text-[#1D6FD8]'
            }`}
          />
          <span className="text-xs font-medium">{label}</span>
        </div>
      )}
    </div>
  );
}
