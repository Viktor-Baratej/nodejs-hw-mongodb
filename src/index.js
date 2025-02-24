import 'dotenv/config';
import setupServer from './server.js';
import mongoose from 'mongoose';

async function initMongoConnection() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

(async () => {
  await initMongoConnection();
  setupServer();
})();
