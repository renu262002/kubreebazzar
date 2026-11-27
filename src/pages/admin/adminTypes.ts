import type { DeliveryStatus } from '../../types';
import type { AdminPermission } from '../../utils/adminAuth';

export type AdminSectionRoute =
  | '/admin/dashboard'
  | '/admin/products'
  | '/admin/products/new'
  | '/admin/categories'
  | '/admin/images'
  | '/admin/inventory'
  | '/admin/orders'
  | '/admin/customers'
  | '/admin/coupons'
  | '/admin/reports'
  | '/admin/users'
  | '/admin/settings';

export interface AdminNavItem {
  path: AdminSectionRoute;
  label: string;
  permission: AdminPermission;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { path: '/admin/dashboard', label: 'Dashboard', permission: 'view_dashboard' },
  { path: '/admin/products', label: 'Products', permission: 'manage_products' },
  { path: '/admin/products/new', label: 'Add Product', permission: 'manage_products' },
  { path: '/admin/categories', label: 'Categories', permission: 'manage_categories' },
  { path: '/admin/images', label: 'Images & Audit', permission: 'manage_images' },
  { path: '/admin/inventory', label: 'Inventory', permission: 'manage_inventory' },
  { path: '/admin/orders', label: 'Orders', permission: 'view_orders' },
  { path: '/admin/customers', label: 'Customers', permission: 'view_customers' },
  { path: '/admin/coupons', label: 'Offers & Coupons', permission: 'manage_coupons' },
  { path: '/admin/reports', label: 'Reports & Export', permission: 'view_reports' },
  { path: '/admin/users', label: 'Admin Users & RBAC', permission: 'manage_users' },
  { path: '/admin/settings', label: 'Settings', permission: 'manage_settings' },
];

export const ORDER_STATUS_LIST: DeliveryStatus[] = [
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

export const COLLECTION_REGISTRIES = [
  { key: 'mens-fashion', label: "Men's Fashion", endpoint: '/api/admin/mens-fashion/collections' },
  { key: 'womens-fashion', label: "Women's Fashion", endpoint: '/api/admin/womens-fashion/collections' },
  { key: 'electronics', label: 'Electronics', endpoint: '/api/admin/electronics/collections' },
  { key: 'dried-fruits', label: 'Dried Fruits', endpoint: '/api/admin/dried-fruits/collections' },
  { key: 'nuts', label: 'Nuts', endpoint: '/api/admin/nuts/collections' },
  { key: 'skin-care', label: 'Skin Care', endpoint: '/api/admin/skin-care/collections' },
  { key: 'hair-care', label: 'Hair Care', endpoint: '/api/admin/hair-care/collections' },
  { key: 'furniture', label: 'Furniture', endpoint: '/api/admin/furniture/collections' },
  { key: 'dried-peas', label: 'Dried Peas', endpoint: '/api/admin/dried-peas/collections' },
  { key: 'pranks-novelties', label: 'Pranks & Novelties', endpoint: '/api/admin/pranks-novelties/collections' },
  { key: 'fitness-gym', label: 'Fitness & Gym', endpoint: '/api/admin/fitness-gym/collections' },
  { key: 'accessories', label: 'Accessories', endpoint: '/api/admin/accessories/collections' },
  { key: 'sports', label: 'Sports', endpoint: '/api/admin/sports/collections' },
  { key: 'footwear', label: 'Footwear', endpoint: '/api/admin/footwear/collections' },
  { key: 'teenagers', label: 'Teenagers', endpoint: '/api/admin/teenagers/collections' },
  { key: 'kids', label: 'Kids', endpoint: '/api/admin/kids/collections' },
] as const;

export function getStatusToneClasses(status: string): string {
  switch (status) {
    case 'Delivered':
    case 'published':
    case 'approved':
    case 'active':
    case 'in_stock':
    case 'paid':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Cancelled':
    case 'Returned':
    case 'archived':
    case 'out_of_stock':
    case 'failed':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Pending':
    case 'draft':
    case 'low_stock':
    case 'pending':
    case 'pending_approval':
    case 'quota_pending':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    default:
      return 'bg-[#EEF4FB] text-[#0B3B78] border-[#DCE6F2]';
  }
}
