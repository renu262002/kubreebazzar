import type { DriedFruitCollection, Product } from '../types';

export type DriedFruitVarietyGroup =
  | 'Classic Sun-Dried'
  | 'Berries & Cherries'
  | 'Tropical & Orchard';

export const DRIED_FRUIT_VARIETY_GROUPS: DriedFruitVarietyGroup[] = [
  'Classic Sun-Dried',
  'Berries & Cherries',
  'Tropical & Orchard',
];

interface SeedInput {
  name: string;
  slug: string;
  varietyGroup: DriedFruitVarietyGroup;
  expectedFilename: string;
  image?: string;
  description: string;
  keywords: string[];
}

const RAW_DRIED_FRUITS_COLLECTIONS: SeedInput[] = [
  {
    name: 'Raisins',
    slug: 'raisins',
    varietyGroup: 'Classic Sun-Dried',
    expectedFilename: 'raisins.jpg',
    image: '/images/dried-fruits/raisins.jpg',
    description:
      'Naturally sun-dried seedless raisins prized for natural sweetness in sweets, cereals, baking, and everyday snacking.',
    keywords: ['raisins', 'raisin', 'black raisins', 'golden raisins', 'kishmish'],
  },
  {
    name: 'Dates',
    slug: 'dates',
    varietyGroup: 'Classic Sun-Dried',
    expectedFilename: 'dates.jpg',
    image: '/images/dried-fruits/dates.jpg',
    description:
      'Rich, caramel-sweet whole dates packed with natural energy, potassium, and fiber for daily nourishment and gifting.',
    keywords: ['dates', 'date', 'medjool', 'king dates', 'khajoor'],
  },
  {
    name: 'Dried Figs',
    slug: 'dried-figs',
    varietyGroup: 'Classic Sun-Dried',
    expectedFilename: 'dried-figs.jpg',
    image: '/images/dried-fruits/dried-figs.jpg',
    description:
      'Tender, honey-sweet sun-dried figs (Anjeer) offering chewy texture, crisp natural seeds, and wholesome dietary fiber.',
    keywords: ['dried figs', 'figs', 'fig', 'anjeer', 'turkish figs'],
  },
  {
    name: 'Dried Apricots',
    slug: 'dried-apricots',
    varietyGroup: 'Classic Sun-Dried',
    expectedFilename: 'dried-apricots.jpg',
    image: '/images/dried-fruits/dried-apricots.jpg',
    description:
      'Plump, vibrant dried apricots with balanced sweet-tangy orchard flavour ideal for snacking, trail mixes, and desserts.',
    keywords: ['dried apricots', 'apricots', 'apricot', 'khubani'],
  },
  {
    name: 'Dried Cranberries',
    slug: 'dried-cranberries',
    varietyGroup: 'Berries & Cherries',
    expectedFilename: 'dried-cranberries.jpg',
    image: '/images/dried-fruits/dried-cranberries.jpg',
    description:
      'Ruby-red whole dried cranberries delivering a lively tart-sweet bite for oatmeal bowls, salads, and bakery recipes.',
    keywords: ['dried cranberries', 'cranberries', 'cranberry'],
  },
  {
    name: 'Prunes',
    slug: 'prunes',
    varietyGroup: 'Classic Sun-Dried',
    expectedFilename: 'prunes.jpg',
    description:
      'Soft, deeply sweet pitted prunes dried from ripe plums for digestive wellness, culinary glazes, and wholesome snacking.',
    keywords: ['prunes', 'prune', 'dried plums', 'dried plum'],
  },
  {
    name: 'Dried Blueberries',
    slug: 'dried-blueberries',
    varietyGroup: 'Berries & Cherries',
    expectedFilename: 'dried-blueberries.jpg',
    description:
      'Intensely flavourful indigo dried blueberries crafted for smoothies, yogurt parfaits, muffins, and antioxidant trail blends.',
    keywords: ['dried blueberries', 'blueberries', 'blueberry'],
  },
  {
    name: 'Dried Cherries',
    slug: 'dried-cherries',
    varietyGroup: 'Berries & Cherries',
    expectedFilename: 'dried-cherries.jpg',
    description:
      'Chewy ruby-dark pitted dried cherries balancing natural tartness and rich orchard sweetness for snacking and patisserie.',
    keywords: ['dried cherries', 'cherries', 'cherry', 'tart cherries'],
  },
  {
    name: 'Dried Mango',
    slug: 'dried-mango',
    varietyGroup: 'Tropical & Orchard',
    expectedFilename: 'dried-mango.jpg',
    description:
      'Golden-orange dehydrated mango slices bursting with ripe tropical aroma and naturally chewy solar sweetness.',
    keywords: ['dried mango', 'mango slices', 'dehydrated mango'],
  },
  {
    name: 'Dried Pineapple',
    slug: 'dried-pineapple',
    varietyGroup: 'Tropical & Orchard',
    expectedFilename: 'dried-pineapple.jpg',
    description:
      'Sunny yellow dried pineapple rings gently dehydrated to preserve bright citrus sweetness and tropical fragrance.',
    keywords: ['dried pineapple', 'pineapple rings', 'dehydrated pineapple'],
  },
  {
    name: 'Dried Papaya',
    slug: 'dried-papaya',
    varietyGroup: 'Tropical & Orchard',
    expectedFilename: 'dried-papaya.jpg',
    description:
      'Coral-orange dried papaya spears and cubes offering mellow tropical sweetness for snack mixes and breakfast cereals.',
    keywords: ['dried papaya', 'papaya chunks', 'dehydrated papaya'],
  },
  {
    name: 'Dried Kiwi',
    slug: 'dried-kiwi',
    varietyGroup: 'Tropical & Orchard',
    expectedFilename: 'dried-kiwi.jpg',
    description:
      'Emerald-green sliced dried kiwi wheels with delicate crisp seeds and refreshing tangy-sweet tropical notes.',
    keywords: ['dried kiwi', 'kiwi slices', 'dehydrated kiwi'],
  },
  {
    name: 'Dried Strawberries',
    slug: 'dried-strawberries',
    varietyGroup: 'Berries & Cherries',
    expectedFilename: 'dried-strawberries.jpg',
    description:
      'Vibrant berry-red dried strawberries bringing concentrated summer sweetness to cereals, teas, desserts, and snacks.',
    keywords: ['dried strawberries', 'strawberries', 'strawberry'],
  },
  {
    name: 'Dried Coconut',
    slug: 'dried-coconut',
    varietyGroup: 'Tropical & Orchard',
    expectedFilename: 'dried-coconut.jpg',
    description:
      'Crisp snowy-white toasted and sun-dried coconut ribbons prized for nutty richness in sweets, curries, and granola.',
    keywords: ['dried coconut', 'coconut chips', 'coconut flakes', 'desiccated coconut'],
  },
  {
    name: 'Dried Apple',
    slug: 'dried-apple',
    varietyGroup: 'Tropical & Orchard',
    expectedFilename: 'dried-apple.jpg',
    description:
      'Warm cream-ivory dried apple rings sliced from crisp orchard apples for wholesome low-fat snacking and autumn bakes.',
    keywords: ['dried apple', 'apple rings', 'dried apples', 'dehydrated apple'],
  },
];

