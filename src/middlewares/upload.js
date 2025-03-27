import multer from 'multer';
import storage from '../helpers/cloudinary.js';

const upload = multer({ storage });

export default upload;
