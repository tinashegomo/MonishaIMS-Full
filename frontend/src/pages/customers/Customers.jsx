import { useState } from "react";
import { Pencil, Trash2, Users, Loader2 } from "lucide-react";
import {
  useGetAllCustomers,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/hooks/InventoryHooks";
import { CustomerModal } from "@/components/customer/CustomerModal";

/**
 * Customers — read-only list page with edit and delete.
 * Creation is done during order creation (CustomerInput in CreateOrder).
 */
export default function Customers() {
  // --- Modal state ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // --- Data & mutations ---
  const { data: customers = [], isLoading, isError } = useGetAllCustomers();
  const { mutate: updateCustomer, isPending: isUpdating, error: updateError } = useUpdateCustomer();
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  // --- Handlers ---
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleUpdate = (CustomerRequestDTO) => {
    updateCustomer(
      { customerId: selectedCustomer.customerId, CustomerRequestDTO },
      {
        onSuccess: () => handleCloseModal(),
      }
    );
  };

  const handleDelete = (customerId) => {
    setDeletingId(customerId);
    deleteCustomer(customerId, {
      onSettled: () => setDeletingId(null),
    });
  };

  // --- Render ---
  return (
    <div className="animate-fade-in mx-auto max-w-7xl">
      <div className="mb-32">
        <h1 className="text-h2 font-bold text-text-primary">Customers</h1>
        <p className="mt-8 text-body-normal text-text-secondary">
          View and manage customer details
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading customers...</p>
        </div>
      ) : isError ? (
        <div className="rounded-card bg-surface-default p-24 text-center text-body-normal text-danger-main animate-fade-in">
          Failed to load customers. Please refresh the page.
        </div>
      ) : customers.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <div className="mb-16 flex h-64 w-64 items-center justify-center rounded-full bg-brand-tint">
            <Users className="h-32 w-32 text-brand-primary" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">
            No customers yet
          </h3>
          <p className="mt-8 max-w-xs text-body-normal text-text-muted">
            Customers are created when placing orders.
          </p>
        </div>
      ) : (
        <div className="w-full rounded-card bg-surface-default">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="min-w-[250px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">
                  Customer Name
                </th>
                <th className="min-w-[140px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">
                  Phone Number
                </th>
                <th className="w-40 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">
                  Date Added
                </th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr
                  key={customer.customerId}
                  className="border-b border-border-default/50 last:border-0 hover:bg-surface-muted/40 transition-colors duration-150"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="min-w-[250px] px-6 py-4 font-medium text-text-primary whitespace-nowrap truncate">
                    {customer.customerName}
                  </td>
                  <td className="min-w-[140px] px-6 py-4 text-text-secondary whitespace-nowrap">
                    {customer.phoneNumber}
                  </td>
                  <td className="w-40 px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                    {new Date(customer.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="w-28 px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(customer)}
                      className="rounded-full p-5 text-text-muted hover:bg-surface-muted hover:text-brand-primary transition-all duration-200 press-scale"
                      aria-label={`Edit ${customer.customerName}`}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.customerId)}
                      disabled={isDeleting && deletingId === customer.customerId}
                      className="rounded-full p-5 text-text-muted hover:bg-danger-bg hover:text-danger-main transition-all duration-200 press-scale disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Delete ${customer.customerName}`}
                    >
                      {isDeleting && deletingId === customer.customerId ? (
                        <Loader2 className="w-5 h-5 animate-spin text-danger-main" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update error banner */}
      {updateError && (
        <div className="mt-16 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {updateError.response?.data?.message || "Failed to update customer. Please try again."}
        </div>
      )}

      {/* Edit modal */}
      <CustomerModal
        key={selectedCustomer?.customerId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleUpdate}
        isPending={isUpdating}
        customer={selectedCustomer}
      />
    </div>
  );
}
