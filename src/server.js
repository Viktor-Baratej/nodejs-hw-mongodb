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
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

// Ініціалізуємо змінні оточення
dotenv.config();

// Фікс для __dirname у ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Завантаження Swagger документації
const swaggerDocument = YAML.load(path.join(__dirname, './docs/openapi.yaml'));

function setupServer() {
  const app = express();
  const logger = pinoHttp({ logger: pino(pinoPretty()) });

  app.use(cors());
  app.use(logger);
  app.use(express.json({ spaces: 2 }));
  app.use(cookieParser());

  // Маршрути
  app.use('/auth', Router);
  app.use('/api/auth', Router);
  app.use('/contacts', contactsRouter);

  // Документація Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Middleware
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(
      `📚 Swagger Docs available at http://localhost:${PORT}/api-docs`,
    );
  });
}

export default setupServer;
