import type {
  AccessoriesCollection,
  AccessoriesGroupName,
  Product,
} from '../types';

export interface AccessoriesGroupMeta {
  name: AccessoriesGroupName;
  slug: string;
  folder: string;
  description: string;
}

export const ACCESSORIES_GROUPS: AccessoriesGroupMeta[] = [
  {
    name: 'Watches',
    slug: 'watches',
    folder: 'watches',
    description:
      'Classic analog timepieces, digital wristwatches, smartwatches, coordinated couple watch sets, and durable sports watches.',
  },
  {
    name: 'Bags & Wallets',
    slug: 'bags-wallets',
    folder: 'bags-wallets',
    description:
      'Structured everyday handbags, crossbody sling bags, commuter backpacks, bifold wallets, and sleek evening clutches.',
  },
  {
    name: 'Jewellery',
    slug: 'jewellery',
    folder: 'jewellery',
    description:
      'Minimalist pendant necklaces, sculpted earrings, bangle and chain bracelets, stackable rings, and delicate charm anklets.',
  },
  {
    name: 'Sunglasses & Eyewear',
    slug: 'eyewear',
    folder: 'eyewear',
    description:
      'UV-protective tinted sunglasses, clear fashion frames, lightweight reading glasses, and protective hard-shell eyeglass cases.',
  },
  {
    name: 'Belts & Fashion Accessories',
    slug: 'belts-fashion',
    folder: 'belts-fashion',
    description:
      'Full-grain leather dress belts, woven casual belts, structured cotton caps, wide-brim sun hats, and soft woven scarves.',
  },
  {
    name: 'Hair Accessories',
    slug: 'hair-accessories',
    folder: 'hair-accessories',
    description:
      'Acetate claw hair clips, padded knotted hair bands, silk satin scrunchies, and decorative pearl and metal hair pins.',
  },
  {
    name: 'Travel Accessories',
    slug: 'travel-accessories',
    folder: 'travel-accessories',
    description:
      'Pebbled leather luggage tags, structured zip travel pouches, bifold passport holders, and multi-pocket tech organizers.',
  },
  {
    name: 'Mobile Fashion Accessories',
    slug: 'mobile-accessories',
    folder: 'mobile-accessories',
    description:
      'Beaded mobile wrist phone charms, adjustable crossbody phone straps, and stylish botanical decorative phone cases.',
  },
];

const GROUP_BY_NAME = new Map<AccessoriesGroupName, AccessoriesGroupMeta>(
  ACCESSORIES_GROUPS.map((g) => [g.name, g])
);

interface RawAccessoriesSeed {
  name: string;
  slug: string;
  parentGroup: AccessoriesGroupName;
  expectedFilename: string;
  image: string;
  description: string;
  keywords: string[];
}

