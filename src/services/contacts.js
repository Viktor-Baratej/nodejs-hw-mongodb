import mongoose from 'mongoose';

// 📌 Модель Contact
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);

// 📌 Сервіс для отримання всіх контактів
export const getAllContacts = async () => {
  return await Contact.find();
};

// 📌 Сервіс для отримання контакту за ID
export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};
