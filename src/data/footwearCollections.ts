import type { FootwearCollection, FootwearGroupName, Product } from '../types';

export interface FootwearGroupMeta {
  name: FootwearGroupName;
  slug: string;
  folder: string;
  description: string;
}

export const FOOTWEAR_GROUPS: FootwearGroupMeta[] = [
  {
    name: "Men's Footwear",
    slug: 'mens-footwear',
    folder: 'mens-footwear',
    description:
      'Formal lace-up shoes, casual shoes, low-top sneakers, slip-on loafers, open-toe sandals, indoor slippers, sports shoes, and ankle boots.',
  },
  {
    name: "Women's Footwear",
    slug: 'womens-footwear',
    folder: 'womens-footwear',
    description:
      'High-heeled shoes, comfortable flats, open-toe sandals, modern sneakers, wedge sandals, ballet-style bellies, ankle boots, and everyday slippers.',
  },
  {
    name: "Boys' Footwear",
    slug: 'boys-footwear',
    folder: 'boys-footwear',
    description:
      'Black uniform school shoes, casual walking shoes, lightweight sports shoes, durable sandals, and casual slippers for boys.',
  },
  {
    name: "Girls' Footwear",
    slug: 'girls-footwear',
    folder: 'girls-footwear',
    description:
      'Black uniform school shoes, decorative party shoes, colourful sneakers, comfortable sandals, and ballet-style bellies for girls.',
  },
  {
    name: 'Baby Footwear',
    slug: 'baby-footwear',
    folder: 'baby-footwear',
    description:
      'Soft knitted baby booties, flexible soft-sole shoes, lightweight pre-walker shoes, and gentle cushioned baby sandals.',
  },
  {
    name: 'Sports & Athletic Footwear',
    slug: 'sports-footwear',
    folder: 'sports-footwear',
    description:
      'Performance running shoes, cross-training gym shoes, studded football cleats, high-top basketball shoes, and outdoor trekking boots.',
  },
  {
    name: 'Traditional Footwear',
    slug: 'traditional-footwear',
    folder: 'traditional-footwear',
    description:
      'Handcrafted Kolhapuri chappals, embroidered Indian juttis, curved-toe ethnic mojaris, festive ethnic sandals, and traditional slip-ons.',
  },
];

const GROUP_BY_NAME = new Map<FootwearGroupName, FootwearGroupMeta>(
  FOOTWEAR_GROUPS.map((g) => [g.name, g])
);

interface RawFootwearSeed {
  name: string;
  slug: string;
  parentGroup: FootwearGroupName;
  expectedFilename: string;
  image: string;
  description: string;
  keywords: string[];
}

