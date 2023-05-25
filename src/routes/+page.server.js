import { getPosts, getBio } from '$lib/api';

export async function load({ locals }) {
  const currentUser = locals.user;
  const posts = await getPosts(currentUser);
  const bio = await getBio();

  return {
    currentUser,
    posts,
    bio
  };
}
