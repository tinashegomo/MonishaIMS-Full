import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateWarehouseBatch, useGetAllWarehouseBatches } from "@/hooks/InventoryHooks";
import { WarehouseForm } from "@/components/warehouse/WarehouseForm";

/**
 * CreateWarehouseBatchPage — full-page form for creating a new warehouse batch.
 *
 * Receives RHF data + plain sizes array from WarehouseForm, merges them
 * into a single payload with batchSizes, then sends to backend.
 * On success navigates back to warehouse list.
 */
const CreateWarehouseBatchPage = () => {
  const navigate = useNavigate();

  const { data: warehouseBatches = [] } = useGetAllWarehouseBatches();

  const { mutate: createBatch, isPending: isCreatingBatch } = useCreateWarehouseBatch();

  const handleCreate = (data, sizes) => {
    const payload = { ...data, batchSizes: sizes };

    createBatch(payload, {
      onSuccess: () => {
        navigate("/warehouse");
      },
      onError: (error) => {
        console.error(error.response?.data);
      },
    });
  };

  return (
    <div className="animate-fade-in">
      <Link
        to="/warehouse"
        className="mb-20 inline-flex items-center gap-8 text-body-normal font-medium text-text-secondary hover:text-brand-primary transition-colors duration-200"
      >
        <ArrowLeft className="h-16 w-16" />
        Back to Warehouse
      </Link>

      <div className="mb-32">
        <h1 className="text-h2 font-bold text-text-primary">Create Batch</h1>
        <p className="mt-8 text-body-normal text-text-secondary">
          Add a new batch to warehouse stock
        </p>
      </div>

      <div className="rounded-card bg-surface-default p-24 md:p-32 shadow-elevation-1">
        <WarehouseForm
          onSubmit={handleCreate}
          isPending={isCreatingBatch}
          batches={warehouseBatches}
        />
      </div>
    </div>
  );
};

export default CreateWarehouseBatchPage;
