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
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.includes('cloudinary.com')) {
      console.log('Skipping deletion: Not a valid Cloudinary URL ->', imageUrl);
      return;
    }

    // 1. Get everything after '/upload/'
    const parts = imageUrl.split('/upload/');
    if (parts.length < 2) return;

    const cleanPath = parts[1]
      .replace(/^.*v\d+\//, '') // Strips everything up to and including the version (v1234567/)
      .replace(/\.[^/.]+$/, ''); // Strips the file extension (.jpg, .png, etc.)

    console.log('Target Public ID for deletion:', cleanPath);

    // 3. Request destruction from Cloudinary
    const result = await cloudinary.uploader.destroy(cleanPath, {
      resource_type: 'image',
      invalidate: true, // Clears Cloudinary CDN cache
    });

    console.log(`Cloudinary API Response for [${cleanPath}]:`, result);
  } catch (error) {
    console.error('Error during Cloudinary deletion:', error);
  }
};

module.exports = { cloudinary, upload, deleteFromCloudinary };