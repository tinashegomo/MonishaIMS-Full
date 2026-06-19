import * as yup from "yup";

export const productRequestSchema = yup.object({
  productName: yup
    .string()
    .trim()
    .required("Product name is required"),

  productPrice: yup
    .number()
    .typeError("Must be a number")
    .integer("Must be a whole number")
    .required("Price is required"),

  batchId: yup
    .string()
    .trim()
    .required("Batch is required"),

  schoolId: yup
    .string()
    .trim()
    .optional()
    .default(""),

  description: yup
    .string()
    .trim()
    .optional(),
});

export const productRequestDefaultValues = {
  productName: "",
  productPrice: "",
  batchId: "",
  schoolId: "",
  description: "",
};
