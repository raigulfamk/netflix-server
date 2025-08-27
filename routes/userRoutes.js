import express from 'express';
import { Login, Logout, Register } from '../controllers/userController.js';
import { validateLogin, validateRegistration } from '../middleware/validation.js';

const router = express.Router();

// Register route
router.post('/register', validateRegistration, Register);

// Login route
router.post('/login', validateLogin, Login);

// Logout route
router.get('/logout', Logout);

export default router;
