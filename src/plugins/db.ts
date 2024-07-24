import mongoose from 'mongoose';
import config from '../constants/config';
import courseModel from '../modules/courses/model';
import userModel from '../modules/users/model';

export default async function () {
  try {
    const conn = await mongoose.connect(config.db.mongodb, { autoIndex: true });
    mongoose.set('strictQuery', false);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Info: MongoDB connection successful:', conn.connection.name);
  } catch (err) {
    console.log('Error: Failed to connect MongoDB:', err);
  }
}
