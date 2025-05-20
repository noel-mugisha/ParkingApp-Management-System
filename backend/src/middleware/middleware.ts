import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';
import { ZodError } from 'zod';
import { prisma } from '../database/prisma';
import { UtilsService } from '../services/utils.service';

export interface ErrorBody {
  status: number;
  message: string;
}

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export interface Middleware {
  exampleLogger(req: Request, res: Response, next: NextFunction): void;
  protect(req: AuthRequest, res: Response, next: NextFunction): void;
  admin(req: AuthRequest, res: Response, next: NextFunction): void;
  routeNotFound(req: Request, res: Response, next: NextFunction): void;
  errorHandler(err: Error, req: Request, res: Response<ErrorBody>, next: NextFunction): Response;
}

export const makeMiddleware = (): Middleware => {
  return {
    exampleLogger: (req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
      next();
    },
    protect: async (req: AuthRequest, res: Response, next: NextFunction) => {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return next(new HttpError(401, 'Not authorized, no token'));
      }
      
      try {
        const utilsService = new UtilsService();
        const decoded = await utilsService.verifyAccessToken(token);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user || user.status === 'DISABLED') {
          return next(new HttpError(401, 'User not found or disabled'));
        }

        req.user = decoded;
        next();
      } catch (error) {
        return next(new HttpError(401, 'Not authorized, token failed'));
      }
    },
    admin: (req: AuthRequest, res: Response, next: NextFunction) => {
      if (req.user && (req.user.role === 'Admin' || req.user.role === 'SuperAdmin')) {
        next();
      } else {
        return next(new HttpError(403, 'Not authorized as admin'));
      }
    },
    routeNotFound: (req, res, next) => {
      return next(new HttpError(404, 'Route not found'));
    },
    errorHandler: (err, req, res, next) => {
      if (err instanceof HttpError) {
        return res.status(err.status).send({ status: err.status, message: err.message });
      } else if (err instanceof ZodError) {
        return res.status(400).send({ status: 400, message: 'Invalid request' });
      } else {
        console.log(
          `ERROR: ${new Date().toISOString()} - ${req.method} ${req.originalUrl} - `,
          err,
        );
        return res.status(500).send({ status: 500, message: 'Something went wrong' });
      }
    },
  };
};