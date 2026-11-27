import type { NutCollection, Product } from '../types';

export type NutVarietyGroup =
  | 'Classic Tree Nuts'
  | 'Groundnuts & Roasted'
  | 'Gourmet & Specialty';

export const NUT_VARIETY_GROUPS: NutVarietyGroup[] = [
  'Classic Tree Nuts',
  'Groundnuts & Roasted',
  'Gourmet & Specialty',
];

interface SeedInput {
  name: string;
  slug: string;
  varietyGroup: NutVarietyGroup;
  expectedFilename: string;
  image?: string;
  description: string;
  keywords: string[];
}

const RAW_NUTS_COLLECTIONS: SeedInput[] = [
  {
    name: 'Almonds',
    slug: 'almonds',
    varietyGroup: 'Classic Tree Nuts',
    expectedFilename: 'almonds.jpg',
    image: '/images/nuts/almonds.jpg',
    description:
      'Natural brown whole almonds prized for crisp crunch, vitamin E, and daily snacking or culinary use.',
    keywords: ['almonds', 'almond', 'california almonds', 'badam'],
  },
  {
    name: 'Cashew Nuts',
    slug: 'cashew-nuts',
    varietyGroup: 'Classic Tree Nuts',
    expectedFilename: 'cashew-nuts.jpg',
    image: '/images/nuts/cashew-nuts.jpg',
    description:
      'Cream-coloured whole cashew kernels with mild buttery sweetness for desserts, curries, and wholesome snacking.',
    keywords: ['cashew nuts', 'cashews', 'cashew', 'w320', 'kaju'],
  },
  {
    name: 'Walnuts',
    slug: 'walnuts',
    varietyGroup: 'Classic Tree Nuts',
    expectedFilename: 'walnuts.jpg',
    image: '/images/nuts/walnuts.jpg',
    description:
      'Light golden walnut halves rich in omega-3 fatty acids, crisp crunch, and earthy richness for bakes and salads.',
    keywords: ['walnuts', 'walnut', 'walnut kernels', 'akhrot'],
  },
  {
    name: 'Pistachios',
    slug: 'pistachios',
    varietyGroup: 'Classic Tree Nuts',
    expectedFilename: 'pistachios.jpg',
    image: '/images/nuts/pistachios.jpg',
    description:
      'Naturally opened beige-shell pistachios revealing vibrant green kernels ideal for snacking and traditional sweets.',
    keywords: ['pistachios', 'pistachio', 'pista', 'in-shell pistachios'],
  },
  {
    name: 'Peanuts',
    slug: 'peanuts',
    varietyGroup: 'Groundnuts & Roasted',
    expectedFilename: 'peanuts.jpg',
    description:
      'Classic pale shelled peanuts alongside crisp natural shells, ready for roasting, chutneys, and peanut butter.',
    keywords: ['peanuts', 'peanut', 'shelled peanuts', 'groundnuts', 'groundnut'],
  },
  {
    name: 'Hazelnuts',
    slug: 'hazelnuts',
    varietyGroup: 'Classic Tree Nuts',
    expectedFilename: 'hazelnuts.jpg',
    description:
      'Round glossy brown hazelnuts with sweet nutty aroma, prized for pralines, spreads, coffee pairings, and baking.',
    keywords: ['hazelnuts', 'hazelnut', 'filberts', 'filbert'],
  },
  {
    name: 'Pecans',
    slug: 'pecans',
    varietyGroup: 'Classic Tree Nuts',
    expectedFilename: 'pecans.jpg',
    image: '/images/nuts/pecans.jpg',
    description:
      'Elongated brown pecan halves with delicate ridged grooves and rich caramel-butter depth for pies and trail mixes.',
    keywords: ['pecans', 'pecan', 'pecan halves'],
  },
  {
    name: 'Macadamia Nuts',
    slug: 'macadamia-nuts',
    varietyGroup: 'Gourmet & Specialty',
    expectedFilename: 'macadamia-nuts.jpg',
    description:
      'Smooth, rounded ivory-cream macadamia nut kernels renowned for velvet crunch and delicate buttery richness.',
    keywords: ['macadamia nuts', 'macadamia', 'macadamias'],
  },
  {
    name: 'Brazil Nuts',
    slug: 'brazil-nuts',
    varietyGroup: 'Gourmet & Specialty',
    expectedFilename: 'brazil-nuts.jpg',
    description:
      'Large elongated Brazil nut kernels naturally rich in selenium with a hearty texture and subtle sweet earthy notes.',
    keywords: ['brazil nuts', 'brazil nut'],
  },
  {
    name: 'Pine Nuts',
    slug: 'pine-nuts',
    varietyGroup: 'Gourmet & Specialty',
    expectedFilename: 'pine-nuts.jpg',
    image: '/images/nuts/pine-nuts.jpg',
    description:
      'Small ivory pine nut kernels with delicate resinous sweetness ideal for basil pesto, Mediterranean dishes, and salads.',
    keywords: ['pine nuts', 'pine nut', 'chilgoza', 'pinoli'],
  },
  {
    name: 'Chestnuts',
    slug: 'chestnuts',
    varietyGroup: 'Gourmet & Specialty',
    expectedFilename: 'chestnuts.jpg',
    image: '/images/nuts/chestnuts.jpg',
    description:
      'Glossy mahogany-brown whole chestnuts featuring tapered tips and tender mildly sweet flesh suitable for roasting.',
    keywords: ['chestnuts', 'chestnut', 'sweet chestnuts'],
  },
  {
    name: 'Black Walnuts',
    slug: 'black-walnuts',
    varietyGroup: 'Gourmet & Specialty',
    expectedFilename: 'black-walnuts.jpg',
    description:
      'Bold irregularly shaped black walnut kernels offering intense woodsy flavour and darker textured grooves for artisan bakes.',
    keywords: ['black walnuts', 'black walnut'],
  },
  {
    name: 'Marcona Almonds',
    slug: 'marcona-almonds',
    varietyGroup: 'Gourmet & Specialty',
    expectedFilename: 'marcona-almonds.jpg',
    description:
      'Broad, rounded Spanish-style blanched Marcona almonds treasured for softer bite and delicate sweet almond taste.',
    keywords: ['marcona almonds', 'marcona', 'blanched marcona'],
  },
  {
    name: 'Red Skin Peanuts',
    slug: 'red-skin-peanuts',
    varietyGroup: 'Groundnuts & Roasted',
    expectedFilename: 'red-skin-peanuts.jpg',
    image: '/images/nuts/red-skin-peanuts.jpg',
    description:
      'Whole peanuts retaining their natural reddish-brown skins for authentic dry-roasting, masala sundal, and crunchy snacks.',
    keywords: ['red skin peanuts', 'red-skin peanuts', 'red skin groundnuts', 'raw peanuts'],
  },
  {
    name: 'Roasted Cashews',
    slug: 'roasted-cashews',
    varietyGroup: 'Groundnuts & Roasted',
    expectedFilename: 'roasted-cashews.jpg',
    description:
      'Lightly golden dry-roasted whole cashews offering warm toasted crunch and rich aroma without heavy coatings.',
    keywords: ['roasted cashews', 'roasted cashew', 'toasted cashews'],
  },
];

