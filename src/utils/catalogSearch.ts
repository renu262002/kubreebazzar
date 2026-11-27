import type {
  AccessoriesCollection,
  CategoryInfo,
  DriedFruitCollection,
  DriedPeasCollection,
  ElectronicsCollection,
  FitnessGymCollection,
  FootwearCollection,
  FurnitureCollection,
  HairCareCollection,
  KidsCollection,
  MensFashionCollection,
  NutCollection,
  PranksNoveltiesCollection,
  Product,
  RiceCollection,
  SkinCareCollection,
  SportsCollection,
  TeenagersCollection,
  WomensFashionCollection,
} from '../types';
import {
  buildCategoryTree,
  getCategoryDisplayName,
  getSubcategoryDisplayName,
  getThirdLevelDisplayName,
  productMatchesFilter,
} from '../data/categoryHierarchy';
import {
  getMensFashionCollectionPath,
  INITIAL_MENS_FASHION_COLLECTIONS,
} from '../data/mensFashionCollections';
import {
  getWomensFashionCollectionPath,
  INITIAL_WOMENS_FASHION_COLLECTIONS,
} from '../data/womensFashionCollections';
import {
  getElectronicsCollectionPath,
  getElectronicsGroupsForCollection,
  INITIAL_ELECTRONICS_COLLECTIONS,
} from '../data/electronicsCollections';
import {
  getDriedFruitCollectionPath,
  INITIAL_DRIED_FRUITS_COLLECTIONS,
} from '../data/driedFruitsCollections';
import {
  getNutCollectionPath,
  INITIAL_NUTS_COLLECTIONS,
} from '../data/nutsCollections';
import {
  getSkinCareCollectionPath,
  INITIAL_SKIN_CARE_COLLECTIONS,
} from '../data/skinCareCollections';
import {
  getHairCareCollectionPath,
  INITIAL_HAIR_CARE_COLLECTIONS,
} from '../data/hairCareCollections';
import {
  getFurnitureCollectionPath,
  INITIAL_FURNITURE_COLLECTIONS,
} from '../data/furnitureCollections';
import {
  getDriedPeasCollectionPath,
  INITIAL_DRIED_PEAS_COLLECTIONS,
} from '../data/driedPeasCollections';
import {
  getPranksNoveltiesCollectionPath,
  INITIAL_PRANKS_NOVELTIES_COLLECTIONS,
} from '../data/pranksNoveltiesCollections';
import {
  getFitnessGymCollectionPath,
  INITIAL_FITNESS_GYM_COLLECTIONS,
} from '../data/fitnessGymCollections';
import {
  getAccessoriesCollectionPath,
  INITIAL_ACCESSORIES_COLLECTIONS,
} from '../data/accessoriesCollections';
import {
  getSportsCollectionPath,
  INITIAL_SPORTS_COLLECTIONS,
} from '../data/sportsCollections';
import {
  getFootwearCollectionPath,
  INITIAL_FOOTWEAR_COLLECTIONS,
} from '../data/footwearCollections';
import {
  getTeenagersCollectionPath,
  INITIAL_TEENAGERS_COLLECTIONS,
} from '../data/teenagersCollections';
import {
  getKidsCollectionPath,
  INITIAL_KIDS_COLLECTIONS,
} from '../data/kidsCollections';
import {
  getRiceCollectionPath,
  INITIAL_RICE_COLLECTIONS,
} from '../data/riceCollections';

export type AvailabilityFilter = 'all' | 'in-stock' | 'out-of-stock';

export type CatalogSortOption =
  | 'relevance'
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest'
  | 'rating';

export interface ScoredProductResult {
  product: Product;
  score: number;
}

export interface CategorySearchHit {
  id: string;
  name: string;
  slug: string;
  path: string;
  image?: string;
  parentName?: string;
  itemCount: number;
  score: number;
}

/**
 * Computes actual selling price (base + first variant delta minus discountPercent),
 * matching StoreContext's getEffectivePrice without importing React context on server.
 */
export function getProductSellingPrice(
  product: Product,
  variantId?: string
): number {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const variant = variants.find((v) => v.id === variantId) || variants[0];
  const base = Number(product.price || 0) + Number(variant ? variant.priceDelta : 0);
  const discounted = base * (1 - Number(product.discountPercent || 0) / 100);
  return Number(Math.max(0, discounted).toFixed(2));
}

export function normalizeSearchText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFC')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')
    .trim();
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Bidirectional Tamil <-> English & storefront keyword synonym groups.
 * Keep terms normalized (lowercase alphanumeric + single spaces).
 */
