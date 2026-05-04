import { SupabaseClient } from '@supabase/supabase-js';

export const attemptLogin = (supabase: SupabaseClient, body: {
  email: string;
  password: string
}) => supabase.auth.signInWithPassword(body);

export const attemptLogout = (supabase: SupabaseClient) => supabase.auth.signOut();
