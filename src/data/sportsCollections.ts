import type { Product, SportsCollection, SportsGroupName } from '../types';

export interface SportsGroupMeta {
  name: SportsGroupName;
  slug: string;
  folder: string;
  description: string;
}

export const SPORTS_GROUPS: SportsGroupMeta[] = [
  {
    name: 'Cricket',
    slug: 'cricket',
    folder: 'cricket',
    description:
      'Willow cricket bats, stitched leather cricket balls, batting leg pads, padded batting gloves, protective helmets, and wooden wicket stumps.',
  },
  {
    name: 'Football',
    slug: 'football',
    folder: 'football',
    description:
      'Match footballs, foldable goal nets, protective shin guards, padded goalkeeper gloves, and agility training marker cones.',
  },
  {
    name: 'Badminton',
    slug: 'badminton',
    folder: 'badminton',
    description:
      'Lightweight graphite badminton rackets, tournament feather and nylon shuttlecocks, standard court nets, and multi-racket kit bags.',
  },
  {
    name: 'Tennis',
    slug: 'tennis',
    folder: 'tennis',
    description:
      'Strung graphite tennis rackets, pressurized felt tennis balls, regulation court nets, and cushioned handle grip tape.',
  },
  {
    name: 'Volleyball',
    slug: 'volleyball',
    folder: 'volleyball',
    description:
      'Composite match volleyballs, braided court nets with boundary cables, and shock-absorbing knee pads.',
  },
  {
    name: 'Basketball',
    slug: 'basketball',
    folder: 'basketball',
    description:
      'Grip-textured indoor and outdoor basketballs, wall-mounted rims and backboards, and braided nylon replacement nets.',
  },
  {
    name: 'Table Tennis',
    slug: 'table-tennis',
    folder: 'table-tennis',
    description:
      'Pipped rubber table tennis paddles, 3-star celluloid-free balls, and clamp-on adjustable table tennis nets.',
  },
  {
    name: 'Swimming',
    slug: 'swimming',
    folder: 'swimming',
    description:
      'Anti-fog swimming goggles, ergonomic silicone swim caps, buoyancy foam kickboards, and silicone training swim fins.',
  },
  {
    name: 'Cycling',
    slug: 'cycling',
    folder: 'cycling',
    description:
      'Ventilated cycling helmets, padded fingerless riding gloves, squeezable cage water bottles, and rechargeable LED bike lights.',
  },
  {
    name: 'Outdoor Sports',
    slug: 'outdoor-sports',
    folder: 'outdoor-sports',
    description:
      'High-speed skipping ropes, aerodynamic throwing frisbees, referee sports whistles, and flat-rung agility training ladders.',
  },
];

const GROUP_BY_NAME = new Map<SportsGroupName, SportsGroupMeta>(
  SPORTS_GROUPS.map((g) => [g.name, g])
);

interface RawSportsSeed {
  name: string;
  slug: string;
  parentGroup: SportsGroupName;
  expectedFilename: string;
  image: string;
  description: string;
  keywords: string[];
}

