import type {
  Product,
  WomensFashionCollection,
  WomensFashionParentCategory,
} from '../types';

export interface WomensFashionParentGroup {
  name: WomensFashionParentCategory;
  slug: string;
  folder: string;
  image: string;
  description: string;
}

export const WOMENS_FASHION_PARENT_CATEGORIES: WomensFashionParentGroup[] = [
  {
    name: 'Churidar Sets',
    slug: 'churidar-sets',
    folder: 'churidar-sets',
    image: '/images/womens-fashion/churidar-sets/cotton-churidar-sets.jpg',
    description:
      'Cotton, printed, embroidered, Anarkali, designer, and party wear women’s churidar suit sets with coordinated bottoms and dupattas.',
  },
  {
    name: 'Traditional Wear',
    slug: 'traditional-wear',
    folder: 'traditional-wear',
    image: '/images/womens-fashion/traditional-wear.jpg',
    description:
      'Timeless salwar kameez, flowing Anarkali suits, ethnic kurta ensembles, festive shararas, palazzo sets, and half sarees.',
  },
  {
    name: 'Sarees',
    slug: 'sarees',
    folder: 'sarees',
    image: '/images/womens-fashion/sarees/silk-sarees.jpg',
    description:
      'Handloom silk, breathable cotton, georgette, chiffon, Banarasi zari, Kanjivaram, designer, and printed sarees.',
  },
  {
    name: 'Lehengas',
    slug: 'lehengas',
    folder: 'lehengas',
    image: '/images/womens-fashion/lehengas/lehenga-choli-sets.jpg',
    description:
      'Bridal, party wear, A-line, flared, embroidered, and traditional three-piece lehenga choli sets crafted for celebrations.',
  },
  {
    name: 'Korean Fashion',
    slug: 'korean-fashion',
    folder: 'korean-fashion',
    image: '/images/womens-fashion/korean-fashion.jpg',
    description:
      'Minimalist Seoul-inspired women’s tops, oversized shirts, pleated mini skirts, wide-leg trousers, cardigans, and co-ord sets.',
  },
  {
    name: 'Bottom Wear',
    slug: 'bottom-wear',
    folder: 'bottom-wear',
    image: '/images/womens-fashion/bottom-wear/formal-trousers.jpg',
    description:
      'Women’s denim jeans, stretch leggings, airy palazzos, tailored formal trousers, utility cargo pants, and wide-leg culottes.',
  },
  {
    name: 'Shawls & Stoles',
    slug: 'shawls-stoles',
    folder: 'shawls-stoles',
    image: '/images/womens-fashion/shawls-stoles/printed-stoles.jpg',
    description:
      'Soft cotton wraps, lustrous silk shawls, warm woollen shawls, patterned printed stoles, and sheer chiffon stoles.',
  },
  {
    name: 'Tops',
    slug: 'tops',
    folder: 'tops',
    image: '/images/womens-fashion/tops/casual-tops.jpg',
    description:
      'Casual everyday tops, fitted crop tops, flared peplums, easy tunics, off-shoulder necklines, and crisp woven blouses.',
  },
  {
    name: 'Skirts',
    slug: 'skirts',
    folder: 'skirts',
    image: '/images/womens-fashion/skirts/mini-skirts.jpg',
    description:
      'Playful mini skirts, refined midis, sweeping maxi skirts, crisp knife-pleated styles, denim skirts, and tailored A-line cuts.',
  },
  {
    name: 'Nightwear Sets',
    slug: 'nightwear-sets',
    folder: 'nightwear-sets',
    image: '/images/womens-fashion/nightwear-sets.jpg',
    description:
      'Breathable cotton pyjama sets, silky satin sleepwear, soft nightgowns, two-piece lounge sets, and summer short nightwear.',
  },
  {
    name: 'Long Coats',
    slug: 'long-coats',
    folder: 'long-coats',
    image: '/images/womens-fashion/long-coats/longline-blazers.jpg',
    description:
      'Belted trench coats, warm woollen long coats, structured overcoats, tailored longline blazers, and insulated winter coats.',
  },
  {
    name: 'Track Pants',
    slug: 'track-pants',
    folder: 'track-pants',
    image: '/images/womens-fashion/track-pants.jpg',
    description:
      'Tapered slim fit, relaxed regular fit, cuffed joggers, wide-leg lounge styles, and performance sports track pants.',
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    folder: 'tshirts',
    image: '/images/womens-fashion/tshirts/round-neck-tshirts.jpg',
    description:
      'Combed cotton round-neck, V-neck, collared polo, oversized, printed, graphic, long-sleeve, and cropped women’s T-shirts.',
  },
];

interface SeedInput {
  name: string;
  slug: string;
  parentCategory: WomensFashionParentCategory;
  parentSlug: string;
  expectedFilename: string;
  image?: string;
  description: string;
  keywords: string[];
}

