import { Hono } from 'hono';
import { createTransaction } from './controllers/post';
import { getAllTransactions } from './controllers/get';
import { deleteTransaction } from './controllers/delete';
import { updateTransaction } from './controllers/put';

const router = new Hono();

router.get('/all', getAllTransactions);
// router.get('/:id', getTransactionById);

router.post('/', createTransaction);

router.put('/:id', updateTransaction);

router.delete('/', deleteTransaction);

export default router;
