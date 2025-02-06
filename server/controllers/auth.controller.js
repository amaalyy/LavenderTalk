import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body; // Extract user input from request body
  try {
    if (!fullName || !email || !password) { // Check if all required fields are provided
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) { // Password should be at least 6 characters
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email }); // Check if the email already exists in the database

    if (user) return res.status(400).json({ message: 'Email already exists' });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user document
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    if (newUser) {
      // generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({ // Send success response without the password
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('Error in signup controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }); // Find user by email

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateToken(user._id, res);

    res.status(200).json({ // Send user data without password
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    });
  } catch (error) {
    console.log('Error in login controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = (req, res) => {
  try {
    // Clear the JWT cookie to log out the user
    res.cookie('jwt', '', { maxAge: 0 }); // Sets the JWT cookie to an empty value with 0 expiration time
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body; // Extract the profile picture from the request body
    const userId = req.user._id; // Extract the current user's ID from req.user

    if (!profilePic) { // If no profile picture is provided, return an error response
      return res.status(400).json({ message: 'Profile pic is required' });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic); // / Upload the profile picture to Cloudinary
    const updatedUser = await User.findByIdAndUpdate( // Update the user's profile picture in the database with the Cloudinary URL
      userId, // Find the user by their ID
      { profilePic: uploadResponse.secure_url }, // Set the new profile picture URL
      { new: true } // Return the updated user document
    );

    res.status(200).json(updatedUser); // Send the updated user data back to the client
  } catch (error) {
    console.log('error in update profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user); // Return the current user's data attached to req.user
  } catch (error) {
    console.log('Error in checkAuth controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
