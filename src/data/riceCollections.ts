import type { Product, RiceCollection, RiceMealGroupName } from '../types';

export interface RiceMealGroupMeta {
  name: RiceMealGroupName;
  slug: 'breakfast' | 'lunch' | 'dinner';
  bannerImage: string;
  subtitle: string;
  description: string;
  varietyCount: number;
}

export const RICE_MEAL_GROUPS: RiceMealGroupMeta[] = [
  {
    name: 'Breakfast',
    slug: 'breakfast',
    bannerImage: '/images/groceries/rice/category-banners/breakfast-rice.jpg',
    subtitle: 'Groceries · Rice · Breakfast',
    description:
      'Raw idli, dosa, puttu, red idli, and parboiled idli rice varieties selected for batter fermentation and traditional morning dishes, while remaining versatile across daily meals.',
    varietyCount: 5,
  },
  {
    name: 'Lunch',
    slug: 'lunch',
    bannerImage: '/images/groceries/rice/category-banners/lunch-rice.jpg',
    subtitle: 'Groceries · Rice · Lunch',
    description:
      'Ponni, Sona Masoori, Basmati, Seeraga Samba, Matta, and Brown rice grains suited for everyday midday thalis, pulavs, biryanis, and wholesome family meals.',
    varietyCount: 6,
  },
  {
    name: 'Dinner',
    slug: 'dinner',
    bannerImage: '/images/groceries/rice/category-banners/dinner-rice.jpg',
    subtitle: 'Groceries · Rice · Dinner',
    description:
      'Raw, parboiled, red, black, and hand-pounded rice grains ideal for comforting evening plates and lighter home-cooked meals.',
    varietyCount: 5,
  },
];

