import type { AdminAnalytics, Order } from '../../types';
import { ORDER_STATUS_LIST, getStatusToneClasses, type AdminSectionRoute } from './adminTypes';
import { ArrowRight, PackagePlus, ClipboardList, Image as ImageIcon } from 'lucide-react';

interface AdminOverviewViewProps {
  analytics: AdminAnalytics | null;
  orders: Order[];
  loading: boolean;
  onNavigateSection: (path: AdminSectionRoute) => void;
  canManageProducts: boolean;
  canManageImages: boolean;
}

export function AdminOverviewView({
  analytics,
  orders,
  loading,
  onNavigateSection,
  canManageProducts,
  canManageImages,
}: AdminOverviewViewProps) {
  if (loading && !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 rounded-xl bg-white border border-[#DCE6F2] animate-pulse" />
          ))}
        </div>
        <div className="h-72 rounded-xl bg-white border border-[#DCE6F2] animate-pulse" />
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Revenue',
      value: `₹${(analytics?.totalRevenue ?? 0).toLocaleString('en-IN')}`,
      sub: `Avg order ₹${(analytics?.averageOrderValue ?? 0).toLocaleString('en-IN')}`,
    },
    {
      label: 'Orders & Pending',
      value: String(analytics?.totalOrders ?? 0),
      sub: `${analytics?.pendingOrdersCount ?? 0} awaiting dispatch`,
    },
    {
      label: 'Catalog Products',
      value: String(analytics?.totalProducts ?? 0),
      sub: `${analytics?.activeProductsCount ?? 0} live · ${analytics?.draftProductsCount ?? 0} drafts`,
    },
    {
      label: 'Stock Alerts',
      value: `${analytics?.lowStockCount ?? 0} low / ${analytics?.outOfStockCount ?? 0} out`,
      sub: `${analytics?.totalCustomers ?? 0} registered customers`,
    },
  ];

  const recentOrders = analytics?.recentOrders?.length ? analytics.recentOrders : orders.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B3B78]">
            Store Operations Overview
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Live figures computed directly from catalog, stock, customer, and order records.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canManageProducts && (
            <button
              type="button"
              onClick={() => onNavigateSection('/admin/products/new')}
              className="px-4 py-2 min-h-[40px] rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}
          {canManageImages && (
            <button
              type="button"
              onClick={() => onNavigateSection('/admin/images')}
              className="px-4 py-2 min-h-[40px] rounded-xl bg-white border border-[#DCE6F2] hover:bg-[#F0F6FF] text-xs font-bold text-[#0B3B78] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Media Audit</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-1.5"
          >
            <p className="text-xs font-medium text-[#64748B]">{kpi.label}</p>
            <p className="font-mono-tabular text-2xl font-bold text-[#0B3B78]">
              {kpi.value}
            </p>
            <p className="text-[11px] text-[#64748B]">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* 9-Stage Order Workflow Breakdown */}
      <div className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-base font-bold text-[#0B3B78]">
            Order Workflow Breakdown (9 Stages)
          </h3>
          <button
            type="button"
            onClick={() => onNavigateSection('/admin/orders')}
            className="text-xs font-semibold text-[#1D6FD8] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Open Orders Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
          {ORDER_STATUS_LIST.map((stage) => {
            const count = analytics?.statusBreakdown?.[stage] ?? 0;
            return (
              <div
                key={stage}
                className="rounded-lg border border-[#DCE6F2] bg-[#F8FAFC] p-3 flex flex-col justify-between gap-1"
              >
                <span className="text-[11px] font-medium text-[#475569] truncate">
                  {stage}
                </span>
                <span className="font-mono-tabular text-lg font-bold text-[#0B3B78]">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-white border border-[#DCE6F2] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEF4FB] flex items-center justify-between gap-2">
          <h3 className="font-display text-base font-bold text-[#0B3B78]">
            Recent Orders
          </h3>
          <button
            type="button"
            onClick={() => onNavigateSection('/admin/orders')}
            className="text-xs font-semibold text-[#1D6FD8] hover:underline cursor-pointer"
          >
            View All Orders
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <ClipboardList className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <p className="text-sm font-semibold text-[#0B3B78]">No orders placed yet</p>
            <p className="text-xs text-[#64748B]">
              Real customer checkout orders will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EEF4FB] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B]">
                  <th className="py-2.5 px-4">Order</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Payment</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF4FB] text-xs">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4 font-mono-tabular font-semibold text-[#0B3B78] whitespace-nowrap">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#132238]">{ord.customerName}</p>
                      <p className="text-[11px] text-[#64748B]">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold ${getStatusToneClasses(
                          ord.deliveryStatus
                        )}`}
                      >
                        {ord.deliveryStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#475569] whitespace-nowrap">
                      {ord.paymentMethod.toUpperCase()} · {ord.paymentStatus}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-tabular font-bold text-[#0B3B78] whitespace-nowrap">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
