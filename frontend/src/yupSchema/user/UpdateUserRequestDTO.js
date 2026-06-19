import * as yup from "yup";

export const updateUserSchema = yup.object({
  userName: yup
    .string()
    .trim()
    .required("Username is required"),
  userEmail: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  userPhoneNumber: yup
    .string()
    .trim()
    .required("Phone number is required"),
});

export const updateUserDefaultValues = {
  userName: "",
  userEmail: "",
  userPhoneNumber: "",
};
