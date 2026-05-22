import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

import connectDB from './config/db.js';
import errorHandler from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import passwordRoutes from './routes/password.routes.js';
import emailRoutes from './routes/email.routes.js';
import userRoutes from './routes/user.routes.js';

// Load env variables
dotenv.config();

const app = express();

// ─── Security Middleware ───────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 200,
    message: { message: 'Too many requests. Please try again later.' },
  });
  app.use(limiter);
}

// ─── General Middleware ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Health Check ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Auth API is running.' });
});

// ─── Routes ───────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/user', userRoutes);

// ─── Global Error Handler ──────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});