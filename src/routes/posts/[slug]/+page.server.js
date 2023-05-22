import { getPostBySlug, getPage } from '$lib/api';

export async function load({ params, locals }) {
  const currentUser = locals.user;
  const data = await getPostBySlug(params.slug);
  const page = await getPage('bio');
  return {
    ...data,
    page,
    currentUser
  };
}
