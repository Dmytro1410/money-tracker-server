import { Context } from 'hono';
import { attemptLogin, attemptLogout } from '../services/auth';

export const postLogin = async (c: Context) => {
  const supabase = c.get('supabase');
  const body = await c.req.json();
  const { data, error } = await attemptLogin(supabase, body);

  if (error) {
    console.error('Supabase Error (postLogin):', error);
    return c.json({ error: error.message }, 400);
  }

  const res = {
    user: {
      id: data.user?.id,
    },
    session: {
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
    },
  };

  return c.json(res);
};

export const getLogout = async (c: Context) => {
  const supabase = c.get('supabase');
  const { error } = await attemptLogout(supabase);

  if (error) {
    console.error('Supabase Error (getLogout):', error);
    return c.json({ error: error.message }, 400);
  }

  return c.json({ success: true });
};
