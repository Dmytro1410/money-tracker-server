import { Hono } from 'hono';
import { getAllCategories } from './controllers/get';

const router = new Hono();

router.get('/all', getAllCategories);

export default router;
