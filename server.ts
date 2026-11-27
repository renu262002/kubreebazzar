import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import type {
  AdminActivityLog,
  AdminRoleKey,
  Product,
  CategoryInfo,
  User,
  CartItem,
  Order,
  Coupon,
  PromoBanner,
  DeliveryStatus,
  ProductReview,
  NewsletterSubscriber,
  SiteSettings,
  MensFashionCollection,
  WomensFashionCollection,
  ElectronicsCollection,
  DriedFruitCollection,
  NutCollection,
  SkinCareCollection,
  HairCareCollection,
  FurnitureCollection,
  DriedPeasCollection,
  PranksNoveltiesCollection,
  FitnessGymCollection,
  AccessoriesCollection,
  SportsCollection,
  FootwearCollection,
  TeenagersCollection,
  KidsCollection,
} from './src/types.ts';
import {
  INITIAL_CATEGORIES,
  generate48Products,
} from './server/catalogSeed.ts';
import {
  INITIAL_MENS_FASHION_COLLECTIONS,
  mergeMensFashionCollections,
} from './src/data/mensFashionCollections.ts';
import {
  INITIAL_WOMENS_FASHION_COLLECTIONS,
  mergeWomensFashionCollections,
} from './src/data/womensFashionCollections.ts';
import {
  INITIAL_ELECTRONICS_COLLECTIONS,
  mergeElectronicsCollections,
} from './src/data/electronicsCollections.ts';
import {
  INITIAL_DRIED_FRUITS_COLLECTIONS,
  mergeDriedFruitsCollections,
} from './src/data/driedFruitsCollections.ts';
import {
  INITIAL_NUTS_COLLECTIONS,
  mergeNutsCollections,
} from './src/data/nutsCollections.ts';
import {
  INITIAL_SKIN_CARE_COLLECTIONS,
  mergeSkinCareCollections,
} from './src/data/skinCareCollections.ts';
import {
  INITIAL_HAIR_CARE_COLLECTIONS,
  mergeHairCareCollections,
} from './src/data/hairCareCollections.ts';
import {
  INITIAL_FURNITURE_COLLECTIONS,
  mergeFurnitureCollections,
} from './src/data/furnitureCollections.ts';
import {
  INITIAL_DRIED_PEAS_COLLECTIONS,
  mergeDriedPeasCollections,
} from './src/data/driedPeasCollections.ts';
import {
  INITIAL_PRANKS_NOVELTIES_COLLECTIONS,
  mergePranksNoveltiesCollections,
} from './src/data/pranksNoveltiesCollections.ts';
import {
  INITIAL_FITNESS_GYM_COLLECTIONS,
  mergeFitnessGymCollections,
} from './src/data/fitnessGymCollections.ts';
import {
  INITIAL_ACCESSORIES_COLLECTIONS,
  mergeAccessoriesCollections,
} from './src/data/accessoriesCollections.ts';
import {
  INITIAL_SPORTS_COLLECTIONS,
  mergeSportsCollections,
} from './src/data/sportsCollections.ts';
import {
  INITIAL_FOOTWEAR_COLLECTIONS,
  mergeFootwearCollections,
} from './src/data/footwearCollections.ts';
import {
  INITIAL_TEENAGERS_COLLECTIONS,
  mergeTeenagersCollections,
} from './src/data/teenagersCollections.ts';
import {
  INITIAL_KIDS_COLLECTIONS,
  mergeKidsCollections,
} from './src/data/kidsCollections.ts';
import {
  getSubcategoryDisplayName,
  getThirdLevelDisplayName,
  productMatchesCategory,
  productMatchesFilter,
  slugifyCategory,
} from './src/data/categoryHierarchy.ts';
import {
  filterAndSortProducts,
  searchMatchingCategories,
  searchMensFashionCollections,
  searchWomensFashionCollections,
  searchElectronicsCollections,
  searchDriedFruitsCollections,
  searchNutsCollections,
  searchSkinCareCollections,
  searchHairCareCollections,
  searchFurnitureCollections,
  searchDriedPeasCollections,
  searchPranksNoveltiesCollections,
  searchFitnessGymCollections,
  searchAccessoriesCollections,
  searchSportsCollections,
  searchFootwearCollections,
  searchTeenagersCollections,
  searchKidsCollections,
  searchRiceCollections,
  type AvailabilityFilter,
  type CatalogSortOption,
} from './src/utils/catalogSearch.ts';
import {
  hasAdminPermission,
  isAdminRole,
  normalizeAdminRole,
  type AdminPermission,
} from './src/utils/adminAuth.ts';
import bcrypt from 'bcryptjs';
import {
  getMongoInfrastructureStatus,
  isMongoConfigured,
  verifyMongoConnectivity,
} from './server/mongo.ts';
import {
  deleteGridFSImageSafely,
  findGridFSImageForStreaming,
  listGridFSImages,
  uploadAssetToPermanentStorage,
} from './server/gridfsStorage.ts';
import {
  COLLECTION_REGISTRY_META,
  consumeResetTokenFromMongo,
  decrementInventoryAtomicMongo,
  deleteBannerFromMongo,
  deleteCategoryFromMongo,
  deleteCouponFromMongo,
  deleteProductFromMongo,
  deleteReviewFromMongo,
  deleteSessionFromMongo,
  deleteUserSessionsFromMongo,
  ensureStoreLoadedFromMongo,
  findSessionInMongo,
  logAdminActivityToMongo,
  saveResetTokenToMongo,
  syncBannerToMongo,
  syncCartToMongo,
  syncCategoryToMongo,
  syncCollectionToMongo,
  syncCouponToMongo,
  syncInquiryToMongo,
  syncNewsletterToMongo,
  syncOrderToMongo,
  syncProductToMongo,
  syncReviewToMongo,
  syncSessionToMongo,
  syncSettingsToMongo,
  syncUserToMongo,
  syncWishlistToMongo,
} from './server/mongoSync.ts';
import { repairCollectionRegistryImages } from './server/imageRepair.ts';
import { isEmailServiceConfigured, sendTransactionalEmail } from './server/emailService.ts';
import { auditLocalCatalogImages } from './server/mediaAudit.ts';

const app = express();
const cliPortIdx = process.argv.findIndex(
  (arg) => arg === '--port' || arg.startsWith('--port=')
);
const cliPortRaw =
  cliPortIdx !== -1
    ? process.argv[cliPortIdx].startsWith('--port=')
      ? process.argv[cliPortIdx].split('=')[1]
      : process.argv[cliPortIdx + 1]
    : undefined;
const envPort =
  process.env.PORT && process.env.PORT !== process.env.NGINX_PORT
    ? Number(process.env.PORT)
    : undefined;
const PORT =
  Number(cliPortRaw) ||
  envPort ||
  Number(process.env.DEFAULT_APP_PORT) ||
  3000;
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  crypto
    .createHash('sha256')
    .update(`kubreebazzar-${process.cwd()}-${process.env.APP_URL || 'local'}`)
    .digest('hex');
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET || 'kubreebazzar_razorpay_sandbox_secret';

const passwordResetTokens = new Map<
  string,
  { userId: string; email: string; purpose: 'reset_password' | 'verify_email'; expiresAt: number }
>();

const activeSessions = new Map<
  string,
  { userId: string; expiresAt: number }
>();

const loginRateBuckets = new Map<
  string,
  { count: number; resetAt: number }
>();

app.use(express.json({ limit: '25mb' }));

// Reject NoSQL operator keys ($gt, $ne, __proto__, etc.) across API payloads & queries
app.use('/api', (req, res, next) => {
  if (hasForbiddenMongoKeys(req.body) || hasForbiddenMongoKeys(req.query)) {
    res.status(400).json({ error: 'Invalid request parameters' });
    return;
  }
  void ensureStoreLoadedFromMongo(db)
    .then(() => next())
    .catch(() => next());
});

const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL
  ? path.join('/tmp', 'kubreebazzar-data')
  : path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = IS_VERCEL
  ? path.join('/tmp', 'kubreebazzar-uploads')
  : path.resolve(process.cwd(), 'public', 'uploads');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

app.use('/uploads', express.static(UPLOADS_DIR));

interface StoredUser extends User {
  passwordHash: string;
}

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface DatabaseSchema {
  products: Product[];
  categories: CategoryInfo[];
  mensFashionCollections: MensFashionCollection[];
  womensFashionCollections: WomensFashionCollection[];
  electronicsCollections: ElectronicsCollection[];
  driedFruitsCollections: DriedFruitCollection[];
  nutsCollections: NutCollection[];
  skinCareCollections: SkinCareCollection[];
  hairCareCollections: HairCareCollection[];
  furnitureCollections: FurnitureCollection[];
  driedPeasCollections: DriedPeasCollection[];
  pranksNoveltiesCollections: PranksNoveltiesCollection[];
  fitnessGymCollections: FitnessGymCollection[];
  accessoriesCollections: AccessoriesCollection[];
  sportsCollections: SportsCollection[];
  footwearCollections: FootwearCollection[];
  teenagersCollections: TeenagersCollection[];
  kidsCollections: KidsCollection[];
  users: StoredUser[];
  orders: Order[];
  coupons: Coupon[];
  banners: PromoBanner[];
  reviews: ProductReview[];
  newsletter: NewsletterSubscriber[];
  settings: SiteSettings;
  inquiries: ContactInquiry[];
  adminActivityLogs: AdminActivityLog[];
}

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;
  if (stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$')) {
    return bcrypt.compareSync(password, stored);
  }
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

function needsBcryptUpgrade(stored: string): boolean {
  return !(stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$'));
}

function hashTokenSha256(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function hasForbiddenMongoKeys(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) {
    return value.some((item) => hasForbiddenMongoKeys(item));
  }
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (key.startsWith('$') || key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return true;
    }
    if (hasForbiddenMongoKeys(val)) return true;
  }
  return false;
}

function checkRateLimit(bucketKey: string, limit = 12, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = loginRateBuckets.get(bucketKey);
  if (!entry || entry.resetAt <= now) {
    loginRateBuckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count += 1;
  return true;
}

function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie || '';
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const k = part.slice(0, eq).trim();
    const v = part.slice(eq + 1).trim();
    if (k) {
      try {
        out[k] = decodeURIComponent(v);
      } catch {
        out[k] = v;
      }
    }
  }
  return out;
}

function isHttpsRequest(req: Request): boolean {
  return (
    Boolean(IS_VERCEL) ||
    req.secure ||
    req.headers['x-forwarded-proto'] === 'https'
  );
}

