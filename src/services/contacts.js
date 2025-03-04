import Contact from '../models/contact.js';

// 📌 Сервіс для отримання всіх контактів
export const getAllContacts = async () => {
  return await Contact.find();
};

// 📌 Сервіс для отримання контакту за ID
export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

// 📌 Сервіс для створення нового контакту
export const createContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