const SYNONYM_GROUPS: string[][] = [
  ['elakkai', 'elaka', 'elachi', 'elaichi', 'cardamom', 'green cardamom'],
  ['lavangam', 'grambu', 'laung', 'clove', 'cloves'],
  ['pattai', 'patai', 'dalchini', 'cinnamon'],
  ['seeragam', 'jeera', 'jeeragam', 'cumin', 'cumin seeds'],
  ['milagu', 'kurumilagu', 'black pepper', 'pepper', 'peppercorns'],
  ['manjal', 'virali manjal', 'turmeric'],
  ['perungayam', 'hing', 'asafoetida'],
  ['sombu', 'perum jeeragam', 'fennel', 'fennel seeds'],
  ['kadugu', 'mustard', 'mustard seeds'],
  ['vendhayam', 'methi', 'fenugreek'],
  ['dhaniya', 'kothamalli', 'coriander'],
  ['annasi poo', 'ananas poo', 'star anise'],
  ['jathikkai', 'nutmeg'],
  ['jathipathri', 'mace'],
  ['omam', 'ajwain', 'carom'],
  ['kalpasi', 'stone flower'],
  ['kadalai maavu', 'gram flour', 'besan'],
  ['pasi payaru', 'pasi payaru maavu', 'green gram', 'moong', 'moong dal'],
  ['kanmai', 'kajal'],
  ['drishti', 'thirusti', 'drishti kayiru', 'protective thread', 'nazar'],
  ['valayal', 'bangles', 'bangle'],
  ['vilakku', 'vilaku', 'kuthu vilakku', 'diya', 'lamp'],
  ['kungumam', 'kumkum'],
  ['santhanam', 'chandan', 'sandalwood'],
  ['soodam', 'sudam', 'karpooram', 'camphor'],
  ['oothupathi', 'agarbatti', 'incense', 'incense sticks'],
  ['panneer', 'panner', 'rose water'],
  ['thiri', 'cotton wick', 'wick', 'wicks'],
  ['thiruneeru', 'theruneer', 'vibhuti', 'sacred ash'],
  ['temple kit', 'temple', 'temple pooja', 'pooja', 'puja', 'pooja essentials'],
  ['thaen', 'honey'],
  ['arisi', 'rice', 'ponni', 'basmati', 'sona masoori', 'idli rice'],
  ['pattani', 'sundal', 'dried peas', 'dry peas'],
  ['dried chickpeas', 'chickpeas', 'kabuli chana', 'garbanzo beans'],
  ['black chickpeas', 'kala chana', 'desi chana', 'kondakadalai'],
  ['red kidney beans', 'kidney beans', 'rajma'],
  ['white kidney beans', 'cannellini beans', 'white rajma'],
  ['cowpeas', 'black eyed peas', 'lobia', 'karamani'],
  ['horse gram', 'kollu', 'kulthi'],
  ['moth beans', 'matki', 'turkish gram'],
  ['field beans', 'mochai', 'hyacinth beans'],
  ['dry nuts', 'nuts'],
  ['almonds', 'almond', 'badam'],
  ['cashew nuts', 'cashews', 'cashew', 'kaju'],
  ['walnuts', 'walnut', 'akhrot'],
  ['pistachios', 'pistachio', 'pista'],
  ['peanuts', 'peanut', 'groundnut', 'groundnuts'],
  ['hazelnuts', 'hazelnut', 'filbert', 'filberts'],
  ['pecans', 'pecan'],
  ['macadamia nuts', 'macadamia'],
  ['brazil nuts', 'brazil nut'],
  ['pine nuts', 'pine nut', 'chilgoza'],
  ['chestnuts', 'chestnut'],
  ['black walnuts', 'black walnut'],
  ['marcona almonds', 'marcona'],
  ['red skin peanuts', 'red-skin peanuts'],
  ['roasted cashews', 'roasted cashew'],
  ['dry fruits', 'dried fruits'],
  ['dried figs', 'figs', 'fig', 'anjeer'],
  ['raisins', 'raisin', 'kishmish'],
  ['dates', 'khajoor'],
  ['dried apricots', 'apricots', 'apricot', 'khubani'],
  ['dried cranberries', 'cranberries', 'cranberry'],
  ['prunes', 'prune', 'dried plums'],
  ['skin care', 'skincare'],
  ['face moisturizer', 'moisturizer', 'moisturiser', 'facial moisturizer'],
  ['vitamin c serum', 'vitamin c'],
  ['hyaluronic acid serum', 'hyaluronic acid'],
  ['exfoliating toner', 'face toner', 'toner'],
  ['hair care', 'haircare'],
  ['amla hair oil', 'amla oil', 'gooseberry hair oil'],
  ['coconut hair oil', 'coconut oil'],
  ['rosemary hair oil', 'rosemary oil'],
  ['heat protectant spray', 'thermal spray', 'heat protectant'],
  ['hair straightener', 'flat iron', 'straightener'],
  ['curling iron', 'hair curler', 'curling wand'],
  ['hair spray', 'hairspray'],
  ['hair scrunchies', 'scrunchies', 'scrunchie'],
  ['sofa', 'couch', 'settee', 'loveseat'],
  ['sofa cum bed', 'sofa bed', 'sleeper sofa', 'convertible sofa'],
  ['l shaped sofa', 'sectional sofa', 'corner sofa'],
  ['wardrobe', 'almirah', 'cupboard', 'closet'],
  ['bookshelf', 'bookcase', 'book rack'],
  ['chest of drawers', 'drawer cabinet', 'dresser chest'],
  ['tv unit', 'tv stand', 'tv console', 'entertainment unit'],
  ['bedside table', 'nightstand', 'side table'],
  ['dressing table', 'vanity table', 'vanity'],
  ['study table', 'study desk', 'writing desk'],
  ['coffee table', 'center table', 'teapoy'],
  ['shoe rack', 'shoe cabinet', 'footwear rack'],
  ['gym', 'fitness', 'fitness gym', 'workout', 'dumbbell'],
  ['prank items', 'prank', 'pranks', 'novelties', 'pranks novelties'],
  ['used bikes and cars', 'used bikes', 'used cars', 'bike', 'bikes', 'car', 'cars', 'scooter'],
  ['teenager', 'teenagers', 'teen'],
  ['baby kit', 'baby', 'newborn', 'infant'],
  ['school kit', 'school', 'stationery', 'student'],
  ['chilli', 'chili', 'milagai', 'red chilli'],
  ['karuveppilai', 'curry leaves'],
  ['puli', 'tamarind'],
  ['vellam', 'jaggery'],
  ['nattu sakkarai', 'palm jaggery', 'karupatti'],
  ['ulundhu', 'urad dal', 'black gram'],
  ['thuvaram paruppu', 'toor dal'],
  ['thinai', 'foxtail millet', 'தினை'],
  ['ragi', 'kelvaragu', 'kezhvaragu', 'finger millet', 'கேழ்வரகு'],
  ['kambu', 'bajra', 'pearl millet', 'கம்பு'],
  ['panivaragu', 'proso millet', 'பனிவரகு'],
  ['solam', 'cholam', 'jowar', 'sorghum', 'சோளம்'],
  ['samai', 'saamai', 'little millet', 'சாமை'],
  ['varagu', 'kodo millet', 'வரகு'],
  ['korali', 'browntop millet', 'brwontop millet', 'கொரளி'],
  ['kuthiraivali', 'kudiraivali', 'barnyard millet', 'குதிரைவாலி'],
  ['wheat', 'whole wheat'],
  ['maize', 'corn', 'maize corn'],
  ['oats', 'rolled oats'],
  ['barley', 'pearl barley', 'hulled barley'],
  ['vermicelli', 'semiya', 'seviyan'],
  ['idiyappam', 'string hoppers', 'nool puttu'],
  ['puttu', 'pittu', 'puttu flour', 'puttu maavu'],
  ['chapati', 'chappathi', 'roti', 'chapati dough'],
  ['poori', 'puri', 'poori dough'],
  ['idli', 'idly', 'idli batter', 'rava idli'],
  ['dosa', 'dosai', 'dosa batter', 'rava dosa'],
  ['upma', 'uppuma', 'upma mix'],
  ['pongal', 'ven pongal', 'pongal mix'],
  ['adai', 'adai dosa', 'adai mix'],
  ['appam', 'palappam', 'appam mix'],
  ['payasam', 'kheer', 'payasam mix'],
  ['gulab jamun', 'jamun mix', 'gulab jamun mix'],
  ['ready to cook', 'instant mix', 'batter', 'dough'],
  ['t shirts', 't shirt', 'tshirts', 'tshirt', 'tee', 'tees'],
  ['v neck', 'vneck'],
  ['round neck', 'crew neck', 'crewneck'],
  ['chino', 'chinos'],
  ['jogger', 'joggers'],
  ['wide leg', 'wideleg'],
  ['checked', 'checkered', 'plaid'],
  ['denim', 'jeans'],
  ['churidar', 'chudithar', 'churidar sets'],
  ['salwar', 'salwar kameez', 'punjabi suit'],
  ['anarkali', 'anarkali suit', 'anarkali suits'],
  ['sharara', 'sharara set', 'sharara sets', 'gharara'],
  ['palazzo', 'palazzo pants', 'palazzos'],
  ['half saree', 'traditional half sarees', 'pavadai dhavani', 'langa voni'],
  ['saree', 'sarees', 'sari'],
  ['banarasi', 'banarasi saree', 'banarasi sarees'],
  ['kanjivaram', 'kanjivaram saree', 'kanjivaram sarees', 'kanchipuram'],
  ['lehenga', 'lehengas', 'lehnga'],
  ['lehenga choli', 'lehenga choli sets', 'ghagra choli', 'chaniya choli'],
  ['shawls', 'stoles', 'shawls stoles', 'shawl', 'stole'],
  ['woollen shawl', 'woollen shawls', 'pashmina', 'pashmina shawl'],
  ['nightwear', 'nightwear sets', 'pajama', 'pyjama', 'sleepwear'],
  ['nightgown', 'nightgowns', 'nighty', 'sleep dress'],
  ['long coat', 'long coats'],
  ['trench coat', 'trench coats', 'rain trench'],
  ['overcoat', 'overcoats'],
  ['longline blazer', 'longline blazers', 'long blazer'],
  ['track pants', 'womens track pants', 'trackpants'],
  ['korean fashion', 'k fashion', 'korean outfit'],
  ['culottes', 'gaucho pants'],
  ['peplum', 'peplum top', 'peplum tops'],
  ['tunic', 'tunic top', 'tunic tops'],
  ['off shoulder', 'off shoulder top', 'off shoulder tops', 'bardot'],
  ['blouse', 'blouses'],
  ['crop top', 'crop tops'],
];

