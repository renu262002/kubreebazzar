import type {
  Product,
  SkinCareCollection,
  SkinCareGroupName,
} from '../types';

export interface SkinCareGroupMeta {
  name: SkinCareGroupName;
  slug: string;
  folder: string;
  description: string;
}

export const SKIN_CARE_GROUPS: SkinCareGroupMeta[] = [
  {
    name: 'Face Wash & Cleansers',
    slug: 'face-wash-cleansers',
    folder: 'face-wash-cleansers',
    description:
      'Daily facial washes, transparent gel cleansers, foaming pumps, cleansing milks, and micellar waters.',
  },
  {
    name: 'Moisturizers & Creams',
    slug: 'moisturizers-creams',
    folder: 'moisturizers-creams',
    description:
      'Hydrating face moisturizers, day creams, night creams, cooling face gels, and nourishing body creams.',
  },
  {
    name: 'Sunscreen',
    slug: 'sunscreen',
    folder: 'sunscreen',
    description:
      'Daily sun protection collections across SPF 30, SPF 50, lightweight gels, and pump lotions.',
  },
  {
    name: 'Serums & Treatments',
    slug: 'serums-treatments',
    folder: 'serums-treatments',
    description:
      'Concentrated facial serums including Vitamin C, Niacinamide, Hyaluronic Acid, and Retinol formulations.',
  },
  {
    name: 'Body Care',
    slug: 'body-care',
    folder: 'body-care',
    description:
      'Everyday body care essentials covering pump lotions, refreshing washes, sugar scrubs, and rich butters.',
  },
  {
    name: 'Lip Care',
    slug: 'lip-care',
    folder: 'lip-care',
    description:
      'Conditioning lip balm sticks, gentle exfoliating lip scrubs, and overnight lip masks.',
  },
  {
    name: 'Face Masks & Exfoliators',
    slug: 'face-masks-exfoliators',
    folder: 'face-masks-exfoliators',
    description:
      'Kaolin clay masks, hydrating cotton sheet masks, face scrubs, exfoliating toners, and facial peels.',
  },
];

interface SeedInput {
  name: string;
  slug: string;
  parentGroup: SkinCareGroupName;
  expectedFilename: string;
  image?: string;
  description: string;
  keywords: string[];
}

const GROUP_BY_NAME = new Map(SKIN_CARE_GROUPS.map((g) => [g.name, g]));

