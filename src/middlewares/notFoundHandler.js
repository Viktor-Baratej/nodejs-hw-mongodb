// middleware перехоплює запити на неіснуючі маршрути та створює помилку 404 за допомогою бібліотеки http-errors.

import createError from 'http-errors';

const notFoundHandler = (req, res, next) => {
  next(createError(404, 'Route not found'));
};

export default notFoundHandler;
