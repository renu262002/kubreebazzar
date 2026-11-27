import type {
  FitnessGymCollection,
  FitnessGymGroupName,
  Product,
} from '../types';

export interface FitnessGymGroupMeta {
  name: FitnessGymGroupName;
  slug: string;
  folder: string;
  description: string;
}

export const FITNESS_GYM_GROUPS: FitnessGymGroupMeta[] = [
  {
    name: 'Dumbbells & Weights',
    slug: 'dumbbells-weights',
    folder: 'dumbbells-weights',
    description:
      'Hexagonal dumbbells, adjustable dumbbell sets, standard barbells, weight plates, and cast-iron kettlebells.',
  },
  {
    name: 'Home Gym Equipment',
    slug: 'home-gym-equipment',
    folder: 'home-gym-equipment',
    description:
      'Multi-station home gym machines, adjustable weight benches, freestanding squat racks, pull-up bars, and dip stations.',
  },
  {
    name: 'Cardio Equipment',
    slug: 'cardio-equipment',
    folder: 'cardio-equipment',
    description:
      'Motorized treadmills, indoor exercise bikes, elliptical trainers, rowing machines, and compact mini steppers.',
  },
  {
    name: 'Fitness Accessories',
    slug: 'fitness-accessories',
    folder: 'fitness-accessories',
    description:
      'Resistance bands, speed jump ropes, abdominal exercise rollers, push-up support bars, and hand grippers.',
  },
  {
    name: 'Yoga & Pilates',
    slug: 'yoga-pilates',
    folder: 'yoga-pilates',
    description:
      'Cushioned yoga mats, supportive yoga blocks, cotton yoga straps, Pilates resistance rings, and textured foam rollers.',
  },
  {
    name: 'Gym Accessories',
    slug: 'gym-accessories',
    folder: 'gym-accessories',
    description:
      'Weightlifting gym gloves, supportive lifting belts, wrist wraps, compression knee sleeves, and sports gym bags.',
  },
  {
    name: 'Recovery & Mobility',
    slug: 'recovery-mobility',
    folder: 'recovery-mobility',
    description:
      'Percussion massage guns, textured massage balls, multi-loop stretching straps, balance boards, and acupressure mats.',
  },
];

const GROUP_BY_NAME = new Map<FitnessGymGroupName, FitnessGymGroupMeta>(
  FITNESS_GYM_GROUPS.map((g) => [g.name, g])
);

interface RawFitnessGymSeed {
  name: string;
  slug: string;
  parentGroup: FitnessGymGroupName;
  expectedFilename: string;
  image: string;
  description: string;
  keywords: string[];
}

