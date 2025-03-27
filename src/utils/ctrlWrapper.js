// функція-обгортка для контролерів

const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next); // Виконує переданий контролер
    } catch (err) {
      next(err); // Якщо є помилка, передаємо її в `errorHandler`
    }
  };
};

export default ctrlWrapper;



