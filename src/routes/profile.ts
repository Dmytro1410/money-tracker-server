import { Hono } from 'hono';
import { getProfile } from '../controllers/profile';

const router = new Hono();

router.post('/', getProfile);

export default router;