const RAW_ACCESSORIES_COLLECTIONS: RawAccessoriesSeed[] = [
  // GROUP 1 — WATCHES (5)
  {
    name: 'Analog Watches',
    slug: 'analog-watches',
    parentGroup: 'Watches',
    expectedFilename: 'watches/analog-watches.jpg',
    image: '/images/accessories/watches/analog-watches.jpg',
    description:
      'Classic three-hand and chronograph analog wristwatches crafted for timeless everyday and formal styling.',
    keywords: ['analog watch', 'analog watches', 'automatic timepiece', 'wristwatch'],
  },
  {
    name: 'Digital Watches',
    slug: 'digital-watches',
    parentGroup: 'Watches',
    expectedFilename: 'watches/digital-watches.jpg',
    image: '/images/accessories/watches/digital-watches.jpg',
    description:
      'Clear LCD digital wristwatches featuring crisp time displays, stopwatch functionality, and everyday comfort.',
    keywords: ['digital watch', 'digital watches', 'lcd watch', 'electronic watch'],
  },
  {
    name: 'Smart Watches',
    slug: 'smart-watches',
    parentGroup: 'Watches',
    expectedFilename: 'watches/smart-watches.jpg',
    image: '/images/accessories/watches/smart-watches.jpg',
    description:
      'Modern wearable smartwatches combining daily activity tracking, notifications, and interchangeable bands.',
    keywords: ['smart watch', 'smart watches', 'smartwatch', 'wearable watch'],
  },
  {
    name: 'Couple Watches',
    slug: 'couple-watches',
    parentGroup: 'Watches',
    expectedFilename: 'watches/couple-watches.jpg',
    image: '/images/accessories/watches/couple-watches.jpg',
    description:
      'Coordinated his-and-hers wristwatch pairs matching clean metallic dials and complementary strap proportions.',
    keywords: ['couple watch', 'couple watches', 'his and hers watches', 'pair watch'],
  },
  {
    name: 'Sports Watches',
    slug: 'sports-watches',
    parentGroup: 'Watches',
    expectedFilename: 'watches/sports-watches.jpg',
    image: '/images/accessories/watches/sports-watches.jpg',
    description:
      'Rugged shock-resistant sports wristwatches built with breathable straps for outdoor training and active days.',
    keywords: ['sports watch', 'sports watches', 'athletic watch', 'outdoor watch'],
  },

  // GROUP 2 — BAGS & WALLETS (5)
  {
    name: 'Handbags',
    slug: 'handbags',
    parentGroup: 'Bags & Wallets',
    expectedFilename: 'bags-wallets/handbags.jpg',
    image: '/images/accessories/bags-wallets/handbags.jpg',
    description:
      'Structured everyday handbags and shoulder totes crafted with neat top handles and organized inner compartments.',
    keywords: ['handbag', 'handbags', 'tote bag', 'shoulder bag'],
  },
  {
    name: 'Sling Bags',
    slug: 'sling-bags',
    parentGroup: 'Bags & Wallets',
    expectedFilename: 'bags-wallets/sling-bags.jpg',
    image: '/images/accessories/bags-wallets/sling-bags.jpg',
    description:
      'Compact crossbody sling bags with adjustable straps for hands-free daily errands and city outings.',
    keywords: ['sling bag', 'sling bags', 'crossbody bag', 'side bag'],
  },
  {
    name: 'Backpacks',
    slug: 'backpacks',
    parentGroup: 'Bags & Wallets',
    expectedFilename: 'bags-wallets/backpacks.jpg',
    image: '/images/accessories/bags-wallets/backpacks.jpg',
    description:
      'Minimalist everyday backpacks offering padded sleeves, zipped pockets, and comfortable shoulder straps.',
    keywords: ['backpack', 'backpacks', 'daypack', 'commuter bag'],
  },
  {
    name: 'Wallets',
    slug: 'wallets',
    parentGroup: 'Bags & Wallets',
    expectedFilename: 'bags-wallets/wallets.jpg',
    image: '/images/accessories/bags-wallets/wallets.jpg',
    description:
      'Slim leather bifold and cardholder wallets designed with crisp stitching for notes, cards, and daily carry.',
    keywords: ['wallet', 'wallets', 'bifold wallet', 'leather wallet', 'rfid wallet'],
  },
  {
    name: 'Clutches',
    slug: 'clutches',
    parentGroup: 'Bags & Wallets',
    expectedFilename: 'bags-wallets/clutches.jpg',
    image: '/images/accessories/bags-wallets/clutches.jpg',
    description:
      'Refined envelope evening clutches featuring clean magnetic closures for festive occasions and dinners.',
    keywords: ['clutch', 'clutches', 'evening bag', 'envelope clutch'],
  },

  // GROUP 3 — JEWELLERY (5)
  {
    name: 'Necklaces',
    slug: 'necklaces',
    parentGroup: 'Jewellery',
    expectedFilename: 'jewellery/necklaces.jpg',
    image: '/images/accessories/jewellery/necklaces.jpg',
    description:
      'Minimalist pendant chains and layered fashion necklaces crafted to complement both casual and festive outfits.',
    keywords: ['necklace', 'necklaces', 'pendant', 'chain necklace', 'jewellery'],
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    parentGroup: 'Jewellery',
    expectedFilename: 'jewellery/earrings.jpg',
    image: '/images/accessories/jewellery/earrings.jpg',
    description:
      'Sculpted hoops, pearl drops, and classic stud earrings designed for comfortable all-day wear.',
    keywords: ['earring', 'earrings', 'hoop earrings', 'drop earrings'],
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    parentGroup: 'Jewellery',
    expectedFilename: 'jewellery/bracelets.jpg',
    image: '/images/accessories/jewellery/bracelets.jpg',
    description:
      'Sleek metallic cuffs, bangle bands, and delicate link bracelets styled for solo or stacked wear.',
    keywords: ['bracelet', 'bracelets', 'bangle', 'chain bracelet'],
  },
  {
    name: 'Rings',
    slug: 'rings',
    parentGroup: 'Jewellery',
    expectedFilename: 'jewellery/rings.jpg',
    image: '/images/accessories/jewellery/rings.jpg',
    description:
      'Polished everyday band rings and minimalist statement rings finished in versatile metallic tones.',
    keywords: ['ring', 'rings', 'band ring', 'fashion ring'],
  },
  {
    name: 'Anklets',
    slug: 'anklets',
    parentGroup: 'Jewellery',
    expectedFilename: 'jewellery/anklets.jpg',
    image: '/images/accessories/jewellery/anklets.jpg',
    description:
      'Delicate link and bead-accented fashion anklets crafted with secure clasps for light warm-weather styling.',
    keywords: ['anklet', 'anklets', 'ankle bracelet', 'payal'],
  },

  // GROUP 4 — SUNGLASSES & EYEWEAR (4)
  {
    name: 'Sunglasses',
    slug: 'sunglasses',
    parentGroup: 'Sunglasses & Eyewear',
    expectedFilename: 'eyewear/sunglasses.jpg',
    image: '/images/accessories/eyewear/sunglasses.jpg',
    description:
      'Classic tortoiseshell, wayfarer, and aviator sunglasses designed with tinted lenses for outdoor comfort.',
    keywords: ['sunglasses', 'shades', 'polarized sunglasses', 'wayfarer'],
  },
  {
    name: 'Fashion Glasses',
    slug: 'fashion-glasses',
    parentGroup: 'Sunglasses & Eyewear',
    expectedFilename: 'eyewear/fashion-glasses.jpg',
    image: '/images/accessories/eyewear/fashion-glasses.jpg',
    description:
      'Lightweight wire-frame and clear-lens fashion eyewear shaped for modern everyday wardrobe styling.',
    keywords: ['fashion glasses', 'clear glasses', 'eyewear', 'optical frames'],
  },
  {
    name: 'Reading Glasses',
    slug: 'reading-glasses',
    parentGroup: 'Sunglasses & Eyewear',
    expectedFilename: 'eyewear/reading-glasses.jpg',
    image: '/images/accessories/eyewear/reading-glasses.jpg',
    description:
      'Slim rectangular reading glasses featuring balanced temple arms and clean optical frames.',
    keywords: ['reading glasses', 'readers', 'spectacles'],
  },
  {
    name: 'Eyeglass Cases',
    slug: 'eyeglass-cases',
    parentGroup: 'Sunglasses & Eyewear',
    expectedFilename: 'eyewear/eyeglass-cases.jpg',
    image: '/images/accessories/eyewear/eyeglass-cases.jpg',
    description:
      'Structured hard-shell clamshell eyeglass cases paired with soft lens cloths to protect frames on the go.',
    keywords: ['eyeglass case', 'eyeglass cases', 'glasses case', 'sunglass case'],
  },

  // GROUP 5 — BELTS & FASHION ACCESSORIES (5)
  {
    name: 'Leather Belts',
    slug: 'leather-belts',
    parentGroup: 'Belts & Fashion Accessories',
    expectedFilename: 'belts-fashion/leather-belts.jpg',
    image: '/images/accessories/belts-fashion/leather-belts.jpg',
    description:
      'Full-grain stitched leather waist belts finished with brushed metal buckles for formal and smart trousers.',
    keywords: ['leather belt', 'leather belts', 'dress belt', 'waist belt'],
  },
  {
    name: 'Casual Belts',
    slug: 'casual-belts',
    parentGroup: 'Belts & Fashion Accessories',
    expectedFilename: 'belts-fashion/casual-belts.jpg',
    image: '/images/accessories/belts-fashion/casual-belts.jpg',
    description:
      'Braided canvas and woven webbing casual belts tailored with easy D-ring buckles for relaxed daily wear.',
    keywords: ['casual belt', 'casual belts', 'canvas belt', 'braided belt'],
  },
  {
    name: 'Caps',
    slug: 'caps',
    parentGroup: 'Belts & Fashion Accessories',
    expectedFilename: 'belts-fashion/caps.jpg',
    image: '/images/accessories/belts-fashion/caps.jpg',
    description:
      'Structured cotton twill six-panel baseball caps featuring curved brims and breathable stitched eyelets.',
    keywords: ['cap', 'caps', 'baseball cap', 'cotton cap'],
  },
  {
    name: 'Hats',
    slug: 'hats',
    parentGroup: 'Belts & Fashion Accessories',
    expectedFilename: 'belts-fashion/hats.jpg',
    image: '/images/accessories/belts-fashion/hats.jpg',
    description:
      'Breathable woven straw and wide-brim sun hats crafted for comfortable outdoor shade and travel.',
    keywords: ['hat', 'hats', 'sun hat', 'straw hat', 'fedora hat'],
  },
  {
    name: 'Scarves',
    slug: 'scarves',
    parentGroup: 'Belts & Fashion Accessories',
    expectedFilename: 'belts-fashion/scarves.jpg',
    image: '/images/accessories/belts-fashion/scarves.jpg',
    description:
      'Soft woven plaid and lightweight draped scarves designed for effortless layering across seasons.',
    keywords: ['scarf', 'scarves', 'woven scarf', 'plaid scarf'],
  },

  // GROUP 6 — HAIR ACCESSORIES (4)
  {
    name: 'Hair Clips',
    slug: 'hair-clips',
    parentGroup: 'Hair Accessories',
    expectedFilename: 'hair-accessories/hair-clips.jpg',
    image: '/images/accessories/hair-accessories/hair-clips.jpg',
    description:
      'Glossy tortoiseshell and pearl-inlaid acetate claw hair clips offering comfortable hold for daily hairstyles.',
    keywords: ['hair clip', 'hair clips', 'claw clip', 'claw clips'],
  },
  {
    name: 'Hair Bands',
    slug: 'hair-bands',
    parentGroup: 'Hair Accessories',
    expectedFilename: 'hair-accessories/hair-bands.jpg',
    image: '/images/accessories/hair-accessories/hair-bands.jpg',
    description:
      'Padded satin knotted headbands shaped gently to frame hair without pinching behind the ears.',
    keywords: ['hair band', 'hair bands', 'headband', 'headbands'],
  },
  {
    name: 'Scrunchies',
    slug: 'scrunchies',
    parentGroup: 'Hair Accessories',
    expectedFilename: 'hair-accessories/scrunchies.jpg',
    image: '/images/accessories/hair-accessories/scrunchies.jpg',
    description:
      'Smooth silk-satin hair scrunchies crafted to tie ponytails and buns gently with reduced creasing.',
    keywords: ['scrunchie', 'scrunchies', 'silk scrunchie', 'hair tie'],
  },
  {
    name: 'Hair Pins',
    slug: 'hair-pins',
    parentGroup: 'Hair Accessories',
    expectedFilename: 'hair-accessories/hair-pins.jpg',
    image: '/images/accessories/hair-accessories/hair-pins.jpg',
    description:
      'Decorative pearl and minimalist metallic bobby hair pins built to secure updos and side-swept styles.',
    keywords: ['hair pin', 'hair pins', 'bobby pins', 'pearl hair pins'],
  },

  // GROUP 7 — TRAVEL ACCESSORIES (4)
  {
    name: 'Luggage Tags',
    slug: 'luggage-tags',
    parentGroup: 'Travel Accessories',
    expectedFilename: 'travel-accessories/luggage-tags.jpg',
    image: '/images/accessories/travel-accessories/luggage-tags.jpg',
    description:
      'Pebbled leather suitcase luggage tags fitted with secure buckle straps and privacy cover flaps.',
    keywords: ['luggage tag', 'luggage tags', 'bag tag', 'suitcase tag'],
  },
  {
    name: 'Travel Pouches',
    slug: 'travel-pouches',
    parentGroup: 'Travel Accessories',
    expectedFilename: 'travel-accessories/travel-pouches.jpg',
    image: '/images/accessories/travel-accessories/travel-pouches.jpg',
    description:
      'Structured zip-top nylon travel pouches sized cleanly for toiletries, cosmetics, and small carry-on items.',
    keywords: ['travel pouch', 'travel pouches', 'toiletry pouch', 'zip pouch'],
  },
  {
    name: 'Passport Holders',
    slug: 'passport-holders',
    parentGroup: 'Travel Accessories',
    expectedFilename: 'travel-accessories/passport-holders.jpg',
    image: '/images/accessories/travel-accessories/passport-holders.jpg',
    description:
      'Slim leather bifold passport holders featuring dedicated boarding pass and travel card pockets.',
    keywords: ['passport holder', 'passport holders', 'passport cover', 'travel wallet'],
  },
  {
    name: 'Travel Organizers',
    slug: 'travel-organizers',
    parentGroup: 'Travel Accessories',
    expectedFilename: 'travel-accessories/travel-organizers.jpg',
    image: '/images/accessories/travel-accessories/travel-organizers.jpg',
    description:
      'Zip-around multi-pocket travel organizers keeping chargers, adapters, cables, and accessories neatly sorted.',
    keywords: ['travel organizer', 'travel organizers', 'cable organizer', 'packing organizer'],
  },

  // GROUP 8 — MOBILE FASHION ACCESSORIES (3)
  {
    name: 'Phone Charms',
    slug: 'phone-charms',
    parentGroup: 'Mobile Fashion Accessories',
    expectedFilename: 'mobile-accessories/phone-charms.jpg',
    image: '/images/accessories/mobile-accessories/phone-charms.jpg',
    description:
      'Pastel bead, faux-pearl, and crystal mobile phone wrist charms adding playful grip security to smartphones.',
    keywords: ['phone charm', 'phone charms', 'beaded phone strap', 'wrist charm'],
  },
  {
    name: 'Phone Straps',
    slug: 'phone-straps',
    parentGroup: 'Mobile Fashion Accessories',
    expectedFilename: 'mobile-accessories/phone-straps.jpg',
    image: '/images/accessories/mobile-accessories/phone-straps.jpg',
    description:
      'Adjustable woven crossbody smartphone straps with metal swivel clasps and ultra-thin tether tabs.',
    keywords: ['phone strap', 'phone straps', 'crossbody phone lanyard', 'mobile lanyard'],
  },
  {
    name: 'Decorative Phone Cases',
    slug: 'decorative-phone-cases',
    parentGroup: 'Mobile Fashion Accessories',
    expectedFilename: 'mobile-accessories/decorative-phone-cases.jpg',
    image: '/images/accessories/mobile-accessories/decorative-phone-cases.jpg',
    description:
      'Stylish translucent botanical and patterned protective smartphone bumper cases for everyday mobile flair.',
    keywords: ['decorative phone case', 'decorative phone cases', 'fashion phone case', 'mobile cover'],
  },
];

