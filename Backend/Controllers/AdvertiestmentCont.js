const Advertiesetment = require('../Model/Advertiesetment');

// 1. Create new Advertisement
const createAdvertisement = async (req, res) => {
  try {
    const sellerId = req.user?.id || req.user?._id;
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

    const imageUrls = req.files.map(file => file.path); // Cloudinary URLs[cite: 1, 6]

    const newAd = new Advertiesetment({
      seller_id: sellerId, // Uses the safe, verified sellerId[cite: 1, 3]
      ...req.body,
      isOrganic: req.body.isOrganic === 'true' || req.body.isOrganic === true, // Safely parse boolean string[cite: 1, 6]
      acceptsBids: req.body.acceptsBids === 'true' || req.body.acceptsBids === true,
      images: imageUrls,
      status: 'pending', // Pending for admin approval[cite: 1, 2]
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
    // Sort by creation date (newest first)[cite: 1, 2]
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

    // Queries only records created by the authenticated seller ID[cite: 1, 3]
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
    const { id } = req.params; //[cite: 2, 4]
    
    // Find ad and populate seller details from User collection[cite: 1, 2]
    const advertisement = await Advertiesetment.findById(id).populate(
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
      message: 'Server error retrieving harvest advertisement', //[cite: 2]
      error: error.message,
    });
  }
};

module.exports = { 
  createAdvertisement,
  getAllAdvertisements,
  getMyAdvertisements,
  getAdvertisementById
};