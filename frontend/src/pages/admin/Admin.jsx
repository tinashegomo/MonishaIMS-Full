import { useState } from "react";
import { useResetDatabase, useGetResetAuditLog } from "@/hooks/InventoryHooks";
import { Loader2, AlertTriangle, Trash2, History } from "lucide-react";
import Modal from "@/components/shared/Modal";

export default function Admin() {
  const { mutate: resetDatabase, isPending: isResetting } = useResetDatabase();
  const { data: auditLog = [], isLoading: logLoading } = useGetResetAuditLog();

  const [showResetModal, setShowResetModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleReset = () => {
    resetDatabase(undefined, {
      onSuccess: () => {
        setShowResetModal(false);
        setConfirmText("");
      },
      onError: () => {
        setShowResetModal(false);
        setConfirmText("");
      },
    });
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-h2 font-bold text-text-primary mb-32">Admin Settings</h1>

      <div className="grid gap-16 md:grid-cols-2">
        {/* ── Section: Reset Database ───────────────────────────── */}
        <div className="glass-panel p-16 md:p-20 animate-slide-up">
          <div className="flex items-center gap-12 mb-16">
            <div className="flex h-10 w-10 items-center justify-center rounded-input bg-danger-bg text-danger-main">
              <Trash2 className="h-16 w-16" />
            </div>
            <div>
              <p className="text-body-small font-semibold text-text-primary">Reset Database</p>
              <p className="text-ui-caption text-text-muted">Permanently delete all data</p>
            </div>
          </div>

          <div className="flex items-start gap-12 rounded-card border border-danger-main bg-danger-bg p-16">
            <AlertTriangle className="h-20 w-20 text-danger-main mt-2 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-danger-main">This action cannot be undone.</p>
              <p className="mt-4 text-sm text-danger-main/80">
                This will permanently delete ALL data including orders, products, batches, customers, and schools.
                User accounts will be preserved.
              </p>
            </div>
          </div>

          <button
            onMouseDown={(e) => { e.preventDefault(); setShowResetModal(true); setConfirmText(""); }}
            className="mt-16 inline-flex items-center gap-8 rounded-input border border-danger-main bg-danger-bg px-14 py-8 text-sm font-medium text-danger-main hover:bg-danger-main hover:text-neutral-0 transition-all duration-200 press-scale"
          >
            <Trash2 className="h-16 w-16" />
            Reset Database
          </button>
        </div>

        {/* ── Section: Audit Log ─────────────────────────────────── */}
        <div className="glass-panel p-16 md:p-20 animate-slide-up md:col-span-2" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center gap-12 mb-16">
            <div className="flex h-10 w-10 items-center justify-center rounded-input bg-surface-muted text-text-secondary">
              <History className="h-16 w-16" />
            </div>
            <div>
              <p className="text-body-small font-semibold text-text-primary">Reset History</p>
              <p className="text-ui-caption text-text-muted">Log of all database resets</p>
            </div>
          </div>

          {logLoading ? (
            <p className="text-sm text-text-muted">Loading audit log...</p>
          ) : auditLog.length === 0 ? (
            <p className="text-sm text-text-muted">No resets have been performed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border-default">
                    <th className="pb-12 text-ui-caption font-medium text-text-muted uppercase tracking-wide">Date</th>
                    <th className="pb-12 text-ui-caption font-medium text-text-muted uppercase tracking-wide">Performed By</th>
                    <th className="pb-12 text-ui-caption font-medium text-text-muted uppercase tracking-wide">Tables Cleared</th>
                    <th className="pb-12 text-ui-caption font-medium text-text-muted uppercase tracking-wide">Row Counts</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((entry) => (
                    <tr key={entry.logId} className="border-b border-border-default last:border-0">
                      <td className="py-12 text-sm text-text-primary whitespace-nowrap">
                        {new Date(entry.resetAt).toLocaleString()}
                      </td>
                      <td className="py-12 text-sm text-text-primary">{entry.performedBy}</td>
                      <td className="py-12 text-sm text-text-secondary">
                        {entry.tablesCleared.split(", ").length} tables
                      </td>
                      <td className="py-12 text-sm text-text-secondary max-w-[400px] truncate" title={entry.rowCounts}>
                        {entry.rowCounts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Reset Confirmation Modal ────────────────────────────── */}
      <Modal isOpen={showResetModal} onClose={() => { setShowResetModal(false); setConfirmText(""); }}>
        <Modal.Header onClose={() => { setShowResetModal(false); setConfirmText(""); }}>
          Reset Database
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-16">
            <div className="flex items-start gap-12 rounded-card border border-danger-main bg-danger-bg p-16">
              <AlertTriangle className="h-20 w-20 text-danger-main mt-2 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-danger-main">This action cannot be undone.</p>
                <p className="mt-4 text-sm text-danger-main/80">
                  This will permanently delete ALL data including orders, products, batches, customers, and schools.
                  User accounts will be preserved.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-6 block text-sm font-medium text-text-secondary">
                Type <span className="font-bold text-danger-main">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder='Type "DELETE"'
                autoFocus
                className="w-full rounded-input border border-border-default bg-surface-default px-12 py-8 text-sm text-text-primary placeholder:text-text-muted focus:border-danger-main focus:outline-none focus:ring-1 focus:ring-danger-main"
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setShowResetModal(false); setConfirmText(""); }}
            disabled={isResetting}
            className="rounded-input border border-border-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 disabled:opacity-50 press-scale"
          >
            Cancel
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); if (confirmText === "DELETE") handleReset(); }}
            disabled={isResetting || confirmText !== "DELETE"}
            className="flex items-center gap-8 rounded-input bg-danger-main px-14 py-8 text-sm font-semibold text-neutral-0 hover:bg-danger-hover active:bg-danger-pressed transition-all duration-200 disabled:opacity-50 press-scale"
          >
            {isResetting ? (<><Loader2 className="h-14 w-14 animate-spin" /> Resetting...</>) : ("Confirm Reset")}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
