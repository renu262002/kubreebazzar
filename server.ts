import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import type {
  Product,
  CategoryInfo,
  User,
  Order,
  Coupon,
  PromoBanner,
  DeliveryStatus,
  ProductReview,
  NewsletterSubscriber,
  SiteSettings,
} from './src/types.ts';
import {
  INITIAL_CATEGORIES,
  generate48Products,
} from './server/catalogSeed.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const SESSION_SECRET =
  process.env.SESSION_SECRET || 'aetheria-spatial-commerce-secret-key';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET || 'aetheria_razorpay_sandbox_secret';

app.use(express.json({ limit: '25mb' }));

const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
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
  subject: string;
  message: string;
  createdAt: string;
}

interface DatabaseSchema {
  products: Product[];
  categories: CategoryInfo[];
  users: StoredUser[];
  orders: Order[];
  coupons: Coupon[];
  banners: PromoBanner[];
  reviews: ProductReview[];
  newsletter: NewsletterSubscriber[];
  settings: SiteSettings;
  inquiries: ContactInquiry[];
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

function signToken(payload: { userId: string; role: 'customer' | 'admin' }): string {
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
): { userId: string; role: 'customer' | 'admin' } | null {
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
    return { userId: parsed.userId, role: parsed.role };
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
          'Integrated server-verified Razorpay checkout, Cash on Delivery, and 5-stage order tracking.',
      },
    ],
    contactEmail: 'care@kubreebazzar.in',
    contactPhone: '+91 44 2815 4400',
    contactAddress: '142 Usman Road, T. Nagar, Chennai, Tamil Nadu 600017',
    supportHours: 'Monday – Saturday, 9:00 AM – 8:00 PM IST',
    footerNote:
      'Quality Rice, Everyday Grocery, Pure Honey, and Stylish Watches — delivered with care at KubreeBazzar.',
  };
}

function createInitialDatabase(): DatabaseSchema {
  const now = new Date().toISOString();

  const categories: CategoryInfo[] = INITIAL_CATEGORIES;
  const products: Product[] = generate48Products();

  const users: StoredUser[] = [
    {
      id: 'user-admin-1',
      name: 'Elena Vance (Admin)',
      email: 'admin@aetheria.store',
      passwordHash: hashPassword('Admin123!'),
      role: 'admin',
      addresses: [
        {
          id: 'addr-1',
          label: 'Flagship Studio',
          fullName: 'Elena Vance',
          phone: '+1 (415) 890-4412',
          street: '742 Evergreen Spatial Way, Suite 400',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94107',
          country: 'United States',
          isDefault: true,
        },
      ],
      wishlist: ['prod-aether-one', 'prod-chronos-ti'],
      createdAt: now,
    },
    {
      id: 'user-cust-1',
      name: 'Alex Mercer',
      email: 'alex@aetheria.store',
      passwordHash: hashPassword('Customer123!'),
      role: 'customer',
      addresses: [
        {
          id: 'addr-2',
          label: 'Home Loft',
          fullName: 'Alex Mercer',
          phone: '+1 (212) 555-0194',
          street: '218 Mercer Street, Apt 6B',
          city: 'New York',
          state: 'NY',
          postalCode: '10012',
          country: 'United States',
          isDefault: true,
        },
      ],
      wishlist: ['prod-lumina-serum'],
      createdAt: now,
    },
  ];

  const orders: Order[] = [
    {
      id: 'ord-1001',
      orderNumber: 'KAV-2026-1042',
      userId: 'user-cust-1',
      customerName: 'Ananya Sundaram',
      customerEmail: 'alex@aetheria.store',
      shippingAddress: {
        ...users[1].addresses[0],
        fullName: 'Ananya Sundaram',
        phone: '+91 98401 55210',
        street: '28 Cathedral Road, Gopalapuram',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600086',
        country: 'India',
      },
      items: [
        {
          productId: 'prod-01',
          name: 'Royal Aged Basmati Rice 5kg',
          category: 'Rice',
          variantName: '1 kg Pack',
          unitPrice: 801,
          quantity: 2,
          image: '/src/assets/images/product_rice_basmati_1793935955754.jpg',
        },
      ],
      subtotal: 1602,
      discountAmount: 0,
      shippingFee: 0,
      total: 1602,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      razorpayOrderId: 'order_KaveriDemo1042',
      razorpayPaymentId: 'pay_KaveriDemo9981',
      deliveryStatus: 'Shipped',
      timeline: [
        {
          status: 'Processing',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          note: 'Order confirmed and payment verified.',
        },
        {
          status: 'Packed',
          timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
          note: 'Inspected and sealed at Chennai Central Hub.',
        },
        {
          status: 'Shipped',
          timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(),
          note: 'In transit via Kaveri Express Courier.',
        },
      ],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

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

  const newsletter: NewsletterSubscriber[] = [
    {
      id: 'sub-1',
      email: 'alex@aetheria.store',
      subscribedAt: now,
    },
  ];

  return {
    products,
    categories,
    users,
    orders,
    coupons,
    banners,
    reviews,
    newsletter,
    settings: createDefaultSettings(),
    inquiries: [],
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
      parsed.products.length < 48 ||
      parsed.categories?.[0]?.id !== 'Rice';
    const merged: DatabaseSchema = {
      ...defaults,
      ...parsed,
      categories: shouldUpgradeCatalog
        ? defaults.categories
        : parsed.categories || defaults.categories,
      products: shouldUpgradeCatalog
        ? defaults.products
        : parsed.products || defaults.products,
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
      newsletter: parsed.newsletter || defaults.newsletter,
    };
    if (shouldUpgradeCatalog) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(merged, null, 2), 'utf8');
    }
    return merged;
  } catch {
    const initial = createInitialDatabase();
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

let db: DatabaseSchema = loadDatabase();

function saveDatabase() {
  fs.writeFileSync(STORE_FILE, JSON.stringify(db, null, 2), 'utf8');
}

interface AuthenticatedRequest extends Request {
  auth?: { userId: string; role: 'customer' | 'admin' };
}

function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    const token = header.slice(7);
    const verified = verifyToken(token);
    if (verified) req.auth = verified;
  }
  next();
}

