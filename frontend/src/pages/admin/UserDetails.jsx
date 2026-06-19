import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, User, Mail, Phone, Shield, Calendar, Package, Warehouse } from "lucide-react";
import { useGetUserActivity } from "@/hooks/InventoryHooks";

const ROLE_COLORS = {
  ADMIN: "bg-purple-50 text-purple-600",
  MANAGER: "bg-blue-50 text-blue-600",
  USER: "bg-gray-100 text-gray-600",
};

const STATUS_COLORS = {
  PENDING: "bg-gray-100 text-gray-600",
  IN_PRODUCTION: "bg-amber-50 text-amber-600",
  READY_FOR_COLLECTION: "bg-blue-50 text-blue-600",
  COMPLETED: "bg-emerald-50 text-emerald-600",
  CANCELLED: "bg-red-50 text-red-600",
};

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: activity, isLoading, isError, error } = useGetUserActivity(userId);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="animate-fade-in">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center">
          <p className="text-body-normal text-danger-main">
            {error.response?.data?.message || "Failed to load user details."}
          </p>
          <button onClick={() => navigate("/admin/users")} className="mt-16 text-brand-primary text-body-normal font-medium hover:underline">
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const user = activity?.user;
  const initials = user?.userName
    ? user.userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="animate-fade-in mx-auto max-w-4xl">
      <button
        onClick={() => navigate("/admin/users")}
        className="mb-24 inline-flex items-center gap-8 text-body-small font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-16 w-16" />
        Back to Users
      </button>

      {/* User Info Card */}
      <div className="rounded-card bg-surface-default p-24 md:p-32 shadow-elevation-1 mb-24">
        <div className="flex flex-col items-center gap-16 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary text-neutral-0 shadow-elevation-2">
            <span className="text-2xl font-bold">{initials}</span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-h4 font-semibold text-text-primary">{user?.userName || "Unknown"}</p>
            <span className={`mt-8 inline-block rounded-full px-8 py-3 text-[11px] font-medium ${ROLE_COLORS[user?.userRole] || "bg-gray-100 text-gray-600"}`}>
              {user?.userRole}
            </span>
          </div>
        </div>

        <div className="mt-24 grid gap-16 border-t border-border-default pt-24 sm:grid-cols-2">
          <div className="flex items-center gap-12">
            <User className="h-16 w-16 text-text-muted shrink-0" />
            <div>
              <p className="text-ui-caption text-text-muted uppercase tracking-wide">Username</p>
              <p className="mt-4 text-body-normal text-text-primary">{user?.userName || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <Mail className="h-16 w-16 text-text-muted shrink-0" />
            <div>
              <p className="text-ui-caption text-text-muted uppercase tracking-wide">Email</p>
              <p className="mt-4 text-body-normal text-text-primary">{user?.userEmail || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <Phone className="h-16 w-16 text-text-muted shrink-0" />
            <div>
              <p className="text-ui-caption text-text-muted uppercase tracking-wide">Phone</p>
              <p className="mt-4 text-body-normal text-text-primary">{user?.userPhoneNumber || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <Shield className="h-16 w-16 text-text-muted shrink-0" />
            <div>
              <p className="text-ui-caption text-text-muted uppercase tracking-wide">Role</p>
              <p className="mt-4 text-body-normal text-text-primary capitalize">{user?.userRole || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <Calendar className="h-16 w-16 text-text-muted shrink-0" />
            <div>
              <p className="text-ui-caption text-text-muted uppercase tracking-wide">Joined</p>
              <p className="mt-4 text-body-normal text-text-primary">{formatDate(user?.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <Calendar className="h-16 w-16 text-text-muted shrink-0" />
            <div>
              <p className="text-ui-caption text-text-muted uppercase tracking-wide">Last Updated</p>
              <p className="mt-4 text-body-normal text-text-primary">{formatDate(user?.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="rounded-card bg-surface-default p-24 md:p-32 shadow-elevation-1 mb-24">
        <h2 className="text-h4 font-semibold text-text-primary mb-20">Activity Summary</h2>
        <div className="grid gap-16 sm:grid-cols-3">
          <div className="rounded-input border border-border-default bg-surface-elevated/30 p-16">
            <p className="text-ui-caption text-text-muted uppercase tracking-wide">Orders Created</p>
            <p className="mt-8 text-3xl font-bold text-text-primary">{activity?.totalOrdersCreated || 0}</p>
          </div>
          <div className="rounded-input border border-border-default bg-surface-elevated/30 p-16">
            <p className="text-ui-caption text-text-muted uppercase tracking-wide">Products Created</p>
            <p className="mt-8 text-3xl font-bold text-text-primary">{activity?.totalProductsCreated || 0}</p>
          </div>
          <div className="rounded-input border border-border-default bg-surface-elevated/30 p-16">
            <p className="text-ui-caption text-text-muted uppercase tracking-wide">Batches Created</p>
            <p className="mt-8 text-3xl font-bold text-text-primary">{activity?.totalBatchesCreated || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-card bg-surface-default p-24 md:p-32 shadow-elevation-1 mb-24">
        <h2 className="text-h4 font-semibold text-text-primary mb-20">Recent Orders</h2>
        {activity?.recentOrders && activity.recentOrders.length > 0 ? (
          <div className="space-y-10">
            {activity.recentOrders.map((order) => (
              <div
                key={order.orderId}
                className="flex items-center justify-between rounded-input border border-border-default bg-surface-elevated/30 px-16 py-12 hover:bg-surface-muted/40 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-text-primary truncate">{order.orderNumber}</p>
                  <p className="text-[11px] text-text-muted truncate">{order.customerName}</p>
                </div>
                <div className="flex items-center gap-10 shrink-0 ml-12">
                  <span className={`inline-block rounded-full px-8 py-3 text-[10px] font-medium ${STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                    {order.orderStatus?.replace(/_/g, " ")}
                  </span>
                  <span className="text-[11px] text-text-muted whitespace-nowrap tabular-nums">
                    ${order.totalAmount?.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-text-muted whitespace-nowrap">{formatDate(order.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-24 text-center text-body-small text-text-muted">No orders created by this user yet.</p>
        )}
      </div>

      {/* Recent Products */}
      <div className="rounded-card bg-surface-default p-24 md:p-32 shadow-elevation-1 mb-24">
        <h2 className="text-h4 font-semibold text-text-primary mb-20">Recent Products</h2>
        {activity?.recentProducts && activity.recentProducts.length > 0 ? (
          <div className="space-y-10">
            {activity.recentProducts.map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-between rounded-input border border-border-default bg-surface-elevated/30 px-16 py-12 hover:bg-surface-muted/40 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-text-primary truncate">{product.productName}</p>
                  <p className="text-[11px] text-text-muted capitalize">{product.type} · {product.variant} · {product.color}</p>
                </div>
                <div className="flex items-center gap-10 shrink-0 ml-12">
                  <span className="text-[11px] text-text-muted whitespace-nowrap tabular-nums">
                    Qty: {product.totalQuantity}
                  </span>
                  <span className="text-[11px] text-text-muted whitespace-nowrap tabular-nums">
                    ${product.productPrice?.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-text-muted whitespace-nowrap">{formatDate(product.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-24 text-center text-body-small text-text-muted">No products created by this user yet.</p>
        )}
      </div>

      {/* Recent Batches */}
      <div className="rounded-card bg-surface-default p-24 md:p-32 shadow-elevation-1">
        <h2 className="text-h4 font-semibold text-text-primary mb-20">Recent Batches</h2>
        {activity?.recentBatches && activity.recentBatches.length > 0 ? (
          <div className="space-y-10">
            {activity.recentBatches.map((batch) => (
              <div
                key={batch.batchId}
                className="flex items-center justify-between rounded-input border border-border-default bg-surface-elevated/30 px-16 py-12 hover:bg-surface-muted/40 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-text-primary truncate">{batch.batchName}</p>
                  <p className="text-[11px] text-text-muted capitalize">{batch.type} · {batch.variant} · {batch.color}</p>
                </div>
                <div className="flex items-center gap-10 shrink-0 ml-12">
                  <span className="text-[11px] text-text-muted whitespace-nowrap tabular-nums">
                    Qty: {batch.totalQuantity}
                  </span>
                  <span className="text-[11px] text-text-muted whitespace-nowrap tabular-nums">
                    ${batch.batchPrice?.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-text-muted whitespace-nowrap">{formatDate(batch.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-24 text-center text-body-small text-text-muted">No batches created by this user yet.</p>
        )}
      </div>
    </div>
  );
}
