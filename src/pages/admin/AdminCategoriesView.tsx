import { useState, useMemo, type FormEvent } from 'react';
import { FolderTree, Plus, Save, Trash2, Upload } from 'lucide-react';
import type { CategoryInfo } from '../../types';
import { COLLECTION_REGISTRIES, getStatusToneClasses } from './adminTypes';
import { optimizeImageForUpload } from '../../utils/imageOptimize';
import { apiFetch, buildApiHeaders } from '../../utils/apiClient';

interface AdminCategoriesViewProps {
  categories: CategoryInfo[];
  token: string;
  onRefreshCatalog: () => Promise<void>;
  onNotify: (msg: string) => void;
}

export function AdminCategoriesView({
  categories,
  token,
  onRefreshCatalog,
  onNotify,
}: AdminCategoriesViewProps) {
  const [activeTab, setActiveTab] = useState<'departments' | 'collections'>('departments');

  // Department CRUD form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [catId, setCatId] = useState('');
  const [title, setTitle] = useState('');
  const [parentId, setParentId] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/products/Rice.jpg');
  const [bannerUrl, setBannerUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [subcategoriesText, setSubcategoriesText] = useState('');
  const [savingDept, setSavingDept] = useState(false);

  // Collections Registry Manager
  const [selectedRegistryKey, setSelectedRegistryKey] = useState<string>(COLLECTION_REGISTRIES[0].key);
  const [collectionItems, setCollectionItems] = useState<
    Array<{
      id: string;
      name: string;
      description?: string;
      image: string;
      imageStatus?: string;
      status: string;
      parentGroup?: string;
    }>
  >([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState('');

  const mainCategories = useMemo(
    () => categories.filter((c) => !c.parentCategoryId && !c.parentId),
    [categories]
  );

  const loadForEdit = (cat: CategoryInfo) => {
    setEditingId(cat.id);
    setCatId(cat.id);
    setTitle(cat.title);
    setParentId(cat.parentCategoryId || cat.parentId || '');
    setSubtitle(cat.subtitle || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setBannerUrl(cat.bannerUrl || '');
    setDisplayOrder(String(cat.displayOrder ?? 1));
    setStatus(cat.status === 'inactive' ? 'inactive' : 'active');
    setSubcategoriesText((cat.subcategories || []).join(', '));
  };

  const resetDeptForm = () => {
    setEditingId(null);
    setCatId('');
    setTitle('');
    setParentId('');
    setSubtitle('');
    setDescription('');
    setImage('/images/products/Rice.jpg');
    setBannerUrl('');
    setDisplayOrder(String(categories.length + 1));
    setStatus('active');
    setSubcategoriesText('');
  };

  const handleUploadCategoryImage = async (file: File, target: 'thumbnail' | 'banner') => {
    try {
      const opt = await optimizeImageForUpload(file, { compress: true, maxDimension: 1400 });
      const res = await apiFetch('/api/admin/images', {
        method: 'POST',
        headers: buildApiHeaders(token, true),
        body: JSON.stringify({
          filename: opt.filename,
          dataUrl: opt.dataUrl,
          bucket: 'categoryImages',
          folder: 'categories',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onNotify(data.error || 'Upload failed.');
        return;
      }
      if (target === 'thumbnail') setImage(data.url);
      else setBannerUrl(data.url);
      onNotify(`Uploaded category ${target}.`);
    } catch {
      onNotify('Network error uploading category image.');
    }
  };

  const handleSaveDepartment = async (e: FormEvent) => {
    e.preventDefault();
    if (!catId.trim() || !title.trim()) {
      onNotify('Category ID and Title are required.');
      return;
    }
    setSavingDept(true);
    try {
      const subs = subcategoriesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        id: catId.trim(),
        name: catId.trim(),
        title: title.trim(),
        parentCategoryId: parentId || null,
        subtitle: subtitle.trim(),
        description: description.trim(),
        image: image.trim(),
        bannerUrl: bannerUrl.trim() || undefined,
        displayOrder: Number(displayOrder || 1),
        status,
        subcategories: subs,
      };
      const res = await apiFetch(
        editingId ? `/api/admin/categories/${encodeURIComponent(editingId)}` : '/api/admin/categories',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: buildApiHeaders(token, true),
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onNotify(data.error || 'Could not save category.');
        return;
      }
      await onRefreshCatalog();
      onNotify(editingId ? `Updated ${title}.` : `Added category ${title}.`);
      resetDeptForm();
    } catch {
      onNotify('Network error saving category.');
    } finally {
      setSavingDept(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      const res = await apiFetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: buildApiHeaders(token),
      });
      if (!res.ok) {
        onNotify('Could not delete category.');
        return;
      }
      await onRefreshCatalog();
      onNotify(`Removed category ${id}.`);
      if (editingId === id) resetDeptForm();
    } catch {
      onNotify('Network error deleting category.');
    }
  };

  const fetchCollectionRegistry = async (regKey: string) => {
    setSelectedRegistryKey(regKey);
    const meta = COLLECTION_REGISTRIES.find((r) => r.key === regKey);
    if (!meta) return;
    setLoadingCollections(true);
    try {
      const publicUrl = meta.endpoint.replace('/api/admin/', '/api/');
      const res = await apiFetch(publicUrl);
      if (res.ok) {
        const data = await res.json();
        setCollectionItems(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoadingCollections(false);
    }
  };

  const updateCollectionRow = async (
    colId: string,
    patch: { status?: string; image?: string; description?: string }
  ) => {
    const meta = COLLECTION_REGISTRIES.find((r) => r.key === selectedRegistryKey);
    if (!meta) return;
    const res = await apiFetch(`${meta.endpoint}/${encodeURIComponent(colId)}`, {
      method: 'PUT',
      headers: buildApiHeaders(token, true),
      body: JSON.stringify(patch),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      onNotify(data.error || 'Failed to update collection item.');
      return;
    }
    setCollectionItems((prev) => prev.map((item) => (item.id === colId ? data : item)));
    await onRefreshCatalog();
    onNotify(`Updated collection "${data.name}".`);
  };

  const uploadCollectionImage = async (colId: string, file: File) => {
    const opt = await optimizeImageForUpload(file, { compress: true, maxDimension: 1400 });
    const uploadRes = await apiFetch('/api/admin/images', {
      method: 'POST',
      headers: buildApiHeaders(token, true),
      body: JSON.stringify({
        filename: opt.filename,
        dataUrl: opt.dataUrl,
        bucket: 'categoryImages',
        folder: `collections/${selectedRegistryKey}`,
      }),
    });
    const uploaded = await uploadRes.json().catch(() => ({}));
    if (!uploadRes.ok) {
      onNotify(uploaded.error || 'Upload failed.');
      return;
    }
    await updateCollectionRow(colId, { image: uploaded.url, status: 'approved' });
  };

  const visibleCollections = useMemo(() => {
    const q = collectionFilter.trim().toLowerCase();
    return collectionItems.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.parentGroup || '').toLowerCase().includes(q)
    );
  }, [collectionItems, collectionFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B3B78]">
            Categories &amp; Collection Hierarchy
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage the 20 main departments, nested subcategories, banners, and collection approvals.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F1F5F9]">
          <button
            type="button"
            onClick={() => setActiveTab('departments')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'departments'
                ? 'bg-white text-[#0B3B78] shadow-xs'
                : 'text-[#64748B] hover:text-[#132238]'
            }`}
          >
            Main &amp; Subcategories ({categories.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('collections');
              if (collectionItems.length === 0) {
                void fetchCollectionRegistry(selectedRegistryKey);
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'collections'
                ? 'bg-white text-[#0B3B78] shadow-xs'
                : 'text-[#64748B] hover:text-[#132238]'
            }`}
          >
            Collection Registries (16)
          </button>
        </div>
      </div>

      {activeTab === 'departments' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Category Form */}
          <form
            onSubmit={handleSaveDepartment}
            className="lg:col-span-5 rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-4 h-fit"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-[#0B3B78]">
                {editingId ? `Edit: ${editingId}` : 'Add Category / Subcategory'}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={resetDeptForm}
                  className="text-xs font-semibold text-[#1D6FD8] hover:underline cursor-pointer"
                >
                  + Create New Instead
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  Category ID *
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingId)}
                  value={catId}
                  onChange={(e) => setCatId(e.target.value)}
                  placeholder="e.g., Organic Honey"
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white border border-[#DCE6F2] text-xs disabled:bg-[#F8FAFC]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  Parent Category
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white border border-[#DCE6F2] text-xs"
                >
                  <option value="">None (Main Top-Level)</option>
                  {mainCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title || c.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#132238] mb-1">
                Display Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white border border-[#DCE6F2] text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#132238] mb-1">
                Subcategories (comma-separated)
              </label>
              <input
                type="text"
                value={subcategoriesText}
                onChange={(e) => setSubcategoriesText(e.target.value)}
                placeholder="Rice, Spices, Oils, Pulses"
                className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white border border-[#DCE6F2] text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white border border-[#DCE6F2] text-xs font-mono-tabular"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-white border border-[#DCE6F2] text-xs"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#132238]">
                Thumbnail Image URL / Upload
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-1 min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
                />
                <label className="px-3 py-2 rounded-lg border border-[#DCE6F2] bg-[#F8FAFC] hover:bg-[#F0F6FF] text-xs font-semibold text-[#0B3B78] cursor-pointer inline-flex items-center gap-1 whitespace-nowrap">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleUploadCategoryImage(f, 'thumbnail');
                    }}
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingDept}
              className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] text-xs font-bold text-white inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{savingDept ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}</span>
            </button>
          </form>

          {/* Category Tree List */}
          <div className="lg:col-span-7 rounded-xl bg-white border border-[#DCE6F2] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#EEF4FB] bg-[#F8FAFC] flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B3B78] inline-flex items-center gap-1.5">
                <FolderTree className="w-4 h-4" />
                <span>Department Hierarchy ({categories.length})</span>
              </span>
            </div>
            <div className="divide-y divide-[#EEF4FB] max-h-[640px] overflow-y-auto">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#F8FAFC]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={cat.image || '/images/products/Rice.jpg'}
                      alt={cat.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-[#DCE6F2] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0B3B78] truncate">
                          {cat.title}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${getStatusToneClasses(
                            cat.status || 'active'
                          )}`}
                        >
                          {cat.status || 'active'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate">
                        {cat.parentCategoryId ? `Child of ${cat.parentCategoryId}` : 'Main Category'} ·{' '}
                        {(cat.subcategories || []).length} subcategories · Order #{cat.displayOrder ?? 1}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => loadForEdit(cat)}
                      className="px-3 py-1.5 rounded-lg border border-[#DCE6F2] text-xs font-semibold text-[#0B3B78] hover:bg-[#F0F6FF] cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteDepartment(cat.id)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-white border border-[#DCE6F2] p-4 flex flex-col sm:flex-row gap-3">
            <select
              value={selectedRegistryKey}
              onChange={(e) => void fetchCollectionRegistry(e.target.value)}
              className="min-h-[40px] px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#DCE6F2] text-xs font-semibold text-[#0B3B78]"
            >
              {COLLECTION_REGISTRIES.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={collectionFilter}
              onChange={(e) => setCollectionFilter(e.target.value)}
              placeholder="Filter collections by name or group..."
              className="flex-1 min-h-[40px] px-3.5 py-2 rounded-lg bg-[#F8FAFC] border border-[#DCE6F2] text-xs"
            />
          </div>

          {loadingCollections ? (
            <div className="h-48 rounded-xl bg-white border border-[#DCE6F2] animate-pulse" />
          ) : (
            <div className="rounded-xl bg-white border border-[#DCE6F2] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#EEF4FB] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B]">
                      <th className="py-2.5 px-4">Collection</th>
                      <th className="py-2.5 px-4">Group</th>
                      <th className="py-2.5 px-4">Image Status</th>
                      <th className="py-2.5 px-4">Approval</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF4FB] text-xs">
                    {visibleCollections.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2.5">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-9 h-9 rounded-lg object-cover border border-[#DCE6F2]"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-700">
                                None
                              </div>
                            )}
                            <span className="font-semibold text-[#132238]">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-[#64748B]">{item.parentGroup || 'General'}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${getStatusToneClasses(
                              item.image ? item.imageStatus || 'generated' : 'quota_pending'
                            )}`}
                          >
                            {item.image ? item.imageStatus || 'ready' : 'quota_pending'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${getStatusToneClasses(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <label className="px-2.5 py-1 rounded-lg border border-[#DCE6F2] text-[11px] font-semibold text-[#0B3B78] hover:bg-[#F0F6FF] cursor-pointer">
                              Upload Image
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) void uploadCollectionImage(item.id, f);
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                void updateCollectionRow(item.id, {
                                  status:
                                    item.status === 'approved' ? 'pending_approval' : 'approved',
                                })
                              }
                              className="px-2.5 py-1 rounded-lg border border-[#DCE6F2] text-[11px] font-semibold text-[#475569] hover:text-[#0B3B78] cursor-pointer"
                            >
                              {item.status === 'approved' ? 'Mark Pending' : 'Approve'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
