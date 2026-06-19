import { Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function parseDate(dateStr) {
  if (!dateStr) return null;
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

export const WarehouseBatchList = ({ batches, setSelectedItem }) => {
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
            const totalQty = batch.batchSizes?.reduce((sum, s) => sum + s.quantity, 0) || batch.totalQuantity || 0;
            const totalValue = totalQty * (batch.batchPrice || 0);

            return (
              <tr
                key={batch.batchId}
                className="border-b border-border-default/50 last:border-b-0 hover:bg-surface-muted/40 transition-colors duration-150"
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
                  {totalQty}
                </td>
                <td className="w-32 px-6 py-4 text-text-secondary text-right whitespace-nowrap tabular-nums">
                  ${batch.batchPrice?.toLocaleString()}
                </td>
                <td className="w-32 px-6 py-4 font-medium text-text-primary text-right whitespace-nowrap tabular-nums">
                  ${totalValue.toLocaleString()}
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
                  <button
                    onClick={() => setSelectedItem(batch)}
                    className="rounded-full p-5 text-text-muted hover:bg-danger-bg hover:text-danger-main transition-all duration-200 press-scale"
                    aria-label={`Delete ${batch.batchName}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