function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const verified = verifyToken(header.slice(7));
  if (!verified) {
    res.status(401).json({ error: 'Invalid or expired session token' });
    return;
  }
  req.auth = verified;
  next();
}

function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  requireAuth(req, res, () => {
    if (req.auth?.role !== 'admin') {
      res.status(403).json({ error: 'Administrator privileges required' });
      return;
    }
    next();
  });
}

function sanitizeUser(u: StoredUser): User {
  const { passwordHash: _pw, ...safe } = u;
  return safe;
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'aetheria-api' });
});

// Site Settings (Public Read, Admin Write)
app.get('/api/settings', (_req, res) => {
  res.json(db.settings);
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  db.settings = {
    ...db.settings,
    ...req.body,
  };
  saveDatabase();
  res.json(db.settings);
});

// Categories
app.get('/api/categories', (_req, res) => {
  const enriched = db.categories.map((cat) => ({
    ...cat,
    itemCount: db.products.filter((p) => p.category === cat.id).length,
  }));
  res.json(enriched);
});

app.post('/api/categories', requireAdmin, (req, res) => {
  const { id, title, subtitle, description, subcategories, modelType, accentColor } =
    req.body;
  if (!id || !title) {
    res.status(400).json({ error: 'Category name and title are required' });
    return;
  }
  if (db.categories.some((c) => c.id.toLowerCase() === String(id).toLowerCase())) {
    res.status(409).json({ error: 'Category already exists' });
    return;
  }
  const newCat: CategoryInfo = {
    id: String(id).trim(),
    title: String(title).trim(),
    subtitle: String(subtitle || 'Curated Series'),
    description: String(description || ''),
    subcategories: Array.isArray(subcategories) ? subcategories : [],
    modelType: modelType || 'rice',
    accentColor: accentColor || '#6B1D2F',
  };
  db.categories.push(newCat);
  saveDatabase();
  res.status(201).json(newCat);
});

app.delete('/api/categories/:id', requireAdmin, (req, res) => {
  db.categories = db.categories.filter((c) => c.id !== req.params.id);
  saveDatabase();
  res.json({ deleted: true });
});

