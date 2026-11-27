import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import type { AdminAnalytics, Order, Product } from '../../types';
import { apiFetch, buildApiHeaders } from '../../utils/apiClient';

interface AdminReportsViewProps {
  analytics: AdminAnalytics | null;
  orders: Order[];
  products: Product[];
  token: string;
}

function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number>>) {
  const escape = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csv = [headers.join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function AdminReportsView({
  analytics,
  orders,
  products,
  token,
}: AdminReportsViewProps) {
  const [subscribers, setSubscribers] = useState<Array<{ id: string; email: string; subscribedAt: string }>>([]);

  useEffect(() => {
    apiFetch('/api/admin/newsletter', {
      headers: buildApiHeaders(token),
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setSubscribers(data);
      })
      .catch(() => null);
  }, [token]);

  const exportOrdersCsv = () => {
    downloadCsv(
      'kubreebazzar-orders.csv',
      ['Order Number', 'Customer', 'Email', 'Status', 'Payment', 'Total', 'Courier', 'Tracking Number', 'Created At'],
      orders.map((o) => [
        o.orderNumber,
        o.customerName,
        o.customerEmail,
        o.deliveryStatus,
        `${o.paymentMethod}/${o.paymentStatus}`,
        o.total,
        o.courierName || '',
        o.trackingNumber || '',
        o.createdAt,
      ])
    );
  };

  const exportProductsCsv = () => {
    downloadCsv(
      'kubreebazzar-catalog.csv',
      ['ID', 'SKU', 'Name', 'Category', 'Subcategory', 'Price', 'Stock', 'Status'],
      products.map((p) => [
        p.id,
        p.sku || '',
        p.name,
        p.category,
        p.subcategory || '',
        p.price,
        p.stock,
        p.status || (p.enabled !== false ? 'published' : 'archived'),
      ])
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B3B78]">
            Analytics, Reports &amp; CSV Exports
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Category revenue attribution, subscriber records, and downloadable CSV ledgers.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportOrdersCsv}
            className="px-4 py-2 min-h-[40px] rounded-xl border border-[#DCE6F2] bg-white hover:bg-[#F0F6FF] text-xs font-bold text-[#0B3B78] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Orders CSV</span>
          </button>
          <button
            type="button"
            onClick={exportProductsCsv}
            className="px-4 py-2 min-h-[40px] rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Catalog CSV</span>
          </button>
        </div>
      </div>

      {/* Category Revenue Table */}
      <div className="rounded-xl bg-white border border-[#DCE6F2] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#EEF4FB] bg-[#F8FAFC]">
          <h3 className="font-display text-sm font-bold text-[#0B3B78]">
            Revenue by Category
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EEF4FB] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B]">
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4 text-right">Units Sold</th>
                <th className="py-2.5 px-4 text-right">Gross Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF4FB] text-xs">
              {(analytics?.revenueByCategory || []).map((row) => (
                <tr key={row.category} className="hover:bg-[#F8FAFC]">
                  <td className="py-2.5 px-4 font-semibold text-[#132238]">{row.category}</td>
                  <td className="py-2.5 px-4 text-right font-mono-tabular text-[#475569]">
                    {row.orders}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono-tabular font-bold text-[#0B3B78]">
                    ₹{row.revenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Newsletter Subscribers */}
      <div className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-3">
        <h3 className="font-display text-sm font-bold text-[#0B3B78]">
          Newsletter Subscribers ({subscribers.length})
        </h3>
        {subscribers.length === 0 ? (
          <p className="text-xs text-[#64748B]">No newsletter subscribers yet.</p>
        ) : (
          <div className="divide-y divide-[#EEF4FB]">
            {subscribers.map((s) => (
              <div key={s.id} className="py-2 flex items-center justify-between text-xs">
                <span className="font-medium text-[#132238]">{s.email}</span>
                <span className="font-mono-tabular text-[#64748B]">
                  {new Date(s.subscribedAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
