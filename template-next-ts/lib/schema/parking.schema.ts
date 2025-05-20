import { z } from "zod";

export const parkingSchema = z.object({
  parkingName: z
    .string()
    .min(3, 'Parking name must be at least 3 characters')
    .max(50, 'Parking name must be less than 50 characters')
    .regex(/^[A-Za-z0-9\s-]+$/, 'Parking name must contain only letters, numbers, spaces, or hyphens'),
  numberOfAvailableSpaces: z
    .number()
    .int('Number of available spaces must be an integer')
    .min(0, 'Number of available spaces cannot be negative'),
  chargingFeesPerHour: z
    .number()
    .min(0, 'Charging fees per hour cannot be negative')
    .max(1000, 'Charging fees per hour must be reasonable (max 1000)'),
});

export const updateParkingSchema = parkingSchema.partial();

export type CreateParkingFormData = z.infer<typeof parkingSchema>;
export type UpdateParkingFormData = z.infer<typeof updateParkingSchema>;