import * as yup from "yup";

export const warehouseBatchRequestSchema = yup.object({
  batchName: yup
    .string()
    .trim()
    .required("Batch name is required"),

  type: yup
    .string()
    .trim()
    .required("Type is required"),

  variant: yup
    .string()
    .trim()
    .required("Variant is required"),

  color: yup
    .string()
    .trim()
    .required("Color is required"),

  batchPrice: yup
    .number()
    .typeError("Must be a number")
    .integer("Must be a whole number")
    .required("Price is required"),

  description: yup
    .string()
    .trim()
    .optional(),

  // batchSizes: yup
  //   .array()
  //   .of(
  //     yup.object({
  //       size: yup
  //         .string()
  //         .trim()
  //         .required("Size is required"),
  //       quantity: yup
  //         .number()
  //         .typeError("Must be a number")
  //         .integer("Must be a whole number")
  //         .min(0, "Cannot be negative")
  //         .required("Quantity is required"),
  //     })
  //   )
  //   .min(1, "At least one size is required"),
});

export const warehouseBatchRequestDefaultValues = {
  batchName: "",
  type: "",
  variant: "",
  color: "",
  batchPrice: "",
  description: "",
  // batchSizes: [{ size: "", quantity: "" }],
};
