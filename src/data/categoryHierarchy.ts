import type { CategoryInfo, Product, ProductCategory } from '../types';

export const WHOLE_SPICE_SUBCATEGORIES: string[] = [
  'Green Cardamom (Elakkai)',
  'Cloves (Lavangam)',
  'Cinnamon (Pattai)',
  'Cumin Seeds (Seeragam)',
  'Black Pepper (Milagu)',
  'Star Anise (Annasi Poo)',
  'Fennel Seeds (Sombu)',
  'Coriander Seeds (Dhaniya)',
  'Mustard Seeds (Kadugu)',
  'Fenugreek Seeds (Vendhayam)',
  'Whole Turmeric (Virali Manjal)',
  'Bay Leaves',
  'Nutmeg (Jathikkai)',
  'Mace (Jathipathri)',
  'Carom Seeds (Omam)',
  'Kalpasi (Black Stone Flower)',
  'Dried Red Chillies',
];

export const MASALA_POWDER_SUBCATEGORIES: string[] = [
  'Red Chilli Powder',
  'Turmeric Powder',
  'Coriander Powder',
  'Cumin Powder',
  'Black Pepper Powder',
  'Cinnamon Powder',
  'Asafoetida (Hing Powder)',
  'Garam Masala',
  'Sambar Powder',
  'Rasam Powder',
  'Biryani Masala',
  'Chicken Masala',
  'Mutton Masala',
  'Fish Curry Masala',
  'Curry Masala',
];

