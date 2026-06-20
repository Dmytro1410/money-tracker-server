import { Hono } from 'hono';
import { getProfile } from './controllers';

const router = new Hono();

router.post('/', getProfile);

export default router;
