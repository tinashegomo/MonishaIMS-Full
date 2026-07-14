import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2, Package, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import { useGetAllWarehouseBatches, useGetCurrentUser, useRestockBatch } from "@/hooks/InventoryHooks";
import { WarehouseBatchList } from "@/components/warehouse/WarehouseBatchList";
import Modal from "@/components/shared/Modal";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

const BATCH_COLUMNS = [
  { header: "Batch Name", key: "batchName" },
  { header: "Type", key: "type" },
  { header: "Variant", key: "variant" },
  { header: "Color", key: "color" },
  { header: "Quantity", key: "totalQuantity" },
  { header: "Price", key: "batchPrice" },
  { header: "Created", key: "createdAt" },
  { header: "Created By", key: "createdBy" },
];

export default function Warehouse() {
  const { data: user } = useGetCurrentUser();
  const { data: batches, isLoading, isError, error } = useGetAllWarehouseBatches();
  const { mutate: restockBatch, isPending: isRestocking } = useRestockBatch();

  const [restockBatchData, setRestockBatchData] = useState(null);
  const [restockSizes, setRestockSizes] = useState([{ size: "", quantity: "" }]);
  const [restockError, setRestockError] = useState(null);

  const sortedBatches = useMemo(() => {
    if (!batches) return [];
    return [...batches].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [batches]);

  const handleRestockOpen = (batch) => {
    setRestockBatchData(batch);
    const existingSizes = batch.batchSizes?.map((s) => ({ size: s.size, quantity: "" })) || [];
    setRestockSizes(existingSizes.length > 0 ? existingSizes : [{ size: "", quantity: "" }]);
    setRestockError(null);
  };

  const handleRestockClose = () => {
    setRestockBatchData(null);
    setRestockSizes([{ size: "", quantity: "" }]);
    setRestockError(null);
  };

  const addRestockRow = () => setRestockSizes([...restockSizes, { size: "", quantity: "" }]);

  const updateRestockRow = (index, field, value) => {
    const updated = [...restockSizes];
    updated[index][field] = field === "quantity" ? (value === "" ? "" : Number(value)) : value;
    setRestockSizes(updated);
  };

  const removeRestockRow = (index) => {
    if (restockSizes.length <= 1) return;
    setRestockSizes(restockSizes.filter((_, i) => i !== index));
  };

  const handleRestockSubmit = () => {
    const validItems = restockSizes.filter((s) => s.size && s.quantity > 0);
    if (validItems.length === 0) {
      setRestockError("Add at least one size with quantity greater than 0.");
      return;
    }
    setRestockError(null);
    restockBatch(
      { batchId: restockBatchData.batchId, items: validItems },
      { onSuccess: handleRestockClose, onError: (err) => setRestockError(err.response?.data?.message || "Restock failed.") }
    );
  };

  return (
    <div className="animate-fade-in mx-auto max-w-7xl">
      <div className="mb-32 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Warehouse Stock</h1>
          <p className="mt-8 text-body-normal text-text-secondary">Manage inventory batches</p>
        </div>
        <div className="flex items-center gap-8">
          {sortedBatches.length > 0 && (
            <>
              <button
                onClick={() => exportToExcel(sortedBatches, BATCH_COLUMNS, "warehouse-batches")}
                className="inline-flex items-center justify-center gap-8 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
              >
                <FileSpreadsheet className="h-16 w-16" />
                Excel
              </button>
              <button
                onClick={() => exportToPDF(sortedBatches, BATCH_COLUMNS, "Warehouse Batches", "warehouse-batches")}
                className="inline-flex items-center justify-center gap-8 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
              >
                <FileText className="h-16 w-16" />
                PDF
              </button>
            </>
          )}
          {user?.userRole !== "USER" && (
            <Link
              to="/warehouse/create-batch"
              className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200"
            >
              <Plus className="h-16 w-16" />
              Create Batch
            </Link>
          )}
        </div>
      </div>

      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {error.response?.data?.message || "Failed to load batches. Please try again."}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading batches...</p>
        </div>
      ) : sortedBatches.length > 0 ? (
        <WarehouseBatchList batches={sortedBatches} onRestock={user?.userRole !== "USER" ? handleRestockOpen : undefined} />
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <div className="mb-16 flex h-64 w-64 items-center justify-center rounded-full bg-brand-tint">
            <Package className="h-32 w-32 text-brand-primary" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">No batches yet</h3>
          <p className="mt-8 max-w-xs text-body-normal text-text-muted">
            Get started by creating your first warehouse batch.
          </p>
        </div>
      )}

      {/* ── Restock Modal ─── */}
      <Modal isOpen={!!restockBatchData} onClose={handleRestockClose}>
        <Modal.Header onClose={handleRestockClose}>
          Restock Batch — {restockBatchData?.batchName}
        </Modal.Header>

        <Modal.Body>
          {restockError && (
            <div className="mb-16 rounded-input border border-danger-main bg-danger-bg px-12 py-8 text-sm text-danger-main">
              {restockError}
            </div>
          )}

          <div className="space-y-10">
            {restockSizes.map((item, index) => (
              <div key={index} className="flex items-center gap-8">
                <div className="flex-1">
                  <label className="mb-4 block text-xs font-medium text-text-muted">Size</label>
                  <input
                    type="text"
                    value={item.size}
                    onChange={(e) => updateRestockRow(index, "size", e.target.value)}
                    placeholder="e.g. M"
                    className="w-full rounded-input border border-border-default bg-surface-default px-12 py-8 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-4 block text-xs font-medium text-text-muted">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateRestockRow(index, "quantity", e.target.value)}
                    placeholder="0"
                    className="w-full rounded-input border border-border-default bg-surface-default px-12 py-8 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                {restockSizes.length > 1 && (
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); removeRestockRow(index); }}
                    className="mt-18 rounded-full p-6 text-text-muted hover:text-danger-main hover:bg-danger-bg transition-all"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); addRestockRow(); }}
            className="mt-12 text-sm font-medium text-brand-primary hover:text-brand-hover transition-colors"
          >
            + Add size
          </button>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleRestockClose(); }}
            disabled={isRestocking}
            className="rounded-input border border-border-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 disabled:opacity-50 press-scale"
          >
            Cancel
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleRestockSubmit(); }}
            disabled={isRestocking}
            className="flex items-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 hover:bg-brand-hover active:bg-brand-pressed transition-all duration-200 disabled:opacity-60 press-scale"
          >
            {isRestocking ? (<><Loader2 className="h-14 w-14 animate-spin" /> Restocking...</>) : (<><RefreshCw className="h-14 w-14" /> Restock</>)}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
