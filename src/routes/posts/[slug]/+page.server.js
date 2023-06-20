import { getPostBySlug } from '$lib/api';

export async function load({ params, locals, url }) {
  const secret = url.searchParams.get('secret');
  const data = await getPostBySlug(params.slug, secret, locals.currentUser);
  return {
    ...data
  };
}