const RAW_FITNESS_GYM_COLLECTIONS: RawFitnessGymSeed[] = [
  // GROUP 1 — DUMBBELLS & WEIGHTS (5)
  {
    name: 'Dumbbells',
    slug: 'dumbbells',
    parentGroup: 'Dumbbells & Weights',
    expectedFilename: 'dumbbells-weights/dumbbells.jpg',
    image: '',
    description:
      'Traditional hexagonal gym dumbbells crafted for balanced free-weight strength training at home or the studio.',
    keywords: ['dumbbells', 'hex dumbbells', 'rubber dumbbells', 'free weights'],
  },
  {
    name: 'Adjustable Dumbbells',
    slug: 'adjustable-dumbbells',
    parentGroup: 'Dumbbells & Weights',
    expectedFilename: 'dumbbells-weights/adjustable-dumbbells.jpg',
    image: '',
    description:
      'Space-saving adjustable dumbbell set with selectable weight plates for progressive home strength workouts.',
    keywords: ['adjustable dumbbells', 'selectable dumbbells', 'dumbbell set'],
  },
  {
    name: 'Barbells',
    slug: 'barbells',
    parentGroup: 'Dumbbells & Weights',
    expectedFilename: 'dumbbells-weights/barbells.jpg',
    image: '',
    description:
      'Standard strength-training gym barbells engineered for squats, presses, and full-body compound lifts.',
    keywords: ['barbells', 'barbell', 'olympic bar', 'weightlifting bar'],
  },
  {
    name: 'Weight Plates',
    slug: 'weight-plates',
    parentGroup: 'Dumbbells & Weights',
    expectedFilename: 'dumbbells-weights/weight-plates.jpg',
    image: '',
    description:
      'Assorted gym weight plates in calibrated increments for barbell and plate-loaded strength routines.',
    keywords: ['weight plates', 'bumper plates', 'barbell plates', 'iron plates'],
  },
  {
    name: 'Kettlebells',
    slug: 'kettlebells',
    parentGroup: 'Dumbbells & Weights',
    expectedFilename: 'dumbbells-weights/kettlebells.jpg',
    image: '',
    description:
      'Solid cast-iron kettlebells with wide ergonomic handles for swings, functional conditioning, and core work.',
    keywords: ['kettlebells', 'kettlebell', 'cast iron kettlebell'],
  },

  // GROUP 2 — HOME GYM EQUIPMENT (5)
  {
    name: 'Home Gym Machine',
    slug: 'home-gym-machine',
    parentGroup: 'Home Gym Equipment',
    expectedFilename: 'home-gym-equipment/home-gym-machine.jpg',
    image: '',
    description:
      'Multi-station home gym workout machine integrating cable pulleys, chest press, and lower-body stations.',
    keywords: ['home gym machine', 'multi gym', 'cable workout station'],
  },
  {
    name: 'Weight Bench',
    slug: 'weight-bench',
    parentGroup: 'Home Gym Equipment',
    expectedFilename: 'home-gym-equipment/weight-bench.jpg',
    image: '',
    description:
      'Adjustable flat and incline gym workout bench designed for dumbbell presses and seated strength routines.',
    keywords: ['weight bench', 'adjustable bench', 'workout bench', 'gym bench'],
  },
  {
    name: 'Squat Rack',
    slug: 'squat-rack',
    parentGroup: 'Home Gym Equipment',
    expectedFilename: 'home-gym-equipment/squat-rack.jpg',
    image: '',
    description:
      'Freestanding heavy-frame gym squat rack providing stable barbell supports for lower-body and upper-body lifts.',
    keywords: ['squat rack', 'power rack', 'barbell rack'],
  },
  {
    name: 'Pull-Up Bar',
    slug: 'pull-up-bar',
    parentGroup: 'Home Gym Equipment',
    expectedFilename: 'home-gym-equipment/pull-up-bar.jpg',
    image: '',
    description:
      'Wall-mounted multi-grip pull-up bar built for bodyweight back, shoulder, and core training.',
    keywords: ['pull-up bar', 'pull up bar', 'chin up bar'],
  },
  {
    name: 'Dip Station',
    slug: 'dip-station',
    parentGroup: 'Home Gym Equipment',
    expectedFilename: 'home-gym-equipment/dip-station.jpg',
    image: '',
    description:
      'Compact parallel dip exercise station with padded handles for bodyweight dips and leg raises.',
    keywords: ['dip station', 'parallel dip bars', 'dip stand'],
  },

  // GROUP 3 — CARDIO EQUIPMENT (5)
  {
    name: 'Treadmill',
    slug: 'treadmill',
    parentGroup: 'Cardio Equipment',
    expectedFilename: 'cardio-equipment/treadmill.jpg',
    image: '',
    description:
      'Modern motorized indoor treadmill with cushioned running belt and digital console for home cardio sessions.',
    keywords: ['treadmill', 'running machine', 'walking treadmill'],
  },
  {
    name: 'Exercise Bike',
    slug: 'exercise-bike',
    parentGroup: 'Cardio Equipment',
    expectedFilename: 'cardio-equipment/exercise-bike.jpg',
    image: '',
    description:
      'Indoor stationary exercise bicycle with adjustable seat and smooth flywheel resistance for cycling workouts.',
    keywords: ['exercise bike', 'stationary bike', 'spin bike', 'indoor cycle'],
  },
  {
    name: 'Elliptical Trainer',
    slug: 'elliptical-trainer',
    parentGroup: 'Cardio Equipment',
    expectedFilename: 'cardio-equipment/elliptical-trainer.jpg',
    image: '',
    description:
      'Full-size elliptical cross-trainer machine delivering smooth low-impact upper and lower-body cardio motion.',
    keywords: ['elliptical trainer', 'cross trainer', 'elliptical machine'],
  },
  {
    name: 'Rowing Machine',
    slug: 'rowing-machine',
    parentGroup: 'Cardio Equipment',
    expectedFilename: 'cardio-equipment/rowing-machine.jpg',
    image: '',
    description:
      'Indoor rowing exercise machine engineered for full-body rhythmic endurance and cardio conditioning.',
    keywords: ['rowing machine', 'indoor rower', 'ergometer'],
  },
  {
    name: 'Mini Stepper',
    slug: 'mini-stepper',
    parentGroup: 'Cardio Equipment',
    expectedFilename: 'cardio-equipment/mini-stepper.jpg',
    image: '',
    description:
      'Compact portable stair-stepping exercise machine ideal for space-conscious home cardio routines.',
    keywords: ['mini stepper', 'portable stepper', 'stair stepper'],
  },

  // GROUP 4 — FITNESS ACCESSORIES (5)
  {
    name: 'Resistance Bands',
    slug: 'resistance-bands',
    parentGroup: 'Fitness Accessories',
    expectedFilename: 'fitness-accessories/resistance-bands.jpg',
    image: '',
    description:
      'Color-coded resistance exercise bands offering progressive tension for stretching, mobility, and strength.',
    keywords: ['resistance bands', 'loop bands', 'exercise bands'],
  },
  {
    name: 'Jump Rope',
    slug: 'jump-rope',
    parentGroup: 'Fitness Accessories',
    expectedFilename: 'fitness-accessories/jump-rope.jpg',
    image: '',
    description:
      'Fitness speed skipping rope with comfortable ergonomic handles for cardio warm-ups and footwork.',
    keywords: ['jump rope', 'skipping rope', 'speed rope'],
  },
  {
    name: 'Ab Roller',
    slug: 'ab-roller',
    parentGroup: 'Fitness Accessories',
    expectedFilename: 'fitness-accessories/ab-roller.jpg',
    image: '',
    description:
      'Dual-grip abdominal exercise wheel roller designed for controlled core and upper-body stability workouts.',
    keywords: ['ab roller', 'ab wheel', 'abdominal roller'],
  },
  {
    name: 'Push-Up Bars',
    slug: 'push-up-bars',
    parentGroup: 'Fitness Accessories',
    expectedFilename: 'fitness-accessories/push-up-bars.jpg',
    image: '',
    description:
      'Pair of angled push-up support handles promoting comfortable wrist alignment during floor workouts.',
    keywords: ['push-up bars', 'push up bars', 'push up stands'],
  },
  {
    name: 'Hand Gripper',
    slug: 'hand-gripper',
    parentGroup: 'Fitness Accessories',
    expectedFilename: 'fitness-accessories/hand-gripper.jpg',
    image: '',
    description:
      'Compact spring-resistance hand grip strengthener crafted for forearm and grip endurance exercises.',
    keywords: ['hand gripper', 'grip strengthener', 'forearm gripper'],
  },

  // GROUP 5 — YOGA & PILATES (5)
  {
    name: 'Yoga Mat',
    slug: 'yoga-mat',
    parentGroup: 'Yoga & Pilates',
    expectedFilename: 'yoga-pilates/yoga-mat.jpg',
    image: '',
    description:
      'Cushioned non-slip exercise yoga mat suited for floor stretching, yoga poses, and Pilates sessions.',
    keywords: ['yoga mat', 'workout mat', 'exercise mat'],
  },
  {
    name: 'Yoga Blocks',
    slug: 'yoga-blocks',
    parentGroup: 'Yoga & Pilates',
    expectedFilename: 'yoga-pilates/yoga-blocks.jpg',
    image: '',
    description:
      'Pair of high-density supportive yoga blocks providing balance assistance and pose alignment.',
    keywords: ['yoga blocks', 'yoga brick', 'foam yoga block'],
  },
  {
    name: 'Yoga Strap',
    slug: 'yoga-strap',
    parentGroup: 'Yoga & Pilates',
    expectedFilename: 'yoga-pilates/yoga-strap.jpg',
    image: '',
    description:
      'Durable woven cotton yoga stretching strap with metal D-ring buckle for gradual flexibility practice.',
    keywords: ['yoga strap', 'yoga belt', 'cotton yoga strap'],
  },
  {
    name: 'Pilates Ring',
    slug: 'pilates-ring',
    parentGroup: 'Yoga & Pilates',
    expectedFilename: 'yoga-pilates/pilates-ring.jpg',
    image: '',
    description:
      'Flexible Pilates resistance ring with dual padded side grips for targeted toning and core control.',
    keywords: ['pilates ring', 'magic circle', 'pilates fitness ring'],
  },
  {
    name: 'Foam Roller',
    slug: 'foam-roller',
    parentGroup: 'Yoga & Pilates',
    expectedFilename: 'yoga-pilates/foam-roller.jpg',
    image: '',
    description:
      'Textured cylindrical exercise foam roller for post-workout muscle warm-ups and mobility rolling.',
    keywords: ['foam roller', 'massage foam roller', 'exercise roller'],
  },

  // GROUP 6 — GYM ACCESSORIES (5)
  {
    name: 'Gym Gloves',
    slug: 'gym-gloves',
    parentGroup: 'Gym Accessories',
    expectedFilename: 'gym-accessories/gym-gloves.jpg',
    image: '',
    description:
      'Pair of fingerless padded weightlifting gloves designed for bar grip and palm comfort during training.',
    keywords: ['gym gloves', 'weightlifting gloves', 'workout gloves'],
  },
  {
    name: 'Lifting Belt',
    slug: 'lifting-belt',
    parentGroup: 'Gym Accessories',
    expectedFilename: 'gym-accessories/lifting-belt.jpg',
    image: '',
    description:
      'Wide contoured weightlifting support belt built for core bracing during heavy squats and deadlifts.',
    keywords: ['lifting belt', 'weightlifting belt', 'gym belt'],
  },
  {
    name: 'Wrist Wraps',
    slug: 'wrist-wraps',
    parentGroup: 'Gym Accessories',
    expectedFilename: 'gym-accessories/wrist-wraps.jpg',
    image: '',
    description:
      'Adjustable elastic gym wrist wraps with thumb loops for added wrist stability on pressing days.',
    keywords: ['wrist wraps', 'gym wrist support', 'lifting wrist wraps'],
  },
  {
    name: 'Knee Sleeves',
    slug: 'knee-sleeves',
    parentGroup: 'Gym Accessories',
    expectedFilename: 'gym-accessories/knee-sleeves.jpg',
    image: '',
    description:
      'Pair of neoprene weightlifting knee sleeves offering snug joint compression during lower-body lifts.',
    keywords: ['knee sleeves', 'gym knee support', 'lifting knee sleeves'],
  },
  {
    name: 'Gym Bag',
    slug: 'gym-bag',
    parentGroup: 'Gym Accessories',
    expectedFilename: 'gym-accessories/gym-bag.jpg',
    image: '',
    description:
      'Structured sports duffel gym bag with separate compartments for workout gear, shoes, and bottles.',
    keywords: ['gym bag', 'duffel bag', 'fitness kit bag'],
  },

  // GROUP 7 — RECOVERY & MOBILITY (5)
  {
    name: 'Massage Gun',
    slug: 'massage-gun',
    parentGroup: 'Recovery & Mobility',
    expectedFilename: 'recovery-mobility/massage-gun.jpg',
    image: '',
    description:
      'Handheld cordless percussion massage device with interchangeable heads for post-exercise muscle care.',
    keywords: ['massage gun', 'percussion massager', 'muscle massager'],
  },
  {
    name: 'Massage Ball',
    slug: 'massage-ball',
    parentGroup: 'Recovery & Mobility',
    expectedFilename: 'recovery-mobility/massage-ball.jpg',
    image: '',
    description:
      'Textured trigger-point massage ball suited for targeted foot, shoulder, and back mobility work.',
    keywords: ['massage ball', 'spiky massage ball', 'lacrosse recovery ball'],
  },
  {
    name: 'Stretching Strap',
    slug: 'stretching-strap',
    parentGroup: 'Recovery & Mobility',
    expectedFilename: 'recovery-mobility/stretching-strap.jpg',
    image: '',
    description:
      'Multi-loop non-elastic exercise stretching strap providing numbered handholds for controlled flexibility.',
    keywords: ['stretching strap', 'multi loop strap', 'flexibility strap'],
  },
  {
    name: 'Balance Board',
    slug: 'balance-board',
    parentGroup: 'Recovery & Mobility',
    expectedFilename: 'recovery-mobility/balance-board.jpg',
    image: '',
    description:
      'Circular textured exercise balance wobble board crafted for ankle stability and coordination training.',
    keywords: ['balance board', 'wobble board', 'stability trainer'],
  },
  {
    name: 'Acupressure Mat',
    slug: 'acupressure-mat',
    parentGroup: 'Recovery & Mobility',
    expectedFilename: 'recovery-mobility/acupressure-mat.jpg',
    image: '',
    description:
      'Cushioned fabric mat covered with geometric acupressure rosette discs for calm post-session rest.',
    keywords: ['acupressure mat', 'relaxation mat', 'spiky recovery mat'],
  },
];

