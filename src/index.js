
import 'dotenv/config';
import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import Contact from './models/Contact.js';

(async () => {
  await initMongoConnection();

  try {
    const contacts = await Contact.find();
    console.log('Contacts from database:', contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
  }
  setupServer();
})();

