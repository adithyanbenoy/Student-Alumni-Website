import express from 'express';
import {
  getEvents,
  createEvent,
  rsvpEvent
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getEvents);
router.post('/', protect, authorize('alumni', 'admin'), createEvent);
router.put('/:id/rsvp', protect, rsvpEvent);

export default router;
