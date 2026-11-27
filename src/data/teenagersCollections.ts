import type {
  Product,
  TeenagersCollection,
  TeenagersGroupName,
} from '../types';

export interface TeenagersGroupMeta {
  name: TeenagersGroupName;
  slug: string;
  folder: string;
  description: string;
}

export const TEENAGERS_GROUPS: TeenagersGroupMeta[] = [
  {
    name: "Teenage Boys' Fashion",
    slug: 'boys-fashion',
    folder: 'boys-fashion',
    description:
      "Graphic and casual crew-neck tees, button-down shirts, slim jeans, utility cargo pants, pullover hoodies, summer shorts, and fleece joggers tailored for teenage boys.",
  },
  {
    name: "Teenage Girls' Fashion",
    slug: 'girls-fashion',
    folder: 'girls-fashion',
    description:
      "Everyday cropped and casual tops, relaxed graphic t-shirts, denim jeans, pleated and denim skirts, casual day dresses, stretch leggings, and oversized hoodies for teenage girls.",
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    folder: 'footwear',
    description:
      'Street-style teenage sneakers, uniform school shoes, comfortable everyday sandals, cushioned home slides and slippers, and breathable sports running shoes.',
  },
  {
    name: 'School & College Essentials',
    slug: 'school-essentials',
    folder: 'school-essentials',
    description:
      'Campus-ready backpacks, ruled and grid notebooks, smooth gel and ballpoint pens, zippered pencil pouches, compartmentalized lunch boxes, reusable water bottles, and geometry instrument sets.',
  },
  {
    name: 'Electronics & Gadgets',
    slug: 'electronics-gadgets',
    folder: 'electronics-gadgets',
    description:
      'Over-ear wireless headphones, compact Bluetooth earbuds, fitness smartwatches, portable wireless speakers, protective shockproof phone cases, and fast-charge power banks.',
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    folder: 'personal-care',
    description:
      'Gentle daily facial cleansers, lightweight oil-free moisturizers, broad-spectrum sunscreen, hydrating lip balm, mild hair shampoo, nourishing conditioner, and fresh roll-on or spray deodorant.',
  },
  {
    name: 'Fashion Accessories',
    slug: 'fashion-accessories',
    folder: 'fashion-accessories',
    description:
      'Minimalist wristwatches, UV-protective sunglasses, adjustable baseball caps, casual belts, slim bi-fold and zip wallets, snap hair clips, and fabric scrunchies.',
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    folder: 'sports-fitness',
    description:
      'Outdoor match footballs, willow cricket bats, lightweight badminton rackets, textured grip basketballs, tangle-free skipping ropes, and cushioned exercise yoga mats.',
  },
  {
    name: 'Room & Lifestyle',
    slug: 'room-lifestyle',
    folder: 'room-lifestyle',
    description:
      'Adjustable LED study desk lamps, bedside alarm clocks, modular pen and tablet desk organizers, aesthetic wall art decor, plush throw cushions, and foldable closet storage boxes.',
  },
  {
    name: 'Hobbies & Creativity',
    slug: 'hobbies-creativity',
    folder: 'hobbies-creativity',
    description:
      'Spiral heavy-paper sketchbooks, vibrant blendable colour pencil sets, beginner acrylic and watercolour painting kits, dotted bullet journals, hands-on DIY craft kits, and brain-teasing puzzles.',
  },
];

const GROUP_BY_NAME = new Map<TeenagersGroupName, TeenagersGroupMeta>(
  TEENAGERS_GROUPS.map((g) => [g.name, g])
);

interface RawTeenagersSeed {
  name: string;
  slug: string;
  parentGroup: TeenagersGroupName;
  expectedFilename: string;
  image: string;
  imageStatus?: TeenagersCollection['imageStatus'];
  description: string;
  keywords: string[];
}