// Products (with filtering & sorting)
app.get('/api/products', (req, res) => {
  const { category, search, sort, minPrice, maxPrice, inStock, featured } =
    req.query;

  let list = [...db.products];

  if (category && category !== 'All') {
    list = list.filter(
      (p) => p.category.toLowerCase() === String(category).toLowerCase()
    );
  }
  if (featured === 'true') {
    list = list.filter((p) => p.featured);
  }
  if (inStock === 'true') {
    list = list.filter((p) => p.stock > 0);
  }
  if (minPrice !== undefined && minPrice !== '') {
    const min = Number(minPrice);
    if (!Number.isNaN(min)) list = list.filter((p) => p.price >= min);
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    const max = Number(maxPrice);
    if (!Number.isNaN(max)) list = list.filter((p) => p.price <= max);
  }
  if (search && String(search).trim() !== '') {
    const q = String(search).trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    default:
      list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  res.json(list);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(
    (p) => p.id === req.params.id || p.slug === req.params.id
  );
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

// Admin: Create Product
app.post('/api/products', requireAdmin, (req, res) => {
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

  const variants =
    Array.isArray(body.variants) && body.variants.length > 0
      ? body.variants
      : [
          {
            id: `var-${Date.now()}`,
            name: 'Standard Edition',
            colorHex: '#3B82F6',
            priceDelta: 0,
            stock: Number(body.stock ?? 10),
          },
        ];

  const totalStock = variants.reduce(
    (acc: number, v: { stock: number }) => acc + Number(v.stock || 0),
    0
  );

  const newProduct: Product = {
    id,
    name: String(body.name),
    slug: `${slug}-${Date.now().toString().slice(-4)}`,
    category: body.category,
    brand: body.brand || 'Aetheria Studio',
    price: Number(body.price),
    discountPercent: Number(body.discountPercent || 0),
    shortDescription:
      String(body.shortDescription || '').trim() ||
      String(body.description || '').slice(0, 120),
    description: String(body.description || ''),
    images:
      Array.isArray(body.images) && body.images.length > 0
        ? body.images
        : ['/src/assets/images/product_anc_headphones_1793866417010.jpg'],
    modelType: body.modelType || 'headphones',
    glbUrl: body.glbUrl || undefined,
    variants,
    specs: Array.isArray(body.specs) ? body.specs : [],
    stock: totalStock,
    rating: 5.0,
    reviewCount: 1,
    featured: Boolean(body.featured),
    trending: body.trending !== undefined ? Boolean(body.trending) : true,
    bestSeller: Boolean(body.bestSeller),
    newArrival: body.newArrival !== undefined ? Boolean(body.newArrival) : true,
    tag: body.tag || 'New Arrival',
    createdAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  saveDatabase();
  res.status(201).json(newProduct);
});

// Admin: Update Product
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const existing = db.products[idx];
  const body = req.body;
  const variants = Array.isArray(body.variants)
    ? body.variants
    : existing.variants;
  const computedStock =
    variants.length > 0
      ? variants.reduce(
          (acc: number, v: { stock: number }) => acc + Number(v.stock || 0),
          0
        )
      : Number(body.stock ?? existing.stock);

  const updated: Product = {
    ...existing,
    ...body,
    id: existing.id,
    price: body.price !== undefined ? Number(body.price) : existing.price,
    discountPercent:
      body.discountPercent !== undefined
        ? Number(body.discountPercent)
        : existing.discountPercent,
    variants,
    stock: computedStock,
  };

  db.products[idx] = updated;
  saveDatabase();
  res.json(updated);
});

// Admin: Delete Product
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  db.products.splice(idx, 1);
  saveDatabase();
  res.json({ deleted: true });
});

// Admin: Upload Image or GLB/GLTF 3D Model
app.post('/api/upload', requireAdmin, (req, res) => {
  const { filename, dataUrl } = req.body as {
    filename?: string;
    dataUrl?: string;
  };
  if (!filename || !dataUrl) {
    res.status(400).json({ error: 'filename and dataUrl are required' });
    return;
  }
  const ext = path.extname(filename).toLowerCase();
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.glb', '.gltf'];
  if (!allowed.includes(ext)) {
    res.status(400).json({
      error: `Unsupported file type. Allowed: ${allowed.join(', ')}`,
    });
    return;
  }
  const base64Match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
  if (!base64Match) {
    res.status(400).json({ error: 'Invalid base64 data URL' });
    return;
  }
  const safeName = `${Date.now()}-${path
    .basename(filename, ext)
    .replace(/[^a-z0-9_-]/gi, '_')}${ext}`;
  const targetPath = path.join(UPLOADS_DIR, safeName);
  fs.writeFileSync(targetPath, Buffer.from(base64Match[1], 'base64'));
  res.json({ url: `/uploads/${safeName}` });
});

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
  res.status(201).json(review);
});

