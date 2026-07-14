import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2, Save } from "lucide-react";
import { useUpdateUser } from "@/hooks/InventoryHooks";
import { updateUserSchema } from "@/yupSchema/user/UpdateUserRequestDTO";

const inputBase = "w-full rounded-input border bg-surface-elevated px-16 py-12 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200";
const inputOk = "border-border-default focus:border-border-focus focus-ring";
const inputErr = "border-danger-main focus:border-danger-main focus-ring-danger";

export default function EditProfileForm({ user }) {
  // ─── Mutations ────────────────────────────────────────────────
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  // ─── State: Feedback ──────────────────────────────────────────
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ─── Form ─────────────────────────────────────────────────────
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(updateUserSchema),
  });

  // ─── Effects ──────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      reset({
        userName: user.userName || "",
        userEmail: user.userEmail || "",
        userPhoneNumber: user.userPhoneNumber || "",
      });
    }
  }, [user, reset]);

  // ─── Handlers ─────────────────────────────────────────────────
  const onSubmit = (data) => {
    setSuccess("");
    setError("");
    updateUser(
      { id: user.userId, data },
      {
        onSuccess: () => {
          setSuccess("Profile updated successfully");
          setTimeout(() => setSuccess(""), 3000);
        },
        onError: (err) => {
          setError(err.response?.data?.message || "Failed to update profile");
        },
      }
    );
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="glass-panel p-16 md:p-20 animate-slide-up" style={{ animationDelay: "60ms" }}>
      <h2 className="text-body-normal font-semibold text-text-primary mb-16">Edit Profile</h2>

      {success && (
        <div className="mb-16 rounded-input border border-success-main bg-success-bg px-16 py-12 text-body-small text-success-main">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-16 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-small text-danger-main">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Username</label>
          <input
            type="text"
            className={`${inputBase} ${errors.userName ? inputErr : inputOk}`}
            {...register("userName")}
          />
          {errors.userName && <p className="mt-4 text-body-small text-danger-main">{errors.userName.message}</p>}
        </div>
        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Email</label>
          <input
            type="email"
            className={`${inputBase} ${errors.userEmail ? inputErr : inputOk}`}
            {...register("userEmail")}
          />
          {errors.userEmail && <p className="mt-4 text-body-small text-danger-main">{errors.userEmail.message}</p>}
        </div>
        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Phone Number</label>
          <input
            type="text"
            className={`${inputBase} ${errors.userPhoneNumber ? inputErr : inputOk}`}
            {...register("userPhoneNumber")}
          />
          {errors.userPhoneNumber && <p className="mt-4 text-body-small text-danger-main">{errors.userPhoneNumber.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          className="inline-flex items-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200 disabled:opacity-50"
        >
          {isUpdating ? <Loader2 className="h-16 w-16 animate-spin" /> : <Save className="h-16 w-16" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
