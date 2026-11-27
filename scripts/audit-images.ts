import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { auditLocalCatalogImages } from '../server/mediaAudit.ts';
import { repairCollectionRegistryImages } from '../server/imageRepair.ts';
import { isMongoConfigured, verifyMongoConnectivity } from '../server/mongo.ts';
import { generate48Products } from '../server/catalogSeed.ts';
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
import { INITIAL_RICE_COLLECTIONS } from '../src/data/riceCollections.ts';

async function main() {
  const products = generate48Products();

  const rawGroups: Array<{ category: string; items: Array<Record<string, unknown>> }> = [
    { category: "Men's Fashion", items: INITIAL_MENS_FASHION_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: "Women's Fashion", items: INITIAL_WOMENS_FASHION_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Electronics', items: INITIAL_ELECTRONICS_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Dried Fruits', items: INITIAL_DRIED_FRUITS_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Nuts', items: INITIAL_NUTS_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Skin Care', items: INITIAL_SKIN_CARE_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Hair Care', items: INITIAL_HAIR_CARE_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Furniture', items: INITIAL_FURNITURE_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Dried Peas', items: INITIAL_DRIED_PEAS_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Pranks & Novelties', items: INITIAL_PRANKS_NOVELTIES_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Fitness & Gym', items: INITIAL_FITNESS_GYM_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Accessories', items: INITIAL_ACCESSORIES_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Sports', items: INITIAL_SPORTS_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Footwear', items: INITIAL_FOOTWEAR_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Teenagers', items: INITIAL_TEENAGERS_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Kids', items: INITIAL_KIDS_COLLECTIONS as unknown as Array<Record<string, unknown>> },
    { category: 'Rice', items: INITIAL_RICE_COLLECTIONS as unknown as Array<Record<string, unknown>> },
  ];

  let totalRepaired = 0;
  const repairedGroups = rawGroups.map((g) => {
    const res = repairCollectionRegistryImages(g.category, g.items);
    totalRepaired += res.repairedCount;
    return {
      category: g.category,
      items: res.items as unknown as Array<{
        id: string;
        name: string;
        slug: string;
        image?: string;
        expectedFilename?: string;
        imageStatus?: string;
        parentGroup?: string;
        parentCategory?: string;
        varietyGroup?: string;
      }>,
    };
  });

  let gridfsImagesCount = 0;
  if (isMongoConfigured()) {
    const status = await verifyMongoConnectivity();
    gridfsImagesCount = status.gridfsImagesCount;
  }

  const summary = auditLocalCatalogImages({
    products,
    collectionGroups: repairedGroups,
    storageBucketsConfigured: isMongoConfigured(),
    uploadsDir: path.resolve(process.cwd(), 'public', 'uploads'),
    gridfsImagesCount,
  });

  const byCategory: Record<string, number> = {};
  for (const item of summary.collectionsWithMissingImages) {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
  }

  const outPath = path.resolve(process.cwd(), 'data', 'image-audit-report.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        repairedPathsCount: totalRepaired,
        byCategory,
        ...summary,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log('KubreeBazzar Image Audit Complete');
  console.log(`- public/images files: ${summary.publicImagesCount}`);
  console.log(`- src/assets files: ${summary.srcAssetsCount}`);
  console.log(`- GridFS stored images: ${gridfsImagesCount}`);
  console.log(`- repaired path mappings from disk: ${totalRepaired}`);
  console.log(`- broken product refs: ${summary.brokenProductRefs.length}`);
  console.log(`- collections missing images: ${summary.collectionsWithMissingImages.length}`);
  console.log('- missing breakdown by category:', byCategory);
  console.log(`- report written to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