const TOKEN_SYNONYM_MAP = new Map<string, string[]>();
for (const group of SYNONYM_GROUPS) {
  for (const term of group) {
    const existing = TOKEN_SYNONYM_MAP.get(term) || [];
    const merged = Array.from(new Set([...existing, ...group]));
    TOKEN_SYNONYM_MAP.set(term, merged);
  }
}

interface ParsedQuery {
  normalized: string;
  tokens: string[];
  /** Phrase-level alternative equivalents (normalized) */
  phraseAlternatives: string[];
  /** Each token expanded into its equivalent search candidates */
  tokenGroups: string[][];
}

function parseSearchQuery(rawQuery: string): ParsedQuery {
  const normalized = normalizeSearchText(rawQuery);
  if (!normalized) {
    return {
      normalized: '',
      tokens: [],
      phraseAlternatives: [],
      tokenGroups: [],
    };
  }

  const phraseSynonyms = TOKEN_SYNONYM_MAP.get(normalized) || [normalized];
  const tokens = normalized.split(' ').filter(Boolean);

  // If the whole normalized query directly matches a synonym group (like "temple kit" or "kadalai maavu"),
  // also allow single-phrase match against any group alternative in addition to token-level matching.
  const tokenGroups = tokens.map((token) => {
    const mapped = TOKEN_SYNONYM_MAP.get(token);
    return mapped ? Array.from(new Set([token, ...mapped])) : [token];
  });

  return {
    normalized,
    tokens,
    phraseAlternatives: Array.from(new Set([normalized, ...phraseSynonyms])),
    tokenGroups,
  };
}

