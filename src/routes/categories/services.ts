import { SupabaseClient } from '@supabase/supabase-js';

export const fetchAllCategories = ({
  supabase,
}: { supabase: SupabaseClient, }) => supabase
  .from('categories')
  .select('*')
  .order('name');
