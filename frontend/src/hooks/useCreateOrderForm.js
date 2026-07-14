import { useState, useMemo } from "react";
import { resetSourceFields, copyProductDetails, copyBatchDetails } from "@/helpers/order/orderHelpers";

/**
 * useCreateOrderForm — Custom React Hook.
 * Think of this like the "Waiter's Notebook." It holds and updates the active, 
 * changing memory of the order while the user is filling out the form on screen.
 *
 * It manages:
 * - Customer mode (picking existing customer vs creating a new one inline)
 * - The list of active order items (adding/removing/updating rows)
 * - Custom measurements per custom-tailored item
 * - Running, live math calculations (total amount, balance remaining)
 */
export const useCreateOrderForm = ({ watch, existingProducts = [], existingBatches = [] }) => {

  // ─── State: customer mode + selection ───────────────────────────
  // customerMode: 
  // - true = user selected an existing customer from search
  // - false = user wants to type in details for a new customer
  // - null = nothing selected yet (shows selection options)
  const [customerMode, setCustomerMode] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // ─── State: order items list ─────────────────────────────────────
  // This array stores all the items currently added to the order.
  // Each item is a separate object in the array.
  const [orderItems, setOrderItems] = useState([]);

  // ─── Computed Values: totals ──────────────────────────────────
  // Live running total of all items in the list.
  // Recalculates automatically every time orderItems changes.
  const totalAmount = useMemo(() => {
    return orderItems.reduce((sum, item) => {
      const price = parseFloat(item.unitPrice) || 0;
      const qty = parseInt(item.quantity) || 0;
      return sum + price * qty; // Total = Sum of (price x quantity) for each item
    }, 0);
  }, [orderItems]);

  // Read the "Paid Amount" input field from React Hook Form in real time
  const paidAmount = parseFloat(watch("paidAmount")) || 0;
  
  // Outstanding debt (Total - Deposit)
  const balance = totalAmount - paidAmount;

  // ─── Functions: item management ─────────────────────────────────

  // manageItem — Add, remove, or update items in the order.
  // This is passed down to components to let them edit the notebook.
  //
  // Arguments:
  // - operation: "add", "remove", or "update"
  // - index: The row number being edited (0, 1, 2...)
  // - field: The field name being updated (e.g., "quantity", "productId", "size")
  // - value: The new value being typed or selected
  const manageItem = (operation, index, field, value) => {
    switch (operation) {
      
      // Case A: User clicked "+ Add Item"
      case "add":
        setOrderItems([...orderItems, {
          id: crypto.randomUUID(), // Unique stable key so React can render rows correctly
          source: "product",       // Default starting type is "product"
          productId: "",
          batchId: "",
          size: "",
          quantity: 1,             // Default quantity starts at 1
          type: "",
          variant: "",
          color: "",
          unitPrice: "",
          customMade: false,
          measurementsTaken: false,
          measurements: [],
        }]);
        break;

      // Case B: User clicked the trash can button
      case "remove":
        // Filters out the item at the specified index, removing the row
        setOrderItems(orderItems.filter((_, i) => i !== index));
        break;

      // Case C: User typed or selected an input in a row (e.g., changed quantity or picked a product)
      case "update":
        setOrderItems(orderItems.map((item, i) => {
          // Loop through all items: if it's not our row, leave it alone
          if (i !== index) return item;

          // If it is our row, create a copy of the item and apply the new value
          let updated = { ...item, [field]: value };

          // Special Check 1: If the user changed the source type (e.g., switched from Product to Custom)
          // We must call our helper to wipe clean all selected IDs and old details
          if (field === "source") updated = resetSourceFields(updated);
          
          // Special Check 2: If the user picked a Product from the dropdown
          // We call our helper to automatically copy the product's price, color, and variant
          if (field === "productId") {
            const product = existingProducts.find((p) => p.productId === value);
            updated = copyProductDetails(updated, product);
          }
          
          // Special Check 3: If the user picked a Batch from the dropdown
          // We call our helper to automatically copy the batch's price, color, and variant
          if (field === "batchId") {
            const batch = existingBatches.find((b) => b.batchId === value);
            updated = copyBatchDetails(updated, batch);
          }

          return updated;
        }));
        break;
    }
  };

  // ─── Functions: measurement management ──────────────────────────

  // manageMeasurement — Add, remove, or update measurements for custom tailored items.
  //
  // Arguments:
  // - operation: "add", "remove", or "update"
  // - itemIndex: The row index of the order item (0, 1, 2...)
  // - mIndex: The index of the measurement inside that item's list (0, 1, 2...)
  // - field: The field name ("measurementName" or "measurementValue")
  // - value: The text being typed (e.g., "Chest" or "38 inches")
  const manageMeasurement = (operation, itemIndex, mIndex, field, value) => {
    switch (operation) {
      
      // Case A: User clicked "Add Measurement" button on a custom item row
      case "add":
        setOrderItems(orderItems.map((item, i) => i === itemIndex ? { ...item, measurements: [...item.measurements, { measurementName: "", measurementValue: "" }] } : item));
        break;

      // Case B: User clicked the trash can next to a measurement row
      case "remove":
        setOrderItems(orderItems.map((item, i) => i === itemIndex ? { ...item, measurements: item.measurements.filter((_, j) => j !== mIndex) } : item));
        break;

      // Case C: User typed a name (e.g., "Waist") or a value (e.g., "34 inches")
      case "update":
        setOrderItems(orderItems.map((item, i) => i === itemIndex ? { ...item, measurements: item.measurements.map((m, j) => j === mIndex ? { ...m, [field]: value } : m) }: item));
        break;
      }
  };

  // ─── Return ──────────────────────────────────────────────────────
  return {
    // Customer state getters/setters
    customerMode, setCustomerMode,
    selectedCustomer, setSelectedCustomer,
    // Order items list
    orderItems,
    // Live calculated totals
    totalAmount, balance,
    // Handler functions to let components edit the notebook
    manageItem,
    manageMeasurement,
  };
};
