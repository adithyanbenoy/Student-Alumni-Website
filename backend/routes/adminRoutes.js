import express from 'express';
import {
  getDashboardStats,
  getAllUsersAdmin,
  toggleAlumniVerification,
  updateUserStatusOrRole,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require admin role
router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.get('/users', protect, authorize('admin'), getAllUsersAdmin);
router.put('/users/:id/verify', protect, authorize('admin'), toggleAlumniVerification);
router.put('/users/:id/status', protect, authorize('admin'), updateUserStatusOrRole);

// Announcements can be viewed by all authenticated users, created/deleted by admin
router.get('/announcements', protect, getAnnouncements);
router.post('/announcements', protect, authorize('admin'), createAnnouncement);
router.delete('/announcements/:id', protect, authorize('admin'), deleteAnnouncement);

export default router;
