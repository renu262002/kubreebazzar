import { useState, useMemo } from 'react';
import { Users, Search } from 'lucide-react';
import type { Order, User } from '../../types';
import { isAdminRole, ADMIN_ROLE_LABELS, normalizeAdminRole } from '../../utils/adminAuth';

interface AdminCustomersViewProps {
  users: User[];
  orders: Order[];
}

export function AdminCustomersView({ users, orders }: AdminCustomersViewProps) {
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users
      .filter((u) => {
        if (!q) return true;
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone || '').toLowerCase().includes(q)
        );
      })
      .map((u) => {
        const userOrders = orders.filter((o) => o.userId === u.id);
        const totalSpent = userOrders
          .filter((o) => o.deliveryStatus !== 'Cancelled' && o.deliveryStatus !== 'Returned')
          .reduce((sum, o) => sum + o.total, 0);
        const roleKey = normalizeAdminRole(u);
        return {
          ...u,
          orderCount: userOrders.length,
          totalSpent,
          roleDisplay: roleKey ? ADMIN_ROLE_LABELS[roleKey] : 'Customer',
          isStaff: isAdminRole(u),
        };
      });
  }, [users, orders, search]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B3B78]">
          Customers Directory ({rows.filter((r) => !r.isStaff).length} Shoppers)
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Registered user profiles, saved delivery addresses count, and lifetime order activity.
        </p>
      </div>

      <div className="rounded-xl bg-white border border-[#DCE6F2] p-3.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, email, or phone..."
            className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#DCE6F2] text-xs"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl bg-white border border-[#DCE6F2] p-10 text-center space-y-2">
          <Users className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <p className="text-sm font-semibold text-[#0B3B78]">No registered accounts yet</p>
          <p className="text-xs text-[#64748B]">
            Customer signups from the storefront will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-white border border-[#DCE6F2] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EEF4FB] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B]">
                  <th className="py-2.5 px-4">Account</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4">Phone</th>
                  <th className="py-2.5 px-4 text-right">Addresses</th>
                  <th className="py-2.5 px-4 text-right">Orders</th>
                  <th className="py-2.5 px-4 text-right">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF4FB] text-xs">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#132238]">{row.name}</p>
                      <p className="text-[11px] text-[#64748B]">{row.email}</p>
                    </td>
                    <td className="py-3 px-4 text-[#475569] whitespace-nowrap">
                      {row.roleDisplay}
                    </td>
                    <td className="py-3 px-4 font-mono-tabular text-[#475569] whitespace-nowrap">
                      {row.phone || '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-tabular">
                      {row.addresses?.length || 0}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-tabular">
                      {row.orderCount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-tabular font-semibold text-[#0B3B78]">
                      ₹{row.totalSpent.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
