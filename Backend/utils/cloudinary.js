// backend/utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Connect to your Cloudinary Account using your .env keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Set up the Storage Engine (Where and how to save the images)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'farmnet/harvest_advertisements', // This folder will be automatically created in your Cloudinary account
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp'], // Acceptable image formats
    transformation: [{ width: 1000, crop: 'limit', quality: 'auto' }], // Compresses the image to save your free space!
  },
});

// 3. Create the upload middleware (Allow max 5MB per image)
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

module.exports = { cloudinary, upload };