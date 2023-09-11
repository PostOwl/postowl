import { getFriends } from '$lib/api';

export async function load({ locals }) {
  const friends = await getFriends(locals.currentUser);
  return {
    friends,
    ...locals
  };
}
