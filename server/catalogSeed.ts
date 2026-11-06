import type { CategoryInfo, Product, ModelPreset } from '../src/types';

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  {
    id: 'Rice',
    title: 'Quality Rice for Every Kitchen',
    subtitle: 'Aged Basmati, Ponni & Traditional',
    description:
      'Aromatic aged Basmati, everyday Ponni, Sona Masoori, Idli rice, and heritage hand-pounded varieties.',
    subcategories: [
      'Basmati Rice',
      'Ponni Rice',
      'Sona Masoori Rice',
      'Idli Rice',
      'Brown Rice',
      'Traditional Rice Varieties',
    ],
    modelType: 'rice',
    accentColor: '#6B1D2F',
    itemCount: 12,
  },
  {
    id: 'Grocery',
    title: 'Your Everyday Kitchen, Made Easy',
    subtitle: 'Dals, Cold-Pressed Oils & Spices',
    description:
      'Unpolished pulses and dal, cold-pressed cooking oils, whole spices and masalas, flours, and pantry staples.',
    subcategories: [
      'Pulses and Dal',
      'Cooking Oils',
      'Spices and Masalas',
      'Sugar and Salt',
      'Flour and Grains',
      'Snacks and Beverages',
    ],
    modelType: 'grocery',
    accentColor: '#B88628',
    itemCount: 12,
  },
  {
    id: 'Honey',
    title: 'Discover the Golden Goodness of Honey',
    subtitle: 'Forest, Wildflower & Multiflora',
    description:
      'Golden forest honey, wildflower harvests, multiflora, and tulsi-infused honey in clear glass jars.',
    subcategories: [
      'Forest Honey',
      'Wildflower Honey',
      'Multiflora Honey',
      'Acacia & Neem Honey',
    ],
    modelType: 'honey',
    accentColor: '#D98218',
    itemCount: 12,
  },
  {
    id: 'Watches',
    title: 'Timepieces That Make Every Moment Count',
    subtitle: 'Analog, Automatic & Smart',
    description:
      'Heritage mechanical automatics, classic analog dress watches, digital chronographs, and smart timepieces.',
    subcategories: [
      "Men's Watches",
      "Women's Watches",
      'Analog Watches',
      'Digital Watches',
      'Smart Watches',
      'Premium Collections',
    ],
    modelType: 'watch',
    accentColor: '#6B1D2F',
    itemCount: 12,
  },
];

interface SeedTemplate {
  name: string;
  subcategory: string;
  brand: string;
  price: number;
  discountPercent: number;
  shortDescription: string;
  tag?: string;
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  has3DModel?: boolean;
}

const CATEGORY_TEMPLATES: Record<
  string,
  {
    image: string;
    modelType: ModelPreset;
    variantType: 'weight' | 'jar' | 'watch';
    items: SeedTemplate[];
  }
