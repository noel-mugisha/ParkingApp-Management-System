import { z } from 'zod';

const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s-]+$/, 'Name can only contain letters, spaces, and hyphens');

export const updateProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
});

export const validateUpdateProfileInput = (data: unknown) => {
  const result = updateProfileSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.errors.map((err) => err.message).join(', ')
    );
  }
  return result.data;
};