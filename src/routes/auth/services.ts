import { SupabaseClient } from '@supabase/supabase-js';

export const loginUser = (supabase: SupabaseClient, body: {
  email: string;
  password: string
}) => supabase.auth.signInWithPassword(body);

export const logoutUser = (supabase: SupabaseClient) => supabase.auth.signOut();
