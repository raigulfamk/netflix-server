import express from 'express';
import { Login, Logout, Register } from '../controllers/userController.js';
import { validateLogin, validateRegistration } from '../middleware/validation.js';

const router = express.Router();

router.route('/register').post(validateRegistration, Register);
router.route('/login').post(validateLogin, Login);
router.route('/logout').get(Logout);

export default router;