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

// Отримання всіх контактів
router.get('/', ctrlWrapper(contactsController.getAllContacts));

// Отримання контакту за ID
router.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactsController.getContactById),
);

// Створення нового контакту
router.post(
  '/',
  validateBody(contactSchema),
  ctrlWrapper(contactsController.createContact),
);

// Оновлення контакту
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsController.updateContact),
);

// Видалення контакту
router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactsController.deleteContact),
);

export default router;
