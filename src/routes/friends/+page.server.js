import { getFriends, getBio } from '$lib/api';

export async function load({ locals }) {
  const currentUser = locals.user;
  const friends = await getFriends(currentUser);
  const bio = await getBio();
  return {
    currentUser,
    friends,
    bio
  };
}
