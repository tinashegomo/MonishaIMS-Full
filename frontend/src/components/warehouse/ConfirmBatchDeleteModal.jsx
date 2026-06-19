import { Loader2, X } from "lucide-react";

/**
 * ConfirmBatchDeleteModal — confirmation dialog before deleting a batch.
 * Shows batch name and warns that the action cannot be undone.
 */
export default function ConfirmBatchDeleteModal({ batchName, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-1000/50 backdrop-blur-sm animate-fade-in">
      <div className="mx-16 w-full max-w-sm rounded-panel bg-surface-default p-24 shadow-elevation-4 animate-scale-in">

        {/* Header with close button */}
        <div className="mb-16 flex items-center justify-between">
          <h3 className="text-h4 font-semibold text-text-primary">Delete Batch</h3>

          <button onClick={onCancel}
            className="rounded-input p-4 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors press-scale"
          >
            <X className="h-16 w-16" />
          </button>
        </div>

        {/* Warning message with batch name */}
        <p className="mb-20 text-body-normal text-text-secondary">
          Are you sure you want to delete <span className="font-semibold text-text-primary">{batchName}</span>? This cannot be undone.
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-12">
          <button onClick={onCancel} disabled={isDeleting}
            className="rounded-input border border-border-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 disabled:opacity-50 press-scale"
          >
            Cancel
          </button>

          <button onClick={onConfirm} disabled={isDeleting}
            className="flex items-center gap-8 rounded-input bg-danger-main px-14 py-8 text-sm font-semibold text-neutral-0 hover:bg-danger-hover active:bg-danger-pressed transition-all duration-200 disabled:opacity-60 press-scale"
          >
            {isDeleting ? (<><Loader2 className="h-14 w-14 animate-spin" /> Deleting...</>) : ("Delete")}
          </button>
        </div>

      </div>
    </div>
  );
}
