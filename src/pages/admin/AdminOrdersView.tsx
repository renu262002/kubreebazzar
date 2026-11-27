import { useState, useMemo, type FormEvent } from 'react';
import { Truck, Search, ClipboardList, CheckCircle2 } from 'lucide-react';
import type { DeliveryStatus, Order } from '../../types';
import { ORDER_STATUS_LIST, getStatusToneClasses } from './adminTypes';
import { apiFetch, buildApiHeaders } from '../../utils/apiClient';

interface AdminOrdersViewProps {
  orders: Order[];
  token: string;
  canManageOrders: boolean;
  onOrderUpdated: (updated: Order) => void;
  onNotify: (msg: string) => void;
}

export function AdminOrdersView({
  orders,
  token,
  canManageOrders,
  onOrderUpdated,
  onNotify,
}: AdminOrdersViewProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | DeliveryStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orders[0]?.id || null
  );

  // Tracking form state mapped to selected order
  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || orders[0] || null,
    [orders, selectedOrderId]
  );

  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(
    selectedOrder?.deliveryStatus || 'Pending'
  );
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'failed'>(
    selectedOrder?.paymentStatus || 'pending'
  );
  const [courierName, setCourierName] = useState(selectedOrder?.courierName || '');
  const [trackingNumber, setTrackingNumber] = useState(selectedOrder?.trackingNumber || '');
  const [dispatchDate, setDispatchDate] = useState(selectedOrder?.dispatchDate || '');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(
    selectedOrder?.estimatedDeliveryDate || ''
  );
  const [shippingStatus, setShippingStatus] = useState(selectedOrder?.shippingStatus || '');
  const [trackingNotes, setTrackingNotes] = useState(selectedOrder?.trackingNotes || '');
  const [timelineNote, setTimelineNote] = useState('');
  const [saving, setSaving] = useState(false);

  const selectOrder = (ord: Order) => {
    setSelectedOrderId(ord.id);
    setDeliveryStatus(ord.deliveryStatus);
    setPaymentStatus(ord.paymentStatus);
    setCourierName(ord.courierName || '');
    setTrackingNumber(ord.trackingNumber || '');
    setDispatchDate(ord.dispatchDate || '');
    setEstimatedDeliveryDate(ord.estimatedDeliveryDate || '');
    setShippingStatus(ord.shippingStatus || ord.deliveryStatus);
    setTrackingNotes(ord.trackingNotes || '');
    setTimelineNote('');
  };

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== 'All' && o.deliveryStatus !== statusFilter) return false;
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.trackingNumber || '').toLowerCase().includes(q)
      );
    });
  }, [orders, statusFilter, searchTerm]);

  const handleUpdateOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !canManageOrders) return;
    setSaving(true);
    try {
      const res = await apiFetch(`/api/admin/orders/${encodeURIComponent(selectedOrder.id)}/status`, {
        method: 'PATCH',
        headers: buildApiHeaders(token, true),
        body: JSON.stringify({
          deliveryStatus,
          paymentStatus,
          courierName,
          trackingNumber,
          dispatchDate,
          estimatedDeliveryDate,
          shippingStatus,
          trackingNotes,
          note: timelineNote.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onNotify(data.error || 'Could not update order.');
        return;
      }
      onOrderUpdated(data);
      setTimelineNote('');
      onNotify(`Updated ${data.orderNumber} (${data.deliveryStatus}).`);
    } catch {
      onNotify('Network error updating order.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B3B78]">
          Orders &amp; Courier Tracking ({orders.length})
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Manage all 9 fulfillment stages, payment status, courier partner details, and tracking notes.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white border border-[#DCE6F2] p-3.5 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order #, customer name, email, or tracking number..."
            className="w-full min-h-[40px] pl-9 pr-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#DCE6F2] text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['All', ...ORDER_STATUS_LIST] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0B3B78] text-white border-[#0B3B78]'
                  : 'bg-[#F8FAFC] text-[#475569] border-[#DCE6F2] hover:bg-[#F0F6FF]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-xl bg-white border border-[#DCE6F2] p-12 text-center space-y-2">
          <ClipboardList className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <p className="text-sm font-semibold text-[#0B3B78]">No matching orders</p>
          <p className="text-xs text-[#64748B]">
            Customer orders placed at checkout will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-6 rounded-xl bg-white border border-[#DCE6F2] overflow-hidden h-fit">
            <div className="divide-y divide-[#EEF4FB] max-h-[680px] overflow-y-auto">
              {filteredOrders.map((ord) => {
                const active = selectedOrder?.id === ord.id;
                return (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => selectOrder(ord)}
                    className={`w-full text-left px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      active ? 'bg-[#F0F6FF]' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-tabular text-xs font-bold text-[#0B3B78]">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${getStatusToneClasses(
                            ord.deliveryStatus
                          )}`}
                        >
                          {ord.deliveryStatus}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#132238] mt-1 truncate">
                        {ord.customerName} · {ord.items.length} item{ord.items.length === 1 ? '' : 's'}
                      </p>
                      <p className="text-[11px] text-[#64748B]">
                        {new Date(ord.createdAt).toLocaleString('en-IN')}
                        {ord.trackingNumber ? ` · Tracking ${ord.trackingNumber}` : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono-tabular text-sm font-bold text-[#0B3B78]">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-[#64748B] uppercase">
                        {ord.paymentMethod} · {ord.paymentStatus}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Detail & Courier Tracking Editor */}
          {selectedOrder && (
            <div className="lg:col-span-6 space-y-5">
              <div className="rounded-xl bg-white border border-[#DCE6F2] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EEF4FB]">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0B3B78]">
                      Order {selectedOrder.orderNumber}
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      {selectedOrder.customerName} ({selectedOrder.customerEmail})
                    </p>
                  </div>
                  <span className="font-mono-tabular text-lg font-bold text-[#0B3B78]">
                    ₹{selectedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Shipping Address */}
                <div className="rounded-lg bg-[#F8FAFC] border border-[#DCE6F2] p-3 text-xs space-y-1">
                  <p className="font-bold text-[#0B3B78]">Delivery Address</p>
                  <p className="text-[#132238]">
                    {selectedOrder.shippingAddress.fullName} · {selectedOrder.shippingAddress.phone}
                  </p>
                  <p className="text-[#475569]">
                    {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city},{' '}
                    {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-[#0B3B78]">Order Items</p>
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 text-xs py-1.5 border-b border-[#EEF4FB] last:border-b-0"
                    >
                      <span className="text-[#132238]">
                        {item.name} ({item.variantName}) × {item.quantity}
                      </span>
                      <span className="font-mono-tabular font-semibold text-[#0B3B78]">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Update Workflow & Tracking Form */}
                <form onSubmit={handleUpdateOrder} className="space-y-3 pt-2 border-t border-[#EEF4FB]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B3B78]">
                    <Truck className="w-4 h-4 text-[#1D6FD8]" />
                    <span>Fulfillment Stage &amp; Courier Tracking</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                        Order Status
                      </label>
                      <select
                        disabled={!canManageOrders}
                        value={deliveryStatus}
                        onChange={(e) => setDeliveryStatus(e.target.value as DeliveryStatus)}
                        className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs font-semibold"
                      >
                        {ORDER_STATUS_LIST.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                        Payment Status
                      </label>
                      <select
                        disabled={!canManageOrders}
                        value={paymentStatus}
                        onChange={(e) =>
                          setPaymentStatus(e.target.value as 'pending' | 'paid' | 'failed')
                        }
                        className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs font-semibold"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                        Courier Partner Name
                      </label>
                      <input
                        type="text"
                        disabled={!canManageOrders}
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        placeholder="e.g., BlueDart / Delhivery"
                        className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                        AWB / Tracking Number
                      </label>
                      <input
                        type="text"
                        disabled={!canManageOrders}
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g., BD-88291042"
                        className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                        Dispatch Date
                      </label>
                      <input
                        type="date"
                        disabled={!canManageOrders}
                        value={dispatchDate}
                        onChange={(e) => setDispatchDate(e.target.value)}
                        className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                        Estimated Delivery Date
                      </label>
                      <input
                        type="date"
                        disabled={!canManageOrders}
                        value={estimatedDeliveryDate}
                        onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                        className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                      Tracking Update Note (Visible to Customer)
                    </label>
                    <input
                      type="text"
                      disabled={!canManageOrders}
                      value={trackingNotes}
                      onChange={(e) => setTrackingNotes(e.target.value)}
                      placeholder="Dispatched from Chennai hub via air express"
                      className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                      Timeline Event Note (Optional)
                    </label>
                    <input
                      type="text"
                      disabled={!canManageOrders}
                      value={timelineNote}
                      onChange={(e) => setTimelineNote(e.target.value)}
                      placeholder="Custom status timeline message..."
                      className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-xs"
                    />
                  </div>

                  {canManageOrders && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] disabled:opacity-60 text-xs font-bold text-white inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{saving ? 'Updating Order...' : 'Save Order Status & Tracking'}</span>
                    </button>
                  )}
                </form>

                {/* Status Timeline */}
                {selectedOrder.timeline?.length > 0 && (
                  <div className="pt-3 border-t border-[#EEF4FB] space-y-2">
                    <p className="text-xs font-bold text-[#0B3B78]">Timeline History</p>
                    <div className="space-y-1.5">
                      {selectedOrder.timeline.map((ev, i) => (
                        <div key={i} className="text-[11px] text-[#475569] flex justify-between gap-2">
                          <span>
                            <strong className="text-[#0B3B78]">{ev.status}</strong> — {ev.note}
                          </span>
                          <span className="font-mono-tabular text-[#94A3B8] shrink-0">
                            {new Date(ev.timestamp).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
