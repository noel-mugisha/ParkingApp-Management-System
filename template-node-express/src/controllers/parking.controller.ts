import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { ApiResponse } from '../utils/response';
import { validateCreateParkingInput, validateUpdateParkingInput } from '../schema/parking.schema';

/**
 * Create a new parking lot (Admin only)
 */
export const createParking = async (req: Request, res: Response) => {
    try {
        // @ts-ignore - from auth middleware
        const { id: userId, role } = req.user;

        if (role !== 'Admin') {
            return ApiResponse.error(res, 403, 'Only admins can create parking lots');
        }

        const validated = validateCreateParkingInput(req.body);
        const { parkingName, numberOfAvailableSpaces, chargingFeesPerHour } = validated;

        const existing = await prisma.parking.findUnique({ where: { parkingName } });
        if (existing) {
            return ApiResponse.error(res, 400, 'Parking lot with this name already exists');
        }

        const parking = await prisma.parking.create({
            data: {
                parkingName,
                numberOfAvailableSpaces,
                chargingFeesPerHour,
            },
        });

        return ApiResponse.success(res, 201, 'Parking lot created successfully', { parking });
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
 * Get all parking lots (Admin and Parking Attendant)
 */
export const getAllParkings = async (req: Request, res: Response) => {
    try {
        const parkings = await prisma.parking.findMany({
            select: {
                id: true,
                parkingName: true,
                numberOfAvailableSpaces: true,
                chargingFeesPerHour: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return ApiResponse.success(res, 200, 'Parking lots retrieved successfully', parkings);
    } catch (error) {
        return ApiResponse.serverError(res, error);
    }
};

/**
 * Update a parking lot (Admin only)
 */
export const updateParking = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const { id: userId, role } = req.user;

        if (role !== 'Admin') {
            return ApiResponse.error(res, 403, 'Only admins can update parking lots');
        }

        const { id } = req.params;
        const validated = validateUpdateParkingInput(req.body);
        const { parkingName, numberOfAvailableSpaces, chargingFeesPerHour } = validated;

        const existing = await prisma.parking.findUnique({
            where: { id },
        });

        if (!existing) {
            return ApiResponse.error(res, 404, 'Parking lot not found');
        }

        const updatedParking = await prisma.parking.update({
            where: { id },
            data: { parkingName, numberOfAvailableSpaces, chargingFeesPerHour },
        });

        return ApiResponse.success(res, 200, 'Parking lot updated successfully', { parking: updatedParking });
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
 * Delete a parking lot (Admin only)
 */
export const deleteParking = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const { id: userId, role } = req.user;

        if (role !== 'Admin') {
            return ApiResponse.error(res, 403, 'Only admins can delete parking lots');
        }

        const { id } = req.params;

        const existing = await prisma.parking.findUnique({
            where: { id },
        });

        if (!existing) {
            return ApiResponse.error(res, 404, 'Parking lot not found');
        }

        await prisma.parking.delete({ where: { id } });

        return ApiResponse.success(res, 200, 'Parking lot deleted successfully');
    } catch (error) {
        return ApiResponse.serverError(res, error);
    }
};