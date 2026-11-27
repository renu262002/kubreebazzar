import { useState, useEffect, useMemo, type FormEvent } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  Package,
} from 'lucide-react';
import type {
  CategoryInfo,
  Product,
  ProductImageAsset,
  ProductVariant,
} from '../../types';
import { MultiImageUploader } from './MultiImageUploader';
import { getStatusToneClasses } from './adminTypes';
import { apiFetch, buildApiHeaders } from '../../utils/apiClient';

interface AdminProductsViewProps {
  products: Product[];
  categories: CategoryInfo[];
  token: string;
  canDelete: boolean;
  startCreating?: boolean;
  onRefreshCatalog: () => Promise<void>;
  onNotify: (msg: string) => void;
  onExitCreateRoute?: () => void;
}

interface ProductFormState {
  id?: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  subcategory: string;
  subSubcategory: string;
  price: string;
  originalPrice: string;
  discountPercent: string;
  shortDescription: string;
  description: string;
  dimensions: string;
  material: string;
  usageInstructions: string;
  ageSuitability: string;
  stock: string;
  lowStockThreshold: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  images: string[];
  imageMetadata: ProductImageAsset[];
  variants: ProductVariant[];
}

function makeEmptyForm(defaultCategory: string): ProductFormState {
  return {
    name: '',
    sku: `KB-${Date.now().toString().slice(-6)}`,
    brand: 'KubreeBazzar',
    category: defaultCategory,
    subcategory: '',
    subSubcategory: '',
    price: '',
    originalPrice: '',
    discountPercent: '0',
    shortDescription: '',
    description: '',
    dimensions: '',
    material: '',
    usageInstructions: '',
    ageSuitability: '',
    stock: '25',
    lowStockThreshold: '10',
    status: 'published',
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: true,
    images: [],
    imageMetadata: [],
    variants: [
      {
        id: `var-${Date.now()}`,
        name: 'Standard Edition',
        colorHex: '#0B3B78',
        priceDelta: 0,
        stock: 25,
      },
    ],
  };
}

function productToForm(p: Product): ProductFormState {
  const status: 'draft' | 'published' | 'archived' =
    p.status || (p.isDraft ? 'draft' : p.enabled === false ? 'archived' : 'published');
  return {
    id: p.id,
    name: p.name,
    sku: p.sku || '',
    brand: p.brand || 'KubreeBazzar',
    category: p.category,
    subcategory: p.subcategory || '',
    subSubcategory: p.subSubcategory || '',
    price: String(p.price ?? ''),
    originalPrice: p.originalPrice !== undefined ? String(p.originalPrice) : '',
    discountPercent: String(p.discountPercent ?? 0),
    shortDescription: p.shortDescription || '',
    description: p.description || '',
    dimensions: p.dimensions || '',
    material: p.material || '',
    usageInstructions: p.usageInstructions || '',
    ageSuitability: p.ageSuitability || '',
    stock: String(p.stock ?? 0),
    lowStockThreshold: String(p.lowStockThreshold ?? 10),
    status,
    featured: Boolean(p.featured),
    trending: Boolean(p.trending),
    bestSeller: Boolean(p.bestSeller),
    newArrival: Boolean(p.newArrival),
    images: Array.isArray(p.images) ? p.images : [],
    imageMetadata: Array.isArray(p.imageMetadata) ? p.imageMetadata : [],
    variants:
      Array.isArray(p.variants) && p.variants.length > 0
        ? p.variants
        : [
            {
              id: `var-${Date.now()}`,
              name: 'Standard Edition',
              colorHex: '#0B3B78',
              priceDelta: 0,
              stock: p.stock || 0,
            },
          ],
  };
}

