import { useState, useEffect, useMemo } from 'react';
import {
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Trash2,
  Copy,
  Database,
} from 'lucide-react';
import type { GridFSImageRecord, MediaAuditSummary } from '../../types';
import { formatByteSize, optimizeImageForUpload } from '../../utils/imageOptimize';
import { apiFetch, buildApiHeaders } from '../../utils/apiClient';

interface AdminImagesViewProps {
  token: string;
  onRefreshCatalog: () => Promise<void>;
  onNotify: (msg: string) => void;
}

export function AdminImagesView({
  token,
  onRefreshCatalog,
  onNotify,
}: AdminImagesViewProps) {
  const [audit, setAudit] = useState<MediaAuditSummary | null>(null);
  const [gridfsImages, setGridfsImages] = useState<GridFSImageRecord[]>([]);
  const [gridfsStorageMode, setGridfsStorageMode] = useState<string>('local-dev-disk');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'missing' | 'broken' | 'gridfs'>('missing');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [targetBucket, setTargetBucket] = useState<
    'productImages' | 'categoryImages' | 'websiteImages'
  >('websiteImages');
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAudit = async () => {
    setLoading(true);
    try {
      const headers = buildApiHeaders(token);
      const [auditRes, listRes] = await Promise.all([
        apiFetch('/api/admin/media/audit', { headers }).catch(() => null),
        apiFetch('/api/admin/images', { headers }).catch(() => null),
      ]);
      if (auditRes?.ok) {
        setAudit(await auditRes.json());
      }
      if (listRes?.ok) {
        const listData = await listRes.json();
        setGridfsStorageMode(listData.storageMode || 'local-dev-disk');
        setGridfsImages(Array.isArray(listData.images) ? listData.images : []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAudit();
  }, [token]);

  const handleStandaloneUpload = async (file: File) => {
    setUploadingId('standalone');
    try {
      const opt = await optimizeImageForUpload(file, { compress: true, maxDimension: 1800 });
      const res = await apiFetch('/api/admin/images', {
        method: 'POST',
        headers: buildApiHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          filename: opt.filename,
          dataUrl: opt.dataUrl,
          bucket: targetBucket,
          folder: targetBucket === 'websiteImages' ? 'banners' : 'uploads',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onNotify(data.error || 'Upload failed.');
        return;
      }
      setLastUploadedUrl(data.url);
      onNotify(`Uploaded (${formatByteSize(data.sizeBytes)}) via ${data.storageMode}.`);
      await loadAudit();
    } catch {
      onNotify('Network error uploading asset.');
    } finally {
      setUploadingId(null);
    }
  };

  const handleFixCollectionImage = async (
    category: string,
    collectionId: string,
    file: File
  ) => {
    setUploadingId(collectionId);
    try {
      const opt = await optimizeImageForUpload(file, { compress: true, maxDimension: 1400 });
      const uploadRes = await apiFetch('/api/admin/images', {
        method: 'POST',
        headers: buildApiHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          filename: opt.filename,
          dataUrl: opt.dataUrl,
          bucket: 'categoryImages',
          refType: 'collection',
          refId: collectionId,
          imageType: 'thumbnail',
          folder: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        }),
      });
      const uploaded = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) {
        onNotify(uploaded.error || 'Image upload failed.');
        return;
      }

      const assignRes = await apiFetch('/api/admin/collections/assign-image', {
        method: 'PATCH',
        headers: buildApiHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          category,
          collectionId,
          imageUrl: uploaded.url,
        }),
      });
      if (!assignRes.ok) {
        const err = await assignRes.json().catch(() => ({}));
        onNotify(err.error || 'Could not assign uploaded image.');
        return;
      }
      await Promise.all([loadAudit(), onRefreshCatalog()]);
      onNotify(`Assigned permanent image to ${category} collection.`);
    } catch {
      onNotify('Network error fixing collection image.');
    } finally {
      setUploadingId(null);
    }
  };

  const handleDeleteGridFSImage = async (imageId: string) => {
    setDeletingId(imageId);
    try {
      const res = await apiFetch(`/api/admin/images/${encodeURIComponent(imageId)}`, {
        method: 'DELETE',
        headers: buildApiHeaders(token),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onNotify(data.error || 'Could not delete GridFS image.');
        return;
      }
      onNotify('Image deleted from MongoDB GridFS.');
      await loadAudit();
    } catch {
      onNotify('Network error deleting GridFS image.');
    } finally {
      setDeletingId(null);
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const item of audit?.collectionsWithMissingImages || []) set.add(item.category);
    return ['All', ...Array.from(set)];
  }, [audit]);

  const filteredMissingCollections = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return (audit?.collectionsWithMissingImages || []).filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.groupName.toLowerCase().includes(q)
      );
    });
  }, [audit, categoryFilter, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B3B78]">
            Image Manager &amp; MongoDB GridFS Audit
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Upload binary images to MongoDB GridFS buckets, inspect broken product references, and fill pending collection thumbnails.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadAudit()}
          className="px-4 py-2 min-h-[40px] rounded-xl border border-[#DCE6F2] bg-white hover:bg-[#F0F6FF] text-xs font-bold text-[#0B3B78] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-run Media Audit</span>
        </button>
      </div>

      {/* Audit Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-[#DCE6F2] p-4 space-y-1">
          <p className="text-xs text-[#64748B]">Public Disk Images</p>
          <p className="font-mono-tabular text-2xl font-bold text-emerald-700">
            {audit?.publicImagesCount ?? '—'}
          </p>
          <p className="text-[11px] text-[#64748B]">
            +{audit?.srcAssetsCount ?? 0} bundled · {audit?.uploadsCount ?? 0} disk uploads
          </p>
        </div>
        <div className="rounded-xl bg-white border border-[#DCE6F2] p-4 space-y-1">
          <p className="text-xs text-[#64748B]">Missing Collection Images</p>
          <p className="font-mono-tabular text-2xl font-bold text-amber-700">
            {audit?.collectionsWithMissingImages?.length ?? '—'}
          </p>
          <p className="text-[11px] text-[#64748B]">Pending collection thumbnails</p>
        </div>
        <div className="rounded-xl bg-white border border-[#DCE6F2] p-4 space-y-1">
          <p className="text-xs text-[#64748B]">Broken Product Image Refs</p>
          <p className="font-mono-tabular text-2xl font-bold text-[#0B3B78]">
            {audit?.brokenProductRefs?.length ?? '—'}
          </p>
          <p className="text-[11px] text-[#64748B]">Verified on disk / GridFS URL</p>
        </div>
        <div className="rounded-xl bg-white border border-[#DCE6F2] p-4 space-y-1">
          <p className="text-xs text-[#64748B]">MongoDB GridFS Storage</p>
          <p className="text-sm font-bold text-[#0B3B78]">
            {audit?.storageBucketsConfigured ? 'MongoDB GridFS Connected' : 'Local Dev Disk Mode'}
          </p>
          <p className="text-[11px] text-[#64748B]">
            {audit?.gridfsImagesCount ?? gridfsImages.length} binary files stored in GridFS
          </p>
        </div>
      </div>

      {/* Standalone Asset Uploader */}
      <div className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-bold text-[#0B3B78]">
              Upload Website / Banner / Category Asset
            </h3>
            <p className="text-xs text-[#64748B]">
              Routes validated files (magic-byte verified JPG/PNG/WebP/GLB) into the selected MongoDB GridFS bucket.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={targetBucket}
              onChange={(e) =>
                setTargetBucket(
                  e.target.value as 'productImages' | 'categoryImages' | 'websiteImages'
                )
              }
              className="min-h-[40px] px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#DCE6F2] text-xs font-semibold text-[#132238]"
            >
              <option value="websiteImages">websiteImages (GridFS)</option>
              <option value="categoryImages">categoryImages (GridFS)</option>
              <option value="productImages">productImages (GridFS)</option>
            </select>
            <label className="px-4 py-2 min-h-[40px] rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{uploadingId === 'standalone' ? 'Uploading...' : 'Select File'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,.glb,.gltf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleStandaloneUpload(f);
                }}
              />
            </label>
          </div>
        </div>
        {lastUploadedUrl && (
          <div className="rounded-lg bg-[#F0F6FF] border border-[#DCE6F2] px-3.5 py-2 text-xs text-[#0B3B78] flex items-center justify-between gap-2">
            <span className="font-mono truncate">{lastUploadedUrl}</span>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(lastUploadedUrl);
                onNotify('Copied asset URL to clipboard.');
              }}
              className="font-bold text-[#1D6FD8] hover:underline shrink-0 cursor-pointer"
            >
              Copy URL
            </button>
          </div>
        )}
      </div>

      {/* Missing / Broken / GridFS Queue */}
      <div className="rounded-xl bg-white border border-[#DCE6F2] overflow-hidden">
        <div className="p-4 border-b border-[#EEF4FB] flex flex-col md:flex-row gap-3">
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#F1F5F9]">
            <button
              type="button"
              onClick={() => setStatusFilter('missing')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                statusFilter === 'missing' ? 'bg-white text-[#0B3B78] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Missing Collections ({audit?.collectionsWithMissingImages?.length ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('broken')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                statusFilter === 'broken' ? 'bg-white text-[#0B3B78] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Broken Product Refs ({audit?.brokenProductRefs?.length ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('gridfs')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                statusFilter === 'gridfs' ? 'bg-white text-[#0B3B78] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              GridFS Stored Images ({gridfsImages.length})
            </button>
          </div>

          {statusFilter === 'missing' && (
            <>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#DCE6F2] text-xs font-semibold"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search collection or group..."
                className="flex-1 min-h-[38px] px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#DCE6F2] text-xs"
              />
            </>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#64748B]">Scanning catalog imagery...</div>
        ) : statusFilter === 'gridfs' ? (
          gridfsImages.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <Database className="w-8 h-8 text-[#1D6FD8] mx-auto" />
              <p className="text-sm font-semibold text-[#0B3B78]">
                {gridfsStorageMode === 'mongodb-gridfs'
                  ? 'No GridFS files indexed yet'
                  : 'MongoDB GridFS not connected in this environment'}
              </p>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                {gridfsStorageMode === 'mongodb-gridfs'
                  ? 'Upload images above or run the migration script to populate GridFS.'
                  : 'Set MONGODB_URI and run scripts/migrate-to-mongodb.ts to inspect binary GridFS records here.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EEF4FB] max-h-[540px] overflow-y-auto">
              {gridfsImages.map((img) => {
                const displayUrl = img.url || `/api/images/${img.gridfsFileId}`;
                return (
                  <div
                    key={img.gridfsFileId || img.id}
                    className="px-4 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 hover:bg-[#F8FAFC]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={displayUrl}
                        alt={img.filename}
                        className="w-11 h-11 rounded-lg object-cover border border-[#DCE6F2] shrink-0 bg-[#F1F5F9]"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#132238] truncate">
                          {img.filename}
                        </p>
                        <p className="text-[11px] text-[#64748B] truncate font-mono">
                          {img.bucket} · {img.mimeType} · {formatByteSize(img.sizeBytes)} · ID: {img.gridfsFileId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          void navigator.clipboard?.writeText(displayUrl);
                          onNotify('Copied /api/images URL.');
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-[#DCE6F2] text-[11px] font-semibold text-[#0B3B78] hover:bg-[#F0F6FF] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === img.gridfsFileId}
                        onClick={() => void handleDeleteGridFSImage(img.gridfsFileId)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
                        title="Delete unreferenced GridFS image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : statusFilter === 'broken' ? (
          (audit?.brokenProductRefs?.length || 0) === 0 ? (
            <div className="p-10 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-semibold text-[#0B3B78]">0 Broken Product Images</p>
              <p className="text-xs text-[#64748B]">All published product images resolve to valid files.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#EEF4FB] max-h-[540px] overflow-y-auto">
              {(audit?.brokenProductRefs || []).map((refStr, idx) => (
                <div key={idx} className="px-4 py-3 text-xs font-mono text-rose-700">
                  {refStr}
                </div>
              ))}
            </div>
          )
        ) : filteredMissingCollections.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-semibold text-[#0B3B78]">No missing collections match your filter</p>
          </div>
        ) : (
          <div className="divide-y divide-[#EEF4FB] max-h-[540px] overflow-y-auto">
            {filteredMissingCollections.slice(0, 150).map((item) => (
              <div
                key={`${item.category}-${item.id}`}
                className="px-4 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 hover:bg-[#F8FAFC]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#132238] truncate">{item.name}</p>
                    <p className="text-[11px] text-[#64748B] truncate">
                      {item.category} · {item.groupName} · {item.imageStatus}
                    </p>
                  </div>
                </div>

                <label className="px-3 py-1.5 rounded-lg bg-[#0B3B78] hover:bg-[#1D6FD8] text-[11px] font-bold text-white cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{uploadingId === item.id ? 'Uploading...' : 'Upload & Assign'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleFixCollectionImage(item.category, item.id, f);
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
