import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/user.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'Not authorized (no token)');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(createError(401, 'Access token expired'));
    } else {
      next(createError(401, 'Not authorized'));
    }
  }
};

export default authenticate;