const RAW_SPORTS_COLLECTIONS: RawSportsSeed[] = [
  // GROUP 1 — CRICKET (6)
  {
    name: 'Cricket Bat',
    slug: 'cricket-bat',
    parentGroup: 'Cricket',
    expectedFilename: 'cricket/cricket-bat.jpg',
    image: '/images/sports/cricket/cricket-bat.jpg',
    description:
      'Full-size wooden willow cricket bat featuring a contoured blade, cane handle, and textured rubber grip.',
    keywords: ['cricket bat', 'kashmir willow', 'english willow', 'willow bat'],
  },
  {
    name: 'Cricket Ball',
    slug: 'cricket-ball',
    parentGroup: 'Cricket',
    expectedFilename: 'cricket/cricket-ball.jpg',
    image: '/images/sports/cricket/cricket-ball.jpg',
    description:
      'Traditional stitched leather cricket ball shaped for reliable seam bounce during match and net practice.',
    keywords: ['cricket ball', 'leather cricket ball', 'seam ball', 'match ball'],
  },
  {
    name: 'Batting Pads',
    slug: 'batting-pads',
    parentGroup: 'Cricket',
    expectedFilename: 'cricket/batting-pads.jpg',
    image: '/images/sports/cricket/batting-pads.jpg',
    description:
      'Lightweight cushioned cricket leg batting pads with high-density foam bolsters and adjustable Velcro straps.',
    keywords: ['batting pads', 'cricket pads', 'leg guards', 'batting leg pads'],
  },
  {
    name: 'Batting Gloves',
    slug: 'batting-gloves',
    parentGroup: 'Cricket',
    expectedFilename: 'cricket/batting-gloves.jpg',
    image: '/images/sports/cricket/batting-gloves.jpg',
    description:
      'Segmented protective cricket batting gloves with reinforced finger padding and breathable leather palms.',
    keywords: ['batting gloves', 'cricket gloves', 'padded cricket gloves'],
  },
  {
    name: 'Cricket Helmet',
    slug: 'cricket-helmet',
    parentGroup: 'Cricket',
    expectedFilename: 'cricket/cricket-helmet.jpg',
    image: '/images/sports/cricket/cricket-helmet.jpg',
    description:
      'Impact-resistant cricket batting helmet fitted with a powder-coated steel face grille and padded inner liner.',
    keywords: ['cricket helmet', 'batting helmet', 'cricket head guard'],
  },
  {
    name: 'Wicket Stumps',
    slug: 'wicket-stumps',
    parentGroup: 'Cricket',
    expectedFilename: 'cricket/wicket-stumps.jpg',
    image: '/images/sports/cricket/wicket-stumps.jpg',
    description:
      'Regulation wooden cricket wicket stumps complete with grooved bails for turf, pitch, and net practice.',
    keywords: ['wicket stumps', 'cricket stumps', 'stumps and bails', 'wickets'],
  },

  // GROUP 2 — FOOTBALL (5)
  {
    name: 'Football',
    slug: 'football',
    parentGroup: 'Football',
    expectedFilename: 'football/football.jpg',
    image: '/images/sports/football/football.jpg',
    description:
      'Hand-stitched panel match and training football built for consistent flight and grip across turf and grass.',
    keywords: ['football', 'soccer ball', 'match football', 'size 5 football'],
  },
  {
    name: 'Football Goal Net',
    slug: 'football-goal-net',
    parentGroup: 'Football',
    expectedFilename: 'football/football-goal-net.jpg',
    image: '/images/sports/football/football-goal-net.jpg',
    description:
      'Portable outdoor football goal post frame with braided nylon netting for backyard drills and small-sided games.',
    keywords: ['football goal net', 'soccer goal', 'goal post net', 'training goal'],
  },
  {
    name: 'Shin Guards',
    slug: 'shin-guards',
    parentGroup: 'Football',
    expectedFilename: 'football/shin-guards.jpg',
    image: '/images/sports/football/shin-guards.jpg',
    description:
      'Contoured hard-shell football shin guards with EVA foam backing for lower-leg impact protection.',
    keywords: ['shin guards', 'football shin pads', 'soccer shin guards'],
  },
  {
    name: 'Goalkeeper Gloves',
    slug: 'goalkeeper-gloves',
    parentGroup: 'Football',
    expectedFilename: 'football/goalkeeper-gloves.jpg',
    image: '/images/sports/football/goalkeeper-gloves.jpg',
    description:
      'Latex-palm football goalkeeper gloves offering cushioned shock absorption, wrist wrap support, and secure ball catch grip.',
    keywords: ['goalkeeper gloves', 'goalie gloves', 'keeper gloves'],
  },
  {
    name: 'Football Training Cones',
    slug: 'football-training-cones',
    parentGroup: 'Football',
    expectedFilename: 'football/football-training-cones.jpg',
    image: '/images/sports/football/football-training-cones.jpg',
    description:
      'High-visibility flexible field marker cones for footwork drills, dribbling slaloms, and coaching setups.',
    keywords: ['football training cones', 'agility cones', 'disc cones', 'field cones'],
  },

  // GROUP 3 — BADMINTON (4)
  {
    name: 'Badminton Racket',
    slug: 'badminton-racket',
    parentGroup: 'Badminton',
    expectedFilename: 'badminton/badminton-racket.jpg',
    image: '/images/sports/badminton/badminton-racket.jpg',
    description:
      'Lightweight graphite-frame strung badminton racket balanced for fast swings and responsive court control.',
    keywords: ['badminton racket', 'badminton racquet', 'graphite racket'],
  },
  {
    name: 'Shuttlecocks',
    slug: 'shuttlecocks',
    parentGroup: 'Badminton',
    expectedFilename: 'badminton/shuttlecocks.jpg',
    image: '/images/sports/badminton/shuttlecocks.jpg',
    description:
      'Precision-flight feather and nylon badminton shuttlecocks with natural cork bases for steady indoor and outdoor rallies.',
    keywords: ['shuttlecocks', 'shuttlecock', 'feather shuttle', 'nylon shuttle'],
  },
  {
    name: 'Badminton Net',
    slug: 'badminton-net',
    parentGroup: 'Badminton',
    expectedFilename: 'badminton/badminton-net.jpg',
    image: '/images/sports/badminton/badminton-net.jpg',
    description:
      'Standard-length braided badminton court net reinforced with a crisp white top tape and tension cords.',
    keywords: ['badminton net', 'court net', 'badminton mesh net'],
  },
  {
    name: 'Racket Bag',
    slug: 'racket-bag',
    parentGroup: 'Badminton',
    expectedFilename: 'badminton/racket-bag.jpg',
    image: '/images/sports/badminton/racket-bag.jpg',
    description:
      'Padded zippered badminton kit bag shaped to carry rackets, shuttlecock tubes, and court accessories.',
    keywords: ['racket bag', 'badminton kit bag', 'racquet cover bag'],
  },

  // GROUP 4 — TENNIS (4)
  {
    name: 'Tennis Racket',
    slug: 'tennis-racket',
    parentGroup: 'Tennis',
    expectedFilename: 'tennis/tennis-racket.jpg',
    image: '/images/sports/tennis/tennis-racket.jpg',
    description:
      'Pre-strung graphite tennis racket engineered with an oversized sweet spot and cushioned overgrip handle.',
    keywords: ['tennis racket', 'tennis racquet', 'court racket'],
  },
  {
    name: 'Tennis Balls',
    slug: 'tennis-balls',
    parentGroup: 'Tennis',
    expectedFilename: 'tennis/tennis-balls.jpg',
    image: '/images/sports/tennis/tennis-balls.jpg',
    description:
      'Pressurized optic-yellow felt tennis balls packaged for consistent bounce across hard, clay, and grass courts.',
    keywords: ['tennis balls', 'tennis ball', 'pressurized tennis balls'],
  },
  {
    name: 'Tennis Net',
    slug: 'tennis-net',
    parentGroup: 'Tennis',
    expectedFilename: 'tennis/tennis-net.jpg',
    image: '/images/sports/tennis/tennis-net.jpg',
    description:
      'Heavy-duty twisted polyethylene tennis court net fitted with steel tension cable and reinforced headband.',
    keywords: ['tennis net', 'tennis court net'],
  },
  {
    name: 'Tennis Grip Tape',
    slug: 'tennis-grip-tape',
    parentGroup: 'Tennis',
    expectedFilename: 'tennis/tennis-grip-tape.jpg',
    image: '',
    description:
      'Sweat-absorbent non-slip overgrip tape rolls designed to keep racket handles dry and secure during long matches.',
    keywords: ['tennis grip tape', 'overgrip tape', 'racket grip tape'],
  },

  // GROUP 5 — VOLLEYBALL (3)
  {
    name: 'Volleyball',
    slug: 'volleyball',
    parentGroup: 'Volleyball',
    expectedFilename: 'volleyball/volleyball.jpg',
    image: '',
    description:
      'Soft-touch multi-panel volleyball tailored for indoor court rallies and outdoor beach or recreational games.',
    keywords: ['volleyball', 'court volleyball', 'match volleyball'],
  },
  {
    name: 'Volleyball Net',
    slug: 'volleyball-net',
    parentGroup: 'Volleyball',
    expectedFilename: 'volleyball/volleyball-net.jpg',
    image: '',
    description:
      'Durable weather-resistant volleyball net with canvas top binding and side tension ropes.',
    keywords: ['volleyball net', 'beach volleyball net', 'court net'],
  },
  {
    name: 'Volleyball Knee Pads',
    slug: 'volleyball-knee-pads',
    parentGroup: 'Volleyball',
    expectedFilename: 'volleyball/volleyball-knee-pads.jpg',
    image: '',
    description:
      'Elasticated compression volleyball knee pads with contoured foam cushioning for court dives and defense.',
    keywords: ['volleyball knee pads', 'knee pads', 'court knee guards'],
  },

  // GROUP 6 — BASKETBALL (3)
  {
    name: 'Basketball',
    slug: 'basketball',
    parentGroup: 'Basketball',
    expectedFilename: 'basketball/basketball.jpg',
    image: '',
    description:
      'Pebbled-channel rubber and composite leather basketball crafted for reliable dribbling control and shooting grip.',
    keywords: ['basketball', 'indoor basketball', 'outdoor basketball'],
  },
  {
    name: 'Basketball Hoop',
    slug: 'basketball-hoop',
    parentGroup: 'Basketball',
    expectedFilename: 'basketball/basketball-hoop.jpg',
    image: '',
    description:
      'Wall-mountable steel basketball rim with rigid backboard for driveway, court, and recreational practice.',
    keywords: ['basketball hoop', 'basketball rim', 'backboard hoop'],
  },
  {
    name: 'Basketball Net',
    slug: 'basketball-net',
    parentGroup: 'Basketball',
    expectedFilename: 'basketball/basketball-net.jpg',
    image: '',
    description:
      'Heavy-braided all-weather nylon basketball rim net designed for clean swishes and outdoor longevity.',
    keywords: ['basketball net', 'hoop net', 'rim replacement net'],
  },

  // GROUP 7 — TABLE TENNIS (3)
  {
    name: 'Table Tennis Bat',
    slug: 'table-tennis-bat',
    parentGroup: 'Table Tennis',
    expectedFilename: 'table-tennis/table-tennis-bat.jpg',
    image: '',
    description:
      'Balanced multi-ply wood table tennis paddle faced with high-spin rubber sheets and flared ergonomic handle.',
    keywords: ['table tennis bat', 'ping pong paddle', 'table tennis racket'],
  },
  {
    name: 'Table Tennis Balls',
    slug: 'table-tennis-balls',
    parentGroup: 'Table Tennis',
    expectedFilename: 'table-tennis/table-tennis-balls.jpg',
    image: '',
    description:
      'Seamless 40mm table tennis balls calibrated for crisp rebound, roundness, and true spin trajectories.',
    keywords: ['table tennis balls', 'ping pong balls', '3 star balls'],
  },
  {
    name: 'Table Tennis Net',
    slug: 'table-tennis-net',
    parentGroup: 'Table Tennis',
    expectedFilename: 'table-tennis/table-tennis-net.jpg',
    image: '',
    description:
      'Clamp-on table tennis net and post set fitting standard-thickness indoor and recreational game tables.',
    keywords: ['table tennis net', 'ping pong net', 'clamp on net'],
  },

  // GROUP 8 — SWIMMING (4)
  {
    name: 'Swimming Goggles',
    slug: 'swimming-goggles',
    parentGroup: 'Swimming',
    expectedFilename: 'swimming/swimming-goggles.jpg',
    image: '',
    description:
      'Leak-resistant silicone gasket swimming goggles with anti-fog polycarbonate lenses and split head strap.',
    keywords: ['swimming goggles', 'swim goggles', 'anti fog goggles'],
  },
  {
    name: 'Swimming Cap',
    slug: 'swimming-cap',
    parentGroup: 'Swimming',
    expectedFilename: 'swimming/swimming-cap.jpg',
    image: '',
    description:
      'Stretchable waterproof silicone swimming cap contoured to reduce drag and protect hair from pool chlorine.',
    keywords: ['swimming cap', 'swim cap', 'silicone swim cap'],
  },
  {
    name: 'Kickboard',
    slug: 'kickboard',
    parentGroup: 'Swimming',
    expectedFilename: 'swimming/kickboard.jpg',
    image: '',
    description:
      'Buoyant closed-cell EVA foam swim kickboard with hand cutouts for leg-kick conditioning and stroke drills.',
    keywords: ['kickboard', 'swimming kickboard', 'swim float board'],
  },
  {
    name: 'Swimming Fins',
    slug: 'swimming-fins',
    parentGroup: 'Swimming',
    expectedFilename: 'swimming/swimming-fins.jpg',
    image: '',
    description:
      'Flexible short-blade silicone swimming fins designed to strengthen leg propulsion and ankle flexibility.',
    keywords: ['swimming fins', 'swim flippers', 'training fins'],
  },

  // GROUP 9 — CYCLING (4)
  {
    name: 'Bicycle Helmet',
    slug: 'bicycle-helmet',
    parentGroup: 'Cycling',
    expectedFilename: 'cycling/bicycle-helmet.jpg',
    image: '',
    description:
      'Aerodynamic vented bicycle helmet with EPS foam impact liner and rear dial-fit retention strap.',
    keywords: ['bicycle helmet', 'cycling helmet', 'bike helmet'],
  },
  {
    name: 'Cycling Gloves',
    slug: 'cycling-gloves',
    parentGroup: 'Cycling',
    expectedFilename: 'cycling/cycling-gloves.jpg',
    image: '',
    description:
      'Breathable half-finger cycling gloves featuring shock-absorbing palm pads for comfortable handlebar grip.',
    keywords: ['cycling gloves', 'bike riding gloves', 'half finger cycling gloves'],
  },
  {
    name: 'Bicycle Water Bottle',
    slug: 'bicycle-water-bottle',
    parentGroup: 'Cycling',
    expectedFilename: 'cycling/bicycle-water-bottle.jpg',
    image: '',
    description:
      'BPA-free squeezable sports cycling water bottle with pull-top valve shaped to fit standard bike frame cages.',
    keywords: ['bicycle water bottle', 'cycling bottle', 'bike squeeze bottle'],
  },
  {
    name: 'Bicycle Lights',
    slug: 'bicycle-lights',
    parentGroup: 'Cycling',
    expectedFilename: 'cycling/bicycle-lights.jpg',
    image: '',
    description:
      'Rechargeable LED front headlight and rear taillight bicycle set for clear low-light road visibility.',
    keywords: ['bicycle lights', 'bike headlight', 'cycling tail light'],
  },

  // GROUP 10 — OUTDOOR SPORTS (4)
  {
    name: 'Skipping Rope',
    slug: 'skipping-rope',
    parentGroup: 'Outdoor Sports',
    expectedFilename: 'outdoor-sports/skipping-rope.jpg',
    image: '',
    description:
      'Adjustable tangle-free speed skipping rope with comfortable ergonomic handles for warm-ups and outdoor cardio.',
    keywords: ['skipping rope', 'jump rope', 'speed rope', 'cardio rope'],
  },
  {
    name: 'Frisbee',
    slug: 'frisbee',
    parentGroup: 'Outdoor Sports',
    expectedFilename: 'outdoor-sports/frisbee.jpg',
    image: '',
    description:
      'Balanced molded plastic flying disc engineered for smooth, stable throws across parks and beaches.',
    keywords: ['frisbee', 'flying disc', 'outdoor frisbee'],
  },
  {
    name: 'Sports Whistle',
    slug: 'sports-whistle',
    parentGroup: 'Outdoor Sports',
    expectedFilename: 'outdoor-sports/sports-whistle.jpg',
    image: '',
    description:
      'High-decibel referee and coaching sports whistle paired with a detachable woven neck lanyard.',
    keywords: ['sports whistle', 'referee whistle', 'coach whistle'],
  },
  {
    name: 'Agility Ladder',
    slug: 'agility-ladder',
    parentGroup: 'Outdoor Sports',
    expectedFilename: 'outdoor-sports/agility-ladder.jpg',
    image: '',
    description:
      'Adjustable flat-rung nylon speed agility ladder built for quick footwork, acceleration, and outdoor field drills.',
    keywords: ['agility ladder', 'speed ladder', 'footwork ladder', 'training ladder'],
  },
];

