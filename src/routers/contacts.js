import express from 'express';
import * as contactsController from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import {
  contactSchema,
  updateContactSchema,
} from '../schema/contactSchemas.js';

const router = express.Router();

// Роут для отримання всіх контактів
router.get('/', ctrlWrapper(contactsController.getAllContacts));

// Роут для отримання контакту за ID
router.get(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsController.getContactById),
);

// Роут для створення нового контакту
router.post(
  '/',
  validateBody(contactSchema),
  ctrlWrapper(contactsController.createContact),
);

// Роут для оновлення контакту
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsController.updateContact),
);

// Роут для видалення контакту
router.delete(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsController.deleteContact),
);

export default router;
