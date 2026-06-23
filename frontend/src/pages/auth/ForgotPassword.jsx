import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";
import { changePasswordSchema, changePasswordDefaultValues } from "@/yupSchema/user/ChangePasswordRequestDTO";

export default function ForgotPassword() {
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: changePasswordDefaultValues,
    mode: "onBlur",
  });

  const inputBase =
    "w-full rounded-input border bg-surface-elevated px-16 py-12 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200";
  const inputOk =
    "border-border-default focus:border-border-focus focus-ring";
  const inputErr =
    "border-danger-main focus:border-danger-main focus:ring-2 focus:ring-danger-main/20";

  const onSubmit = async (data) => {
    setIsPending(true);
    setError("");
    setSuccess("");
    try {
      await axios.patch(`https://monishainventorymanagementsystem-backend.onrender.com/api/monishaInventory/user/change-password`, null, {
        params: { newPassword: data.newPassword },
      });
      setSuccess("Password reset successfully. You can now sign in.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-base p-16">
      <div className="w-full max-w-[400px]">
        <div className="glass-panel p-24 md:p-32 animate-fade-in">
          <div className="mb-24 text-center">
            <h1 className="text-h3 font-bold text-text-primary">Reset Password</h1>
            <p className="mt-8 text-body-small text-text-muted">Enter your new password below</p>
          </div>

          {success && (
            <div className="mb-16 flex items-center gap-8 rounded-input border border-success-main bg-success-bg px-16 py-12 text-body-small text-success-main">
              <CheckCircle className="h-16 w-16 shrink-0" />
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
              <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
                New Password
              </label>
              <input
                type="password"
                placeholder="At least 8 characters"
                className={`${inputBase} ${errors.newPassword ? inputErr : inputOk}`}
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="mt-8 text-body-small font-medium text-danger-main">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Repeat password"
                className={`${inputBase} ${errors.confirmPassword ? inputErr : inputOk}`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-8 text-body-small font-medium text-danger-main">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-8 rounded-input bg-brand-primary px-16 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed disabled:cursor-not-allowed disabled:opacity-60 press-scale transition-all duration-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-14 w-14 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-20 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-4 text-body-small font-medium text-brand-primary transition-colors hover:text-brand-hover"
            >
              <ArrowLeft className="h-14 w-14" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
