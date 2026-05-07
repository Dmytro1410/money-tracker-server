export enum TransactionTypes {
  TRANSFER = 'transfer',
  EXPENSE = 'expense',
  INCOME = 'income',
}

export type TTransactionAccount = {
  id: string
  name: string
  color: string
  currency: string
};

export type TTransactionBase = {
  id: string
  amount: number
  type: TransactionTypes
  date: string
  note: string
  tags: string[]
};
