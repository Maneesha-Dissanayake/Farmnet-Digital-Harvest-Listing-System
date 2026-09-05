const User = require('../Model/userModel');
const Advertisement = require('../Model/Advertiesetment');
const Category = require('../Model/Category'); 
const Conversation = require('../Model/Conversation'); 

// 1. Get Dashboard Stats (
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'seller' }); // Lowercase fixed
    const totalBuyers = await User.countDocuments({ role: 'buyer' }); // Lowercase fixed
    // Note: You must add a 'status' field to Advertiesetment.js model for this to work perfectly 
    const pendingAds = await Advertisement.countDocuments({ status: 'pending' });
    const activeListings = await Advertisement.countDocuments({ status: 'active' });

    res.status(200).json({
      totalUsers,
      totalSellers,
      totalBuyers,
      activeListings,
      pendingAds
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// 2. Get All Users 
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    
    const formattedUsers = users.map(u => ({
      _id: u._id,
      name: u.fullName || u.username || 'Unknown User',
      email: u.email,
      role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
      status: u.isActive ? 'Verified' : 'Blocked' // Fixed isActive mapping
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// 3. Update User Status 
const updateUserStatus = async (req, res) => {
  try {
    const { id, action } = req.params;
    
    // Check who is being targeted
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent blocking or deleting any admin account
    if (targetUser.role === 'admin') {
      return res.status(403).json({ message: 'Cannot block or delete an administrator account!' });
    }

    let updateData = {};
    if (action === 'block') updateData = { isActive: false };
    else if (action === 'unblock') updateData = { isActive: true };
    else if (action === 'delete') {
      await User.findByIdAndDelete(id);
      return res.status(200).json({ message: 'User deleted' });
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    res.status(200).json({ message: `User ${action}ed successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// 4. Get Pending Ads 
const getPendingAds = async (req, res) => {
  try {
    // Make sure to update your Advertisement model with: status: { type: String, default: 'pending' }
    const ads = await Advertisement.find({ status: 'pending' });
    // Removed populate() because seller doesn't exist in your schema, and category is just a String
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ads', error: error.message });
  }
};

// 5. Moderate Ad
const moderateAd = async (req, res) => {
  try {
    const { id, action } = req.params;
    
    if (action === 'approve') {
      const ad = await Advertisement.findByIdAndUpdate(id, { status: 'active' }, { new: true });
      res.status(200).json({ message: 'Advertisement approved', ad });
    } else if (action === 'reject') {
      await Advertisement.findByIdAndDelete(id);
      res.status(200).json({ message: 'Advertisement rejected and deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error moderating ad', error: error.message });
  }
};

// 6. Category Setup Functions 
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const newCategory = new Category({ name: req.body.name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error adding category', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

// 7. Chat Audits Function 
const getChatAudits = async (req, res) => {
  try {
    const chats = await Conversation.find().populate('participants', 'fullName username');
    const formattedChats = chats.map(chat => ({
      _id: chat._id,
      user1Name: chat.participants[0]?.fullName || chat.participants[0]?.username || 'User 1',
      user2Name: chat.participants[1]?.fullName || chat.participants[1]?.username || 'User 2',
      message: chat.lastMessageText || 'No recent messages',
      isFlagged: chat.isFlagged
    }));
    res.status(200).json(formattedChats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
};

// 8. Admin Password Update
const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // req.user.id comes from the adminAuth middleware
    const admin = await User.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    // Verify current password match
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Set new password and save (automatically hashed by pre-save hook in userModel.js)
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};

// 9. Platform Summary Report Data
const getPlatformSummaryReport = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const activeAds = await Advertisement.countDocuments({ status: 'active' });
    const pendingAds = await Advertisement.countDocuments({ status: 'pending' });
    const totalCategories = await Category.countDocuments();

    // Get metrics for the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });
    const newAdsThisMonth = await Advertisement.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.status(200).json({
      success: true,
      generatedAt: new Date(),
      stats: {
        totalUsers,
        totalSellers,
        totalBuyers,
        activeAds,
        pendingAds,
        totalCategories,
        newUsersThisMonth,
        newAdsThisMonth
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report summary', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getPendingAds,
  moderateAd,
  getCategories,
  addCategory,
  deleteCategory,
  getChatAudits,
  updateAdminPassword,
  getPlatformSummaryReport,
};