import type {
  FurnitureCollection,
  FurnitureGroupName,
  Product,
} from '../types';

export interface FurnitureGroupMeta {
  name: FurnitureGroupName;
  slug: string;
  folder: string;
  description: string;
}

export const FURNITURE_GROUPS: FurnitureGroupMeta[] = [
  {
    name: 'Sofas & Seating',
    slug: 'sofas-seating',
    folder: 'sofas-seating',
    description:
      'Contemporary three-seater, compact two-seater, L-shaped sectionals, recliner sofas, and convertible sofa cum beds.',
  },
  {
    name: 'Beds & Mattresses',
    slug: 'beds-mattresses',
    folder: 'beds-mattresses',
    description:
      'Single, double, queen-size, and king-size bed frames alongside quilted supportive mattresses.',
  },
  {
    name: 'Dining Furniture',
    slug: 'dining-furniture',
    folder: 'dining-furniture',
    description:
      'Four-seater and six-seater dining table sets, individual dining chairs, and dining benches.',
  },
  {
    name: 'Tables & Desks',
    slug: 'tables-desks',
    folder: 'tables-desks',
    description:
      'Living-room coffee tables, home study tables, ergonomic computer desks, and professional office desks.',
  },
  {
    name: 'Storage Furniture',
    slug: 'storage-furniture',
    folder: 'storage-furniture',
    description:
      'Spacious wardrobes, multi-tier bookshelves, entryway shoe racks, storage cabinets, and chests of drawers.',
  },
  {
    name: 'Chairs',
    slug: 'chairs',
    folder: 'chairs',
    description:
      'Ergonomic office chairs, high-back gaming chairs, decorative accent chairs, and moulded plastic seating.',
  },
  {
    name: 'Home Furniture',
    slug: 'home-furniture',
    folder: 'home-furniture',
    description:
      'Contemporary TV console units, compact bedside tables, and mirror-equipped dressing tables.',
  },
];

const GROUP_BY_NAME = new Map<FurnitureGroupName, FurnitureGroupMeta>(
  FURNITURE_GROUPS.map((g) => [g.name, g])
);

interface RawFurnitureSeed {
  name: string;
  slug: string;
  parentGroup: FurnitureGroupName;
  expectedFilename: string;
  image: string;
  description: string;
  keywords: string[];
}

