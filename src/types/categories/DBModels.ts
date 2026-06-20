import { TransactionTypes } from '../transactions/common';

export interface ICategoryDBResponse {
  id: string,
  user_id: string
  name: string
  icon: string
  color: string
  type: TransactionTypes,
  parent_id: string | null,
  is_system: boolean,
  created_at: string
}
