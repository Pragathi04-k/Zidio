import express from 'express';
import { 
  createComment, 
  getCommentsForPost,
  deleteComment 
} from '../controllers/comment.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post(
  '/add/:postId',
  authMiddleware,
  createComment
);


router.get('/post/:postId', getCommentsForPost);

router.use(authMiddleware);

router.delete('/:commentId', deleteComment);

router.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'API endpoint not found' 
  });
});

export default router;