const RAW_SKIN_CARE_COLLECTIONS: SeedInput[] = [
  // GROUP 1 — FACE WASH & CLEANSERS
  {
    name: 'Face Wash',
    slug: 'face-wash',
    parentGroup: 'Face Wash & Cleansers',
    expectedFilename: 'face-wash-cleansers/face-wash.jpg',
    image: '/images/skin-care/face-wash-cleansers/face-wash.jpg',
    description:
      'Everyday tube facial wash formulated to lift surface oil, dust, and daily impurities while keeping skin balanced.',
    keywords: ['face wash', 'facial wash', 'daily face wash'],
  },
  {
    name: 'Gel Cleanser',
    slug: 'gel-cleanser',
    parentGroup: 'Face Wash & Cleansers',
    expectedFilename: 'face-wash-cleansers/gel-cleanser.jpg',
    image: '/images/skin-care/face-wash-cleansers/gel-cleanser.jpg',
    description:
      'Clear water-based gel facial cleanser that removes excess sebum and leaves a clean, refreshed finish.',
    keywords: ['gel cleanser', 'facial cleanser', 'clear cleanser'],
  },
  {
    name: 'Foam Cleanser',
    slug: 'foam-cleanser',
    parentGroup: 'Face Wash & Cleansers',
    expectedFilename: 'face-wash-cleansers/foam-cleanser.jpg',
    image: '/images/skin-care/face-wash-cleansers/foam-cleanser.jpg',
    description:
      'Airy self-foaming pump cleanser delivering soft whipped lather for gentle morning and evening washing.',
    keywords: ['foam cleanser', 'foaming cleanser', 'cleansing foam'],
  },
  {
    name: 'Cleansing Milk',
    slug: 'cleansing-milk',
    parentGroup: 'Face Wash & Cleansers',
    expectedFilename: 'face-wash-cleansers/cleansing-milk.jpg',
    image: '/images/skin-care/face-wash-cleansers/cleansing-milk.jpg',
    description:
      'Creamy lotion-textured cleansing milk designed to dissolve light makeup and grime without tightness.',
    keywords: ['cleansing milk', 'milk cleanser', 'lotion cleanser'],
  },
  {
    name: 'Micellar Water',
    slug: 'micellar-water',
    parentGroup: 'Face Wash & Cleansers',
    expectedFilename: 'face-wash-cleansers/micellar-water.jpg',
    image: '/images/skin-care/face-wash-cleansers/micellar-water.jpg',
    description:
      'Clear no-rinse micellar cleansing water ideal for sweeping away daily sunscreen, residue, and city dust.',
    keywords: ['micellar water', 'micellar cleanser', 'cleansing water'],
  },

  // GROUP 2 — MOISTURIZERS & CREAMS
  {
    name: 'Face Moisturizer',
    slug: 'face-moisturizer',
    parentGroup: 'Moisturizers & Creams',
    expectedFilename: 'moisturizers-creams/face-moisturizer.jpg',
    image: '/images/skin-care/moisturizers-creams/face-moisturizer.jpg',
    description:
      'Soft daily facial moisturizing cream crafted for lasting hydration and comfortable skin barrier support.',
    keywords: ['face moisturizer', 'moisturizer', 'facial moisturizer'],
  },
  {
    name: 'Day Cream',
    slug: 'day-cream',
    parentGroup: 'Moisturizers & Creams',
    expectedFilename: 'moisturizers-creams/day-cream.jpg',
    image: '/images/skin-care/moisturizers-creams/day-cream.jpg',
    description:
      'Lightweight daytime facial cream with a smooth satin finish designed for effortless layering under sunscreen.',
    keywords: ['day cream', 'daytime cream'],
  },
  {
    name: 'Night Cream',
    slug: 'night-cream',
    parentGroup: 'Moisturizers & Creams',
    expectedFilename: 'moisturizers-creams/night-cream.jpg',
    image: '/images/skin-care/moisturizers-creams/night-cream.jpg',
    description:
      'Rich velvety evening facial cream formulated to nourish and replenish moisture levels overnight.',
    keywords: ['night cream', 'overnight cream'],
  },
  {
    name: 'Face Gel',
    slug: 'face-gel',
    parentGroup: 'Moisturizers & Creams',
    expectedFilename: 'moisturizers-creams/face-gel.jpg',
    image: '/images/skin-care/moisturizers-creams/face-gel.jpg',
    description:
      'Translucent oil-free facial hydrating gel with a cooling water-burst texture for humid daily comfort.',
    keywords: ['face gel', 'hydrating gel', 'facial gel'],
  },
  {
    name: 'Body Cream',
    slug: 'body-cream',
    parentGroup: 'Moisturizers & Creams',
    expectedFilename: 'moisturizers-creams/body-cream.jpg',
    image: '/images/skin-care/moisturizers-creams/body-cream.jpg',
    description:
      'Richly whipped jar body cream offering cushioned hydration for dry elbows, arms, knees, and legs.',
    keywords: ['body cream', 'rich body cream'],
  },

  // GROUP 3 — SUNSCREEN
  {
    name: 'SPF 30 Sunscreen',
    slug: 'spf-30-sunscreen',
    parentGroup: 'Sunscreen',
    expectedFilename: 'sunscreen/spf-30-sunscreen.jpg',
    image: '/images/skin-care/sunscreen/spf-30-sunscreen.jpg',
    description:
      'Smooth everyday SPF 30 sunscreen collection formulated for comfortable indoor-outdoor daylight wear.',
    keywords: ['spf 30 sunscreen', 'spf 30', 'sunscreen'],
  },
  {
    name: 'SPF 50 Sunscreen',
    slug: 'spf-50-sunscreen',
    parentGroup: 'Sunscreen',
    expectedFilename: 'sunscreen/spf-50-sunscreen.jpg',
    image: '/images/skin-care/sunscreen/spf-50-sunscreen.jpg',
    description:
      'High-protection SPF 50 sunscreen tube collection suited for prolonged outdoor sun exposure.',
    keywords: ['spf 50 sunscreen', 'spf 50', 'sunscreen'],
  },
  {
    name: 'Sunscreen Gel',
    slug: 'sunscreen-gel',
    parentGroup: 'Sunscreen',
    expectedFilename: 'sunscreen/sunscreen-gel.jpg',
    image: '/images/skin-care/sunscreen/sunscreen-gel.jpg',
    description:
      'Transparent quick-absorbing sunscreen gel designed for weightless coverage without heavy residue.',
    keywords: ['sunscreen gel', 'gel sunscreen', 'sunscreen'],
  },
  {
    name: 'Sunscreen Lotion',
    slug: 'sunscreen-lotion',
    parentGroup: 'Sunscreen',
    expectedFilename: 'sunscreen/sunscreen-lotion.jpg',
    image: '/images/skin-care/sunscreen/sunscreen-lotion.jpg',
    description:
      'Easy-spread pump dispenser sunscreen lotion suitable for face, neck, and exposed body skin.',
    keywords: ['sunscreen lotion', 'lotion sunscreen', 'sunscreen'],
  },

  // GROUP 4 — SERUMS & TREATMENTS
  {
    name: 'Vitamin C Serum',
    slug: 'vitamin-c-serum',
    parentGroup: 'Serums & Treatments',
    expectedFilename: 'serums-treatments/vitamin-c-serum.jpg',
    image: '/images/skin-care/serums-treatments/vitamin-c-serum.jpg',
    description:
      'Amber-glass dropper Vitamin C serum collection curated for daily radiance and even-looking tone.',
    keywords: ['vitamin c serum', 'vitamin c', 'serum'],
  },
  {
    name: 'Niacinamide Serum',
    slug: 'niacinamide-serum',
    parentGroup: 'Serums & Treatments',
    expectedFilename: 'serums-treatments/niacinamide-serum.jpg',
    image: '/images/skin-care/serums-treatments/niacinamide-serum.jpg',
    description:
      'Minimalist clear dropper Niacinamide serum collection crafted for balanced skin texture and clarity.',
    keywords: ['niacinamide serum', 'niacinamide', 'serum'],
  },
  {
    name: 'Hyaluronic Acid Serum',
    slug: 'hyaluronic-acid-serum',
    parentGroup: 'Serums & Treatments',
    expectedFilename: 'serums-treatments/hyaluronic-acid-serum.jpg',
    image: '/images/skin-care/serums-treatments/hyaluronic-acid-serum.jpg',
    description:
      'Lightweight water-binding Hyaluronic Acid dropper serum collection for plump-feeling daily hydration.',
    keywords: ['hyaluronic acid serum', 'hyaluronic acid', 'serum'],
  },
  {
    name: 'Retinol Serum',
    slug: 'retinol-serum',
    parentGroup: 'Serums & Treatments',
    expectedFilename: 'serums-treatments/retinol-serum.jpg',
    image: '/images/skin-care/serums-treatments/retinol-serum.jpg',
    description:
      'Protective dark-glass dropper Retinol serum collection reserved for structured evening skincare routines.',
    keywords: ['retinol serum', 'retinol', 'serum'],
  },

  // GROUP 5 — BODY CARE
  {
    name: 'Body Lotion',
    slug: 'body-lotion',
    parentGroup: 'Body Care',
    expectedFilename: 'body-care/body-lotion.jpg',
    image: '/images/skin-care/body-care/body-lotion.jpg',
    description:
      'Silky tall pump bottle body lotion made for effortless post-shower hydration and smooth daily softness.',
    keywords: ['body lotion', 'lotion', 'shea body lotion'],
  },
  {
    name: 'Body Wash',
    slug: 'body-wash',
    parentGroup: 'Body Care',
    expectedFilename: 'body-care/body-wash.jpg',
    image: '/images/skin-care/body-care/body-wash.jpg',
    description:
      'Refreshing liquid gel body wash in a pump dispenser creating clean-rinsing foam for daily baths.',
    keywords: ['body wash', 'shower gel', 'bath wash'],
  },
  {
    name: 'Body Scrub',
    slug: 'body-scrub',
    parentGroup: 'Body Care',
    expectedFilename: 'body-care/body-scrub.jpg',
    image: '/images/skin-care/body-care/body-scrub.jpg',
    description:
      'Granular botanical sugar and coffee body scrub jar designed to polish rough skin before moisturizing.',
    keywords: ['body scrub', 'body polish', 'exfoliating scrub'],
  },
  {
    name: 'Body Butter',
    slug: 'body-butter',
    parentGroup: 'Body Care',
    expectedFilename: 'body-care/body-butter.jpg',
    image: '/images/skin-care/body-care/body-butter.jpg',
    description:
      'Dense whipped jar body butter delivering deep conditioning comfort for very dry body areas.',
    keywords: ['body butter', 'whipped body butter'],
  },

  // GROUP 6 — LIP CARE
  {
    name: 'Lip Balm',
    slug: 'lip-balm',
    parentGroup: 'Lip Care',
    expectedFilename: 'lip-care/lip-balm.jpg',
    image: '/images/skin-care/lip-care/lip-balm.jpg',
    description:
      'Pocket-ready twist-up conditioning lip balm stick to keep dry lips soft and cushioned through the day.',
    keywords: ['lip balm', 'lip stick', 'conditioning lip balm'],
  },
  {
    name: 'Lip Scrub',
    slug: 'lip-scrub',
    parentGroup: 'Lip Care',
    expectedFilename: 'lip-care/lip-scrub.jpg',
    image: '/images/skin-care/lip-care/lip-scrub.jpg',
    description:
      'Fine crystal sugar lip scrub in a compact jar to gently smooth flaky texture prior to balm application.',
    keywords: ['lip scrub', 'sugar lip scrub'],
  },
  {
    name: 'Lip Mask',
    slug: 'lip-mask',
    parentGroup: 'Lip Care',
    expectedFilename: 'lip-care/lip-mask.jpg',
    image: '/images/skin-care/lip-care/lip-mask.jpg',
    description:
      'Cushioning glossy overnight lip mask pot paired with a mini applicator for rich nighttime conditioning.',
    keywords: ['lip mask', 'lip sleeping mask'],
  },

  // GROUP 7 — FACE MASKS & EXFOLIATORS
  {
    name: 'Clay Mask',
    slug: 'clay-mask',
    parentGroup: 'Face Masks & Exfoliators',
    expectedFilename: 'face-masks-exfoliators/clay-mask.jpg',
    image: '/images/skin-care/face-masks-exfoliators/clay-mask.jpg',
    description:
      'Smooth mineral clay mask jar formulated for weekly deep pore cleansing and excess oil absorption.',
    keywords: ['clay mask', 'mud mask', 'face clay'],
  },
  {
    name: 'Sheet Mask',
    slug: 'sheet-mask',
    parentGroup: 'Face Masks & Exfoliators',
    expectedFilename: 'face-masks-exfoliators/sheet-mask.jpg',
    image: '/images/skin-care/face-masks-exfoliators/sheet-mask.jpg',
    description:
      'Single-use serum-infused cotton facial sheet mask sachet for quick cooling moisture replenishment.',
    keywords: ['sheet mask', 'facial sheet mask'],
  },
  {
    name: 'Face Scrub',
    slug: 'face-scrub',
    parentGroup: 'Face Masks & Exfoliators',
    expectedFilename: 'face-masks-exfoliators/face-scrub.jpg',
    image: '/images/skin-care/face-masks-exfoliators/face-scrub.jpg',
    description:
      'Fine-grain tube facial exfoliating scrub created for occasional gentle surface smoothing.',
    keywords: ['face scrub', 'facial scrub'],
  },
  {
    name: 'Exfoliating Toner',
    slug: 'exfoliating-toner',
    parentGroup: 'Face Masks & Exfoliators',
    expectedFilename: 'face-masks-exfoliators/exfoliating-toner.jpg',
    image: '/images/skin-care/face-masks-exfoliators/exfoliating-toner.jpg',
    description:
      'Clear liquid exfoliating toner bottle suited for cotton-pad swiping after evening cleansing.',
    keywords: ['exfoliating toner', 'face toner', 'toner'],
  },
  {
    name: 'Facial Peel',
    slug: 'facial-peel',
    parentGroup: 'Face Masks & Exfoliators',
    expectedFilename: 'face-masks-exfoliators/facial-peel.jpg',
    image: '/images/skin-care/face-masks-exfoliators/facial-peel.jpg',
    description:
      'Concentrated dropper cosmetic facial peel solution designed for measured weekly resurfacing steps.',
    keywords: ['facial peel', 'peeling solution', 'exfoliating peel'],
  },
];

