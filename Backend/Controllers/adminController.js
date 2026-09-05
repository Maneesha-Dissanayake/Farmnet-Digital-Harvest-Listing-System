const User = require('../Model/userModel');
const Advertisement = require('../Model/Advertiesetment');
const Category = require('../Model/Category'); 
const Conversation = require('../Model/Conversation'); 

// 1. Get Dashboard Stats (Accurately counting valid roles)
const getDashboardStats = async (req, res) => {
  try {
    const verifiedSellers = await User.countDocuments({ role: 'seller' }); 
    const registeredBuyers = await User.countDocuments({ role: 'buyer' }); 
    //const adminCount = await User.countDocuments({ role: 'admin' });
    
    // Total users = Sellers + Buyers + // Admins(+ admincount ) (ignores rogue/test records)
    const totalUsers = verifiedSellers + registeredBuyers;

    const pendingAds = await Advertisement.countDocuments({ status: 'pending' });

    res.status(200).json({
      totalUsers,
      verifiedSellers,
      registeredBuyers,
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
      status: u.isActive ? 'Verified' : 'Blocked'
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
    
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

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
    const ads = await Advertisement.find({ status: 'pending' });
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
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Advertisement.countDocuments({ category: cat.name });
        return {
          _id: cat._id,
          name: cat.name,
          count: count
        };
      })
    );

    res.status(200).json(categoriesWithCount);
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

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
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
    
    const admin = await User.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

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
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    const totalUsers = totalSellers + totalBuyers + adminCount;

    const activeAds = await Advertisement.countDocuments({ status: 'active' });
    const pendingAds = await Advertisement.countDocuments({ status: 'pending' });
    const totalCategories = await Category.countDocuments();

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

// 10. Get Analytics Data (Users by role & Listings count per category)
const getAnalytics = async (req, res) => {
  try {
    const sellersCount = await User.countDocuments({ role: 'seller' });
    const buyersCount = await User.countDocuments({ role: 'buyer' });

    const categories = await Category.find();
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Advertisement.countDocuments({ category: cat.name });
        return {
          name: cat.name,
          count: count
        };
      })
    );

    res.status(200).json({
      users: {
        sellers: sellersCount,
        buyers: buyersCount
      },
      categories: categoriesWithCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics data', error: error.message });
  }
};

// 11. Get Admin Settings / Profile
const getAdminSettings = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({
      displayName: admin.fullName || admin.username || '',
      notificationEmail: admin.email || ''
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

// 12. Update Admin Settings / Profile
const updateAdminSettings = async (req, res) => {
  try {
    const { displayName, notificationEmail } = req.body;
    const admin = await User.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (displayName) admin.fullName = displayName;
    if (notificationEmail) admin.email = notificationEmail;

    await admin.save();

    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully',
      displayName: admin.fullName || admin.username,
      notificationEmail: admin.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
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
  updateCategory,
  deleteCategory,
  getChatAudits,
  updateAdminPassword,
  getPlatformSummaryReport,
  getAnalytics,
  getAdminSettings,
  updateAdminSettings,
};