import { useMemo } from "react";
import { Trash2, Plus } from "lucide-react";

const inputBase =
  "w-full rounded-input border bg-surface-elevated px-16 py-12 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200";
const inputOk =
  "border-border-default focus:border-border-focus focus-ring";

/**
 * OrderItemRow — a single order item with source toggle and fields per type.
 *
 * Product: dropdown + size dropdown + quantity
 * Batch:   dropdown + size dropdown + quantity
 * Custom:  type/variant/color/price inputs + quantity + measurements
 *
 * Receives all data and callbacks via props from OrderItemList.
 */
export default function OrderItemRow({ item, index, existingProducts, existingBatches, onManageItem, onManageMeasurement }) {

  const availableSizes = useMemo(() => {
    if (item.source === "product" && item.productId) {
      return existingProducts.find((p) => p.productId === item.productId)?.productSizes ?? [];
    }
    if (item.source === "batch" && item.batchId) {
      return existingBatches.find((b) => b.batchId === item.batchId)?.batchSizes ?? [];
    }
    return [];
  }, [item.source, item.productId, item.batchId, existingProducts, existingBatches]);

  return (
    <div className="rounded-input border border-border-default bg-surface-elevated/30 p-16 space-y-12 animate-slide-up">

      {/* Item header: source selector + remove */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {["product", "batch", "custom"].map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => onManageItem("update", index, "source", src)}
              className={`rounded-input px-12 py-6 text-body-small font-medium transition-all duration-200 press-scale ${
                item.source === src
                  ? "bg-brand-primary text-neutral-0 shadow-elevation-1"
                  : "bg-surface-muted text-text-secondary hover:bg-surface-default hover:text-text-primary"
              }`}
            >
              {src === "product" ? "Product" : src === "batch" ? "Batch" : "Custom"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onManageItem("remove", index)}
          className="rounded-input p-8 text-text-muted hover:bg-danger-bg hover:text-danger-main transition-all duration-200 press-scale"
          aria-label="Remove item"
        >
          <Trash2 className="h-14 w-14" />
        </button>
      </div>

      {/* Product fields */}
      {item.source === "product" && (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <label className="mb-4 block text-body-small font-medium text-text-muted">Product</label>
            <select
              value={item.productId}
              onChange={(e) => onManageItem("update", index, "productId", e.target.value)}
              className={`${inputBase} appearance-none pr-40 ${inputOk}`}
            >
              <option value="">Select product</option>
              {existingProducts.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {p.productName} ({p.type} {p.variant} {p.color})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-4 block text-body-small font-medium text-text-muted">Size</label>
            <select
              value={item.size}
              onChange={(e) => onManageItem("update", index, "size", e.target.value)}
              disabled={!item.productId}
              className={`${inputBase} appearance-none pr-40 ${inputOk} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value="">Select size</option>
              {availableSizes.map((s) => (
                <option key={s.sizeId || s.productSizeId} value={s.size}>
                  {s.size} ({s.quantity} available)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-4 block text-body-small font-medium text-text-muted">Quantity</label>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onManageItem("update", index, "quantity", e.target.value)}
              className={`${inputBase} ${inputOk}`}
            />
          </div>
        </div>
      )}

      {/* Batch fields */}
      {item.source === "batch" && (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <label className="mb-4 block text-body-small font-medium text-text-muted">Batch</label>
            <select
              value={item.batchId}
              onChange={(e) => onManageItem("update", index, "batchId", e.target.value)}
              className={`${inputBase} appearance-none pr-40 ${inputOk}`}
            >
              <option value="">Select batch</option>
              {existingBatches.map((b) => (
                <option key={b.batchId} value={b.batchId}>
                  {b.batchName} ({b.type} {b.variant} {b.color})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-4 block text-body-small font-medium text-text-muted">Size</label>
            <select
              value={item.size}
              onChange={(e) => onManageItem("update", index, "size", e.target.value)}
              disabled={!item.batchId}
              className={`${inputBase} appearance-none pr-40 ${inputOk} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value="">Select size</option>
              {availableSizes.map((s) => (
                <option key={s.sizeId || s.productSizeId} value={s.size}>
                  {s.size} ({s.quantity} available)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-4 block text-body-small font-medium text-text-muted">Quantity</label>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onManageItem("update", index, "quantity", e.target.value)}
              className={`${inputBase} ${inputOk}`}
            />
          </div>
        </div>
      )}

      {/* Custom fields */}
      {item.source === "custom" && (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <label className="mb-4 block text-body-small font-medium text-text-muted">Type</label>
            <input
              type="text"
              placeholder="e.g. Shirt"
              value={item.type}
              onChange={(e) => onManageItem("update", index, "type", e.target.value)}
              className={`${inputBase} ${inputOk}`}
            />
          </div>
          <div>
            <label className="mb-4 block text-body-small font-medium text-text-muted">Variant</label>
            <input
              type="text"
              placeholder="e.g. Short Sleeve"
              value={item.variant}
              onChange={(e) => onManageItem("update", index, "variant", e.target.value)}
              className={`${inputBase} ${inputOk}`}
            />
          </div>
          <div>
            <label className="mb-4 block text-body-small font-medium text-text-muted">Color</label>
            <input
              type="text"
              placeholder="e.g. White"
              value={item.color}
              onChange={(e) => onManageItem("update", index, "color", e.target.value)}
              className={`${inputBase} ${inputOk}`}
            />
          </div>
          <div>
            <label className="mb-4 block text-body-small font-medium text-text-muted">Unit Price</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={item.unitPrice}
              onChange={(e) => onManageItem("update", index, "unitPrice", e.target.value)}
              className={`${inputBase} ${inputOk}`}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-4 block text-body-small font-medium text-text-muted">Quantity</label>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onManageItem("update", index, "quantity", e.target.value)}
              className={`${inputBase} ${inputOk}`}
            />
          </div>
        </div>
      )}

      {/* Measurements (custom items only) */}
      {item.source === "custom" && (
        <div className="rounded-input border border-border-default bg-surface-elevated/30 p-16 space-y-10">
          <label className="flex items-center gap-8 cursor-pointer">
            <input
              type="checkbox"
              checked={item.measurementsTaken}
              onChange={(e) => onManageItem("update", index, "measurementsTaken", e.target.checked)}
              className="h-12 w-12 rounded border-border-default text-brand-primary focus:ring-brand-subtle"
            />
            <span className="text-xs font-medium text-text-secondary">Has Measurements</span>
          </label>

          {item.measurementsTaken && item.measurements.length === 0 && (
            <p className="text-body-small text-text-muted">
              Click &ldquo;Add Measurement&rdquo; to begin.
            </p>
          )}

          {item.measurementsTaken && item.measurements.length > 0 && (
            <div className="space-y-8 rounded-input border border-border-default bg-surface-default p-12">
              <div className="grid grid-cols-2 gap-8 px-4">
                <span className="text-[10px] font-medium text-text-muted uppercase">Name</span>
                <span className="text-[10px] font-medium text-text-muted uppercase">Value</span>
              </div>
              {item.measurements.map((m, mIndex) => (
                <div key={mIndex} className="grid grid-cols-2 gap-8 items-center">
                  <input
                    type="text"
                    placeholder="e.g. Chest"
                    value={m.measurementName}
                    onChange={(e) => onManageMeasurement("update", index, mIndex, "measurementName", e.target.value)}
                    className={`${inputBase} ${inputOk}`}
                  />
                  <div className="flex items-center gap-8">
                    <input
                      type="number"
                      min="0"
                      placeholder="Value"
                      value={m.measurementValue}
                      onChange={(e) => onManageMeasurement("update", index, mIndex, "measurementValue", e.target.value)}
                      className={`${inputBase} min-w-0 ${inputOk}`}
                    />
                    <button
                      type="button"
                      onClick={() => onManageMeasurement("remove", index, mIndex)}
                      className="shrink-0 rounded-input p-8 text-text-muted hover:bg-danger-bg hover:text-danger-main transition-colors press-scale"
                      aria-label="Remove measurement"
                    >
                      <Trash2 className="h-14 w-14" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {item.measurementsTaken && (
            <button
              type="button"
              onClick={() => onManageMeasurement("add", index)}
              className="inline-flex items-center gap-6 rounded-input px-8 py-4 text-body-small font-medium text-brand-primary hover:bg-brand-tint transition-colors press-scale"
            >
              <Plus className="h-12 w-12" />
              Add Measurement
            </button>
          )}
        </div>
      )}

      {/* Item subtotal */}
      <div className="text-right text-body-small text-text-muted pt-4">
        Subtotal:{" "}
        <span className="font-medium text-text-primary">
          ${((parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 0)).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
