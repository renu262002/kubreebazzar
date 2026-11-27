import type { KidsCollection, KidsGroupName, Product } from '../types';

export interface KidsGroupMeta {
  name: KidsGroupName;
  slug: string;
  folder: string;
  description: string;
}

export const KIDS_GROUPS: KidsGroupMeta[] = [
  {
    name: "Boys' Clothing",
    slug: 'boys-clothing',
    folder: 'boys-clothing',
    description:
      'Everyday cotton t-shirts, collared shirts, stretch jeans, play shorts, track pants, pullover hoodies, and festive ethnic outfits for boys ages 3 to 12.',
  },
  {
    name: "Girls' Clothing",
    slug: 'girls-clothing',
    folder: 'girls-clothing',
    description:
      'Comfortable frocks, casual day dresses, playful tops, breathable t-shirts, cotton leggings, skirts, and festive ethnic wear for girls ages 3 to 12.',
  },
  {
    name: "Kids' Footwear",
    slug: 'footwear',
    folder: 'footwear',
    description:
      'Uniform school shoes, easy-wear sneakers, cushioned sports shoes, breathable sandals, soft indoor-outdoor slippers, and occasion party shoes.',
  },
  {
    name: 'School Essentials',
    slug: 'school-essentials',
    folder: 'school-essentials',
    description:
      'Practical school bags, compartmentalized lunch boxes, reusable water bottles, pencil boxes, ruled notebooks, and classroom stationery sets.',
  },
  {
    name: 'Toys & Games',
    slug: 'toys-games',
    folder: 'toys-games',
    description:
      'Creative building blocks, toy cars, dolls, illustrated floor puzzles, family board games, action figures, and plush soft toys.',
  },
  {
    name: 'Learning & Creativity',
    slug: 'learning-creativity',
    folder: 'learning-creativity',
    description:
      'Engaging colouring books, bright wax crayons, colour pencils, blank drawing books, kids painting kits, and early-learning educational flashcards.',
  },
  {
    name: "Kids' Accessories",
    slug: 'accessories',
    folder: 'accessories',
    description:
      'Easy-read kids wristwatches, flexible sunny-day sunglasses, breathable sun caps, pastel hair clips, soft hair bands, and compact day backpacks.',
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    folder: 'personal-care',
    description:
      'Mild kids shampoo, gentle bathing soap, daily moisturizing lotion, soft-bristle kids toothbrush, and mild kids toothpaste.',
  },
  {
    name: 'Sports & Outdoor',
    slug: 'sports-outdoor',
    folder: 'sports-outdoor',
    description:
      'Kid-sized footballs, beginner cricket sets, lightweight badminton sets, colourful skipping ropes, kids bicycles, and protective cycling helmets.',
  },
  {
    name: 'Bedroom & Lifestyle',
    slug: 'bedroom-lifestyle',
    folder: 'bedroom-lifestyle',
    description:
      'Playful cotton kids bedsheets, soft pillows, warm bedside night lamps, foldable toy storage baskets, and cheerful bedroom wall decor.',
  },
  {
    name: 'Feeding & Travel',
    slug: 'feeding-travel',
    folder: 'feeding-travel',
    description:
      'Compartment kids snack boxes, reusable food containers, lightweight travel bags, and rounded kids spoon-and-fork cutlery sets.',
  },
];

const GROUP_BY_NAME = new Map<KidsGroupName, KidsGroupMeta>(
  KIDS_GROUPS.map((g) => [g.name, g])
);

interface RawKidsSeed {
  name: string;
  slug: string;
  parentGroup: KidsGroupName;
  expectedFilename: string;
  image: string;
  imageStatus?: KidsCollection['imageStatus'];
  description: string;
  keywords: string[];
}

