import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    return console.log('MONGODB_URI is not defined in the environment variables.');
  }

  if (isConnected) {
    return console.log('=> Using existing database connection');
  }

  try {
    await mongoose.connect(mongoUri, {});
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