const RAW_FOOTWEAR_COLLECTIONS: RawFootwearSeed[] = [
  // GROUP 1 — MEN'S FOOTWEAR (8)
  {
    name: "Men's Formal Shoes",
    slug: 'mens-formal-shoes',
    parentGroup: "Men's Footwear",
    expectedFilename: 'mens-footwear/mens-formal-shoes.jpg',
    image: '/images/footwear/mens-footwear/mens-formal-shoes.jpg',
    description:
      'Classic black leather-style formal lace-up Oxford shoes crafted for office attire, suits, and formal events.',
    keywords: ["men's formal shoes", 'formal oxford', 'dress shoes', 'oxford shoes'],
  },
  {
    name: "Men's Casual Shoes",
    slug: 'mens-casual-shoes',
    parentGroup: "Men's Footwear",
    expectedFilename: 'mens-footwear/mens-casual-shoes.jpg',
    image: '',
    description:
      'Versatile men’s casual lace-up derby and everyday shoes suited for chinos, denim, and weekend outings.',
    keywords: ["men's casual shoes", 'casual derby shoes', 'everyday men shoes'],
  },
  {
    name: "Men's Sneakers",
    slug: 'mens-sneakers',
    parentGroup: "Men's Footwear",
    expectedFilename: 'mens-footwear/mens-sneakers.jpg',
    image: '',
    description:
      'Modern low-top men’s court and lifestyle sneakers featuring cushioned soles and clean everyday styling.',
    keywords: ["men's sneakers", 'mens sneakers', 'court sneakers', 'men low top sneakers'],
  },
  {
    name: "Men's Loafers",
    slug: 'mens-loafers',
    parentGroup: "Men's Footwear",
    expectedFilename: 'mens-footwear/mens-loafers.jpg',
    image: '',
    description:
      'Refined men’s slip-on penny and moc-toe loafers engineered for effortless smart-casual comfort.',
    keywords: ["men's loafers", 'mens loafers', 'slip-on loafers', 'penny loafers'],
  },
  {
    name: "Men's Sandals",
    slug: 'mens-sandals',
    parentGroup: "Men's Footwear",
    expectedFilename: 'mens-footwear/mens-sandals.jpg',
    image: '',
    description:
      'Comfortable men’s open-toe sandals featuring contoured footbeds and supportive adjustable straps.',
    keywords: ["men's sandals", 'mens sandals', 'sport sandals', 'open-toe men sandals'],
  },
  {
    name: "Men's Slippers",
    slug: 'mens-slippers',
    parentGroup: "Men's Footwear",
    expectedFilename: 'mens-footwear/mens-slippers.jpg',
    image: '',
    description:
      'Cushioned indoor and everyday men’s slide slippers and flip-flops built for relaxed daily wear.',
    keywords: ["men's slippers", 'mens slippers', 'men slides', 'indoor slippers'],
  },
  {
    name: "Men's Sports Shoes",
    slug: 'mens-sports-shoes',
    parentGroup: "Men's Footwear",
    expectedFilename: 'mens-footwear/mens-sports-shoes.jpg',
    image: '',
    description:
      'Breathable engineered-mesh men’s athletic sports shoes with responsive shock-absorbing midsoles.',
    keywords: ["men's sports shoes", 'mens athletic shoes', 'men training sneakers'],
  },
  {
    name: "Men's Boots",
    slug: 'mens-boots',
    parentGroup: "Men's Footwear",
    expectedFilename: 'mens-footwear/mens-boots.jpg',
    image: '',
    description:
      'Rugged ankle-length men’s chukka and Chelsea-style boots supported by durable grippy rubber outsoles.',
    keywords: ["men's boots", 'mens boots', 'chukka boots', 'ankle boots men'],
  },

  // GROUP 2 — WOMEN'S FOOTWEAR (8)
  {
    name: "Women's Heels",
    slug: 'womens-heels',
    parentGroup: "Women's Footwear",
    expectedFilename: 'womens-footwear/womens-heels.jpg',
    image: '',
    description:
      'Elegant high-heeled pumps and block heels styled for receptions, formal evenings, and festive occasions.',
    keywords: ["women's heels", 'womens heels', 'block heels', 'high heels'],
  },
  {
    name: "Women's Flats",
    slug: 'womens-flats',
    parentGroup: "Women's Footwear",
    expectedFilename: 'womens-footwear/womens-flats.jpg',
    image: '',
    description:
      'Soft cushioned women’s flat shoes tailored for comfortable daily office commutes and all-day errands.',
    keywords: ["women's flats", 'womens flats', 'comfort flat shoes'],
  },
  {
    name: "Women's Sandals",
    slug: 'womens-sandals',
    parentGroup: "Women's Footwear",
    expectedFilename: 'womens-footwear/womens-sandals.jpg',
    image: '',
    description:
      'Fashionable women’s open-toe strapped sandals combining breathable comfort with versatile warm-weather styling.',
    keywords: ["women's sandals", 'womens sandals', 'ladies open-toe sandals'],
  },
  {
    name: "Women's Sneakers",
    slug: 'womens-sneakers',
    parentGroup: "Women's Footwear",
    expectedFilename: 'womens-footwear/womens-sneakers.jpg',
    image: '',
    description:
      'Stylish modern women’s low-top sneakers with lightweight cushioned soles for brisk walks and casual outfits.',
    keywords: ["women's sneakers", 'womens sneakers', 'ladies walking sneakers'],
  },
  {
    name: "Women's Wedges",
    slug: 'womens-wedges',
    parentGroup: "Women's Footwear",
    expectedFilename: 'womens-footwear/womens-wedges.jpg',
    image: '',
    description:
      'Supportive women’s wedge-heel sandals offering steady elevation and balanced comfort from day to evening.',
    keywords: ["women's wedges", 'womens wedges', 'wedge heel sandals'],
  },
  {
    name: "Women's Bellies",
    slug: 'womens-bellies',
    parentGroup: "Women's Footwear",
    expectedFilename: 'womens-footwear/womens-bellies.jpg',
    image: '',
    description:
      'Classic women’s ballet-style flat bellies with rounded toes and flexible cushioned insoles.',
    keywords: ["women's bellies", 'womens bellies', 'ballet flats', 'ballerina flats'],
  },
  {
    name: "Women's Boots",
    slug: 'womens-boots',
    parentGroup: "Women's Footwear",
    expectedFilename: 'womens-footwear/womens-boots.jpg',
    image: '',
    description:
      'Sleek women’s ankle boots designed with smooth uppers, side zip closures, and stacked low heels.',
    keywords: ["women's boots", 'womens boots', 'ladies ankle boots'],
  },
  {
    name: "Women's Slippers",
    slug: 'womens-slippers',
    parentGroup: "Women's Footwear",
    expectedFilename: 'womens-footwear/womens-slippers.jpg',
    image: '',
    description:
      'Plush indoor and everyday women’s slip-on slippers contoured for gentle arch support and home comfort.',
    keywords: ["women's slippers", 'womens slippers', 'ladies home slippers'],
  },

  // GROUP 3 — BOYS' FOOTWEAR (5)
  {
    name: "Boys' School Shoes",
    slug: 'boys-school-shoes',
    parentGroup: "Boys' Footwear",
    expectedFilename: 'boys-footwear/boys-school-shoes.jpg',
    image: '',
    description:
      'Durable black uniform school shoes for boys featuring scuffed-toe protection and easy Velcro or lace closures.',
    keywords: ["boys' school shoes", 'boys school shoes', 'kids black school shoes'],
  },
  {
    name: "Boys' Casual Shoes",
    slug: 'boys-casual-shoes',
    parentGroup: "Boys' Footwear",
    expectedFilename: 'boys-footwear/boys-casual-shoes.jpg',
    image: '',
    description:
      'Flexible everyday boys’ casual walking shoes built with cushioned collars and non-marking rubber soles.',
    keywords: ["boys' casual shoes", 'boys casual shoes', 'boys walking shoes'],
  },
  {
    name: "Boys' Sports Shoes",
    slug: 'boys-sports-shoes',
    parentGroup: "Boys' Footwear",
    expectedFilename: 'boys-footwear/boys-sports-shoes.jpg',
    image: '',
    description:
      'Lightweight breathable athletic sports shoes sized for boys’ playground sprints and physical education classes.',
    keywords: ["boys' sports shoes", 'boys sports shoes', 'boys running sneakers'],
  },
  {
    name: "Boys' Sandals",
    slug: 'boys-sandals',
    parentGroup: "Boys' Footwear",
    expectedFilename: 'boys-footwear/boys-sandals.jpg',
    image: '',
    description:
      'Sturdy quick-dry boys’ sandals with adjustable hook-and-loop straps and anti-slip textured soles.',
    keywords: ["boys' sandals", 'boys sandals', 'kids strappy sandals'],
  },
  {
    name: "Boys' Slippers",
    slug: 'boys-slippers',
    parentGroup: "Boys' Footwear",
    expectedFilename: 'boys-footwear/boys-slippers.jpg',
    image: '',
    description:
      'Featherlight moulded foam boys’ slide and flip-flop slippers for indoor lounging and poolside outings.',
    keywords: ["boys' slippers", 'boys slippers', 'boys flip flops'],
  },

  // GROUP 4 — GIRLS' FOOTWEAR (5)
  {
    name: "Girls' School Shoes",
    slug: 'girls-school-shoes',
    parentGroup: "Girls' Footwear",
    expectedFilename: 'girls-footwear/girls-school-shoes.jpg',
    image: '',
    description:
      'Neat matte-black girls’ Mary Jane and strap uniform school shoes with cushioned insoles for daily wear.',
    keywords: ["girls' school shoes", 'girls school shoes', 'black girls school shoes'],
  },
  {
    name: "Girls' Party Shoes",
    slug: 'girls-party-shoes',
    parentGroup: "Girls' Footwear",
    expectedFilename: 'girls-footwear/girls-party-shoes.jpg',
    image: '',
    description:
      'Decorative festive girls’ party shoes crafted with delicate shimmer accents and secure ankle straps.',
    keywords: ["girls' party shoes", 'girls party shoes', 'festive girls shoes'],
  },
  {
    name: "Girls' Sneakers",
    slug: 'girls-sneakers',
    parentGroup: "Girls' Footwear",
    expectedFilename: 'girls-footwear/girls-sneakers.jpg',
    image: '',
    description:
      'Playful colourful girls’ sneakers featuring breathable uppers and bouncy cushioned soles for active days.',
    keywords: ["girls' sneakers", 'girls sneakers', 'colourful girls sneakers'],
  },
  {
    name: "Girls' Sandals",
    slug: 'girls-sandals',
    parentGroup: "Girls' Footwear",
    expectedFilename: 'girls-footwear/girls-sandals.jpg',
    image: '',
    description:
      'Soft strapped girls’ sandals designed for airy comfort during summer outings and family walks.',
    keywords: ["girls' sandals", 'girls sandals', 'girls open toe sandals'],
  },
  {
    name: "Girls' Bellies",
    slug: 'girls-bellies',
    parentGroup: "Girls' Footwear",
    expectedFilename: 'girls-footwear/girls-bellies.jpg',
    image: '',
    description:
      'Charming girls’ ballet-style flat bellies with flexible soles and smooth rounded-toe interiors.',
    keywords: ["girls' bellies", 'girls bellies', 'girls ballet flats'],
  },

  // GROUP 5 — BABY FOOTWEAR (4)
  {
    name: 'Baby Booties',
    slug: 'baby-booties',
    parentGroup: 'Baby Footwear',
    expectedFilename: 'baby-footwear/baby-booties.jpg',
    image: '',
    description:
      'Warm soft knitted baby booties designed to gently cushion newborn and infant feet.',
    keywords: ['baby booties', 'knitted baby booties', 'infant booties'],
  },
  {
    name: 'Baby Soft Sole Shoes',
    slug: 'baby-soft-sole-shoes',
    parentGroup: 'Baby Footwear',
    expectedFilename: 'baby-footwear/baby-soft-sole-shoes.jpg',
    image: '',
    description:
      'Ultra-flexible soft-sole baby shoes crafted from breathable fabrics for natural infant foot movement.',
    keywords: ['baby soft sole shoes', 'soft sole baby shoes', 'infant crib shoes'],
  },
  {
    name: 'Baby Pre-Walker Shoes',
    slug: 'baby-pre-walker-shoes',
    parentGroup: 'Baby Footwear',
    expectedFilename: 'baby-footwear/baby-pre-walker-shoes.jpg',
    image: '',
    description:
      'Featherlight baby pre-walker shoes featuring wide rounded toe boxes and gentle non-skid grips.',
    keywords: ['baby pre-walker shoes', 'pre walker shoes', 'first walker baby shoes'],
  },
  {
    name: 'Baby Sandals',
    slug: 'baby-sandals',
    parentGroup: 'Baby Footwear',
    expectedFilename: 'baby-footwear/baby-sandals.jpg',
    image: '',
    description:
      'Padded open-toe baby sandals with gentle adjustable hook-and-loop straps for warm-weather outings.',
    keywords: ['baby sandals', 'infant sandals', 'toddler soft sandals'],
  },

  // GROUP 6 — SPORTS & ATHLETIC FOOTWEAR (5)
  {
    name: 'Running Shoes',
    slug: 'running-shoes',
    parentGroup: 'Sports & Athletic Footwear',
    expectedFilename: 'sports-footwear/running-shoes.jpg',
    image: '',
    description:
      'Lightweight performance running shoes with breathable mesh uppers and high-rebound cushioned midsoles.',
    keywords: ['running shoes', 'jogging shoes', 'marathon sneakers', 'runner shoes'],
  },
  {
    name: 'Training Shoes',
    slug: 'training-shoes',
    parentGroup: 'Sports & Athletic Footwear',
    expectedFilename: 'sports-footwear/training-shoes.jpg',
    image: '',
    description:
      'Stable gym and cross-training shoes engineered with flat supportive heels and lateral grip traction.',
    keywords: ['training shoes', 'gym shoes', 'cross training shoes'],
  },
  {
    name: 'Football Shoes',
    slug: 'football-shoes',
    parentGroup: 'Sports & Athletic Footwear',
    expectedFilename: 'sports-footwear/football-shoes.jpg',
    image: '',
    description:
      'Moulded-stud outdoor football cleats offering crisp ball control and turf traction on grass pitches.',
    keywords: ['football shoes', 'soccer cleats', 'football boots', 'studded cleats'],
  },
  {
    name: 'Basketball Shoes',
    slug: 'basketball-shoes',
    parentGroup: 'Sports & Athletic Footwear',
    expectedFilename: 'sports-footwear/basketball-shoes.jpg',
    image: '',
    description:
      'Supportive high-top basketball court shoes with ankle collar padding and herringbone court-grip soles.',
    keywords: ['basketball shoes', 'high top court shoes', 'basketball sneakers'],
  },
  {
    name: 'Trekking Shoes',
    slug: 'trekking-shoes',
    parentGroup: 'Sports & Athletic Footwear',
    expectedFilename: 'sports-footwear/trekking-shoes.jpg',
    image: '',
    description:
      'Rugged outdoor trail and hiking boots built with reinforced toe caps and deep multi-terrain lug outsoles.',
    keywords: ['trekking shoes', 'hiking boots', 'trail shoes', 'outdoor trekking footwear'],
  },

  // GROUP 7 — TRADITIONAL FOOTWEAR (5)
  {
    name: 'Kolhapuri Chappals',
    slug: 'kolhapuri-chappals',
    parentGroup: 'Traditional Footwear',
    expectedFilename: 'traditional-footwear/kolhapuri-chappals.jpg',
    image: '',
    description:
      'Handcrafted leather-style Kolhapuri chappals featuring braided T-straps and classic artisan stitching.',
    keywords: ['kolhapuri chappals', 'kolhapuri sandals', 'handcrafted kolhapuri'],
  },
  {
    name: 'Juttis',
    slug: 'juttis',
    parentGroup: 'Traditional Footwear',
    expectedFilename: 'traditional-footwear/juttis.jpg',
    image: '',
    description:
      'Traditional embroidered Indian juttis with rounded closed toes and cushioned slip-on footbeds.',
    keywords: ['juttis', 'punjabi jutti', 'embroidered juttis', 'ethnic jutti'],
  },
  {
    name: 'Mojaris',
    slug: 'mojaris',
    parentGroup: 'Traditional Footwear',
    expectedFilename: 'traditional-footwear/mojaris.jpg',
    image: '',
    description:
      'Classic ethnic mojaris crafted with distinctive upward-curved toes and ornamental festive detailing.',
    keywords: ['mojaris', 'mojri', 'curved toe mojari', 'wedding mojaris'],
  },
  {
    name: 'Ethnic Sandals',
    slug: 'ethnic-sandals',
    parentGroup: 'Traditional Footwear',
    expectedFilename: 'traditional-footwear/ethnic-sandals.jpg',
    image: '',
    description:
      'Decorative festive ethnic sandals featuring intricate metallic accents and comfortable block soles.',
    keywords: ['ethnic sandals', 'festive sandals', 'traditional indian sandals'],
  },
  {
    name: 'Traditional Slippers',
    slug: 'traditional-slippers',
    parentGroup: 'Traditional Footwear',
    expectedFilename: 'traditional-footwear/traditional-slippers.jpg',
    image: '',
    description:
      'Simple heritage traditional slip-on chappals and leather slides suited for cultural occasions and daily wear.',
    keywords: ['traditional slippers', 'ethnic slippers', 'traditional slip-on footwear'],
  },
];

