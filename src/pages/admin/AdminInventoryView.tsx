import { useState, useMemo } from 'react';
import { Save, Search } from 'lucide-react';
import type { Product } from '../../types';
import { getStatusToneClasses } from './adminTypes';
import { apiFetch, buildApiHeaders } from '../../utils/apiClient';

interface AdminInventoryViewProps {
  products: Product[];
  token: string;
  onRefreshCatalog: () => Promise<void>;
  onNotify: (msg: string) => void;
}

export function AdminInventoryView({
  products,
  token,
  onRefreshCatalog,
  onNotify,
}: AdminInventoryViewProps) {
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [search, setSearch] = useState('');
  const [draftEdits, setDraftEdits] = useState<Record<string, { stock: string; threshold: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const thresh = p.lowStockThreshold ?? 10;
      if (filter === 'out' && p.stock > 0) return false;
      if (filter === 'low' && (p.stock <= 0 || p.stock > thresh)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [products, filter, search]);

  const handleSaveRow = async (p: Product) => {
    const draft = draftEdits[p.id];
    const nextStock = Number(draft?.stock ?? p.stock);
    const nextThresh = Number(draft?.threshold ?? p.lowStockThreshold ?? 10);
    setSavingId(p.id);
    try {
      const res = await apiFetch(`/api/admin/inventory/${encodeURIComponent(p.id)}`, {
        method: 'PATCH',
        headers: buildApiHeaders(token, true),
        body: JSON.stringify({
          stock: Math.max(0, Math.floor(nextStock)),
          lowStockThreshold: Math.max(1, Math.floor(nextThresh)),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onNotify(data.error || 'Inventory update failed.');
        return;
      }
      await onRefreshCatalog();
      onNotify(`Saved stock (${data.stock}) for ${p.name}.`);
    } catch {
      onNotify('Network error saving inventory.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B3B78]">
          Inventory &amp; Stock Control
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Update real-time unit counts and low-stock thresholds across the entire catalog.
        </p>
      </div>

      <div className="rounded-xl bg-white border border-[#DCE6F2] p-3.5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product or SKU..."
            className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#DCE6F2] text-xs"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F1F5F9]">
          {[
            { id: 'all' as const, label: 'All Products' },
            { id: 'low' as const, label: 'Low Stock' },
            { id: 'out' as const, label: 'Out of Stock' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                filter === tab.id ? 'bg-white text-[#0B3B78] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white border border-[#DCE6F2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EEF4FB] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B]">
                <th className="py-2.5 px-4">Product</th>
                <th className="py-2.5 px-4">Availability</th>
                <th className="py-2.5 px-4">Stock Qty</th>
                <th className="py-2.5 px-4">Low Threshold</th>
                <th className="py-2.5 px-4 text-right">Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF4FB] text-xs">
              {filtered.slice(0, 120).map((p) => {
                const thresh = p.lowStockThreshold ?? 10;
                const avail =
                  p.stock <= 0 ? 'out_of_stock' : p.stock <= thresh ? 'low_stock' : 'in_stock';
                const draft = draftEdits[p.id];
                return (
                  <tr key={p.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-4">
                      <p className="font-semibold text-[#132238]">{p.name}</p>
                      <p className="text-[11px] text-[#64748B]">{p.category} · {p.sku || p.id}</p>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${getStatusToneClasses(
                          avail
                        )}`}
                      >
                        {avail.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        type="number"
                        min={0}
                        value={draft?.stock ?? String(p.stock)}
                        onChange={(e) =>
                          setDraftEdits((prev) => ({
                            ...prev,
                            [p.id]: {
                              stock: e.target.value,
                              threshold: prev[p.id]?.threshold ?? String(thresh),
                            },
                          }))
                        }
                        className="w-24 min-h-[36px] px-2.5 py-1 rounded-lg bg-white border border-[#DCE6F2] font-mono-tabular text-xs"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        type="number"
                        min={1}
                        value={draft?.threshold ?? String(thresh)}
                        onChange={(e) =>
                          setDraftEdits((prev) => ({
                            ...prev,
                            [p.id]: {
                              stock: prev[p.id]?.stock ?? String(p.stock),
                              threshold: e.target.value,
                            },
                          }))
                        }
                        className="w-24 min-h-[36px] px-2.5 py-1 rounded-lg bg-white border border-[#DCE6F2] font-mono-tabular text-xs"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        type="button"
                        disabled={savingId === p.id}
                        onClick={() => void handleSaveRow(p)}
                        className="px-3 py-1.5 rounded-lg bg-[#0B3B78] hover:bg-[#1D6FD8] disabled:opacity-50 text-[11px] font-bold text-white inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{savingId === p.id ? 'Saving' : 'Save'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
