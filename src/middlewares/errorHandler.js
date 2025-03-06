// middleware для обробки помилок у Express.js.
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500; // Отримуємо статус помилки

  res.status(status).json({
    status, // Код статусу HTTP (наприклад, 400, 404, 500)
    message: 'Something went wrong',
    data: err.message, // Реальне повідомлення про помилку (наприклад, "Contact not found")
  });
};
export default errorHandler;
