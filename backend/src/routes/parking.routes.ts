// src/routes/vehicle.routes.ts
import express from 'express';
import { createParking, deleteParking, getAllParkings, updateParking } from '../controllers/parking.controller';
import { makeMiddleware } from '../middleware';

const parkingRouter = express.Router();

const { protect } = makeMiddleware()

parkingRouter.use(protect);

parkingRouter.post('/', createParking);
parkingRouter.get('/', getAllParkings);
parkingRouter.put('/:id', updateParking);
parkingRouter.delete('/:id', deleteParking);

export default parkingRouter