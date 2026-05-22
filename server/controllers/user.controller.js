import User from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';

// ─── Get Profile ───────────────────────────────────────────────────
export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Update Profile ────────────────────────────────────────────────
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;

    // Fields that are allowed to be updated
    const allowedUpdates = {};
    if (name) allowedUpdates.name = name;
    if (bio !== undefined) allowedUpdates.bio = bio;
    if (avatar !== undefined) allowedUpdates.avatar = avatar;

    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.user._id,
      allowedUpdates,
      {
        new: true,           // return the updated user, not the old one
        runValidators: true, // run the schema validation on update
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user,
    });
  } catch (error) {
    next(error);
  }
};