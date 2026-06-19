// ══════════════════════════════════════════════════════════════════════════════
// ORDER HELPERS — pure functions + factory functions for item management
// All state-dependent logic lives here. Components import and call these.
// ══════════════════════════════════════════════════════════════════════════════

// ─── Pure helpers (no state) ───

// Reset all dependent fields when source changes
// item.source is already the NEW source at this point
const resetSourceFields = (item) => ({
  ...item,
  productId: "",
  batchId: "",
  size: "",
  type: "",
  variant: "",
  color: "",
  unitPrice: "",
  customMade: item.source === "custom",
});

// Copy product snapshot into item (type, variant, color, price)
const applyProductSnapshot = (item, product) => ({
  ...item,
  size: "",
  unitPrice: product?.productPrice ?? "",
  type: product?.type ?? "",
  variant: product?.variant ?? "",
  color: product?.color ?? "",
});

// Copy batch snapshot into item (type, variant, color, price)
const applyBatchSnapshot = (item, batch) => ({
  ...item,
  size: "",
  unitPrice: batch?.batchPrice ?? "",
  type: batch?.type ?? "",
  variant: batch?.variant ?? "",
  color: batch?.color ?? "",
});

// Validate all items that have required fields before submit
// Returns null if valid, or an error string if invalid
const validateOrderItems = (items) => {
  if (items.length === 0) return "Please add at least one item to the order.";

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.source === "product" && !item.productId)
      return `Item ${i + 1}: Please select a product.`;
    if (item.source === "batch" && !item.batchId)
      return `Item ${i + 1}: Please select a batch.`;
    if ((item.source === "product" || item.source === "batch") && !item.size)
      return `Item ${i + 1}: Please select a size.`;
    if (item.source === "custom" && (!item.type || !item.variant || !item.color || !item.unitPrice))
      return `Item ${i + 1}: Please fill in type, variant, color, and price.`;
    if (!item.quantity || item.quantity < 1)
      return `Item ${i + 1}: Quantity must be at least 1.`;
    if (item.source === "custom" && item.measurementsTaken) {
      if (!item.measurements || item.measurements.length === 0)
        return `Item ${i + 1}: At least one measurement is required.`;
      for (const m of item.measurements) {
        if (!m.measurementName || !m.measurementValue)
          return `Item ${i + 1}: Each measurement needs a name and value.`;
      }
    }
  }

  return null;
};

// Transform frontend items → backend format
// Strips frontend-only fields (source, id), adds source-specific fields
const buildItemsPayload = (items) => {
  return items.map((item) => {
    const base = {
      quantity: item.quantity,
      customMade: item.source === "custom",
      measurementsTaken: item.measurementsTaken,
      measurements: item.measurementsTaken ? item.measurements : [],
    };

    if (item.source === "product")
      return { ...base, productId: item.productId, size: item.size };

    if (item.source === "batch")
      return { ...base, batchId: item.batchId, size: item.size };
      
    return { ...base, type: item.type, variant: item.variant, color: item.color, unitPrice: parseFloat(item.unitPrice) };
  });
};

// ─── Factory functions (return bound helpers) ───

// Creates a manageItem function bound to current state
const createManageItem = (orderItems, setOrderItems, existingProducts, existingBatches) => {
  return (operation, index, field, value) => {
    switch (operation) {
      case "add":
        setOrderItems((prev) => [...prev, {
          id: crypto.randomUUID(),
          source: "product",
          productId: "",
          batchId: "",
          size: "",
          quantity: 1,
          type: "",
          variant: "",
          color: "",
          unitPrice: "",
          customMade: false,
          measurementsTaken: false,
          measurements: [],
        }]);
        break;

      case "remove":
        setOrderItems((prev) => prev.filter((_, i) => i !== index));
        break;

      case "update":
        setOrderItems((prev) => prev.map((item, i) => {
          if (i !== index) return item;

          let updated = { ...item, [field]: value };

          if (field === "source") updated = resetSourceFields(updated);
          if (field === "productId") {
            const product = existingProducts.find((p) => p.productId === value);
            updated = applyProductSnapshot(updated, product);
          }
          if (field === "batchId") {
            const batch = existingBatches.find((b) => b.batchId === value);
            updated = applyBatchSnapshot(updated, batch);
          }

          return updated;
        }));
        break;
    }
  };
};

// Creates a manageMeasurement function bound to current state
const createManageMeasurement = (orderItems, setOrderItems) => {
  return (operation, itemIndex, mIndex, field, value) => {
    switch (operation) {
      case "add":
        setOrderItems((prev) => prev.map((item, i) =>
          i === itemIndex
            ? { ...item, measurements: [...item.measurements, { measurementName: "", measurementValue: "" }] }
            : item
        ));
        break;

      case "remove":
        setOrderItems((prev) => prev.map((item, i) =>
          i === itemIndex
            ? { ...item, measurements: item.measurements.filter((_, j) => j !== mIndex) }
            : item
        ));
        break;

      case "update":
        setOrderItems((prev) => prev.map((item, i) =>
          i === itemIndex
            ? {
                ...item,
                measurements: item.measurements.map((m, j) =>
                  j === mIndex ? { ...m, [field]: value } : m
                ),
              }
            : item
        ));
        break;
    }
  };
};

export {resetSourceFields,applyProductSnapshot,applyBatchSnapshot,validateOrderItems,buildItemsPayload,createManageItem,createManageMeasurement,};