const RAW_KIDS_COLLECTIONS: RawKidsSeed[] = [
  // GROUP 1 — BOYS' CLOTHING (7)
  {
    name: "Boys' T-Shirts",
    slug: 'boys-tshirts',
    parentGroup: "Boys' Clothing",
    expectedFilename: 'kids/boys-clothing/boys-tshirts.jpg',
    image: '/images/products/kids/kids-boys-tshirt.webp',
    imageStatus: 'generated',
    description:
      'Soft combed-cotton crew-neck t-shirts with playful colourblock prints built for active boys aged 3 to 12.',
    keywords: ["boys' t-shirts", 'kids boys tshirt', 'boys playtime tee', 'round neck kids tee'],
  },
  {
    name: "Boys' Shirts",
    slug: 'boys-shirts',
    parentGroup: "Boys' Clothing",
    expectedFilename: 'kids/boys-clothing/boys-shirts.jpg',
    image: '/images/products/kids/kids-boys-shirt.webp',
    imageStatus: 'generated',
    description:
      'Breathable oxford and patterned cotton button-down shirts for school events, family outings, and casual days.',
    keywords: ["boys' shirts", 'kids button down shirt', 'boys oxford shirt', 'kids collared shirt'],
  },
  {
    name: "Boys' Jeans",
    slug: 'boys-jeans',
    parentGroup: "Boys' Clothing",
    expectedFilename: 'kids/boys-clothing/boys-jeans.jpg',
    image: '/images/products/kids/kids-boys-jeans.webp',
    imageStatus: 'generated',
    description:
      'Soft-waist stretch cotton denim jeans tailored for comfortable playground and weekend wear.',
    keywords: ["boys' jeans", 'kids denim jeans', 'boys stretch trousers'],
  },
  {
    name: "Boys' Shorts",
    slug: 'boys-shorts',
    parentGroup: "Boys' Clothing",
    expectedFilename: 'kids/boys-clothing/boys-shorts.jpg',
    image: '/images/products/kids/kids-boys-shorts.webp',
    imageStatus: 'generated',
    description:
      'Lightweight cotton chino and elastic-waist play shorts crafted for warm afternoons and outdoor games.',
    keywords: ["boys' shorts", 'kids chino shorts', 'boys play shorts'],
  },
  {
    name: "Boys' Track Pants",
    slug: 'boys-track-pants',
    parentGroup: "Boys' Clothing",
    expectedFilename: 'kids/boys-clothing/boys-track-pants.jpg',
    image: '/images/kids/boys-clothing/boys-track-pants.jpg',
    imageStatus: 'generated',
    description:
      'Cuffed cotton-fleece joggers and sporty track pants with drawstring waistbands for playground runs and active play.',
    keywords: ["boys' track pants", 'kids joggers', 'boys sweatpants'],
  },
  {
    name: "Boys' Hoodies",
    slug: 'boys-hoodies',
    parentGroup: "Boys' Clothing",
    expectedFilename: 'kids/boys-clothing/boys-hoodies.jpg',
    image: '/images/kids/boys-clothing/boys-hoodies.jpg',
    imageStatus: 'generated',
    description:
      'Warm brushed-cotton pullover hoodies with front kangaroo pockets for cool mornings, travel, and school.',
    keywords: ["boys' hoodies", 'kids pullover hoodie', 'boys sweatshirt'],
  },
  {
    name: "Boys' Ethnic Wear",
    slug: 'boys-ethnic-wear',
    parentGroup: "Boys' Clothing",
    expectedFilename: 'kids/boys-clothing/boys-ethnic-wear.jpg',
    image: '/images/kids/boys-clothing/boys-ethnic-wear.jpg',
    imageStatus: 'generated',
    description:
      'Festive cotton-silk kurta pyjama sets and traditional celebratory outfits sized for boys aged 3 to 12.',
    keywords: ["boys' ethnic wear", 'kids kurta pyjama', 'boys festive outfit'],
  },

  // GROUP 2 — GIRLS' CLOTHING (7)
  {
    name: "Girls' Frocks",
    slug: 'girls-frocks',
    parentGroup: "Girls' Clothing",
    expectedFilename: 'kids/girls-clothing/girls-frocks.jpg',
    image: '/images/products/kids/kids-girls-frock.webp',
    imageStatus: 'generated',
    description:
      'Twirl-ready pleated pastel frocks lined with soft breathable cotton for birthdays and festive gatherings.',
    keywords: ["girls' frocks", 'kids party frock', 'pastel pleated frock'],
  },
  {
    name: "Girls' Dresses",
    slug: 'girls-dresses',
    parentGroup: "Girls' Clothing",
    expectedFilename: 'kids/girls-clothing/girls-dresses.jpg',
    image: '/images/products/kids/kids-girls-dress.webp',
    imageStatus: 'generated',
    description:
      'Flared A-line cotton day dresses and breezy summer sundresses designed for comfortable everyday movement.',
    keywords: ["girls' dresses", 'kids cotton dress', 'girls summer sundress'],
  },
  {
    name: "Girls' Tops",
    slug: 'girls-tops',
    parentGroup: "Girls' Clothing",
    expectedFilename: 'kids/girls-clothing/girls-tops.jpg',
    image: '/images/kids/girls-clothing/girls-tops.jpg',
    imageStatus: 'generated',
    description:
      'Flutter-sleeve, embroidered, and relaxed woven everyday tops tailored for girls aged 3 to 12.',
    keywords: ["girls' tops", 'kids girls blouse', 'girls casual top'],
  },
  {
    name: "Girls' T-Shirts",
    slug: 'girls-tshirts',
    parentGroup: "Girls' Clothing",
    expectedFilename: 'kids/girls-clothing/girls-tshirts.jpg',
    image: '/images/kids/girls-clothing/girls-tshirts.jpg',
    imageStatus: 'generated',
    description:
      'Pastel combed-cotton graphic t-shirts with cheerful motifs for school playdates and relaxed daily wear.',
    keywords: ["girls' t-shirts", 'kids girls tee', 'pastel kids tshirt'],
  },
  {
    name: "Girls' Leggings",
    slug: 'girls-leggings',
    parentGroup: "Girls' Clothing",
    expectedFilename: 'kids/girls-clothing/girls-leggings.jpg',
    image: '/images/kids/girls-clothing/girls-leggings.jpg',
    imageStatus: 'generated',
    description:
      'Soft stretchy cotton ankle leggings made to pair cleanly under frocks, tunics, and everyday tees.',
    keywords: ["girls' leggings", 'kids stretch leggings', 'girls cotton tights'],
  },
  {
    name: "Girls' Skirts",
    slug: 'girls-skirts',
    parentGroup: "Girls' Clothing",
    expectedFilename: 'kids/girls-clothing/girls-skirts.jpg',
    image: '/images/kids/girls-clothing/girls-skirts.jpg',
    imageStatus: 'generated',
    description:
      'Pleated, flared, and soft-waist denim or cotton skirts tailored for playful outings and weekend wear.',
    keywords: ["girls' skirts", 'kids pleated skirt', 'girls flared skirt'],
  },
  {
    name: "Girls' Ethnic Wear",
    slug: 'girls-ethnic-wear',
    parentGroup: "Girls' Clothing",
    expectedFilename: 'kids/girls-clothing/girls-ethnic-wear.jpg',
    image: '/images/products/kids/kids-ethnic-wear.webp',
    imageStatus: 'generated',
    description:
      'Vibrant festive pattu pavadai, lehenga choli, and embroidered traditional outfits for celebrations.',
    keywords: ["girls' ethnic wear", 'kids pavadai set', 'girls festive lehenga'],
  },

  // GROUP 3 — KIDS' FOOTWEAR (6)
  {
    name: "Kids' School Shoes",
    slug: 'kids-school-shoes',
    parentGroup: "Kids' Footwear",
    expectedFilename: 'kids/footwear/kids-school-shoes.jpg',
    image: '/images/products/kids/kids-school-shoes.webp',
    imageStatus: 'generated',
    description:
      'Durable matte-black uniform school shoes featuring dual hook-and-loop Velcro straps and padded collars.',
    keywords: ["kids' school shoes", 'uniform black shoes', 'velcro school shoes'],
  },
  {
    name: "Kids' Sneakers",
    slug: 'kids-sneakers',
    parentGroup: "Kids' Footwear",
    expectedFilename: 'kids/footwear/kids-sneakers.jpg',
    image: '/images/products/kids/kids-sneakers.webp',
    imageStatus: 'generated',
    description:
      'Lightweight dual-strap casual sneakers built with cushioned soles for daily walks and play.',
    keywords: ["kids' sneakers", 'kids walking sneakers', 'velcro kids trainers'],
  },
  {
    name: "Kids' Sports Shoes",
    slug: 'kids-sports-shoes',
    parentGroup: "Kids' Footwear",
    expectedFilename: 'kids/footwear/kids-sports-shoes.jpg',
    image: '/images/products/kids/kids-sports-shoes.webp',
    imageStatus: 'generated',
    description:
      'Breathable mesh athletic running shoes shaped for playground sprints, sports day races, and PE classes.',
    keywords: ["kids' sports shoes", 'kids running shoes', 'mesh kids trainers'],
  },
  {
    name: "Kids' Sandals",
    slug: 'kids-sandals',
    parentGroup: "Kids' Footwear",
    expectedFilename: 'kids/footwear/kids-sandals.jpg',
    image: '/images/products/kids/kids-sandals.webp',
    imageStatus: 'generated',
    description:
      'Quick-dry multi-strap outdoor sandals with contoured footbeds for parks and warm weather.',
    keywords: ["kids' sandals", 'kids velcro sandals', 'summer kids sandals'],
  },
  {
    name: "Kids' Slippers",
    slug: 'kids-slippers',
    parentGroup: "Kids' Footwear",
    expectedFilename: 'kids/footwear/kids-slippers.jpg',
    image: '/images/products/kids/kids-slippers.webp',
    imageStatus: 'generated',
    description:
      'Featherlight moulded EVA flip-flops and cushioned slides for comfortable indoor and garden wear.',
    keywords: ["kids' slippers", 'kids flip flops', 'kids indoor slides'],
  },
  {
    name: "Kids' Party Shoes",
    slug: 'kids-party-shoes',
    parentGroup: "Kids' Footwear",
    expectedFilename: 'kids/footwear/kids-party-shoes.jpg',
    image: '/images/kids/footwear/kids-party-shoes.jpg',
    imageStatus: 'generated',
    description:
      'Dressy strap flats, loafers, and sparkly occasion footwear sized comfortably for kids birthdays and weddings.',
    keywords: ["kids' party shoes", 'kids dress shoes', 'occasion shoes kids'],
  },

  // GROUP 4 — SCHOOL ESSENTIALS (6)
  {
    name: 'School Bags',
    slug: 'school-bags',
    parentGroup: 'School Essentials',
    expectedFilename: 'kids/school-essentials/school-bags.jpg',
    image: '/images/school-kit/school bag.png',
    imageStatus: 'generated',
    description:
      'Ergonomic multi-pocket school backpacks sized for primary-school books, folders, and side water bottles.',
    keywords: ['school bags', 'kids school backpack', 'primary school bag'],
  },
  {
    name: 'Lunch Boxes',
    slug: 'lunch-boxes',
    parentGroup: 'School Essentials',
    expectedFilename: 'kids/school-essentials/lunch-boxes.jpg',
    image: '/images/school-kit/lunch box.png',
    imageStatus: 'generated',
    description:
      'Easy-latch compartmentalized kids tiffin boxes designed to keep lunches organized inside school bags.',
    keywords: ['lunch boxes', 'kids tiffin box', 'school lunch box'],
  },
  {
    name: 'Water Bottles',
    slug: 'water-bottles',
    parentGroup: 'School Essentials',
    expectedFilename: 'kids/school-essentials/water-bottles.jpg',
    image: '/images/school-kit/water bottle.png',
    imageStatus: 'generated',
    description:
      'Reusable flip-straw and wide-mouth kids hydration bottles sized comfortably for small hands.',
    keywords: ['water bottles', 'kids sipper bottle', 'school water bottle'],
  },
  {
    name: 'Pencil Boxes',
    slug: 'pencil-boxes',
    parentGroup: 'School Essentials',
    expectedFilename: 'kids/school-essentials/pencil-boxes.jpg',
    image: '/images/kids/school-essentials/pencil-boxes.jpg',
    imageStatus: 'generated',
    description:
      'Hardtop zippered and clasp pencil cases with built-in dividers for pencils, erasers, and rulers.',
    keywords: ['pencil boxes', 'kids pencil case', 'cartoon pencil pouch'],
  },
  {
    name: 'Notebooks',
    slug: 'notebooks',
    parentGroup: 'School Essentials',
    expectedFilename: 'kids/school-essentials/notebooks.jpg',
    image: '/images/school-kit/note book.png',
    imageStatus: 'generated',
    description:
      'Four-line, square-grid, and single-ruled classwork notebooks crafted for primary school handwriting practice.',
    keywords: ['notebooks', 'kids school notebook', 'ruled exercise book'],
  },
  {
    name: 'Stationery Sets',
    slug: 'stationery-sets',
    parentGroup: 'School Essentials',
    expectedFilename: 'kids/school-essentials/stationery-sets.jpg',
    image: '/images/kids/school-essentials/stationery-sets.jpg',
    imageStatus: 'generated',
    description:
      'Bundled kids writing packs featuring HB pencils, erasers, sharpeners, scales, and glue sticks.',
    keywords: ['stationery sets', 'kids school stationery', 'pencil eraser kit'],
  },

  // GROUP 5 — TOYS & GAMES (7)
  {
    name: 'Building Blocks',
    slug: 'building-blocks',
    parentGroup: 'Toys & Games',
    expectedFilename: 'kids/toys-games/building-blocks.jpg',
    image: '/images/products/kids-magnetic-tiles.jpg',
    imageStatus: 'generated',
    description:
      'Interlocking magnetic tiles, wooden stacking blocks, and colourful construction bricks for imaginative builders.',
    keywords: ['building blocks', 'block set', 'building geometry tiles', 'magnetic tiles', 'stacking blocks'],
  },
  {
    name: 'Toy Cars',
    slug: 'toy-cars',
    parentGroup: 'Toys & Games',
    expectedFilename: 'kids/toys-games/toy-cars.jpg',
    image: '/images/products/kids/kids-toy-vehicle.webp',
    imageStatus: 'generated',
    description:
      'Push-along wooden vehicles, pull-back racers, and colourful toy cars built for active floor play.',
    keywords: ['toy cars', 'kids toy vehicle', 'wooden car set'],
  },
  {
    name: 'Dolls',
    slug: 'dolls',
    parentGroup: 'Toys & Games',
    expectedFilename: 'kids/toys-games/dolls.jpg',
    image: '/images/kids/toys-games/dolls.jpg',
    imageStatus: 'generated',
    description:
      'Articulated play dolls and cloth companions styled with outfits for imaginative roleplay.',
    keywords: ['dolls', 'kids play doll', 'rag doll'],
  },
  {
    name: 'Puzzles',
    slug: 'puzzles',
    parentGroup: 'Toys & Games',
    expectedFilename: 'kids/toys-games/puzzles.jpg',
    image: '/images/products/kids/kids-puzzle-set.webp',
    imageStatus: 'generated',
    description:
      'Chunky wooden peg puzzles and illustrated floor jigsaw trays supporting shape recognition and logic.',
    keywords: ['puzzles', 'kids wooden puzzle', 'floor puzzle set'],
  },
  {
    name: 'Board Games',
    slug: 'board-games',
    parentGroup: 'Toys & Games',
    expectedFilename: 'kids/toys-games/board-games.jpg',
    image: '/images/kids/toys-games/board-games.jpg',
    imageStatus: 'generated',
    description:
      'Classic dice-and-token family board games made for rainy afternoons, siblings, and family game nights.',
    keywords: ['board games', 'kids family game', 'ludo snakes ladders'],
  },
  {
    name: 'Action Figures',
    slug: 'action-figures',
    parentGroup: 'Toys & Games',
    expectedFilename: 'kids/toys-games/action-figures.jpg',
    image: '/images/kids/toys-games/action-figures.jpg',
    imageStatus: 'generated',
    description:
      'Poseable adventure heroes, space explorers, and dinosaur play figures crafted for storytelling.',
    keywords: ['action figures', 'kids dinosaur figure', 'toy adventure figure'],
  },
  {
    name: 'Soft Toys',
    slug: 'soft-toys',
    parentGroup: 'Toys & Games',
    expectedFilename: 'kids/toys-games/soft-toys.jpg',
    image: '/images/products/kids/kids-soft-toy.webp',
    imageStatus: 'generated',
    description:
      'Soft plush teddy bears and animal cuddle companions suited for young kids bedrooms.',
    keywords: ['soft toys', 'plush teddy bear', 'kids cuddle toy'],
  },

  // GROUP 6 — LEARNING & CREATIVITY (6)
  {
    name: 'Colouring Books',
    slug: 'colouring-books',
    parentGroup: 'Learning & Creativity',
    expectedFilename: 'kids/learning-creativity/colouring-books.jpg',
    image: '/images/school-kit/activity book.png',
    imageStatus: 'generated',
    description:
      'Bold-outline animal, alphabet, and mandala colouring workbooks tailored for crayons and colour pencils.',
    keywords: ['colouring books', 'kids coloring book', 'activity colouring pad'],
  },
  {
    name: 'Crayons',
    slug: 'crayons',
    parentGroup: 'Learning & Creativity',
    expectedFilename: 'kids/learning-creativity/crayons.jpg',
    image: '/images/kids/learning-creativity/crayons.jpg',
    imageStatus: 'generated',
    description:
      'Smooth wax and twistable plastic crayons sized for easy grip and bright paper coverage.',
    keywords: ['crayons', 'wax crayons', 'kids drawing crayons'],
  },
  {
    name: 'Colour Pencils',
    slug: 'colour-pencils',
    parentGroup: 'Learning & Creativity',
    expectedFilename: 'kids/learning-creativity/colour-pencils.jpg',
    image: '/images/kids/learning-creativity/colour-pencils.jpg',
    imageStatus: 'generated',
    description:
      'Vibrant 12- and 24-shade wooden colour pencils for school art projects and shading.',
    keywords: ['colour pencils', 'kids colored pencils', 'art pencil box'],
  },
  {
    name: 'Drawing Books',
    slug: 'drawing-books',
    parentGroup: 'Learning & Creativity',
    expectedFilename: 'kids/learning-creativity/drawing-books.jpg',
    image: '/images/kids/learning-creativity/drawing-books.jpg',
    imageStatus: 'generated',
    description:
      'Blank thick cartridge-paper drawing pads sized for school art homework, sketching, and freehand painting.',
    keywords: ['drawing books', 'kids sketch book', 'blank art pad'],
  },
  {
    name: 'Painting Kits',
    slug: 'painting-kits',
    parentGroup: 'Learning & Creativity',
    expectedFilename: 'kids/learning-creativity/painting-kits.jpg',
    image: '/images/kids/learning-creativity/painting-kits.jpg',
    imageStatus: 'generated',
    description:
      'Washable tempera and watercolour paint pots paired with kids brushes and mixing trays.',
    keywords: ['painting kits', 'kids paint set', 'washable watercolor kit'],
  },
  {
    name: 'Educational Flashcards',
    slug: 'educational-flashcards',
    parentGroup: 'Learning & Creativity',
    expectedFilename: 'kids/learning-creativity/educational-flashcards.jpg',
    image: '/images/products/kids/kids-activity-set.webp',
    imageStatus: 'generated',
    description:
      'Illustrated phonics, number, animal, and science flashcards designed to make early reading and counting playful.',
    keywords: ['educational flashcards', 'kids learning cards', 'story & activity set', 'counting flashcards'],
  },

  // GROUP 7 — KIDS' ACCESSORIES (6)
  {
    name: "Kids' Watches",
    slug: 'kids-watches',
    parentGroup: "Kids' Accessories",
    expectedFilename: 'kids/accessories/kids-watches.jpg',
    image: '/images/products/kids/kids-watch.webp',
    imageStatus: 'generated',
    description:
      'Clear numeral time-teacher analogue and colourful silicone-strap wristwatches made comfortably for kids.',
    keywords: ["kids' watches", 'kids silicone wristwatch', 'children learning watch'],
  },
  {
    name: "Kids' Sunglasses",
    slug: 'kids-sunglasses',
    parentGroup: "Kids' Accessories",
    expectedFilename: 'kids/accessories/kids-sunglasses.jpg',
    image: '/images/products/kids/kids-sunglasses.webp',
    imageStatus: 'generated',
    description:
      'Lightweight bendable children sunglasses shaped for sunny park visits, school picnics, and holidays.',
    keywords: ["kids' sunglasses", 'flexible children shades', 'kids sunny glasses'],
  },
  {
    name: "Kids' Caps",
    slug: 'kids-caps',
    parentGroup: "Kids' Accessories",
    expectedFilename: 'kids/accessories/kids-caps.jpg',
    image: '/images/products/kids/kids-sun-cap.webp',
    imageStatus: 'generated',
    description:
      'Adjustable cotton baseball caps and sun hats offering comfortable outdoor shade for kids aged 3 to 12.',
    keywords: ["kids' caps", 'children sun cap', 'kids baseball hat'],
  },
  {
    name: "Kids' Hair Clips",
    slug: 'kids-hair-clips',
    parentGroup: "Kids' Accessories",
    expectedFilename: 'kids/accessories/kids-hair-clips.jpg',
    image: '/images/products/kids/kids-hairbands-clips.webp',
    imageStatus: 'generated',
    description:
      'Pastel fabric-wrapped bow clips, snap barrettes, and gentle pins that hold hair neatly without pulling.',
    keywords: ["kids' hair clips", 'pastel bow hair clips', 'children hairpins'],
  },
  {
    name: "Kids' Hair Bands",
    slug: 'kids-hair-bands',
    parentGroup: "Kids' Accessories",
    expectedFilename: 'kids/accessories/kids-hair-bands.jpg',
    image: '/images/accessories/hair-accessories/hair-bands.jpg',
    imageStatus: 'generated',
    description:
      'Soft fabric-covered knotted headbands and cheerful elastic bands sized comfortably for school and parties.',
    keywords: ["kids' hair bands", 'children headbands', 'fabric hair bands'],
  },
  {
    name: "Kids' Backpacks",
    slug: 'kids-backpacks',
    parentGroup: "Kids' Accessories",
    expectedFilename: 'kids/accessories/kids-backpacks.jpg',
    image: '/images/products/kids/kids-backpack.webp',
    imageStatus: 'generated',
    description:
      'Compact playful daypacks with padded straps for picnics, weekend tuition, and family day trips.',
    keywords: ["kids' backpacks", 'playday cartoon backpack', 'small kids rucksack'],
  },

  // GROUP 8 — PERSONAL CARE (5)
  {
    name: "Kids' Shampoo",
    slug: 'kids-shampoo',
    parentGroup: 'Personal Care',
    expectedFilename: 'kids/personal-care/kids-shampoo.jpg',
    image: '/images/kids/personal-care/kids-shampoo.jpg',
    imageStatus: 'generated',
    description:
      'Mild-lather everyday kids hair shampoo formulated cleanly for children aged 3 to 12 after outdoor play.',
    keywords: ["kids' shampoo", 'mild children shampoo', 'kids hair wash'],
  },
  {
    name: "Kids' Soap",
    slug: 'kids-soap',
    parentGroup: 'Personal Care',
    expectedFilename: 'kids/personal-care/kids-soap.jpg',
    image: '/images/kids/personal-care/kids-soap.jpg',
    imageStatus: 'generated',
    description:
      'Soft moisturizing bathing bars and gentle kids body cleansers crafted for daily morning and post-play baths.',
    keywords: ["kids' soap", 'children bath bar', 'gentle kids body wash'],
  },
  {
    name: "Kids' Lotion",
    slug: 'kids-lotion',
    parentGroup: 'Personal Care',
    expectedFilename: 'kids/personal-care/kids-lotion.jpg',
    image: '/images/kids/personal-care/kids-lotion.jpg',
    imageStatus: 'generated',
    description:
      'Lightweight quick-absorbing daily moisturizing lotion tailored for children’s everyday skin hydration.',
    keywords: ["kids' lotion", 'children body lotion', 'daily kids moisturizer'],
  },
  {
    name: "Kids' Toothbrush",
    slug: 'kids-toothbrush',
    parentGroup: 'Personal Care',
    expectedFilename: 'kids/personal-care/kids-toothbrush.jpg',
    image: '/images/kids/personal-care/kids-toothbrush.jpg',
    imageStatus: 'generated',
    description:
      'Extra-soft rounded-bristle kids toothbrushes with easy-grip handles for morning and bedtime brushing.',
    keywords: ["kids' toothbrush", 'soft bristle kids brush', 'children toothbrush'],
  },
  {
    name: "Kids' Toothpaste",
    slug: 'kids-toothpaste',
    parentGroup: 'Personal Care',
    expectedFilename: 'kids/personal-care/kids-toothpaste.jpg',
    image: '/images/kids/personal-care/kids-toothpaste.jpg',
    imageStatus: 'generated',
    description:
      'Mild fruity-mint children’s gel toothpaste designed specifically for kids ages 3 to 12.',
    keywords: ["kids' toothpaste", 'children fruit toothpaste', 'mild kids dental paste'],
  },

  // GROUP 9 — SPORTS & OUTDOOR (6)
  {
    name: "Kids' Football",
    slug: 'kids-football',
    parentGroup: 'Sports & Outdoor',
    expectedFilename: 'kids/sports-outdoor/kids-football.jpg',
    image: '/images/sports/football/football.jpg',
    imageStatus: 'generated',
    description:
      'Junior size 3 and size 4 stitched outdoor footballs sized cleanly for park kickabouts and junior practice.',
    keywords: ["kids' football", 'junior soccer ball', 'kids practice football'],
  },
  {
    name: "Kids' Cricket Set",
    slug: 'kids-cricket-set',
    parentGroup: 'Sports & Outdoor',
    expectedFilename: 'kids/sports-outdoor/kids-cricket-set.jpg',
    image: '/images/kids/sports-outdoor/kids-cricket-set.jpg',
    imageStatus: 'generated',
    description:
      'Lightweight junior cricket bat, soft practice balls, and portable wicket stumps for backyard and park play.',
    keywords: ["kids' cricket set", 'junior cricket bat stumps', 'children cricket kit'],
  },
  {
    name: "Kids' Badminton Set",
    slug: 'kids-badminton-set',
    parentGroup: 'Sports & Outdoor',
    expectedFilename: 'kids/sports-outdoor/kids-badminton-set.jpg',
    image: '/images/sports/badminton/badminton-racket.jpg',
    imageStatus: 'generated',
    description:
      'Shorter-shaft lightweight badminton rackets paired with durable shuttlecocks for beginner outdoor rallies.',
    keywords: ["kids' badminton set", 'junior badminton racket', 'children shuttle kit'],
  },
  {
    name: "Kids' Skipping Rope",
    slug: 'kids-skipping-rope',
    parentGroup: 'Sports & Outdoor',
    expectedFilename: 'kids/sports-outdoor/kids-skipping-rope.jpg',
    image: '/images/kids/sports-outdoor/kids-skipping-rope.jpg',
    imageStatus: 'generated',
    description:
      'Colourful adjustable braided cotton jump ropes with child-sized wooden or foam handles for playground fun.',
    keywords: ["kids' skipping rope", 'children jump rope', 'cotton skipping rope kids'],
  },
  {
    name: "Kids' Bicycle",
    slug: 'kids-bicycle',
    parentGroup: 'Sports & Outdoor',
    expectedFilename: 'kids/sports-outdoor/kids-bicycle.jpg',
    image: '/images/kids/sports-outdoor/kids-bicycle.jpg',
    imageStatus: 'generated',
    description:
      '14- to 20-inch sturdy kids bicycles with chain guards, hand brakes, and removable training wheels.',
    keywords: ["kids' bicycle", 'children cycle bike', 'kids bike'],
  },
  {
    name: "Kids' Protective Helmet",
    slug: 'kids-protective-helmet',
    parentGroup: 'Sports & Outdoor',
    expectedFilename: 'kids/sports-outdoor/kids-protective-helmet.jpg',
    image: '/images/kids/sports-outdoor/kids-protective-helmet.jpg',
    imageStatus: 'generated',
    description:
      'Ventilated lightweight cycling and skating helmets with adjustable dial-fit straps sized for children.',
    keywords: ["kids' protective helmet", 'children bicycle helmet', 'kids cycling gear'],
  },

  // GROUP 10 — BEDROOM & LIFESTYLE (5)
  {
    name: "Kids' Bedsheets",
    slug: 'kids-bedsheets',
    parentGroup: 'Bedroom & Lifestyle',
    expectedFilename: 'kids/bedroom-lifestyle/kids-bedsheets.jpg',
    image: '/images/kids/bedroom-lifestyle/kids-bedsheets.jpg',
    imageStatus: 'generated',
    description:
      'Soft breathable cotton single bedsheets patterned with cheerful stars, space, dinosaurs, and floral prints.',
    keywords: ["kids' bedsheets", 'children cotton bedsheet', 'printed kids bedding'],
  },
  {
    name: "Kids' Pillows",
    slug: 'kids-pillows',
    parentGroup: 'Bedroom & Lifestyle',
    expectedFilename: 'kids/bedroom-lifestyle/kids-pillows.jpg',
    image: '/images/kids/bedroom-lifestyle/kids-pillows.jpg',
    imageStatus: 'generated',
    description:
      'Low-loft washable cotton-cover sleeping pillows and playful shaped reading cushions for kids beds.',
    keywords: ["kids' pillows", 'children sleeping pillow', 'kids bedroom cushion'],
  },
  {
    name: "Kids' Night Lamps",
    slug: 'kids-night-lamps',
    parentGroup: 'Bedroom & Lifestyle',
    expectedFilename: 'kids/bedroom-lifestyle/kids-night-lamps.jpg',
    image: '/images/kids/bedroom-lifestyle/kids-night-lamps.jpg',
    imageStatus: 'generated',
    description:
      'Soft warm-glow silicone animal and star-projector bedside night lights designed to comfort young sleepers.',
    keywords: ["kids' night lamps", 'children bedside night light', 'silicone night lamp'],
  },
  {
    name: "Kids' Storage Baskets",
    slug: 'kids-storage-baskets',
    parentGroup: 'Bedroom & Lifestyle',
    expectedFilename: 'kids/bedroom-lifestyle/kids-storage-baskets.jpg',
    image: '/images/kids/bedroom-lifestyle/kids-storage-baskets.jpg',
    imageStatus: 'generated',
    description:
      'Collapsible woven cotton and canvas toy bins that make tidying up blocks, plush toys, and storybooks simple.',
    keywords: ["kids' storage baskets", 'toy organizer basket', 'foldable kids bin'],
  },
  {
    name: "Kids' Wall Decor",
    slug: 'kids-wall-decor',
    parentGroup: 'Bedroom & Lifestyle',
    expectedFilename: 'kids/bedroom-lifestyle/kids-wall-decor.jpg',
    image: '/images/kids/bedroom-lifestyle/kids-wall-decor.jpg',
    imageStatus: 'generated',
    description:
      'Alphabet posters, removable wall decals, height growth charts, and framed kids bedroom artwork.',
    keywords: ["kids' wall decor", 'children room wall stickers', 'kids height chart'],
  },

  // GROUP 11 — FEEDING & TRAVEL (4)
  {
    name: "Kids' Snack Boxes",
    slug: 'kids-snack-boxes',
    parentGroup: 'Feeding & Travel',
    expectedFilename: 'kids/feeding-travel/kids-snack-boxes.jpg',
    image: '/images/school-kit/snacks box.png',
    imageStatus: 'generated',
    description:
      'Compact 3- and 4-compartment kids snack containers ideal for fruit slices, crackers, and short school breaks.',
    keywords: ["kids' snack boxes", 'children snack box', 'divided snack container'],
  },
  {
    name: "Kids' Food Containers",
    slug: 'kids-food-containers',
    parentGroup: 'Feeding & Travel',
    expectedFilename: 'kids/feeding-travel/kids-food-containers.jpg',
    image: '/images/kids/feeding-travel/kids-food-containers.jpg',
    imageStatus: 'generated',
    description:
      'Latch-seal stainless steel and insulated kids food jars built to carry warm meals on trips and school days.',
    keywords: ["kids' food containers", 'insulated kids food jar', 'children meal box'],
  },
  {
    name: "Kids' Travel Bags",
    slug: 'kids-travel-bags',
    parentGroup: 'Feeding & Travel',
    expectedFilename: 'kids/feeding-travel/kids-travel-bags.jpg',
    image: '/images/kids/feeding-travel/kids-travel-bags.jpg',
    imageStatus: 'generated',
    description:
      'Lightweight overnight duffels and compact kids cabin trolley bags sized smoothly for family vacations.',
    keywords: ["kids' travel bags", 'children overnight duffel', 'kids rolling luggage'],
  },
  {
    name: "Kids' Cutlery",
    slug: 'kids-cutlery',
    parentGroup: 'Feeding & Travel',
    expectedFilename: 'kids/feeding-travel/kids-cutlery.jpg',
    image: '/images/kids/feeding-travel/kids-cutlery.jpg',
    imageStatus: 'generated',
    description:
      'Rounded stainless steel spoon and fork sets packaged inside travel-ready cases for school lunchboxes.',
    keywords: ["kids' cutlery", 'children spoon fork set', 'lunchbox cutlery kids'],
  },
];