export const INITIAL_DRIED_FRUITS_COLLECTIONS: DriedFruitCollection[] =
  RAW_DRIED_FRUITS_COLLECTIONS.map((item, idx) => ({
    id: `df-${item.slug}`,
    name: item.name,
    slug: item.slug,
    parentCategory: 'Dried Fruits',
    parentSlug: 'dried-fruits',
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

export function mergeDriedFruitsCollections(
  existing: DriedFruitCollection[] = []
): DriedFruitCollection[] {
  const existingById = new Map(existing.map((c) => [c.id.toLowerCase(), c]));
  return INITIAL_DRIED_FRUITS_COLLECTIONS.map((seed) => {
    const prev = existingById.get(seed.id.toLowerCase());
    if (!prev) return seed;

    const prevImage =
      typeof prev.image === 'string' ? prev.image.trim() : '';
    const useImage = prevImage || seed.image || '';
    const imageStatus: DriedFruitCollection['imageStatus'] = !useImage
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

export function getDriedFruitCollectionPath(
  col: Pick<DriedFruitCollection, 'slug'>
): string {
  return `/dried-fruits/${col.slug}`;
}

export function findDriedFruitCollection(
  collections: DriedFruitCollection[],
  slugOrName?: string
): DriedFruitCollection | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;
  return collections.find(
    (c) =>
      c.slug.toLowerCase() === clean ||
      c.id.toLowerCase() === clean ||
      c.id.toLowerCase() === `df-${clean}` ||
      c.name.toLowerCase() === clean
  );
}

export function productMatchesDriedFruitCollection(
  product: Product,
  collection: DriedFruitCollection
): boolean {
  const catLower = (product.category || '').toLowerCase().trim();
  if (catLower !== 'dry fruits' && catLower !== 'dried fruits') {
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

  // Avoid cross-matching if product explicitly specifies a different dried fruit variety
  if (
    subSubLower &&
    subSubLower !== 'dried fruits' &&
    subSubLower !== 'dry fruits'
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

  return collection.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}
