import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ObjectId, type GridFSBucket } from 'mongodb';
import {
  ensureMongoIndexes,
  getGridFSBuckets,
  getMongoCollections,
  getMongoDb,
  isMongoConfigured,
  type GridFSBucketKey,
} from './mongo.ts';

export type StorageBucketKey = 'productImages' | 'categoryImages' | 'websiteImages';

export interface UploadedAssetResult {
  id?: string;
  imageId?: string;
  url: string;
  bucket: StorageBucketKey;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  versionTag: string;
  sha256?: string;
  storageMode: 'mongodb-gridfs' | 'local-dev-disk';
  permanentCloud: boolean;
  warning?: string;
}

export interface GridFSImageRecord {
  id: string;
  gridfsFileId: string;
  bucket: StorageBucketKey;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  refType: string;
  refId: string;
  imageType: string;
  displayOrder: number;
  active: boolean;
  sha256: string;
  uploadedAt: string;
  url: string;
}

const IMAGE_EXTENSIONS = new Map<string, string>([
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
]);

const MODEL_EXTENSIONS = new Map<string, string>([
  ['.glb', 'model/gltf-binary'],
  ['.gltf', 'model/gltf+json'],
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_MODEL_BYTES = 25 * 1024 * 1024;

export function resolveGridFSBucketKey(rawBucket?: string): GridFSBucketKey {
  const normalized = String(rawBucket || '').trim();
  if (normalized === 'categoryImages' || normalized === 'category-images') {
    return 'categoryImages';
  }
  if (normalized === 'websiteImages' || normalized === 'website-assets') {
    return 'websiteImages';
  }
  return 'productImages';
}

export function validateBinarySignature(
  ext: string,
  buffer: Buffer
): { ok: boolean; error?: string } {
  if (buffer.length < 4) {
    return { ok: false, error: 'Uploaded file is empty or corrupted.' };
  }
  if (ext === '.jpg' || ext === '.jpeg') {
    if (!(buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff)) {
      return { ok: false, error: 'File content does not match a valid JPEG image.' };
    }
    return { ok: true };
  }
  if (ext === '.png') {
    if (
      !(
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
      )
    ) {
      return { ok: false, error: 'File content does not match a valid PNG image.' };
    }
    return { ok: true };
  }
  if (ext === '.webp') {
    if (
      buffer.length < 12 ||
      buffer.subarray(0, 4).toString('ascii') !== 'RIFF' ||
      buffer.subarray(8, 12).toString('ascii') !== 'WEBP'
    ) {
      return { ok: false, error: 'File content does not match a valid WebP image.' };
    }
    return { ok: true };
  }
  if (ext === '.glb') {
    if (buffer.subarray(0, 4).toString('ascii') !== 'glTF') {
      return { ok: false, error: 'File content does not match a valid GLB 3D model.' };
    }
    return { ok: true };
  }
  if (ext === '.gltf') {
    try {
      const parsed = JSON.parse(buffer.toString('utf8'));
      if (!parsed || typeof parsed !== 'object') {
        return { ok: false, error: 'Invalid GLTF JSON file.' };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: 'Invalid GLTF JSON file.' };
    }
  }
  return { ok: false, error: 'Unsupported file format.' };
}

export async function uploadBufferToGridFS(params: {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  bucket: GridFSBucketKey;
  refType?: 'product' | 'category' | 'collection' | 'website';
  refId?: string;
  imageType?: 'primary' | 'gallery' | 'thumbnail' | 'asset';
  displayOrder?: number;
  active?: boolean;
  deduplicateBySha256?: boolean;
}): Promise<UploadedAssetResult | null> {
  if (!isMongoConfigured()) return null;
  await ensureMongoIndexes();
  const buckets = await getGridFSBuckets();
  const cols = await getMongoCollections();
  if (!buckets || !cols) return null;

  const sha256 = crypto.createHash('sha256').update(params.buffer).digest('hex');
  if (params.deduplicateBySha256 !== false) {
    const existing = await cols.productImages.findOne({
      sha256,
      bucket: params.bucket,
      active: { $ne: false },
    });
    if (existing?.gridfsFileId) {
      const idStr = String(existing.gridfsFileId);
      const versionTag = String(existing.versionTag || Date.now());
      return {
        id: idStr,
        imageId: idStr,
        url: `/api/images/${idStr}?v=${versionTag}`,
        bucket: params.bucket,
        storagePath: `gridfs://${params.bucket}/${idStr}`,
        mimeType: String(existing.mimeType || params.mimeType),
        sizeBytes: Number(existing.sizeBytes || params.buffer.length),
        versionTag,
        sha256,
        storageMode: 'mongodb-gridfs',
        permanentCloud: true,
      };
    }
  }

  const versionTag = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const refType = params.refType || 'website';
  const refId = params.refId || '';
  const imageType = params.imageType || 'gallery';
  const displayOrder = Number(params.displayOrder ?? 0);
  const active = params.active !== false;
  const uploadedAt = new Date().toISOString();

  const bucketInstance = buckets[params.bucket];
  const fileId = await new Promise<ObjectId>((resolve, reject) => {
    const uploadStream = bucketInstance.openUploadStream(params.filename, {
      metadata: {
        bucket: params.bucket,
        mimeType: params.mimeType,
        sizeBytes: params.buffer.length,
        refType,
        refId,
        imageType,
        displayOrder,
        active,
        sha256,
        versionTag,
        uploadedAt,
      },
    });
    uploadStream.on('error', reject);
    uploadStream.on('finish', () => resolve(uploadStream.id as ObjectId));
    uploadStream.end(params.buffer);
  });

  const fileIdStr = fileId.toHexString();
  const url = `/api/images/${fileIdStr}?v=${versionTag}`;

  await cols.productImages.updateOne(
    { gridfsFileId: fileIdStr },
    {
      $set: {
        id: fileIdStr,
        gridfsFileId: fileIdStr,
        bucket: params.bucket,
        filename: params.filename,
        mimeType: params.mimeType,
        sizeBytes: params.buffer.length,
        refType,
        refId,
        imageType,
        displayOrder,
        active,
        sha256,
        versionTag,
        uploadedAt,
        url,
      },
    },
    { upsert: true }
  );

  return {
    id: fileIdStr,
    imageId: fileIdStr,
    url,
    bucket: params.bucket,
    storagePath: `gridfs://${params.bucket}/${fileIdStr}`,
    mimeType: params.mimeType,
    sizeBytes: params.buffer.length,
    versionTag,
    sha256,
    storageMode: 'mongodb-gridfs',
    permanentCloud: true,
  };
}

export async function uploadAssetToPermanentStorage(params: {
  filename: string;
  dataUrl: string;
  bucket?: string;
  folder?: string;
  refType?: 'product' | 'category' | 'collection' | 'website';
  refId?: string;
  imageType?: 'primary' | 'gallery' | 'thumbnail' | 'asset';
  displayOrder?: number;
  localUploadsDir: string;
  isVercel: boolean;
}): Promise<{ ok: true; asset: UploadedAssetResult } | { ok: false; status: number; error: string }> {
  const rawName = path.basename(String(params.filename || '').trim());
  const ext = path.extname(rawName).toLowerCase();
  const isImage = IMAGE_EXTENSIONS.has(ext);
  const isModel = MODEL_EXTENSIONS.has(ext);

  if (!isImage && !isModel) {
    return {
      ok: false,
      status: 400,
      error: 'Unsupported file type. Allowed images: JPEG, PNG, WebP (or GLB/GLTF 3D models).',
    };
  }

  const base64Match = String(params.dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);
  if (!base64Match) {
    return { ok: false, status: 400, error: 'Invalid base64 upload payload.' };
  }

  const buffer = Buffer.from(base64Match[2], 'base64');
  const maxBytes = isModel ? MAX_MODEL_BYTES : MAX_IMAGE_BYTES;
  if (buffer.length > maxBytes) {
    return {
      ok: false,
      status: 413,
      error: `File exceeds ${isModel ? '25 MB' : '5 MB'} upload limit.`,
    };
  }

  const sigCheck = validateBinarySignature(ext, buffer);
  if (!sigCheck.ok) {
    return { ok: false, status: 400, error: sigCheck.error || 'Invalid image payload.' };
  }

  const mimeType =
    IMAGE_EXTENSIONS.get(ext) || MODEL_EXTENSIONS.get(ext) || 'application/octet-stream';
  const targetBucket: StorageBucketKey = isModel
    ? 'websiteImages'
    : resolveGridFSBucketKey(params.bucket);

  const safeSlug =
    path
      .basename(rawName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 64) || 'asset';
  const safeName = `${safeSlug}${ext}`;

  if (isMongoConfigured()) {
    try {
      const uploaded = await uploadBufferToGridFS({
        buffer,
        filename: safeName,
        mimeType,
        bucket: targetBucket,
        refType: params.refType || (targetBucket === 'categoryImages' ? 'category' : targetBucket === 'productImages' ? 'product' : 'website'),
        refId: params.refId || '',
        imageType: params.imageType || 'gallery',
        displayOrder: params.displayOrder ?? 0,
        active: true,
        deduplicateBySha256: false,
      });
      if (!uploaded) {
        return { ok: false, status: 502, error: 'MongoDB GridFS storage unavailable.' };
      }
      return { ok: true, asset: uploaded };
    } catch (err) {
      return {
        ok: false,
        status: 502,
        error:
          err instanceof Error
            ? `MongoDB GridFS upload failed: ${err.message}`
            : 'MongoDB GridFS upload failed.',
      };
    }
  }

  // Never pretend ephemeral Vercel disk writes are permanent GridFS storage
  if (params.isVercel) {
    return {
      ok: false,
      status: 503,
      error:
        'MONGODB_URI is not configured in Vercel environment variables. Configure MongoDB Atlas + GridFS so uploaded images persist permanently.',
    };
  }

  const versionTag = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const safeLocalName = `${versionTag}-${safeSlug}${ext}`;
  const resolvedBase = path.resolve(params.localUploadsDir);
  const resolvedTarget = path.resolve(resolvedBase, safeLocalName);
  if (!resolvedTarget.startsWith(resolvedBase + path.sep)) {
    return { ok: false, status: 400, error: 'Invalid upload path.' };
  }
  fs.mkdirSync(resolvedBase, { recursive: true });
  fs.writeFileSync(resolvedTarget, buffer);

  return {
    ok: true,
    asset: {
      url: `/uploads/${safeLocalName}`,
      bucket: targetBucket,
      storagePath: `uploads/${safeLocalName}`,
      mimeType,
      sizeBytes: buffer.length,
      versionTag,
      storageMode: 'local-dev-disk',
      permanentCloud: false,
      warning:
        'Saved to local development disk only. Configure MONGODB_URI for permanent MongoDB GridFS storage.',
    },
  };
}

export async function findGridFSImageForStreaming(imageId: string): Promise<{
  bucketInstance: GridFSBucket;
  fileId: ObjectId;
  mimeType: string;
  sizeBytes: number;
  filename: string;
  active: boolean;
  refType: string;
  refId: string;
  etag: string;
} | null> {
  if (!isMongoConfigured() || !ObjectId.isValid(imageId)) return null;
  const objectId = new ObjectId(imageId);
  const buckets = await getGridFSBuckets();
  const cols = await getMongoCollections();
  if (!buckets || !cols) return null;

  const metaDoc = await cols.productImages.findOne({ gridfsFileId: imageId });
  const bucketOrder: GridFSBucketKey[] = metaDoc?.bucket
    ? [resolveGridFSBucketKey(String(metaDoc.bucket)), 'productImages', 'categoryImages', 'websiteImages']
    : ['productImages', 'categoryImages', 'websiteImages'];

  const seen = new Set<GridFSBucketKey>();
  for (const key of bucketOrder) {
    if (seen.has(key)) continue;
    seen.add(key);
    const bucket = buckets[key];
    const files = await bucket.find({ _id: objectId }).limit(1).toArray();
    if (files.length > 0) {
      const f = files[0];
      const fMeta = (f.metadata || {}) as Record<string, unknown>;
      return {
        bucketInstance: bucket,
        fileId: objectId,
        mimeType: String(metaDoc?.mimeType || fMeta.mimeType || 'application/octet-stream'),
        sizeBytes: Number(f.length || metaDoc?.sizeBytes || 0),
        filename: String(f.filename || 'image'),
        active: metaDoc ? metaDoc.active !== false : fMeta.active !== false,
        refType: String(metaDoc?.refType || fMeta.refType || 'website'),
        refId: String(metaDoc?.refId || fMeta.refId || ''),
        etag: `"${String(metaDoc?.sha256 || imageId)}"`,
      };
    }
  }
  return null;
}

export async function listGridFSImages(limit = 200): Promise<GridFSImageRecord[]> {
  if (!isMongoConfigured()) return [];
  const cols = await getMongoCollections();
  if (!cols) return [];
  const docs = await cols.productImages
    .find({})
    .sort({ uploadedAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map((d) => ({
    id: String(d.gridfsFileId || d.id || ''),
    gridfsFileId: String(d.gridfsFileId || ''),
    bucket: resolveGridFSBucketKey(String(d.bucket || 'productImages')),
    filename: String(d.filename || ''),
    mimeType: String(d.mimeType || 'image/jpeg'),
    sizeBytes: Number(d.sizeBytes || 0),
    refType: String(d.refType || 'website'),
    refId: String(d.refId || ''),
    imageType: String(d.imageType || 'gallery'),
    displayOrder: Number(d.displayOrder || 0),
    active: d.active !== false,
    sha256: String(d.sha256 || ''),
    uploadedAt: String(d.uploadedAt || ''),
    url: String(d.url || `/api/images/${d.gridfsFileId}`),
  }));
}

export async function deleteGridFSImageSafely(params: {
  imageId: string;
  products: Array<{ id: string; images?: string[]; image?: string }>;
  categories: Array<{ id: string; image?: string; bannerUrl?: string }>;
  collectionGroups: Array<Array<{ id: string; image?: string }>>;
}): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  if (!isMongoConfigured()) {
    return { ok: false, status: 503, error: 'MongoDB is not configured.' };
  }
  if (!ObjectId.isValid(params.imageId)) {
    return { ok: false, status: 400, error: 'Invalid GridFS image ID.' };
  }

  const refPrefix = `/api/images/${params.imageId}`;
  const referencingProducts = params.products.filter(
    (p) =>
      (p.images || []).some((u) => u.includes(refPrefix)) ||
      (p.image && p.image.includes(refPrefix))
  );
  const referencingCategories = params.categories.filter(
    (c) => (c.image && c.image.includes(refPrefix)) || (c.bannerUrl && c.bannerUrl.includes(refPrefix))
  );
  const referencingCollections = params.collectionGroups
    .flat()
    .filter((c) => c.image && c.image.includes(refPrefix));

  const totalRefs =
    referencingProducts.length + referencingCategories.length + referencingCollections.length;

  if (totalRefs > 0) {
    return {
      ok: false,
      status: 409,
      error: `Cannot delete shared image: currently referenced by ${totalRefs} catalog record(s). Unlink it first.`,
    };
  }

  const buckets = await getGridFSBuckets();
  const cols = await getMongoCollections();
  const db = await getMongoDb();
  if (!buckets || !cols || !db) {
    return { ok: false, status: 503, error: 'MongoDB is unavailable.' };
  }

  const meta = await cols.productImages.findOne({ gridfsFileId: params.imageId });
  const targetBucket = resolveGridFSBucketKey(String(meta?.bucket || 'productImages'));
  const oid = new ObjectId(params.imageId);
  try {
    await buckets[targetBucket].delete(oid);
  } catch {
    // Fallback check across all 3 buckets if bucket hint didn't match
    for (const k of ['productImages', 'categoryImages', 'websiteImages'] as GridFSBucketKey[]) {
      try {
        await buckets[k].delete(oid);
      } catch {
        // ignore non-existent bucket entry
      }
    }
  }
  await cols.productImages.deleteOne({ gridfsFileId: params.imageId });
  return { ok: true };
}
