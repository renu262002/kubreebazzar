import fs from 'fs';
import path from 'path';
import type { MediaAuditItem, MediaAuditSummary } from '../src/types.ts';

function walkDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

export function isValidLocalImageHeader(filePath: string): boolean {
  try {
    const st = fs.statSync(filePath);
    if (st.size < 4) return false;
    const buf = Buffer.alloc(Math.min(16, st.size));
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buf, 0, buf.length, 0);
    fs.closeSync(fd);
    const hex = buf.toString('hex').toLowerCase();
    const str = buf.toString('utf8');
    if (hex.startsWith('ffd8ff')) return true;
    if (hex.startsWith('89504e47')) return true;
    if (str.startsWith('RIFF') && buf.subarray(8, 12).toString('utf8') === 'WEBP') return true;
    if (str.includes('<svg') || str.includes('<?xml')) return true;
    return false;
  } catch {
    return false;
  }
}

export function auditLocalCatalogImages(params: {
  products: Array<{ id: string; images?: string[] }>;
  collectionGroups: Array<{
    category: string;
    items: Array<{
      id: string;
      name: string;
      slug: string;
      image?: string;
      expectedFilename?: string;
      imageStatus?: string;
      parentGroup?: string;
      parentCategory?: string;
      varietyGroup?: string;
    }>;
  }>;
  storageBucketsConfigured: boolean;
  uploadsDir: string;
  gridfsImagesCount?: number;
}): MediaAuditSummary {
  const publicImagesDir = path.resolve(process.cwd(), 'public', 'images');
  const srcAssetsDir = path.resolve(process.cwd(), 'src', 'assets');

  const publicFiles = walkDir(publicImagesDir);
  const srcAssetFiles = walkDir(srcAssetsDir);
  const uploadFiles = walkDir(params.uploadsDir);

  const brokenProductRefs: string[] = [];
  for (const p of params.products) {
    for (const img of p.images || []) {
      if (!img) {
        brokenProductRefs.push(`${p.id}: (empty image URL)`);
        continue;
      }
      if (img.startsWith('/api/images/') || img.startsWith('https://')) {
        continue;
      }
      if (img.startsWith('/images/')) {
        const diskPath = path.resolve(process.cwd(), 'public', img.replace(/^\/+/, ''));
        if (!fs.existsSync(diskPath) || !isValidLocalImageHeader(diskPath)) {
          brokenProductRefs.push(`${p.id}: ${img}`);
        }
      }
    }
  }

  const collectionsWithMissingImages: MediaAuditItem[] = [];
  for (const grp of params.collectionGroups) {
    for (const item of grp.items) {
      const img = (item.image || '').trim();
      let isMissing = !img || item.imageStatus === 'quota_pending';
      if (!isMissing && img.startsWith('/images/')) {
        const diskPath = path.resolve(process.cwd(), 'public', img.replace(/^\/+/, ''));
        if (!fs.existsSync(diskPath) || !isValidLocalImageHeader(diskPath)) {
          isMissing = true;
        }
      }
      if (isMissing) {
        collectionsWithMissingImages.push({
          id: item.id,
          category: grp.category,
          groupName: item.parentGroup || item.varietyGroup || item.parentCategory || grp.category,
          name: item.name,
          slug: item.slug,
          expectedFilename: item.expectedFilename || '',
          imageStatus: item.imageStatus || (img ? 'broken_ref' : 'quota_pending'),
        });
      }
    }
  }

  return {
    publicImagesCount: publicFiles.length,
    srcAssetsCount: srcAssetFiles.length,
    uploadsCount: uploadFiles.length,
    brokenProductRefs,
    collectionsWithMissingImages,
    storageBucketsConfigured: params.storageBucketsConfigured,
    gridfsImagesCount: params.gridfsImagesCount ?? 0,
  };
}
