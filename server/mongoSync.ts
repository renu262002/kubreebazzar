import type { Document } from 'mongodb';
import type {
  AdminActivityLog,
  CartItem,
  CategoryInfo,
  Coupon,
  Order,
  Product,
  ProductReview,
  PromoBanner,
  SiteSettings,
  User,
  NewsletterSubscriber,
} from '../src/types.ts';
import {
  ensureMongoIndexes,
  getMongoClient,
  getMongoCollections,
  isMongoConfigured,
} from './mongo.ts';

export interface StoredUserRecord extends User {
  passwordHash: string;
}

export interface ContactInquiryRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export type CollectionEntryShape = { id: string } & object;

export interface StoreStateShape {
  products: Product[];
  categories: CategoryInfo[];
  mensFashionCollections: CollectionEntryShape[];
  womensFashionCollections: CollectionEntryShape[];
  electronicsCollections: CollectionEntryShape[];
  driedFruitsCollections: CollectionEntryShape[];
  nutsCollections: CollectionEntryShape[];
  skinCareCollections: CollectionEntryShape[];
  hairCareCollections: CollectionEntryShape[];
  furnitureCollections: CollectionEntryShape[];
  driedPeasCollections: CollectionEntryShape[];
  pranksNoveltiesCollections: CollectionEntryShape[];
  fitnessGymCollections: CollectionEntryShape[];
  accessoriesCollections: CollectionEntryShape[];
  sportsCollections: CollectionEntryShape[];
  footwearCollections: CollectionEntryShape[];
  teenagersCollections: CollectionEntryShape[];
  kidsCollections: CollectionEntryShape[];
  users: StoredUserRecord[];
  orders: Order[];
  coupons: Coupon[];
  banners: PromoBanner[];
  reviews: ProductReview[];
  newsletter: NewsletterSubscriber[];
  settings: SiteSettings;
  inquiries: ContactInquiryRecord[];
  adminActivityLogs: AdminActivityLog[];
}

export const COLLECTION_REGISTRY_META: Array<{
  label: string;
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
    | 'kidsCollections';
}> = [
  { label: "Men's Fashion", dbKey: 'mensFashionCollections' },
  { label: "Women's Fashion", dbKey: 'womensFashionCollections' },
  { label: 'Electronics', dbKey: 'electronicsCollections' },
  { label: 'Dried Fruits', dbKey: 'driedFruitsCollections' },
  { label: 'Nuts', dbKey: 'nutsCollections' },
  { label: 'Skin Care', dbKey: 'skinCareCollections' },
  { label: 'Hair Care', dbKey: 'hairCareCollections' },
  { label: 'Furniture', dbKey: 'furnitureCollections' },
  { label: 'Dried Peas', dbKey: 'driedPeasCollections' },
  { label: 'Pranks & Novelties', dbKey: 'pranksNoveltiesCollections' },
  { label: 'Fitness & Gym', dbKey: 'fitnessGymCollections' },
  { label: 'Accessories', dbKey: 'accessoriesCollections' },
  { label: 'Sports', dbKey: 'sportsCollections' },
  { label: 'Footwear', dbKey: 'footwearCollections' },
  { label: 'Teenagers', dbKey: 'teenagersCollections' },
  { label: 'Kids', dbKey: 'kidsCollections' },
];

function stripMongoId<T extends object>(doc: Document): T {
  const { _id: _omit, ...rest } = doc;
  return rest as T;
}

export async function syncProductToMongo(product: Product): Promise<void> {
  if (!isMongoConfigured()) return;
  await ensureMongoIndexes();
  const cols = await getMongoCollections();
  if (!cols) return;

  await cols.products.updateOne(
    { id: product.id },
    { $set: { ...product, updatedAt: product.updatedAt || new Date().toISOString() } },
    { upsert: true }
  );

  // Maintain normalized product_variants and inventory collections
  await cols.productVariants.deleteMany({ productId: product.id });
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    await cols.productVariants.insertMany(
      product.variants.map((v) => ({ ...v, productId: product.id }))
    );
  }

  await cols.inventory.updateOne(
    { productId: product.id },
    {
      $set: {
        productId: product.id,
        sku: product.sku || product.id,
        stock: Number(product.stock ?? 0),
        lowStockThreshold: Number(product.lowStockThreshold ?? 10),
        availabilityStatus: product.availabilityStatus || 'in_stock',
        variants: (product.variants || []).map((v) => ({
          id: v.id,
          name: v.name,
          stock: Number(v.stock ?? 0),
        })),
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true }
  );
}

