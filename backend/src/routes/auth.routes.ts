// src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login, verifyEmail, resendOtp, forgotPassword, resetPassword, refreshToken, changePassword } from '../controllers/auth.controller';
import { makeMiddleware } from '../middleware';

const authRouter = Router();

const { protect } = makeMiddleware()
 
// Public routes
authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/resend-otp', resendOtp);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/forgot-password', forgotPassword);

// Protected routes
authRouter.post('/change-password', protect, changePassword);

export default authRouter