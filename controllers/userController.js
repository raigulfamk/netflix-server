import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserMessages, HttpStatus } from "../utils/constants.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, UserMessages.FILL_ALL_FIELDS, HttpStatus.BAD_REQUEST);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, UserMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (!user.isActive) {
      return errorResponse(res, "Account is deactivated", HttpStatus.UNAUTHORIZED);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, UserMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };
    return res
      .cookie("token", token, cookieOptions)
      .status(HttpStatus.SUCCESS)
      .json({
        success: true,
        message: `${UserMessages.WELCOME_BACK} ${user.name}`,
        user,
        token,
      });

  } catch (error) {
    console.error("Login Error:", error);
    return errorResponse(res, UserMessages.SERVER_ERROR, HttpStatus.SERVER_ERROR);
  }
};

export const Logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };

    return res
      .cookie("token", "", cookieOptions)
      .status(HttpStatus.SUCCESS)
      .json({
        success: true,
        message: UserMessages.LOGOUT_SUCCESS,
      });
  } catch (error) {
    console.error("Logout Error:", error);
    return errorResponse(res, UserMessages.SERVER_ERROR, HttpStatus.SERVER_ERROR);
  }
};

export const Register = async (req, res) => {  
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return errorResponse(res, UserMessages.FILL_ALL_FIELDS, HttpStatus.BAD_REQUEST);
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, UserMessages.USER_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashPassword
    });

    return successResponse(
      res, 
      UserMessages.USER_REGISTERED, 
      { id: user._id, name: user.name, email: user.email }, 
      HttpStatus.CREATED
    );

  } catch (error) {
    console.error("Registration Error:", error);
    if (error.code === 11000) {
      return errorResponse(res, UserMessages.USER_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    
    return errorResponse(res, UserMessages.SERVER_ERROR, HttpStatus.SERVER_ERROR);
  }
};