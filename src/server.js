import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pinoPretty from 'pino-pretty';
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
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
import './auth/googleStrategy.js';
import googleAuthRouter from './routers/authGoogle.js';

// Ініціалізація змінних оточення
dotenv.config();

// Фікс для __dirname у ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
  fs.readFileSync(new URL('../docs/swagger.json', import.meta.url))
);

function setupServer() {
  const app = express();

  // Налаштовуємо CORS для дозволу запитів з наших доменів
  app.use(cors({
    origin: ['https://localhost:3001', 'https://nodejs-hw-mongodb-7-gti2.onrender.com'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true // Для підтримки cookies
  }));

  // Налаштування Google OAuth 2.0
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Ваш clientID
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Ваш clientSecret
    callbackURL: 'https://nodejs-hw-mongodb-7-gti2.onrender.com/auth/google/callback', // URL для Google callback
  }, function(token, tokenSecret, profile, done) {
    // Обробка отриманого профілю користувача
    return done(null, profile);
  }));

  const logger = pinoHttp({ logger: pino(pinoPretty()) });

  // Ініціалізація middleware
  app.use('/auth', googleAuthRouter);
  app.use(logger);
  app.use(express.json({ spaces: 2 }));
  app.use(cookieParser());

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
