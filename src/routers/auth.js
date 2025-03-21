import express from 'express';
import authController from '../controllers/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post('/register', ctrlWrapper(authController.registerUser));
router.post('/login', ctrlWrapper(authController.loginUser));
router.post('/refresh', ctrlWrapper(authController.refreshSession));

export default router;
