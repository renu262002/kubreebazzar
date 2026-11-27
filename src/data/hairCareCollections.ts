import type {
  HairCareCollection,
  HairCareGroupName,
  Product,
} from '../types';

export interface HairCareGroupMeta {
  name: HairCareGroupName;
  slug: string;
  folder: string;
  description: string;
}

export const HAIR_CARE_GROUPS: HairCareGroupMeta[] = [
  {
    name: 'Shampoo',
    slug: 'shampoo',
    folder: 'shampoo',
    description:
      'Everyday scalp cleansers across daily use, anti-dandruff, herbal, moisturizing, and clarifying shampoos.',
  },
  {
    name: 'Conditioners',
    slug: 'conditioners',
    folder: 'conditioners',
    description:
      'Rinse-out daily conditioners, rich deep conditioners, spray leave-in conditioners, and hair mask conditioners.',
  },
  {
    name: 'Hair Oils',
    slug: 'hair-oils',
    folder: 'hair-oils',
    description:
      'Cold-pressed and botanical hair oils including coconut, almond, amla, castor, and rosemary oils.',
  },
  {
    name: 'Hair Serums & Treatments',
    slug: 'serums-treatments',
    folder: 'serums-treatments',
    description:
      'Targeted hair serums, heat protectant sprays, concentrated scalp serums, and nourishing hair masks.',
  },
  {
    name: 'Hair Styling',
    slug: 'hair-styling',
    folder: 'hair-styling',
    description:
      'Flexible hold and texture essentials covering hair gel, matte hair wax, hair spray, and volumizing mousse.',
  },
  {
    name: 'Hair Tools',
    slug: 'hair-tools',
    folder: 'hair-tools',
    description:
      'Practical daily grooming hardware including hair dryers, hair straighteners, curling irons, and hair brushes.',
  },
  {
    name: 'Hair Accessories',
    slug: 'hair-accessories',
    folder: 'hair-accessories',
    description:
      'Everyday finishing essentials featuring wooden hair combs, claw clips, elastic hair bands, and fabric scrunchies.',
  },
];

interface SeedInput {
  name: string;
  slug: string;
  parentGroup: HairCareGroupName;
  expectedFilename: string;
  image?: string;
  description: string;
  keywords: string[];
}

const GROUP_BY_NAME = new Map(HAIR_CARE_GROUPS.map((g) => [g.name, g]));

