import type {
  MensFashionCollection,
  MensFashionParentCategory,
  Product,
} from '../types';

export const MENS_FASHION_PARENT_CATEGORIES: {
  name: MensFashionParentCategory;
  slug: string;
  image: string;
  description: string;
}[] = [
  {
    name: 'Shirts',
    slug: 'shirts',
    image: '/images/mens-fashion/shirts/formal-shirts.jpg',
    description:
      'Tailored formal, relaxed casual, checked, linen, Oxford, and oversized shirts crafted for every occasion.',
  },
  {
    name: 'Trousers',
    slug: 'trousers',
    image: '/images/mens-fashion/trousers/elasticated-casual-trousers.png',
    description:
      'Comfortable elasticated short trousers, athletic & cargo shorts, smart formal trousers, cotton chinos, and stretch-tailored fits.',
  },
  {
    name: 'Pants',
    slug: 'pants',
    image: '/images/mens-fashion/pants/casual-pants.jpg',
    description:
      'Everyday denim jeans, utility cargo pants, active joggers, track pants, and relaxed wide-leg silhouettes.',
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    image: '/images/mens-fashion/tshirts/round-neck-tshirts.jpg',
    description:
      'Essential crew necks, V-necks, collared polos, printed and graphic tees, oversized silhouettes, and striped classics.',
  },
];