> = {
  Rice: {
    image: '/src/assets/images/product_rice_basmati_1793935955754.jpg',
    modelType: 'rice',
    variantType: 'weight',
    items: [
      {
        name: 'Royal Aged Basmati Rice 5kg',
        subcategory: 'Basmati Rice',
        brand: 'Kaveri Harvest',
        price: 890,
        discountPercent: 10,
        shortDescription:
          '24-month aged extra-long slender Basmati grains with delicate aroma and fluffy separation.',
        tag: 'Bestseller',
        featured: true,
        trending: true,
        bestSeller: true,
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Thanjavur Boiled Ponni Rice',
        subcategory: 'Ponni Rice',
        brand: 'Kaveri Harvest',
        price: 460,
        discountPercent: 0,
        shortDescription:
          'Classic South Indian parboiled Ponni rice ideal for everyday meals and sambar rice.',
        featured: true,
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Kurnool Steam Sona Masoori Rice',
        subcategory: 'Sona Masoori Rice',
        brand: 'Deccan Fields',
        price: 420,
        discountPercent: 5,
        shortDescription:
          'Lightweight, medium-grain Sona Masoori milled for soft daily steamed rice and pongal.',
        trending: true,
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Salem Special Idli & Dosa Rice',
        subcategory: 'Idli Rice',
        brand: 'Kaveri Harvest',
        price: 380,
        discountPercent: 0,
        shortDescription:
          'Short, plump parboiled grains selected for high-fermentation soft idlis and crisp dosas.',
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Whole-Grain Unpolished Brown Rice',
        subcategory: 'Brown Rice',
        brand: 'Deccan Fields',
        price: 510,
        discountPercent: 10,
        shortDescription:
          'Bran-intact whole-grain rice with nutty texture and natural dietary fiber.',
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Mapillai Samba Traditional Red Rice',
        subcategory: 'Traditional Rice Varieties',
        brand: 'Heritage Grains',
        price: 640,
        discountPercent: 0,
        shortDescription:
          'Heirloom Tamil red rice variety prized for its earthy flavor and hearty grain structure.',
        featured: true,
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Karuppu Kavuni Black Heritage Rice',
        subcategory: 'Traditional Rice Varieties',
        brand: 'Heritage Grains',
        price: 720,
        discountPercent: 12,
        shortDescription:
          'Traditional Chettinad black rice with rich color and aromatic pudding texture.',
        trending: true,
        has3DModel: true,
      },
      {
        name: 'Seeraga Samba Biryani Rice',
        subcategory: 'Traditional Rice Varieties',
        brand: 'Kaveri Harvest',
        price: 690,
        discountPercent: 0,
        shortDescription:
          'Tiny, fragrant jewel-like grains traditional to Dindigul and Ambur biryanis.',
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Dehraduni Classic Long-Grain Basmati',
        subcategory: 'Basmati Rice',
        brand: 'Himalayan Mill',
        price: 940,
        discountPercent: 15,
        shortDescription:
          'Foothill-grown aromatic Basmati known for elongation and sweet floral notes.',
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Raw White Ponni Pacharisi',
        subcategory: 'Ponni Rice',
        brand: 'Kaveri Harvest',
        price: 440,
        discountPercent: 0,
        shortDescription:
          'Unboiled raw Ponni rice suited for curd rice, lemon rice, and festive payasam.',
        has3DModel: false,
      },
      {
        name: 'Hand-Pounded Brown Sona Masoori',
        subcategory: 'Brown Rice',
        brand: 'Deccan Fields',
        price: 495,
        discountPercent: 0,
        shortDescription:
          'Minimally milled brown Sona Masoori retaining natural germ and bran.',
        has3DModel: false,
      },
      {
        name: 'Poongar Traditional Red Rice',
        subcategory: 'Traditional Rice Varieties',
        brand: 'Heritage Grains',
        price: 610,
        discountPercent: 0,
        shortDescription:
          'Rain-fed heirloom red rice variety from southern Tamil Nadu.',
        has3DModel: false,
      },
    ],
  },
  Grocery: {
    image: '/src/assets/images/product_grocery_spices_1793935955305.jpg',
    modelType: 'grocery',
    variantType: 'weight',
    items: [
      {
        name: 'Cold-Pressed Gingelly Sesame Oil',
        subcategory: 'Cooking Oils',
        brand: 'Vagai Chekku',
        price: 480,
        discountPercent: 10,
        shortDescription:
          'Traditional wood-pressed sesame oil with rich nutty aroma for everyday cooking.',
        tag: 'Wood-Pressed',
        featured: true,
        trending: true,
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Unpolished Farm Toor Dal',
        subcategory: 'Pulses and Dal',
        brand: 'Kaveri Pantry',
        price: 240,
        discountPercent: 0,
        shortDescription:
          'Naturally dried, stone-sorted pigeon peas without artificial polish or oil glazing.',
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Erode Salem Haldi Turmeric Powder',
        subcategory: 'Spices and Masalas',
        brand: 'Spice Route',
        price: 195,
        discountPercent: 10,
        shortDescription:
          'Single-origin Erode turmeric fingers stone-ground for vibrant golden color.',
        trending: true,
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Idukki Bold Green Cardamom Pods',
        subcategory: 'Spices and Masalas',
        brand: 'Spice Route',
        price: 560,
        discountPercent: 0,
        shortDescription:
          '8mm+ bold green cardamom pods harvested from high-altitude Kerala estates.',
        featured: true,
        has3DModel: true,
      },
      {
        name: 'Wood-Pressed Groundnut Cooking Oil',
        subcategory: 'Cooking Oils',
        brand: 'Vagai Chekku',
        price: 430,
        discountPercent: 5,
        shortDescription:
          'Cold-extracted peanut oil with high smoke point for sautéing and frying.',
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Whole Black Urad Dal (Gota)',
        subcategory: 'Pulses and Dal',
        brand: 'Kaveri Pantry',
        price: 260,
        discountPercent: 0,
        shortDescription:
          'Creamy-textured whole urad dal for velvety idli batter and dal makhani.',
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Cane Jaggery Powder (Naatu Sakkarai)',
        subcategory: 'Sugar and Salt',
        brand: 'Kaveri Pantry',
        price: 165,
        discountPercent: 0,
        shortDescription:
          'Unrefined traditional cane jaggery powder with warm caramel notes.',
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Chakki Fresh Whole Wheat Atta',
        subcategory: 'Flour and Grains',
        brand: 'Kaveri Pantry',
        price: 310,
        discountPercent: 10,
        shortDescription:
          'Stone-milled MP Sharbati wheat flour for soft, puffed phulkas and rotis.',
        trending: true,
        has3DModel: true,
      },
      {
        name: 'Nilgiri Orthodox Pekoe Black Tea',
        subcategory: 'Snacks and Beverages',
        brand: 'Nilgiri Leaf',
        price: 340,
        discountPercent: 0,
        shortDescription:
          'Fragrant whole-leaf black tea from high-elevation Nilgiri gardens.',
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Thoothukudi Natural Crystal Sea Salt',
        subcategory: 'Sugar and Salt',
        brand: 'Kaveri Pantry',
        price: 85,
        discountPercent: 0,
        shortDescription:
          'Sun-evaporated coastal crystal salt for traditional pickling and cooking.',
        has3DModel: false,
      },
      {
        name: 'Sprouted Ragi Finger Millet Flour',
        subcategory: 'Flour and Grains',
        brand: 'Deccan Fields',
        price: 210,
        discountPercent: 0,
        shortDescription:
          'Malted and stone-ground finger millet flour for porridge and dosas.',
        has3DModel: false,
      },
      {
        name: 'Filter Coffee Chicory Blend (80:20)',
        subcategory: 'Snacks and Beverages',
        brand: 'Nilgiri Leaf',
        price: 390,
        discountPercent: 15,
        shortDescription:
          'Medium-dark roasted Chikmagalur Arabica blended with 20% roasted chicory.',
        featured: true,
        has3DModel: false,
      },
    ],
  },
  Honey: {
    image: '/src/assets/images/product_honey_forest_1793935955585.jpg',
    modelType: 'honey',
    variantType: 'jar',
    items: [
      {
        name: 'Nilgiri Wild Forest Raw Honey',
        subcategory: 'Forest Honey',
        brand: 'Satyamangalam Apiary',
        price: 650,
        discountPercent: 10,
        shortDescription:
          'Rich dark-amber forest honey harvested from Nilgiri biosphere flora in clear glass.',
        tag: 'Flagship',
        featured: true,
        trending: true,
        bestSeller: true,
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Western Ghats Wildflower Honey',
        subcategory: 'Wildflower Honey',
        brand: 'Satyamangalam Apiary',
        price: 540,
        discountPercent: 0,
        shortDescription:
          'Floral, golden-hued honey collected from seasonal mountain blossoms.',
        featured: true,
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Himalayan Multiflora Valley Honey',
        subcategory: 'Multiflora Honey',
        brand: 'Himalayan Apiary',
        price: 590,
        discountPercent: 12,
        shortDescription:
          'Smooth, light-amber multiflora honey with delicate orchard blossom notes.',
        trending: true,
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Kashmir White Acacia Blossom Honey',
        subcategory: 'Acacia & Neem Honey',
        brand: 'Himalayan Apiary',
        price: 780,
        discountPercent: 0,
        shortDescription:
          'Pale, slow-crystallizing acacia honey prized for its mild, clean sweetness.',
        featured: true,
        has3DModel: true,
      },
      {
        name: 'Neem Blossom Amber Honey',
        subcategory: 'Acacia & Neem Honey',
        brand: 'Satyamangalam Apiary',
        price: 520,
        discountPercent: 0,
        shortDescription:
          'Distinctive bittersweet-amber honey gathered during spring neem flowering.',
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Coorg Coffee Blossom Honey',
        subcategory: 'Wildflower Honey',
        brand: 'Satyamangalam Apiary',
        price: 560,
        discountPercent: 10,
        shortDescription:
          'Aromatic honey with subtle roasted-caramel undertones from Kodagu coffee estates.',
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Sundarbans Mangrove Forest Honey',
        subcategory: 'Forest Honey',
        brand: 'Delta Harvest',
        price: 690,
        discountPercent: 0,
        shortDescription:
          'Deep, complex estuarine forest honey with brisk mineral finish.',
        trending: true,
        has3DModel: true,
      },
      {
        name: 'Jamun Blossom Dark Honey',
        subcategory: 'Wildflower Honey',
        brand: 'Satyamangalam Apiary',
        price: 620,
        discountPercent: 0,
        shortDescription:
          'Velvety dark honey harvested during the summer jamun tree bloom.',
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Litchi Orchard Spring Honey',
        subcategory: 'Multiflora Honey',
        brand: 'Himalayan Apiary',
        price: 490,
        discountPercent: 15,
        shortDescription:
          'Fruity, fragrant light-gold honey from northern litchi orchards.',
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Eucalyptus & Hill Flora Honey',
        subcategory: 'Forest Honey',
        brand: 'Satyamangalam Apiary',
        price: 510,
        discountPercent: 0,
        shortDescription:
          'Crisp, herbal-amber honey from high-altitude eucalyptus groves.',
        has3DModel: false,
      },
      {
        name: 'Mustard Field Golden Honey',
        subcategory: 'Multiflora Honey',
        brand: 'Himalayan Apiary',
        price: 440,
        discountPercent: 0,
        shortDescription:
          'Naturally creamy, rapid-crystallizing golden honey from winter mustard fields.',
        has3DModel: false,
      },
      {
        name: 'Ajwain & Wild Herb Honey',
        subcategory: 'Acacia & Neem Honey',
        brand: 'Delta Harvest',
        price: 575,
        discountPercent: 0,
        shortDescription:
          'Warm, spiced-aroma honey gathered from wild ajwain blossoms.',
        has3DModel: false,
      },
    ],
  },
  Watches: {
    image: '/src/assets/images/product_watch_chronograph_1793935956352.jpg',
    modelType: 'watch',
    variantType: 'watch',
    items: [
      {
        name: 'Kaveri Sovereign Maroon Automatic',
        subcategory: 'Premium Collections',
        brand: 'Kaveri Horology',
        price: 14990,
        discountPercent: 10,
        shortDescription:
          'Brushed gold-tone 40mm case with deep maroon sunburst dial and sapphire crystal.',
        tag: 'Flagship',
        featured: true,
        trending: true,
        bestSeller: true,
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Madurai Heritage Gold Dress Analog',
        subcategory: "Men's Watches",
        brand: 'Kaveri Horology',
        price: 8490,
        discountPercent: 0,
        shortDescription:
          'Slim 8.5mm gold-plated dress watch with Roman indices and alligator-grain strap.',
        featured: true,
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Kanchipuram Rose-Gold Petite Analog',
        subcategory: "Women's Watches",
        brand: 'Kaveri Horology',
        price: 7990,
        discountPercent: 12,
        shortDescription:
          '32mm rose-gold case with mother-of-pearl dial and Milanese mesh bracelet.',
        trending: true,
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Deccan Chronograph Tachymeter 42',
        subcategory: 'Analog Watches',
        brand: 'Deccan Time',
        price: 11200,
        discountPercent: 0,
        shortDescription:
          'Three-register chronograph with tachymeter bezel and 100m water resistance.',
        featured: true,
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Vayu AMOLED Titanium Smart Watch',
        subcategory: 'Smart Watches',
        brand: 'Vayu Tech',
        price: 12500,
        discountPercent: 15,
        shortDescription:
          '1.43-inch always-on AMOLED display, dual-band GPS, and 14-day battery life.',
        trending: true,
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'ChronoPulse Retro Digital Steel',
        subcategory: 'Digital Watches',
        brand: 'Deccan Time',
        price: 4290,
        discountPercent: 0,
        shortDescription:
          'Brushed stainless steel digital timepiece with EL backlight and 1/100s stopwatch.',
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Thanjavur Moonphase Calendar',
        subcategory: 'Premium Collections',
        brand: 'Kaveri Horology',
        price: 18500,
        discountPercent: 0,
        shortDescription:
          'Cream guilloché dial with astronomical moonphase complication and exhibition back.',
        featured: true,
        has3DModel: true,
      },
      {
        name: 'Nila Emerald & Gold Women’s Bangle Watch',
        subcategory: "Women's Watches",
        brand: 'Kaveri Horology',
        price: 9200,
        discountPercent: 10,
        shortDescription:
          'Sculpted gold-tone bangle watch with emerald-green dial and sapphire glass.',
        newArrival: true,
        has3DModel: true,
      },
      {
        name: 'Surya Solar-Powered Field Analog',
        subcategory: "Men's Watches",
        brand: 'Deccan Time',
        price: 6800,
        discountPercent: 0,
        shortDescription:
          '6-month solar power reserve in a sandblasted steel case with canvas strap.',
        bestSeller: true,
        has3DModel: true,
      },
      {
        name: 'Vayu Active Lite Smart Fitness Watch',
        subcategory: 'Smart Watches',
        brand: 'Vayu Tech',
        price: 6490,
        discountPercent: 0,
        shortDescription:
          'Featherweight 32g aluminum smart watch with SpO2, sleep, and workout tracking.',
        has3DModel: false,
      },
      {
        name: 'Classic Ivory Dial Leather Analog',
        subcategory: 'Analog Watches',
        brand: 'Kaveri Horology',
        price: 5490,
        discountPercent: 0,
        shortDescription:
          'Minimalist warm-ivory dial with blued steel hands and vegetable-tanned strap.',
        has3DModel: false,
      },
      {
        name: 'Apex Dual-Time World Digital',
        subcategory: 'Digital Watches',
        brand: 'Deccan Time',
        price: 4890,
        discountPercent: 10,
        shortDescription:
          '31-time-zone world clock with resin-steel hybrid bezel and 5-alarm memory.',
        has3DModel: false,
      },
    ],
  },
};

