import { TTransactionAccount, TTransactionBase } from './common';
import { ITransactionDBResponse, TTransactionCategoryDB } from './DBModels';

export type TTransactionCategoryDTO = Omit<TTransactionCategoryDB, 'parent_id'> & {
  parentId: string | null
};

export interface IGetTransactionDTO extends TTransactionBase {
  accountId: string
  categoryId: string
  isRecurring: boolean
  createdAt: string
  transferToAccountId: string | null
  transferPairId: string | null
  account: TTransactionAccount
  toAccount: TTransactionAccount | null
  category: TTransactionCategoryDTO
}

export type ITransactionPOSTDTO = Omit<ITransactionDBResponse,
'account_id' | 'category_id' | 'transfer_pair_id' | 'transfer_to_account_id' | 'created_at'
> & {
  accountId: string
  createdAt: string
  categoryId: string
  transferPairId: string | null
  transferToAccountId?: string | null
};
