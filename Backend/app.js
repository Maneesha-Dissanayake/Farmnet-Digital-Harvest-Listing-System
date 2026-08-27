console.log("Hello Server");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoDB_URI } = require('./config/configure');

// Import admin routes
const adminRoutes = require('./Routes/adminRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Mount admin routes
app.use('/api/admin', adminRoutes);

// Root route for health check (Use GET instead of USE)
app.get('/', (req, res) => {
  res.send('Server is running and ready');
});

// Connect to MongoDB and start server
mongoose.connect(MongoDB_URI)
  .then(() => {
    console.log('Connected to database');
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch((err) => {
    console.log(err);
  });