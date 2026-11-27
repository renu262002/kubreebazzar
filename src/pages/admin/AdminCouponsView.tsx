import { useState, type FormEvent } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import type { CategoryInfo, Coupon, PromoBanner } from '../../types';
import { apiFetch, buildApiHeaders } from '../../utils/apiClient';

interface AdminCouponsViewProps {
  coupons: Coupon[];
  banners: PromoBanner[];
  categories: CategoryInfo[];
  token: string;
  onRefreshCatalog: () => Promise<void>;
  onNotify: (msg: string) => void;
}

export function AdminCouponsView({
  coupons,
  banners,
  categories,
  token,
  onRefreshCatalog,
  onNotify,
}: AdminCouponsViewProps) {
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState('10');
  const [minOrderAmount, setMinOrderAmount] = useState('500');
  const [description, setDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [ctaLabel, setCtaLabel] = useState('Shop Now');
  const [targetCategory, setTargetCategory] = useState('All');

  const mainCategories = categories.filter((c) => !c.parentCategoryId && !c.parentId);

  const handleCreateCoupon = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value) return;
    const res = await apiFetch('/api/coupons', {
      method: 'POST',
      headers: buildApiHeaders(token, true),
      body: JSON.stringify({
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        minOrderAmount: Number(minOrderAmount || 0),
        description: description.trim(),
        expiresAt,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      onNotify(data.error || 'Could not create coupon.');
      return;
    }
    setCode('');
    setDescription('');
    await onRefreshCatalog();
    onNotify(`Created coupon ${data.code}.`);
  };

  const handleDeleteCoupon = async (id: string) => {
    const res = await apiFetch(`/api/coupons/${id}`, {
      method: 'DELETE',
      headers: buildApiHeaders(token),
    });
    if (res.ok) {
      await onRefreshCatalog();
      onNotify('Deleted coupon.');
    }
  };

  const handleCreateBanner = async (e: FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim()) return;
    const res = await apiFetch('/api/banners', {
      method: 'POST',
      headers: buildApiHeaders(token, true),
      body: JSON.stringify({
        title: bannerTitle.trim(),
        subtitle: bannerSubtitle.trim(),
        ctaLabel: ctaLabel.trim() || 'Shop Now',
        targetCategory,
        accentColor: '#0B3B78',
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      onNotify(data.error || 'Could not add announcement banner.');
      return;
    }
    setBannerTitle('');
    setBannerSubtitle('');
    await onRefreshCatalog();
    onNotify('Published storefront promo banner.');
  };

  const handleDeleteBanner = async (id: string) => {
    const res = await apiFetch(`/api/banners/${id}`, {
      method: 'DELETE',
      headers: buildApiHeaders(token),
    });
    if (res.ok) {
      await onRefreshCatalog();
      onNotify('Removed banner.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B3B78]">
          Offers, Discount Coupons &amp; Promo Banners
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Manage checkout discount codes and homepage announcement banners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coupons */}
        <div className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-4">
          <h3 className="font-display text-base font-bold text-[#0B3B78] inline-flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#FF6B1A]" />
            <span>Discount Coupons ({coupons.length})</span>
          </h3>

          <form onSubmit={handleCreateCoupon} className="space-y-3 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#DCE6F2]">
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="CODE (e.g. KUBREE15)"
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs font-mono font-bold uppercase"
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'percent' | 'fixed')}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
              >
                <option value="percent">Percent (%)</option>
                <option value="fixed">Flat Amount (₹)</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <input
                type="number"
                required
                min={1}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Discount"
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs font-mono-tabular"
              />
              <input
                type="number"
                min={0}
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                placeholder="Min Order"
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs font-mono-tabular"
              />
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="min-h-[38px] px-2 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
              />
            </div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Offer description..."
              className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
            />
            <button
              type="submit"
              className="w-full min-h-[38px] rounded-lg bg-[#0B3B78] hover:bg-[#1D6FD8] text-xs font-bold text-white inline-flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </form>

          <div className="divide-y divide-[#EEF4FB]">
            {coupons.map((c) => (
              <div key={c.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                <div>
                  <p className="font-mono font-bold text-[#0B3B78]">
                    {c.code} · {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Min ₹{c.minOrderAmount} · Expires {c.expiresAt}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDeleteCoupon(c.id)}
                  className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Banners */}
        <div className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-4">
          <h3 className="font-display text-base font-bold text-[#0B3B78]">
            Storefront Promo Banners ({banners.length})
          </h3>

          <form onSubmit={handleCreateBanner} className="space-y-3 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#DCE6F2]">
            <input
              type="text"
              required
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              placeholder="Headline (e.g., Festive Home & Furniture Sale)"
              className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
            />
            <input
              type="text"
              value={bannerSubtitle}
              onChange={(e) => setBannerSubtitle(e.target.value)}
              placeholder="Subtitle..."
              className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="CTA Label"
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
              />
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
              >
                <option value="All">All Categories</option>
                {mainCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title || c.id}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full min-h-[38px] rounded-lg bg-[#0B3B78] hover:bg-[#1D6FD8] text-xs font-bold text-white inline-flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish Banner</span>
            </button>
          </form>

          <div className="divide-y divide-[#EEF4FB]">
            {banners.map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                <div>
                  <p className="font-semibold text-[#0B3B78]">{b.title}</p>
                  <p className="text-[11px] text-[#64748B]">
                    Target: {b.targetCategory} · CTA: {b.ctaLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDeleteBanner(b.id)}
                  className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
