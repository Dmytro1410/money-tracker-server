import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

interface ProfileResponse {
  id: string,
  email: string
  full_name: string | null,
  avatar_url: string | null,
  currency: string,
  locale: string,
  created_at: string
}

export const fetchProfile = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<PostgrestSingleResponse<ProfileResponse | null>> => supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .maybeSingle();
