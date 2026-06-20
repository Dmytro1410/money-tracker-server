import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MiddlewareHandler } from 'hono';

type Env = {
  Variables: {
    supabase: SupabaseClient
  }
  Bindings: {
    SUPABASE_URL: string
    SUPABASE_ANON_KEY: string
  }
};

export const supabaseMiddleware = (): MiddlewareHandler<Env> => async (c, next) => {
  const authHeader = c.req.header('Authorization');

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: authHeader || '',
        },
      },
    },
  );

  c.set('supabase', supabase);
  await next();
};
