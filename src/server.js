
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pinoPretty from 'pino-pretty';
import contactsRouter from './routes/contacts.js';

/**
 * Функція для створення та запуску сервера
 */
function setupServer() {
  const app = express();
  const logger = pinoHttp({ logger: pino(pinoPretty()) });
   // Налаштування CORS та логування
  app.use(cors());
  app.use(logger);
  app.use(express.json({ spaces: 2 }));
  app.set('json spaces', 2);
  // Реєструємо маршрути
  app.use('/contacts', contactsRouter);
  // Обробка неіснуючих маршрутів
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });
   // Визначення порту (з .env або за замовчуванням 3000)
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default setupServer;

