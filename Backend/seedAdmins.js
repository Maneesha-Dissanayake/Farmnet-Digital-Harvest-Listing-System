require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Model/userModel');

const seedFiveAdmins = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.\n');

    // Build the 5 admin objects from process.env
    const admins = [];
    for (let i = 1; i <= 5; i++) {
      const email = process.env[`ADMIN${i}_EMAIL`];
      const password = process.env[`ADMIN${i}_PASSWORD`];
      const fullName = process.env[`ADMIN${i}_FULLNAME`];
      const username = process.env[`ADMIN${i}_USERNAME`];

      if (email && password) {
        admins.push({
          fullName: fullName || `Admin ${i}`,
          username: username || `admin${i}`,
          email: email.toLowerCase().trim(),
          password: password.trim(),
          role: 'admin',
          isActive: true,
        });
      } else {
        console.warn(`[WARNING] ADMIN${i}_EMAIL or ADMIN${i}_PASSWORD is missing in .env`);
      }
    }

    if (admins.length === 0) {
      throw new Error('No valid admin credentials found in .env');
    }

    // Iterate and insert each admin
    for (const adminData of admins) {
      const existingAdmin = await User.findOne({ email: adminData.email });

      if (existingAdmin) {
        console.log(`[EXISTS] ${adminData.email} is already registered.`);
      } else {
        await User.create(adminData);
        console.log(`[CREATED] Admin account: ${adminData.email} (${adminData.fullName})`);
      }
    }

    console.log('\nAll 5 admin accounts processed successfully.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\nSeeding failed:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedFiveAdmins();