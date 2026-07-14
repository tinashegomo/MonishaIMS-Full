import { useState, useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Scissors, Eye, MoreVertical, Loader2 } from "lucide-react";
import { useGetOrdersByStatus, useUpdateOrderStatus } from "@/hooks/InventoryHooks";
import { STATUS_TRANSITIONS } from "@/utils/statusUtils";
import { formatDate } from "@/utils/dateUtils";

export default function Tailoring() {
  const navigate = useNavigate();
  const { data: orders = [], isLoading, isError } = useGetOrdersByStatus("IN_PRODUCTION");
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();
  const [openMenu, setOpenMenu] = useState(null);

  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders]);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus({ orderId, status: newStatus });
    setOpenMenu(null);
  };

  return (
    <div className="animate-fade-in mx-auto max-w-7xl">

      {/* ── Page Header ─── */}
      <div className="mb-32 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Tailoring</h1>
          <p className="mt-8 text-body-normal text-text-secondary">
            Orders currently in production
          </p>
        </div>
      </div>

      {/* ── Error Banner ─── */}
      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          Failed to load orders. Please refresh the page.
        </div>
      )}

      {/* ── Loading State ─── */}
      {isLoading && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading tailoring orders...</p>
        </div>
      )}

      {/* ── Empty State ─── */}
      {!isLoading && !isError && sortedOrders.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <div className="mb-16 flex h-64 w-64 items-center justify-center rounded-full bg-brand-tint">
            <Scissors className="h-32 w-32 text-brand-primary" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">
            No orders in production
          </h3>
          <p className="mt-8 max-w-xs text-body-normal text-text-muted">
            Custom orders will appear here when created.
          </p>
        </div>
      )}

      {/* ── Tailoring Orders Table ─── */}
      {!isLoading && sortedOrders.length > 0 && (
        <div className="w-full rounded-card bg-surface-default">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Order #</th>
                <th className="min-w-[160px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Customer</th>
                <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Items</th>
                <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Measurements</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Total</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Balance</th>
                <th className="w-36 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">Date</th>
                <th className="w-20 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, index) => {
                const customItems = order.orderItems.filter((item) => item.customMade);
                const hasMeasurements = customItems.some((item) => item.measurements?.length > 0);

                return (
                  <tr
                    key={order.orderId}
                    className="border-b border-border-default/50 last:border-b-0 hover:bg-surface-muted/40 transition-colors duration-150"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="min-w-[120px] px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                      {order.orderNumber}
                    </td>
                    <td className="min-w-[160px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                      {order.customerName}
                    </td>
                    <td className="min-w-[120px] px-6 py-4 text-text-secondary whitespace-nowrap">
                      {customItems.length} custom
                    </td>
                    <td className="min-w-[120px] px-6 py-4 text-text-secondary whitespace-nowrap">
                      {hasMeasurements ? (
                        <span className="text-success-main font-medium">Yes</span>
                      ) : (
                        <span className="text-text-muted">None</span>
                      )}
                    </td>
                    <td className="w-28 px-6 py-4 text-text-primary text-right whitespace-nowrap tabular-nums">
                      ${order.totalAmount?.toLocaleString()}
                    </td>
                    <td className={`w-28 px-6 py-4 text-right whitespace-nowrap tabular-nums font-medium ${order.balance > 0 ? "text-danger-main" : "text-success-main"}`}>
                      ${order.balance?.toLocaleString()}
                    </td>
                    <td className="w-36 px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="w-20 px-6 py-4 text-right whitespace-nowrap">
                      <div
                        className="relative flex items-center justify-end gap-4"
                        tabIndex={-1}
                        onBlur={(e) => {
                          if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
                            setOpenMenu(null);
                          }
                        }}
                      >
                        <button
                          onClick={() => navigate(`/orders/${order.orderId}`)}
                          className="rounded-full p-5 text-text-muted hover:bg-brand-subtle hover:text-brand-primary transition-all duration-200 press-scale"
                          aria-label={`View ${order.orderNumber}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setOpenMenu(openMenu === order.orderId ? null : order.orderId)}
                          className="rounded-full p-5 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-all duration-200 press-scale"
                          aria-label="Actions"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Dropdown — absolute inside the relative container */}
                        {openMenu === order.orderId && (
                          <div className="absolute right-0 top-full mt-2 z-10 w-56 whitespace-nowrap rounded-input border border-border-default bg-surface-default py-4 shadow-elevation-2 animate-scale-in">
                            {(() => {
                              const transitions = STATUS_TRANSITIONS[order.orderStatus] || [];
                              if (transitions.length === 0) {
                                return <p className="px-16 py-8 text-body-small leading-none text-text-muted">No actions available</p>;
                              }
                              return transitions.map((t, i) => (
                                <Fragment key={t.status}>
                                  {t.status === "CANCELLED" && i > 0 && (
                                    <div className="my-2 border-t border-border-default" />
                                  )}
                                  <button
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleStatusChange(order.orderId, t.status);
                                    }}
                                    className={`flex w-full items-center gap-8 px-16 py-8 text-left text-body-small leading-none transition-colors ${
                                      t.status === "CANCELLED"
                                        ? "text-danger-main hover:bg-danger-bg"
                                        : "text-text-primary hover:bg-surface-muted"
                                    }`}
                                  >
                                    {t.label}
                                  </button>
                                </Fragment>
                              ));
                            })()}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
