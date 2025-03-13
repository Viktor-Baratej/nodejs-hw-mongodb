import createError from 'http-errors';

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return next(createError(400, errorMessages.join(', ')));
    }

    next();
  };
};

export default validateBody;
