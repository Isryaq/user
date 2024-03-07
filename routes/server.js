import express from 'express';
import userscontroller from '../controllers/userscontroller.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { refreshToken } from '../controllers/refreshtoken.js';

const router = express.Router();

router.get('/users', verifyToken, userscontroller.getUsers);
router.post('/register', userscontroller.register);
router.post('/login', userscontroller.login);
router.get('/token', refreshToken);
router.put('/name', verifyToken, userscontroller.updatename);
router.put('/password', verifyToken, userscontroller.updatepassword);
router.delete('/logout', verifyToken, userscontroller.logout);

export default router;