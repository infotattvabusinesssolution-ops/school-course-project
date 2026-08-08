import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.model.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminEmail = 'admin@crmisa.com';
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    // Create the admin user
    const admin = await User.create({
      name: 'CRMISA Admin',
      email: adminEmail,
      passwordHash: 'Admin@123', // the pre-save hook in User model will hash this
      role: 'ADMIN'
    });

    console.log('Admin user successfully seeded!');
    console.log('Email:', adminEmail);
    console.log('Password:', 'Admin@123');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
