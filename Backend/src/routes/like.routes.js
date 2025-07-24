import express from 'express';
import { toggleLike, getLikesForPost, checkUserLike } from '../controllers/like.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Toggle like on a post
router.post('/:postId', authMiddleware, toggleLike);

// Get all likes for a post
router.get('/post/:postId', getLikesForPost);

// Check if current user has liked a post
router.get('/check/:postId', authMiddleware, checkUserLike);

export default router;
