import { Loader2, AlertTriangle } from "lucide-react";

export default function ConfirmUserDeleteModal({ userName, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="w-full max-w-sm rounded-card bg-surface-default p-32 shadow-elevation-3 animate-slide-up">
        <div className="flex flex-col items-center text-center">
          <div className="mb-16 flex h-48 w-48 items-center justify-center rounded-full bg-danger-bg">
            <AlertTriangle className="h-24 w-24 text-danger-main" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">Delete User</h3>
          <p className="mt-8 text-body-normal text-text-secondary">
            Are you sure you want to delete <strong>{userName}</strong>? This action cannot be undone.
          </p>
        </div>
        <div className="mt-24 flex gap-12">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-semibold text-text-primary hover:bg-surface-muted transition-all duration-200 press-scale"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center gap-8 rounded-input bg-danger-main px-14 py-8 text-sm font-semibold text-neutral-0 hover:bg-danger-hover active:bg-danger-pressed press-scale transition-all duration-200 disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="h-16 w-16 animate-spin" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
