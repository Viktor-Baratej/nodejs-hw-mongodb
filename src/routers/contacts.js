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

// Отримати всі контакти
router.get('/', ctrlWrapper(contactsController.getAllContacts));

// Отримати контакт за ID
router.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactsController.getContactById),
);

// Створити новий контакт (з валідацією `body`)
router.post(
  '/',
  validateBody(contactSchema),
  ctrlWrapper(contactsController.createContact),
);

// Оновити контакт (з валідацією `body` та `contactId`)
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsController.updateContact),
);

// Видалити контакт
router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactsController.deleteContact),
);

export default router;
