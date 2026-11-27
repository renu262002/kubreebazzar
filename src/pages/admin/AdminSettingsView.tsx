import { useState, useEffect, type FormEvent } from 'react';
import { Save, Server, RefreshCw, KeyRound } from 'lucide-react';
import type { SiteSettings, SystemInfrastructureStatus } from '../../types';
import { apiFetch, buildApiHeaders } from '../../utils/apiClient';

interface AdminSettingsViewProps {
  settings: SiteSettings | null;
  token: string;
  onRefreshCatalog: () => Promise<void>;
  onNotify: (msg: string) => void;
}

export function AdminSettingsView({
  settings,
  token,
  onRefreshCatalog,
  onNotify,
}: AdminSettingsViewProps) {
  const [brandName, setBrandName] = useState(settings?.brandName || 'KubreeBazzar');
  const [brandTagline, setBrandTagline] = useState(settings?.brandTagline || '');
  const [announcementText, setAnnouncementText] = useState(settings?.announcementText || '');
  const [contactEmail, setContactEmail] = useState(settings?.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(settings?.contactPhone || '');
  const [contactAddress, setContactAddress] = useState(settings?.contactAddress || '');
  const [supportHours, setSupportHours] = useState(settings?.supportHours || '');
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const [sysCheck, setSysCheck] = useState<
    (SystemInfrastructureStatus & {
      connectivity?: {
        connected: boolean;
        storageReady: boolean;
        databaseName?: string;
        gridfsImagesCount?: number;
        error?: string;
      };
    }) | null
  >(null);
  const [checkingSys, setCheckingSys] = useState(false);

  useEffect(() => {
    if (settings) {
      setBrandName(settings.brandName);
      setBrandTagline(settings.brandTagline);
      setAnnouncementText(settings.announcementText);
      setContactEmail(settings.contactEmail);
      setContactPhone(settings.contactPhone);
      setContactAddress(settings.contactAddress);
      setSupportHours(settings.supportHours);
    }
  }, [settings]);

  const runSystemCheck = async () => {
    setCheckingSys(true);
    try {
      const res = await apiFetch('/api/admin/system-check', {
        headers: buildApiHeaders(token),
      });
      if (res.ok) setSysCheck(await res.json());
    } finally {
      setCheckingSys(false);
    }
  };

  useEffect(() => {
    void runSystemCheck();
  }, [token]);

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch('/api/admin/settings', {
        method: 'PUT',
        headers: buildApiHeaders(token, true),
        body: JSON.stringify({
          brandName: brandName.trim(),
          brandTagline: brandTagline.trim(),
          announcementText: announcementText.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim(),
          contactAddress: contactAddress.trim(),
          supportHours: supportHours.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        onNotify(err.error || 'Could not update settings.');
        return;
      }
      await onRefreshCatalog();
      onNotify('Storefront configuration saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeAdminPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      onNotify('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      onNotify('New password and confirmation do not match.');
      return;
    }
    setChangingPassword(true);
    try {
      const res = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        headers: buildApiHeaders(token, true),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onNotify(data.error || 'Could not update password.');
        return;
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      onNotify(data.message || 'Admin password updated.');
    } catch {
      onNotify('Network error while updating password.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B3B78]">
          Store Settings &amp; Infrastructure Health
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Configure customer-facing storefront metadata and verify MongoDB Atlas (kubreebazzar) &amp; GridFS connectivity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleSaveSettings}
            className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-4"
          >
            <h3 className="font-display text-base font-bold text-[#0B3B78]">
              Storefront Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">Tagline</label>
                <input
                  type="text"
                  value={brandTagline}
                  onChange={(e) => setBrandTagline(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#132238] mb-1">
                Top Announcement Strip
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">Support Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">Support Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  Business Address
                </label>
                <input
                  type="text"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  Support Hours
                </label>
                <input
                  type="text"
                  value={supportHours}
                  onChange={(e) => setSupportHours(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="min-h-[42px] px-5 py-2.5 rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </form>

          {/* Change Admin Password */}
          <form
            onSubmit={handleChangeAdminPassword}
            className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-4"
          >
            <h3 className="font-display text-base font-bold text-[#0B3B78] inline-flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#1D6FD8]" />
              <span>Change Admin Account Password</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  New Password (8+ chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#132238] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={changingPassword}
              className="min-h-[40px] px-4 py-2 rounded-xl border border-[#0B3B78] text-xs font-bold text-[#0B3B78] hover:bg-[#F0F6FF] disabled:opacity-60 cursor-pointer"
            >
              {changingPassword ? 'Updating...' : 'Update Admin Password'}
            </button>
          </form>
        </div>

        {/* Live Connectivity Inspector */}
        <div className="lg:col-span-5 rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-4 h-fit">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-base font-bold text-[#0B3B78] inline-flex items-center gap-1.5">
              <Server className="w-4 h-4 text-[#1D6FD8]" />
              <span>MongoDB Atlas &amp; GridFS Check</span>
            </h3>
            <button
              type="button"
              onClick={() => void runSystemCheck()}
              disabled={checkingSys}
              className="px-3 py-1.5 rounded-lg border border-[#DCE6F2] text-xs font-semibold text-[#0B3B78] inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{checkingSys ? 'Checking...' : 'Verify'}</span>
            </button>
          </div>

          {sysCheck && (
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#EEF4FB]">
                <span className="text-[#64748B]">Database Engine</span>
                <span className="font-mono font-semibold text-[#0B3B78]">
                  {sysCheck.activeDatabaseMode} ({sysCheck.databaseName || 'kubreebazzar'})
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EEF4FB]">
                <span className="text-[#64748B]">Image Storage</span>
                <span className="font-mono font-semibold text-[#0B3B78]">
                  {sysCheck.activeStorageMode}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EEF4FB]">
                <span className="text-[#64748B]">MongoDB Atlas Connection</span>
                <span
                  className={`font-semibold ${
                    sysCheck.connectivity?.connected ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {sysCheck.connectivity?.connected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EEF4FB]">
                <span className="text-[#64748B]">GridFS Buckets Ready</span>
                <span
                  className={`font-semibold ${
                    sysCheck.connectivity?.storageReady ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {sysCheck.connectivity?.storageReady
                    ? `All 3 Verified (${sysCheck.connectivity?.gridfsImagesCount ?? 0} files)`
                    : `${sysCheck.buckets?.products || 'productImages'}, ${sysCheck.buckets?.categories || 'categoryImages'}, ${sysCheck.buckets?.assets || 'websiteImages'}`}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EEF4FB]">
                <span className="text-[#64748B]">Email Delivery Service</span>
                <span
                  className={`font-semibold ${
                    sysCheck.emailServiceConfigured ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {sysCheck.emailServiceConfigured ? 'Configured' : 'Not Configured'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EEF4FB]">
                <span className="text-[#64748B]">Razorpay Mode</span>
                <span className="font-semibold text-[#0B3B78]">
                  {sysCheck.razorpayLiveConfigured ? 'Live Credentials' : 'Sandbox Test Mode'}
                </span>
              </div>

              {sysCheck.connectivity?.error && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900">
                  {sysCheck.connectivity.error}
                </div>
              )}

              {sysCheck.missingEnvVars.length > 0 && (
                <div className="space-y-1 pt-1">
                  <p className="text-[11px] font-semibold text-[#475569]">
                    Unset Vercel / Production Env Vars:
                  </p>
                  <p className="font-mono text-[11px] text-[#64748B] leading-relaxed">
                    {sysCheck.missingEnvVars.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