export const INITIAL_SKIN_CARE_COLLECTIONS: SkinCareCollection[] =
  RAW_SKIN_CARE_COLLECTIONS.map((item, idx) => {
    const groupMeta = GROUP_BY_NAME.get(item.parentGroup);
    return {
      id: `skin-${item.slug}`,
      name: item.name,
      slug: item.slug,
      parentCategory: 'Skin Care',
      parentGroup: item.parentGroup,
      parentGroupSlug: groupMeta?.slug || 'face-wash-cleansers',
      image: item.image || '',
      expectedFilename: item.expectedFilename,
      imageStatus: item.image ? 'generated' : 'quota_pending',
      description: item.description,
      keywords: item.keywords,
      status: 'approved',
      approved: true,
      displayOrder: idx + 1,
    };
  });

export function mergeSkinCareCollections(
  existing: SkinCareCollection[] = []
): SkinCareCollection[] {
  const existingById = new Map(existing.map((c) => [c.id.toLowerCase(), c]));
  return INITIAL_SKIN_CARE_COLLECTIONS.map((seed) => {
    const prev = existingById.get(seed.id.toLowerCase());
    if (!prev) return seed;

    const prevImage =
      typeof prev.image === 'string' ? prev.image.trim() : '';
    const useImage = prevImage || seed.image || '';
    const imageStatus: SkinCareCollection['imageStatus'] = !useImage
      ? 'quota_pending'
      : useImage.startsWith('/uploads/')
        ? 'uploaded'
        : 'generated';
    const status =
      prev.status === 'pending_approval' ? 'pending_approval' : 'approved';

    return {
      ...seed,
      name:
        typeof prev.name === 'string' && prev.name.trim()
          ? prev.name.trim()
          : seed.name,
      description:
        typeof prev.description === 'string' && prev.description.trim()
          ? prev.description.trim()
          : seed.description,
      image: useImage,
      imageStatus,
      keywords:
        Array.isArray(prev.keywords) && prev.keywords.length > 0
          ? prev.keywords
          : seed.keywords,
      status,
      approved: status === 'approved',
      displayOrder: seed.displayOrder,
    };
  });
}

