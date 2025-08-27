// utils/responseHelper.js
const { HttpStatus } = require('./constants');

exports.successResponse = (res, message, data = null, statusCode = HttpStatus.SUCCESS) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

exports.errorResponse = (res, message, statusCode = HttpStatus.SERVER_ERROR) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

exports.validationError = (res, errors) => {
  return res.status(HttpStatus.BAD_REQUEST).json({
    success: false,
    message: "Validation failed",
    errors,
  });
};