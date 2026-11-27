import fs from 'fs';
import path from 'path';
import { isValidLocalImageHeader } from './mediaAudit.ts';

function walkFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkFiles(full));
    else results.push(full);
  }
  return results;
}

const SLUG_DISK_OVERRIDES: Record<string, string> = {
  // Furniture real product images on disk under /images/products/furniture/
  'three-seater-sofa': '/images/products/furniture/three-seater-sofa.webp',
  'wardrobe': '/images/products/furniture/wooden-wardrobe.webp',
  'bookshelf': '/images/products/furniture/open-bookshelf.webp',
  'shoe-rack': '/images/products/furniture/entryway-shoe-rack.webp',
  'bedside-table': '/images/products/furniture/wood-bedside-table.webp',
  'dining-table-4-seater': '/images/products/furniture/wooden-dining-table.webp',
  'dining-table-6-seater': '/images/products/furniture/wooden-dining-table.webp',
  'queen-size-bed': '/images/products/furniture/queen-platform-bed.webp',
  // Dried Peas & Nuts verified disk files
  'split-yellow-peas': '/images/products/dried-peas/split-yellow-peas.webp',
  'peanuts': '/images/nuts/red-skin-peanuts.jpg',
  // Fitness & Gym verified disk files
  'dumbbells': '/images/products/fitness/hex-rubber-dumbbells.webp',
  'adjustable-dumbbells': '/images/products/fitness/hex-rubber-dumbbells.webp',
  'kettlebells': '/images/product_fitness_kettlebell_1793868611953.jpg',
  'gym-gloves': '/images/products/fitness/padded-gym-gloves.webp',
  'yoga-mat': '/images/products/fitness/neoprene-workout-mat.webp',
  'resistance-bands': '/images/products/fitness/resistance-loop-bands.webp',
  'skipping-rope': '/images/products/fitness/speed-skipping-rope.webp',
  'gym-bag': '/images/products/fitness/gym-duffel-bag.webp',
  // Footwear verified disk files
  'mens-sneakers': '/images/products/footwear/mens-casual-sneakers.webp',
  'mens-casual-shoes': '/images/products/footwear/casual-slipon-sneakers.webp',
  'mens-sandals': '/images/products/footwear/mens-sport-sandals.webp',
  'womens-heels': '/images/products/footwear/womens-block-heels.webp',
  'womens-flats': '/images/products/footwear/womens-ballet-flats.webp',
  'womens-sneakers': '/images/products/footwear/womens-running-sneakers.webp',
  'womens-sports-shoes': '/images/products/footwear/womens-running-sneakers.webp',
  // Pranks & Novelties verified disk files
  'fake-mustaches': '/images/products/pranks/funny-disguise-glasses.webp',
  'funny-glasses': '/images/products/pranks/funny-disguise-glasses.webp',
  'magic-trick-set': '/images/products/pranks/party-magic-box.webp',
  // Teenagers verified disk files
  'boys-jeans': '/images/products/kids/kids-boys-jeans.webp',
  'girls-tops': '/images/kids/girls-clothing/girls-tops.jpg',
  'girls-tshirts': '/images/kids/girls-clothing/girls-tshirts.jpg',
  'girls-dresses': '/images/products/teenagers/teen-casual-dress.webp',
  'school-backpacks': '/images/products/teenagers/teen-college-backpack.webp',
  'desk-organizers': '/images/products/teenagers/teen-desk-organizer.webp',
  'bluetooth-headphones': '/images/products/teenagers/teen-wireless-headphones.webp',
  'casual-watches': '/images/products/teenagers/teen-minimal-watch.webp',
  // Electronics verified disk files
  'phone-cases': '/images/accessories/mobile-accessories/decorative-phone-cases.jpg',
};

export function repairCollectionRegistryImages<T extends Record<string, unknown>>(
  categoryLabel: string,
  items: T[]
): { items: T[]; repairedCount: number } {
  const publicDir = path.resolve(process.cwd(), 'public');
  const publicImagesDir = path.join(publicDir, 'images');
  const diskImages = walkFiles(publicImagesDir).filter((f) => isValidLocalImageHeader(f));

  const basenameMap = new Map<string, string>();
  for (const absPath of diskImages) {
    const rel = '/' + path.relative(publicDir, absPath).replace(/\\/g, '/');
    const stem = path.basename(absPath, path.extname(absPath)).toLowerCase();
    if (!basenameMap.has(stem)) {
      basenameMap.set(stem, rel);
    }
  }

  let repairedCount = 0;

  const updated = items.map((raw) => {
    const currentImg = String(raw.image || '').trim();
    const expected = String(raw.expectedFilename || '').trim();
    const slug = String(raw.slug || '').trim().toLowerCase();

    // Check if current image already points to a valid local image or GridFS URL or remote HTTPS image
    if (currentImg.startsWith('/api/images/')) {
      return raw;
    }
    if (currentImg.startsWith('/images/')) {
      const absCurrent = path.resolve(publicDir, currentImg.replace(/^\/+/, ''));
      if (fs.existsSync(absCurrent) && isValidLocalImageHeader(absCurrent)) {
        return raw;
      }
    }
    if (currentImg.startsWith('/uploads/')) {
      const absUpload = path.resolve(publicDir, currentImg.replace(/^\/+/, ''));
      if (fs.existsSync(absUpload) && isValidLocalImageHeader(absUpload)) {
        return raw;
      }
    }

    // Attempt deterministic root-cause repair using exact path variants / validated disk matches
    let candidateRel: string | null = null;

    // 1. Check wrong extension on expectedFilename (e.g. .jpg when .png/.webp exists on disk)
    if (expected) {
      const categoryFolder = categoryLabel
        .toLowerCase()
        .replace(/'/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const baseNoExt = expected.replace(/\.[^.]+$/, '');
      for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
        const tryDirect = path.join(publicImagesDir, categoryFolder, baseNoExt + ext);
        if (fs.existsSync(tryDirect) && isValidLocalImageHeader(tryDirect)) {
          candidateRel = '/' + path.relative(publicDir, tryDirect).replace(/\\/g, '/');
          break;
        }
        const tryExpected = path.join(publicImagesDir, baseNoExt + ext);
        if (fs.existsSync(tryExpected) && isValidLocalImageHeader(tryExpected)) {
          candidateRel = '/' + path.relative(publicDir, tryExpected).replace(/\\/g, '/');
          break;
        }
      }
    }

    // 2. Check explicit verified override mapping (only if the file actually exists & passes magic-byte check)
    if (!candidateRel && slug && SLUG_DISK_OVERRIDES[slug]) {
      const overrideRel = SLUG_DISK_OVERRIDES[slug].replace(/\.web$/, '.webp');
      const absOverride = path.resolve(publicDir, overrideRel.replace(/^\/+/, ''));
      if (fs.existsSync(absOverride) && isValidLocalImageHeader(absOverride)) {
        candidateRel = overrideRel;
      }
    }

    // 3. Check exact basename stem match anywhere in public/images (only if category or product folder matches safely)
    if (!candidateRel && slug && basenameMap.has(slug)) {
      const hitRel = basenameMap.get(slug)!;
      const absHit = path.resolve(publicDir, hitRel.replace(/^\/+/, ''));
      if (fs.existsSync(absHit) && isValidLocalImageHeader(absHit)) {
        candidateRel = hitRel;
      }
    }

    if (candidateRel) {
      repairedCount += 1;
      return {
        ...raw,
        image: candidateRel,
        imageStatus: 'generated',
      };
    }

    return raw;
  });

  return { items: updated, repairedCount };
}
