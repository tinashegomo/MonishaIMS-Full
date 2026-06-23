import { useState } from "react";
import { Plus, Pencil, Trash2, GraduationCap, Loader2 } from "lucide-react";
import {
  useGetAllSchools,
  useCreateSchool,
  useUpdateSchool,
  useDeleteSchool,
  useGetCurrentUser,
} from "@/hooks/InventoryHooks";
import { SchoolModal } from "@/components/school/SchoolModal";

export default function SchoolsPage() {
  // --- Modal state ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // --- Data & mutations ---
  const { data: user } = useGetCurrentUser();
  const { data: schools = [], isLoading, isError } = useGetAllSchools();

  const { mutate: createSchool, isPending: isCreating, error: createError } = useCreateSchool();
  const { mutate: updateSchool, isPending: isUpdating, error: updateError } = useUpdateSchool();
  const { mutate: deleteSchool, isPending: isDeleting } = useDeleteSchool();

  // --- Handlers ---
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSchool(null);
  };

  const handleOpenCreate = () => {
    setSelectedSchool(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (school) => {
    setSelectedSchool(school);
    setIsModalOpen(true);
  };

  const handleCreate = (SchoolRequestDTO) => {
    createSchool(SchoolRequestDTO, {
      onSuccess: () => handleCloseModal(),
    });
  };

  const handleUpdate = (SchoolRequestDTO) => {
    updateSchool(
      { schoolId: selectedSchool.schoolId, SchoolRequestDTO },
      {
        onSuccess: () => handleCloseModal(),
      }
    );
  };

  const handleDelete = (schoolId) => {
    setDeletingId(schoolId);
    deleteSchool(schoolId, {
      onSettled: () => setDeletingId(null),
    });
  };

  // --- Render ---
  return (
    <div className="animate-fade-in mx-auto max-w-7xl">
      <div className="mb-32 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">Schools</h1>
          <p className="mt-8 text-body-normal text-text-secondary">
            Manage schools associated with uniform products
          </p>
        </div>
        {user?.userRole !== "USER" && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200"
          >
            <Plus className="h-16 w-16" />
            Add School
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading schools...</p>
        </div>
      ) : isError ? (
        <div className="rounded-card bg-surface-default p-24 text-center text-body-normal text-danger-main animate-fade-in">
          Failed to load schools. Please refresh the page.
        </div>
      ) : schools.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <div className="mb-16 flex h-64 w-64 items-center justify-center rounded-full bg-brand-tint">
            <GraduationCap className="h-32 w-32 text-brand-primary" />
          </div>
          <h3 className="text-h4 font-semibold text-text-primary">
            No schools yet
          </h3>
          <p className="mt-8 max-w-xs text-body-normal text-text-muted">
            Get started by adding your first school.
          </p>
          {user?.userRole !== "USER" && (
            <button
              onClick={handleOpenCreate}
              className="mt-20 inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-20 py-12 text-body-normal font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200"
            >
              <Plus className="h-16 w-16" />
              Add School
            </button>
          )}
        </div>
      ) : (
        <div className="w-full rounded-card bg-surface-default">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="min-w-[300px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">
                  School Name
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
              {schools.map((school, index) => (
                <tr
                  key={school.schoolId}
                  className="border-b border-border-default/50 last:border-0 hover:bg-surface-muted/40 transition-colors duration-150"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="min-w-[300px] px-6 py-4 font-medium text-text-primary whitespace-nowrap truncate">
                    {school.schoolName}
                  </td>
                  <td className="w-40 px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                    {new Date(school.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="w-28 px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(school)}
                      className="rounded-full p-5 text-text-muted hover:bg-surface-muted hover:text-brand-primary transition-all duration-200 press-scale"
                      aria-label={`Edit ${school.schoolName}`}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(school.schoolId)}
                      disabled={isDeleting && deletingId === school.schoolId}
                      className="rounded-full p-5 text-text-muted hover:bg-danger-bg hover:text-danger-main transition-all duration-200 press-scale disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Delete ${school.schoolName}`}
                    >
                      {isDeleting && deletingId === school.schoolId ? (
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

      {/* Mutation error banners */}
      {createError && (
        <div className="mt-16 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {createError.response?.data?.message || "Failed to create school. Please try again."}
        </div>
      )}
      {updateError && (
        <div className="mt-16 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {updateError.response?.data?.message || "Failed to update school. Please try again."}
        </div>
      )}

      <SchoolModal
        key={selectedSchool?.schoolId ?? "create"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={selectedSchool ? handleUpdate : handleCreate}
        isPending={selectedSchool ? isUpdating : isCreating}
        school={selectedSchool}
      />
    </div>
  );
}
