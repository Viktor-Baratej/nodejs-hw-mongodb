import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { findOrCreateGoogleUser } from '../services/authService.js';

dotenv.config();

// Стратегія для Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Пошук або створення користувача
        const user = await findOrCreateGoogleUser(profile);
        done(null, user); // Відправка користувача в сесію
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

// Сериалізація та десериалізація користувача в сесію
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await user.findById(id);
  done(null, user);
});
