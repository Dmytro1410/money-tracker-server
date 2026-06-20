import { Context } from 'hono';
import { removeTransactionById, removeTransactionByTransferPairId } from '../services';

export const deleteTransaction = async (c: Context) => {
  const supabase = c.get('supabase');
  const body = await c.req.json();
  const { id, transferPairId } = body;

  const { error } = transferPairId
    ? await removeTransactionByTransferPairId({ supabase, transferPairId })
    : await removeTransactionById({ supabase, id });

  if (error) {
    console.error(`Supabase Error:deleteTransaction:${id}`, error);
    return c.json({ error: error.message }, 400);
  }

  c.status(204);
  return c.body(null);
};
