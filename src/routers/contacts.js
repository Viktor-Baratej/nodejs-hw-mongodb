import express from 'express';
import { getAllContacts, getContactById } from '../controllers/contacts.js';
import * as contactsController from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

// Роут для отримання всіх контактів
router.get('/', getAllContacts);

// Роут для отримання контакту за ID
router.get('/:contactId', getContactById);

// Роут для створення нового контакту
router.post('/', ctrlWrapper(contactsController.createContact));

// Роут для оновлення контакту
router.patch('/:contactId', ctrlWrapper(contactsController.updateContact));

// Роут для видалення контакту
router.delete('/:contactId', ctrlWrapper(contactsController.deleteContact));

export default router;
