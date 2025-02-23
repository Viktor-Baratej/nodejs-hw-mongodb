const express = require('express');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');
const pinoPretty = require('pino-pretty');
const contactsRouter = require('./routes/contacts');

/**
 * Функція для створення та запуску сервера
 */
function setupServer() {
  const app = express();

  const logger = pinoHttp({ logger: pino(pinoPretty()) }); // ✅ Оновлено

  app.use(cors());
  app.use(logger);
  app.use(express.json());

  // Реєструємо маршрути
  app.use('/contacts', contactsRouter);

  // Обробка неіснуючих маршрутів
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { setupServer };
