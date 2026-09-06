require('dotenv').config();

const MongoDB_URI = process.env.MONGODB_URI;

module.exports = { MongoDB_URI };