export const INITIAL_FOOTWEAR_COLLECTIONS: FootwearCollection[] =
  RAW_FOOTWEAR_COLLECTIONS.map((item, idx) => {
    const groupMeta = GROUP_BY_NAME.get(item.parentGroup)!;
    return {
      id: `footwear-${groupMeta.slug}-${item.slug}`,
      name: item.name,
      slug: item.slug,
      parentCategory: 'Footwear',
      parentGroup: item.parentGroup,
      parentGroupSlug: groupMeta.slug,
      image: item.image,
      expectedFilename: item.expectedFilename,
      imageStatus: item.image ? 'generated' : 'quota_pending',
      description: item.description,
      keywords: item.keywords,
      status: 'approved',
      approved: true,
      displayOrder: idx + 1,
    };
  });

export function mergeFootwearCollections(
  existing: FootwearCollection[] = []
): FootwearCollection[] {
  const byId = new Map(existing.map((item) => [item.id, item]));
  return INITIAL_FOOTWEAR_COLLECTIONS.map((seed) => {
    const saved = byId.get(seed.id);
    if (!saved) return seed;
    const resolvedImage =
      saved.image && saved.image.trim() ? saved.image.trim() : seed.image;
    const resolvedImageStatus =
      resolvedImage && resolvedImage === saved.image?.trim()
        ? saved.imageStatus || 'uploaded'
        : resolvedImage
          ? seed.imageStatus
          : 'quota_pending';
    return {
      ...seed,
      ...saved,
      parentCategory: 'Footwear',
      parentGroup: seed.parentGroup,
      parentGroupSlug: seed.parentGroupSlug,
      expectedFilename: seed.expectedFilename,
      image: resolvedImage,
      imageStatus: resolvedImageStatus,
      displayOrder: seed.displayOrder,
    };
  });
}

