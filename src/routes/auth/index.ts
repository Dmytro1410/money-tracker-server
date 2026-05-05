import { Hono } from 'hono';
import { logout, login } from './controllers';

const router = new Hono();

router.post('/login', login);

router.get('/logout', logout);

export default router;
