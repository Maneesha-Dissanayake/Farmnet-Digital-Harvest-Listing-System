const User = require('../Model/User');
const Advertisement = require('../Model/Advertiesetment');

// Get overall platform statistics for the Admin Dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'Seller' });
    const totalBuyers = await User.countDocuments({ role: 'Buyer' });
    const activeListings = await Advertisement.countDocuments({ status: 'Approved' });
    const pendingAds = await Advertisement.countDocuments({ status: 'Pending' });

    res.status(200).json({
      totalUsers,
      totalSellers,
      totalBuyers,
      activeListings,
      pendingAds
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Get all users for User Management table
const getAllUsers = async (req, res) => {
  try {
    // Exclude admins from the management list
    const users = await User.find({ role: { $ne: 'Admin' } }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Block, Unblock or Verify a user
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // e.g., 'Blocked', 'Verified', 'Pending'

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
};

// Get all pending advertisements for Moderation Queue
const getPendingAds = async (req, res) => {
  try {
    const ads = await Advertisement.find({ status: 'Pending' })
      .populate('seller', 'name email rating') // Get seller details
      .populate('category', 'name'); // Get category name
    
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending ads', error: error.message });
  }
};

// Approve or Reject an advertisement
const moderateAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const { status } = req.body; // 'Approved' or 'Rejected'

    const ad = await Advertisement.findByIdAndUpdate(
      adId,
      { status },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    res.status(200).json({ message: `Advertisement ${status}`, ad });
  } catch (error) {
    res.status(500).json({ message: 'Error moderating ad', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getPendingAds,
  moderateAd
};