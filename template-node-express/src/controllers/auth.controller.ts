import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { ApiResponse } from '../utils/response';
import { UtilsService } from '../services/utils.service';
import { EmailService } from '../services/email.service';
import {
  validateChangePasswordInput,
  validateRegisterInput,
  validateResetPasswordInput,
  validateVerifyEmailInput,
  validateLoginInput,
  validateResendOtpInput,
  validateForgotPasswordInput,
  validateRefreshTokenInput
} from '../schema/auth.schema';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = validateRegisterInput(req.body);
    const { firstName, lastName, email, password } = validatedData;

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    // Create verification code
    await prisma.code.create({
      data: {
        code: otp,
        type: 'EMAIL_VERIFICATION',
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Send verification email
    const emailService = new EmailService();
    await emailService.sendVerificationEmail(email, otp);

    // Generate tokens
    const utilsService = new UtilsService();
    const accessToken = utilsService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = utilsService.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user;

    return ApiResponse.success(res, 201, 'User registered. Please verify email.', {
      user: userData,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('required'))) {
      return res.status(400).json({ message: error.message });
    }
    // Handle other errors
    return ApiResponse.serverError(res, error);
  }
};

/**
 * Verify email with OTP
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = validateVerifyEmailInput(req.body);
    const { email, otp } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return ApiResponse.error(res, 404, 'User not found');
    }

    if (user.isVerified) {
      return ApiResponse.error(res, 400, 'Email already verified');
    }

    // Verify OTP
    const code = await prisma.code.findFirst({
      where: {
        userId: user.id,
        code: otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt: { gt: new Date() },
      },
    });

    if (!code) {
      return ApiResponse.error(res, 400, 'Invalid or expired OTP');
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    // Delete used OTP
    await prisma.code.deleteMany({ where: { 
      userId: user.id,
      type: 'EMAIL_VERIFICATION',
     } });

    return ApiResponse.success(res, 200, 'Email verified successfully');
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('required'))) {
      return res.status(400).json({ message: error.message });
    }
    // Handle other errors
    return ApiResponse.serverError(res, error);
  }
};

/**
 * User login
 */
export const login = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = validateLoginInput(req.body);
    const { email, password } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.status === 'DISABLED') {
      return res.status(401).json({ message: 'Invalid credentials or user disabled' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const utilsService = new UtilsService();
    const accessToken = utilsService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role
    });
    const refreshToken = utilsService.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user;

    return ApiResponse.success(res, 200, 'Login successful', {
      user: userData,
      accessToken,
      refreshToken
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('required'))) {
      return res.status(400).json({ message: error.message });
    }
    // Handle other errors
    return ApiResponse.serverError(res, error);
  }
};

/**
 * Resend OTP for email verification
 */
export const resendOtp = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = validateResendOtpInput(req.body);
    const { email } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return ApiResponse.error(res, 404, 'User not found');
    }

    if (user.isVerified) {
      return ApiResponse.error(res, 400, 'Email already verified');
    }

    // Delete existing OTPs
    await prisma.code.deleteMany({
      where: {
        userId: user.id,
        type: 'EMAIL_VERIFICATION'
      }
    });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new OTP record
    await prisma.code.create({
      data: {
        code: otp,
        type: 'EMAIL_VERIFICATION',
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Send OTP email
    const emailService = new EmailService();
    await emailService.sendVerificationEmail(email, otp);

    return ApiResponse.success(res, 200, 'New OTP sent');
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('required'))) {
      return res.status(400).json({ message: error.message });
    }
    // Handle other errors
    return ApiResponse.serverError(res, error);
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = validateForgotPasswordInput(req.body);
    const { email } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Avoid revealing user existence
      return ApiResponse.success(res, 200, 'If your email is registered, you will receive a password reset link');
    }

    if (user.status === 'DISABLED') {
      return ApiResponse.error(res, 400, 'Account is disabled. Please contact support.');
    }

    // Delete existing reset tokens
    await prisma.code.deleteMany({
      where: {
        userId: user.id,
        type: 'PASSWORD_RESET'
      }
    });

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Create reset token record
    await prisma.code.create({
      data: {
        code: resetToken,
        type: 'PASSWORD_RESET',
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send reset email
    const emailService = new EmailService();
    await emailService.sendPasswordResetEmail(email, resetToken);

    return ApiResponse.success(res, 200, 'If your email is registered, you will receive a password reset link');
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('required'))) {
      return res.status(400).json({ message: error.message });
    }
    // Handle other errors
    return ApiResponse.serverError(res, error);
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = validateResetPasswordInput(req.body);
    const { token, newPassword } = validatedData;

    // Find reset code
    const resetCode = await prisma.code.findFirst({
      where: {
        code: token,
        type: 'PASSWORD_RESET',
        expiresAt: { gt: new Date() },
      },
      include: { user: true }
    });

    if (!resetCode) {
      return ApiResponse.error(res, 400, 'Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: resetCode.userId },
      data: { password: hashedPassword },
    });

    // Delete used token
    await prisma.code.delete({ where: { id: resetCode.id } });

    return ApiResponse.success(res, 200, 'Password reset successful. Please login with your new password.');
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('required'))) {
      return res.status(400).json({ message: error.message });
    }
    // Handle other errors
    return ApiResponse.serverError(res, error);
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = validateRefreshTokenInput(req.body);
    const { refreshToken } = validatedData;

    const utilsService = new UtilsService();
    // Verify refresh token
    let decoded;
    try {
      decoded = await utilsService.verifyRefreshToken(refreshToken);
    } catch (error) {
      return ApiResponse.error(res, 401, 'Invalid refresh token');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true
      }
    });

    if (!user || user.status === 'DISABLED') {
      return ApiResponse.error(res, 401, 'User not found or account disabled');
    }

    // Generate new access token
    const newAccessToken = utilsService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return ApiResponse.success(res, 200, 'Token refreshed successfully', {
      token: newAccessToken
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('required'))) {
      return res.status(400).json({ message: error.message });
    }
    // Handle other errors
    return ApiResponse.serverError(res, error);
  }
};

/**
 * Change password (authenticated user)
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = validateChangePasswordInput(req.body);
    const { currentPassword, newPassword } = validatedData;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: userId is added by auth middleware
    const userId = req.user.id;

    // Find user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return ApiResponse.error(res, 404, 'User not found');
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return ApiResponse.error(res, 401, 'Current password is incorrect');
    }

    // Check password difference
    if (currentPassword === newPassword) {
      return ApiResponse.error(res, 400, 'New password must be different from current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return ApiResponse.success(res, 200, 'Password changed successfully');
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('required'))) {
      return res.status(400).json({ message: error.message });
    }
    // Handle other errors
    return ApiResponse.serverError(res, error);
  }
};