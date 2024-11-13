import express from 'express';
import { register, login, checkUsernameAvailability } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check-username', checkUsernameAvailability);

export default router;