export const INITIAL_MENS_FASHION_COLLECTIONS: MensFashionCollection[] = [
  // SHIRTS (12)
  {
    id: 'mf-formal-shirts',
    name: 'Formal Shirts',
    slug: 'formal-shirts',
    parentCategory: 'Shirts',
    parentSlug: 'shirts',
    image: '/images/mens-fashion/shirts/formal-shirts.jpg',
    description:
      'Smart button-down formal shirts with crisp collars and tailored styling for office and formal occasions.',
    keywords: ['formal', 'formal shirt', 'office shirt', 'dress shirt', 'poplin', 'button-down'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 1,
  },
  {
    id: 'mf-casual-shirts',
    name: 'Casual Shirts',
    slug: 'casual-shirts',
    parentCategory: 'Shirts',
    parentSlug: 'shirts',
    image: '/images/mens-fashion/shirts/casual-shirts.jpg',
    description:
      'Comfortable everyday button-down casual shirts in soft cotton weaves for effortless weekend styling.',
    keywords: ['casual', 'casual shirt', 'everyday shirt', 'weekend shirt'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 2,
  },
  {
    id: 'mf-checked-shirts',
    name: 'Checked Shirts',
    slug: 'checked-shirts',
    parentCategory: 'Shirts',
    parentSlug: 'shirts',
    image: '/images/mens-fashion/shirts/checked-shirts.jpg',
    description:
      'Classic yarn-dyed checked shirts featuring balanced plaid and gingham patterns for versatile layering.',
    keywords: ['checked', 'checkered', 'plaid', 'gingham', 'tartan'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 3,
  },
  {
    id: 'mf-printed-shirts',
    name: 'Printed Shirts',
    slug: 'printed-shirts',
    parentCategory: 'Shirts',
    parentSlug: 'shirts',
    image: '/images/mens-fashion/shirts/printed-shirts.jpg',
    description:
      'Contemporary shirts showcasing refined botanical and geometric prints on breathable woven cotton.',
    keywords: ['printed', 'print shirt', 'pattern shirt', 'floral shirt', 'motif'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 4,
  },
  {
    id: 'mf-denim-shirts',
    name: 'Denim Shirts',
    slug: 'denim-shirts',
    parentCategory: 'Shirts',
    parentSlug: 'shirts',
    image: '/images/mens-fashion/shirts/denim-shirts.jpg',
    description:
      'Indigo cotton denim shirts finished with contrast topstitching, chest pockets, and durable structure.',
    keywords: ['denim', 'denim shirt', 'indigo shirt', 'chambray'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 5,
  },
  {
    id: 'mf-linen-shirts',
    name: 'Linen Shirts',
    slug: 'linen-shirts',
    parentCategory: 'Shirts',
    parentSlug: 'shirts',
    image: '/images/mens-fashion/shirts/linen-shirts.jpg',
    description:
      'Lightweight, airy linen shirts with natural slub texture ideal for warm weather and resort wear.',
    keywords: ['linen', 'linen shirt', 'summer shirt', 'breathable shirt'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 6,
  },
  {
    id: 'mf-oxford-shirts',
    name: 'Oxford Shirts',
    slug: 'oxford-shirts',
    parentCategory: 'Shirts',
    parentSlug: 'shirts',
    image: '/images/mens-fashion/shirts/oxford-shirts.jpg',
    description:
      'Timeless basket-weave Oxford button-down shirts built for smart-casual versatility and lasting comfort.',
    keywords: ['oxford', 'oxford shirt', 'button-down collar'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 7,
  },
  {
    id: 'mf-slim-fit-shirts',
    name: 'Slim Fit Shirts',
    slug: 'slim-fit-shirts',
    parentCategory: 'Shirts',
    parentSlug: 'shirts',
    image: '/images/mens-fashion/shirts/slim-fit-shirts.jpg',
    description:
      'Modern slim-fit shirts tapered cleanly through the chest and waist for a sharp contoured silhouette.',
    keywords: ['slim fit', 'slim shirt', 'tailored fit shirt'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 8,
  },
  {
    id: 'mf-regular-fit-shirts',
    name: 'Regular Fit Shirts',
    slug: 'regular-fit-shirts',
    parentCategory: 'Shirts',
    parentSlug: 'shirts',
    image: '/images/mens-fashion/shirts/regular-fit-shirts.jpg',
    description:
      'Easy straight-cut regular-fit shirts offering classic shoulder room and relaxed all-day comfort.',
    keywords: ['regular fit', 'classic fit shirt', 'standard fit shirt'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 9,
  },
  {
    id: 'mf-half-sleeve-shirts',
    name: 'Half Sleeve Shirts',
    slug: 'half-sleeve-shirts',
    parentCategory: 'Shirts',
    parentSlug: 'shirts',
    image: '/images/mens-fashion/shirts/half-sleeve-shirts.jpg',
    description:
      'Breezy short-sleeve collared shirts designed for warm-climate comfort and crisp casual outings.',
    keywords: ['half sleeve', 'short sleeve shirt', 'summer collared shirt'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 10,
  },
  {
    id: 'mf-full-sleeve-shirts',
    name: 'Full Sleeve Shirts',
    slug: 'full-sleeve-shirts',
    parentCategory: 'Shirts',
    parentSlug: 'shirts',
    image: '/images/mens-fashion/shirts/full-sleeve-shirts.jpg',
    description:
      'Long-sleeve collared shirts with tailored button cuffs for year-round smart and formal dressing.',
    keywords: ['full sleeve', 'long sleeve shirt', 'cuffed shirt'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 11,
  },
  {
    id: 'mf-oversized-shirts',
    name: 'Oversized Shirts',
    slug: 'oversized-shirts',
    parentCategory: 'Shirts',
    parentSlug: 'shirts',
    image: '/images/mens-fashion/shirts/oversized-shirts.jpg',
    description:
      'Contemporary drop-shoulder oversized shirts cut with generous drape for relaxed street-ready layering.',
    keywords: ['oversized', 'oversized shirt', 'relaxed shirt', 'boxy shirt'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 12,
  },

  // TROUSERS (13: 5 Elasticated & Casual Short Trousers + 8 Tailored Trousers)
  {
    id: 'mf-elasticated-casual-trousers',
    name: 'Elasticated Casual Short Trousers',
    slug: 'elasticated-casual-short-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/elasticated-casual-trousers.png',
    description:
      'Lightweight solid black elasticated-waist casual short trousers with side pockets for everyday comfort and loungewear.',
    keywords: ['elasticated trousers', 'casual short trousers', 'shorts', 'black shorts', 'elasticated shorts', 'half pant'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 13,
  },
  {
    id: 'mf-athletic-short-trousers',
    name: 'Athletic Knit Short Trousers',
    slug: 'athletic-knit-short-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/athletic-short-trousers.jpg',
    description:
      'Soft heather charcoal knit short trousers with drawstring waist and deep pockets built for workouts and active leisure.',
    keywords: ['athletic short trousers', 'drawstring shorts', 'gym shorts', 'knit shorts', 'sport trousers'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 14,
  },
  {
    id: 'mf-chino-short-trousers',
    name: 'Chino Casual Short Trousers',
    slug: 'chino-casual-short-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/chino-short-trousers.jpg',
    description:
      'Smart-casual navy cotton twill chino short trousers combining a comfortable elasticated waistband with tailored pocket styling.',
    keywords: ['chino short trousers', 'chino shorts', 'navy shorts', 'cotton twill shorts'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 15,
  },
  {
    id: 'mf-cargo-short-trousers',
    name: 'Cargo Short Trousers',
    slug: 'cargo-short-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/cargo-short-trousers.jpg',
    description:
      'Olive ripstop cotton utility cargo short trousers with snap-button flap side pockets and flexible elasticated waist.',
    keywords: ['cargo short trousers', 'cargo shorts', 'utility shorts', 'olive shorts'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 16,
  },
  {
    id: 'mf-lounge-short-trousers',
    name: 'Relaxed Lounge Short Trousers',
    slug: 'relaxed-lounge-short-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/lounge-short-trousers.jpg',
    description:
      'Breathable natural beige cotton elasticated lounge short trousers with a relaxed silhouette for warm-weather home and travel comfort.',
    keywords: ['lounge short trousers', 'relaxed shorts', 'cotton shorts', 'beige shorts', 'home wear'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 17,
  },
  {
    id: 'mf-formal-trousers',
    name: 'Formal Trousers',
    slug: 'formal-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/formal-trousers.jpg',
    description:
      'Structured tailored dress trousers with a sharp pressed front crease for boardroom and evening wear.',
    keywords: ['formal trousers', 'dress trousers', 'formal pants', 'office trousers', 'suit trousers'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 18,
  },
  {
    id: 'mf-chino-trousers',
    name: 'Chino Trousers',
    slug: 'chino-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/chino-trousers.jpg',
    description:
      'Smart-casual cotton twill chino trousers in versatile neutral tones with slanted side pockets.',
    keywords: ['chino', 'chinos', 'chino trousers', 'khaki', 'khaki chinos'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 19,
  },
  {
    id: 'mf-slim-fit-trousers',
    name: 'Slim Fit Trousers',
    slug: 'slim-fit-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/slim-fit-trousers.jpg',
    description:
      'Modern tapered slim-fit trousers designed for a clean, close line from hip through ankle.',
    keywords: ['slim fit trousers', 'tapered trousers', 'slim trousers'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 20,
  },
  {
    id: 'mf-regular-fit-trousers',
    name: 'Regular Fit Trousers',
    slug: 'regular-fit-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/regular-fit-trousers.jpg',
    description:
      'Classic regular-fit trousers offering balanced leg room and dependable comfort for daily wear.',
    keywords: ['regular fit trousers', 'classic trousers', 'everyday trousers'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 21,
  },
  {
    id: 'mf-straight-fit-trousers',
    name: 'Straight Fit Trousers',
    slug: 'straight-fit-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/straight-fit-trousers.jpg',
    description:
      'Clean straight-cut trousers falling evenly from knee to hem for timeless, understated proportions.',
    keywords: ['straight fit trousers', 'straight cut trousers', 'straight leg'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 22,
  },
  {
    id: 'mf-pleated-trousers',
    name: 'Pleated Trousers',
    slug: 'pleated-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/pleated-trousers.jpg',
    description:
      'Sartorial front-pleated tailored trousers offering refined volume and graceful movement.',
    keywords: ['pleated', 'pleated trousers', 'front pleat', 'tailored pleats'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 23,
  },
  {
    id: 'mf-cotton-trousers',
    name: 'Cotton Trousers',
    slug: 'cotton-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/cotton-trousers.jpg',
    description:
      'Breathable pure-cotton trousers engineered for warm climates, travel, and effortless smart-casual outfits.',
    keywords: ['cotton trousers', 'breathable trousers', 'pure cotton trousers'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 24,
  },
  {
    id: 'mf-stretch-trousers',
    name: 'Stretch Trousers',
    slug: 'stretch-trousers',
    parentCategory: 'Trousers',
    parentSlug: 'trousers',
    image: '/images/mens-fashion/trousers/stretch-trousers.jpg',
    description:
      'Flexible four-way stretch tailored trousers blending sleek form with active ease of movement.',
    keywords: ['stretch trousers', 'flex trousers', 'elastane trousers', 'comfort stretch'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 25,
  },

  // PANTS (8)
  {
    id: 'mf-jeans',
    name: 'Jeans',
    slug: 'jeans',
    parentCategory: 'Pants',
    parentSlug: 'pants',
    image: '/images/mens-fashion/pants/jeans.jpg',
    description:
      'Authentic five-pocket denim jeans in classic washes with sturdy hardware and durable cotton twill.',
    keywords: ['jeans', 'denim jeans', 'mens jeans', 'blue jeans'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 26,
  },
  {
    id: 'mf-cargo-pants',
    name: 'Cargo Pants',
    slug: 'cargo-pants',
    parentCategory: 'Pants',
    parentSlug: 'pants',
    image: '/images/mens-fashion/pants/cargo-pants.jpg',
    description:
      'Utility-inspired cargo pants featuring bellows flap pockets and rugged ripstop or twill cotton fabric.',
    keywords: ['cargo', 'cargo pants', 'utility pants', 'pocket pants'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 27,
  },
  {
    id: 'mf-jogger-pants',
    name: 'Jogger Pants',
    slug: 'jogger-pants',
    parentCategory: 'Pants',
    parentSlug: 'pants',
    image: '/images/mens-fashion/pants/jogger-pants.jpg',
    description:
      'Athleisure jogger pants with drawstring waistbands, tapered legs, and snug elasticated ankle cuffs.',
    keywords: ['jogger', 'joggers', 'jogger pants', 'cuffed pants'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 28,
  },
  {
    id: 'mf-track-pants',
    name: 'Track Pants',
    slug: 'track-pants',
    parentCategory: 'Pants',
    parentSlug: 'pants',
    image: '/images/mens-fashion/pants/track-pants.jpg',
    description:
      'Lightweight athletic track pants built for training, running, and active daily comfort.',
    keywords: ['track pants', 'sweatpants', 'athletic pants', 'sport pants'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 29,
  },
  {
    id: 'mf-casual-pants',
    name: 'Casual Pants',
    slug: 'casual-pants',
    parentCategory: 'Pants',
    parentSlug: 'pants',
    image: '/images/mens-fashion/pants/casual-pants.jpg',
    description:
      'Versatile everyday casual pants tailored for relaxed weekends, travel, and effortless pairing.',
    keywords: ['casual pants', 'everyday pants', 'relaxed casual pants'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 30,
  },
  {
    id: 'mf-cotton-pants',
    name: 'Cotton Pants',
    slug: 'cotton-pants',
    parentCategory: 'Pants',
    parentSlug: 'pants',
    image: '/images/mens-fashion/pants/cotton-pants.jpg',
    description:
      'Soft woven natural cotton pants providing cool breathability and laid-back structure.',
    keywords: ['cotton pants', 'natural cotton pants', 'lounge pants'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 31,
  },
  {
    id: 'mf-relaxed-fit-pants',
    name: 'Relaxed Fit Pants',
    slug: 'relaxed-fit-pants',
    parentCategory: 'Pants',
    parentSlug: 'pants',
    image: '/images/mens-fashion/pants/relaxed-fit-pants.jpg',
    description:
      'Roomy relaxed-fit pants cut with generous ease through the seat and thigh for maximum freedom.',
    keywords: ['relaxed fit pants', 'loose fit pants', 'comfort fit pants'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 32,
  },
  {
    id: 'mf-wide-leg-pants',
    name: 'Wide-Leg Pants',
    slug: 'wide-leg-pants',
    parentCategory: 'Pants',
    parentSlug: 'pants',
    image: '/images/mens-fashion/pants/wide-leg-pants.jpg',
    description:
      'Contemporary wide-leg pants with a full, flowing drape crafted for modern street-smart silhouettes.',
    keywords: ['wide-leg pants', 'wide leg', 'baggy pants', 'loose silhouette'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 33,
  },

  // T-SHIRTS (10)
  {
    id: 'mf-round-neck-tshirts',
    name: 'Round Neck T-Shirts',
    slug: 'round-neck-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    image: '/images/mens-fashion/tshirts/round-neck-tshirts.jpg',
    description:
      'Classic crew-neck cotton jersey T-shirts with ribbed collars designed for everyday comfort.',
    keywords: ['round neck', 'crew neck', 'crewneck tee', 'round neck t-shirt'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 34,
  },
  {
    id: 'mf-v-neck-tshirts',
    name: 'V-Neck T-Shirts',
    slug: 'v-neck-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    image: '/images/mens-fashion/tshirts/v-neck-tshirts.jpg',
    description:
      'Clean V-neck T-shirts knitted from soft combed cotton for sleek solo wear or effortless layering.',
    keywords: ['v-neck', 'v neck t-shirt', 'vneck tee'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 35,
  },
  {
    id: 'mf-polo-tshirts',
    name: 'Polo T-Shirts',
    slug: 'polo-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    image: '/images/mens-fashion/tshirts/polo-tshirts.jpg',
    description:
      'Pique knit collared polo T-shirts with two-button plackets bridging sporty comfort and smart polish.',
    keywords: ['polo', 'polo t-shirt', 'collared tee', 'pique polo'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 36,
  },
  {
    id: 'mf-printed-tshirts',
    name: 'Printed T-Shirts',
    slug: 'printed-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    image: '/images/mens-fashion/tshirts/printed-tshirts.jpg',
    description:
      'Casual printed T-shirts featuring artistic chest prints and crisp motifs on soft cotton jersey.',
    keywords: ['printed t-shirt', 'print tee', 'chest print'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 37,
  },
  {
    id: 'mf-graphic-tshirts',
    name: 'Graphic T-Shirts',
    slug: 'graphic-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    image: '/images/mens-fashion/tshirts/graphic-tshirts.jpg',
    description:
      'Expressive modern graphic T-shirts showcasing bold contemporary artwork on breathable cotton.',
    keywords: ['graphic t-shirt', 'graphic tee', 'illustration tee', 'streetwear tee'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 38,
  },
  {
    id: 'mf-oversized-tshirts',
    name: 'Oversized T-Shirts',
    slug: 'oversized-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    image: '/images/mens-fashion/tshirts/oversized-tshirts.jpg',
    description:
      'Heavyweight drop-shoulder oversized T-shirts offering a boxy streetwear fit and structured drape.',
    keywords: ['oversized t-shirt', 'oversized tee', 'drop shoulder', 'baggy tee'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 39,
  },
  {
    id: 'mf-plain-tshirts',
    name: 'Plain T-Shirts',
    slug: 'plain-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    image: '/images/mens-fashion/tshirts/plain-tshirts.jpg',
    description:
      'Minimalist solid-colour plain T-shirts crafted from smooth combed cotton as essential wardrobe staples.',
    keywords: ['plain t-shirt', 'solid tee', 'basic t-shirt', 'minimalist tee'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 40,
  },
  {
    id: 'mf-full-sleeve-tshirts',
    name: 'Full Sleeve T-Shirts',
    slug: 'full-sleeve-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    image: '/images/mens-fashion/tshirts/full-sleeve-tshirts.jpg',
    description:
      'Versatile long-sleeve cotton T-shirts tailored for transitional weather and casual layering.',
    keywords: ['full sleeve t-shirt', 'long sleeve tee', 'long sleeve t-shirt'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 41,
  },
  {
    id: 'mf-half-sleeve-tshirts',
    name: 'Half Sleeve T-Shirts',
    slug: 'half-sleeve-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    image: '/images/mens-fashion/tshirts/half-sleeve-tshirts.jpg',
    description:
      'Breathable short-sleeve everyday cotton T-shirts engineered for lightness and cool comfort.',
    keywords: ['half sleeve t-shirt', 'short sleeve tee', 'short sleeve t-shirt'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 42,
  },
  {
    id: 'mf-striped-tshirts',
    name: 'Striped T-Shirts',
    slug: 'striped-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    image: '/images/mens-fashion/tshirts/striped-tshirts.jpg',
    description:
      'Crisp yarn-dyed striped T-shirts pairing timeless horizontal stripes with soft everyday cotton knit.',
    keywords: ['striped t-shirt', 'stripes tee', 'horizontal stripe'],
    status: 'pending_approval',
    approved: false,
    displayOrder: 43,
  },
];

const RENAMED_TROUSERS_TEMP_NAMES = new Set([
  'Cargo Trousers',
  'Jogger Trousers',
  'Track Trousers',
  'Casual Trousers',
  'Elasticated Cotton Trousers',
  'Relaxed Fit Trousers',
  'Wide-Leg Trousers',
]);

export function mergeMensFashionCollections(
  stored: Partial<MensFashionCollection>[] = []
): MensFashionCollection[] {
  const storedById = new Map(
    (Array.isArray(stored) ? stored : [])
      .filter((c): c is Partial<MensFashionCollection> & { id: string } => Boolean(c?.id))
      .map((c) => [c.id, c])
  );

  return INITIAL_MENS_FASHION_COLLECTIONS.map((seed) => {
    const existing = storedById.get(seed.id);
    if (!existing) return seed;
    const status =
      existing.status === 'approved' || existing.approved === true
        ? 'approved'
        : 'pending_approval';
    const isRevertedTempRecord =
      seed.parentCategory === 'Pants' &&
      ((existing as { parentCategory?: string }).parentCategory === 'Trousers' ||
        (typeof existing.name === 'string' && RENAMED_TROUSERS_TEMP_NAMES.has(existing.name.trim())));
    const nextName =
      !isRevertedTempRecord &&
      typeof existing.name === 'string' &&
      existing.name.trim()
        ? existing.name.trim()
        : seed.name;
    const nextDesc =
      !isRevertedTempRecord &&
      typeof existing.description === 'string' &&
      existing.description.trim()
        ? existing.description.trim()
        : seed.description;
    return {
      ...seed,
      ...existing,
      id: seed.id,
      slug: seed.slug,
      parentCategory: seed.parentCategory,
      parentSlug: seed.parentSlug,
      name: nextName,
      description: nextDesc,
      image: (() => {
        const raw =
          typeof existing.image === 'string' && existing.image.trim()
            ? existing.image.trim()
            : '';
        if (!raw) return seed.image;
        return raw.startsWith('/images/mens-fashion/')
          ? raw.replace(/\.webp$/i, '.jpg')
          : raw;
      })(),
      keywords:
        !isRevertedTempRecord &&
        Array.isArray(existing.keywords) &&
        existing.keywords.length > 0
          ? existing.keywords
          : seed.keywords,
      status,
      approved: status === 'approved',
      displayOrder: seed.displayOrder,
    };
  });
}

export function getMensFashionCollectionPath(
  col: Pick<MensFashionCollection, 'parentSlug' | 'slug'>
): string {
  return `/fashion/mens-fashion/${col.parentSlug}/${col.slug}`;
}

export function findMensFashionParentBySlug(slug?: string) {
  const clean = (slug || '').toLowerCase().trim();
  if (!clean) return undefined;
  return MENS_FASHION_PARENT_CATEGORIES.find(
    (p) => p.slug === clean || p.name.toLowerCase() === clean
  );
}

const LEGACY_MENS_COLLECTION_SLUG_ALIASES: Record<string, string> = {
  'cargo-trousers': 'cargo-pants',
  'jogger-trousers': 'jogger-pants',
  'track-trousers': 'track-pants',
  'casual-trousers': 'casual-pants',
  'elasticated-cotton-trousers': 'cotton-pants',
  'relaxed-fit-trousers': 'relaxed-fit-pants',
  'wide-leg-trousers': 'wide-leg-pants',
};

export function findMensFashionCollection(
  collections: MensFashionCollection[],
  slugOrName?: string
): MensFashionCollection | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;
  const resolvedSlug = LEGACY_MENS_COLLECTION_SLUG_ALIASES[clean] || clean;
  return collections.find(
    (c) =>
      c.slug.toLowerCase() === resolvedSlug ||
      c.id.toLowerCase() === clean ||
      c.id.toLowerCase() === `mf-${clean}` ||
      c.name.toLowerCase() === clean
  );
}

export function productMatchesMensFashionCollection(
  product: Product,
  collection: MensFashionCollection
): boolean {
  if ((product.category || '').toLowerCase().trim() !== 'fashion') {
    return false;
  }
  const subLower = (product.subcategory || '').toLowerCase().trim();
  if (
    subLower !== "men's fashion" &&
    subLower !== 'men' &&
    subLower !== 'mens-fashion'
  ) {
    return false;
  }

  const subSubLower = (product.subSubcategory || '').toLowerCase().trim();
  const parentLower = collection.parentCategory.toLowerCase();
  const colNameLower = collection.name.toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase().trim());

  // Direct collection tag/subSubcategory match
  if (
    subSubLower === colNameLower ||
    subSubLower === collection.slug ||
    tags.includes(colNameLower) ||
    tags.includes(collection.slug) ||
    tags.includes(collection.id)
  ) {
    return true;
  }

  // Match strictly within the same parent category (Shirts / Trousers / Pants / T-Shirts)
  const sameParent = subSubLower === parentLower;
  if (!sameParent && subSubLower) {
    return false;
  }

  const haystack = [
    product.name,
    product.shortDescription,
    product.description,
    ...(product.tags || []),
    ...(product.specs || []).map((s) => `${s.label} ${s.value}`),
  ]
    .join(' ')
    .toLowerCase();

  return collection.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}
