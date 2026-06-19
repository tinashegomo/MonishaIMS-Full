import * as yup from "yup";

export const changePasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
});

export const changePasswordDefaultValues = {
  newPassword: "",
  confirmPassword: "",
};
