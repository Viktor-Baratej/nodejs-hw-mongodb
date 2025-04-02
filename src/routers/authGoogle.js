import express from 'express';
import passport from 'passport';
import { generateToken } from '../utils/jwt.js'; // використовуєш у login, reuse

const router = express.Router();

// 1. Ініціація логіну
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Callback після Google логіну
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    const token = generateToken(req.user); // Генеруємо JWT на основі req.user
    res.redirect(`https://your-frontend-app.com?token=${token}`);
  }
);

export default router;
