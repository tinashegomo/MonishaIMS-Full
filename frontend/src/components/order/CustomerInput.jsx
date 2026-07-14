import { useState, useMemo } from "react";
import { UserPlus, Check } from "lucide-react";

const inputBase =
  "w-full rounded-input border bg-surface-elevated px-16 py-12 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200";
const inputOk =
  "border-border-default focus:border-border-focus focus-ring";
const inputErr =
  "border-danger-main focus:border-danger-hover focus:ring-2 focus:ring-danger-bg";

/**
 * CustomerInput — typeahead with inline new-customer expansion.
 *
 * Shows a dropdown of existing customers as the user types.
 * If no match found, expands inline fields for creating a new customer.
 *
 * customerMode: true = existing customer, false = new customer, null = nothing selected
 */
export default function CustomerInput({ register, setValue, errors, customers = [], customerMode, setCustomerMode, selectedCustomer, setSelectedCustomer }) {

  // ─── State ──────────────────────────────────────────────────
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // ─── Computed Values ────────────────────────────────────────
  const matchingCustomers = useMemo(() => {
    if (!searchText.trim()) return [];
    const query = searchText.toLowerCase();
    return customers.filter((customer) => customer.customerName.toLowerCase().includes(query));
  }, [customers, searchText]);

  const showDropdown = isFocused && matchingCustomers.length > 0;

  // ─── Functions ──────────────────────────────────────────────

  const handleSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerMode(true);
    setValue("customerName", customer.customerName);
    setValue("customerId", customer.customerId);
    setValue("phoneNumber", "");
    setSearchText("");
    setIsFocused(false);
  };

  const handleCreateNew = () => {
    setCustomerMode(false);
    setValue("customerId", "");
    setIsFocused(false);
  };

  const handleClear = () => {
    setSelectedCustomer(null);
    setCustomerMode(null);
    setValue("customerId", "");
    setValue("phoneNumber", "");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div className="space-y-12">

      {/* ── Customer Name Input ─────────────────────────────────── */}
      <div>
        <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
          Customer Name
        </label>
        <div
          className="relative"
          tabIndex={-1}
          onBlur={(e) => {
            if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
              setIsFocused(false);
            }
          }}
        >
          <input
            type="text"
            placeholder="Type customer name..."
            aria-invalid={errors.customerName ? "true" : "false"}
            className={`${inputBase} ${errors.customerName ? inputErr : inputOk}`}
            onFocus={() => setIsFocused(true)}
            {...register("customerName")}
            onChange={(e) => {
              register("customerName").onChange(e);
              handleInputChange(e);
            }}
          />

          {/* Search results dropdown */}
          {showDropdown && (
            <div className="absolute z-10 mt-2 w-full rounded-input border border-border-default bg-surface-default shadow-elevation-2 max-h-200 overflow-y-auto animate-scale-in">
              {matchingCustomers.map((customer) => (
                <button
                  key={customer.customerId}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(customer);
                  }}
                  className="flex w-full items-center justify-between px-16 py-10 cursor-pointer hover:bg-surface-muted transition-colors"
                >
                  <div className="text-left">
                    <p className="text-body-normal font-medium text-text-primary">
                      {customer.customerName}
                    </p>
                    <p className="text-body-small text-text-muted">
                      {customer.phoneNumber}
                    </p>
                  </div>
                  {selectedCustomer?.customerId === customer.customerId && (
                    <Check className="h-14 w-14 text-brand-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {errors.customerName && (
          <p className="mt-4 text-body-small text-danger-main">
            {errors.customerName.message}
          </p>
        )}
      </div>

      {/* ── Selected Existing Customer Info ─────────────────────── */}
      {customerMode === true && selectedCustomer && (
        <div className="rounded-input border border-brand-subtle bg-brand-tint px-16 py-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-normal font-medium text-text-primary">
                {selectedCustomer.customerName}
              </p>
              <p className="text-body-small text-text-secondary">
                {selectedCustomer.phoneNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-input px-8 py-4 text-body-small font-medium text-brand-primary hover:bg-brand-subtle hover:text-brand-hover transition-colors press-scale"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* ── Create New Customer Prompt ──────────────────────────── */}
      {customerMode === null && !selectedCustomer && searchText.trim().length > 0 && matchingCustomers.length === 0 && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleCreateNew();
          }}
          className="flex w-full items-center gap-10 rounded-input border border-dashed border-brand-subtle bg-brand-tint/50 px-16 py-12 text-body-normal font-medium text-brand-primary hover:bg-brand-tint transition-all duration-200 press-scale"
        >
          <UserPlus className="h-16 w-16" />
          Create new customer &ldquo;{searchText}&rdquo;
        </button>
      )}

      {/* ── New Customer Fields (Inline Expansion) ──────────────── */}
      {customerMode === false && (
        <div className="space-y-12 rounded-input border border-brand-subtle bg-brand-tint/30 p-16">
          <div className="flex items-center gap-8">
            <UserPlus className="h-14 w-14 text-brand-primary" />
            <p className="text-body-normal font-medium text-brand-primary">
              New customer — {selectedCustomer?.customerName || searchText}
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="ml-auto rounded-input px-8 py-4 text-body-small font-medium text-brand-primary hover:bg-brand-subtle hover:text-brand-hover transition-colors press-scale"
            >
              Cancel
            </button>
          </div>

          {/* Phone Number (required for new customers) */}
          <div>
            <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
              Phone Number <span className="text-danger-main">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. +263 77 123 4567"
              aria-invalid={errors.phoneNumber ? "true" : "false"}
              className={`${inputBase} ${errors.phoneNumber ? inputErr : inputOk}`}
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (<p className="mt-4 text-body-small text-danger-main">{errors.phoneNumber.message}</p>)}
          </div>
        </div>
      )}
    </div>
  );
}
