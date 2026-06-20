import { TransactionTypes } from './common';

export interface ITransactionPOSTBR {
  accountId: string
  amount: number
  categoryId: string
  date: string
  note: string
  tags: string[]
  transferToAccountId?: string | null
  type: TransactionTypes
}

export interface ITransactionPUTBR extends ITransactionPOSTBR {
  id: string
}
