import express from 'express';
import {
  getProfile,
  updateProfile,
} from '../controllers/user.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// All user routes are protected — must be logged in
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;