import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pinoPretty from 'pino-pretty';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import contactsRouter from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import Router from './routers/auth.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import session from 'express-session';
import './auth/googleStrategy.js';
import googleAuthRouter from './routers/authGoogle.js';


dotenv.config();

// Фікс для __dirname у ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
  fs.readFileSync(new URL('../docs/swagger.json', import.meta.url))
);

function setupServer() {
  const app = express();

  // Налаштування Google OAuth 2.0
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: 'https://nodejs-hw-mongodb-7-gti2.onrender.com/auth/google/callback',
  },

  function(token, tokenSecret, profile, done) {
    // Обробка отриманого профілю користувача
    return done(null, profile);
  }));

  // Сесія для Passport
  passport.serializeUser((user, done) => {
    done(null, user.id);  // Зберігаємо ID користувача в сесії
  });

  passport.deserializeUser(async (id, done) => {
    // Завантажуємо користувача за ID з бази даних
    const user = await user.findById(id);  // Замість user використовуйте правильну модель
    done(null, user);  // Повертаємо користувача з бази
  });

  const logger = pinoHttp({ logger: pino(pinoPretty()) });

  // Ініціалізація middleware
  app.use('/auth', googleAuthRouter);
  app.use(logger);
  app.use(express.json({ spaces: 2 }));
  app.use(cookieParser());

  // Для роботи з сесіями
  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
  }));

  // Роут для Google OAuth
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login', // Якщо не вдалося пройти авторизацію
    successRedirect: '/' // Якщо успішно, редирект на головну
  }));

  // Роут для решти API
  app.use('/auth', Router);
  app.use('/api/auth', Router);
  app.use('/contacts', contactsRouter);

  // Swagger документація
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Обробка помилок
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅ Сервер працює на порту ${PORT}`);
    console.log(`📚 Документація Swagger: http://localhost:${PORT}/api-docs`);
  });
}

export default setupServer;
