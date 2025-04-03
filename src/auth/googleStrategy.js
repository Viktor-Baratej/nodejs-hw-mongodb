import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { findOrCreateGoogleUser } from '../services/authService.js';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: 'https://nodejs-hw-mongodb-7-gti2.onrender.com/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateGoogleUser(profile);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
