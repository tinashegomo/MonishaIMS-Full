import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Shield, Eye, MoreVertical } from "lucide-react";
import { useGetAllUsers, useGetAllOrders, useUpdateUserRole, useDeleteUser, useGetCurrentUserRole } from "@/hooks/InventoryHooks";
import Modal from "@/components/shared/Modal";
import { formatDate } from "@/utils/dateUtils";

const ROLE_OPTIONS = ["USER", "MANAGER", "ADMIN"];

const ROLE_COLORS = {
  ADMIN: "text-purple-600",
  MANAGER: "text-blue-600",
  USER: "text-gray-600",
};

export default function Users() {
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(false);

  const navigate = useNavigate();
  const { data: users, isLoading, isError, error } = useGetAllUsers();
  const { data: orders = [] } = useGetAllOrders();
  const { data: currentRole } = useGetCurrentUserRole();
  const { mutate: updateUserRole } = useUpdateUserRole();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const sortedUsers = useMemo(() => {
    if (!users) return [];
    return [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [users]);

  const handleRoleChange = (userId, newRole) => {
    updateUserRole({ id: userId, userRole: newRole });
    setOpenMenu(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    deleteUser(selectedUser.userId, {
      onSuccess: () => setSelectedUser(null),
      onError: () => setSelectedUser(null),
    });
  };

  const getOrderCount = (userName) => {
    return orders.filter(o => o.createdBy === userName).length;
  };

  if (currentRole !== "ADMIN") {
    return (
      <div className="animate-fade-in">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center">
          <Shield className="h-32 w-32 text-text-muted mb-16" />
          <h3 className="text-h4 font-semibold text-text-primary">Access Denied</h3>
          <p className="mt-8 text-body-normal text-text-muted">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-7xl">
      {/* ── Page Header ─── */}
      <div className="mb-32 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">User Management</h1>
          <p className="mt-8 text-body-normal text-text-secondary">
            Manage user accounts and roles
          </p>
        </div>
      </div>

      {/* ── Error Banner ─── */}
      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {error.response?.data?.message || "Failed to load users."}
        </div>
      )}

      {/* ── Loading State ─── */}
      {isLoading && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading users...</p>
        </div>
      )}

      {/* ── Empty State ─── */}
      {!isLoading && !isError && sortedUsers.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <Shield className="h-32 w-32 text-brand-primary mb-16" />
          <h3 className="text-h4 font-semibold text-text-primary">No users yet</h3>
        </div>
      )}

      {/* ── Users Table ─── */}
      {!isLoading && sortedUsers.length > 0 && (
        <div className="w-full rounded-card bg-surface-default">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="min-w-[160px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Name</th>
                <th className="min-w-[200px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Email</th>
                <th className="min-w-[140px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Phone</th>
                <th className="min-w-[100px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Role</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Orders</th>
                <th className="w-36 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">Joined</th>
                <th className="w-20 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((u) => (
                <tr
                  key={u.userId}
                  className="border-b border-border-default/50 last:border-b-0 hover:bg-surface-muted/40 transition-colors duration-150"
                >
                  <td className="min-w-[160px] px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                    {u.userName}
                  </td>
                  <td className="min-w-[200px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                    {u.userEmail}
                  </td>
                  <td className="min-w-[140px] px-6 py-4 text-text-secondary whitespace-nowrap">
                    {u.userPhoneNumber}
                  </td>
                  <td className={`min-w-[100px] px-6 py-4 text-xs font-medium whitespace-nowrap ${ROLE_COLORS[u.userRole] || "text-gray-600"}`}>
                    {u.userRole}
                  </td>
                  <td className="w-28 px-6 py-4 text-text-primary text-right whitespace-nowrap tabular-nums">
                    {getOrderCount(u.userName)}
                  </td>
                  <td className="w-36 px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="w-20 px-6 py-4 text-right whitespace-nowrap">
                    <div
                      className="relative flex items-center justify-end gap-4"
                      tabIndex={-1}
                      onBlur={(e) => {
                        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
                          setOpenMenu(null);
                        }
                      }}
                    >
                      <button
                        onClick={() => navigate(`/admin/users/${u.userId}`)}
                        className="rounded-full p-5 text-text-muted hover:bg-brand-subtle hover:text-brand-primary transition-all duration-200 press-scale"
                        aria-label={`View ${u.userName}`}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setOpenMenu(openMenu === u.userId ? null : u.userId)}
                        className="rounded-full p-5 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-all duration-200 press-scale"
                        aria-label="Actions"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {/* Dropdown — absolute inside the relative container */}
                      {openMenu === u.userId && (
                        <div className="absolute right-0 top-full mt-2 z-10 w-56 whitespace-nowrap rounded-input border border-border-default bg-surface-default py-4 shadow-elevation-2 animate-scale-in">
                          {ROLE_OPTIONS.filter(r => r !== u.userRole).map((role) => (
                            <button
                              key={role}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleRoleChange(u.userId, role);
                              }}
                              className="flex w-full items-center gap-8 px-16 py-8 text-left text-body-small leading-none text-text-primary hover:bg-surface-muted transition-colors"
                            >
                              Set as {role}
                            </button>
                          ))}
                          <div className="my-2 border-t border-border-default" />
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSelectedUser(u);
                              setOpenMenu(null);
                            }}
                            className="flex w-full items-center px-16 py-8 text-left text-body-small leading-none text-danger-main hover:bg-danger-bg transition-colors"
                          >
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─── */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)}>

        <Modal.Body>
          <div className="flex flex-col items-center text-center">
            <div className="mb-16 flex h-48 w-48 items-center justify-center rounded-full bg-danger-bg">
              <Loader2 className="h-24 w-24 text-danger-main" />
            </div>
            <h3 className="text-h4 font-semibold text-text-primary">Delete User</h3>
            <p className="mt-8 text-body-normal text-text-secondary">
              Are you sure you want to delete <strong>{selectedUser?.userName}</strong>? This action cannot be undone.
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer className="mt-24 flex gap-12 justify-center">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setSelectedUser(null); }}
            disabled={isDeleting}
            className="flex-1 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-semibold text-text-primary hover:bg-surface-muted transition-all duration-200 press-scale"
          >
            Cancel
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleDeleteConfirm(); }}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center gap-8 rounded-input bg-danger-main px-14 py-8 text-sm font-semibold text-neutral-0 hover:bg-danger-hover active:bg-danger-pressed press-scale transition-all duration-200 disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="h-16 w-16 animate-spin" /> : null}
            Delete
          </button>
        </Modal.Footer>

      </Modal>
    </div>
  );
}
