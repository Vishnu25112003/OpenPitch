import express from 'express';
const router = express.Router();

import {loginUser, loginAdmin} from '../controllers/loginController.js';

router.post('/login/user', loginUser);
router.post('/login/admin', loginAdmin);

export default router;