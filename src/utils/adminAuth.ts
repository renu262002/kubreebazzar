import type { AdminRoleKey, User } from '../types';

export const ADMIN_ROLE_LABELS: Record<AdminRoleKey, string> = {
  super_admin: 'Super Admin',
  product_manager: 'Product Manager',
  order_manager: 'Order Manager',
  viewer: 'Viewer (Read-Only)',
};

export const ADMIN_ROLE_DESCRIPTIONS: Record<AdminRoleKey, string> = {
  super_admin: 'Full access to products, categories, orders, RBAC users, media, reports, and settings.',
  product_manager: 'Manage products, categories, collections, inventory, and upload/manage images.',
  order_manager: 'Manage orders, update 9-stage statuses, assign courier tracking, and view customers & reports.',
  viewer: 'Read-only access to dashboard KPIs, catalog, orders, inventory, and reports.',
};

export function normalizeAdminRole(user?: Pick<User, 'role' | 'adminRole'> | null): AdminRoleKey | null {
  if (!user) return null;
  if (user.adminRole && ['super_admin', 'product_manager', 'order_manager', 'viewer'].includes(user.adminRole)) {
    return user.adminRole;
  }
  if (user.role === 'super_admin' || user.role === 'admin') return 'super_admin';
  if (user.role === 'product_manager') return 'product_manager';
  if (user.role === 'order_manager') return 'order_manager';
  if (user.role === 'viewer') return 'viewer';
  return null;
}

export function isAdminRole(user?: Pick<User, 'role' | 'adminRole'> | null): boolean {
  return normalizeAdminRole(user) !== null;
}

export type AdminPermission =
  | 'view_dashboard'
  | 'manage_products'
  | 'delete_products'
  | 'manage_categories'
  | 'manage_images'
  | 'manage_inventory'
  | 'view_orders'
  | 'manage_orders'
  | 'view_customers'
  | 'manage_coupons'
  | 'view_reports'
  | 'manage_users'
  | 'manage_settings';

const ROLE_PERMISSIONS: Record<AdminRoleKey, AdminPermission[]> = {
  super_admin: [
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
  product_manager: [
    'view_dashboard',
    'manage_products',
    'delete_products',
    'manage_categories',
    'manage_images',
    'manage_inventory',
    'manage_coupons',
    'view_reports',
  ],
  order_manager: [
    'view_dashboard',
    'view_orders',
    'manage_orders',
    'view_customers',
    'view_reports',
  ],
  viewer: [
    'view_dashboard',
    'view_orders',
    'view_customers',
    'view_reports',
  ],
};

export function hasAdminPermission(
  user: Pick<User, 'role' | 'adminRole'> | null | undefined,
  permission: AdminPermission
): boolean {
  const role = normalizeAdminRole(user);
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}
