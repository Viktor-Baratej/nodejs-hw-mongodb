import Contact from '../models/contact.js';

// Отримати список контактів з підтримкою пагінації, фільтрації, сортування
export const getPaginatedContacts = async ({
  filter,
  skip,
  limit,
  sortBy,
  sortOrder,
}) => {
  return await Contact.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });
};

// Підрахунок кількості контактів після фільтрації
export const countFilteredContacts = async (filter) => {
  return await Contact.countDocuments(filter);
};

// Отримати контакт за ID і userId
export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

// Створити новий контакт
export const createContact = async (data) => {
  return await Contact.create(data);
};

// Оновити контакт по ID та userId
export const updateContact = async (contactId, userId, data) => {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, data, {
    new: true,
    runValidators: true,
  });
};

// Видалити контакт по ID та userId
export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
