import { getBio } from '$lib/api';

export async function load({ locals }) {
  const currentUser = locals.currentUser;
  const bio = await getBio();
  return {
    currentUser,
    bio
  };
}
