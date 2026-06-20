import { Context } from 'hono';
import { fetchAllCategories } from '../services';
import { ICategoryDBResponse } from '../../../types/categories/DBModels';

export const getAllCategories = async (c: Context) => {
  const supabase = c.get('supabase');
  const { data, error } = await fetchAllCategories({ supabase });
  const categories = data as ICategoryDBResponse[];

  if (error) {
    console.error('Supabase Error:getAllCategories', error);
    return c.json({ error: error.message }, 400);
  }

  if (categories) {
    const res = {
      all: categories,
      parents: categories.filter((cat) => !cat.parent_id),
      children: categories.filter((cat) => cat.parent_id),
    };

    return c.json(res);
  }

  return c.json(data);
};
