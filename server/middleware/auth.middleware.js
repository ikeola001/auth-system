import { verifyAccessToken } from '../services/token.service.js';
import User from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';

const protect = async (req, res, next) => {
  try {
    // Get the access token from cookies
    const token = req.cookies.accessToken;

    // If there's no token, the user is not logged in
    if (!token) {
      throw new ApiError(401, 'Not authorized. Please log in.');
    }

    // Verify the token is real and not expired
    const decoded = verifyAccessToken(token);

    // Find the user in the database using the ID inside the token
    const user = await User.findById(decoded.id);

    // If user no longer exists
    if (!user) {
      throw new ApiError(401, 'User no longer exists.');
    }

    // Attach the user to the request so controllers can use it
    req.user = user;

    // Move on to the next step (the actual route handler)
    next();
  } catch (error) {
    next(error);
  }
};

export default protect;