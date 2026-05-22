import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
  // If the error is our custom ApiError, use its status code
  // Otherwise default to 500 (server error)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;