export async function deleteProductFromMongo(productId: string): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await Promise.all([
    cols.products.deleteOne({ id: productId }),
    cols.productVariants.deleteMany({ productId }),
    cols.inventory.deleteOne({ productId }),
  ]);
}

export async function syncCategoryToMongo(category: CategoryInfo): Promise<void> {
  if (!isMongoConfigured()) return;
  await ensureMongoIndexes();
  const cols = await getMongoCollections();
  if (!cols) return;

  const isSub = Boolean(category.parentCategoryId || category.parentId);
  if (isSub) {
    await cols.subcategories.updateOne(
      { id: category.id },
      { $set: category },
      { upsert: true }
    );
  }
  await cols.categories.updateOne(
    { id: category.id },
    { $set: category },
    { upsert: true }
  );
}

export async function deleteCategoryFromMongo(categoryId: string): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await Promise.all([
    cols.categories.deleteOne({ id: categoryId }),
    cols.subcategories.deleteOne({ id: categoryId }),
  ]);
}

export async function syncCollectionToMongo(
  categoryLabel: string,
  item: Record<string, unknown>
): Promise<void> {
  if (!isMongoConfigured()) return;
  await ensureMongoIndexes();
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.collections.updateOne(
    { category: categoryLabel, id: String(item.id || '') },
    { $set: { ...item, category: categoryLabel } },
    { upsert: true }
  );
}

export async function syncUserToMongo(user: StoredUserRecord): Promise<void> {
  if (!isMongoConfigured()) return;
  await ensureMongoIndexes();
  const cols = await getMongoCollections();
  if (!cols) return;

  await cols.users.updateOne({ id: user.id }, { $set: user }, { upsert: true });
  await cols.carts.updateOne(
    { userId: user.id },
    { $set: { userId: user.id, items: user.cart || [], updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  await cols.wishlists.updateOne(
    { userId: user.id },
    { $set: { userId: user.id, productIds: user.wishlist || [], updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
}

export async function syncCartToMongo(userId: string, items: CartItem[]): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await Promise.all([
    cols.users.updateOne({ id: userId }, { $set: { cart: items } }),
    cols.carts.updateOne(
      { userId },
      { $set: { userId, items, updatedAt: new Date().toISOString() } },
      { upsert: true }
    ),
  ]);
}

export async function syncWishlistToMongo(userId: string, productIds: string[]): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await Promise.all([
    cols.users.updateOne({ id: userId }, { $set: { wishlist: productIds } }),
    cols.wishlists.updateOne(
      { userId },
      { $set: { userId, productIds, updatedAt: new Date().toISOString() } },
      { upsert: true }
    ),
  ]);
}

export async function syncOrderToMongo(order: Order): Promise<void> {
  if (!isMongoConfigured()) return;
  await ensureMongoIndexes();
  const cols = await getMongoCollections();
  if (!cols) return;

  await Promise.all([
    cols.orders.updateOne({ id: order.id }, { $set: order }, { upsert: true }),
    cols.orderItems.deleteMany({ orderId: order.id }).then(async () => {
      if (order.items.length > 0) {
        await cols.orderItems.insertMany(
          order.items.map((item, idx) => ({
            id: `${order.id}-item-${idx + 1}`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            ...item,
          }))
        );
      }
    }),
    cols.orderTracking.updateOne(
      { orderId: order.id },
      {
        $set: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          deliveryStatus: order.deliveryStatus,
          shippingStatus: order.shippingStatus || order.deliveryStatus,
          courierName: order.courierName || '',
          trackingNumber: order.trackingNumber || '',
          dispatchDate: order.dispatchDate || '',
          estimatedDeliveryDate: order.estimatedDeliveryDate || '',
          trackingNotes: order.trackingNotes || '',
          timeline: order.timeline || [],
          updatedAt: order.updatedAt || new Date().toISOString(),
        },
      },
      { upsert: true }
    ),
    cols.payments.updateOne(
      { orderId: order.id },
      {
        $set: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          userId: order.userId,
          amount: order.total,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          razorpayOrderId: order.razorpayOrderId || null,
          razorpayPaymentId: order.razorpayPaymentId || null,
          updatedAt: order.updatedAt || new Date().toISOString(),
        },
      },
      { upsert: true }
    ),
  ]);
}

export async function decrementInventoryAtomicMongo(
  items: Array<{ productId: string; variantId?: string; quantity: number }>,
  updatedProducts: Product[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isMongoConfigured()) return { ok: true };
  const client = await getMongoClient();
  const cols = await getMongoCollections();
  if (!client || !cols) return { ok: true };

  const performUpdates = async (session?: import('mongodb').ClientSession) => {
    for (const item of items) {
      const qty = Math.max(1, Number(item.quantity || 1));
      const invDoc = await cols.inventory.findOne(
        { productId: item.productId },
        session ? { session } : undefined
      );
      if (invDoc) {
        const res = await cols.inventory.findOneAndUpdate(
          { productId: item.productId, stock: { $gte: qty } },
          { $inc: { stock: -qty }, $set: { updatedAt: new Date().toISOString() } },
          session ? { session, returnDocument: 'after' } : { returnDocument: 'after' }
        );
        if (!res) {
          throw new Error(`Insufficient stock in database for product ${item.productId}`);
        }
      }
    }
    for (const p of updatedProducts) {
      await cols.products.updateOne(
        { id: p.id },
        {
          $set: {
            stock: p.stock,
            variants: p.variants,
            availabilityStatus: p.availabilityStatus,
            updatedAt: p.updatedAt || new Date().toISOString(),
          },
        },
        session ? { session } : undefined
      );
      await cols.inventory.updateOne(
        { productId: p.id },
        {
          $set: {
            stock: p.stock,
            availabilityStatus: p.availabilityStatus,
            variants: (p.variants || []).map((v) => ({
              id: v.id,
              name: v.name,
              stock: Number(v.stock ?? 0),
            })),
            updatedAt: new Date().toISOString(),
          },
        },
        session ? { session, upsert: true } : { upsert: true }
      );
    }
  };

  try {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await performUpdates(session);
      });
    } catch (txErr) {
      const msg = txErr instanceof Error ? txErr.message : '';
      // Standalone MongoDB topology without replica set does not support multi-doc transactions
      if (msg.includes('Transaction numbers are only allowed') || msg.includes('replica set')) {
        await performUpdates();
      } else {
        throw txErr;
      }
    } finally {
      await session.endSession();
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Inventory lock failed',
    };
  }
}