function setSessionCookie(req: Request, res: Response, token: string): void {
  const maxAge = 7 * 24 * 60 * 60;
  const parts = [
    `kb_session=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    `Max-Age=${maxAge}`,
  ];
  if (isHttpsRequest(req)) {
    parts.push('Secure', 'SameSite=None', 'Partitioned');
  } else {
    parts.push('SameSite=Lax');
  }
  res.setHeader('Set-Cookie', parts.join('; '));
}

function clearSessionCookie(req: Request, res: Response): void {
  const parts = ['kb_session=', 'Path=/', 'HttpOnly', 'Max-Age=0'];
  if (isHttpsRequest(req)) {
    parts.push('Secure', 'SameSite=None', 'Partitioned');
  } else {
    parts.push('SameSite=Lax');
  }
  res.setHeader('Set-Cookie', parts.join('; '));
}

function signToken(payload: {
  userId: string;
  role: User['role'];
  adminRole?: AdminRoleKey;
}): string {
  const data = Buffer.from(
    JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('base64url');
  return `${data}.${sig}`;
}

function verifyToken(
  token: string
): { userId: string; role: User['role']; adminRole?: AdminRoleKey } | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('base64url');
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (parsed.exp && parsed.exp < Date.now()) return null;
    return {
      userId: parsed.userId,
      role: parsed.role,
      adminRole: parsed.adminRole,
    };
  } catch {
    return null;
  }
}

function createDefaultSettings(): SiteSettings {
  const futureEnd = new Date(Date.now() + 36 * 3600 * 1000).toISOString();
  return {
    brandName: 'KubreeBazzar',
    brandTagline: 'Your Friendly Online Shopping Bazzar!',
    announcementText:
      'Welcome to KubreeBazzar — Use code KAVERI10 for 10% off orders over ₹1,000 · Free delivery over ₹1,500',
    announcementLink: '/offers',
    campaignHeadline: 'Your Friendly Neighbourhood & Online Bazzar!',
    campaignSubheadline:
      'From quality rice and everyday groceries to pure golden honey and stylish watches, shop everything you love at KubreeBazzar.',
    campaignCta: 'Explore KubreeBazzar',
    flashSaleTitle: 'KubreeBazzar Super Saver Event',
    flashSaleSubtitle:
      'Special savings on aged Basmati sacks, wood-pressed oils, wild forest honey, and automatic timepieces.',
    flashSaleEndsAt: futureEnd,
    aboutOverview:
      'KubreeBazzar brings together trusted household staples—quality rice, everyday groceries, and pure honey—alongside stylish watches in a friendly, colourful online shopping destination.',
    aboutStory:
      'Inspired by the warmth and joy of neighbourhood shopping, KubreeBazzar pairs curated pantry essentials and watches with fast delivery and secure checkout.',
    aboutMission:
      'To deliver reliable everyday essentials and stylish watches with transparent pricing, weight and size flexibility, and friendly customer care.',
    aboutVision:
      'A cheerful multi-category shopping destination where families shop with confidence and a smile.',
    milestones: [
      {
        id: 'ms-1',
        year: 'Chapter 01',
        title: 'Four Core Departments',
        description:
          'Curated 48+ products across Rice, Grocery, Honey, and Watches with configurable pack weights, jar sizes, and watch straps.',
      },
      {
        id: 'ms-2',
        year: 'Chapter 02',
        title: 'Friendly Shopping Experience',
        description:
          'Designed with our cheerful mascot spirit—easy search, instant filters, wishlist, and transparent INR pricing.',
      },
      {
        id: 'ms-3',
        year: 'Chapter 03',
        title: 'Nationwide Delivery & Verified Checkout',
        description:
          'Integrated server-verified Razorpay checkout, Cash on Delivery, and real-time order tracking.',
      },
    ],
    contactEmail: 'care@kubreebazzar.in',
    contactPhone: '+91 75588 28671',
    contactAddress:
      '4/2036, Vallam Main Road, Opposite RK Mahal, Vallam / Sengottai Area, Tamil Nadu – 627809, India.',
    supportHours: 'Monday – Saturday, 9:00 AM – 8:00 PM IST',
    footerNote:
      'Quality Rice, Everyday Grocery, Pure Honey, and Stylish Watches — delivered with care at KubreeBazzar.',
  };
}

function createInitialDatabase(): DatabaseSchema {
  const now = new Date().toISOString();

  const categories: CategoryInfo[] = INITIAL_CATEGORIES;
  const products: Product[] = generate48Products();

  // Only provision an initial admin from explicit server environment variables (never hardcoded passwords).
  const envAdminEmail = (process.env.INITIAL_ADMIN_EMAIL || '').trim().toLowerCase();
  const envAdminPassword = (process.env.INITIAL_ADMIN_PASSWORD || '').trim();
  const users: StoredUser[] = [];
  if (envAdminEmail && envAdminPassword.length >= 8) {
    users.push({
      id: `user-superadmin-${Date.now()}`,
      name: 'Super Administrator',
      email: envAdminEmail,
      emailVerified: true,
      passwordHash: hashPassword(envAdminPassword),
      role: 'super_admin',
      adminRole: 'super_admin',
      isActive: true,
      addresses: [],
      wishlist: [],
      cart: [],
      createdAt: now,
    });
  }

  // Real orders start at 0 until actual checkout orders are placed.
  const orders: Order[] = [];

  const coupons: Coupon[] = [
    {
      id: 'coup-1',
      code: 'KAVERI10',
      type: 'percent',
      value: 10,
      minOrderAmount: 1000,
      description: '10% off orders over ₹1,000 across Rice, Grocery, Honey & Watches.',
      active: true,
      expiresAt: '2026-12-31',
    },
    {
      id: 'coup-2',
      code: 'HARVEST250',
      type: 'fixed',
      value: 250,
      minOrderAmount: 2000,
      description: '₹250 instant savings on orders of ₹2,000 or more.',
      active: true,
      expiresAt: '2026-12-31',
    },
  ];


  const banners: PromoBanner[] = [
    {
      id: 'ban-1',
      title: 'Festive Harvest & Heritage Sale — Interactive 3D Preview',
      subtitle: 'Use code KAVERI10 at checkout for 10% off orders over ₹1,000.',
      ctaLabel: 'Shop Collection',
      targetCategory: 'All',
      accentColor: '#6B1D2F',
      active: true,
    },
  ];

  const reviews: ProductReview[] = [
    {
      id: 'rev-1',
      productId: 'prod-aether-one',
      authorName: 'Marcus Vance',
      rating: 5,
      title: 'Reference-grade acoustic clarity',
      comment:
        'Being able to inspect the titanium yoke and earcup geometry in 3D before ordering matched the physical build quality 1:1.',
      verifiedPurchase: true,
      approved: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'rev-2',
      productId: 'prod-chronos-ti',
      authorName: 'Claire Moreau',
      rating: 5,
      title: 'Featherweight grade-5 titanium',
      comment:
        'The skeletonized dial and sapphire crystal catch light effortlessly. Arrived in 48 hours with full milestone tracking.',
      verifiedPurchase: true,
      approved: true,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'rev-3',
      productId: 'prod-lumina-serum',
      authorName: 'Sora Takahashi',
      rating: 5,
      title: 'Calming, fast-absorbing botanical complex',
      comment:
        'The smoked violet glass dropper feels substantial and keeps the blue tansy formulation potent.',
      verifiedPurchase: true,
      approved: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  const newsletter: NewsletterSubscriber[] = [];

  return {
    products,
    categories,
    mensFashionCollections: INITIAL_MENS_FASHION_COLLECTIONS,
    womensFashionCollections: INITIAL_WOMENS_FASHION_COLLECTIONS,
    electronicsCollections: INITIAL_ELECTRONICS_COLLECTIONS,
    driedFruitsCollections: INITIAL_DRIED_FRUITS_COLLECTIONS,
    nutsCollections: INITIAL_NUTS_COLLECTIONS,
    skinCareCollections: INITIAL_SKIN_CARE_COLLECTIONS,
    hairCareCollections: INITIAL_HAIR_CARE_COLLECTIONS,
    furnitureCollections: INITIAL_FURNITURE_COLLECTIONS,
    driedPeasCollections: INITIAL_DRIED_PEAS_COLLECTIONS,
    pranksNoveltiesCollections: INITIAL_PRANKS_NOVELTIES_COLLECTIONS,
    fitnessGymCollections: INITIAL_FITNESS_GYM_COLLECTIONS,
    accessoriesCollections: INITIAL_ACCESSORIES_COLLECTIONS,
    sportsCollections: INITIAL_SPORTS_COLLECTIONS,
    footwearCollections: INITIAL_FOOTWEAR_COLLECTIONS,
    teenagersCollections: INITIAL_TEENAGERS_COLLECTIONS,
    kidsCollections: INITIAL_KIDS_COLLECTIONS,
    users,
    orders,
    coupons,
    banners,
    reviews,
    newsletter,
    settings: createDefaultSettings(),
    inquiries: [],
    adminActivityLogs: [],
  };
}

function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(STORE_FILE)) {
    const initial = createInitialDatabase();
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
    const defaults = createInitialDatabase();
    const shouldUpgradeCatalog =
      !parsed.products ||
      !parsed.categories ||
      parsed.categories.length < 20 ||
      parsed.categories?.[0]?.id !== 'Temple';
    const baseCategories = shouldUpgradeCatalog
      ? defaults.categories
      : parsed.categories || defaults.categories;

    let didMigrateTaxonomy = shouldUpgradeCatalog;

    const REMOVED_LEGACY_PRODUCT_IDS = new Set([
      'prod-school-1',
      'prod-school-2',
      'prod-auto-bike-1',
      'prod-auto-bike-2',
      'prod-auto-bike-3',
      'prod-auto-car-1',
      'prod-auto-car-2',
      'prod-auto-car-3',
      'prod-groc-health-1',
    ]);

    const defaultProductsById = new Map(
      defaults.products.map((dp) => [dp.id, dp])
    );

    // 1. Migrate existing products first so no product depends on legacy Baby Care or School Supplies categories
    const rawBaseProducts = shouldUpgradeCatalog
      ? defaults.products
      : parsed.products || defaults.products;

    const baseProducts = rawBaseProducts.filter((p) => {
      if (REMOVED_LEGACY_PRODUCT_IDS.has(p.id)) {
        didMigrateTaxonomy = true;
        return false;
      }
      return true;
    });

    const LEGACY_SPICE_MAP: Record<
      string,
      { subSubcategory: string; tags?: string[] }
    > = {
      'prod-groc-elaka': { subSubcategory: 'Green Cardamom (Elakkai)' },
      'prod-groc-lavangam': { subSubcategory: 'Cloves (Lavangam)' },
      'prod-groc-patai': {
        subSubcategory: 'Cinnamon (Pattai)',
        tags: ['Star Anise (Annasi Poo)'],
      },
      'prod-groc-seeragam': { subSubcategory: 'Cumin Seeds (Seeragam)' },
    };

    const loadedProducts: Product[] = baseProducts.map((p): Product => {
      const defProd = defaultProductsById.get(p.id);
      let nextName = p.name;
      let nextSlug = p.slug;
      let nextShortDesc = p.shortDescription;
      let nextDesc = p.description;

      if (p.id === 'prod-fash-women-2') {
        if (nextName.includes('Chudithar')) {
          nextName = 'Pastel Embroidered Anarkali Churidar Set';
        }
        if (nextSlug === 'pastel-embroidered-anarkali-chudithar-suit-set') {
          nextSlug = 'pastel-embroidered-anarkali-churidar-set';
        }
      } else if (
        p.id === 'prod-fash-women-3' &&
        nextName.includes('Korean Trend')
      ) {
        nextName = 'Korean Fashion Pastel Oversized Knit Cardigan';
      } else if (p.id === 'prod-groc-elaka' && nextName.includes('(Elaka)')) {
        nextName = nextName.replace(/\(Elaka\)/g, '(Elakkai)');
        if (nextSlug === 'idukki-whole-green-cardamom-elaka') {
          nextSlug = 'idukki-whole-green-cardamom-elakkai';
        }
      } else if (p.id === 'prod-groc-patai' && nextName.includes('(Patai)')) {
        nextName = nextName.replace(/\(Patai\)/g, '(Pattai)');
        if (nextSlug === 'ceylon-cinnamon-quills-star-anise-patai') {
          nextSlug = 'ceylon-cinnamon-quills-star-anise-pattai';
        }
      } else if (p.id === 'prod-templekit-theruneeer' && nextName === 'Sacred Ash (Thiruneeru)') {
        nextName = 'Sacred Ash (Thiruneeru / Vibhuti)';
      }

      const MILLET_PRODUCT_IDS = new Set([
        'prod-groc-millets-1',
        'prod-draft-bajra',
        'prod-draft-ragi-flour',
        'prod-millet-proso',
        'prod-millet-sorghum',
        'prod-millet-kodo',
        'prod-millet-little',
        'prod-millet-browntop',
        'prod-millet-barnyard',
      ]);
      const LEGACY_MILLET_SLUGS = new Set([
        'organic-foxtail-millet-thinai',
        'pearl-millet-bajra',
        'pearl-millet-kambu',
        'proso-millet-panivaragu',
        'sorghum-jowar-solam',
        'kodo-millet-varagu',
        'little-millet-samai',
        'browntop-millet-korali',
        'barnyard-millet-kuthiraivali',
        'finger-millet-ragi-flour',
      ]);
      const hasTamilScript = (val: unknown) =>
        typeof val === 'string' && /[\u0B80-\u0BFF]/.test(val);
      const isMilletNeedingEnglishPublish =
        defProd &&
        MILLET_PRODUCT_IDS.has(p.id) &&
        (Boolean(p.tamilName) ||
          hasTamilScript(p.shortDescription) ||
          hasTamilScript(p.description) ||
          (Array.isArray(p.tags) && p.tags.some(hasTamilScript)) ||
          (Array.isArray(p.specs) &&
            p.specs.some(
              (s) => s.label === 'Tamil Name' || hasTamilScript(s.value)
            )) ||
          LEGACY_MILLET_SLUGS.has(p.slug) ||
          (p.enabled === false && p.isDraft === true && p.price === 0) ||
          (Array.isArray(p.images) &&
            p.images.includes('/images/products/millets-oats-grains.jpg')));

      let nextTamilName = p.tamilName;
      let nextVariants = p.variants;
      let nextMilletEnabled = p.enabled;
      let nextMilletIsDraft = p.isDraft;
      if (isMilletNeedingEnglishPublish && defProd) {
        nextName = defProd.name;
        nextTamilName = undefined;
        nextSlug = defProd.slug;
        nextShortDesc = defProd.shortDescription;
        nextDesc = defProd.description;
        nextMilletEnabled = true;
        nextMilletIsDraft = false;
        if (
          p.id === 'prod-groc-millets-1' &&
          p.variants.length === 1 &&
          p.variants[0]?.name === 'Standard Edition'
        ) {
          nextVariants = defProd.variants;
        }
      }

      const CEREAL_PRODUCT_IDS = new Set([
        'prod-groc-cereals-1',
        'prod-cereal-wheat',
        'prod-cereal-maize',
        'prod-cereal-barley',
      ]);
      const isCerealNeedingEnglishPublish =
        defProd &&
        CEREAL_PRODUCT_IDS.has(p.id) &&
        (Boolean(p.tamilName) ||
          hasTamilScript(p.shortDescription) ||
          hasTamilScript(p.description) ||
          (Array.isArray(p.tags) && p.tags.some(hasTamilScript)) ||
          (Array.isArray(p.specs) &&
            p.specs.some(
              (s) => s.label === 'Tamil Name' || hasTamilScript(s.value)
            )) ||
          (p.enabled === false && p.isDraft === true && p.price === 0) ||
          (Array.isArray(p.images) &&
            p.images.includes('/images/products/groceries/golden-rolled-oats.webp')));

      if (isCerealNeedingEnglishPublish && defProd) {
        nextName = defProd.name;
        nextTamilName = undefined;
        nextSlug = defProd.slug;
        nextShortDesc = defProd.shortDescription;
        nextDesc = defProd.description;
        nextMilletEnabled = true;
        nextMilletIsDraft = false;
      }

      const isHoneyUpgrade =
        (p.id === 'prod-groc-honey' || p.id.startsWith('prod-honey-')) &&
        Boolean(defProd) &&
        ((p.subSubcategory || '').toLowerCase() === 'honey' ||
          p.enabled === false ||
          p.isDraft === true ||
          p.slug === 'nilgiri-raw-wild-forest-honey-jar' ||
          p.name === 'Nilgiri Raw Wild Forest Honey 500g Glass Jar' ||
          (Array.isArray(p.images) &&
            p.images.includes('/images/products/honey.jpg')));
      if (isHoneyUpgrade && defProd) {
        nextName = defProd.name;
        nextSlug = defProd.slug;
        nextShortDesc = defProd.shortDescription;
        nextDesc = defProd.description;
        nextMilletEnabled = true;
        nextMilletIsDraft = false;
      }

      const isReadyToCookUpgrade =
        (p.id === 'prod-groc-ready-1' || p.id.startsWith('prod-rtc-')) &&
        Boolean(defProd) &&
        (p.slug === 'crispy-traditional-rava-dosa-ready-mix' ||
          p.name === 'Crispy Traditional Rava Dosa Ready Mix 500g' ||
          (Array.isArray(p.images) &&
            p.images.includes('/images/products/rava-dosa-mix.jpg')));
      if (isReadyToCookUpgrade && defProd) {
        nextName = defProd.name;
        nextSlug = defProd.slug;
        nextShortDesc = defProd.shortDescription;
        nextDesc = defProd.description;
        nextMilletEnabled = true;
        nextMilletIsDraft = false;
      }

      if (typeof nextName === 'string' && nextName.includes('Dry Peas')) {
        nextName = nextName.replace(/Dry Peas/g, 'Dried Peas');
      }
      if (typeof nextShortDesc === 'string' && nextShortDesc.includes('(Elaka)')) {
        nextShortDesc = nextShortDesc.replace(/\(Elaka\)/g, '(Elakkai)');
      }
      if (typeof nextShortDesc === 'string' && nextShortDesc.includes('(Patai)')) {
        nextShortDesc = nextShortDesc.replace(/\(Patai\)/g, '(Pattai)');
      }
      if (typeof nextDesc === 'string' && nextDesc.includes('(Elaka)')) {
        nextDesc = nextDesc.replace(/\(Elaka\)/g, '(Elakkai)');
      }
      if (typeof nextDesc === 'string' && nextDesc.includes('(Patai)')) {
        nextDesc = nextDesc.replace(/\(Patai\)/g, '(Pattai)');
      }

      let nextCat = p.category;
      if ((nextCat || '').toLowerCase() === 'dried peas') {
        nextCat = 'Dry Peas';
      }
      let nextSub = p.subcategory
        ? getSubcategoryDisplayName(p.subcategory)
        : p.subcategory;
      let nextThird = p.subSubcategory
        ? getThirdLevelDisplayName(p.subSubcategory)
        : p.subSubcategory;
      let nextTags = p.tags;

      // Migrate any legacy Baby / Baby Care / Baby Kit subcategory products safely to main category "Baby Kit"
      if (
        p.id.startsWith('prod-babykit-') ||
        (p.category || '').toLowerCase() === 'baby' ||
        (p.category || '').toLowerCase() === 'baby care' ||
        (nextSub || '').toLowerCase() === 'baby kit'
      ) {
        nextCat = 'Baby Kit';
        if ((nextSub || '').toLowerCase() === 'baby kit') {
          nextSub = undefined;
        }
      }

      // Migrate any legacy School / School Supplies / School Kit subcategory products safely to main category "School Kit"
      if (
        p.id.startsWith('prod-schoolkit-') ||
        (p.category || '').toLowerCase() === 'school' ||
        (p.category || '').toLowerCase() === 'school supplies' ||
        (nextSub || '').toLowerCase() === 'school kit'
      ) {
        nextCat = 'School Kit';
        if ((nextSub || '').toLowerCase() === 'school kit') {
          nextSub = undefined;
        }
      }

      if (nextCat === 'Kids' && !nextSub && defProd?.subcategory) {
        nextSub = defProd.subcategory;
      }

      if (
        nextCat === 'Fashion' &&
        nextSub === "Men's Fashion" &&
        (p.id === 'prod-draft-mens-denim-jeans' ||
          p.id === 'prod-draft-mens-cargo-pants' ||
          p.id === 'prod-draft-mens-joggers-pants') &&
        defProd
      ) {
        nextThird = 'Pants';
        if (
          p.name !== defProd.name ||
          p.slug !== defProd.slug ||
          p.description !== defProd.description
        ) {
          nextName = defProd.name;
          nextSlug = defProd.slug;
          nextShortDesc = defProd.shortDescription;
          nextDesc = defProd.description;
        }
      }

      if ((isHoneyUpgrade || isReadyToCookUpgrade) && defProd) {
        nextCat = defProd.category;
        nextSub = defProd.subcategory;
        nextThird = defProd.subSubcategory;
        nextTags = defProd.tags;
      }

      const spiceMapping = LEGACY_SPICE_MAP[p.id];
      if (
        spiceMapping &&
        nextSub === 'Ready-to-Cook Foods' &&
        !nextThird
      ) {
        nextSub = 'Whole Spices';
        nextThird = spiceMapping.subSubcategory;
        if (spiceMapping.tags) {
          nextTags = Array.from(
            new Set([...(p.tags || []), ...spiceMapping.tags])
          );
        }
      }

      const PUBLISHED_SPICE_AND_MASALA_IDS = new Set([
        'prod-draft-spice-black-pepper',
        'prod-draft-spice-star-anise',
        'prod-draft-spice-fennel',
        'prod-draft-spice-coriander',
        'prod-draft-spice-mustard',
        'prod-draft-spice-turmeric',
        'prod-draft-spice-bay-leaves',
        'prod-draft-spice-red-chillies',
        'prod-draft-masala-red-chilli',
        'prod-draft-masala-turmeric',
        'prod-draft-masala-coriander',
        'prod-draft-masala-cumin',
        'prod-draft-masala-black-pepper',
        'prod-draft-masala-cinnamon',
        'prod-draft-masala-asafoetida',
        'prod-draft-masala-garam',
        'prod-draft-masala-sambar',
        'prod-draft-masala-rasam',
        'prod-draft-masala-biryani',
        'prod-draft-masala-chicken',
        'prod-draft-masala-mutton',
        'prod-draft-masala-fish-curry',
        'prod-draft-masala-curry',
      ]);

      // Replace any persisted Unsplash URLs or outdated generic placeholders with upgraded bundled product photos (never touching /uploads/)
      const hasCustomUpload =
        Array.isArray(p.images) &&
        p.images.some((img) => typeof img === 'string' && img.startsWith('/uploads/'));
      const hasOutdatedPlaceholder =
        !Array.isArray(p.images) ||
        p.images.length === 0 ||
        p.images.some(
          (img) =>
            typeof img === 'string' &&
            (img.includes('unsplash.com') ||
              img.startsWith('/images/categories/') ||
              img === '/images/products/whole-spices-assortment.jpg' ||
              img === '/images/products/masala-powders.jpg' ||
              img === '/images/product_anc_headphones_1793866417010.jpg' ||
              img === '/images/product_fitness_kettlebell_1793868611953.jpg' ||
              img === '/images/products/nuts-assortment.jpg' ||
              img === '/images/products/dried-fruits-assortment.jpg' ||
              (p.id === 'prod-fash-men-2' &&
                img === '/images/product_tech_jacket_1793866418243.jpg') ||
              (p.id === 'prod-fash-women-2' &&
                img === '/images/products/fashion-women-ethnic.jpg') ||
              (p.id === 'prod-groc-ready-1' &&
                img === '/images/hero_grocery_basket_1793936930249.jpg') ||
              ((p.id === 'prod-groc-rice-2' ||
                p.id === 'prod-groc-rice-3' ||
                p.id === 'prod-draft-sona-masoori-rice' ||
                p.id === 'prod-groc-cereals-1') &&
                img === '/images/products/Rice.jpg') ||
              (p.id === 'prod-groc-cereals-1' &&
                img === '/images/products/groceries/golden-rolled-oats.webp') ||
              (p.id === 'prod-groc-rice-3' &&
                img === '/images/products/ponni-boiled-rice.jpg') ||
              (p.id === 'prod-temple-1' &&
                img === '/images/temple-kit/vilaku.png') ||
              (p.id === 'prod-temple-2' &&
                img === '/images/temple-kit/kungumam.png') ||
              (p.id === 'prod-baby-1' &&
                img === '/images/baby-kit/baby powder.png') ||
              (p.id === 'prod-baby-2' &&
                img === '/images/baby-kit/baby oil.png') ||
              (p.id === 'prod-teen-2' &&
                img === '/images/products/teenagers-desk-setup.jpg') ||
              (p.id === 'prod-hair-2' &&
                img === '/images/products/hair-care-botanicals.jpg') ||
              (p.id === 'prod-prank-2' &&
                img === '/images/products/pranks-novelties-box.jpg') ||
              ((p.id === 'prod-peas-2' || p.id === 'prod-draft-peas-yellow') &&
                img === '/images/products/dried-peas-bowls.jpg') ||
              (p.id === 'prod-sports-2' &&
                img === '/images/products/sports-cricket-badminton.jpg') ||
              (p.id === 'prod-draft-spice-fenugreek' &&
                img === '/images/products/cumin-seeds-powder.png') ||
              (p.id === 'prod-draft-spice-turmeric' &&
                img === '/images/products/turmeric-powder.png') ||
              (p.id === 'prod-draft-spice-bay-leaves' &&
                img === '/images/products/star-anise-bay-leaves.png') ||
              ((p.id === 'prod-draft-spice-nutmeg' ||
                p.id === 'prod-draft-spice-mace') &&
                img === '/images/products/patai.jpg') ||
              ((p.id === 'prod-draft-spice-carom' ||
                p.id === 'prod-draft-spice-kalpasi') &&
                img === '/images/products/black-pepper-whole.png') ||
              (p.id.startsWith('prod-draft-') &&
                (img === '/images/products/fashion-men-apparel.jpg' ||
                  img === '/images/products/fashion-women-ethnic.jpg' ||
                  img === '/images/products/fashion-women-contemporary.jpg' ||
                  img === '/images/products/kids-wooden-toys.jpg' ||
                  img === '/images/products/teenagers-desk-setup.jpg' ||
                  img === '/images/products/electronics-gan-charger.jpg' ||
                  img === '/images/products/furniture-wood-tables.jpg' ||
                  img === '/images/products/hair-care-botanicals.jpg' ||
                  img === '/images/products/skin-care-botanicals.jpg' ||
                  img === '/images/products/sports-cricket-badminton.jpg' ||
                  img === '/images/product_footwear_runner_1793868611251.jpg' ||
                  img === '/images/products/accessories-leather-wallet.jpg' ||
                  img === '/images/products/pranks-novelties-box.jpg')) ||
              (MILLET_PRODUCT_IDS.has(p.id) &&
                img === '/images/products/millets-oats-grains.jpg') ||
              (p.id === 'prod-groc-honey' &&
                img === '/images/products/honey.jpg') ||
              (p.id === 'prod-groc-ready-1' &&
                img === '/images/products/rava-dosa-mix.jpg'))
        ) ||
        (defProd &&
          defProd.images.length > (Array.isArray(p.images) ? p.images.length : 0) &&
          (p.id === 'prod-groc-elaka' ||
            p.id === 'prod-groc-lavangam' ||
            p.id === 'prod-groc-patai' ||
            p.id === 'prod-groc-seeragam' ||
            p.id === 'prod-draft-spice-fennel' ||
            p.id === 'prod-draft-spice-mustard'));

      const rawNextImages =
        !hasCustomUpload && hasOutdatedPlaceholder
          ? defProd?.images && defProd.images.length > 0
            ? defProd.images
            : ['/images/products/Rice.jpg']
          : p.images;
      const nextImages = Array.isArray(rawNextImages)
        ? rawNextImages.map((img) =>
            typeof img === 'string' &&
            /^\/images\/(electronics|mens-fashion|womens-fashion|products\/electronics)\/.*\.webp$/i.test(
              img
            )
              ? img.replace(/\.webp$/i, '.jpg')
              : img
          )
        : rawNextImages;

      const shouldPublishUploadedSpiceOrMasala =
        PUBLISHED_SPICE_AND_MASALA_IDS.has(p.id) &&
        (p.enabled === false || p.isDraft === true);
      const nextEnabled = shouldPublishUploadedSpiceOrMasala
        ? true
        : nextMilletEnabled;
      const nextIsDraft = shouldPublishUploadedSpiceOrMasala
        ? false
        : nextMilletIsDraft;

      const nextSpecs = p.specs?.map((s) => {
        const nextVal = s.value
          .replace("Fashion > Men >", "Fashion > Men's Fashion >")
          .replace("Fashion > Women >", "Fashion > Women's Fashion >")
          .replace('Baby Care > Baby Kit', 'Baby Kit')
          .replace('Baby Care Essential', 'Daily Care Essential')
          .replace('Baby Care Accessory', 'Baby Kit Accessory')
          .replace('School Supplies > School Kit', 'School Kit')
          .replace('Dry Red Chillies', 'Dried Red Chillies')
          .replace(/\(Elaka\)/g, '(Elakkai)')
          .replace(/\(Patai\)/g, '(Pattai)');
        return {
          ...s,
          value:
            (p.id === 'prod-draft-mens-denim-jeans' ||
              p.id === 'prod-draft-mens-cargo-pants' ||
              p.id === 'prod-draft-mens-joggers-pants') &&
            nextVal === "Fashion > Men's Fashion > Trousers"
              ? "Fashion > Men's Fashion > Pants"
              : nextVal,
        };
      });
      if (
        (isMilletNeedingEnglishPublish || isCerealNeedingEnglishPublish) &&
        defProd
      ) {
        nextTags = defProd.tags;
      }

      if (
        nextName !== p.name ||
        nextTamilName !== p.tamilName ||
        nextSlug !== p.slug ||
        nextShortDesc !== p.shortDescription ||
        nextDesc !== p.description ||
        nextCat !== p.category ||
        nextSub !== p.subcategory ||
        nextThird !== p.subSubcategory ||
        nextEnabled !== p.enabled ||
        nextIsDraft !== p.isDraft ||
        JSON.stringify(nextVariants) !== JSON.stringify(p.variants) ||
        JSON.stringify(nextImages) !== JSON.stringify(p.images) ||
        JSON.stringify(nextTags) !== JSON.stringify(p.tags) ||
        JSON.stringify(nextSpecs) !== JSON.stringify(p.specs)
      ) {
        didMigrateTaxonomy = true;
      }
      const { tamilName: _droppedTamilName, ...baseProdWithoutTamil } = p;
      return {
        ...baseProdWithoutTamil,
        name: nextName,
        ...(nextTamilName ? { tamilName: nextTamilName } : {}),
        slug: nextSlug,
        shortDescription: nextShortDesc,
        description: nextDesc,
        category: nextCat,
        subcategory: nextSub,
        subSubcategory: nextThird,
        enabled: nextEnabled,
        ...(nextIsDraft ? { isDraft: true } : { isDraft: false }),
        variants: nextVariants,
        images: nextImages,
        ...(nextTags ? { tags: nextTags } : {}),
        ...((isMilletNeedingEnglishPublish ||
          isCerealNeedingEnglishPublish ||
          isHoneyUpgrade ||
          isReadyToCookUpgrade) &&
        defProd?.specs
          ? { specs: defProd.specs }
          : nextSpecs
            ? { specs: nextSpecs }
            : {}),
      };
    });

    // Idempotently merge newly introduced Baby Kit, Temple Kit, School Kit, Masala/Spice, Millet, Cereal, Honey, Ready-to-Cook & Draft products
    if (!shouldUpgradeCatalog) {
      const existingIds = new Set(loadedProducts.map((p) => p.id));
      for (const defProd of defaults.products) {
        if (
          (defProd.isDraft ||
            defProd.id.startsWith('prod-rtc-') ||
            defProd.id.startsWith('prod-honey-') ||
            defProd.id.startsWith('prod-millet-') ||
            defProd.id.startsWith('prod-cereal-') ||
            defProd.id.startsWith('prod-draft-masala-') ||
            defProd.id.startsWith('prod-draft-spice-') ||
            defProd.id.startsWith('prod-babykit-') ||
            defProd.id.startsWith('prod-templekit-') ||
            defProd.id.startsWith('prod-schoolkit-')) &&
          !existingIds.has(defProd.id)
        ) {
          loadedProducts.push(defProd);
          didMigrateTaxonomy = true;
        }
      }
    }

    // Confirm zero products still depend on legacy Baby Care or School Supplies before removing legacy category records
    const hasBabyCareDependencies = loadedProducts.some(
      (p) =>
        (p.category || '').toLowerCase() === 'baby' ||
        (p.category || '').toLowerCase() === 'baby care' ||
        (p.subcategory || '').toLowerCase() === 'baby kit'
    );
    const hasSchoolSuppliesDependencies = loadedProducts.some(
      (p) =>
        (p.category || '').toLowerCase() === 'school' ||
        (p.category || '').toLowerCase() === 'school supplies' ||
        (p.subcategory || '').toLowerCase() === 'school kit'
    );

    // 2. Migrate categories: remove Baby Care, School Supplies, and nested kit subcategories once migration is confirmed
    const filteredBaseCategories = baseCategories.filter((c) => {
      const isOldBabyCare =
        !hasBabyCareDependencies &&
        (c.id.toLowerCase() === 'baby' ||
          c.slug.toLowerCase() === 'baby-care' ||
          (c.name || '').toLowerCase() === 'baby care');
      const isOldNestedBabyKit =
        !hasBabyCareDependencies &&
        (c.slug.toLowerCase() === 'baby-kit' ||
          c.id.toLowerCase() === 'baby-kit') &&
        Boolean(c.parentCategoryId || c.parentId);
      const isTempleKitSubcategory =
        c.id.toLowerCase() === 'temple-kit' ||
        (c.slug.toLowerCase() === 'temple-kit' &&
          Boolean(c.parentCategoryId || c.parentId));
      const isOldSchoolSupplies =
        !hasSchoolSuppliesDependencies &&
        (c.id.toLowerCase() === 'school' ||
          c.slug.toLowerCase() === 'school-supplies' ||
          (c.name || '').toLowerCase() === 'school supplies');
      const isOldNestedSchoolKit =
        !hasSchoolSuppliesDependencies &&
        (c.slug.toLowerCase() === 'school-kit' ||
          c.id.toLowerCase() === 'school-kit') &&
        Boolean(c.parentCategoryId || c.parentId);
      if (
        isOldBabyCare ||
        isOldNestedBabyKit ||
        isTempleKitSubcategory ||
        isOldSchoolSupplies ||
        isOldNestedSchoolKit
      ) {
        didMigrateTaxonomy = true;
        return false;
      }
      return true;
    });

    const loadedCategories = filteredBaseCategories.map((c) => {
      const defCat = defaults.categories.find(
        (d) =>
          d.id.toLowerCase() === c.id.toLowerCase() ||
          (d.slug.toLowerCase() === c.slug.toLowerCase() &&
            !c.parentCategoryId &&
            !d.parentCategoryId)
      );
      if (defCat) {
        let nextSubs = Array.isArray(c.subcategories)
          ? [...c.subcategories]
          : [...(defCat.subcategories || [])];
        let nextHierarchy = Array.isArray(c.hierarchyChildren)
          ? [...c.hierarchyChildren]
          : [...(defCat.hierarchyChildren || [])];

        // Keep Temple & Pooja Essentials as a direct main category without a separate Temple Kit submenu
        if (defCat.id === 'Temple') {
          nextSubs = nextSubs.filter((s) => s.toLowerCase() !== 'temple kit');
          nextHierarchy = nextHierarchy.filter((h) => h.slug !== 'temple-kit');
        }

        // Standardize Whole Spices label ('Dry Red Chillies' -> 'Dried Red Chillies')
        if (defCat.id === 'Whole Spices' || defCat.slug === 'whole-spices') {
          nextSubs = nextSubs.map((s) =>
            s === 'Dry Red Chillies' ? 'Dried Red Chillies' : s
          );
          nextHierarchy = nextHierarchy.map((h) => ({
            ...h,
            name: h.name === 'Dry Red Chillies' ? 'Dried Red Chillies' : h.name,
            slug: h.slug === 'dry-red-chillies' ? 'dried-red-chillies' : h.slug,
          }));
        }

        // Sync newly added Masala Powder subcategories (e.g., Cinnamon Powder, Asafoetida (Hing Powder))
        if (defCat.id === 'masala-powders' || defCat.slug === 'masala-powders') {
          nextSubs = [...(defCat.subcategories || [])];
          nextHierarchy = [...(defCat.hierarchyChildren || [])];
        }

        // Sync Kids subcategories (Clothing, Footwear, Accessories, Toys)
        if (defCat.id === 'Kids' || defCat.slug === 'kids') {
          nextSubs = [...(defCat.subcategories || [])];
          nextHierarchy = [...(defCat.hierarchyChildren || [])];
        }

        // Sync Groceries -> Health Foods -> Healthy Sweets -> Honey nested hierarchy
        if (defCat.id === 'Groceries' || defCat.slug === 'groceries') {
          const defHealth = defCat.hierarchyChildren?.find(
            (h) => h.slug === 'health-foods'
          );
          if (defHealth) {
            nextHierarchy = nextHierarchy.map((h) =>
              h.slug === 'health-foods' ? { ...defHealth } : h
            );
          }
        }

        // Sync Fashion -> Men's Fashion children (Shirts, Trousers, Pants, T-Shirts)
        if (defCat.id === 'Fashion' || defCat.slug === 'fashion') {
          const defMen = defCat.hierarchyChildren?.find(
            (h) => h.slug === 'mens-fashion'
          );
          if (defMen) {
            nextHierarchy = nextHierarchy.map((h) =>
              h.slug === 'mens-fashion' ? { ...defMen } : h
            );
          }
        }

        // Replace persisted Unsplash or stale legacy product-level category images with bundled /images/categories/* artwork (preserve custom /uploads/ images)
        const isStaleProductPlaceholder =
          typeof c.image === 'string' &&
          c.image.startsWith('/images/products/') &&
          typeof defCat.image === 'string' &&
          defCat.image.startsWith('/images/categories/');
        const nextImage =
          !c.image ||
          c.image.includes('unsplash.com') ||
          (!c.image.startsWith('/uploads/') && isStaleProductPlaceholder)
            ? defCat.image
            : c.image;

        const nextCat = {
          ...c,
          name: defCat.name || c.name,
          title: defCat.title || c.title,
          slug: defCat.slug || c.slug,
          subtitle:
            defCat.id === 'Kids'
              ? defCat.subtitle
              : c.subtitle ?? defCat.subtitle,
          description:
            defCat.id === 'Kids' ||
            (defCat.id === 'Fashion' &&
              typeof c.description === 'string' &&
              c.description.includes("Men's Fashion (Shirts,"))
              ? defCat.description
              : c.description !== undefined
                ? c.description
                : defCat.description,
          itemCount:
            defCat.id === 'Kids'
              ? defCat.itemCount
              : c.itemCount ?? defCat.itemCount,
          image: nextImage,
          parentCategoryId:
            c.parentCategoryId !== undefined
              ? c.parentCategoryId
              : defCat.parentCategoryId,
          parentId: c.parentId !== undefined ? c.parentId : defCat.parentId,
          subcategories: nextSubs,
          hierarchyChildren: nextHierarchy,
        };
        if (JSON.stringify(nextCat) !== JSON.stringify(c)) {
          didMigrateTaxonomy = true;
        }
        return nextCat;
      }
      return c;
    });

    // Idempotently insert newly introduced default categories (e.g. Baby Kit, School Kit, Whole Spices, Masala Powders)
    for (const defCat of defaults.categories) {
      const exists = loadedCategories.some(
        (c) =>
          c.id.toLowerCase() === defCat.id.toLowerCase() ||
          (c.slug.toLowerCase() === defCat.slug.toLowerCase() &&
            (c.parentCategoryId || null) === (defCat.parentCategoryId || null))
      );
      if (!exists) {
        loadedCategories.push(defCat);
        didMigrateTaxonomy = true;
      }
    }
    loadedCategories.sort(
      (a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99)
    );

    const LEGACY_SEED_USER_IDS = new Set(['user-admin-1', 'user-cust-1']);
    const rawUsers = Array.isArray(parsed.users) ? parsed.users : defaults.users;
    const cleanedUsers = rawUsers.filter((u) => {
      if (LEGACY_SEED_USER_IDS.has(u.id)) {
        didMigrateTaxonomy = true;
        return false;
      }
      return true;
    });

    const normalizedUsers: StoredUser[] = cleanedUsers.map((u) => ({
      ...u,
      adminRole: normalizeAdminRole(u) || undefined,
      isActive: u.isActive !== false,
      addresses: Array.isArray(u.addresses) ? u.addresses : [],
      wishlist: Array.isArray(u.wishlist) ? u.wishlist : [],
      cart: Array.isArray(u.cart) ? u.cart : [],
    }));

    const rawOrders = Array.isArray(parsed.orders) ? parsed.orders : defaults.orders;
    const cleanedOrders = rawOrders.filter((o) => {
      if (o.id === 'ord-1001' || o.razorpayOrderId === 'order_KaveriDemo1042') {
        didMigrateTaxonomy = true;
        return false;
      }
      return true;
    });

    const mergedCollections = mergeMensFashionCollections(
      parsed.mensFashionCollections || []
    );
    if (
      !Array.isArray(parsed.mensFashionCollections) ||
      parsed.mensFashionCollections.length !== mergedCollections.length ||
      JSON.stringify(parsed.mensFashionCollections) !==
        JSON.stringify(mergedCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedWomensCollections = mergeWomensFashionCollections(
      parsed.womensFashionCollections || []
    );
    if (
      !Array.isArray(parsed.womensFashionCollections) ||
      parsed.womensFashionCollections.length !== mergedWomensCollections.length ||
      JSON.stringify(parsed.womensFashionCollections) !==
        JSON.stringify(mergedWomensCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedElectronicsCollections = mergeElectronicsCollections(
      parsed.electronicsCollections || []
    );
    if (
      !Array.isArray(parsed.electronicsCollections) ||
      parsed.electronicsCollections.length !==
        mergedElectronicsCollections.length ||
      JSON.stringify(parsed.electronicsCollections) !==
        JSON.stringify(mergedElectronicsCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedDriedFruitsCollections = mergeDriedFruitsCollections(
      parsed.driedFruitsCollections || []
    );
    if (
      !Array.isArray(parsed.driedFruitsCollections) ||
      parsed.driedFruitsCollections.length !==
        mergedDriedFruitsCollections.length ||
      JSON.stringify(parsed.driedFruitsCollections) !==
        JSON.stringify(mergedDriedFruitsCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedNutsCollections = mergeNutsCollections(
      parsed.nutsCollections || []
    );
    if (
      !Array.isArray(parsed.nutsCollections) ||
      parsed.nutsCollections.length !== mergedNutsCollections.length ||
      JSON.stringify(parsed.nutsCollections) !==
        JSON.stringify(mergedNutsCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedSkinCareCollections = mergeSkinCareCollections(
      parsed.skinCareCollections || []
    );
    if (
      !Array.isArray(parsed.skinCareCollections) ||
      parsed.skinCareCollections.length !== mergedSkinCareCollections.length ||
      JSON.stringify(parsed.skinCareCollections) !==
        JSON.stringify(mergedSkinCareCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedHairCareCollections = mergeHairCareCollections(
      parsed.hairCareCollections || []
    );
    if (
      !Array.isArray(parsed.hairCareCollections) ||
      parsed.hairCareCollections.length !== mergedHairCareCollections.length ||
      JSON.stringify(parsed.hairCareCollections) !==
        JSON.stringify(mergedHairCareCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedFurnitureCollections = mergeFurnitureCollections(
      parsed.furnitureCollections || []
    );
    if (
      !Array.isArray(parsed.furnitureCollections) ||
      parsed.furnitureCollections.length !== mergedFurnitureCollections.length ||
      JSON.stringify(parsed.furnitureCollections) !==
        JSON.stringify(mergedFurnitureCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedDriedPeasCollections = mergeDriedPeasCollections(
      parsed.driedPeasCollections || []
    );
    if (
      !Array.isArray(parsed.driedPeasCollections) ||
      parsed.driedPeasCollections.length !== mergedDriedPeasCollections.length ||
      JSON.stringify(parsed.driedPeasCollections) !==
        JSON.stringify(mergedDriedPeasCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedPranksNoveltiesCollections = mergePranksNoveltiesCollections(
      parsed.pranksNoveltiesCollections || []
    );
    if (
      !Array.isArray(parsed.pranksNoveltiesCollections) ||
      parsed.pranksNoveltiesCollections.length !==
        mergedPranksNoveltiesCollections.length ||
      JSON.stringify(parsed.pranksNoveltiesCollections) !==
        JSON.stringify(mergedPranksNoveltiesCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedFitnessGymCollections = mergeFitnessGymCollections(
      parsed.fitnessGymCollections || []
    );
    if (
      !Array.isArray(parsed.fitnessGymCollections) ||
      parsed.fitnessGymCollections.length !==
        mergedFitnessGymCollections.length ||
      JSON.stringify(parsed.fitnessGymCollections) !==
        JSON.stringify(mergedFitnessGymCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedAccessoriesCollections = mergeAccessoriesCollections(
      parsed.accessoriesCollections || []
    );
    if (
      !Array.isArray(parsed.accessoriesCollections) ||
      parsed.accessoriesCollections.length !==
        mergedAccessoriesCollections.length ||
      JSON.stringify(parsed.accessoriesCollections) !==
        JSON.stringify(mergedAccessoriesCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedSportsCollections = mergeSportsCollections(
      parsed.sportsCollections || []
    );
    if (
      !Array.isArray(parsed.sportsCollections) ||
      parsed.sportsCollections.length !== mergedSportsCollections.length ||
      JSON.stringify(parsed.sportsCollections) !==
        JSON.stringify(mergedSportsCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedFootwearCollections = mergeFootwearCollections(
      parsed.footwearCollections || []
    );
    if (
      !Array.isArray(parsed.footwearCollections) ||
      parsed.footwearCollections.length !== mergedFootwearCollections.length ||
      JSON.stringify(parsed.footwearCollections) !==
        JSON.stringify(mergedFootwearCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedTeenagersCollections = mergeTeenagersCollections(
      parsed.teenagersCollections || []
    );
    if (
      !Array.isArray(parsed.teenagersCollections) ||
      parsed.teenagersCollections.length !== mergedTeenagersCollections.length ||
      JSON.stringify(parsed.teenagersCollections) !==
        JSON.stringify(mergedTeenagersCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const mergedKidsCollections = mergeKidsCollections(
      parsed.kidsCollections || []
    );
    if (
      !Array.isArray(parsed.kidsCollections) ||
      parsed.kidsCollections.length !== mergedKidsCollections.length ||
      JSON.stringify(parsed.kidsCollections) !==
        JSON.stringify(mergedKidsCollections)
    ) {
      didMigrateTaxonomy = true;
    }

    const merged: DatabaseSchema = {
      ...defaults,
      ...parsed,
      users: normalizedUsers,
      orders: cleanedOrders,
      categories: loadedCategories,
      products: loadedProducts,
      mensFashionCollections: mergedCollections,
      womensFashionCollections: mergedWomensCollections,
      electronicsCollections: mergedElectronicsCollections,
      driedFruitsCollections: mergedDriedFruitsCollections,
      nutsCollections: mergedNutsCollections,
      skinCareCollections: mergedSkinCareCollections,
      hairCareCollections: mergedHairCareCollections,
      furnitureCollections: mergedFurnitureCollections,
      driedPeasCollections: mergedDriedPeasCollections,
      pranksNoveltiesCollections: mergedPranksNoveltiesCollections,
      fitnessGymCollections: mergedFitnessGymCollections,
      accessoriesCollections: mergedAccessoriesCollections,
      sportsCollections: mergedSportsCollections,
      footwearCollections: mergedFootwearCollections,
      teenagersCollections: mergedTeenagersCollections,
      kidsCollections: mergedKidsCollections,
      coupons: shouldUpgradeCatalog
        ? defaults.coupons
        : parsed.coupons || defaults.coupons,
      banners: shouldUpgradeCatalog
        ? defaults.banners
        : parsed.banners || defaults.banners,
      settings:
        shouldUpgradeCatalog || parsed.settings?.brandName !== 'KubreeBazzar'
          ? defaults.settings
          : {
              ...defaults.settings,
              ...(parsed.settings || {}),
            },
      reviews: parsed.reviews || defaults.reviews,
      newsletter: (parsed.newsletter || []).filter(
        (n) => !(n.id === 'sub-1' && n.email === 'shopper@kubreebazzar.com')
      ),
      adminActivityLogs: Array.isArray(parsed.adminActivityLogs)
        ? parsed.adminActivityLogs
        : [],
    };
    // Deterministic root-cause image repair across all 16 collection registries
    for (const reg of COLLECTION_REGISTRY_META) {
      const currentArr = merged[reg.dbKey] as unknown as Array<Record<string, unknown>>;
      const repaired = repairCollectionRegistryImages(reg.label, currentArr);
      if (repaired.repairedCount > 0) {
        (merged[reg.dbKey] as unknown as Array<Record<string, unknown>>) = repaired.items;
        didMigrateTaxonomy = true;
      }
    }

    if (didMigrateTaxonomy) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(merged, null, 2), 'utf8');
    }
    return merged;
  } catch {
    const initial = createInitialDatabase();
    for (const reg of COLLECTION_REGISTRY_META) {
      const currentArr = initial[reg.dbKey] as unknown as Array<Record<string, unknown>>;
      const repaired = repairCollectionRegistryImages(reg.label, currentArr);
      if (repaired.repairedCount > 0) {
        (initial[reg.dbKey] as unknown as Array<Record<string, unknown>>) = repaired.items;
      }
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

let db: DatabaseSchema = loadDatabase();

function saveDatabase() {
  fs.writeFileSync(STORE_FILE, JSON.stringify(db, null, 2), 'utf8');
}

interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    email: string;
    role: User['role'];
    adminRole: AdminRoleKey | null;
  };
}

function hasSuperAdminAccount(): boolean {
  return db.users.some(
    (u) =>
      u.isActive !== false &&
      normalizeAdminRole(u) === 'super_admin'
  );
}

function recordAdminActivity(
  req: AuthenticatedRequest,
  action: string,
  resourceType: string,
  resourceId: string,
  details?: Record<string, unknown>
) {
  if (!req.auth?.adminRole) return;
  const entry: AdminActivityLog = {
    id: `act-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
    actorUserId: req.auth.userId,
    actorEmail: req.auth.email,
    actorRole: req.auth.adminRole,
    action,
    resourceType,
    resourceId,
    details,
    createdAt: new Date().toISOString(),
  };
  db.adminActivityLogs = [entry, ...(db.adminActivityLogs || [])].slice(0, 500);
  saveDatabase();
  void logAdminActivityToMongo(entry).catch(() => null);
}