const RAW_HAIR_CARE_COLLECTIONS: SeedInput[] = [
  // GROUP 1 — SHAMPOO
  {
    name: 'Daily Use Shampoo',
    slug: 'daily-use-shampoo',
    parentGroup: 'Shampoo',
    expectedFilename: 'shampoo/daily-use-shampoo.jpg',
    image: '/images/hair-care/shampoo/daily-use-shampoo.jpg',
    description:
      'Gentle everyday pump shampoo designed for balanced daily scalp cleansing without stripping natural moisture.',
    keywords: ['daily use shampoo', 'daily shampoo', 'everyday shampoo'],
  },
  {
    name: 'Anti-Dandruff Shampoo',
    slug: 'anti-dandruff-shampoo',
    parentGroup: 'Shampoo',
    expectedFilename: 'shampoo/anti-dandruff-shampoo.jpg',
    image: '/images/hair-care/shampoo/anti-dandruff-shampoo.jpg',
    description:
      'Cooling scalp-soothing shampoo crafted to lift visible flakes and maintain a clean, refreshed scalp feel.',
    keywords: ['anti-dandruff shampoo', 'anti dandruff shampoo', 'dandruff shampoo'],
  },
  {
    name: 'Herbal Shampoo',
    slug: 'herbal-shampoo',
    parentGroup: 'Shampoo',
    expectedFilename: 'shampoo/herbal-shampoo.jpg',
    image: '/images/hair-care/shampoo/herbal-shampoo.jpg',
    description:
      'Botanical apothecary shampoo infused with traditional herbs, soapnut extracts, and gentle plant cleansers.',
    keywords: ['herbal shampoo', 'botanical shampoo', 'ayurvedic shampoo'],
  },
  {
    name: 'Moisturizing Shampoo',
    slug: 'moisturizing-shampoo',
    parentGroup: 'Shampoo',
    expectedFilename: 'shampoo/moisturizing-shampoo.jpg',
    image: '/images/hair-care/shampoo/moisturizing-shampoo.jpg',
    description:
      'Rich creamy moisturizing shampoo suited for dry, coarse, or textured hair needing soft hydration.',
    keywords: ['moisturizing shampoo', 'hydrating shampoo', 'moisture shampoo'],
  },
  {
    name: 'Clarifying Shampoo',
    slug: 'clarifying-shampoo',
    parentGroup: 'Shampoo',
    expectedFilename: 'shampoo/clarifying-shampoo.jpg',
    image: '/images/hair-care/shampoo/clarifying-shampoo.jpg',
    description:
      'Crystal-clear purifying shampoo ideal for lifting stubborn styling residue, excess oil, and hard-water buildup.',
    keywords: ['clarifying shampoo', 'deep clean shampoo', 'purifying shampoo'],
  },

  // GROUP 2 — CONDITIONERS
  {
    name: 'Daily Conditioner',
    slug: 'daily-conditioner',
    parentGroup: 'Conditioners',
    expectedFilename: 'conditioners/daily-conditioner.jpg',
    image: '/images/hair-care/conditioners/daily-conditioner.jpg',
    description:
      'Lightweight silky rinse-out daily conditioner to detangle strands and leave hair smooth after every wash.',
    keywords: ['daily conditioner', 'hair conditioner', 'rinse-out conditioner'],
  },
  {
    name: 'Deep Conditioner',
    slug: 'deep-conditioner',
    parentGroup: 'Conditioners',
    expectedFilename: 'conditioners/deep-conditioner.jpg',
    image: '/images/hair-care/conditioners/deep-conditioner.jpg',
    description:
      'Concentrated whipped ceramic-jar deep conditioner formulated to soften brittle ends and replenish moisture.',
    keywords: ['deep conditioner', 'intensive conditioner'],
  },
  {
    name: 'Leave-In Conditioner',
    slug: 'leave-in-conditioner',
    parentGroup: 'Conditioners',
    expectedFilename: 'conditioners/leave-in-conditioner.jpg',
    image: '/images/hair-care/conditioners/leave-in-conditioner.jpg',
    description:
      'Weightless mist leave-in conditioner spray created for effortless damp detangling and frizz control.',
    keywords: ['leave-in conditioner', 'leave in conditioner', 'conditioner spray'],
  },
  {
    name: 'Hair Mask Conditioner',
    slug: 'hair-mask-conditioner',
    parentGroup: 'Conditioners',
    expectedFilename: 'conditioners/hair-mask-conditioner.jpg',
    image: '/images/hair-care/conditioners/hair-mask-conditioner.jpg',
    description:
      'Ultra-creamy conditioning mask tub combining rich softness with manageable slip for dry hair.',
    keywords: ['hair mask conditioner', 'conditioning mask'],
  },

  // GROUP 3 — HAIR OILS
  {
    name: 'Coconut Hair Oil',
    slug: 'coconut-hair-oil',
    parentGroup: 'Hair Oils',
    expectedFilename: 'hair-oils/coconut-hair-oil.jpg',
    image: '/images/hair-care/hair-oils/coconut-hair-oil.jpg',
    description:
      'Pure cold-pressed coconut hair oil collection for traditional pre-wash oiling and deep strand nourishment.',
    keywords: ['coconut hair oil', 'coconut oil', 'virgin coconut oil'],
  },
  {
    name: 'Almond Hair Oil',
    slug: 'almond-hair-oil',
    parentGroup: 'Hair Oils',
    expectedFilename: 'hair-oils/almond-hair-oil.jpg',
    image: '/images/hair-care/hair-oils/almond-hair-oil.jpg',
    description:
      'Lightweight golden sweet almond hair oil designed for smooth shine, supple texture, and non-sticky scalp massage.',
    keywords: ['almond hair oil', 'almond oil', 'badam hair oil'],
  },
  {
    name: 'Amla Hair Oil',
    slug: 'amla-hair-oil',
    parentGroup: 'Hair Oils',
    expectedFilename: 'hair-oils/amla-hair-oil.jpg',
    image: '/images/hair-care/hair-oils/amla-hair-oil.jpg',
    description:
      'Traditional Indian gooseberry herbal hair oil crafted to condition roots and impart rich natural sheen.',
    keywords: ['amla hair oil', 'amla oil', 'gooseberry hair oil'],
  },
  {
    name: 'Castor Hair Oil',
    slug: 'castor-hair-oil',
    parentGroup: 'Hair Oils',
    expectedFilename: 'hair-oils/castor-hair-oil.jpg',
    image: '/images/hair-care/hair-oils/castor-hair-oil.jpg',
    description:
      'Dense cold-pressed amber castor hair oil suited for targeted scalp blends and sealing dry hair tips.',
    keywords: ['castor hair oil', 'castor oil', 'black castor oil'],
  },
  {
    name: 'Rosemary Hair Oil',
    slug: 'rosemary-hair-oil',
    parentGroup: 'Hair Oils',
    expectedFilename: 'hair-oils/rosemary-hair-oil.jpg',
    image: '/images/hair-care/hair-oils/rosemary-hair-oil.jpg',
    description:
      'Botanical rosemary-infused hair oil dropper collection blended for aromatic scalp massage rituals.',
    keywords: ['rosemary hair oil', 'rosemary oil', 'scalp rosemary oil'],
  },

  // GROUP 4 — HAIR SERUMS & TREATMENTS
  {
    name: 'Hair Serum',
    slug: 'hair-serum',
    parentGroup: 'Hair Serums & Treatments',
    expectedFilename: 'serums-treatments/hair-serum.jpg',
    image: '/images/hair-care/serums-treatments/hair-serum.jpg',
    description:
      'Silky glass-pump smoothing hair serum crafted to tame flyaways, reduce frizz, and add weightless gloss.',
    keywords: ['hair serum', 'anti frizz serum', 'smoothing serum'],
  },
  {
    name: 'Heat Protectant Spray',
    slug: 'heat-protectant-spray',
    parentGroup: 'Hair Serums & Treatments',
    expectedFilename: 'serums-treatments/heat-protectant-spray.jpg',
    image: '/images/hair-care/serums-treatments/heat-protectant-spray.jpg',
    description:
      'Fine thermal shield mist bottle designed for pre-styling prep before blow drying or flat ironing.',
    keywords: ['heat protectant spray', 'thermal spray', 'heat protection'],
  },
  {
    name: 'Scalp Serum',
    slug: 'scalp-serum',
    parentGroup: 'Hair Serums & Treatments',
    expectedFilename: 'serums-treatments/scalp-serum.jpg',
    image: '/images/hair-care/serums-treatments/scalp-serum.jpg',
    description:
      'Precision glass dropper scalp serum collection formulated for light, fast-absorbing root comfort.',
    keywords: ['scalp serum', 'root serum', 'hair scalp treatment'],
  },
  {
    name: 'Hair Mask',
    slug: 'hair-mask',
    parentGroup: 'Hair Serums & Treatments',
    expectedFilename: 'serums-treatments/hair-mask.jpg',
    image: '/images/hair-care/serums-treatments/hair-mask.jpg',
    description:
      'Concentrated weekly treatment hair mask pot delivering intensive conditioning for overworked strands.',
    keywords: ['hair mask', 'repair hair mask', 'treatment mask'],
  },

  // GROUP 5 — HAIR STYLING
  {
    name: 'Hair Gel',
    slug: 'hair-gel',
    parentGroup: 'Hair Styling',
    expectedFilename: 'hair-styling/hair-gel.jpg',
    image: '/images/hair-care/hair-styling/hair-gel.jpg',
    description:
      'Clear flake-free styling hair gel jar and tube collection for crisp definition and clean hold.',
    keywords: ['hair gel', 'styling gel', 'firm hold gel'],
  },
  {
    name: 'Hair Wax',
    slug: 'hair-wax',
    parentGroup: 'Hair Styling',
    expectedFilename: 'hair-styling/hair-wax.jpg',
    image: '/images/hair-care/hair-styling/hair-wax.jpg',
    description:
      'Sculpting matte hair styling wax tin designed for reworkable texture, separation, and natural finish.',
    keywords: ['hair wax', 'matte hair wax', 'styling clay'],
  },
  {
    name: 'Hair Spray',
    slug: 'hair-spray',
    parentGroup: 'Hair Styling',
    expectedFilename: 'hair-styling/hair-spray.jpg',
    image: '/images/hair-care/hair-styling/hair-spray.jpg',
    description:
      'Ultra-fine aerosol mist finishing hair spray canister offering reliable all-day style control.',
    keywords: ['hair spray', 'hairspray', 'finishing spray'],
  },
  {
    name: 'Hair Mousse',
    slug: 'hair-mousse',
    parentGroup: 'Hair Styling',
    expectedFilename: 'hair-styling/hair-mousse.jpg',
    image: '/images/hair-care/hair-styling/hair-mousse.jpg',
    description:
      'Whipped airy styling mousse pump foam built to add touchable volume, bounce, and curl definition.',
    keywords: ['hair mousse', 'styling mousse', 'volumizing foam'],
  },

  // GROUP 6 — HAIR TOOLS
  {
    name: 'Hair Dryer',
    slug: 'hair-dryer',
    parentGroup: 'Hair Tools',
    expectedFilename: 'hair-tools/hair-dryer.jpg',
    image: '/images/hair-care/hair-tools/hair-dryer.jpg',
    description:
      'Ergonomic precision-nozzle blow hair dryer crafted for smooth airflow and everyday home drying.',
    keywords: ['hair dryer', 'blow dryer', 'dryer'],
  },
  {
    name: 'Hair Straightener',
    slug: 'hair-straightener',
    parentGroup: 'Hair Tools',
    expectedFilename: 'hair-tools/hair-straightener.jpg',
    image: '/images/hair-care/hair-tools/hair-straightener.jpg',
    description:
      'Sleek floating ceramic-plate hair straightener designed for smooth gliding and polished styling.',
    keywords: ['hair straightener', 'flat iron', 'straightener'],
  },
  {
    name: 'Curling Iron',
    slug: 'curling-iron',
    parentGroup: 'Hair Tools',
    expectedFilename: 'hair-tools/curling-iron.jpg',
    image: '/images/hair-care/hair-tools/curling-iron.jpg',
    description:
      'Ceramic barrel curling iron wand engineered for smooth waves, loose curls, and defined styling.',
    keywords: ['curling iron', 'hair curler', 'curling wand'],
  },
  {
    name: 'Hair Brush',
    slug: 'hair-brush',
    parentGroup: 'Hair Tools',
    expectedFilename: 'hair-tools/hair-brush.jpg',
    image: '/images/hair-care/hair-tools/hair-brush.jpg',
    description:
      'Cushioned natural wood paddle hair brush with gentle bristles for comfortable everyday detangling.',
    keywords: ['hair brush', 'paddle brush', 'detangling brush'],
  },

  // GROUP 7 — HAIR ACCESSORIES
  {
    name: 'Hair Comb',
    slug: 'hair-comb',
    parentGroup: 'Hair Accessories',
    expectedFilename: 'hair-accessories/hair-comb.jpg',
    image: '/images/hair-care/hair-accessories/hair-comb.jpg',
    description:
      'Smooth wide-tooth natural wood hair comb crafted for snag-free wet detangling and parting.',
    keywords: ['hair comb', 'wooden comb', 'wide tooth comb'],
  },
  {
    name: 'Hair Clips',
    slug: 'hair-clips',
    parentGroup: 'Hair Accessories',
    expectedFilename: 'hair-accessories/hair-clips.jpg',
    image: '/images/hair-care/hair-accessories/hair-clips.jpg',
    description:
      'Modern tortoise and matte acrylic jaw claw hair clips designed to secure updos effortlessly.',
    keywords: ['hair clips', 'claw clips', 'hair pins'],
  },
  {
    name: 'Hair Bands',
    slug: 'hair-bands',
    parentGroup: 'Hair Accessories',
    expectedFilename: 'hair-accessories/hair-bands.jpg',
    image: '/images/hair-care/hair-accessories/hair-bands.jpg',
    description:
      'Gentle seamless elastic hair bands and everyday headbands in neutral tones for crease-free hold.',
    keywords: ['hair bands', 'hair ties', 'elastic bands', 'headbands'],
  },
  {
    name: 'Hair Scrunchies',
    slug: 'hair-scrunchies',
    parentGroup: 'Hair Accessories',
    expectedFilename: 'hair-accessories/hair-scrunchies.jpg',
    image: '/images/hair-care/hair-accessories/hair-scrunchies.jpg',
    description:
      'Soft satin and silk-finish pleated hair scrunchies in neutral and pastel shades for gentle styling.',
    keywords: ['hair scrunchies', 'scrunchies', 'satin scrunchie'],
  },
];

