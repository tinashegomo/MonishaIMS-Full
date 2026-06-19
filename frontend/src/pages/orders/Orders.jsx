import { useState, useRef, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Loader2, ClipboardList, Eye, MoreVertical } from "lucide-react";
import { useGetAllOrders, useUpdateOrderStatus } from "@/hooks/InventoryHooks";

const STATUS_TRANSITIONS = {
  PENDING: [
    { status: "READY_FOR_COLLECTION", label: "Ready for Collection" },
    { status: "CANCELLED", label: "Cancel Order" },
  ],
  IN_PRODUCTION: [
    { status: "READY_FOR_COLLECTION", label: "Ready for Collection" },
    { status: "CANCELLED", label: "Cancel Order" },
  ],
  READY_FOR_COLLECTION: [
    { status: "COMPLETED", label: "Mark Collected" },
    { status: "CANCELLED", label: "Cancel Order" },
  ],
  COMPLETED: [],
  CANCELLED: [],
};

const STATUS_COLORS = {
  PENDING: "text-gray-600",
  IN_PRODUCTION: "text-amber-600",
  READY_FOR_COLLECTION: "text-blue-600",
  COMPLETED: "text-emerald-600",
  CANCELLED: "text-red-600",
};

export default function Orders() {
  const navigate = useNavigate();
  const { data: orders, isLoading, isError, error } = useGetAllOrders();
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const btnRefs = useRef({});

  const handleOpenMenu = (orderId) => {
    if (openMenu === orderId) {
      setOpenMenu(null);
      return;
    }
    const btn = btnRefs.current[orderId];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.right - 224 }); // matches w-56
    }
    setOpenMenu(orderId);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus({ orderId, status: newStatus });
    setOpenMenu(null);
  };

  return (
    <div className="animate-fade-in mx-auto max-w-7xl">
      {/* Page header */}
      <div className="mb-32 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Orders</h1>
          <p className="mt-8 text-body-normal text-text-secondary">
            Manage customer orders
          </p>
        </div>
        <Link
          to="/orders/create-order"
          className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200"
        >
          <Plus className="h-16 w-16" />
          Create Order
        </Link>
      </div>

      {/* Error */}
      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {error.response?.data?.message || "Failed to load orders. Please try again."}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading orders...</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && orders && orders.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <div className="mb-16 flex h-64 w-64 items-center justify-center rounded-full bg-brand-tint">
            <ClipboardList className="h-32 w-32 text-brand-primary" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">No orders yet</h3>
          <p className="mt-8 max-w-xs text-body-normal text-text-muted">
            Get started by creating your first order.
          </p>
        </div>
      )}

      {/* Orders table */}
      {!isLoading && orders && orders.length > 0 && (
        <div className="w-full rounded-card bg-surface-default overflow-visible">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Order #</th>
                <th className="min-w-[160px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Customer</th>
                <th className="min-w-[140px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Status</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Total</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Paid</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Balance</th>
                <th className="w-36 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">Date</th>
                <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">Created By</th>
                <th className="w-20 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const transitions = STATUS_TRANSITIONS[order.orderStatus] || [];
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
                    <td className={`min-w-[140px] px-6 py-4 text-xs font-medium whitespace-nowrap ${STATUS_COLORS[order.orderStatus] || "text-gray-600"}`}>
                      {order.orderStatus?.replace(/_/g, " ")}
                    </td>
                    <td className="w-28 px-6 py-4 text-text-primary text-right whitespace-nowrap tabular-nums">
                      ${order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="w-28 px-6 py-4 text-text-secondary text-right whitespace-nowrap tabular-nums">
                      ${order.paidAmount?.toLocaleString()}
                    </td>
                    <td className={`w-28 px-6 py-4 text-right whitespace-nowrap tabular-nums font-medium ${order.balance > 0 ? "text-danger-main" : "text-success-main"}`}>
                      ${order.balance?.toLocaleString()}
                    </td>
                    <td className="w-36 px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="min-w-[120px] px-6 py-4 text-xs text-text-muted whitespace-nowrap truncate" title={order.createdBy || ""}>
                      {order.createdBy || "-"}
                    </td>
                    <td className="w-20 px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => navigate(`/orders/${order.orderId}`)}
                          className="rounded-full p-5 text-text-muted hover:bg-brand-subtle hover:text-brand-primary transition-all duration-200 press-scale"
                          aria-label={`View ${order.orderNumber}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          ref={(el) => { btnRefs.current[order.orderId] = el; }}
                          onClick={() => handleOpenMenu(order.orderId)}
                          className="rounded-full p-5 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-all duration-200 press-scale"
                          aria-label="Actions"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Dropdown rendered via portal-style fixed positioning */}
      {openMenu && (
        <div
          ref={menuRef}
          className="fixed z-[9999] w-56 whitespace-nowrap rounded-input border border-border-default bg-surface-default py-4 shadow-elevation-2 animate-fade-in"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {(() => {
            const transitions = STATUS_TRANSITIONS[orders?.find(o => o.orderId === openMenu)?.orderStatus] || [];
            if (transitions.length === 0) {
              return <p className="px-16 py-8 text-body-small leading-none text-text-muted">No actions available</p>;
            }
            return transitions.map((t, i) => (
              <Fragment key={t.status}>
                {t.status === "CANCELLED" && i > 0 && (
                  <div className="my-2 border-t border-border-default" />
                )}
                <button
                  onClick={() => handleStatusChange(openMenu, t.status)}
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
  );
}