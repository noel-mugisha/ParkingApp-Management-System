import { z } from 'zod';

export const createParkingSchema = z.object({
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

export const updateParkingSchema = z.object({
  parkingName: z
    .string()
    .min(3, 'Parking name must be at least 3 characters')
    .max(50, 'Parking name must be less than 50 characters')
    .regex(/^[A-Za-z0-9\s-]+$/, 'Parking name must contain only letters, numbers, spaces, or hyphens')
    .optional(),
  numberOfAvailableSpaces: z
    .number()
    .int('Number of available spaces must be an integer')
    .min(0, 'Number of available spaces cannot be negative')
    .optional(),
  chargingFeesPerHour: z
    .number()
    .min(0, 'Charging fees per hour cannot be negative')
    .max(1000, 'Charging fees per hour must be reasonable (max 1000)')
    .optional(),
});

export const validateCreateParkingInput = (data: unknown) => {
  const result = createParkingSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.errors.map((err) => err.message).join(', ')
    );
  }
  return result.data;
};

export const validateUpdateParkingInput = (data: unknown) => {
  const result = updateParkingSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.errors.map((err) => err.message).join(', ')
    );
  }
  return result.data;
};