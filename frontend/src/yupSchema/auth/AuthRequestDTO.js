import * as yup from "yup";

export const authRequestSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Valid email is required")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required"),
});

export const authRequestDefaultValues = {
  email: "",
  password: "",
};
