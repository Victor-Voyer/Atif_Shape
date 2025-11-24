import { Router } from 'express';

import { registerUser, login } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation } from '../middlewares/validators/auth.validator.js';

const router = Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, login);

export default router;