/**
 * Matches a candidate phrase/word against a normalized haystack using word-prefix boundary
 * so "rice" matches "rice", "rices", "rice flour", etc., without false-matching "price" or "choice".
 * Also checks direct substring match on primary short labels (name/category/brand) for terms >= 4 chars
 * so compound words like "sunscreen" still match "screen" or "earbuds" match "buds".
 */
function textMatchesCandidate(
  haystack: string,
  candidate: string,
  allowInteriorSubstring = false
): boolean {
  if (!haystack || !candidate) return false;
  if (haystack === candidate) return true;
  const pattern = `(?:^|\\s)${escapeRegExp(candidate)}`;
  if (new RegExp(pattern, 'i').test(haystack)) {
    return true;
  }
  if (allowInteriorSubstring && candidate.length >= 4 && haystack.includes(candidate)) {
    return true;
  }
  return false;
}

interface ProductSearchIndex {
  name: string;
  tamilName: string;
  category: string;
  displayCategory: string;
  subcategory: string;
  displaySubcategory: string;
  subSubcategory: string;
  displayThird: string;
  brand: string;
  tags: string;
  shortDescription: string;
  description: string;
  specs: string;
  primaryCombined: string;
  fullCombined: string;
}

function buildProductSearchIndex(
  product: Product,
  categories: CategoryInfo[]
): ProductSearchIndex {
  const name = normalizeSearchText(product.name);
  const tamilName = normalizeSearchText(product.tamilName || '');
  const category = normalizeSearchText(product.category);
  const displayCategory = normalizeSearchText(
    getCategoryDisplayName(product.category, categories)
  );
  const subcategory = normalizeSearchText(product.subcategory || '');
  const displaySubcategory = normalizeSearchText(
    getSubcategoryDisplayName(product.subcategory)
  );
  const subSubcategory = normalizeSearchText(product.subSubcategory || '');
  const displayThird = normalizeSearchText(
    getThirdLevelDisplayName(product.subSubcategory)
  );
  const brand = normalizeSearchText(product.brand || '');
  const tags = normalizeSearchText(
    [product.tag || '', ...(product.tags || [])].join(' ')
  );
  const shortDescription = normalizeSearchText(product.shortDescription || '');
  const description = normalizeSearchText(product.description || '');
  const specs = normalizeSearchText(
    (product.specs || []).map((s) => `${s.label} ${s.value}`).join(' ')
  );

  const primaryCombined = [
    name,
    tamilName,
    category,
    displayCategory,
    subcategory,
    displaySubcategory,
    subSubcategory,
    displayThird,
    brand,
    tags,
  ]
    .filter(Boolean)
    .join(' ');

  const fullCombined = [
    primaryCombined,
    shortDescription,
    description,
    specs,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    name,
    tamilName,
    category,
    displayCategory,
    subcategory,
    displaySubcategory,
    subSubcategory,
    displayThird,
    brand,
    tags,
    shortDescription,
    description,
    specs,
    primaryCombined,
    fullCombined,
  };
}

export function scoreProductMatch(
  product: Product,
  categories: CategoryInfo[],
  rawQuery: string
): number {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return 1;

  const idx = buildProductSearchIndex(product, categories);

  // Determine whether whole phrase synonym OR every token group matches somewhere in fullCombined
  const directPhraseMatched = parsed.phraseAlternatives.some((phrase) =>
    textMatchesCandidate(idx.fullCombined, phrase, true)
  );
  const allTokensMatched =
    parsed.tokenGroups.length > 0 &&
    parsed.tokenGroups.every((group) =>
      group.some((candidate) =>
        textMatchesCandidate(
          idx.fullCombined,
          candidate,
          // Allow interior substring check against primary fields (name/cat/brand/tags)
          false
        ) ||
        textMatchesCandidate(idx.primaryCombined, candidate, true)
      )
    );

  if (!directPhraseMatched && !allTokensMatched) {
    return 0;
  }

  let score = 0;

  // 1. Exact or phrase match in Product Name / Tamil Name (highest priority)
  const titleCombined = [idx.name, idx.tamilName].filter(Boolean).join(' ');
  if (idx.name === parsed.normalized || idx.tamilName === parsed.normalized) {
    score += 300;
  } else if (
    parsed.phraseAlternatives.some((p) => idx.name === p || idx.tamilName === p)
  ) {
    score += 260;
  } else if (
    idx.name.startsWith(parsed.normalized) ||
    idx.tamilName.startsWith(parsed.normalized)
  ) {
    score += 200;
  } else if (
    parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(titleCombined, p, true)
    )
  ) {
    score += 170;
  } else if (
    parsed.tokenGroups.every((group) =>
      group.some((c) => textMatchesCandidate(titleCombined, c, true))
    )
  ) {
    score += 135;
  } else if (
    parsed.tokenGroups.some((group) =>
      group.some((c) => textMatchesCandidate(titleCombined, c, true))
    )
  ) {
    score += 75;
  }

  // 2. Category / Subcategory / 3rd-level matches
  const catFields = [
    idx.category,
    idx.displayCategory,
    idx.subcategory,
    idx.displaySubcategory,
    idx.subSubcategory,
    idx.displayThird,
  ].filter(Boolean);

  if (
    catFields.some((f) =>
      parsed.phraseAlternatives.some((p) => f === p)
    )
  ) {
    score += 120;
  } else if (
    catFields.some((f) =>
      parsed.phraseAlternatives.some((p) => textMatchesCandidate(f, p, true))
    ) ||
    parsed.tokenGroups.every((group) =>
      group.some((c) =>
        catFields.some((f) => textMatchesCandidate(f, c, true))
      )
    )
  ) {
    score += 90;
  } else if (
    parsed.tokenGroups.some((group) =>
      group.some((c) =>
        catFields.some((f) => textMatchesCandidate(f, c, true))
      )
    )
  ) {
    score += 45;
  }

  // 3. Brand / Tags matches
  if (
    parsed.phraseAlternatives.some(
      (p) =>
        textMatchesCandidate(idx.brand, p, true) ||
        textMatchesCandidate(idx.tags, p, true)
    ) ||
    parsed.tokenGroups.every((group) =>
      group.some(
        (c) =>
          textMatchesCandidate(idx.brand, c, true) ||
          textMatchesCandidate(idx.tags, c, true)
      )
    )
  ) {
    score += 55;
  }

  // 4. Short description, full description, specs
  if (
    parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(idx.shortDescription, p, false)
    ) ||
    parsed.tokenGroups.every((group) =>
      group.some((c) => textMatchesCandidate(idx.shortDescription, c, false))
    )
  ) {
    score += 30;
  }
  if (
    parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(idx.description, p, false)
    ) ||
    parsed.tokenGroups.every((group) =>
      group.some((c) => textMatchesCandidate(idx.description, c, false))
    )
  ) {
    score += 15;
  }
  if (
    parsed.tokenGroups.some((group) =>
      group.some((c) => textMatchesCandidate(idx.specs, c, false))
    )
  ) {
    score += 10;
  }

  // Small quality tie-breakers
  if (product.featured) score += 4;
  if (product.bestSeller) score += 3;
  if (product.stock > 0) score += 2;
  score += Math.min(2, Number(product.rating || 0) * 0.4);

  return score;
}

