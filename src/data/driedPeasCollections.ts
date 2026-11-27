import type {
  DriedPeasCollection,
  DriedPeasGroupName,
  Product,
} from '../types';

export interface DriedPeasGroupMeta {
  name: DriedPeasGroupName;
  slug: string;
  folder: string;
  description: string;
}

export const DRIED_PEAS_GROUPS: DriedPeasGroupMeta[] = [
  {
    name: 'Dried Peas',
    slug: 'peas',
    folder: 'peas',
    description:
      'Whole and split dried field peas including green peas, yellow peas, and white vatana for sundal, ragda, and daily soups.',
  },
  {
    name: 'Related Dried Pulses & Legumes',
    slug: 'pulses-legumes',
    folder: 'pulses-legumes',
    description:
      'Essential whole dried chickpeas, black chickpeas, green gram, black gram, cowpeas, kidney beans, field beans, moth beans, and horse gram.',
  },
];

const GROUP_BY_NAME = new Map<DriedPeasGroupName, DriedPeasGroupMeta>(
  DRIED_PEAS_GROUPS.map((g) => [g.name, g])
);

interface RawDriedPeasSeed {
  name: string;
  slug: string;
  parentGroup: DriedPeasGroupName;
  expectedFilename: string;
  image: string;
  description: string;
  keywords: string[];
}

