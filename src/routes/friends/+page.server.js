import { getFriends } from '$lib/api';

export async function load({ locals }) {
  const currentUser = locals.user;
  const friends = await getFriends(currentUser);

  return {
    currentUser,
    friends
  };
}
