import { getPosts, getPage } from '$lib/api';

export async function load({ locals }) {
  const currentUser = locals.user;
  const posts = await getPosts(currentUser);
  // const projects = await getPosts('project');
  const page = await getPage('home');

  return {
    currentUser,
    posts,
    page
  };
}