export const MAIN_CATEGORY_DEFINITIONS: CategoryInfo[] = [
  {
    id: 'Temple',
    name: 'Temple & Pooja Essentials',
    title: 'Temple & Pooja Essentials',
    slug: 'temple-pooja-essentials',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Sacred Offerings & Brass Idols',
    description:
      'Handcrafted brass diyas, sacred pooja bells, pure kumkum, temple dhoop, chandan paste, and pooja samagri for home rituals and spiritual serenity.',
    image: '/images/temple-kit/basket.png',
    displayOrder: 1,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'honey',
    accentColor: '#D97706',
    itemCount: 11,
  },
  {
    id: 'Baby Kit',
    name: 'Baby Kit',
    title: 'Baby Kit Collection',
    slug: 'baby-kit',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Everything Your Little One Needs.',
    description:
      'Explore everyday baby care products, useful accessories and traditional essentials in one convenient collection.',
    image: '/images/baby-kit/baby powder.png',
    displayOrder: 2,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'grocery',
    accentColor: '#EC4899',
    itemCount: 12,
  },
  {
    id: 'Kids',
    name: 'Kids',
    title: 'Kids',
    slug: 'kids',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Ages 3–12 · Clothing, Footwear, Toys, School & Everyday Essentials',
    description:
      "Complete Kids shopping collection for boys and girls ages 3–12 across Boys' Clothing, Girls' Clothing, Kids' Footwear, School Essentials, Toys & Games, Learning & Creativity, Kids' Accessories, Personal Care, Sports & Outdoor, Bedroom & Lifestyle, and Feeding & Travel.",
    image: '/images/categories/kids.jpg',
    displayOrder: 3,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'watch',
    accentColor: '#F59E0B',
    itemCount: 65,
  },
  {
    id: 'Teenager',
    name: 'Teenagers',
    title: 'Teenagers',
    slug: 'teenagers',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Ages 13–19 · Fashion, School, Tech, Sports & Hobbies',
    description:
      "Complete teenage shopping collection for boys and girls ages 13–19 across Teenage Boys' Fashion, Teenage Girls' Fashion, Footwear, School & College Essentials, Electronics & Gadgets, Personal Care, Fashion Accessories, Sports & Fitness, Room & Lifestyle, and Hobbies & Creativity.",
    image: '/images/categories/teenagers.jpg',
    displayOrder: 4,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'watch',
    accentColor: '#8B5CF6',
    itemCount: 64,
  },
  {
    id: 'School Kit',
    name: 'School Kit',
    title: 'School Kit',
    slug: 'school-kit',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Everything Your Child Needs for School.',
    description:
      'Discover school essentials, stationery, learning materials and everyday accessories in one convenient collection.',
    image: '/images/school-kit/school bag.png',
    displayOrder: 5,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'grocery',
    accentColor: '#10B981',
    itemCount: 16,
  },
  {
    id: 'Groceries',
    name: 'Groceries',
    title: 'Fresh Groceries & Pantry Staples',
    slug: 'groceries',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Rice, Millets, Cereals & Health Foods',
    description:
      'Daily rice varieties for breakfast, lunch & dinner, wholesome millets, nutritious cereals, quick ready-to-cook foods, and traditional healthy sweets.',
    image: '/images/categories/groceries.jpg',
    displayOrder: 6,
    status: 'active',
    subcategories: [
      'Rice',
      'Millets',
      'Cereals',
      'Ready-to-Cook Foods',
      'Health Foods',
    ],
    hierarchyChildren: [
      {
        name: 'Rice',
        slug: 'rice',
        children: ['Breakfast', 'Lunch', 'Dinner'],
      },
      {
        name: 'Millets',
        slug: 'millets',
        children: [],
      },
      {
        name: 'Cereals',
        slug: 'cereals',
        children: [],
      },
      {
        name: 'Ready-to-Cook Foods',
        slug: 'ready-to-cook-foods',
        children: [],
      },
      {
        name: 'Health Foods',
        slug: 'health-foods',
        children: ['Healthy Sweets'],
      },
    ],
    modelType: 'rice',
    accentColor: '#1D6FD8',
    itemCount: 24,
  },
  {
    id: 'Dry Nuts',
    name: 'Nuts',
    title: 'Premium Edible Nuts',
    slug: 'nuts',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Almonds, Cashews, Pistachios & Walnuts',
    description:
      'Jumbo California almonds, W320 Mangalore cashews, roasted salted pistachios, and rich Kashmiri walnut kernels vacuum-sealed for peak crunch.',
    image: '/images/categories/nuts.jpg',
    displayOrder: 7,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'grocery',
    accentColor: '#D97706',
    itemCount: 8,
  },
  {
    id: 'Dry Fruits',
    name: 'Dried Fruits',
    title: 'Naturally Sun-Dried Fruits',
    slug: 'dried-fruits',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Medjool Dates, Figs, Berries & Apricots',
    description:
      'Succulent Medjool dates, sun-dried Turkish figs (Anjeer), organic black raisins, dried cranberries, and golden dried apricots rich in natural nutrients.',
    image: '/images/categories/dried-fruits.jpg',
    displayOrder: 8,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'grocery',
    accentColor: '#B45309',
    itemCount: 8,
  },
  {
    id: 'Hair Care',
    name: 'Hair Care',
    title: 'Herbal & Nourishing Hair Care',
    slug: 'hair-care',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Bhringraj Oils, Herbal Shampoos & Masks',
    description:
      'Cold-pressed rosemary bhringraj hair oils, gentle sulphate-free shikakai cleansers, biotin hair masks, and scalp care tonics for strong, lustrous locks.',
    image: '/images/categories/hair-care.jpg',
    displayOrder: 9,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'honey',
    accentColor: '#059669',
    itemCount: 8,
  },
  {
    id: 'Skin Care',
    name: 'Skin Care',
    title: 'Botanical Skin Care & Rituals',
    slug: 'skin-care',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Kumkumadi, Vitamin C & Hydration',
    description:
      'Traditional Kumkumadi tailam glow serums, saffron face mists, deep hydration moisture gels, SPF 50 sunscreens, and revitalizing clay face polishes.',
    image: '/images/categories/skin-care.jpg',
    displayOrder: 10,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'honey',
    accentColor: '#EC4899',
    itemCount: 8,
  },
  {
    id: 'Electronics',
    name: 'Electronics',
    title: 'Smart Gadgets & Everyday Electronics',
    slug: 'electronics',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Audio, Fast Chargers & Smart Wearables',
    description:
      'ANC wireless earbuds, MagSafe fast power banks, 65W GaN multi-port wall adapters, smart LED lamps, and Bluetooth party speakers with immersive bass.',
    image: '/images/categories/electronics.jpg',
    displayOrder: 11,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'watch',
    accentColor: '#2563EB',
    itemCount: 8,
  },
  {
    id: 'Furniture',
    name: 'Furniture',
    title: 'Solid Wood & Modern Comfort Furniture',
    slug: 'furniture',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Teak Stools, Recliners & Storage',
    description:
      'Solid Sheesham wood coffee tables, ergonomic high-back study chairs, compact multi-tier shoe racks, nested side stools, and minimalist bookshelves.',
    image: '/images/categories/furniture.jpg',
    displayOrder: 12,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'grocery',
    accentColor: '#78350F',
    itemCount: 8,
  },
  {
    id: 'Prank Items',
    name: 'Pranks & Novelties',
    title: 'Pranks & Novelties Collection',
    slug: 'pranks-novelties',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Party Novelties & Fun Gag Gifts',
    description:
      'Shocking pens, whoopee cushions, fake spider boxes, hilarious trick snakes, invisible ink pens, and lighthearted prank toys to brighten any family gathering.',
    image: '/images/categories/pranks-novelties.jpg',
    displayOrder: 13,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'watch',
    accentColor: '#EF4444',
    itemCount: 8,
  },
  {
    id: 'Used Bikes and Cars',
    name: 'Used Bikes & Cars',
    title: 'Verified Used Bikes & Cars',
    slug: 'used-bikes-and-cars',
    parentCategoryId: null,
    parentId: null,
    subtitle: '50-Point Inspected · Test Rides & Direct Enquiry',
    description:
      'Carefully certified pre-owned motorcycles, gearless scooters, family hatchbacks, and sedans. Transparent mileage history, verified ownership documents, and hassle-free enquiry.',
    image: '/images/categories/used-bikes-cars.jpg',
    displayOrder: 14,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'watch',
    accentColor: '#FF6B1A',
    itemCount: 0,
  },
  {
    id: 'Dry Peas',
    name: 'Dried Peas',
    title: 'Wholesome Green & White Dried Peas',
    slug: 'dried-peas',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Protein-Rich Sundal & Chaat Legumes',
    description:
      'Clean sun-dried green peas (Pachai Pattani) and premium white vatana peas, perfect for South Indian sundal, ragda patties, and hearty curries.',
    image: '/images/categories/dried-peas.jpg',
    displayOrder: 15,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'grocery',
    accentColor: '#16A34A',
    itemCount: 6,
  },
  {
    id: 'Gym',
    name: 'Fitness & Gym',
    title: 'Fitness & Gym Equipment',
    slug: 'fitness-gym',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Dumbbells, Resistance Bands & Benches',
    description:
      'Hex rubber dumbbells, latex resistance loop bands, non-slip thick gym mats, adjustable workout benches, and protein shaker bottles.',
    image: '/images/categories/fitness-gym.jpg',
    displayOrder: 16,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'watch',
    accentColor: '#DC2626',
    itemCount: 8,
  },
  {
    id: 'Sports',
    name: 'Sports',
    title: 'Cricket, Badminton & Outdoor Sports',
    slug: 'sports',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Kashmir Willow, Shuttlecocks & Footballs',
    description:
      'Grade 1 Kashmir willow cricket bats, high-durability nylon shuttlecocks, carbon-fiber badminton racquets, stitched match footballs, and sports kit bags.',
    image: '/images/categories/sports.jpg',
    displayOrder: 17,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'watch',
    accentColor: '#0284C7',
    itemCount: 8,
  },
  {
    id: 'Accessories',
    name: 'Accessories',
    title: 'Everyday Accessories, Wallets & Watches',
    slug: 'accessories',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Genuine Leather, Sunglasses & Timepieces',
    description:
      'Handcrafted full-grain leather wallets, polarized UV400 aviator sunglasses, automatic skeleton watches, brass keychains, and premium cufflinks.',
    image: '/images/categories/accessories.jpg',
    displayOrder: 18,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'watch',
    accentColor: '#475569',
    itemCount: 12,
  },
  {
    id: 'Footwear',
    name: 'Footwear',
    title: 'Comfort Walking Shoes & Sandals',
    slug: 'footwear',
    parentCategoryId: null,
    parentId: null,
    subtitle: 'Breathable Sneakers & Ethnic Kolhapuris',
    description:
      'Memory foam running sneakers, genuine leather formal brogues, handcrafted Kolhapuri chappals, and waterproof cushioned slide sandals for all-day comfort.',
    image: '/images/categories/footwear.jpg',
    displayOrder: 19,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'watch',
    accentColor: '#334155',
    itemCount: 8,
  },
  {
    id: 'Fashion',
    name: 'Fashion',
    title: "Men's & Women's Fashion",
    slug: 'fashion',
    parentCategoryId: null,
    parentId: null,
    subtitle: "Men's Fashion & Women's Fashion",
    description:
      "Curated apparel featuring Men's Fashion (Shirts, Trousers, Pants, T-Shirts) and Women's Fashion (Churidar Sets, Traditional Wear, Sarees, Lehengas, Korean Fashion, Bottom Wear, Shawls & Stoles, Tops, Skirts, Nightwear Sets, Long Coats, Track Pants, T-Shirts).",
    image: '/images/categories/fashion.jpg',
    displayOrder: 20,
    status: 'active',
    subcategories: ["Men's Fashion", "Women's Fashion"],
    hierarchyChildren: [
      {
        name: "Men's Fashion",
        slug: 'mens-fashion',
        children: ['Shirts', 'Trousers', 'Pants', 'T-Shirts'],
      },
      {
        name: "Women's Fashion",
        slug: 'womens-fashion',
        children: [
          'Churidar Sets',
          'Traditional Wear',
          'Sarees',
          'Lehengas',
          'Korean Fashion',
          'Bottom Wear',
          'Shawls & Stoles',
          'Tops',
          'Skirts',
          'Nightwear Sets',
          'Long Coats',
          'Track Pants',
          'T-Shirts',
        ],
      },
    ],
    modelType: 'watch',
    accentColor: '#BE185D',
    itemCount: 22,
  },
];