export const INITIAL_SPORTS_COLLECTIONS: SportsCollection[] =
  RAW_SPORTS_COLLECTIONS.map((item, idx) => {
    const groupMeta = GROUP_BY_NAME.get(item.parentGroup)!;
    return {
      id: `sports-${groupMeta.slug}-${item.slug}`,
      name: item.name,
      slug: item.slug,
      parentCategory: 'Sports',
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

export function mergeSportsCollections(
  existing: SportsCollection[] = []
): SportsCollection[] {
  const byId = new Map(existing.map((item) => [item.id, item]));
  return INITIAL_SPORTS_COLLECTIONS.map((seed) => {
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
      parentCategory: 'Sports',
      parentGroup: seed.parentGroup,
      parentGroupSlug: seed.parentGroupSlug,
      expectedFilename: seed.expectedFilename,
      image: resolvedImage,
      imageStatus: resolvedImageStatus,
      displayOrder: seed.displayOrder,
    };
  });
}

export function getSportsCollectionPath(
  collection: Pick<SportsCollection, 'parentGroupSlug' | 'slug'>
): string {
  return `/sports/${collection.parentGroupSlug}/${collection.slug}`;
}

export function findSportsGroupBySlug(
  value?: string
): SportsGroupMeta | undefined {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();
  return SPORTS_GROUPS.find(
    (g) =>
      g.slug.toLowerCase() === clean ||
      g.name.toLowerCase() === clean ||
      g.name.toLowerCase().replace(/&/g, 'and') === clean.replace(/&/g, 'and')
  );
}

export function findSportsCollection(
  collections: SportsCollection[],
  slugOrName?: string,
  groupSlugOrName?: string
): SportsCollection | undefined {
  if (!slugOrName) return undefined;
  const clean = slugOrName.trim().toLowerCase();
  const groupMeta = groupSlugOrName
    ? findSportsGroupBySlug(groupSlugOrName)
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

export function productMatchesSportsCollection(
  product: Product,
  collection: SportsCollection
): boolean {
  const catLower = (product.category || '').toLowerCase().trim();
  const subLower = (product.subcategory || '').toLowerCase().trim();
  const subSubLower = (product.subSubcategory || '').toLowerCase().trim();
  const colNameLower = collection.name.toLowerCase();
  const colSlugLower = collection.slug.toLowerCase();

  const isPrimarySports = catLower === 'sports';

  // Reuse canonical Fitness & Gym skipping rope records in Sports -> Outdoor Sports -> Skipping Rope
  // without creating duplicate product records
  const isSharedGymSkippingRope =
    colSlugLower === 'skipping-rope' &&
    (catLower === 'gym' ||
      catLower === 'fitness & gym' ||
      catLower === 'fitness-gym');

  if (!isPrimarySports && !isSharedGymSkippingRope) {
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
