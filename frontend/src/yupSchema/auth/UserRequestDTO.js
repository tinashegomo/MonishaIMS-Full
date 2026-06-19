import * as yup from "yup";

export const userRequestSchema = yup.object({
  userName: yup
    .string()
    .trim()
    .required("Username is required"),

  userEmail: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),

  userPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  userPhoneNumber: yup
    .string()
    .trim()
    .required("Phone number is required"),
});

export const userRequestDefaultValues = {
  userName: "",
  userEmail: "",
  userPassword: "",
  userPhoneNumber: "",
};