const RAW_TEENAGERS_COLLECTIONS: RawTeenagersSeed[] = [
  // GROUP 1 — TEENAGE BOYS' FASHION (7)
  {
    name: "Boys' T-Shirts",
    slug: 'boys-tshirts',
    parentGroup: "Teenage Boys' Fashion",
    expectedFilename: 'teenagers/boys-fashion/boys-tshirts.jpg',
    image: '/images/teenagers/boys-fashion/boys-tshirts.jpg',
    imageStatus: 'generated',
    description:
      'Breathable cotton crew-neck t-shirts with clean youthful cuts for teenage boys at school, hangouts, and weekends.',
    keywords: ["boys' t-shirts", 'teen boys tshirt', 'crew neck tee', 'teenage tee'],
  },
  {
    name: "Boys' Casual Shirts",
    slug: 'boys-casual-shirts',
    parentGroup: "Teenage Boys' Fashion",
    expectedFilename: 'teenagers/boys-fashion/boys-casual-shirts.jpg',
    image: '/images/teenagers/boys-fashion/boys-casual-shirts.jpg',
    imageStatus: 'generated',
    description:
      'Checkered, oxford, and relaxed button-down casual shirts styled for teenage boys ages 13 to 19.',
    keywords: ["boys' casual shirts", 'teen button down shirt', 'checked shirt teen'],
  },
  {
    name: "Boys' Jeans",
    slug: 'boys-jeans',
    parentGroup: "Teenage Boys' Fashion",
    expectedFilename: 'teenagers/boys-fashion/boys-jeans.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Durable slim, straight, and relaxed-fit denim jeans sized and styled for everyday teenage wear.',
    keywords: ["boys' jeans", 'teen denim jeans', 'slim fit jeans teen'],
  },
  {
    name: "Boys' Cargo Pants",
    slug: 'boys-cargo-pants',
    parentGroup: "Teenage Boys' Fashion",
    expectedFilename: 'teenagers/boys-fashion/boys-cargo-pants.jpg',
    image: '/images/teenagers/boys-fashion/boys-cargo-pants.jpg',
    imageStatus: 'generated',
    description:
      'Multi-pocket cotton twill utility cargo pants with tapered cuffs built for campus and streetwear comfort.',
    keywords: ["boys' cargo pants", 'teen utility pants', 'cargo trousers boys'],
  },
  {
    name: "Boys' Hoodies",
    slug: 'boys-hoodies',
    parentGroup: "Teenage Boys' Fashion",
    expectedFilename: 'teenagers/boys-fashion/boys-hoodies.jpg',
    image: '/images/teenagers/boys-fashion/boys-hoodies.jpg',
    imageStatus: 'generated',
    description:
      'Soft brushed fleece pullover hoodies with front kangaroo pockets and drawstring hoods for teenage boys.',
    keywords: ["boys' hoodies", 'teen fleece hoodie', 'pullover sweatshirt'],
  },
  {
    name: "Boys' Shorts",
    slug: 'boys-shorts',
    parentGroup: "Teenage Boys' Fashion",
    expectedFilename: 'teenagers/boys-fashion/boys-shorts.jpg',
    image: '/images/teenagers/boys-fashion/boys-shorts.jpg',
    imageStatus: 'generated',
    description:
      'Lightweight cotton chino and active knee-length shorts made for warm-weather outings and sports.',
    keywords: ["boys' shorts", 'teen casual shorts', 'chino shorts teen'],
  },
  {
    name: "Boys' Joggers",
    slug: 'boys-joggers',
    parentGroup: "Teenage Boys' Fashion",
    expectedFilename: 'teenagers/boys-fashion/boys-joggers.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Tapered knit joggers with elastic drawstring waistbands and ankle cuffs for daily study, travel, and workouts.',
    keywords: ["boys' joggers", 'teen track pants', 'cuffed sweatpants'],
  },

  // GROUP 2 — TEENAGE GIRLS' FASHION (7)
  {
    name: "Girls' Tops",
    slug: 'girls-tops',
    parentGroup: "Teenage Girls' Fashion",
    expectedFilename: 'teenagers/girls-fashion/girls-tops.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Trendy ribbed, puff-sleeve, and casual everyday tops tailored for teenage girls aged 13 to 19.',
    keywords: ["girls' tops", 'teen girls blouse', 'casual teen top'],
  },
  {
    name: "Girls' T-Shirts",
    slug: 'girls-tshirts',
    parentGroup: "Teenage Girls' Fashion",
    expectedFilename: 'teenagers/girls-fashion/girls-tshirts.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Relaxed and boxy-fit cotton t-shirts with soft pastel hues and modern prints for teenage girls.',
    keywords: ["girls' t-shirts", 'teen girls tee', 'oversized tee teen'],
  },
  {
    name: "Girls' Jeans",
    slug: 'girls-jeans',
    parentGroup: "Teenage Girls' Fashion",
    expectedFilename: 'teenagers/girls-fashion/girls-jeans.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'High-rise wide-leg, mom-fit, and straight-cut denim jeans crafted for teenage girls.',
    keywords: ["girls' jeans", 'teen wide leg jeans', 'mom fit denim teen'],
  },
  {
    name: "Girls' Skirts",
    slug: 'girls-skirts',
    parentGroup: "Teenage Girls' Fashion",
    expectedFilename: 'teenagers/girls-fashion/girls-skirts.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Pleated tennis, denim A-line, and casual midi skirts styled for campus and weekend outfits.',
    keywords: ["girls' skirts", 'teen pleated skirt', 'denim skirt teen'],
  },
  {
    name: "Girls' Dresses",
    slug: 'girls-dresses',
    parentGroup: "Teenage Girls' Fashion",
    expectedFilename: 'teenagers/girls-fashion/girls-dresses.jpg',
    image: '/images/products/teenagers/teen-casual-dress.webp',
    imageStatus: 'generated',
    description:
      'Breezy casual sundresses and flared skater dresses designed for teenage outings and weekend get-togethers.',
    keywords: ["girls' dresses", 'teen casual dress', 'skater dress teen'],
  },
  {
    name: "Girls' Leggings",
    slug: 'girls-leggings',
    parentGroup: "Teenage Girls' Fashion",
    expectedFilename: 'teenagers/girls-fashion/girls-leggings.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'High-stretch breathable cotton-blend and athleisure ankle leggings for everyday comfort and sports.',
    keywords: ["girls' leggings", 'teen active leggings', 'stretch leggings'],
  },
  {
    name: "Girls' Hoodies",
    slug: 'girls-hoodies',
    parentGroup: "Teenage Girls' Fashion",
    expectedFilename: 'teenagers/girls-fashion/girls-hoodies.jpg',
    image: '/images/products/teenagers/teen-oversized-hoodie.webp',
    imageStatus: 'generated',
    description:
      'Cozy oversized fleece hoodies with dropped shoulders and soft brushed interiors for teenage girls.',
    keywords: ["girls' hoodies", 'teen oversized hoodie', 'pastel sweatshirt'],
  },

  // GROUP 3 — FOOTWEAR (5)
  {
    name: 'Teenage Sneakers',
    slug: 'teenage-sneakers',
    parentGroup: 'Footwear',
    expectedFilename: 'teenagers/footwear/teenage-sneakers.jpg',
    image: '/images/products/teenagers/teen-street-sneakers.webp',
    imageStatus: 'generated',
    description:
      'Low-top court and street-style lace-up sneakers built with cushioned soles for everyday campus style.',
    keywords: ['teenage sneakers', 'teen street sneakers', 'casual trainers'],
  },
  {
    name: 'School Shoes',
    slug: 'school-shoes',
    parentGroup: 'Footwear',
    expectedFilename: 'teenagers/footwear/school-shoes.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Polished black lace-up and slip-on uniform school shoes made for all-day high-school comfort.',
    keywords: ['school shoes', 'teen uniform shoes', 'black school shoes'],
  },
  {
    name: 'Casual Sandals',
    slug: 'casual-sandals',
    parentGroup: 'Footwear',
    expectedFilename: 'teenagers/footwear/casual-sandals.jpg',
    image: '/images/products/footwear/mens-sport-sandals.webp',
    imageStatus: 'generated',
    description:
      'Adjustable multi-strap cushioned sandals suitable for warm-weather walks, travel, and weekend wear.',
    keywords: ['casual sandals', 'teen strap sandals', 'outdoor sandals'],
  },
  {
    name: 'Slippers',
    slug: 'slippers',
    parentGroup: 'Footwear',
    expectedFilename: 'teenagers/footwear/slippers.jpg',
    image: '/images/products/kids/kids-slippers.webp',
    imageStatus: 'generated',
    description:
      'Lightweight cushioned EVA cloud slides and casual indoor-outdoor slippers for dorms, rooms, and quick errands.',
    keywords: ['slippers', 'eva slides', 'teen slides', 'flip flops'],
  },
  {
    name: 'Sports Shoes',
    slug: 'sports-shoes',
    parentGroup: 'Footwear',
    expectedFilename: 'teenagers/footwear/sports-shoes.jpg',
    image: '/images/products/footwear/womens-running-sneakers.webp',
    imageStatus: 'generated',
    description:
      'Breathable knit-mesh running and court trainers offering responsive grip and lightweight impact cushioning.',
    keywords: ['sports shoes', 'teen running shoes', 'athletic sneakers'],
  },

  // GROUP 4 — SCHOOL & COLLEGE ESSENTIALS (7)
  {
    name: 'Backpacks',
    slug: 'backpacks',
    parentGroup: 'School & College Essentials',
    expectedFilename: 'teenagers/school-essentials/backpacks.jpg',
    image: '/images/products/teenagers/teen-college-backpack.webp',
    imageStatus: 'generated',
    description:
      'Spacious multi-compartment school and college backpacks with padded laptop sleeves and ergonomic shoulder straps.',
    keywords: ['backpacks', 'college backpack', 'high school bag', 'laptop rucksack'],
  },
  {
    name: 'Notebooks',
    slug: 'notebooks',
    parentGroup: 'School & College Essentials',
    expectedFilename: 'teenagers/school-essentials/notebooks.jpg',
    image: '/images/school-kit/note book.png',
    imageStatus: 'generated',
    description:
      'Spiral and stitched ruled, single-line, and subject notebooks for high school classes and college lecture notes.',
    keywords: ['notebooks', 'spiral notebook', 'subject notebook', 'study register'],
  },
  {
    name: 'Pens',
    slug: 'pens',
    parentGroup: 'School & College Essentials',
    expectedFilename: 'teenagers/school-essentials/pens.jpg',
    image: '/images/school-kit/pen.png',
    imageStatus: 'generated',
    description:
      'Smooth-flowing gel, rollerball, and fine-tip ballpoint pens made for clean note-taking and exams.',
    keywords: ['pens', 'gel pens', 'ballpoint pens', 'study stationery'],
  },
  {
    name: 'Pencil Pouches',
    slug: 'pencil-pouches',
    parentGroup: 'School & College Essentials',
    expectedFilename: 'teenagers/school-essentials/pencil-pouches.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Zippered canvas and structured stationery pouches sized for pens, highlighters, erasers, and calculators.',
    keywords: ['pencil pouches', 'stationery pouch', 'pen case teen'],
  },
  {
    name: 'Lunch Boxes',
    slug: 'lunch-boxes',
    parentGroup: 'School & College Essentials',
    expectedFilename: 'teenagers/school-essentials/lunch-boxes.jpg',
    image: '/images/school-kit/lunch box.png',
    imageStatus: 'generated',
    description:
      'Leak-resistant compartment lunch containers shaped to fit neatly inside school and college backpacks.',
    keywords: ['lunch boxes', 'tiffin box', 'campus lunch box'],
  },
  {
    name: 'Water Bottles',
    slug: 'water-bottles',
    parentGroup: 'School & College Essentials',
    expectedFilename: 'teenagers/school-essentials/water-bottles.jpg',
    image: '/images/school-kit/water bottle.png',
    imageStatus: 'generated',
    description:
      'BPA-free insulated and flip-top hydration bottles for classes, sports practice, and daily commuting.',
    keywords: ['water bottles', 'insulated bottle', 'sports sipper bottle'],
  },
  {
    name: 'Geometry Boxes',
    slug: 'geometry-boxes',
    parentGroup: 'School & College Essentials',
    expectedFilename: 'teenagers/school-essentials/geometry-boxes.jpg',
    image: '/images/school-kit/geometric box.png',
    imageStatus: 'generated',
    description:
      'Precision math instrument sets containing compass, divider, protractor, set squares, and scale for high school geometry.',
    keywords: ['geometry boxes', 'math set', 'compass box', 'drawing instruments'],
  },

  // GROUP 5 — ELECTRONICS & GADGETS (6)
  {
    name: 'Headphones',
    slug: 'headphones',
    parentGroup: 'Electronics & Gadgets',
    expectedFilename: 'teenagers/electronics-gadgets/headphones.jpg',
    image: '/images/electronics/audio-devices/bluetooth-headphones.jpg',
    imageStatus: 'generated',
    description:
      'Foldable wireless over-ear headphones with cushioned ear cups for music, online classes, and study focus.',
    keywords: ['headphones', 'wireless headphones', 'bluetooth over ear headphones'],
  },
  {
    name: 'Wireless Earbuds',
    slug: 'wireless-earbuds',
    parentGroup: 'Electronics & Gadgets',
    expectedFilename: 'teenagers/electronics-gadgets/wireless-earbuds.jpg',
    image: '/images/electronics/audio-devices/wireless-earbuds.jpg',
    imageStatus: 'generated',
    description:
      'Compact true-wireless earbuds with pocket charging cases for daily commutes, workouts, and study playlists.',
    keywords: ['wireless earbuds', 'tws earbuds', 'bluetooth earphones'],
  },
  {
    name: 'Smartwatches',
    slug: 'smartwatches',
    parentGroup: 'Electronics & Gadgets',
    expectedFilename: 'teenagers/electronics-gadgets/smartwatches.jpg',
    image: '/images/electronics/wearables/smartwatches.jpg',
    imageStatus: 'generated',
    description:
      'AMOLED and touchscreen wristwatches featuring step counters, workout modes, timers, and customizable watch faces.',
    keywords: ['smartwatches', 'teen smartwatch', 'fitness watch'],
  },
  {
    name: 'Bluetooth Speakers',
    slug: 'bluetooth-speakers',
    parentGroup: 'Electronics & Gadgets',
    expectedFilename: 'teenagers/electronics-gadgets/bluetooth-speakers.jpg',
    image: '/images/electronics/audio-devices/bluetooth-speakers.jpg',
    imageStatus: 'generated',
    description:
      'Portable cylindrical and pocket wireless speakers delivering clear room-filling sound for hangouts and study breaks.',
    keywords: ['bluetooth speakers', 'portable speaker', 'wireless mini speaker'],
  },
  {
    name: 'Phone Cases',
    slug: 'phone-cases',
    parentGroup: 'Electronics & Gadgets',
    expectedFilename: 'teenagers/electronics-gadgets/phone-cases.jpg',
    image: '/images/accessories/mobile-accessories/decorative-phone-cases.jpg',
    imageStatus: 'generated',
    description:
      'Shock-absorbing matte, clear, and patterned smartphone protective cases built with raised camera bezels.',
    keywords: ['phone cases', 'mobile back cover', 'protective phone case'],
  },
  {
    name: 'Power Banks',
    slug: 'power-banks',
    parentGroup: 'Electronics & Gadgets',
    expectedFilename: 'teenagers/electronics-gadgets/power-banks.jpg',
    image: '/images/electronics/charging-power/power-banks.jpg',
    imageStatus: 'generated',
    description:
      'Slim high-capacity portable battery packs with dual USB-C and USB-A ports to keep devices charged all day.',
    keywords: ['power banks', 'portable charger', 'fast charging power bank'],
  },

  // GROUP 6 — PERSONAL CARE (7)
  {
    name: 'Face Wash',
    slug: 'face-wash',
    parentGroup: 'Personal Care',
    expectedFilename: 'teenagers/personal-care/face-wash.jpg',
    image: '/images/skin-care/face-wash-cleansers/face-wash.jpg',
    imageStatus: 'generated',
    description:
      'Gentle oil-balancing daily facial cleansers formulated for teenage everyday skincare routines.',
    keywords: ['face wash', 'gentle facial cleanser', 'teen skincare wash'],
  },
  {
    name: 'Moisturizer',
    slug: 'moisturizer',
    parentGroup: 'Personal Care',
    expectedFilename: 'teenagers/personal-care/moisturizer.jpg',
    image: '/images/skin-care/moisturizers-creams/face-moisturizer.jpg',
    imageStatus: 'generated',
    description:
      'Lightweight non-greasy daily hydrating gels and creams for balanced, comfortable skin.',
    keywords: ['moisturizer', 'lightweight face cream', 'daily hydrating gel'],
  },
  {
    name: 'Sunscreen',
    slug: 'sunscreen',
    parentGroup: 'Personal Care',
    expectedFilename: 'teenagers/personal-care/sunscreen.jpg',
    image: '/images/skin-care/sunscreen/sunscreen-lotion.jpg',
    imageStatus: 'generated',
    description:
      'No-white-cast everyday SPF lotions and gels suited for outdoor sports, campus walks, and sunny commutes.',
    keywords: ['sunscreen', 'daily spf lotion', 'sunblock gel'],
  },
  {
    name: 'Lip Balm',
    slug: 'lip-balm',
    parentGroup: 'Personal Care',
    expectedFilename: 'teenagers/personal-care/lip-balm.jpg',
    image: '/images/skin-care/lip-care/lip-balm.jpg',
    imageStatus: 'generated',
    description:
      'Nourishing pocket lip care balms in clear and lightly tinted finishes for daily hydration.',
    keywords: ['lip balm', 'hydrating lip care', 'lip balm stick'],
  },
  {
    name: 'Shampoo',
    slug: 'shampoo',
    parentGroup: 'Personal Care',
    expectedFilename: 'teenagers/personal-care/shampoo.jpg',
    image: '/images/hair-care/shampoo/daily-use-shampoo.jpg',
    imageStatus: 'generated',
    description:
      'Refreshing everyday hair cleansers that leave teen hair clean, light, and easy to manage.',
    keywords: ['shampoo', 'daily hair shampoo', 'mild cleanser shampoo'],
  },
  {
    name: 'Conditioner',
    slug: 'conditioner',
    parentGroup: 'Personal Care',
    expectedFilename: 'teenagers/personal-care/conditioner.jpg',
    image: '/images/hair-care/conditioners/daily-conditioner.jpg',
    imageStatus: 'generated',
    description:
      'Detangling rinse-out hair conditioners for soft, smooth, frizz-free manageability after washing.',
    keywords: ['conditioner', 'daily hair conditioner', 'smoothing conditioner'],
  },
  {
    name: 'Deodorant',
    slug: 'deodorant',
    parentGroup: 'Personal Care',
    expectedFilename: 'teenagers/personal-care/deodorant.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Fresh everyday body sprays and gentle roll-on deodorants designed for active school and sports schedules.',
    keywords: ['deodorant', 'teen roll on', 'fresh body spray'],
  },

  // GROUP 7 — FASHION ACCESSORIES (7)
  {
    name: 'Watches',
    slug: 'watches',
    parentGroup: 'Fashion Accessories',
    expectedFilename: 'teenagers/fashion-accessories/watches.jpg',
    image: '/images/products/teenagers/teen-minimal-watch.webp',
    imageStatus: 'generated',
    description:
      'Clean analog, sporty digital, and minimalist strap wristwatches suited for everyday school and casual styling.',
    keywords: ['watches', 'teen wristwatch', 'minimalist analog watch'],
  },
  {
    name: 'Sunglasses',
    slug: 'sunglasses',
    parentGroup: 'Fashion Accessories',
    expectedFilename: 'teenagers/fashion-accessories/sunglasses.jpg',
    image: '/images/accessories/eyewear/sunglasses.jpg',
    imageStatus: 'generated',
    description:
      'Trendy square, round, and retro-frame UV400 sunglasses for sunny days and outdoor trips.',
    keywords: ['sunglasses', 'uv400 shades', 'teen sunglasses'],
  },
  {
    name: 'Caps',
    slug: 'caps',
    parentGroup: 'Fashion Accessories',
    expectedFilename: 'teenagers/fashion-accessories/caps.jpg',
    image: '/images/accessories/belts-fashion/caps.jpg',
    imageStatus: 'generated',
    description:
      'Curved-brim cotton baseball caps and snapbacks with adjustable back straps for sun shade and street style.',
    keywords: ['caps', 'baseball cap', 'snapback cap', 'teen hat'],
  },
  {
    name: 'Belts',
    slug: 'belts',
    parentGroup: 'Fashion Accessories',
    expectedFilename: 'teenagers/fashion-accessories/belts.jpg',
    image: '/images/accessories/belts-fashion/casual-belts.jpg',
    imageStatus: 'generated',
    description:
      'Canvas webbing, braided, and faux-leather waist belts built for jeans, cargos, and school trousers.',
    keywords: ['belts', 'canvas belt', 'casual jean belt'],
  },
  {
    name: 'Wallets',
    slug: 'wallets',
    parentGroup: 'Fashion Accessories',
    expectedFilename: 'teenagers/fashion-accessories/wallets.jpg',
    image: '/images/accessories/bags-wallets/wallets.jpg',
    imageStatus: 'generated',
    description:
      'Compact bi-fold and zip cardholder wallets sized neatly for student IDs, transit cards, and pocket cash.',
    keywords: ['wallets', 'cardholder wallet', 'bi-fold teen wallet'],
  },
  {
    name: 'Hair Clips',
    slug: 'hair-clips',
    parentGroup: 'Fashion Accessories',
    expectedFilename: 'teenagers/fashion-accessories/hair-clips.jpg',
    image: '/images/accessories/hair-accessories/hair-clips.jpg',
    imageStatus: 'generated',
    description:
      'Matte claw clips, pastel snap barrettes, and styling pins for effortless everyday hair updos.',
    keywords: ['hair clips', 'claw clips', 'snap hair pins', 'barrettes'],
  },
  {
    name: 'Scrunchies',
    slug: 'scrunchies',
    parentGroup: 'Fashion Accessories',
    expectedFilename: 'teenagers/fashion-accessories/scrunchies.jpg',
    image: '/images/accessories/hair-accessories/scrunchies.jpg',
    imageStatus: 'generated',
    description:
      'Soft satin, velvet, and cotton hair scrunchies designed to hold ponytails gently without tugging.',
    keywords: ['scrunchies', 'satin hair bands', 'velvet scrunchies'],
  },

  // GROUP 8 — SPORTS & FITNESS (6)
  {
    name: 'Football',
    slug: 'football',
    parentGroup: 'Sports & Fitness',
    expectedFilename: 'teenagers/sports-fitness/football.jpg',
    image: '/images/sports/football/football.jpg',
    imageStatus: 'generated',
    description:
      'Size 5 stitched panel match and practice footballs built for playground games, turf training, and weekend matches.',
    keywords: ['football', 'soccer ball', 'size 5 football'],
  },
  {
    name: 'Cricket Bat',
    slug: 'cricket-bat',
    parentGroup: 'Sports & Fitness',
    expectedFilename: 'teenagers/sports-fitness/cricket-bat.jpg',
    image: '/images/sports/cricket/cricket-bat.jpg',
    imageStatus: 'generated',
    description:
      'Lightweight full-size willow cricket bats with cushioned grips balanced for teenage net sessions and gully matches.',
    keywords: ['cricket bat', 'willow cricket bat', 'teen cricket bat'],
  },
  {
    name: 'Badminton Racket',
    slug: 'badminton-racket',
    parentGroup: 'Sports & Fitness',
    expectedFilename: 'teenagers/sports-fitness/badminton-racket.jpg',
    image: '/images/sports/badminton/badminton-racket.jpg',
    imageStatus: 'generated',
    description:
      'Strung graphite badminton rackets engineered for quick wrist swings and responsive outdoor or court rallies.',
    keywords: ['badminton racket', 'graphite badminton racquet'],
  },
  {
    name: 'Basketball',
    slug: 'basketball',
    parentGroup: 'Sports & Fitness',
    expectedFilename: 'teenagers/sports-fitness/basketball.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Deep-channel pebble-grain size 7 basketballs crafted for outdoor concrete courts and school gymnasiums.',
    keywords: ['basketball', 'indoor outdoor basketball', 'size 7 ball'],
  },
  {
    name: 'Skipping Rope',
    slug: 'skipping-rope',
    parentGroup: 'Sports & Fitness',
    expectedFilename: 'teenagers/sports-fitness/skipping-rope.jpg',
    image: '/images/products/fitness/speed-skipping-rope.webp',
    imageStatus: 'generated',
    description:
      'Adjustable tangle-free speed jump ropes with ergonomic handles for cardio stamina and home warmups.',
    keywords: ['skipping rope', 'jump rope', 'speed skipping rope'],
  },
  {
    name: 'Yoga Mat',
    slug: 'yoga-mat',
    parentGroup: 'Sports & Fitness',
    expectedFilename: 'teenagers/sports-fitness/yoga-mat.jpg',
    image: '/images/products/fitness/neoprene-workout-mat.webp',
    imageStatus: 'generated',
    description:
      'Non-slip cushioned exercise and stretching mats with carry straps for yoga, floor drills, and mobility.',
    keywords: ['yoga mat', 'exercise mat', 'workout mat teen'],
  },

  // GROUP 9 — ROOM & LIFESTYLE (6)
  {
    name: 'Study Lamp',
    slug: 'study-lamp',
    parentGroup: 'Room & Lifestyle',
    expectedFilename: 'teenagers/room-lifestyle/study-lamp.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Adjustable dimmable LED desk lamps providing flicker-free task lighting for late-evening reading and homework.',
    keywords: ['study lamp', 'led desk lamp', 'reading light teen', 'desk light bar'],
  },
  {
    name: 'Alarm Clock',
    slug: 'alarm-clock',
    parentGroup: 'Room & Lifestyle',
    expectedFilename: 'teenagers/room-lifestyle/alarm-clock.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Clean bedside digital and twin-bell alarm clocks with snooze buttons and gentle night-light displays.',
    keywords: ['alarm clock', 'bedside table clock', 'digital desk clock'],
  },
  {
    name: 'Desk Organizer',
    slug: 'desk-organizer',
    parentGroup: 'Room & Lifestyle',
    expectedFilename: 'teenagers/room-lifestyle/desk-organizer.jpg',
    image: '/images/products/teenagers/teen-desk-organizer.webp',
    imageStatus: 'generated',
    description:
      'Multi-slot desktop caddies and stationery trays that keep pens, sticky notes, chargers, and earbuds neatly sorted.',
    keywords: ['desk organizer', 'study table caddy', 'pen holder tray'],
  },
  {
    name: 'Wall Decor',
    slug: 'wall-decor',
    parentGroup: 'Room & Lifestyle',
    expectedFilename: 'teenagers/room-lifestyle/wall-decor.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Framed minimalist prints, motivational typography boards, and pin-up photo grids for teenager bedroom walls.',
    keywords: ['wall decor', 'teen bedroom poster frame', 'wall grid board'],
  },
  {
    name: 'Cushions',
    slug: 'cushions',
    parentGroup: 'Room & Lifestyle',
    expectedFilename: 'teenagers/room-lifestyle/cushions.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Soft textured throw cushions and study chair backrest pillows adding comfort to teen beds and reading nooks.',
    keywords: ['cushions', 'throw pillows', 'teen room cushion'],
  },
  {
    name: 'Storage Boxes',
    slug: 'storage-boxes',
    parentGroup: 'Room & Lifestyle',
    expectedFilename: 'teenagers/room-lifestyle/storage-boxes.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Foldable fabric cubes and stackable lidded bins for keeping clothes, books, cables, and hobby gear organized.',
    keywords: ['storage boxes', 'closet organizer bin', 'foldable storage cube'],
  },

  // GROUP 10 — HOBBIES & CREATIVITY (6)
  {
    name: 'Sketchbooks',
    slug: 'sketchbooks',
    parentGroup: 'Hobbies & Creativity',
    expectedFilename: 'teenagers/hobbies-creativity/sketchbooks.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Thick acid-free spiral and hardbound drawing pads designed for graphite sketching, charcoal, and ink work.',
    keywords: ['sketchbooks', 'drawing pad', 'artist sketch book'],
  },
  {
    name: 'Colour Pencils',
    slug: 'colour-pencils',
    parentGroup: 'Hobbies & Creativity',
    expectedFilename: 'teenagers/hobbies-creativity/colour-pencils.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Richly pigmented 24- and 36-shade artist colour pencil sets packaged in protective tins or cases.',
    keywords: ['colour pencils', 'colored pencils set', 'art pencils'],
  },
  {
    name: 'Painting Kits',
    slug: 'painting-kits',
    parentGroup: 'Hobbies & Creativity',
    expectedFilename: 'teenagers/hobbies-creativity/painting-kits.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Complete acrylic and watercolour paint sets paired with brushes, mixing palettes, and mini canvas panels.',
    keywords: ['painting kits', 'acrylic paint set', 'canvas art kit'],
  },
  {
    name: 'Journals',
    slug: 'journals',
    parentGroup: 'Hobbies & Creativity',
    expectedFilename: 'teenagers/hobbies-creativity/journals.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Dotted and hardbound creative journals with ribbon bookmarks for planning, writing, and habit tracking.',
    keywords: ['journals', 'dotted bullet journal', 'hardcover diary'],
  },
  {
    name: 'DIY Craft Kits',
    slug: 'diy-craft-kits',
    parentGroup: 'Hobbies & Creativity',
    expectedFilename: 'teenagers/hobbies-creativity/diy-craft-kits.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      'Hands-on origami, macrame, friendship bracelet, and creative craft sets designed specifically for teens.',
    keywords: ['diy craft kits', 'teen craft set', 'origami kit'],
  },
  {
    name: 'Puzzles',
    slug: 'puzzles',
    parentGroup: 'Hobbies & Creativity',
    expectedFilename: 'teenagers/hobbies-creativity/puzzles.jpg',
    image: '',
    imageStatus: 'quota_pending',
    description:
      '1000-piece illustrated jigsaw puzzles, speed cubes, and wooden 3D brain-teaser puzzles for teen problem solvers.',
    keywords: ['puzzles', 'speed cube', 'jigsaw puzzle', 'brain teaser'],
  },
];

