import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Shield, Eye, MoreVertical } from "lucide-react";
import { useGetAllUsers, useGetAllOrders, useUpdateUserRole, useDeleteUser, useGetCurrentUserRole } from "@/hooks/InventoryHooks";
import ConfirmUserDeleteModal from "./ConfirmUserDeleteModal";

const ROLE_OPTIONS = ["USER", "MANAGER", "ADMIN"];

const ROLE_COLORS = {
  ADMIN: "text-purple-600",
  MANAGER: "text-blue-600",
  USER: "text-gray-600",
};

export default function Users() {
  const navigate = useNavigate();
  const { data: users, isLoading, isError, error } = useGetAllUsers();
  const { data: orders = [] } = useGetAllOrders();
  const { data: currentRole } = useGetCurrentUserRole();
  const { mutate: updateUserRole } = useUpdateUserRole();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const [openMenu, setOpenMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [selectedUser, setSelectedUser] = useState(null);
  const menuRef = useRef(null);
  const btnRefs = useRef({});

  const handleOpenMenu = (userId) => {
    if (openMenu === userId) {
      setOpenMenu(null);
      return;
    }
    const btn = btnRefs.current[userId];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.right - 224 }); // matches w-56
    }
    setOpenMenu(userId);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="mb-32 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">User Management</h1>
          <p className="mt-8 text-body-normal text-text-secondary">
            Manage user accounts and roles
          </p>
        </div>
      </div>

      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {error.response?.data?.message || "Failed to load users."}
        </div>
      )}

      {isLoading && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading users...</p>
        </div>
      )}

      {!isLoading && !isError && users && users.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <Shield className="h-32 w-32 text-brand-primary mb-16" />
          <h3 className="text-h4 font-semibold text-text-primary">No users yet</h3>
        </div>
      )}

      {!isLoading && users && users.length > 0 && (
        <div className="w-full rounded-card bg-surface-default overflow-visible">
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
              {users.map((u) => (
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
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="w-20 px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() => navigate(`/admin/users/${u.userId}`)}
                        className="rounded-full p-5 text-text-muted hover:bg-brand-subtle hover:text-brand-primary transition-all duration-200 press-scale"
                        aria-label={`View ${u.userName}`}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        ref={(el) => { btnRefs.current[u.userId] = el; }}
                        onClick={() => handleOpenMenu(u.userId)}
                        className="rounded-full p-5 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-all duration-200 press-scale"
                        aria-label="Actions"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openMenu && (
        <div
          ref={menuRef}
          className="fixed z-[9999] w-56 whitespace-nowrap rounded-input border border-border-default bg-surface-default py-4 shadow-elevation-2 animate-fade-in"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {ROLE_OPTIONS.filter(r => r !== users?.find(u => u.userId === openMenu)?.userRole).map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(openMenu, role)}
              className="flex w-full items-center gap-8 px-16 py-8 text-left text-body-small leading-none text-text-primary hover:bg-surface-muted transition-colors"
            >
              Set as {role}
            </button>
          ))}
          <div className="my-2 border-t border-border-default" />
          <button
            onClick={() => {
              setSelectedUser(users?.find(u => u.userId === openMenu));
              setOpenMenu(null);
            }}
            className="flex w-full items-center px-16 py-8 text-left text-body-small leading-none text-danger-main hover:bg-danger-bg transition-colors"
          >
            Delete User
          </button>
        </div>
      )}

      {selectedUser && (
        <ConfirmUserDeleteModal
          userName={selectedUser.userName}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setSelectedUser(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}