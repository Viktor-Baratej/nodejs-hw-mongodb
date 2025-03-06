// функція-обгортка для контролерів
const ctrlWrapper = (ctrl) => {
  //  Приймає контролер як параметр
  return async (req, res, next) => {
    // Повертає нову async-функцію
    try {
      await ctrl(req, res, next); // Виконує переданий контролер
    } catch (err) {
      next(err); // Якщо є помилка, передаємо її в `errorHandler`
    }
  };
};

export default ctrlWrapper;
