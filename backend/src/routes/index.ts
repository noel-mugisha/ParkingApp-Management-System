import { Router } from "express";
import carEntryRouter from "./car-entry.routes";
import authRouter from "./auth.routes";
import parkingRouter from "./parking.routes";
import profileRouter from "./profile.routes";

const router = Router()

router.use('/auth', authRouter)
router.use('/profile', profileRouter)
router.use('/parking', parkingRouter)
router.use('/car-entry', carEntryRouter)

export default router