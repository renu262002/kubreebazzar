export type ProductCategory =
  | 'Temple'
  | 'Baby Kit'
  | 'Kids'
  | 'Teenager'
  | 'School Kit'
  | 'Groceries'
  | 'Dry Nuts'
  | 'Dry Fruits'
  | 'Hair Care'
  | 'Skin Care'
  | 'Electronics'
  | 'Furniture'
  | 'Prank Items'
  | 'Used Bikes and Cars'
  | 'Dry Peas'
  | 'Gym'
  | 'Sports'
  | 'Accessories'
  | 'Footwear'
  | 'Fashion'
  | 'Rice'
  | 'Grocery'
  | 'Honey'
  | 'Watches'
  | string;

export type ModelPreset =
  | 'rice'
  | 'grocery'
  | 'honey'
  | 'watch';

export interface ProductVariant {
  id: string;
  name: string;
  label?: string;
  colorHex?: string;
  colorName?: string;
  size?: string;
  image?: string;
  priceDelta: number;
  stock: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface VehicleDetails {
  type: 'Bike' | 'Car';
  brand: string;
  model: string;
  year: number;
  kmDriven: number;
  fuelType?: 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
  transmission?: 'Manual' | 'Automatic';
  location: string;
  owners?: number;
  registrationState?: string;
  bodyType?: string;
  color?: string;
  insuranceValidity?: string;
}

export interface BundleItemConfig {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  enabled: boolean;
  note?: string;
}

export type AdminRoleKey =
  | 'super_admin'
  | 'product_manager'
  | 'order_manager'
  | 'viewer';

export interface ProductImageAsset {
  id?: string;
  url: string;
  storageBucket?: 'product-images' | 'category-images' | 'website-assets' | string;
  storagePath?: string;
  storageMode?: string;
  permanentCloud?: boolean;
  altText?: string;
  mimeType?: string;
  sizeBytes?: number;
  versionTag?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface Product {
  id: string;
  name: string;
  tamilName?: string;
  slug: string;
  sku?: string;
  category: ProductCategory;
  subcategory?: string;
  subSubcategory?: string;
  collectionId?: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discountPercent: number;
  description: string;
  shortDescription: string;
  images: string[];
  imageMetadata?: ProductImageAsset[];
  modelType: ModelPreset;
  has3DModel?: boolean;
  glbUrl?: string;
  variants: ProductVariant[];
  specs: ProductSpec[];
  stock: number;
  lowStockThreshold?: number;
  availabilityStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
  status?: 'draft' | 'published' | 'archived';
  dimensions?: string;
  material?: string;
  rating: number;
  reviewCount: number;
  isDemoRating?: boolean;
  featured: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  enabled?: boolean;
  isDraft?: boolean;
  isBundle?: boolean;
  bundleItems?: BundleItemConfig[];
  usageInstructions?: string;
  ageSuitability?: string;
  tag?: string;
  tags?: string[];
  vehicleDetails?: VehicleDetails;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryHierarchyChild {
  name: string;
  slug: string;
  children?: string[]; // 3rd level subcategories (e.g. Lunch, Dinner, Breakfast)
  subChildren?: Record<string, string[]>; // Optional 4th level subcategories keyed by 3rd-level name
}

export interface CategoryInfo {
  id: ProductCategory;
  name?: string;
  title: string;
  slug: string;
  parentCategoryId?: string | null;
  parentId?: string | null;
  subtitle?: string;
  description: string;
  image?: string;
  bannerUrl?: string;
  displayOrder?: number;
  status?: 'active' | 'inactive';
  subcategories: string[];
  hierarchyChildren?: CategoryHierarchyChild[];
  modelType?: ModelPreset;
  accentColor?: string;
  itemCount?: number;
}

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  emailVerified?: boolean;
  role: 'customer' | 'admin' | AdminRoleKey;
  adminRole?: AdminRoleKey;
  isActive?: boolean;
  addresses: SavedAddress[];
  wishlist: string[];
  cart?: CartItem[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product?: Product;
}

export type DeliveryStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface OrderTimelineEvent {
  status: DeliveryStatus;
  timestamp: string;
  note: string;
  changedBy?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  variantId?: string;
  name: string;
  category: ProductCategory;
  variantName: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: SavedAddress;
  items: OrderItemSnapshot[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  deliveryStatus: DeliveryStatus;
  courierName?: string;
  trackingNumber?: string;
  dispatchDate?: string;
  estimatedDeliveryDate?: string;
  shippingStatus?: string;
  trackingNotes?: string;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrderAmount: number;
  description: string;
  active: boolean;
  expiresAt: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  targetCategory?: ProductCategory | 'All';
  accentColor: string;
  active: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  approved: boolean;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface AboutMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface SiteSettings {
  brandName: string;
  brandTagline: string;
  announcementText: string;
  announcementLink: string;
  campaignHeadline: string;
  campaignSubheadline: string;
  campaignCta: string;
  flashSaleTitle: string;
  flashSaleSubtitle: string;
  flashSaleEndsAt: string;
  aboutOverview: string;
  aboutStory: string;
  aboutMission: string;
  aboutVision: string;
  milestones: AboutMilestone[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  supportHours: string;
  footerNote: string;
  whatsappNumber?: string;
  whatsappUrl?: string;
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalOrders: number;
  pendingOrdersCount: number;
  averageOrderValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalProducts: number;
  activeProductsCount: number;
  draftProductsCount: number;
  totalCustomers: number;
  newsletterCount: number;
  statusBreakdown: Record<DeliveryStatus, number>;
  revenueByCategory: { category: string; revenue: number; orders: number }[];
  recentOrders: Order[];
}

export interface AdminActivityLog {
  id: string;
  actorUserId: string;
  actorEmail: string;
  actorRole: AdminRoleKey;
  action: string;
  resourceType: string;
  resourceId: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface SystemInfrastructureStatus {
  databaseEngine?: 'mongodb-atlas';
  databaseName?: string;
  mongoConfigured?: boolean;
  gridfsConfigured?: boolean;
  emailServiceConfigured?: boolean;
  supabaseConfigured: boolean;
  supabaseAuthConfigured: boolean;
  storageConfigured: boolean;
  razorpayLiveConfigured: boolean;
  activeDatabaseMode:
    | 'mongodb-atlas'
    | 'supabase-postgresql'
    | 'local-dev-json'
    | 'unconfigured-vercel-ephemeral';
  activeStorageMode:
    | 'mongodb-gridfs'
    | 'supabase-storage'
    | 'local-dev-disk'
    | 'unconfigured';
  missingEnvVars: string[];
  buckets: {
    products: string;
    categories: string;
    assets: string;
  };
  hasSuperAdmin: boolean;
}

export interface MediaAuditItem {
  id: string;
  category: string;
  groupName: string;
  name: string;
  slug: string;
  expectedFilename: string;
  imageStatus: string;
}

export interface MediaAuditSummary {
  publicImagesCount: number;
  srcAssetsCount: number;
  uploadsCount: number;
  brokenProductRefs: string[];
  collectionsWithMissingImages: MediaAuditItem[];
  storageBucketsConfigured: boolean;
  gridfsImagesCount?: number;
}

export interface GridFSImageRecord {
  id: string;
  gridfsFileId: string;
  bucket: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  refType: string;
  refId: string;
  imageType: string;
  displayOrder: number;
  active: boolean;
  sha256?: string;
  uploadedAt: string;
  url: string;
}

export type MensFashionParentCategory =
  | 'Shirts'
  | 'Trousers'
  | 'Pants'
  | 'T-Shirts';

export interface MensFashionCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: MensFashionParentCategory;
  parentSlug: string;
  image: string;
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type WomensFashionParentCategory =
  | 'Churidar Sets'
  | 'Traditional Wear'
  | 'Sarees'
  | 'Lehengas'
  | 'Korean Fashion'
  | 'Bottom Wear'
  | 'Shawls & Stoles'
  | 'Tops'
  | 'Skirts'
  | 'Nightwear Sets'
  | 'Long Coats'
  | 'Track Pants'
  | 'T-Shirts';

export interface WomensFashionCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: WomensFashionParentCategory;
  parentSlug: string;
  parentSubcategory: "Women's Fashion";
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type ElectronicsGroupCategory =
  | 'Smartphones & Tablets'
  | 'Audio Devices'
  | 'Smartwatches & Wearables'
  | 'Charging & Power'
  | 'Computer Accessories'
  | 'Storage Devices'
  | 'Mobile Accessories'
  | 'Gaming Accessories'
  | 'Cameras & Accessories'
  | 'Home Electronics';

export interface ElectronicsCollection {
  id: string;
  name: string;
  slug: string;
  parentGroup: ElectronicsGroupCategory;
  parentSlug: string;
  additionalGroups?: ElectronicsGroupCategory[];
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export interface DriedFruitCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Dried Fruits';
  parentSlug: 'dried-fruits';
  varietyGroup: 'Classic Sun-Dried' | 'Berries & Cherries' | 'Tropical & Orchard';
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export interface NutCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Nuts';
  parentSlug: 'nuts';
  varietyGroup: 'Classic Tree Nuts' | 'Groundnuts & Roasted' | 'Gourmet & Specialty';
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type SkinCareGroupName =
  | 'Face Wash & Cleansers'
  | 'Moisturizers & Creams'
  | 'Sunscreen'
  | 'Serums & Treatments'
  | 'Body Care'
  | 'Lip Care'
  | 'Face Masks & Exfoliators';

export interface SkinCareCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Skin Care';
  parentGroup: SkinCareGroupName;
  parentGroupSlug: string;
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type HairCareGroupName =
  | 'Shampoo'
  | 'Conditioners'
  | 'Hair Oils'
  | 'Hair Serums & Treatments'
  | 'Hair Styling'
  | 'Hair Tools'
  | 'Hair Accessories';

export interface HairCareCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Hair Care';
  parentGroup: HairCareGroupName;
  parentGroupSlug: string;
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type FurnitureGroupName =
  | 'Sofas & Seating'
  | 'Beds & Mattresses'
  | 'Dining Furniture'
  | 'Tables & Desks'
  | 'Storage Furniture'
  | 'Chairs'
  | 'Home Furniture';

export interface FurnitureCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Furniture';
  parentGroup: FurnitureGroupName;
  parentGroupSlug: string;
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type DriedPeasGroupName =
  | 'Dried Peas'
  | 'Related Dried Pulses & Legumes';

export interface DriedPeasCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Dried Peas';
  parentGroup: DriedPeasGroupName;
  parentGroupSlug: string;
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type PranksNoveltiesGroupName =
  | 'Funny Prank Toys'
  | 'Magic & Trick Toys'
  | 'Funny Gadgets'
  | 'Novelty Gifts'
  | 'Party Pranks'
  | 'Stress Relief & Fidget Toys'
  | 'Fun Room Decor';

export interface PranksNoveltiesCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Pranks & Novelties';
  parentGroup: PranksNoveltiesGroupName;
  parentGroupSlug: string;
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type FitnessGymGroupName =
  | 'Dumbbells & Weights'
  | 'Home Gym Equipment'
  | 'Cardio Equipment'
  | 'Fitness Accessories'
  | 'Yoga & Pilates'
  | 'Gym Accessories'
  | 'Recovery & Mobility';

export interface FitnessGymCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Fitness & Gym';
  parentGroup: FitnessGymGroupName;
  parentGroupSlug: string;
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type AccessoriesGroupName =
  | 'Watches'
  | 'Bags & Wallets'
  | 'Jewellery'
  | 'Sunglasses & Eyewear'
  | 'Belts & Fashion Accessories'
  | 'Hair Accessories'
  | 'Travel Accessories'
  | 'Mobile Fashion Accessories';

export interface AccessoriesCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Accessories';
  parentGroup: AccessoriesGroupName;
  parentGroupSlug: string;
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type SportsGroupName =
  | 'Cricket'
  | 'Football'
  | 'Badminton'
  | 'Tennis'
  | 'Volleyball'
  | 'Basketball'
  | 'Table Tennis'
  | 'Swimming'
  | 'Cycling'
  | 'Outdoor Sports';

export interface SportsCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Sports';
  parentGroup: SportsGroupName;
  parentGroupSlug: string;
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type FootwearGroupName =
  | "Men's Footwear"
  | "Women's Footwear"
  | "Boys' Footwear"
  | "Girls' Footwear"
  | 'Baby Footwear'
  | 'Sports & Athletic Footwear'
  | 'Traditional Footwear';

export interface FootwearCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Footwear';
  parentGroup: FootwearGroupName;
  parentGroupSlug: string;
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type TeenagersGroupName =
  | "Teenage Boys' Fashion"
  | "Teenage Girls' Fashion"
  | 'Footwear'
  | 'School & College Essentials'
  | 'Electronics & Gadgets'
  | 'Personal Care'
  | 'Fashion Accessories'
  | 'Sports & Fitness'
  | 'Room & Lifestyle'
  | 'Hobbies & Creativity';

export interface TeenagersCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Teenagers';
  parentGroup: TeenagersGroupName;
  parentGroupSlug: string;
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type KidsGroupName =
  | "Boys' Clothing"
  | "Girls' Clothing"
  | "Kids' Footwear"
  | 'School Essentials'
  | 'Toys & Games'
  | 'Learning & Creativity'
  | "Kids' Accessories"
  | 'Personal Care'
  | 'Sports & Outdoor'
  | 'Bedroom & Lifestyle'
  | 'Feeding & Travel';

export interface KidsCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Kids';
  parentGroup: KidsGroupName;
  parentGroupSlug: string;
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

export type RiceMealGroupName = 'Breakfast' | 'Lunch' | 'Dinner';

export interface RiceCollection {
  id: string;
  name: string;
  slug: string;
  parentCategory: 'Groceries';
  parentSubcategory: 'Rice';
  parentGroup: RiceMealGroupName;
  parentGroupSlug: 'breakfast' | 'lunch' | 'dinner';
  image: string;
  expectedFilename: string;
  imageStatus: 'generated' | 'uploaded' | 'quota_pending';
  description: string;
  keywords: string[];
  status: 'pending_approval' | 'approved';
  approved: boolean;
  displayOrder: number;
}