function issueAuthSession(
  req: Request,
  res: Response,
  user: StoredUser,
  adminRole?: AdminRoleKey | null
): string {
  const token = signToken({
    userId: user.id,
    role: user.role,
    ...(adminRole ? { adminRole } : {}),
  });
  const tokenHash = hashTokenSha256(token);
  const expiresAtDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  activeSessions.set(tokenHash, {
    userId: user.id,
    expiresAt: expiresAtDate.getTime(),
  });
  void syncSessionToMongo({
    tokenHash,
    userId: user.id,
    role: user.role,
    adminRole: adminRole || null,
    userAgent: String(req.headers['user-agent'] || '').slice(0, 180),
    ip: String(req.ip || req.socket.remoteAddress || '').slice(0, 64),
    createdAt: new Date().toISOString(),
    expiresAtDate,
  }).catch(() => null);
  setSessionCookie(req, res, token);
  return token;
}

function extractRequestToken(req: Request): { token: string; viaCookie: boolean } | null {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    const t = header.slice(7).trim();
    if (t && t !== 'cookie-session' && t !== 'null' && t !== 'undefined') {
      return { token: t, viaCookie: false };
    }
  }
  const cookies = parseCookies(req);
  if (cookies.kb_session) {
    return { token: cookies.kb_session, viaCookie: true };
  }
  return null;
}

