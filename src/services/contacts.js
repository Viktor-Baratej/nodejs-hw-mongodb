import Contact from '../models/contact.js';

// Сервіс для отримання всіх контактів з підтримкою пагінації, ільтрації та сортування
export const getFilteredContacts = async ({
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

// Підрахувати загальну кількість контактів після фільтрації
export const countFilteredContacts = async (filter) => {
  return await Contact.countDocuments(filter);
};

// Сервіс для отримання контакту за ID
export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

// Сервіс для створення нового контакту
export const createContact = async (data) => {
  return await Contact.create(data);
};

//  Сервіс для зміни контакту
export const updateContact = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Сервіс для видалення контакту
export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
