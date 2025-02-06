import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { app, server } from './lib/socket.js';

dotenv.config(); // Load environment variables from a .env file

const PORT = process.env.PORT;

// Middleware setup
app.use(express.json({ limit: '50mb' })); // // Middleware to parse JSON, with increased body size limit
app.use(cookieParser()); // Middleware to parse cookies

// CORS configuration to allow requests from the frontend
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