export const GROCERIES_SUBCATEGORY_DEFINITIONS: CategoryInfo[] = [
  {
    id: 'whole-spices',
    name: 'Whole Spices',
    title: 'Whole Spices Collection',
    slug: 'whole-spices',
    parentCategoryId: 'Groceries',
    parentId: 'Groceries',
    subtitle: 'Groceries · Whole Spices',
    description:
      'Sun-cured aromatic whole spices including Green Cardamom (Elakkai), Cloves (Lavangam), Cinnamon (Pattai), Cumin Seeds (Seeragam), Black Pepper (Milagu), and regional South Indian spices.',
    image: '/images/categories/whole-spices.jpg',
    displayOrder: 6,
    status: 'active',
    subcategories: [...WHOLE_SPICE_SUBCATEGORIES],
    hierarchyChildren: WHOLE_SPICE_SUBCATEGORIES.map((name) => ({
      name,
      slug: name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      children: [],
    })),
    modelType: 'grocery',
    accentColor: '#16A34A',
    itemCount: 4,
  },
  {
    id: 'masala-powders',
    name: 'Masala Powders',
    title: 'Masala Powders Collection',
    slug: 'masala-powders',
    parentCategoryId: 'Groceries',
    parentId: 'Groceries',
    subtitle: 'Groceries · Masala Powders',
    description:
      'Freshly ground single-origin spice powders and authentic regional blends including Red Chilli Powder, Turmeric Powder, Sambar Powder, Rasam Powder, Garam Masala, and Biryani Masala.',
    image: '/images/categories/masala-powders.jpg',
    displayOrder: 7,
    status: 'active',
    subcategories: [...MASALA_POWDER_SUBCATEGORIES],
    hierarchyChildren: MASALA_POWDER_SUBCATEGORIES.map((name) => ({
      name,
      slug: name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      children: [],
    })),
    modelType: 'grocery',
    accentColor: '#FF6B1A',
    itemCount: 0,
  },
];

export const TEMPLE_SUBCATEGORY_DEFINITIONS: CategoryInfo[] = [
  {
    id: 'temple-kit',
    name: 'Temple Kit',
    title: 'Everything You Need for Your Pooja.',
    slug: 'temple-kit',
    parentCategoryId: 'Temple',
    parentId: 'Temple',
    subtitle: 'Temple & Pooja Essentials · Temple Kit',
    description:
      'Explore traditional pooja essentials, thoughtfully brought together for your everyday rituals and special occasions.',
    image: '/images/temple-kit/basket.png',
    displayOrder: 1,
    status: 'active',
    subcategories: [],
    hierarchyChildren: [],
    modelType: 'honey',
    accentColor: '#D97706',
    itemCount: 12,
  },
];

// Canonical customer-facing display names keyed by stable category IDs & legacy labels
export const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  temple: 'Temple & Pooja Essentials',
  'temple & pooja essentials': 'Temple & Pooja Essentials',
  baby: 'Baby Kit',
  'baby care': 'Baby Kit',
  'baby-care': 'Baby Kit',
  'baby kit': 'Baby Kit',
  'baby-kit': 'Baby Kit',
  kids: 'Kids',
  teenager: 'Teenagers',
  teenagers: 'Teenagers',
  school: 'School Kit',
  'school supplies': 'School Kit',
  'school-supplies': 'School Kit',
  'school kit': 'School Kit',
  'school-kit': 'School Kit',
  groceries: 'Groceries',
  grocery: 'Groceries',
  rice: 'Groceries',
  'dry nuts': 'Nuts',
  nuts: 'Nuts',
  'dry fruits': 'Dried Fruits',
  'dried fruits': 'Dried Fruits',
  'hair care': 'Hair Care',
  'skin care': 'Skin Care',
  electronics: 'Electronics',
  furniture: 'Furniture',
  'prank items': 'Pranks & Novelties',
  'pranks & novelties': 'Pranks & Novelties',
  'used bikes and cars': 'Used Bikes & Cars',
  'used bikes & cars': 'Used Bikes & Cars',
  'dry peas': 'Dried Peas',
  'dried peas': 'Dried Peas',
  gym: 'Fitness & Gym',
  'fitness & gym': 'Fitness & Gym',
  sports: 'Sports',
  accessories: 'Accessories',
  footwear: 'Footwear',
  fashion: 'Fashion',
  honey: 'Groceries',
  watches: 'Accessories',
};

