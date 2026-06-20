import { TransactionTypes, TTransactionAccount, TTransactionBase } from './common';

export type TTransactionCategoryDB = {
  id: string
  icon: string
  name: string
  color: string
  parent_id: string | null
};

export interface IGetTransactionDB extends TTransactionBase {
  account_id: string
  category_id: string
  is_recurring: boolean
  created_at: string
  transfer_to_account_id: string | null
  transfer_pair_id: string | null
  account: TTransactionAccount
  to_account: TTransactionAccount | null
  category: TTransactionCategoryDB
}

export interface ITransactionPOSTDBPayload {
  account_id: string
  amount: number
  category_id: string
  date: string
  note: string
  tags: string[]
  transfer_pair_id: string | null
  transfer_to_account_id?: string | null
  type: TransactionTypes
}

export type ITransactionPUTDBPayload = ITransactionPOSTDBPayload;

export interface ITransactionDBResponse extends ITransactionPOSTDBPayload {
  id: string
  created_at: string
}
