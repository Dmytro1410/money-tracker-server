import { Context } from 'hono';
import { SupabaseClient } from '@supabase/supabase-js';
import { postTransaction } from '../services';
import { toTransactionPOSTDB, toTransactionPOSTDTO } from '../utils';
import { ITransactionPOSTBR } from '../../../types/transactions/BRModels';
import { TransactionTypes } from '../../../types/transactions/common';

interface ITransactionCreationProps {
  c: Context
  supabase: SupabaseClient
  payload: ITransactionPOSTBR
}

const createTransfer = async (
  { c, supabase, payload }: ITransactionCreationProps,
) => {
  const { accountId, transferToAccountId } = payload;
  if (!transferToAccountId || transferToAccountId === accountId) throw new Error('Select account for transfer');

  const transferPairId = crypto.randomUUID();
  const payloadDB = toTransactionPOSTDB(payload);

  // transaction #1 - from
  const { data: transaction1, error: err1 } = await postTransaction({
    supabase,
    body: {
      ...payloadDB,
      amount: -payload.amount,
      transfer_pair_id: transferPairId,
      transfer_to_account_id: transferToAccountId,
    },
  });

  if (err1) {
    console.error(`Supabase Error:Create Transfer-from:${JSON.stringify(payload)}`, err1);
    return c.json({ error: err1.message }, 400);
  }

  // transaction #2 - to
  const { data: transaction2, error: err2 } = await postTransaction({
    supabase,
    body: {
      ...payloadDB,
      account_id: transferToAccountId,
      transfer_pair_id: transferPairId,
      transfer_to_account_id: accountId,
    },
  });

  if (err2) {
    console.error(`Supabase Error:Create Transfer-to:${JSON.stringify(payload)}`, err2);
    return c.json({ error: err2.message }, 400);
  }

  return c.json({
    data:
      { from: toTransactionPOSTDTO(transaction1), to: toTransactionPOSTDTO(transaction2) },
  }, 201);
};

const createRegularTransaction = async (
  { c, supabase, payload }: ITransactionCreationProps,
) => {
  const payloadDB = toTransactionPOSTDB(payload);
  const { data, error } = await postTransaction({ supabase, body: payloadDB });
  if (error) {
    console.error(`Supabase Error:Create Regular Transaction:${JSON.stringify(payload)}`, error);
    return c.json({ error: error.message }, 400);
  }

  return c.json(data, 201);
};

export const createTransaction = async (c: Context) => {
  const supabase = c.get('supabase');
  const payload = await c.req.json() as ITransactionPOSTBR;

  return payload.type === TransactionTypes.TRANSFER
    ? createTransfer({ c, supabase, payload })
    : createRegularTransaction({ c, supabase, payload });
};
