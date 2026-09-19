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
// Function to delete image from cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;
    
    // Extract public_id with folder path: farmnet/advertisements/filename
    const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    if (matches && matches[1]) {
      const publicId = matches[1];
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
  }
};

module.exports = { cloudinary, upload, deleteFromCloudinary };