export function getFootwearCollectionPath(
  collection: Pick<FootwearCollection, 'parentGroupSlug' | 'slug'>
): string {
  return `/footwear/${collection.parentGroupSlug}/${collection.slug}`;
}

export function findFootwearGroupBySlug(
  value?: string
): FootwearGroupMeta | undefined {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();
  return FOOTWEAR_GROUPS.find(
    (g) =>
      g.slug.toLowerCase() === clean ||
      g.name.toLowerCase() === clean ||
      g.name.toLowerCase().replace(/&/g, 'and') === clean.replace(/&/g, 'and')
  );
}

export function findFootwearCollection(
  collections: FootwearCollection[],
  slugOrName?: string,
  groupSlugOrName?: string
): FootwearCollection | undefined {
  if (!slugOrName) return undefined;
  const clean = slugOrName.trim().toLowerCase();
  const groupMeta = groupSlugOrName
    ? findFootwearGroupBySlug(groupSlugOrName)
    : undefined;
  const pool = groupMeta
    ? collections.filter((c) => c.parentGroup === groupMeta.name)
    : collections;

  return (
    pool.find(
      (c) =>
        c.slug.toLowerCase() === clean ||
        c.name.toLowerCase() === clean ||
        c.id.toLowerCase() === clean
    ) ||
    collections.find(
      (c) =>
        c.slug.toLowerCase() === clean ||
        c.name.toLowerCase() === clean ||
        c.id.toLowerCase() === clean
    )
  );
}