export const INITIAL_RICE_COLLECTIONS: RiceCollection[] = [
  // Breakfast Rice (5 Varieties) — raw rice product photography
  {
    id: 'rice-breakfast-idli-rice',
    name: 'Idli Rice',
    slug: 'idli-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Breakfast',
    parentGroupSlug: 'breakfast',
    image: '/images/groceries/rice/breakfast/idli-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/breakfast/idli-rice.jpg',
    imageStatus: 'generated',
    description:
      'Short, plump white raw rice grains traditionally milled for grinding smooth fermented batter, suited for soft idlis as well as snacks and evening tiffin.',
    keywords: ['idli rice', 'idly rice', 'special idli rice', 'short grain idli rice', 'breakfast rice'],
    status: 'approved',
    approved: true,
    displayOrder: 1,
  },
  {
    id: 'rice-breakfast-dosa-rice',
    name: 'Dosa Rice',
    slug: 'dosa-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Breakfast',
    parentGroupSlug: 'breakfast',
    image: '/images/groceries/rice/breakfast/dosa-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/breakfast/dosa-rice.jpg',
    imageStatus: 'generated',
    description:
      'Raw white rice grains prepared for smooth dosa batter grinding, helping achieve a golden, crisp roast for morning or evening dosa meals.',
    keywords: ['dosa rice', 'dosai rice', 'dosa batter rice', 'breakfast rice'],
    status: 'approved',
    approved: true,
    displayOrder: 2,
  },
  {
    id: 'rice-breakfast-puttu-rice',
    name: 'Puttu Rice',
    slug: 'puttu-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Breakfast',
    parentGroupSlug: 'breakfast',
    image: '/images/groceries/rice/breakfast/puttu-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/breakfast/puttu-rice.jpg',
    imageStatus: 'generated',
    description:
      'Coarsely crushed puttu rice grains and coarse rice meal textured for steamed layered puttu—clearly distinct from fine all-purpose rice flour.',
    keywords: ['puttu rice', 'puttu podi', 'coarse puttu rice', 'puttu rice grains', 'breakfast rice'],
    status: 'approved',
    approved: true,
    displayOrder: 3,
  },
  {
    id: 'rice-breakfast-red-idli-rice',
    name: 'Red Idli Rice',
    slug: 'red-idli-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Breakfast',
    parentGroupSlug: 'breakfast',
    image: '/images/groceries/rice/breakfast/red-idli-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/breakfast/red-idli-rice.jpg',
    imageStatus: 'generated',
    description:
      'Naturally red-tinted short rice grains rich in traditional bran colour for earthy idli, dosa, or wholesome tiffin batters at any meal.',
    keywords: ['red idli rice', 'red rice batter', 'sigappu idli arisi', 'breakfast rice'],
    status: 'approved',
    approved: true,
    displayOrder: 4,
  },
  {
    id: 'rice-breakfast-parboiled-idli-rice',
    name: 'Parboiled Idli Rice',
    slug: 'parboiled-idli-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Breakfast',
    parentGroupSlug: 'breakfast',
    image: '/images/groceries/rice/breakfast/parboiled-idli-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/breakfast/parboiled-idli-rice.jpg',
    imageStatus: 'generated',
    description:
      'Golden-cream parboiled short rice grains steamed in the husk before milling for resilient texture and airy fermented batters.',
    keywords: ['parboiled idli rice', 'boiled idli rice', 'puzhungal idli arisi', 'breakfast rice'],
    status: 'approved',
    approved: true,
    displayOrder: 5,
  },

  // Lunch Rice (6 Varieties) — raw rice product photography
  {
    id: 'rice-lunch-ponni-rice',
    name: 'Ponni Rice',
    slug: 'ponni-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Lunch',
    parentGroupSlug: 'lunch',
    image: '/images/groceries/rice/lunch/ponni-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/lunch/ponni-rice.jpg',
    imageStatus: 'generated',
    description:
      'Medium-grain Cauvery delta Ponni rice that cooks light and separate, widely enjoyed with sambar, rasam, and curries for both lunch and dinner.',
    keywords: ['ponni rice', 'boiled ponni rice', 'raw ponni rice', 'thanjavur ponni'],
    status: 'approved',
    approved: true,
    displayOrder: 6,
  },
  {
    id: 'rice-lunch-sona-masoori-rice',
    name: 'Sona Masoori Rice',
    slug: 'sona-masoori-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Lunch',
    parentGroupSlug: 'lunch',
    image: '/images/groceries/rice/lunch/sona-masoori-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/lunch/sona-masoori-rice.jpg',
    imageStatus: 'generated',
    description:
      'Lightweight, aromatic medium-slender white rice grains that turn soft and fluffy for everyday South Indian rice plates, pulao, and variety rice.',
    keywords: ['sona masoori', 'sona masoori rice', 'sona masuri', 'steam rice'],
    status: 'approved',
    approved: true,
    displayOrder: 7,
  },
  {
    id: 'rice-lunch-basmati-rice',
    name: 'Basmati Rice',
    slug: 'basmati-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Lunch',
    parentGroupSlug: 'lunch',
    image: '/images/groceries/rice/lunch/basmati-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/lunch/basmati-rice.jpg',
    imageStatus: 'generated',
    description:
      'Long, slender aromatic grains celebrated for signature fragrance and clean grain elongation in layered biryanis, pulao, and festive lunch or dinner spreads.',
    keywords: ['basmati', 'basmati rice', 'aged basmati', 'biryani rice', 'long grain'],
    status: 'approved',
    approved: true,
    displayOrder: 8,
  },
  {
    id: 'rice-lunch-seeraga-samba-rice',
    name: 'Seeraga Samba Rice',
    slug: 'seeraga-samba-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Lunch',
    parentGroupSlug: 'lunch',
    image: '/images/groceries/rice/lunch/seeraga-samba-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/lunch/seeraga-samba-rice.jpg',
    imageStatus: 'generated',
    description:
      'Tiny oval aromatic rice grains resembling cumin seeds, prized across Tamil Nadu for fragrant regional biryanis, ghee rice, and festive meals.',
    keywords: ['seeraga samba', 'seeraga samba rice', 'jeerakasala', 'small grain biryani rice'],
    status: 'approved',
    approved: true,
    displayOrder: 9,
  },
  {
    id: 'rice-lunch-matta-rice',
    name: 'Matta Rice',
    slug: 'matta-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Lunch',
    parentGroupSlug: 'lunch',
    image: '/images/groceries/rice/lunch/matta-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/lunch/matta-rice.jpg',
    imageStatus: 'generated',
    description:
      'Bold, rose-tinted Palakkad Kerala Matta grains retaining outer pericarp layers for a hearty, nutty bite with traditional curries and avial.',
    keywords: ['matta rice', 'kerala matta', 'rose matta', 'rosematta', 'palakkad matta'],
    status: 'approved',
    approved: true,
    displayOrder: 10,
  },
  {
    id: 'rice-lunch-brown-rice',
    name: 'Brown Rice',
    slug: 'brown-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Lunch',
    parentGroupSlug: 'lunch',
    image: '/images/groceries/rice/lunch/brown-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/lunch/brown-rice.jpg',
    imageStatus: 'generated',
    description:
      'Whole-grain unpolished brown rice retaining its natural golden-tan bran layer for nutty aroma and hearty texture in grain bowls or traditional meals.',
    keywords: ['brown rice', 'whole grain brown rice', 'unpolished brown rice'],
    status: 'approved',
    approved: true,
    displayOrder: 11,
  },

  // Dinner Rice (5 Varieties) — raw rice product photography
  {
    id: 'rice-dinner-raw-rice',
    name: 'Raw Rice',
    slug: 'raw-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Dinner',
    parentGroupSlug: 'dinner',
    image: '/images/groceries/rice/dinner/raw-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/dinner/raw-rice.jpg',
    imageStatus: 'generated',
    description:
      'Clean, uncooked milled white raw rice (Pacharisi) suited for soft steamed rice, pongal, variety rice dishes, and mild evening meals.',
    keywords: ['raw rice', 'pacharisi', 'uncooked white rice', 'pachai arisi'],
    status: 'approved',
    approved: true,
    displayOrder: 12,
  },
  {
    id: 'rice-dinner-parboiled-rice',
    name: 'Parboiled Rice',
    slug: 'parboiled-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Dinner',
    parentGroupSlug: 'dinner',
    image: '/images/groceries/rice/dinner/parboiled-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/dinner/parboiled-rice.jpg',
    imageStatus: 'generated',
    description:
      'Golden-amber steamed parboiled rice grains milled after gentle soaking and steaming for non-sticky, light, and easily digestible everyday meals.',
    keywords: ['parboiled rice', 'puzhungal arisi', 'boiled rice', 'ukda rice'],
    status: 'approved',
    approved: true,
    displayOrder: 13,
  },
  {
    id: 'rice-dinner-red-rice',
    name: 'Red Rice',
    slug: 'red-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Dinner',
    parentGroupSlug: 'dinner',
    image: '/images/groceries/rice/dinner/red-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/dinner/red-rice.jpg',
    imageStatus: 'generated',
    description:
      'Naturally reddish-brown whole unpolished rice grains prized for rustic earthiness in evening kanji, side curries, and balanced daily plates.',
    keywords: ['red rice', 'sigappu arisi', 'mappillai samba', 'unpolished red rice'],
    status: 'approved',
    approved: true,
    displayOrder: 14,
  },
  {
    id: 'rice-dinner-black-rice',
    name: 'Black Rice',
    slug: 'black-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Dinner',
    parentGroupSlug: 'dinner',
    image: '/images/groceries/rice/dinner/black-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/dinner/black-rice.jpg',
    imageStatus: 'generated',
    description:
      'Deep purple-black heritage rice grains (Kavuni / Chak-Hao) offering a rich, mildly nutty flavour suited for evening grain bowls and traditional sweets.',
    keywords: ['black rice', 'karuppu kavuni', 'forbidden rice', 'purple black rice'],
    status: 'approved',
    approved: true,
    displayOrder: 15,
  },
  {
    id: 'rice-dinner-hand-pounded-rice',
    name: 'Hand-Pounded Rice',
    slug: 'hand-pounded-rice',
    parentCategory: 'Groceries',
    parentSubcategory: 'Rice',
    parentGroup: 'Dinner',
    parentGroupSlug: 'dinner',
    image: '/images/groceries/rice/dinner/hand-pounded-rice.jpg',
    expectedFilename: 'public/images/groceries/rice/dinner/hand-pounded-rice.jpg',
    imageStatus: 'generated',
    description:
      'Traditionally husked, lightly unpolished rice retaining subtle cream bran streaks and authentic rustic grain character across evening and daytime meals.',
    keywords: ['hand-pounded rice', 'hand pounded rice', 'kai kuthal arisi', 'kaikuthal'],
    status: 'approved',
    approved: true,
    displayOrder: 16,
  },
];