export const INITIAL_FITNESS_GYM_COLLECTIONS: FitnessGymCollection[] =
  RAW_FITNESS_GYM_COLLECTIONS.map((item, idx) => {
    const groupMeta = GROUP_BY_NAME.get(item.parentGroup)!;
    const hasImage = Boolean(item.image);
    return {
      id: `fg-col-${item.slug}`,
      name: item.name,
      slug: item.slug,
      parentCategory: 'Fitness & Gym',
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

export function mergeFitnessGymCollections(
  existing: FitnessGymCollection[] = []
): FitnessGymCollection[] {
  const byId = new Map(existing.map((item) => [item.id, item]));
  return INITIAL_FITNESS_GYM_COLLECTIONS.map((seed) => {
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
      parentCategory: 'Fitness & Gym',
      parentGroup: seed.parentGroup,
      parentGroupSlug: seed.parentGroupSlug,
      expectedFilename: seed.expectedFilename,
      image: resolvedImage,
      imageStatus: resolvedImageStatus,
      displayOrder: seed.displayOrder,
    };
  });
}

export function getFitnessGymCollectionPath(
  collection: Pick<FitnessGymCollection, 'parentGroupSlug' | 'slug'>
): string {
  return `/fitness-gym/${collection.parentGroupSlug}/${collection.slug}`;
}

export function findFitnessGymGroupBySlug(
  value?: string
): FitnessGymGroupMeta | undefined {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();
  return FITNESS_GYM_GROUPS.find(
    (g) =>
      g.slug.toLowerCase() === clean ||
      g.name.toLowerCase() === clean ||
      g.name.toLowerCase().replace(/&/g, 'and') === clean.replace(/&/g, 'and')
  );
}

export function findFitnessGymCollection(
  collections: FitnessGymCollection[],
  slugOrName?: string,
  groupSlugOrName?: string
): FitnessGymCollection | undefined {
  if (!slugOrName) return undefined;
  const clean = slugOrName.trim().toLowerCase();
  const groupMeta = groupSlugOrName
    ? findFitnessGymGroupBySlug(groupSlugOrName)
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

export function productMatchesFitnessGymCollection(
  product: Product,
  collection: FitnessGymCollection
): boolean {
  const catLower = (product.category || '').toLowerCase().trim();
  const colSlugLower = collection.slug.toLowerCase();
  const isPrimaryFitnessGym =
    catLower === 'gym' ||
    catLower === 'fitness & gym' ||
    catLower === 'fitness-gym';
  const isSharedSportsSkippingRope =
    colSlugLower === 'jump-rope' && catLower === 'sports';

  if (!isPrimaryFitnessGym && !isSharedSportsSkippingRope) {
    return false;
  }

  const colNameLower = collection.name.toLowerCase();
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
