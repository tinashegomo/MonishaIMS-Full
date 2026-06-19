import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "@/hooks/InventoryHooks";
import { saveToken } from "@/utils/tokenUtils";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
  const navigate = useNavigate();

  const { mutate: registerUser, isPending, isError, error } = useRegister();

  const handleRegister = (UserRequestDTO) => {
    registerUser(UserRequestDTO, {
      onSuccess: (AuthResponseDTO) => {
        saveToken(AuthResponseDTO.token);
        navigate("/");
      },
      onError: (error) => {
        console.error(error.response?.data);
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-subtle px-16 py-24 animate-fade-in">
      <div className="w-full max-w-[420px]">
        <div className="rounded-card bg-surface-default p-32 shadow-elevation-3 animate-slide-up">
          <div className="mb-24 text-center">
            <div className="mx-auto mb-16 flex h-14 w-14 items-center justify-center rounded-input bg-brand-primary text-neutral-0 shadow-elevation-2">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 3C9 5.5 5 6.5 5 10c0 4.5 4 6 7 11M12 3c3 2.5 7 3.5 7 7 0 4.5-4 6-7 11" />
              </svg>
            </div>
            <h1 className="text-h2 font-bold text-text-primary">
              Create Account
            </h1>
            <p className="mt-8 text-body-normal text-text-secondary">
              Join Monisha IMS
            </p>
          </div>

          {isError && (
            <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-small text-danger-main animate-fade-in">
              {error.response?.data?.message || "Failed to register. Please try again."}
            </div>
          )}

          <RegisterForm handleRegister={handleRegister} isPending={isPending} />

          <div className="mt-24 text-center text-body-normal text-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-primary transition-colors hover:text-brand-hover"
            >
              Sign in
            </Link>
          </div>
        </div>

        <p className="mt-24 text-center text-ui-caption text-text-muted">
          Monisha IMS — School Uniform Inventory
        </p>
      </div>
    </div>
  );
}