export const INITIAL_NUTS_COLLECTIONS: NutCollection[] =
  RAW_NUTS_COLLECTIONS.map((item, idx) => ({
    id: `nut-${item.slug}`,
    name: item.name,
    slug: item.slug,
    parentCategory: 'Nuts',
    parentSlug: 'nuts',
    varietyGroup: item.varietyGroup,
    image: item.image || '',
    expectedFilename: item.expectedFilename,
    imageStatus: item.image ? 'generated' : 'quota_pending',
    description: item.description,
    keywords: item.keywords,
    status: 'approved',
    approved: true,
    displayOrder: idx + 1,
  }));

export function mergeNutsCollections(
  existing: NutCollection[] = []
): NutCollection[] {
  const existingById = new Map(existing.map((c) => [c.id.toLowerCase(), c]));
  return INITIAL_NUTS_COLLECTIONS.map((seed) => {
    const prev = existingById.get(seed.id.toLowerCase());
    if (!prev) return seed;

    const prevImage =
      typeof prev.image === 'string' ? prev.image.trim() : '';
    const useImage = prevImage || seed.image || '';
    const imageStatus: NutCollection['imageStatus'] = !useImage
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

export function getNutCollectionPath(
  col: Pick<NutCollection, 'slug'>
): string {
  return `/nuts/${col.slug}`;
}

export function findNutCollection(
  collections: NutCollection[],
  slugOrName?: string
): NutCollection | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;
  return collections.find(
    (c) =>
      c.slug.toLowerCase() === clean ||
      c.id.toLowerCase() === clean ||
      c.id.toLowerCase() === `nut-${clean}` ||
      c.name.toLowerCase() === clean
  );
}

export function productMatchesNutCollection(
  product: Product,
  collection: NutCollection
): boolean {
  const catLower = (product.category || '').toLowerCase().trim();
  if (catLower !== 'dry nuts' && catLower !== 'nuts') {
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

  // Avoid cross-matching if product explicitly specifies a different nut variety
  if (subSubLower && subSubLower !== 'nuts' && subSubLower !== 'dry nuts') {
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

  // Prevent specialized nut collections from colliding with base nut products
  if (collection.slug === 'almonds' && haystack.includes('marcona')) return false;
  if (collection.slug === 'walnuts' && haystack.includes('black walnut')) return false;
  if (
    collection.slug === 'peanuts' &&
    (haystack.includes('red skin') || haystack.includes('red-skin'))
  ) {
    return false;
  }
  if (collection.slug === 'cashew-nuts' && haystack.includes('roasted cashew')) {
    return false;
  }

  return collection.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}
