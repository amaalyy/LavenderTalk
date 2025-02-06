import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express(); // Create an instance of the Express app
const server = http.createServer(app); // Create an HTTP server and pass the Express app to it

// Initialize Socket.IO with the HTTP server and CORS settings
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173']
  }
});

// function to get a user's socketId by their userId 
export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; // Return the socketId from the userSocketMap
}

// Store online users with their socketId in a map
const userSocketMap = {}; // {userId (as the key): socketId (as the value)}

io.on('connection', (socket) => { // listen to any coming connection for when a user connects to the server
  console.log('A user connected', socket.id); // Log the socket ID of the new connection

  const userId = socket.handshake.query.userId; // Get the userId from the connection request
  if (userId) userSocketMap[userId] = socket.id; // Store the userId and socketId mapping

  // Broadcast the list of all online users to all connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap)); // Send the online users' IDs to all clients

  socket.on('disconnect', () => { // listen to any disconnection for when a user disconnects from the server
    console.log('A user disconnected', socket.id); // Log the socket ID of the disconnected user
    delete userSocketMap[userId]; // Remove the user from the userSocketMap when they disconnect
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); // updated list of online users to all connected clients
  });
});

export { io, app, server };
