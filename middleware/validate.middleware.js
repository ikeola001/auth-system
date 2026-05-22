import { validationResult } from 'express-validator';

const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    for (let validation of validations) {
      await validation.run(req);
    }

    // Check if there are any errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg, // return only the first error
      });
    }

    next();
  };
};

export default validate;