export function productMatchesFootwearCollection(
  product: Product,
  collection: FootwearCollection
): boolean {
  const catLower = (product.category || '').toLowerCase().trim();
  const subLower = (product.subcategory || '').toLowerCase().trim();
  const subSubLower = (product.subSubcategory || '').toLowerCase().trim();
  const colNameLower = collection.name.toLowerCase();
  const colSlugLower = collection.slug.toLowerCase();

  const isPrimaryFootwear = catLower === 'footwear';
  const isKidsFootwear =
    catLower === 'kids' && subLower === 'footwear';
  const isTeenFootwear =
    (catLower === 'teenager' || catLower === 'teenagers') &&
    subLower === 'footwear';

  if (!isPrimaryFootwear && !isKidsFootwear && !isTeenFootwear) {
    return false;
  }

  const productTags = (product.tags || []).map((t) => t.toLowerCase().trim());

  if (
    subSubLower === colNameLower ||
    subSubLower === colSlugLower ||
    subLower === colNameLower ||
    subLower === colSlugLower ||
    productTags.includes(colSlugLower) ||
    productTags.includes(colNameLower)
  ) {
    return true;
  }

  const haystack = [
    product.name,
    product.slug,
    product.shortDescription,
    ...(product.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return collection.keywords.some((kw) =>
    haystack.includes(kw.toLowerCase())
  );
}