const RAW_DRIED_PEAS_COLLECTIONS: RawDriedPeasSeed[] = [
  // GROUP 1 — DRIED PEAS (5)
  {
    name: 'Dried Green Peas',
    slug: 'dried-green-peas',
    parentGroup: 'Dried Peas',
    expectedFilename: 'peas/dried-green-peas.jpg',
    image: '/images/dried-peas/peas/dried-green-peas.jpg',
    description:
      'Whole sun-dried green field peas ideal for South Indian sundal, chaat fillings, and hearty curries.',
    keywords: [
      'dried green peas',
      'green peas',
      'whole green peas',
      'pachai pattani',
      'green vatana',
    ],
  },
  {
    name: 'Dried Yellow Peas',
    slug: 'dried-yellow-peas',
    parentGroup: 'Dried Peas',
    expectedFilename: 'peas/dried-yellow-peas.jpg',
    image: '/images/dried-peas/peas/dried-yellow-peas.jpg',
    description:
      'Whole golden-yellow dried field peas valued for thick stews, ghugni, and comforting winter soups.',
    keywords: [
      'dried yellow peas',
      'yellow peas',
      'whole yellow peas',
      'yellow vatana',
    ],
  },
  {
    name: 'Dried White Peas',
    slug: 'dried-white-peas',
    parentGroup: 'Dried Peas',
    expectedFilename: 'peas/dried-white-peas.jpg',
    image: '/images/dried-peas/peas/dried-white-peas.jpg',
    description:
      'Creamy pale whole white peas suited for ragda patties, matar kulcha, and spiced street-style bowls.',
    keywords: [
      'dried white peas',
      'white peas',
      'safed vatana',
      'white vatana',
      'ragda peas',
    ],
  },
  {
    name: 'Split Green Peas',
    slug: 'split-green-peas',
    parentGroup: 'Dried Peas',
    expectedFilename: 'peas/split-green-peas.jpg',
    image: '/images/dried-peas/peas/split-green-peas.jpg',
    description:
      'Cleanly halved dried green peas that cook smoothly into thick protein-rich soups and rustic dals.',
    keywords: [
      'split green peas',
      'green split peas',
      'halved green peas',
    ],
  },
  {
    name: 'Split Yellow Peas',
    slug: 'split-yellow-peas',
    parentGroup: 'Dried Peas',
    expectedFilename: 'peas/split-yellow-peas.jpg',
    image: '',
    description:
      'Uniformly split yellow dried peas for everyday dals, masala vada, and traditional simmered stews.',
    keywords: [
      'split yellow peas',
      'yellow split peas',
      'matar dal',
      'split yellow dried peas',
    ],
  },

  // GROUP 2 — RELATED DRIED PULSES & LEGUMES (10)
  {
    name: 'Dried Chickpeas',
    slug: 'dried-chickpeas',
    parentGroup: 'Related Dried Pulses & Legumes',
    expectedFilename: 'pulses-legumes/dried-chickpeas.jpg',
    image: '',
    description:
      'Creamy whole white garbanzo beans ideal for chole, hummus, roasted snacks, and protein salads.',
    keywords: [
      'dried chickpeas',
      'chickpeas',
      'kabuli chana',
      'garbanzo beans',
      'white chickpeas',
    ],
  },
  {
    name: 'Black Chickpeas',
    slug: 'black-chickpeas',
    parentGroup: 'Related Dried Pulses & Legumes',
    expectedFilename: 'pulses-legumes/black-chickpeas.jpg',
    image: '',
    description:
      'Earthy dark brown desi kala chana rich in fiber and plant protein for sundal and spiced gravies.',
    keywords: [
      'black chickpeas',
      'kala chana',
      'desi chana',
      'brown chickpeas',
      'kondakadalai',
    ],
  },
  {
    name: 'Green Gram',
    slug: 'green-gram',
    parentGroup: 'Related Dried Pulses & Legumes',
    expectedFilename: 'pulses-legumes/green-gram.jpg',
    image: '',
    description:
      'Whole olive-green moong beans suitable for sprouting, payaru sundal, curries, and light dals.',
    keywords: [
      'green gram',
      'whole moong',
      'moong beans',
      'pasi payaru',
      'mung bean',
    ],
  },
  {
    name: 'Black Gram',
    slug: 'black-gram',
    parentGroup: 'Related Dried Pulses & Legumes',
    expectedFilename: 'pulses-legumes/black-gram.jpg',
    image: '',
    description:
      'Whole black urad beans traditionally simmered for dal makhani, ulundhu kali, and savory batters.',
    keywords: [
      'black gram',
      'whole urad',
      'urad beans',
      'ulundhu',
      'sabut urad',
    ],
  },
  {
    name: 'Cowpeas',
    slug: 'cowpeas',
    parentGroup: 'Related Dried Pulses & Legumes',
    expectedFilename: 'pulses-legumes/cowpeas.jpg',
    image: '',
    description:
      'Cream-colored black-eyed peas prized for soft lobia curries, karamani sundal, and bean stews.',
    keywords: [
      'cowpeas',
      'black eyed peas',
      'lobia',
      'karamani',
      'thatta payaru',
    ],
  },
  {
    name: 'Red Kidney Beans',
    slug: 'red-kidney-beans',
    parentGroup: 'Related Dried Pulses & Legumes',
    expectedFilename: 'pulses-legumes/red-kidney-beans.jpg',
    image: '',
    description:
      'Glossy deep-red rajma beans that hold their shape in rich tomato gravies, chili, and grain bowls.',
    keywords: [
      'red kidney beans',
      'kidney beans',
      'rajma',
      'red rajma',
    ],
  },
  {
    name: 'White Kidney Beans',
    slug: 'white-kidney-beans',
    parentGroup: 'Related Dried Pulses & Legumes',
    expectedFilename: 'pulses-legumes/white-kidney-beans.jpg',
    image: '',
    description:
      'Plump ivory cannellini-style white kidney beans with a creamy texture for soups, stews, and salads.',
    keywords: [
      'white kidney beans',
      'cannellini beans',
      'white rajma',
      'safed rajma',
    ],
  },
  {
    name: 'Field Beans',
    slug: 'field-beans',
    parentGroup: 'Related Dried Pulses & Legumes',
    expectedFilename: 'pulses-legumes/field-beans.jpg',
    image: '',
    description:
      'Flat speckled dried hyacinth field beans (mochai) used in traditional South Indian kuzhambu and sundal.',
    keywords: [
      'field beans',
      'mochai',
      'dry mochai',
      'hyacinth beans',
      'avarekalu',
    ],
  },
  {
    name: 'Moth Beans',
    slug: 'moth-beans',
    parentGroup: 'Related Dried Pulses & Legumes',
    expectedFilename: 'pulses-legumes/moth-beans.jpg',
    image: '',
    description:
      'Small earthy-brown matki beans favored for sprouting, misal curries, and spiced dry snacks.',
    keywords: [
      'moth beans',
      'matki',
      'turkish gram',
      'dew beans',
    ],
  },
  {
    name: 'Horse Gram',
    slug: 'horse-gram',
    parentGroup: 'Related Dried Pulses & Legumes',
    expectedFilename: 'pulses-legumes/horse-gram.jpg',
    image: '',
    description:
      'Nutrient-dense reddish-brown kollu beans used for peppery rasam, traditional chutneys, and sundal.',
    keywords: [
      'horse gram',
      'kollu',
      'kulthi',
      'ulavalu',
    ],
  },
];

