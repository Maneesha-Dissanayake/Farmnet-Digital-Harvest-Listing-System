const Review = require('../Model/Review');

// Create a new seller review
const createReview = async (req, res) => {
  try {
    const { sellerId, rating, comment } = req.body;
    
    // req.user comes from your authentication middleware (identifying the logged-in user)
    const userId = req.user ? req.user.id : req.body.userId; 

    if (!sellerId || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide sellerId, rating, and comment.' });
    }

    const newReview = new Review({
      sellerId,
      userId,
      rating,
      comment
    });

    const savedReview = await newReview.save();
    
    res.status(201).json({
      message: 'Review added successfully!',
      review: savedReview
    });
  } catch (err) {
    console.error('Error saving review:', err.message);
    res.status(500).json({ message: 'Server error while saving review.' });
  }
};

module.exports = {
  createReview
};