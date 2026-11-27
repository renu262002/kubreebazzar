import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import {
  Upload,
  Star,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ImagePlus,
  RefreshCw,
} from 'lucide-react';
import type { ProductImageAsset } from '../../types';
import { formatByteSize, optimizeImageForUpload } from '../../utils/imageOptimize';
import { apiFetch, buildApiHeaders } from '../../utils/apiClient';

interface MultiImageUploaderProps {
  images: string[];
  imageMetadata?: ProductImageAsset[];
  token: string;
  bucket?:
    | 'productImages'
    | 'categoryImages'
    | 'websiteImages'
    | 'product-images'
    | 'category-images'
    | 'website-assets';
  folder?: string;
  onChange: (nextImages: string[], nextMeta: ProductImageAsset[]) => void;
  onNotify?: (msg: string) => void;
  disabled?: boolean;
}

export function MultiImageUploader({
  images,
  imageMetadata = [],
  token,
  bucket = 'productImages',
  folder = 'products',
  onChange,
  onNotify,
  disabled = false,
}: MultiImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [compressBeforeUpload, setCompressBeforeUpload] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const uploadSingleFile = async (file: File): Promise<{ url: string; meta: ProductImageAsset } | null> => {
    const optimized = await optimizeImageForUpload(file, {
      compress: compressBeforeUpload,
      maxDimension: 1600,
      quality: 0.84,
    });

    const res = await apiFetch('/api/admin/images', {
      method: 'POST',
      headers: buildApiHeaders(token, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        filename: optimized.filename,
        dataUrl: optimized.dataUrl,
        bucket,
        folder,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Failed to upload ${file.name}`);
    }

    const meta: ProductImageAsset = {
      url: data.url,
      storagePath: data.storagePath,
      storageBucket: data.bucket,
      storageMode: data.storageMode,
      permanentCloud: Boolean(data.permanentCloud),
      mimeType: data.mimeType || optimized.mimeType,
      sizeBytes: data.sizeBytes || optimized.optimizedBytes,
      versionTag: data.versionTag,
      isPrimary: false,
      sortOrder: images.length,
    };

    return { url: data.url, meta };
  };

  const handleFiles = async (files: FileList | null, targetReplaceIdx: number | null = null) => {
    if (!files || files.length === 0 || disabled) return;
    setUploading(true);
    const list = Array.from(files);
    let nextImages = [...images];
    let nextMeta = [...imageMetadata];

    try {
      for (let i = 0; i < list.length; i += 1) {
        const f = list[i];
        setUploadStatusText(`Optimizing & uploading ${i + 1} of ${list.length}: ${f.name}`);
        const uploaded = await uploadSingleFile(f);
        if (!uploaded) continue;
        if (targetReplaceIdx !== null && i === 0 && targetReplaceIdx < nextImages.length) {
          nextImages[targetReplaceIdx] = uploaded.url;
          nextMeta[targetReplaceIdx] = { ...uploaded.meta, isPrimary: targetReplaceIdx === 0, sortOrder: targetReplaceIdx };
        } else {
          nextImages.push(uploaded.url);
          nextMeta.push({ ...uploaded.meta, isPrimary: nextImages.length === 1, sortOrder: nextImages.length - 1 });
        }
      }
      // Normalize primary and sortOrder flags
      nextMeta = nextImages.map((u, idx) => ({
        ...(nextMeta[idx] || { url: u }),
        url: u,
        isPrimary: idx === 0,
        sortOrder: idx,
      }));
      onChange(nextImages, nextMeta);
      onNotify?.(`Uploaded ${list.length} image${list.length > 1 ? 's' : ''} cleanly.`);
    } catch (err) {
      onNotify?.(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
      setUploadStatusText('');
      setReplaceIndex(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    void handleFiles(e.dataTransfer.files);
  };

  const setPrimary = (idx: number) => {
    if (idx === 0 || idx >= images.length) return;
    const nextImages = [images[idx], ...images.filter((_, i) => i !== idx)];
    const movedMeta = imageMetadata[idx];
    const nextMeta = [
      movedMeta,
      ...imageMetadata.filter((_, i) => i !== idx),
    ].map((m, i) => ({
      ...(m || { url: nextImages[i] }),
      url: nextImages[i],
      isPrimary: i === 0,
      sortOrder: i,
    }));
    onChange(nextImages, nextMeta);
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const nextImages = [...images];
    const nextMeta = [...imageMetadata];
    [nextImages[idx], nextImages[target]] = [nextImages[target], nextImages[idx]];
    [nextMeta[idx], nextMeta[target]] = [nextMeta[target], nextMeta[idx]];
    onChange(
      nextImages,
      nextImages.map((u, i) => ({
        ...(nextMeta[i] || { url: u }),
        url: u,
        isPrimary: i === 0,
        sortOrder: i,
      }))
    );
  };

  const removeImage = (idx: number) => {
    const nextImages = images.filter((_, i) => i !== idx);
    const nextMeta = imageMetadata
      .filter((_, i) => i !== idx)
      .map((m, i) => ({
        ...(m || { url: nextImages[i] }),
        url: nextImages[i],
        isPrimary: i === 0,
        sortOrder: i,
      }));
    onChange(nextImages, nextMeta);
  };

  const handleAddUrl = () => {
    const clean = manualUrl.trim();
    if (!clean) return;
    const nextImages = [...images, clean];
    const nextMeta = [
      ...imageMetadata,
      {
        url: clean,
        isPrimary: nextImages.length === 1,
        sortOrder: nextImages.length - 1,
      },
    ];
    onChange(nextImages, nextMeta);
    setManualUrl('');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-[#132238]">
            Product Gallery Images ({images.length})
          </p>
          <p className="text-[11px] text-[#64748B]">
            First image acts as the primary storefront thumbnail. JPG, PNG, WebP supported up to 5MB each.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 text-xs text-[#475569] cursor-pointer">
          <input
            type="checkbox"
            checked={compressBeforeUpload}
            onChange={(e) => setCompressBeforeUpload(e.target.checked)}
            className="rounded border-[#CBD5E1]"
          />
          <span>Auto-optimize WebP/dimensions before upload</span>
        </label>
      </div>

      {/* Drop Zone + File Picker */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
          dragActive
            ? 'border-[#1D6FD8] bg-[#EEF4FB]'
            : 'border-[#CBD5E1] bg-[#F8FAFC]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e: ChangeEvent<HTMLInputElement>) => void handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled || uploading}
        />
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            void handleFiles(e.target.files, replaceIndex)
          }
          className="hidden"
          disabled={disabled || uploading}
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="w-6 h-6 text-[#1D6FD8]" />
          <p className="text-xs font-semibold text-[#0B3B78]">
            {uploading ? uploadStatusText : 'Drag & drop product photos or browse from computer / phone'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 min-h-[40px] rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] disabled:opacity-60 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ImagePlus className="w-4 h-4" />
              <span>Select Multiple Photos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Direct Image URL Input */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="Or paste permanent HTTPS storage URL / project path..."
          className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={handleAddUrl}
          disabled={disabled || !manualUrl.trim()}
          className="px-4 py-2 min-h-[40px] rounded-xl border border-[#DCE6F2] bg-white hover:bg-[#F0F6FF] disabled:opacity-50 text-xs font-bold text-[#0B3B78] cursor-pointer whitespace-nowrap"
        >
          Attach URL
        </button>
      </div>

      {/* Image Slots Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, idx) => {
            const meta = imageMetadata[idx];
            return (
              <div
                key={`${url}-${idx}`}
                className="rounded-xl bg-white border border-[#DCE6F2] overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-[#F8FAFC]">
                  <img
                    src={url}
                    alt={`Product gallery ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0B3B78] text-[10px] font-bold text-white">
                      Primary
                    </span>
                  )}
                </div>
                <div className="p-2 space-y-2 border-t border-[#EEF4FB]">
                  <div className="text-[10px] text-[#64748B] truncate font-mono-tabular">
                    {meta?.storageMode === 'mongodb-gridfs'
                      ? 'MongoDB GridFS'
                      : meta?.storageMode === 'local-dev-disk'
                        ? 'Local Disk Upload'
                        : `Slot #${idx + 1}`}
                    {meta?.sizeBytes ? ` · ${formatByteSize(meta.sizeBytes)}` : ''}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <button
                      type="button"
                      title="Set as Primary Thumbnail"
                      disabled={disabled || idx === 0}
                      onClick={() => setPrimary(idx)}
                      className={`p-1.5 rounded-lg border text-[11px] cursor-pointer ${
                        idx === 0
                          ? 'border-[#FF6B1A] text-[#FF6B1A] bg-orange-50'
                          : 'border-[#DCE6F2] text-[#475569] hover:text-[#0B3B78]'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Move Left"
                      disabled={disabled || idx === 0}
                      onClick={() => moveImage(idx, -1)}
                      className="p-1.5 rounded-lg border border-[#DCE6F2] text-[#475569] hover:text-[#0B3B78] disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Move Right"
                      disabled={disabled || idx === images.length - 1}
                      onClick={() => moveImage(idx, 1)}
                      className="p-1.5 rounded-lg border border-[#DCE6F2] text-[#475569] hover:text-[#0B3B78] disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Replace Image"
                      disabled={disabled || uploading}
                      onClick={() => {
                        setReplaceIndex(idx);
                        replaceInputRef.current?.click();
                      }}
                      className="p-1.5 rounded-lg border border-[#DCE6F2] text-[#475569] hover:text-[#0B3B78] cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Remove Image"
                      disabled={disabled}
                      onClick={() => removeImage(idx)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
