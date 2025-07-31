import express from 'express';
const router = express.Router();

import {loginUser} from '../controllers/loginController.js';

router.post('/login/user', loginUser);

export default router;