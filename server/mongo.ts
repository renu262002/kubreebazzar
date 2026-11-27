import { MongoClient, GridFSBucket, type Db, type Collection, type Document } from 'mongodb';
import type { SystemInfrastructureStatus } from '../src/types.ts';

const DB_NAME = (process.env.MONGODB_DB_NAME || 'kubreebazzar').trim() || 'kubreebazzar';

declare global {
  var __kubreeMongoClientPromise: Promise<MongoClient> | undefined;
  var __kubreeMongoIndexesPromise: Promise<void> | undefined;
}

export function getMongoUri(): string {
  return (process.env.MONGODB_URI || '').trim();
}

export function getMongoDbName(): string {
  return DB_NAME;
}

export function isMongoConfigured(): boolean {
  const uri = getMongoUri();
  return uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!isMongoConfigured()) return null;
  if (!globalThis.__kubreeMongoClientPromise) {
    const client = new MongoClient(getMongoUri(), {
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    globalThis.__kubreeMongoClientPromise = client.connect().catch((err) => {
      globalThis.__kubreeMongoClientPromise = undefined;
      throw err;
    });
  }
  return globalThis.__kubreeMongoClientPromise;
}

export async function getMongoDb(): Promise<Db | null> {
  const client = await getMongoClient();
  if (!client) return null;
  return client.db(DB_NAME);
}

export interface MongoCollections {
  users: Collection<Document>;
  userSessions: Collection<Document>;
  adminRoles: Collection<Document>;
  categories: Collection<Document>;
  subcategories: Collection<Document>;
  collections: Collection<Document>;
  products: Collection<Document>;
  productVariants: Collection<Document>;
  productImages: Collection<Document>;
  inventory: Collection<Document>;
  carts: Collection<Document>;
  wishlists: Collection<Document>;
  orders: Collection<Document>;
  orderItems: Collection<Document>;
  orderTracking: Collection<Document>;
  payments: Collection<Document>;
  coupons: Collection<Document>;
  banners: Collection<Document>;
  reviews: Collection<Document>;
  newsletterSubscribers: Collection<Document>;
  siteSettings: Collection<Document>;
  contactInquiries: Collection<Document>;
  adminActivityLogs: Collection<Document>;
  passwordResetTokens: Collection<Document>;
}

export async function getMongoCollections(): Promise<MongoCollections | null> {
  const db = await getMongoDb();
  if (!db) return null;
  return {
    users: db.collection('users'),
    userSessions: db.collection('user_sessions'),
    adminRoles: db.collection('admin_roles'),
    categories: db.collection('categories'),
    subcategories: db.collection('subcategories'),
    collections: db.collection('collections'),
    products: db.collection('products'),
    productVariants: db.collection('product_variants'),
    productImages: db.collection('product_images'),
    inventory: db.collection('inventory'),
    carts: db.collection('carts'),
    wishlists: db.collection('wishlists'),
    orders: db.collection('orders'),
    orderItems: db.collection('order_items'),
    orderTracking: db.collection('order_tracking'),
    payments: db.collection('payments'),
    coupons: db.collection('coupons'),
    banners: db.collection('banners'),
    reviews: db.collection('reviews'),
    newsletterSubscribers: db.collection('newsletter_subscribers'),
    siteSettings: db.collection('site_settings'),
    contactInquiries: db.collection('contact_inquiries'),
    adminActivityLogs: db.collection('admin_activity_logs'),
    passwordResetTokens: db.collection('password_reset_tokens'),
  };
}

export type GridFSBucketKey = 'productImages' | 'categoryImages' | 'websiteImages';

export async function getGridFSBuckets(): Promise<Record<GridFSBucketKey, GridFSBucket> | null> {
  const db = await getMongoDb();
  if (!db) return null;
  return {
    productImages: new GridFSBucket(db, { bucketName: 'productImages' }),
    categoryImages: new GridFSBucket(db, { bucketName: 'categoryImages' }),
    websiteImages: new GridFSBucket(db, { bucketName: 'websiteImages' }),
  };
}

export async function ensureMongoIndexes(): Promise<void> {
  if (!isMongoConfigured()) return;
  if (globalThis.__kubreeMongoIndexesPromise) {
    return globalThis.__kubreeMongoIndexesPromise;
  }

  globalThis.__kubreeMongoIndexesPromise = (async () => {
    const cols = await getMongoCollections();
    if (!cols) return;

    await Promise.all([
      cols.users.createIndex({ email: 1 }, { unique: true }),
      cols.users.createIndex({ id: 1 }, { unique: true }),
      cols.users.createIndex({ role: 1, adminRole: 1 }),
      cols.userSessions.createIndex({ tokenHash: 1 }, { unique: true }),
      cols.userSessions.createIndex({ expiresAtDate: 1 }, { expireAfterSeconds: 0 }),
      cols.adminRoles.createIndex({ roleKey: 1 }, { unique: true }),
      cols.categories.createIndex({ id: 1 }, { unique: true }),
      cols.categories.createIndex({ slug: 1 }),
      cols.subcategories.createIndex({ id: 1 }, { unique: true }),
      cols.subcategories.createIndex({ parentCategoryId: 1 }),
      cols.collections.createIndex({ category: 1, id: 1 }, { unique: true }),
      cols.collections.createIndex({ slug: 1 }),
      cols.products.createIndex({ id: 1 }, { unique: true }),
      cols.products.createIndex({ slug: 1 }),
      cols.products.createIndex({ category: 1, status: 1, enabled: 1 }),
      cols.productVariants.createIndex({ id: 1 }, { unique: true }),
      cols.productVariants.createIndex({ productId: 1 }),
      cols.productImages.createIndex({ gridfsFileId: 1 }, { unique: true }),
      cols.productImages.createIndex({ refType: 1, refId: 1, active: 1 }),
      cols.productImages.createIndex({ sha256: 1, bucket: 1 }),
      cols.inventory.createIndex({ productId: 1 }, { unique: true }),
      cols.carts.createIndex({ userId: 1 }, { unique: true }),
      cols.wishlists.createIndex({ userId: 1 }, { unique: true }),
      cols.orders.createIndex({ id: 1 }, { unique: true }),
      cols.orders.createIndex({ userId: 1, createdAt: -1 }),
      cols.orders.createIndex({ deliveryStatus: 1, createdAt: -1 }),
      cols.orderItems.createIndex({ orderId: 1 }),
      cols.orderTracking.createIndex({ orderId: 1 }, { unique: true }),
      cols.payments.createIndex({ orderId: 1 }),
      cols.coupons.createIndex({ code: 1 }, { unique: true }),
      cols.adminActivityLogs.createIndex({ createdAt: -1 }),
      cols.passwordResetTokens.createIndex({ tokenHash: 1 }, { unique: true }),
      cols.passwordResetTokens.createIndex({ expiresAtDate: 1 }, { expireAfterSeconds: 0 }),
    ]);

    // Seed canonical RBAC admin roles into MongoDB
    const defaultRoles = [
      {
        roleKey: 'super_admin',
        label: 'Super Admin',
        permissions: [
          'view_dashboard',
          'manage_products',
          'delete_products',
          'manage_categories',
          'manage_images',
          'manage_inventory',
          'view_orders',
          'manage_orders',
          'view_customers',
          'manage_coupons',
          'view_reports',
          'manage_users',
          'manage_settings',
        ],
      },
      {
        roleKey: 'product_manager',
        label: 'Product Manager',
        permissions: [
          'view_dashboard',
          'manage_products',
          'delete_products',
          'manage_categories',
          'manage_images',
          'manage_inventory',
          'view_reports',
        ],
      },
      {
        roleKey: 'order_manager',
        label: 'Order Manager',
        permissions: [
          'view_dashboard',
          'view_orders',
          'manage_orders',
          'view_customers',
          'view_reports',
        ],
      },
      {
        roleKey: 'viewer',
        label: 'Viewer',
        permissions: [
          'view_dashboard',
          'view_orders',
          'view_customers',
          'view_reports',
        ],
      },
    ];
    for (const r of defaultRoles) {
      await cols.adminRoles.updateOne({ roleKey: r.roleKey }, { $set: r }, { upsert: true });
    }
  })().catch((err) => {
    globalThis.__kubreeMongoIndexesPromise = undefined;
    throw err;
  });

  return globalThis.__kubreeMongoIndexesPromise;
}

export function getMongoInfrastructureStatus(
  hasSuperAdmin: boolean
): SystemInfrastructureStatus {
  const mongoConfigured = isMongoConfigured();
  const emailConfigured = Boolean((process.env.EMAIL_SERVICE_CONFIG || '').trim());
  const razorpayLiveConfigured = Boolean(
    process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  );

  const missingEnvVars: string[] = [];
  if (!mongoConfigured) missingEnvVars.push('MONGODB_URI');
  if (!process.env.SESSION_SECRET) missingEnvVars.push('SESSION_SECRET');
  if (!emailConfigured) missingEnvVars.push('EMAIL_SERVICE_CONFIG');
  if (!process.env.RAZORPAY_KEY_ID) missingEnvVars.push('RAZORPAY_KEY_ID');
  if (!process.env.RAZORPAY_KEY_SECRET) missingEnvVars.push('RAZORPAY_KEY_SECRET');

  return {
    databaseEngine: 'mongodb-atlas',
    databaseName: DB_NAME,
    mongoConfigured,
    gridfsConfigured: mongoConfigured,
    emailServiceConfigured: emailConfigured,
    razorpayLiveConfigured,
    // Keep backwards-compatible flags accurate without misreporting cloud state
    supabaseConfigured: mongoConfigured,
    supabaseAuthConfigured: mongoConfigured,
    storageConfigured: mongoConfigured,
    activeDatabaseMode: mongoConfigured ? 'mongodb-atlas' : 'local-dev-json',
    activeStorageMode: mongoConfigured ? 'mongodb-gridfs' : 'local-dev-disk',
    missingEnvVars,
    buckets: {
      products: 'productImages',
      categories: 'categoryImages',
      assets: 'websiteImages',
    },
    hasSuperAdmin,
  };
}

export async function verifyMongoConnectivity(): Promise<{
  connected: boolean;
  storageReady: boolean;
  databaseName: string;
  gridfsImagesCount: number;
  error?: string;
}> {
  if (!isMongoConfigured()) {
    return {
      connected: false,
      storageReady: false,
      databaseName: DB_NAME,
      gridfsImagesCount: 0,
      error:
        'MONGODB_URI is not configured in environment variables. Running in local development persistence mode.',
    };
  }
  try {
    const db = await getMongoDb();
    if (!db) {
      return {
        connected: false,
        storageReady: false,
        databaseName: DB_NAME,
        gridfsImagesCount: 0,
        error: 'Unable to acquire MongoDB client.',
      };
    }
    await db.command({ ping: 1 });
    await ensureMongoIndexes();
    const gridfsImagesCount = await db
      .collection('product_images')
      .countDocuments({ active: { $ne: false } });
    return {
      connected: true,
      storageReady: true,
      databaseName: DB_NAME,
      gridfsImagesCount,
    };
  } catch (err) {
    return {
      connected: false,
      storageReady: false,
      databaseName: DB_NAME,
      gridfsImagesCount: 0,
      error: err instanceof Error ? err.message : 'MongoDB connection failed',
    };
  }
}
