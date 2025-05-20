import cors from 'cors';
import morgan from 'morgan';
import router from './routes';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { makeMiddleware } from './middleware';

export function makeApp(): Express {
  const app = express();
  app.use(express.json());
  const middleware = makeMiddleware();

  // Configure CORS to allow requests from the frontend
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(morgan('dev'));
  app.use(cookieParser());

  // Routes
  app.use('/api/v1', router);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Middleware for handling not found routes and errors
  app.use(middleware.routeNotFound);
  app.use(middleware.errorHandler);

  return app;
}