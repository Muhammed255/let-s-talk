import express from 'express';
// controllers
import user from '../controllers/user.js';
import { decode } from '../middlewares/jwt.js';

const router = express.Router();

router
  .get('/all', decode, user.onGetAllUsers)
  .post('/signup', user.onCreateUser)
  .get('/:id', user.onGetUserById)
  .delete('/:id', user.onDeleteUserById)

export default router;
