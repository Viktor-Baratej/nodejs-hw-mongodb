import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/User.js';
import Session from '../models/session.js';
import sendEmail from '../helpers/sendEmail.js';

const { JWT_SECRET, APP_DOMAIN } = process.env;

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '30d';


const registerUser = async (req, res, next) => {
  try {
    const { name = '', email = '', password } = req.body;

    if (!name.trim() || !email.trim() || !password) {
      throw createHttpError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email = '', password } = req.body;

    if (!email.trim() || !password) {
      throw createHttpError(400, 'Email and password are required');
    }

    if (!process.env.JWT_SECRET) {
      throw createHttpError(500, 'JWT_SECRET is not defined');
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) throw createHttpError(401, 'Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw createHttpError(401, 'Invalid credentials');

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      },
    );

    await Session.deleteMany({ userId: user._id });
    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { accessToken },
    });
  } catch (error) {
    console.error('❌ loginUser error:', error);
    next(error);
  }
};

const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw createHttpError(401, 'Refresh token missing');

    const session = await Session.findOne({ refreshToken });
    if (!session) throw createHttpError(401, 'Invalid refresh token');

    await Session.deleteOne({ _id: session._id });

    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      },
    );

    const newRefreshToken = jwt.sign(
      { userId: session.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      },
    );

    await Session.create({
      userId: session.userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw createHttpError(400, 'Refresh token is missing');

    await Session.findOneAndDelete({ refreshToken });
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

  try {
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `<p>To reset your password, click the link below:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    console.error('❌ Error while sending reset email:', error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return next(createHttpError(401, 'Token is expired or invalid.'));
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Видалити всі активні сесії користувача
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};


export default {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendResetEmail,
  resetPassword,
};