export const SUBCATEGORY_DISPLAY_MAP: Record<string, string> = {
  'ready to cook': 'Ready-to-Cook Foods',
  'ready-to-cook': 'Ready-to-Cook Foods',
  'ready-to-cook-foods': 'Ready-to-Cook Foods',
  'ready-to-cook foods': 'Ready-to-Cook Foods',
  health: 'Health Foods',
  'health foods': 'Health Foods',
  'whole spices': 'Whole Spices',
  'whole-spices': 'Whole Spices',
  'masala powders': 'Masala Powders',
  'masala-powders': 'Masala Powders',
  'temple kit': 'Temple Kit',
  'temple-kit': 'Temple Kit',
  'school kit': 'School Kit',
  'school-kit': 'School Kit',
  'baby kit': 'Baby Kit',
  'baby-kit': 'Baby Kit',
  men: "Men's Fashion",
  "men's fashion": "Men's Fashion",
  women: "Women's Fashion",
  "women's fashion": "Women's Fashion",
};

export const THIRD_LEVEL_DISPLAY_MAP: Record<string, string> = {
  'health sweets': 'Healthy Sweets',
  'healthy sweets': 'Healthy Sweets',
  chudithar: 'Churidar Sets',
  'churidar sets': 'Churidar Sets',
  'korean trends': 'Korean Fashion',
  'korean fashion': 'Korean Fashion',
  bottoms: 'Bottom Wear',
  'bottom wear': 'Bottom Wear',
  shawls: 'Shawls & Stoles',
  'shawls & stoles': 'Shawls & Stoles',
  'night sets': 'Nightwear Sets',
  'nightwear sets': 'Nightwear Sets',
  'dry red chillies': 'Dried Red Chillies',
  'dried red chillies': 'Dried Red Chillies',
  asafoetida: 'Asafoetida (Hing Powder)',
  'hing powder': 'Asafoetida (Hing Powder)',
  'asafoetida (hing powder)': 'Asafoetida (Hing Powder)',
};

export function getCategoryDisplayName(
  categoryIdOrName: string,
  runtimeCategories: CategoryInfo[] = []
): string {
  const clean = (categoryIdOrName || '').trim();
  if (!clean) return '';
  const mapped = CATEGORY_DISPLAY_MAP[clean.toLowerCase()];
  if (mapped) return mapped;
  const found = runtimeCategories.find(
    (c) =>
      c.id.toLowerCase() === clean.toLowerCase() ||
      (c.name && c.name.toLowerCase() === clean.toLowerCase()) ||
      c.slug.toLowerCase() === clean.toLowerCase()
  );
  return found?.name || clean;
}

export function getSubcategoryDisplayName(sub?: string): string {
  const clean = (sub || '').trim();
  if (!clean) return '';
  return SUBCATEGORY_DISPLAY_MAP[clean.toLowerCase()] || clean;
}

export function getThirdLevelDisplayName(third?: string): string {
  const clean = (third || '').trim();
  if (!clean) return '';
  return THIRD_LEVEL_DISPLAY_MAP[clean.toLowerCase()] || clean;
}

export const LEGACY_SLUG_REDIRECTS: Record<string, string> = {
  temple: '/temple-pooja-essentials',
  baby: '/baby-kit',
  'baby-care': '/baby-kit',
  teenager: '/teenagers',
  school: '/school-kit',
  'school-supplies': '/school-kit',
  'dry-nuts': '/nuts',
  'dry-fruits': '/dried-fruits',
  'prank-items': '/pranks-novelties',
  'dry-peas': '/dried-peas',
  gym: '/fitness-gym',
  grocery: '/groceries',
};

export interface FourthLevelNode {
  id: string;
  name: string;
  slug: string;
  path: string;
  displayOrder: number;
}

export interface ThirdLevelNode {
  id: string;
  name: string;
  slug: string;
  path: string;
  displayOrder: number;
  children?: FourthLevelNode[];
}

export interface SubcategoryNode {
  id: string;
  name: string;
  slug: string;
  path: string;
  displayOrder: number;
  children: ThirdLevelNode[];
}

export interface MainCategoryNode {
  id: string;
  name: string;
  title: string;
  slug: string;
  path: string;
  subtitle?: string;
  description: string;
  image?: string;
  accentColor?: string;
  modelType?: CategoryInfo['modelType'];
  displayOrder: number;
  subcategories: SubcategoryNode[];
}

