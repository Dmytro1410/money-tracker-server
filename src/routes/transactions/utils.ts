// GET

import {
  IGetTransactionDB,
  ITransactionDBResponse,
  ITransactionPOSTDBPayload,
  ITransactionPUTDBPayload,
} from '../../types/transactions/DBModels';
import { IGetTransactionDTO, ITransactionPOSTDTO } from '../../types/transactions/DTOModels';
import { ITransactionPOSTBR, ITransactionPUTBR } from '../../types/transactions/BRModels';
import { TransactionTypes } from '../../types/transactions/common';

export const toTransactionGetDTO = (payload: IGetTransactionDB): IGetTransactionDTO => {
  /* eslint-disable @typescript-eslint/naming-convention */
  const {
    account,
    account_id,
    amount,
    category,
    category_id,
    created_at,
    date,
    id,
    is_recurring,
    note,
    tags,
    to_account,
    transfer_pair_id,
    transfer_to_account_id,
    type,
    // recur_end_date,
    // recur_rule,
  } = payload;

  const parsedCategory = {
    id: category.id,
    icon: category.icon,
    name: category.name,
    color: category.color,
    parentId: category.parent_id,
  };

  return {
    id,
    account,
    accountId: account_id,
    amount,
    date,
    note,
    tags,
    type,
    toAccount: to_account,
    category: parsedCategory,
    categoryId: category_id,
    createdAt: created_at,
    isRecurring: is_recurring,
    transferToAccountId: transfer_to_account_id,
    transferPairId: transfer_pair_id,
    // recurEndDate: recur_end_date,
    // recurRule: recur_rule,
  };
};

// POST

export const toTransactionPOSTDB = (payload: ITransactionPOSTBR): ITransactionPOSTDBPayload => {
  const {
    accountId,
    amount,
    categoryId,
    date,
    note,
    tags,
    transferToAccountId,
    type,
  } = payload;
  return {
    amount,
    date,
    note,
    tags,
    type,
    account_id: accountId,
    category_id: categoryId,
    transfer_pair_id: null,
    transfer_to_account_id: transferToAccountId,
  };
};

export const toTransactionPOSTDTO = (payload: ITransactionDBResponse): ITransactionPOSTDTO => {
  const {
    account_id,
    amount,
    category_id,
    created_at,
    date,
    id,
    note,
    tags,
    transfer_pair_id,
    transfer_to_account_id,
    type,
  } = payload;
  return {
    amount,
    date,
    id,
    note,
    tags,
    type,
    accountId: account_id,
    categoryId: category_id,
    createdAt: created_at,
    transferPairId: transfer_pair_id,
    transferToAccountId: transfer_to_account_id,
  };
};

// PUT

export const toTransactionPUTDB = (payload: ITransactionPUTBR): ITransactionPUTDBPayload => {
  const {
    accountId,
    amount,
    categoryId,
    date,
    note,
    tags,
    transferToAccountId,
    type,
  } = payload;
  return {
    amount,
    date,
    note,
    tags,
    type,
    account_id: accountId,
    category_id: categoryId,
    transfer_pair_id: null,
    transfer_to_account_id: transferToAccountId,
  };
};

// helpers

export const getTransactionTypeChange = ({
  existingType, incomingType,
}: {
  existingType: TransactionTypes;
  incomingType: TransactionTypes
}) => ({
  wasTransfer: existingType === TransactionTypes.TRANSFER,
  isTransfer: incomingType === TransactionTypes.TRANSFER,
});
