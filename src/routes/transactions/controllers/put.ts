import { Context } from 'hono';
import {
  fetchExistingTransaction,
  fetchPairedTransactions,
  modifyTransaction,
  postTransaction, removeTransactionByTransferPairId,
} from '../services';
import { getTransactionTypeChange, toTransactionPUTDB } from '../utils';
import { IModifyTransaction } from '../../../types/transactions/servicesModels';
import { IGetTransactionDB } from '../../../types/transactions/DBModels';
import { ITransactionPUTBR } from '../../../types/transactions/BRModels';

// handles expense/income → transfer
const updateRegularToTransfer = async (
  { supabase, id, body }: IModifyTransaction,
) => {
  const transferPairId = crypto.randomUUID();

  const { error: err1 } = await modifyTransaction({
    body: {
      ...body,
      amount: -Math.abs(body.amount),
      transfer_pair_id: transferPairId,
      transfer_to_account_id: body.transfer_to_account_id,
    },
    id,
    supabase,
  });

  if (err1) throw new Error(err1.message);

  const { data: toTx, error: err2 } = await postTransaction({
    supabase,
    body: {
      ...body,
      amount: Math.abs(body.amount),
      account_id: body.transfer_to_account_id!,
      transfer_to_account_id: body.account_id,
      transfer_pair_id: transferPairId,
    },
  });

  if (err2) throw new Error(err2.message);

  return { from: body, to: toTx };
};

// handles transfer → expense/income
const updateTransferToRegular = async ({
  supabase, id, body, existing,
}: IModifyTransaction & { existing: IGetTransactionDB }) => {
  const { error: deleteError } = await removeTransactionByTransferPairId(
    { excludeId: id, transferPairId: existing.transfer_pair_id!, supabase },
  );

  if (deleteError) throw new Error(deleteError.message);

  const { data, error } = await modifyTransaction({
    body: {
      ...body,
      transfer_pair_id: null,
      transfer_to_account_id: null,
    },
    id,
    supabase,
  });

  if (error) throw new Error(error.message);

  return data;
};

// handles transfer → transfer
const updateTransferTransaction = async ({
  supabase, id, body, existing,
}: IModifyTransaction & { existing: IGetTransactionDB }) => {
  const { data: pair, error: pairError } = await fetchPairedTransactions({ existing, supabase });

  if (pairError) throw new Error(pairError.message);

  const toTx = pair.find((t) => t.id !== id);

  if (!toTx) throw new Error('Paired transaction not found');

  const { error: err1 } = await modifyTransaction({
    body: {
      ...body,
      amount: -Math.abs(body.amount),
      transfer_to_account_id: body.transfer_to_account_id,
    },
    id,
    supabase,
  });

  if (err1) throw new Error(err1.message);

  const { error: err2 } = await modifyTransaction({
    body: {
      ...body,
      amount: Math.abs(body.amount),
      account_id: body.transfer_to_account_id!,
      transfer_to_account_id: body.account_id,
    },
    id: toTx.id,
    supabase,
  });

  if (err2) throw new Error(err2.message);

  return { from: body, to: toTx };
};

// main handler
export const updateTransaction = async (c: Context) => {
  const supabase = c.get('supabase');
  const { id } = c.req.param();
  const bodyRequest = await c.req.json() as ITransactionPUTBR;

  if (!id) return c.json({ error: 'Transaction id is required' }, 400);

  const body = toTransactionPUTDB(bodyRequest);

  const { data: existing, error: fetchError } = await fetchExistingTransaction({ id, supabase });

  if (fetchError) return c.json({ error: fetchError.message }, 400);

  const { isTransfer, wasTransfer } = getTransactionTypeChange({
    existingType: existing.type, incomingType: body.type,
  });

  try {
    if (!wasTransfer && isTransfer) {
      return c.json(await updateRegularToTransfer({ supabase, id, body }), 200);
    }

    if (wasTransfer && !isTransfer) {
      return c.json(await updateTransferToRegular({
        supabase, id, body, existing,
      }), 200);
    }

    if (wasTransfer && isTransfer) {
      return c.json(await updateTransferTransaction({
        supabase, id, body, existing,
      }), 200);
    }

    const { data, error } = await modifyTransaction({ body, id, supabase });

    if (error) throw new Error(error.message);
    return c.json(data, 200);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
};