export function getRiceCollectionPath(col: RiceCollection): string {
  return `/groceries/rice/${col.parentGroupSlug}/${col.slug}`;
}

export function findRiceMealGroupBySlug(
  value?: string
): RiceMealGroupMeta | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase().trim();
  const aliasMap: Record<string, RiceMealGroupName> = {
    breakfast: 'Breakfast',
    'breakfast-rice': 'Breakfast',
    lunch: 'Lunch',
    'lunch-rice': 'Lunch',
    dinner: 'Dinner',
    'dinner-rice': 'Dinner',
  };
  const target = aliasMap[normalized];
  if (target) {
    return RICE_MEAL_GROUPS.find((g) => g.name === target);
  }
  return RICE_MEAL_GROUPS.find(
    (g) =>
      g.slug.toLowerCase() === normalized ||
      g.name.toLowerCase() === normalized
  );
}

export function findRiceCollection(
  slugOrId: string,
  mealGroupOrSlug?: string,
  collections: RiceCollection[] = INITIAL_RICE_COLLECTIONS
): RiceCollection | undefined {
  const clean = (slugOrId || '').toLowerCase().trim();
  if (!clean) return undefined;
  const mealMeta = mealGroupOrSlug
    ? findRiceMealGroupBySlug(mealGroupOrSlug)
    : undefined;

  if (mealMeta) {
    const scoped = collections.find(
      (c) =>
        c.parentGroup === mealMeta.name &&
        (c.slug.toLowerCase() === clean ||
          c.id.toLowerCase() === clean ||
          c.name.toLowerCase() === clean)
    );
    if (scoped) return scoped;
  }

  return collections.find(
    (c) =>
      c.slug.toLowerCase() === clean ||
      c.id.toLowerCase() === clean ||
      c.name.toLowerCase() === clean
  );
}

