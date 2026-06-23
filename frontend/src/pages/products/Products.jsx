import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2, Package } from "lucide-react";
import { useGetAllProducts, useDeleteProduct, useGetCurrentUser } from "@/hooks/InventoryHooks";
import { ProductList } from "@/components/product/ProductList";
import ConfirmProductDeleteModal from "@/components/product/ConfirmProductDeleteModal";

/**
 * Products — list page for all allocated products.
 * Shows loading spinner, empty state, error banner, or product table.
 * Delete triggers a confirmation modal before removing.
 */
export default function Products() {
  const { data: user } = useGetCurrentUser();
  const { data: products, isLoading, isError, error } = useGetAllProducts();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const [selectedItem, setSelectedItem] = useState(null);

  // Delete selected product, close modal on success or error
  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    deleteProduct(selectedItem.productId, {
      onSuccess: () => setSelectedItem(null),
      onError: () => setSelectedItem(null),
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-32 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">
            Products Allocation
          </h1>
          <p className="mt-8 text-body-normal text-text-secondary">
            Manage product allocations
          </p>
        </div>
        {user?.userRole !== "USER" && (
          <Link
            to="/products/create-product"
            className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200"
          >
            <Plus className="h-16 w-16" />
            Create Product
          </Link>
        )}
      </div>

      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {error.response?.data?.message ||
            "Failed to load products. Please try again."}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading products...</p>
        </div>
      ) : products && products.length > 0 ? (
        <ProductList
          products={products}
          setSelectedItem={setSelectedItem}
        />
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <div className="mb-16 flex h-64 w-64 items-center justify-center rounded-full bg-brand-tint">
            <Package className="h-32 w-32 text-brand-primary" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">
            No products yet
          </h3>
          <p className="mt-8 max-w-xs text-body-normal text-text-muted">
            Get started by creating your first product allocation.
          </p>
        </div>
      )}

      {selectedItem && (
        <ConfirmProductDeleteModal
          productName={selectedItem.productName}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setSelectedItem(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
