import { getPosts, getPage } from '$lib/api';

export async function load({ locals }) {
  const currentUser = locals.user;
  const posts = await getPosts(currentUser);
  const page = await getPage('bio');

  return {
    currentUser,
    posts,
    page
  };
}
