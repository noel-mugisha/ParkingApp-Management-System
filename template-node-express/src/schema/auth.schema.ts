import { z } from 'zod';

// Reusable password schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'First name can only contain letters, spaces, and hyphens'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'Last name can only contain letters, spaces, and hyphens'),
  email: z.string().email('Invalid email format'),
  password: passwordSchema,
});

export const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().min(1, 'OTP is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const resendOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: passwordSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

export const validateRegisterInput = (data: unknown) => {
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.errors.map((err) => err.message).join(', ')
    );
  }
  return result.data;
};

export const validateVerifyEmailInput = (data: unknown) => {
  const result = verifyEmailSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.errors.map((err) => err.message).join(', ')
    );
  }
  return result.data;
};

export const validateLoginInput = (data: unknown) => {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.errors.map((err) => err.message).join(', ')
    );
  }
  return result.data;
};

export const validateResendOtpInput = (data: unknown) => {
  const result = resendOtpSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.errors.map((err) => err.message).join(', ')
    );
  }
  return result.data;
};

export const validateForgotPasswordInput = (data: unknown) => {
  const result = forgotPasswordSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.errors.map((err) => err.message).join(', ')
    );
  }
  return result.data;
};

export const validateResetPasswordInput = (data: unknown) => {
  const result = resetPasswordSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.errors.map((err) => err.message).join(', ')
    );
  }
  return result.data;
};

export const validateRefreshTokenInput = (data: unknown) => {
  const result = refreshTokenSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.errors.map((err) => err.message).join(', ')
    );
  }
  return result.data;
};

export const validateChangePasswordInput = (data: unknown) => {
  const result = changePasswordSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      result.error.errors.map((err) => err.message).join(', ')
    );
  }
  return result.data;
};