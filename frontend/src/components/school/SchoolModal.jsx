import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X, Loader2 } from "lucide-react";
import {
  schoolRequestSchema,
  schoolRequestDefaultValues,
} from "@/yupSchema/school/SchoolRequestDTO";

const inputBase =
  "w-full rounded-input border bg-surface-elevated px-16 py-12 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200";
const inputOk =
  "border-border-default focus:border-border-focus focus-ring";
const inputErr =
  "border-danger-main focus:border-danger-hover focus:ring-2 focus:ring-danger-bg";

/*
  SchoolModal — used for both Create and Edit.

  Props:
    isOpen      — controls visibility
    onClose     — called when modal should close
    onSubmit    — called with { schoolName } when form is valid
    isPending   — disables submit button while mutation is running
    school      — if provided, pre-fills the form (Edit mode)
                  if null/undefined, form starts empty (Create mode)
*/
export const SchoolModal = ({ isOpen, onClose, onSubmit, isPending, school }) => {

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schoolRequestSchema),
    defaultValues: school ? { schoolName: school.schoolName } : schoolRequestDefaultValues,
    mode: "onBlur",
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-1000/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-panel bg-surface-default p-24 md:p-32 shadow-elevation-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-20 flex items-center justify-between">
          <h2 className="text-h4 font-semibold text-text-primary">{school ? "Edit School" : "Create School"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-input p-8 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors press-scale"
            aria-label="Close modal"
          >
            <X className="h-18 w-18" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-20">
          <div>
            <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
              School Name
            </label>
            <input
              type="text"
              placeholder="e.g. Zimuto High School"
              aria-invalid={errors.schoolName ? "true" : "false"}
              className={`${inputBase} ${errors.schoolName ? inputErr : inputOk}`}
              {...register("schoolName")}
            />
            {errors.schoolName && (
              <p className="mt-4 text-body-small text-danger-main">{errors.schoolName.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-12 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-input border border-border-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed disabled:cursor-not-allowed disabled:opacity-60 press-scale transition-all duration-200"
            >
              {isPending ? (<><Loader2 className="h-16 w-16 animate-spin" />{school ? "Saving..." : "Creating..."}</>) : school ? ("Save Changes") : ("Create School")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