export async function syncSessionToMongo(sessionRec: {
  tokenHash: string;
  userId: string;
  role: string;
  adminRole?: string | null;
  userAgent?: string;
  ip?: string;
  createdAt: string;
  expiresAtDate: Date;
}): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.userSessions.updateOne(
    { tokenHash: sessionRec.tokenHash },
    { $set: sessionRec },
    { upsert: true }
  );
}

export async function findSessionInMongo(tokenHash: string): Promise<{
  userId: string;
  expiresAtDate: Date;
} | null> {
  if (!isMongoConfigured()) return null;
  const cols = await getMongoCollections();
  if (!cols) return null;
  const doc = await cols.userSessions.findOne({ tokenHash });
  if (!doc) return null;
  const exp = doc.expiresAtDate instanceof Date ? doc.expiresAtDate : new Date(String(doc.expiresAtDate || 0));
  if (exp.getTime() < Date.now()) {
    await cols.userSessions.deleteOne({ tokenHash }).catch(() => null);
    return null;
  }
  return { userId: String(doc.userId || ''), expiresAtDate: exp };
}

export async function deleteSessionFromMongo(tokenHash: string): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.userSessions.deleteOne({ tokenHash });
}

export async function deleteUserSessionsFromMongo(userId: string): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.userSessions.deleteMany({ userId });
}

export async function saveResetTokenToMongo(record: {
  tokenHash: string;
  userId: string;
  email: string;
  purpose: 'reset_password' | 'verify_email';
  expiresAtDate: Date;
}): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.passwordResetTokens.updateOne(
    { tokenHash: record.tokenHash },
    { $set: record },
    { upsert: true }
  );
}