const RAW_WOMENS_COLLECTIONS: SeedInput[] = [
  // 1. CHURIDAR SETS (6)
  {
    name: 'Cotton Churidar Sets',
    slug: 'cotton-churidar-sets',
    parentCategory: 'Churidar Sets',
    parentSlug: 'churidar-sets',
    expectedFilename: 'churidar-sets/cotton-churidar-sets.jpg',
    image: '/images/womens-fashion/churidar-sets/cotton-churidar-sets.jpg',
    description:
      'Breathable handloom cotton churidar suits paired with soft fitted bottoms and lightweight everyday dupattas.',
    keywords: ['cotton churidar', 'cotton suit', 'churidar', 'daily wear churidar'],
  },
  {
    name: 'Printed Churidar Sets',
    slug: 'printed-churidar-sets',
    parentCategory: 'Churidar Sets',
    parentSlug: 'churidar-sets',
    expectedFilename: 'churidar-sets/printed-churidar-sets.jpg',
    image: '/images/womens-fashion/churidar-sets/printed-churidar-sets.jpg',
    description:
      'Vibrant floral and block-printed women’s churidar sets designed for effortless daytime elegance and office wear.',
    keywords: ['printed churidar', 'floral churidar', 'block print suit'],
  },
  {
    name: 'Embroidered Churidar Sets',
    slug: 'embroidered-churidar-sets',
    parentCategory: 'Churidar Sets',
    parentSlug: 'churidar-sets',
    expectedFilename: 'churidar-sets/embroidered-churidar-sets.jpg',
    image: '/images/womens-fashion/churidar-sets/embroidered-churidar-sets.jpg',
    description:
      'Fine threadwork and zari-detailed embroidered churidar sets crafted for festive gatherings and family celebrations.',
    keywords: ['embroidered churidar', 'threadwork churidar', 'zari churidar'],
  },
  {
    name: 'Anarkali Churidar Sets',
    slug: 'anarkali-churidar-sets',
    parentCategory: 'Churidar Sets',
    parentSlug: 'churidar-sets',
    expectedFilename: 'churidar-sets/anarkali-churidar-sets.jpg',
    image: '/images/womens-fashion/churidar-sets/anarkali-churidar-sets.jpg',
    description:
      'Gracefully flared Anarkali-silhouette churidar ensembles paired with tapered churidar bottoms and sheer dupattas.',
    keywords: ['anarkali churidar', 'flared churidar', 'anarkali'],
  },
  {
    name: 'Designer Churidar Sets',
    slug: 'designer-churidar-sets',
    parentCategory: 'Churidar Sets',
    parentSlug: 'churidar-sets',
    expectedFilename: 'churidar-sets/designer-churidar-sets.jpg',
    image: '/images/womens-fashion/churidar-sets/designer-churidar-sets.jpg',
    description:
      'Boutique-tailored designer churidar sets featuring contemporary necklines, intricate borders, and refined drape.',
    keywords: ['designer churidar', 'boutique churidar', 'statement ethnic set'],
  },
  {
    name: 'Party Wear Churidar Sets',
    slug: 'party-wear-churidar-sets',
    parentCategory: 'Churidar Sets',
    parentSlug: 'churidar-sets',
    expectedFilename: 'churidar-sets/party-wear-churidar-sets.jpg',
    image: '/images/womens-fashion/churidar-sets/party-wear-churidar-sets.jpg',
    description:
      'Sequinned and richly embellished party wear churidar outfits tailored for evening receptions and celebrations.',
    keywords: ['party wear churidar', 'festive churidar', 'occasion churidar'],
  },

  // 2. TRADITIONAL WEAR (6)
  {
    name: 'Salwar Kameez',
    slug: 'salwar-kameez',
    parentCategory: 'Traditional Wear',
    parentSlug: 'traditional-wear',
    expectedFilename: 'traditional-wear/salwar-kameez.jpg',
    image: '/images/womens-fashion/traditional-wear/salwar-kameez.jpg',
    description:
      'Classic three-piece salwar kameez suits combining a tailored straight kurta, pleated salwar, and flowing dupatta.',
    keywords: ['salwar kameez', 'punjabi suit', 'traditional suit'],
  },
  {
    name: 'Anarkali Suits',
    slug: 'anarkali-suits',
    parentCategory: 'Traditional Wear',
    parentSlug: 'traditional-wear',
    expectedFilename: 'traditional-wear/anarkali-suits.jpg',
    image: '/images/womens-fashion/traditional-wear/anarkali-suits.jpg',
    description:
      'Floor-grazing and calf-length flared Anarkali suits finished with ornate yokes and festive borders.',
    keywords: ['anarkali suit', 'anarkali gown', 'festive anarkali'],
  },
  {
    name: 'Ethnic Kurta Sets',
    slug: 'ethnic-kurta-sets',
    parentCategory: 'Traditional Wear',
    parentSlug: 'traditional-wear',
    expectedFilename: 'traditional-wear/ethnic-kurta-sets.jpg',
    image: '/images/womens-fashion/traditional-wear/ethnic-kurta-sets.jpg',
    description:
      'Coordinated ethnic kurta and straight-pant sets in timeless weaves suited for rituals and everyday festive dressing.',
    keywords: ['ethnic kurta set', 'kurta trouser set', 'kurta dupatta set'],
  },
  {
    name: 'Sharara Sets',
    slug: 'sharara-sets',
    parentCategory: 'Traditional Wear',
    parentSlug: 'traditional-wear',
    expectedFilename: 'traditional-wear/sharara-sets.jpg',
    image: '/images/womens-fashion/traditional-wear/sharara-sets.jpg',
    description:
      'Celebratory sharara sets pairing short embroidered kurtis with dramatically flared tiered sharara bottoms.',
    keywords: ['sharara set', 'sharara suit', 'gharara', 'festive sharara'],
  },
  {
    name: 'Palazzo Sets',
    slug: 'palazzo-sets',
    parentCategory: 'Traditional Wear',
    parentSlug: 'traditional-wear',
    expectedFilename: 'traditional-wear/palazzo-sets.jpg',
    image: '/images/womens-fashion/traditional-wear/palazzo-sets.jpg',
    description:
      'Breezy ethnic kurta and wide-leg palazzo sets combining graceful movement with contemporary Indian styling.',
    keywords: ['palazzo set', 'kurta palazzo', 'ethnic palazzo suit'],
  },
  {
    name: 'Traditional Half Sarees',
    slug: 'traditional-half-sarees',
    parentCategory: 'Traditional Wear',
    parentSlug: 'traditional-wear',
    expectedFilename: 'traditional-wear/traditional-half-sarees.jpg',
    image: '/images/womens-fashion/traditional-wear/traditional-half-sarees.jpg',
    description:
      'South Indian heritage silk pavadai half sarees pairing a pleated lehenga skirt with a fitted blouse and draped voni.',
    keywords: ['half saree', 'pavadai dhavani', 'langa voni', 'south indian traditional'],
  },

  // 3. SAREES (8)
  {
    name: 'Silk Sarees',
    slug: 'silk-sarees',
    parentCategory: 'Sarees',
    parentSlug: 'sarees',
    expectedFilename: 'sarees/silk-sarees.jpg',
    image: '/images/womens-fashion/sarees/silk-sarees.jpg',
    description:
      'Lustrous woven silk sarees crafted with rich contrasting zari borders and regal festive drape.',
    keywords: ['silk saree', 'pure silk saree', 'festive silk', 'zari saree'],
  },
  {
    name: 'Cotton Sarees',
    slug: 'cotton-sarees',
    parentCategory: 'Sarees',
    parentSlug: 'sarees',
    expectedFilename: 'sarees/cotton-sarees.jpg',
    image: '/images/womens-fashion/sarees/cotton-sarees.jpg',
    description:
      'Crisp handloom cotton sarees in airy weaves ideal for warm weather, workdays, and understated grace.',
    keywords: ['cotton saree', 'handloom cotton', 'mulmul saree', 'summer saree'],
  },
  {
    name: 'Georgette Sarees',
    slug: 'georgette-sarees',
    parentCategory: 'Sarees',
    parentSlug: 'sarees',
    expectedFilename: 'sarees/georgette-sarees.jpg',
    image: '/images/womens-fashion/sarees/georgette-sarees.jpg',
    description:
      'Fluid crepe-textured georgette sarees offering effortless pleating and contemporary party silhouettes.',
    keywords: ['georgette saree', 'flowing saree', 'party saree'],
  },
  {
    name: 'Chiffon Sarees',
    slug: 'chiffon-sarees',
    parentCategory: 'Sarees',
    parentSlug: 'sarees',
    expectedFilename: 'sarees/chiffon-sarees.jpg',
    image: '/images/womens-fashion/sarees/chiffon-sarees.jpg',
    description:
      'Featherlight translucent chiffon sarees designed for breezy comfort and graceful feminine draping.',
    keywords: ['chiffon saree', 'lightweight saree', 'sheer saree'],
  },
  {
    name: 'Banarasi Sarees',
    slug: 'banarasi-sarees',
    parentCategory: 'Sarees',
    parentSlug: 'sarees',
    expectedFilename: 'sarees/banarasi-sarees.jpg',
    image: '/images/womens-fashion/sarees/banarasi-sarees.jpg',
    description:
      'Opulent Banarasi silk brocade sarees woven with traditional gold and silver floral jaal motifs.',
    keywords: ['banarasi saree', 'brocade saree', 'bridal banarasi'],
  },
  {
    name: 'Kanjivaram Sarees',
    slug: 'kanjivaram-sarees',
    parentCategory: 'Sarees',
    parentSlug: 'sarees',
    expectedFilename: 'sarees/kanjivaram-sarees.jpg',
    image: '/images/womens-fashion/sarees/kanjivaram-sarees.jpg',
    description:
      'Authentic Kanjivaram mulberry silk sarees celebrated for heavyweight sheen, temple borders, and heirloom craftsmanship.',
    keywords: ['kanjivaram saree', 'kanchipuram silk', 'temple border saree'],
  },
  {
    name: 'Designer Sarees',
    slug: 'designer-sarees',
    parentCategory: 'Sarees',
    parentSlug: 'sarees',
    expectedFilename: 'sarees/designer-sarees.jpg',
    image: '/images/womens-fashion/sarees/designer-sarees.jpg',
    description:
      'Modern designer sarees featuring ruffled trims, sequence embellishments, and statement blouses for evening galas.',
    keywords: ['designer saree', 'cocktail saree', 'sequin saree'],
  },
  {
    name: 'Printed Sarees',
    slug: 'printed-sarees',
    parentCategory: 'Sarees',
    parentSlug: 'sarees',
    expectedFilename: 'sarees/printed-sarees.jpg',
    image: '/images/womens-fashion/sarees/printed-sarees.jpg',
    description:
      'Vibrant botanical, Kalamkari, and geometric printed sarees tailored for easy everyday elegance.',
    keywords: ['printed saree', 'floral saree', 'digital print saree'],
  },

  // 4. LEHENGAS (6)
  {
    name: 'Bridal Lehengas',
    slug: 'bridal-lehengas',
    parentCategory: 'Lehengas',
    parentSlug: 'lehengas',
    expectedFilename: 'lehengas/bridal-lehengas.jpg',
    image: '/images/womens-fashion/lehengas/bridal-lehengas.jpg',
    description:
      'Grand wedding bridal lehengas adorned with intricate zardozi embroidery, velvet panels, and double dupattas.',
    keywords: ['bridal lehenga', 'wedding lehenga', 'heavy embroidered lehenga'],
  },
  {
    name: 'Party Wear Lehengas',
    slug: 'party-wear-lehengas',
    parentCategory: 'Lehengas',
    parentSlug: 'lehengas',
    expectedFilename: 'lehengas/party-wear-lehengas.jpg',
    image: '/images/womens-fashion/lehengas/party-wear-lehengas.jpg',
    description:
      'Shimmering sangeet and reception party wear lehengas styled in georgette, net, and pastel satin silks.',
    keywords: ['party wear lehenga', 'sangeet lehenga', 'reception lehenga'],
  },
  {
    name: 'A-Line Lehengas',
    slug: 'a-line-lehengas',
    parentCategory: 'Lehengas',
    parentSlug: 'lehengas',
    expectedFilename: 'lehengas/a-line-lehengas.jpg',
    image: '/images/womens-fashion/lehengas/a-line-lehengas.jpg',
    description:
      'Cleanly structured A-line lehenga skirts offering a flattering streamlined drape for festive occasions.',
    keywords: ['a-line lehenga', 'a line skirt lehenga', 'structured lehenga'],
  },
  {
    name: 'Flared Lehengas',
    slug: 'flared-lehengas',
    parentCategory: 'Lehengas',
    parentSlug: 'lehengas',
    expectedFilename: 'lehengas/flared-lehengas.jpg',
    image: '/images/womens-fashion/lehengas/flared-lehengas.jpg',
    description:
      'High-volume panelled circular flared lehengas crafted for dramatic twirl and celebratory poise.',
    keywords: ['flared lehenga', 'circular lehenga', 'ghagra'],
  },
  {
    name: 'Embroidered Lehengas',
    slug: 'embroidered-lehengas',
    parentCategory: 'Lehengas',
    parentSlug: 'lehengas',
    expectedFilename: 'lehengas/embroidered-lehengas.jpg',
    image: '/images/womens-fashion/lehengas/embroidered-lehengas.jpg',
    description:
      'Artisanal resham, mirror-work, and sequins embroidered lehengas showcasing detailed Indian craftsmanship.',
    keywords: ['embroidered lehenga', 'mirror work lehenga', 'resham lehenga'],
  },
  {
    name: 'Lehenga Choli Sets',
    slug: 'lehenga-choli-sets',
    parentCategory: 'Lehengas',
    parentSlug: 'lehengas',
    expectedFilename: 'lehengas/lehenga-choli-sets.jpg',
    image: '/images/womens-fashion/lehengas/lehenga-choli-sets.jpg',
    description:
      'Complete coordinated three-piece lehenga choli sets featuring embroidered blouses, flowing skirts, and net dupattas.',
    keywords: ['lehenga choli', 'chaniya choli', 'three piece lehenga'],
  },

  // 5. KOREAN FASHION (6)
  {
    name: 'Korean Style Tops',
    slug: 'korean-style-tops',
    parentCategory: 'Korean Fashion',
    parentSlug: 'korean-fashion',
    expectedFilename: 'korean-fashion/korean-style-tops.jpg',
    image: '/images/womens-fashion/korean-fashion/korean-style-tops.jpg',
    description:
      'Soft pastel Korean-style blouses featuring Peter Pan collars, puff sleeves, and delicate tie-neck details.',
    keywords: ['korean top', 'korean style top', 'k-fashion blouse', 'puff sleeve top'],
  },
  {
    name: 'Korean Oversized Shirts',
    slug: 'korean-oversized-shirts',
    parentCategory: 'Korean Fashion',
    parentSlug: 'korean-fashion',
    expectedFilename: 'korean-fashion/korean-oversized-shirts.jpg',
    image: '/images/womens-fashion/korean-fashion/korean-oversized-shirts.jpg',
    description:
      'Crisp drop-shoulder Korean oversized button-down shirts cut for relaxed minimalist street layering.',
    keywords: ['korean oversized shirt', 'loose shirt', 'seoul street fashion'],
  },
  {
    name: 'Korean Mini Skirts',
    slug: 'korean-mini-skirts',
    parentCategory: 'Korean Fashion',
    parentSlug: 'korean-fashion',
    expectedFilename: 'korean-fashion/korean-mini-skirts.jpg',
    image: '/images/womens-fashion/korean-fashion/korean-mini-skirts.jpg',
    description:
      'High-waisted pleated and A-line Korean mini skirts inspired by contemporary campus and cafe aesthetics.',
    keywords: ['korean mini skirt', 'tennis skirt', 'pleated mini skirt'],
  },
  {
    name: 'Korean Wide-Leg Pants',
    slug: 'korean-wide-leg-pants',
    parentCategory: 'Korean Fashion',
    parentSlug: 'korean-fashion',
    expectedFilename: 'korean-fashion/korean-wide-leg-pants.jpg',
    image: '/images/womens-fashion/korean-fashion/korean-wide-leg-pants.jpg',
    description:
      'High-rise tailored wide-leg trousers with crisp front pleats offering an elongated, effortless Seoul silhouette.',
    keywords: ['korean wide leg pants', 'korean trousers', 'baggy tailored pants'],
  },
  {
    name: 'Korean Cardigans',
    slug: 'korean-cardigans',
    parentCategory: 'Korean Fashion',
    parentSlug: 'korean-fashion',
    expectedFilename: 'korean-fashion/korean-cardigans.jpg',
    image: '/images/womens-fashion/korean-fashion/korean-cardigans.jpg',
    description:
      'Cozy cropped and relaxed button-front Korean knit cardigans in soft cream, lilac, and pastel earth tones.',
    keywords: ['korean cardigan', 'knit sweater', 'pastel cardigan'],
  },
  {
    name: 'Korean Co-ord Sets',
    slug: 'korean-co-ord-sets',
    parentCategory: 'Korean Fashion',
    parentSlug: 'korean-fashion',
    expectedFilename: 'korean-fashion/korean-co-ord-sets.jpg',
    image: '/images/womens-fashion/korean-fashion/korean-co-ord-sets.jpg',
    description:
      'Matched two-piece Korean tweed and relaxed tailored co-ord sets engineered for polished one-step styling.',
    keywords: ['korean co-ord', 'matching set', 'two piece korean outfit'],
  },

  // 6. BOTTOM WEAR (6)
  {
    name: "Women's Jeans",
    slug: 'womens-jeans',
    parentCategory: 'Bottom Wear',
    parentSlug: 'bottom-wear',
    expectedFilename: 'bottom-wear/womens-jeans.jpg',
    image: '/images/womens-fashion/bottom-wear/womens-jeans.jpg',
    description:
      'High-waisted straight, relaxed mom-fit, and stretch-comfort women’s denim jeans in classic indigo and clean washes.',
    keywords: ['womens jeans', 'denim jeans', 'high waist jeans', 'blue jeans'],
  },
  {
    name: 'Leggings',
    slug: 'leggings',
    parentCategory: 'Bottom Wear',
    parentSlug: 'bottom-wear',
    expectedFilename: 'bottom-wear/leggings.jpg',
    image: '/images/womens-fashion/bottom-wear/leggings.jpg',
    description:
      'Four-way stretch cotton and churidar-length women’s leggings tailored for seamless comfort under kurtas and tunics.',
    keywords: ['leggings', 'churidar leggings', 'ankle leggings', 'stretch tights'],
  },
  {
    name: 'Palazzo Pants',
    slug: 'palazzo-pants',
    parentCategory: 'Bottom Wear',
    parentSlug: 'bottom-wear',
    expectedFilename: 'bottom-wear/palazzo-pants.jpg',
    image: '/images/womens-fashion/bottom-wear/palazzo-pants.jpg',
    description:
      'Flowing wide-leg rayon and cotton palazzo pants pairing breezy comfort with versatile ethnic or western styling.',
    keywords: ['palazzo pants', 'palazzos', 'wide leg palazzo'],
  },
  {
    name: 'Formal Trousers',
    slug: 'formal-trousers',
    parentCategory: 'Bottom Wear',
    parentSlug: 'bottom-wear',
    expectedFilename: 'bottom-wear/formal-trousers.jpg',
    image: '/images/womens-fashion/bottom-wear/formal-trousers.jpg',
    description:
      'Crisp high-rise women’s formal office trousers with tailored front creases and clean ankle-skimming lines.',
    keywords: ['formal trousers', 'office pants', 'womens dress pants', 'workwear'],
  },
  {
    name: 'Cargo Pants',
    slug: 'cargo-pants',
    parentCategory: 'Bottom Wear',
    parentSlug: 'bottom-wear',
    expectedFilename: 'bottom-wear/cargo-pants.jpg',
    image: '/images/womens-fashion/bottom-wear/cargo-pants.jpg',
    description:
      'Relaxed high-waisted women’s utility cargo pants featuring structured side flap pockets and soft twill cotton.',
    keywords: ['cargo pants', 'womens cargo', 'utility trousers'],
  },
  {
    name: 'Culottes',
    slug: 'culottes',
    parentCategory: 'Bottom Wear',
    parentSlug: 'bottom-wear',
    expectedFilename: 'bottom-wear/culottes.jpg',
    image: '/images/womens-fashion/bottom-wear/culottes.jpg',
    description:
      'Cropped mid-calf wide-leg culottes crafted in breathable linen and twill blends for refined warm-weather wear.',
    keywords: ['culottes', 'cropped wide leg', 'gaucho pants'],
  },

  // 7. SHAWLS & STOLES (5)
  {
    name: 'Cotton Shawls',
    slug: 'cotton-shawls',
    parentCategory: 'Shawls & Stoles',
    parentSlug: 'shawls-stoles',
    expectedFilename: 'shawls-stoles/cotton-shawls.jpg',
    description:
      'Generously sized handloom cotton shawls with woven borders for breathable coverage and mild-weather layering.',
    keywords: ['cotton shawl', 'handloom shawl', 'summer wrap'],
  },
  {
    name: 'Silk Shawls',
    slug: 'silk-shawls',
    parentCategory: 'Shawls & Stoles',
    parentSlug: 'shawls-stoles',
    expectedFilename: 'shawls-stoles/silk-shawls.jpg',
    image: '/images/womens-fashion/shawls-stoles/silk-shawls.jpg',
    description:
      'Richly lustrous silk evening shawls finished with delicate tassels and metallic woven zari trims.',
    keywords: ['silk shawl', 'evening wrap', 'festive shawl'],
  },
  {
    name: 'Woollen Shawls',
    slug: 'woollen-shawls',
    parentCategory: 'Shawls & Stoles',
    parentSlug: 'shawls-stoles',
    expectedFilename: 'shawls-stoles/woollen-shawls.jpg',
    image: '/images/womens-fashion/shawls-stoles/woollen-shawls.jpg',
    description:
      'Warm merino and pashmina-blend woollen shawls woven with traditional Kashmiri paisley motifs for winter comfort.',
    keywords: ['woollen shawl', 'winter shawl', 'pashmina shawl', 'kashmiri wrap'],
  },
  {
    name: 'Printed Stoles',
    slug: 'printed-stoles',
    parentCategory: 'Shawls & Stoles',
    parentSlug: 'shawls-stoles',
    expectedFilename: 'shawls-stoles/printed-stoles.jpg',
    image: '/images/womens-fashion/shawls-stoles/printed-stoles.jpg',
    description:
      'Artfully patterned printed stoles adding vibrant colour and effortless polish to kurtas, tops, and coats.',
    keywords: ['printed stole', 'floral stole', 'pattern scarf'],
  },
  {
    name: 'Chiffon Stoles',
    slug: 'chiffon-stoles',
    parentCategory: 'Shawls & Stoles',
    parentSlug: 'shawls-stoles',
    expectedFilename: 'shawls-stoles/chiffon-stoles.jpg',
    description:
      'Sheer featherlight chiffon stoles offering delicate fluid drape for summer ensembles and formal occasions.',
    keywords: ['chiffon stole', 'lightweight scarf', 'sheer stole'],
  },

  // 8. TOPS (6)
  {
    name: 'Casual Tops',
    slug: 'casual-tops',
    parentCategory: 'Tops',
    parentSlug: 'tops',
    expectedFilename: 'tops/casual-tops.jpg',
    image: '/images/womens-fashion/tops/casual-tops.jpg',
    description:
      'Relaxed everyday cotton and viscose tops designed for effortless pairing with jeans, palazzos, and skirts.',
    keywords: ['casual top', 'everyday top', 'womens top'],
  },
  {
    name: 'Crop Tops',
    slug: 'crop-tops',
    parentCategory: 'Tops',
    parentSlug: 'tops',
    expectedFilename: 'tops/crop-tops.jpg',
    image: '/images/womens-fashion/tops/crop-tops.jpg',
    description:
      'Chic ribbed, tie-front, and structured crop tops tailored to pair cleanly with high-rise denim and skirts.',
    keywords: ['crop top', 'short top', 'fitted crop top'],
  },
  {
    name: 'Peplum Tops',
    slug: 'peplum-tops',
    parentCategory: 'Tops',
    parentSlug: 'tops',
    expectedFilename: 'tops/peplum-tops.jpg',
    image: '/images/womens-fashion/tops/peplum-tops.jpg',
    description:
      'Flattering waist-cinched peplum tops with gentle flared hems ideal for workdays and smart casual outings.',
    keywords: ['peplum top', 'flared waist top', 'smart top'],
  },
  {
    name: 'Tunic Tops',
    slug: 'tunic-tops',
    parentCategory: 'Tops',
    parentSlug: 'tops',
    expectedFilename: 'tops/tunic-tops.jpg',
    image: '/images/womens-fashion/tops/tunic-tops.jpg',
    description:
      'Longline button-placket tunic tops crafted from airy linen and rayon blends for all-day coverage and ease.',
    keywords: ['tunic top', 'long top', 'kurti top'],
  },
  {
    name: 'Off-Shoulder Tops',
    slug: 'off-shoulder-tops',
    parentCategory: 'Tops',
    parentSlug: 'tops',
    expectedFilename: 'tops/off-shoulder-tops.jpg',
    image: '/images/womens-fashion/tops/off-shoulder-tops.jpg',
    description:
      'Romantic elasticated off-shoulder and bardot tops featuring ruffled trims and soft resort drape.',
    keywords: ['off shoulder top', 'bardot top', 'party top'],
  },
  {
    name: 'Blouses',
    slug: 'blouses',
    parentCategory: 'Tops',
    parentSlug: 'tops',
    expectedFilename: 'tops/blouses.jpg',
    image: '/images/womens-fashion/tops/blouses.jpg',
    description:
      'Tailored button-down satin, georgette, and cotton workwear blouses bringing crisp elegance to office styling.',
    keywords: ['blouse', 'formal blouse', 'silk blouse', 'office shirt'],
  },

  // 9. SKIRTS (6)
  {
    name: 'Mini Skirts',
    slug: 'mini-skirts',
    parentCategory: 'Skirts',
    parentSlug: 'skirts',
    expectedFilename: 'skirts/mini-skirts.jpg',
    image: '/images/womens-fashion/skirts/mini-skirts.jpg',
    description:
      'Clean-lined high-waisted mini skirts in structured cotton twill and tweed for playful contemporary outfits.',
    keywords: ['mini skirt', 'short skirt', 'high waist mini'],
  },
  {
    name: 'Midi Skirts',
    slug: 'midi-skirts',
    parentCategory: 'Skirts',
    parentSlug: 'skirts',
    expectedFilename: 'skirts/midi-skirts.jpg',
    description:
      'Graceful calf-length satin and cotton midi skirts transitioning effortlessly from daytime meetings to dinner.',
    keywords: ['midi skirt', 'calf length skirt', 'bias cut skirt'],
  },
  {
    name: 'Maxi Skirts',
    slug: 'maxi-skirts',
    parentCategory: 'Skirts',
    parentSlug: 'skirts',
    expectedFilename: 'skirts/maxi-skirts.jpg',
    image: '/images/womens-fashion/skirts/maxi-skirts.jpg',
    description:
      'Sweeping ankle-length tiered and printed bohemian maxi skirts crafted for breezy summer movement.',
    keywords: ['maxi skirt', 'long skirt', 'tiered skirt'],
  },
  {
    name: 'Pleated Skirts',
    slug: 'pleated-skirts',
    parentCategory: 'Skirts',
    parentSlug: 'skirts',
    expectedFilename: 'skirts/pleated-skirts.jpg',
    description:
      'Accordion and knife-pleated skirts offering structured drape and fluid motion with every step.',
    keywords: ['pleated skirt', 'accordion skirt', 'knife pleat'],
  },
  {
    name: 'Denim Skirts',
    slug: 'denim-skirts',
    parentCategory: 'Skirts',
    parentSlug: 'skirts',
    expectedFilename: 'skirts/denim-skirts.jpg',
    description:
      'Classic five-pocket and button-front indigo denim skirts pairing rugged texture with timeless casual shape.',
    keywords: ['denim skirt', 'jean skirt', 'indigo skirt'],
  },
  {
    name: 'A-Line Skirts',
    slug: 'a-line-skirts',
    parentCategory: 'Skirts',
    parentSlug: 'skirts',
    expectedFilename: 'skirts/a-line-skirts.jpg',
    image: '/images/womens-fashion/skirts/a-line-skirts.jpg',
    description:
      'Versatile tailored A-line skirts flaring softly from waist to hem for clean, balanced proportions.',
    keywords: ['a-line skirt', 'flared skirt', 'work skirt'],
  },

  // 10. NIGHTWEAR SETS (5)
  {
    name: 'Cotton Pyjama Sets',
    slug: 'cotton-pyjama-sets',
    parentCategory: 'Nightwear Sets',
    parentSlug: 'nightwear-sets',
    expectedFilename: 'nightwear-sets/cotton-pyjama-sets.jpg',
    description:
      'Pure combed cotton collared two-piece pyjama sleepwear sets offering breathable softness through every season.',
    keywords: ['cotton pyjama', 'pajama set', 'cotton night suit'],
  },
  {
    name: 'Satin Nightwear Sets',
    slug: 'satin-nightwear-sets',
    parentCategory: 'Nightwear Sets',
    parentSlug: 'nightwear-sets',
    expectedFilename: 'nightwear-sets/satin-nightwear-sets.jpg',
    description:
      'Silky contrast-piped satin button-down shirt and trouser nightwear sets for luxurious evening relaxation.',
    keywords: ['satin nightwear', 'silk pajama', 'satin night suit'],
  },
  {
    name: 'Nightgowns',
    slug: 'nightgowns',
    parentCategory: 'Nightwear Sets',
    parentSlug: 'nightwear-sets',
    expectedFilename: 'nightwear-sets/nightgowns.jpg',
    description:
      'Easy-fit cotton and modal maxi nightgowns designed with gentle lace necklines and airy sleep comfort.',
    keywords: ['nightgown', 'nighty', 'sleep dress'],
  },
  {
    name: 'Lounge Sets',
    slug: 'lounge-sets',
    parentCategory: 'Nightwear Sets',
    parentSlug: 'nightwear-sets',
    expectedFilename: 'nightwear-sets/lounge-sets.jpg',
    description:
      'Soft knitted pullover and relaxed drawstring loungewear co-ord sets perfect for restful mornings and home.',
    keywords: ['lounge set', 'homewear', 'lounge co-ord'],
  },
  {
    name: 'Short Nightwear Sets',
    slug: 'short-nightwear-sets',
    parentCategory: 'Nightwear Sets',
    parentSlug: 'nightwear-sets',
    expectedFilename: 'nightwear-sets/short-nightwear-sets.jpg',
    image: '/images/womens-fashion/nightwear-sets/short-nightwear-sets.jpg',
    description:
      'Lightweight short-sleeve tee and shorts nightwear sets crafted for cool summer nights.',
    keywords: ['short nightwear', 'shorts pajama set', 'summer sleepwear'],
  },

  // 11. LONG COATS (5)
  {
    name: 'Trench Coats',
    slug: 'trench-coats',
    parentCategory: 'Long Coats',
    parentSlug: 'long-coats',
    expectedFilename: 'long-coats/trench-coats.jpg',
    image: '/images/womens-fashion/long-coats/trench-coats.jpg',
    description:
      'Classic double-breasted belted cotton-gabardine trench coats with storm flaps and timeless tailored polish.',
    keywords: ['trench coat', 'belted coat', 'rain trench'],
  },
  {
    name: 'Woollen Long Coats',
    slug: 'woollen-long-coats',
    parentCategory: 'Long Coats',
    parentSlug: 'long-coats',
    expectedFilename: 'long-coats/woollen-long-coats.jpg',
    image: '/images/womens-fashion/long-coats/woollen-long-coats.jpg',
    description:
      'Brushed wool-blend long coats offering plush insulation, notched lapels, and cold-weather elegance.',
    keywords: ['woollen long coat', 'wool coat', 'winter long coat'],
  },
  {
    name: 'Overcoats',
    slug: 'overcoats',
    parentCategory: 'Long Coats',
    parentSlug: 'long-coats',
    expectedFilename: 'long-coats/overcoats.jpg',
    description:
      'Full-length tailored single-breasted overcoats crafted to layer cleanly over formal dresses and knitwear.',
    keywords: ['overcoat', 'womens overcoat', 'tailored long coat'],
  },
  {
    name: 'Longline Blazers',
    slug: 'longline-blazers',
    parentCategory: 'Long Coats',
    parentSlug: 'long-coats',
    expectedFilename: 'long-coats/longline-blazers.jpg',
    image: '/images/womens-fashion/long-coats/longline-blazers.jpg',
    description:
      'Elongated structured longline blazers bridging boardroom sharpness and chic outer layering.',
    keywords: ['longline blazer', 'long blazer', 'coat blazer'],
  },
  {
    name: 'Winter Coats',
    slug: 'winter-coats',
    parentCategory: 'Long Coats',
    parentSlug: 'long-coats',
    expectedFilename: 'long-coats/winter-coats.jpg',
    description:
      'Cozy insulated winter coats featuring high storm collars and warm quilted linings for brisk temperatures.',
    keywords: ['winter coat', 'heavy coat', 'cold weather outerwear'],
  },

  // 12. TRACK PANTS (5)
  {
    name: 'Slim Fit Track Pants',
    slug: 'slim-fit-track-pants',
    parentCategory: 'Track Pants',
    parentSlug: 'track-pants',
    expectedFilename: 'track-pants/slim-fit-track-pants.jpg',
    description:
      'Streamlined slim-fit athletic track pants cut with tapered ankles and zip pockets for active movement.',
    keywords: ['slim fit track pants', 'tapered track pants', 'fitted tracks'],
  },
  {
    name: 'Regular Fit Track Pants',
    slug: 'regular-fit-track-pants',
    parentCategory: 'Track Pants',
    parentSlug: 'track-pants',
    expectedFilename: 'track-pants/regular-fit-track-pants.jpg',
    image: '/images/womens-fashion/track-pants/regular-fit-track-pants.jpg',
    description:
      'Comfortable straight-leg regular-fit track pants in breathable French terry for walks and daily lounging.',
    keywords: ['regular fit track pants', 'straight track pants', 'everyday tracks'],
  },
  {
    name: 'Jogger Track Pants',
    slug: 'jogger-track-pants',
    parentCategory: 'Track Pants',
    parentSlug: 'track-pants',
    expectedFilename: 'track-pants/jogger-track-pants.jpg',
    description:
      'Ribbed-cuff women’s jogger track pants pairing a high elasticated drawstring waist with athleisure ease.',
    keywords: ['jogger track pants', 'womens joggers', 'cuffed sweatpants'],
  },
  {
    name: 'Wide-Leg Track Pants',
    slug: 'wide-leg-track-pants',
    parentCategory: 'Track Pants',
    parentSlug: 'track-pants',
    expectedFilename: 'track-pants/wide-leg-track-pants.jpg',
    description:
      'Relaxed wide-leg fleece and jersey track pants blending street-casual drape with soft studio comfort.',
    keywords: ['wide-leg track pants', 'wide track pants', 'relaxed sweatpants'],
  },
  {
    name: 'Sports Track Pants',
    slug: 'sports-track-pants',
    parentCategory: 'Track Pants',
    parentSlug: 'track-pants',
    expectedFilename: 'track-pants/sports-track-pants.jpg',
    image: '/images/womens-fashion/track-pants/sports-track-pants.jpg',
    description:
      'Moisture-wicking four-way stretch performance sports track pants engineered for running, gym, and yoga.',
    keywords: ['sports track pants', 'gym track pants', 'running tracks'],
  },

  // 13. T-SHIRTS (8)
  {
    name: 'Round Neck T-Shirts',
    slug: 'round-neck-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    expectedFilename: 'tshirts/round-neck-tshirts.jpg',
    image: '/images/womens-fashion/tshirts/round-neck-tshirts.jpg',
    description:
      'Essential ribbed crew-neck women’s T-shirts knitted from ultra-soft combed cotton for everyday wear.',
    keywords: ['round neck t-shirt', 'crew neck tee', 'basic womens tee'],
  },
  {
    name: 'V-Neck T-Shirts',
    slug: 'v-neck-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    expectedFilename: 'tshirts/v-neck-tshirts.jpg',
    description:
      'Flattering clean V-neck cotton jersey women’s T-shirts offering breathable ease and smart casual drape.',
    keywords: ['v-neck t-shirt', 'vneck tee', 'womens v-neck'],
  },
  {
    name: 'Polo T-Shirts',
    slug: 'polo-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    expectedFilename: 'tshirts/polo-tshirts.jpg',
    description:
      'Crisp cotton pique women’s polo T-shirts tailored with neat collars and buttoned plackets for sporty refinement.',
    keywords: ['polo t-shirt', 'collared t-shirt', 'womens polo'],
  },
  {
    name: 'Oversized T-Shirts',
    slug: 'oversized-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    expectedFilename: 'tshirts/oversized-tshirts.jpg',
    description:
      'Drop-shoulder boxy oversized women’s T-shirts in heavyweight jersey for effortless off-duty street style.',
    keywords: ['oversized t-shirt', 'boyfriend tee', 'baggy t-shirt'],
  },
  {
    name: 'Printed T-Shirts',
    slug: 'printed-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    expectedFilename: 'tshirts/printed-tshirts.jpg',
    description:
      'All-over botanical and pastel chest-printed women’s cotton T-shirts bringing fresh character to casual looks.',
    keywords: ['printed t-shirt', 'floral tee', 'print t-shirt'],
  },
  {
    name: 'Graphic T-Shirts',
    slug: 'graphic-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    expectedFilename: 'tshirts/graphic-tshirts.jpg',
    description:
      'Statement typographic and illustrated graphic women’s T-shirts printed with crisp fade-resistant inks.',
    keywords: ['graphic t-shirt', 'graphic tee', 'illustration tee'],
  },
  {
    name: 'Full Sleeve T-Shirts',
    slug: 'full-sleeve-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    expectedFilename: 'tshirts/full-sleeve-tshirts.jpg',
    description:
      'Soft long-sleeve cotton women’s T-shirts ideal for air-conditioned workspaces, travel, and cool evenings.',
    keywords: ['full sleeve t-shirt', 'long sleeve tee', 'womens full sleeve'],
  },
  {
    name: 'Crop T-Shirts',
    slug: 'crop-tshirts',
    parentCategory: 'T-Shirts',
    parentSlug: 't-shirts',
    expectedFilename: 'tshirts/crop-tshirts.jpg',
    description:
      'Boxy and fitted cotton crop T-shirts hitting right at the high waistline for effortless casual styling.',
    keywords: ['crop t-shirt', 'cropped tee', 'short t-shirt'],
  },
];

