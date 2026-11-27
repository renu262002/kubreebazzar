import { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  LogOut,
  Package,
  Shield,
  User as UserIcon,
  Heart,
  Phone,
  Mail,
  CheckCircle2,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import type { Order, SavedAddress } from '../types';
import { isAdminRole } from '../utils/adminAuth';
import { apiFetch, buildApiHeaders } from '../utils/apiClient';

type ProfileSectionTab = 'profile' | 'addresses' | 'orders' | 'wishlist';

export function ProfilePage() {
  const {
    user,
    token,
    route,
    authLoading,
    setSession,
    changePassword,
    verifyEmail,
    logout,
    navigate,
    openAuthModal,
    products,
    wishlist,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<ProfileSectionTab>('profile');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{
    type: 'ok' | 'err';
    msg: string;
  } | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [verifyNotice, setVerifyNotice] = useState<{
    type: 'ok' | 'err';
    msg: string;
  } | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<SavedAddress, 'id'>>({
    label: 'Home',
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setNewAddr((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    document.title = 'My Account | KubreeBazzar';
  }, []);

  useEffect(() => {
    const queryStr = route.includes('?')
      ? route.split('?')[1]
      : typeof window !== 'undefined'
        ? window.location.search.replace(/^\?/, '')
        : '';
    const params = new URLSearchParams(queryStr);
    const vToken = params.get('verifyToken') || '';
    if (!vToken) return;
    verifyEmail(vToken).then((res) => {
      if (res.ok) {
        setVerifyNotice({
          type: 'ok',
          msg: res.message || 'Your email address has been verified.',
        });
        showToast('Email verified successfully');
      } else {
        setVerifyNotice({
          type: 'err',
          msg: res.error || 'Could not verify email link.',
        });
      }
      if (typeof window !== 'undefined') {
        const clean = window.location.pathname || '/account';
        window.history.replaceState({}, '', clean);
      }
    });
  }, [route, verifyEmail, showToast]);

  useEffect(() => {
    if (!user || activeTab !== 'orders') return;
    setLoadingOrders(true);
    apiFetch('/api/account/orders', {
      headers: buildApiHeaders(token),
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .finally(() => setLoadingOrders(false));
  }, [user, token, activeTab]);

  if (authLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="h-48 rounded-2xl bg-white border border-[#DCE6F2] animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-center space-y-4">
        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-6 sm:p-8 space-y-4 shadow-xs">
          <UserIcon className="w-10 h-10 text-[#1D6FD8] mx-auto" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3B78]">
            Sign in to your account
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Log in or create an account to manage your profile, saved shipping
            addresses, wishlist, and order history.
          </p>
          <button
            type="button"
            onClick={() =>
              openAuthModal({
                tab: 'login',
                message: 'Please log in to view your account.',
              })
            }
            className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white cursor-pointer transition-colors"
          >
            Login / Create Account
          </button>
        </div>
      </div>
    );
  }

  const saveProfile = async (
    updatedName: string,
    updatedPhone: string,
    updatedAddresses: SavedAddress[]
  ) => {
    setSaving(true);
    try {
      const res = await apiFetch('/api/users/profile', {
        method: 'PUT',
        headers: buildApiHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          name: updatedName.trim(),
          phone: updatedPhone.trim(),
          addresses: updatedAddresses,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSession(token, data.user);
        showToast('Account details updated');
      } else {
        showToast('Unable to update profile right now');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty');
      return;
    }
    await saveProfile(name, phone, user.addresses);
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);
    if (!currentPassword || !newPassword) {
      setPasswordStatus({
        type: 'err',
        msg: 'Please enter your current and new passwords.',
      });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordStatus({
        type: 'err',
        msg: 'New password must be at least 8 characters long.',
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordStatus({
        type: 'err',
        msg: 'New passwords do not match.',
      });
      return;
    }
    setUpdatingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setUpdatingPassword(false);
    if (!res.ok) {
      setPasswordStatus({
        type: 'err',
        msg: res.error || 'Unable to change password.',
      });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordStatus({
      type: 'ok',
      msg: res.message || 'Password updated successfully.',
    });
    showToast('Password updated');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: SavedAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      isDefault: user.addresses.length === 0,
    };
    const next = [...user.addresses, created];
    await saveProfile(name || user.name, phone || user.phone || '', next);
    setShowAddForm(false);
    setNewAddr({
      label: 'Office',
      fullName: user.name,
      phone: user.phone || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    });
  };

  const handleDeleteAddress = async (id: string) => {
    const next = user.addresses.filter((a) => a.id !== id);
    await saveProfile(name || user.name, phone || user.phone || '', next);
  };

  const handleSetDefaultAddress = async (id: string) => {
    const next = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    await saveProfile(name || user.name, phone || user.phone || '', next);
  };

  const wishlistProducts = products.filter(
    (p) => p.enabled !== false && wishlist.includes(p.id)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-[#DCE6F2]">
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#FF6B1A] uppercase tracking-[0.2em] mb-1">
            My KubreeBazzar Account
          </p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B3B78] break-words">
            {user.name}
          </h1>
          <p className="text-xs text-[#64748B] mt-1 break-all flex flex-wrap items-center gap-2">
            <span>
              {user.email}
              {user.phone ? ` · ${user.phone}` : ''}
            </span>
            {user.emailVerified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                Email Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                Email Not Verified
              </span>
            )}
          </p>
          {verifyNotice && (
            <div
              className={`mt-2 rounded-lg px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1.5 ${
                verifyNotice.type === 'ok'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {verifyNotice.type === 'ok' ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{verifyNotice.msg}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isAdminRole(user) && (
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 min-h-[42px] rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => void logout()}
            className="px-4 py-2 min-h-[42px] rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-white border border-[#DCE6F2] shadow-xs">
        {[
          { id: 'profile' as const, label: 'My Profile', icon: UserIcon },
          {
            id: 'addresses' as const,
            label: `Saved Addresses (${user.addresses.length})`,
            icon: MapPin,
          },
          { id: 'orders' as const, label: 'My Orders', icon: Package },
          {
            id: 'wishlist' as const,
            label: `Wishlist (${wishlistProducts.length})`,
            icon: Heart,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                active
                  ? 'bg-[#0B3B78] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0B3B78] hover:bg-[#F0F6FF]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MY PROFILE & PASSWORD */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <form
            onSubmit={handleSaveDetailsSubmit}
            className="rounded-2xl bg-white border border-[#DCE6F2] p-5 sm:p-6 space-y-5 shadow-xs"
          >
            <div>
              <h2 className="font-display text-xl font-bold text-[#0B3B78]">
                Personal Details
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Keep your name and phone number up to date for smooth deliveries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-xs font-semibold text-[#334155] mb-1.5"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="profile-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-phone"
                  className="block text-xs font-semibold text-[#334155] mb-1.5"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="block text-xs font-semibold text-[#334155] mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="profile-email"
                  type="email"
                  readOnly
                  value={user.email}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-base sm:text-sm text-[#64748B] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] disabled:opacity-60 text-xs font-bold text-white cursor-pointer transition-colors"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>

          <form
            onSubmit={handlePasswordChangeSubmit}
            className="rounded-2xl bg-white border border-[#DCE6F2] p-5 sm:p-6 space-y-4 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#1D6FD8]" />
              <div>
                <h2 className="font-display text-lg font-bold text-[#0B3B78]">
                  Change Account Password
                </h2>
                <p className="text-xs text-[#64748B]">
                  Use at least 8 characters. Active sessions refresh securely on save.
                </p>
              </div>
            </div>

            {passwordStatus && (
              <div
                className={`rounded-xl px-3.5 py-2.5 text-xs font-medium flex items-center gap-2 ${
                  passwordStatus.type === 'ok'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {passwordStatus.type === 'ok' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{passwordStatus.msg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="profile-curr-pw"
                  className="block text-xs font-semibold text-[#334155] mb-1.5"
                >
                  Current Password *
                </label>
                <input
                  id="profile-curr-pw"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-new-pw"
                  className="block text-xs font-semibold text-[#334155] mb-1.5"
                >
                  New Password * (min. 8 chars)
                </label>
                <input
                  id="profile-new-pw"
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-confirm-pw"
                  className="block text-xs font-semibold text-[#334155] mb-1.5"
                >
                  Confirm New Password *
                </label>
                <input
                  id="profile-confirm-pw"
                  type="password"
                  required
                  minLength={8}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] text-base sm:text-sm text-[#132238] focus:outline-none focus:border-[#1D6FD8]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] disabled:opacity-60 text-xs font-bold text-white cursor-pointer transition-colors"
              >
                {updatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-[#0B3B78]">
                Saved Shipping Addresses
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Select any address quickly during checkout.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm((s) => !s)}
              className="px-4 py-2 min-h-[42px] rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Close Form' : 'Add Address'}</span>
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleAddAddress}
              className="rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] p-4 sm:p-5 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <input
                  type="text"
                  required
                  placeholder="Label (e.g. Home, Office)"
                  value={newAddr.label}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, label: e.target.value })
                  }
                  className="px-3 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-base sm:text-xs text-[#132238]"
                />
                <input
                  type="text"
                  required
                  placeholder="Recipient Name"
                  value={newAddr.fullName}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, fullName: e.target.value })
                  }
                  className="px-3 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-base sm:text-xs text-[#132238]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={newAddr.phone}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, phone: e.target.value })
                  }
                  className="px-3 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-base sm:text-xs text-[#132238]"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Street Address / Door No. / Landmark"
                value={newAddr.street}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, street: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-base sm:text-xs text-[#132238]"
              />
              <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, city: e.target.value })
                  }
                  className="px-3 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-base sm:text-xs text-[#132238]"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddr.state}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, state: e.target.value })
                  }
                  className="px-3 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-base sm:text-xs text-[#132238]"
                />
                <input
                  type="text"
                  required
                  placeholder="PIN Code"
                  value={newAddr.postalCode}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, postalCode: e.target.value })
                  }
                  className="px-3 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-base sm:text-xs text-[#132238]"
                />
                <input
                  type="text"
                  required
                  placeholder="Country"
                  value={newAddr.country}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, country: e.target.value })
                  }
                  className="px-3 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-base sm:text-xs text-[#132238]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 min-h-[42px] rounded-xl text-xs font-semibold text-[#64748B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 min-h-[42px] rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {user.addresses.length === 0 ? (
            <p className="text-xs text-[#64748B]">
              No saved addresses yet. Add one for faster checkout.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] p-4 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 text-xs min-w-0">
                    <div className="flex items-center gap-2 font-bold text-[#0B3B78]">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B1A] shrink-0" />
                      <span className="truncate">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-[#132238]">
                      {addr.fullName}
                    </p>
                    <p className="text-[#475569] break-words">{addr.street}</p>
                    <p className="text-[#475569]">
                      {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                    </p>
                    <p className="font-mono text-[#64748B]">{addr.phone}</p>
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="pt-1 text-[11px] font-bold text-[#1D6FD8] hover:text-[#FF6B1A] cursor-pointer"
                      >
                        Set as default
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    aria-label="Delete address"
                    className="text-[#64748B] hover:text-rose-700 w-10 h-10 flex items-center justify-center rounded-lg shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-[#0B3B78]">
              My Order History
            </h2>
            <button
              type="button"
              onClick={() => navigate('/account/orders')}
              className="text-xs font-bold text-[#1D6FD8] hover:text-[#FF6B1A] cursor-pointer"
            >
              Open Full Order Tracker
            </button>
          </div>

          {loadingOrders ? (
            <div className="h-32 rounded-xl bg-[#F8FAFC] animate-pulse" />
          ) : orders.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Package className="w-9 h-9 text-[#1D6FD8] mx-auto" />
              <p className="text-xs text-[#64748B]">
                You have not placed any orders yet.
              </p>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="px-4 py-2 rounded-xl bg-[#FF6B1A] text-white text-xs font-bold cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/account/orders/${encodeURIComponent(order.id)}`)}
                  className="rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] hover:border-[#1D6FD8] p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-[#0B3B78]">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs font-bold text-[#FF6B1A]">
                        {order.deliveryStatus}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')} ·{' '}
                      {order.items.length} item(s)
                    </p>
                  </div>
                  <span className="font-mono text-base font-extrabold text-[#0B3B78]">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-[#0B3B78]">
              Saved Wishlist ({wishlistProducts.length})
            </h2>
            <button
              type="button"
              onClick={() => navigate('/wishlist')}
              className="text-xs font-bold text-[#1D6FD8] hover:text-[#FF6B1A] cursor-pointer"
            >
              View Dedicated Wishlist Page
            </button>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Heart className="w-9 h-9 text-[#FF6B1A] mx-auto" />
              <p className="text-xs text-[#64748B]">
                No items saved yet. Tap the heart icon on any product to save
                it here.
              </p>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="px-4 py-2 rounded-xl bg-[#FF6B1A] text-white text-xs font-bold cursor-pointer"
              >
                Explore Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
