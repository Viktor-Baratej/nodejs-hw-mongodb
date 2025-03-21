import * as contactsService from '../services/contacts.js';
import createError from 'http-errors';

// Отримати всі контакти
export const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      throw createError(401, 'Not authorized (missing userId)');
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const filter = { userId }; // 🔐 фільтрація по авторизованому користувачу

    if (req.query.type) filter.contactType = req.query.type;
    if (req.query.isFavourite !== undefined) {
      filter.isFavourite = req.query.isFavourite === 'true';
    }

    const skip = (page - 1) * perPage;

    const totalItems = await contactsService.countFilteredContacts(filter);
    const contacts = await contactsService.getPaginatedContacts({
      filter,
      skip,
      limit: perPage,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages: Math.ceil(totalItems / perPage),
        hasPreviousPage: page > 1,
        hasNextPage: page * perPage < totalItems,
      },
    });
  } catch (error) {
    console.error('Error in getAllContacts:', error);
    next(error);
  }
};

// Отримати контакт за ID
export const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await contactsService.getContactById(
      req.params.contactId,
      userId,
    );

    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.json({ status: 200, data: contact });
  } catch (error) {
    next(error);
  }
};

// Створити новий контакт
export const createContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phoneNumber, email, contactType, isFavourite } = req.body;

    const newContact = await contactsService.createContact({
      name,
      phoneNumber,
      email,
      contactType,
      isFavourite,
      userId, // 🔐 додаємо userId
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// Оновити контакт
export const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;
    const updateData = req.body;

    const updatedContact = await contactsService.updateContact(
      contactId,
      userId,
      updateData,
    );

    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// Видалити контакт
export const deleteContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;

    const deletedContact = await contactsService.deleteContact(
      contactId,
      userId,
    );

    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
