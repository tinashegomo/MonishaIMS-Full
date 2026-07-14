import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { warehouseBatchRequestSchema, warehouseBatchRequestDefaultValues } from "@/yupSchema/warehouse/request/WarehouseBatchRequestDTO";
import { useWarehouseForm } from "@/hooks/useWarehouseForm";

const inputBase =
  "w-full rounded-input border bg-surface-elevated px-16 py-12 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200";
const inputOk =
  "border-border-default focus:border-border-focus focus-ring";
const inputErr =
  "border-danger-main focus:border-danger-hover focus:ring-2 focus:ring-danger-bg";

export const WarehouseForm = ({ onSubmit, isPending, batches, submitLabel = "Create Batch" }) => {

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(warehouseBatchRequestSchema),
    defaultValues: warehouseBatchRequestDefaultValues,
    mode: "onBlur",
  });

  const {types, variants, colors, handleTypeSelect, handleVariantSelect, handleColorSelect, sizes, addRow, removeRow, updateRow,} = useWarehouseForm({ batches, setValue });

  // Single dropdown state — "type" | "variant" | "color" | null
  const [openDropdown, setOpenDropdown] = useState(null);

  // Watch input values for filtering suggestions
  const typeValue = watch("type") || "";
  const variantValue = watch("variant") || "";
  const colorValue = watch("color") || "";

  // Merge RHF register with custom onChange for dropdown fields
  const typeRegister = register("type");
  const variantRegister = register("variant");
  const colorRegister = register("color");

  // Filter suggestions as user types
  const filteredTypes = types.filter(type =>
    type.toLowerCase().includes(typeValue.toLowerCase())
  );
  const filteredVariants = variants.filter(variant =>
    variant.toLowerCase().includes(variantValue.toLowerCase())
  );
  const filteredColors = colors.filter(color =>
    color.toLowerCase().includes(colorValue.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, sizes))} className="space-y-24">

      {/* ── Batch Name + Price ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Batch Name</label>
          <input
            type="text"
            placeholder="e.g. Summer Batch 2026"
            aria-invalid={errors.batchName ? "true" : "false"}
            className={`${inputBase} ${errors.batchName ? inputErr : inputOk}`}
            {...register("batchName")}
          />
          {errors.batchName && (<p className="mt-4 text-body-small text-danger-main">{errors.batchName.message}</p>)}
        </div>

        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Price Per Unit</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 1500"
            aria-invalid={errors.batchPrice ? "true" : "false"}
            className={`${inputBase} ${errors.batchPrice ? inputErr : inputOk}`}
            {...register("batchPrice")}
          />
          {errors.batchPrice && (<p className="mt-4 text-body-small text-danger-main">{errors.batchPrice.message}</p>)}
        </div>
      </div>

      {/* ── Type → Variant → Color suggestion dropdowns ────────── */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-3">

        {/* ── Type ─── */}
        <div
          className="relative"
          onBlur={(e) => {
            if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
              setOpenDropdown(null);
            }
          }}
        >
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Type</label>
          <input
            {...typeRegister}
            type="text"
            placeholder="e.g. Shirt"
            aria-invalid={errors.type ? "true" : "false"}
            className={`${inputBase} ${errors.type ? inputErr : inputOk}`}
            onFocus={() => setOpenDropdown("type")}
            onChange={(e) => {
              typeRegister.onChange(e);
              setOpenDropdown("type");
            }}
          />
          {openDropdown === "type" && filteredTypes.length > 0 && (
            <div className="absolute z-10 mt-2 w-full rounded-input border border-border-default bg-surface-default shadow-elevation-2 overflow-hidden animate-scale-in">
              {filteredTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleTypeSelect(type);
                    setOpenDropdown(null);
                  }}
                  className="block w-full cursor-pointer px-16 py-6 text-left text-body-small text-text-primary hover:bg-surface-muted transition-colors"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
          {errors.type && (<p className="mt-4 text-body-small text-danger-main">{errors.type.message}</p>)}
        </div>

        {/* ── Variant ─── */}
        <div
          className="relative"
          onBlur={(e) => {
            if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
              setOpenDropdown(null);
            }
          }}
        >
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Variant</label>
          <input
           {...variantRegister}
            type="text"
            placeholder="e.g. Short Sleeve"
            aria-invalid={errors.variant ? "true" : "false"}
            className={`${inputBase} ${errors.variant ? inputErr : inputOk}`}
            onFocus={() => setOpenDropdown("variant")}
            onChange={(e) => {
              variantRegister.onChange(e);
              setOpenDropdown("variant");
            }}
          />
          {openDropdown === "variant" && filteredVariants.length > 0 && (
            <div className="absolute z-10 mt-2 w-full rounded-input border border-border-default bg-surface-default shadow-elevation-2 overflow-hidden animate-scale-in">
              {filteredVariants.map((variant) => (
                <button
                  key={variant}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleVariantSelect(variant);
                    setOpenDropdown(null);
                  }}
                  className="block w-full cursor-pointer px-16 py-6 text-left text-body-small text-text-primary hover:bg-surface-muted transition-colors"
                >
                  {variant}
                </button>
              ))}
            </div>
          )}
          {errors.variant && (<p className="mt-4 text-body-small text-danger-main">{errors.variant.message}</p>)}
        </div>

        {/* ── Color ─── */}
        <div
          className="relative"
          onBlur={(e) => {
            if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
              setOpenDropdown(null);
            }
          }}
        >
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Color</label>
          <input
            {...colorRegister}
            type="text"
            placeholder="e.g. White"
            aria-invalid={errors.color ? "true" : "false"}
            className={`${inputBase} ${errors.color ? inputErr : inputOk}`}
            onFocus={() => setOpenDropdown("color")}
            onChange={(e) => {
              colorRegister.onChange(e);
              setOpenDropdown("color");
            }}
          />
          {openDropdown === "color" && filteredColors.length > 0 && (
            <div className="absolute z-10 mt-2 w-full rounded-input border border-border-default bg-surface-default shadow-elevation-2 overflow-hidden animate-scale-in">
              {filteredColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleColorSelect(color);
                    setOpenDropdown(null);
                  }}
                  className="block w-full cursor-pointer px-16 py-6 text-left text-body-small text-text-primary hover:bg-surface-muted transition-colors"
                >
                  {color}
                </button>
              ))}
            </div>
          )}
          {errors.color && (<p className="mt-4 text-body-small text-danger-main">{errors.color.message}</p>)}
        </div>
      </div>

      {/* ── Description (optional) ─────────────────────────────── */}
      <div>
        <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Description (optional)</label>
        <textarea
          rows={3}
          placeholder="Any additional notes..."
          aria-invalid={errors.description ? "true" : "false"}
          className={`${inputBase} resize-none ${errors.description ? inputErr : inputOk}`}
          {...register("description")}
        />
        {errors.description && (<p className="mt-4 text-body-small text-danger-main">{errors.description.message}</p>)}
      </div>

      {/* ── Sizes & Quantities ─────────────────────────────────── */}
      <div className="rounded-card border border-border-default bg-surface-elevated/30 p-20">
        <div className="mb-12 flex items-center justify-between">
          <label className="text-ui-label font-semibold text-text-secondary">Sizes &amp; Quantities</label>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1 rounded-input border border-border-default bg-surface-default px-3 py-2.5 text-[11px] font-medium text-brand-primary hover:border-brand-subtle hover:bg-brand-tint transition-all duration-200 press-scale"
          >
            <Plus className="h-3 w-3" />
            Add Size
          </button>
        </div>

        {sizes.length === 0 && (
          <p className="rounded-input border border-dashed border-border-default bg-surface-default p-16 text-center text-body-small text-text-muted">
            No sizes added yet. Click Add Size to begin.
          </p>
        )}

        <div className="space-y-12">
          {sizes.map((row, index) => (
            <div key={index} className="flex items-start gap-12 rounded-input bg-surface-default p-16 shadow-elevation-1">
              <div className="flex-1">
                <label className="mb-4 block text-body-small font-medium text-text-muted">Size</label>
                <input
                  type="text"
                  placeholder="e.g. 32, XL, 10"
                  value={row.size}
                  onChange={(e) => updateRow(index, "size", e.target.value)}
                  className={`${inputBase} ${inputOk}`}
                />
              </div>

              <div className="flex-1">
                <label className="mb-4 block text-body-small font-medium text-text-muted">Quantity</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={row.quantity}
                  onChange={(e) => updateRow(index, "quantity", e.target.value)}
                  className={`${inputBase} ${inputOk}`}
                />
              </div>

              <button
                type="button"
                onClick={() => removeRow(index)}
                className="mt-24 rounded-input p-8 text-danger-main hover:bg-danger-bg hover:text-danger-hover transition-colors duration-200 press-scale"
              >
                <Trash2 className="h-16 w-16" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Submit ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-12 pt-8">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-16 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed disabled:cursor-not-allowed disabled:opacity-60 press-scale transition-all duration-200"
        >
          {isPending ? (<><Loader2 className="h-14 w-14 animate-spin" />Creating...</>) : (submitLabel)}
        </button>
      </div>
    </form>
  );
};
