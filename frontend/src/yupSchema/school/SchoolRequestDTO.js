import * as yup from "yup";

export const schoolRequestSchema = yup.object({
  schoolName: yup
    .string()
    .trim()
    .min(2, "School name must be at least 2 characters")
    .max(100, "School name must be at most 100 characters")
    .required("School name is required"),
});

export const schoolRequestDefaultValues = {
  schoolName: "",
};