export const INITIAL_TEENAGERS_COLLECTIONS: TeenagersCollection[] =
  RAW_TEENAGERS_COLLECTIONS.map((item, idx) => {
    const groupMeta = GROUP_BY_NAME.get(item.parentGroup);
    return {
      id: `teen-col-${idx + 1}`,
      name: item.name,
      slug: item.slug,
      parentCategory: 'Teenagers',
      parentGroup: item.parentGroup,
      parentGroupSlug: groupMeta?.slug || 'boys-fashion',
      image: item.image,
      expectedFilename: item.expectedFilename,
      imageStatus: item.imageStatus || (item.image ? 'generated' : 'quota_pending'),
      description: item.description,
      keywords: item.keywords,
      status: 'approved',
      approved: true,
      displayOrder: idx + 1,
    };
  });

export function mergeTeenagersCollections(
  existing?: TeenagersCollection[] | null
): TeenagersCollection[] {
  const incoming = Array.isArray(existing) ? existing : [];
  const byIdOrSlug = new Map<string, TeenagersCollection>();
  for (const col of incoming) {
    if (col?.slug) byIdOrSlug.set(col.slug.toLowerCase(), col);
    if (col?.id) byIdOrSlug.set(col.id.toLowerCase(), col);
  }

  return INITIAL_TEENAGERS_COLLECTIONS.map((seed) => {
    const found =
      byIdOrSlug.get(seed.id.toLowerCase()) ||
      byIdOrSlug.get(seed.slug.toLowerCase());
    if (!found) return seed;

    const validImage =
      found.imageStatus === 'uploaded' && found.image
        ? found.image
        : seed.image || found.image || '';

    const resolvedStatus: TeenagersCollection['imageStatus'] = validImage
      ? found.imageStatus === 'uploaded'
        ? 'uploaded'
        : 'generated'
      : 'quota_pending';

    return {
      ...seed,
      ...found,
      id: seed.id,
      name: seed.name,
      slug: seed.slug,
      parentCategory: 'Teenagers',
      parentGroup: seed.parentGroup,
      parentGroupSlug: seed.parentGroupSlug,
      expectedFilename: seed.expectedFilename,
      image: validImage,
      imageStatus: resolvedStatus,
      displayOrder: seed.displayOrder,
      description:
        found.description && found.description.trim().length > 0
          ? found.description
          : seed.description,
      keywords:
        Array.isArray(found.keywords) && found.keywords.length > 0
          ? found.keywords
          : seed.keywords,
    };
  });
}

