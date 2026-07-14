import { Eye, RefreshCw, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/dateUtils";

const LOW_STOCK_THRESHOLD = 20;

const hasLowStock = (product) => product.productSizes?.some((s) => s.quantity > 0 && s.quantity <= LOW_STOCK_THRESHOLD) || false;

export const ProductList = ({ products, onRestock }) => {

  const navigate = useNavigate();

  return (
    <div className="w-full rounded-card bg-surface-default">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default">
            <th className="min-w-[200px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Product Name</th>
            <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Batch</th>
            <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">School</th>
            <th className="min-w-[80px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Type</th>
            <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Variant</th>
            <th className="min-w-[80px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Color</th>
            <th className="w-20 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Qty</th>
            <th className="w-24 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Price</th>
            <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Total</th>
            <th className="min-w-[140px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Sizes</th>
            <th className="w-36 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">Created</th>
            <th className="min-w-[120px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">Created By</th>
            <th className="w-20 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const isDepleted = product.depletedAt != null || product.totalQuantity === 0;
            const isLow = !isDepleted && hasLowStock(product);
            return (
              <tr
                key={product.productId}
                className={`border-b border-border-default/50 last:border-b-0 transition-colors duration-150 ${
                  isDepleted ? "opacity-50 grayscale bg-surface-muted/20" : isLow ? "bg-amber-50/30 dark:bg-amber-950/20" : "hover:bg-surface-muted/40"
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="min-w-[200px] px-6 py-4 font-medium text-text-primary whitespace-nowrap truncate" title={product.productName}>
                  {product.productName}
                </td>
                <td className="min-w-[120px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                  {product.batchName || "-"}
                </td>
                <td className="min-w-[120px] px-6 py-4 text-text-muted whitespace-nowrap truncate">
                  {product.schoolName || "-"}
                </td>
                <td className="min-w-[80px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                  {product.type || "-"}
                </td>
                <td className="min-w-[120px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                  {product.variant || "-"}
                </td>
                <td className="min-w-[80px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                  {product.color || "-"}
                </td>
                <td className="w-20 px-6 py-4 text-text-primary text-right whitespace-nowrap tabular-nums">
                  {product.totalQuantity}
                  {isDepleted && (
                    <span className="ml-8 inline-block rounded-full bg-danger-bg px-6 py-2 text-[10px] font-semibold uppercase text-danger-main">
                      Depleted
                    </span>
                  )}
                  {!isDepleted && isLow && (
                    <span className="ml-8 inline-flex items-center gap-4 rounded-full bg-amber-100 px-6 py-2 text-[10px] font-semibold uppercase text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                      <AlertTriangle className="w-3 h-3" /> Low
                    </span>
                  )}
                </td>
                <td className="w-24 px-6 py-4 text-text-secondary text-right whitespace-nowrap tabular-nums">
                  ${product.productPrice?.toLocaleString()}
                </td>
                <td className="w-28 px-6 py-4 font-medium text-text-primary text-right whitespace-nowrap tabular-nums">
                  ${product.totalPrice?.toLocaleString()}
                </td>
                <td className="min-w-[140px] px-6 py-4 text-xs text-text-muted whitespace-nowrap truncate" title={product.productSizes?.map((s) => `${s.size}:${s.quantity}`).join(", ") || ""}>
                  {product.productSizes
                    ?.map((s) => `${s.size}:${s.quantity}`)
                    .join(", ") || "-"}
                </td>
                <td className="w-36 px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                  {formatDate(product.createdAt)}
                </td>
                <td className="min-w-[120px] px-6 py-4 text-xs text-text-muted whitespace-nowrap truncate" title={product.createdBy || ""}>
                  {product.createdBy || "-"}
                </td>
                <td className="w-20 px-6 py-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => navigate(`/products/${product.productId}`)}
                    className="rounded-full p-5 text-text-muted hover:bg-brand-subtle hover:text-brand-primary transition-all duration-200 press-scale"
                    aria-label={`View ${product.productName}`}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {onRestock && (
                    <button
                      onMouseDown={(e) => { e.preventDefault(); onRestock(product); }}
                      className="rounded-full p-5 text-text-muted hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 press-scale"
                      aria-label={`Restock ${product.productName}`}
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