function passesCsrfCheck(req: Request): boolean {
  const method = req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return true;
  if (String(req.headers['x-requested-with'] || '').toLowerCase() === 'xmlhttprequest') {
    return true;
  }
  const host = String(req.headers.host || '').toLowerCase();
  const origin = String(req.headers.origin || '').toLowerCase();
  const referer = String(req.headers.referer || '').toLowerCase();
  if (origin) {
    try {
      return new URL(origin).host.toLowerCase() === host;
    } catch {
      return false;
    }
  }
  if (referer) {
    try {
      return new URL(referer).host.toLowerCase() === host;
    } catch {
      return false;
    }
  }
  return false;
}

async function resolveAuthFromRequest(
  req: Request
): Promise<AuthenticatedRequest['auth'] | null> {
  const extracted = extractRequestToken(req);
  if (!extracted) return null;

  if (extracted.viaCookie && !passesCsrfCheck(req)) {
    return null;
  }

  const localVerified = verifyToken(extracted.token);
  if (!localVerified) return null;

  const tokenHash = hashTokenSha256(extracted.token);
  if (isMongoConfigured()) {
    const localSess = activeSessions.get(tokenHash);
    if (!localSess || localSess.expiresAt < Date.now()) {
      const dbSess = await findSessionInMongo(tokenHash);
      if (!dbSess) {
        // Allow signed token fallback only if created before server restart in local mode; revoke if explicitly deleted
        if (localSess && localSess.expiresAt < Date.now()) return null;
      } else {
        activeSessions.set(tokenHash, {
          userId: dbSess.userId,
          expiresAt: dbSess.expiresAtDate.getTime(),
        });
      }
    }
  } else if (activeSessions.has(tokenHash)) {
    const sess = activeSessions.get(tokenHash)!;
    if (sess.expiresAt < Date.now()) {
      activeSessions.delete(tokenHash);
      return null;
    }
  }

  const existing = db.users.find((u) => u.id === localVerified.userId);
  if (!existing || existing.isActive === false) return null;
  const adminRole = normalizeAdminRole(existing);
  return {
    userId: existing.id,
    email: existing.email,
    role: existing.role,
    adminRole,
  };
}

async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const verified = await resolveAuthFromRequest(req);
    if (verified) req.auth = verified;
  } catch {
    // Ignore optional auth failures
  }
  next();
}

async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const verified = await resolveAuthFromRequest(req);
    if (!verified) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    req.auth = verified;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session token' });
  }
}

function requirePermission(permission: AdminPermission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    void requireAuth(req, res, () => {
      if (!req.auth?.adminRole) {
        res.status(403).json({ error: 'Administrator privileges required' });
        return;
      }
      if (
        !hasAdminPermission(
          { role: req.auth.role, adminRole: req.auth.adminRole },
          permission
        )
      ) {
        res.status(403).json({
          error: `Your admin role (${req.auth.adminRole}) does not have permission for: ${permission}`,
        });
        return;
      }
      next();
    });
  };
}

function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  return requirePermission('view_dashboard')(req, res, next);
}

function sanitizeUser(u: StoredUser): User {
  const { passwordHash: _pw, ...safe } = u;
  const normalizedAdminRole = normalizeAdminRole(u) || undefined;
  return {
    ...safe,
    adminRole: normalizedAdminRole,
    isActive: safe.isActive !== false,
    addresses: Array.isArray(safe.addresses) ? safe.addresses : [],
    wishlist: Array.isArray(safe.wishlist) ? safe.wishlist : [],
    cart: Array.isArray(safe.cart) ? safe.cart : [],
  };
}

function buildValidatedCart(rawCart: CartItem[] = []): CartItem[] {
  const merged = new Map<string, CartItem>();
  for (const raw of rawCart) {
    if (!raw || !raw.productId) continue;
    const product = db.products.find(
      (p) => p.id === raw.productId && p.enabled !== false
    );
    if (!product) continue;
    const variant =
      product.variants.find((v) => v.id === raw.variantId) ||
      product.variants[0];
    const resolvedVariantId = variant ? variant.id : raw.variantId || 'default';
    const available = variant ? Number(variant.stock || 0) : Number(product.stock || 0);
    const basePrice = product.price + (variant ? variant.priceDelta : 0);
    const unitPrice = Number(
      (basePrice * (1 - (product.discountPercent || 0) / 100)).toFixed(2)
    );
    if (unitPrice <= 0 || available <= 0) continue;

    const key = `${product.id}::${resolvedVariantId}`;
    const existing = merged.get(key);
    const desiredQty = (existing ? existing.quantity : 0) + Math.max(1, Math.floor(Number(raw.quantity || 1)));
    const clampedQty = Math.min(available, Math.max(1, desiredQty));
    merged.set(key, {
      productId: product.id,
      variantId: resolvedVariantId,
      quantity: clampedQty,
    });
  }
  return Array.from(merged.values());
}

// Health check & Non-sensitive Infrastructure Status
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'kubreebazzar-api' });
});

app.get('/api/system/status', (_req, res) => {
  res.json(getMongoInfrastructureStatus(hasSuperAdminAccount()));
});

app.get('/api/admin/bootstrap-status', (_req, res) => {
  res.json({
    requiresBootstrapToken: Boolean(process.env.INITIAL_ADMIN_BOOTSTRAP_TOKEN),
    ...getMongoInfrastructureStatus(hasSuperAdminAccount()),
  });
});

app.post('/api/admin/bootstrap', async (req, res) => {
  const clientIp = String(req.ip || req.socket.remoteAddress || 'unknown');
  if (!checkRateLimit(`bootstrap:${clientIp}`, 10, 60_000)) {
    res.status(429).json({ error: 'Too many setup attempts. Please wait a minute and try again.' });
    return;
  }

  if (hasSuperAdminAccount()) {
    res.status(403).json({
      error: 'A Super Admin account is already provisioned. Sign in with your admin credentials.',
    });
    return;
  }

  const requiredBootstrapToken = (process.env.INITIAL_ADMIN_BOOTSTRAP_TOKEN || '').trim();
  const providedToken = String(req.body?.bootstrapToken || '').trim();
  if (requiredBootstrapToken) {
    const bufA = Buffer.from(providedToken);
    const bufB = Buffer.from(requiredBootstrapToken);
    if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
      res.status(403).json({ error: 'Invalid first-run setup bootstrap token.' });
      return;
    }
  }

  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
    res.status(400).json({
      error: 'Valid full name, email, and a password of at least 8 characters are required.',
    });
    return;
  }

  const existingIdx = db.users.findIndex((u) => u.email.toLowerCase() === email);
  const newSuperAdmin: StoredUser = {
    id: existingIdx >= 0 ? db.users[existingIdx].id : `user-superadmin-${Date.now()}`,
    name,
    email,
    emailVerified: true,
    passwordHash: hashPassword(password),
    role: 'super_admin',
    adminRole: 'super_admin',
    isActive: true,
    addresses: existingIdx >= 0 ? db.users[existingIdx].addresses : [],
    wishlist: existingIdx >= 0 ? db.users[existingIdx].wishlist : [],
    cart: existingIdx >= 0 ? db.users[existingIdx].cart : [],
    createdAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) db.users[existingIdx] = newSuperAdmin;
  else db.users.push(newSuperAdmin);

  const actLog: AdminActivityLog = {
    id: `act-${Date.now()}`,
    actorUserId: newSuperAdmin.id,
    actorEmail: email,
    actorRole: 'super_admin',
    action: 'admin.bootstrap_super_admin',
    resourceType: 'admin_user',
    resourceId: newSuperAdmin.id,
    createdAt: new Date().toISOString(),
  };
  db.adminActivityLogs = [actLog, ...(db.adminActivityLogs || [])];
  saveDatabase();
  void syncUserToMongo(newSuperAdmin).catch(() => null);
  void logAdminActivityToMongo(actLog).catch(() => null);

  const token = issueAuthSession(req, res, newSuperAdmin, 'super_admin');
  res.status(201).json({ token, user: sanitizeUser(newSuperAdmin) });
});

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  const clientIp = String(req.ip || req.socket.remoteAddress || 'unknown');
  if (!checkRateLimit(`admin-login:${clientIp}:${normalizedEmail}`, 10, 60_000)) {
    res.status(429).json({ error: 'Too many login attempts. Please wait a minute before trying again.' });
    return;
  }

  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user || !verifyPassword(String(password), user.passwordHash)) {
    res.status(401).json({ error: 'Invalid administrator credentials' });
    return;
  }
  if (user.isActive === false) {
    res.status(403).json({ error: 'This administrator account has been deactivated.' });
    return;
  }
  const adminRole = normalizeAdminRole(user);
  if (!adminRole) {
    res.status(403).json({ error: 'Customer accounts cannot access the Admin Portal.' });
    return;
  }

  if (needsBcryptUpgrade(user.passwordHash)) {
    user.passwordHash = hashPassword(String(password));
  }

  const actLog: AdminActivityLog = {
    id: `act-${Date.now()}`,
    actorUserId: user.id,
    actorEmail: user.email,
    actorRole: adminRole,
    action: 'admin.login',
    resourceType: 'session',
    resourceId: user.id,
    createdAt: new Date().toISOString(),
  };
  db.adminActivityLogs = [actLog, ...(db.adminActivityLogs || [])].slice(0, 500);
  saveDatabase();
  void syncUserToMongo(user).catch(() => null);
  void logAdminActivityToMongo(actLog).catch(() => null);

  const token = issueAuthSession(req, res, user, adminRole);
  res.json({ token, user: sanitizeUser(user) });
});

app.get(
  '/api/admin/system-check',
  requirePermission('view_dashboard'),
  async (_req, res) => {
    const infra = getMongoInfrastructureStatus(hasSuperAdminAccount());
    const connectivity = await verifyMongoConnectivity();
    res.json({ ...infra, connectivity });
  }
);

app.get(
  '/api/admin/users',
  requirePermission('manage_users'),
  (_req, res) => {
    const staff = db.users.filter((u) => isAdminRole(u)).map(sanitizeUser);
    res.json(staff);
  }
);

app.post(
  '/api/admin/users',
  requirePermission('manage_users'),
  async (req: AuthenticatedRequest, res) => {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const roleKey = String(req.body?.adminRole || req.body?.role || 'viewer') as AdminRoleKey;
    const validRoles: AdminRoleKey[] = [
      'super_admin',
      'product_manager',
      'order_manager',
      'viewer',
    ];
    if (!validRoles.includes(roleKey)) {
      res.status(400).json({ error: 'Invalid admin role specified' });
      return;
    }
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Valid name and email are required' });
      return;
    }

    const existing = db.users.find((u) => u.email.toLowerCase() === email);
    if (existing) {
      existing.adminRole = roleKey;
      existing.role = roleKey;
      existing.isActive = true;
      if (password.length >= 8) {
        existing.passwordHash = hashPassword(password);
      }
      saveDatabase();
      void syncUserToMongo(existing).catch(() => null);
      recordAdminActivity(req, 'admin.promote_user', 'admin_user', existing.id, {
        roleKey,
      });
      res.json(sanitizeUser(existing));
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    const newStaff: StoredUser = {
      id: `user-staff-${Date.now()}`,
      name,
      email,
      emailVerified: true,
      passwordHash: hashPassword(password),
      role: roleKey,
      adminRole: roleKey,
      isActive: true,
      addresses: [],
      wishlist: [],
      cart: [],
      createdAt: new Date().toISOString(),
    };
    db.users.push(newStaff);
    saveDatabase();
    void syncUserToMongo(newStaff).catch(() => null);
    recordAdminActivity(req, 'admin.create_user', 'admin_user', newStaff.id, {
      email,
      roleKey,
    });
    res.status(201).json(sanitizeUser(newStaff));
  }
);

