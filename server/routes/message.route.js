import express from 'express';
import { protectRoute } from '../middleware/auth.route.js';
import {
  getUsersForSidebar,
  getMessages,
  sendMessage
} from '../controllers/message.controller.js';

const router = express.Router();

// Define the routes
router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

export default router;
