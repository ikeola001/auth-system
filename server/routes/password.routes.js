import express from 'express';
import {
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/password.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes — no login required
router.post('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);

// Protected routes — must be logged in
router.put('/change', protect, changePassword);

export default router;