import express from 'express';
import { register, login, logout, refresh } from '../controllers/auth.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes — no login required
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes — must be logged in
router.post('/logout', protect, logout);

export default router;