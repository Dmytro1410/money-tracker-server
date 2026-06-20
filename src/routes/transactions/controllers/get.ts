import { Context } from 'hono';
import { fetchTransactions } from '../services';
import { toTransactionGetDTO } from '../utils';
import { IGetTransactionDTO } from '../../../types/transactions/DTOModels';
import { IGetTransactionDB } from '../../../types/transactions/DBModels';
import { TransactionTypes } from '../../../types/transactions/common';

export const getAllTransactions = async (c: Context) => {
  const supabase = c.get('supabase');
  const { from, to } = c.req.query();
  const { data, error } = await fetchTransactions({ supabase, from, to });

  if (error) {
    console.error(`Supabase Error:getAllTransactions:from:${from};to:${to}`, error);
    return c.json({ error: error.message }, 400);
  }

  if (data) {
    const seenPairs = new Set<string>();
    const res: IGetTransactionDTO[] = (data as IGetTransactionDB[]).filter((tx) => {
      if (tx.type !== TransactionTypes.TRANSFER) return true;
      if (seenPairs.has(tx.id)) return false;
      if (tx.transfer_pair_id) seenPairs.add(tx.transfer_pair_id);
      return tx.transfer_to_account_id !== tx.account_id;
    }).map(toTransactionGetDTO);

    return c.json(res);
  }

  return c.json(data);
};
