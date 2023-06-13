import { getPostBySlug, getBio } from '$lib/api';

export async function load({ params, locals, url }) {
  const currentUser = locals.user;
  const secret = url.searchParams.get('secret');
  const data = await getPostBySlug(params.slug, secret, currentUser);
  const bio = await getBio();
  return {
    ...data,
    currentUser,
    bio
  };
}
