// ══════════════════════════════════════════════════════════════════════════════
// ORDER HELPERS — Small, smart tools for calculations, data cleaning, and rules.
// Think of this file like the "Calculator and Cheat Sheet" on the shop counter.
// None of these functions have "memory" (no state). They just take input, do
// the math or check the rules, and hand back the clean output.
// ══════════════════════════════════════════════════════════════════════════════

// ─── Helper functions (no state needed) ───

// Reset all fields when the user switches the item type
// (e.g., switching from "Product" to "Custom Tailored")
// item.source has already been set to the new value ("product", "batch", or "custom")
const resetSourceFields = (item) => ({
  ...item,
  productId: "", // Wipes out selected product ID
  batchId: "",   // Wipes out selected warehouse batch ID
  size: "",      // Wipes out selected size
  type: "",      // Wipes out typed type
  variant: "",   // Wipes out typed variant
  color: "",     // Wipes out typed color
  unitPrice: "", // Wipes out typed price
  // Mark as customMade if the user chose "custom"
  customMade: item.source === "custom",
});

// Copy product details into the item row
// When a user picks a product, we COPY the current price and details from the catalog.
// This is a snapshot: if the price of the product changes tomorrow, past orders
// still remember this exact price they were bought at!
const copyProductDetails = (item, product) => ({
  ...item,
  size: "",                                 // Clear size so user is forced to pick a size for this specific product
  unitPrice: product?.productPrice ?? "",   // Copy the selling price (e.g., $25.00)
  type: product?.type ?? "",                // Copy product type (e.g., "Tops")
  variant: product?.variant ?? "",          // Copy product variant (e.g., "Classic T-Shirt")
  color: product?.color ?? "",              // Copy product color (e.g., "White")
});

// Copy batch details into the item row
// When a user picks a warehouse batch directly, we COPY its details.
// Like products, this protects the price record at the time of purchase.
const copyBatchDetails = (item, batch) => ({
  ...item,
  size: "",                                 // Clear size so user is forced to pick a size for this batch
  unitPrice: batch?.batchPrice ?? "",       // Copy the batch selling price (e.g., $20.00)
  type: batch?.type ?? "",                  // Copy batch type (e.g., "Tops")
  variant: batch?.variant ?? "",            // Copy batch variant (e.g., "Classic T-Shirt")
  color: batch?.color ?? "",                // Copy batch color (e.g., "White")
});

// Validate all order items before letting the user submit
// It goes through the list of items line-by-line to check if any info is missing.
// Returns null if everything is correct, or a simple error message if something is wrong.
const validateOrderItems = (items) => {
  // Rule: An order must have at least one item
  if (items.length === 0) return "Please add at least one item to the order.";

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Rule: If source is product, you must select a product ID
    if (item.source === "product" && !item.productId)
      return `Item ${i + 1}: Please select a product.`;
      
    // Rule: If source is batch, you must select a batch ID
    if (item.source === "batch" && !item.batchId)
      return `Item ${i + 1}: Please select a batch.`;
      
    // Rule: Products and batches must have a size selected (e.g., "S", "M", "L")
    if ((item.source === "product" || item.source === "batch") && !item.size)
      return `Item ${i + 1}: Please select a size.`;
      
    // Rule: Custom tailored items must have type, variant, color, and price typed in
    if (item.source === "custom" && (!item.type || !item.variant || !item.color || !item.unitPrice))
      return `Item ${i + 1}: Please fill in type, variant, color, and price.`;
      
    // Rule: Quantity must be 1 or more
    if (!item.quantity || item.quantity < 1)
      return `Item ${i + 1}: Quantity must be at least 1.`;
      
    // Rule: If custom tailored item has measurements, they must be filled in
    if (item.source === "custom" && item.measurementsTaken) {
      if (!item.measurements || item.measurements.length === 0)
        return `Item ${i + 1}: At least one measurement is required.`;
      for (const m of item.measurements) {
        if (!m.measurementName || !m.measurementValue)
          return `Item ${i + 1}: Each measurement needs a name and value (e.g., "Chest: 38 inches").`;
      }
    }
  }

  return null; // All rules passed!
};

// Transform frontend items into the exact shape the server (backend) expects
// This cleans up our "dirty" frontend notes by removing temporary UI fields:
// - Strips out "id" (temporary UUID used only for React row rendering)
// - Strips out "source" (only used for frontend layout/dropdown toggle)
// - Converts text price to a real decimal number for calculation
const buildItemsPayload = (items) => {
  return items.map((item) => {
    const base = {
      quantity: item.quantity,
      customMade: item.source === "custom",
      measurementsTaken: item.measurementsTaken,
      // If no measurements were taken, send an empty list
      measurements: item.measurementsTaken ? item.measurements : [],
    };

    // If it's a product: link to productId and size
    if (item.source === "product")
      return { ...base, productId: item.productId, size: item.size };

    // If it's a warehouse batch: link to batchId and size
    if (item.source === "batch")
      return { ...base, batchId: item.batchId, size: item.size };
      
    // If it's a custom tailored item: send the custom typed details and price
    return { ...base, type: item.type, variant: item.variant, color: item.color, unitPrice: parseFloat(item.unitPrice) };
  });
};

export {resetSourceFields,copyProductDetails,copyBatchDetails,validateOrderItems,buildItemsPayload};
