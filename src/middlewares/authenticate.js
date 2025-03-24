import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import createError from 'http-errors';
import User from '../models/user.js';
import Session from '../models/session';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Not authorized (missing or malformed token)');
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid token');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createError(401, 'Access token is invalid or logged out');
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(createError(401, 'Access token expired'));
    } else {
      next(createError(401, error.message || 'Not authorized'));
    }
  }
};

export default authenticate;