export async function consumeResetTokenFromMongo(
  tokenHash: string,
  purpose?: 'reset_password' | 'verify_email'
): Promise<{ userId: string; email: string; purpose: string } | null> {
  if (!isMongoConfigured()) return null;
  const cols = await getMongoCollections();
  if (!cols) return null;
  const doc = await cols.passwordResetTokens.findOne({ tokenHash });
  if (!doc) return null;
  if (purpose && doc.purpose && doc.purpose !== purpose) return null;
  const exp = doc.expiresAtDate instanceof Date ? doc.expiresAtDate : new Date(String(doc.expiresAtDate || 0));
  await cols.passwordResetTokens.deleteOne({ tokenHash }).catch(() => null);
  if (exp.getTime() < Date.now()) return null;
  return {
    userId: String(doc.userId || ''),
    email: String(doc.email || ''),
    purpose: String(doc.purpose || 'reset_password'),
  };
}

export async function syncCouponToMongo(coupon: Coupon): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.coupons.updateOne({ id: coupon.id }, { $set: coupon }, { upsert: true });
}

export async function deleteCouponFromMongo(id: string): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.coupons.deleteOne({ id });
}

export async function syncBannerToMongo(banner: PromoBanner): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.banners.updateOne({ id: banner.id }, { $set: banner }, { upsert: true });
}

export async function deleteBannerFromMongo(id: string): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.banners.deleteOne({ id });
}

export async function syncReviewToMongo(review: ProductReview): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.reviews.updateOne({ id: review.id }, { $set: review }, { upsert: true });
}

export async function deleteReviewFromMongo(id: string): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.reviews.deleteOne({ id });
}

export async function syncNewsletterToMongo(sub: NewsletterSubscriber): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.newsletterSubscribers.updateOne(
    { email: sub.email },
    { $set: sub },
    { upsert: true }
  );
}

export async function syncInquiryToMongo(inq: ContactInquiryRecord): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.contactInquiries.updateOne({ id: inq.id }, { $set: inq }, { upsert: true });
}

