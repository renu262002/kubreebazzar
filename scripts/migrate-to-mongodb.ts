import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  getMongoClient,
  isMongoConfigured,
  verifyMongoConnectivity,
  type GridFSBucketKey,
} from '../server/mongo.ts';
import { uploadBufferToGridFS } from '../server/gridfsStorage.ts';
import { isValidLocalImageHeader } from '../server/mediaAudit.ts';
import { repairCollectionRegistryImages } from '../server/imageRepair.ts';
import {
  syncCategoryToMongo,
  syncCollectionToMongo,
  syncProductToMongo,
} from '../server/mongoSync.ts';
import { INITIAL_CATEGORIES, generate48Products } from '../server/catalogSeed.ts';
import { INITIAL_MENS_FASHION_COLLECTIONS } from '../src/data/mensFashionCollections.ts';
import { INITIAL_WOMENS_FASHION_COLLECTIONS } from '../src/data/womensFashionCollections.ts';
import { INITIAL_ELECTRONICS_COLLECTIONS } from '../src/data/electronicsCollections.ts';
import { INITIAL_DRIED_FRUITS_COLLECTIONS } from '../src/data/driedFruitsCollections.ts';
import { INITIAL_NUTS_COLLECTIONS } from '../src/data/nutsCollections.ts';
import { INITIAL_SKIN_CARE_COLLECTIONS } from '../src/data/skinCareCollections.ts';
import { INITIAL_HAIR_CARE_COLLECTIONS } from '../src/data/hairCareCollections.ts';
import { INITIAL_FURNITURE_COLLECTIONS } from '../src/data/furnitureCollections.ts';
import { INITIAL_DRIED_PEAS_COLLECTIONS } from '../src/data/driedPeasCollections.ts';
import { INITIAL_PRANKS_NOVELTIES_COLLECTIONS } from '../src/data/pranksNoveltiesCollections.ts';
import { INITIAL_FITNESS_GYM_COLLECTIONS } from '../src/data/fitnessGymCollections.ts';
import { INITIAL_ACCESSORIES_COLLECTIONS } from '../src/data/accessoriesCollections.ts';
import { INITIAL_SPORTS_COLLECTIONS } from '../src/data/sportsCollections.ts';
import { INITIAL_FOOTWEAR_COLLECTIONS } from '../src/data/footwearCollections.ts';
import { INITIAL_TEENAGERS_COLLECTIONS } from '../src/data/teenagersCollections.ts';
import { INITIAL_KIDS_COLLECTIONS } from '../src/data/kidsCollections.ts';

function walkDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else results.push(full);
  }
  return results;
}

function getMimeFromExt(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  return 'image/jpeg';
}