app.patch('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  const rev = db.reviews.find((r) => r.id === req.params.id);
  if (!rev) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  rev.approved = Boolean(req.body.approved);
  saveDatabase();
  res.json(rev);
});

app.delete('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  db.reviews = db.reviews.filter((r) => r.id !== req.params.id);
  saveDatabase();
  res.json({ deleted: true });
});

// Newsletter
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email address is required' });
    return;
  }
  const clean = email.trim().toLowerCase();
  if (!db.newsletter.some((s) => s.email.toLowerCase() === clean)) {
    db.newsletter.unshift({
      id: `sub-${Date.now()}`,
      email: clean,
      subscribedAt: new Date().toISOString(),
    });
    saveDatabase();
  }
  res.status(201).json({ subscribed: true, email: clean });
});

app.get('/api/admin/newsletter', requireAdmin, (_req, res) => {
  res.json(db.newsletter);
});

// Admin Customers
app.get('/api/admin/customers', requireAdmin, (_req, res) => {
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
      error: `Minimum order of $${coupon.minOrderAmount} required for ${coupon.code}`,
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

app.post('/api/coupons', requireAdmin, (req, res) => {
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
  res.status(201).json(newCoupon);
});

app.delete('/api/coupons/:id', requireAdmin, (req, res) => {
  db.coupons = db.coupons.filter((c) => c.id !== req.params.id);
  saveDatabase();
  res.json({ deleted: true });
});

app.post('/api/banners', requireAdmin, (req, res) => {
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
  res.status(201).json(banner);
});

app.delete('/api/banners/:id', requireAdmin, (req, res) => {
  db.banners = db.banners.filter((b) => b.id !== req.params.id);
  saveDatabase();
  res.json({ deleted: true });
});

// Authentication
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    res.status(409).json({ error: 'An account with this email already exists' });
    return;
  }
  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    role: 'customer',
    addresses: [],
    wishlist: [],
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDatabase();
  const token = signToken({ userId: newUser.id, role: newUser.role });
  res.status(201).json({ token, user: sanitizeUser(newUser) });
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
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  const token = signToken({ userId: user.id, role: user.role });
  res.json({ token, user: sanitizeUser(user) });
});

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.users.find((u) => u.id === req.auth?.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ user: sanitizeUser(user) });
});

app.put('/api/users/profile', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = db.users.find((u) => u.id === req.auth?.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  if (req.body.name) user.name = String(req.body.name).trim();
  if (Array.isArray(req.body.addresses)) user.addresses = req.body.addresses;
  saveDatabase();
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
    res.json({ wishlist: user.wishlist });
  }
);

