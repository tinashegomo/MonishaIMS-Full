import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Package, Calendar, User, Hash, Box, Tag } from "lucide-react";
import { useGetWarehouseBatchById } from "@/hooks/InventoryHooks";

function parseDate(dateStr) {
  if (!dateStr) return null;
  // Handle Jackson LocalDateTime array format: [2026,6,18,10,46]
  if (Array.isArray(dateStr)) {
    return new Date(dateStr[0], dateStr[1] - 1, dateStr[2], dateStr[3] || 0, dateStr[4] || 0, dateStr[5] || 0);
  }
  return new Date(dateStr);
}

function formatDate(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return "-";
  return d.toLocaleDateString("en-ZW", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return "-";
  return d.toLocaleDateString("en-ZW", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WarehouseBatchDetails() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { data: batch, isLoading, isError, error } = useGetWarehouseBatchById(batchId);

  // Calculate totals from sizes instead of using stale backend values
  const calculatedTotalQty = batch?.batchSizes?.reduce((sum, s) => sum + s.quantity, 0) || 0;
  const calculatedTotalValue = calculatedTotalQty * (batch?.batchPrice || 0);

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
          </div>
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 mb-24">
        {/* Batch Info Card */}
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

        {/* Financials Card — calculated from sizes */}
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
                className="flex flex-col items-center justify-center rounded-card border border-border-default bg-surface-elevated/50 px-8 py-10 transition-all hover:shadow-elevation-1 hover:border-brand-primary/30"
              >
                <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-2">
                  Size
                </span>
                <span className="text-lg font-bold text-text-primary mb-1">
                  {size.size}
                </span>
                <span className="text-xs font-semibold text-brand-primary">
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
          <InfoRow
            label="Created By"
            value={batch.createdBy || "Unknown"}
            icon={<User className="w-4 h-4 text-text-muted" />}
          />
          <InfoRow
            label="Created At"
            value={formatDateTime(batch.createdAt)}
            icon={<Calendar className="w-4 h-4 text-text-muted" />}
          />
          <InfoRow
            label="Batch ID"
            value={batch.batchId?.slice(0, 8) + "..."}
            icon={<Hash className="w-4 h-4 text-text-muted" />}
            mono
          />
        </div>
      </div>

      {/* Products Section */}
      <div className="rounded-card bg-surface-default p-20 shadow-elevation-1">
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
                    <td className="min-w-[80px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                      {product.type}
                    </td>
                    <td className="min-w-[120px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                      {product.variant}
                    </td>
                    <td className="w-20 px-6 py-4 text-text-primary text-right whitespace-nowrap tabular-nums">
                      {product.totalQuantity}
                    </td>
                    <td className="w-24 px-6 py-4 text-text-secondary text-right whitespace-nowrap tabular-nums">
                      ${product.productPrice?.toLocaleString()}
                    </td>
                    <td className="w-36 px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                      {formatDate(product.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-[120px] items-center justify-center rounded-card border border-dashed border-border-default">
            <p className="text-sm text-text-muted">
              No products have been created from this batch yet.
            </p>
          </div>
        )}
      </div>
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