export function searchProducts(
  products: Product[],
  categories: CategoryInfo[],
  rawQuery: string,
  options: { includeDisabled?: boolean } = {}
): ScoredProductResult[] {
  const includeDisabled = Boolean(options.includeDisabled);
  const seenIds = new Set<string>();
  const results: ScoredProductResult[] = [];

  for (const product of products) {
    if (!product || !product.id || seenIds.has(product.id)) continue;
    if (!includeDisabled && product.enabled === false) continue;

    const score = scoreProductMatch(product, categories, rawQuery);
    if (score > 0) {
      seenIds.add(product.id);
      results.push({ product, score });
    }
  }

  if (normalizeSearchText(rawQuery)) {
    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.product.name || '').localeCompare(b.product.name || '');
    });
  }

  return results;
}

export function searchMatchingCategories(
  categories: CategoryInfo[],
  products: Product[],
  rawQuery: string
): CategorySearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const activeProducts = products.filter((p) => p.enabled !== false);
  const tree = buildCategoryTree(categories);
  const hits: CategorySearchHit[] = [];
  const seenPaths = new Set<string>();

  for (const main of tree) {
    const mainHaystack = normalizeSearchText(
      [
        main.id,
        main.name,
        main.slug,
        main.subtitle,
        main.description,
        ...main.subcategories.map((s) => s.name),
      ].join(' ')
    );
    const mainNameNorm = normalizeSearchText(main.name);
    const mainIdNorm = normalizeSearchText(main.id);

    const exactMain =
      parsed.phraseAlternatives.some(
        (p) => mainNameNorm === p || mainIdNorm === p
      );
    const phraseMain = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(mainNameNorm, p, true) ||
      textMatchesCandidate(mainIdNorm, p, true)
    );
    const tokensMain =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(mainHaystack, c, true))
      );

    if (exactMain || phraseMain || tokensMain) {
      const count = activeProducts.filter((p) =>
        productMatchesFilter(p, main.id, 'All', 'All', categories)
      ).length;
      const score = exactMain ? 250 : phraseMain ? 160 : 90;
      if (!seenPaths.has(main.path)) {
        seenPaths.add(main.path);
        hits.push({
          id: main.id,
          name: main.name,
          slug: main.slug,
          path: main.path,
          image: main.image,
          itemCount: count,
          score,
        });
      }
    }

    for (const sub of main.subcategories) {
      const subNorm = normalizeSearchText(sub.name);
      const subCombined = normalizeSearchText(
        [sub.name, sub.slug, ...sub.children.map((c) => c.name)].join(' ')
      );
      const exactSub = parsed.phraseAlternatives.some((p) => subNorm === p);
      const phraseSub = parsed.phraseAlternatives.some((p) =>
        textMatchesCandidate(subNorm, p, true)
      );
      const tokensSub =
        parsed.tokenGroups.length > 0 &&
        parsed.tokenGroups.every((group) =>
          group.some((c) => textMatchesCandidate(subCombined, c, true))
        );

      if (exactSub || phraseSub || tokensSub) {
        const count = activeProducts.filter((p) =>
          productMatchesFilter(p, main.id, sub.name, 'All', categories)
        ).length;
        const score = exactSub ? 220 : phraseSub ? 140 : 75;
        if (!seenPaths.has(sub.path)) {
          seenPaths.add(sub.path);
          hits.push({
            id: `${main.id}::${sub.name}`,
            name: sub.name,
            slug: sub.slug,
            path: sub.path,
            image: main.image,
            parentName: main.name,
            itemCount: count,
            score,
          });
        }
      }

      for (const third of sub.children) {
        const thirdNorm = normalizeSearchText(third.name);
        const exactThird = parsed.phraseAlternatives.some((p) => thirdNorm === p);
        const phraseThird = parsed.phraseAlternatives.some((p) =>
          textMatchesCandidate(thirdNorm, p, true)
        );
        if (exactThird || phraseThird) {
          const count = activeProducts.filter((p) =>
            productMatchesFilter(p, main.id, sub.name, third.name, categories)
          ).length;
          const score = exactThird ? 210 : 130;
          if (!seenPaths.has(third.path)) {
            seenPaths.add(third.path);
            hits.push({
              id: third.id,
              name: third.name,
              slug: third.slug,
              path: third.path,
              image: main.image,
              parentName: `${main.name} › ${sub.name}`,
              itemCount: count,
              score,
            });
          }
        }

        for (const fourth of third.children || []) {
          const fourthNorm = normalizeSearchText(fourth.name);
          const exactFourth = parsed.phraseAlternatives.some(
            (p) => fourthNorm === p
          );
          const phraseFourth = parsed.phraseAlternatives.some((p) =>
            textMatchesCandidate(fourthNorm, p, true)
          );
          if (exactFourth || phraseFourth) {
            const count = activeProducts.filter((p) =>
              productMatchesFilter(p, main.id, sub.name, fourth.name, categories)
            ).length;
            const score = exactFourth ? 215 : 135;
            if (!seenPaths.has(fourth.path)) {
              seenPaths.add(fourth.path);
              hits.push({
                id: fourth.id,
                name: fourth.name,
                slug: fourth.slug,
                path: fourth.path,
                image: main.image,
                parentName: `${main.name} › ${sub.name} › ${third.name}`,
                itemCount: count,
                score,
              });
            }
          }
        }
      }
    }
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.itemCount - a.itemCount;
  });

  return hits;
}

