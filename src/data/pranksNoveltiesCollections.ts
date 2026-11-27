import type {
  PranksNoveltiesCollection,
  PranksNoveltiesGroupName,
  Product,
} from '../types';

export interface PranksNoveltiesGroupMeta {
  name: PranksNoveltiesGroupName;
  slug: string;
  folder: string;
  description: string;
}

export const PRANKS_NOVELTIES_GROUPS: PranksNoveltiesGroupMeta[] = [
  {
    name: 'Funny Prank Toys',
    slug: 'funny-prank-toys',
    folder: 'funny-prank-toys',
    description:
      'Classic lighthearted gag props including whoopee cushions, plastic novelty bugs, flexible toy snakes, and spring surprise boxes.',
  },
  {
    name: 'Magic & Trick Toys',
    slug: 'magic-trick-toys',
    folder: 'magic-trick-toys',
    description:
      'Beginner magic trick kits, disappearing coin illusions, classic magician wands, and trick playing card decks.',
  },
  {
    name: 'Funny Gadgets',
    slug: 'funny-gadgets',
    folder: 'funny-gadgets',
    description:
      'Handheld voice changers, sound-effect buttons, plush dancing cactus toys, and playful mini talking novelties.',
  },
  {
    name: 'Novelty Gifts',
    slug: 'novelty-gifts',
    folder: 'novelty-gifts',
    description:
      'Sculptural coffee mugs, mini tabletop punching bags, miniature keychains, and amusing desktop novelty gifts.',
  },
  {
    name: 'Party Pranks',
    slug: 'party-pranks',
    folder: 'party-pranks',
    description:
      'Unopened commercial confetti poppers, oversized party glasses, festive comic masks, and inflatable costumes.',
  },
  {
    name: 'Stress Relief & Fidget Toys',
    slug: 'fidget-toys',
    folder: 'fidget-toys',
    description:
      'Silicone pop-it boards, soft squishy toys, three-arm fidget spinners, squeezable stress balls, and large desktop magnetic fidgets.',
  },
  {
    name: 'Fun Room Decor',
    slug: 'fun-room-decor',
    folder: 'fun-room-decor',
    description:
      'Decorative LED neon wall signs, mini lava lamps, electric plasma globe lamps, and playful bedside night lights.',
  },
];

const GROUP_BY_NAME = new Map<PranksNoveltiesGroupName, PranksNoveltiesGroupMeta>(
  PRANKS_NOVELTIES_GROUPS.map((g) => [g.name, g])
);

interface RawPranksNoveltiesSeed {
  name: string;
  slug: string;
  parentGroup: PranksNoveltiesGroupName;
  expectedFilename: string;
  image: string;
  description: string;
  keywords: string[];
}

