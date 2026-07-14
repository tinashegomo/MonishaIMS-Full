import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {useCreateProduct,useGetAllWarehouseBatches,useGetAllSchools,} from "@/hooks/InventoryHooks";
import { ProductForm } from "@/components/product/ProductForm";

/**
 * CreateProduct — full-page form for allocating a new product from warehouse stock.
 *
 * Receives RHF data + plain sizes array from ProductForm, merges them
 * into a single payload with productSizes, then sends to backend.
 * On success navigates back to products list.
 */

// ─── State / Hooks ─────────────────────────────────────────────

export default function CreateProduct() {
  const navigate = useNavigate();

  const { data: existingBatches } = useGetAllWarehouseBatches();
  const { data: existingSchools } = useGetAllSchools();
  const { mutate: createProduct, isPending, isError, error } = useCreateProduct();

// ─── Functions ─────────────────────────────────────────────────

  const handleCreate = (data, sizes) => {
    const payload = { ...data, productSizes: sizes };

    createProduct(payload, {
      onSuccess: () => {
        navigate("/products");
      },
      onError: (err) => {
        console.error(err.response?.data);
      },
    });
  };

// ─── Computed Values ───────────────────────────────────────────

  const batches = existingBatches || [];
  const schools = existingSchools || [];

// ─── Render ────────────────────────────────────────────────────

  return (
    <div className="animate-fade-in">
      {/* ── Back Navigation ─── */}
      <Link
        to="/products"
        className="mb-20 inline-flex items-center gap-8 text-body-normal font-medium text-text-secondary hover:text-brand-primary transition-colors duration-200"
      >
        <ArrowLeft className="h-16 w-16" />
        Back to Products
      </Link>

      {/* ── Page Header ─── */}
      <div className="mb-32">
        <h1 className="text-h2 font-bold text-text-primary">Create Product</h1>
        <p className="mt-8 text-body-normal text-text-secondary">
          Allocate a new product from warehouse stock
        </p>
      </div>

      {/* ── Error Banner ─── */}
      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {error.response?.data?.message ||
            "Failed to create product. Please try again."}
        </div>
      )}

      {/* ── Form ─── */}
      <div className="rounded-card bg-surface-default p-24 md:p-32 shadow-elevation-1">
        <ProductForm
          onSubmit={handleCreate}
          isPending={isPending}
          existingBatches={batches}
          existingSchools={schools}
        />
      </div>
    </div>
  );
}
