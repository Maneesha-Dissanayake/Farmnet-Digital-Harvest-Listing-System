const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');

const adminAuth = async (req, res, next) => {
  try {
    // Get token from the request header
    const authHeader = req.header('Authorization');
    
    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Extract the token string
    const token = authHeader.split(' ')[1];

    // Verify the token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user role is Admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Attach user data to request
    req.user = user;
    
    // Move to the next function
    next();
    
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = adminAuth;