const RAW_PRANKS_NOVELTIES_COLLECTIONS: RawPranksNoveltiesSeed[] = [
  // GROUP 1 — FUNNY PRANK TOYS (5)
  {
    name: 'Whoopee Cushion',
    slug: 'whoopee-cushion',
    parentGroup: 'Funny Prank Toys',
    expectedFilename: 'funny-prank-toys/whoopee-cushion.jpg',
    image: '',
    description:
      'Classic inflatable rubber prank cushion for lighthearted family gatherings and party gag gifts.',
    keywords: ['whoopee cushion', 'whoopie cushion', 'rubber prank cushion'],
  },
  {
    name: 'Fake Cockroach',
    slug: 'fake-cockroach',
    parentGroup: 'Funny Prank Toys',
    expectedFilename: 'funny-prank-toys/fake-cockroach.jpg',
    image: '',
    description:
      'Moulded plastic novelty toy cockroach designed strictly as a harmless joke and party prank prop.',
    keywords: ['fake cockroach', 'toy cockroach', 'plastic cockroach prank'],
  },
  {
    name: 'Fake Spider',
    slug: 'fake-spider',
    parentGroup: 'Funny Prank Toys',
    expectedFilename: 'funny-prank-toys/fake-spider.jpg',
    image: '',
    description:
      'Artificial plastic toy spider novelty prop for playful pranks and party decorations.',
    keywords: ['fake spider', 'toy spider', 'plastic spider prank'],
  },
  {
    name: 'Fake Snake',
    slug: 'fake-snake',
    parentGroup: 'Funny Prank Toys',
    expectedFilename: 'funny-prank-toys/fake-snake.jpg',
    image: '',
    description:
      'Flexible moulded rubber toy snake created as a harmless prank prop and garden gag toy.',
    keywords: ['fake snake', 'rubber snake', 'toy snake prank'],
  },
  {
    name: 'Jumping Surprise Box',
    slug: 'jumping-surprise-box',
    parentGroup: 'Funny Prank Toys',
    expectedFilename: 'funny-prank-toys/jumping-surprise-box.jpg',
    image: '',
    description:
      'Colourful spring-loaded surprise box featuring a playful pop-up toy character for party laughs.',
    keywords: [
      'jumping surprise box',
      'jack in the box',
      'spring surprise box',
      'surprise gag box',
    ],
  },

  // GROUP 2 — MAGIC & TRICK TOYS (4)
  {
    name: 'Magic Trick Kit',
    slug: 'magic-trick-kit',
    parentGroup: 'Magic & Trick Toys',
    expectedFilename: 'magic-trick-toys/magic-trick-kit.jpg',
    image: '',
    description:
      'Beginner magic kit containing safe, classic tabletop illusion props for family shows and hobbyists.',
    keywords: ['magic trick kit', 'magic box', 'magic kit', 'magic set'],
  },
  {
    name: 'Disappearing Coin Trick',
    slug: 'disappearing-coin-trick',
    parentGroup: 'Magic & Trick Toys',
    expectedFilename: 'magic-trick-toys/disappearing-coin-trick.jpg',
    image: '',
    description:
      'Classic coin illusion trick prop crafted for close-up magic performances and party entertainment.',
    keywords: [
      'disappearing coin trick',
      'coin trick',
      'magic coin',
      'coin illusion',
    ],
  },
  {
    name: 'Magic Wand',
    slug: 'magic-wand',
    parentGroup: 'Magic & Trick Toys',
    expectedFilename: 'magic-trick-toys/magic-wand.jpg',
    image: '',
    description:
      'Classic black magician wand with white tips for costume parties, stage skits, and magic shows.',
    keywords: ['magic wand', 'magician wand', 'wand prop'],
  },
  {
    name: 'Trick Cards',
    slug: 'trick-cards',
    parentGroup: 'Magic & Trick Toys',
    expectedFilename: 'magic-trick-toys/trick-cards.jpg',
    image: '',
    description:
      'Novelty magic playing card deck designed for sleight-of-hand illusions and family card tricks.',
    keywords: ['trick cards', 'magic cards', 'illusion playing cards'],
  },

  // GROUP 3 — FUNNY GADGETS (4)
  {
    name: 'Voice Changer Toy',
    slug: 'voice-changer-toy',
    parentGroup: 'Funny Gadgets',
    expectedFilename: 'funny-gadgets/voice-changer-toy.jpg',
    image: '',
    description:
      'Compact handheld novelty voice changer microphone with playful pitch-altering sound modes.',
    keywords: ['voice changer toy', 'voice changer', 'funny voice toy'],
  },
  {
    name: 'Funny Sound Machine',
    slug: 'funny-sound-machine',
    parentGroup: 'Funny Gadgets',
    expectedFilename: 'funny-gadgets/funny-sound-machine.jpg',
    image: '',
    description:
      'Pocket-sized novelty sound-effects button box with entertaining comic audio chimes.',
    keywords: ['funny sound machine', 'sound button', 'sound effects toy'],
  },
  {
    name: 'Dancing Cactus Toy',
    slug: 'dancing-cactus-toy',
    parentGroup: 'Funny Gadgets',
    expectedFilename: 'funny-gadgets/dancing-cactus-toy.jpg',
    image: '',
    description:
      'Cheerful plush dancing cactus novelty toy seated in a miniature pot for upbeat room fun.',
    keywords: ['dancing cactus toy', 'dancing cactus', 'plush cactus toy'],
  },
  {
    name: 'Mini Talking Toy',
    slug: 'mini-talking-toy',
    parentGroup: 'Funny Gadgets',
    expectedFilename: 'funny-gadgets/mini-talking-toy.jpg',
    image: '',
    description:
      'Friendly miniature interactive talking novelty toy with playful voice-repeat fun.',
    keywords: ['mini talking toy', 'talking toy', 'repeat talking novelty'],
  },

  // GROUP 4 — NOVELTY GIFTS (4)
  {
    name: 'Funny Coffee Mug',
    slug: 'funny-coffee-mug',
    parentGroup: 'Novelty Gifts',
    expectedFilename: 'novelty-gifts/funny-coffee-mug.jpg',
    image: '',
    description:
      'Unbranded sculptural ceramic coffee mug with an amusing silhouette for cheerful gifting.',
    keywords: ['funny coffee mug', 'novelty mug', 'quirky coffee cup'],
  },
  {
    name: 'Mini Desktop Punching Bag',
    slug: 'mini-desktop-punching-bag',
    parentGroup: 'Novelty Gifts',
    expectedFilename: 'novelty-gifts/mini-desktop-punching-bag.jpg',
    image: '',
    description:
      'Spring-mounted tabletop punching bag with a strong suction base for lighthearted desk breaks.',
    keywords: [
      'mini desktop punching bag',
      'desk punching bag',
      'tabletop punching bag',
    ],
  },
  {
    name: 'Novelty Keychain',
    slug: 'novelty-keychain',
    parentGroup: 'Novelty Gifts',
    expectedFilename: 'novelty-gifts/novelty-keychain.jpg',
    image: '',
    description:
      'Creative miniature novelty keyring accessory ideal for gift exchanges, backpacks, and keys.',
    keywords: ['novelty keychain', 'funny keychain', 'miniature keyring'],
  },
  {
    name: 'Funny Desk Toy',
    slug: 'funny-desk-toy',
    parentGroup: 'Novelty Gifts',
    expectedFilename: 'novelty-gifts/funny-desk-toy.jpg',
    image: '',
    description:
      'Playful kinetic desk ornament and balance novelty toy for workspaces and study tables.',
    keywords: ['funny desk toy', 'kinetic desk toy', 'desktop novelty'],
  },

  // GROUP 5 — PARTY PRANKS (4)
  {
    name: 'Confetti Popper',
    slug: 'confetti-popper',
    parentGroup: 'Party Pranks',
    expectedFilename: 'party-pranks/confetti-popper.jpg',
    image: '',
    description:
      'Commercial unopened celebratory party confetti popper for birthdays, anniversaries, and fests.',
    keywords: ['confetti popper', 'party confetti', 'celebration popper'],
  },
  {
    name: 'Silly Party Glasses',
    slug: 'silly-party-glasses',
    parentGroup: 'Party Pranks',
    expectedFilename: 'party-pranks/silly-party-glasses.jpg',
    image: '',
    description:
      'Oversized colourful party glasses and comic disguise eyewear for photobooths and celebrations.',
    keywords: [
      'silly party glasses',
      'funny disguise glasses',
      'party glasses',
      'novelty eyewear',
    ],
  },
  {
    name: 'Funny Party Masks',
    slug: 'funny-party-masks',
    parentGroup: 'Party Pranks',
    expectedFilename: 'party-pranks/funny-party-masks.jpg',
    image: '',
    description:
      'Playful novelty costume masks suited for theme parties, college fests, and stage skits.',
    keywords: [
      'funny party masks',
      'party mask',
      'novelty mask',
      'costume mask',
    ],
  },
  {
    name: 'Inflatable Costume',
    slug: 'inflatable-costume',
    parentGroup: 'Party Pranks',
    expectedFilename: 'party-pranks/inflatable-costume.jpg',
    image: '',
    description:
      'Humorous full-body blow-up party costume designed for hilarious entrances and costume events.',
    keywords: [
      'inflatable costume',
      'blow up costume',
      'funny party costume',
    ],
  },

  // GROUP 6 — STRESS RELIEF & FIDGET TOYS (5)
  {
    name: 'Pop It Fidget Toy',
    slug: 'pop-it-fidget-toy',
    parentGroup: 'Stress Relief & Fidget Toys',
    expectedFilename: 'fidget-toys/pop-it-fidget-toy.jpg',
    image: '',
    description:
      'Colourful reusable silicone push-bubble fidget pad for tactile focus and sensory relaxation.',
    keywords: ['pop it fidget toy', 'pop it', 'push bubble fidget'],
  },
  {
    name: 'Squishy Toy',
    slug: 'squishy-toy',
    parentGroup: 'Stress Relief & Fidget Toys',
    expectedFilename: 'fidget-toys/squishy-toy.jpg',
    image: '',
    description:
      'Soft slow-rising character squishy toy designed for gentle squeeze comfort and stress relief.',
    keywords: ['squishy toy', 'squishy character', 'soft squeeze toy'],
  },
  {
    name: 'Fidget Spinner',
    slug: 'fidget-spinner',
    parentGroup: 'Stress Relief & Fidget Toys',
    expectedFilename: 'fidget-toys/fidget-spinner.jpg',
    image: '',
    description:
      'Balanced three-arm pocket fidget spinner with smooth central bearing for calm hand motion.',
    keywords: ['fidget spinner', 'tri spinner', 'hand spinner'],
  },
  {
    name: 'Stress Ball',
    slug: 'stress-ball',
    parentGroup: 'Stress Relief & Fidget Toys',
    expectedFilename: 'fidget-toys/stress-ball.jpg',
    image: '',
    description:
      'Soft squeezable foam stress relief ball for study desks, office breaks, and hand relaxation.',
    keywords: ['stress ball', 'squeeze ball', 'relaxation ball'],
  },
  {
    name: 'Magnetic Fidget Toy',
    slug: 'magnetic-fidget-toy',
    parentGroup: 'Stress Relief & Fidget Toys',
    expectedFilename: 'fidget-toys/magnetic-fidget-toy.jpg',
    image: '',
    description:
      'Large-piece desktop magnetic fidget slider and ring toy designed for safe tactile desk play.',
    keywords: ['magnetic fidget toy', 'magnetic fidget', 'fidget slider'],
  },

  // GROUP 7 — FUN ROOM DECOR (4)
  {
    name: 'LED Neon Sign',
    slug: 'led-neon-sign',
    parentGroup: 'Fun Room Decor',
    expectedFilename: 'fun-room-decor/led-neon-sign.jpg',
    image: '',
    description:
      'Decorative LED neon-style acrylic wall accent shape for bedrooms, gaming corners, and party walls.',
    keywords: ['led neon sign', 'neon sign', 'neon wall light'],
  },
  {
    name: 'Mini Lava Lamp',
    slug: 'mini-lava-lamp',
    parentGroup: 'Fun Room Decor',
    expectedFilename: 'fun-room-decor/mini-lava-lamp.jpg',
    image: '',
    description:
      'Compact decorative motion lava lamp creating soothing floating wax glow for desks and shelves.',
    keywords: ['mini lava lamp', 'lava lamp', 'motion lamp'],
  },
  {
    name: 'Plasma Ball Lamp',
    slug: 'plasma-ball-lamp',
    parentGroup: 'Fun Room Decor',
    expectedFilename: 'fun-room-decor/plasma-ball-lamp.jpg',
    image: '',
    description:
      'Interactive glass plasma globe lamp displaying colorful electric light filaments at a touch.',
    keywords: ['plasma ball lamp', 'plasma globe', 'plasma lamp'],
  },
  {
    name: 'Novelty Night Light',
    slug: 'novelty-night-light',
    parentGroup: 'Fun Room Decor',
    expectedFilename: 'fun-room-decor/novelty-night-light.jpg',
    image: '',
    description:
      'Cute character bedside ambient night lamp offering warm soothing glow for study and sleep spaces.',
    keywords: ['novelty night light', 'cute night light', 'bedside night lamp'],
  },
];