const RAW_FURNITURE_COLLECTIONS: RawFurnitureSeed[] = [
  // GROUP 1 — SOFAS & SEATING
  {
    name: '3-Seater Sofa',
    slug: 'three-seater-sofa',
    parentGroup: 'Sofas & Seating',
    expectedFilename: 'sofas-seating/three-seater-sofa.jpg',
    image: '',
    description:
      'Modern three-seat fabric sofa with a clean contemporary silhouette for spacious family living rooms.',
    keywords: [
      '3-seater sofa',
      'three seater sofa',
      'living room sofa',
      'fabric couch',
    ],
  },
  {
    name: '2-Seater Sofa',
    slug: 'two-seater-sofa',
    parentGroup: 'Sofas & Seating',
    expectedFilename: 'sofas-seating/two-seater-sofa.jpg',
    image: '/images/furniture/sofas-seating/two-seater-sofa.jpg',
    description:
      'Compact two-seat loveseat sofa upholstered in neutral woven fabric with a warm wooden base.',
    keywords: ['2-seater sofa', 'two seater sofa', 'loveseat', 'compact sofa'],
  },
  {
    name: 'L-Shaped Sofa',
    slug: 'l-shaped-sofa',
    parentGroup: 'Sofas & Seating',
    expectedFilename: 'sofas-seating/l-shaped-sofa.jpg',
    image: '',
    description:
      'Spacious corner L-shaped sectional sofa with extended chaise seating for open living spaces.',
    keywords: [
      'l-shaped sofa',
      'l shaped sofa',
      'sectional sofa',
      'corner sofa',
    ],
  },
  {
    name: 'Recliner Sofa',
    slug: 'recliner-sofa',
    parentGroup: 'Sofas & Seating',
    expectedFilename: 'sofas-seating/recliner-sofa.jpg',
    image: '',
    description:
      'Deep-cushioned upholstered reclining sofa built for laid-back lounge comfort and leg support.',
    keywords: ['recliner sofa', 'reclining sofa', 'lounge recliner'],
  },
  {
    name: 'Sofa Cum Bed',
    slug: 'sofa-cum-bed',
    parentGroup: 'Sofas & Seating',
    expectedFilename: 'sofas-seating/sofa-cum-bed.jpg',
    image: '',
    description:
      'Convertible sofa bed designed to switch smoothly between daytime seating and guest sleeping.',
    keywords: ['sofa cum bed', 'sofa bed', 'sleeper sofa', 'convertible sofa'],
  },

  // GROUP 2 — BEDS & MATTRESSES
  {
    name: 'Single Bed',
    slug: 'single-bed',
    parentGroup: 'Beds & Mattresses',
    expectedFilename: 'beds-mattresses/single-bed.jpg',
    image: '',
    description:
      'Modern single bed with a clean wooden frame crafted for compact bedrooms and guest rooms.',
    keywords: ['single bed', 'wooden single bed', 'twin bed'],
  },
  {
    name: 'Double Bed',
    slug: 'double-bed',
    parentGroup: 'Beds & Mattresses',
    expectedFilename: 'beds-mattresses/double-bed.jpg',
    image: '',
    description:
      'Standard double bed featuring an understated headboard and steady everyday support.',
    keywords: ['double bed', 'standard bed', 'wooden double bed'],
  },
  {
    name: 'Queen Size Bed',
    slug: 'queen-size-bed',
    parentGroup: 'Beds & Mattresses',
    expectedFilename: 'beds-mattresses/queen-size-bed.jpg',
    image: '',
    description:
      'Balanced queen-size bed with contemporary bedroom styling and comfortable full-length framing.',
    keywords: ['queen size bed', 'queen bed', 'platform queen bed'],
  },
  {
    name: 'King Size Bed',
    slug: 'king-size-bed',
    parentGroup: 'Beds & Mattresses',
    expectedFilename: 'beds-mattresses/king-size-bed.jpg',
    image: '',
    description:
      'Generously proportioned king-size bed designed as a refined focal centerpiece for master bedrooms.',
    keywords: ['king size bed', 'king bed', 'master bed'],
  },
  {
    name: 'Mattress',
    slug: 'mattress',
    parentGroup: 'Beds & Mattresses',
    expectedFilename: 'beds-mattresses/mattress.jpg',
    image: '',
    description:
      'Standalone quilted multi-layer mattress collection built for breathable nightly support.',
    keywords: ['mattress', 'bed mattress', 'quilted mattress'],
  },

  // GROUP 3 — DINING FURNITURE
  {
    name: '4-Seater Dining Table',
    slug: 'four-seater-dining-table',
    parentGroup: 'Dining Furniture',
    expectedFilename: 'dining-furniture/four-seater-dining-table.jpg',
    image: '',
    description:
      'Compact four-seater dining table paired with four matching chairs for everyday family meals.',
    keywords: ['4-seater dining table', '4 seater dining table', 'dining set'],
  },
  {
    name: '6-Seater Dining Table',
    slug: 'six-seater-dining-table',
    parentGroup: 'Dining Furniture',
    expectedFilename: 'dining-furniture/six-seater-dining-table.jpg',
    image: '',
    description:
      'Full-length six-seater dining table with six coordinated chairs suited for family gatherings.',
    keywords: ['6-seater dining table', '6 seater dining table', 'dining table'],
  },
  {
    name: 'Dining Chair',
    slug: 'dining-chair',
    parentGroup: 'Dining Furniture',
    expectedFilename: 'dining-furniture/dining-chair.jpg',
    image: '',
    description:
      'Individual contoured wooden and upholstered dining chair offering supportive upright seating.',
    keywords: ['dining chair', 'kitchen chair', 'dining room chair'],
  },
  {
    name: 'Dining Bench',
    slug: 'dining-bench',
    parentGroup: 'Dining Furniture',
    expectedFilename: 'dining-furniture/dining-bench.jpg',
    image: '',
    description:
      'Clean-lined solid wood dining bench crafted to pair seamlessly with rectangular dining tables.',
    keywords: ['dining bench', 'wooden bench', 'dining seating bench'],
  },

  // GROUP 4 — TABLES & DESKS
  {
    name: 'Coffee Table',
    slug: 'coffee-table',
    parentGroup: 'Tables & Desks',
    expectedFilename: 'tables-desks/coffee-table.jpg',
    image: '',
    description:
      'Contemporary living-room center coffee table designed for everyday lounging and hospitality.',
    keywords: ['coffee table', 'center table', 'teapoy', 'living room table'],
  },
  {
    name: 'Study Table',
    slug: 'study-table',
    parentGroup: 'Tables & Desks',
    expectedFilename: 'tables-desks/study-table.jpg',
    image: '',
    description:
      'Practical study desk offering a clean flat worktop for books, notebooks, and focused study.',
    keywords: ['study table', 'study desk', 'writing table', 'student desk'],
  },
  {
    name: 'Computer Desk',
    slug: 'computer-desk',
    parentGroup: 'Tables & Desks',
    expectedFilename: 'tables-desks/computer-desk.jpg',
    image: '',
    description:
      'Purpose-built computer workstation desk organized for monitor clearance and daily keyboard comfort.',
    keywords: ['computer desk', 'pc desk', 'workstation table'],
  },
  {
    name: 'Office Desk',
    slug: 'office-desk',
    parentGroup: 'Tables & Desks',
    expectedFilename: 'tables-desks/office-desk.jpg',
    image: '',
    description:
      'Structured professional office work desk crafted for home offices and executive study rooms.',
    keywords: ['office desk', 'work desk', 'office table', 'executive desk'],
  },

  // GROUP 5 — STORAGE FURNITURE
  {
    name: 'Wardrobe',
    slug: 'wardrobe',
    parentGroup: 'Storage Furniture',
    expectedFilename: 'storage-furniture/wardrobe.jpg',
    image: '',
    description:
      'Full-height hinged bedroom wardrobe featuring neat garment hanging and internal shelf storage.',
    keywords: ['wardrobe', 'almirah', 'cupboard', 'closet'],
  },
  {
    name: 'Bookshelf',
    slug: 'bookshelf',
    parentGroup: 'Storage Furniture',
    expectedFilename: 'storage-furniture/bookshelf.jpg',
    image: '',
    description:
      'Tall multi-shelf open bookcase engineered to display books, folders, and living-room decor.',
    keywords: ['bookshelf', 'bookcase', 'book rack', 'display shelf'],
  },
  {
    name: 'Shoe Rack',
    slug: 'shoe-rack',
    parentGroup: 'Storage Furniture',
    expectedFilename: 'storage-furniture/shoe-rack.jpg',
    image: '',
    description:
      'Compact multi-tier entryway shoe organizer keeping everyday footwear neatly ventilated.',
    keywords: ['shoe rack', 'shoe cabinet', 'footwear stand'],
  },
  {
    name: 'Storage Cabinet',
    slug: 'storage-cabinet',
    parentGroup: 'Storage Furniture',
    expectedFilename: 'storage-furniture/storage-cabinet.jpg',
    image: '',
    description:
      'Modern multipurpose enclosed storage cabinet for keeping household essentials organized out of sight.',
    keywords: ['storage cabinet', 'sideboard', 'utility cabinet'],
  },
  {
    name: 'Chest of Drawers',
    slug: 'chest-of-drawers',
    parentGroup: 'Storage Furniture',
    expectedFilename: 'storage-furniture/chest-of-drawers.jpg',
    image: '',
    description:
      'Multi-drawer bedroom chest cabinet designed for neatly folded apparel and linen storage.',
    keywords: ['chest of drawers', 'drawer cabinet', 'dresser chest'],
  },

  // GROUP 6 — CHAIRS
  {
    name: 'Office Chair',
    slug: 'office-chair',
    parentGroup: 'Chairs',
    expectedFilename: 'chairs/office-chair.jpg',
    image: '',
    description:
      'Ergonomic swivel task office chair with contoured breathable backrest and smooth caster base.',
    keywords: ['office chair', 'ergonomic chair', 'desk chair', 'task chair'],
  },
  {
    name: 'Gaming Chair',
    slug: 'gaming-chair',
    parentGroup: 'Chairs',
    expectedFilename: 'chairs/gaming-chair.jpg',
    image: '',
    description:
      'Supportive high-back racing-inspired gaming chair built for extended desk sessions.',
    keywords: ['gaming chair', 'high back chair', 'esports chair'],
  },
  {
    name: 'Accent Chair',
    slug: 'accent-chair',
    parentGroup: 'Chairs',
    expectedFilename: 'chairs/accent-chair.jpg',
    image: '',
    description:
      'Decorative upholstered lounge accent chair adding sculptural seating warmth to corners and bedrooms.',
    keywords: ['accent chair', 'lounge chair', 'armchair'],
  },
  {
    name: 'Plastic Chair',
    slug: 'plastic-chair',
    parentGroup: 'Chairs',
    expectedFilename: 'chairs/plastic-chair.jpg',
    image: '',
    description:
      'Lightweight moulded polypropylene chair engineered for indoor, balcony, and utility seating.',
    keywords: ['plastic chair', 'moulded chair', 'stackable chair'],
  },

  // GROUP 7 — HOME FURNITURE
  {
    name: 'TV Unit',
    slug: 'tv-unit',
    parentGroup: 'Home Furniture',
    expectedFilename: 'home-furniture/tv-unit.jpg',
    image: '',
    description:
      'Low-profile contemporary television console table with enclosed compartments and media shelves.',
    keywords: ['tv unit', 'tv stand', 'tv console', 'entertainment unit'],
  },
  {
    name: 'Bedside Table',
    slug: 'bedside-table',
    parentGroup: 'Home Furniture',
    expectedFilename: 'home-furniture/bedside-table.jpg',
    image: '',
    description:
      'Compact bedside nightstand with smooth-gliding drawers for lamps, books, and night essentials.',
    keywords: ['bedside table', 'nightstand', 'side table'],
  },
  {
    name: 'Dressing Table',
    slug: 'dressing-table',
    parentGroup: 'Home Furniture',
    expectedFilename: 'home-furniture/dressing-table.jpg',
    image: '',
    description:
      'Bedroom vanity dressing table featuring a clear full-view mirror and organized drawer storage.',
    keywords: ['dressing table', 'vanity table', 'mirror dresser'],
  },
];

