import { Context } from 'hono';
import { fetchTransactions } from './services';

export const getTransactions = async (c: Context) => {
  const supabase = c.get('supabase');
  const { from, to } = c.req.query();
  const { data, error } = await fetchTransactions(supabase, from, to);

  if (error) {
    console.error('Supabase Error:', error);
    return c.json({ error: error.message }, 400);
  }

  return c.json(data);
};