function chooseBucket(relPath: string): GridFSBucketKey {
  const normalized = relPath.replace(/\\/g, '/').toLowerCase();
  if (normalized.startsWith('categories/')) return 'categoryImages';
  if (
    normalized.startsWith('hero_') ||
    normalized.startsWith('banner') ||
    normalized.startsWith('mascot') ||
    normalized.includes('logo')
  ) {
    return 'websiteImages';
  }
  return 'productImages';
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (!isMongoConfigured() && !dryRun) {
    console.error(
      'ERROR: MONGODB_URI must be configured in your environment before running live migration. Use --dry-run to inspect the migration plan.'
    );
    process.exit(1);
  }

  const publicImagesRoot = path.resolve(process.cwd(), 'public', 'images');
  const allLocalImages = walkDir(publicImagesRoot);
  const validImages: Array<{
    diskPath: string;
    relativeUrl: string;
    bucket: GridFSBucketKey;
    mimeType: string;
    sha256: string;
    sizeBytes: number;
  }> = [];
  const skippedInvalid: string[] = [];

  for (const full of allLocalImages) {
    const rel = path.relative(publicImagesRoot, full).replace(/\\/g, '/');
    if (!isValidLocalImageHeader(full)) {
      skippedInvalid.push(`/images/${rel}`);
      continue;
    }
    const buf = fs.readFileSync(full);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    validImages.push({
      diskPath: full,
      relativeUrl: `/images/${rel}`,
      bucket: chooseBucket(rel),
      mimeType: getMimeFromExt(full),
      sha256,
      sizeBytes: buf.length,
    });
  }

  const categories = INITIAL_CATEGORIES;
  const products = generate48Products();
  const collectionMap: Array<[string, Array<Record<string, unknown>>]> = [
    ["Men's Fashion", INITIAL_MENS_FASHION_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ["Women's Fashion", INITIAL_WOMENS_FASHION_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Electronics', INITIAL_ELECTRONICS_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Dried Fruits', INITIAL_DRIED_FRUITS_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Nuts', INITIAL_NUTS_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Skin Care', INITIAL_SKIN_CARE_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Hair Care', INITIAL_HAIR_CARE_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Furniture', INITIAL_FURNITURE_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Dried Peas', INITIAL_DRIED_PEAS_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Pranks & Novelties', INITIAL_PRANKS_NOVELTIES_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Fitness & Gym', INITIAL_FITNESS_GYM_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Accessories', INITIAL_ACCESSORIES_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Sports', INITIAL_SPORTS_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Footwear', INITIAL_FOOTWEAR_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Teenagers', INITIAL_TEENAGERS_COLLECTIONS as unknown as Array<Record<string, unknown>>],
    ['Kids', INITIAL_KIDS_COLLECTIONS as unknown as Array<Record<string, unknown>>],
  ];

  let repairedCount = 0;
  const repairedCollectionMap = collectionMap.map(([label, items]) => {
    const res = repairCollectionRegistryImages(label, items);
    repairedCount += res.repairedCount;
    return [label, res.items] as [string, Array<Record<string, unknown>>];
  });

  if (dryRun) {
    console.log('DRY RUN — KubreeBazzar MongoDB + GridFS Migration Plan');
    console.log(`- MONGODB_URI configured: ${isMongoConfigured()}`);
    console.log(`- Valid local images ready for GridFS upload: ${validImages.length}`);
    console.log(`- Skipped invalid images: ${skippedInvalid.length}`);
    console.log(`- Collection paths repaired from disk: ${repairedCount}`);
    console.log(`- Categories to upsert: ${categories.length}`);
    console.log(`- Products to upsert: ${products.length}`);
    console.log(
      `- Collections to upsert: ${repairedCollectionMap.reduce((sum, [, arr]) => sum + arr.length, 0)}`
    );
    return;
  }

  const conn = await verifyMongoConnectivity();
  if (!conn.connected) {
    console.error(`ERROR: Unable to connect to MongoDB Atlas: ${conn.error}`);
    process.exit(1);
  }

  const urlRewriteMap = new Map<string, string>();
  const uploaded: Array<{ relativeUrl: string; gridfsUrl: string; bucket: string }> = [];
  const failedUploads: Array<{ path: string; error: string }> = [];

  for (const item of validImages) {
    try {
      const buf = fs.readFileSync(item.diskPath);
      const res = await uploadBufferToGridFS({
        buffer: buf,
        filename: path.basename(item.diskPath),
        mimeType: item.mimeType,
        bucket: item.bucket,
        refType: item.bucket === 'categoryImages' ? 'category' : item.bucket === 'productImages' ? 'product' : 'website',
        refId: item.relativeUrl,
        imageType: 'gallery',
        active: true,
        deduplicateBySha256: true,
      });
      if (res?.url) {
        urlRewriteMap.set(item.relativeUrl, res.url);
        uploaded.push({
          relativeUrl: item.relativeUrl,
          gridfsUrl: res.url,
          bucket: item.bucket,
        });
      }
    } catch (err) {
      failedUploads.push({
        path: item.relativeUrl,
        error: err instanceof Error ? err.message : 'GridFS upload failed',
      });
    }
  }

  for (const cat of categories) {
    await syncCategoryToMongo({
      ...cat,
      image: (cat.image && urlRewriteMap.get(cat.image)) || cat.image,
    });
  }

  for (const prod of products) {
    await syncProductToMongo({
      ...prod,
      images: (prod.images || []).map((img) => urlRewriteMap.get(img) || img),
    });
  }

  for (const [label, items] of repairedCollectionMap) {
    for (const raw of items) {
      const origImg = String(raw.image || '');
      const rewritten = urlRewriteMap.get(origImg) || origImg;
      await syncCollectionToMongo(label, {
        ...raw,
        image: rewritten,
        ...(rewritten.startsWith('/api/images/') ? { imageStatus: 'uploaded' } : {}),
      });
    }
  }

  const reportPath = path.resolve(process.cwd(), 'data', 'mongodb-migration-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        migratedAt: new Date().toISOString(),
        databaseName: conn.databaseName,
        uploadedCount: uploaded.length,
        repairedCollectionPaths: repairedCount,
        failedUploads,
        skippedInvalid,
        categoriesSynced: categories.length,
        productsSynced: products.length,
      },
      null,
      2
    ),
    'utf8'
  );
  console.log(`MongoDB + GridFS migration complete! Report saved to ${reportPath}`);

  const client = await getMongoClient();
  if (client) await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
