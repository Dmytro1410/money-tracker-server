import { Context } from 'hono';
import { fetchProfile } from '../services/profile';

export const getProfile = async (c: Context) => {
  const supabase = c.get('supabase');
  const body = await c.req.json();
  const { userId } = body;

  const { data, error } = await fetchProfile(supabase, userId);

  if (error) {
    console.error('Supabase Error (getProfile):', error);
    return c.json({ error: error.message }, 400);
  }

  if (data) {
    const res = {
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
      currency: data.currency,
      email: data.email,
      fullName: data.full_name,
      id: data.id,
      locale: data.locale,
    };

    return c.json(res);
  }

  return c.json(data);
};
