import { HttpStatus } from "./constants.js";

export const successResponse = (res, message, data = null, statusCode = HttpStatus.SUCCESS) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message, statusCode = HttpStatus.SERVER_ERROR) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export const validationError = (res, errors) => {
  return res.status(HttpStatus.BAD_REQUEST).json({
    success: false,
    message: "Validation failed",
    errors,
  });
};
