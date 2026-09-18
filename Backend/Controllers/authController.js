const User = require('../Model/userModel');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to generate JWT token containing user ID and Role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user (Seller or Buyer)
// @route   POST /api/auth/register
// @access  Public (Guest)
exports.registerUser = async (req, res) => {
  try {
    const {
      role,
      email,
      fullName,
      username,
      contactNumber,
      nicNumber,
      farmAddress,
      sellerPassword,
      buyerPassword,
      buyerEmail,
      buyerContact,
      profileImage,
    } = req.body;

    const selectedRole = role === 'seller' ? 'seller' : 'buyer';
    const targetEmail = selectedRole === 'seller' ? email : buyerEmail;
    const targetPassword = selectedRole === 'seller' ? sellerPassword : buyerPassword;

    if (!targetEmail || !targetPassword) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    // Upload profile image to Cloudinary if provided
    let uploadedImageUrl = '';
    if (profileImage && profileImage.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(profileImage, {
        folder: 'farmnet/profiles',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        ],
      });
      uploadedImageUrl = uploadResponse.secure_url;
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: targetEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Prepare payload based on selected role
    const userData = {
      role: selectedRole,
      email: targetEmail,
      password: targetPassword,
      profileImage: uploadedImageUrl || '',
    };

    if (selectedRole === 'seller') {
      userData.fullName = fullName;
      userData.contactNumber = contactNumber;
      userData.nicNumber = nicNumber;
      userData.farmAddress = farmAddress;
    } else {
      userData.username = username;
      userData.contactNumber = buyerContact;
    }

    // Save user (password automatically hashed by pre-save hook)
    const user = await User.create(userData);

    // Return token and user payload
    res.status(201).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        displayName: user.fullName || user.username || user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public (Guest)
exports.loginUser = async (req, res) => {
  try {
    const { emailOrUsername, email, username, password } = req.body;
    const identifier = emailOrUsername || email || username;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please enter both credentials and password' });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier },
      ],
    });

    // 1. Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is blocked
    if (user.isActive === false) {
      return res.status(403).json({ 
        message: 'Your account has been blocked by the Administrator. Please contact support.' 
      });
    }

    // Check password match via bcrypt instance method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        contactNumber: user.contactNumber,
        profileImage: user.profileImage || '',
        displayName: user.fullName || user.username || user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current authenticated user info
// @route   GET /api/auth/me
// @access  Private (Buyer / Seller / Admin)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Check if user is blocked
    if (user && user.isActive === false) {
        return res.status(403).json({ message: 'Your account has been blocked.' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Update current logged-in user profile
// @route   PUT /api/auth/profile
// @access  Private (Buyer / Seller / Admin)
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user is blocked
    if (user.isActive === false) {
      return res.status(403).json({ message: 'Your account has been blocked.' });
    }

    // Upload new profile image to Cloudinary if provided as a base64 string
    if (req.body.profileImage && req.body.profileImage.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(req.body.profileImage, {
        folder: 'farmnet/profiles',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        ],
      });
      user.profileImage = uploadResponse.secure_url;
    }

    // Update editable fields
    if (req.body.fullName !== undefined) user.fullName = req.body.fullName;
    if (req.body.username !== undefined) user.username = req.body.username;
    if (req.body.email !== undefined) user.email = req.body.email.toLowerCase();
    if (req.body.contactNumber !== undefined) user.contactNumber = req.body.contactNumber;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        role: updatedUser.role,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        contactNumber: updatedUser.contactNumber,
        profileImage: updatedUser.profileImage || '',
        displayName: updatedUser.fullName || updatedUser.username || updatedUser.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Username or Email already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};