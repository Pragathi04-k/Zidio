import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/user.controllers.js';

const router = express.Router();

router.route('/').post(registerUser).get(getUsers);
router.post('/login', loginUser);
router
  .route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);
router
  .route('/:id')
  .delete(deleteUser)
  .get(getUserById)
  .put(updateUser);

export default router;
