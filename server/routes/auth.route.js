import express from 'express';
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.route.js';

const router = express.Router();

// Define the routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile);
router.get('/check', protectRoute, checkAuth);

export default router;
