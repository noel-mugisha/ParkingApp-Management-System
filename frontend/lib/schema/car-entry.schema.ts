import { z } from "zod";

export const createCarEntrySchema = z.object({
  plateNumber: z
    .string()
    .min(3, "Plate number must be at least 3 characters")
    .max(20, "Plate number must be less than 20 characters")
    .regex(/^[A-Z0-9-]+$/, "Plate number must contain only uppercase letters, numbers, or hyphens"),
  parkingCode: z
    .string()
    .min(1, "Parking code is required"),
});

export const updateCarEntrySchema = z.object({
  exitDateTime: z.string().datetime().optional(),
  chargedAmount: z.number().min(0, "Charged amount cannot be negative").optional(),
});

export type CreateCarEntryFormData = z.infer<typeof createCarEntrySchema>;
export type UpdateCarEntryFormData = z.infer<typeof updateCarEntrySchema>;