export const INITIAL_DRIED_PEAS_COLLECTIONS: DriedPeasCollection[] =
  RAW_DRIED_PEAS_COLLECTIONS.map((item, idx) => {
    const groupMeta = GROUP_BY_NAME.get(item.parentGroup)!;
    const hasImage = Boolean(item.image);
    return {
      id: `dp-col-${item.slug}`,
      name: item.name,
      slug: item.slug,
      parentCategory: 'Dried Peas',
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

export function mergeDriedPeasCollections(
  existing: DriedPeasCollection[] = []
): DriedPeasCollection[] {
  const byId = new Map(existing.map((item) => [item.id, item]));
  return INITIAL_DRIED_PEAS_COLLECTIONS.map((seed) => {
    const saved = byId.get(seed.id);
    if (!saved) return seed;

    const savedImage =
      typeof saved.image === 'string' && saved.image.trim()
        ? saved.image.trim()
        : '';
    // Keep uploaded images, or valid seed images, and clear legacy broken paths
    const useImage = savedImage.startsWith('/uploads/')
      ? savedImage
      : seed.image || '';
    const imageStatus: DriedPeasCollection['imageStatus'] = !useImage
      ? 'quota_pending'
      : useImage.startsWith('/uploads/')
        ? 'uploaded'
        : 'generated';

    const status =
      saved.status === 'pending_approval' ? 'pending_approval' : 'approved';

    return {
      ...seed,
      name:
        typeof saved.name === 'string' && saved.name.trim()
          ? saved.name.trim()
          : seed.name,
      description:
        typeof saved.description === 'string' && saved.description.trim()
          ? saved.description.trim()
          : seed.description,
      image: useImage,
      imageStatus,
      keywords:
        Array.isArray(saved.keywords) && saved.keywords.length > 0
          ? saved.keywords
          : seed.keywords,
      status,
      approved: status === 'approved',
    };
  });
}

export function getDriedPeasCollectionPath(
  col: Pick<DriedPeasCollection, 'parentGroupSlug' | 'slug'>
): string {
  return `/dried-peas/${col.parentGroupSlug}/${col.slug}`;
}

export function findDriedPeasGroupBySlug(
  value?: string
): DriedPeasGroupMeta | undefined {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();
  return DRIED_PEAS_GROUPS.find(
    (g) =>
      g.slug.toLowerCase() === clean ||
      g.name.toLowerCase() === clean ||
      g.name.toLowerCase().replace(/&/g, 'and') === clean.replace(/&/g, 'and')
  );
}

export function findDriedPeasCollection(
  collections: DriedPeasCollection[],
  slugOrName?: string,
  groupSlugOrName?: string
): DriedPeasCollection | undefined {
  if (!slugOrName) return undefined;
  const clean = slugOrName.trim().toLowerCase();
  const groupMeta = groupSlugOrName
    ? findDriedPeasGroupBySlug(groupSlugOrName)
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

export function productMatchesDriedPeasCollection(
  product: Product,
  collection: DriedPeasCollection
): boolean {
  const catLower = (product.category || '').toLowerCase().trim();
  if (catLower !== 'dry peas' && catLower !== 'dried peas') {
    return false;
  }

  const colNameLower = collection.name.toLowerCase();
  const colSlugLower = collection.slug.toLowerCase();
  const subLower = (product.subcategory || '').toLowerCase().trim();
  const subSubLower = (product.subSubcategory || '').toLowerCase().trim();
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

  // Exact type match on existing catalog products without cross-matching Split vs Whole Peas
  const haystack = `${product.name || ''} ${product.slug || ''}`
    .toLowerCase()
    .trim();

  if (colSlugLower === 'dried-green-peas') {
    return haystack.includes('green') && haystack.includes('peas') && !haystack.includes('split');
  }
  if (colSlugLower === 'split-green-peas') {
    return haystack.includes('split') && haystack.includes('green') && haystack.includes('peas');
  }
  if (colSlugLower === 'dried-yellow-peas') {
    return haystack.includes('yellow') && haystack.includes('peas') && !haystack.includes('split');
  }
  if (colSlugLower === 'split-yellow-peas') {
    return haystack.includes('split') && haystack.includes('yellow') && haystack.includes('peas');
  }
  if (colSlugLower === 'dried-white-peas') {
    return haystack.includes('white') && haystack.includes('peas');
  }
  if (colSlugLower === 'dried-chickpeas') {
    return (
      (haystack.includes('chickpea') || haystack.includes('kabuli')) &&
      !haystack.includes('black') &&
      !haystack.includes('kala')
    );
  }
  if (colSlugLower === 'black-chickpeas') {
    return (
      haystack.includes('black chickpea') ||
      haystack.includes('kala chana') ||
      haystack.includes('black-chickpea')
    );
  }
  if (colSlugLower === 'white-kidney-beans') {
    return haystack.includes('white kidney') || haystack.includes('cannellini');
  }
  if (colSlugLower === 'red-kidney-beans') {
    return haystack.includes('red kidney') || (haystack.includes('rajma') && !haystack.includes('white'));
  }

  const normalizedHaystack = [
    product.name,
    product.slug,
    product.shortDescription,
    ...(product.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return collection.keywords.some((kw) =>
    normalizedHaystack.includes(kw.toLowerCase())
  );
}
