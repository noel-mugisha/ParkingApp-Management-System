import { z } from "zod";

export const createCarEntrySchema = z.object({
  plateNumber: z
    .string()
    .min(1, "Plate number is required")
    .max(20, "Plate number must be at most 20 characters"),
  parkingCode: z
    .string()
    .uuid("Invalid parking ID format"),
});

export const updateCarEntrySchema = z.object({
  exitDateTime: z
    .string()
    .datetime({ message: "Invalid exit date time format" })
    .optional(),
  chargedAmount: z
    .number()
    .nonnegative("Charged amount must be non-negative")
    .optional(),
});

export type CreateCarEntryInput = z.infer<typeof createCarEntrySchema>;
export type UpdateCarEntryInput = z.infer<typeof updateCarEntrySchema>;

export const validateCreateCarEntryInput = (data: unknown): CreateCarEntryInput => {
  return createCarEntrySchema.parse(data);
};

export const validateUpdateCarEntryInput = (data: unknown): UpdateCarEntryInput => {
  return updateCarEntrySchema.parse(data);
};