app.patch(
  '/api/admin/users/:id/role',
  requirePermission('manage_users'),
  async (req: AuthenticatedRequest, res) => {
    const target = db.users.find((u) => u.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const rawNextRole = (req.body?.adminRole ?? req.body?.role) as string | undefined;
    const validRoles: AdminRoleKey[] = [
      'super_admin',
      'product_manager',
      'order_manager',
      'viewer',
    ];
    if (rawNextRole !== undefined && !validRoles.includes(rawNextRole as AdminRoleKey)) {
      res.status(400).json({ error: 'Invalid admin role specified' });
      return;
    }
    const nextRole = rawNextRole as AdminRoleKey | undefined;
    const nextActive =
      req.body?.isActive !== undefined ? Boolean(req.body.isActive) : target.isActive !== false;
    const activeSuperAdmins = db.users.filter(
      (u) => u.isActive !== false && normalizeAdminRole(u) === 'super_admin'
    );
    if (
      normalizeAdminRole(target) === 'super_admin' &&
      ((nextRole && nextRole !== 'super_admin') || !nextActive) &&
      activeSuperAdmins.length <= 1
    ) {
      res.status(400).json({
        error: 'Cannot remove or deactivate the last active Super Admin.',
      });
      return;
    }

    if (nextRole) {
      target.adminRole = nextRole;
      target.role = nextRole;
    }
    target.isActive = nextActive;
    saveDatabase();
    void syncUserToMongo(target).catch(() => null);
    recordAdminActivity(req, 'admin.update_role', 'admin_user', target.id, {
      adminRole: target.adminRole,
      isActive: target.isActive,
    });
    res.json(sanitizeUser(target));
  }
);

app.get(
  '/api/admin/activity-logs',
  requirePermission('view_reports'),
  (_req, res) => {
    res.json(db.adminActivityLogs || []);
  }
);

// Site Settings (Public Read, Admin Write)
app.get('/api/settings', (_req, res) => {
  res.json(db.settings);
});

app.put(
  '/api/admin/settings',
  requirePermission('manage_settings'),
  (req: AuthenticatedRequest, res) => {
    db.settings = {
      ...db.settings,
      ...req.body,
    };
    saveDatabase();
    void syncSettingsToMongo(db.settings).catch(() => null);
    recordAdminActivity(req, 'settings.update', 'site_settings', 'default');
    res.json(db.settings);
  }
);

// Categories
app.get('/api/categories', (_req, res) => {
  const activeProducts = db.products.filter((p) => p.enabled !== false);
  const enriched = db.categories.map((cat) => {
    const parentId = cat.parentCategoryId || cat.parentId;
    const itemCount = parentId
      ? activeProducts.filter((p) =>
          productMatchesFilter(
            p,
            parentId,
            cat.name || cat.id,
            'All',
            db.categories
          )
        ).length
      : activeProducts.filter(
          (p) =>
            productMatchesCategory(
              p.category,
              p.subcategory,
              p.subSubcategory,
              cat.id,
              db.categories
            ) ||
            productMatchesCategory(
              p.category,
              p.subcategory,
              p.subSubcategory,
              cat.slug,
              db.categories
            )
        ).length;
    return {
      ...cat,
      itemCount,
    };
  });
  res.json(enriched);
});

const handleCreateCategory = (req: AuthenticatedRequest, res: Response) => {
  const {
    id,
    name,
    title,
    slug,
    parentCategoryId,
    parentId,
    subtitle,
    description,
    image,
    bannerUrl,
    displayOrder,
    status,
    subcategories,
    modelType,
    accentColor,
  } = req.body;
  if (!id || !title) {
    res.status(400).json({ error: 'Category name and title are required' });
    return;
  }
  if (db.categories.some((c) => c.id.toLowerCase() === String(id).toLowerCase())) {
    res.status(409).json({ error: 'Category already exists' });
    return;
  }
  const cleanSlug = slug || slugifyCategory(String(name || id));
  const subList = Array.isArray(subcategories) ? subcategories : [];
  const newCat: CategoryInfo = {
    id: String(id).trim(),
    name: String(name || id).trim(),
    title: String(title).trim(),
    slug: cleanSlug,
    parentCategoryId: parentCategoryId || parentId || null,
    parentId: parentCategoryId || parentId || null,
    subtitle: String(subtitle || 'Curated Department'),
    description: String(description || ''),
    image: image || '/images/products/Rice.jpg',
    ...(bannerUrl ? { bannerUrl: String(bannerUrl).trim() } : {}),
    displayOrder: typeof displayOrder === 'number' ? displayOrder : db.categories.length + 1,
    status: status === 'inactive' ? 'inactive' : 'active',
    subcategories: subList,
    hierarchyChildren: subList.map((s: string) => ({
      name: String(s).trim(),
      slug: slugifyCategory(String(s)),
      children: [],
    })),
    modelType: modelType || 'rice',
    accentColor: accentColor || '#1D6FD8',
  };
  db.categories.push(newCat);
  saveDatabase();
  void syncCategoryToMongo(newCat).catch(() => null);
  recordAdminActivity(req, 'category.create', 'category', newCat.id, {
    title: newCat.title,
    parentCategoryId: newCat.parentCategoryId,
  });
  res.status(201).json(newCat);
};

const handleUpdateCategory = (req: AuthenticatedRequest, res: Response) => {
  const idx = db.categories.findIndex(
    (c) => c.id.toLowerCase() === req.params.id.toLowerCase()
  );
  if (idx === -1) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  const existing = db.categories[idx];
  const nextSubcategories = Array.isArray(req.body.subcategories)
    ? req.body.subcategories.map((s: string) => String(s).trim()).filter(Boolean)
    : existing.subcategories;

  const nextHierarchyChildren = Array.isArray(req.body.hierarchyChildren)
    ? req.body.hierarchyChildren
    : Array.isArray(req.body.subcategories)
      ? nextSubcategories.map((subName: string) => {
          const prev = existing.hierarchyChildren?.find(
            (h) => h.name.toLowerCase() === subName.toLowerCase()
          );
          return (
            prev || {
              name: subName,
              slug: slugifyCategory(subName),
              children: [],
            }
          );
        })
      : existing.hierarchyChildren;

  const nextParent =
    req.body.parentCategoryId !== undefined
      ? req.body.parentCategoryId || null
      : existing.parentCategoryId;

  db.categories[idx] = {
    ...existing,
    ...req.body,
    id: existing.id,
    parentCategoryId: nextParent,
    parentId: nextParent,
    subcategories: nextSubcategories,
    hierarchyChildren: nextHierarchyChildren,
  };
  saveDatabase();
  void syncCategoryToMongo(db.categories[idx]).catch(() => null);
  recordAdminActivity(req, 'category.update', 'category', existing.id, {
    title: db.categories[idx].title,
    status: db.categories[idx].status,
  });
  res.json(db.categories[idx]);
};

const handleDeleteCategory = (req: AuthenticatedRequest, res: Response) => {
  const existing = db.categories.find(
    (c) => c.id.toLowerCase() === req.params.id.toLowerCase()
  );
  if (!existing) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  db.categories = db.categories.filter(
    (c) => c.id.toLowerCase() !== req.params.id.toLowerCase()
  );
  saveDatabase();
  void deleteCategoryFromMongo(existing.id).catch(() => null);
  recordAdminActivity(req, 'category.delete', 'category', existing.id, {
    title: existing.title,
  });
  res.json({ deleted: true });
};

app.post('/api/categories', requirePermission('manage_categories'), handleCreateCategory);
app.post('/api/admin/categories', requirePermission('manage_categories'), handleCreateCategory);
app.put('/api/categories/:id', requirePermission('manage_categories'), handleUpdateCategory);
app.put('/api/admin/categories/:id', requirePermission('manage_categories'), handleUpdateCategory);
app.patch('/api/admin/categories/:id', requirePermission('manage_categories'), handleUpdateCategory);
app.delete('/api/categories/:id', requirePermission('manage_categories'), handleDeleteCategory);
app.delete('/api/admin/categories/:id', requirePermission('manage_categories'), handleDeleteCategory);

function updateCollectionItemHandler(
  categoryLabel: string,
  dbKey:
    | 'mensFashionCollections'
    | 'womensFashionCollections'
    | 'electronicsCollections'
    | 'driedFruitsCollections'
    | 'nutsCollections'
    | 'skinCareCollections'
    | 'hairCareCollections'
    | 'furnitureCollections'
    | 'driedPeasCollections'
    | 'pranksNoveltiesCollections'
    | 'fitnessGymCollections'
    | 'accessoriesCollections'
    | 'sportsCollections'
    | 'footwearCollections'
    | 'teenagersCollections'
    | 'kidsCollections',
  notFoundLabel: string,
  hasImageStatus: boolean
) {
  return (req: AuthenticatedRequest, res: Response) => {
    const list = db[dbKey] as unknown as Array<Record<string, unknown>>;
    const idx = list.findIndex(
      (c) => String(c.id || '').toLowerCase() === req.params.id.toLowerCase()
    );
    if (idx === -1) {
      res.status(404).json({ error: `${notFoundLabel} not found` });
      return;
    }
    const existing = list[idx];
    const nextStatus =
      req.body.status === 'approved' || req.body.approved === true
        ? 'approved'
        : req.body.status === 'pending_approval' || req.body.approved === false
          ? 'pending_approval'
          : String(existing.status || 'approved');

    const nextImage =
      typeof req.body.image === 'string'
        ? req.body.image.trim()
        : String(existing.image || '');
    const nextImageStatus = !nextImage
      ? 'quota_pending'
      : nextImage.startsWith('/uploads/') || nextImage.startsWith('/api/images/')
        ? 'uploaded'
        : 'generated';

    const updatedItem: Record<string, unknown> = {
      ...existing,
      name:
        typeof req.body.name === 'string' && req.body.name.trim()
          ? req.body.name.trim()
          : existing.name,
      description:
        typeof req.body.description === 'string' && req.body.description.trim()
          ? req.body.description.trim()
          : existing.description,
      image: nextImage,
      ...(hasImageStatus ? { imageStatus: nextImageStatus } : {}),
      keywords: Array.isArray(req.body.keywords)
        ? req.body.keywords.map((k: string) => String(k).trim()).filter(Boolean)
        : existing.keywords,
      status: nextStatus,
      approved: nextStatus === 'approved',
    };
    list[idx] = updatedItem;
    saveDatabase();
    void syncCollectionToMongo(categoryLabel, updatedItem).catch(() => null);
    recordAdminActivity(req, 'collection.update', 'collection', String(existing.id), {
      category: categoryLabel,
      status: nextStatus,
      imageUpdated: nextImage !== String(existing.image || ''),
    });
    res.json(updatedItem);
  };
}

// Men's Fashion Collections (38 Clothing Types)
app.get('/api/mens-fashion/collections', (_req, res) => {
  res.json(db.mensFashionCollections || INITIAL_MENS_FASHION_COLLECTIONS);
});
app.put(
  '/api/admin/mens-fashion/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler("Men's Fashion", 'mensFashionCollections', "Men's Fashion collection", false)
);

// Women's Fashion Collections (78 Clothing Types across 13 Subcategories)
app.get('/api/womens-fashion/collections', (_req, res) => {
  res.json(db.womensFashionCollections || INITIAL_WOMENS_FASHION_COLLECTIONS);
});
app.put(
  '/api/admin/womens-fashion/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler("Women's Fashion", 'womensFashionCollections', "Women's Fashion subcategory", true)
);

// Electronics Collections (47 Canonical Collections across 10 Groups)
app.get('/api/electronics/collections', (_req, res) => {
  res.json(db.electronicsCollections || INITIAL_ELECTRONICS_COLLECTIONS);
});
app.put(
  '/api/admin/electronics/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Electronics', 'electronicsCollections', 'Electronics collection', true)
);

// Dried Fruits Varieties (15 Standalone Collections)
app.get('/api/dried-fruits/collections', (_req, res) => {
  res.json(db.driedFruitsCollections || INITIAL_DRIED_FRUITS_COLLECTIONS);
});
app.put(
  '/api/admin/dried-fruits/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Dried Fruits', 'driedFruitsCollections', 'Dried Fruits variety', true)
);

// Nuts Varieties (15 Standalone Collections)
app.get('/api/nuts/collections', (_req, res) => {
  res.json(db.nutsCollections || INITIAL_NUTS_COLLECTIONS);
});
app.put(
  '/api/admin/nuts/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Nuts', 'nutsCollections', 'Nut variety', true)
);

// Skin Care Collections (7 Groups · 30 Product-Type Collections)
app.get('/api/skin-care/collections', (_req, res) => {
  res.json(db.skinCareCollections || INITIAL_SKIN_CARE_COLLECTIONS);
});
app.put(
  '/api/admin/skin-care/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Skin Care', 'skinCareCollections', 'Skin care collection', true)
);

// Hair Care Collections (7 Groups · 30 Collections)
app.get('/api/hair-care/collections', (_req, res) => {
  res.json(db.hairCareCollections || INITIAL_HAIR_CARE_COLLECTIONS);
});
app.put(
  '/api/admin/hair-care/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Hair Care', 'hairCareCollections', 'Hair care collection', true)
);

// Furniture Collections (7 Groups · 30 Collections)
app.get('/api/furniture/collections', (_req, res) => {
  res.json(db.furnitureCollections || INITIAL_FURNITURE_COLLECTIONS);
});
app.put(
  '/api/admin/furniture/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Furniture', 'furnitureCollections', 'Furniture collection', true)
);

// Dried Peas & Related Dried Pulses Collections (2 Groups · 15 Collections)
app.get('/api/dried-peas/collections', (_req, res) => {
  res.json(db.driedPeasCollections || INITIAL_DRIED_PEAS_COLLECTIONS);
});
app.put(
  '/api/admin/dried-peas/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Dried Peas', 'driedPeasCollections', 'Dried Peas collection', true)
);

// Pranks & Novelties Collections (7 Groups · 30 Collections)
app.get('/api/pranks-novelties/collections', (_req, res) => {
  res.json(db.pranksNoveltiesCollections || INITIAL_PRANKS_NOVELTIES_COLLECTIONS);
});
app.put(
  '/api/admin/pranks-novelties/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Pranks & Novelties', 'pranksNoveltiesCollections', 'Pranks & Novelties collection', true)
);

// Fitness & Gym Collections (7 Groups · 35 Collections)
app.get('/api/fitness-gym/collections', (_req, res) => {
  res.json(db.fitnessGymCollections || INITIAL_FITNESS_GYM_COLLECTIONS);
});
app.put(
  '/api/admin/fitness-gym/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Fitness & Gym', 'fitnessGymCollections', 'Fitness & Gym collection', true)
);

// Accessories Collections (8 Groups · 35 Collections)
app.get('/api/accessories/collections', (_req, res) => {
  res.json(db.accessoriesCollections || INITIAL_ACCESSORIES_COLLECTIONS);
});
app.put(
  '/api/admin/accessories/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Accessories', 'accessoriesCollections', 'Accessories collection', true)
);

// Sports Collections (10 Groups · 40 Collections)
app.get('/api/sports/collections', (_req, res) => {
  res.json(db.sportsCollections || INITIAL_SPORTS_COLLECTIONS);
});
app.put(
  '/api/admin/sports/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Sports', 'sportsCollections', 'Sports collection', true)
);

// Footwear Collections (7 Groups · 40 Collections)
app.get('/api/footwear/collections', (_req, res) => {
  res.json(db.footwearCollections || INITIAL_FOOTWEAR_COLLECTIONS);
});
app.put(
  '/api/admin/footwear/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Footwear', 'footwearCollections', 'Footwear collection', true)
);

// Teenagers Collections (10 Groups · 64 Collections)
app.get('/api/teenagers/collections', (_req, res) => {
  res.json(db.teenagersCollections || INITIAL_TEENAGERS_COLLECTIONS);
});
app.put(
  '/api/admin/teenagers/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Teenagers', 'teenagersCollections', 'Teenagers collection', true)
);

// Kids Collections (11 Groups · 65 Collections)
app.get('/api/kids/collections', (_req, res) => {
  res.json(db.kidsCollections || INITIAL_KIDS_COLLECTIONS);
});
app.put(
  '/api/admin/kids/collections/:id',
  requirePermission('manage_categories'),
  updateCollectionItemHandler('Kids', 'kidsCollections', 'Kids collection', true)
);

// Products (with 3-level hierarchical filtering, search & sorting)
app.get('/api/products', optionalAuth, (req: AuthenticatedRequest, res) => {
  const {
    category,
    subcategory,
    subSubcategory,
    meal,
    type,
    search,
    q,
    sort,
    minPrice,
    maxPrice,
    inStock,
    availability,
    featured,
    includeDisabled,
  } = req.query;

  const canSeeDisabled = Boolean(req.auth?.adminRole);

  const catStr = category ? String(category) : 'All';
  const subStr = subcategory ? String(subcategory) : 'All';
  const thirdStr = subSubcategory
    ? String(subSubcategory)
    : meal
      ? String(meal)
      : type
        ? String(type)
        : 'All';

  const searchTerm = search
    ? String(search)
    : q
      ? String(q)
      : '';

  const availabilityMode: AvailabilityFilter =
    availability === 'in-stock' || availability === 'out-of-stock'
      ? availability
      : inStock === 'true'
        ? 'in-stock'
        : 'all';

  const minP =
    minPrice !== undefined && minPrice !== '' && !Number.isNaN(Number(minPrice))
      ? Number(minPrice)
      : undefined;
  const maxP =
    maxPrice !== undefined && maxPrice !== '' && !Number.isNaN(Number(maxPrice))
      ? Number(maxPrice)
      : undefined;

  const validSorts = new Set([
    'relevance',
    'featured',
    'price-asc',
    'price-desc',
    'name-asc',
    'name-desc',
    'newest',
    'rating',
  ]);
  const sortMode: CatalogSortOption =
    sort && validSorts.has(String(sort))
      ? (String(sort) as CatalogSortOption)
      : searchTerm.trim()
        ? 'relevance'
        : 'featured';

  const list = filterAndSortProducts(db.products, db.categories, {
    query: searchTerm,
    category: catStr,
    subcategory: subStr,
    subSubcategory: thirdStr,
    minPrice: minP,
    maxPrice: maxP,
    availability: availabilityMode,
    featuredOnly: featured === 'true',
    sortBy: sortMode,
    includeDisabled: canSeeDisabled,
  });

  res.json(list);
});

