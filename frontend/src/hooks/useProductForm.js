import { useState, useMemo } from "react";

/**
 * useProductForm — custom hook for product creation form.
 *
 * Manages:
 * - Dependent dropdown state (Type → Variant → Color → Batch)
 * - Sizes array (plain React state)
 * - Filtered dropdown options (filtered by cascade)
 * - Cascade change handlers (reset downstream on upstream change)
 * - Size operations (add, remove, update)
 *
 * Receives RHF's `setValue` from the component.
 */
export const useProductForm = ({ existingBatches = [], existingSchools = [], setValue }) => {

  // ─── State: dependent dropdown selections ────────────────────────
  const [selectedType, setSelectedType] = useState("");       // first in cascade
  const [selectedVariant, setSelectedVariant] = useState(""); // second, filtered by type
  const [selectedColor, setSelectedColor] = useState("");     // third, filtered by type+variant
  const [selectedBatch, setSelectedBatch] = useState(null);   // fourth, filtered by type+variant+color

  // ─── State: sizes array ──────────────────────────────────────────
  const [sizes, setSizes] = useState([]); // [{ size: "M", quantity: "10" }, ...]

  // ─── Computed Values: dropdown options (filtered by cascade) ──

  // Types: unique type values from all batches
  const types = useMemo(() => {
    return [...new Set(existingBatches.map((b) => b.type))];
  }, [existingBatches]);

  // Variants: filtered by selected type
  const variants = useMemo(() => {
    if (!selectedType) return [];
    return [...new Set(existingBatches.filter((b) => b.type === selectedType).map((b) => b.variant))];
  }, [existingBatches, selectedType]);

  // Colors: filtered by selected type + variant
  const colors = useMemo(() => {
    if (!selectedType || !selectedVariant) return [];
    return [...new Set(existingBatches.filter((b) => b.type === selectedType && b.variant === selectedVariant).map((b) => b.color))];
  }, [existingBatches, selectedType, selectedVariant]);

  // Filtered batches: exact match on type + variant + color
  const filteredBatches = useMemo(() => {
    if (!selectedType || !selectedVariant || !selectedColor) return [];
    return existingBatches.filter(
      (b) =>
        b.type === selectedType &&
        b.variant === selectedVariant &&
        b.color === selectedColor
    );
  }, [existingBatches, selectedType, selectedVariant, selectedColor]);

  // Available sizes from selected batch
  const availableSizes = selectedBatch?.batchSizes ?? [];

  // ─── Functions: cascade change handlers ──────────────────────────

  // Type change: reset variant, color, batch, sizes
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedVariant("");
    setSelectedColor("");
    setSelectedBatch(null);
    setSizes([]);
    setValue("batchId", "");
  };

  // Variant change: reset color, batch, sizes
  const handleVariantChange = (e) => {
    setSelectedVariant(e.target.value);
    setSelectedColor("");
    setSelectedBatch(null);
    setSizes([]);
    setValue("batchId", "");
  };

  // Color change: reset batch, sizes
  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    setSelectedBatch(null);
    setSizes([]);
    setValue("batchId", "");
  };

  // Batch change: resolve batch object, set batchId for RHF validation
  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    const match = existingBatches.find((b) => b.batchId === batchId);
    setSelectedBatch(match || null);
    setValue("batchId", batchId, { shouldValidate: true });
    setSizes([]);
  };

  // ─── Functions: size operations (add, remove, update) ──────────

  // Add a new empty size row
  const addRow = () => {
    setSizes([...sizes, { size: "", quantity: "" }]);
  };

  // Remove a size row by index
  const removeRow = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  // Update a specific field (size or quantity) in a row
  const updateRow = (index, field, value) => {
    const updated = [...sizes];
    updated[index] = { ...updated[index], [field]: value };
    setSizes(updated);
  };

  // ─── Return ──────────────────────────────────────────────────────
  return {
    // State (for conditional rendering in JSX)
    selectedType,
    selectedVariant,
    selectedColor,
    selectedBatch,
    sizes,
    // Filtered dropdown options
    types,
    variants,
    colors,
    filteredBatches,
    availableSizes,
    // Cascade change handlers
    handleTypeChange,
    handleVariantChange,
    handleColorChange,
    handleBatchChange,
    // Size operations
    addRow,
    removeRow,
    updateRow,
  };
};
