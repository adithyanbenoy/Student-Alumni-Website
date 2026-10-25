import express from 'express';
import {
  getMentors,
  sendMentorshipRequest,
  getMyRequests,
  updateRequestStatus,
  completeSession
} from '../controllers/mentorshipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mentors', protect, getMentors);
router.post('/request', protect, sendMentorshipRequest);
router.get('/my-requests', protect, getMyRequests);
router.put('/requests/:id/status', protect, updateRequestStatus);
router.put('/requests/:id/complete', protect, completeSession);

export default router;
