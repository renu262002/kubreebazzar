import { useState } from 'react';
import { Box } from 'lucide-react';

interface ResilientImageProps {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

export function ResilientImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  eager = false,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F0F6FF] via-white to-[#EAF7EC] text-[#64748B] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Box className="w-8 h-8 text-[#1D6FD8]/70 mb-2" />
        <span className="text-xs font-medium text-[#132238] line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