export async function syncSettingsToMongo(settings: SiteSettings): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.siteSettings.updateOne(
    { id: 'default' },
    { $set: { ...settings, id: 'default', updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
}

export async function logAdminActivityToMongo(entry: AdminActivityLog): Promise<void> {
  if (!isMongoConfigured()) return;
  const cols = await getMongoCollections();
  if (!cols) return;
  await cols.adminActivityLogs.insertOne({ ...entry });
}

export async function seedFullStateToMongo(state: StoreStateShape): Promise<void> {
  if (!isMongoConfigured()) return;
  await ensureMongoIndexes();
  const cols = await getMongoCollections();
  if (!cols) return;

  for (const c of state.categories) {
    await cols.categories.updateOne({ id: c.id }, { $set: c }, { upsert: true });
    if (c.parentCategoryId || c.parentId) {
      await cols.subcategories.updateOne({ id: c.id }, { $set: c }, { upsert: true });
    }
  }
  for (const p of state.products) {
    await syncProductToMongo(p);
  }
  for (const reg of COLLECTION_REGISTRY_META) {
    const items = state[reg.dbKey] || [];
    for (const item of items) {
      await cols.collections.updateOne(
        { category: reg.label, id: String(item.id || '') },
        { $set: { ...item, category: reg.label } },
        { upsert: true }
      );
    }
  }
  for (const u of state.users) {
    await syncUserToMongo(u);
  }
  for (const o of state.orders) {
    await syncOrderToMongo(o);
  }
  for (const c of state.coupons) {
    await cols.coupons.updateOne({ id: c.id }, { $set: c }, { upsert: true });
  }
  for (const b of state.banners) {
    await cols.banners.updateOne({ id: b.id }, { $set: b }, { upsert: true });
  }
  for (const r of state.reviews) {
    await cols.reviews.updateOne({ id: r.id }, { $set: r }, { upsert: true });
  }
  for (const n of state.newsletter) {
    await cols.newsletterSubscribers.updateOne({ email: n.email }, { $set: n }, { upsert: true });
  }
  await syncSettingsToMongo(state.settings);
}

let mongoHydratedOnce = false;

export async function ensureStoreLoadedFromMongo(
  currentState: StoreStateShape
): Promise<boolean> {
  if (!isMongoConfigured() || mongoHydratedOnce) return false;
  try {
    await ensureMongoIndexes();
    const cols = await getMongoCollections();
    if (!cols) return false;

    const existingProductsCount = await cols.products.countDocuments();
    if (existingProductsCount === 0) {
      // First connection: seed MongoDB cleanly from current canonical state without overwriting future records
      await seedFullStateToMongo(currentState);
      mongoHydratedOnce = true;
      return true;
    }

    const [
      productsDocs,
      categoriesDocs,
      collectionDocs,
      userDocs,
      orderDocs,
      couponDocs,
      bannerDocs,
      reviewDocs,
      newsletterDocs,
      settingsDoc,
      inquiryDocs,
      activityDocs,
    ] = await Promise.all([
      cols.products.find({}).toArray(),
      cols.categories.find({}).sort({ displayOrder: 1 }).toArray(),
      cols.collections.find({}).toArray(),
      cols.users.find({}).toArray(),
      cols.orders.find({}).sort({ createdAt: -1 }).toArray(),
      cols.coupons.find({}).toArray(),
      cols.banners.find({}).toArray(),
      cols.reviews.find({}).toArray(),
      cols.newsletterSubscribers.find({}).toArray(),
      cols.siteSettings.findOne({ id: 'default' }),
      cols.contactInquiries.find({}).toArray(),
      cols.adminActivityLogs.find({}).sort({ createdAt: -1 }).limit(500).toArray(),
    ]);

    if (productsDocs.length > 0) {
      currentState.products = productsDocs.map((d) => stripMongoId<Product>(d));
    }
    if (categoriesDocs.length > 0) {
      currentState.categories = categoriesDocs.map((d) => stripMongoId<CategoryInfo>(d));
    }
    if (collectionDocs.length > 0) {
      const byCategory = new Map<string, Array<Record<string, unknown> & { id: string }>>();
      for (const doc of collectionDocs) {
        const cat = String(doc.category || '');
        const clean = stripMongoId<Record<string, unknown>>(doc);
        const normalized: Record<string, unknown> & { id: string } = {
          ...clean,
          id: String(clean.id || ''),
        };
        const arr = byCategory.get(cat) || [];
        arr.push(normalized);
        byCategory.set(cat, arr);
      }
      for (const reg of COLLECTION_REGISTRY_META) {
        const matched = byCategory.get(reg.label);
        if (matched && matched.length > 0) {
          matched.sort((a, b) => Number(a.displayOrder ?? 999) - Number(b.displayOrder ?? 999));
          currentState[reg.dbKey] = matched;
        }
      }
    }
    if (userDocs.length > 0) {
      currentState.users = userDocs.map((d) => stripMongoId<StoredUserRecord>(d));
    }
    if (orderDocs.length > 0) {
      currentState.orders = orderDocs.map((d) => stripMongoId<Order>(d));
    }
    if (couponDocs.length > 0) {
      currentState.coupons = couponDocs.map((d) => stripMongoId<Coupon>(d));
    }
    if (bannerDocs.length > 0) {
      currentState.banners = bannerDocs.map((d) => stripMongoId<PromoBanner>(d));
    }
    if (reviewDocs.length > 0) {
      currentState.reviews = reviewDocs.map((d) => stripMongoId<ProductReview>(d));
    }
    if (newsletterDocs.length > 0) {
      currentState.newsletter = newsletterDocs.map((d) => stripMongoId<NewsletterSubscriber>(d));
    }
    if (settingsDoc) {
      const { id: _idField, updatedAt: _u, ...cleanSettings } = stripMongoId<Record<string, unknown>>(settingsDoc);
      currentState.settings = {
        ...currentState.settings,
        ...(cleanSettings as unknown as SiteSettings),
      };
    }
    if (inquiryDocs.length > 0) {
      currentState.inquiries = inquiryDocs.map((d) => stripMongoId<ContactInquiryRecord>(d));
    }
    if (activityDocs.length > 0) {
      currentState.adminActivityLogs = activityDocs.map((d) => stripMongoId<AdminActivityLog>(d));
    }

    mongoHydratedOnce = true;
    return true;
  } catch (err) {
    console.warn('MongoDB hydration fallback to local snapshot:', err instanceof Error ? err.message : err);
    return false;
  }
}
