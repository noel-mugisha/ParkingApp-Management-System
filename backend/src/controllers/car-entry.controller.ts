import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { ApiResponse } from "../utils/response";
import { validateCreateCarEntryInput, validateUpdateCarEntryInput } from "../schema/car-entry.schema";

export const createCarEntry = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - from auth middleware
    const { role } = req.user;

    if (role !== "Admin" && role !== "ParkingAttendant") {
      return ApiResponse.error(res, 403, "Only admins and parking attendants can register car entries");
    }

    const validated = validateCreateCarEntryInput(req.body);
    const { plateNumber, parkingCode } = validated;

    const parking = await prisma.parking.findUnique({
      where: { id: parkingCode },
    });

    if (!parking) {
      return ApiResponse.error(res, 404, "Parking lot not found");
    }

    if (parking.numberOfAvailableSpaces <= 0) {
      return ApiResponse.error(res, 400, "No available spaces in the parking lot");
    }

    const carEntry = await prisma.$transaction(async (tx) => {
      const entry = await tx.carEntry.create({
        data: {
          plateNumber,
          parkingId: parkingCode,
          parkingCode,
          entryDateTime: new Date(),
          exitDateTime: null,
          chargedAmount: 0,
        },
      });

      const ticket = await tx.ticket.create({
        data: {
          carEntryId: entry.id,
          parkingId: parkingCode,
          plateNumber,
          parkingName: parking.parkingName,
          entryDateTime: entry.entryDateTime,
        },
      });

      await tx.parking.update({
        where: { id: parking.id },
        data: { numberOfAvailableSpaces: { decrement: 1 } },
      });

      return { entry, ticket };
    });

    return ApiResponse.success(res, 201, "Car entry and ticket created successfully", {
      carEntry: carEntry.entry,
      ticket: carEntry.ticket,
    });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Invalid") || error.message.includes("required"))) {
      return res.status(400).json({ message: error.message });
    }
    return ApiResponse.serverError(res, error);
  }
};

export const getTicket = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { role } = req.user;

    if (role !== "Admin" && role !== "ParkingAttendant") {
      return ApiResponse.error(res, 403, "Only admins and parking attendants can view tickets");
    }

    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { carEntry: true, parking: true },
    });

    if (!ticket) {
      return ApiResponse.error(res, 404, "Ticket not found");
    }

    return ApiResponse.success(res, 200, "Ticket retrieved successfully", ticket);
  } catch (error) {
    return ApiResponse.serverError(res, error);
  }
};

export const getTicketsByCarEntry = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { role } = req.user;

    if (role !== "Admin" && role !== "ParkingAttendant") {
      return ApiResponse.error(res, 403, "Only admins and parking attendants can view tickets");
    }

    const { carEntryId } = req.query;
    console.log(carEntryId)

    if (!carEntryId || typeof carEntryId !== "string") {
      return ApiResponse.error(res, 400, "Car entry ID is required");
    }

    const tickets = await prisma.ticket.findMany({
      where: { carEntryId },
      include: { carEntry: true, parking: true },
    });

    return ApiResponse.success(res, 200, "Tickets retrieved successfully", tickets);
  } catch (error) {
    return ApiResponse.serverError(res, error);
  }
};