export function getSkinCareCollectionPath(
  col: Pick<SkinCareCollection, 'parentGroupSlug' | 'slug'>
): string {
  return `/skin-care/${col.parentGroupSlug}/${col.slug}`;
}

export function findSkinCareGroupBySlug(
  slugOrName?: string
): SkinCareGroupMeta | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;
  return SKIN_CARE_GROUPS.find(
    (g) =>
      g.slug.toLowerCase() === clean ||
      g.name.toLowerCase() === clean ||
      g.folder.toLowerCase() === clean
  );
}

export function findSkinCareCollection(
  collections: SkinCareCollection[],
  slugOrName?: string,
  groupHint?: string
): SkinCareCollection | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;
  const groupClean = (groupHint || '').toLowerCase().trim();
  const matches = collections.filter(
    (c) =>
      c.slug.toLowerCase() === clean ||
      c.id.toLowerCase() === clean ||
      c.id.toLowerCase() === `skin-${clean}` ||
      c.name.toLowerCase() === clean
  );
  if (matches.length === 0) return undefined;
  if (groupClean) {
    return (
      matches.find(
        (m) =>
          m.parentGroupSlug.toLowerCase() === groupClean ||
          m.parentGroup.toLowerCase() === groupClean
      ) || matches[0]
    );
  }
  return matches[0];
}

export function productMatchesSkinCareCollection(
  product: Product,
  collection: SkinCareCollection
): boolean {
  const catLower = (product.category || '').toLowerCase().trim();
  if (catLower !== 'skin care') {
    return false;
  }

  const subLower = (product.subcategory || '').toLowerCase().trim();
  const subSubLower = (product.subSubcategory || '').toLowerCase().trim();
  const colNameLower = collection.name.toLowerCase();
  const colSlugLower = collection.slug.toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase().trim());

  if (
    subSubLower === colNameLower ||
    subSubLower === colSlugLower ||
    subLower === colNameLower ||
    subLower === colSlugLower ||
    tags.includes(colNameLower) ||
    tags.includes(colSlugLower) ||
    tags.includes(collection.id.toLowerCase())
  ) {
    return true;
  }

  if (
    subSubLower &&
    subSubLower !== 'skin care' &&
    subSubLower !== collection.parentGroup.toLowerCase()
  ) {
    return false;
  }

  const haystack = [
    product.name,
    product.shortDescription,
    product.description,
    ...(product.tags || []),
  ]
    .join(' ')
    .toLowerCase();

  // Exact type matching prevents cross-matching sibling skincare types
  return haystack.includes(colNameLower);
}