export const INITIAL_WOMENS_FASHION_COLLECTIONS: WomensFashionCollection[] =
  RAW_WOMENS_COLLECTIONS.map((item, idx) => ({
    id: `wf-${item.parentSlug}-${item.slug}`,
    name: item.name,
    slug: item.slug,
    parentCategory: item.parentCategory,
    parentSlug: item.parentSlug,
    parentSubcategory: "Women's Fashion",
    image: item.image || '',
    expectedFilename: item.expectedFilename,
    imageStatus: item.image ? 'generated' : 'quota_pending',
    description: item.description,
    keywords: item.keywords,
    status: 'approved',
    approved: true,
    displayOrder: idx + 1,
  }));

export function mergeWomensFashionCollections(
  persisted: Partial<WomensFashionCollection>[] = []
): WomensFashionCollection[] {
  const persistedById = new Map<string, Partial<WomensFashionCollection>>();
  for (const item of Array.isArray(persisted) ? persisted : []) {
    if (item && item.id) {
      persistedById.set(item.id.toLowerCase(), item);
    }
  }

  return INITIAL_WOMENS_FASHION_COLLECTIONS.map((seed) => {
    // Only merge records whose ID matches the current 78-item collection taxonomy
    const existing = persistedById.get(seed.id.toLowerCase());
    if (!existing) return seed;

    const status =
      existing.status === 'pending_approval' || existing.approved === false
        ? 'pending_approval'
        : 'approved';
    const rawExistingImage =
      typeof existing.image === 'string' && existing.image.trim()
        ? existing.image.trim()
        : '';
    const normalizedExistingImage = rawExistingImage.startsWith('/images/womens-fashion/')
      ? rawExistingImage.replace(/\.webp$/i, '.jpg')
      : rawExistingImage;
    const nextImage = normalizedExistingImage || seed.image;
    const nextImageStatus = !nextImage
      ? 'quota_pending'
      : nextImage.startsWith('/uploads/')
        ? 'uploaded'
        : 'generated';

    return {
      ...seed,
      ...existing,
      id: seed.id,
      slug: seed.slug,
      parentCategory: seed.parentCategory,
      parentSlug: seed.parentSlug,
      parentSubcategory: "Women's Fashion",
      expectedFilename: seed.expectedFilename,
      name:
        typeof existing.name === 'string' && existing.name.trim()
          ? existing.name.trim()
          : seed.name,
      description:
        typeof existing.description === 'string' && existing.description.trim()
          ? existing.description.trim()
          : seed.description,
      image: nextImage,
      imageStatus: nextImageStatus,
      keywords:
        Array.isArray(existing.keywords) && existing.keywords.length > 0
          ? existing.keywords
          : seed.keywords,
      status,
      approved: status === 'approved',
      displayOrder: seed.displayOrder,
    };
  });
}

