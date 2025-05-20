import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { ApiResponse } from '../utils/response';
import { validateUpdateProfileInput } from '../schema/profile.schema';

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    // Get user ID from auth middleware
    // @ts-ignore: userId is added by auth middleware
    const userId = req.user.id;

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return ApiResponse.error(res, 404, 'User not found');
    }

    return ApiResponse.success(res, 200, 'Profile retrieved successfully', { user });
  } catch (error) {
    // Handle errors
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('required'))) {
      return res.status(400).json({ message: error.message });
    }
    return ApiResponse.serverError(res, error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = validateUpdateProfileInput(req.body);
    const { firstName, lastName } = validatedData;

    // Get user ID from auth middleware
    // @ts-ignore: userId is added by auth middleware
    const userId = req.user.id;

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName
      }
    });

    return ApiResponse.success(res, 200, 'Profile updated successfully', { user: updatedUser });
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('required'))) {
      return res.status(400).json({ message: error.message });
    }
    // Handle other errors
    return ApiResponse.serverError(res, error);
  }
};