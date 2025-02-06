import mongoose from 'mongoose';

export const connectDB = async () => { // Function to connect to the MongoDB database
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI); // Use mongoose to connect to MongoDB using the URI from the environment variables
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.log('MongoDB connection error:', error);
  }
};