export function getWomensFashionCollectionPath(
  col: Pick<WomensFashionCollection, 'parentSlug' | 'slug'>
): string {
  return `/fashion/womens-fashion/${col.parentSlug}/${col.slug}`;
}

export function findWomensFashionParentBySlug(
  slugOrName?: string
): WomensFashionParentGroup | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;
  return WOMENS_FASHION_PARENT_CATEGORIES.find(
    (p) =>
      p.slug === clean ||
      p.folder === clean ||
      p.name.toLowerCase() === clean
  );
}

export function findWomensFashionCollection(
  collections: WomensFashionCollection[],
  slugOrName?: string,
  parentSlugOrName?: string
): WomensFashionCollection | undefined {
  const clean = (slugOrName || '').toLowerCase().trim();
  if (!clean) return undefined;
  const parentClean = (parentSlugOrName || '').toLowerCase().trim();
  const pool = parentClean
    ? collections.filter(
        (c) =>
          c.parentSlug.toLowerCase() === parentClean ||
          c.parentCategory.toLowerCase() === parentClean
      )
    : collections;
  const searchPool = pool.length > 0 ? pool : collections;

  return searchPool.find(
    (c) =>
      c.slug.toLowerCase() === clean ||
      c.id.toLowerCase() === clean ||
      c.id.toLowerCase() === `wf-${clean}` ||
      c.name.toLowerCase() === clean
  );
}

export function productMatchesWomensFashionCollection(
  product: Product,
  collection: WomensFashionCollection
): boolean {
  if ((product.category || '').toLowerCase().trim() !== 'fashion') {
    return false;
  }
  const subLower = (product.subcategory || '').toLowerCase().trim();
  if (
    subLower !== "women's fashion" &&
    subLower !== 'women' &&
    subLower !== 'womens-fashion'
  ) {
    return false;
  }

  const subSubLower = (product.subSubcategory || '').toLowerCase().trim();
  const parentLower = collection.parentCategory.toLowerCase();
  const colNameLower = collection.name.toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase().trim());

  // Direct sub-type tag / subSubcategory match
  if (
    subSubLower === colNameLower ||
    subSubLower === collection.slug ||
    tags.includes(colNameLower) ||
    tags.includes(collection.slug) ||
    tags.includes(collection.id)
  ) {
    return true;
  }

  // Must share the parent Women's Fashion group if subSubcategory is specified
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
