export interface UploadedProductImage {
  id: string;
  name: string;
  category: 'Rice' | 'Grocery' | 'Honey' | 'Watches';
  subcategory: string;
  filename: string;
  src: string;
  label: string;
  description: string;
  unit: string;
  price: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  slug: string;
  targetPath: string;
}

export const UPLOADED_PRODUCT_IMAGES: Record<string, UploadedProductImage> = {
  rice: {
    id: 'prod-rice-grains-sack',
    name: 'Royal Aged Basmati Rice & Grain Sack',
    category: 'Rice',
    subcategory: 'Basmati Rice',
    filename: 'Rice.jpg',
    src: '/images/products/Rice.jpg',
    label: 'Aromatic Aged Rice',
    description:
      'Long-grain, naturally aged white rice grains poured from a traditional rustic jute sack with wooden measuring scoop.',
    unit: '5 kg Sack',
    price: 890,
    discountPercent: 10,
    rating: 4.9,
    reviewsCount: 142,
    slug: 'royal-aged-basmati-rice-5kg',
    targetPath: '/rice',
  },
  cardamom: {
    id: 'prod-green-cardamom-elaka',
    name: 'Idukki Bold Green Cardamom (Elaka)',
    category: 'Grocery',
    subcategory: 'Spices and Masalas',
    filename: 'elaka.jpg',
    src: '/images/products/elaka.jpg',
    label: 'Green Cardamom (Elaka)',
    description:
      'Handpicked bold whole green cardamom pods with intense camphor-citrus aroma, harvested from high-elevation Kerala hills.',
    unit: '100 g',
    price: 560,
    discountPercent: 0,
    rating: 4.8,
    reviewsCount: 96,
    slug: 'idukki-bold-green-cardamom-pods',
    targetPath: '/grocery',
  },
  cloves: {
    id: 'prod-whole-cloves-lavangam',
    name: 'Zanzibar Grade A Whole Cloves (Lavangam)',
    category: 'Grocery',
    subcategory: 'Spices and Masalas',
    filename: 'lavangam.png',
    src: '/images/products/lavangam.png',
    label: 'Whole Cloves (Lavangam)',
    description:
      'Sun-dried aromatic whole cloves with intact crown heads, packed with rich essential eugenol oils for biryanis and masalas.',
    unit: '100 g',
    price: 240,
    discountPercent: 5,
    rating: 4.9,
    reviewsCount: 84,
    slug: 'whole-cloves-lavangam-100g',
    targetPath: '/grocery',
  },
  cinnamon: {
    id: 'prod-cinnamon-star-anise-patai',
    name: 'Ceylon Cinnamon Rolls & Star Anise (Patai)',
    category: 'Grocery',
    subcategory: 'Spices and Masalas',
    filename: 'patai.jpg',
    src: '/images/products/patai.jpg',
    label: 'Cinnamon & Star Anise (Patai)',
    description:
      'Fragrant true Ceylon cinnamon bark quills paired with whole star anise pods and peppercorns for rich garam masala notes.',
    unit: '150 g',
    price: 280,
    discountPercent: 8,
    rating: 4.8,
    reviewsCount: 110,
    slug: 'cinnamon-star-anise-patai-150g',
    targetPath: '/grocery',
  },
  cumin: {
    id: 'prod-cumin-seeds-seeragam',
    name: 'Unpolished Cumin Seeds (Seeragam)',
    category: 'Grocery',
    subcategory: 'Spices and Masalas',
    filename: 'seeragam.jpg',
    src: '/images/products/seeragam.jpg',
    label: 'Cumin Seeds (Seeragam)',
    description:
      'Pure earthy whole cumin seeds with warm peppery flavor and high essential oils for daily tempering, rasam, and jeera rice.',
    unit: '250 g',
    price: 210,
    discountPercent: 0,
    rating: 4.7,
    reviewsCount: 128,
    slug: 'unpolished-cumin-seeds-seeragam-250g',
    targetPath: '/grocery',
  },
  honey: {
    id: 'prod-pure-honey-jar',
    name: 'Nilgiri Wild Forest Raw Honey',
    category: 'Honey',
    subcategory: 'Forest Honey',
    filename: 'honey.jpg',
    src: '/images/products/honey.jpg',
    label: 'Wild Forest Raw Honey',
    description:
      'Pure golden amber honey dripping fresh from a wooden dipper into a faceted ribbed glass jar with golden honeycomb clusters.',
    unit: '500 g Glass Jar',
    price: 549,
    discountPercent: 12,
    rating: 4.9,
    reviewsCount: 210,
    slug: 'nilgiri-wild-forest-raw-honey',
    targetPath: '/honey',
  },
  watches: {
    id: 'prod-luxury-skeleton-watch',
    name: 'Kaveri Sovereign Skeleton Automatic Watch',
    category: 'Watches',
    subcategory: 'Analog Watches',
    filename: 'watches.png',
    src: '/images/products/watches.png',
    label: 'Luxury Skeleton Timepiece',
    description:
      'Masterpiece skeleton mechanical movement with Roman numerals, blued hands, polished gold-toned case, and stitched leather strap.',
    unit: '42mm Case / Genuine Leather',
    price: 8900,
    discountPercent: 15,
    rating: 4.9,
    reviewsCount: 78,
    slug: 'kaveri-sovereign-maroon-automatic',
    targetPath: '/watches',
  },
};

export const ORBITAL_HERO_ITEMS = [
  UPLOADED_PRODUCT_IMAGES.rice,
  UPLOADED_PRODUCT_IMAGES.cardamom,
  UPLOADED_PRODUCT_IMAGES.honey,
  UPLOADED_PRODUCT_IMAGES.cloves,
  UPLOADED_PRODUCT_IMAGES.watches,
  UPLOADED_PRODUCT_IMAGES.cinnamon,
  UPLOADED_PRODUCT_IMAGES.cumin,
];

export const SPICE_COLLECTION_ITEMS = [
  UPLOADED_PRODUCT_IMAGES.cardamom,
  UPLOADED_PRODUCT_IMAGES.cloves,
  UPLOADED_PRODUCT_IMAGES.cinnamon,
  UPLOADED_PRODUCT_IMAGES.cumin,
];
