import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pinoPretty from 'pino-pretty';
import contactsRouter from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import Router from './routers/auth.js';
import cookieParser from 'cookie-parser';

function setupServer() {
  const app = express();
  const logger = pinoHttp({ logger: pino(pinoPretty()) });

  app.use(cors());
  app.use(logger);
  app.use(express.json({ spaces: 2 }));
  app.use(cookieParser());
  app.use('/auth', Router);

  // Використання контактного роутера
  app.use('/contacts', contactsRouter);

  // Middleware для обробки запитів до неіснуючих маршрутів
  app.use(notFoundHandler);

  // Middleware для обробки помилок
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default setupServer;
