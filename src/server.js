import express from 'express';
import cors from 'cors'; // Імпортуємо cors
import pino from 'pino';
import pinoHttp from 'pino-http';
import pinoPretty from 'pino-pretty';
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

// Ініціалізуємо змінні оточення
dotenv.config();

// Фікс для __dirname у ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
  fs.readFileSync(new URL('../docs/swagger.json', import.meta.url))
);

function setupServer() {
  const app = express();

  // Налаштовуємо CORS
  app.use(cors({
    origin: 'https://nodejs-hw-mongodb-7-gti2.onrender.com',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true // Для підтримки cookies
  }));

  const logger = pinoHttp({ logger: pino(pinoPretty()) });
  app.use('/auth', googleAuthRouter);
  app.use(logger);
  app.use(express.json({ spaces: 2 }));
  app.use(cookieParser());

  // Роути
  app.use('/auth', Router);
  app.use('/api/auth', Router);
  app.use('/contacts', contactsRouter);

  // Swagger документація
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Обробники помилок
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
  });
}

export default setupServer;