export function productMatchesRiceCollection(
  product: Product,
  collection: RiceCollection
): boolean {
  const catLower = (product.category || '').toLowerCase().trim();
  const subLower = (product.subcategory || '').toLowerCase().trim();
  const isRiceProduct =
    catLower === 'rice' ||
    ((catLower === 'groceries' || catLower === 'grocery') && subLower === 'rice');
  if (!isRiceProduct) return false;

  const primaryText = [
    product.name || '',
    product.slug || '',
    product.tag || '',
    ...(product.tags || []),
  ]
    .join(' ')
    .toLowerCase();

  // Specific match rules so generic or closely named varieties do not false-positive
  switch (collection.slug) {
    case 'idli-rice':
      return (
        primaryText.includes('idli rice') &&
        !primaryText.includes('red idli') &&
        !primaryText.includes('parboiled idli')
      );
    case 'red-idli-rice':
      return primaryText.includes('red idli');
    case 'parboiled-idli-rice':
      return primaryText.includes('parboiled idli');
    case 'dosa-rice':
      return primaryText.includes('dosa rice') || primaryText.includes('dosai rice');
    case 'puttu-rice':
      return primaryText.includes('puttu rice');
    case 'ponni-rice':
      return primaryText.includes('ponni');
    case 'sona-masoori-rice':
      return primaryText.includes('sona masoori') || primaryText.includes('sona masuri');
    case 'basmati-rice':
      return primaryText.includes('basmati');
    case 'seeraga-samba-rice':
      return primaryText.includes('seeraga samba') || primaryText.includes('jeerakasala');
    case 'matta-rice':
      return primaryText.includes('matta');
    case 'brown-rice':
      return primaryText.includes('brown rice');
    case 'raw-rice':
      return primaryText.includes('raw rice') || primaryText.includes('pacharisi');
    case 'parboiled-rice':
      return (
        (primaryText.includes('parboiled rice') || primaryText.includes('puzhungal')) &&
        !primaryText.includes('idli') &&
        !primaryText.includes('ponni')
      );
    case 'red-rice':
      return (
        (primaryText.includes('red rice') || primaryText.includes('sigappu')) &&
        !primaryText.includes('idli')
      );
    case 'black-rice':
      return primaryText.includes('black rice') || primaryText.includes('kavuni');
    case 'hand-pounded-rice':
      return (
        primaryText.includes('hand-pounded') ||
        primaryText.includes('hand pounded') ||
        primaryText.includes('kai kuthal') ||
        primaryText.includes('kaikuthal')
      );
    default:
      return (collection.keywords || []).some((kw) =>
        primaryText.includes(kw.toLowerCase())
      );
  }
}
