import { SupabaseClient } from '@supabase/supabase-js';
import { IGetTransactionDB, ITransactionPOSTDBPayload, ITransactionPUTDBPayload } from './DBModels';

export interface IBaseServiceParams {
  supabase: SupabaseClient
}

export interface IFetchTransactions extends IBaseServiceParams {
  from: string
  to: string
}

export interface IFetchExistingTransaction extends IBaseServiceParams {
  id: string
}

export interface IFetchPairedTransaction extends IBaseServiceParams {
  existing: IGetTransactionDB
}

export interface IPostTransaction extends IBaseServiceParams {
  body: ITransactionPOSTDBPayload
  selector?: string
}

export interface IModifyTransaction extends IBaseServiceParams {
  id: string
  body: ITransactionPUTDBPayload
}

export interface IRemoveByIdTransaction extends IBaseServiceParams {
  id: string
}

export interface IRemoveByPairIdTransaction extends IBaseServiceParams {
  transferPairId: string
  excludeId?: string
}
