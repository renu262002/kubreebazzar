import { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Tag,
  Plus,
  Trash2,
  Edit3,
  Upload,
  ShieldAlert,
  Users,
  MessageSquare,
  Settings,
  Mail,
  FolderTree,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type {
  Product,
  ProductCategory,
  ModelPreset,
  Order,
  DeliveryStatus,
  AdminAnalytics,
  ProductVariant,
  User,
  ProductReview,
  NewsletterSubscriber,
  SiteSettings,
} from '../types';

const MODEL_PRESETS: ModelPreset[] = [
  'rice',
  'grocery',
  'honey',
  'watch',
];

const DELIVERY_STATUSES: DeliveryStatus[] = [
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export function AdminDashboard() {
  const {
    user,
    token,
    products,
    categories,
    coupons,
    banners,
    settings,
    refreshCatalog,
    navigate,
    showToast,
  } = useStore();

  const [tab, setTab] = useState<
    | 'analytics'
    | 'products'
    | 'categories'
    | 'orders'
    | 'customers'
    | 'reviews'
    | 'promotions'
    | 'content'
    | 'newsletter'
  >('analytics');

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [allReviews, setAllReviews] = useState<ProductReview[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [siteForm, setSiteForm] = useState<SiteSettings | null>(settings);

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catTitle, setCatTitle] = useState('');
  const [catSub, setCatSub] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catModel, setCatModel] = useState<ModelPreset>('rice');

  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState<ProductCategory>('Rice');
  const [pBrand, setPBrand] = useState('Kaveri Heritage');
  const [pPrice, setPPrice] = useState('899');
  const [pDiscount, setPDiscount] = useState('0');
  const [pShortDesc, setPShortDesc] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pImage, setPImage] = useState(
    '/src/assets/images/product_rice_basmati_1793935955754.jpg'
  );
  const [pModelType, setPModelType] = useState<ModelPreset>('rice');
  const [pGlbUrl, setPGlbUrl] = useState('');
  const [pFeatured, setPFeatured] = useState(true);
  const [pVariants, setPVariants] = useState<ProductVariant[]>([
    {
      id: 'var-1',
      name: 'Obsidian Edition',
      colorHex: '#2563EB',
      priceDelta: 0,
      stock: 15,
    },
  ]);

  // Coupon & Banner Form State
  const [cCode, setCCode] = useState('');
  const [cType, setCType] = useState<'percent' | 'fixed'>('percent');
  const [cValue, setCValue] = useState('10');
  const [cMin, setCMin] = useState('100');
  const [cDesc, setCDesc] = useState('');

  const [bTitle, setBTitle] = useState('');
  const [bSub, setBSub] = useState('');

  useEffect(() => {
    if (settings) setSiteForm(settings);
  }, [settings]);

  const loadAdminData = async () => {
    if (!token || user?.role !== 'admin') return;
    const headers = { Authorization: `Bearer ${token}` };
    const [anRes, ordRes, custRes, revRes, subRes] = await Promise.all([
      fetch('/api/admin/analytics', { headers }),
      fetch('/api/orders', { headers }),
      fetch('/api/admin/customers', { headers }),
      fetch('/api/reviews?all=true', { headers }),
      fetch('/api/admin/newsletter', { headers }),
    ]);
    if (anRes.ok) setAnalytics(await anRes.json());
    if (ordRes.ok) setOrders(await ordRes.json());
    if (custRes.ok) setCustomers(await custRes.json());
    if (revRes.ok) setAllReviews(await revRes.json());
    if (subRes.ok) setSubscribers(await subRes.json());
  };

  useEffect(() => {
    loadAdminData();
  }, [token, user?.role]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
        <h1 className="font-display text-2xl font-bold text-white">
          Administrator Access Required
        </h1>
        <p className="text-sm text-slate-400">
          Sign in with an administrator account (e.g.{' '}
          <span className="font-mono-tabular text-slate-200">
            admin@aetheria.store
          </span>
          ) to manage products, 3D GLB models, orders, and site content.
        </p>
        <button
          type="button"
          onClick={() => navigate('/auth')}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const handleFileUpload = async (file: File, target: 'image' | 'glb') => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || '');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filename: file.name, dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Upload failed');
        return;
      }
      if (target === 'image') {
        setPImage(data.url);
        showToast('Product image uploaded');
      } else {
        setPGlbUrl(data.url);
        showToast('3D GLB/GLTF model uploaded');
      }
    };
    reader.readAsDataURL(file);
  };

  const openCreateProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPCategory(categories[0]?.id || 'Rice');
    setPBrand('Kaveri Heritage');
    setPPrice('899');
    setPDiscount('0');
    setPShortDesc('');
    setPDesc('');
    setPImage('/src/assets/images/product_rice_basmati_1793935955754.jpg');
    setPModelType('rice');
    setPGlbUrl('');
    setPFeatured(true);
    setPVariants([
      {
        id: `var-${Date.now()}`,
        name: 'Standard Edition',
        colorHex: '#2563EB',
        priceDelta: 0,
        stock: 20,
      },
    ]);
    setShowProductForm(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPCategory(prod.category);
    setPBrand(prod.brand || 'Aetheria Studio');
    setPPrice(String(prod.price));
    setPDiscount(String(prod.discountPercent));
    setPShortDesc(prod.shortDescription);
    setPDesc(prod.description);
    setPImage(prod.images[0] || '');
    setPModelType(prod.modelType);
    setPGlbUrl(prod.glbUrl || '');
    setPFeatured(prod.featured);
    setPVariants(prod.variants);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: pName,
      category: pCategory,
      brand: pBrand,
      price: Number(pPrice),
      discountPercent: Number(pDiscount),
      shortDescription: pShortDesc,
      description: pDesc,
      images: [pImage],
      modelType: pModelType,
      glbUrl: pGlbUrl.trim() || undefined,
      featured: pFeatured,
      variants: pVariants,
    };

    const url = editingProduct
      ? `/api/products/${editingProduct.id}`
      : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showToast(editingProduct ? 'Product updated' : 'Product created');
      setShowProductForm(false);
      await refreshCatalog();
      await loadAdminData();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showToast('Product deleted');
      await refreshCatalog();
      await loadAdminData();
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: catName,
        title: catTitle,
        subtitle: catSub,
        description: catDesc,
        modelType: catModel,
      }),
    });
    if (res.ok) {
      setCatName('');
      setCatTitle('');
      setCatSub('');
      setCatDesc('');
      showToast('Category created');
      await refreshCatalog();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    await fetch(`/api/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await refreshCatalog();
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    deliveryStatus: DeliveryStatus
  ) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ deliveryStatus }),
    });
    if (res.ok) {
      showToast(`Order updated to ${deliveryStatus}`);
      await loadAdminData();
    }
  };

  const handleToggleReview = async (rev: ProductReview) => {
    const res = await fetch(`/api/admin/reviews/${rev.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ approved: !rev.approved }),
    });
    if (res.ok) {
      showToast(rev.approved ? 'Review hidden' : 'Review approved');
      await loadAdminData();
      await refreshCatalog();
    }
  };

  const handleDeleteReview = async (id: string) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await loadAdminData();
    await refreshCatalog();
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        code: cCode,
        type: cType,
        value: Number(cValue),
        minOrderAmount: Number(cMin),
        description: cDesc,
      }),
    });
    if (res.ok) {
      setCCode('');
      setCDesc('');
      showToast('Coupon created');
      await refreshCatalog();
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    await fetch(`/api/coupons/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await refreshCatalog();
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/banners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: bTitle,
        subtitle: bSub,
        ctaLabel: 'Explore',
      }),
    });
    if (res.ok) {
      setBTitle('');
      setBSub('');
      showToast('Promotional banner added');
      await refreshCatalog();
    }
  };

  const handleDeleteBanner = async (id: string) => {
    await fetch(`/api/banners/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await refreshCatalog();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteForm) return;
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(siteForm),
    });
    if (res.ok) {
      showToast('Site & About content saved');
      await refreshCatalog();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="flex flex-col gap-4 pb-6 border-b border-white/10">
        <div>
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">
            Operations & Merchandising
          </p>
          <h1 className="font-display text-3xl font-bold text-white">
            Admin Command Console
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0C1222] border border-white/10 overflow-x-auto">
          {(
            [
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'products', label: 'Products & 3D', icon: Package },
              { id: 'categories', label: 'Categories', icon: FolderTree },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'reviews', label: 'Reviews', icon: MessageSquare },
              { id: 'promotions', label: 'Promos & Flash Sale', icon: Tag },
              { id: 'content', label: 'Site & About', icon: Settings },
              { id: 'newsletter', label: 'Newsletter', icon: Mail },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. ANALYTICS TAB */}
      {tab === 'analytics' && analytics && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-xl bg-[#0C1222] border border-white/10 p-5">
              <p className="text-xs text-slate-400">Total Revenue</p>
              <p className="font-mono-tabular text-2xl font-bold text-white mt-2">
                ${analytics.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-[#0C1222] border border-white/10 p-5">
              <p className="text-xs text-slate-400">Total Orders</p>
              <p className="font-mono-tabular text-2xl font-bold text-white mt-2">
                {analytics.totalOrders}
              </p>
            </div>
            <div className="rounded-xl bg-[#0C1222] border border-white/10 p-5">
              <p className="text-xs text-slate-400">Customers / Subscribers</p>
              <p className="font-mono-tabular text-2xl font-bold text-white mt-2">
                {analytics.totalCustomers} / {analytics.newsletterCount}
              </p>
            </div>
            <div className="rounded-xl bg-[#0C1222] border border-white/10 p-5">
              <p className="text-xs text-slate-400">Low Stock Items (≤ 10)</p>
              <p className="font-mono-tabular text-2xl font-bold text-amber-400 mt-2">
                {analytics.lowStockCount}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#0C1222] border border-white/10 p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-white">
              Revenue by Category
            </h2>
            <div className="space-y-3">
              {analytics.revenueByCategory.map((row) => {
                const maxRev = Math.max(
                  ...analytics.revenueByCategory.map((r) => r.revenue),
                  1
                );
                const pct = Math.round((row.revenue / maxRev) * 100);
                return (
                  <div key={row.category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">
                        {row.category}
                      </span>
                      <span className="font-mono-tabular text-white">
                        ${row.revenue.toLocaleString()} ({row.orders} units)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#060913] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS & 3D MODELS TAB */}
      {tab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">
              Catalog & 3D Assets ({products.length})
            </h2>
            <button
              type="button"
              onClick={openCreateProduct}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          {showProductForm && (
            <form
              onSubmit={handleSaveProduct}
              className="rounded-xl bg-[#0C1222] border border-blue-500/40 p-6 space-y-5"
            >
              <h3 className="font-display text-lg font-semibold text-white">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={pDiscount}
                      onChange={(e) => setPDiscount(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Short Summary
                  </label>
                  <input
                    type="text"
                    value={pShortDesc}
                    onChange={(e) => setPShortDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Procedural 3D Preset
                  </label>
                  <select
                    value={pModelType}
                    onChange={(e) =>
                      setPModelType(e.target.value as ModelPreset)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                  >
                    {MODEL_PRESETS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                />
              </div>

              {/* Image & GLB Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Product Image URL or Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pImage}
                      onChange={(e) => setPImage(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                    />
                    <label className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Image</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(f, 'image');
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Custom 3D Model (.glb / .gltf) Optional
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pGlbUrl}
                      onChange={(e) => setPGlbUrl(e.target.value)}
                      placeholder="/uploads/model.glb"
                      className="flex-1 px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                    />
                    <label className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>GLB</span>
                      <input
                        type="file"
                        accept=".glb,.gltf"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(f, 'glb');
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Variants & Stock */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Variants & Inventory
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPVariants([
                        ...pVariants,
                        {
                          id: `var-${Date.now()}`,
                          name: 'New Variant',
                          colorHex: '#7C3AED',
                          priceDelta: 0,
                          stock: 10,
                        },
                      ])
                    }
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    + Add Variant
                  </button>
                </div>
                {pVariants.map((v, idx) => (
                  <div
                    key={v.id}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => {
                        const next = [...pVariants];
                        next[idx] = { ...v, name: e.target.value };
                        setPVariants(next);
                      }}
                      placeholder="Variant name"
                      className="col-span-5 px-2.5 py-1.5 rounded bg-[#060913] border border-white/10 text-xs text-white"
                    />
                    <input
                      type="color"
                      value={v.colorHex}
                      onChange={(e) => {
                        const next = [...pVariants];
                        next[idx] = { ...v, colorHex: e.target.value };
                        setPVariants(next);
                      }}
                      className="col-span-2 h-8 rounded bg-[#060913] border border-white/10"
                    />
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => {
                        const next = [...pVariants];
                        next[idx] = { ...v, stock: Number(e.target.value) };
                        setPVariants(next);
                      }}
                      placeholder="Stock"
                      className="col-span-3 px-2.5 py-1.5 rounded bg-[#060913] border border-white/10 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPVariants(pVariants.filter((_, i) => i !== idx))
                      }
                      className="col-span-2 text-xs text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={pFeatured}
                    onChange={(e) => setPFeatured(e.target.checked)}
                    className="accent-blue-600"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="px-4 py-2 rounded-lg text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
                  >
                    Save Product
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="rounded-xl bg-[#0C1222] border border-white/10 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">3D Model</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-medium text-white">
                      {prod.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {prod.category}
                    </td>
                    <td className="py-3.5 px-4 font-mono-tabular text-white">
                      ${prod.price.toLocaleString()}
                      {prod.discountPercent > 0 && (
                        <span className="text-blue-400 ml-1">
                          (-{prod.discountPercent}%)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono-tabular text-slate-300">
                      {prod.stock}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {prod.glbUrl ? 'Custom GLB' : prod.modelType}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditProduct(prod)}
                        aria-label={`Edit ${prod.name}`}
                        className="p-1.5 text-slate-400 hover:text-blue-400"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id)}
                        aria-label={`Delete ${prod.name}`}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CATEGORIES TAB */}
      {tab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleCreateCategory}
            className="lg:col-span-5 rounded-xl bg-[#0C1222] border border-white/10 p-6 space-y-4"
          >
            <h2 className="font-display text-lg font-semibold text-white">
              Add Category
            </h2>
            <input
              type="text"
              required
              placeholder="Category Name (e.g. Lighting)"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
            />
            <input
              type="text"
              required
              placeholder="Display Title (e.g. Architectural Lighting)"
              value={catTitle}
              onChange={(e) => setCatTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Subtitle (e.g. Warm OLED)"
              value={catSub}
              onChange={(e) => setCatSub(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
            />
            <select
              value={catModel}
              onChange={(e) => setCatModel(e.target.value as ModelPreset)}
              className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
            >
              {MODEL_PRESETS.map((m) => (
                <option key={m} value={m}>
                  3D Stage Preset: {m}
                </option>
              ))}
            </select>
            <textarea
              rows={2}
              placeholder="Category description..."
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-xs font-semibold text-white"
            >
              Create Category
            </button>
          </form>

          <div className="lg:col-span-7 rounded-xl bg-[#0C1222] border border-white/10 divide-y divide-white/10">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-4 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-white">{c.id}</p>
                  <p className="text-slate-400">
                    {c.title} · {c.itemCount ?? 0} products
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(c.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ORDERS TAB */}
      {tab === 'orders' && (
        <div className="rounded-xl bg-[#0C1222] border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td className="py-3.5 px-4 font-mono-tabular font-semibold text-white">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div>{ord.customerName}</div>
                    <div className="text-slate-500">{ord.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 uppercase">
                    {ord.paymentMethod} ({ord.paymentStatus})
                  </td>
                  <td className="py-3.5 px-4 font-mono-tabular text-white font-semibold">
                    ${ord.total.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      aria-label={`Status for ${ord.orderNumber}`}
                      value={ord.deliveryStatus}
                      onChange={(e) =>
                        handleUpdateOrderStatus(
                          ord.id,
                          e.target.value as DeliveryStatus
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#060913] border border-white/15 text-xs text-white"
                    >
                      {DELIVERY_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. CUSTOMERS TAB */}
      {tab === 'customers' && (
        <div className="rounded-xl bg-[#0C1222] border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Saved Addresses</th>
                <th className="py-3.5 px-4">Wishlist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="py-3.5 px-4 font-medium text-white">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{c.email}</td>
                  <td className="py-3.5 px-4 uppercase text-blue-400">
                    {c.role}
                  </td>
                  <td className="py-3.5 px-4 font-mono-tabular text-slate-300">
                    {c.addresses.length}
                  </td>
                  <td className="py-3.5 px-4 font-mono-tabular text-slate-300">
                    {c.wishlist.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. REVIEWS MODERATION TAB */}
      {tab === 'reviews' && (
        <div className="rounded-xl bg-[#0C1222] border border-white/10 divide-y divide-white/10">
          {allReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{rev.title}</span>
                  <span className="font-mono-tabular text-amber-400">
                    ({rev.rating}★)
                  </span>
                  <span
                    className={
                      rev.approved ? 'text-emerald-400' : 'text-slate-500'
                    }
                  >
                    {rev.approved ? '· Approved' : '· Hidden'}
                  </span>
                </div>
                <p className="text-slate-300">{rev.comment}</p>
                <p className="text-slate-500">By {rev.authorName}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleReview(rev)}
                  className="px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 hover:bg-white/5"
                >
                  {rev.approved ? 'Hide' : 'Approve'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteReview(rev.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. PROMOTIONS & FLASH SALE TAB */}
      {tab === 'promotions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-xl bg-[#0C1222] border border-white/10 p-6 space-y-5">
            <h2 className="font-display text-lg font-semibold text-white">
              Promotional Coupons
            </h2>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="CODE (e.g. VIP20)"
                  value={cCode}
                  onChange={(e) => setCCode(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white uppercase"
                />
                <select
                  value={cType}
                  onChange={(e) =>
                    setCType(e.target.value as 'percent' | 'fixed')
                  }
                  className="px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                >
                  <option value="percent">Percent (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="Value"
                  value={cValue}
                  onChange={(e) => setCValue(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Order ($)"
                  value={cMin}
                  onChange={(e) => setCMin(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={cDesc}
                  onChange={(e) => setCDesc(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-xs font-semibold text-white"
              >
                Create Coupon
              </button>
            </form>

            <div className="divide-y divide-white/10">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono-tabular font-bold text-white">
                      {c.code}
                    </span>
                    <span className="text-blue-400 ml-2">
                      {c.type === 'percent' ? `${c.value}%` : `$${c.value}`} off
                    </span>
                    <p className="text-slate-400">{c.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCoupon(c.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#0C1222] border border-white/10 p-6 space-y-5">
            <h2 className="font-display text-lg font-semibold text-white">
              Promotional Banners
            </h2>
            <form onSubmit={handleCreateBanner} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Banner Headline"
                value={bTitle}
                onChange={(e) => setBTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Subtitle / Offer Details"
                value={bSub}
                onChange={(e) => setBSub(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-xs font-semibold text-white"
              >
                Add Banner
              </button>
            </form>

            <div className="divide-y divide-white/10">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-white">{b.title}</p>
                    <p className="text-slate-400">{b.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteBanner(b.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. SITE, HOMEPAGE, ABOUT & CONTACT CONTENT TAB */}
      {tab === 'content' && siteForm && (
        <form
          onSubmit={handleSaveSettings}
          className="rounded-xl bg-[#0C1222] border border-white/10 p-6 space-y-6"
        >
          <h2 className="font-display text-lg font-semibold text-white">
            Editable Brand, Homepage, About & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={siteForm.brandName}
                onChange={(e) =>
                  setSiteForm({ ...siteForm, brandName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Announcement Bar Text
              </label>
              <input
                type="text"
                value={siteForm.announcementText}
                onChange={(e) =>
                  setSiteForm({ ...siteForm, announcementText: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Homepage Campaign Headline
              </label>
              <input
                type="text"
                value={siteForm.campaignHeadline}
                onChange={(e) =>
                  setSiteForm({ ...siteForm, campaignHeadline: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Flash Sale Title
              </label>
              <input
                type="text"
                value={siteForm.flashSaleTitle}
                onChange={(e) =>
                  setSiteForm({ ...siteForm, flashSaleTitle: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                About Us — Brand Overview
              </label>
              <textarea
                rows={3}
                value={siteForm.aboutOverview}
                onChange={(e) =>
                  setSiteForm({ ...siteForm, aboutOverview: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                About Us — Our Story
              </label>
              <textarea
                rows={3}
                value={siteForm.aboutStory}
                onChange={(e) =>
                  setSiteForm({ ...siteForm, aboutStory: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={siteForm.contactEmail}
                onChange={(e) =>
                  setSiteForm({ ...siteForm, contactEmail: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={siteForm.contactPhone}
                onChange={(e) =>
                  setSiteForm({ ...siteForm, contactPhone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Support Hours
              </label>
              <input
                type="text"
                value={siteForm.supportHours}
                onChange={(e) =>
                  setSiteForm({ ...siteForm, supportHours: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Studio Address
              </label>
              <input
                type="text"
                value={siteForm.contactAddress}
                onChange={(e) =>
                  setSiteForm({ ...siteForm, contactAddress: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#060913] border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
          >
            Save All Site Content
          </button>
        </form>
      )}

      {/* 9. NEWSLETTER SUBSCRIBERS TAB */}
      {tab === 'newsletter' && (
        <div className="rounded-xl bg-[#0C1222] border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Subscriber Email</th>
                <th className="py-3.5 px-4">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td className="py-3.5 px-4 font-medium text-white">
                    {s.email}
                  </td>
                  <td className="py-3.5 px-4 font-mono-tabular text-slate-400">
                    {new Date(s.subscribedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