export const INITIAL_KIDS_COLLECTIONS: KidsCollection[] = RAW_KIDS_COLLECTIONS.map(
  (item, idx) => {
    const groupMeta = GROUP_BY_NAME.get(item.parentGroup);
    return {
      id: `kids-col-${idx + 1}`,
      name: item.name,
      slug: item.slug,
      parentCategory: 'Kids',
      parentGroup: item.parentGroup,
      parentGroupSlug: groupMeta?.slug || 'boys-clothing',
      image: item.image,
      expectedFilename: item.expectedFilename,
      imageStatus: item.imageStatus || (item.image ? 'generated' : 'quota_pending'),
      description: item.description,
      keywords: item.keywords,
      status: 'approved',
      approved: true,
      displayOrder: idx + 1,
    };
  }
);

export function mergeKidsCollections(
  existing?: KidsCollection[] | null
): KidsCollection[] {
  const incoming = Array.isArray(existing) ? existing : [];
  const byIdOrSlug = new Map<string, KidsCollection>();
  for (const col of incoming) {
    if (col?.slug) byIdOrSlug.set(col.slug.toLowerCase(), col);
    if (col?.id) byIdOrSlug.set(col.id.toLowerCase(), col);
  }

  return INITIAL_KIDS_COLLECTIONS.map((seed) => {
    const found =
      byIdOrSlug.get(seed.id.toLowerCase()) ||
      byIdOrSlug.get(seed.slug.toLowerCase());
    if (!found) return seed;

    const validImage =
      found.imageStatus === 'uploaded' && found.image
        ? found.image
        : seed.image || found.image || '';

    const resolvedStatus: KidsCollection['imageStatus'] = validImage
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
      parentCategory: 'Kids',
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

export function getKidsCollectionPath(
  collection: Pick<KidsCollection, 'parentGroupSlug' | 'slug'>
): string {
  return `/kids/${collection.parentGroupSlug}/${collection.slug}`;
}

export function findKidsGroupBySlug(groupSlug: string): KidsGroupMeta | undefined {
  const norm = String(groupSlug || '')
    .trim()
    .toLowerCase();
  return KIDS_GROUPS.find(
    (g) =>
      g.slug.toLowerCase() === norm ||
      g.name.toLowerCase() === norm ||
      g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === norm
  );
}

export function findKidsCollection(
  collectionSlug: string,
  collections: KidsCollection[] = INITIAL_KIDS_COLLECTIONS,
  groupSlug?: string
): KidsCollection | undefined {
  const normSlug = String(collectionSlug || '')
    .trim()
    .toLowerCase();
  const normGroup = groupSlug ? findKidsGroupBySlug(groupSlug)?.name : undefined;

  return collections.find((c) => {
    if (normGroup && c.parentGroup !== normGroup) return false;
    return (
      c.slug.toLowerCase() === normSlug ||
      c.name.toLowerCase() === normSlug ||
      c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normSlug
    );
  });
}

export function productMatchesKidsCollection(
  product: Product,
  collection: KidsCollection
): boolean {
  const catLower = (product.category || '').toLowerCase();
  if (catLower !== 'kids') return false;

  const subLower = (product.subcategory || '').toLowerCase();
  const subSubLower = (product.subSubcategory || '').toLowerCase();
  const colSlug = collection.slug.toLowerCase();
  const colName = collection.name.toLowerCase();
  const groupName = collection.parentGroup.toLowerCase();

  if (subSubLower === colName || subSubLower === colSlug) {
    return true;
  }

  if (subLower === groupName || subLower === collection.parentGroupSlug) {
    if (subSubLower === colName || subSubLower === colSlug) return true;
  }

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

  return false;
}
