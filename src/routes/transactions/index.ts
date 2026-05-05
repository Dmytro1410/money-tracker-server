import { Hono } from 'hono';
import { getTransactions } from './controllers';

const router = new Hono();

router.get('/', getTransactions);

export default router;
