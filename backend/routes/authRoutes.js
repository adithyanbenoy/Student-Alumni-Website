import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  getAllUsers,
  getUserById
} from '../controllers/authController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/users', optionalAuth, getAllUsers);
router.get('/users/:id', optionalAuth, getUserById);

export default router;
