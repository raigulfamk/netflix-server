// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { errorResponse } from '../utils/responseHelper.js';
import { HttpStatus } from '../utils/constants.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      return errorResponse(res, 'Not authorized to access this route', HttpStatus.UNAUTHORIZED);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return errorResponse(res, 'The user belonging to this token no longer exists', HttpStatus.UNAUTHORIZED);
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return errorResponse(res, 'User recently changed password. Please log in again', HttpStatus.UNAUTHORIZED);
    }
    req.user = currentUser;
    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized to access this route', HttpStatus.UNAUTHORIZED);
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'You do not have permission to perform this action', HttpStatus.FORBIDDEN);
    }
    next();
  };
};