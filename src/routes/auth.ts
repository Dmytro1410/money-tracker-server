import { Hono } from 'hono';
import { getLogout, postLogin } from '../controllers/auth';

const router = new Hono();

router.post('/login', postLogin);

router.get('/logout', getLogout);

export default router;