export const INITIAL_FURNITURE_COLLECTIONS: FurnitureCollection[] =
  RAW_FURNITURE_COLLECTIONS.map((item, idx) => {
    const groupMeta = GROUP_BY_NAME.get(item.parentGroup);
    return {
      id: `furn-${item.slug}`,
      name: item.name,
      slug: item.slug,
      parentCategory: 'Furniture',
      parentGroup: item.parentGroup,
      parentGroupSlug: groupMeta?.slug || 'sofas-seating',
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

export function mergeFurnitureCollections(
  existing: FurnitureCollection[] = []
): FurnitureCollection[] {
  const existingById = new Map(existing.map((c) => [c.id.toLowerCase(), c]));
  return INITIAL_FURNITURE_COLLECTIONS.map((seed) => {
    const prev = existingById.get(seed.id.toLowerCase());
    if (!prev) return seed;

    const prevImage =
      typeof prev.image === 'string' ? prev.image.trim() : '';
    const useImage = prevImage || seed.image || '';
    const imageStatus: FurnitureCollection['imageStatus'] = !useImage
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

export function getFurnitureCollectionPath(
  col: Pick<FurnitureCollection, 'parentGroupSlug' | 'slug'>
): string {
  return `/furniture/${col.parentGroupSlug}/${col.slug}`;
}

export function findFurnitureGroupBySlug(
  slugOrName?: string
): FurnitureGroupMeta | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;
  return FURNITURE_GROUPS.find(
    (g) =>
      g.slug.toLowerCase() === clean ||
      g.name.toLowerCase() === clean ||
      g.folder.toLowerCase() === clean
  );
}

export function findFurnitureCollection(
  collections: FurnitureCollection[],
  slugOrName?: string,
  groupHint?: string
): FurnitureCollection | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;
  const groupClean = (groupHint || '').toLowerCase().trim();
  const matches = collections.filter(
    (c) =>
      c.slug.toLowerCase() === clean ||
      c.id.toLowerCase() === clean ||
      c.id.toLowerCase() === `furn-${clean}` ||
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

export function productMatchesFurnitureCollection(
  product: Product,
  collection: FurnitureCollection
): boolean {
  const catLower = (product.category || '').toLowerCase().trim();
  if (catLower !== 'furniture') {
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
    subSubLower !== 'furniture' &&
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
