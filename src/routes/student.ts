import {Router} from 'express';
import student from '../controllers/student';

const router = Router();

router.post('/register', student.register);
router.post('/login', student.login);
router.get('/verify-email', student.verifyEmail);

export default router;