export const INITIAL_ACCESSORIES_COLLECTIONS: AccessoriesCollection[] =
  RAW_ACCESSORIES_COLLECTIONS.map((item, idx) => {
    const groupMeta = GROUP_BY_NAME.get(item.parentGroup)!;
    const hasImage = Boolean(item.image);
    return {
      id: `acc-col-${item.slug}`,
      name: item.name,
      slug: item.slug,
      parentCategory: 'Accessories',
      parentGroup: item.parentGroup,
      parentGroupSlug: groupMeta.slug,
      image: item.image,
      expectedFilename: item.expectedFilename,
      imageStatus: hasImage ? 'generated' : 'quota_pending',
      description: item.description,
      keywords: item.keywords,
      status: 'approved',
      approved: true,
      displayOrder: idx + 1,
    };
  });

export function mergeAccessoriesCollections(
  existing: AccessoriesCollection[] = []
): AccessoriesCollection[] {
  const byId = new Map(existing.map((item) => [item.id, item]));
  return INITIAL_ACCESSORIES_COLLECTIONS.map((seed) => {
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
      parentCategory: 'Accessories',
      parentGroup: seed.parentGroup,
      parentGroupSlug: seed.parentGroupSlug,
      expectedFilename: seed.expectedFilename,
      image: resolvedImage,
      imageStatus: resolvedImageStatus,
      displayOrder: seed.displayOrder,
    };
  });
}

