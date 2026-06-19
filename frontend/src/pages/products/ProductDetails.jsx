import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Package, Tag, Box, School, Hash, Calendar, User } from "lucide-react";
import { useGetProductById } from "@/hooks/InventoryHooks";

function parseDate(dateStr) {
  if (!dateStr) return null;
  if (Array.isArray(dateStr)) {
    return new Date(dateStr[0], dateStr[1] - 1, dateStr[2], dateStr[3] || 0, dateStr[4] || 0, dateStr[5] || 0);
  }
  return new Date(dateStr);
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

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error } = useGetProductById(productId);

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
          </div>
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 mb-24">
        {/* Product Info Card */}
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

        {/* Financials Card */}
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
            label="Created At"
            value={formatDateTime(product.createdAt)}
            icon={<Calendar className="w-4 h-4 text-text-muted" />}
          />
          <InfoRow
            label="Created By"
            value={product.createdBy}
            icon={<User className="w-4 h-4 text-text-muted" />}
          />
          <InfoRow
            label="Product ID"
            value={product.productId?.slice(0, 8) + "..."}
            icon={<Hash className="w-4 h-4 text-text-muted" />}
            mono
          />
          <InfoRow
            label="Batch ID"
            value={product.batchId?.slice(0, 8) + "..."}
            icon={<Hash className="w-4 h-4 text-text-muted" />}
            mono
          />
        </div>
      </div>

      {/* Description Card */}
      {product.description && (
        <div className="rounded-card bg-surface-default p-20 shadow-elevation-1">
          <h2 className="text-lg font-semibold text-text-primary mb-12">Description</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>
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
