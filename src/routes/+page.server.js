import { getPosts } from '$lib/api';

export async function load({ locals, url }) {
  const q = url.searchParams.get('q') || '';
  const posts = await getPosts(locals.currentUser, q);

  return {
    posts,
    searchQuery: q
  };
}
