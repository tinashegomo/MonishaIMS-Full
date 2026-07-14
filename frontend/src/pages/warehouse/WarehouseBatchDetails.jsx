import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Package, Calendar, User, Hash, Box, Tag, AlertTriangle, RefreshCw } from "lucide-react";
import { useGetWarehouseBatchById, useGetRestockHistory, useGetDepletedHistory } from "@/hooks/InventoryHooks";
import { formatDateTime } from "@/utils/dateUtils";

const LOW_STOCK_THRESHOLD = 20;

export default function WarehouseBatchDetails() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { data: batch, isLoading, isError, error } = useGetWarehouseBatchById(batchId);
  const { data: restockHistory } = useGetRestockHistory(batchId);
  const { data: depletedHistory } = useGetDepletedHistory(batchId);

  const calculatedTotalQty = batch?.batchSizes?.reduce((sum, s) => sum + s.quantity, 0) || 0;
  const calculatedTotalValue = calculatedTotalQty * (batch?.batchPrice || 0);
  const isDepleted = batch?.depletedAt != null || calculatedTotalQty === 0;
  const lowStockSizes = batch?.batchSizes?.filter((s) => s.quantity > 0 && s.quantity <= LOW_STOCK_THRESHOLD) || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
        <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
        <p className="text-body-normal text-text-secondary">Loading batch details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => navigate("/warehouse")}
          className="mb-16 flex items-center gap-8 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Warehouse
        </button>
        <div className="rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main">
          {error.response?.data?.message || "Failed to load batch details. Please try again."}
        </div>
      </div>
    );
  }

  if (!batch) return null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-32">
        <button
          onClick={() => navigate("/warehouse")}
          className="mb-12 flex items-center gap-8 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Warehouse
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-h2 font-bold text-text-primary">{batch.batchName}</h1>
            <p className="mt-8 text-body-normal text-text-secondary">
              {batch.type} · {batch.variant} · {batch.color}
            </p>
            {isDepleted && (
              <div className="mt-12 inline-flex items-center gap-8 rounded-full bg-danger-bg px-12 py-6">
                <AlertTriangle className="h-14 w-14 text-danger-main" />
                <span className="text-sm font-semibold text-danger-main">Depleted</span>
                {batch.depletedAt && (
                  <span className="text-xs text-danger-main/80">
                    since {formatDateTime(batch.depletedAt)}
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
            <h2 className="text-lg font-semibold text-text-primary">Batch Information</h2>
          </div>
          <div className="space-y-12">
            <InfoRow label="Batch Name" value={batch.batchName} />
            <InfoRow label="Type" value={batch.type} />
            <InfoRow label="Variant" value={batch.variant} />
            <InfoRow label="Color" value={batch.color} />
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
            <InfoRow label="Price per Unit" value={`$${batch.batchPrice?.toLocaleString()}`} />
            <InfoRow label="Total Quantity" value={calculatedTotalQty.toLocaleString()} />
            <div className="flex items-center justify-between py-8 border-t border-border-default">
              <span className="text-sm text-text-muted">Total Value</span>
              <span className="text-lg font-bold text-text-primary tabular-nums">
                ${calculatedTotalValue.toLocaleString()}
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
      {batch.batchSizes && batch.batchSizes.length > 0 && (
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1 mb-24">
          <div className="flex items-center gap-10 mb-16">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-amber-50">
              <Box className="h-20 w-20 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Sizes & Quantities</h2>
          </div>
          <div className="grid grid-cols-3 gap-10 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
            {batch.batchSizes.map((size, index) => (
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
                <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-2">
                  Size
                </span>
                <span className="text-lg font-bold text-text-primary mb-1">
                  {size.size}
                </span>
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
          <InfoRow label="Created By" value={batch.createdBy || "Unknown"} icon={<User className="w-4 h-4 text-text-muted" />} />
          <InfoRow label="Created At" value={formatDateTime(batch.createdAt)} icon={<Calendar className="w-4 h-4 text-text-muted" />} />
          <InfoRow label="Batch ID" value={batch.batchId?.slice(0, 8) + "..."} icon={<Hash className="w-4 h-4 text-text-muted" />} mono />
        </div>
      </div>

      {/* Products Section */}
      <div className="rounded-card bg-surface-default p-20 shadow-elevation-1 mb-24">
        <div className="flex items-center gap-10 mb-16">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-sky-50">
            <Package className="h-20 w-20 text-sky-600" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Products from this Batch</h2>
        </div>
        {batch.products && batch.products.length > 0 ? (
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="min-w-[200px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Product Name</th>
                  <th className="min-w-[80px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Type</th>
                  <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Variant</th>
                  <th className="w-20 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Qty</th>
                  <th className="w-24 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Price</th>
                  <th className="w-36 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Created</th>
                </tr>
              </thead>
              <tbody>
                {batch.products.map((product) => (
                  <tr
                    key={product.productId}
                    onClick={() => navigate(`/products/${product.productId}`)}
                    className="border-b border-border-default/50 last:border-b-0 hover:bg-surface-muted/40 transition-colors cursor-pointer"
                  >
                    <td className="min-w-[200px] px-6 py-4 font-medium text-text-primary whitespace-nowrap truncate" title={product.productName}>
                      {product.productName}
                    </td>
                    <td className="min-w-[80px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">{product.type}</td>
                    <td className="min-w-[120px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">{product.variant}</td>
                    <td className="w-20 px-6 py-4 text-text-primary text-right whitespace-nowrap tabular-nums">{product.totalQuantity}</td>
                    <td className="w-24 px-6 py-4 text-text-secondary text-right whitespace-nowrap tabular-nums">${product.productPrice?.toLocaleString()}</td>
                    <td className="w-36 px-6 py-4 text-xs text-text-muted whitespace-nowrap">{formatDateTime(product.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-[120px] items-center justify-center rounded-card border border-dashed border-border-default">
            <p className="text-sm text-text-muted">No products have been created from this batch yet.</p>
          </div>
        )}
      </div>

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
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1 mb-24">
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
