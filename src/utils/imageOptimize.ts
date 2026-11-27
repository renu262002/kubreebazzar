export interface OptimizedImageResult {
  dataUrl: string;
  filename: string;
  mimeType: string;
  originalBytes: number;
  optimizedBytes: number;
  width?: number;
  height?: number;
  wasCompressed: boolean;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function estimateDataUrlBytes(dataUrl: string): number {
  const idx = dataUrl.indexOf(',');
  if (idx === -1) return dataUrl.length;
  const b64 = dataUrl.slice(idx + 1);
  return Math.floor((b64.length * 3) / 4);
}

export async function optimizeImageForUpload(
  file: File,
  options?: {
    maxDimension?: number;
    quality?: number;
    compress?: boolean;
  }
): Promise<OptimizedImageResult> {
  const maxDim = options?.maxDimension ?? 1600;
  const quality = options?.quality ?? 0.84;
  const shouldCompress = options?.compress !== false;

  const lower = file.name.toLowerCase();
  const isGlb = lower.endsWith('.glb') || lower.endsWith('.gltf');
  if (isGlb || !shouldCompress || file.type === 'image/gif') {
    const raw = await readFileAsDataUrl(file);
    return {
      dataUrl: raw,
      filename: file.name,
      mimeType: file.type || (isGlb ? 'model/gltf-binary' : 'image/jpeg'),
      originalBytes: file.size,
      optimizedBytes: estimateDataUrlBytes(raw),
      wasCompressed: false,
    };
  }

  const rawDataUrl = await readFileAsDataUrl(file);

  if (typeof Image === 'undefined' || typeof document === 'undefined') {
    return {
      dataUrl: rawDataUrl,
      filename: file.name,
      mimeType: file.type || 'image/jpeg',
      originalBytes: file.size,
      optimizedBytes: file.size,
      wasCompressed: false,
    };
  }

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Image decode failed'));
      el.src = rawDataUrl;
    });

    const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
    const targetW = Math.max(1, Math.round(img.width * scale));
    const targetH = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return {
        dataUrl: rawDataUrl,
        filename: file.name,
        mimeType: file.type || 'image/jpeg',
        originalBytes: file.size,
        optimizedBytes: file.size,
        wasCompressed: false,
      };
    }

    ctx.drawImage(img, 0, 0, targetW, targetH);

    // Preserve transparency for small PNGs, otherwise prefer compact WebP with JPEG fallback
    const preferPng = file.type === 'image/png' && file.size < 900 * 1024;
    let outMime = preferPng ? 'image/png' : 'image/webp';
    let currentQuality = quality;
    let outDataUrl = canvas.toDataURL(outMime, currentQuality);

    if (!outDataUrl.startsWith(`data:${outMime}`) && outMime === 'image/webp') {
      outMime = 'image/jpeg';
      outDataUrl = canvas.toDataURL(outMime, currentQuality);
    }

    const MAX_VERCEL_SAFE_BYTES = 2_400_000;
    let optimizedBytes = estimateDataUrlBytes(outDataUrl);
    if (optimizedBytes > MAX_VERCEL_SAFE_BYTES) {
      if (outMime === 'image/png') {
        outMime = 'image/webp';
        outDataUrl = canvas.toDataURL(outMime, currentQuality);
        if (!outDataUrl.startsWith(`data:${outMime}`)) {
          outMime = 'image/jpeg';
          outDataUrl = canvas.toDataURL(outMime, currentQuality);
        }
        optimizedBytes = estimateDataUrlBytes(outDataUrl);
      }
      while (optimizedBytes > MAX_VERCEL_SAFE_BYTES && currentQuality > 0.45) {
        currentQuality = Number((currentQuality - 0.12).toFixed(2));
        outDataUrl = canvas.toDataURL(outMime, currentQuality);
        optimizedBytes = estimateDataUrlBytes(outDataUrl);
      }
    }

    if (optimizedBytes >= file.size && scale === 1 && file.size <= MAX_VERCEL_SAFE_BYTES) {
      return {
        dataUrl: rawDataUrl,
        filename: file.name,
        mimeType: file.type || outMime,
        originalBytes: file.size,
        optimizedBytes: file.size,
        width: img.width,
        height: img.height,
        wasCompressed: false,
      };
    }

    const baseName = file.name.replace(/\.[^.]+$/, '');
    const ext = outMime === 'image/png' ? 'png' : outMime === 'image/webp' ? 'webp' : 'jpg';

    return {
      dataUrl: outDataUrl,
      filename: `${baseName}.${ext}`,
      mimeType: outMime,
      originalBytes: file.size,
      optimizedBytes,
      width: targetW,
      height: targetH,
      wasCompressed: true,
    };
  } catch {
    return {
      dataUrl: rawDataUrl,
      filename: file.name,
      mimeType: file.type || 'image/jpeg',
      originalBytes: file.size,
      optimizedBytes: file.size,
      wasCompressed: false,
    };
  }
}

export function formatByteSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