// Unified Search Endpoint (Products + Matching Categories)
app.get('/api/search', optionalAuth, (req: AuthenticatedRequest, res) => {
  const {
    q = '',
    category = 'All',
    subcategory = 'All',
    subSubcategory = 'All',
    minPrice,
    maxPrice,
    availability = 'all',
    sort,
    limit,
    includeDisabled,
  } = req.query;

  const queryStr = typeof q === 'string' ? q.trim() : String(q || '').trim();
  const canSeeDisabled = Boolean(req.auth?.adminRole);

  const minP =
    minPrice !== undefined && minPrice !== '' && !Number.isNaN(Number(minPrice))
      ? Number(minPrice)
      : undefined;
  const maxP =
    maxPrice !== undefined && maxPrice !== '' && !Number.isNaN(Number(maxPrice))
      ? Number(maxPrice)
      : undefined;

  const availabilityMode: AvailabilityFilter =
    availability === 'in-stock' || availability === 'out-of-stock'
      ? availability
      : 'all';

  const validSorts = new Set([
    'relevance',
    'featured',
    'price-asc',
    'price-desc',
    'name-asc',
    'name-desc',
    'newest',
    'rating',
  ]);
  const sortMode: CatalogSortOption =
    sort && validSorts.has(String(sort))
      ? (String(sort) as CatalogSortOption)
      : queryStr
        ? 'relevance'
        : 'featured';

  const allMatchedProducts = filterAndSortProducts(db.products, db.categories, {
    query: queryStr,
    category: String(category || 'All'),
    subcategory: String(subcategory || 'All'),
    subSubcategory: String(subSubcategory || 'All'),
    minPrice: minP,
    maxPrice: maxP,
    availability: availabilityMode,
    sortBy: sortMode,
    includeDisabled: canSeeDisabled,
  });

  const maxLimit =
    limit !== undefined && !Number.isNaN(Number(limit)) && Number(limit) > 0
      ? Math.min(200, Math.floor(Number(limit)))
      : undefined;

  const matchingCategories = queryStr
    ? searchMatchingCategories(db.categories, db.products, queryStr)
    : [];

  const matchingCollections = queryStr
    ? [
        ...searchRiceCollections(queryStr),
        ...searchKidsCollections(queryStr, db.kidsCollections),
        ...searchTeenagersCollections(queryStr, db.teenagersCollections),
        ...searchFootwearCollections(queryStr, db.footwearCollections),
        ...searchSportsCollections(queryStr, db.sportsCollections),
        ...searchAccessoriesCollections(queryStr, db.accessoriesCollections),
        ...searchFitnessGymCollections(queryStr, db.fitnessGymCollections),
        ...searchPranksNoveltiesCollections(
          queryStr,
          db.pranksNoveltiesCollections
        ),
        ...searchDriedPeasCollections(queryStr, db.driedPeasCollections),
        ...searchFurnitureCollections(queryStr, db.furnitureCollections),
        ...searchHairCareCollections(queryStr, db.hairCareCollections),
        ...searchSkinCareCollections(queryStr, db.skinCareCollections),
        ...searchNutsCollections(queryStr, db.nutsCollections),
        ...searchDriedFruitsCollections(queryStr, db.driedFruitsCollections),
        ...searchElectronicsCollections(queryStr, db.electronicsCollections),
        ...searchWomensFashionCollections(queryStr, db.womensFashionCollections),
        ...searchMensFashionCollections(queryStr, db.mensFashionCollections),
      ].sort((a, b) => b.score - a.score)
    : [];

  res.json({
    query: queryStr,
    total: allMatchedProducts.length,
    products: maxLimit
      ? allMatchedProducts.slice(0, maxLimit)
      : allMatchedProducts,
    categories: maxLimit ? matchingCategories.slice(0, 6) : matchingCategories,
    collections: maxLimit
      ? matchingCollections.slice(0, 6)
      : matchingCollections,
  });
});

app.get('/api/products/:id', optionalAuth, (req: AuthenticatedRequest, res) => {
  const product = db.products.find(
    (p) => p.id === req.params.id || p.slug === req.params.id
  );
  if (!product || ((product.enabled === false || product.isDraft) && !req.auth?.adminRole)) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

// Admin: Create Product (also aliased on /api/admin/products)
const handleCreateProduct = (req: AuthenticatedRequest, res: Response) => {
  const body = req.body;
  if (!body.name || !body.category || body.price === undefined) {
    res.status(400).json({ error: 'Name, category, and price are required' });
    return;
  }
  const id = `prod-${Date.now()}`;
  const slug = String(body.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const variants = Array.isArray(body.variants)
    ? body.variants
    : [
        {
          id: `var-${Date.now()}`,
          name: 'Standard Edition',
          colorHex: '#3B82F6',
          priceDelta: 0,
          stock: Number(body.stock ?? 0),
        },
      ];

  const totalStock =
    variants.length > 0
      ? variants.reduce(
          (acc: number, v: { stock: number }) => acc + Number(v.stock || 0),
          0
        )
      : Math.max(0, Number(body.stock ?? 0));

  const status =
    body.status === 'draft' || body.status === 'archived'
      ? body.status
      : body.isDraft
        ? 'draft'
        : body.enabled === false
          ? 'archived'
          : 'published';

  const newProduct: Product = {
    id,
    name: String(body.name),
    ...(body.tamilName && String(body.tamilName).trim()
      ? { tamilName: String(body.tamilName).trim() }
      : {}),
    slug: `${slug}-${Date.now().toString().slice(-4)}`,
    sku: body.sku ? String(body.sku).trim() : `KB-${Date.now().toString().slice(-6)}`,
    category: body.category,
    subcategory: body.subcategory ? String(body.subcategory).trim() : undefined,
    subSubcategory: body.subSubcategory
      ? String(body.subSubcategory).trim()
      : undefined,
    collectionId: body.collectionId ? String(body.collectionId).trim() : undefined,
    tags: Array.isArray(body.tags) ? body.tags : undefined,
    brand: body.brand || 'KubreeBazzar',
    price: Math.max(0, Number(body.price)),
    ...(body.originalPrice !== undefined
      ? { originalPrice: Number(body.originalPrice) }
      : {}),
    discountPercent: Math.max(0, Number(body.discountPercent || 0)),
    shortDescription:
      String(body.shortDescription || '').trim() ||
      String(body.description || '').slice(0, 120),
    description: String(body.description || ''),
    images: (() => {
      const cleaned = Array.isArray(body.images)
        ? body.images.map((s: unknown) => String(s || '').trim()).filter(Boolean)
        : [];
      return cleaned.length > 0 ? cleaned : ['/images/products/Rice.jpg'];
    })(),
    ...(Array.isArray(body.imageMetadata) ? { imageMetadata: body.imageMetadata } : {}),
    modelType: body.modelType || 'grocery',
    has3DModel: body.has3DModel !== undefined ? Boolean(body.has3DModel) : false,
    glbUrl: body.glbUrl || undefined,
    variants,
    specs: Array.isArray(body.specs) ? body.specs : [],
    stock: totalStock,
    lowStockThreshold: Number(body.lowStockThreshold ?? 10),
    availabilityStatus:
      body.availabilityStatus ||
      (totalStock <= 0 ? 'out_of_stock' : totalStock <= 10 ? 'low_stock' : 'in_stock'),
    status,
    ...(body.dimensions ? { dimensions: String(body.dimensions) } : {}),
    ...(body.material ? { material: String(body.material) } : {}),
    rating: body.rating !== undefined ? Number(body.rating) : 0,
    reviewCount: body.reviewCount !== undefined ? Number(body.reviewCount) : 0,
    isDemoRating: false,
    featured: Boolean(body.featured),
    trending: Boolean(body.trending),
    bestSeller: Boolean(body.bestSeller),
    newArrival: body.newArrival !== undefined ? Boolean(body.newArrival) : true,
    tag: body.tag || undefined,
    enabled: status === 'published',
    isDraft: status === 'draft',
    isBundle: Boolean(body.isBundle),
    ...(Array.isArray(body.bundleItems) ? { bundleItems: body.bundleItems } : {}),
    ...(body.usageInstructions
      ? { usageInstructions: String(body.usageInstructions) }
      : {}),
    ...(body.ageSuitability ? { ageSuitability: String(body.ageSuitability) } : {}),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  saveDatabase();
  void syncProductToMongo(newProduct).catch(() => null);
  recordAdminActivity(req, 'product.create', 'product', newProduct.id, {
    name: newProduct.name,
    category: newProduct.category,
    status: newProduct.status,
  });
  res.status(201).json(newProduct);
};

app.post('/api/products', requirePermission('manage_products'), handleCreateProduct);
app.post('/api/admin/products', requirePermission('manage_products'), handleCreateProduct);

// Admin: Update Product (also aliased on /api/admin/products/:id)
const handleUpdateProduct = (req: AuthenticatedRequest, res: Response) => {
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const existing = db.products[idx];
  const body = req.body;
  let variants = Array.isArray(body.variants)
    ? body.variants
    : existing.variants;
  if (!Array.isArray(body.variants) && body.stock !== undefined && Number.isFinite(Number(body.stock)) && variants.length > 0) {
    const requestedStock = Math.max(0, Math.floor(Number(body.stock)));
    const otherVariantsStock = variants
      .slice(1)
      .reduce((acc: number, v: { stock: number }) => acc + Number(v.stock || 0), 0);
    variants = variants.map((v: { stock: number; id: string; name: string; priceDelta: number }, vIdx: number) =>
      vIdx === 0 ? { ...v, stock: Math.max(0, requestedStock - otherVariantsStock) } : v
    );
  }
  const computedStock =
    Array.isArray(body.variants) && variants.length > 0
      ? variants.reduce(
          (acc: number, v: { stock: number }) => acc + Number(v.stock || 0),
          0
        )
      : body.stock !== undefined && Number.isFinite(Number(body.stock))
        ? Math.max(0, Math.floor(Number(body.stock)))
        : variants.length > 0
          ? variants.reduce(
              (acc: number, v: { stock: number }) => acc + Number(v.stock || 0),
              0
            )
          : Math.max(0, Number(existing.stock));

  const resolvedStatus =
    body.status === 'draft' || body.status === 'published' || body.status === 'archived'
      ? body.status
      : body.isDraft === true
        ? 'draft'
        : body.enabled === false
          ? 'archived'
          : body.enabled === true
            ? 'published'
            : existing.status || (existing.isDraft ? 'draft' : existing.enabled === false ? 'archived' : 'published');

  const updated: Product = {
    ...existing,
    ...body,
    id: existing.id,
    tamilName:
      body.tamilName !== undefined
        ? String(body.tamilName).trim() || undefined
        : existing.tamilName,
    price:
      body.price !== undefined
        ? Math.max(0, Number(body.price))
        : existing.price,
    discountPercent:
      body.discountPercent !== undefined
        ? Math.max(0, Number(body.discountPercent))
        : existing.discountPercent,
    variants,
    stock: computedStock,
    status: resolvedStatus,
    availabilityStatus:
      body.availabilityStatus ||
      (computedStock <= 0
        ? 'out_of_stock'
        : computedStock <= (body.lowStockThreshold ?? existing.lowStockThreshold ?? 10)
          ? 'low_stock'
          : 'in_stock'),
    enabled:
      body.status !== undefined
        ? resolvedStatus === 'published'
        : body.enabled !== undefined
          ? Boolean(body.enabled)
          : existing.enabled ?? true,
    isDraft:
      body.status !== undefined
        ? resolvedStatus === 'draft'
        : body.isDraft !== undefined
          ? Boolean(body.isDraft)
          : body.enabled === true
            ? false
            : existing.isDraft,
    isBundle:
      body.isBundle !== undefined ? Boolean(body.isBundle) : existing.isBundle,
    images: Array.isArray(body.images)
      ? body.images.map((s: unknown) => String(s || '').trim()).filter(Boolean)
      : existing.images,
    bundleItems: Array.isArray(body.bundleItems)
      ? body.bundleItems
      : existing.bundleItems,
    updatedAt: new Date().toISOString(),
  };

  db.products[idx] = updated;
  saveDatabase();
  void syncProductToMongo(updated).catch(() => null);
  recordAdminActivity(req, 'product.update', 'product', updated.id, {
    name: updated.name,
    price: updated.price,
    stock: updated.stock,
    status: updated.status,
  });
  res.json(updated);
};

app.put('/api/products/:id', requirePermission('manage_products'), handleUpdateProduct);
app.put('/api/admin/products/:id', requirePermission('manage_products'), handleUpdateProduct);
app.patch('/api/admin/products/:id', requirePermission('manage_products'), handleUpdateProduct);

// Admin: Quick Inventory Update
app.patch(
  '/api/admin/inventory/:productId',
  requirePermission('manage_inventory'),
  (req: AuthenticatedRequest, res) => {
    const idx = db.products.findIndex((p) => p.id === req.params.productId);
    if (idx === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const existing = db.products[idx];
    const nextStock = Math.max(0, Math.floor(Number(req.body?.stock ?? existing.stock)));
    const nextThreshold = Math.max(
      1,
      Math.floor(Number(req.body?.lowStockThreshold ?? existing.lowStockThreshold ?? 10))
    );
    const nextVariants =
      Array.isArray(existing.variants) && existing.variants.length > 0
        ? existing.variants.map((v, vIdx) =>
            vIdx === 0
              ? {
                  ...v,
                  stock: Math.max(
                    0,
                    nextStock -
                      existing.variants
                        .slice(1)
                        .reduce((acc, o) => acc + Number(o.stock || 0), 0)
                  ),
                }
              : v
          )
        : existing.variants;
    const totalComputed =
      nextVariants && nextVariants.length > 0
        ? nextVariants.reduce((s, v) => s + Number(v.stock || 0), 0)
        : nextStock;

    const updated: Product = {
      ...existing,
      variants: nextVariants,
      stock: nextStock,
      lowStockThreshold: nextThreshold,
      availabilityStatus:
        req.body?.availabilityStatus ||
        (totalComputed <= 0
          ? 'out_of_stock'
          : totalComputed <= nextThreshold
            ? 'low_stock'
            : 'in_stock'),
      updatedAt: new Date().toISOString(),
    };
    db.products[idx] = updated;
    saveDatabase();
    void syncProductToMongo(updated).catch(() => null);
    recordAdminActivity(req, 'inventory.update', 'inventory', updated.id, {
      stock: updated.stock,
      availabilityStatus: updated.availabilityStatus,
    });
    res.json(updated);
  }
);

// Admin: Delete Product
const handleDeleteProduct = (req: AuthenticatedRequest, res: Response) => {
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const [removed] = db.products.splice(idx, 1);
  saveDatabase();
  void deleteProductFromMongo(req.params.id).catch(() => null);
  recordAdminActivity(req, 'product.delete', 'product', req.params.id, {
    name: removed?.name,
  });
  res.json({ deleted: true });
};

app.delete('/api/products/:id', requirePermission('delete_products'), handleDeleteProduct);
app.delete('/api/admin/products/:id', requirePermission('delete_products'), handleDeleteProduct);

// Stream Binary Images Safely from MongoDB GridFS
app.get('/api/images/:imageId', optionalAuth, async (req: AuthenticatedRequest, res) => {
  const imageId = String(req.params.imageId || '').trim();
  if (!/^[a-f0-9]{24}$/i.test(imageId)) {
    res.status(400).json({ error: 'Invalid image identifier' });
    return;
  }

  const found = await findGridFSImageForStreaming(imageId);
  if (!found) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }

  const isAdmin = Boolean(req.auth?.adminRole);
  if (!found.active && !isAdmin) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }

  // Enforce draft product protection on stored product images
  let isPrivateDraftAsset = false;
  if (found.refType === 'product' && found.refId) {
    const prod = db.products.find((p) => p.id === found.refId);
    if (prod && (prod.enabled === false || prod.isDraft)) {
      if (!isAdmin) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }
      isPrivateDraftAsset = true;
    }
  }

  if (req.headers['if-none-match'] === found.etag && !isPrivateDraftAsset) {
    res.status(304).end();
    return;
  }

  res.setHeader('Content-Type', found.mimeType);
  if (found.sizeBytes > 0) {
    res.setHeader('Content-Length', String(found.sizeBytes));
  }
  res.setHeader('ETag', found.etag);
  res.setHeader(
    'Cache-Control',
    isPrivateDraftAsset ? 'private, no-store' : 'public, max-age=31536000, immutable'
  );

  const downloadStream = found.bucketInstance.openDownloadStream(found.fileId);
  downloadStream.on('error', () => {
    if (!res.headersSent) {
      res.status(404).json({ error: 'Image stream unavailable' });
    }
  });
  downloadStream.pipe(res);
});

// Admin: Upload Image or GLB/GLTF 3D Model to MongoDB GridFS (or local-dev fallback)
const handleAdminAssetUpload = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { filename, dataUrl, bucket, folder, refType, refId, imageType, displayOrder } =
    req.body as {
      filename?: string;
      dataUrl?: string;
      bucket?: string;
      folder?: string;
      refType?: 'product' | 'category' | 'collection' | 'website';
      refId?: string;
      imageType?: 'primary' | 'gallery' | 'thumbnail' | 'asset';
      displayOrder?: number;
    };
  if (!filename || !dataUrl) {
    res.status(400).json({ error: 'filename and dataUrl are required' });
    return;
  }

  const result = await uploadAssetToPermanentStorage({
    filename,
    dataUrl,
    bucket,
    folder,
    refType,
    refId,
    imageType,
    displayOrder,
    localUploadsDir: UPLOADS_DIR,
    isVercel: IS_VERCEL,
  });

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  recordAdminActivity(req, 'media.upload', 'storage_asset', result.asset.storagePath, {
    bucket: result.asset.bucket,
    storageMode: result.asset.storageMode,
    mimeType: result.asset.mimeType,
    sizeBytes: result.asset.sizeBytes,
  });
  res.status(201).json(result.asset);
};

app.post('/api/upload', requirePermission('manage_images'), handleAdminAssetUpload);
app.post('/api/admin/upload', requirePermission('manage_images'), handleAdminAssetUpload);
app.post('/api/admin/images', requirePermission('manage_images'), handleAdminAssetUpload);

app.get(
  '/api/admin/images',
  requirePermission('view_dashboard'),
  async (_req, res) => {
    const images = await listGridFSImages(250);
    res.json({
      storageMode: isMongoConfigured() ? 'mongodb-gridfs' : 'local-dev-disk',
      images,
    });
  }
);

app.delete(
  '/api/admin/images/:imageId',
  requirePermission('manage_images'),
  async (req: AuthenticatedRequest, res) => {
    const result = await deleteGridFSImageSafely({
      imageId: String(req.params.imageId || '').trim(),
      products: db.products,
      categories: db.categories,
      collectionGroups: COLLECTION_REGISTRY_META.map(
        (m) => db[m.dbKey] as unknown as Array<{ id: string; image?: string }>
      ),
    });
    if (!result.ok) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    recordAdminActivity(req, 'media.delete', 'storage_asset', req.params.imageId);
    res.json({ deleted: true });
  }
);

app.get(
  '/api/admin/media/audit',
  requirePermission('view_dashboard'),
  async (_req, res) => {
    let gridfsImagesCount = 0;
    if (isMongoConfigured()) {
      const conn = await verifyMongoConnectivity();
      gridfsImagesCount = conn.gridfsImagesCount;
    }
    const summary = auditLocalCatalogImages({
      products: db.products,
      collectionGroups: [
        { category: "Men's Fashion", items: db.mensFashionCollections || [] },
        { category: "Women's Fashion", items: db.womensFashionCollections || [] },
        { category: 'Electronics', items: db.electronicsCollections || [] },
        { category: 'Dried Fruits', items: db.driedFruitsCollections || [] },
        { category: 'Nuts', items: db.nutsCollections || [] },
        { category: 'Skin Care', items: db.skinCareCollections || [] },
        { category: 'Hair Care', items: db.hairCareCollections || [] },
        { category: 'Furniture', items: db.furnitureCollections || [] },
        { category: 'Dried Peas', items: db.driedPeasCollections || [] },
        { category: 'Pranks & Novelties', items: db.pranksNoveltiesCollections || [] },
        { category: 'Fitness & Gym', items: db.fitnessGymCollections || [] },
        { category: 'Accessories', items: db.accessoriesCollections || [] },
        { category: 'Sports', items: db.sportsCollections || [] },
        { category: 'Footwear', items: db.footwearCollections || [] },
        { category: 'Teenagers', items: db.teenagersCollections || [] },
        { category: 'Kids', items: db.kidsCollections || [] },
      ],
      storageBucketsConfigured: isMongoConfigured(),
      uploadsDir: UPLOADS_DIR,
      gridfsImagesCount,
    });
    res.json(summary);
  }
);

app.patch(
  '/api/admin/collections/assign-image',
  requirePermission('manage_categories'),
  (req: AuthenticatedRequest, res) => {
    const { category, collectionId, imageUrl } = req.body as {
      category?: string;
      collectionId?: string;
      imageUrl?: string;
    };
    if (!category || !collectionId || !imageUrl) {
      res
        .status(400)
        .json({ error: 'category, collectionId, and imageUrl are required' });
      return;
    }

    const registries: Array<{ label: string; key: keyof DatabaseSchema }> = [
      { label: "Men's Fashion", key: 'mensFashionCollections' },
      { label: "Women's Fashion", key: 'womensFashionCollections' },
      { label: 'Electronics', key: 'electronicsCollections' },
      { label: 'Dried Fruits', key: 'driedFruitsCollections' },
      { label: 'Nuts', key: 'nutsCollections' },
      { label: 'Skin Care', key: 'skinCareCollections' },
      { label: 'Hair Care', key: 'hairCareCollections' },
      { label: 'Furniture', key: 'furnitureCollections' },
      { label: 'Dried Peas', key: 'driedPeasCollections' },
      { label: 'Pranks & Novelties', key: 'pranksNoveltiesCollections' },
      { label: 'Fitness & Gym', key: 'fitnessGymCollections' },
      { label: 'Accessories', key: 'accessoriesCollections' },
      { label: 'Sports', key: 'sportsCollections' },
      { label: 'Footwear', key: 'footwearCollections' },
      { label: 'Teenagers', key: 'teenagersCollections' },
      { label: 'Kids', key: 'kidsCollections' },
    ];

    const reg = registries.find(
      (r) => r.label.toLowerCase() === category.trim().toLowerCase()
    );
    if (!reg) {
      res.status(404).json({ error: 'Collection category not found' });
      return;
    }

    const list = db[reg.key] as unknown as Array<Record<string, unknown>>;
    const idx = list.findIndex(
      (item) => String(item.id || '').toLowerCase() === collectionId.toLowerCase()
    );
    if (idx === -1) {
      res.status(404).json({ error: 'Collection item not found' });
      return;
    }

    list[idx] = {
      ...list[idx],
      image: imageUrl.trim(),
      imageStatus: 'uploaded',
      status: 'approved',
      approved: true,
    };
    saveDatabase();
    void syncCollectionToMongo(category, list[idx]).catch(() => null);
    recordAdminActivity(req, 'collection.assign_image', 'collection', collectionId, {
      category,
      imageUrl,
    });
    res.json(list[idx]);
  }
);

// Reviews & Moderation
app.get('/api/reviews', (req, res) => {
  const { productId, all } = req.query;
  let list = [...db.reviews];
  if (all !== 'true') {
    list = list.filter((r) => r.approved);
  }
  if (productId) {
    list = list.filter((r) => r.productId === String(productId));
  }
  res.json(list);
});

app.post('/api/products/:id/reviews', (req, res) => {
  const { authorName, rating, title, comment } = req.body;
  if (!authorName || !comment) {
    res.status(400).json({ error: 'Author name and comment are required' });
    return;
  }
  const review: ProductReview = {
    id: `rev-${Date.now()}`,
    productId: req.params.id,
    authorName: String(authorName).trim(),
    rating: Math.min(5, Math.max(1, Number(rating || 5))),
    title: String(title || 'Verified Review').trim(),
    comment: String(comment).trim(),
    verifiedPurchase: true,
    approved: true,
    createdAt: new Date().toISOString(),
  };
  db.reviews.unshift(review);
  saveDatabase();
  void syncReviewToMongo(review).catch(() => null);
  res.status(201).json(review);
});

app.patch(
  '/api/admin/reviews/:id',
  requirePermission('manage_products'),
  (req: AuthenticatedRequest, res) => {
    const rev = db.reviews.find((r) => r.id === req.params.id);
    if (!rev) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    rev.approved = Boolean(req.body.approved);
    saveDatabase();
    void syncReviewToMongo(rev).catch(() => null);
    recordAdminActivity(req, 'review.moderate', 'review', rev.id, {
      approved: rev.approved,
    });
    res.json(rev);
  }
);

app.delete(
  '/api/admin/reviews/:id',
  requirePermission('manage_products'),
  (req: AuthenticatedRequest, res) => {
    db.reviews = db.reviews.filter((r) => r.id !== req.params.id);
    saveDatabase();
    void deleteReviewFromMongo(req.params.id).catch(() => null);
    recordAdminActivity(req, 'review.delete', 'review', req.params.id);
    res.json({ deleted: true });
  }
);

// Newsletter
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email address is required' });
    return;
  }
  const clean = email.trim().toLowerCase();
  if (!db.newsletter.some((s) => s.email.toLowerCase() === clean)) {
    const sub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: clean,
      subscribedAt: new Date().toISOString(),
    };
    db.newsletter.unshift(sub);
    saveDatabase();
    void syncNewsletterToMongo(sub).catch(() => null);
  }
  res.status(201).json({ subscribed: true, email: clean });
});

