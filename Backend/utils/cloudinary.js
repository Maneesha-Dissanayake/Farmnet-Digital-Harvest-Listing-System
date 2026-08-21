// backend/utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Connect to your Cloudinary Account
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Set up the Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'farmnet/harvest_advertisements', 
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp'], // Acceptable image formats
    transformation: [{ width: 1000, crop: 'limit', quality: 'auto' }], 
  },
});

// 3. Create the upload middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }   //5MB limit
});

module.exports = { cloudinary, upload };