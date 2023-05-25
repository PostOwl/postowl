import { getPostBySlug, getBio } from '$lib/api';

export async function load({ params, locals }) {
  const currentUser = locals.user;
  const data = await getPostBySlug(params.slug);
  const bio = await getBio();
  return {
    ...data,
    currentUser,
    bio
  };
}