export function AdminProductsView({
  products,
  categories,
  token,
  canDelete,
  startCreating = false,
  onRefreshCatalog,
  onNotify,
  onExitCreateRoute,
}: AdminProductsViewProps) {
  const mainCategories = useMemo(
    () => categories.filter((c) => !c.parentCategoryId && !c.parentId),
    [categories]
  );

  const [mode, setMode] = useState<'list' | 'form'>(startCreating ? 'form' : 'list');
  const [form, setForm] = useState<ProductFormState>(() =>
    makeEmptyForm(mainCategories[0]?.id || 'Groceries')
  );
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (startCreating) {
      setForm(makeEmptyForm(mainCategories[0]?.id || 'Groceries'));
      setMode('form');
    }
  }, [startCreating, mainCategories]);

  const activeCategoryObj = useMemo(
    () => mainCategories.find((c) => c.id === form.category),
    [mainCategories, form.category]
  );

  const thirdLevelOptions = useMemo(() => {
    const child = activeCategoryObj?.hierarchyChildren?.find(
      (h) => h.name.toLowerCase() === form.subcategory.toLowerCase()
    );
    return child?.children || [];
  }, [activeCategoryObj, form.subcategory]);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      const pStatus =
        p.status || (p.isDraft ? 'draft' : p.enabled === false ? 'archived' : 'published');
      if (statusFilter !== 'all' && pStatus !== statusFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subcategory || '').toLowerCase().includes(q)
      );
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const openCreateForm = () => {
    setForm(makeEmptyForm(mainCategories[0]?.id || 'Groceries'));
    setMode('form');
  };

  const openEditForm = (product: Product) => {
    setForm(productToForm(product));
    setMode('form');
  };

  const handlePriceOrOriginalChange = (nextPrice: string, nextOrig: string) => {
    const pNum = Number(nextPrice);
    const oNum = Number(nextOrig);
    let discount = form.discountPercent;
    if (Number.isFinite(pNum) && Number.isFinite(oNum) && oNum > pNum && oNum > 0) {
      discount = String(Math.round(((oNum - pNum) / oNum) * 100));
    }
    setForm((prev) => ({
      ...prev,
      price: nextPrice,
      originalPrice: nextOrig,
      discountPercent: discount,
    }));
  };

  const addVariantRow = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: `var-${Date.now()}-${prev.variants.length}`,
          name: `Option ${prev.variants.length + 1}`,
          size: '',
          colorName: '',
          colorHex: '#1D6FD8',
          priceDelta: 0,
          stock: 10,
        },
      ],
    }));
  };

  const updateVariant = (idx: number, patch: Partial<ProductVariant>) => {
    setForm((prev) => {
      const next = prev.variants.map((v, i) => (i === idx ? { ...v, ...patch } : v));
      const totalStock = next.reduce((sum, v) => sum + Math.max(0, Number(v.stock || 0)), 0);
      return {
        ...prev,
        variants: next,
        stock: String(totalStock),
      };
    });
  };

  const removeVariant = (idx: number) => {
    setForm((prev) => {
      if (prev.variants.length <= 1) return prev;
      const next = prev.variants.filter((_, i) => i !== idx);
      const totalStock = next.reduce((sum, v) => sum + Math.max(0, Number(v.stock || 0)), 0);
      return { ...prev, variants: next, stock: String(totalStock) };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category || form.price === '') {
      onNotify('Product Name, Category, and Selling Price are required.');
      return;
    }

    setSaving(true);
    try {
      const numericPrice = Math.max(0, Number(form.price));
      const numericOrig =
        form.originalPrice !== '' ? Math.max(0, Number(form.originalPrice)) : undefined;
      const numericStock =
        form.variants.length > 0
          ? form.variants.reduce((acc, v) => acc + Math.max(0, Number(v.stock || 0)), 0)
          : Math.max(0, Number(form.stock || 0));

      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim() || undefined,
        brand: form.brand.trim() || 'KubreeBazzar',
        category: form.category,
        subcategory: form.subcategory.trim() || undefined,
        subSubcategory: form.subSubcategory.trim() || undefined,
        price: numericPrice,
        originalPrice: numericOrig,
        discountPercent: Math.max(0, Number(form.discountPercent || 0)),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        dimensions: form.dimensions.trim() || undefined,
        material: form.material.trim() || undefined,
        usageInstructions: form.usageInstructions.trim() || undefined,
        ageSuitability: form.ageSuitability.trim() || undefined,
        stock: numericStock,
        lowStockThreshold: Math.max(1, Number(form.lowStockThreshold || 10)),
        status: form.status,
        enabled: form.status === 'published',
        isDraft: form.status === 'draft',
        featured: form.featured,
        trending: form.trending,
        bestSeller: form.bestSeller,
        newArrival: form.newArrival,
        images: form.images,
        imageMetadata: form.imageMetadata,
        variants: form.variants,
      };

      const isEdit = Boolean(form.id);
      const res = await apiFetch(
        isEdit ? `/api/admin/products/${encodeURIComponent(form.id!)}` : '/api/admin/products',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: buildApiHeaders(token, true),
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onNotify(data.error || 'Could not save product.');
        return;
      }
      await onRefreshCatalog();
      onNotify(isEdit ? `Updated ${data.name}.` : `Created ${data.name}.`);
      setMode('list');
      if (onExitCreateRoute) onExitCreateRoute();
    } catch {
      onNotify('Network error while saving product.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusToggle = async (product: Product) => {
    const isCurrentlyPublished = product.enabled !== false && !product.isDraft;
    const nextStatus = isCurrentlyPublished ? 'draft' : 'published';
    try {
      const res = await apiFetch(`/api/admin/products/${encodeURIComponent(product.id)}`, {
        method: 'PATCH',
        headers: buildApiHeaders(token, true),
        body: JSON.stringify({
          status: nextStatus,
          enabled: nextStatus === 'published',
          isDraft: nextStatus === 'draft',
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        onNotify(err.error || 'Could not update product visibility.');
        return;
      }
      await onRefreshCatalog();
      onNotify(
        `${product.name} is now ${nextStatus === 'published' ? 'Published' : 'Draft (Hidden)'}.`
      );
    } catch {
      onNotify('Network error updating product visibility.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await apiFetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
        method: 'DELETE',
        headers: buildApiHeaders(token),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        onNotify(err.error || 'Delete permission denied.');
        return;
      }
      setConfirmDeleteId(null);
      await onRefreshCatalog();
      onNotify('Product permanently deleted.');
    } catch {
      onNotify('Network error deleting product.');
    }
  };

  if (mode === 'form') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setMode('list');
              if (onExitCreateRoute) onExitCreateRoute();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0B3B78] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products List</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 min-h-[42px] rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] disabled:opacity-60 text-xs font-bold text-white inline-flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : form.id ? 'Save Product Changes' : 'Create Product'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-4">
              <h3 className="font-display text-base font-bold text-[#0B3B78]">
                Core Product Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#132238] mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Aged Himalayan Basmati Rice 5kg"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="KB-10023"
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-sm font-mono text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1">
                    Main Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                        subcategory: '',
                        subSubcategory: '',
                      })
                    }
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs font-semibold text-[#132238]"
                  >
                    {mainCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title || c.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1">
                    Subcategory
                  </label>
                  <select
                    value={form.subcategory}
                    onChange={(e) =>
                      setForm({ ...form, subcategory: e.target.value, subSubcategory: '' })
                    }
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs font-semibold text-[#132238]"
                  >
                    <option value="">None / General</option>
                    {(activeCategoryObj?.subcategories || []).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1">
                    Sub-Subcategory
                  </label>
                  {thirdLevelOptions.length > 0 ? (
                    <select
                      value={form.subSubcategory}
                      onChange={(e) => setForm({ ...form, subSubcategory: e.target.value })}
                      className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs font-semibold text-[#132238]"
                    >
                      <option value="">None</option>
                      {thirdLevelOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={form.subSubcategory}
                      onChange={(e) => setForm({ ...form, subSubcategory: e.target.value })}
                      placeholder="Optional"
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs text-[#132238]"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  Short Summary
                </label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Concise 1-line description for product cards"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-sm text-[#132238]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  Full Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed specifications, features, care notes, and materials..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-sm text-[#132238]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1">
                    Dimensions / Size Notes
                  </label>
                  <input
                    type="text"
                    value={form.dimensions}
                    onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                    placeholder="e.g., 120 × 60 × 75 cm"
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs text-[#132238]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1">
                    Material / Finish
                  </label>
                  <input
                    type="text"
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                    placeholder="e.g., Solid Sheesham Wood / 100% Cotton"
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs text-[#132238]"
                  />
                </div>
              </div>
            </div>

            {/* Multi-Image Uploader */}
            <div className="rounded-xl bg-white border border-[#DCE6F2] p-5">
              <MultiImageUploader
                images={form.images}
                imageMetadata={form.imageMetadata}
                token={token}
                bucket="productImages"
                folder={form.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                onChange={(nextImages, nextMeta) =>
                  setForm((prev) => ({
                    ...prev,
                    images: nextImages,
                    imageMetadata: nextMeta,
                  }))
                }
                onNotify={onNotify}
              />
            </div>

            {/* Variants Editor */}
            <div className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0B3B78]">
                    Product Variants &amp; Stock Splits
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Configure pack weights, colors, or sizes with individual stock counts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addVariantRow}
                  className="px-3 py-1.5 rounded-lg border border-[#DCE6F2] bg-[#F8FAFC] hover:bg-[#F0F6FF] text-xs font-semibold text-[#0B3B78] cursor-pointer"
                >
                  + Add Variant
                </button>
              </div>

              <div className="space-y-2.5">
                {form.variants.map((v, idx) => (
                  <div
                    key={v.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] items-center"
                  >
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => updateVariant(idx, { name: e.target.value })}
                      placeholder="Variant Label (e.g. 5kg Pack)"
                      className="sm:col-span-4 min-h-[38px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
                    />
                    <input
                      type="text"
                      value={v.size || ''}
                      onChange={(e) => updateVariant(idx, { size: e.target.value })}
                      placeholder="Size/Wt"
                      className="sm:col-span-2 min-h-[38px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
                    />
                    <input
                      type="number"
                      value={v.priceDelta}
                      onChange={(e) => updateVariant(idx, { priceDelta: Number(e.target.value || 0) })}
                      placeholder="Price Δ"
                      className="sm:col-span-2 min-h-[38px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs font-mono-tabular"
                    />
                    <input
                      type="number"
                      min={0}
                      value={v.stock}
                      onChange={(e) => updateVariant(idx, { stock: Math.max(0, Number(e.target.value || 0)) })}
                      placeholder="Stock"
                      className="sm:col-span-2 min-h-[38px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs font-mono-tabular"
                    />
                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        type="button"
                        disabled={form.variants.length <= 1}
                        onClick={() => removeVariant(idx)}
                        className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Pricing & Publishing */}
          <div className="space-y-6">
            <div className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-4">
              <h3 className="font-display text-base font-bold text-[#0B3B78]">
                Pricing &amp; Inventory
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => handlePriceOrOriginalChange(e.target.value, form.originalPrice)}
                  placeholder="499"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[#DCE6F2] text-sm font-mono-tabular text-[#132238]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(e) => handlePriceOrOriginalChange(form.price, e.target.value)}
                    placeholder="599"
                    className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs font-mono-tabular text-[#132238]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={95}
                    value={form.discountPercent}
                    onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                    className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs font-mono-tabular text-[#132238]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1">
                    Total Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    readOnly={form.variants.length > 0}
                    className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-xs font-mono-tabular text-[#132238]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#132238] mb-1">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                    className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs font-mono-tabular text-[#132238]"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-4">
              <h3 className="font-display text-base font-bold text-[#0B3B78]">
                Publishing &amp; Visibility
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  Product Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as 'draft' | 'published' | 'archived',
                    })
                  }
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-white border border-[#DCE6F2] text-xs font-semibold text-[#132238]"
                >
                  <option value="published">Published (Live in Storefront)</option>
                  <option value="draft">Draft (Hidden from Customers)</option>
                  <option value="archived">Archived (Disabled)</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                {[
                  { key: 'featured' as const, label: 'Featured on Home & Category Showcase' },
                  { key: 'trending' as const, label: 'Trending Collection Badge' },
                  { key: 'bestSeller' as const, label: 'Best Seller Highlight' },
                  { key: 'newArrival' as const, label: 'New Arrival Highlight' },
                ].map((flag) => (
                  <label key={flag.key} className="flex items-center gap-2 text-xs text-[#475569] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[flag.key]}
                      onChange={(e) => setForm({ ...form, [flag.key]: e.target.checked })}
                      className="rounded border-[#CBD5E1]"
                    />
                    <span>{flag.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B3B78]">
            Products Catalog ({filteredProducts.length})
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Create, edit, publish/hide drafts, adjust pricing, and manage gallery photos.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="rounded-xl bg-white border border-[#DCE6F2] p-3.5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, SKU, or subcategory..."
            className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#DCE6F2] text-xs text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="min-h-[40px] px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#DCE6F2] text-xs font-semibold text-[#132238]"
        >
          <option value="All">All Categories</option>
          {mainCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title || c.id}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F1F5F9]">
          {(['all', 'published', 'draft', 'archived'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize cursor-pointer ${
                statusFilter === s
                  ? 'bg-white text-[#0B3B78] shadow-xs'
                  : 'text-[#64748B] hover:text-[#132238]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl bg-white border border-[#DCE6F2] p-10 text-center space-y-2">
          <Package className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <p className="text-sm font-semibold text-[#0B3B78]">No matching products</p>
          <p className="text-xs text-[#64748B]">
            Adjust your filters or add a new product to the catalog.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-white border border-[#DCE6F2] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EEF4FB] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B]">
                  <th className="py-2.5 px-4">Product</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Price</th>
                  <th className="py-2.5 px-4 text-right">Stock</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF4FB] text-xs">
                {filteredProducts.slice(0, 120).map((p) => {
                  const pStatus =
                    p.status || (p.isDraft ? 'draft' : p.enabled === false ? 'archived' : 'published');
                  return (
                    <tr key={p.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <img
                            src={p.images[0] || '/images/products/Rice.jpg'}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover border border-[#DCE6F2] shrink-0 bg-[#F8FAFC]"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#132238] truncate max-w-[260px]">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-[#64748B] font-mono-tabular">
                              {p.sku || p.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-[#475569] whitespace-nowrap">
                        {p.category}
                        {p.subcategory ? ` · ${p.subcategory}` : ''}
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold capitalize ${getStatusToneClasses(
                            pStatus
                          )}`}
                        >
                          {pStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono-tabular font-semibold text-[#0B3B78] whitespace-nowrap">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono-tabular whitespace-nowrap">
                        <span
                          className={
                            p.stock <= 0
                              ? 'text-rose-600 font-bold'
                              : p.stock <= (p.lowStockThreshold ?? 10)
                                ? 'text-amber-700 font-bold'
                                : 'text-[#132238]'
                          }
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditForm(p)}
                            title="Edit Product"
                            className="p-1.5 rounded-lg border border-[#DCE6F2] text-[#0B3B78] hover:bg-[#F0F6FF] cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleQuickStatusToggle(p)}
                            title={pStatus === 'published' ? 'Hide (Set Draft)' : 'Publish Live'}
                            className="p-1.5 rounded-lg border border-[#DCE6F2] text-[#475569] hover:text-[#0B3B78] cursor-pointer"
                          >
                            {pStatus === 'published' ? (
                              <Eye className="w-3.5 h-3.5" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {canDelete && (
                            confirmDeleteId === p.id ? (
                              <button
                                type="button"
                                onClick={() => void handleDeleteProduct(p.id)}
                                className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold cursor-pointer"
                              >
                                Confirm
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(p.id)}
                                title="Delete Product"
                                className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
