import { useState } from "react";
import { Scissors, CheckCircle, Loader2, Package } from "lucide-react";
import { useGetOrdersByStatus, useUpdateOrderStatus } from "@/hooks/InventoryHooks";

/**
 * Tailoring — lists orders with status IN_PRODUCTION.
 * Tailors can view details, measurements, and mark orders as ready for collection.
 */
export default function Tailoring() {
  const [updatingId, setUpdatingId] = useState(null);

  // --- Data & mutations ---
  const { data: orders = [], isLoading, isError } = useGetOrdersByStatus("IN_PRODUCTION");
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  // --- Handlers ---
  const handleMarkReady = (orderId) => {
    setUpdatingId(orderId);
    updateOrderStatus(
      { orderId, status: "READY_FOR_COLLECTION" },
      { onSettled: () => setUpdatingId(null) }
    );
  };

  // --- Render ---
  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="mb-32">
        <h1 className="text-h2 font-bold text-text-primary">Tailoring</h1>
        <p className="mt-8 text-body-normal text-text-secondary">
          Orders currently in production
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading tailoring orders...</p>
        </div>
      ) : isError ? (
        <div className="rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          Failed to load orders. Please refresh the page.
        </div>
      ) : orders.length === 0 ? (
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
      ) : (
        <div className="space-y-20">
          {orders.map((order, index) => {
            const isUpdating = updatingId === order.orderId;
            const customItems = order.orderItems.filter((item) => item.customMade);

            return (
              <div
                key={order.orderId}
                className="rounded-card bg-surface-default p-24 shadow-elevation-1 hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Order header */}
                <div className="mb-16 flex items-start justify-between">
                  <div>
                    <p className="text-ui-caption text-text-muted">Order Number</p>
                    <p className="text-body-normal font-semibold text-text-primary">
                      {order.orderNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-ui-caption text-text-muted">Customer</p>
                    <p className="text-body-normal font-medium text-text-primary">
                      {order.customerName}
                    </p>
                  </div>
                </div>

                {/* Custom items */}
                <div className="mb-16">
                  <p className="mb-10 text-ui-label font-semibold text-text-secondary">
                    Custom Items ({customItems.length})
                  </p>
                  <div className="space-y-10">
                    {customItems.map((item) => (
                      <div
                        key={item.orderItemId}
                        className="flex items-center justify-between rounded-input border border-border-default bg-surface-elevated/50 px-16 py-12"
                      >
                        <div className="flex items-center gap-12">
                          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-brand-tint">
                            <Package className="h-16 w-16 text-brand-primary" />
                          </div>
                          <div>
                            <p className="text-body-normal font-medium text-text-primary">
                              {item.type} — {item.variant}
                            </p>
                            <p className="text-body-small text-text-muted">
                              {item.color} · Size {item.size} · Qty {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-body-normal font-medium text-text-primary">
                          ${(item.unitPrice * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Measurements */}
                {customItems.some((item) => item.measurements?.length > 0) && (
                  <div className="mb-16">
                    <p className="mb-10 text-ui-label font-semibold text-text-secondary">
                      Measurements
                    </p>
                    <div className="rounded-input border border-border-default bg-surface-elevated/30 px-16 py-12">
                      {customItems.map((item) =>
                        item.measurements?.map((m) => (
                          <div
                            key={m.measurementId}
                            className="flex items-center justify-between border-b border-border-default last:border-0 py-8"
                          >
                            <span className="text-body-normal text-text-secondary">
                              {m.measurementName}
                            </span>
                            <span className="text-body-normal font-medium text-text-primary">
                              {m.measurementValue}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Order info footer */}
                <div className="flex flex-col gap-16 sm:flex-row sm:items-center sm:justify-between border-t border-border-default pt-16">
                  <div className="flex items-center gap-24">
                    <div>
                      <p className="text-ui-caption text-text-muted">Total</p>
                      <p className="text-body-normal font-semibold text-text-primary">
                        ${order.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-ui-caption text-text-muted">Balance</p>
                      <p className={`text-body-normal font-semibold ${order.balance > 0 ? "text-danger-main" : "text-success-main"}`}>
                        ${order.balance?.toLocaleString()}
                      </p>
                    </div>
                    {order.collectionDate && (
                      <div>
                        <p className="text-ui-caption text-text-muted">Collection</p>
                        <p className="text-body-normal font-medium text-text-primary">
                          {new Date(order.collectionDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleMarkReady(order.orderId)}
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed disabled:cursor-not-allowed disabled:opacity-60 press-scale transition-all duration-200"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-16 w-16 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-16 w-16" />
                        Mark Ready
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
