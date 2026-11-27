import { useState, useEffect } from 'react';
import { Box } from 'lucide-react';

interface ResilientImageProps {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  emptyLabel?: string;
  className?: string;
  eager?: boolean;
}

function normalizeAssetUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.includes(' ')) {
    try {
      return encodeURI(url);
    } catch {
      return url.replace(/ /g, '%20');
    }
  }
  return url;
}

export function ResilientImage({
  src,
  fallbackSrc,
  alt,
  emptyLabel,
  className = 'w-full h-full object-cover',
  eager = false,
}: ResilientImageProps) {
  const [stage, setStage] = useState<'primary' | 'fallback' | 'empty'>(
    src ? 'primary' : fallbackSrc ? 'fallback' : 'empty'
  );

  useEffect(() => {
    setStage(src ? 'primary' : fallbackSrc ? 'fallback' : 'empty');
  }, [src, fallbackSrc]);

  const rawSrc =
    stage === 'primary' ? src : stage === 'fallback' ? fallbackSrc : undefined;
  const activeSrc = normalizeAssetUrl(rawSrc);

  if (!activeSrc || stage === 'empty') {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F0F6FF] text-[#64748B] p-4 text-center ${className}`}
        role="img"
        aria-label={emptyLabel || alt}
      >
        <Box className="w-8 h-8 text-[#1D6FD8]/70 mb-2" />
        <span className="text-xs font-medium text-[#132238] line-clamp-2">
          {emptyLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={activeSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => {
        if (stage === 'primary' && fallbackSrc && fallbackSrc !== src) {
          setStage('fallback');
        } else {
          setStage('empty');
        }
      }}
      className={className}
    />
  );
}
