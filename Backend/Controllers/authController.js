const User = require('../Model/userModel');
const jwt = require('jsonwebtoken');

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
      profileImage: profileImage || '',
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

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
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
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};