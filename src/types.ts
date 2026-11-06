export type ProductCategory =
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
  colorHex: string;
  size?: string;
  priceDelta: number;
  stock: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory?: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discountPercent: number;
  description: string;
  shortDescription: string;
  images: string[];
  modelType: ModelPreset;
  has3DModel?: boolean;
  glbUrl?: string;
  variants: ProductVariant[];
  specs: ProductSpec[];
  stock: number;
  rating: number;
  reviewCount: number;
  isDemoRating?: boolean;
  featured: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  tag?: string;
  createdAt: string;
}

export interface CategoryInfo {
  id: ProductCategory;
  title: string;
  subtitle: string;
  description: string;
  subcategories: string[];
  modelType: ModelPreset;
  accentColor: string;
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
  role: 'customer' | 'admin';
  addresses: SavedAddress[];
  wishlist: string[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product?: Product;
}

export type DeliveryStatus =
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderTimelineEvent {
  status: DeliveryStatus;
  timestamp: string;
  note: string;
}

export interface OrderItemSnapshot {
  productId: string;
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
  timeline: OrderTimelineEvent[];
  createdAt: string;
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
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  lowStockCount: number;
  totalProducts: number;
  totalCustomers: number;
  newsletterCount: number;
  revenueByCategory: { category: string; revenue: number; orders: number }[];
  recentOrders: Order[];
}