app.get('/api/admin/newsletter', requirePermission('view_reports'), (_req, res) => {
  res.json(db.newsletter);
});

// Admin Customers
app.get('/api/admin/customers', requirePermission('view_customers'), (_req, res) => {
  res.json(db.users.map(sanitizeUser));
});

// Offers & Coupons
app.get('/api/offers', (_req, res) => {
  res.json({
    coupons: db.coupons,
    banners: db.banners,
  });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body as { code?: string; subtotal?: number };
  if (!code) {
    res.status(400).json({ error: 'Coupon code is required' });
    return;
  }
  const coupon = db.coupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
  );
  if (!coupon) {
    res.status(404).json({ error: 'Invalid or expired coupon code' });
    return;
  }
  const amount = Number(subtotal || 0);
  if (amount < coupon.minOrderAmount) {
    res.status(400).json({
      error: `Minimum order of ₹${coupon.minOrderAmount} required for ${coupon.code}`,
    });
    return;
  }
  const discountAmount =
    coupon.type === 'percent'
      ? Number(((amount * coupon.value) / 100).toFixed(2))
      : Math.min(coupon.value, amount);

  res.json({
    valid: true,
    coupon,
    discountAmount,
  });
});

app.post(
  '/api/coupons',
  requirePermission('manage_coupons'),
  (req: AuthenticatedRequest, res) => {
    const { code, type, value, minOrderAmount, description, expiresAt } =
      req.body;
    if (!code || !value) {
      res.status(400).json({ error: 'Code and value are required' });
      return;
    }
    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: String(code).trim().toUpperCase(),
      type: type === 'fixed' ? 'fixed' : 'percent',
      value: Number(value),
      minOrderAmount: Number(minOrderAmount || 0),
      description: String(description || ''),
      active: true,
      expiresAt: String(expiresAt || '2026-12-31'),
    };
    db.coupons.unshift(newCoupon);
    saveDatabase();
    void syncCouponToMongo(newCoupon).catch(() => null);
    recordAdminActivity(req, 'coupon.create', 'coupon', newCoupon.id, {
      code: newCoupon.code,
    });
    res.status(201).json(newCoupon);
  }
);

app.delete(
  '/api/coupons/:id',
  requirePermission('manage_coupons'),
  (req: AuthenticatedRequest, res) => {
    db.coupons = db.coupons.filter((c) => c.id !== req.params.id);
    saveDatabase();
    void deleteCouponFromMongo(req.params.id).catch(() => null);
    recordAdminActivity(req, 'coupon.delete', 'coupon', req.params.id);
    res.json({ deleted: true });
  }
);

app.post(
  '/api/banners',
  requirePermission('manage_coupons'),
  (req: AuthenticatedRequest, res) => {
    const { title, subtitle, ctaLabel, targetCategory, accentColor } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Banner title is required' });
      return;
    }
    const banner: PromoBanner = {
      id: `ban-${Date.now()}`,
      title: String(title),
      subtitle: String(subtitle || ''),
      ctaLabel: String(ctaLabel || 'Shop Now'),
      targetCategory: targetCategory || 'All',
      accentColor: accentColor || '#3B82F6',
      active: true,
    };
    db.banners.unshift(banner);
    saveDatabase();
    void syncBannerToMongo(banner).catch(() => null);
    recordAdminActivity(req, 'banner.create', 'promo_banner', banner.id);
    res.status(201).json(banner);
  }
);

app.delete(
  '/api/banners/:id',
  requirePermission('manage_coupons'),
  (req: AuthenticatedRequest, res) => {
    db.banners = db.banners.filter((b) => b.id !== req.params.id);
    saveDatabase();
    void deleteBannerFromMongo(req.params.id).catch(() => null);
    recordAdminActivity(req, 'banner.delete', 'promo_banner', req.params.id);
    res.json({ deleted: true });
  }
);

// Customer Authentication (supports /api/auth/register and /api/auth/signup)
const handleCustomerSignup = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
  };
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    res.status(400).json({ error: 'Please enter a valid email address' });
    return;
  }
  if (String(password).length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }
  if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    res.status(409).json({ error: 'An account with this email already exists' });
    return;
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    name: String(name).trim(),
    email: normalizedEmail,
    ...(phone ? { phone: String(phone).trim() } : {}),
    // Never treat an unverified email as verified until confirmation token is verified
    emailVerified: false,
    passwordHash: hashPassword(String(password)),
    role: 'customer',
    addresses: [],
    wishlist: [],
    cart: [],
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDatabase();
  void syncUserToMongo(newUser).catch(() => null);

  if (isEmailServiceConfigured()) {
    const rawVerify = crypto.randomBytes(24).toString('hex');
    const verifyHash = hashTokenSha256(rawVerify);
    const expiresAtDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    passwordResetTokens.set(verifyHash, {
      userId: newUser.id,
      email: newUser.email,
      purpose: 'verify_email',
      expiresAt: expiresAtDate.getTime(),
    });
    void saveResetTokenToMongo({
      tokenHash: verifyHash,
      userId: newUser.id,
      email: newUser.email,
      purpose: 'verify_email',
      expiresAtDate,
    }).catch(() => null);
    const appUrl = (process.env.APP_URL || 'https://www.kubreebazzar.com').replace(/\/+$/, '');
    void sendTransactionalEmail({
      to: newUser.email,
      subject: 'Verify your KubreeBazzar account',
      text: `Welcome to KubreeBazzar, ${newUser.name}! Verify your email here: ${appUrl}/account?verifyToken=${rawVerify}`,
    });
  }

  const token = issueAuthSession(req, res, newUser, null);
  res.status(201).json({
    token,
    user: sanitizeUser(newUser),
    emailVerificationSent: isEmailServiceConfigured(),
  });
};

app.post('/api/auth/register', handleCustomerSignup);
app.post('/api/auth/signup', handleCustomerSignup);

app.post('/api/auth/verify-email', async (req, res) => {
  const rawToken = String(req.body?.token || '').trim();
  if (!rawToken) {
    res.status(400).json({ error: 'Verification token is required' });
    return;
  }
  const tokenHash = hashTokenSha256(rawToken);
  const localRec = passwordResetTokens.get(tokenHash);
  let userId = localRec && localRec.purpose === 'verify_email' && localRec.expiresAt > Date.now()
    ? localRec.userId
    : '';
  passwordResetTokens.delete(tokenHash);

  if (!userId && isMongoConfigured()) {
    const dbRec = await consumeResetTokenFromMongo(tokenHash, 'verify_email');
    if (dbRec) userId = dbRec.userId;
  }

  if (!userId) {
    res.status(400).json({ error: 'Invalid or expired verification link' });
    return;
  }
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }
  user.emailVerified = true;
  saveDatabase();
  void syncUserToMongo(user).catch(() => null);
  res.json({ verified: true, user: sanitizeUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  const clientIp = String(req.ip || req.socket.remoteAddress || 'unknown');
  if (!checkRateLimit(`customer-login:${clientIp}:${normalizedEmail}`, 12, 60_000)) {
    res.status(429).json({ error: 'Too many login attempts. Please wait a minute and try again.' });
    return;
  }

  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user || !verifyPassword(String(password), user.passwordHash)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  if (user.isActive === false) {
    res.status(403).json({ error: 'This account has been deactivated' });
    return;
  }
  if (needsBcryptUpgrade(user.passwordHash)) {
    user.passwordHash = hashPassword(String(password));
    saveDatabase();
    void syncUserToMongo(user).catch(() => null);
  }
  const adminRole = normalizeAdminRole(user) || undefined;
  const token = issueAuthSession(req, res, user, adminRole || null);
  res.json({ token, user: sanitizeUser(user) });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    res.status(400).json({ error: 'Please enter a valid email address' });
    return;
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  const clientIp = String(req.ip || req.socket.remoteAddress || 'unknown');
  if (!checkRateLimit(`forgot-pw:${clientIp}:${normalizedEmail}`, 5, 60_000)) {
    res.status(429).json({ error: 'Too many reset requests. Please try again later.' });
    return;
  }

  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  let emailed = false;

  if (user) {
    const rawToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = hashTokenSha256(rawToken);
    const expiresAtDate = new Date(Date.now() + 15 * 60 * 1000);
    passwordResetTokens.set(tokenHash, {
      userId: user.id,
      email: user.email,
      purpose: 'reset_password',
      expiresAt: expiresAtDate.getTime(),
    });
    void saveResetTokenToMongo({
      tokenHash,
      userId: user.id,
      email: user.email,
      purpose: 'reset_password',
      expiresAtDate,
    }).catch(() => null);

    if (isEmailServiceConfigured()) {
      const appUrl = (process.env.APP_URL || 'https://www.kubreebazzar.com').replace(/\/+$/, '');
      const sent = await sendTransactionalEmail({
        to: user.email,
        subject: 'KubreeBazzar Password Reset Request',
        text: `Reset your KubreeBazzar password within 15 minutes using this link: ${appUrl}/reset-password?token=${rawToken}`,
      });
      emailed = sent.sent;
    }
  }

  res.json({
    ok: true,
    emailSent: emailed,
    emailServiceConfigured: isEmailServiceConfigured(),
    message: isEmailServiceConfigured()
      ? 'If an account exists for that email address, a password reset link has been sent.'
      : 'Email delivery service (EMAIL_SERVICE_CONFIG) is not configured yet on the server. Signed-in users can change their password from Account Profile or contact the Super Admin.',
  });
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body as {
    token?: string;
    password?: string;
  };
  if (!token || !password) {
    res.status(400).json({ error: 'Reset token and new password are required' });
    return;
  }
  if (String(password).length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters long' });
    return;
  }
  const tokenHash = hashTokenSha256(String(token).trim());
  const localRec = passwordResetTokens.get(tokenHash);
  let userId =
    localRec && localRec.purpose === 'reset_password' && localRec.expiresAt >= Date.now()
      ? localRec.userId
      : '';
  passwordResetTokens.delete(tokenHash);

  if (!userId && isMongoConfigured()) {
    const dbRec = await consumeResetTokenFromMongo(tokenHash, 'reset_password');
    if (dbRec) userId = dbRec.userId;
  }

  if (!userId) {
    res.status(400).json({ error: 'Invalid or expired password reset link' });
    return;
  }
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }
  user.passwordHash = hashPassword(String(password));
  saveDatabase();
  void syncUserToMongo(user).catch(() => null);
  void deleteUserSessionsFromMongo(user.id).catch(() => null);
  res.json({
    ok: true,
    message: 'Your password has been updated. Please sign in with your new password.',
  });
});

app.post('/api/auth/change-password', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.users.find((u) => u.id === req.auth?.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current password and new password are required' });
    return;
  }
  if (!verifyPassword(String(currentPassword), user.passwordHash)) {
    res.status(401).json({ error: 'Current password is incorrect' });
    return;
  }
  if (String(newPassword).length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters long' });
    return;
  }
  user.passwordHash = hashPassword(String(newPassword));
  saveDatabase();
  void syncUserToMongo(user).catch(() => null);
  void deleteUserSessionsFromMongo(user.id).catch(() => null);
  const adminRole = normalizeAdminRole(user);
  const token = issueAuthSession(req, res, user, adminRole);
  res.json({ ok: true, token, message: 'Password updated successfully.' });
});

app.post('/api/auth/logout', (req, res) => {
  const extracted = extractRequestToken(req);
  if (extracted) {
    const tokenHash = hashTokenSha256(extracted.token);
    activeSessions.delete(tokenHash);
    void deleteSessionFromMongo(tokenHash).catch(() => null);
  }
  clearSessionCookie(req, res);
  res.json({ ok: true });
});

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.users.find((u) => u.id === req.auth?.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const validatedCart = buildValidatedCart(user.cart || []);
  if (JSON.stringify(validatedCart) !== JSON.stringify(user.cart || [])) {
    user.cart = validatedCart;
    saveDatabase();
    void syncCartToMongo(user.id, validatedCart).catch(() => null);
  }
  res.json({ user: sanitizeUser(user), cart: validatedCart });
});

app.put('/api/users/profile', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.users.find((u) => u.id === req.auth?.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  if (req.body.name !== undefined && String(req.body.name).trim()) {
    user.name = String(req.body.name).trim();
  }
  if (req.body.phone !== undefined) {
    user.phone = String(req.body.phone).trim();
  }
  if (Array.isArray(req.body.addresses)) {
    user.addresses = req.body.addresses;
  }
  saveDatabase();
  void syncUserToMongo(user).catch(() => null);
  res.json({ user: sanitizeUser(user) });
});

