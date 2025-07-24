import express from 'express';
import { body } from 'express-validator';
import { 
  createPost, 
  getPosts, 
  getPostById, 
  updatePost, 
  deletePost, 
  searchPosts 
} from '../controllers/post.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

const postValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('author').optional().trim()
];

router.post('/', authMiddleware, postValidation, createPost);

router.get('/', getPosts);

router.get('/:id', getPostById);

router.put('/:id', authMiddleware, postValidation, updatePost);

router.delete('/:id', authMiddleware, deletePost);

router.get('/search', searchPosts);

export default router;