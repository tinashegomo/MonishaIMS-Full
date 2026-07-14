import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {useGetAllCustomers,useGetAllProducts,useGetAllWarehouseBatches,useGetAllSchools,useCreateCustomer,useCreateOrder,} from "@/hooks/InventoryHooks";
import {orderRequestSchema,orderRequestDefaultValues,} from "@/yupSchema/order/OrderRequestDTO";
import {validateOrderItems,buildItemsPayload,} from "@/helpers/order/orderHelpers";
import {useCreateOrderForm} from "@/hooks/useCreateOrderForm";
import CustomerInput from "@/components/order/CustomerInput";
import OrderItemList from "@/components/order/OrderItemList";

// ─── Shared input styles ─────────────────────────────────────────────
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
 * CreateOrder — full-page form for creating a new order.
 * Flow:
 * 1. Select or create customer (inline expansion for new customers)
 * 2. Add order items (product, batch, or custom)
 * 3. Set payment and collection details
 * 4. On submit: create customer if new → then create order
 */
export default function CreateOrder() {
  const navigate = useNavigate();

  // ─── Data fetching ──────────────────────────────────────────────
  const { data: existingCustomers = [] } = useGetAllCustomers();
  const { data: existingProducts = [] } = useGetAllProducts();
  const { data: existingBatches = [] } = useGetAllWarehouseBatches();
  const { data: existingSchools = [] } = useGetAllSchools();

  // ─── Mutations ──────────────────────────────────────────────────
  const { mutate: createCustomer, isPending: isCreatingCustomer } = useCreateCustomer();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const isPending = isCreatingCustomer || isCreatingOrder;

  // ─── RHF: form registration + validation ────────────────────────
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(orderRequestSchema),
    defaultValues: orderRequestDefaultValues,
    mode: "onBlur",
  });

  // ─── Hook: state, computed values, handlers ───────────────────
  const {customerMode, setCustomerMode, selectedCustomer, setSelectedCustomer, orderItems, totalAmount, balance,manageItem, manageMeasurement,
  } = useCreateOrderForm({ watch, existingProducts, existingBatches });

  // ─── Functions: build payload ───────────────────────────────────
  const buildOrderPayload = (data, itemsPayload) => ({
    paidAmount: parseFloat(data.paidAmount),
    notes: data.notes || null,
    schoolId: data.schoolId || null,
    orderItems: itemsPayload,
  });

  // ─── Functions: form submit ─────────────────────────────────────
  const handleFormSubmit = (data) => {
    // ── Step 1: Validate all order items have required fields ────
    const error = validateOrderItems(orderItems);
    if (error) {
      alert(error);
      return;
    }

    // ── Step 2: Transform items to backend format ────────────────
    // Strips frontend-only fields (source, id), adds source-specific fields
    const itemsPayload = buildItemsPayload(orderItems);

    // ── Step 3: Build full order payload ─────────────────────────
    // Combines form fields (paidAmount, notes, schoolId) with items
    const orderPayload = buildOrderPayload(data, itemsPayload);

    // ── Step 4: Submit ──────────────────────────────────────────
    // Backend requires customerId — create customer first if new
    if (customerMode === false || !data.customerId) {
      // New customer: create customer first, then create order with returned customerId
      createCustomer(
        { customerName: data.customerName, phoneNumber: data.phoneNumber },
        {
          onSuccess: (createdCustomer) => {
            createOrder(
              { ...orderPayload, customerId: createdCustomer.customerId },
              {
                onSuccess: () => navigate("/orders"),
                onError: (err) => console.error("Failed to create order:", err.response?.data || err),
              }
            );
          },
          onError: (err) => console.error("Failed to create customer:", err.response?.data || err),
        }
      );
    } else {
      // Existing customer: create order directly with selected customerId
      createOrder(
        { ...orderPayload, customerId: data.customerId },
        {
          onSuccess: () => navigate("/orders"),
          onError: (err) => console.error("Failed to create order:", err.response?.data || err),
        }
      );
    }
  };

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in">
      {/* Back link */}
      <Link
        to="/orders"
        className="mb-20 inline-flex items-center gap-8 text-body-normal font-medium text-text-secondary hover:text-brand-primary transition-colors duration-200"
      >
        <ArrowLeft className="h-16 w-16" />
        Back to Orders
      </Link>

      {/* Page header */}
      <div className="mb-32">
        <h1 className="text-h2 font-bold text-text-primary">Create Order</h1>
        <p className="mt-8 text-body-normal text-text-secondary">
          Create a new customer order
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-24">
        {/* ── SECTION 1: Customer ──────────────────────────────── */}
        <div className="rounded-card bg-surface-default p-24 shadow-elevation-1">
          <h2 className="mb-16 text-h4 font-semibold text-text-primary">Customer</h2>
          <CustomerInput
            register={register}
            setValue={setValue}
            errors={errors}
            customers={existingCustomers}
            customerMode={customerMode}
            setCustomerMode={setCustomerMode}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
          />
        </div>

        {/* ── SECTION 2: School (optional) ─────────────────────── */}
        <div className="rounded-card bg-surface-default p-24 shadow-elevation-1">
          <h2 className="mb-16 text-h4 font-semibold text-text-primary">
            School <span className="text-text-muted">(optional)</span>
          </h2>
          <div className={selectWrapper}>
            <select
              className={`${inputBase} appearance-none pr-40 ${inputOk}`}
              {...register("schoolId")}
            >
              <option value="">No school — general order</option>
              {existingSchools.map((school) => (
                <option key={school.schoolId} value={school.schoolId}>{school.schoolName}</option>
              ))}
            </select>
            <ChevronDown className={selectChevron} />
          </div>
        </div>

        {/* ── SECTION 3: Order Items ───────────────────────────── */}
        <OrderItemList
          orderItems={orderItems}
          existingProducts={existingProducts}
          existingBatches={existingBatches}
          manageItem={manageItem}
          manageMeasurement={manageMeasurement}
        />

        {/* ── SECTION 4: Payment & Collection ──────────────────── */}
        <div className="rounded-card bg-surface-default p-24 shadow-elevation-1">
          <h2 className="mb-16 text-h4 font-semibold text-text-primary">Payment &amp; Collection</h2>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {/* Paid Amount */}
            <div>
              <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
                Paid Amount <span className="text-danger-main">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                aria-invalid={errors.paidAmount ? "true" : "false"}
                className={`${inputBase} ${errors.paidAmount ? inputErr : inputOk}`}
                {...register("paidAmount")}
              />
              {errors.paidAmount && (
                <p className="mt-4 text-body-small text-danger-main">{errors.paidAmount.message}</p>
              )}
            </div>

            {/* Balance preview */}
            <div>
              <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Balance</label>
              <div
                className={`${inputBase} ${
                  balance > 0
                    ? "text-danger-main"
                    : balance === 0 && totalAmount > 0
                    ? "text-success-main"
                    : ""
                }`}
              >
                ${balance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-16">
            <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
              Notes <span className="text-text-muted">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Any additional notes..."
              className={`${inputBase} resize-none ${inputOk}`}
              {...register("notes")}
            />
          </div>
        </div>

        {/* ── SECTION 5: Summary & Submit ──────────────────────── */}
        <div className="rounded-card bg-surface-default p-24 shadow-elevation-1">
          <div className="flex flex-col gap-16 md:flex-row md:items-center md:justify-between">
            {/* Total */}
            <div>
              <p className="text-body-small text-text-muted">Total Amount</p>
              <p className="text-h3 font-bold text-text-primary">${totalAmount.toLocaleString()}</p>
              <p className="text-body-small text-text-muted">
                {orderItems.length} item{orderItems.length !== 1 ? "s" : ""}
                {balance > 0 && (
                  <span className="text-danger-main"> · ${balance.toLocaleString()} outstanding</span>
                )}
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-16 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed disabled:cursor-not-allowed disabled:opacity-60 press-scale transition-all duration-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-14 w-14 animate-spin" />
                  {isCreatingCustomer ? "Creating customer..." : "Creating order..."}
                </>
              ) : (
                "Create Order"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
