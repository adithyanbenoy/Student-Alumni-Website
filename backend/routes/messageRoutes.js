import express from 'express';
import {
  getConversations,
  getMessagesWithUser,
  sendMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:otherUserId', protect, getMessagesWithUser);
router.post('/', protect, sendMessage);

export default router;
