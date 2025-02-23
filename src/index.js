require('dotenv').config();
const { setupServer } = require('./server');
const { initMongoConnection } = require('./db/initMongoConnection');
const Contact = require('./models/Contact');

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
