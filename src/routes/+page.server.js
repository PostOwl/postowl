import { getPosts } from '$lib/api';

export async function load({ locals }) {
  const posts = await getPosts(locals.currentUser);

  return {
    posts
  };
}
