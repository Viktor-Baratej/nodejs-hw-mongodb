import isValidObjectId from 'mongoose';
import BadRequest from 'http-errors';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(BadRequest('Invalid contact ID format'));
  }
  next();
};
export default isValidId;
