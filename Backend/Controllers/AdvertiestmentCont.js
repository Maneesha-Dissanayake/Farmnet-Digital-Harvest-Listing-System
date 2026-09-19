const Advertiesetment = require('../Model/Advertiesetment');
const { deleteFromCloudinary } = require('../utils/cloudinary');

// 1. Create new Advertisement
const createAdvertisement = async (req, res) => {
  try {
    const sellerId = req.user?.id || req.user?._id;  //get the seller id
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Please log in to post an advertisement.'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least 1 image is required.' 
      });
    }

    const imageUrls = req.files.map(file => file.path); // getting Cloudinary URLs

    const newAd = new Advertiesetment({     // Create advertisetement
      seller_id: sellerId, // Uses the safe, verified sellerId
      ...req.body,
      isOrganic: req.body.isOrganic === 'true' || req.body.isOrganic === true, // Safely parse boolean string
      acceptsBids: req.body.acceptsBids === 'true' || req.body.acceptsBids === true,
      images: imageUrls,
      status: 'pending', // Pending for admin approval
    });

    const savedAd = await newAd.save();
    return res.status(201).json({ 
      success: true, 
      message: 'Advertisement submitted for admin approval!', 
      ad: savedAd 
    });
    
  } catch (error) {
    console.error('Advertisement Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Upload failed', 
      error: error.message 
    });
  }
};

// 2. Get all Advertisements (For Public Marketplace)
const getAllAdvertisements = async (req, res) => {
  try {
    // Sort by creation date (newest first)
    const listings = await Advertiesetment.find({ 
      status: { $in: ['active', 'Active', 'Approved'] } 
    }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch advertisements', 
      error: error.message 
    });
  }
};

// 3. Get listings for the authenticated seller
const getMyAdvertisements = async (req, res) => {
  try {
    const sellerId = req.user?.id || req.user?._id;
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Session missing'
      });
    }

    // Queries only records created by the authenticated seller ID
    const myListings = await Advertiesetment.find({ seller_id: sellerId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, myListings });
  } catch (error) {
    console.error('Error fetching seller listings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch your listings',
      error: error.message
    });
  }
};

// 4. Get a single advertisement by ID
const getAdvertisementById = async (req, res) => {
  try {
    const { id } = req.params; //
    
    // Find ad and populate seller details from User collection
    const advertisement = await Advertiesetment.findById(id).populate( //getting selected fields
      'seller_id',
      'fullName phone avatar experience title rating district'
    );

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Harvest advertisement not found', //
      });
    }

    return res.status(200).json({
      success: true,
      advertisement,
    });
  } catch (error) {
    console.error('Error fetching advertisement by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving harvest advertisement', //
      error: error.message,
    });
  }
};
//Edit Advertisement page

const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const existingAd = await Advertiesetment.findById(id);

    if (!existingAd) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    // 1. Safely gather kept images sent from the frontend
    let keptImages = [];
    if (req.body.existingImages) {
      keptImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }

    // 2. Identify removed images and delete them from Cloudinary
    const previousImages = Array.isArray(existingAd.images) ? existingAd.images : [];
    const imagesToDelete = previousImages.filter((img) => !keptImages.includes(img));

    console.log('Images to remove from Cloudinary:', imagesToDelete);

    // 3. Wait for all deletions to complete in Cloudinary
    await Promise.all(imagesToDelete.map((imgUrl) => deleteFromCloudinary(imgUrl)));

    // 3. Collect new image paths uploaded through Multer Cloudinary
    const newImageUrls = req.files && req.files.length > 0
      ? req.files.map((file) => file.path)
      : [];
    const finalImages = [...keptImages, ...newImageUrls];

    if (finalImages.length === 0) {
      return res.status(400).json({ success: false, message: 'At least 1 image is required.' });
    }

    // 4. Update document and route back to admin for re-approval
    const updatedAd = await Advertiesetment.findByIdAndUpdate(
      id,
      {
        ...req.body,
        isOrganic: req.body.isOrganic === 'true' || req.body.isOrganic === true,
        acceptsBids: req.body.acceptsBids === 'true' || req.body.acceptsBids === true,
        images: finalImages,
        status: 'pending', // Re-routes to Admin Review queue
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Advertisement updated and submitted for admin review!',
      ad: updatedAd,
    });
  } catch (error) {
    console.error('Error updating advertisement:', error);
    return res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

module.exports = { 
  createAdvertisement,
  getAllAdvertisements,
  getMyAdvertisements,
  getAdvertisementById,
  updateAdvertisement
};