export interface MensFashionCollectionSearchHit {
  id: string;
  name: string;
  slug: string;
  parentCategory: string;
  parentSlug: string;
  path: string;
  image: string;
  description: string;
  sectionLabel?:
    | "Men's Fashion"
    | "Women's Fashion"
    | 'Electronics'
    | 'Dried Fruits'
    | 'Nuts'
    | 'Skin Care'
    | 'Hair Care'
    | 'Furniture'
    | 'Dried Peas'
    | 'Pranks & Novelties'
    | 'Fitness & Gym'
    | 'Accessories'
    | 'Sports'
    | 'Footwear'
    | 'Teenagers'
    | 'Kids'
    | 'Rice';
  score: number;
}

export function searchMensFashionCollections(
  rawQuery: string,
  collections: MensFashionCollection[] = INITIAL_MENS_FASHION_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    const nameNorm = normalizeSearchText(col.name);
    const parentNorm = normalizeSearchText(col.parentCategory);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      parentNorm,
      'mens fashion',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 350;
    else if (exactName) score = 315;
    else if (nameNorm.startsWith(parsed.normalized)) score = 260;
    else if (phraseName) score = 220;
    else if (allTokensInName) score = 180;
    else score = 110;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentCategory,
      parentSlug: col.parentSlug,
      path: getMensFashionCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: "Men's Fashion",
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchWomensFashionCollections(
  rawQuery: string,
  collections: WomensFashionCollection[] = INITIAL_WOMENS_FASHION_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const parentNorm = normalizeSearchText(col.parentCategory);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      parentNorm,
      'women womens fashion',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 355;
    else if (exactName) score = 320;
    else if (nameNorm.startsWith(parsed.normalized)) score = 265;
    else if (phraseName) score = 225;
    else if (allTokensInName) score = 185;
    else score = 115;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentCategory,
      parentSlug: col.parentSlug,
      path: getWomensFashionCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: "Women's Fashion",
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchElectronicsCollections(
  rawQuery: string,
  collections: ElectronicsCollection[] = INITIAL_ELECTRONICS_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupsNorm = normalizeSearchText(
      getElectronicsGroupsForCollection(col).join(' ')
    );
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupsNorm,
      'electronics',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 360;
    else if (exactName) score = 325;
    else if (nameNorm.startsWith(parsed.normalized)) score = 270;
    else if (phraseName) score = 230;
    else if (allTokensInName) score = 190;
    else score = 120;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentGroup,
      parentSlug: col.parentSlug,
      path: getElectronicsCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Electronics',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchDriedFruitsCollections(
  rawQuery: string,
  collections: DriedFruitCollection[] = INITIAL_DRIED_FRUITS_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.varietyGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'dried fruits dry fruits',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 365;
    else if (exactName) score = 330;
    else if (nameNorm.startsWith(parsed.normalized)) score = 275;
    else if (phraseName) score = 235;
    else if (allTokensInName) score = 195;
    else score = 125;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentCategory,
      parentSlug: col.parentSlug,
      path: getDriedFruitCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Dried Fruits',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchNutsCollections(
  rawQuery: string,
  collections: NutCollection[] = INITIAL_NUTS_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.varietyGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'nuts dry nuts',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 370;
    else if (exactName) score = 335;
    else if (nameNorm.startsWith(parsed.normalized)) score = 280;
    else if (phraseName) score = 240;
    else if (allTokensInName) score = 200;
    else score = 130;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentCategory,
      parentSlug: col.parentSlug,
      path: getNutCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Nuts',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchSkinCareCollections(
  rawQuery: string,
  collections: SkinCareCollection[] = INITIAL_SKIN_CARE_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.parentGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'skin care skincare',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 375;
    else if (exactName) score = 340;
    else if (nameNorm.startsWith(parsed.normalized)) score = 285;
    else if (phraseName) score = 245;
    else if (allTokensInName) score = 205;
    else score = 135;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentGroup,
      parentSlug: col.parentGroupSlug,
      path: getSkinCareCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Skin Care',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchHairCareCollections(
  rawQuery: string,
  collections: HairCareCollection[] = INITIAL_HAIR_CARE_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.parentGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'hair care haircare',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 380;
    else if (exactName) score = 345;
    else if (nameNorm.startsWith(parsed.normalized)) score = 290;
    else if (phraseName) score = 250;
    else if (allTokensInName) score = 210;
    else score = 140;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentGroup,
      parentSlug: col.parentGroupSlug,
      path: getHairCareCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Hair Care',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchFurnitureCollections(
  rawQuery: string,
  collections: FurnitureCollection[] = INITIAL_FURNITURE_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.parentGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'furniture',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 380;
    else if (exactName) score = 345;
    else if (nameNorm.startsWith(parsed.normalized)) score = 290;
    else if (phraseName) score = 250;
    else if (allTokensInName) score = 210;
    else score = 140;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentGroup,
      parentSlug: col.parentGroupSlug,
      path: getFurnitureCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Furniture',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchDriedPeasCollections(
  rawQuery: string,
  collections: DriedPeasCollection[] = INITIAL_DRIED_PEAS_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.parentGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'dried peas dry peas pulses legumes',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 380;
    else if (exactName) score = 345;
    else if (nameNorm.startsWith(parsed.normalized)) score = 290;
    else if (phraseName) score = 250;
    else if (allTokensInName) score = 210;
    else score = 140;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentGroup,
      parentSlug: col.parentGroupSlug,
      path: getDriedPeasCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Dried Peas',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchPranksNoveltiesCollections(
  rawQuery: string,
  collections: PranksNoveltiesCollection[] = INITIAL_PRANKS_NOVELTIES_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.parentGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'pranks novelties prank items gag gifts',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 380;
    else if (exactName) score = 345;
    else if (nameNorm.startsWith(parsed.normalized)) score = 290;
    else if (phraseName) score = 250;
    else if (allTokensInName) score = 210;
    else score = 140;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentGroup,
      parentSlug: col.parentGroupSlug,
      path: getPranksNoveltiesCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Pranks & Novelties',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchFitnessGymCollections(
  rawQuery: string,
  collections: FitnessGymCollection[] = INITIAL_FITNESS_GYM_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.parentGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'fitness gym workout exercise equipment weights cardio yoga',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 380;
    else if (exactName) score = 345;
    else if (nameNorm.startsWith(parsed.normalized)) score = 290;
    else if (phraseName) score = 250;
    else if (allTokensInName) score = 210;
    else score = 140;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentGroup,
      parentSlug: col.parentGroupSlug,
      path: getFitnessGymCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Fitness & Gym',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchAccessoriesCollections(
  rawQuery: string,
  collections: AccessoriesCollection[] = INITIAL_ACCESSORIES_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.parentGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'accessories fashion watches bags wallets jewellery eyewear belts travel phone',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 385;
    else if (exactName) score = 350;
    else if (nameNorm.startsWith(parsed.normalized)) score = 295;
    else if (phraseName) score = 255;
    else if (allTokensInName) score = 215;
    else score = 145;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentGroup,
      parentSlug: col.parentGroupSlug,
      path: getAccessoriesCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Accessories',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchSportsCollections(
  rawQuery: string,
  collections: SportsCollection[] = INITIAL_SPORTS_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.parentGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'sports equipment cricket football badminton tennis volleyball basketball table tennis swimming cycling outdoor',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 390;
    else if (exactName) score = 355;
    else if (nameNorm.startsWith(parsed.normalized)) score = 300;
    else if (phraseName) score = 260;
    else if (allTokensInName) score = 220;
    else score = 150;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentGroup,
      parentSlug: col.parentGroupSlug,
      path: getSportsCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Sports',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchFootwearCollections(
  rawQuery: string,
  collections: FootwearCollection[] = INITIAL_FOOTWEAR_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.parentGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'footwear shoes sneakers sandals boots slippers loafers heels flats wedges bellies school shoes kolhapuri chappals juttis mojaris',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 395;
    else if (exactName) score = 360;
    else if (nameNorm.startsWith(parsed.normalized)) score = 305;
    else if (phraseName) score = 265;
    else if (allTokensInName) score = 225;
    else score = 155;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentGroup,
      parentSlug: col.parentGroupSlug,
      path: getFootwearCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Footwear',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchTeenagersCollections(
  rawQuery: string,
  collections: TeenagersCollection[] = INITIAL_TEENAGERS_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.parentGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'teenagers teen boys fashion girls fashion footwear school college essentials electronics gadgets personal care sports fitness room lifestyle hobbies creativity',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 398;
    else if (exactName) score = 362;
    else if (nameNorm.startsWith(parsed.normalized)) score = 308;
    else if (phraseName) score = 268;
    else if (allTokensInName) score = 228;
    else score = 158;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentGroup,
      parentSlug: col.parentGroupSlug,
      path: getTeenagersCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Teenagers',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchKidsCollections(
  rawQuery: string,
  collections: KidsCollection[] = INITIAL_KIDS_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.parentGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'kids children boys clothing girls clothing footwear school essentials toys games learning creativity accessories personal care sports outdoor bedroom lifestyle feeding travel',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 398;
    else if (exactName) score = 362;
    else if (nameNorm.startsWith(parsed.normalized)) score = 308;
    else if (phraseName) score = 268;
    else if (allTokensInName) score = 228;
    else score = 158;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: col.parentGroup,
      parentSlug: col.parentGroupSlug,
      path: getKidsCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Kids',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export function searchRiceCollections(
  rawQuery: string,
  collections: RiceCollection[] = INITIAL_RICE_COLLECTIONS
): MensFashionCollectionSearchHit[] {
  const parsed = parseSearchQuery(rawQuery);
  if (!parsed.normalized) return [];

  const hits: MensFashionCollectionSearchHit[] = [];

  for (const col of collections) {
    if (col.status === 'pending_approval') continue;
    const nameNorm = normalizeSearchText(col.name);
    const groupNorm = normalizeSearchText(col.parentGroup);
    const keywordsNorm = normalizeSearchText((col.keywords || []).join(' '));
    const descNorm = normalizeSearchText(col.description);
    const fullNorm = [
      nameNorm,
      groupNorm,
      'groceries rice breakfast lunch dinner grains arisi',
      keywordsNorm,
      descNorm,
    ]
      .filter(Boolean)
      .join(' ');

    const directExact = nameNorm === parsed.normalized;
    const exactName = parsed.phraseAlternatives.some((p) => nameNorm === p);
    const phraseName = parsed.phraseAlternatives.some((p) =>
      textMatchesCandidate(nameNorm, p, true)
    );
    const allTokensInName =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(nameNorm, c, true))
      );
    const allTokensInFull =
      parsed.tokenGroups.length > 0 &&
      parsed.tokenGroups.every((group) =>
        group.some((c) => textMatchesCandidate(fullNorm, c, true))
      );

    if (!exactName && !phraseName && !allTokensInName && !allTokensInFull) {
      continue;
    }

    let score = 0;
    if (directExact) score = 398;
    else if (exactName) score = 362;
    else if (nameNorm.startsWith(parsed.normalized)) score = 308;
    else if (phraseName) score = 268;
    else if (allTokensInName) score = 228;
    else score = 158;

    hits.push({
      id: col.id,
      name: col.name,
      slug: col.slug,
      parentCategory: `${col.parentGroup} Rice`,
      parentSlug: col.parentGroupSlug,
      path: getRiceCollectionPath(col),
      image: col.image,
      description: col.description,
      sectionLabel: 'Rice',
      score,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return hits;
}

export interface FilterAndSortParams {
  query?: string;
  category?: string;
  subcategory?: string;
  subSubcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: AvailabilityFilter;
  minRating?: number;
  featuredOnly?: boolean;
  sortBy?: CatalogSortOption;
  includeDisabled?: boolean;
}

export function filterAndSortProducts(
  products: Product[],
  categories: CategoryInfo[],
  params: FilterAndSortParams = {}
): Product[] {
  const {
    query = '',
    category = 'All',
    subcategory = 'All',
    subSubcategory = 'All',
    minPrice,
    maxPrice,
    availability = 'all',
    minRating = 0,
    featuredOnly = false,
    sortBy = query.trim() ? 'relevance' : 'featured',
    includeDisabled = false,
  } = params;

  const hasQuery = Boolean(normalizeSearchText(query));
  const scoredList: ScoredProductResult[] = hasQuery
    ? searchProducts(products, categories, query, { includeDisabled })
    : products
        .filter((p) => includeDisabled || p.enabled !== false)
        .map((product) => ({ product, score: 0 }));

  // Deduplicate defensively and apply filters
  const seen = new Set<string>();
  const filtered = scoredList.filter(({ product }) => {
    if (!product || !product.id || seen.has(product.id)) return false;
    seen.add(product.id);

    if (
      (category && category !== 'All') ||
      (subcategory && subcategory !== 'All') ||
      (subSubcategory && subSubcategory !== 'All')
    ) {
      if (
        !productMatchesFilter(
          product,
          category || 'All',
          subcategory || 'All',
          subSubcategory || 'All',
          categories
        )
      ) {
        return false;
      }
    }

    if (featuredOnly && !product.featured) return false;

    if (availability === 'in-stock' && Number(product.stock || 0) <= 0) {
      return false;
    }
    if (availability === 'out-of-stock' && Number(product.stock || 0) > 0) {
      return false;
    }

    if (minRating > 0 && Number(product.rating || 0) < minRating) {
      return false;
    }

    const sellingPrice = getProductSellingPrice(product);
    if (minPrice !== undefined && !Number.isNaN(minPrice) && sellingPrice < minPrice) {
      return false;
    }
    if (maxPrice !== undefined && !Number.isNaN(maxPrice) && sellingPrice > maxPrice) {
      return false;
    }

    return true;
  });

  switch (sortBy) {
    case 'relevance':
      if (hasQuery) {
        filtered.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return (a.product.name || '').localeCompare(b.product.name || '');
        });
      } else {
        filtered.sort(
          (a, b) => Number(b.product.featured) - Number(a.product.featured)
        );
      }
      break;
    case 'price-asc':
      filtered.sort(
        (a, b) =>
          getProductSellingPrice(a.product) - getProductSellingPrice(b.product)
      );
      break;
    case 'price-desc':
      filtered.sort(
        (a, b) =>
          getProductSellingPrice(b.product) - getProductSellingPrice(a.product)
      );
      break;
    case 'name-asc':
      filtered.sort((a, b) =>
        (a.product.name || '').localeCompare(b.product.name || '')
      );
      break;
    case 'name-desc':
      filtered.sort((a, b) =>
        (b.product.name || '').localeCompare(a.product.name || '')
      );
      break;
    case 'rating':
      filtered.sort(
        (a, b) => Number(b.product.rating || 0) - Number(a.product.rating || 0)
      );
      break;
    case 'newest':
      filtered.sort(
        (a, b) =>
          new Date(b.product.createdAt || 0).getTime() -
          new Date(a.product.createdAt || 0).getTime()
      );
      break;
    case 'featured':
    default:
      filtered.sort((a, b) => {
        if (Number(b.product.featured) !== Number(a.product.featured)) {
          return Number(b.product.featured) - Number(a.product.featured);
        }
        return b.score - a.score;
      });
      break;
  }

  return filtered.map((entry) => entry.product);
}
