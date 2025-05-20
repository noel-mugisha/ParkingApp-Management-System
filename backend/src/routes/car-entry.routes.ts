import { Router } from "express";
import { createCarEntry, getAllCarEntries, getEnteredCars, getOutgoingCars, getTicket, getTicketsByCarEntry, updateCarExit } from "../controllers/car-entry.controller";
import { makeMiddleware } from "../middleware";

const { protect } = makeMiddleware()
const carEntryRouter = Router();

carEntryRouter.use(protect)

carEntryRouter.post("/", createCarEntry);
carEntryRouter.put("/:id/exit", updateCarExit);
carEntryRouter.get("/", getAllCarEntries);
carEntryRouter.get("/ticket/:id", getTicket);
carEntryRouter.get("/ticket", getTicketsByCarEntry);
carEntryRouter.get("/outgoing", getOutgoingCars);
carEntryRouter.get("/entered", getEnteredCars);

export default carEntryRouter;