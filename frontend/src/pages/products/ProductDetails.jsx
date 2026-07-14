import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Package, Tag, Box, Hash, Calendar, User, AlertTriangle, RefreshCw } from "lucide-react";
import { useGetProductById, useGetProductRestockHistory, useGetProductDepletedHistory } from "@/hooks/InventoryHooks";
import { formatDateTime } from "@/utils/dateUtils";

const LOW_STOCK_THRESHOLD = 20;

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error } = useGetProductById(productId);
  const { data: restockHistory } = useGetProductRestockHistory(productId);
  const { data: depletedHistory } = useGetProductDepletedHistory(productId);
  const isDepleted = product?.depletedAt != null || product?.totalQuantity === 0;
  const lowStockSizes = product?.productSizes?.filter((s) => s.quantity > 0 && s.quantity <= LOW_STOCK_THRESHOLD) || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
        <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
        <p className="text-body-normal text-text-secondary">Loading product details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => navigate("/products")}
          className="mb-16 flex items-center gap-8 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
        <div className="rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main">
          {error.response?.data?.message || "Failed to load product details."}
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-32">
        <button
          onClick={() => navigate("/products")}
          className="mb-12 flex items-center gap-8 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-h2 font-bold text-text-primary">{product.productName}</h1>
            <p className="mt-8 text-body-normal text-text-secondary">
              {product.type} · {product.variant} · {product.color}
            </p>
            {isDepleted && (
              <div className="mt-12 inline-flex items-center gap-8 rounded-full bg-danger-bg px-12 py-6">
                <AlertTriangle className="h-14 w-14 text-danger-main" />
                <span className="text-sm font-semibold text-danger-main">Depleted</span>
                {product.depletedAt && (
                  <span className="text-xs text-danger-main/80">
                    since {formatDateTime(product.depletedAt)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 mb-24">
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1">
          <div className="flex items-center gap-10 mb-16">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-brand-subtle">
              <Package className="h-20 w-20 text-brand-primary" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Product Information</h2>
          </div>
          <div className="space-y-12">
            <InfoRow label="Product Name" value={product.productName} />
            <InfoRow label="Type" value={product.type} />
            <InfoRow label="Variant" value={product.variant} />
            <InfoRow label="Color" value={product.color} />
            <InfoRow label="Batch" value={product.batchName} />
            <InfoRow label="School" value={product.schoolName || "—"} />
          </div>
        </div>

        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1">
          <div className="flex items-center gap-10 mb-16">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-emerald-50">
              <Tag className="h-20 w-20 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Financials</h2>
          </div>
          <div className="space-y-12">
            <InfoRow label="Price per Unit" value={`$${product.productPrice?.toLocaleString()}`} />
            <InfoRow label="Total Quantity" value={product.totalQuantity?.toLocaleString()} />
            <div className="flex items-center justify-between py-8 border-t border-border-default">
              <span className="text-sm text-text-muted">Total Value</span>
              <span className="text-lg font-bold text-text-primary tabular-nums">
                ${product.totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockSizes.length > 0 && (
        <div className="rounded-card border border-amber-300 bg-amber-50 p-20 shadow-elevation-1 mb-24 dark:border-amber-700 dark:bg-amber-950">
          <div className="flex items-center gap-10 mb-12">
            <AlertTriangle className="h-20 w-20 text-amber-600" />
            <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200">Low Stock Alert</h2>
          </div>
          <div className="flex flex-wrap gap-8">
            {lowStockSizes.map((size, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-6 rounded-full bg-amber-100 px-12 py-6 text-sm font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200"
              >
                Size {size.size}: {size.quantity} left
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sizes Card */}
      {product.productSizes && product.productSizes.length > 0 && (
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1 mb-24">
          <div className="flex items-center gap-10 mb-16">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-amber-50">
              <Box className="h-20 w-20 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Sizes & Quantities</h2>
          </div>
          <div className="grid grid-cols-3 gap-10 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
            {product.productSizes.map((size, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center rounded-card border px-8 py-10 transition-all hover:shadow-elevation-1 ${
                  size.quantity === 0
                    ? "border-danger-main/30 bg-danger-bg/30 opacity-50"
                    : size.quantity <= LOW_STOCK_THRESHOLD
                    ? "border-amber-300 bg-amber-50/50 hover:border-amber-primary/30 dark:border-amber-700 dark:bg-amber-950/50"
                    : "border-border-default bg-surface-elevated/50 hover:border-brand-primary/30"
                }`}
              >
                <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-2">Size</span>
                <span className="text-lg font-bold text-text-primary mb-1">{size.size}</span>
                <span className={`text-xs font-semibold ${
                  size.quantity === 0 ? "text-danger-main" : size.quantity <= LOW_STOCK_THRESHOLD ? "text-amber-600" : "text-brand-primary"
                }`}>
                  {size.quantity} pcs
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Card */}
      <div className="rounded-card bg-surface-default p-20 shadow-elevation-1 mb-24">
        <div className="flex items-center gap-10 mb-16">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-purple-50">
            <Calendar className="h-20 w-20 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Metadata</h2>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <InfoRow label="Created At" value={formatDateTime(product.createdAt)} icon={<Calendar className="w-4 h-4 text-text-muted" />} />
          <InfoRow label="Created By" value={product.createdBy} icon={<User className="w-4 h-4 text-text-muted" />} />
          <InfoRow label="Product ID" value={product.productId?.slice(0, 8) + "..."} icon={<Hash className="w-4 h-4 text-text-muted" />} mono />
          <InfoRow label="Batch ID" value={product.batchId?.slice(0, 8) + "..."} icon={<Hash className="w-4 h-4 text-text-muted" />} mono />
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1 mb-24">
          <h2 className="text-lg font-semibold text-text-primary mb-12">Description</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Restock History */}
      {restockHistory && restockHistory.length > 0 && (
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1 mb-24">
          <div className="flex items-center gap-10 mb-16">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-emerald-50">
              <RefreshCw className="h-20 w-20 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Restock History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Size</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Qty Added</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Restocked By</th>
                </tr>
              </thead>
              <tbody>
                {restockHistory.map((entry) => (
                  <tr key={entry.restockId} className="border-b border-border-default/50 last:border-b-0">
                    <td className="px-6 py-4 text-text-secondary whitespace-nowrap">{formatDateTime(entry.restockedAt)}</td>
                    <td className="px-6 py-4 font-medium text-text-primary">{entry.size}</td>
                    <td className="px-6 py-4 text-emerald-600 font-semibold text-right tabular-nums">+{entry.quantityAdded}</td>
                    <td className="px-6 py-4 text-text-secondary">{entry.restockedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Depletion History */}
      {depletedHistory && depletedHistory.length > 0 && (
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1">
          <div className="flex items-center gap-10 mb-16">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-danger-bg">
              <AlertTriangle className="h-20 w-20 text-danger-main" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Depletion History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {depletedHistory.map((entry) => (
                  <tr key={entry.depletedId} className="border-b border-border-default/50 last:border-b-0">
                    <td className="px-6 py-4 text-text-secondary whitespace-nowrap">{formatDateTime(entry.depletedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

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
