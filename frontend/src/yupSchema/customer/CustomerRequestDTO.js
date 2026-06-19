import * as yup from "yup";

export const customerRequestSchema = yup.object({
  customerName: yup
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name must be at most 100 characters")
    .required("Customer name is required"),

  phoneNumber: yup
    .string()
    .trim()
    .min(2, "Phone number must be at least 2 characters")
    .max(20, "Phone number must be at most 20 characters")
    .required("Phone number is required"),
});

export const customerRequestDefaultValues = {
  customerName: "",
  phoneNumber: "",
};