export const INITIAL_HAIR_CARE_COLLECTIONS: HairCareCollection[] =
  RAW_HAIR_CARE_COLLECTIONS.map((item, idx) => {
    const groupMeta = GROUP_BY_NAME.get(item.parentGroup);
    return {
      id: `hair-${item.slug}`,
      name: item.name,
      slug: item.slug,
      parentCategory: 'Hair Care',
      parentGroup: item.parentGroup,
      parentGroupSlug: groupMeta?.slug || 'shampoo',
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

export function mergeHairCareCollections(
  existing: HairCareCollection[] = []
): HairCareCollection[] {
  const existingById = new Map(existing.map((c) => [c.id.toLowerCase(), c]));
  return INITIAL_HAIR_CARE_COLLECTIONS.map((seed) => {
    const prev = existingById.get(seed.id.toLowerCase());
    if (!prev) return seed;

    const prevImage =
      typeof prev.image === 'string' ? prev.image.trim() : '';
    const useImage = prevImage || seed.image || '';
    const imageStatus: HairCareCollection['imageStatus'] = !useImage
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

export function getHairCareCollectionPath(
  col: Pick<HairCareCollection, 'parentGroupSlug' | 'slug'>
): string {
  return `/hair-care/${col.parentGroupSlug}/${col.slug}`;
}

export function findHairCareGroupBySlug(
  slugOrName?: string
): HairCareGroupMeta | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;
  return HAIR_CARE_GROUPS.find(
    (g) =>
      g.slug.toLowerCase() === clean ||
      g.name.toLowerCase() === clean ||
      g.folder.toLowerCase() === clean
  );
}

export function findHairCareCollection(
  collections: HairCareCollection[],
  slugOrName?: string,
  groupHint?: string
): HairCareCollection | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;
  const groupClean = (groupHint || '').toLowerCase().trim();
  const matches = collections.filter(
    (c) =>
      c.slug.toLowerCase() === clean ||
      c.id.toLowerCase() === clean ||
      c.id.toLowerCase() === `hair-${clean}` ||
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

export function productMatchesHairCareCollection(
  product: Product,
  collection: HairCareCollection
): boolean {
  const catLower = (product.category || '').toLowerCase().trim();
  if (catLower !== 'hair care') {
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
    subSubLower !== 'hair care' &&
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

  return haystack.includes(colNameLower);
}
