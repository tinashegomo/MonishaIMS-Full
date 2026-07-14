import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2, Lock } from "lucide-react";
import { useChangePassword } from "@/hooks/InventoryHooks";
import { changePasswordSchema } from "@/yupSchema/user/ChangePasswordRequestDTO";

const inputBase = "w-full rounded-input border bg-surface-elevated px-16 py-12 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200";
const inputOk = "border-border-default focus:border-border-focus focus-ring";
const inputErr = "border-danger-main focus:border-danger-main focus-ring-danger";

export default function ChangePasswordForm() {
  // ─── Mutations ────────────────────────────────────────────────
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  // ─── State: Feedback ──────────────────────────────────────────
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ─── Form ─────────────────────────────────────────────────────
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  // ─── Handlers ─────────────────────────────────────────────────
  const onSubmit = (data) => {
    setSuccess("");
    setError("");
    changePassword(
      { newPassword: data.newPassword },
      {
        onSuccess: () => {
          setSuccess("Password changed successfully");
          reset();
          setTimeout(() => setSuccess(""), 3000);
        },
        onError: (err) => {
          setError(err.response?.data?.message || "Failed to change password");
        },
      }
    );
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="glass-panel p-16 md:p-20 animate-slide-up" style={{ animationDelay: "120ms" }}>
      <h2 className="text-body-normal font-semibold text-text-primary mb-16">Change Password</h2>

      {success && (
        <div className="mb-12 rounded-input border border-success-main bg-success-bg px-12 py-8 text-body-small text-success-main">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-12 rounded-input border border-danger-main bg-danger-bg px-12 py-8 text-body-small text-danger-main">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <div>
          <label className="mb-6 block text-ui-label font-semibold text-text-secondary">New Password</label>
          <input
            type="password"
            className={`${inputBase} ${errors.newPassword ? inputErr : inputOk}`}
            {...register("newPassword")}
          />
          {errors.newPassword && <p className="mt-4 text-body-small text-danger-main">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className="mb-6 block text-ui-label font-semibold text-text-secondary">Confirm New Password</label>
          <input
            type="password"
            className={`${inputBase} ${errors.confirmPassword ? inputErr : inputOk}`}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="mt-4 text-body-small text-danger-main">{errors.confirmPassword.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isChangingPassword}
          className="inline-flex items-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200 disabled:opacity-50"
        >
          {isChangingPassword ? <Loader2 className="h-16 w-16 animate-spin" /> : <Lock className="h-16 w-16" />}
          Update Password
        </button>
      </form>
    </div>
  );
}
