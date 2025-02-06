import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Extract the current logged-in user's ID from req.user
    const filteredUsers = await User.find({ // Find all users except the logged-in user
      _id: { $ne: loggedInUserId } // // $ne = "Not Equal" → exclude the current user
    }).select('-password'); // Exclude the password field for security

    res.status(200).json(filteredUsers); // Send the filtered users as a JSON response
  } catch (error) {
    console.error('Error in getUsersForSidebar: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // Extract the userToChatId's ID from the request parameters
    const myId = req.user._id; // Extract the current authenticated user's ID from req.user

    // Find all messages exchanged between the current user and the other user in the database
    const messages = await Message.find({
      $or: [ // Match messages where either:
        { senderId: myId, receiverId: userToChatId }, // current user sent a message to the other user
        { senderId: userToChatId, receiverId: myId } // The other user sent a message to current user
      ]
    });

    res.status(200).json(messages); // Send the found messages as a JSON response
  } catch (error) {
    console.log('Error in getMessages controller: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params; // Extract the receiver's ID from the request parameters
    const senderId = req.user._id; // Extract the current authenticated user's ID from req.user

    let imageUrl; // To store the uploaded image URL
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
    }

    const newMessage = new Message({ // Create a new message document
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    await newMessage.save(); // Save the message to the database

    const receiverSocketId = getReceiverSocketId(receiverId); // Get the receiver's socket ID (if they are online)
    if (receiverSocketId) { // If the receiver is online
      io.to(receiverSocketId).emit('newMessage', newMessage); // send them the new message in real-time using Socket.IO
    }

    res.status(201).json(newMessage); // Send a response with the new message data
  } catch (error) {
    console.log('Error in sendMessage controller: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
