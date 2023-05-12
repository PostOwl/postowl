import { getPostBySlug } from '$lib/api';

export async function load({ params, locals }) {
  const currentUser = locals.user;
  const data = await getPostBySlug(params.slug);
  return {
    ...data,
    currentUser
  };
}