export function generate48Products(): Product[] {
  const now = new Date().toISOString();
  const all: Product[] = [];
  let counter = 1;

  for (const [category, config] of Object.entries(CATEGORY_TEMPLATES)) {
    for (const item of config.items) {
      const id = `prod-${String(counter).padStart(2, '0')}`;
      const slug = item.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const originalPrice =
        item.discountPercent > 0
          ? Math.round(item.price / (1 - item.discountPercent / 100))
          : undefined;

      const variants =
        config.variantType === 'weight'
          ? [
              {
                id: `${id}-v1`,
                name: '1 kg Pack',
                colorHex: '#6B1D2F',
                size: '1 kg',
                priceDelta: 0,
                stock: 25,
              },
              {
                id: `${id}-v2`,
                name: '5 kg Family Pack',
                colorHex: '#B88628',
                size: '5 kg',
                priceDelta: Math.round(item.price * 3.6),
                stock: 14,
              },
              {
                id: `${id}-v3`,
                name: '10 kg Heritage Sack',
                colorHex: '#4A2518',
                size: '10 kg',
                priceDelta: Math.round(item.price * 7.8),
                stock: 8,
              },
            ]
          : config.variantType === 'jar'
          ? [
              {
                id: `${id}-v1`,
                name: '250 g Glass Jar',
                colorHex: '#D98218',
                size: '250 g',
                priceDelta: 0,
                stock: 22,
              },
              {
                id: `${id}-v2`,
                name: '500 g Glass Jar',
                colorHex: '#B88628',
                size: '500 g',
                priceDelta: Math.round(item.price * 0.85),
                stock: 16,
              },
              {
                id: `${id}-v3`,
                name: '1 kg Reserve Jar',
                colorHex: '#6B1D2F',
                size: '1 kg',
                priceDelta: Math.round(item.price * 1.7),
                stock: 9,
              },
            ]
          : [
              {
                id: `${id}-v1`,
                name: 'Royal Maroon / Gold',
                colorHex: '#6B1D2F',
                size: '40 mm',
                priceDelta: 0,
                stock: 15,
              },
              {
                id: `${id}-v2`,
                name: 'Heritage Gold / Ivory',
                colorHex: '#B88628',
                size: '40 mm',
                priceDelta: 500,
                stock: 10,
              },
              {
                id: `${id}-v3`,
                name: 'Espresso Leather / Gold',
                colorHex: '#4A2518',
                size: '42 mm',
                priceDelta: 300,
                stock: 7,
              },
            ];

      all.push({
        id,
        name: item.name,
        slug,
        category,
        subcategory: item.subcategory,
        brand: item.brand,
        price: item.price,
        originalPrice,
        discountPercent: item.discountPercent,
        shortDescription: item.shortDescription,
        description: `${item.shortDescription} Curated by ${item.brand} for the Kaveri Emporium ${category} (${item.subcategory}) collection.`,
        images: [config.image],
        modelType: config.modelType,
        has3DModel: item.has3DModel ?? true,
        variants,
        specs: [
          { label: 'Brand', value: item.brand },
          { label: 'Category', value: `${category} · ${item.subcategory}` },
          {
            label: '3D Inspection',
            value: item.has3DModel ? 'Interactive 360°' : '2D Studio Gallery',
          },
          { label: 'Packaging', value: 'Sealed Retail Grade' },
        ],
        stock: 42,
        rating: Number((4.7 + (counter % 6) * 0.05).toFixed(2)),
        reviewCount: 18 + counter * 2,
        isDemoRating: true,
        featured: Boolean(item.featured),
        trending: Boolean(item.trending),
        bestSeller: Boolean(item.bestSeller),
        newArrival: Boolean(item.newArrival),
        tag: item.tag,
        createdAt: now,
      });
      counter++;
    }
  }

  return all;
}