export function getTeenagersCollectionPath(
  collection: Pick<TeenagersCollection, 'parentGroupSlug' | 'slug'>
): string {
  return `/teenagers/${collection.parentGroupSlug}/${collection.slug}`;
}

export function findTeenagersGroupBySlug(
  groupSlug: string
): TeenagersGroupMeta | undefined {
  const norm = String(groupSlug || '')
    .trim()
    .toLowerCase();
  return TEENAGERS_GROUPS.find(
    (g) =>
      g.slug.toLowerCase() === norm ||
      g.name.toLowerCase() === norm ||
      g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === norm
  );
}

export function findTeenagersCollection(
  collectionSlug: string,
  collections: TeenagersCollection[] = INITIAL_TEENAGERS_COLLECTIONS,
  groupSlug?: string
): TeenagersCollection | undefined {
  const normSlug = String(collectionSlug || '')
    .trim()
    .toLowerCase();
  const normGroup = groupSlug ? findTeenagersGroupBySlug(groupSlug)?.name : undefined;

  return collections.find((c) => {
    if (normGroup && c.parentGroup !== normGroup) return false;
    return (
      c.slug.toLowerCase() === normSlug ||
      c.name.toLowerCase() === normSlug ||
      c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normSlug
    );
  });
}

export function productMatchesTeenagersCollection(
  product: Product,
  collection: TeenagersCollection
): boolean {
  const catLower = (product.category || '').toLowerCase();
  const subLower = (product.subcategory || '').toLowerCase();
  const subSubLower = (product.subSubcategory || '').toLowerCase();
  const colSlug = collection.slug.toLowerCase();
  const colName = collection.name.toLowerCase();
  const groupName = collection.parentGroup.toLowerCase();

  const text = [
    product.name,
    product.subcategory,
    product.subSubcategory,
    product.shortDescription,
    product.description,
    product.tag,
    ...(product.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (subSubLower === colName || subSubLower === colSlug) {
    if (catLower === 'teenager' || catLower === 'teenagers') return true;
  }

  // Exact keywords for direct Teenagers products
  const isTeenagerCategory =
    catLower === 'teenager' ||
    catLower === 'teenagers' ||
    text.includes('teenager') ||
    text.includes('teen ');

  if (isTeenagerCategory) {
    if (subLower === groupName || subLower === collection.parentGroupSlug) {
      if (subSubLower === colName || subSubLower === colSlug) return true;
    }
    const colTerms = [
      colName,
      colName.replace(/['’]s/g, ''),
      colSlug.replace(/-/g, ' '),
      ...(collection.keywords || []),
    ];
    for (const term of colTerms) {
      const normalized = term.toLowerCase().trim();
      if (normalized && text.includes(normalized)) {
        return true;
      }
    }
  }

  return false;
}
