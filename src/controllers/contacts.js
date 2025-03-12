import * as contactsService from '../services/contacts.js';

export const getAllContacts = async (req, res, next) => {
  try {
    // Отримуємо параметри запиту
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    // Фільтри
    const filter = {};
    if (req.query.type) filter.contactType = req.query.type;
    if (req.query.isFavourite !== undefined) {
      filter.isFavourite = req.query.isFavourite === 'true';
    }

    // Обчислення skip
    const skip = (page - 1) * perPage;

    // Загальна кількість контактів після фільтрації
    const totalItems = await contactsService.countFilteredContacts(filter);

    // Отримання контактів із фільтрацією, пагінацією та сортуванням
    const contacts = await contactsService.getFilteredContacts({
      filter,
      skip,
      limit: perPage,
      sortBy,
      sortOrder,
    });

    // Формуємо відповідь сервера
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
