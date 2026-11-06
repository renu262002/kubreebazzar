import { useState } from 'react';
import { MapPin, Plus, Trash2, LogOut, Package, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { SavedAddress } from '../types';

export function ProfilePage() {
  const { user, token, setSession, logout, navigate, showToast } = useStore();

  const [name, setName] = useState(user?.name || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<SavedAddress, 'id'>>({
    label: 'Home',
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-[#1E1614]">
          Sign in to view your profile
        </h1>
        <button
          type="button"
          onClick={() => navigate('/auth')}
          className="mt-5 px-5 py-2.5 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white cursor-pointer"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const saveProfile = async (
    updatedName: string,
    updatedAddresses: SavedAddress[]
  ) => {
    const res = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: updatedName,
        addresses: updatedAddresses,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setSession(token, data.user);
      showToast('Profile updated');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: SavedAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };
    const next = [...user.addresses, created];
    await saveProfile(name || user.name, next);
    setShowAddForm(false);
    setNewAddr({
      label: 'Office',
      fullName: user.name,
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    });
  };

  const handleDeleteAddress = async (id: string) => {
    const next = user.addresses.filter((a) => a.id !== id);
    await saveProfile(name || user.name, next);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DCD0]">
        <div>
          <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
            Account &amp; Preferences
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
            {user.name}
          </h1>
          <p className="text-xs text-[#6E6059] mt-1">
            {user.email} · Role: {user.role}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="px-4 py-2 rounded-lg bg-white border border-[#E6DCD0] hover:border-[#6B1D2F] text-xs font-medium text-[#1E1614] flex items-center gap-2 cursor-pointer"
          >
            <Package className="w-4 h-4 text-[#6B1D2F]" />
            <span>Order History</span>
          </button>

          {user.role === 'admin' && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-4 py-2 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
          )}

          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-lg border border-[#D8CBB8] hover:bg-[#F3ECE1] text-xs font-medium text-[#5C4F49] flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Personal Details */}
      <div className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#1E1614]">
          Personal Information
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs text-[#5C4F49] mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614]"
            />
          </div>
          <button
            type="button"
            onClick={() => saveProfile(name, user.addresses)}
            className="px-5 py-2.5 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-xs font-semibold text-white cursor-pointer"
          >
            Save Name
          </button>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#1E1614]">
            Saved Shipping Addresses
          </h2>
          <button
            type="button"
            onClick={() => setShowAddForm((s) => !s)}
            className="px-3.5 py-2 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAddAddress}
            className="rounded-xl bg-[#FAF6F0] border border-[#E6DCD0] p-5 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="Label (e.g. Home, Office)"
                value={newAddr.label}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, label: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-white border border-[#D8CBB8] text-xs text-[#1E1614]"
              />
              <input
                type="text"
                required
                placeholder="Recipient Name"
                value={newAddr.fullName}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, fullName: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-white border border-[#D8CBB8] text-xs text-[#1E1614]"
              />
              <input
                type="tel"
                required
                placeholder="Phone"
                value={newAddr.phone}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, phone: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-white border border-[#D8CBB8] text-xs text-[#1E1614]"
              />
            </div>
            <input
              type="text"
              required
              placeholder="Street Address"
              value={newAddr.street}
              onChange={(e) =>
                setNewAddr({ ...newAddr, street: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#D8CBB8] text-xs text-[#1E1614]"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                placeholder="City"
                value={newAddr.city}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, city: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-white border border-[#D8CBB8] text-xs text-[#1E1614]"
              />
              <input
                type="text"
                placeholder="State"
                value={newAddr.state}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, state: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-white border border-[#D8CBB8] text-xs text-[#1E1614]"
              />
              <input
                type="text"
                required
                placeholder="PIN / Postal Code"
                value={newAddr.postalCode}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, postalCode: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-white border border-[#D8CBB8] text-xs text-[#1E1614]"
              />
              <input
                type="text"
                required
                placeholder="Country"
                value={newAddr.country}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, country: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-white border border-[#D8CBB8] text-xs text-[#1E1614]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-lg text-xs text-[#6E6059] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white cursor-pointer"
              >
                Save Address
              </button>
            </div>
          </form>
        )}

        {user.addresses.length === 0 ? (
          <p className="text-xs text-[#6E6059]">
            No saved addresses yet. Add one for faster checkout.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className="rounded-xl bg-[#FAF6F0] border border-[#E6DCD0] p-4 flex items-start justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-[#1E1614]">
                    <MapPin className="w-3.5 h-3.5 text-[#6B1D2F]" />
                    <span>{addr.label}</span>
                  </div>
                  <p className="text-[#3D332E]">{addr.fullName}</p>
                  <p className="text-[#5C4F49]">{addr.street}</p>
                  <p className="text-[#5C4F49]">
                    {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                  </p>
                  <p className="font-mono text-[#786B65]">{addr.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAddress(addr.id)}
                  aria-label="Delete address"
                  className="text-[#8C7E77] hover:text-rose-700 p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
