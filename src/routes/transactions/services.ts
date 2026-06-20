import {
  IFetchExistingTransaction,
  IFetchPairedTransaction,
  IFetchTransactions,
  IModifyTransaction,
  IPostTransaction,
  IRemoveByIdTransaction,
  IRemoveByPairIdTransaction,
} from '../../types/transactions/servicesModels';
import { IGetTransactionDB, ITransactionDBResponse } from '../../types/transactions/DBModels';

const transactionsKey = 'transactions';

// GET

export const fetchTransactions = async ({
  from, to, supabase,
}: IFetchTransactions) => supabase
  .from(transactionsKey)
  .select(`
      *,
      account:accounts!transactions_account_id_fkey(id,name,currency,color),
      to_account:accounts!transactions_transfer_to_account_id_fkey(id,name,currency,color),
      category:categories(id,name,icon,color,parent_id)
    `)
  .gte('date', from)
  .lte('date', to)
  .order('date', { ascending: false });

export const fetchExistingTransaction = ({
  id, supabase,
}: IFetchExistingTransaction) => supabase
  .from(transactionsKey)
  .select('type, transfer_pair_id, account_id, transfer_to_account_id')
  .eq('id', id)
  .single<IGetTransactionDB>();

export const fetchPairedTransactions = ({
  existing, supabase,
}: IFetchPairedTransaction) => supabase
  .from('transactions')
  .select('id, account_id, transfer_to_account_id')
  .eq('transfer_pair_id', existing.transfer_pair_id);

// POST

export const postTransaction = ({
  body, selector = '*', supabase,
}: IPostTransaction) => supabase
  .from(transactionsKey)
  .insert(body)
  .select(selector)
  .single<ITransactionDBResponse>();

// PUT

export const modifyTransaction = ({
  body,
  id,
  supabase,
}: IModifyTransaction) => supabase
  .from(transactionsKey)
  .update(body)
  .eq('id', id)
  .select()
  .single<ITransactionDBResponse>();

// DELETE

export const removeTransactionById = (
  { id, supabase }: IRemoveByIdTransaction,
) => supabase
  .from(transactionsKey)
  .delete()
  .eq('id', id);

export const removeTransactionByTransferPairId = ({
  transferPairId,
  supabase,
  excludeId,
}: IRemoveByPairIdTransaction) => {
  const query = supabase
    .from(transactionsKey)
    .delete()
    .eq('transfer_pair_id', transferPairId);

  return excludeId ? query.neq('id', excludeId) : query;
};
