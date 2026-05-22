import User from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';
import { sendVerificationEmail } from '../services/email.service.js';
import crypto from 'crypto';

// ─── Verify Email ──────────────────────────────────────────────────
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Find user with this token and check it hasn't expired
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, 'Verification link is invalid or has expired.');
    }

    // Mark user as verified and clear the token fields
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

// ─── Resend Verification Email ─────────────────────────────────────
export const resendVerification = async (req, res, next) => {
  try {
    const user = req.user;

    // If already verified, no need to resend
    if (user.isVerified) {
      throw new ApiError(400, 'Your email is already verified.');
    }

    // Generate a fresh token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Save new token to user
    user.verifyToken = verifyToken;
    user.verifyTokenExpiry = verifyTokenExpiry;
    await user.save({ validateBeforeSave: false });

    // Send the email
    await sendVerificationEmail(user.email, user.name, verifyToken);

    res.status(200).json({
      success: true,
      message: 'Verification email resent. Please check your inbox.',
    });
  } catch (error) {
    next(error);
  }
};