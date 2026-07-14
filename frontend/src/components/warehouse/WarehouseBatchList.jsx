import { Eye, RefreshCw, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/dateUtils";

const LOW_STOCK_THRESHOLD = 20;

const getTotalQty = (batch) => batch.batchSizes?.reduce((sum, s) => sum + s.quantity, 0) || batch.totalQuantity || 0;
const getTotalValue = (batch) => getTotalQty(batch) * (batch.batchPrice || 0);
const hasLowStock = (batch) => batch.batchSizes?.some((s) => s.quantity > 0 && s.quantity <= LOW_STOCK_THRESHOLD) || false;

export const WarehouseBatchList = ({ batches, onRestock }) => {

  const navigate = useNavigate();

  return (
    <div className="w-full rounded-card bg-surface-default">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default">
            <th className="min-w-[220px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Batch Name</th>
            <th className="min-w-[100px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Type</th>
            <th className="min-w-[140px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Variant</th>
            <th className="min-w-[100px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Color</th>
            <th className="w-24 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Qty</th>
            <th className="w-32 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Price</th>
            <th className="w-32 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Total</th>
            <th className="w-40 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Created</th>
            <th className="w-32 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">By</th>
            <th className="w-24 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch, index) => {
            const isDepleted = batch.depletedAt != null || getTotalQty(batch) === 0;
            const isLow = !isDepleted && hasLowStock(batch);
            return (
              <tr
                key={batch.batchId}
                className={`border-b border-border-default/50 last:border-b-0 transition-colors duration-150 ${
                  isDepleted ? "opacity-50 grayscale bg-surface-muted/20" : isLow ? "bg-amber-50/30 dark:bg-amber-950/20" : "hover:bg-surface-muted/40"
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="min-w-[220px] px-6 py-4 font-medium text-text-primary whitespace-nowrap truncate" title={batch.batchName}>
                  {batch.batchName}
                </td>
                <td className="min-w-[100px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                  {batch.type}
                </td>
                <td className="min-w-[140px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                  {batch.variant}
                </td>
                <td className="min-w-[100px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                  {batch.color}
                </td>
                <td className="w-24 px-6 py-4 text-text-primary text-right whitespace-nowrap tabular-nums">
                  {getTotalQty(batch)}
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
                <td className="w-32 px-6 py-4 text-text-secondary text-right whitespace-nowrap tabular-nums">
                  ${batch.batchPrice?.toLocaleString()}
                </td>
                <td className="w-32 px-6 py-4 font-medium text-text-primary text-right whitespace-nowrap tabular-nums">
                  ${getTotalValue(batch).toLocaleString()}
                </td>
                <td className="w-40 px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                  {formatDate(batch.createdAt)}
                </td>
                <td className="w-32 px-6 py-4 text-xs text-text-secondary whitespace-nowrap truncate" title={batch.createdBy || ""}>
                  {batch.createdBy || "-"}
                </td>
                <td className="w-24 px-6 py-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => navigate(`/warehouse/${batch.batchId}`)}
                    className="rounded-full p-5 text-text-muted hover:bg-brand-subtle hover:text-brand-primary transition-all duration-200 press-scale"
                    aria-label={`View ${batch.batchName}`}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {onRestock && (
                    <button
                      onMouseDown={(e) => { e.preventDefault(); onRestock(batch); }}
                      className="rounded-full p-5 text-text-muted hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 press-scale"
                      aria-label={`Restock ${batch.batchName}`}
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
