import * as yup from "yup";

// ─── Full order ───
export const orderRequestSchema = yup.object({
  // Customer fields — used for both existing and new customers
  customerName: yup
    .string()
    .trim()
    .required("Customer name is required"),

  customerId: yup
    .string()
    .trim()
    .optional(),

  // New customer fields — required only when creating a new customer
  phoneNumber: yup
    .string()
    .trim()
    .when("customerId", {
      is: (val) => !val,
      then: (schema) =>
        schema
          .min(2, "Phone number must be at least 2 characters")
          .required("Phone number is required for new customers"),
      otherwise: (schema) => schema.optional(),
    }),

  // Order fields
  schoolId: yup.string().trim().optional().default(""),

  paidAmount: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Paid amount must be at least 0")
    .required("Paid amount is required"),

  notes: yup
    .string()
    .trim()
    .max(1000, "Notes must be at most 1000 characters")
    .optional(),
});

export const orderRequestDefaultValues = {
  customerName: "",
  customerId: "",
  phoneNumber: "",
  schoolId: "",
  paidAmount: "",
  notes: "",
};
