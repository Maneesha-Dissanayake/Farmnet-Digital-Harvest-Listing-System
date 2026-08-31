const Advertiesetment = require('../Model/Advertiesetment');

//Create new Advertisements
const createAdvertisement = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least 1 image is required.' });
    }

    const imageUrls = req.files.map(file => file.path);

    const newAd = new Advertiesetment({
      //seller_id: req.user.id, // apply this after intergrate
      ...req.body,
      isOrganic: req.body.isOrganic === 'true',
      acceptsBids: req.body.acceptsBids === 'true',
      images: imageUrls,
      
      status: 'pending' 
    });

    const savedAd = await newAd.save();
    return res.status(201).json({ message: 'Advertisement submitted for admin approval!', ad: savedAd });
    
  } catch (error) {
    console.error('Advertisement Error:', error);
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

//Get all Advertiesetments from backend
const getAllAdvertisements = async (req, res) => {
  try {
    // Fetch all advertisements with status 'active' and sort by creation date (newest first)
    const listings = await Advertiesetment.find({ status: 'active' }).sort({ createdAt: -1 });
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

module.exports = { 
  createAdvertisement,
  getAllAdvertisements
};