export const INITIAL_PRANKS_NOVELTIES_COLLECTIONS: PranksNoveltiesCollection[] =
  RAW_PRANKS_NOVELTIES_COLLECTIONS.map((item, idx) => {
    const groupMeta = GROUP_BY_NAME.get(item.parentGroup)!;
    const hasImage = Boolean(item.image);
    return {
      id: `pn-col-${item.slug}`,
      name: item.name,
      slug: item.slug,
      parentCategory: 'Pranks & Novelties',
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

export function mergePranksNoveltiesCollections(
  existing: PranksNoveltiesCollection[] = []
): PranksNoveltiesCollection[] {
  const byId = new Map(existing.map((item) => [item.id, item]));
  return INITIAL_PRANKS_NOVELTIES_COLLECTIONS.map((seed) => {
    const saved = byId.get(seed.id);
    if (!saved) return seed;

    const savedImage =
      typeof saved.image === 'string' && saved.image.trim()
        ? saved.image.trim()
        : '';
    const useImage = savedImage.startsWith('/uploads/')
      ? savedImage
      : seed.image || '';
    const imageStatus: PranksNoveltiesCollection['imageStatus'] = !useImage
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

export function getPranksNoveltiesCollectionPath(
  col: Pick<PranksNoveltiesCollection, 'parentGroupSlug' | 'slug'>
): string {
  return `/pranks-novelties/${col.parentGroupSlug}/${col.slug}`;
}

export function findPranksNoveltiesGroupBySlug(
  value?: string
): PranksNoveltiesGroupMeta | undefined {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();
  return PRANKS_NOVELTIES_GROUPS.find(
    (g) =>
      g.slug.toLowerCase() === clean ||
      g.name.toLowerCase() === clean ||
      g.name.toLowerCase().replace(/&/g, 'and') === clean.replace(/&/g, 'and')
  );
}

export function findPranksNoveltiesCollection(
  collections: PranksNoveltiesCollection[],
  slugOrName?: string,
  groupSlugOrName?: string
): PranksNoveltiesCollection | undefined {
  if (!slugOrName) return undefined;
  const clean = slugOrName.trim().toLowerCase();
  const groupMeta = groupSlugOrName
    ? findPranksNoveltiesGroupBySlug(groupSlugOrName)
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

export function productMatchesPranksNoveltiesCollection(
  product: Product,
  collection: PranksNoveltiesCollection
): boolean {
  const catLower = (product.category || '').toLowerCase().trim();
  if (
    catLower !== 'prank items' &&
    catLower !== 'pranks & novelties' &&
    catLower !== 'pranks-novelties'
  ) {
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
