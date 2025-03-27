import express from 'express';
import authController from '../controllers/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, emailSchema, resetPasswordSchema } from '../schema/authSchemas.js';


const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(authController.registerUser));
router.post('/login', validateBody(loginSchema), ctrlWrapper(authController.loginUser));
router.post('/refresh', ctrlWrapper(authController.refreshSession));
router.post('/logout', ctrlWrapper(authController.logoutUser));
router.post('/send-reset-email', validateBody(emailSchema), ctrlWrapper(authController.sendResetEmail));
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(authController.resetPassword));


export default router;