export function getAccessoriesCollectionPath(
  collection: Pick<AccessoriesCollection, 'parentGroupSlug' | 'slug'>
): string {
  return `/accessories/${collection.parentGroupSlug}/${collection.slug}`;
}

export function findAccessoriesGroupBySlug(
  value?: string
): AccessoriesGroupMeta | undefined {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();
  return ACCESSORIES_GROUPS.find(
    (g) =>
      g.slug.toLowerCase() === clean ||
      g.name.toLowerCase() === clean ||
      g.name.toLowerCase().replace(/&/g, 'and') === clean.replace(/&/g, 'and')
  );
}

export function findAccessoriesCollection(
  collections: AccessoriesCollection[],
  slugOrName?: string,
  groupSlugOrName?: string
): AccessoriesCollection | undefined {
  if (!slugOrName) return undefined;
  const clean = slugOrName.trim().toLowerCase();
  const groupMeta = groupSlugOrName
    ? findAccessoriesGroupBySlug(groupSlugOrName)
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

export function productMatchesAccessoriesCollection(
  product: Product,
  collection: AccessoriesCollection
): boolean {
  const catLower = (product.category || '').toLowerCase().trim();
  const subLower = (product.subcategory || '').toLowerCase().trim();
  const subSubLower = (product.subSubcategory || '').toLowerCase().trim();
  const colNameLower = collection.name.toLowerCase();
  const colSlugLower = collection.slug.toLowerCase();

  const isPrimaryAccessories =
    catLower === 'accessories' || catLower === 'watches';

  // Reuse canonical overlapping items in Electronics (Smart Watches) & Hair Care (Hair Clips/Bands/Scrunchies/Pins)
  // without creating duplicate products
  const isSharedSmartWatch =
    colSlugLower === 'smart-watches' && catLower === 'electronics';
  const isSharedHairAccessory =
    (colSlugLower === 'hair-clips' ||
      colSlugLower === 'hair-bands' ||
      colSlugLower === 'scrunchies' ||
      colSlugLower === 'hair-pins') &&
    (catLower === 'hair care' ||
      (catLower === 'kids' && subLower === 'accessories'));

  if (!isPrimaryAccessories && !isSharedSmartWatch && !isSharedHairAccessory) {
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