export const updateCarExit = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - from auth middleware
    const { id: userId, role } = req.user;

    if (role !== "Admin" && role !== "ParkingAttendant") {
      return ApiResponse.error(res, 403, "Only admins and parking attendants can update car exits");
    }

    const { id } = req.params;
    const validated = validateUpdateCarEntryInput(req.body);

    const carEntry = await prisma.carEntry.findUnique({
      where: { id },
      include: { parking: true },
    });

    if (!carEntry) {
      return ApiResponse.error(res, 404, "Car entry not found");
    }

    if (carEntry.exitDateTime) {
      return ApiResponse.error(res, 400, "Car has already exited");
    }

    const exitDateTime = validated.exitDateTime ? new Date(validated.exitDateTime) : new Date();
    const durationHours = (exitDateTime.getTime() - new Date(carEntry.entryDateTime).getTime()) / (1000 * 60 * 60);
    const chargedAmount = validated.chargedAmount ?? (durationHours * carEntry.parking.chargingFeesPerHour);

    const updatedCarEntry = await prisma.$transaction(async (tx) => {
      const entry = await tx.carEntry.update({
        where: { id },
        data: {
          exitDateTime,
          chargedAmount,
        },
      });

      await tx.parking.update({
        where: { id: carEntry.parkingId },
        data: { numberOfAvailableSpaces: { increment: 1 } },
      });

      return entry;
    });

    return ApiResponse.success(res, 200, "Car exit updated successfully", { carEntry: updatedCarEntry });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Invalid") || error.message.includes("required"))) {
      return res.status(400).json({ message: error.message });
    }
    return ApiResponse.serverError(res, error);
  }
};

export const getAllCarEntries = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { role } = req.user;

    if (role !== "Admin" && role !== "ParkingAttendant") {
      return ApiResponse.error(res, 403, "Only admins and parking attendants can view car entries");
    }

    const carEntries = await prisma.carEntry.findMany({
      select: {
        id: true,
        plateNumber: true,
        parkingId: true,
        entryDateTime: true,
        exitDateTime: true,
        chargedAmount: true,
        createdAt: true,
        updatedAt: true,
        parking: { select: { parkingName: true } },
      },
    });

    return ApiResponse.success(res, 200, "Car entries retrieved successfully", carEntries);
  } catch (error) {
    return ApiResponse.serverError(res, error);
  }
};


export const getOutgoingCars = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { role } = req.user;

    if (role !== "Admin" && role !== "ParkingAttendant") {
      return ApiResponse.error(res, 403, "Only admins and parking attendants can view outgoing cars");
    }

    const { startDateTime, endDateTime } = req.query;

    if (!startDateTime || !endDateTime) {
      return ApiResponse.error(res, 400, "Start and end date-time are required");
    }

    const start = new Date(startDateTime as string);
    const end = new Date(endDateTime as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return ApiResponse.error(res, 400, "Invalid date-time format");
    }

    if (start >= end) {
      return ApiResponse.error(res, 400, "Start date-time must be before end date-time");
    }

    const outgoingCars = await prisma.carEntry.findMany({
      where: {
        exitDateTime: {
          gte: start,
          lte: end,
          not: null,
        },
      },
      select: {
        id: true,
        plateNumber: true,
        parkingId: true,
        entryDateTime: true,
        exitDateTime: true,
        chargedAmount: true,
        parking: { select: { parkingName: true } },
      },
    });

    return ApiResponse.success(res, 200, "Outgoing cars retrieved successfully", outgoingCars);
  } catch (error) {
    return ApiResponse.serverError(res, error);
  }
};

export const getEnteredCars = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { role } = req.user;

    if (role !== "Admin" && role !== "ParkingAttendant") {
      return ApiResponse.error(res, 403, "Only admins and parking attendants can view entered cars");
    }

    const { startDateTime, endDateTime } = req.query;

    if (!startDateTime || !endDateTime) {
      return ApiResponse.error(res, 400, "Start and end date-time are required");
    }

    const start = new Date(startDateTime as string);
    const end = new Date(endDateTime as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return ApiResponse.error(res, 400, "Invalid date-time format");
    }

    if (start >= end) {
      return ApiResponse.error(res, 400, "Start date-time must be before end date-time");
    }

    const enteredCars = await prisma.carEntry.findMany({
      where: {
        entryDateTime: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id: true,
        plateNumber: true,
        parkingId: true,
        entryDateTime: true,
        exitDateTime: true,
        parking: { select: { parkingName: true } },
      },
    });

    return ApiResponse.success(res, 200, "Entered cars retrieved successfully", enteredCars);
  } catch (error) {
    return ApiResponse.serverError(res, error);
  }
};