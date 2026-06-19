import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2, Loader2, ChevronDown } from "lucide-react";
import { productRequestSchema, productRequestDefaultValues} from "@/yupSchema/product/request/ProductRequestDTO";

// Shared Tailwind tokens for form inputs
const inputBase =
  "w-full rounded-input border bg-surface-elevated px-16 py-12 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200";
const inputOk =
  "border-border-default focus:border-border-focus focus-ring";
const inputErr =
  "border-danger-main focus:border-danger-hover focus:ring-2 focus:ring-danger-bg";
const selectWrapper = "relative";
const selectChevron =
  "pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-text-muted";

/**
 * ProductForm — create form for allocating products from warehouse stock.
 *
 * Uses dependent dropdowns: Type → Variant → Color → Batch.
 * Sizes managed in plain React state (same pattern as WarehouseForm).
 * RHF handles main fields; sizes are passed separately to onSubmit.
 */
export const ProductForm = ({onSubmit,isPending,existingBatches = [],existingSchools = [],submitLabel = "Create Product",}) => {

  const {register,handleSubmit,setValue,formState: { errors },} = useForm({
    resolver: yupResolver(productRequestSchema),
    defaultValues: productRequestDefaultValues,
    mode: "onBlur",
  });

  // Dependent dropdown state — each selection filters the next
  const [selectedType, setSelectedType] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Sizes managed in plain state — not part of RHF
  const [sizes, setSizes] = useState([]);

  // Derive unique options from batches for each dropdown level
  // ─── Types: unique type values from all batches ───
  const types = useMemo(() => {
    return [...new Set(existingBatches.map((b) => b.type))];
  }, [existingBatches]);

  // ─── Variants: filtered by selected type ───
  const variants = useMemo(() => {
    if (!selectedType) return [];
    
    return [...new Set(existingBatches.filter((b) => b.type === selectedType).map((b) => b.variant))];
  }, [existingBatches, selectedType]);

  // ─── Colors: filtered by selected type + variant ───
  const colors = useMemo(() => {
    if (!selectedType || !selectedVariant) return [];

    return [...new Set(existingBatches.filter((b) => b.type === selectedType && b.variant === selectedVariant).map((b) => b.color))];
  }, [existingBatches, selectedType, selectedVariant]);

  // ─── Filtered Batches: exact match on type + variant + color ───
  const filteredBatches = useMemo(() => {
    if (!selectedType || !selectedVariant || !selectedColor) return [];
    
    return existingBatches.filter(
      (b) =>
        b.type === selectedType &&
        b.variant === selectedVariant &&
        b.color === selectedColor
    );
  }, [existingBatches, selectedType, selectedVariant, selectedColor]);

  // ─── Available Sizes: from selected batch (null-safe) ───
  const availableSizes = selectedBatch?.batchSizes ?? [];

  // Cascade resets — clear downstream selections when upstream changes
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedVariant("");
    setSelectedColor("");
    setSelectedBatch(null);
    setSizes([]);
    setValue("batchId", "");
  };

  const handleVariantChange = (e) => {
    setSelectedVariant(e.target.value);
    setSelectedColor("");
    setSelectedBatch(null);
    setSizes([]);
    setValue("batchId", "");
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    setSelectedBatch(null);
    setSizes([]);
    setValue("batchId", "");
  };

  // Resolve batch object and set batchId for RHF validation
  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    const match = existingBatches.find((b) => b.batchId === batchId);
    setSelectedBatch(match || null);
    setValue("batchId", batchId, { shouldValidate: true });
    setSizes([]);
  };

  // Size row helpers — same pattern as WarehouseForm
  const addRow = () => {
    setSizes([...sizes, { size: "", quantity: "" }]);
  };

  const removeRow = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const updated = [...sizes];
    updated[index] = { ...updated[index], [field]: value };
    setSizes(updated);
  };

  return (
    // RHF validates main fields; sizes passed separately to parent onSubmit
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, sizes))}
      className="space-y-20"
    >
      {/* ─── Product Name + Price ─── */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Product Name</label>
          <input
            type="text"
            placeholder="e.g. School Shirt - White"
            aria-invalid={errors.productName ? "true" : "false"}
            className={`${inputBase} ${errors.productName ? inputErr : inputOk}`}
            {...register("productName")}
          />
          {errors.productName && (
            <p className="mt-4 text-body-small text-danger-main">{errors.productName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
            Price Per Unit
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 1500"
            aria-invalid={errors.productPrice ? "true" : "false"}
            className={`${inputBase} ${errors.productPrice ? inputErr : inputOk}`}
            {...register("productPrice")}
          />
          {errors.productPrice && (
            <p className="mt-4 text-body-small text-danger-main">
              {errors.productPrice.message}
            </p>
          )}
        </div>
      </div>

      {/* ─── Type → Variant → Color dependent dropdowns ─── */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
        {/* TYPE: first in cascade, enables variant dropdown */}
        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
            Type
          </label>
          <div className={selectWrapper}>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className={`${inputBase} appearance-none pr-40 ${inputOk}`}
            >
              <option value="">Select type</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown className={selectChevron} />
          </div>
        </div>

        {/* VARIANT: second in cascade, enabled only after type selected */}
        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
            Variant
          </label>
          <div className={selectWrapper}>
            <select
              value={selectedVariant}
              onChange={handleVariantChange}
              disabled={!selectedType}
              className={`${inputBase} appearance-none pr-40 ${inputOk} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value="">Select variant</option>
              {variants.map((variant) => (
                <option key={variant} value={variant}>
                  {variant}
                </option>
              ))}
            </select>
            <ChevronDown className={selectChevron} />
          </div>
        </div>

        {/* COLOR: third in cascade, enabled only after variant selected */}
        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
            Color
          </label>
          <div className={selectWrapper}>
            <select
              value={selectedColor}
              onChange={handleColorChange}
              disabled={!selectedVariant}
              className={`${inputBase} appearance-none pr-40 ${inputOk} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value="">Select color</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
            <ChevronDown className={selectChevron} />
          </div>
        </div>
      </div>

      {/* ─── Warehouse Batch + School ─── */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        {/* BATCH: shows batches filtered by type+variant+color, sets selectedBatch for sizes */}
        <div>
          <div className={selectWrapper}>
            <select
              value={selectedBatch?.batchId ?? ""}
              onChange={handleBatchChange}
              disabled={!selectedColor}
              aria-invalid={errors.batchId ? "true" : "false"}
              className={`${inputBase} appearance-none pr-40 ${!selectedColor ? "disabled:cursor-not-allowed disabled:opacity-50" : ""} ${errors.batchId ? inputErr : inputOk}`}
            >
              <option value="">{selectedColor ? "Select batch" : "Select color first"}</option>
              {filteredBatches.map((b) => (
                <option key={b.batchId} value={b.batchId}>{b.batchName}</option>
              ))}
            </select>
            <ChevronDown className={selectChevron} />
          </div>
          {errors.batchId && (
            <p className="mt-4 text-body-small text-danger-main">{errors.batchId.message}</p>
          )}
        </div>

        {/* SCHOOL: optional assignment */}
        <div>
          <div className={selectWrapper}>
            <select className={`${inputBase} appearance-none pr-40 ${errors.schoolId ? inputErr : inputOk}`}
              {...register("schoolId")}
            >
              <option value="">None</option>
              {existingSchools.map((school) => (
                <option key={school.schoolId} value={school.schoolId}>{school.schoolName}</option>
              ))}
            </select>
            <ChevronDown className={selectChevron} />
          </div>
          {errors.schoolId && (
            <p className="mt-4 text-body-small text-danger-main">  {errors.schoolId.message}</p>
          )}
        </div>
      </div>

      {/* Description (optional) */}
      <div>
        <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Description (optional)</label>
        <textarea
          rows={3}
          placeholder="Any additional notes..."
          aria-invalid={errors.description ? "true" : "false"}
          className={`${inputBase} resize-none ${errors.description ? inputErr : inputOk}`}
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-4 text-body-small text-danger-main">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Sizes & Quantities (add rows to allocate) */}
      <div className="rounded-card border border-border-default bg-surface-elevated/30 p-20">
        <div className="mb-12 flex items-center justify-between">
          <label className="text-ui-label font-semibold text-text-secondary">
            Sizes &amp; Quantities
          </label>
          <button
            type="button"
            onClick={addRow}
            disabled={!selectedBatch}
            className="inline-flex items-center gap-1 rounded-input border border-border-default bg-surface-default px-3 py-2.5 text-[11px] font-medium text-brand-primary hover:border-brand-subtle hover:bg-brand-tint transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 press-scale"
          >
            <Plus className="h-3 w-3" />
            Add Size
          </button>
        </div>

        {!selectedBatch && (
          <p className="rounded-input border border-dashed border-border-default bg-surface-default p-16 text-center text-body-small text-text-muted mb-12">
            Select a batch to see available sizes.
          </p>
        )}
        {selectedBatch && sizes.length === 0 && (
          <p className="rounded-input border border-dashed border-border-default bg-surface-default p-16 text-center text-body-small text-text-muted mb-12">
            No sizes added yet. Click Add Size to begin.
          </p>
        )}

        <div className="space-y-12">
          {sizes.map((row, index) => {
            return (
                <div
                  key={index}
                  className="flex items-start gap-12 rounded-input bg-surface-default p-16 shadow-elevation-1"
                >
                <div className="flex-1">
                  <label className="mb-4 block text-body-small font-medium text-text-muted">
                    Size
                  </label>
                  <div className={selectWrapper}>
                    <select
                      value={row.size}
                      onChange={(e) => updateRow(index, "size", e.target.value)}
                      className={`${inputBase} appearance-none pr-40 ${inputOk}`}
                    >
                      <option value="">Select size</option>
                      {availableSizes.map((s) => (
                        <option key={s.sizeId} value={s.size}>
                          {s.size} ({s.quantity} available)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={selectChevron} />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="mb-4 block text-body-small font-medium text-text-muted">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={row.quantity}
                    onChange={(e) =>
                      updateRow(index, "quantity", e.target.value)
                    }
                    className={`${inputBase} ${inputOk}`}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="mt-24 rounded-input p-8 text-danger-main hover:bg-danger-bg hover:text-danger-hover transition-colors duration-200 press-scale"
                  aria-label="Remove size"
                >
                  <Trash2 className="h-16 w-16" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-12 pt-8">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-16 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed disabled:cursor-not-allowed disabled:opacity-60 press-scale transition-all duration-200"
        >
          {isPending ? (
            <>
              <Loader2 className="h-14 w-14 animate-spin" />
              Creating...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};
