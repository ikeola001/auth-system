import { randomBytes } from 'crypto';
import User from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken, sendTokenCookies, verifyRefreshToken } from '../services/token.service.js';
import { sendVerificationEmail } from '../services/email.service.js';

// ─── Register ──────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'Email is already registered.');
    }

    const verifyToken = randomBytes(32).toString('hex');
    const verifyTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password,
      verifyToken,
      verifyTokenExpiry,
    });

    await sendVerificationEmail(email, name, verifyToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    console.log('Register error:', error.message);
    console.log('Stack:', error.stack);
    next(error);
  }
};
// ─── Login ─────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    if (!user.isVerified) {
      throw new ApiError(403, 'Please verify your email before logging in.');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    sendTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      user,
    });
  } catch (error) {
    console.log('Login error:', error.message);
    next(error);
  }
};

// ─── Logout ────────────────────────────────────────────────────────
export const logout = async (req, res, next) => {
  try {
    req.user.refreshToken = undefined;
    await req.user.save({ validateBeforeSave: false });

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    console.log('Logout error:', error.message);
    next(error);
  }
};

// ─── Refresh Access Token ──────────────────────────────────────────
export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      throw new ApiError(401, 'No refresh token. Please log in.');
    }

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      throw new ApiError(401, 'Invalid refresh token. Please log in again.');
    }

    const newAccessToken = generateAccessToken(user._id);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Access token refreshed.',
    });
  } catch (error) {
    console.log('Refresh error:', error.message);
    next(error);
  }
};