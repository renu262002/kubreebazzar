import { useState, useEffect, type FormEvent } from 'react';
import { ShieldCheck, UserPlus } from 'lucide-react';
import type { AdminActivityLog, AdminRoleKey, User } from '../../types';
import { ADMIN_ROLE_DESCRIPTIONS, ADMIN_ROLE_LABELS, normalizeAdminRole } from '../../utils/adminAuth';
import { apiFetch, buildApiHeaders } from '../../utils/apiClient';

interface AdminUsersViewProps {
  token: string;
  currentUserId: string;
  onNotify: (msg: string) => void;
}

const ROLE_KEYS: AdminRoleKey[] = [
  'super_admin',
  'product_manager',
  'order_manager',
  'viewer',
];

export function AdminUsersView({
  token,
  currentUserId,
  onNotify,
}: AdminUsersViewProps) {
  const [staff, setStaff] = useState<User[]>([]);
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminRole, setAdminRole] = useState<AdminRoleKey>('product_manager');
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [uRes, lRes] = await Promise.all([
        apiFetch('/api/admin/users', { headers: buildApiHeaders(token) }),
        apiFetch('/api/admin/activity-logs', { headers: buildApiHeaders(token) }),
      ]);
      if (uRes.ok) setStaff(await uRes.json());
      if (lRes.ok) setLogs(await lRes.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [token]);

  const handleCreateStaff = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 8) {
      onNotify('Enter name, valid email, and password (minimum 8 characters).');
      return;
    }
    setCreating(true);
    try {
      const res = await apiFetch('/api/admin/users', {
        method: 'POST',
        headers: buildApiHeaders(token, true),
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, adminRole }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onNotify(data.error || 'Could not create staff user.');
        return;
      }
      setName('');
      setEmail('');
      setPassword('');
      await loadData();
      onNotify(`Assigned ${ADMIN_ROLE_LABELS[adminRole]} role to ${data.email}.`);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateRole = async (
    targetId: string,
    patch: { adminRole?: AdminRoleKey; isActive?: boolean }
  ) => {
    const res = await apiFetch(`/api/admin/users/${encodeURIComponent(targetId)}/role`, {
      method: 'PATCH',
      headers: buildApiHeaders(token, true),
      body: JSON.stringify(patch),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      onNotify(data.error || 'Could not update role.');
      return;
    }
    await loadData();
    onNotify(`Updated access for ${data.email}.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B3B78]">
          Admin Users, RBAC Roles &amp; Audit Trail
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Manage least-privilege access across Super Admin, Product Manager, Order Manager, and Viewer roles.
        </p>
      </div>

      {/* Role Reference Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ROLE_KEYS.map((rk) => (
          <div key={rk} className="rounded-xl bg-white border border-[#DCE6F2] p-3.5 space-y-1">
            <p className="text-xs font-bold text-[#0B3B78]">{ADMIN_ROLE_LABELS[rk]}</p>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              {ADMIN_ROLE_DESCRIPTIONS[rk]}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Add Staff Form */}
        <form
          onSubmit={handleCreateStaff}
          className="lg:col-span-4 rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-3.5 h-fit"
        >
          <h3 className="font-display text-base font-bold text-[#0B3B78] inline-flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-[#1D6FD8]" />
            <span>Add / Promote Admin User</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#132238] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#132238] mb-1">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#132238] mb-1">
              Initial Password (min 8 chars)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#132238] mb-1">Assigned Role</label>
            <select
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value as AdminRoleKey)}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#DCE6F2] text-xs font-semibold"
            >
              {ROLE_KEYS.map((rk) => (
                <option key={rk} value={rk}>
                  {ADMIN_ROLE_LABELS[rk]}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] text-xs font-bold text-white cursor-pointer"
          >
            {creating ? 'Assigning Role...' : 'Create Staff Account'}
          </button>
        </form>

        {/* Staff Table & Audit Logs */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl bg-white border border-[#DCE6F2] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#EEF4FB] bg-[#F8FAFC]">
              <h3 className="font-display text-sm font-bold text-[#0B3B78] inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1D6FD8]" />
                <span>Authorized Staff Accounts ({staff.length})</span>
              </h3>
            </div>
            {loading ? (
              <div className="p-6 text-xs text-[#64748B]">Loading staff roster...</div>
            ) : (
              <div className="divide-y divide-[#EEF4FB]">
                {staff.map((u) => {
                  const roleKey = normalizeAdminRole(u) || 'viewer';
                  const active = u.isActive !== false;
                  return (
                    <div
                      key={u.id}
                      className="px-4 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#132238]">
                          {u.name} {u.id === currentUserId ? '(You)' : ''}
                        </p>
                        <p className="text-[11px] text-[#64748B]">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={roleKey}
                          onChange={(e) =>
                            void handleUpdateRole(u.id, {
                              adminRole: e.target.value as AdminRoleKey,
                            })
                          }
                          className="min-h-[36px] px-2.5 py-1 rounded-lg border border-[#DCE6F2] text-xs font-semibold"
                        >
                          {ROLE_KEYS.map((rk) => (
                            <option key={rk} value={rk}>
                              {ADMIN_ROLE_LABELS[rk]}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => void handleUpdateRole(u.id, { isActive: !active })}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                            active
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-rose-200 bg-rose-50 text-rose-700'
                          }`}
                        >
                          {active ? 'Active' : 'Suspended'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white border border-[#DCE6F2] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#EEF4FB] bg-[#F8FAFC]">
              <h3 className="font-display text-sm font-bold text-[#0B3B78]">
                Admin Activity Log ({logs.length})
              </h3>
            </div>
            <div className="divide-y divide-[#EEF4FB] max-h-72 overflow-y-auto text-xs">
              {logs.length === 0 ? (
                <div className="p-6 text-[#64748B]">No admin audit entries recorded yet.</div>
              ) : (
                logs.slice(0, 60).map((log) => (
                  <div key={log.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-mono text-[#0B3B78] font-semibold">{log.action}</span>
                      <span className="text-[#64748B] ml-2">
                        by {log.actorEmail} ({log.actorRole}) · {log.resourceType} #{log.resourceId}
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[11px] text-[#94A3B8] shrink-0">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
