import { Router } from "express";
import { makeMiddleware } from "../middleware";
import { getProfile, updateProfile } from "../controllers/profile.controller";

const { protect } = makeMiddleware()

const profileRouter = Router()

profileRouter.get('', protect, getProfile);
profileRouter.put('', protect, updateProfile);

export default profileRouter