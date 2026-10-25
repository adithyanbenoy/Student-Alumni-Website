import express from 'express';
import {
  getPosts,
  createPost,
  toggleLike,
  addComment,
  deletePost
} from '../controllers/postController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getPosts);
router.post('/', protect, createPost);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);
router.delete('/:id', protect, deletePost);

export default router;
