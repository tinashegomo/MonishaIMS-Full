import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  userRequestSchema,
  userRequestDefaultValues,
} from "@/yupSchema/auth/UserRequestDTO";

export const RegisterForm = ({ handleRegister, isPending }) => {
  // ─── State ────────────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);

  // ─── Form Setup ───────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userRequestSchema),
    defaultValues: userRequestDefaultValues,
    mode: "onBlur",
  });

  // ─── Computed Styles ─────────────────────────────────────────
  const inputBase =
    "w-full rounded-input border bg-surface-elevated px-16 py-12 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200";
  const inputOk =
    "border-border-default focus:border-border-focus focus-ring";
  const inputErr =
    "border-danger-main focus:border-danger-main focus:ring-2 focus:ring-danger-main/20";

  // ─── Render ───────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(handleRegister)} className="space-y-20">
      {/* ── Username ──────────────────────────────────────────────── */}
      <div>
        <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
          Username
        </label>
        <input
          type="text"
          autoComplete="username"
          placeholder="Enter username"
          aria-invalid={errors.userName ? "true" : "false"}
          className={`${inputBase} ${errors.userName ? inputErr : inputOk}`}
          {...register("userName")}
        />
        {errors.userName && (
          <p className="mt-8 text-body-small font-medium text-danger-main">
            {errors.userName.message}
          </p>
        )}
      </div>

      {/* ── Email ─────────────────────────────────────────────────── */}
      <div>
        <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.userEmail ? "true" : "false"}
          className={`${inputBase} ${errors.userEmail ? inputErr : inputOk}`}
          {...register("userEmail")}
        />
        {errors.userEmail && (
          <p className="mt-8 text-body-small font-medium text-danger-main">
            {errors.userEmail.message}
          </p>
        )}
      </div>

      {/* ── Password ──────────────────────────────────────────────── */}
      <div>
        <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={errors.userPassword ? "true" : "false"}
            className={`${inputBase} pr-40 ${errors.userPassword ? inputErr : inputOk}`}
            {...register("userPassword")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-input p-8 text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary press-scale"
          >
            {showPassword ? (
              <EyeOff className="h-16 w-16" />
            ) : (
              <Eye className="h-16 w-16" />
            )}
          </button>
        </div>
        {errors.userPassword && (
          <p className="mt-8 text-body-small font-medium text-danger-main">
            {errors.userPassword.message}
          </p>
        )}
      </div>

      {/* ── Phone Number ──────────────────────────────────────────── */}
      <div>
        <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
          Phone Number
        </label>
        <input
          type="tel"
          autoComplete="tel"
          placeholder="+263 77 123 4567"
          aria-invalid={errors.userPhoneNumber ? "true" : "false"}
          className={`${inputBase} ${errors.userPhoneNumber ? inputErr : inputOk}`}
          {...register("userPhoneNumber")}
        />
        {errors.userPhoneNumber && (
          <p className="mt-8 text-body-small font-medium text-danger-main">
            {errors.userPhoneNumber.message}
          </p>
        )}
      </div>

      {/* ── Submit Button ─────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-8 rounded-input bg-brand-primary px-16 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed disabled:cursor-not-allowed disabled:opacity-60 press-scale transition-all duration-200"
      >
        {isPending ? (
          <>
            <Loader2 className="h-14 w-14 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};
