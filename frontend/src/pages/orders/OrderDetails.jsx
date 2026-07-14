import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, ClipboardList, User, School, Calendar, Hash, Package, Ruler } from "lucide-react";
import { useGetOrderById } from "@/hooks/InventoryHooks";
import { formatDate, formatDateTime } from "@/utils/dateUtils";
import { STATUS_COLORS } from "@/utils/statusUtils";

// ─── Component ─────────────────────────────────────────────────

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, error } = useGetOrderById(orderId);

// ─── Render ────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
        <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
        <p className="text-body-normal text-text-secondary">Loading order details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => navigate("/orders")}
          className="mb-16 flex items-center gap-8 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>
        <div className="rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main">
          {error.response?.data?.message || "Failed to load order details."}
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="animate-fade-in mx-auto max-w-7xl">
      {/* ── Header ─── */}
      <div className="mb-32">
        <button
          onClick={() => navigate("/orders")}
          className="mb-12 flex items-center gap-8 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-h2 font-bold text-text-primary">{order.orderNumber}</h1>
            <div className="mt-8 flex items-center gap-12">
              <span className={`text-xs font-medium whitespace-nowrap ${STATUS_COLORS[order.orderStatus] || "text-gray-600"}`}>
                {order.orderStatus?.replace(/_/g, " ")}
              </span>
              {order.schoolOrder && (
                <span className="inline-flex items-center gap-4 rounded-pill bg-brand-subtle px-10 py-4 text-xs font-medium text-brand-primary">
                  <School className="w-3 h-3" />
                  School Order
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Info Cards Row ─── */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 mb-24">
        {/* Customer Info Card */}
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1">
          <div className="flex items-center gap-10 mb-16">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-brand-subtle">
              <User className="h-20 w-20 text-brand-primary" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Customer</h2>
          </div>
          <div className="space-y-12">
            <InfoRow label="Name" value={order.customerName} />
            {order.customerPhone && <InfoRow label="Phone" value={order.customerPhone} />}
            {order.schoolName && <InfoRow label="School" value={order.schoolName} />}
            <InfoRow label="Collection Date" value={formatDate(order.collectionDate)} />
          </div>
        </div>

        {/* Financials Card */}
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1">
          <div className="flex items-center gap-10 mb-16">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-emerald-50">
              <ClipboardList className="h-20 w-20 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Financials</h2>
          </div>
          <div className="space-y-12">
            <InfoRow label="Total Amount" value={`$${order.totalAmount?.toLocaleString()}`} />
            <InfoRow label="Paid" value={`$${order.paidAmount?.toLocaleString()}`} />
            <div className="flex items-center justify-between py-8 border-t border-border-default">
              <span className="text-sm text-text-muted">Balance</span>
              <span className={`text-lg font-bold tabular-nums ${order.balance > 0 ? "text-danger-main" : "text-success-main"}`}>
                ${order.balance?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Order Items ─── */}
      {order.orderItems && order.orderItems.length > 0 && (
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1 mb-24">
          <div className="flex items-center gap-10 mb-16">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-amber-50">
              <Package className="h-20 w-20 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Order Items</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Type</th>
                  <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Variant</th>
                  <th className="min-w-[80px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Color</th>
                  <th className="w-20 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Size</th>
                  <th className="w-20 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Qty</th>
                  <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Unit Price</th>
                  <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Total</th>
                  <th className="w-28 px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-muted">Custom</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item) => (
                  <tr
                    key={item.orderItemId}
                    className="border-b border-border-default/50 last:border-b-0 hover:bg-surface-muted/40 transition-colors"
                  >
                    <td className="min-w-[120px] px-6 py-4 text-text-primary whitespace-nowrap">
                      {item.type}
                    </td>
                    <td className="min-w-[120px] px-6 py-4 text-text-secondary whitespace-nowrap">
                      {item.variant}
                    </td>
                    <td className="min-w-[80px] px-6 py-4 text-text-secondary whitespace-nowrap">
                      {item.color}
                    </td>
                    <td className="w-20 px-6 py-4 text-text-secondary whitespace-nowrap">
                      {item.size || "—"}
                    </td>
                    <td className="w-20 px-6 py-4 text-text-primary text-right whitespace-nowrap tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="w-28 px-6 py-4 text-text-secondary text-right whitespace-nowrap tabular-nums">
                      ${item.unitPrice?.toLocaleString()}
                    </td>
                    <td className="w-28 px-6 py-4 font-medium text-text-primary text-right whitespace-nowrap tabular-nums">
                      ${item.totalPrice?.toLocaleString()}
                    </td>
                    <td className="w-28 px-6 py-4 text-center">
                      {item.customMade ? (
                        <span className="inline-flex items-center rounded-pill bg-warning-bg px-8 py-2 text-[11px] font-medium text-warning-main">Custom</span>
                      ) : (
                        <span className="text-text-muted text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Measurements ─── */}
      {order.orderItems?.some(item => item.measurements && item.measurements.length > 0) && (
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1 mb-24">
          <div className="flex items-center gap-10 mb-16">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-purple-50">
              <Ruler className="h-20 w-20 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Measurements</h2>
          </div>

          <div className="space-y-16">
            {order.orderItems
              .filter(item => item.measurements && item.measurements.length > 0)
              .map(item => (
                <div key={item.orderItemId}>
                  <p className="text-sm font-medium text-text-primary mb-8">
                    {item.type} — {item.variant} ({item.color})
                  </p>
                  <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {item.measurements.map((m) => (
                      <div
                        key={m.measurementId}
                        className="flex flex-col items-center justify-center rounded-card border border-border-default bg-surface-elevated/50 px-8 py-10"
                      >
                        <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-2">
                          {m.measurementName}
                        </span>
                        <span className="text-sm font-bold text-text-primary tabular-nums">
                          {m.measurementValue}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Notes ─── */}
      {order.notes && (
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1 mb-24">
          <h2 className="text-lg font-semibold text-text-primary mb-12">Notes</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{order.notes}</p>
        </div>
      )}

      {/* ── Metadata ─── */}
      <div className="rounded-card bg-surface-default p-20 shadow-elevation-1">
        <div className="flex items-center gap-10 mb-16">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-slate-50">
            <Calendar className="h-20 w-20 text-slate-600" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Metadata</h2>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <InfoRow
            label="Created At"
            value={formatDateTime(order.createdAt)}
            icon={<Calendar className="w-4 h-4 text-text-muted" />}
          />
          <InfoRow
            label="Created By"
            value={order.createdBy}
            icon={<User className="w-4 h-4 text-text-muted" />}
          />
          <InfoRow
            label="Order ID"
            value={order.orderId?.slice(0, 8) + "..."}
            icon={<Hash className="w-4 h-4 text-text-muted" />}
            mono
          />
          <InfoRow
            label="Items"
            value={order.orderItems?.length || 0}
            icon={<Package className="w-4 h-4 text-text-muted" />}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Sub-Components ────────────────────────────────────────────

function InfoRow({ label, value, icon, mono }) {
  return (
    <div className="flex items-center justify-between py-8">
      <div className="flex items-center gap-8">
        {icon}
        <span className="text-sm text-text-muted">{label}</span>
      </div>
      <span className={`text-sm font-medium text-text-primary ${mono ? "font-mono" : ""}`}>
        {value || "-"}
      </span>
    </div>
  );
}