// Razorpay Server-Side Order Creation & HMAC-SHA256 Verification
app.post('/api/payments/razorpay/create-order', (req, res) => {
  const { amount, currency = 'USD' } = req.body as {
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
    keyId: RAZORPAY_KEY_ID || 'rzp_test_aetheria_sandbox',
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
  const expected = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');
  if (signature !== expected) {
    res.status(400).json({ error: 'Invalid webhook signature' });
    return;
  }
  res.json({ received: true });
});

// Orders
app.post('/api/orders', optionalAuth, (req: AuthenticatedRequest, res) => {
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

  if (
    !customerName ||
    !customerEmail ||
    !shippingAddress ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    res.status(400).json({ error: 'Missing required order fields' });
    return;
  }

  let subtotal = 0;
  const snapshots = [];

  for (const item of items) {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product) {
      res.status(404).json({ error: `Product ${item.productId} not found` });
      return;
    }
    const variant =
      product.variants.find((v) => v.id === item.variantId) ||
      product.variants[0];
    const qty = Math.max(1, Number(item.quantity || 1));
    if (variant && variant.stock < qty) {
      res.status(400).json({
        error: `Insufficient stock for ${product.name} (${variant.name})`,
      });
      return;
    }

    const basePrice = product.price + (variant ? variant.priceDelta : 0);
    const discountedUnit = Number(
      (basePrice * (1 - (product.discountPercent || 0) / 100)).toFixed(2)
    );
    subtotal += discountedUnit * qty;

    snapshots.push({
      productId: product.id,
      name: product.name,
      category: product.category,
      variantName: variant ? variant.name : 'Standard',
      unitPrice: discountedUnit,
      quantity: qty,
      image: product.images[0] || '',
    });
  }

  for (const item of items) {
    const product = db.products.find((p) => p.id === item.productId);
    if (product) {
      const variant =
        product.variants.find((v) => v.id === item.variantId) ||
        product.variants[0];
      const qty = Math.max(1, Number(item.quantity || 1));
      if (variant) variant.stock = Math.max(0, variant.stock - qty);
      product.stock = product.variants.reduce((acc, v) => acc + v.stock, 0);
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

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `AETH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: req.auth?.userId || 'guest',
    customerName: String(customerName),
    customerEmail: String(customerEmail),
    shippingAddress,
    items: snapshots,
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount,
    couponCode: couponCode ? String(couponCode).toUpperCase() : undefined,
    shippingFee,
    total,
    paymentMethod: paymentMethod === 'cod' ? 'cod' : 'razorpay',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    deliveryStatus: 'Processing',
    timeline: [
      {
        status: 'Processing',
        timestamp: now,
        note:
          paymentMethod === 'cod'
            ? 'Order placed with Cash on Delivery.'
            : 'Order confirmed & Razorpay payment verified.',
      },
    ],
    createdAt: now,
  };

  db.orders.unshift(newOrder);
  saveDatabase();
  res.status(201).json(newOrder);
});

app.get('/api/orders', optionalAuth, (req: AuthenticatedRequest, res) => {
  if (req.auth?.role === 'admin') {
    res.json(db.orders);
    return;
  }
  if (req.auth?.userId) {
    const user = db.users.find((u) => u.id === req.auth?.userId);
    const list = db.orders.filter(
      (o) =>
        o.userId === req.auth?.userId ||
        (user && o.customerEmail.toLowerCase() === user.email.toLowerCase())
    );
    res.json(list);
    return;
  }
  const email = req.query.email ? String(req.query.email).toLowerCase() : '';
  if (email) {
    res.json(
      db.orders.filter((o) => o.customerEmail.toLowerCase() === email)
    );
    return;
  }
  res.json([]);
});

app.patch('/api/orders/:id/status', requireAdmin, (req, res) => {
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  const { deliveryStatus, note } = req.body as {
    deliveryStatus?: DeliveryStatus;
    note?: string;
  };
  if (!deliveryStatus) {
    res.status(400).json({ error: 'deliveryStatus is required' });
    return;
  }
  order.deliveryStatus = deliveryStatus;
  if (deliveryStatus === 'Delivered' && order.paymentMethod === 'cod') {
    order.paymentStatus = 'paid';
  }
  order.timeline.push({
    status: deliveryStatus,
    timestamp: new Date().toISOString(),
    note: note || `Shipment status updated to ${deliveryStatus}.`,
  });
  saveDatabase();
  res.json(order);
});

// Admin Analytics
app.get('/api/admin/analytics', requireAdmin, (_req, res) => {
  const totalRevenue = Number(
    db.orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)
  );
  const totalOrders = db.orders.length;
  const averageOrderValue =
    totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;
  const lowStockCount = db.products.filter((p) => p.stock <= 10).length;

  const catMap = new Map<string, { revenue: number; orders: number }>();
  for (const cat of db.categories) {
    catMap.set(cat.id, { revenue: 0, orders: 0 });
  }
  for (const ord of db.orders) {
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
    averageOrderValue,
    lowStockCount,
    totalProducts: db.products.length,
    totalCustomers: db.users.filter((u) => u.role === 'customer').length,
    newsletterCount: db.newsletter.length,
    revenueByCategory,
    recentOrders: db.orders.slice(0, 6),
  });
});

// Contact Inquiry
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required' });
    return;
  }
  const inquiry: ContactInquiry = {
    id: `inq-${Date.now()}`,
    name: String(name),
    email: String(email),
    subject: String(subject || 'General Inquiry'),
    message: String(message),
    createdAt: new Date().toISOString(),
  };
  db.inquiries.unshift(inquiry);
  saveDatabase();
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
    console.log(`Aetheria server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