export function slugifyCategory(cat: string): string {
  return cat
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Dynamically constructs a sorted, 3-level category tree from runtime CategoryInfo records.
 * Supports:
 * - Embedded hierarchyChildren + subcategories arrays (used by the 20 core departments)
 * - Relational parentCategoryId / parentId links (Level 1 -> Level 2 -> Level 3 added via Admin)
 * - Active status filtering & displayOrder sorting
 */
export function buildCategoryTree(
  categories: CategoryInfo[] = []
): MainCategoryNode[] {
  const source =
    categories && categories.length > 0
      ? categories
      : MAIN_CATEGORY_DEFINITIONS;

  const isActive = (cat: CategoryInfo) => cat.status !== 'inactive';
  const getParentId = (cat: CategoryInfo) =>
    (cat.parentCategoryId ?? cat.parentId ?? null)?.trim() || null;

  // Map IDs / names lowercase for relational lookups
  const activeRecords = source.filter(isActive);

  // Level 1: Top-level main categories (no parentCategoryId/parentId)
  const mainRecords = activeRecords
    .map((cat, index) => ({ cat, index }))
    .filter(({ cat }) => !getParentId(cat))
    .sort((a, b) => {
      const orderA = a.cat.displayOrder ?? 999;
      const orderB = b.cat.displayOrder ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.index - b.index;
    })
    .map(({ cat }) => cat);

  return mainRecords.map((main, mainIdx) => {
    const mainId = main.id;
    const mainName = main.name || main.id;
    const mainSlug = main.slug || slugifyCategory(mainId);

    const subMap = new Map<string, SubcategoryNode>();

    const ensureSub = (
      subId: string,
      subName: string,
      subSlug: string,
      order: number
    ): SubcategoryNode => {
      const key = subName.toLowerCase().trim();
      const existing = subMap.get(key);
      if (existing) return existing;
      const node: SubcategoryNode = {
        id: subId,
        name: subName,
        slug: subSlug || slugifyCategory(subName),
        path: `/shop?category=${encodeURIComponent(mainId)}&subcategory=${encodeURIComponent(subName)}`,
        displayOrder: order,
        children: [],
      };
      subMap.set(key, node);
      return node;
    };

    const addThirdLevel = (
      subNode: SubcategoryNode,
      childId: string,
      childName: string,
      childSlug: string,
      order: number
    ) => {
      const cleanName = childName.trim();
      if (!cleanName) return;
      if (
        subNode.children.some(
          (c) => c.name.toLowerCase() === cleanName.toLowerCase()
        )
      ) {
        return;
      }
      subNode.children.push({
        id: childId,
        name: cleanName,
        slug: childSlug || slugifyCategory(cleanName),
        path: `/shop?category=${encodeURIComponent(mainId)}&subcategory=${encodeURIComponent(
          subNode.name
        )}&subSubcategory=${encodeURIComponent(cleanName)}`,
        displayOrder: order,
      });
    };

    // 1. Seeded / embedded hierarchyChildren
    if (Array.isArray(main.hierarchyChildren)) {
      main.hierarchyChildren.forEach((child, idx) => {
        const subNode = ensureSub(
          `${mainId}::${child.name}`,
          child.name,
          child.slug,
          idx + 1
        );
        if (Array.isArray(child.children)) {
          child.children.forEach((grandName, gIdx) => {
            addThirdLevel(
              subNode,
              `${mainId}::${child.name}::${grandName}`,
              grandName,
              slugifyCategory(grandName),
              gIdx + 1
            );
            const addedThird = subNode.children[subNode.children.length - 1];
            const fourthList = child.subChildren?.[grandName];
            if (
              addedThird &&
              addedThird.name.toLowerCase() === grandName.trim().toLowerCase() &&
              Array.isArray(fourthList) &&
              fourthList.length > 0
            ) {
              const thirdSlug = slugifyCategory(grandName);
              if (mainId.toLowerCase() === 'groceries') {
                addedThird.path = `/groceries/${subNode.slug}/${thirdSlug}`;
              }
              addedThird.children = fourthList
                .map((fName) => fName.trim())
                .filter(Boolean)
                .map((fName, fIdx) => {
                  const fSlug = slugifyCategory(fName);
                  return {
                    id: `${mainId}::${child.name}::${grandName}::${fName}`,
                    name: fName,
                    slug: fSlug,
                    path:
                      mainId.toLowerCase() === 'groceries'
                        ? `/groceries/${subNode.slug}/${thirdSlug}/${fSlug}`
                        : `/shop?category=${encodeURIComponent(mainId)}&subcategory=${encodeURIComponent(
                            subNode.name
                          )}&subSubcategory=${encodeURIComponent(fName)}`,
                    displayOrder: fIdx + 1,
                  };
                });
            }
          });
        }
      });
    }

    // 2. Embedded string subcategories array (excluding Used Bikes and Cars combined rule if needed)
    if (
      Array.isArray(main.subcategories) &&
      mainSlug !== 'used-bikes-and-cars'
    ) {
      main.subcategories.forEach((subStr, idx) => {
        const trimmed = subStr.trim();
        if (!trimmed) return;
        ensureSub(
          `${mainId}::${trimmed}`,
          trimmed,
          slugifyCategory(trimmed),
          100 + idx
        );
      });
    }

    // 3. Relational Level 2 records referencing this main category
    const childCategories = activeRecords
      .map((cat, index) => ({ cat, index }))
      .filter(({ cat }) => {
        const pId = getParentId(cat);
        if (!pId) return false;
        const pLower = pId.toLowerCase();
        return (
          pLower === mainId.toLowerCase() ||
          pLower === mainName.toLowerCase() ||
          pLower === mainSlug.toLowerCase()
        );
      })
      .sort((a, b) => {
        const orderA = a.cat.displayOrder ?? 999;
        const orderB = b.cat.displayOrder ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.index - b.index;
      })
      .map(({ cat }) => cat);

    childCategories.forEach((childCat, idx) => {
      const childName = childCat.name || childCat.id;
      const subSlug = childCat.slug || slugifyCategory(childName);
      const subNode = ensureSub(
        childCat.id,
        childName,
        subSlug,
        childCat.displayOrder ?? 200 + idx
      );
      const isGroceriesSpiceBranch =
        mainId.toLowerCase() === 'groceries' &&
        (subSlug === 'whole-spices' || subSlug === 'masala-powders');
      if (isGroceriesSpiceBranch) {
        subNode.path = `/groceries/${subSlug}`;
      }

      // Embedded 3rd-level subcategories strings on the Level 2 category
      if (Array.isArray(childCat.subcategories)) {
        childCat.subcategories.forEach((grandStr, gIdx) => {
          const grandSlug = slugifyCategory(grandStr);
          addThirdLevel(
            subNode,
            `${childCat.id}::${grandStr}`,
            grandStr,
            grandSlug,
            gIdx + 1
          );
          if (isGroceriesSpiceBranch) {
            const added = subNode.children[subNode.children.length - 1];
            if (added && added.name.toLowerCase() === grandStr.trim().toLowerCase()) {
              added.path = `/groceries/${subSlug}/${grandSlug}`;
            }
          }
        });
      }

      if (Array.isArray(childCat.hierarchyChildren)) {
        childCat.hierarchyChildren.forEach((grandObj, gIdx) => {
          addThirdLevel(
            subNode,
            `${childCat.id}::${grandObj.name}`,
            grandObj.name,
            grandObj.slug,
            50 + gIdx
          );
          if (isGroceriesSpiceBranch) {
            const added = subNode.children[subNode.children.length - 1];
            if (
              added &&
              added.name.toLowerCase() === grandObj.name.trim().toLowerCase()
            ) {
              added.path = `/groceries/${subSlug}/${grandObj.slug || slugifyCategory(grandObj.name)}`;
            }
          }
        });
      }

      // Relational Level 3 records pointing to this Level 2 category
      const grandChildren = activeRecords
        .map((cat, index) => ({ cat, index }))
        .filter(({ cat }) => {
          const pId = getParentId(cat);
          if (!pId) return false;
          const pLower = pId.toLowerCase();
          return (
            pLower === childCat.id.toLowerCase() ||
            pLower === childName.toLowerCase() ||
            pLower === childCat.slug.toLowerCase()
          );
        })
        .sort((a, b) => {
          const orderA = a.cat.displayOrder ?? 999;
          const orderB = b.cat.displayOrder ?? 999;
          if (orderA !== orderB) return orderA - orderB;
          return a.index - b.index;
        })
        .map(({ cat }) => cat);

      grandChildren.forEach((gCat, gIdx) => {
        const gName = gCat.name || gCat.id;
        addThirdLevel(
          subNode,
          gCat.id,
          gName,
          gCat.slug,
          gCat.displayOrder ?? 100 + gIdx
        );
      });
    });

    // Also match Level 3 relational records whose parent matches an embedded Level 2 name (e.g. parentCategoryId: "Rice" or "Women")
    Array.from(subMap.values()).forEach((subNode) => {
      const grandChildren = activeRecords
        .map((cat, index) => ({ cat, index }))
        .filter(({ cat }) => {
          const pId = getParentId(cat);
          if (!pId) return false;
          const pLower = pId.toLowerCase();
          return (
            pLower === subNode.id.toLowerCase() ||
            pLower === subNode.name.toLowerCase() ||
            pLower === subNode.slug.toLowerCase()
          );
        })
        .sort((a, b) => {
          const orderA = a.cat.displayOrder ?? 999;
          const orderB = b.cat.displayOrder ?? 999;
          if (orderA !== orderB) return orderA - orderB;
          return a.index - b.index;
        })
        .map(({ cat }) => cat);

      grandChildren.forEach((gCat, gIdx) => {
        const gName = gCat.name || gCat.id;
        addThirdLevel(
          subNode,
          gCat.id,
          gName,
          gCat.slug,
          gCat.displayOrder ?? 200 + gIdx
        );
      });
    });

    const subcategories = Array.from(subMap.values())
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((sub) => ({
        ...sub,
        children: [...sub.children].sort((a, b) => a.displayOrder - b.displayOrder),
      }));

    return {
      id: mainId,
      name: mainName,
      title: main.title || mainName,
      slug: mainSlug,
      path: `/${mainSlug}`,
      subtitle: main.subtitle,
      description: main.description || '',
      image: main.image,
      accentColor: main.accentColor,
      modelType: main.modelType,
      displayOrder: main.displayOrder ?? mainIdx + 1,
      subcategories,
    };
  });
}

export function getCategoryBySlug(
  slug: string,
  runtimeCategories: CategoryInfo[] = []
): CategoryInfo | undefined {
  const clean = slug.toLowerCase().trim();
  const pool =
    runtimeCategories && runtimeCategories.length > 0
      ? runtimeCategories
      : MAIN_CATEGORY_DEFINITIONS;

  // Handle canonical + legacy URL aliases without breaking indexed pages
  const aliasToId: Record<string, string> = {
    temple: 'Temple',
    'temple-pooja-essentials': 'Temple',
    'temple-kit': 'Temple',
    baby: 'Baby Kit',
    'baby-care': 'Baby Kit',
    'baby care': 'Baby Kit',
    'baby-kit': 'Baby Kit',
    'baby kit': 'Baby Kit',
    kids: 'Kids',
    teenager: 'Teenager',
    teenagers: 'Teenager',
    school: 'School Kit',
    'school-supplies': 'School Kit',
    'school supplies': 'School Kit',
    'school-kit': 'School Kit',
    'school kit': 'School Kit',
    grocery: 'Groceries',
    groceries: 'Groceries',
    rice: 'Groceries',
    honey: 'Groceries',
    'dry-nuts': 'Dry Nuts',
    nuts: 'Dry Nuts',
    'dry-fruits': 'Dry Fruits',
    'dried-fruits': 'Dry Fruits',
    'prank-items': 'Prank Items',
    'pranks-novelties': 'Prank Items',
    'used-bikes': 'Used Bikes and Cars',
    'used-cars': 'Used Bikes and Cars',
    'usedbikesandcars': 'Used Bikes and Cars',
    'used-bikes-and-cars': 'Used Bikes and Cars',
    'dry-peas': 'Dry Peas',
    'dried-peas': 'Dry Peas',
    gym: 'Gym',
    'fitness-gym': 'Gym',
    watches: 'Accessories',
  };

  const mappedId = aliasToId[clean];
  if (mappedId) {
    return (
      pool.find((c) => c.id.toLowerCase() === mappedId.toLowerCase()) ||
      MAIN_CATEGORY_DEFINITIONS.find(
        (c) => c.id.toLowerCase() === mappedId.toLowerCase()
      )
    );
  }

  return (
    pool.find(
      (c) =>
        c.slug.toLowerCase() === clean ||
        c.id.toLowerCase() === clean ||
        (c.name && c.name.toLowerCase() === clean)
    ) ||
    [
      ...MAIN_CATEGORY_DEFINITIONS,
      ...GROCERIES_SUBCATEGORY_DEFINITIONS,
      ...TEMPLE_SUBCATEGORY_DEFINITIONS,
    ].find(
      (c) =>
        c.slug.toLowerCase() === clean ||
        c.id.toLowerCase() === clean ||
        (c.name && c.name.toLowerCase() === clean)
    )
  );
}

const SUBCATEGORY_ALIASES: Record<string, string[]> = {
  'ready-to-cook foods': ['ready-to-cook foods', 'ready to cook', 'ready-to-cook-foods', 'ready-to-cook'],
  'ready-to-cook-foods': ['ready-to-cook foods', 'ready to cook', 'ready-to-cook-foods', 'ready-to-cook'],
  'ready-to-cook': ['ready-to-cook foods', 'ready to cook', 'ready-to-cook-foods', 'ready-to-cook'],
  'ready to cook': ['ready-to-cook foods', 'ready to cook', 'ready-to-cook-foods', 'ready-to-cook'],
  'health foods': ['health foods', 'health'],
  health: ['health foods', 'health'],
  'whole spices': ['whole spices', 'whole-spices'],
  'whole-spices': ['whole spices', 'whole-spices'],
  'masala powders': ['masala powders', 'masala-powders'],
  'masala-powders': ['masala powders', 'masala-powders'],
  'temple kit': ['temple kit', 'temple-kit'],
  'temple-kit': ['temple kit', 'temple-kit'],
  'school kit': ['school kit', 'school-kit'],
  'school-kit': ['school kit', 'school-kit'],
  'baby kit': ['baby kit', 'baby-kit'],
  'baby-kit': ['baby kit', 'baby-kit'],
  "men's fashion": ["men's fashion", 'men', 'mens-fashion', 'mens fashion'],
  'mens-fashion': ["men's fashion", 'men', 'mens-fashion', 'mens fashion'],
  men: ["men's fashion", 'men', 'mens-fashion', 'mens fashion'],
  "women's fashion": ["women's fashion", 'women', 'womens-fashion', 'womens fashion'],
  women: ["women's fashion", 'women', 'womens-fashion', 'womens fashion'],
};

const THIRD_LEVEL_ALIASES: Record<string, string[]> = {
  shirts: ['shirts', 'shirt'],
  shirt: ['shirts', 'shirt'],
  trousers: ['trousers', 'trouser'],
  trouser: ['trousers', 'trouser'],
  pants: ['pants', 'pant'],
  pant: ['pants', 'pant'],
  't-shirts': ['t-shirts', 't-shirt', 'tshirts', 'tshirt'],
  tshirts: ['t-shirts', 't-shirt', 'tshirts', 'tshirt'],
  't-shirt': ['t-shirts', 't-shirt', 'tshirts', 'tshirt'],
  'healthy sweets': ['healthy sweets', 'health sweets'],
  'health sweets': ['healthy sweets', 'health sweets'],
  'churidar sets': ['churidar sets', 'chudithar', 'churidar'],
  chudithar: ['churidar sets', 'chudithar', 'churidar'],
  'korean fashion': ['korean fashion', 'korean trends'],
  'korean trends': ['korean fashion', 'korean trends'],
  'bottom wear': ['bottom wear', 'bottoms'],
  bottoms: ['bottom wear', 'bottoms'],
  'shawls & stoles': ['shawls & stoles', 'shawls'],
  shawls: ['shawls & stoles', 'shawls'],
  'nightwear sets': ['nightwear sets', 'night sets'],
  'night sets': ['nightwear sets', 'night sets'],
  'green cardamom (elakkai)': ['green cardamom (elakkai)', 'green cardamom', 'elakkai', 'elaka'],
  'cloves (lavangam)': ['cloves (lavangam)', 'cloves', 'lavangam'],
  'cinnamon (pattai)': ['cinnamon (pattai)', 'cinnamon', 'pattai', 'patai'],
  'cumin seeds (seeragam)': ['cumin seeds (seeragam)', 'cumin seeds', 'seeragam', 'jeera'],
  'black pepper (milagu)': ['black pepper (milagu)', 'black pepper', 'milagu'],
  'star anise (annasi poo)': ['star anise (annasi poo)', 'star anise', 'annasi poo'],
  'fennel seeds (sombu)': ['fennel seeds (sombu)', 'fennel seeds', 'sombu'],
  'coriander seeds (dhaniya)': ['coriander seeds (dhaniya)', 'coriander seeds', 'dhaniya'],
  'mustard seeds (kadugu)': ['mustard seeds (kadugu)', 'mustard seeds', 'kadugu'],
  'fenugreek seeds (vendhayam)': ['fenugreek seeds (vendhayam)', 'fenugreek seeds', 'vendhayam'],
  'whole turmeric (virali manjal)': ['whole turmeric (virali manjal)', 'whole turmeric', 'virali manjal'],
  'nutmeg (jathikkai)': ['nutmeg (jathikkai)', 'nutmeg', 'jathikkai'],
  'mace (jathipathri)': ['mace (jathipathri)', 'mace', 'jathipathri'],
  'carom seeds (omam)': ['carom seeds (omam)', 'carom seeds', 'omam', 'ajwain'],
  'kalpasi (black stone flower)': ['kalpasi (black stone flower)', 'kalpasi', 'black stone flower', 'stone flower'],
  'dried red chillies': ['dried red chillies', 'dry red chillies'],
  'dry red chillies': ['dried red chillies', 'dry red chillies'],
  'asafoetida (hing powder)': ['asafoetida (hing powder)', 'asafoetida', 'hing powder', 'hing', 'perungayam'],
  asafoetida: ['asafoetida (hing powder)', 'asafoetida', 'hing powder', 'hing', 'perungayam'],
  'hing powder': ['asafoetida (hing powder)', 'asafoetida', 'hing powder', 'hing', 'perungayam'],
};

/**
 * Checks if a given product belongs to a category or any of its nested hierarchy.
 */
export function productMatchesCategory(
  productCategory: string,
  productSubcategory: string | undefined,
  productSubSubcategory: string | undefined,
  targetCategoryNameOrSlug: string,
  runtimeCategories: CategoryInfo[] = []
): boolean {
  const target = targetCategoryNameOrSlug.toLowerCase().trim();
  if (!target || target === 'all') return true;

  const catLower = (productCategory || '').toLowerCase().trim();
  const subLower = (productSubcategory || '').toLowerCase().trim();
  const subSubLower = (productSubSubcategory || '').toLowerCase().trim();

  if (target === 'groceries' || target === 'grocery') {
    const spiceThirdLower = [
      ...WHOLE_SPICE_SUBCATEGORIES,
      ...MASALA_POWDER_SUBCATEGORIES,
    ].map((s) => s.toLowerCase());
    return (
      catLower === 'groceries' ||
      catLower === 'grocery' ||
      catLower === 'rice' ||
      catLower === 'honey' ||
      catLower === 'whole spices' ||
      catLower === 'whole-spices' ||
      catLower === 'masala powders' ||
      catLower === 'masala-powders' ||
      subLower === 'rice' ||
      subLower === 'millets' ||
      subLower === 'cereals' ||
      subLower === 'ready to cook' ||
      subLower === 'ready-to-cook' ||
      subLower === 'ready-to-cook-foods' ||
      subLower === 'ready-to-cook foods' ||
      subLower === 'health' ||
      subLower === 'health foods' ||
      subLower === 'whole spices' ||
      subLower === 'whole-spices' ||
      subLower === 'masala powders' ||
      subLower === 'masala-powders' ||
      subSubLower === 'lunch' ||
      subSubLower === 'dinner' ||
      subSubLower === 'breakfast' ||
      subSubLower === 'health sweets' ||
      subSubLower === 'healthy sweets' ||
      spiceThirdLower.includes(subSubLower)
    );
  }

  if (target === 'whole spices' || target === 'whole-spices') {
    return (
      catLower === 'whole spices' ||
      catLower === 'whole-spices' ||
      subLower === 'whole spices' ||
      subLower === 'whole-spices' ||
      WHOLE_SPICE_SUBCATEGORIES.some((s) => s.toLowerCase() === subSubLower)
    );
  }

  if (target === 'masala powders' || target === 'masala-powders') {
    return (
      catLower === 'masala powders' ||
      catLower === 'masala-powders' ||
      subLower === 'masala powders' ||
      subLower === 'masala-powders' ||
      MASALA_POWDER_SUBCATEGORIES.some((s) => s.toLowerCase() === subSubLower)
    );
  }

  if (target === 'fashion') {
    return (
      catLower === 'fashion' ||
      subLower === 'men' ||
      subLower === "men's fashion" ||
      subLower === 'women' ||
      subLower === "women's fashion"
    );
  }

  if (
    target === 'used-bikes-and-cars' ||
    target === 'used bikes and cars' ||
    target === 'used bikes & cars'
  ) {
    return (
      catLower === 'used bikes and cars' ||
      catLower === 'used bikes & cars' ||
      catLower === 'used-bikes-and-cars'
    );
  }

  if (target === 'kids') {
    return catLower === 'kids';
  }

  if (target === 'teenager' || target === 'teenagers') {
    return catLower === 'teenager' || catLower === 'teenagers';
  }

  if (
    target === 'temple' ||
    target === 'temple-pooja-essentials' ||
    target === 'temple & pooja essentials'
  ) {
    return (
      catLower === 'temple' ||
      catLower === 'temple & pooja essentials' ||
      catLower === 'temple-pooja-essentials' ||
      catLower === 'temple kit' ||
      catLower === 'temple-kit' ||
      subLower === 'temple kit' ||
      subLower === 'temple-kit'
    );
  }

  if (target === 'temple kit' || target === 'temple-kit') {
    return (
      catLower === 'temple kit' ||
      catLower === 'temple-kit' ||
      subLower === 'temple kit' ||
      subLower === 'temple-kit'
    );
  }

  if (
    target === 'school kit' ||
    target === 'school-kit' ||
    target === 'school' ||
    target === 'school-supplies' ||
    target === 'school supplies'
  ) {
    return (
      catLower === 'school kit' ||
      catLower === 'school-kit' ||
      catLower === 'school' ||
      catLower === 'school supplies' ||
      catLower === 'school-supplies' ||
      subLower === 'school kit' ||
      subLower === 'school-kit'
    );
  }

  if (
    target === 'baby kit' ||
    target === 'baby-kit' ||
    target === 'baby' ||
    target === 'baby-care' ||
    target === 'baby care'
  ) {
    return (
      catLower === 'baby kit' ||
      catLower === 'baby-kit' ||
      catLower === 'baby' ||
      catLower === 'baby care' ||
      subLower === 'baby kit' ||
      subLower === 'baby-kit'
    );
  }

  const def = getCategoryBySlug(target, runtimeCategories);
  if (def) {
    if (
      catLower === def.id.toLowerCase() ||
      (def.name && catLower === def.name.toLowerCase()) ||
      slugifyCategory(catLower) === def.slug.toLowerCase()
    ) {
      return true;
    }
    if (
      subLower &&
      Array.isArray(def.subcategories) &&
      def.subcategories.some((s) => s.toLowerCase() === subLower)
    ) {
      return true;
    }
  }

  return catLower === target || slugifyCategory(catLower) === target;
}

/**
 * Full 3-level product matcher supporting both canonical display names and legacy product labels.
 */
export function productMatchesFilter(
  product: Pick<
    Product,
    'category' | 'subcategory' | 'subSubcategory' | 'tags' | 'name'
  >,
  categoryFilter: string = 'All',
  subcategoryFilter: string = 'All',
  subSubcategoryFilter: string = 'All',
  runtimeCategories: CategoryInfo[] = []
): boolean {
  if (
    categoryFilter &&
    categoryFilter !== 'All' &&
    !productMatchesCategory(
      product.category,
      product.subcategory,
      product.subSubcategory,
      categoryFilter,
      runtimeCategories
    )
  ) {
    return false;
  }

  const subTarget = (subcategoryFilter || 'All').trim().toLowerCase();
  if (subTarget && subTarget !== 'all') {
    const allowedSubs = SUBCATEGORY_ALIASES[subTarget] || [subTarget];
    const pCat = (product.category || '').toLowerCase().trim();
    const pSub = (product.subcategory || '').toLowerCase().trim();
    const pSubSub = (product.subSubcategory || '').toLowerCase().trim();
    const pTags = (product.tags || []).map((t) => t.toLowerCase().trim());

    const subMatched = allowedSubs.some(
      (candidate) =>
        pSub === candidate ||
        pCat === candidate ||
        pSubSub === candidate ||
        pTags.includes(candidate)
    );
    if (!subMatched) return false;
  }

  const thirdTarget = (subSubcategoryFilter || 'All').trim().toLowerCase();
  if (thirdTarget && thirdTarget !== 'all') {
    const allowedThird = THIRD_LEVEL_ALIASES[thirdTarget] || [thirdTarget];
    const pSub = (product.subcategory || '').toLowerCase().trim();
    const pSubSub = (product.subSubcategory || '').toLowerCase().trim();
    const pTags = (product.tags || []).map((t) => t.toLowerCase().trim());
    const pName = (product.name || '').toLowerCase();

    const thirdMatched = allowedThird.some(
      (candidate) =>
        pSubSub === candidate ||
        pSub === candidate ||
        pTags.includes(candidate) ||
        (!pSubSub && pName.includes(candidate))
    );
    if (!thirdMatched) return false;
  }

  return true;
}
