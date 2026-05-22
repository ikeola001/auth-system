import express from 'express';
import {
  verifyEmail,
  resendVerification,
} from '../controllers/email.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes — no login required
router.get('/verify/:token', verifyEmail);

// Protected routes — must be logged in
router.post('/resend-verification', protect, resendVerification);

export default router;