app.post(
  '/api/users/wishlist',
  requireAuth,
  (req: AuthenticatedRequest, res) => {
    const user = db.users.find((u) => u.id === req.auth?.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const { productId } = req.body as { productId?: string };
    if (!productId) {
      res.status(400).json({ error: 'productId is required' });
      return;
    }
    if (user.wishlist.includes(productId)) {
      user.wishlist = user.wishlist.filter((id) => id !== productId);
    } else {
      user.wishlist.push(productId);
    }
    saveDatabase();
    void syncWishlistToMongo(user.id, user.wishlist).catch(() => null);
    res.json({ wishlist: user.wishlist });
  }
);

// Authenticated Per-User Backend Cart Persistence
app.get('/api/cart', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.users.find((u) => u.id === req.auth?.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const validated = buildValidatedCart(user.cart || []);
  if (JSON.stringify(validated) !== JSON.stringify(user.cart || [])) {
    user.cart = validated;
    saveDatabase();
    void syncCartToMongo(user.id, validated).catch(() => null);
  }
  res.json({ items: validated });
});

app.post('/api/cart/items', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.users.find((u) => u.id === req.auth?.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const { productId, variantId, quantity } = req.body as {
    productId?: string;
    variantId?: string;
    quantity?: number;
  };
  if (!productId) {
    res.status(400).json({ error: 'productId is required' });
    return;
  }
  const product = db.products.find(
    (p) => p.id === productId && p.enabled !== false
  );
  if (!product) {
    res.status(404).json({ error: 'Product is currently unavailable' });
    return;
  }
  const variant =
    product.variants.find((v) => v.id === variantId) || product.variants[0];
  const resolvedVariantId = variant ? variant.id : variantId || 'default';
  const available = variant ? Number(variant.stock || 0) : Number(product.stock || 0);
  const basePrice = product.price + (variant ? variant.priceDelta : 0);
  const unitPrice = Number(
    (basePrice * (1 - (product.discountPercent || 0) / 100)).toFixed(2)
  );
  if (unitPrice <= 0) {
    res.status(400).json({ error: 'Price is not configured for this item' });
    return;
  }
  if (available <= 0) {
    res.status(400).json({ error: `${product.name} is currently out of stock` });
    return;
  }

  const addQty = Math.max(1, Math.floor(Number(quantity || 1)));
  const currentCart = buildValidatedCart(user.cart || []);
  const existingIdx = currentCart.findIndex(
    (item) =>
      item.productId === product.id && item.variantId === resolvedVariantId
  );

  if (existingIdx >= 0) {
    const nextQty = Math.min(available, currentCart[existingIdx].quantity + addQty);
    currentCart[existingIdx] = {
      ...currentCart[existingIdx],
      quantity: nextQty,
    };
  } else {
    currentCart.push({
      productId: product.id,
      variantId: resolvedVariantId,
      quantity: Math.min(available, addQty),
    });
  }

  user.cart = currentCart;
  saveDatabase();
  void syncCartToMongo(user.id, currentCart).catch(() => null);
  res.json({ items: currentCart });
});

app.put('/api/cart/items', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.users.find((u) => u.id === req.auth?.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const { productId, variantId, quantity } = req.body as {
    productId?: string;
    variantId?: string;
    quantity?: number;
  };
  if (!productId) {
    res.status(400).json({ error: 'productId is required' });
    return;
  }
  const qty = Math.floor(Number(quantity ?? 1));
  const resolvedVar = variantId || 'default';
  let currentCart = buildValidatedCart(user.cart || []);

  if (qty <= 0) {
    currentCart = currentCart.filter(
      (i) => !(i.productId === productId && i.variantId === resolvedVar)
    );
    user.cart = currentCart;
    saveDatabase();
    void syncCartToMongo(user.id, currentCart).catch(() => null);
    res.json({ items: currentCart });
    return;
  }

  const product = db.products.find(
    (p) => p.id === productId && p.enabled !== false
  );
  if (!product) {
    res.status(404).json({ error: 'Product is currently unavailable' });
    return;
  }
  const variant =
    product.variants.find((v) => v.id === resolvedVar) || product.variants[0];
  const targetVarId = variant ? variant.id : resolvedVar;
  const available = variant ? Number(variant.stock || 0) : Number(product.stock || 0);
  if (available <= 0) {
    res.status(400).json({ error: `${product.name} is currently out of stock` });
    return;
  }
  const clamped = Math.min(available, qty);
  const idx = currentCart.findIndex(
    (i) => i.productId === product.id && i.variantId === targetVarId
  );
  if (idx >= 0) {
    currentCart[idx] = { ...currentCart[idx], quantity: clamped };
  } else {
    currentCart.push({
      productId: product.id,
      variantId: targetVarId,
      quantity: clamped,
    });
  }

  user.cart = currentCart;
  saveDatabase();
  void syncCartToMongo(user.id, currentCart).catch(() => null);
  res.json({ items: currentCart });
});

app.delete(
  '/api/cart/items/:productId/:variantId',
  requireAuth,
  (req: AuthenticatedRequest, res) => {
    const user = db.users.find((u) => u.id === req.auth?.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const { productId, variantId } = req.params;
    user.cart = buildValidatedCart(user.cart || []).filter(
      (i) => !(i.productId === productId && i.variantId === variantId)
    );
    saveDatabase();
    void syncCartToMongo(user.id, user.cart).catch(() => null);
    res.json({ items: user.cart });
  }
);

app.delete('/api/cart', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.users.find((u) => u.id === req.auth?.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  user.cart = [];
  saveDatabase();
  void syncCartToMongo(user.id, []).catch(() => null);
  res.json({ items: [] });
});

// Razorpay Server-Side Order Creation & HMAC-SHA256 Verification
app.post('/api/payments/razorpay/create-order', (req, res) => {
  const { amount, currency = 'INR' } = req.body as {
    amount?: number;
    currency?: string;
  };
  if (!amount || amount <= 0) {
    res.status(400).json({ error: 'Valid positive amount is required' });
    return;
  }
  const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  res.json({
    id: orderId,
    amount: Math.round(amount * 100),
    currency,
    keyId: RAZORPAY_KEY_ID || 'rzp_test_kubreebazzar_sandbox',
    mode: RAZORPAY_KEY_ID ? 'live' : 'sandbox',
  });
});

app.post('/api/payments/razorpay/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

  if (!razorpay_order_id || !razorpay_payment_id) {
    res.status(400).json({ error: 'Missing Razorpay payment parameters' });
    return;
  }

  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const isSandboxToken =
    !RAZORPAY_KEY_ID && razorpay_signature === 'sandbox_verified';

  if (razorpay_signature !== expectedSignature && !isSandboxToken) {
    res.status(400).json({ error: 'Payment signature verification failed' });
    return;
  }

  res.json({
    verified: true,
    razorpay_order_id,
    razorpay_payment_id,
    signature: expectedSignature,
  });
});

app.post('/api/payments/razorpay/webhook', (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || RAZORPAY_KEY_SECRET;
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  if (signature !== expected) {
    res.status(400).json({ error: 'Invalid webhook signature' });
    return;
  }
  res.json({ received: true });
});

// Orders (Authenticated Customers & Admin)
app.post('/api/orders', requireAuth, async (req: AuthenticatedRequest, res) => {
  const authUser = db.users.find((u) => u.id === req.auth?.userId);
  if (!authUser) {
    res.status(401).json({ error: 'Authentication required to place orders' });
    return;
  }

  const {
    customerName,
    customerEmail,
    shippingAddress,
    items,
    couponCode,
    paymentMethod,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  const finalName = String(customerName || authUser.name).trim();
  const finalEmail = String(customerEmail || authUser.email).trim();

  if (
    !finalName ||
    !finalEmail ||
    !shippingAddress ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    res.status(400).json({ error: 'Missing required order fields' });
    return;
  }

  const normalizedPaymentMethod = paymentMethod === 'cod' ? 'cod' : 'razorpay';
  if (normalizedPaymentMethod === 'razorpay') {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      res.status(400).json({
        error: 'Verified Razorpay payment signature is required before confirming order.',
      });
      return;
    }
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
    const isSandboxVerified = !RAZORPAY_KEY_ID && razorpaySignature === 'sandbox_verified';
    if (razorpaySignature !== expectedSignature && !isSandboxVerified) {
      res.status(400).json({ error: 'Razorpay payment signature verification failed.' });
      return;
    }
  }

  let subtotal = 0;
  const snapshots = [];

  for (const item of items) {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product || product.enabled === false) {
      res.status(404).json({ error: `Product ${item.productId} is unavailable` });
      return;
    }
    const variant =
      product.variants.find((v) => v.id === item.variantId) ||
      product.variants[0];
    const qty = Math.max(1, Number(item.quantity || 1));
    const available = variant ? variant.stock : product.stock;
    if (available < qty) {
      res.status(400).json({
        error: `Insufficient stock for ${product.name}${variant ? ` (${variant.name})` : ''}`,
      });
      return;
    }

    const basePrice = product.price + (variant ? variant.priceDelta : 0);
    const discountedUnit = Number(
      (basePrice * (1 - (product.discountPercent || 0) / 100)).toFixed(2)
    );
    if (discountedUnit <= 0) {
      res.status(400).json({
        error: `Price is not yet configured for ${product.name}`,
      });
      return;
    }
    subtotal += discountedUnit * qty;

    snapshots.push({
      productId: product.id,
      variantId: variant ? variant.id : 'default',
      name: product.name,
      category: product.category,
      variantName: variant ? variant.name : 'Standard',
      unitPrice: discountedUnit,
      quantity: qty,
      image: product.images[0] || '',
    });
  }

  const touchedProducts: Product[] = [];
  for (const item of items) {
    const product = db.products.find((p) => p.id === item.productId);
    if (product) {
      const variant =
        product.variants.find((v) => v.id === item.variantId) ||
        product.variants[0];
      const qty = Math.max(1, Number(item.quantity || 1));
      if (variant) {
        variant.stock = Math.max(0, variant.stock - qty);
        product.stock = product.variants.reduce((acc, v) => acc + v.stock, 0);
      } else {
        product.stock = Math.max(0, product.stock - qty);
      }
      product.availabilityStatus =
        product.stock <= 0
          ? 'out_of_stock'
          : product.stock <= (product.lowStockThreshold ?? 10)
            ? 'low_stock'
            : 'in_stock';
      product.updatedAt = new Date().toISOString();
      touchedProducts.push(product);
    }
  }

  if (isMongoConfigured()) {
    const stockCheck = await decrementInventoryAtomicMongo(items, touchedProducts);
    if (!stockCheck.ok) {
      res.status(409).json({ error: stockCheck.error });
      return;
    }
  }

  let discountAmount = 0;
  if (couponCode) {
    const coupon = db.coupons.find(
      (c) =>
        c.code.toUpperCase() === String(couponCode).trim().toUpperCase() &&
        c.active
    );
    if (coupon && subtotal >= coupon.minOrderAmount) {
      discountAmount =
        coupon.type === 'percent'
          ? Number(((subtotal * coupon.value) / 100).toFixed(2))
          : Math.min(coupon.value, subtotal);
    }
  }

  const shippingFee = subtotal - discountAmount >= 1500 ? 0 : 99;
  const total = Number((subtotal - discountAmount + shippingFee).toFixed(2));
  const now = new Date().toISOString();

  const initialStatus: DeliveryStatus =
    normalizedPaymentMethod === 'cod' ? 'Pending' : 'Confirmed';

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `KB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: authUser.id,
    customerName: finalName,
    customerEmail: finalEmail,
    shippingAddress,
    items: snapshots,
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount,
    couponCode: couponCode ? String(couponCode).toUpperCase() : undefined,
    shippingFee,
    total,
    paymentMethod: normalizedPaymentMethod,
    paymentStatus: normalizedPaymentMethod === 'cod' ? 'pending' : 'paid',
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    deliveryStatus: initialStatus,
    shippingStatus: initialStatus,
    timeline: [
      {
        status: initialStatus,
        timestamp: now,
        note:
          normalizedPaymentMethod === 'cod'
            ? 'Order placed with Cash on Delivery — awaiting confirmation.'
            : 'Order confirmed & Razorpay payment verified.',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  db.orders.unshift(newOrder);
  authUser.cart = [];
  saveDatabase();
  void syncOrderToMongo(newOrder).catch(() => null);
  void syncCartToMongo(authUser.id, []).catch(() => null);
  res.status(201).json(newOrder);
});

app.get('/api/orders', requireAuth, (req: AuthenticatedRequest, res) => {
  if (
    req.auth?.adminRole &&
    hasAdminPermission({ role: req.auth.role, adminRole: req.auth.adminRole }, 'view_orders')
  ) {
    res.json(db.orders);
    return;
  }
  const list = db.orders.filter((o) => o.userId === req.auth?.userId);
  res.json(list);
});

app.get(
  '/api/admin/orders',
  requirePermission('view_orders'),
  (_req, res) => {
    res.json(db.orders);
  }
);

app.get('/api/account/orders', requireAuth, (req: AuthenticatedRequest, res) => {
  const list = db.orders.filter((o) => o.userId === req.auth?.userId);
  res.json(list);
});

const handleGetSingleOrder = (req: AuthenticatedRequest, res: Response) => {
  const order = db.orders.find(
    (o) => o.id === req.params.id || o.orderNumber === req.params.id
  );
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  const canViewAny =
    req.auth?.adminRole &&
    hasAdminPermission({ role: req.auth.role, adminRole: req.auth.adminRole }, 'view_orders');
  if (order.userId !== req.auth?.userId && !canViewAny) {
    res.status(403).json({ error: 'You do not have permission to view this order' });
    return;
  }
  res.json(order);
};

app.get('/api/account/orders/:id', requireAuth, handleGetSingleOrder);
app.get('/api/orders/:id', requireAuth, handleGetSingleOrder);

const handleUpdateOrderStatus = (req: AuthenticatedRequest, res: Response) => {
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  const {
    deliveryStatus,
    status,
    note,
    courierName,
    trackingNumber,
    dispatchDate,
    estimatedDeliveryDate,
    shippingStatus,
    trackingNotes,
    paymentStatus,
  } = req.body as {
    deliveryStatus?: DeliveryStatus;
    status?: DeliveryStatus;
    note?: string;
    courierName?: string;
    trackingNumber?: string;
    dispatchDate?: string;
    estimatedDeliveryDate?: string;
    shippingStatus?: string;
    trackingNotes?: string;
    paymentStatus?: 'pending' | 'paid' | 'failed';
  };
  const requestedStatus = deliveryStatus ?? status;

  const allowedStatuses: DeliveryStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Returned',
  ];
  if (requestedStatus && !allowedStatuses.includes(requestedStatus)) {
    res.status(400).json({ error: 'Unsupported order status value' });
    return;
  }

  const nextStatus = requestedStatus || order.deliveryStatus;
  const statusChanged = nextStatus !== order.deliveryStatus;
  order.deliveryStatus = nextStatus;

  if (courierName !== undefined) order.courierName = String(courierName).trim();
  if (trackingNumber !== undefined) order.trackingNumber = String(trackingNumber).trim();
  if (dispatchDate !== undefined) order.dispatchDate = String(dispatchDate).trim();
  if (estimatedDeliveryDate !== undefined) {
    order.estimatedDeliveryDate = String(estimatedDeliveryDate).trim();
  }
  if (shippingStatus !== undefined) {
    order.shippingStatus = String(shippingStatus).trim() || nextStatus;
  } else if (statusChanged) {
    order.shippingStatus = nextStatus;
  }
  if (trackingNotes !== undefined) order.trackingNotes = String(trackingNotes).trim();
  if (paymentStatus === 'pending' || paymentStatus === 'paid' || paymentStatus === 'failed') {
    order.paymentStatus = paymentStatus;
  } else if (nextStatus === 'Delivered' && order.paymentMethod === 'cod') {
    order.paymentStatus = 'paid';
  }

  if (statusChanged || note) {
    order.timeline.push({
      status: nextStatus,
      timestamp: new Date().toISOString(),
      note:
        note ||
        (order.trackingNumber && order.courierName
          ? `Status updated to ${nextStatus} (${order.courierName} · ${order.trackingNumber}).`
          : `Order status updated to ${nextStatus}.`),
      changedBy: req.auth?.email,
    });
  }
  order.updatedAt = new Date().toISOString();

  saveDatabase();
  void syncOrderToMongo(order).catch(() => null);
  recordAdminActivity(req, 'order.update_status', 'order', order.id, {
    orderNumber: order.orderNumber,
    deliveryStatus: order.deliveryStatus,
    courierName: order.courierName,
    trackingNumber: order.trackingNumber,
  });
  res.json(order);
};

app.patch('/api/orders/:id/status', requirePermission('manage_orders'), handleUpdateOrderStatus);
app.patch('/api/admin/orders/:id/status', requirePermission('manage_orders'), handleUpdateOrderStatus);

// Admin Analytics
app.get('/api/admin/analytics', requirePermission('view_dashboard'), (_req, res) => {
  const nonCancelled = db.orders.filter(
    (o) => o.deliveryStatus !== 'Cancelled' && o.deliveryStatus !== 'Returned'
  );
  const totalRevenue = Number(
    nonCancelled.reduce((sum, o) => sum + o.total, 0).toFixed(2)
  );
  const totalOrders = db.orders.length;
  const pendingOrdersCount = db.orders.filter((o) =>
    ['Pending', 'Confirmed', 'Processing', 'Packed'].includes(o.deliveryStatus)
  ).length;
  const averageOrderValue =
    nonCancelled.length > 0
      ? Number((totalRevenue / nonCancelled.length).toFixed(2))
      : 0;
  const lowStockCount = db.products.filter(
    (p) => p.stock > 0 && p.stock <= (p.lowStockThreshold ?? 10)
  ).length;
  const outOfStockCount = db.products.filter((p) => p.stock <= 0).length;
  const activeProductsCount = db.products.filter(
    (p) => p.enabled !== false && !p.isDraft
  ).length;
  const draftProductsCount = db.products.length - activeProductsCount;

  const statusBreakdown: Record<DeliveryStatus, number> = {
    Pending: 0,
    Confirmed: 0,
    Processing: 0,
    Packed: 0,
    Shipped: 0,
    'Out for Delivery': 0,
    Delivered: 0,
    Cancelled: 0,
    Returned: 0,
  };
  for (const ord of db.orders) {
    if (statusBreakdown[ord.deliveryStatus] !== undefined) {
      statusBreakdown[ord.deliveryStatus] += 1;
    }
  }

  const catMap = new Map<string, { revenue: number; orders: number }>();
  for (const cat of db.categories) {
    catMap.set(cat.id, { revenue: 0, orders: 0 });
  }
  for (const ord of nonCancelled) {
    for (const item of ord.items) {
      const entry = catMap.get(item.category) || { revenue: 0, orders: 0 };
      entry.revenue += item.unitPrice * item.quantity;
      entry.orders += item.quantity;
      catMap.set(item.category, entry);
    }
  }

  const revenueByCategory = Array.from(catMap.entries()).map(
    ([category, data]) => ({
      category,
      revenue: Number(data.revenue.toFixed(2)),
      orders: data.orders,
    })
  );

  res.json({
    totalRevenue,
    totalOrders,
    pendingOrdersCount,
    averageOrderValue,
    lowStockCount,
    outOfStockCount,
    totalProducts: db.products.length,
    activeProductsCount,
    draftProductsCount,
    totalCustomers: db.users.filter((u) => !isAdminRole(u)).length,
    newsletterCount: db.newsletter.length,
    statusBreakdown,
    revenueByCategory,
    recentOrders: db.orders.slice(0, 8),
  });
});

// Contact Inquiry
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required' });
    return;
  }
  const inquiry: ContactInquiry = {
    id: `inq-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    ...(phone ? { phone: String(phone).trim() } : {}),
    subject: String(subject || 'General Inquiry').trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
  };
  db.inquiries.unshift(inquiry);
  saveDatabase();
  void syncInquiryToMongo(inquiry).catch(() => null);
  res.status(201).json({ received: true, inquiry });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KubreeBazzar server running on http://0.0.0.0:${PORT}`);
  });
}

if (!IS_VERCEL) {
  startServer();
}

export default app;
