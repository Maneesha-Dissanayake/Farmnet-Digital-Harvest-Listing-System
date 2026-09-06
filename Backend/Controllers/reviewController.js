const Review = require('../Model/Review');

// Create a new seller review
const createReview = async (req, res) => {
  try {
    const { sellerId, rating, comment } = req.body;
    
    // Gets user ID from auth middleware or request body
    const userId = req.user ? req.user.id : req.body.userId; 

    // Validates required review fields
    if (!sellerId || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide sellerId, rating, and comment.' });
    }

    // Creates new review instance
    const newReview = new Review({
      sellerId,
      userId,
      rating,
      comment
    });

    // Saves review to database
    const savedReview = await newReview.save();
    
    // Sends success response
    res.status(201).json({
      message: 'Review added successfully!',
      review: savedReview
    });
  } catch (err) {
    // Handles server errors
    console.error('Error saving review:', err.message);
    res.status(500).json({ message: 'Server error while saving review.' });
  }
};

module.exports = {
  createReview
};