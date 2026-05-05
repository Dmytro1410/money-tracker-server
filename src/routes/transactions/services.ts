import { SupabaseClient } from '@supabase/supabase-js';

export const fetchTransactions = async (
  supabase: SupabaseClient,
  from: string,
  to: string,
) => supabase
  .from('transactions')
  .select(`
      *,
      account:accounts!transactions_account_id_fkey(id,name,currency,color),
      to_account:accounts!transactions_transfer_to_account_id_fkey(id,name,currency,color),
      category:categories(id,name,icon,color,parent_id)
    `)
  .gte('date', from)
  .lte('date', to)
  .order('date', { ascending: false });
